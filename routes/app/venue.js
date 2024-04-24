import express from "express";
import Module from "../../service/app/venue.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.post('/', wrapper(Module.service.POST));

export default router;