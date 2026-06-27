import z from "zod";

const createScheduleZodSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid Date Format",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid Date Format",
  }),
  startTime: z
    .string()
    .refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
      message: "Invalid Time Formate",
    }),
  endTime: z
    .string()
    .refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
      message: "Invalid Time Formate",
    }),
});

const updateScheduleZodSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid Date Format",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid Date Format",
  }),
  startTime: z
    .string()
    .refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
      message: "Invalid Time Formate",
    }),
  endTime: z
    .string()
    .refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
      message: "Invalid Time Formate",
    }),
});

export const scheduleValidation = {
  createScheduleZodSchema,
  updateScheduleZodSchema,
};
