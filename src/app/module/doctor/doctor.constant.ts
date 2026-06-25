import { Prisma } from "../../../generated/prisma/client";

export const doctorSearchableFields = [
  "name",
  "email",
  "qualification",
  "designation",
  "currentWorkingPlace",
  "registrationNumber",
  "specialities.speciality.title",
];

export const doctorFilterableFields = [
  "gender",
  "isDeleted",
  "appoinmentFee",
  "experience",
  "registrationNumber",
  "specialties.specialtyId",
  "currentWorkingPlace",
  "designation",
  "qualification",
  "specialities.speciality.title",
  "user.role",
];

export const doctorIncludeConfig: Partial<
  Record<
    keyof Prisma.DoctorInclude,
    Prisma.DoctorInclude[keyof Prisma.DoctorInclude]
  >
> = {
  user: true,
  specialities: {
    include: {
      speciality: true,
    },
  },
  appointment: {
    include: {
      patient: true,
      doctor: true,
      prescription: true,
    },
  },
  doctorSchedules: {
    include: {
      schedule: true,
    },
  },
  prescription: true,
  review: true,
};
