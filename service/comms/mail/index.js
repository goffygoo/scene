import nodemailer from "nodemailer";
import { otpResetPasswordTemplate, otpTemplate } from "./template.js";
import config from "../../../constants/config.js";

const { MAILER_ID, MAILER_PASSWORD } = config;

let transporter = nodemailer.createTransport({
    service: 'Godaddy',
    host: "smtpout.secureserver.net",  
    secureConnection: false,
    port: 465,
    auth: {
        user: MAILER_ID,
        pass: MAILER_PASSWORD
    },
});

const sendMailToUser = async (email, subject, html) => {
    try {
        let mailOptions = {
            from: `"Scene" <${MAILER_ID}>`,
            to: email,
            subject,
            html,
        };
        await transporter.sendMail(mailOptions); 
    } catch (_e) {}
};

const sendOtpMail = async (email, otp) => {
    const template = otpTemplate(otp);
    return sendMailToUser(
        email,
        'OTP for Scene login',
        template
    );
}

const sendOtpResetPassword = async (email, otp) => {
    const template = otpResetPasswordTemplate(otp);
    return sendMailToUser(
        email,
        'OTP for Scene Password Reset',
        template
    );
}

export default {
    sendOtpMail,
    sendOtpResetPassword,
}