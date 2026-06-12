import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

const createDoctorZodSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 charaters")
    .max(20, "Password must be at most 20 charaters"),
  doctor: z.object({
    name: z
      .string("Name is Required")
      .min(3, "Name must be at least 5 characters")
      .max(30, "Name must be at most 30 characters"),
    email: z.email("Invalid Email address"),
    contactNumber: z
      .string("Contact Number is Required")
      .min(11, "Contact Number must be at least 11 characters")
      .max(14, "Contact Number must be at most 14 characters"),
    address: z
      .string("Address is Required")
      .min(15, "Address must be at least 15 characters")
      .max(100, "Address must be at most 100 characters")
      .optional(),

    registrationNumber: z.string("Registration Number is Required"),

    experience: z
      .int("Experience must be an integer")
      .nonnegative("Experience must be a non-negative integer")
      .optional(),

    gender: z.enum(
      [Gender.MALE, Gender.FEMALE],
      "Gender must be either MALE or FEMALE",
    ),
    appoinmentFee: z
      .number("Appointment Fee must be a number")
      .nonnegative("Appointment Fee must be a non-negative number"),

    qualification: z
      .string("Qualification is Required")
      .min(2, "Qualification must be at least 2 characters")
      .max(50, "Qualification must be at most 50 characters"),

    currentWorkingPlace: z
      .string("Current Working Place is Required")
      .min(2, "Current Working Place must be at least 2 characters")
      .max(50, "Current Working Place must be at most 50 characters"),

    designation: z
      .string("Designation is Required")
      .min(2, "Designation must be at least 2 characters")
      .max(50, "Designation must be at most 50 characters"),
  }),
  specialities: z
    .array(z.uuid(), "Specialities must be an array of strings")
    .min(1, "At least one speciality is required"),
});

const router = Router();

const validateRequest = (zodSchema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = zodSchema.safeParse(req.body);

    if (!parseResult.success) {
      next(parseResult.error);
    }
    //sanitize data
    req.body = parseResult.data;

    console.log(req.body, "After zod validation -- user routes ts");
    next();
  };
};

router.post(
  "/create-doctor",
  // (req: Request, res: Response, next: NextFunction) => {
  //   const parseResult = createDoctorZodSchema.safeParse(req.body);

  //   if (!parseResult.success) {
  //     next(parseResult.error);
  //   }

  //   req.body = parseResult.data;

  //   console.log(req.body, "After zod validation -- user routes ts");
  //   next();
  // },

  validateRequest(createDoctorZodSchema),

  UserController.createDoctor,
);

// router.post("/create-admin", UserController.createDoctor);
// router.post("/create-superadmin", UserController.createDoctor);

export const UserRoutes = router;
