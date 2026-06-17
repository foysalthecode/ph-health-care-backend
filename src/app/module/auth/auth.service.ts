import status from "http-status";
import { Role, UserStatus } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";
import {
  IChangePasswordPayload,
  ILoginUserPayload,
  IRegisterPatientPayload,
} from "./auth.interface";

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
    // throw new Error("Failed to register patient");
    throw new AppError(status.BAD_REQUEST, "Failed to register patient");
  }

  //   TODO: create patient profile after sign up of patient in user model

  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });
      return patientTx;
    });

    const accessToken = tokenUtils.getAccessToken({
      userID: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVarified: data.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
      userID: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVarified: data.user.emailVerified,
    });

    return { ...data, accessToken, refreshToken, patient };
  } catch (error) {
    console.log("transaction error in auth service register user", error);
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw error;
  }
};

const loginUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.status === UserStatus.BLOCKED) {
    // throw new Error("Your account is blocked. Please contact support.");
    throw new AppError(
      status.FORBIDDEN,
      "Your account is blocked. Please contact support.",
    );
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    // throw new Error("Your account has been deleted. Please contact support.");
    throw new AppError(
      status.NOT_FOUND,
      "Your account has been deleted. Please contact support.",
    );
  }

  const accessToken = tokenUtils.getAccessToken({
    userID: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVarified: data.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userID: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVarified: data.user.emailVerified,
  });

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

const getMe = async (user: IRequestUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      patient: {
        include: {
          appointment: true,
          prescription: true,
          review: true,
          medicalReports: true,
          patientHealthData: true,
        },
      },
      doctor: {
        include: {
          specialities: true,
          appointment: true,
          review: true,
          prescription: true,
        },
      },
      admin: true,
    },
  });

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, "User Not Found");
  }

  return isUserExists;
};

const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!isSessionTokenExists) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session Token");
  }

  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET,
  );

  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError(status.UNAUTHORIZED, "Invalid Refresh Token");
  }

  const data = verifiedRefreshToken as JwtPayload;

  const newAccessToken = tokenUtils.getAccessToken({
    userID: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVarified: data.emailVerified,
  });

  const newRefreshToken = tokenUtils.getRefreshToken({
    userID: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVarified: data.emailVerified,
  });

  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token,
  };
};

const changePassword = async (
  payload: IChangePasswordPayload,
  sessionToken: string,
) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (!session) {
    throw new AppError(status.UNAUTHORIZED, "Invalid Session token");
  }

  const { currentPassword, newPassword } = payload;

  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (session.user.needsPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        needsPasswordChnage: false,
      },
    });
  }

  const accessToken = tokenUtils.getAccessToken({
    userID: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVarified: session.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userID: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVarified: session.user.emailVerified,
  });

  return { ...result, accessToken, refreshToken };
};

const logOutUser = async (sessionToken: string) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  return result;
};

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });

  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });
  }
};

export const forgetPassword = async (email: string) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User Not Found");
  }

  if (!isUserExist.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "Email Not verified");
  }

  if (isUserExist.isDeleted || isUserExist.status === "DELETED") {
    throw new AppError(status.NOT_FOUND, "User Not Found");
  }

  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email,
    },
  });
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User Not Found");
  }

  if (!isUserExist.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "Email Not verified");
  }

  if (isUserExist.isDeleted || isUserExist.status === "DELETED") {
    throw new AppError(status.NOT_FOUND, "User Not Found");
  }

  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword,
    },
  });

  if (isUserExist.needsPasswordChange) {
    await prisma.user.update({
      where: {
        id: isUserExist.id,
      },
      data: {
        needsPasswordChnage: false,
      },
    });
  }

  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id,
    },
  });
};

const googleLoginSuccess = async() =>{}

export const AuthService = {
  registerPatient,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logOutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
};
