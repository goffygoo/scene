import VenueModule from "../app/venue.js";
const approve = async ({ body, locals }) => {
  const { venueId } = body;
  const { userId } = locals.userData;
  return VenueModule.approveVenue(venueId, userId);
};

const getVenues = async () => VenueModule.getPendingVenues();

export default {
  service: {
    approve,
    getVenues,
  },
};
