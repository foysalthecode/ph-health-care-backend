import { Request, Response } from "express";
import { specialityService } from "./speciality.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createSpeciality = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await specialityService.CreateSpeciality(payload);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Speciality Created Successfully",
    data: result,
  });
});

const GetAllSpeciality = catchAsync(async (req: Request, res: Response) => {
  const speciality = await specialityService.GetAllSpeciality();

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Speciality Retrieved Successfully",
    data: speciality,
  });
});

const DeleteSpeciality = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialityService.DeleteSpecialtiy(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Speciality Deleted Successfully",
    data: result,
  });
});

const UpdateSpeciality = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { id } = req.params;
  const result = await specialityService.UpdateSpeciality(
    id as string,
    payload,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Speciality Updated Successfully",
    data: result,
  });
});

export const specialityController = {
  createSpeciality,
  GetAllSpeciality,
  DeleteSpeciality,
  UpdateSpeciality,
};
