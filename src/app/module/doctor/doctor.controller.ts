import { Request, Response } from "express";
import { DoctorService } from "./doctor.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getAllDoctors();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctors Retrive Successfully",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.deleteDoctor(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor Deleted Successfully",
    data: result,
  });
});

export const doctorController = { getAllDoctors, deleteDoctor };
