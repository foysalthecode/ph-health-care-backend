import { Router } from "express";
import { SpecialityRoutes } from "../module/speciality/speciality.route";
import { AuthRoutes } from "../module/auth/auth.routes";

const router = Router();

router.use("/auth", AuthRoutes);

router.use("/specialities", SpecialityRoutes);

export const IndexRotues = router;
