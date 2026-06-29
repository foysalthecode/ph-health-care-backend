import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorSchedulePayload } from "./doctorSchedule.interface";

const createSchedule = async (
  user: IRequestUser,
  payload: ICreateDoctorSchedulePayload,
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  return result;
};

const getMyDoctorSchedule = async () => {};

const getAllDoctorSchedules = async () => {};

const getDoctorScheduleById = async () => {};

const updateMyDoctorSchedule = async () => {};

const deleteMyDoctorSchedule = async () => {};

export const doctorScheduleService = {
  createSchedule,
  getMyDoctorSchedule,
  getAllDoctorSchedules,
  getDoctorScheduleById,
  updateMyDoctorSchedule,
  deleteMyDoctorSchedule,
};
