import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";
import { types } from "../constants/liveConfig.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
    parent: {
        type: ObjectId,
        ref: "Venue"
    },
    name: {
        type: String,
    },
    abbreviation: {
        type: String,
    },
    city: {
        type: String,
    },
    address: {
        type: String,
    },
    location: {
        type: Object,
    },
    type: {
        type: String,
        enum: [types.college.title],
    },
    logo: {
        type: String,
    },
    bannerImage: {
        type: String,
    },
    gallery: {
        type: [String],
        default: undefined
    },
    tags: {
        type: [String],
        default: undefined
    },
    keywords: {
        type: [String],
        default: undefined
    },
    editor: {
        type: ObjectId,
    },
});

export default modelWrapper(mongoose.model("VenueUpdate", Schema));
