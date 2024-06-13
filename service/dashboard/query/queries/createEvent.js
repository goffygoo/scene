import { DataTypes } from "../../../../constants/index.js";
import db from "../../../../util/db.js";

const query = async params => {
    const {
        name,
        isActive,
        venue,
        price
    } = params;
    return db.collection('events').insertOne({
        name,
        isActive,
        venue,
        price
    });
}

export default {
    query,
    title: "Create new Event",
    params: {
        name: DataTypes.string,
        isActive: DataTypes.boolean,
        venue: DataTypes.string,
        price: DataTypes.number,
    }
}