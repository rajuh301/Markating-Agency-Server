import express from 'express';
import auth from '../../middleWares/auth';
import { ENUM_USER_ROLE } from '../enums/user';
import { ClientController } from './client.controller';

const router = express.Router();

router.post(
    '/create-client',
    auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
    ClientController.createClient
);


export const ClientRoutes = router;