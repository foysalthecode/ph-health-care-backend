import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { scheduleService } from "./schedule.service";
import { IQueryParams } from "../../interfaces/query.interface";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const schedule = await scheduleService.createSchedule(payload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "",
    data: schedule,
  });
});

const getAllSchedule = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await scheduleService.getAllSchedule(query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "",
    data: result,
  });
});
const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await scheduleService.getScheduleById(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "",
    data: result,
  });
});
const updateSchedule = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { id } = req.params;
  const result = await scheduleService.updateSchedule(id as string, payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "",
    data: result,
  });
});
const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await scheduleService.deleteSchedule(id as string);
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
