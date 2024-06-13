import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";

const Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  tokenEAT: {
    type: Date,
  },
  superAdmin: {
    type: Boolean,
    default: false,
  }
});

export default modelWrapper(mongoose.model("Admin", Schema));
