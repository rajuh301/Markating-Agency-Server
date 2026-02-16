import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import validateRequest from '../../middleWares/validateRequest';
import { ENUM_USER_ROLE } from '../enums/user';
import auth from '../../middleWares/auth';

const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidation.register),
  UserController.register
);

router.post(
  '/login',
  validateRequest(UserValidation.login),
  UserController.login
);

router.get(
    '/',
    auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
    UserController.getAllUsers
);


router.post(
    '/invite-user',
    auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
    UserController.inviteUser
);

router.patch(
    '/set-password',
    UserController.setPassword 
);

router.get(
    '/me',
    auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MEMBER),
    UserController.getMyProfile
);


export const UserRoutes = router;