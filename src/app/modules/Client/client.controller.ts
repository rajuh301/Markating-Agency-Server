import { Request, Response } from 'express';
import { ClientService } from './client.service';

const createClient = async (req: Request, res: Response) => {
    try {
        const result = await ClientService.createClient(req.body);
        
        res.status(201).json({
            success: true,
            message: `Success! ${result.contactPerson} has been added.`,
            data: result
        });
    } catch (error: any) {
        res.status(400).json({ 
            success: false, 
            message: error.message || "Something went wrong" 
        });
    }
};

export const ClientController = { createClient };