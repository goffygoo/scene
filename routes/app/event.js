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

router.patch(
  "/",
  verifyAccessToken,
  verifyOrganiser,
  wrapper(Module.service.PATCH)
);

router.get("/", wrapper(Module.service.GET));

router.get(
  "/events",
  verifyAccessToken,
  verifyOrganiser,
  wrapper(Module.service.getEvents)
);

router.post("/register", verifyAccessToken, wrapper(Module.service.register));

router.post("/register", verifyAccessToken, wrapper(Module.service.register));

router.get("/tickets", verifyAccessToken, wrapper(Module.service.getTickets));

router.post(
  "/scanTicket",
  verifyAccessToken,
  verifyOrganiser,
  wrapper(Module.service.scanTicket)
);

export default router;
