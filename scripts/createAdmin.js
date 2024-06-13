import _db from "../util/db.js";
import Admin from "../model/Admin.js";
const adminEmails = ["kulbois007@gmail.com", "chilly@lemon.com"];
const createArray = adminEmails.map((email) => ({ email, password: " " }));
Admin.create(createArray)
  .then(() => {
    console.log("Profile created successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(-1);
  });
