"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleWares/auth"));
const user_1 = require("../enums/user");
const client_controller_1 = require("./client.controller");
const router = express_1.default.Router();
router.post('/create-client', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN), client_controller_1.ClientController.createClient);
exports.ClientRoutes = router;
