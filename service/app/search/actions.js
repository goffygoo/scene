import config from "../../../constants/config.js";
import asyncLocalStorage from "../../../util/asyncStorage.js";
import { httpRequest } from "../../../util/index.js";
import LogModule from "../../log/index.js";

const { SEARCH_ENGINE, MEILISEARCH_SECRET_KEY } = config;

const searchConfig = {
    headers: {
        Authorization: `Bearer ${MEILISEARCH_SECRET_KEY}`
    }
};

const log = async (data, key2, metric) => {
    const txnId = asyncLocalStorage.getStore();
    LogModule.log({
        data: JSON.stringify(data),
        key1: 'msQueries',
        key2,
        txnId,
        metric,
    })
}

const addOrReplace = async (data, index) => {
    return httpRequest(
        "post",
        `${SEARCH_ENGINE}/indexes/${index}/documents`,
        data,
        searchConfig
    );
}

const addOrUpdate = async (data, index) => {
    return httpRequest(
        "put",
        `${SEARCH_ENGINE}/indexes/${index}/documents`,
        data,
        searchConfig
    );
}

const getDocumentById = async (id, index) => {
    return httpRequest(
        "get",
        `${SEARCH_ENGINE}/indexes/${index}/documents/${id}`,
        {},
        searchConfig
    );
}

const deleteDocumentById = async (id, index) => {
    return httpRequest(
        "delete",
        `${SEARCH_ENGINE}/indexes/${index}/documents/${id}`,
        {},
        searchConfig
    );
}

const searchQuery = async ({ query, filter, sort, limit = 20 }, index) => {
    return httpRequest(
        "post",
        `${SEARCH_ENGINE}/indexes/${index}/search`,
        {
            q: query,
            filter,
            sort,
            limit
        },
        searchConfig
    );
}

const multiSearchQuery = async (queries) => {
    const startTime = Date.now();
    const result = await httpRequest(
        "post",
        `${SEARCH_ENGINE}/multi-search`,
        {
            queries
        },
        searchConfig
    );
    log({ queries, result },  + "multiSearchQuery", Date.now() - startTime);
    return result;
}


export {
    getDocumentById,
    deleteDocumentById,
    addOrReplace,
    addOrUpdate,
    searchQuery,
    multiSearchQuery,
};