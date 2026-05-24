import { Request, Response } from "express";
import { specialityService } from "./speciality.service";

const createSpeciality = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = await specialityService.CreateSpeciality(payload);

    res.status(201).json({
      success: true,
      message: "Speciality created successfully",
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed To create speciality",
      error: err.message,
    });
  }
};

const GetAllSpeciality = async (req: Request, res: Response) => {
  try {
    const speciality = await specialityService.GetAllSpeciality();
    res.status(200).json({
      success: true,
      message: "Data Retirive successfully",
      data: speciality,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed To create speciality",
      error: err.message,
    });
  }
};

const DeleteSpeciality = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await specialityService.DeleteSpecialtiy(id as string);

    res.status(200).json({
      success: true,
      message: "Speciality Deleted Successfully",
      data: result,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed To create speciality",
      error: err.message,
    });
  }
};

const UpdateSpeciality = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { id } = req.params;
    const result = await specialityService.UpdateSpeciality(id as string, data);
    res.status(200).json({
      success: true,
      message: "Updated Successfully",
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed To create speciality",
      error: err.message,
    });
  }
};

export const specialityController = {
  createSpeciality,
  GetAllSpeciality,
  DeleteSpeciality,
  UpdateSpeciality,
};
