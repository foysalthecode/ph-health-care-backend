import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { IndexRotues } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";

const app: Application = express();

app.set("view engine", "ejs");
app.set("view", path.resolve(process.cwd(), `src/app/templates`));

app.use("/api/auth", toNodeHandler(auth));

app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// specialities routes

app.use("/api/v1/", IndexRotues);

// Basic route
app.get("/", async (req: Request, res: Response) => {
  const speciality = await prisma.speciality.create({
    data: {
      title: "Cardiology ",
    },
  });
  res.status(200).json({
    success: true,
    message: "Api is working",
    data: speciality,
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(globalErrorHandler);
app.use(notFound);

export default app;
