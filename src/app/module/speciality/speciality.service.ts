import { prisma } from "../../lib/prisma";
import { speciality } from "./../../../generated/prisma/client";

const CreateSpeciality = async (payload: speciality): Promise<speciality> => {
  const speciality = await prisma.speciality.create({
    data: payload,
  });

  return speciality;
};

export const specialityService = { CreateSpeciality };
