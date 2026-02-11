"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {});
const createPaymentIntent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // ১. Stripe Payment Intent তৈরি
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: payload.amount * 100,
        currency: payload.currency,
        payment_method_types: ['card'],
    });
    // ২. এখন টাইপস্ক্রিপ্ট আর এরর দিবে না
    const invoiceData = yield prisma_1.default.invoice.create({
        data: {
            invoiceNumber: `INV-${Date.now()}`,
            amount: payload.amount,
            status: 'PAID',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            clientId: payload.clientId, // Fixed!
            organizationId: payload.organizationId, // Fixed!
        }
    });
    return {
        clientSecret: paymentIntent.client_secret,
        transactionId: paymentIntent.id,
        invoice: invoiceData
    };
});
exports.PaymentService = {
    createPaymentIntent,
};
