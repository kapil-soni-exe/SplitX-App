const {Resend} = require("resend")
const otpEmailTemplate = require("../templets/otpEmail.template")
const verifySuccessTemplate = require("../templets/verifySuccess.template")

const resend = new Resend(process.env.RESEND_API);
const sendOtpEmail = async({to,otp})=>{
    return resend.emails.send({
        from:process.env.EMAIL_FROM,
        to,
        subject:"Verify your email - SplitX",
        html: otpEmailTemplate(otp)

    })
}
const sendVerifySuccessEmail = async ({ to, name }) => {
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Email verified successfully - SplitX",
    html: verifySuccessTemplate(name),
  });
};

module.exports = { sendOtpEmail, sendVerifySuccessEmail };