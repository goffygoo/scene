import express from "express";
import LogModule from "../../service/log/index.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.post(
    "/log",
    wrapper(LogModule.service.feLog)
);
router.post(
    "/event",
    wrapper(LogModule.service.event)
);

export default router;