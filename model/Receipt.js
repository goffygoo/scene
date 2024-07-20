import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema(
  {
    eventId: {
      type: ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

Schema.index({ userId: 1, eventId: 1 }, { unique: true });

export default modelWrapper(mongoose.model("Receipt", Schema));
