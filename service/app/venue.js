import Venue from "../../model/Venue.js";
import { cities, types, venueTags } from "../../constants/liveConfig.js";
import VenueMS from "./search/model/Venue.js";
import VenueUpdate from "../../model/VenueUpdate.js";
import { httpRequest } from "../../util/index.js";
import config from "../../constants/config.js";

const POST = async ({ body, locals }) => {
  const {
    bannerImage,
    name,
    abbreviation,
    type,
    tags,
    keywords,
    city,
    address,
    location,
    gallery,
    logo,
  } = body;
  const { userId: editor } = locals.userData;
  return createVenue({
    bannerImage,
    name,
    abbreviation,
    type,
    city,
    tags,
    keywords,
    address,
    location,
    gallery,
    logo,
    editor,
  });
};

const PATCH = async ({ body, locals }) => {
  const {
    venueId,
    bannerImage,
    name,
    abbreviation,
    type,
    tags,
    keywords,
    gallery,
    logo,
  } = body;
  const { userId: editor } = locals.userData;
  const venue = await getVenue(venueId);
  if (!venue) throw Error("Invalid Venue");
  return createVenue({
    parent: venueId,
    bannerImage,
    name,
    abbreviation,
    type,
    tags,
    keywords,
    gallery,
    logo,
    editor,
  });
};

const createVenue = async ({
  parent,
  bannerImage,
  name,
  abbreviation,
  type,
  city,
  address,
  location,
  gallery,
  logo,
  keywords,
  tags,
  editor,
}) => {
  if (!parent && !cities[city]) throw Error("Invalid city");
  if (!types[type]) throw Error("Invalid type");
  if (tags) {
    for (const tag of tags) {
      if (!venueTags[tag]) throw Error("Invalid tag");
    }
  }
  return VenueUpdate.create({
    ...(parent && { parent }),
    ...(bannerImage && { bannerImage }),
    ...(name && { name }),
    ...(abbreviation && { abbreviation }),
    ...(type && { type }),
    ...(city && { city }),
    ...(address && { address }),
    ...(location && { location }),
    ...(gallery && { gallery }),
    ...(logo && { logo }),
    ...(keywords && { keywords }),
    ...(tags && { tags }),
    ...(editor && { editor }),
  });
};

const approveVenue = async (venueId, approver) => {
  const updateList = await VenueUpdate.findAndPopulate(
    { _id: venueId },
    "parent"
  );
  if (!updateList || updateList.length === 0) throw Error("Invalid Venue");
  const updateVenue = updateList[0];
  if (!updateVenue.parent) {
    const venue = await Venue.create({
      bannerImage: updateVenue.bannerImage,
      name: updateVenue.name,
      type: updateVenue.type,
      city: updateVenue.city,
      abbreviation: updateVenue.abbreviation,
      address: updateVenue.address,
      location: updateVenue.location,
      gallery: updateVenue.gallery,
      logo: updateVenue.logo,
      keywords: updateVenue.keywords,
      tags: updateVenue.tags,
      editor: updateVenue.editor,
      approver,
    });
    await VenueMS.createOrReplaceOne(
      {
        id: venue._id.toString(),
        abbreviation: venue.abbreviation,
        name: venue.name,
        type: venue.type,
        keywords: venue.keywords,
        tags: venue.tags,
        address: updateVenue.address,
        bannerImage: updateVenue.bannerImage,
      },
      venue.city
    );
    return VenueUpdate.deleteOne({ _id: venueId });
  }
  const originalVenueId = updateVenue.parent._id.toString();
  const cityKey = updateVenue.parent.city;
  const {
    bannerImage,
    name,
    abbreviation,
    type,
    tags,
    keywords,
    gallery,
    logo,
    editor,
  } = updateVenue;
  await Venue.findByIdAndUpdate(originalVenueId, {
    ...(bannerImage && { bannerImage }),
    ...(name && { name }),
    ...(abbreviation && { abbreviation }),
    ...(type && { type }),
    ...(gallery && { gallery }),
    ...(logo && { logo }),
    ...(keywords && { keywords }),
    ...(tags && { tags }),
    ...(editor && { editor }),
    approver,
  });
  await VenueMS.updateOne(
    {
      id: originalVenueId,
      ...(abbreviation && { abbreviation }),
      ...(name && { name }),
      ...(type && { type }),
      ...(keywords && { keywords }),
      ...(tags && { tags }),
      ...(bannerImage && { bannerImage }),
    },
    cityKey
  );
  return VenueUpdate.deleteOne({ _id: venueId });
};

const getPendingVenues = async () => {
  return VenueUpdate.findAndPopulate({}, "parent");
};

const getVenue = async (venueId) => {
  return Venue.findOneAndPopulate({ _id: venueId }, "events");
};

const GET = async ({ body }) => {
  const { venueId } = body;
  return getVenue(venueId);
};

const updateVenue = async (venueId, venueData) => {
  const {
    bannerImage,
    name,
    abbreviation,
    type,
    address,
    location,
    gallery,
    logo,
    keywords,
    tags,
  } = venueData;
  const venue = await Venue.findByIdAndUpdate(venueId, {
    ...(bannerImage && { bannerImage }),
    ...(name && { name }),
    ...(address && { address }),
    ...(location && { location }),
    ...(gallery && { gallery }),
    ...(tags && { tags }),
    ...(keywords && { keywords }),
    ...(logo && { logo }),
  });
  const city = venue.city;
  await VenueMS.updateOne(
    {
      id: venueId,
      ...(abbreviation && { abbreviation }),
      ...(name && { name }),
      ...(type && { type }),
      ...(keywords && { keywords }),
      ...(tags && { tags }),
    },
    city
  );
  return venue;
};

const deleteVenue = async (venueId) => {
  const venue = await getVenue(venueId);
  if (!venue || venue.events?.length > 0) throw Error("Invalid Delete");
  await Promise.all([
    VenueMS.deleteById(venueId, venue.city),
    Venue.deleteOne({ _id: venueId }),
  ]);
};

const getPlace = async ({ body }) => {
  const { query } = body;
  const googleApiEndpoint =
    "https://maps.googleapis.com/maps/api/place/textsearch/json";
  const url = `${googleApiEndpoint}?query=${query}&key=${config.GOOGLE_PLACES_API_KEY}`;
  const { results } = await httpRequest("get", url, {}, {});
  return { places: results };
};

export default {
  service: {
    POST,
    PATCH,
    GET,
    getPlace,
  },
  createVenue,
  getVenue,
  approveVenue,
  getPendingVenues,
  updateVenue,
  deleteVenue,
};
