import { DataTypes } from "../../../../constants/index.js";
import AppConfig from "../../../../model/AppConfig.js";

const query = async params => {
    await AppConfig.create({
        city: "delhi",
        key: "topEvents",
        data: []
    });
    await AppConfig.create({
        city: "delhi",
        key: "topVenues",
        data: []
    });
}

export default {
    query,
    title: "Init App config",
    params: {
        id: DataTypes.string,
    }
}