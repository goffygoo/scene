import express from "express";
import venue from './venue.js';
import Module from "../../service/app/index.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.use('/venue', venue);
router.get('/cities', wrapper(Module.service.getCities));

export default router;