import express from "express";
import auth from "./auth/index.js";
import app from './app/index.js';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send("Health OK");
});

router.use('/auth', auth);
router.use('/app', app);

export default router;