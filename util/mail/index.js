import nodemailer from "nodemailer";
import { otpResetPasswordTemplate, otpTemplate } from "./template.js";
import config from "../../constants/config.js";

const { MAILER_ID, MAILER_PASSWORD } = config;

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: MAILER_ID,
        pass: MAILER_PASSWORD,
    },
});

const sendMailToUser = async (email, subject, html) => {
    try {
        let mailOptions = {
            from: `"Kul Bois" <${MAILER_ID}>`,
            to: email,
            subject,
            html,
        };
        transporter.sendMail(mailOptions, (error, _info) => {
            if (error) {
                return console.log(error);
            }
        });
    } catch (_e) {
    }
};

export const sendOtpMail = async (email, otp) => {
    const template = otpTemplate(otp);
    sendMailToUser(
        email,
        'OTP for BaljeetKode login',
        template
    );
}

export const sendOtpResetPassword = async (email, otp) => {
    const template = otpResetPasswordTemplate(otp);
    sendMailToUser(
        email,
        'OTP for BaljeetKode Password Reset',
        template
    );
}