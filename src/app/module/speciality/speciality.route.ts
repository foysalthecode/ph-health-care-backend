/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { specialityController } from "./speciality.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  specialityController.createSpeciality,
);

router.get("/", specialityController.GetAllSpeciality);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  specialityController.DeleteSpeciality,
);

router.put("/:id", specialityController.UpdateSpeciality);

export const SpecialityRoutes = router;
