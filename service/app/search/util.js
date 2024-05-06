import { MODEL_INDEX } from "../../../constants/index.js";
import { multiSearchQuery } from "./actions.js";

export const getIndexKey = (index, city) => index + '_' + city;

export const getVenueAndEvents = async (venue, event, cityKey) => {
    const response = await multiSearchQuery([
        {
            indexUid: getIndexKey(MODEL_INDEX.VENUE, cityKey),
            q: venue.query,
            filter: venue.filter,
            sort: venue.sort,
            limit: venue.limit || 20,
        },
        {
            indexUid: getIndexKey(MODEL_INDEX.EVENT, cityKey),
            q: event.query,
            filter: event.filter,
            sort: event.sort,
            limit: event.limit || 20,
        },
    ]);
    const [venueMs, eventMs] = response.results; 
    return {
        venues: venueMs.hits,
        events: eventMs.hits
    };
}