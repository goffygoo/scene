import jwt from "jsonwebtoken";
import User from "../../model/User.js";
import Otp from "../../model/UserOtp.js";
import {
  generateAccessToken,
  generateOtp,
  generateRefreshToken,
} from "./utils.js";
import { httpRequest } from "../../util/index.js";
import { REFRESH_TOKEN_EXPIRE_TIME } from "../../constants/index.js";
import CommsModule from "../../service/comms/index.js";
import config from "../../constants/config.js";

const {
  GOOGLE_TOKEN_URL,
  GOOGLE_CLIENT_ID_ANDROID,
  GOOGLE_CLIENT_SECRET_ANDROID,
} = config;

const login = async ({ body }) => {
  const { email } = body;
  const OTP = generateOtp();
  await Otp.deleteOne({ email });
  await Otp.create({
    email,
    value: OTP,
  });
  CommsModule.mail.sendOtpMail(email, OTP);
};

const verifyOtp = async ({ body, locals }) => {
  const { otp, email } = body;
  const {
    bundleVersion,
    device,
    appVersion,
    deviceId,
  } = locals;
  const otpObject = await Otp.findOne({ email });
  if (!otpObject || otpObject.value !== otp) throw Error('Invalid Email or OTP');
  await Otp.deleteOne({ email });
  const user = await User.findOne({ email });
  let refreshToken = generateRefreshToken();
  let tokenEAT = Date.now() + REFRESH_TOKEN_EXPIRE_TIME;
  let userId;
  if (!user) {
    const newUser = await User.create({
      email,
      refreshToken,
      tokenEAT,
    });
    userId = newUser._id;
  } else {
    userId = user._id;
    if (!user.refreshToken || user.tokenEAT <= Date.now()) {
      await User.findByIdAndUpdate(
        userId,
        {
          refreshToken,
          tokenEAT,
        }
      );
    } else {
      refreshToken = user.refreshToken;
    }
  }
  const accessToken = generateAccessToken({
    userId,
    email,
  });
  await CommsModule.device.upsertDetails({
    bundleVersion,
    device,
    appVersion,
    deviceId,
    userId,
  });
  return {
    refreshToken,
    accessToken,
    userId,
    ...(user && {
      profileComplete: user.profileComplete,
      profile: user.profile
    }),
  };
};

const googleLogin = async ({ body, locals }) => {
  const { code } = body;
  const {
    bundleVersion,
    device,
    appVersion,
    deviceId,
  } = locals;
  const googleResponse = await httpRequest("post", GOOGLE_TOKEN_URL, {
    code,
    client_id: GOOGLE_CLIENT_ID_ANDROID,
    client_secret: GOOGLE_CLIENT_SECRET_ANDROID,
    grant_type: "authorization_code",
  });
  const { id_token } = googleResponse;
  const userData = jwt.decode(id_token);
  const { email } = userData;
  const user = await User.findOne({ email });
  let userId;
  let refreshToken = generateRefreshToken();
  let tokenEAT = Date.now() + REFRESH_TOKEN_EXPIRE_TIME;
  if (!user) {
    const newUser = await User.create({
      email,
      refreshToken,
      tokenEAT,
    });
    userId = newUser._id;
  } else if (!user.refreshToken || user.tokenEAT <= Date.now()) {
    userId = user._id;
    await User.findByIdAndUpdate(userId, {
      refreshToken,
      tokenEAT,
    });
  } else {
    userId = user._id;
    refreshToken = user.refreshToken;
  }
  const accessToken = generateAccessToken({
    userId,
    email,
  });
  await CommsModule.device.upsertDetails({
    bundleVersion,
    device,
    appVersion,
    deviceId,
    userId,
  });
  return {
    refreshToken,
    accessToken,
    userId,
    ...(user && {
      profileComplete: user.profileComplete,
      profile: user.profile
    }),
  };
};

const updateProfile = async ({ body, locals }) => {
  const { userData } = locals;
  const { userId } = userData;
  const { name, dob, gender } = body;
  const dateObject = new Date(dob);
  const dobParsed = {
    day: dateObject.getDate(),
    month: dateObject.getMonth() + 1,
    year: dateObject.getFullYear(),
  };
  await User.findByIdAndUpdate(userId, {
    profileComplete: true,
    profile: {
      name,
      dob: dobParsed,
      gender,
    },
  });
};

const logoutEverywhere = async ({ body }) => {
  const { userId } = body;
  await User.findByIdAndUpdate(userId, {
    refreshToken: "",
    tokenEAT: 0,
  });
};

const newAccessToken = async ({ body }) => {
  const { userId, refreshToken } = body;
  const user = await User.findByIdAndSelect(userId, {
    refreshToken: 1,
    tokenEAT: 1,
  });
  if (
    !(user && user.refreshToken === refreshToken && Date.now() < user.tokenEAT)
  ) {
    throw Error("Invalid data");
  }
  const accessToken = generateAccessToken({
    userId,
    email: user.email,
  });
  return {
    accessToken,
  };
};

export default {
  service: {
    login,
    verifyOtp,
    googleLogin,
    updateProfile,
    logoutEverywhere,
    newAccessToken,
  },
};
