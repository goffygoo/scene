import Venue from "../../model/Venue.js";
import { saveFilesBulk } from "../../util/files.js";
import cities from "../../constants/cities.js";

const POST = async ({ body }) => {
    const {
        name,
        address,
        city,
        logo,
        gallery,
        banner
    } = body;
    await createVenue({
        name,
        city,
        address,
        logo,
        gallery,
        banner
    });
}

const createVenue = async ({
    name,
    city,
    address,
    logo,
    gallery,
    banner
}) => {
    if (!cities[city]) throw Error('Invalid city');
    const imageArray = [logo, ...gallery, banner];
    await saveFilesBulk(imageArray);
    const venue = await Venue.create({
        name,
        city,
        address,
        logo,
        gallery,
        banner
    });
    return venue;
}

export default {
    service: {
        POST,
    },
    createVenue
}