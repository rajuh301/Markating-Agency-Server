import express from 'express';
import { RoleController } from './role.controller';
import auth from '../../middleWares/auth';
import { ENUM_USER_ROLE } from '../enums/user';

const router = express.Router();

// শুধুমাত্র ওনার বা এডমিন রোল তৈরি করতে পারবে
router.post(
  '/create-role',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  RoleController.createRole
);

export const RoleRoutes = router;