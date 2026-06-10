import { Router } from "express";
import { SpecialityRoutes } from "../module/speciality/speciality.route";
import { AuthRoutes } from "../module/auth/auth.routes";
import { UserRoutes } from "../module/user/user.route";

const router = Router();

router.use("/auth", AuthRoutes);

router.use("/specialities", SpecialityRoutes);

router.use("/doctors", UserRoutes);

export const IndexRotues = router;
