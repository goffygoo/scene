import express from "express";
import venue from './venue.js';
import event from './event.js';
import search from './search.js';
import Module from "../../service/app/index.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.use('/venue', venue);
router.use('/event', event);
router.use('/search', search);
router.get('/cities', wrapper(Module.service.getCities));
router.get('/types', wrapper(Module.service.getTypes));


export default router;