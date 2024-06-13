import express from "express";

import Module from "../../service/dashboard/query/index.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.get("/", wrapper(Module.service.list));
router.post("/", wrapper(Module.service.execute));

export default router;
