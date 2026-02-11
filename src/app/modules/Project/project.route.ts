import express from 'express';
import auth from '../../middleWares/auth';
import { ENUM_USER_ROLE } from '../enums/user';
import { ProjectController } from './project.controller';

const router = express.Router();

// নতুন প্রজেক্ট তৈরি করা
router.post(
    '/create-project',
    auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
    ProjectController.createProject
);

// সব প্রজেক্টের লিস্ট দেখা
router.get(
    '/',
    auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
    ProjectController.getAllProjects
);

export const ProjectRoutes = router;