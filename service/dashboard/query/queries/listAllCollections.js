import db from "../../../../util/db.js";

const query = async params => {
    const collections = await db.listCollections();
    const parsedData = collections.map(collection => {
        return collection.name;
    });
    return parsedData;
}

export default {
    query,
    title: "List all mongo collections",
    params: {}
}