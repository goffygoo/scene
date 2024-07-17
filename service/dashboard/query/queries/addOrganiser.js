import { DataTypes } from "../../../../constants/index.js";
import Organiser from "../../../../model/Organiser.js";
import { processPassword } from "../../../auth/utils.js";

const query = async (params) => {
  const { email, password } = params;

  const data = await Organiser.createOrReplaceOne({
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
