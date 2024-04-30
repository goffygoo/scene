import express from "express";

import Module from "../../service/dashboard/organiser.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.post("/add", wrapper(Module.service.add));

export default router;
