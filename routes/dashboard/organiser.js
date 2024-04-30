import express from "express";

import Module from "../../service/dashboard/organiser.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.post("/addorganiser", wrapper(Module.service.addOrganiser));

export default router;
