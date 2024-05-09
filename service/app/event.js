import { eventTags } from "../../constants/liveConfig.js";
import Event from "../../model/Event.js";
import Venue from "../../model/Venue.js";
import { deleteFilesBulk, saveFilesBulk } from "../../util/files.js";
import EventMS from "./search/model/Event.js";

const POST = async ({ body, locals }) => {
    const {
        bannerImage,
        venueId,
        name,
        time,
        price,
        boost,
        note,
        gallery,
        tags,
        keywords,
        logo,
    } = body;
    const { userId: creator } = locals.userData;
    const venue = await Venue.findById(venueId);
    if (!venue) throw Error('Invalid Venue Id');
    for (const tag of tags) {
        if (!eventTags[tag]) throw Error('Invalid tag');
    }
    await createEvent({
        bannerImage,
        venueId,
        name,
        time,
        price,
        boost,
        note,
        gallery,
        tags,
        keywords,
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
    keywords,
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
        keywords,
        logo,
        creator,
    });
    await EventMS.createOrReplaceOne(
        {
            id: event._id.toString(),
            venueId,
            name,
            time,
            boost: event.boost,
            tags,
            keywords,
        },
        cityKey
    );
    return event;
};

const GET = async ({ body }) => {
    const { eventId } = body;
    return getEvent(eventId);
}

const getEvent = async (eventId) => {
    return Event.findById(eventId);
}

const PATCH = async ({ body, locals }) => {
    const { userId } = locals.userData;
    const { eventId, eventData } = body;
    const event = await getEvent(eventId);
    if (event.creator !== userId) throw Error('Not the owner');
    return updateEvent(event, {
        ...eventData,
        venueId: undefined,
        price: undefined,
        boost: undefined,
        specialTags: undefined
    });
}

const updateEvent = async (event, eventData) => {
    const {
        bannerImage,
        venueId,
        name,
        time,
        price,
        about,
        note,
        gallery,
        boost,
        tags,
        specialTags,
        keywords,
        logo,
    } = eventData;
    const eventId = event._id.toString();
    const oldVenue = await Venue.findByIdAndSelect(event.venueId.toString(), { city: 1 });
    let city = oldVenue.city;
    if (venueId) {
        const newVenue = await Venue.findByIdAndSelect(venueId.toString(), { city: 1 });
        if (newVenue._id.toString() !== oldVenue._id.toString()) {
            city = newVenue.city;

            if (newVenue.city !== oldVenue.city) {
                await EventMS.deleteById(eventId, oldVenue.city);
            }

            await Venue.findByIdAndUpdate(oldVenue._id, {
                $pull: { events: eventId }
            })

            await Venue.findByIdAndUpdate(newVenue._id, {
                $push: { events: eventId }
            })
        }
    }

    const deleteImages = [], createImages = [];
    if (bannerImage && bannerImage !== event.bannerImage) {
        deleteImages.push(event.bannerImage);
        createImages.push(bannerImage);
    }
    if (logo && logo !== event.logo) {
        deleteImages.push(event.logo);
        createImages.push(logo);
    }
    const oldGallerySet = new Set(event.gallery);
    const newGallerySet = new Set(gallery);
    for (const img of oldGallerySet) {
        if (!newGallerySet.has(img)) {
            deleteImages.push(img);
        }
    }
    for (const img of newGallerySet) {
        if (!oldGallerySet.has(img)) {
            createImages.push(img);
        }
    }
    await saveFilesBulk(createImages);
    await deleteFilesBulk(deleteImages);

    const msTags = [];
    if (tags) {
        msTags.push(...tags);
    } else {
        msTags.push(...event.tags);
    }
    if (specialTags) {
        msTags.push(...specialTags);
    } else {
        msTags.push(...event.specialTags);
    }
    await EventMS.createOrReplaceOne(
        {
            id: event._id.toString(),
            venueId: venueId || oldVenue._id.toString(),
            name: name || oldVenue.name,
            time: time || oldVenue.time,
            boost: boost || oldVenue.boost,
            tags: msTags,
            keywords: keywords || oldVenue.keywords,
        },
        city
    );

    return Event.findByIdAndUpdate(eventId, {
        ...(venueId && { venueId }),
        ...(bannerImage && { bannerImage }),
        ...(name && { name }),
        ...(time && { time }),
        ...(price && { price }),
        ...(about && { about }),
        ...(note && { note }),
        ...(gallery && { gallery }),
        ...(boost && { boost }),
        ...(tags && { tags }),
        ...(specialTags && { specialTags }),
        ...(keywords && { keywords }),
        ...(logo && { logo }),
    });
}

const deleteEvent = async (eventId) => {
    const event = await getEvent(eventId);
    const venue = await Venue.findByIdAndSelect(event.venueId.toString(), { city: 1 });
    await EventMS.deleteById(eventId, venue.city);
    await Venue.findByIdAndUpdate(venue._id, {
        $pull: { events: eventId }
    });
    await Event.deleteOne({ _id: eventId });
}

export default {
    service: {
        POST,
        GET,
        PATCH,
    },
    createEvent,
    getEvent,
    deleteEvent,
    updateEvent,
};
