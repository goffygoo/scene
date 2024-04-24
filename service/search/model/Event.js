import { MODEL_INDEX } from "../../../constants/index.js";
import engine from "../engine.js";

const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
        venueId: { type: "string" },
        name: { type: "string" },
        time: { type: "number" },
        boost: { type: "number" },
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
        },
    },
    required: [
        "id",
        "venueId",
        "name",
        "time",
        "boost",
        "keywords",
        "tags",
    ],
    additionalProperties: false,
};
const Event = engine(schema, MODEL_INDEX.EVENT);
export default Event;