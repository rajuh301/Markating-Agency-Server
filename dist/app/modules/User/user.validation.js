"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
exports.UserValidation = {
    register: zod_1.z.object({
        body: zod_1.z.object({
            fullName: zod_1.z.string().min(3, "Full name is required"),
            email: zod_1.z.string().email("Invalid email address"),
            password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
            companyName: zod_1.z.string().min(2, "Company name is required"),
        }),
    }),
    login: zod_1.z.object({
        body: zod_1.z.object({
            email: zod_1.z.string().email("Invalid email address"),
            password: zod_1.z.string().min(1, "Password is required"),
        }),
    }),
};
