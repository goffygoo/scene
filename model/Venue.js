import mongoose from "mongoose";
import { VENUE_TYPE } from "../constants/index.js";
import modelWrapper from "./modelWrapper.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  name: {
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
    enum: [VENUE_TYPE.COLLEGE],
    default: VENUE_TYPE.COLLEGE,
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
  creator: {
    type: ObjectId,
  },
});

export default modelWrapper(mongoose.model("Venue", Schema));
