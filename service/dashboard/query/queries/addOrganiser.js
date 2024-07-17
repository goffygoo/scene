import { DataTypes } from "../../../../constants/index.js";
import venue from "../../../app/search/model/Venue.js";
import { processPassword } from "../../../auth/utils.js";

const query = async (params) => {
  const { email, password } = params;

  const data = await venue.createOrReplaceOne({
    email,
    password: processPassword(password),
  });
  return data;
};

export default {
  query,
  title: "Add Organiser Account",
  params: { email: DataTypes.string, password: DataTypes.string },
};
