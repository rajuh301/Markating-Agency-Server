"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceUtils = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const generateInvoicePDF = (data, path) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = new pdfkit_1.default({ margin: 50 });
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
    doc.pipe(fs_1.default.createWriteStream(path));
});
exports.InvoiceUtils = { generateInvoicePDF };
