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
    ref: "Venue",
  },
  time: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
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
