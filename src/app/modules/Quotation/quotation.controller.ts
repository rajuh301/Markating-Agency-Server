import { Request, Response } from 'express';
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

export const QuotationController = {
  createQuotation,
};