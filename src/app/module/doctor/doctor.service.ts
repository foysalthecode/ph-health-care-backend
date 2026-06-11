import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";

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

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  const result = await prisma.doctor.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
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

export const DoctorService = { getAllDoctors, deleteDoctor, updateDoctor };
