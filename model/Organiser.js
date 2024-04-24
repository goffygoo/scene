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
});

export default modelWrapper(mongoose.model("Organiser", Schema));