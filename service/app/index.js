import venue from "./venue.js";
import {
  cities,
  eventTags,
  eventTagsSpecial,
  timeTags,
  types,
  venueTags,
} from "../../constants/liveConfig.js";
import CacheModule from "../cache/index.js";
import CommsModule from "../comms/index.js";

const getCities = async () => {
  return Object.values(cities);
};

const getTypes = async () => {
  return Object.values(types);
};

const getVenueTags = async () => {
  return Object.values(venueTags);
};

const getEventTags = async () => {
  return Object.values(eventTags);
};

const getTimeTags = async () => {
  return Object.values(timeTags);
};

const getSpecialEventTags = async () => {
  return Object.values(eventTagsSpecial);
};

const getAppConfig = async ({ body, locals }) => {
  const { userId } = locals.userData;
  const { city, fcmToken } = body;
  const events = CacheModule.appConfig.getTopEvents(city);
  const venues = CacheModule.appConfig.getTopVenues(city);
  if (fcmToken && userId) await CommsModule.notification.addFCMToken(userId, fcmToken);
  return { events, venues };
};

export default {
  service: {
    getCities,
    getTypes,
    getEventTags,
    getVenueTags,
    getTimeTags,
    getSpecialEventTags,
    getAppConfig
  },
  venue,
  getCities,
  getTypes,
  getEventTags,
  getVenueTags,
  getTimeTags,
  getSpecialEventTags,
};
