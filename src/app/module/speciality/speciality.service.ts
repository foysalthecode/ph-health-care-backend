import { prisma } from "../../lib/prisma";
import { speciality } from "./../../../generated/prisma/client";

const CreateSpeciality = async (payload: speciality): Promise<speciality> => {
  const speciality = await prisma.speciality.create({
    data: payload,
  });

  return speciality;
};

const GetAllSpeciality = async (): Promise<speciality[]> => {
  const specialities = await prisma.speciality.findMany();
  return specialities;
};

const DeleteSpecialtiy = async (id: string): Promise<speciality> => {
  const speciality = await prisma.speciality.delete({
    where: { id },
  });

  return speciality;
};

const UpdateSpeciality = async (
  id: string,
  payload: speciality,
): Promise<speciality> => {
  const result = await prisma.speciality.update({
    where: { id },
    data: payload,
  });

  return result;
};

export const specialityService = {
  CreateSpeciality,
  GetAllSpeciality,
  DeleteSpecialtiy,
  UpdateSpeciality,
};
