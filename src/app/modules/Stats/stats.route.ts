import express from 'express';
import { StatsController } from './stats.controller';
import auth from '../../middleWares/auth';
import { ENUM_USER_ROLE } from '../enums/user';

const router = express.Router();

router.get(
    '/summary',
    auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
    StatsController.getSummary
);



export const StatsRoutes = router;