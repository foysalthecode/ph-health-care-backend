import { Role, speciality } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { IcreateDoctorePayload } from "./user.interface";

const createDoctor = async (payload: IcreateDoctorePayload) => {
  const specialities: speciality[] = [];

  for (const specialityId of payload.specialities) {
    const specialty = await prisma.speciality.findUnique({
      where: {
        id: specialityId,
      },
    });
    if (!specialty) {
      throw new Error(`Speciality with id ${specialityId} not found`);
    }
    specialities.push(specialty);
  }

  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });

  if (isUserExists) {
    throw new Error("User with this Email already exists");
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.password,
      role: Role.DOCTOR,
      name: payload.doctor.name,
      needsPasswordChnage: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
        },
      });

      const doctorSpecialityData = specialities.map((speciality) => {
        return {
          doctorId: doctorData.id,
          specialityId: speciality.id,
        };
      });

      await tx.doctorSpeciality.createMany({
        data: doctorSpecialityData,
      });

      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorData.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appoinmentFee: true,
          qualification: true,
          currentWorkingPlace: true,
          designation: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              isDeleted: true,
              deletedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          specialities: {
            select: {
              speciality: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });
      return doctor;
    });

    return result;
  } catch (error) {
    console.log("Transaction Error", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw error;
  }
};

export const UserService = {
  createDoctor,
};
