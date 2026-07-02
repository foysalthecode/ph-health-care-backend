import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { AppoinmentController } from "./appoinment.controller";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", checkAuth(Role.PATIENT), AppoinmentController.bookAppointment);
router.get(
  "/my-appoinments",
  checkAuth(Role.PATIENT, Role.DOCTOR),
  AppoinmentController.getMyAppoinments,
);
router.patch(
  "/change-appoinment-status/:id",
  checkAuth(Role.PATIENT, Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN),
  AppoinmentController.changeAppointmentStatus,
);
router.get(
  "/my-single-appoinment/:id",
  checkAuth(Role.PATIENT, Role.DOCTOR),
  AppoinmentController.getMySingleAppointment,
);
router.get(
  "/all-appoinments",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AppoinmentController.getAllAppointments,
);
router.post(
  "/",
  checkAuth(Role.PATIENT),
  AppoinmentController.bookAppointmentWithPayLater,
);
router.post("/", checkAuth(Role.PATIENT), AppoinmentController.initiatePayment);

export const AppoinmentRoutes = router;
