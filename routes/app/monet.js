import express from "express";
import Module from "../../service/monet/index.js";
import { wrapper } from "../middleware.js";

const router = express.Router();

router.post("/createOrder", wrapper(Module.service.createOrder));
router.post("/confirmPayment", wrapper(Module.service.confirmPayment));

export default router;