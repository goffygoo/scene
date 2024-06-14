import cron from "node-cron";
import DashboardModule from "./dashboard/index.js";
import LogModule from "./log/index.js";
import { enableESLogging } from "../constants/index.js";

const initScheduler = () => {
    cron.schedule("*/2 * * * *", DashboardModule.feature.pollFeatureConfig);
    cron.schedule("*/1 * * * *", DashboardModule.appConfig.pollAppConfig);
}

export default async function () {
    await DashboardModule.feature.pollFeatureConfig();
    await DashboardModule.appConfig.pollAppConfig();
    await DashboardModule.query.buildQueries();
    if (enableESLogging) await LogModule.createIndexes();
    initScheduler();
}