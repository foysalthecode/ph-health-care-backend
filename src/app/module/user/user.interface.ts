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
    deletedAt: string
  };
  spcialities: string[];
}
