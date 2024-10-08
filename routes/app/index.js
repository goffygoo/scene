import express from "express";
import venue from "./venue.js";
import event from "./event.js";
import search from "./search.js";
import monitor from "./monitor.js";
import help from "./help.js";
import monet from "./monet.js";
import Module from "../../service/app/index.js";
import AppConfigModule from "../../service/dashboard/appConfig.js";
import { verifyAccessToken, wrapper } from "../middleware.js";

const router = express.Router();

router.use("/venue", venue);
router.use("/event", event);
router.use("/search", search);
router.use("/monitor", monitor);
router.use("/help", verifyAccessToken, help);
router.use("/monet", verifyAccessToken, monet);
router.get("/cities", wrapper(Module.service.getCities));
router.get("/types", wrapper(Module.service.getTypes));
router.get("/venuetags", wrapper(Module.service.getVenueTags));
router.get("/timetags", wrapper(Module.service.getTimeTags));
router.get("/eventtags", wrapper(Module.service.getEventTags));
router.get("/specialeventtags", wrapper(Module.service.getSpecialEventTags));
router.get("/appConfig", wrapper(AppConfigModule.service.GET));
router.get("/genders", wrapper(Module.service.getGenders));
router.post("/appConfig", wrapper(Module.service.getAppConfig));

export default router;
