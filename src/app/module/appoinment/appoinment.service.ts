import { uuidv7 } from "zod";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IBookAppoinmentPayload } from "./appoinment.interface";
import { AppointmentStatus, Role } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const bookAppointment = async (
  payload: IBookAppoinmentPayload,
  user: IRequestUser,
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });

  const scheduleData = await prisma.schedule.findUniqueOrThrow({
    where: {
      id: payload.scheduleId,
    },
  });

  const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
    where: {
      doctorId_scheduleId: {
        scheduleId: scheduleData.id,
        doctorId: doctorData.id,
      },
    },
  });

  const videoCallingId = String(uuidv7());

  const result = await prisma.$transaction(async (tx) => {
    const appoinmentData = await tx.appointment.create({
      data: {
        doctorId: payload.doctorId,
        patientId: patientData.id,
        scheduleId: doctorSchedule.scheduleId,
        videoCallingId,
      },
    });

    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    //* payment integration will be here

    return appoinmentData;
  });
  return result;
};

const getMyAppoinments = async (user: IRequestUser) => {
  const patientData = await prisma.patient.findUnique({
    where: {
      email: user?.email,
    },
  });

  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user?.email,
    },
  });

  // eslint-disable-next-line no-useless-assignment
  let appointments = [];

  if (patientData) {
    appointments = await prisma.appointment.findMany({
      where: {
        patientId: patientData.id,
      },
      include: {
        doctor: true,
        schedule: true,
      },
    });
  } else if (doctorData) {
    appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorData.id,
      },
      include: {
        patient: true,
        schedule: true,
      },
    });
  } else {
    throw new Error("User not found");
  }

  return appointments;
};

const changeAppointmentStatus = async (
  appoinmentId: string,
  appoinmentStatus: AppointmentStatus,
  user: IRequestUser,
) => {
  const appoinmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appoinmentId,
      // status: AppointmentStatus.SCHEDULED,
    },
    include: {
      doctor: true,
    },
  });

  // if (!appoinmentData) {
  //   throw new AppError(
  //     status.NOT_FOUND,
  //     "Appoinment not Found or Already completed or cancelled",
  //   );
  // }

  if (user?.role === Role.DOCTOR) {
    if (!(user?.email === appoinmentData.doctor.email)) {
      throw new AppError(status.BAD_REQUEST, "This is not Your Appoinment");
    }
  }

  return await prisma.appointment.update({
    where: {
      id: appoinmentId,
    },
    data: {
      status: appoinmentStatus,
    },
  });
};

const getMySingleAppointment = async () => {};
const getAllAppointments = async () => {};
const bookAppointmentWithPayLater = async () => {};
const initiatePayment = async () => {};
const cancelUnpaidAppointments = async () => {};

export const AppoinmentService = {
  bookAppointment,
  getMyAppoinments,
  changeAppointmentStatus,
  getMySingleAppointment,
  getAllAppointments,
  bookAppointmentWithPayLater,
  initiatePayment,
  cancelUnpaidAppointments,
};
