"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const stats_controller_1 = require("./stats.controller");
const auth_1 = __importDefault(require("../../middleWares/auth"));
const user_1 = require("../enums/user");
const router = express_1.default.Router();
router.get('/summary', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN), stats_controller_1.StatsController.getSummary);
exports.StatsRoutes = router;
