import { Request, Response } from 'express';
import { ProjectService } from './project.service';

const createProject = async (req: Request, res: Response) => {
    try {
        const result = await ProjectService.createProject(req.body);
        res.status(201).json({
            success: true,
            message: "Project created successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllProjects = async (req: Request, res: Response) => {
    try {
        const result = await ProjectService.getAllProjects();
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const ProjectController = { createProject, getAllProjects };