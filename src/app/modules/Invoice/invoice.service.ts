import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();


const createInvoice = async (organizationId: string, payload: any) => {
  const { 
    items, 
    taxRate, 
    amountPaid, 
    issueDate, 
    dueDate, 
    note, 
    companyLogo, 
    signature, 
    themeColor,
    ...invoiceData 
  } = payload;

  return await prisma.$transaction(async (tx) => {

    // ✅ Ensure items exists
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Items must be a non-empty array");
    }

    // 1️⃣ Invoice Number Generate
    const currentYear = new Date().getFullYear();
    const lastInvoice = await tx.invoice.findFirst({
      where: { 
        invoiceNumber: { startsWith: `INV-${currentYear}` },
        organizationId
      },
      orderBy: { createdAt: 'desc' },
    });

    let newNumber = `INV-${currentYear}-001`;

    if (lastInvoice) {
      const parts = lastInvoice.invoiceNumber.split('-');
      const lastSequence = parseInt(parts[2]);
      newNumber = `INV-${currentYear}-${(lastSequence + 1)
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

    // 3️⃣ Create Invoice
    return await tx.invoice.create({
      data: {
        ...invoiceData,
        organizationId, // ✅ attach organization
        invoiceNumber: newNumber,
        themeColor,
        companyLogo,
        signature,
        subTotal,
        totalAmount,
        notes: note || null,
        taxRate: Number(taxRate) || 0,
        amountPaid: Number(amountPaid) || 0,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
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
      include: { items: true },
    });
  });
};

const getAllInvoices = async (organizationId: string, query: any) => {
  const { searchTerm, status, page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereConditions: Prisma.InvoiceWhereInput = { organizationId };

  if (searchTerm) {
    whereConditions.OR = [
      { invoiceNumber: { contains: searchTerm as string, mode: 'insensitive' } },
      { client: { companyName: { contains: searchTerm as string, mode: 'insensitive' } } }
    ];
  }

  if (status) {
    whereConditions.status = status;
  }

  const [data, total] = await Promise.all([
    prisma.invoice.findMany({
      where: whereConditions,
      skip,
      take: Number(limit),
      include: { client: { select: { companyName: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.invoice.count({ where: whereConditions })
  ]);

  return {
    meta: { page: Number(page), limit: Number(limit), total, totalPage: Math.ceil(total / Number(limit)) },
    data
  };
};


const getSingleInvoice = async (id: string, organizationId: string) => {
  const result = await prisma.invoice.findUnique({
    where: {
      id,
      organizationId,
    },
    include: {
      items: true,
      client: true,
      project: {
        select: { name: true }
      }
    },
  });

  if (!result) {
    throw new Error("Invoice not found!");
  }

  return result;
};

const updateInvoice = async (id: string, organizationId: string, payload: any) => {
  const { items, taxRate, clientId, note, ...invoiceData } = payload;

  return await prisma.$transaction(async (tx) => {
    // ১. আগের ইনভয়েসটি আছে কি না চেক করা
    const isExist = await tx.invoice.findUnique({
      where: { id, organizationId }
    });

    if (!isExist) throw new Error("Invoice not found!");

    // ২. যদি নতুন items আসে তবে ক্যালকুলেশন আপডেট করা
    let updateData: any = { ...invoiceData };
    
    if (note) updateData.notes = note;
    if (clientId) updateData.client = { connect: { id: clientId } };

    if (items && items.length > 0) {
      const subTotal = items.reduce((acc: number, item: any) => acc + (Number(item.quantity) * Number(item.rate)), 0);
      const currentTaxRate = taxRate !== undefined ? taxRate : isExist.taxRate;
      const totalTax = (subTotal * Number(currentTaxRate)) / 100;
      
      updateData.subTotal = subTotal;
      updateData.totalAmount = subTotal + totalTax;
      updateData.taxRate = Number(currentTaxRate);

      // পুরানো আইটেম মুছে নতুন আইটেম সেট করা
      await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
      updateData.items = {
        create: items.map((item: any) => ({
          description: item.description,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
          amount: Number(item.quantity) * Number(item.rate),
        })),
      };
    }

    return await tx.invoice.update({
      where: { id },
      data: updateData,
      include: { items: true, client: true }
    });
  });
};

const getInvoiceStatement = async (organizationId: string, query: any) => {
  const { startDate, endDate } = query;

  const whereConditions: Prisma.InvoiceWhereInput = { organizationId };

  if (startDate && endDate) {
    // Create dates and force time boundaries
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    whereConditions.issueDate = {
      gte: start,
      lte: end
    };
  }

  const data = await prisma.invoice.findMany({
    where: whereConditions,
    include: { client: { select: { companyName: true } } },
    orderBy: { issueDate: 'desc' }
  });

  return data;
};


export const InvoiceService = {
  createInvoice,
  getAllInvoices,
  getSingleInvoice,
  updateInvoice,
  getInvoiceStatement
};