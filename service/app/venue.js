import Venue from "../../model/Venue.js";
import { saveFilesBulk } from "../../util/files.js";
import cities from "../../constants/cities.js";

const POST = async ({ body }) => {
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
  });
  return venue;
};

export default {
  service: {
    POST,
  },
  createVenue,
};
