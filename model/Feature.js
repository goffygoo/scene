import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
    key: {
        type: String,
        unique: true,
        required: true,
    },
    value: {
        type: Boolean,
        default: false,
    },
    userIds: {
        type: [ObjectId],
        default: [],
    },
});

export default modelWrapper(mongoose.model("Feature", Schema));
