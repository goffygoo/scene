import config from '../constants/config.js';
import { httpRequest } from './index.js';

const { FILE_SERVER } = config;

const request = async (route, body) => {
    const config = {};
    return httpRequest(
        "post",
        FILE_SERVER + route,
        body,
        config
    );
}

export const saveFile = async (file) => {
    await request('/save', { file });
}

export const saveFilesBulk = async (files) => {
    await request('/saveBulk', { files });
}

export const deleteFile = async () => {
    await request('/deleteFile', { file });
}

export const deleteFilesBulk = async () => {
    await request('/deleteFilesBulk', { files });

}