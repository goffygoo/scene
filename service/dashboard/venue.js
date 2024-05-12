import VenueModule from "../app/venue.js";

const approve = async ({ body, locals }) => {
  const { venueId } = body;
  const { userId } = locals.userData;
  return VenueModule.approveVenue(venueId, userId);
};

const getPendingVenues = async () => VenueModule.getPendingVenues();

const deleteVenue = async ({ body }) => {
  const { venueId } = body;
  return VenueModule.deleteVenue(venueId);
};

const getVenue = async ({ body }) => {
  const { venueId } = body;
  return VenueModule.getVenue(venueId);
};

export default {
  service: {
    approve,
    getPendingVenues,
    deleteVenue,
    getVenue
  },
};
