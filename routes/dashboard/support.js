import express from "express";

import Module from "../../service/dashboard/support.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.get("/openIssues", wrapper(Module.service.getOpenIssues));
router.post("/assignIssue", wrapper(Module.service.assignIssue));
router.get("/allIssues", wrapper(Module.service.getAllIssues));
router.post("/getMessagesForIssue", wrapper(Module.service.getMessagesForIssue));

export default router;
