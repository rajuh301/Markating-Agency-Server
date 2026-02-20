import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createQuotation = async (payload: any, organizationId: string) => {
  const { 
    items, 
    taxRate, 
    quotationDate, 
    dueDate, 
    ...quotationData 
  } = payload;

  return await prisma.$transaction(async (tx) => {
    // ১. অটো-কোটেশন নম্বর জেনারেশন (QT-Year-Number)
    const currentYear = new Date().getFullYear();
    const lastQuotation = await tx.quotation.findFirst({
      where: {
        organizationId,
        quotationNumber: { startsWith: `QT-${currentYear}` },
      },
      orderBy: { createdAt: 'desc' },
    });

    let newNumber: string;
    if (lastQuotation) {
      const lastSequence = parseInt(lastQuotation.quotationNumber.split('-')[2]);
      const nextSequence = (lastSequence + 1).toString().padStart(3, '0');
      newNumber = `QT-${currentYear}-${nextSequence}`;
    } else {
      newNumber = `QT-${currentYear}-001`;
    }

    // ২. সাব-টোটাল ক্যালকুলেশন
    const subTotal = items.reduce(
      (acc: number, item: any) => acc + item.quantity * Number(item.rate),
      0
    );

    // ৩. ট্যাক্স এবং টোটাল অ্যামাউন্ট ক্যালকুলেশন
    const totalTax = (subTotal * (Number(taxRate) || 0)) / 100;
    const totalAmount = subTotal + totalTax;

    // ৪. কোটেশন তৈরি
    const result = await tx.quotation.create({
      data: {
        ...quotationData,
        quotationNumber: newNumber,
        organizationId,
        subTotal,
        totalAmount,
        taxRate: Number(taxRate) || 0,
        
        // Date Fix
        quotationDate: quotationDate ? new Date(quotationDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(),

        // Relation: Quotation Items
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: Number(item.quantity),
            rate: Number(item.rate),
            amount: Number(item.quantity) * Number(item.rate),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return result;
  });
};

export const QuotationService = {
  createQuotation,
};