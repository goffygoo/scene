import { eventTags, eventTagsSpecial, timeTags, venueTags } from "../../../constants/liveConfig.js";
import VenueMS from "./model/Venue.js";
import EventMS from "./model/Event.js";
import { getIndexKey, getVenueAndEvents } from "./util.js";
import Venue from "../../../model/Venue.js";
import Event from "../../../model/Event.js";

const getLabels = async () => {
    return [
        {
            title: "Events",
            id: "event",
            params: {
                time: Object.values(timeTags),
                tags: [...Object.values(eventTags), ...Object.values(eventTagsSpecial)]
            }
        },
        {
            title: "Venue",
            id: "venue",
            params: {
                tags: Object.values(venueTags),
            }
        }
    ]
}

const hydrateTags = (arr, field = 'tags') => {
    if (!arr || arr.length === 0) return null;
    const filter = arr.reduce((prev, cur) => prev + cur + ',', '');
    return `(${field} IN [${filter}])`;
}

const hydrateTime = (arr) => {
    if (!arr || arr.length === 0) return null;
    const inaweek = arr.includes('inaweek'),
        today = arr.includes('today'),
        tomorrow = arr.includes('tomorrow'),
        intwodays = today && tomorrow;
    const now = new Date();
    let start = 0, end = 0;
    const oneDay = 1000 * 60 * 60 * 24;
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    if (inaweek) {
        start = now.getTime();
        end = start + 7 * oneDay;
    } else if (intwodays) {
        start = now.getTime();
        end = endOfDay.getTime() + oneDay;
    } else if (tomorrow) {
        start = endOfDay.getTime();
        end = start + oneDay;
    } else if (today) {
        start = now.getTime();
        end = endOfDay.getTime();
    }
    return `(time ${start} TO ${end})`;
}

const getFilters = labels => {
    if (!labels) return "";
    const { tags, time } = labels;
    let hydratedA = hydrateTags(tags);
    let hydratedB = hydrateTime(time);
    if (!hydratedA) {
        [hydratedA, hydratedB] = [hydratedB, hydratedA];
    }
    if (!hydratedA) return "";
    if (!hydratedB) return hydratedA;
    return hydratedA + " AND " + hydratedB;
}

const POST = async ({ body, locals }) => {
    // const cityKey = locals.cityKey;
    const { query = "", labels, cityKey } = body;
    const index = labels?.index;
    if (index === 'venue') {
        const filter = getFilters(labels);
        const venues = await VenueMS.searchQuery({ filter, query }, cityKey);
        return venues;
    } else if (index === 'event') {
        const filter = getFilters(labels);
        const events = await EventMS.searchQuery({ filter, query, sort: ["boost:desc"] }, cityKey);
        return events;
    } else {
        const { venues, events } = await getVenueAndEvents(
            {
                query,
            },
            {
                query,
                sort: ["boost:desc"]
            },
            cityKey
        );
        const venueIds = venues.map(v => v.id);
        const mappedEvents = await EventMS.searchQuery({
            filter: hydrateTags(venueIds, 'venueId'),
            sort: ["boost:desc"],
        }, cityKey);

        const allEvents = []
        const uniqueEventIds = new Set()
        const eventIds = []
        const mappedEventIds = []

        for(let event of events) {
            allEvents.push(event);
            uniqueEventIds.add(event.id);
            eventIds.push(event.id)
        }
        for(let event of mappedEvents) {
            if (!uniqueEventIds.has(event.id)){
                allEvents.push(event);
                mappedEventIds.push(event.id)
            }
            uniqueEventIds.add(event.id);
        }
        let venueLength = venues.length, venueIdx = 0;
        let eventLength = events.length, eventIdx = 0;
        let mappedEventLength = mappedEventIds.length, mappedEventIdx = 0;
        let totalResults = venueLength + allEvents.length;
        
        const eventsMap = {};
        for (let i = 0; i < allEvents.length; i++) {
            eventsMap[allEvents[i].id] = i;
        }
        const searchResults = [];
        while (searchResults.length < totalResults) {
            let eventItr = 0
            while (eventIdx < eventLength && eventItr++ < 2) {
                searchResults.push(allEvents[eventsMap[eventIds[eventIdx++]]]);
            }

            if (mappedEventIdx < mappedEventLength) {
                searchResults.push(allEvents[eventsMap[mappedEventIds[mappedEventIdx++]]]);
            }

            if (venueIdx < venueLength) {
                searchResults.push(venues[venueIdx++]);
            }
        }
        return searchResults;
    }
}

export default {
    service: {
        getLabels,
        POST,
    },
    getIndexKey
}