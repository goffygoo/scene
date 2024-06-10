import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";
const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  event: {
    type: ObjectId,
    ref: "Event",
    required: true,
  },
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  scanned: {
    type: Boolean,
    default: false,
  },
});

export default modelWrapper(mongoose.model("Ticket", Schema));
