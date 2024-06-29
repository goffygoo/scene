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

router.get("/", wrapper(Module.service.GET));

router.get(
  "/place",
  verifyAccessToken,
  verifyOrganiser,
  wrapper(Module.service.getPlace)
);

export default router;
