import express from "express";

import Module from "../../service/dashboard/venue.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.post("/approve", wrapper(Module.service.approve));

export default router;
