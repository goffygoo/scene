import express from "express";
import Module from "../../service/app/search/index.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.get(
    "/labels",
    wrapper(Module.service.getLabels)
);
router.post(
    "/",
    wrapper(Module.service.POST)
);

export default router;