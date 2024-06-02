import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3_BUCKET_ID } from "../../constants/index.js";
import { randomId } from "../../util/index.js";
import TempImage from "../../model/TempImage.js";

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const client = new S3Client();

const MimeMap = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};

const POST = async ({ body }) => {
    const { mimetype, size } = body;
    const extension = MimeMap[mimetype];

    if (!extension) {
        throw Error('Invalid file type');
    }

    if (size >= MAX_FILE_SIZE) {
        throw Error('Invalid file size');
    }

    const key = `${randomId()}.${extension}`;
    await TempImage.create({ key });

    return {
        key,
        url: `http://192.168.1.9:5002/upload?key=${key}`
    };
}


export default {
    service: {
        POST,
    },
};
