import { MODEL_INDEX } from "../../../constants/index.js";
import engine from "../engine.js";

const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
        abbreviation: { type: "string" },
        name: { type: "string" },
        type: { type: "string" },
        keywords: {
            type: "array",
            items: {
                type: "string",
            },
        },
        tags: {
            type: "array",
            items: {
                type: "string",
            },
        }
    },
    required: [
        "id",
        "abbreviation",
        "name",
        "type",
        "keywords",
        "tags",
    ],
    additionalProperties: false,
};

const Venue = engine(schema, MODEL_INDEX.VENUE);
export default Venue;