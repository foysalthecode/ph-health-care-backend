import { Request, Response } from "express";
import { specialityService } from "./speciality.service";
import { catchAsync } from "../../shared/catchAsync";

const createSpeciality = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await specialityService.CreateSpeciality(payload);
  res.status(201).json({
    success: true,
    message: "Speciality Created Successfully",
    data: result,
  });
});

const GetAllSpeciality = catchAsync(async (req: Request, res: Response) => {
  const speciality = await specialityService.GetAllSpeciality();

  res.status(200).json({
    success: true,
    message: "Data Retirive successfully",
    data: speciality,
  });
});

const DeleteSpeciality = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialityService.DeleteSpecialtiy(id as string);

  res.status(200).json({
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

  res.status(200).json({
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
