import express from "express";

import Module from "../../service/dashboard/venue.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.post("/approve", wrapper(Module.service.approve));
router.get("/pendingvenues", wrapper(Module.service.getVenues));

export default router;
