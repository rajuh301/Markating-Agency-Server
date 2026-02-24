import express from 'express';
import { QuotationController } from './quotation.controller';
import { QuotationValidation } from './quotation.validation';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import validateRequest from '../../middleWares/validateRequest';
import { ENUM_USER_ROLE } from '../enums/user';
import { CloudinaryUpload } from '../../../helpars/cloudinaryHelper';
import auth from '../../middleWares/auth';

const router = express.Router();


router.post(
  '/create-quotation',
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
 validateRequest(QuotationValidation.createQuotationZodSchema),
  QuotationController.createQuotation
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MEMBER),
  QuotationController.getAllQuotations
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MEMBER),
  QuotationController.getSingleQuotation
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  validateRequest(QuotationValidation.updateQuotationZodSchema),
  QuotationController.updateQuotation
);

export const QuotationRoutes = router;