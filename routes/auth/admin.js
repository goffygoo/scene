import express from "express";
import Module from "../../service/auth/admin.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.post('/login', wrapper(Module.service.login));
router.post('/forgotPassword', wrapper(Module.service.forgotPassword));
router.post('/verifyOtp', wrapper(Module.service.verifyOtp));
router.post('/resetPassword', wrapper(Module.service.resetPassword));
router.post('/newAccessToken', wrapper(Module.service.newAccessToken));

export default router;