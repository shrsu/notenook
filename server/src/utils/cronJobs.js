const cron = require("node-cron");
const { sendReviewReminderEmail } = require("./sendReviewRemainderEmail");
const { reindexStaleNotes } = require("../ai/reindex");

module.exports = {
  setupCronJobs: () => {
    // Catch the assistant's index up with notes edited since the last sweep.
    // Runs often because it only touches notes that actually changed.
    cron.schedule("*/5 * * * *", async () => {
      try {
        const result = await reindexStaleNotes();
        if (result.indexed) console.log("Reindexed notes:", result);
      } catch (error) {
        console.error("Error reindexing notes:", error.message);
      }
    });

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
