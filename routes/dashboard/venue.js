import express from "express";

import Module from "../../service/dashboard/venue.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.post("/approve", wrapper(Module.service.approve));
router.get("/pendingvenues", wrapper(Module.service.getPendingVenues));
router.delete("/", wrapper(Module.service.deleteVenue));
router.get("/", wrapper(Module.service.getVenue));

export default router;
