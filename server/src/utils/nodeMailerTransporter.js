const nodemailer = require("nodemailer");

const createTransporter = (user, pass) => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: { user, pass },
  });
};

const otpTransporter = createTransporter(
  process.env.EMAIL_USER,
  process.env.EMAIL_PASS
);
const revisionCountTransporter = createTransporter(
  process.env.REVIEW_EMAIL,
  process.env.REVIEW_EMAIL_PASS
);

module.exports = { otpTransporter, revisionCountTransporter };
