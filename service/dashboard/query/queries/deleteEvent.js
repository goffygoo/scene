import { DataTypes } from "../../../../constants/index.js";
import Event from "../../../../model/Event.js";

const query = async params => {
    const { id } = params;
    return Event.deleteOne({ _id: id });
}

export default {
    query,
    title: "Delete Event by Id",
    params: {
        id: DataTypes.string,
    }
}