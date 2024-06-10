import express from "express";
import auth from "./auth/index.js";
import app from "./app/index.js";
import dashboard from "./dashboard/index.js";
import file from "./file/index.js";
import {
  parseAppConfig,
  verifyAccessToken,
  verifyAdmin,
  verifyOrganiserOrAdmin,
} from "./middleware.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send("Health OK");
});

router.use("/auth", auth);
router.use("/app", parseAppConfig, app);
router.use("/dashboard", verifyAccessToken, verifyAdmin, dashboard);
router.use("/file", verifyAccessToken, verifyOrganiserOrAdmin, file);

export default router;
