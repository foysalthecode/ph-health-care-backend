import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { updateDoctorZodSchema } from "./doctor.validation";

const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  doctorController.getAllDoctors,
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  doctorController.getDoctorById,
);

router.patch(
  "/:id",
  validateRequest(updateDoctorZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  doctorController.updateDoctor,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  doctorController.deleteDoctor,
);

export const DoctorRoutes = router;
