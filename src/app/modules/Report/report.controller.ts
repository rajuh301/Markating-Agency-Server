import { Request, Response } from 'express';
import { ReportService } from './report.service';

const getReports = async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.params;
        const result = await ReportService.getOrganizationReports(organizationId);

        res.status(200).json({
            success: true,
            message: "Reports fetched successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const ReportController = {
    getReports
};