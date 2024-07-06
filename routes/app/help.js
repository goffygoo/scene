import express from "express";
import Module from "../../service/app/help.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.get("/getMessages", wrapper(Module.service.getMessages));
router.post("/sendMessage", wrapper(Module.service.sendMessage));

export default router;