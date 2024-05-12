import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRE_TIME_IN_SECS } from "../../constants/index.js";
import config from "../../constants/config.js";
import { randomUUID, createHash } from "crypto";

const { PASSWORD_SALT, JWT_SECRET_KEY } = config;

export const generateAccessToken = (data) => {
  const accessToken = jwt.sign(data, JWT_SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRE_TIME_IN_SECS,
  });
  return accessToken;
};

export const decodeAccessToken = (token) => {
  try {
    const decodedData = jwt.verify(token, JWT_SECRET_KEY);
    return decodedData;
  } catch (err) {
    return null;
  }
};

export const generateOtp = () => {
  let value = Math.ceil(Math.random() * 10000).toString();
  while (value.length !== 4) {
    value = "0" + value;
  }
  return value;
};

export const generateRefreshToken = () => {
  return randomUUID().split("-").join("");
};

export const processPassword = (password) => {
  const hash = createHash("sha256");
  hash.write(password + PASSWORD_SALT);
  return hash.digest("base64");
};
