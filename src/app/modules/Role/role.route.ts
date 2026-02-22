import express from 'express';
import { RoleController } from './role.controller';
import { RoleValidation } from './role.validation';
import validateRequest from '../../middleWares/validateRequest';
import auth from '../../middleWares/auth';
import { ENUM_USER_ROLE } from '../enums/user';

const router = express.Router();

router.post(
  '/create-role',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  validateRequest(RoleValidation.createRoleZodSchema), 
  RoleController.createRole
);

router.post(
  '/assign-role',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  validateRequest(RoleValidation.assignRoleZodSchema),
  RoleController.assignRoleToUser
);


router.patch(
  '/update-role/:id',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  validateRequest(RoleValidation.updateRoleZodSchema), 
  RoleController.updateRole
);


export const RoleRoutes = router;