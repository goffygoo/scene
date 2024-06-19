import { LOG_TYPES } from "../../constants/index.js"

export const LogSchema = {
    data: { type: 'text' },
    date: { type: 'date' },
    key1: { type: 'keyword' },
    key2: { type: 'keyword' },
    metric: { type: 'integer' },
    txnId: { type: 'keyword' },
    type: {
        type: 'constant_keyword',
        value: LOG_TYPES.LOG,
    },
}

export const ErrorSchema = {
    data: { type: 'text' },
    date: { type: 'date' },
    key1: { type: 'keyword' },
    key2: { type: 'keyword' },
    txnId: { type: 'keyword' },
    type: {
        type: 'constant_keyword',
        value: LOG_TYPES.ERROR,
    },
}

export const EventSchema = {
    data: { type: 'text' },
    date: { type: 'date' },
    name: { type: 'keyword' },
    city: { type: 'keyword' },
    action: { type: 'keyword' },
    device: { type: 'keyword' },
    version: { type: 'keyword' },
    type: {
        type: 'constant_keyword',
        value: LOG_TYPES.EVENT,
    },
}