import { DataTypes } from "../../../../constants/index.js";
import User from "../../../../model/User.js";
import AuthModule from "../../../auth/index.js";

const query = async (params) => {
  const { email, password } = params;
  await User.create({
    email,
    password: AuthModule.processPassword(password),
  });
  return { email, success: true };
};

export default {
  query,
  title: "Add User Account",
  params: {
    email: DataTypes.string,
    password: DataTypes.string
  },
};
