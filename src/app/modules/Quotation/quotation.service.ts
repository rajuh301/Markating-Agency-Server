import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createQuotation = async (organizationId: string, payload: any) => {
  const { 
    items, 
    taxRate, 
    quotationDate, 
    dueDate, 
    note, 
    companyLogo, 
    signature, 
    themeColor,
    clientId, // Quotation-এর জন্য clientId সাধারণত প্রয়োজন হয়
    ...quotationData 
  } = payload;

  return await prisma.$transaction(async (tx) => {

    // ✅ Ensure items exists
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Items must be a non-empty array");
    }

    // 1️⃣ Quotation Number Generate (Prefix: QTN)
    const currentYear = new Date().getFullYear();
    const lastQuotation = await tx.quotation.findFirst({
      where: { 
        quotationNumber: { startsWith: `QTN-${currentYear}` },
        organizationId
      },
      orderBy: { createdAt: 'desc' },
    });

    let newNumber = `QTN-${currentYear}-001`;

    if (lastQuotation) {
      const parts = lastQuotation.quotationNumber.split('-');
      const lastSequence = parseInt(parts[2]);
      newNumber = `QTN-${currentYear}-${(lastSequence + 1)
        .toString()
        .padStart(3, '0')}`;
    }

    // 2️⃣ Calculation
    const subTotal = items.reduce(
      (acc: number, item: any) =>
        acc + Number(item.quantity) * Number(item.rate),
      0
    );

    const totalTax = (subTotal * (Number(taxRate) || 0)) / 100;
    const totalAmount = subTotal + totalTax;

    // 3️⃣ Create Quotation
    return await tx.quotation.create({
      data: {
        ...quotationData,
        organizationId, 
        clientId, // রিলেশনশিপ অনুযায়ী এটি গুরুত্বপূর্ণ
        quotationNumber: newNumber,
        themeColor,
        companyLogo,
        signature,
        subTotal,
        totalAmount,
        notes: note || null,
        taxRate: Number(taxRate) || 0,
        quotationDate: quotationDate ? new Date(quotationDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(),

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
        client: true // যাতে রেসপন্সে ক্লায়েন্টের ডিটেইলসও দেখা যায়
      },
    });
  });
};

export const QuotationService = {
  createQuotation,
};