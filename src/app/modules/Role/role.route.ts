import express from 'express';
import { RoleController } from './role.controller';
import { RoleValidation } from './role.validation';
import validateRequest from '../../middleWares/validateRequest';
import auth from '../../middleWares/auth';
import { ENUM_USER_ROLE } from '../enums/user';

const router = express.Router();

// রোল তৈরি করার রাউট
router.post(
  '/create-role',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  validateRequest(RoleValidation.createRoleZodSchema), // ভ্যালিডেশন যুক্ত হলো
  RoleController.createRole
);

// ইউজারকে রোল দেওয়ার রাউট
router.post(
  '/assign-role',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  validateRequest(RoleValidation.assignRoleZodSchema), // ভ্যালিডেশন যুক্ত হলো
  RoleController.assignRoleToUser
);

export const RoleRoutes = router;