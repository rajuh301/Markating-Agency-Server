"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const jwtHelpers_1 = require("../../../helpars/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const emailSender_1 = __importDefault(require("./emailSender"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const google_auth_library_1 = require("google-auth-library");
const apple_signin_auth_1 = __importDefault(require("apple-signin-auth"));
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_token_secret);
    }
    catch (err) {
        throw new Error("You are not authorized!");
    }
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
        }
    });
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return {
        accessToken,
    };
});
const changePassword = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    // ১. ইউজারকে খুঁজে বের করা
    const user = yield prisma_1.default.user.findUnique({
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
    const isPasswordMatch = yield bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
        throw new Error("Old password is incorrect!");
    }
    // ৪. নতুন পাসওয়ার্ড হ্যাশ করা
    const hashedNewPassword = yield bcrypt.hash(newPassword, 12);
    // ৫. ডাটাবেজে আপডেট করা
    yield prisma_1.default.user.update({
        where: { id: userId },
        data: {
            password: hashedNewPassword,
        },
    });
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        }
    });
    const resetPasswordToken = jwtHelpers_1.jwtHelpers.generateToken({ email: userData.email, role: userData.role }, config_1.default.jwt.reset_pass_secret, config_1.default.jwt.reset_pass_token_expires_in);
    const resetPassLink = config_1.default.reset_pass_link + `?userId=${userData.id}&token=${resetPasswordToken}`;
    yield (0, emailSender_1.default)(userData.email, `
        <div><
            <p>Dear User,</p>
            <p>Your password reset link 
            <a href=${resetPassLink}>
                <button>Reset Password</button>
            </a>
            </p>
        </div>
        `);
    //http://localhost:3000/reset-pass?email=rajuh301@gmail.com&token=jkbkjgkjgbkjrgbjkrgb
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id
        }
    });
    const isValidToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.reset_pass_secret);
    //Hash password
    //Update into database
    if (!isValidToken) {
        throw new ApiError_1.default(403, "Forbidden");
    }
    ;
    const hashedPassword = yield bcrypt.hash(payload.password, 12);
    yield prisma_1.default.user.update({
        where: {
            id: userData.id
        },
        data: {
            password: hashedPassword,
        }
    });
});
const client = new google_auth_library_1.OAuth2Client(config_1.default.googleLogin.client_id);
const socialLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let email;
    let fullName;
    let socialId;
    if (payload.platform === 'google') {
        // গুগল টোকেন ভেরিফিকেশন
        const ticket = yield client.verifyIdToken({
            idToken: payload.token,
            audience: config_1.default.googleLogin.client_id,
        });
        const googlePayload = ticket.getPayload();
        if (!googlePayload || !googlePayload.email) {
            throw new ApiError_1.default(400, "Invalid Google token");
        }
        email = googlePayload.email;
        fullName = googlePayload.name || "Google User";
        socialId = googlePayload.sub;
    }
    else {
        // অ্যাপল টোকেন ভেরিফিকেশন
        try {
            const applePayload = yield apple_signin_auth_1.default.verifyIdToken(payload.token, {
                audience: config_1.default.appleLogin.client_id,
            });
            email = applePayload.email;
            socialId = applePayload.sub;
            fullName = "Apple User"; // অ্যাপল প্রথমবার ছাড়া নাম পাঠায় না
        }
        catch (err) {
            throw new ApiError_1.default(400, "Invalid Apple token");
        }
    }
    // ডাটাবেজে ইউজার চেক করা বা তৈরি করা (Upsert Logic)
    let userData = yield prisma_1.default.user.findUnique({
        where: { email }
    });
    if (!userData) {
        // নতুন ইউজার এবং তার জন্য একটি ডিফল্ট অর্গানাইজেশন তৈরি
        userData = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const newOrg = yield tx.organization.create({
                data: {
                    name: `${fullName}'s Agency`,
                    slug: `${fullName.toLowerCase().replace(/ /g, '-')}-${Date.now()}`
                }
            });
            return yield tx.user.create({
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
        }));
    }
    // টোকেন জেনারেট করা (আপনার আগের loginUser ফাংশনের মতো)
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({ email: userData.email, role: userData.role }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({ email: userData.email, role: userData.role }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
        user: userData
    };
});
exports.AuthServices = {
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
    socialLogin
};
