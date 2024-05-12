import { REFRESH_TOKEN_EXPIRE_TIME } from "../../constants/index.js";
import AdminOtp from "../../model/AdminOtp.js";
import { sendOtpResetPassword } from "../../util/mail/index.js";
import Admin from "../../model/Admin.js";
import {
  decodeAccessToken,
  generateAccessToken,
  processPassword,
  generateOtp,
  generateRefreshToken,
} from "./utils.js";

import db from "../../util/db.js";

const forgotPassword = async ({ body }) => {
  const { email } = body;
  let session = null;
  try {
    session = await db.startSession();
    session.startTransaction();
    const admin = await Admin.findOneAndSelect({ email }, { _id: 1 }, session);
    if (!admin) {
      throw Error();
    }
    const OTP = generateOtp();
    await AdminOtp.deleteOne({ email }, session);
    await AdminOtp.create(
      [
        {
          email,
          value: OTP,
        },
      ],
      session
    );
    await sendOtpResetPassword(email, OTP);
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

const verifyOtp = async ({ body }) => {
  const { otp, email } = body;
  const otpObject = await AdminOtp.findOne({ email });
  if (!otpObject || otpObject.value !== otp) throw Error();
  await AdminOtp.deleteOne({ email });
  const resetToken = generateAccessToken({
    email,
    resetPassword: true,
  });
  return {
    resetToken,
  };
};

const resetPassword = async ({ body }) => {
  const { resetToken, password } = body;
  const tokenPayload = decodeAccessToken(resetToken);
  const { resetPassword, email } = tokenPayload;
  if (!resetPassword) throw Error();
  const refreshToken = generateRefreshToken();
  const tokenEAT = Date.now() + REFRESH_TOKEN_EXPIRE_TIME;
  await Admin.findOneAndUpdate(
    { email },
    {
      password: processPassword(password),
      refreshToken,
      tokenEAT,
    }
  );
};

const login = async ({ body }) => {
  const { email, password } = body;
  const admin = await Admin.findOne({ email });
  if (!admin || admin.password !== processPassword(password)) throw Error();
  const { _id: userId, refreshToken } = admin;
  const accessToken = generateAccessToken({
    userId,
    email,
    admin: true,
  });
  return {
    refreshToken,
    accessToken,
    userId,
  };
};

const newAccessToken = async ({ body }) => {
  const { userId, refreshToken } = body;
  const admin = await Admin.findByIdAndSelect(userId, {
    refreshToken: 1,
    tokenEAT: 1,
  });
  if (
    !(admin && admin.refreshToken === refreshToken && Date.now() < admin.tokenEAT)
  ) {
    throw Error("Invalid data");
  }
  const accessToken = generateAccessToken({
    userId,
    email: admin.email,
    admin: true,
  });
  return {
    accessToken,
  };
};

export default {
  service: {
    login,
    forgotPassword,
    verifyOtp,
    resetPassword,
    newAccessToken,
  },
};
