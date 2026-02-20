import { Request, Response } from 'express';
import { InvoiceService } from './invoice.service';

const createInvoice = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user; // টোকেন থেকে আসা ইউজার ডাটা
        const result = await InvoiceService.createInvoice(req.body, user.organizationId);

        res.status(201).json({
            success: true,
            message: "Invoice created successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const InvoiceController = {
    createInvoice
};