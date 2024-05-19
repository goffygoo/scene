import express from "express";

import image from "./image.js";

const router = express.Router();

router.use("/image", image);

export default router;
