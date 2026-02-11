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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const expense_service_1 = require("./expense.service");
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield expense_service_1.ExpenseService.createExpense(req.body);
        res.status(201).json({
            success: true,
            message: "Expense recorded successfully!",
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const getAllExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { organizationId } = req.query;
        const result = yield expense_service_1.ExpenseService.getAllExpenses(organizationId);
        res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const bulkCreateExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield expense_service_1.ExpenseService.bulkCreateExpenses(req.body);
        res.status(201).json({
            success: true,
            message: `${result.count} expenses imported successfully!`,
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.ExpenseController = { createExpense, getAllExpenses, bulkCreateExpenses };
