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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserService.createUser(req.body);
        const { password } = result, userWithoutPassword = __rest(result, ["password"]);
        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: userWithoutPassword,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_service_1.UserService.findUserByEmail(email);
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            res.status(401).json({ message: "Invalid credentials" });
            return; // এখানে শুধু return দিন, res.json রিটার্ন করবেন না
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // যদি আপনি চান শুধু লগইন করা ইউজারের অর্গানাইজেশনের মেম্বারদের দেখাবে
        const organizationId = req.user.organizationId;
        const result = yield user_service_1.UserService.getAllUsers(organizationId);
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const inviteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserService.inviteUser(req.body);
        res.status(201).json({
            success: true,
            message: "User invited successfully",
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const setPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield user_service_1.UserService.setPassword(email, password);
        res.status(200).json({
            success: true,
            message: "Password set successfully! You can now login.",
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const getMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // টোকেন থেকে পাওয়া আইডি (auth middleware এটি সেট করে)
        const userId = req.user.userId;
        const result = yield user_service_1.UserService.getMyProfile(userId);
        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: result
        });
    }
    catch (error) {
        res.status(401).json({ success: false, message: "Unauthorized access" });
    }
});
exports.UserController = {
    register,
    login,
    getAllUsers,
    inviteUser,
    setPassword,
    getMyProfile
};
