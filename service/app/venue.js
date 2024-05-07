import Venue from "../../model/Venue.js";
import { saveFilesBulk } from "../../util/files.js";
import { cities, types } from "../../constants/liveConfig.js";
import VenueMS from "./search/model/Venue.js";

const POST = async ({ body, locals }) => {
  const {
    bannerImage,
    name,
    abbreviation,
    type,
    city,
    address,
    location,
    gallery,
    logo,
  } = body;
  const { userId: creator } = locals.userData;
  await createVenue({
    bannerImage,
    name,
    abbreviation,
    type,
    city,
    address,
    location,
    gallery,
    logo,
    creator,
  });
};

const createVenue = async ({
  bannerImage,
  name,
  abbreviation,
  type,
  city,
  address,
  location,
  gallery,
  logo,
  creator,
}) => {
  if (!cities[city]) throw Error("Invalid city");
  if (!types[type]) throw Error("Invalid type");
  const imageArray = [logo, ...gallery, bannerImage];
  await saveFilesBulk(imageArray);
  const venue = await Venue.create({
    bannerImage,
    name,
    abbreviation,
    type,
    city,
    address,
    location,
    gallery,
    logo,
    creator,
  });
  return venue;
};

const approveVenue = async (venueId, approver) => {
  const venue = await Venue.findByIdAndUpdate(venueId, {
    approver,
    verified: true,
  });
  await VenueMS.createOrReplaceOne(
    {
      id: venue._id.toString(),
      abbreviation: venue.abbreviation,
      name: venue.name,
      type: venue.type,
      keywords: venue.keywords,
      tags: venue.tags,
    },
    venue.city
  );
};

const getPendingVenues = async () => {
  return Venue.find({ verified: false });
};

export default {
  service: {
    POST,
  },
  createVenue,
  approveVenue,
  getPendingVenues,
};
