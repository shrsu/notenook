const { UserModel } = require("../models/UserModel");
const { revisionCountTransporter } = require("./nodeMailerTransporter");

const sendReviewReminderEmail = async () => {
  try {
    const users = await UserModel.find({ reviewListCount: { $gt: 0 } }).select(
      "username email reviewListCount fullname"
    );

    if (users.length === 0) {
      console.log("No users with pending reviews.");
      return;
    }

    for (const user of users) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Reminder to Revise Your Notes",
        html: `
          <div style="font-family: 'Montserrat', sans-serif; padding: 20px; background-color: #d9edec; border-radius: 8px; text-align: center; margin: auto; width: fit-content;">
            <div style="margin-bottom: 20px; text-align: center;">
              <img src="${process.env.LOGO_URL}" alt="Logo" style="width: 125px;">
            </div>
            <h2 style="color: #157ce3; font-weight:900;">NOTENOOK REVISION REMINDER</h2>
            <p style="color: #333;">Dear ${user.fullname},</p>
            <p style="color: #333;">You have <strong style="color: #157ce3;">${user.reviewListCount}</strong> notes ready for revision.</p>
            <p style="color: #333;">Revising your notes regularly is key to effective learning and retention.</p>
            <p style="color: #333;">Please take some time today to go over your notes and reinforce your knowledge.</p>
            <p style="color: #333;">Thank you!</p>
          </div>
        `,
      };

      await revisionCountTransporter.sendMail(mailOptions);
    }
  } catch (error) {
    if (error.name === "MongoError") {
      console.error("Database error occurred while fetching users:", error);
    } else if (error.name === "SMTPError" || error.responseCode === 550) {
      console.error("Email sending error occurred:", error);
    } else {
      console.error("An unexpected error occurred:", error);
    }

    throw error; 
  }
};

module.exports = { sendReviewReminderEmail };
