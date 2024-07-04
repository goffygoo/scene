import { DataTypes } from "../../../../constants/index.js";
import venue from "../../../app/search/model/Venue.js";
const query = async (params) => {
  const { city } = params;
  const collections = await venue.searchQuery({ query: "" }, city);
  return collections;
};

export default {
  query,
  title: "List all venues",
  params: { city: DataTypes.string },
};
