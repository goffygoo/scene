import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME } from "../../constants/index.js"
import config from "../../constants/config.js";
import User from "../../model/User.js";
import OrganiserOtp from "../../model/OrganiserOtp.js";
import { sendOtpResetPassword } from "../../util/mail/index.js";
import Organiser from "../../model/Organiser.js";
import { processPassword } from "../../util/index.js";

const { JWT_SECRET_KEY } = config;

const generateAccessToken = (data) => {
    const accessToken = jwt.sign(data, JWT_SECRET_KEY, {
        expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
    });
    return accessToken;
}

const decodeAccessToken = (token) => {
    try {
        const decodedData = jwt.verify(token, JWT_SECRET_KEY);
        return decodedData;
    } catch (err) {
        return null;
    }
}

const logoutEverywhere = async ({ body }) => {
    const { userId } = body;
    await User.findByIdAndUpdate(userId, {
        refreshToken: '',
        tokenEAT: 0,
    });
}

const newAccessToken = async ({ body }) => {
    const { userId, refreshToken } = body;
    const user = await User.findByIdAndSelect(userId, {
        refreshToken: 1,
        tokenEAT: 1,
    });
    if (
        !(
            user &&
            user.refreshToken === refreshToken &&
            Date.now() < user.tokenEAT
        )
    ) {
        throw Error('Invalid data');
    }
    const accessToken = generateAccessToken({
        userId,
        email: user.email,
    });
    return {
        accessToken
    };
}

const forgotPassword = async ({ body }) => {
    const { email } = body;
    let session = null;
    try {
        session = await db.startSession()
        session.startTransaction()
        const user = await User.findOneAndSelect({ email }, { _id: 1 }, session);
        if (!user) {
            throw Error();
        }
        const OTP = generateOtp();
        await OrganiserOtp.deleteOne({ email }, session);
        await OrganiserOtp.create([{
            email,
            value: OTP
        }], session);
        await sendOtpResetPassword(email, OTP);
        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        await session.endSession();
    }
}

const verifyOtpOrganiser = async ({ body }) => {
    const { otp, email } = body;
    const otpObject = await OrganiserOtp.findOne({ email });
    if (!otpObject || otpObject.value !== otp) throw Error();
    await OrganiserOtp.deleteOne({ email });
    const resetToken = generateAccessToken({
        email,
        resetPassword: true
    });
    return {
        resetToken
    };
}

const resetPassword = async ({ body }) => {
    const { resetToken, password } = body;
    const tokenPayload = decodeAccessToken(resetToken);
    const { resetPassword, email } = tokenPayload;
    if (resetPassword) throw Error();
    const refreshToken = generateRefreshToken();
    const tokenEAT = Date.now() + REFRESH_TOKEN_EXPIRE_TIME;
    await Organiser.findOneAndUpdate({ email }, {
        password: processPassword(password),
        refreshToken,
        tokenEAT,
    });
}

export default {
    service: {
        logoutEverywhere,
        newAccessToken,
        forgotPassword,
        verifyOtpOrganiser,
        resetPassword,
    },
    generateAccessToken,
    decodeAccessToken,
}