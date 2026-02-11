import { Request, Response } from 'express';
import { ClientService } from './client.service';

const createClient = async (req: Request, res: Response) => {
    try {
        const result = await ClientService.createClient(req.body);
        res.status(201).json({
            success: true,
            message: "Client created successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    };
};

export const ClientController = { createClient };
