import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3_BUCKET_ID } from "../../constants/index.js";
import { randomId } from "../../util/index.js";
import config from "../../constants/config.js";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = config;

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});

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

    const key = `uploads/${randomId()}.${extension}`;

    const command = new PutObjectCommand({
        Bucket: S3_BUCKET_ID,
        Key: key,
        ContentLength: size,
    });
    const url = await getSignedUrl(client, command, { expiresIn: 300, })
    return {
        key,
        url
    };
}

export default {
    service: {
        POST,
    },
};
