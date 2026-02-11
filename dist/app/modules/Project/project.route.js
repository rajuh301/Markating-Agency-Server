"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleWares/auth"));
const user_1 = require("../enums/user");
const project_controller_1 = require("./project.controller");
const router = express_1.default.Router();
// নতুন প্রজেক্ট তৈরি করা
router.post('/create-project', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN), project_controller_1.ProjectController.createProject);
// সব প্রজেক্টের লিস্ট দেখা
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN), project_controller_1.ProjectController.getAllProjects);
exports.ProjectRoutes = router;
