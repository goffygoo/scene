import { getQueries, buildQueries } from "./queries/index.js";

const list = async () => {
    const queries = getQueries();
    const queryList = Object.keys(queries).map((key) => {
        const value = queries[key];
        return {
            key,
            title: value.title,
            params: value.params,
        }
    });
    return queryList;
}

const execute = async ({ body }) => {
    const queries = getQueries();
    const { key, params } = body;
    return queries[key].query(params);
}

export default {
    service: {
        list,
        execute
    },
    buildQueries
}