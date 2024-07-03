import { Client } from '@elastic/elasticsearch'
import { LOG_TYPES, enableESLogging } from '../../constants/index.js';
import config from "../../constants/config.js";
import { ErrorSchema, EventSchema, FeLogSchema, LogSchema } from './schema.js';
const { ES_CA, ES_PASSWORD, ES_URL, ES_USERNAME } = config;

const LogsLifecycle = 7;
const ErrorsLifecycle = 30;
const EventsLifecycle = 7;
const FeLogsLifecycle = 7;

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

const catchErr = (_e) => {
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

const createLogIndex = async (dateStamp) => {
    return ElasticSearch.indices.create({
        index: getIndexName(LOG_TYPES.LOG, dateStamp),
        mappings: {
            dynamic: 'strict',
            properties: LogSchema,
        },
        settings: {
            refresh_interval: '30s',
        }
    });
}

const createErrorIndex = async (dateStamp) => {
    return ElasticSearch.indices.create({
        index: getIndexName(LOG_TYPES.ERROR, dateStamp),
        mappings: {
            dynamic: 'strict',
            properties: ErrorSchema,
        },
        settings: {
            refresh_interval: '30s',
        }
    });
}

const createEventIndex = async (dateStamp) => {
    return ElasticSearch.indices.create({
        index: getIndexName(LOG_TYPES.EVENT, dateStamp),
        mappings: {
            dynamic: 'strict',
            properties: EventSchema,
        },
        settings: {
            refresh_interval: '30s',
        }
    });
}

const createFELogIndex = async (dateStamp) => {
    return ElasticSearch.indices.create({
        index: getIndexName(LOG_TYPES.FE_LOG, dateStamp),
        mappings: {
            dynamic: 'strict',
            properties: FeLogSchema,
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
    try {
        await ElasticSearch.index({
            index: getIndexName(type),
            document: {
                ...data,
                date: (new Date()).toISOString(),
                type,
            },
            refresh: 'false',
        });
    } catch (_e) {
        catchErr(_e);
    }
}

export const createIndexes = async (forNextDay) => {
    if (!enableESLogging) return;
    try {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        const dateStamp = forNextDay ? getDateStamp(dateStamp): undefined;
        await createLogIndex(dateStamp);
        await createErrorIndex(dateStamp);
        await createEventIndex(dateStamp);
        await createFELogIndex(dateStamp);
    } catch (_e) {
        catchErr(_e);
    }
}

export const dropIndexes = async ({
    logStamp,
    errorStamp,
    eventStamp,
    feLogStamp,
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

    date = new Date();
    date.setDate(date.getDate() - FeLogsLifecycle);
    const feLogsTimeStamp = feLogStamp ?? getDateStamp(date);

    try {
        await dropLogIndex(logsTimeStamp);
        await dropErrorIndex(errorsTimeStamp);
        await dropEventIndex(eventsTimeStamp);
        await dropFELogIndex(feLogsTimeStamp);
    } catch (_e) {
        catchErr(_e);
    }
}