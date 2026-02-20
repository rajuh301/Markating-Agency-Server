import { Request, Response } from 'express';
import { QuotationService } from './quotation.service';

const createQuotation = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user; // Auth মিডলওয়্যার থেকে আসা ডাটা
    const result = await QuotationService.createQuotation(req.body, user.organizationId);

    res.status(201).json({
      success: true,
      message: "Quotation created successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const QuotationController = {
  createQuotation,
};