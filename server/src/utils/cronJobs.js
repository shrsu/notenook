const cron = require("node-cron");
const { sendReviewReminderEmail } = require("./sendReviewRemainderEmail");

module.exports = {
  setupCronJobs: () => {
    cron.schedule("0 5 * * 0", async () => {
      try {
        await sendReviewReminderEmail();
        console.log("Review reminder emails sent successfully.");
      } catch (error) {
        console.error("Error sending review reminder emails:", error);
      }
    });
  },
};
