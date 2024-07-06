import express from "express";

import Module from "../../service/dashboard/support.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.get("/openIssues", wrapper(Module.service.getOpenIssues));
router.post("/assignIssue", wrapper(Module.service.assignIssue));
router.get("/allIssues", wrapper(Module.service.getAllIssues));
router.post("/getMessagesForIssue", wrapper(Module.service.getMessagesForIssue));
router.post("/resolveIssue", wrapper(Module.service.resolveIssue));
router.post("/replyOnIssue", wrapper(Module.service.replyOnIssue));

export default router;
