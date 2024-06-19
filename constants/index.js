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
    DEVICE: "x-device",
};

export const MODEL_INDEX = {
    EVENT: "event",
    VENUE: "venue",
};

export const S3_BUCKET_ID = "goffygoo-static-images";

export const LOG_TYPES = {
    LOG: "log",
    ERROR: "error",
    EVENT: "event",
    FE_LOG: "felog",
}

export const enableESLogging = false;

export const DataTypes = {
    string: "string",
    boolean: "boolean",
    number: "number",
}