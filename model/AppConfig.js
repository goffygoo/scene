import mongoose from "mongoose";
import modelWrapper from "./modelWrapper.js";

const Schema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
  },
});

export default modelWrapper(mongoose.model("AppConfig", Schema));
