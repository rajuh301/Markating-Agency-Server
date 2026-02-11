import prisma from '../../../shared/prisma';

const createProject = async (payload: any) => {
    const result = await prisma.project.create({
        data: {
            name: payload.name,
            description: payload.description,
            budget: payload.budget,
            status: payload.status || 'PLANNING',
            clientId: payload.clientId,
            organizationId: payload.organizationId,
            startDate: payload.startDate ? new Date(payload.startDate) : null,
            endDate: payload.endDate ? new Date(payload.endDate) : null,
        }
    });
    return result;
};

const getAllProjects = async () => {
    return await prisma.project.findMany({
        include: {
            client: true, // প্রজেক্টের সাথে ক্লায়েন্টের তথ্য দেখার জন্য
        }
    });
};

export const ProjectService = { createProject, getAllProjects };