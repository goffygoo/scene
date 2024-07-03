import cron from "node-cron";
import DashboardModule from "./dashboard/index.js";
import LogModule from "./log/index.js";

const createIndexes = async () => {
    await LogModule.createIndexes(true);
}

const initScheduler = () => {
    cron.schedule("55 23 * * *", createIndexes);
    cron.schedule("*/2 * * * *", DashboardModule.feature.pollFeatureConfig);
    cron.schedule("*/5 * * * *", DashboardModule.appConfig.pollAppConfig);
}

export default async function () {
    await LogModule.createIndexes();
    await DashboardModule.feature.pollFeatureConfig();
    await DashboardModule.appConfig.pollAppConfig();
    await DashboardModule.query.buildQueries();
    initScheduler();
}