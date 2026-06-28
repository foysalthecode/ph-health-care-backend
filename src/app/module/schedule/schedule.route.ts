import { validateRequest } from "./../../middleware/validateRequest";
import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { scheduleController } from "./schedule.controller";
import { scheduleValidation } from "./schedule.validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(scheduleValidation.createScheduleZodSchema),
  scheduleController.createSchedule,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
  scheduleController.getAllSchedule,
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
  scheduleController.getScheduleById,
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(scheduleValidation.updateScheduleZodSchema),
  scheduleController.updateSchedule,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  scheduleController.deleteSchedule,
);

export const scheduleRoutes = router;
