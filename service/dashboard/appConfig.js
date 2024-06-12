import AppConfig from "../../model/AppConfig.js";
import CacheModule from "../cache/index.js";
import Event from "../../model/Event.js";
import AppModule from "../app/index.js";
import Venue from "../../model/Venue.js";

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
  const venueConfig = await AppConfig.findOne({ city, key: "topVenues" });
  const events = await Event.findAndPopulate(
    { _id: { $in: eventConfig.data } },
    "venueId"
  );
  const venues = await Venue.find({ _id: { $in: venueConfig.data } });
  return { events, venues };
};

const pollAppConfig = async () => {
  const cities = await AppModule.getCities();
  for (const city of cities) {
    const data = await getForCity(city.code);
    CacheModule.appConfig.setEventMap(city.code, data.events);
    CacheModule.appConfig.setVenueMap(city.code, data.venues);
  }
};

export default {
  service: {
    GET,
    PATCH,
    POST,
  },
  pollAppConfig,
};
