import express from "express";

import organiser from "./organiser.js";
import venue from "./venue.js";
import feature from "./feature.js";
import appConfig from "./appConfig.js";

const router = express.Router();

router.use("/organiser", organiser);
router.use("/venue", venue);
router.use("/feature", feature);
router.use("/appConfig", appConfig);

export default router;
