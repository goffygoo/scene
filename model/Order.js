import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";
import { ORDER_STATUS } from "../constants/index.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
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
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: [
            ORDER_STATUS.CREATED,
            ORDER_STATUS.SUCCESS,
            ORDER_STATUS.REFUNDED,
            ORDER_STATUS.FAILED,
        ],
        default: ORDER_STATUS.CREATED,
    },
    pgOrderId: {
        type: String,
    },
    pgPaymentId: {
        type: String,
    }
}, { timestamps: true });

export default modelWrapper(mongoose.model("Order", Schema));
