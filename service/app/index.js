import venue from "./venue.js";
import {
  cities,
  eventTags,
  eventTagsSpecial,
  timeTags,
  types,
  venueTags,
} from "../../constants/liveConfig.js";
<<<<<<< HEAD
import { GENDER } from "../../constants/index.js";
=======
import CacheModule from "../cache/index.js";
import CommsModule from "../comms/index.js";
>>>>>>> 2cf916ec7725c6050751823d0a7ff2ac5484dae4

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

const getGenders = async () => {
  return Object.values(GENDER);
}
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
    getGenders,
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
