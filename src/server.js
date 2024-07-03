const express = require("express");
const pool = require("./sql/connection");
const reqs = require("./sql/spacedRepetition");
const router = express.Router();

router.get("/", async (req, res) => {});

router.post("/updateData", (req, res) => {
  pool.query("SELECT * FROM Deck", (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
    } else {
      res.send(result.recordset);
    }
  });
});

router.get("/studentData/:code", (req, res) => {
  pool.query(reqs.studentData(req.params.code), (err, result) => {
    if (err) throw err;
    else res.send(result.recordset);
  });
});

router.get("/student/:studentCode/deck/:deckId", (req, res) => {
  pool.query(
    reqs.cardsToStudy(req.params.studentCode, req.params.deckId),
    (err, result) => {
      if (err) throw err;
      else
        res.send({ deck: Number(req.params.deckId), cards: result.recordset });
    }
  );
});

router.post("/cards/newRating", (req, res) => {
  var flag = false;
  req.body.cards.map((card) => {
    pool.query(reqs.deactiveCardToStudy(card.schId), (err) => {
      if (err) flag = true;
      else {
        pool.query(
          reqs.insertNewCardHistory(req.body.studentId, card.id, card.rating),
          (err) => {
            if (err) flag = true;
          }
        );
      }
    });
  });

  if (flag) res.sendStatus(500);
  else res.sendStatus(200);
});

module.exports = router;
