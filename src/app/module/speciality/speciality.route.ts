import { Router } from "express";
import { specialityController } from "./speciality.controller";

const router = Router();

router.post("/", specialityController.createSpeciality);

router.get("/", specialityController.GetAllSpeciality);

router.delete("/:id", specialityController.DeleteSpeciality);

router.put("/:id", specialityController.UpdateSpeciality);

export const SpecialityRoutes = router;
