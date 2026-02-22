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

const getAllProjects = async (req: Request, res: Response) => {
  try {
    const { organizationId } = (req as any).user;
    const { page, limit } = req.query;

    const result = await ProjectService.getAllProjectsForAdmin(organizationId, {
      page: Number(page),
      limit: Number(limit)
    });

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully!",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const getMyProjects = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    const { page, limit } = req.query; // কুয়েরি প্যারামস থেকে নেওয়া

    const result = await ProjectService.getUserSpecificProjects(userId, {
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      message: "Personalized projects retrieved successfully",
      meta: result.meta, // মেটা ডাটা সহ পাঠানো
      data: result.data,
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
  getAllProjects,
  getMyProjects,
  updateProject,
  deleteProject
};