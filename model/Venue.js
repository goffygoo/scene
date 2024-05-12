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
  tags: {
    type: [String],
    default: [],
  },
  keywords: {
    type: [String],
    default: [],
  },
  events: {
    type: [{ type: ObjectId, ref: "Event" }],
    default: [],
  },
  editor: {
    type: ObjectId,
    required: true,
  },
  approver: {
    type: ObjectId,
  },
});

export default modelWrapper(mongoose.model("Venue", Schema));
