export const otpTemplate = (otp) => {
    return `
        <h1>Your Login OTP is ${otp}<h1><br>
        <br>
        <h3>Please do NOT reply to this email</h3>
        <p>Please do NOT share this with anyone, to keep your account safe.</p>
    `;
}

export const otpResetPasswordTemplate = (otp) => {
    return `
        <h1>Your Password Reset OTP is ${otp}<h1><br>
        <br>
        <h3>Please do NOT reply to this email</h3>
        <p>Please do NOT share this with anyone, to keep your account safe.</p>
    `;
}
