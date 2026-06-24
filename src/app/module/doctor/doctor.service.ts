import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IQueryParams } from "../../interfaces/query.interface";
import {
  doctorFilterableFields,
  doctorIncludeConfig,
  doctorSearchableFields,
} from "./doctor.constant";
import { Doctor, Prisma } from "../../../generated/prisma/client";

const getAllDoctors = async (query: IQueryParams) => {
  // const doctors = await prisma.doctor.findMany({
  //   include: {
  //     user: true,
  //     specialities: {
  //       include: {
  //         speciality: true,
  //       },
  //     },
  //   },
  // });
  // return doctors;

  const queryBuilder = new QueryBuilder<
    Doctor,
    Prisma.DoctorWhereInput,
    Prisma.DoctorInclude
  >(prisma.doctor, query, {
    searchableFields: doctorSearchableFields,
    filterableFields: doctorFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      isDeleted: false,
    })
    .include({
      user: true,
      specialities: true,
    })
    .dynamicInclue(doctorIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getDoctorById = async (id: string) => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      specialities: {
        include: {
          speciality: true,
        },
      },
      appointment: {
        include: {
          patient: true,
          schedule: true,
          prescription: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
      review: true,
    },
  });
  return result;
};

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  if (!isDoctorExist) {
    throw new AppError(status.NOT_FOUND, "Doctor Not Found");
  }

  const { doctor: doctorData, specialities } = payload;

  await prisma.$transaction(async (tx) => {
    if (doctorData) {
      await tx.doctor.update({
        where: {
          id,
        },
        data: {
          ...doctorData,
        },
      });
    }

    if (specialities && specialities.length > 0) {
      for (const specailty of specialities) {
        const { specialityId, shouldDelete } = specailty;
        if (shouldDelete) {
          await tx.doctorSpeciality.delete({
            where: {
              doctorId_specialityId: {
                doctorId: id,
                specialityId,
              },
            },
          });
        } else {
          await tx.doctorSpeciality.upsert({
            where: {
              doctorId_specialityId: {
                doctorId: id,
                specialityId,
              },
            },
            create: {
              doctorId: id,
              specialityId,
            },
            update: {},
          });
        }
      }
    }
  });

  const doctor = await getDoctorById(id);
  return doctor;
};

const deleteDoctor = async (id: string) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  if (!isDoctorExist) {
    throw new AppError(status.NOT_FOUND, "Doctor Not Found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: { id: isDoctorExist.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: { userId: isDoctorExist.userId },
    });

    await tx.doctorSpeciality.deleteMany({
      where: { doctorId: id },
    });
  });

  return { message: "Doctor Deleted Successfully" };
};

export const DoctorService = {
  getAllDoctors,
  getDoctorById,
  deleteDoctor,
  updateDoctor,
};
