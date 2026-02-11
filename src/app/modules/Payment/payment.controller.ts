import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import path from 'path';
import fs from 'fs';
import { InvoiceUtils } from '../Invoice/invoice.utils';

// পেমেন্ট প্রসেস করার ফাংশন
const processPayment = async (req: Request, res: Response) => {
    try {
        const { amount, planName, userName, clientId, organizationId } = req.body;
        const payment = await PaymentService.createPaymentIntent({ amount, currency: 'usd', clientId, organizationId });

        const invoiceData = { id: payment.transactionId, amount, planName, userName };
        const filePath = `./uploads/invoices/inv-${payment.transactionId}.pdf`;
        
        await InvoiceUtils.generateInvoicePDF(invoiceData, filePath);

        res.status(200).json({
            success: true,
            data: {
                clientSecret: payment.clientSecret,
                transactionId: payment.transactionId
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ইনভয়েস ডাউনলোড করার ফাংশন (যেটি মিসিং ছিল)
const downloadInvoice = async (req: Request, res: Response) => {
    try {
        const { transactionId } = req.params;
        const filePath = path.join(process.cwd(), 'uploads/invoices', `inv-${transactionId}.pdf`);

        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).json({
                success: false,
                message: "Invoice file not found on server"
            });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// স্ট্রাইপ ওয়েব হুক হ্যান্ডলার
const handleWebhook = async (req: Request, res: Response) => {
    // এখানে আপনার ওয়েব হুক লজিক থাকবে
    res.status(200).send({ received: true });
};

// সবগুলো ফাংশন একসাথে এক্সপোর্ট করুন
export const PaymentController = {
    processPayment,
    downloadInvoice,
    handleWebhook
};