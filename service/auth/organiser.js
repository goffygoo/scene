import { REFRESH_TOKEN_EXPIRE_TIME } from "../../constants/index.js";
import OrganiserOtp from "../../model/OrganiserOtp.js";
import CommsModule from "../../service/comms/index.js";
import Module from "../../service/app/event.js";
import Organiser from "../../model/Organiser.js";
import {
  decodeAccessToken,
  generateAccessToken,
  processPassword,
  generateOtp,
  generateRefreshToken,
} from "./utils.js";

const forgotPassword = async ({ body }) => {
  const { email } = body;
  const organiser = await Organiser.findOneAndSelect(
    { email },
    { _id: 1 }
  );
  if (!organiser) {
    throw Error('Invalid email');
  }
  const OTP = generateOtp();
  await OrganiserOtp.deleteOne({ email });
  await OrganiserOtp.create({
    email,
    value: OTP,
  });
  await CommsModule.mail.sendOtpResetPassword(email, OTP);
};

const verifyOtp = async ({ body }) => {
  const { otp, email } = body;
  const otpObject = await OrganiserOtp.findOne({ email });
  if (!otpObject || otpObject.value !== otp) throw Error();
  await OrganiserOtp.deleteOne({ email });
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
  await Organiser.findOneAndUpdate(
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
  const organiser = await Organiser.findOne({ email });
  if (!organiser || organiser.password !== processPassword(password))
    throw Error("Invalid data");
  const { _id: userId, refreshToken } = organiser;
  const accessToken = generateAccessToken({
    userId,
    email,
    organiser: true,
  });
  return {
    refreshToken,
    accessToken,
    userId,
  };
};

const newAccessToken = async ({ body }) => {
  const { userId, refreshToken } = body;
  const organiser = await Organiser.findByIdAndSelect(userId, {
    refreshToken: 1,
    tokenEAT: 1,
  });
  if (
    !(
      organiser &&
      organiser.refreshToken === refreshToken &&
      Date.now() < organiser.tokenEAT
    )
  ) {
    throw Error("Invalid data");
  }
  const accessToken = generateAccessToken({
    userId,
    email: organiser.email,
    organiser: true,
  });
  return {
    accessToken,
  };
};

const staffLogin = async ({ body }) => {
  const eventId = body.eventId;
  const event = Module.getEvent(eventId);
  if (!event) throw Error("Invalid data");
  return {};
};

export default {
  service: {
    login,
    forgotPassword,
    verifyOtp,
    resetPassword,
    newAccessToken,
    staffLogin,
  },
};
