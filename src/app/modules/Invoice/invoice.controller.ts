import { Request, Response } from 'express';
import { InvoiceService } from './invoice.service';
import prisma from '../../../shared/prisma';
import { UserService } from '../User/user.service';


const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId; 
          
          const organation = await UserService.getMyProfile(userId);

          const user = organation.organizationId


    // 1. Get uploaded file URLs from req.files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const companyLogoUrl = files?.companyLogo?.[0]?.path;
    const signatureUrl = files?.signature?.[0]?.path;   

    // 2. Prepare data (Parse items if sent as string from FormData)
    const data = { ...req.body };
    if (typeof data.items === 'string') {
      data.items = JSON.parse(data.items);
    }
    
    // 3. Attach file URLs to the payload
    const payload = {
      ...data,
      companyLogo: companyLogoUrl,
      signature: signatureUrl,
    };

    const result = await InvoiceService.createInvoice(user, payload);

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

const getStatement = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract organizationId and date filters from query params
    const { organizationId, startDate, endDate } = req.query;

    const result = await InvoiceService.getInvoiceStatement(
      organizationId as string, 
      { startDate, endDate } // Pass as an object to match your service
    );

    res.status(200).json({
      success: true,
      message: "Invoice statement fetched successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

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
  updateInvoice,
  getStatement
};