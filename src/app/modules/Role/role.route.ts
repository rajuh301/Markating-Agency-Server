import express from 'express';
import { RoleController } from './role.controller';
import { RoleValidation } from './role.validation';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middleWares/validateRequest';
import auth from '../../middleWares/auth';

const router = express.Router();

// রোল তৈরি করার রাউট
router.post(
  '/create-role',
  auth(UserRole.OWNER, UserRole.ADMIN),
  validateRequest(RoleValidation.createRoleZodSchema), // ভ্যালিডেশন যুক্ত হলো
  RoleController.createRole
);

// ইউজারকে রোল দেওয়ার রাউট
router.post(
  '/assign-role',
  auth(UserRole.OWNER, UserRole.ADMIN),
  validateRequest(RoleValidation.assignRoleZodSchema), // ভ্যালিডেশন যুক্ত হলো
  RoleController.assignRoleToUser
);

export const RoleRoutes = router;