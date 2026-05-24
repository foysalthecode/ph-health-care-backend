import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { IndexRotues } from "./app/routes";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

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

export default app;
