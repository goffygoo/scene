import Ajv from "ajv";
import { HEADERS } from "../constants/index.js";
import AuthModule from "../service/auth/index.js";

const ajv = new Ajv();

export const wrapper = (fn) => async (req, res) => {
  try {
    const body = { ...req.body, ...req.query };
    const locals = res.locals;
    const response = await fn({ body, locals });
    return res.send(response);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const parseAppConfig = (req, res, next) => {
  const cityKey = req.headers[HEADERS.CITY_KEY];
  const bundleVersion = req.headers[HEADERS.BUNDLE_VERSION];
  const device = req.headers[HEADERS.DEVICE];
  res.locals.cityKey = cityKey;
  res.locals.bundleVersion = bundleVersion;
  res.locals.device = device;
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

export const verifyOrganiser = (_req, res, next) => {
  const { userData } = res.locals;
  const { organiser } = userData;
  if (!organiser) {
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

