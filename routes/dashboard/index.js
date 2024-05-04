import express from "express";

import organiser from "./organiser.js";
import venue from "./venue.js";

const router = express.Router();

router.use("/organiser", organiser);
router.use("/venue", venue);

export default router;
