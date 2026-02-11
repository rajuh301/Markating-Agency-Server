import PDFDocument from 'pdfkit';
import fs from 'fs';

const generateInvoicePDF = async (data: any, path: string) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.fillColor('#444444').fontSize(20).text('FLOW AGENCY INVOICE', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(`Invoice No: ${data.id}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.text(`Customer: ${data.userName}`);
  doc.moveDown();

  // Table Header
  doc.fontSize(12).text('Description', 50, 200);
  doc.text('Amount', 400, 200);
  doc.moveTo(50, 215).lineTo(550, 215).stroke();

  // Table Row
  doc.text(data.planName, 50, 230);
  doc.text(`$${data.amount}`, 400, 230);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
};

export const InvoiceUtils = { generateInvoicePDF };