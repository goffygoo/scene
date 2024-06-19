import { Client } from '@elastic/elasticsearch'
import { LOG_TYPES, enableESLogging } from '../../constants/index.js';
import config from "../../constants/config.js";
import { ErrorSchema, EventSchema, LogSchema } from './schema.js';
const { ES_CA, ES_PASSWORD, ES_URL, ES_USERNAME } = config;

const LogsLifecycle = 7;
const ErrorsLifecycle = 14;
const EventsLifecycle = 7;

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

const createEventIndex = async () => {
    return ElasticSearch.indices.create({
        index: getIndexName(LOG_TYPES.EVENT),
        mappings: {
            dynamic: 'strict',
            properties: EventSchema,
        },
        settings: {
            refresh_interval: '30s',
        }
    });
}

const createFELogIndex = async () => {
    return ElasticSearch.indices.create({
        index: getIndexName(LOG_TYPES.FE_LOG),
        mappings: {
            dynamic: 'strict',
            properties: LogSchema,
        },
        settings: {
            refresh_interval: '30s',
        }
    });
}

const dropLogIndex = async (dateStamp) => {
    return ElasticSearch.indices.delete({
        index: getIndexName(LOG_TYPES.LOG, dateStamp),
    });
}

const dropErrorIndex = async (dateStamp) => {
    return ElasticSearch.indices.delete({
        index: getIndexName(LOG_TYPES.ERROR, dateStamp),
    });
}

const dropEventIndex = async (dateStamp) => {
    return ElasticSearch.indices.delete({
        index: getIndexName(LOG_TYPES.EVENT, dateStamp),
    });
}

const dropFELogIndex = async (dateStamp) => {
    return ElasticSearch.indices.delete({
        index: getIndexName(LOG_TYPES.FE_LOG, dateStamp),
    });
}

export const addDocument = async (type, data) => {
    if (!enableESLogging) return;
    return ElasticSearch.index({
        index: getIndexName(type),
        document: data,
        refresh: 'false',
    })
}

export const createIndexes = async () => {
    if (!enableESLogging) return;
    await createLogIndex().catch(catchErr);
    await createErrorIndex().catch(catchErr);
    await createEventIndex().catch(catchErr);
    await createFELogIndex().catch(catchErr);
}

export const dropIndexes = async ({
    logStamp,
    errorStamp,
    eventStamp
}) => {
    if (!enableESLogging) return;

    let date = undefined;

    date = new Date();
    date.setDate(date.getDate() - LogsLifecycle);
    const logsTimeStamp = logStamp ?? getDateStamp(date);

    date = new Date();
    date.setDate(date.getDate() - ErrorsLifecycle);
    const errorsTimeStamp = errorStamp ?? getDateStamp(date);

    date = new Date();
    date.setDate(date.getDate() - EventsLifecycle);
    const eventsTimeStamp = eventStamp ?? getDateStamp(date);

    await dropLogIndex(logsTimeStamp).catch(catchErr);
    await dropErrorIndex(errorsTimeStamp).catch(catchErr);
    await dropEventIndex(eventsTimeStamp).catch(catchErr);
    await dropFELogIndex(logsTimeStamp).catch(catchErr);
}