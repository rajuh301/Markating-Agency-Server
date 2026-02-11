"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middleWares/auth"));
const user_1 = require("../enums/user");
const router = express_1.default.Router();
router.post("/refresh-token", auth_controller_1.AuthController.refreshToken);
router.patch('/change-password', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.MEMBER), auth_controller_1.AuthController.changePassword);
// গুগল এবং অ্যাপল লগইন (একই এন্ডপয়েন্ট দিয়ে হ্যান্ডেল করা হচ্ছে)
router.post('/social-login', auth_controller_1.AuthController.socialLogin);
router.post("/forgot-password", auth_controller_1.AuthController.forgotPassword);
router.post("/reset-password", auth_controller_1.AuthController.resetPassword);
exports.AuthRouter = router;
