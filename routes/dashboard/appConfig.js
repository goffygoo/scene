import express from "express";

import Module from "../../service/dashboard/appConfig.js";
import { verifyAccessToken, verifyAdmin, wrapper } from "../middleware.js";

const router = express.Router();

router.get("/", wrapper(Module.service.GET));
router.patch("/", verifyAccessToken, verifyAdmin, wrapper(Module.service.PATCH));

export default router;
