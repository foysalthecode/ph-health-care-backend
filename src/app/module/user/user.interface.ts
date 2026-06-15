import { Gender } from "../../../generated/prisma/enums";

export interface IcreateDoctorePayload {
  password: string;
  doctor: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    registrationNumber: string;
    experience?: number;
    gender: Gender;
    appoinmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
  };
  specialities: string[];
}

export interface ICreateAdminPayload {
  password: string;
  admin: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
  };
  role: "ADMIN" | "SUPER_ADMIN";
}
