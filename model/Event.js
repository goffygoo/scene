import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  venue: {
    type: ObjectId,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  showAds: {
    type: Boolean,
  },
  installApps: {
    type: [{
      iOS: String,
      android: String,
      name: String,
      logo: String,
    }]
  },
  about: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  logo: {
    type: String,
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
  specialTags: {
    type: [String],
    default: [],
  },
  boost: {
    type: Number,
    default: 1,
  },
  keywords: {
    type: [String],
    default: [],
  },
  creator: {
    type: ObjectId,
    required: true,
  },
});

export default modelWrapper(mongoose.model("Event", Schema));
