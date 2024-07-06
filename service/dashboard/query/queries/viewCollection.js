import { DataTypes } from "../../../../constants/index.js";
import db from "../../../../util/db.js";

const query = async (params) => {
    const { collection } = params;
    const data = await db.collection(collection).find().toArray();
    return data;
};

export default {
    query,
    title: "View content of collection",
    params: { collection: DataTypes.string },
};
