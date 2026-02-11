"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middleWares/auth"));
const user_1 = require("../enums/user");
const router = express_1.default.Router();
// ১. পেমেন্ট ইনটেন্ট তৈরি করা (পেমেন্ট শুরু করার জন্য)
router.post('/create-intent', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER), // শুধুমাত্র ওনার পেমেন্ট করতে পারবেন
payment_controller_1.PaymentController.processPayment);
// ২. ইনভয়েস ডাউনলোড করার রাউট
router.get('/invoice/:transactionId', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN), payment_controller_1.PaymentController.downloadInvoice);
// ৩. Stripe Webhook (এটি পাবলিক হতে হবে, স্ট্রাইপ সরাসরি এখানে ডাটা পাঠাবে)
// নোট: স্ট্রাইপ ওয়েব হুক রিকোয়েস্ট বডি 'raw' ফরম্যাটে চায়, তাই এটি বডির আগে রাখতে হয়
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), payment_controller_1.PaymentController.handleWebhook);
exports.PaymentRoutes = router;
