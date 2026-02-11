import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middleWares/auth';
import { ENUM_USER_ROLE } from '../enums/user';

const router = express.Router();

// ১. পেমেন্ট ইনটেন্ট তৈরি করা (পেমেন্ট শুরু করার জন্য)
router.post(
    '/create-intent', 
    auth(ENUM_USER_ROLE.OWNER), // শুধুমাত্র ওনার পেমেন্ট করতে পারবেন
    PaymentController.processPayment
);

// ২. ইনভয়েস ডাউনলোড করার রাউট
router.get(
    '/invoice/:transactionId', 
    auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN), 
    PaymentController.downloadInvoice
);

// ৩. Stripe Webhook (এটি পাবলিক হতে হবে, স্ট্রাইপ সরাসরি এখানে ডাটা পাঠাবে)
// নোট: স্ট্রাইপ ওয়েব হুক রিকোয়েস্ট বডি 'raw' ফরম্যাটে চায়, তাই এটি বডির আগে রাখতে হয়
router.post(
    '/webhook', 
    express.raw({ type: 'application/json' }), 
    PaymentController.handleWebhook
);

export const PaymentRoutes = router;