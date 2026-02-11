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
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const invoice_utils_1 = require("../Invoice/invoice.utils");
// পেমেন্ট প্রসেস করার ফাংশন
const processPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, planName, userName, clientId, organizationId } = req.body;
        const payment = yield payment_service_1.PaymentService.createPaymentIntent({ amount, currency: 'usd', clientId, organizationId });
        const invoiceData = { id: payment.transactionId, amount, planName, userName };
        const filePath = `./uploads/invoices/inv-${payment.transactionId}.pdf`;
        yield invoice_utils_1.InvoiceUtils.generateInvoicePDF(invoiceData, filePath);
        res.status(200).json({
            success: true,
            data: {
                clientSecret: payment.clientSecret,
                transactionId: payment.transactionId
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ইনভয়েস ডাউনলোড করার ফাংশন (যেটি মিসিং ছিল)
const downloadInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transactionId } = req.params;
        const filePath = path_1.default.join(process.cwd(), 'uploads/invoices', `inv-${transactionId}.pdf`);
        if (fs_1.default.existsSync(filePath)) {
            res.download(filePath);
        }
        else {
            res.status(404).json({
                success: false,
                message: "Invoice file not found on server"
            });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// স্ট্রাইপ ওয়েব হুক হ্যান্ডলার
const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // এখানে আপনার ওয়েব হুক লজিক থাকবে
    res.status(200).send({ received: true });
});
// সবগুলো ফাংশন একসাথে এক্সপোর্ট করুন
exports.PaymentController = {
    processPayment,
    downloadInvoice,
    handleWebhook
};
