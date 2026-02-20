import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createInvoice = async (payload: any, organizationId: string) => {
  const { 
    items, 
    taxRate, 
    amountPaid, 
    issueDate, 
    dueDate, 
    ...invoiceData 
  } = payload;

  return await prisma.$transaction(async (tx) => {
    // ১. অটো-ইনভয়েস নম্বর জেনারেশন লজিক (Yearly Sequential)
    const currentYear = new Date().getFullYear();
    const lastInvoice = await tx.invoice.findFirst({
      where: {
        organizationId,
        invoiceNumber: { startsWith: `INV-${currentYear}` },
      },
      orderBy: { createdAt: 'desc' },
    });

    let newNumber: string;
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
      const nextSequence = (lastSequence + 1).toString().padStart(3, '0');
      newNumber = `INV-${currentYear}-${nextSequence}`;
    } else {
      newNumber = `INV-${currentYear}-001`;
    }

    // ২. সাব-টোটাল ক্যালকুলেশন (Figma: Item Row calculation)
    const subTotal = items.reduce(
      (acc: number, item: any) => acc + item.quantity * Number(item.rate),
      0
    );

    // ৩. ট্যাক্স এবং টোটাল অ্যামাউন্ট ক্যালকুলেশন
    const totalTax = (subTotal * (Number(taxRate) || 0)) / 100;
    const totalAmount = subTotal + totalTax;

    // ৪. ইনভয়েস এবং আইটেম একসাথে ডাটাবেজে সেভ করা
    const result = await tx.invoice.create({
      data: {
        ...invoiceData,
        invoiceNumber: newNumber,
        organizationId,
        subTotal,
        totalAmount,
        taxRate: Number(taxRate) || 0,
        amountPaid: Number(amountPaid) || 0,
        
        // Prisma ISO Date format fix
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(),

        // Relation: Invoice Items
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

export const InvoiceService = {
  createInvoice,
};