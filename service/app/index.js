import venue from "./venue.js"
import cities from "../../constants/cities.js";
import types from "../../constants/types.js";

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