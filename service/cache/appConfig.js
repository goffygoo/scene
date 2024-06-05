let eventMap = new Map();
let venueMap = new Map();

const setVenueMap = (city, data) => {
  venueMap.set(city, data);
};

const setEventMap = (city, data) => {
  eventMap.set(city, data);
};

const getTopVenues = (city) => {
  return venueMap.get(city);
};

const getTopEvents = (city) => {
  return eventMap.get(city);
};

export default {
  setVenueMap,
  setEventMap,
  getTopVenues,
  getTopEvents,
};
