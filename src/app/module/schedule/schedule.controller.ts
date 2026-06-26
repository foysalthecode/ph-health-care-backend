import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { scheduleService } from "./schedule.service";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const schedule = await scheduleService.createSchedule();
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "",
    data: schedule,
  });
});
const getAllSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.getAllSchedule();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "",
    data: result,
  });
});
const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.getScheduleById();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "",
    data: result,
  });
});
const updateSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.updateSchedule();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "",
    data: result,
  });
});
const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.deleteSchedule();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "",
    data: result,
  });
});

export const scheduleController = {
  createSchedule,
  getAllSchedule,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
