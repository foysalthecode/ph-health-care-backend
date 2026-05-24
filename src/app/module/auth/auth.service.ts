import { Role } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";

interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

const registerPatient = async (payload: IRegisterPatientPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role: Role.PATIENT,
    },
  });

  if (!data.user) {
    throw new Error("Failed to register patient");
  }

  //   TODO: create patient profile after sign up of patient in user model

  //   const patient = await prisma.$transaction(async (tx) =>{
  //     await tx.patient
  //   })

  return data;
};

export const AuthService = {
  registerPatient,
};
