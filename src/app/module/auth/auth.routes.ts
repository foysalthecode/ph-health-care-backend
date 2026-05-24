import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/register", AuthController.registerPatient);

router.post("/login", AuthController.lgoinUser);

export const AuthRoutes = router;
