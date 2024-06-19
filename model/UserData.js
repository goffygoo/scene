import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
    fcmTokens: {
        type: Array,
    },
    userId: {
        type: ObjectId,
        required: true,
    },
});

export default modelWrapper(mongoose.model("UserData", Schema));
