import { Request, Response } from 'express';
import { ExpenseService } from './expense.service';

const createExpense = async (req: Request, res: Response) => {
    try {
        const result = await ExpenseService.createExpense(req.body);
        res.status(201).json({
            success: true,
            message: "Expense recorded successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllExpenses = async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.query;
        const result = await ExpenseService.getAllExpenses(organizationId as string);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const bulkCreateExpenses = async (req: Request, res: Response) => {
    try {
        const result = await ExpenseService.bulkCreateExpenses(req.body);
        res.status(201).json({
            success: true,
            message: `${result.count} expenses imported successfully!`,
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const ExpenseController = { createExpense, getAllExpenses, bulkCreateExpenses };