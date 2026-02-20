import express from 'express';
import { InvoiceController } from './invoice.controller';
import auth from '../../middleWares/auth';
import { ENUM_USER_ROLE } from '../enums/user';

const router = express.Router();

router.post(
  '/create-invoice',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  InvoiceController.createInvoice
);

export const InvoiceRoutes = router;