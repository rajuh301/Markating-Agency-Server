import { Request, Response } from 'express';
import { InvoiceService } from './invoice.service';

const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    
    if (!user?.organizationId) {
      res.status(401).json({ 
        success: false, 
        message: "Organization ID missing. Please re-login." 
      });
      return; // এখানে শুধু return; ব্যবহার করুন, return res... নয়
    }

    const result = await InvoiceService.createInvoice(user.organizationId, req.body);

    res.status(201).json({
      success: true,
      message: "Invoice created successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// একইভাবে getAllInvoices ও চেক করুন
const getAllInvoices = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;
      const result = await InvoiceService.getAllInvoices(user.organizationId, req.query);
  
      res.status(200).json({
        success: true,
        meta: result.meta,
        data: result.data,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
};


const getSingleInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const result = await InvoiceService.getSingleInvoice(id, user.organizationId);

    res.status(200).json({
      success: true,
      message: "Invoice fetched successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const result = await InvoiceService.updateInvoice(id, user.organizationId, req.body);

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const InvoiceController = {
  createInvoice,
  getAllInvoices,
  getSingleInvoice,
  updateInvoice
};