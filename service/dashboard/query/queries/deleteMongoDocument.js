import { DataTypes } from "../../../../constants/index.js";
import db from "../../../../util/db.js";
import mongoose from "mongoose";

const query = async (params) => {
  const { collection, id } = params;
  const objectId = mongoose.mongo.ObjectId(id);
  const data = await db.collection(collection).deleteOne({ _id: objectId });
  return data;
};

export default {
  query,
  title: "Delete document of a collection",
  params: { collection: DataTypes.string, id: DataTypes.string },
};
