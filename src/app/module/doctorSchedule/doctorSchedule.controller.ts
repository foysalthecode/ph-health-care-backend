import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { doctorScheduleService } from "./doctorSchedule.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { IQueryParams } from "../../interfaces/query.interface";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  const result = await doctorScheduleService.createSchedule(user, payload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Doctor schedule created successfully",
    data: result,
  });
});

const getMyDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const query = req.query;
  const result = await doctorScheduleService.getMyDoctorSchedule(
    user,
    query as IQueryParams,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor Schedule created Successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAllDoctorSchedules = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query;
    const result = await doctorScheduleService.getAllDoctorSchedules(
      query as IQueryParams,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "All Doctor Retrive successfully",
      data: result,
    });
  },
);

const getDoctorScheduleById = catchAsync(
  async (req: Request, res: Response) => {
    const doctorId = req.params.doctorId;
    const scheduleId = req.params.scheduleId;
    const result = await doctorScheduleService.getDoctorScheduleById(
      doctorId as string,
      scheduleId as string,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Doctor Schedule Retrive Successfully",
      data: result,
    });
  },
);

const updateMyDoctorSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user;
    const result = await doctorScheduleService.updateMyDoctorSchedule(
      user,
      payload,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Doctor Schedule Updated Successfully",
      data: result,
    });
  },
);

const deleteMyDoctorSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const result = await doctorScheduleService.deleteMyDoctorSchedule(
      id as string,
      user,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Doctor Schedule Deleted Successfully",
      data: result,
    });
  },
);

export const doctorScheduleController = {
  createSchedule,
  getMyDoctorSchedule,
  getAllDoctorSchedules,
  getDoctorScheduleById,
  updateMyDoctorSchedule,
  deleteMyDoctorSchedule,
};
