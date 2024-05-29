import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";

const Schema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  expireAt: {
    type: Date,
    expires: "3s",
    default: Date.now,
  },
});

export default modelWrapper(mongoose.model("DistributedLock", Schema));
