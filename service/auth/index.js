import admin from "./admin.js";
import organiser from "./organiser.js";
import user from "./user.js";
import {
  decodeAccessToken,
  generateAccessToken,
  generateOtp,
  generateRefreshToken,
  processPassword,
} from "./utils.js";

export default {
  admin,
  organiser,
  user,
  decodeAccessToken,
  generateAccessToken,
  generateOtp,
  generateRefreshToken,
  processPassword,
};
