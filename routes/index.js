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

router.get("/model", async (req, res) => {
  const { model } = req.query;
  const Model = await import(`../model/${model}.js`);
  const data = await Model.default.find({});
  res.send(data);
});

router.use("/auth", auth);
router.use("/app", parseAppConfig, app);
router.use("/dashboard", verifyAccessToken, verifyAdmin, dashboard);
router.use("/file", verifyAccessToken, verifyOrganiserOrAdmin, file);

export default router;
