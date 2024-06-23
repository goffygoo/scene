import { DataTypes } from "../../../../constants/index.js";
import AppConfig from "../../../../model/AppConfig.js";

const query = async params => {
    return AppConfig.find({});
}

export default {
    query,
    title: "show App config",
    params: {
        id: DataTypes.string,
    }
}