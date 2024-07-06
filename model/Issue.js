import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    summary: {
        type: String,
    },
    resolved: {
        type: Boolean,
        default: false,
    },
    assignedTo: {
        type: ObjectId,
        ref: "Admin"
    },
}, { timestamps: true });

export default modelWrapper(mongoose.model("Issue", Schema));
