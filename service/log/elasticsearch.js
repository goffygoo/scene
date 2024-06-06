import { Client } from '@elastic/elasticsearch'
import { LOG_TYPES } from '../../constants/index.js';
import config from "../../constants/config.js";
import { ErrorSchema, LogSchema } from './schema.js';
const { ES_CA, ES_PASSWORD, ES_URL, ES_USERNAME } = config;

let ErrorCount = 0;
let ErrorCountLogDate = Date.now();

const ElasticSearch = new Client({
    node: ES_URL,
    auth: {
        username: ES_USERNAME,
        password: ES_PASSWORD
    },
    tls: {
        ca: ES_CA,
        rejectUnauthorized: false
    }
});

const getDateStamp = date => date.toISOString().split('T')[0];

const getIndexName = (type, dateStamp) => {
    const DateStamp = dateStamp ?? getDateStamp(new Date());
    return 'w-' + type + '-' + DateStamp;
}

const catchErr = () => {
    if (++ErrorCount >= 16) {
        console.log(
            ErrorCount + " new Errors in ElasticSearch in last "
            + ((Date.now() - ErrorCountLogDate) / 1000)
            + " seconds"
        );
        ErrorCountLogDate = Date.now();
        ErrorCount = 0;
    }
}

const createLogIndex = async () => {
    return ElasticSearch.indices.create({
        index: getIndexName(LOG_TYPES.LOG),
        mappings: {
            dynamic: 'strict',
            properties: LogSchema,
        },
        settings: {
            refresh_interval: '30s',
        }
    });
}

const createErrorIndex = async () => {
    return ElasticSearch.indices.create({
        index: getIndexName(LOG_TYPES.ERROR),
        mappings: {
            dynamic: 'strict',
            properties: ErrorSchema,
        },
        settings: {
            refresh_interval: '30s',
        }
    });
}

const dropLogIndex = async () => {
    return ElasticSearch.indices.delete({
        index: getIndexName(LOG_TYPES.LOG),
    })
}

const dropErrorIndex = async () => {
    return ElasticSearch.indices.delete({
        index: getIndexName(LOG_TYPES.ERROR),
    })
}

export const addDocument = async (type, data) => {
    return ElasticSearch.index({
        index: getIndexName(type),
        document: data,
        refresh: 'false',
    })
}

export const createIndexes = async () => {
    await createLogIndex().catch(catchErr);
    await createErrorIndex().catch(catchErr);

    // await dropLogIndex().catch(catchErr);
    // await dropErrorIndex().catch(catchErr);
}