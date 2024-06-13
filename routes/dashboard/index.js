import express from "express";

import organiser from "./organiser.js";
import venue from "./venue.js";
import feature from "./feature.js";
import appConfig from "./appConfig.js";
import event from "./event.js";
import query from "./query.js";
import { verifySuperAdmin } from "../middleware.js";

const router = express.Router();

router.use("/organiser", organiser);
router.use("/venue", venue);
router.use("/feature", feature);
router.use("/appConfig", appConfig);
router.use("/event", event);
router.use("/query", verifySuperAdmin, query);



export default router;
