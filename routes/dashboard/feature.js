import express from "express";

import Module from "../../service/dashboard/feature.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.get("/", wrapper(Module.service.GET));
router.post("/", wrapper(Module.service.POST));
router.patch("/", wrapper(Module.service.PATCH));
router.delete("/", wrapper(Module.service.DELETE));

export default router;
