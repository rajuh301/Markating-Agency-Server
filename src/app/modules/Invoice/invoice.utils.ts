import PDFDocument from 'pdfkit';
import fs from 'fs';

const generateInvoicePDF = async (data: any, path: string) => {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });

  const colors = {
    primary: '#6366F1',     // Indigo
    textDark: '#111827',    // Deep Gray
    textLight: '#6B7280',   // Gray
    bgLight: '#F9FAFB',     // Table Header BG
    border: '#E5E7EB'       
  };

  // --- HEADER ---
  doc.rect(40, 40, 35, 35).fill(colors.primary); 
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(16).text('F', 52, 51);

  doc.fillColor(colors.textDark).font('Helvetica-Bold').fontSize(16).text('FLOW AGENCY', 85, 42);
  doc.font('Helvetica').fontSize(9).fillColor(colors.textLight).text('MARKETING & SOLUTIONS', 85, 60);

  doc.fillColor(colors.textDark).font('Helvetica-Bold').fontSize(20).text('INVOICE', 400, 42, { align: 'right' });
  doc.font('Helvetica').fontSize(9).fillColor(colors.textLight).text(`INV-${data.id.slice(0, 8).toUpperCase()}`, 400, 65, { align: 'right' });

  // --- INFO SECTION ---
  doc.moveTo(40, 100).lineTo(555, 100).strokeColor(colors.border).stroke();

  doc.fillColor(colors.textLight).fontSize(8).text('BILL TO', 40, 120);
  doc.fillColor(colors.textDark).font('Helvetica-Bold').fontSize(11).text(data.userName || 'Client Name', 40, 135);
  doc.font('Helvetica').fontSize(9).fillColor(colors.textLight).text(data.email || 'client@mail.com', 40, 150);

  // --- TABLE HEADER ---
  const tableTop = 220;
  doc.rect(40, tableTop, 515, 25).fill(colors.bgLight);
  
  doc.fillColor(colors.textDark).font('Helvetica-Bold').fontSize(9);
  doc.text('DESCRIPTION', 55, tableTop + 8);
  doc.text('QTY', 320, tableTop + 8);
  doc.text('PRICE', 400, tableTop + 8);
  doc.text('TOTAL', 500, tableTop + 8);

  // --- TABLE ROW ---
  const rowY = tableTop + 40;
  doc.font('Helvetica').fontSize(10).fillColor(colors.textDark).text(data.planName || 'Agency Service', 55, rowY);
  doc.text('1', 320, rowY);
  doc.text(`$${data.amount}`, 400, rowY);
  
  doc.fillColor(colors.primary).font('Helvetica-Bold').text(`$${data.amount}`, 500, rowY);

  // --- TOTAL BOX ---
  const summaryY = rowY + 60;
  doc.rect(370, summaryY, 185, 40).fill(colors.primary);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(11).text('Total Amount', 385, summaryY + 15);
  doc.fontSize(13).text(`$${data.amount}`, 465, summaryY + 14, { align: 'right' });

  doc.end();
  doc.pipe(fs.createWriteStream(path));
};

export const InvoiceUtils = { generateInvoicePDF };