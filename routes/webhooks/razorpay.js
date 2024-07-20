import express from "express";
import { createHmac } from "crypto";
import config from "../../constants/config.js";
import { HEADERS } from "../../constants/index.js";
import { randomId } from "../../util/index.js";
import LogModule from "../../service/log/index.js";
import MonetModule from "../../service/monet/index.js";
import asyncLocalStorage from "../../util/asyncStorage.js";

const router = express.Router();

router.use(
  express.json({
    limit: "1mb",
    extended: true,
    verify: function (req, _res, buf) {
      const signature = req.headers[HEADERS.RAZORPAY_SIGNATURE];
      const secret = config.RAZORPAY_WEBHOOK_SECRET;
      if (
        createHmac("sha256", secret).update(buf).digest("hex") !== signature
      ) {
        throw new Error("Invalid Signature");
      }
    },
  })
);

router.post("/", async (req, res) => {
  res.sendStatus(200);
  const checkPayment = req.body.payload?.payment.entity;
  if (!checkPayment) return;
  const txnId = randomId();
  const api = req.originalUrl;
  const startTime = Date.now();
  asyncLocalStorage
    .run(txnId, async () => {
      LogModule.log({
        data: JSON.stringify(req.body),
        key1: api,
        key2: "webhookRequest",
        txnId,
      });
      return MonetModule.service.confirmPayment({
        body: {
          checkPaymentPre: checkPayment,
          pgPaymentId: undefined,
        },
      });
    })
    .then((response) => {
      LogModule.log({
        data: JSON.stringify({ response }),
        key1: api,
        key2: "webhookResponse",
        metric: Date.now() - startTime,
        txnId,
      });
    })
    .catch((err) => {
      LogModule.error({
        error: JSON.stringify(err),
        message: err.toString(),
        stack: JSON.stringify(err.stack),
        key1: api,
        metric: Date.now() - startTime,
        txnId,
      });
      if (process.env.NODE_ENV !== "production") console.log(err);
    });
});

export default router;
