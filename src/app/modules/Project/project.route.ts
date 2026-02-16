import express from 'express';
import auth from '../../middleWares/auth';
import { ENUM_USER_ROLE } from '../enums/user';
import { ProjectController } from './project.controller';

const router = express.Router();

router.post(
  '/create-project',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  ProjectController.createProject
);


router.get(
  '/',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MEMBER),
  ProjectController.getProjects
);


router.get(
  '/my-projects',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MEMBER),
  ProjectController.getMyProjects
);


export const ProjectRoutes = router;