import { LOG_TYPES } from '../../constants/index.js';
import { addDocument, createIndexes } from './elasticsearch.js';

const log = ({
    data,
    key1,
    key2,
    metric,
    txnId
}) => {
    return addDocument(LOG_TYPES.LOG, {
        data,
        date: (new Date()).toISOString(),
        key1,
        key2,
        metric,
        txnId
    })
}

const error = ({
    data,
    key1,
    key2,
    txnId
}) => {
    return addDocument(LOG_TYPES.ERROR, {
        data,
        date: (new Date()).toISOString(),
        key1,
        key2,
        txnId
    })
}

export default {
    createIndexes,
    log,
    error
}