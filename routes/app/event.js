import express from "express";
import Module from "../../service/app/event.js";
import { verifyAccessToken, verifyOrganiser, wrapper } from "../middleware.js";

const router = express.Router();

router.post(
  "/",
  verifyAccessToken,
  verifyOrganiser,
  wrapper(Module.service.POST)
);

export default router;
