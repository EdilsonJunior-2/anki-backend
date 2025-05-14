const express = require("express");
const studentRouter = require("./routes/students");
const chapterRouter = require("./routes/chapters");
const deckRouter = require("./routes/decks");
const cardRouter = require("./routes/cards");
const authRouter = require("./routes/auth");
const buildRouter = require("./routes/build");
const schRouter = require("./routes/studentCardHistory");
const studyRouter = require("./routes/study");
const adminRouter = require("./routes/admin");
const router = express.Router();

router.use("/", authRouter);
router.use("/", buildRouter);
router.use("/", studyRouter);
router.use("/", studentRouter);
router.use("/", chapterRouter);
router.use("/", deckRouter);
router.use("/", cardRouter);
router.use("/", schRouter);
router.use("/", adminRouter);

module.exports = router;
