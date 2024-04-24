import axios from "axios";
import { randomUUID, createHash } from "crypto";
import config from "../constants/config.js";

const { PASSWORD_SALT } = config;

export const generateOtp = () => {
    let value = Math.ceil(Math.random() * 10000).toString();
    while (value.length !== 4) {
        value = '0' + value;
    }
    return value;
}

export const generateRefreshToken = () => {
    return randomUUID().split('-').join('');
}

export const processPassword = (password) => {
    const hash = createHash("sha256");
    hash.write(password + PASSWORD_SALT);
    return hash.digest("base64");
};

const getUpdatedUrl = (url, body = {}) => {
    let newUrl = url;
    const keys = Object.keys(body);
    if (keys.length > 0) {
        newUrl = newUrl + "?";
        for (let i = 0; i < keys.length; i++) {
            newUrl =
                newUrl +
                encodeURIComponent(keys[i]) +
                "=" +
                encodeURIComponent(body[keys[i]]) +
                "&";
        }
        newUrl = newUrl.slice(0, -1);
    }
    return newUrl;
};

export const httpRequest = async (method, url, body, config) => {
    try {
        if (method === "get" || method === "delete") {
            url = getUpdatedUrl(url, body);
            body = config;
        }
        const { data: response } = await axios[method](url, body, config);
        return response;
    } catch (err) {
        const errCode = err?.code;
        const request = {
            method: err?.config?.method,
            url: err?.config?.url,
            body: err?.config?.data,
            headers: err?.config?.headers?.toJSON?.(),
        }
        if (errCode === 'ERR_NETWORK' || errCode === 'ECONNREFUSED') {
            throw {
                message: 'Network Error',
                request
            }
        } else if (errCode === 'ERR_CANCELED') {
            throw {
                message: 'Request Cancelled',
                request
            }
        } else if (err?.response?.data) {
            throw {
                message: 'Bad Request',
                error: err?.response?.data,
                status: err?.response?.status,
                request
            }
        }
        throw err;
    }
}