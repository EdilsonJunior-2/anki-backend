const express = require("express");
const pool = require("../sql/connection");
const reqs = require("../sql/queries");
const studyRouter = express.Router();

studyRouter.get("/:key/study/:studentCode/:deckId", (req, res) => {
  pool
    .query(
      reqs.studentCardHistory.toStudy(
        req.params.key,
        req.params.studentCode,
        req.params.deckId
      )
    )
    .then((psql_res) => {
      const cardsToSend = psql_res.rows
        .map((card) => {
          const studyRecord = JSON.parse(card.record);
          const lastRecord = studyRecord[studyRecord.length - 1];
          return {
            schId: card.id,
            id: card.card,
            rating: lastRecord.difficulty_rating,
            meter: studyRecord.length - 1,
            interval: lastRecord.interval,
            nextStudyDate: lastRecord.next_study_date,
            requiresImage: card.requiresimage,
            question: card.question,
            answer: card.answer,
          };
        })
        .sort((a, b) => a.nextStudyDate - b.nextStudyDate)
        .slice(0, 12)
        .filter((c) => c.nextStudyDate < Date.now());
      res
        .status(200)
        .send({ deck: Number(req.params.deckId), cards: cardsToSend });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

studyRouter.post("/:key/updateRecords", async (req, res) => {
  try {
    req.body.cards.map((card) => {
      pool
        .query(reqs.studentCardHistory.getById(req.params.key, card.schId))
        .then((r) => {
          const studyRecord = JSON.parse(r.rows[0].record);
          const lastRecord = studyRecord[studyRecord.length - 1];
          const nextInterval = reqs.nextReviewCalc(
            lastRecord.interval,
            card.meter,
            card.rating,
            card.repetitions
          );
          const nextStudyDate = Date.now() + nextInterval * 24 * 60 * 60 * 1000;
          studyRecord.push({
            interval: nextInterval,
            difficulty_rating: card.rating,
            rating_date: Date.now(),
            next_study_date: nextStudyDate,
          });
          pool.query(
            reqs.studentCardHistory.updateRecord(
              req.params.key,
              studyRecord,
              card.schId
            )
          );
        });
    });
  } catch (e) {
    res.status(400).send(e);
  } finally {
    res.sendStatus(200);
  }
});

module.exports = studyRouter;
