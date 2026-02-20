import express from 'express';
import { QuotationController } from './quotation.controller';
import auth from '../../middleWares/auth';

const router = express.Router();

router.post(
  '/create-quotation',
  auth('OWNER', 'ADMIN'), 
  QuotationController.createQuotation
);

export const QuotationRoutes = router;