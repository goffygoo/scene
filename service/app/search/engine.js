import Ajv from "ajv";
import { addOrReplace, addOrUpdate, deleteDocumentById, getDocumentById, searchQuery } from './actions.js';
import { getIndexKey } from "./util.js";
import asyncLocalStorage from "../../../util/asyncStorage.js";
import LogModule from "../../log/index.js";

const ajv = new Ajv();

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

export default (schema, index) => {
    return class Model {
        static schema = schema;
        static index = index;

        static validateSchema(data) {
            const validate = ajv.compile(schema);
            const valid = validate(data);
            if (!valid) throw {
                message: "Invalid Schema",
                errors: validate.errors,
            };
        }

        static async findById(id, city) {
            const startTime = Date.now();
            const indexKey = getIndexKey(this.index, city);
            const result = await getDocumentById(id, indexKey);
            log({ id, result }, indexKey + ".findById", Date.now() - startTime);
            return result;
        }

        static async createOrReplaceOne(data, city) {
            const startTime = Date.now();
            this.validateSchema(data);
            const indexKey = getIndexKey(this.index, city);
            const result = await addOrReplace([data], indexKey);
            log({ data, result }, indexKey + ".createOrReplaceOne", Date.now() - startTime);
            return result;
        }

        static async updateOne(data, city) {
            const startTime = Date.now();
            const indexKey = getIndexKey(this.index, city);
            const result = await addOrUpdate([data], indexKey);
            log({ data, result }, indexKey + ".updateOne", Date.now() - startTime);
            return result;
        }

        static async deleteById(id, city) {
            const startTime = Date.now();
            const indexKey = getIndexKey(this.index, city);
            const result = await deleteDocumentById(id, indexKey);
            log({ id, result }, indexKey + ".deleteById", Date.now() - startTime);
            return result;
        }

        static async searchQuery({ query, filter, sort, limit }, city) {
            const startTime = Date.now();
            const indexKey = getIndexKey(this.index, city);
            const response = await searchQuery({ query, filter, sort, limit }, indexKey);
            const result = response.hits;
            log({ data: { query, filter, sort, limit }, result }, indexKey + ".searchQuery", Date.now() - startTime);
            return result;
        }
    }
}
