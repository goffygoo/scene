import express from "express";
import user from "./user.js";
import organiser from "./organiser.js";

const router = express.Router();

router.use("/user", user);
router.use("/organiser", organiser);

export default router;
