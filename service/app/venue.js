import Venue from "../../model/Venue.js";
import { saveFilesBulk } from "../../util/files.js";
import cities from "../../constants/cities.js";

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

export default {
  service: {
    POST,
  },
  createVenue,
};
