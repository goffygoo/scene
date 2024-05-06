import Ajv from "ajv";
import { addOrReplace, addOrUpdate, getDocumentById, searchQuery } from './actions.js';
import { getIndexKey } from "./util.js";

const ajv = new Ajv();

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
            return getDocumentById(id, getIndexKey(this.index, city));
        }

        static async createOrReplaceOne(data, city) {
            this.validateSchema(data);
            return addOrReplace([data], getIndexKey(this.index, city));
        }

        static async updateOne(data, city) {
            return addOrUpdate([data], getIndexKey(this.index, city));
        }

        static async searchQuery({ query, filter, sort, limit }, city) {
            const response = await searchQuery({ query, filter, sort, limit }, getIndexKey(this.index, city));
            return response.hits;
        }
    }
}
