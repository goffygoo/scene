import express from "express";

import admin from "./admin.js";
import organiser from "./organiser.js";
import user from "./user.js";

const router = express.Router();

router.use("/admin", admin);
router.use("/organiser", organiser);
router.use("/user", user);

export default router;
