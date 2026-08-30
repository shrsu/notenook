const express = require("express");
const router = express.Router();

const { authenticateJWT } = require("../auth/authenticateJWT");
const { askQuestion, getStats, runIngest } = require("../controllers/aiControllers");

router.use(authenticateJWT);

router.get("/stats", getStats);

router.post("/ingest", runIngest);

router.post("/ask", askQuestion);

module.exports = router;
