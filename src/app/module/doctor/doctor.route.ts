import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();

router.get("/", doctorController.getAllDoctors);

router.delete("/:id", doctorController.deleteDoctor);

export const DoctorRoutes = router;
