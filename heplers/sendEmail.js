const nodemailer = require("nodemailer");

const { META_PASS, USER_MAIL } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: USER_MAIL,
    pass: META_PASS,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
    const email = { ...data, from: "heinti@meta.ua" };
  
    await transport.sendMail(email);
  };

module.exports = sendEmail;
