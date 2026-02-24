import { NextFunction, Request, Response } from 'express';
import { QuotationService } from './quotation.service';
import { UserService } from '../User/user.service';

const createQuotation = async (req: Request, res: Response) => {
  try {
    // ১. লগইন করা ইউজারের আইডি নেওয়া
    const userId = (req as any).user.userId; 
    
    // ২. ইউজারের প্রোফাইল থেকে অর্গানাইজেশন ডাটা সংগ্রহ করা
    const organation = await UserService.getMyProfile(userId);

    // ৩. অর্গানাইজেশন আইডি বের করা (আপনার আগের ইনভয়েস লজিক অনুযায়ী)
    const organizationId = organation.organizationId;

    if (!organizationId) {
      throw new Error("Organization not found for this user!");
    }

    // ৪. ফাইল প্রসেস করা
    const files = req.files as any;
    
    // ৫. items ডাটা পার্স করা (FormData এর জন্য)
    const data = { ...req.body };
    if (typeof data.items === 'string') {
      data.items = JSON.parse(data.items);
    }

    // ৬. পে-লোড তৈরি করা
    const payload = {
      ...data,
      companyLogo: files?.companyLogo ? files.companyLogo[0].path : undefined,
      signature: files?.signature ? files.signature[0].path : undefined,
    };

    // ৭. সার্ভিসে ডাটা পাঠানো
    const result = await QuotationService.createQuotation(organizationId, payload);

    res.status(201).json({
      success: true,
      message: 'Quotation created successfully!',
      data: result,
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create quotation',
    });
  }
};


const getAllQuotations = async (req: Request, res: Response) => {
  const result = await QuotationService.getAllQuotations();
  res.status(200).json({ success: true, data: result });
};

const getSingleQuotation = async (req: Request, res: Response) => {
  const result = await QuotationService.getSingleQuotation(req.params.id);
  res.status(200).json({ success: true, data: result });
};

const updateQuotation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const result = await QuotationService.updateQuotation(id, payload);

    res.status(200).json({
      success: true,
      message: 'Quotation updated successfully!',
      data: result,
    });
  } catch (error: any) {
    // এটি সরাসরি রেসপন্স না পাঠিয়ে গ্লোবাল হ্যান্ডলারে পাঠাবে
    next(error); 
  }
};

export const QuotationController = {
  createQuotation,
  getAllQuotations,
  getSingleQuotation,
  updateQuotation,
};