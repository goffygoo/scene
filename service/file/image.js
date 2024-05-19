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

    const key = `images/${randomId()}.${extension}`;
    await TempImage.create({ key });

    return {
        key,
        url: 'http://localhost:5002/upload'
    };

    const command = new PutObjectCommand({
        Bucket: S3_BUCKET_ID,
        Key: key,
        ContentLength: size,
    });

    const url = await getSignedUrl(client, command, { expiresIn: 300 });

    return {
        key,
        url
    };
}

const saveImage = async (file) => undefined;

const saveImagesBulk = async (files) => undefined;

const deleteImage = async (file) => undefined;

const deleteImagesBulk = async (files) => undefined;

export default {
    service: {
        POST,
    },
    saveImage,
    saveImagesBulk,
    deleteImage,
    deleteImagesBulk
};
