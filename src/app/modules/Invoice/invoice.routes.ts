import express from 'express';
import auth from '../../middleWares/auth';
import { ENUM_USER_ROLE } from '../enums/user';
import validateRequest from '../../middleWares/validateRequest';
import { InvoiceValidation } from './invoice.validation';
import { InvoiceController } from './invoice.controller';

const router = express.Router();

// ১. ইনভয়েস তৈরি করা (Owner এবং Admin রালদের জন্য)
router.post(
  '/create-invoice',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  validateRequest(InvoiceValidation.createInvoiceZodSchema),
  InvoiceController.createInvoice
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MEMBER),
  InvoiceController.getAllInvoices
);


router.get(
  '/:id',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MEMBER),
  InvoiceController.getSingleInvoice
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  InvoiceController.updateInvoice
);

export const InvoiceRoutes = router;