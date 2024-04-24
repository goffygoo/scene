import Ajv from "ajv";
import { addOrReplace, addOrUpdate, getDocumentById, searchQuery } from './actions.js';

const ajv = new Ajv();

const getIndexKey = (index, city) => index + '_' + city;

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

        static async searchQuery(query, city) {
            return searchQuery(query, getIndexKey(this.index, city));
        }
    }
}
