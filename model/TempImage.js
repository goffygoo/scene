import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";

const Schema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default modelWrapper(mongoose.model("TempImage", Schema));