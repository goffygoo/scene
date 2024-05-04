import Organiser from "../../model/Organiser.js";

const add = async ({ body }) => {
  const { email } = body;
  await Organiser.create({ email, password: " " });
};

export default {
  service: {
    add,
  },
};
