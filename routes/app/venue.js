import express from "express";
import Module from "../../service/app/venue.js";
import { verifyAccessToken, verifyOrganiser, wrapper } from "../middleware.js";

const router = express.Router();

router.post(
  "/",
  verifyAccessToken,
  verifyOrganiser,
  wrapper(Module.service.POST)
);

router.patch(
  "/",
  verifyAccessToken,
  verifyOrganiser,
  wrapper(Module.service.PATCH)
);

export default router;
