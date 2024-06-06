import AppConfig from "../../model/AppConfig.js";
import CacheModule from "../cache/index.js";
import Event from "../../model/Event.js";

const GET = async ({ body }) => {
  const { city } = body;
  const events = CacheModule.appConfig.getTopEvents(city);
  const venues = CacheModule.appConfig.getTopVenues(city);
  return { events, venues };
};

const PATCH = async ({ body }) => {
  const { city, key, data } = body;
  await AppConfig.findOneAndUpdate({ city, key }, { data });
};

const getForCity = async (city) => {
  const eventConfig = await AppConfig.findOne({ city, key: "topEvents" });
  const venueConfig = await AppConfig.findOne({ city, key: "topEvents" });
  const events = await Event.find({ _id: { $in: eventConfig.data } });
  const venues = await Event.find({ _id: { $in: venueConfig.data } });
  return { events, venues };
};

export default {
  service: {
    GET,
    PATCH,
  },
  getForCity,
};
