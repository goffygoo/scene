import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    location: {
        type: Object,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    logo: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        required: true,
    },
    gallery: {
        type: [String],
        default: [],
    },
});

export default modelWrapper(mongoose.model("Event", Schema));