import { eventTags } from "../../constants/liveConfig.js";
import Event from "../../model/Event.js";
import Venue from "../../model/Venue.js";
import EventMS from "./search/model/Event.js";

const POST = async ({ body, locals }) => {
  const {
    bannerImage,
    venueId,
    name,
    startTime,
    endTime,
    price,
    about,
    note,
    gallery,
    tags,
    keywords,
    logo,
  } = body;
  const { userId: creator } = locals.userData;
  if (startTime >= endTime) throw Error("Invalid time");
  for (const tag of tags) {
    if (!eventTags[tag]) throw Error("Invalid tag");
  }
  const venue = await Venue.findById(venueId);
  if (!venue) throw Error("Invalid Venue Id");
  const cityKey = venue.city;
  const event = await Event.create({
    bannerImage,
    venueId,
    name,
    startTime,
    endTime,
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
      time: startTime,
      boost: event.boost,
      bannerImage,
      address: venue.address,
      tags,
      keywords,
    },
    cityKey
  );

  await Venue.findByIdAndUpdate(venueId, {
    $push: { events: event._id },
  });
};

const GET = async ({ body }) => {
  const { eventId } = body;
  return getEvent(eventId);
};

const getEvents = async ({ body }) => {
  const { creatorId } = body;
  const temp = await Event.findAndPopulate({ creator: creatorId }, "venueId");
  const events = [];
  for (let event of temp)
    events.push({
      _id: event._id,
      name: event.name,
      bannerImage: event.bannerImage,
      startTime: event.startTime,
      tags: [...event.tags, ...event.specialTags],
      address: event.venueId.address,
      abbreviation: event.venueId.abbreviation,
    });
  return events;
};

const getEvent = async (eventId) => {
  return Event.findOneAndPopulate({ _id: eventId }, "venueId");
};

const PATCH = async ({ body, locals }) => {
  const { userId } = locals.userData;
  const { eventId, eventData } = body;
  const event = await getEvent(eventId);
  if (event.creator.toString() !== userId) throw Error("Not the owner");
  return updateEvent(event, {
    ...eventData,
    boost: undefined,
    specialTags: undefined,
  });
};

const updateEvent = async (event, eventData) => {
  const {
    bannerImage,
    name,
    startTime,
    endTime,
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
  const city = event.venueId.city;

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

  await EventMS.updateOne(
    {
      id: event._id.toString(),
      ...(name && { name }),
      ...(bannerImage && { bannerImage }),
      tags: msTags,
      ...(startTime && { time: startTime }),
      ...(boost && { boost }),
      ...(keywords && { keywords }),
    },
    city
  );

  return Event.findByIdAndUpdate(eventId, {
    ...(bannerImage && { bannerImage }),
    ...(name && { name }),
    ...(startTime && { startTime }),
    ...(endTime && { endTime }),
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
};

const deleteEvent = async (eventId) => {
  const event = await getEvent(eventId);
  const venue = await Venue.findByIdAndSelect(event.venueId.toString(), {
    city: 1,
  });
  await EventMS.deleteById(eventId, venue.city);
  await Venue.findByIdAndUpdate(venue._id, {
    $pull: { events: eventId },
  });
  await Event.deleteOne({ _id: eventId });
};

export default {
  service: {
    POST,
    GET,
    PATCH,
    getEvents,
  },
  getEvent,
  deleteEvent,
  updateEvent,
};
