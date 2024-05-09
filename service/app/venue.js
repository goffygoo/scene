import Venue from "../../model/Venue.js";
import { deleteFilesBulk, saveFilesBulk } from "../../util/files.js";
import { cities, types, venueTags } from "../../constants/liveConfig.js";
import VenueMS from "./search/model/Venue.js";

const POST = async ({ body, locals }) => {
  const {
    bannerImage,
    name,
    abbreviation,
    type,
    tags,
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
    tags,
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
  keywords,
  tags,
  creator,
}) => {
  if (!cities[city]) throw Error("Invalid city");
  if (!types[type]) throw Error("Invalid type");
  for (const tag of tags) {
    if (!venueTags[tag]) throw Error('Invalid tag');
  }
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
    keywords,
    tags,
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

const getVenue = async (venueId) => {
  return Venue.findById(venueId);
}

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
  const venue = await getVenue(venueId);
  const city = venue.city;
  const deleteImages = [], createImages = [];
  if (bannerImage && bannerImage !== venue.bannerImage) {
    deleteImages.push(venue.bannerImage);
    createImages.push(bannerImage);
  }
  if (logo && logo !== venue.logo) {
    deleteImages.push(venue.logo);
    createImages.push(logo);
  }
  const oldGallerySet = new Set(venue.gallery);
  const newGallerySet = new Set(gallery);
  for (const img of oldGallerySet) {
    if (!newGallerySet.has(img)) {
      deleteImages.push(img);
    }
  }
  for (const img of newGallerySet) {
    if (!oldGallerySet.has(img)) {
      createImages.push(img);
    }
  }
  await saveFilesBulk(createImages);
  await deleteFilesBulk(deleteImages);

  await VenueMS.createOrReplaceOne(
    {
      id: venueId,
      abbreviation: abbreviation || venue.abbreviation,
      name: name || venue.name,
      type: type || venue.type,
      keywords: keywords || venue.keywords,
      tags: tags || venue.tags,
    },
    city
  );

  return Venue.findByIdAndUpdate(venueId, {
    ...(bannerImage && { bannerImage }),
    ...(name && { name }),
    ...(address && { address }),
    ...(location && { location }),
    ...(gallery && { gallery }),
    ...(tags && { tags }),
    ...(keywords && { keywords }),
    ...(logo && { logo }),
  });
}

const deleteVenue = async (venueId) => {
  return Venue.deleteOne({ _id: venueId });
}

export default {
  service: {
    POST,
  },
  createVenue,
  getVenue,
  approveVenue,
  getPendingVenues,
  updateVenue,
  deleteVenue,
};
