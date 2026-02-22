import { ProjectStatus } from '@prisma/client'
import prisma from '../../../shared/prisma';

const createProject = async (payload: any, creatorId: string) => {
   
  const { teamMembers, startDate, deadline, budget, ...projectData } = payload;

    return await prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
    data: {
        ...projectData,
        creatorId,
        projectManagerId: creatorId,
        budget: budget ? parseFloat(budget) : 0,
        startDate: startDate ? new Date(startDate) : null,
        deadline: deadline ? new Date(deadline) : null,
    },
});

        if (teamMembers && teamMembers.length > 0) {
            await tx.projectMember.createMany({
                data: teamMembers.map((mId: string) => ({
                    projectId: project.id,
                    userId: mId,
                })),
            });
        }

        return project;
    });
};

 const getAllProjectsForAdmin = async (orgId: string, options: { page?: number; limit?: number }) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: { 
        organizationId: orgId,
        NOT: {
          status: 'CANCELLED' 
        }
      },
      include: { 
        client: true, 
        creator: true, 
        members: { include: { user: true } } 
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.project.count({
      where: { 
        organizationId: orgId,
        NOT: { status: 'CANCELLED' }
      }
    })
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data: projects
  };
};

const getUserSpecificProjects = async (userId: string, options: { page?: number; limit?: number }) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const whereConditions: any = { 
    status: { 
      not: ProjectStatus.CANCELLED 
    },
    OR: [
      { creatorId: userId },
      {
        members: {
          some: { userId: userId },
        },
      },
    ],
  };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: whereConditions,
      include: {
        creator: {
          select: {
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.project.count({
      where: whereConditions,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: projects,
  };
};

const updateProject = async (id: string, payload: any) => {
  const { teamMembers, startDate, deadline, budget, ...updateData } = payload;

  try {
    return await prisma.$transaction(async (tx) => {
      const project = await tx.project.update({
        where: { 
          id: id,
          NOT: {
            status: ProjectStatus.CANCELLED
          }
        },
        data: {
          ...updateData,
          budget: budget ? parseFloat(budget) : undefined,
          startDate: startDate ? new Date(startDate) : undefined,
          deadline: deadline ? new Date(deadline) : undefined,
        },
      });

      if (teamMembers) {
        await tx.projectMember.deleteMany({
          where: { projectId: id },
        });

        if (teamMembers.length > 0) {
          await tx.projectMember.createMany({
            data: teamMembers.map((mId: string) => ({
              projectId: id,
              userId: mId,
            })),
          });
        }
      }

      return project;
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error("Project is deleted or not found.");
    }
    throw error;
  }
};



const deleteProject = async (id: string) => {
  const isExist = await prisma.project.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new Error("Project not found!");
  }

  const result = await prisma.project.update({
    where: { id },
    data: { status: 'CANCELLED' as any}
  });

  return result;
};




export const ProjectService = {
  createProject,
  getUserSpecificProjects,
  getAllProjectsForAdmin,
  updateProject,
  deleteProject
};