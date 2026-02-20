import express from 'express';
import { ReportController } from './report.controller';

const router = express.Router();

router.get('/:organizationId', ReportController.getReports);

export const ReportRoutes = router;