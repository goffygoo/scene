import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
    issueId: {
        type: ObjectId,
        required: true,
        ref: "Issue"
    },
    message: {
        type: String,
    },
    isUser: {
        type: Boolean,
        required: true,
    }
}, { timestamps: true });

export default modelWrapper(mongoose.model("HelpChat", Schema));
