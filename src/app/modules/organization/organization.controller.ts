import { Request, Response } from 'express';
import { OrganizationService } from './organization.service';

const getMyOrganization = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await OrganizationService.getOrganization(id);
        res.status(200).json({
            success: true,
            message: "Organization profile fetched successfully",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};


const getAllOrganizations = async (req: Request, res: Response) => {
    try {
        const result = await OrganizationService.getAllOrganizations;
        res.status(200).json({
            success: true,
            message: "All Organizations profile fetched successfully",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateMyOrganization = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await OrganizationService.updateOrganization(id, req.body);
        res.status(200).json({
            success: true,
            message: "Organization profile updated successfully",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};



const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await OrganizationService.softDeleteOrganization(id);

    res.status(200).json({
      success: true,
      message: "Organization and all associated user accounts have been deactivated successfully.",
      data: null,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to deactivate organization",
    });
  }
};

export const OrganizationController = {
    getMyOrganization,
    updateMyOrganization,
    getAllOrganizations,
    deleteOrganization
};