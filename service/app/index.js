import venue from "./venue.js"
import { cities, types } from "../../constants/liveConfig.js";

const getCities = async () => {
    return Object.values(cities);
}

const getTypes = async () => {
    return Object.values(types);
}

export default {
    service: {
        getCities,
        getTypes
    },
    venue,
}