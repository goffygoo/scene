import express from "express";
import Module from "../../service/auth/access.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.post('/logoutEverywhere', wrapper(Module.service.logoutEverywhere));
router.post('/newAccessToken', wrapper(Module.service.newAccessToken));
router.post('/forgotPassword', wrapper(Module.service.forgotPassword));
router.post('/verifyOtpOrganiser', wrapper(Module.service.verifyOtpOrganiser));
router.post('/resetPassword', wrapper(Module.service.resetPassword));

export default router;