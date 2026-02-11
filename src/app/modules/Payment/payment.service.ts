import Stripe from 'stripe';
import config from '../../../config';
import prisma from '../../../shared/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  
});

// ইন্টারফেসটি ফাংশনের উপরে বা ভেতরে ডিফাইন করুন
interface IPaymentPayload {
  amount: number;
  currency: string;
  clientId: string;      // এটি যোগ করুন
  organizationId: string; // এটি যোগ করুন
}

const createPaymentIntent = async (payload: IPaymentPayload) => {
  // ১. Stripe Payment Intent তৈরি
  const paymentIntent = await stripe.paymentIntents.create({
    amount: payload.amount * 100,
    currency: payload.currency,
    payment_method_types: ['card'],
  });

  // ২. এখন টাইপস্ক্রিপ্ট আর এরর দিবে না
  const invoiceData = await prisma.invoice.create({
    data: {
      invoiceNumber: `INV-${Date.now()}`,
      amount: payload.amount,
      status: 'PAID', 
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      clientId: payload.clientId,        // Fixed!
      organizationId: payload.organizationId, // Fixed!
    }
  });

  return {
    clientSecret: paymentIntent.client_secret,
    transactionId: paymentIntent.id,
    invoice: invoiceData
  };
};

export const PaymentService = {
  createPaymentIntent,
};