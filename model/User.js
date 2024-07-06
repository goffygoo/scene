import mongoose from "mongoose";
import DateSchema from "./schema/Date.js";
import { GENDER } from "../constants/index.js";
import modelWrapper from "./modelWrapper.js";
const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profileComplete: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
  },
  tokenEAT: {
    type: Date,
  },
  profile: {
    name: {
      type: String,
    },
    dob: {
      type: DateSchema,
    },
    gender: {
      type: String,
      enum: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER],
    },
  },
  tickets: {
    type: [{ type: ObjectId, ref: "Ticket" }],
  },
  devices: {
    type: [{ type: ObjectId, ref: "DeviceData" }],
    default: [],
  },
});

export default modelWrapper(mongoose.model("User", Schema));
