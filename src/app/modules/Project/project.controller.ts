import { Request, Response } from 'express';
import { ProjectService } from './project.service';
import catchAsync from '../../../shared/catchAsync'; // আপনার যদি এই ইউটিলিটি থাকে

const createProject = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const result = await ProjectService.createProject(req.body, user.userId);
    
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProjects = async (req: Request, res: Response) => {
  try {
    const { userId, role, organizationId } = (req as any).user;
    let result;

    if (role === 'ADMIN' || role === 'OWNER') {
      result = await ProjectService.getAllProjectsForAdmin(organizationId);
    } else {
      result = await ProjectService.getUserSpecificProjects(userId);
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const getMyProjects = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;

    const result = await ProjectService.getUserSpecificProjects(userId);

    res.status(200).json({
      success: true,
      message: "Personalized projects retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ProjectService.updateProject(id, req.body);
    
    res.status(200).json({
      success: true,
      message: "Project updated successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ 
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ProjectService.deleteProject(id);

    res.status(200).json({
      success: true,
      message: "Project and all associated data deleted successfully!",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete project",
    });
  }
};



export const ProjectController = {
  createProject,
  getProjects,
  getMyProjects,
  updateProject,
  deleteProject
};