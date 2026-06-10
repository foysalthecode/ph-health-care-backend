import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = (Fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Fn(req, res, next);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      next(err);
    }
  };
};
