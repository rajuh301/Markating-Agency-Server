"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = __importDefault(require("../../middleWares/validateRequest"));
const user_1 = require("../enums/user");
const auth_1 = __importDefault(require("../../middleWares/auth"));
const router = express_1.default.Router();
router.post('/register', (0, validateRequest_1.default)(user_validation_1.UserValidation.register), user_controller_1.UserController.register);
router.post('/login', (0, validateRequest_1.default)(user_validation_1.UserValidation.login), user_controller_1.UserController.login);
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.getAllUsers);
router.post('/invite-user', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.inviteUser);
router.patch('/set-password', 
// ইনভাইটেড ইউজারের টোকেন থাকলে auth middleware ব্যবহার করতে পারেন
user_controller_1.UserController.setPassword);
router.get('/me', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.MEMBER), user_controller_1.UserController.getMyProfile);
exports.UserRoutes = router;
