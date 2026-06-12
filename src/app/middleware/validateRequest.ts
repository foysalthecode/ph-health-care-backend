import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateRequest = (zodSchema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = zodSchema.safeParse(req.body);

    if (!parseResult.success) {
      next(parseResult.error);
    }
    //sanitize data
    req.body = parseResult.data;

    console.log(req.body, "After zod validation -- user routes ts");
    next();
  };
};
