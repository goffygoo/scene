import cron from "node-cron";
import FeatureModule from "../service/dashboard/feature.js";
import Cache from "../service/cache/index.js";

const pollFeatureConfig = async () => {
    const features = await FeatureModule.getAll();
    const map = new Map();
    features.forEach(feature => {
        map.set(feature.key, feature);
    })
    Cache.feature.replaceHashMap(map);
}

export default function initScheduler() {
    cron.schedule('*/2 * * * *', pollFeatureConfig);
}