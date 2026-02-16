import prisma from '../../../shared/prisma';

const createProject = async (payload: any, creatorId: string) => {
  const { members, startDate, endDate, ...projectData } = payload;

  return await prisma.$transaction(async (tx) => {
    // ১. প্রজেক্ট তৈরি করা
    const project = await tx.project.create({
      data: {
        ...projectData,
        creatorId,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    // ২. যদি মেম্বার থাকে তবে তাদের ProjectMember টেবিলে যুক্ত করা
    if (members && members.length > 0) {
      await tx.projectMember.createMany({
        data: members.map((mId: string) => ({
          projectId: project.id,
          userId: mId,
        })),
      });
    }

    return project;
  });
};

const getAllProjectsForAdmin = async (orgId: string) => {
  return await prisma.project.findMany({
    where: { organizationId: orgId },
    include: { 
      client: true, 
      creator: true, 
      members: { include: { user: true } } 
    },
  });
};


const getUserSpecificProjects = async (userId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        {
         
          creatorId: userId,
        },
        {
         
          members: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
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
  });

  return projects;
};


export const ProjectService = {
  createProject,
  getUserSpecificProjects,
  getAllProjectsForAdmin,
};