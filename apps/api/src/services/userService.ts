import { prisma } from "../utils/prisma.js";

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

export const updateUser = async (id: string, data: any) => {
  const user = await prisma.user.update({
    where: { id },
    data,
  });
  return user;
};
