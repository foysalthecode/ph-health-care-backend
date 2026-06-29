import { Router } from "express";
import { SpecialityRoutes } from "../module/speciality/speciality.route";
import { AuthRoutes } from "../module/auth/auth.routes";
import { UserRoutes } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";
import { doctorScheduleRoutes } from "../module/doctorSchedule/doctorSchedule.route";
import { scheduleRoutes } from "../module/schedule/schedule.route";
import { AppoinmentRoutes } from "../module/appoinment/appoinment.route";

const router = Router();

router.use("/auth", AuthRoutes);

router.use("/specialities", SpecialityRoutes);

router.use("/users", UserRoutes);

router.use("/doctors", DoctorRoutes);

router.use("/schedules", scheduleRoutes);

router.use("/doctor-schedules", doctorScheduleRoutes);

router.use("/appoinments", AppoinmentRoutes);

export const IndexRotues = router;
