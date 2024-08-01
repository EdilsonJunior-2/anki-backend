const express = require("express");
const pool = require("./sql/connection");
const reqs = require("./sql/spacedRepetition");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {});

router.get("/keepConnection", async (_, res) => {
  res.status(200).send("Conenction open");
});

router.post("/login", (req, res) => {
  pool.query(reqs.login(req.body.code), (err, result) => {
    if (err || result.recordset.length === 0)
      res.status(400).send("Usuário não encontrado");
    else {
      const user = result.recordset[0];
      var token = jwt.sign({ id: user.code }, "asdaaaaaaaaaaaaaaaaaaaaafasd", {
        expiresIn: "1h",
      });
      res
        .status(200)
        .send({ auth: true, user: result.recordset[0], token: token });
    }
  });
});

router.post("/updateData", (req, res) => {
  pool.query("SELECT * FROM Deck", (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(400).send(err);
    } else {
      res.status(200).send(result.recordset);
    }
  });
});

router.get("/studentData/:code", (req, res) => {
  pool.query(reqs.studentData(req.params.code), (err, result) => {
    if (err) {
      res.status(400).send(err);
      throw err;
    } else res.status(200).send(result.recordset);
  });
});

router.get("/student/:studentCode/deck/:deckId", (req, res) => {
  pool.query(
    reqs.cardsToStudy(req.params.studentCode, req.params.deckId),
    (err, result) => {
      if (err) {
        res
          .status(400)
          .send(
            "Ops, algum erro ocorreu, por favor tente novamente mais tarde"
          );
        throw err;
      } else
        res
          .status(200)
          .send({ deck: Number(req.params.deckId), cards: result.recordset });
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
          reqs.insertNewCardHistory(
            req.body.studentId,
            card.id,
            card.rating,
            card.meter,
            card.interval
          ),
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
