import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createDoctorZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/create-doctor",
  // (req: Request, res: Response, next: NextFunction) => {
  //   const parseResult = createDoctorZodSchema.safeParse(req.body);

  //   if (!parseResult.success) {
  //     next(parseResult.error);
  //   }                                                this commented part is for example --> like it can be done by this way

  //   req.body = parseResult.data;

  //   console.log(req.body, "After zod validation -- user routes ts");
  //   next();
  // },

  validateRequest(createDoctorZodSchema),

  UserController.createDoctor,
);

// router.post("/create-admin", UserController.createDoctor);
// router.post("/create-superadmin", UserController.createDoctor);

export const UserRoutes = router;
