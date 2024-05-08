import Event from "../../model/Event.js";
import Venue from "../../model/Venue.js";
import { saveFilesBulk } from "../../util/files.js";
import EventMS from "./search/model/Event.js";

const POST = async ({ body, locals }) => {
    const {
        bannerImage,
        venueId,
        name,
        time,
        price,
        about,
        note,
        gallery,
        tags,
        logo,
    } = body;
    const { userId: creator } = locals.userData;
    const venue = await Venue.findById(venueId);
    if (!venue) throw Error('Invalid Venue Id');
    await createEvent({
        bannerImage,
        venueId,
        name,
        time,
        price,
        about,
        note,
        gallery,
        tags,
        logo,
        creator,
        cityKey: venue.city,
    });
};

const createEvent = async ({
    bannerImage,
    venueId,
    name,
    time,
    price,
    about,
    note,
    gallery,
    tags,
    logo,
    creator,
    cityKey,
}) => {
    const imageArray = [logo, ...gallery, bannerImage];
    await saveFilesBulk(imageArray);
    const event = await Event.create({
        bannerImage,
        venueId,
        name,
        time,
        price,
        about,
        note,
        gallery,
        tags,
        logo,
        creator,
    });
    await EventMS.createOrReplaceOne(
        {
            id: event._id.toString(),
            venueId,
            name,
            time,
            boost: 1,
            keywords: event.keywords,
            tags,
        },
        cityKey
    );
    return event;
};

export default {
    service: {
        POST,
    },
    createEvent,
};
