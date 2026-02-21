import express from 'express';
import { OrganizationController } from './organization.controller';
import auth from '../../middleWares/auth';
import { ENUM_USER_ROLE } from '../enums/user';

const router = express.Router();

router.get('/all-organizations', OrganizationController.getAllOrganizations);

// GET: /api/v1/organization/:id
router.get('/:id', OrganizationController.getMyOrganization);

// PATCH: /api/v1/organization/:id
router.patch('/:id',  auth(ENUM_USER_ROLE.OWNER), 
 OrganizationController.updateMyOrganization);


router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.OWNER), 
  OrganizationController.deleteOrganization
);


export const OrganizationRoutes = router;