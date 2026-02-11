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

        
        where: {
            email: payload.email,
        }
    })

    const resetPasswordToken = jwtHelpers.generateToken(
        { email: userData.email, role: userData.role },
        config.jwt.reset_pass_secret as Secret,
        config.jwt.reset_pass_token_expires_in as string
    )

    const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPasswordToken}`
    await emailSender(userData.email,
        `
        <div><
            <p>Dear User,</p>
            <p>Your password reset link 
            <a href=${resetPassLink}>
                <button>Reset Password</button>
            </a>
            </p>
        </div>
        `
    )

    //http://localhost:3000/reset-pass?email=rajuh301@gmail.com&token=jkbkjgkjgbkjrgbjkrgb
};


const resetPassword = async (token: string, payload: { id: string, password: string }) => {


    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id
        }
    });

    const isValidToken = jwtHelpers.verifyToken(token, config.jwt.reset_pass_secret as Secret);

    //Hash password
    //Update into database

    if (!isValidToken) {
        throw new ApiError(403, "Forbidden")
    };

    const hashedPassword: string = await bcrypt.hash(payload.password, 12);

    await prisma.user.update({
        where: {
            id: userData.id
        },
        data: {
            password: hashedPassword,
        }
    });
}


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