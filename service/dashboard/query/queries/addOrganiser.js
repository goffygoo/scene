import { DataTypes } from "../../../../constants/index.js";
import Organiser from "../../../../model/Organiser.js";
import AuthModule from "../../../auth/index.js";

const query = async (params) => {
  const { email, password } = params;
  const data = await Organiser.create({
    email,
    password: AuthModule.processPassword(password),
  });
  return data;
};

export default {
  query,
  title: "Add Organiser Account",
  params: {
    email: DataTypes.string,
    password: DataTypes.string
  },
};
