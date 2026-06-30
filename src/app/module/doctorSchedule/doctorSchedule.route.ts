import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { doctorScheduleController } from "./doctorSchedule.controller";

const router = Router();

router.post(
  "/create-my-doctor-schedule",
  checkAuth(Role.DOCTOR),
  doctorScheduleController.createSchedule,
);

router.get(
  "/my-doctor-schedules",
  checkAuth(Role.DOCTOR),
  doctorScheduleController.getMyDoctorSchedule,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  doctorScheduleController.getAllDoctorSchedules,
);

router.get(
  "/:doctorID/schedule/:scheduleId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  doctorScheduleController.getDoctorScheduleById,
);

router.patch(
  "/update-my-doctor-schedule",
  checkAuth(Role.DOCTOR),
  doctorScheduleController.updateMyDoctorSchedule,
);

router.delete(
  "/deleted-my-doctor-schedule/:id",
  checkAuth(Role.DOCTOR),
  doctorScheduleController.deleteMyDoctorSchedule,
);

export const doctorScheduleRoutes = router;
