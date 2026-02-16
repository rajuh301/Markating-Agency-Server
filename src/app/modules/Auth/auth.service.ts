import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from 'bcrypt'
import { Secret } from "jsonwebtoken"
import config from "../../../config";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiError";


import { OAuth2Client } from 'google-auth-library';
import appleSignin from 'apple-signin-auth';



const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret)

    } catch (err) {
        throw new Error("You are not authorized!")
    }


    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
        }
    });

    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    return {
        accessToken,
    };


};

const changePassword = async (
  userId: string, 
  payload: { oldPassword: string; newPassword: string }
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  // ১. ইউজারকে খুঁজে বের করা
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found!");
  }

  // ২. সোশ্যাল লগইন ইউজার কি না চেক করা (যাদের পাসওয়ার্ড নেই)
  if (!user.password) {
    throw new Error("This account doesn't have a password. Try social login.");
  }

  // ৩. পুরনো পাসওয়ার্ড চেক করা
  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordMatch) {
    throw new Error("Old password is incorrect!");
  }

  // ৪. নতুন পাসওয়ার্ড হ্যাশ করা
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  // ৫. ডাটাবেজে আপডেট করা
  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedNewPassword,
    },
  });
};

const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: { email: payload.email }
    });

    // ৬ ডিজিটের OTP তৈরি
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // ৩ মিনিটের জন্য মেয়াদ নির্ধারণ
    const expires = new Date(Date.now() + 3 * 60 * 1000); 

    // ডাটাবেজে OTP এবং Expiry আপডেট করা
    await prisma.user.update({
        where: { email: userData.email },
        data: {
            verificationCode: otp,
            codeExpiry: expires
        }
    });

    // ইমেইল পাঠানো
    await emailSender(
        userData.email,
        `
        <div style="font-family: Arial, sans-serif; text-align: center;">
            <h2>Verification Code</h2>
            <p>Your OTP for password reset is:</p>
            <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
            <p>This code will expire in 3 minutes.</p>
        </div>
        `
    );

    return null;
};

const resetPassword = async (payload: any) => {
    const { email, code, newPassword } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    });

    // ১. কোড ভেরিফিকেশন
    if (!user.verificationCode || user.verificationCode !== code) {
        throw new Error("Invalid verification code!");
    }

    // ২. মেয়াদ শেষ কি না চেক করা
    if (user.codeExpiry && new Date() > user.codeExpiry) {
        throw new Error("Verification code has expired!");
    }

    // ৩. নতুন পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // ৪. পাসওয়ার্ড আপডেট এবং OTP ক্লিয়ার করা
    await prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword,
            verificationCode: null,
            codeExpiry: null
        }
    });

    return null;
};


const client = new OAuth2Client(config.googleLogin.client_id);

const socialLogin = async (payload: { token: string, platform: 'google' | 'apple' }) => {
    let email: string;
    let fullName: string;
    let socialId: string;

    if (payload.platform === 'google') {
        // গুগল টোকেন ভেরিফিকেশন
        const ticket = await client.verifyIdToken({
            idToken: payload.token,
            audience: config.googleLogin.client_id,
        });
        const googlePayload = ticket.getPayload();
        if (!googlePayload || !googlePayload.email) {
            throw new ApiError(400, "Invalid Google token");
        }
        email = googlePayload.email;
        fullName = googlePayload.name || "Google User";
        socialId = googlePayload.sub;
    } else {
        // অ্যাপল টোকেন ভেরিফিকেশন
        try {
            const applePayload = await appleSignin.verifyIdToken(payload.token, {
                audience: config.appleLogin.client_id, 
            });
            email = applePayload.email!;
            socialId = applePayload.sub;
            fullName = "Apple User"; // অ্যাপল প্রথমবার ছাড়া নাম পাঠায় না
        } catch (err) {
            throw new ApiError(400, "Invalid Apple token");
        }
    }

    // ডাটাবেজে ইউজার চেক করা বা তৈরি করা (Upsert Logic)
    let userData = await prisma.user.findUnique({
        where: { email }
    });

    if (!userData) {
        // নতুন ইউজার এবং তার জন্য একটি ডিফল্ট অর্গানাইজেশন তৈরি
        userData = await prisma.$transaction(async (tx) => {
            const newOrg = await tx.organization.create({
                data: {
                    name: `${fullName}'s Agency`,
                    slug: `${fullName.toLowerCase().replace(/ /g, '-')}-${Date.now()}`
                }
            });

            return await tx.user.create({
                data: {
                    email,
                    fullName,
                    role: "OWNER", // ডিফল্ট রোল
                    organizationId: newOrg.id,
                    // পাসওয়ার্ড নাল থাকবে কারণ সে সোশ্যাল লগইন করেছে
                    googleId: payload.platform === 'google' ? socialId : null,
                    appleId: payload.platform === 'apple' ? socialId : null,
                }
            });
        });
    }

    // টোকেন জেনারেট করা (আপনার আগের loginUser ফাংশনের মতো)
    const accessToken = jwtHelpers.generateToken(
        { email: userData.email, role: userData.role },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken(
        { email: userData.email, role: userData.role },
        config.jwt.refresh_token_secret as Secret,
        config.jwt.refresh_token_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
        user: userData
    };
};



export const AuthServices = {
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
    socialLogin
}