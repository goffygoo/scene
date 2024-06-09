import express from "express";

import Module from "../../service/dashboard/event.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.patch("/", wrapper(Module.service.PATCH));

export default router;
