import { LOG_TYPES } from '../../constants/index.js';
import { addDocument, createIndexes, dropIndexes } from './elasticsearch.js';

const log = ({
    data,
    key1,
    key2,
    metric,
    txnId
}) => {
    return addDocument(LOG_TYPES.LOG, {
        data,
        key1,
        key2,
        metric,
        txnId
    });
}

const error = ({
    error,
    message,
    stack,
    key1,
    key2,
    txnId
}) => {
    return addDocument(LOG_TYPES.ERROR, {
        error,
        message,
        stack,
        key1,
        key2,
        txnId
    });
}

const event = ({ body, locals }) => {
    const {
        data,
        name,
        city,
        action,
    } = body;
    const { device, bundleVersion } = locals;
    return addDocument(LOG_TYPES.EVENT, {
        data,
        name,
        city,
        action,
        device,
        version: bundleVersion,
    });
}

const feLog = ({ body }) => {
    const {
        data,
        key1,
        key2,
        metric
    } = body;
    return addDocument(LOG_TYPES.FE_LOG, {
        data,
        key1,
        key2,
        metric
    });
}

export default {
    service: {
        event,
        feLog
    },
    createIndexes,
    dropIndexes,
    log,
    error
}