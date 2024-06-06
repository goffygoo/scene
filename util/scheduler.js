import cron from "node-cron";
import FeatureModule from "../service/dashboard/feature.js";
import AppConfigModule from "../service/dashboard/appConfig.js";
import Cache from "../service/cache/index.js";
import AppModule from "../service/app/index.js";

const pollFeatureConfig = async () => {
  const features = await FeatureModule.getAll();
  const map = new Map();
  features.forEach((feature) => {
    map.set(feature.key, feature);
  });
  Cache.feature.replaceHashMap(map);
};

const pollAppConfig = async () => {
  const cities = await AppModule.getCities();
  for (const city of cities) {
    const data = await AppConfigModule.getForCity(city.code);
    Cache.appConfig.setEventMap(city.code, data.events);
    Cache.appConfig.setVenueMap(city.code, data.venues);
  }
};

export default function initScheduler() {
  cron.schedule("*/2 * * * *", pollFeatureConfig);
  cron.schedule("*/1 * * * *", pollAppConfig);
}
