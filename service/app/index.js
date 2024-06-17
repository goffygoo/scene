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

export default {
  service: {
    getCities,
    getTypes,
    getEventTags,
    getVenueTags,
    getTimeTags,
    getSpecialEventTags,
    getGenders,
  },
  venue,
  getCities,
  getTypes,
  getEventTags,
  getVenueTags,
  getTimeTags,
  getSpecialEventTags,
};
