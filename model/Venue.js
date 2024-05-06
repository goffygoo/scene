import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";
import { types } from "../constants/liveConfig.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  abbreviation: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: Object,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: [types.college.title],
    default: types.college.title,
  },
  logo: {
    type: String,
    required: true,
  },
  bannerImage: {
    type: String,
    required: true,
  },
  gallery: {
    type: [String],
    default: [],
  },
  events: {
    type: [{ type: ObjectId, ref: "Event" }],
    default: [],
  },
  creator: {
    type: ObjectId,
    required: true,
  },
});

export default modelWrapper(mongoose.model("Venue", Schema));
