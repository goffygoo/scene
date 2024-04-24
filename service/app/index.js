import venue from "./venue.js"
import cities from "../../constants/cities.js";

const getCities = async () => {
    return Object.values(cities);
}

export default {
    service: {
        getCities
    },
    venue,
}