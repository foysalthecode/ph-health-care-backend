import { AppoinmentService } from "./appoinment.service";
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const bookAppointment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  const appoinment = await AppoinmentService.bookAppointment(payload, user);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Appoinment Booked Successfully",
    data: appoinment,
  });
});
const getMyAppoinments = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await AppoinmentService.getMyAppoinments(user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "",
    data: result,
  });
});

const changeAppointmentStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AppoinmentService.changeAppointmentStatus();
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "",
      data: result,
    });
  },
);

const getMySingleAppointment = catchAsync(
  async (req: Request, res: Response) => {
    const appointmentId = req.params.id;
    const user = req.user;
    const result = await AppoinmentService.getMySingleAppointment(
      appointmentId as string,
      user,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "",
      data: result,
    });
  },
);
const getAllAppointments = catchAsync(async (req: Request, res: Response) => {
  const result = await AppoinmentService.getAllAppointments();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "",
    data: result,
  });
});
const bookAppointmentWithPayLater = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AppoinmentService.bookAppointmentWithPayLater();
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "",
      data: result,
    });
  },
);
const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await AppoinmentService.initiatePayment();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "",
    data: result,
  });
});
const cancelUnpaidAppointments = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AppoinmentService.cancelUnpaidAppointments();
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "",
      data: result,
    });
  },
);

export const AppoinmentController = {
  bookAppointment,
  getMyAppoinments,
  changeAppointmentStatus,
  getMySingleAppointment,
  getAllAppointments,
  bookAppointmentWithPayLater,
  initiatePayment,
  cancelUnpaidAppointments,
};
