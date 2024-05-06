import { eventTags, timeTags, venueTags } from "../../../constants/liveConfig.js";
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
                tags: Object.values(eventTags)
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
    const cityKey = locals.cityKey;
    const { query = "", labels } = body;
    const index = labels?.index;
    if (index === 'venue') {
        const filter = getFilters(labels);
        const msVenues = await VenueMS.searchQuery({ filter, query }, cityKey);
        const venueIds = msVenues.map(v => v.id);
        const venues = await Venue.findAndSelect({
            _id: { $in: venueIds }
        }, {
            name: 1,
            abbreviation: 1,
            address: 1,
            bannerImage: 1,
        });
        return venues;
    } else if (index === 'event') {
        const filter = getFilters(labels);
        const msEvents = await EventMS.searchQuery({ filter, query, sort: ["boost:desc"] }, cityKey);
        const eventIds = msEvents.map(e => e.id);
        const events = await Event.findAndSelect({
            _id: { $in: eventIds }
        }, {
            name: 1,
            banner: 1,
        });
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
        const eventIds = events.map(e => e.id);
        const mappedEvents = await EventMS.searchQuery({
            filter: hydrateTags(venueIds, 'venueId'),
            sort: ["boost:desc"],
        }, cityKey);
        const mappedEventIds = mappedEvents.map(e => e.id);
        const allEventIds = [...(new Set([...eventIds, ...mappedEventIds]))];
        const [allVenues, allEvents] = await Promise.all([
            Venue.findAndSelect({
                _id: { $in: venueIds }
            }, {
                name: 1,
                abbreviation: 1,
                address: 1,
                bannerImage: 1,
            }),
            Event.findAndSelect({
                _id: { $in: allEventIds }
            }, {
                name: 1,
                banner: 1,
            })
        ]);

        let venueLength = allVenues.length, venueIdx = 0;
        let eventLength = eventIds.length, eventIdx = 0;
        let mappedEventLength = mappedEventIds.length, mappedEventIdx = 0;
        let totalResults = venueLength + allEvents.length;

        const eventsMap = {};
        for (let i = 0; i < allEvents.length; i++) {
            eventsMap[allEvents[i]._id] = i;
        }
   
        console.log(allVenues, allEvents)
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
                searchResults.push(allVenues[venueIdx++]);
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