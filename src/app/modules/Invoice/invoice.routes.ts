import express from 'express';
import auth from '../../middleWares/auth';
import { ENUM_USER_ROLE } from '../enums/user';
import validateRequest from '../../middleWares/validateRequest';
import { InvoiceValidation } from './invoice.validation';
import { InvoiceController } from './invoice.controller';
import { CloudinaryUpload } from '../../../helpars/cloudinaryHelper';

const router = express.Router();

router.post(
  '/create-invoice',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  // 1. Multer parses the multipart form and uploads to Cloudinary
  CloudinaryUpload.fields([
    { name: 'companyLogo', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
  ]),
  // 2. Optional: Add a custom middleware to parse JSON strings before Zod if needed
  (req, res, next) => {
     if (req.body.items && typeof req.body.items === 'string') {
         req.body.items = JSON.parse(req.body.items);
     }
     next();
  },
  // 3. Now Zod validates the parsed body
  validateRequest(InvoiceValidation.createInvoiceZodSchema),
  InvoiceController.createInvoice
);


router.get(
  '/statement',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  InvoiceController.getStatement
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