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

export const OrganizationController = {
    getMyOrganization,
    updateMyOrganization
};