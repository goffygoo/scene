import Ajv from "ajv";
import { HEADERS, ApiRequestLogBlackList, ApiResponseLogBlackList } from "../constants/index.js";
import AuthModule from "../service/auth/index.js";
import asyncLocalStorage from "../util/asyncStorage.js";
import { randomId } from "../util/index.js";
import LogModule from "../service/log/index.js";

const ajv = new Ajv();

export const wrapper = (fn) => async (req, res) => {
  const txnId = randomId();
  const body = { ...req.body, ...req.query };
  const locals = res.locals;
  const api = req.originalUrl;
  const startTime = Date.now();
  asyncLocalStorage
    .run(txnId, async () => {
      LogModule.log({
        data: ApiRequestLogBlackList.includes(api) ? "masked" : JSON.stringify({ body, locals }),
        key1: api,
        key2: "apiRequest",
        txnId,
      });
      return fn({ body, locals });
    })
    .then((response) => {
      LogModule.log({
        data: ApiResponseLogBlackList.includes(api) ? "masked" : JSON.stringify(response),
        key1: api,
        key2: "apiResponse",
        metric: Date.now() - startTime,
        txnId,
      });
      return res.send(response);
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
      return res.sendStatus(400);
    });
};

export const parseAppConfig = (req, res, next) => {
  const token = req.headers[HEADERS.AUTHORIZATION];
  const cityKey = req.headers[HEADERS.CITY_KEY];
  const bundleVersion = req.headers[HEADERS.BUNDLE_VERSION];
  const device = req.headers[HEADERS.DEVICE];
  const appVersion = req.headers[HEADERS.APP_VERSION];
  const deviceId = req.headers[HEADERS.DEVICE_ID];
  const userData = AuthModule.decodeAccessToken(token);
  res.locals.cityKey = cityKey;
  res.locals.bundleVersion = bundleVersion;
  res.locals.device = device;
  res.locals.appVersion = appVersion;
  res.locals.deviceId = deviceId;
  if (userData) res.locals.userData = userData;
  return next();
};

export const verifyAccessToken = (req, res, next) => {
  const token = req.headers[HEADERS.AUTHORIZATION];
  const data = AuthModule.decodeAccessToken(token);
  if (!data) {
    return res.sendStatus(401);
  } else {
    res.locals.userData = data;
    return next();
  }
};

export const verifyAdmin = (_req, res, next) => {
  const { userData } = res.locals;
  const { admin } = userData;
  if (!admin) {
    return res.sendStatus(401);
  } else {
    return next();
  }
};

export const verifySuperAdmin = (_req, res, next) => {
  const { userData } = res.locals;
  const { superAdmin } = userData;
  if (!superAdmin) {
    return res.sendStatus(401);
  } else {
    return next();
  }
};

export const verifyOrganiser = (_req, res, next) => {
  const { userData } = res.locals;
  const { organiser } = userData;
  if (!organiser) {
    return res.sendStatus(401);
  } else {
    return next();
  }
};

export const verifyOrganiserOrAdmin = (_req, res, next) => {
  const { userData } = res.locals;
  const { organiser, admin } = userData;
  if (!organiser && !admin) {
    return res.sendStatus(401);
  } else {
    return next();
  }
};

export const validateSchema = (schema) => (req, res, next) => {
  const validate = ajv.compile(schema);
  const valid = validate(req.body);
  if (!valid) {
    return res.sendStatus(400);
  } else {
    return next();
  }
};
