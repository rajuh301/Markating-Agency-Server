"use strict";
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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, companyName } = data;
    // পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = yield bcrypt_1.default.hash(password, 12);
    // Transaction: অর্গানাইজেশন এবং ইউজার একসাথে তৈরি হবে
    return yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const newOrg = yield tx.organization.create({
            data: {
                name: companyName,
                slug: companyName.toLowerCase().replace(/ /g, '-'),
            },
        });
        const newUser = yield tx.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                role: client_1.UserRole.OWNER, // প্রথম ইউজারকে মালিক বানানো হচ্ছে
                organizationId: newOrg.id,
            },
            include: {
                organization: true,
            },
        });
        return newUser;
    }));
});
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.findUnique({
        where: { email },
        include: { organization: true },
    });
});
const getAllUsers = (organizationId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.findMany({
        where: {
            organizationId: organizationId // নির্দিষ্ট অর্গানাইজেশনের ইউজারদের জন্য
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            phoneNumber: true,
            avatarUrl: true,
            createdAt: true,
            organization: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
    return result;
});
const inviteUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // চেক করা ইউজার আগে থেকে আছে কিনা
    const isExist = yield prisma.user.findUnique({
        where: { email: payload.email }
    });
    if (isExist) {
        throw new Error("User with this email already exists!");
    }
    const result = yield prisma.user.create({
        data: {
            fullName: payload.fullName,
            email: payload.email,
            role: payload.role,
            organizationId: payload.organizationId,
            // পাসওয়ার্ড ছাড়া তৈরি হচ্ছে (social login বা পরে সেট করার জন্য)
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            organizationId: true
        }
    });
    return result;
});
const setPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // ১. চেক করা ইউজার আছে কি না
    const user = yield prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new Error("User not found!");
    }
    // ২. পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = yield bcrypt_1.default.hash(password, 12);
    // ৩. পাসওয়ার্ড আপডেট করা
    const result = yield prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword
        },
        select: {
            id: true,
            email: true,
            role: true
        }
    });
    return result;
});
const getMyProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            avatarUrl: true,
            organizationId: true,
            organization: {
                select: {
                    name: true,
                    slug: true,
                    logoUrl: true
                }
            }
        }
    });
    if (!result) {
        throw new Error("User not found!");
    }
    return result;
});
exports.UserService = {
    createUser,
    findUserByEmail,
    getAllUsers,
    inviteUser,
    setPassword,
    getMyProfile
};
