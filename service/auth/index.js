import user from "./user.js";
import organiser from "./organiser.js";
import {
  decodeAccessToken,
  generateAccessToken,
  generateOtp,
  generateRefreshToken,
  processPassword,
} from "./utils.js";

export default {
  user,
  organiser,
  generateAccessToken,
  generateRefreshToken,
  decodeAccessToken,
  processPassword,
  generateOtp,
};
