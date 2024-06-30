import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";

const Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    expires: "600s",
    default: Date.now,
  },
});

export default modelWrapper(mongoose.model("AdminOtp", Schema));
