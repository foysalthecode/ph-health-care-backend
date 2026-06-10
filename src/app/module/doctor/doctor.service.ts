import { prisma } from "../../lib/prisma";

const getAllDoctors = async () => {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
      specialities: {
        include: {
          speciality: true,
        },
      },
    },
  });
  return doctors;
};

const deleteDoctor = async (id: string) => {
  const result = await prisma.doctor.delete({
    where: {
      id,
    },
  });
  const deleteUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.delete({
      where: {
        id: result.userId,
      },
    });
    return user;
  });
  return { result, deleteUser };
};

export const DoctorService = { getAllDoctors, deleteDoctor };
