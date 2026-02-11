import express from 'express';
import auth from '../../middleWares/auth';
import { ENUM_USER_ROLE } from '../enums/user';
import { ExpenseController } from './expense.controller';

const router = express.Router();

// নতুন খরচ অ্যাড করা
router.post(
    '/create-expense',
    auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
    ExpenseController.createExpense
);

// নির্দিষ্ট অর্গানাইজেশনের সব খরচ দেখা
router.get(
    '/',
    auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MEMBER),
    ExpenseController.getAllExpenses
);

router.post(
    '/bulk-import',
    auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
    ExpenseController.bulkCreateExpenses
);

export const ExpenseRoutes = router;