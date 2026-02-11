import { Request, Response } from 'express';
import { StatsService } from './stats.service';

const getSummary = async (req: Request & { user?: any }, res: Response) => {

    try {
        // সাধারণত auth middleware থেকে organizationId পাওয়া যায়
        const organizationId = (req as any).user?.organizationId;
        const result = await StatsService.getDashboardSummary(organizationId);

        res.status(200).json({
            success: true,
            message: "Dashboard summary fetched successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const StatsController = { getSummary };