import CommsModule from "../service/comms/index.js";

const execute = async (params) => {
    const { email, otp } = params;
    await CommsModule.mail.sendOtpResetPassword("vineetoli52@gmail.com", "7777");
}

export default execute;