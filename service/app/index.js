import venue from "./venue.js";
import {
  cities,
  eventTags,
  eventTagsSpecial,
  timeTags,
  types,
  venueTags,
} from "../../constants/liveConfig.js";
import { GENDER } from "../../constants/index.js";
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

const getGenders = async () => {
  return Object.values(GENDER);
};
const getAppConfig = async ({ body, locals }) => {
  const {
    bundleVersion,
    device,
    appVersion,
    deviceId,
    userData,
  } = locals;
  const userId = userData?.userId;
  const { city, fcmToken } = body;
  const events = CacheModule.appConfig.getTopEvents(city);
  const venues = CacheModule.appConfig.getTopVenues(city);
  const currentDeviceId = await CommsModule.device.upsertDetails({
    device,
    appVersion,
    deviceId,
    fcmToken,
    bundleVersion,
    userId
  });
  return { events, venues, currentDeviceId };
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
    getAppConfig,
  },
  venue,
  getCities,
  getTypes,
  getEventTags,
  getVenueTags,
  getTimeTags,
  getSpecialEventTags,
};
