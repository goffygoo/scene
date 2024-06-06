import Feature from "../../model/Feature.js";
import Cache from "../cache/index.js";

const POST = async ({ body }) => {
    const { key } = body;
    return Feature.create({
        key
    });
};

const GET = async ({ body }) => {
    const { key } = body;
    return Feature.findOne({ key });
};

const PATCH = async ({ body }) => {
    const { id, value, userIds } = body;
    console.log(body);
    return Feature.findByIdAndUpdate(id, {
        ...((value !== undefined) && { value }),
        ...(userIds && { userIds }),
    });
};

const DELETE = async ({ body }) => {
    const { id } = body;
    return Feature.deleteOne({
        _id: id,
    });
};

const getAll = async () => {
    return Feature.find({});
};

const getFeatureValue = (key, userId) => {
    const featureConfig = Cache.feature.getFeature(key);
    if (!featureConfig) return false;
    if (featureConfig.value) return true;
    if (userId) return featureConfig.userIds.includes(userId);
    return false;
};

const pollFeatureConfig = async () => {
    const features = await getAll();
    const map = new Map();
    features.forEach((feature) => {
        map.set(feature.key, feature);
    });
    Cache.feature.replaceHashMap(map);
};

export default {
    service: {
        GET,
        POST,
        PATCH,
        DELETE
    },
    getFeatureValue,
    pollFeatureConfig
};