let hashMap = new Map();

const replaceHashMap = (map) => {
    hashMap = map;
}

const getFeature = (key) => {
    return hashMap.get(key);
}

export default {
    replaceHashMap,
    getFeature,
}