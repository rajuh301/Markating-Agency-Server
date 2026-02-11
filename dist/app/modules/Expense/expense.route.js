"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleWares/auth"));
const user_1 = require("../enums/user");
const expense_controller_1 = require("./expense.controller");
const router = express_1.default.Router();
// নতুন খরচ অ্যাড করা
router.post('/create-expense', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN), expense_controller_1.ExpenseController.createExpense);
// নির্দিষ্ট অর্গানাইজেশনের সব খরচ দেখা
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.MEMBER), expense_controller_1.ExpenseController.getAllExpenses);
router.post('/bulk-import', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN), expense_controller_1.ExpenseController.bulkCreateExpenses);
exports.ExpenseRoutes = router;
