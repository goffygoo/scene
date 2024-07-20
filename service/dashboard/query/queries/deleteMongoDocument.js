import { DataTypes } from "../../../../constants/index.js";
import db from "../../../../util/db.js";

const query = async (params) => {
  const { collection, id } = params;
  const data = await db.collection(collection).deleteOne({ _id: id });
  return data;
};

export default {
  query,
  title: "Delete document of a collection",
  params: { collection: DataTypes.string, id: DataTypes.string },
};
