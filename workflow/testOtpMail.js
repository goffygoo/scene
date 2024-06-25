import CommsModule from "../service/comms/index.js";

const execute = async (params) => {
    const { email, otp } = params;
    await CommsModule.mail.sendOtpResetPassword(email, otp);
}

export default execute;