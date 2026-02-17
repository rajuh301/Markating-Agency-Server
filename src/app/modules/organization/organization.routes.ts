import express from 'express';
import { OrganizationController } from './organization.controller';

const router = express.Router();

// GET: /api/v1/organization/:id
router.get('/:id', OrganizationController.getMyOrganization);

// PATCH: /api/v1/organization/:id
router.patch('/:id', OrganizationController.updateMyOrganization);

export const OrganizationRoutes = router;