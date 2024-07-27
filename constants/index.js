export const USER_TYPES = {
    CONSUMER: 'CONSUMER',
    PROVIDER: 'PROVIDER'
}

export const GENDER = {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other'
}

export const REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 180;

// TODO: change to 60 * 15
export const ACCESS_TOKEN_EXPIRE_TIME_IN_SECS = 60 * 60 * 24;

export const HEADERS = {
    AUTHORIZATION: "authorization",
    CITY_KEY: "x-citykey",
    BUNDLE_VERSION: "x-bundleversion",
    APP_VERSION: "x-appversion",
    DEVICE_ID: "x-deviceid",
    DEVICE: "x-device",
    RAZORPAY_SIGNATURE: "x-razorpay-signature",
};

export const MODEL_INDEX = {
    EVENT: "event",
    VENUE: "venue",
};

export const S3_BUCKET_ID = "baljeetkode-project-w-static";
export const S3_CDN_URL = "d2dgbj1h085qlp.cloudfront.net";

export const LOG_TYPES = {
    LOG: "log",
    ERROR: "error",
    EVENT: "event",
    FE_LOG: "felog",
}

export const enableESLogging = (process.env.ENABLE_ES_LOGS === '1');

export const DataTypes = {
    string: "string",
    boolean: "boolean",
    number: "number",
}

export const ApiRequestLogBlackList = [
    '/api/auth/user/login',
    '/api/auth/organiser/login',
    '/api/auth/admin/login',
    '/api/auth/organiser/resetPassword',
    '/api/auth/admin/resetPassword',
]

export const ApiResponseLogBlackList = [
    ''
]

export const FCM_EVENTS = {
    HELP_CHAT: "helpchat",
};

export const ORDER_STATUS = {
    CREATED: "created",
    SUCCESS: "success",
    FAILED: "failed",
    REFUNDED: "refunded",
};

export const PG_PAYMENT_STATUS = {
    CAPTURED: "captured",
    FAILED: "failed",
};