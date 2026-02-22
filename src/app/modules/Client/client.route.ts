import express from 'express';
import auth from '../../middleWares/auth';
import validateRequest from '../../middleWares/validateRequest';
import { ENUM_USER_ROLE } from '../enums/user';
import { ClientController } from './client.controller';
import { ClientValidation } from './client.validation';

const router = express.Router();

router.post(
  '/create-client',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  validateRequest(ClientValidation.createClientZodSchema), 
  ClientController.createClient
);


router.get(
    '/',
    auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
    ClientController.getAllClients
);

router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
    ClientController.deleteClient
);

router.patch(
    '/:id',
    auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
    ClientController.updateClient
);

export const ClientRoutes = router;