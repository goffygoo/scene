import jwt from "jsonwebtoken";
import User from "../../model/User.js";
import Otp from "../../model/Otp.js";
import db from "../../util/db.js";
import { generateOtp, generateRefreshToken } from "./utils.js";
import { httpRequest } from "../../util/index.js";
import { REFRESH_TOKEN_EXPIRE_TIME } from "../../constants/index.js";
import { sendOtpMail } from "../../util/mail/index.js";
import config from "../../constants/config.js";

const {
  GOOGLE_TOKEN_URL,
  GOOGLE_CLIENT_ID_ANDROID,
  GOOGLE_CLIENT_SECRET_ANDROID,
} = config;

const login = async ({ body }) => {
  const { email } = body;
  let session = null;
  try {
    session = await db.startSession();
    session.startTransaction();
    const OTP = generateOtp();
    await Otp.deleteOne({ email }, session);
    await Otp.create(
      [
        {
          email,
          value: OTP,
        },
      ],
      session
    );
    await sendOtpMail(email, OTP);
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
  let session = null;
  try {
    session = await db.startSession();
    session.startTransaction();
    const otpObject = await Otp.findOne({ email }, session);
    if (!otpObject || otpObject.value !== otp) throw Error();
    await Otp.deleteOne({ email }, session);
    const user = await User.findOne({ email }, session);
    let refreshToken = generateRefreshToken();
    let tokenEAT = Date.now() + REFRESH_TOKEN_EXPIRE_TIME;
    let userId;
    if (!user) {
      const [newUser] = await User.create(
        [
          {
            email,
            refreshToken,
            tokenEAT,
          },
        ],
        session
      );
      userId = newUser._id;
    } else {
      userId = user._id;
      if (!user.refreshToken || user.tokenEAT <= Date.now()) {
        await User.findByIdAndUpdate(
          userId,
          {
            refreshToken,
            tokenEAT,
          },
          session
        );
      } else {
        refreshToken = user.refreshToken;
      }
    }
    const accessToken = AccessModule.generateAccessToken({
      userId,
      email,
    });
    await session.commitTransaction();
    return {
      refreshToken,
      accessToken,
      userId,
    };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

const googleLogin = async ({ body }) => {
  const { code } = body;
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
  let userId = user._id;
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
    await User.findByIdAndUpdate(userId, {
      refreshToken,
      tokenEAT,
    });
  } else {
    refreshToken = user.refreshToken;
  }
  const accessToken = AccessModule.generateAccessToken({
    userId,
    email,
  });
  return {
    refreshToken,
    accessToken,
    userId,
  };
};

const updateProfile = async ({ body, locals }) => {
  const { userData } = locals;
  const { userId } = userData;
  const { name, dob, gender } = body;
  const dateObject = new Date(dob.year, dob.month, dob.day);
  const dobParsed = {
    day: dateObject.getDate(),
    month: dateObject.getMonth(),
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
