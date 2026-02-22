import { Request, Response } from 'express';
import { RoleService } from './role.service';
const createRole = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized! User ID not found in token.",
      });
      return; 
    }

    const result = await RoleService.createRole(user.userId, req.body);

    res.status(201).json({
      success: true,
      message: "Role and permissions created successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create role",
    });
  }
};


const assignRoleToUser = async (req: Request, res: Response) => {
  try {
    const { organizationId } = (req as any).user;
    const result = await RoleService.assignRoleToUser(organizationId, req.body);

    res.status(200).json({
      success: true,
      message: "Role assigned to user successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to assign role",
    });
  }
};

export const RoleController = {
  createRole,
  assignRoleToUser
};