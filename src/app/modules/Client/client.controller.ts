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



const getAllClients = async (req: Request, res: Response) => {
    try {
      const { page, limit } = req.query;

        const user = (req as any).user; 

        const result = await ClientService.getAllClients(user.organizationId, {
          ...req.query,
          page: Number(page),
          limit: Number(limit)
        });

        res.status(200).json({
            success: true,
            message: "Clients fetched successfully!",
            count: result.data.length,
            data: result
        });
    } catch (error: any) {
        res.status(400).json({ 
            success: false, 
            message: error.message || "Failed to fetch clients" 
        });
    }
};




const getSingleClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    
    await ClientService.getSingleClient(id);

    res.status(200).json({
      success: true,
      message: "Get Single Client successfully!",
      data: null,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong while deleting the client.",
    });
  }
};

const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    
    await ClientService.deleteClient(id);

    res.status(200).json({
      success: true,
      message: "Client has been successfully deleted (Soft Delete).",
      data: null,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong while deleting the client.",
    });
  }
};



const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const updateData = req.body; 

   
    const result = await ClientService.updateClient(id, updateData);

    res.status(200).json({
      success: true,
      message: "Client updated successfully!",
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 400;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update client information",
    });
  }
};


export const ClientController = { createClient,
    getAllClients,
    deleteClient,
    updateClient,
    getSingleClient
};