const express = require("express");
const pool = require("./sql/connection");
const reqs = require("./sql/spacedRepetition");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/students", async (req, res) => {
  pool
    .query(`SELECT * FROM student;`)
    .then((r) => res.status(200).send(r.rows));
});

/*

router.get("/cards", async (req, res) => {
  pool.query(`SELECT * FROM card;`).then((r) => res.status(200).send(r.rows));
});

router.get("/decks", async (req, res) => {
  pool.query(`SELECT * FROM deck;`).then((r) => res.status(200).send(r.rows));
});
*/

router.get("/studentCardHistory/:studentCode", async (req, res) => {
  pool
    .query(
      `SELECT * FROM student_card_history sch WHERE sch.student_code = '${req.params.studentCode}' ;`
    )
    .then((r) =>
      res.status(200).send(
        r.rows.map((row) => ({
          ...row,
          study_record: JSON.parse(row.study_record),
        }))
      )
    );
});

router.get("/studentCardHistory/new/:studentCode", async (req, res) => {
  pool
    .query(
      `INSERT INTO student_card_history (student_code, card_id, study_record) VALUES
       ${[...Array(568)]
         .map((_, index) => {
           return `('${req.params.studentCode}', ${
             index + 1
           },' ${JSON.stringify([
             {
               interval: 0,
               difficulty_rating: 0,
               rating_date: Date.now(),
               next_study_date: Date.now(),
             },
           ])}')`;
         })
         .join(", ")};`
    )
    .then((r) => res.sendStatus(200));
});

router.post("/login", (req, res) => {
  pool
    .query(reqs.login(req.body.code))
    .then((r) => {
      if (r.rows.length === 0) res.status(400).send("Usuário não encontrado");
      else {
        const user = r.rows[0];
        var token = jwt.sign(
          { id: user.code },
          "asdaaaaaaaaaaaaaaaaaaaaafasd",
          {
            expiresIn: "1h",
          }
        );
        res.status(200).send({
          auth: true,
          user: user,
          token: token,
        });
      }
    })
    .catch((err) => {
      res.status(400).send("Usuário não encontrado");
    });
});

router.get("/studentDecksInfo/:studentCode", (req, res) => {
  pool.query(reqs.getAllCards(req.params.studentCode)).then((r) => {
    var decks = [...Array(51)].map((_, index) => {
      return {
        deckId: index + 1,
        newCards: 0,
        repeatedCards: 0,
      };
    });
    r.rows.map((card) => {
      const record = JSON.parse(card.study_record);
      const currentStage = record[record.length - 1];
      if (record.length == 1) decks[card.deck - 1].newCards += 1;
      else if (currentStage.next_study_date < Date.now())
        decks[card.deck - 1].repeatedCards += 1;
    });
    res.status(200).send(decks);
  });
});

router.post("/updateData", (req, res) => {
  pool
    .query("SELECT * FROM Deck")
    .then((r) => {
      res.status(200).send(r.rows);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get("/student/:code", (req, res) => {
  pool
    .query(reqs.studentData(req.params.code))
    .then((r) => res.status(200).send(r.rows[0]))
    .catch((err) => res.status(400).send(err));
});

router.get("/student/:studentCode/deck/:deckId", (req, res) => {
  pool
    .query(reqs.cardsToStudy(req.params.studentCode, req.params.deckId))
    .then((psql_res) => {
      const cardsToSend = psql_res.rows
        .map((card) => {
          const studyRecord = JSON.parse(card.study_record);
          const lastRecord = studyRecord[studyRecord.length - 1];
          return {
            schId: card.sch_id,
            cardId: card.card_id,
            rating: lastRecord.difficulty_rating,
            meter: studyRecord.length - 1,
            interval: lastRecord.interval,
            nextStudyDate: lastRecord.next_study_date,
            category: card.category,
          };
        })
        .sort((a, b) => a.nextStudyDate - b.nextStudyDate)
        .slice(0, 12)
        .filter((c) => c.nextStudyDate < Date.now());
      res
        .status(200)
        .send({ deck: Number(req.params.deckId), cards: cardsToSend });
    })
    .catch((err) => res.status(400).send(err));
});

router.post("/cards/newRating", (req, res) => {
  var flag = false;
  req.body.cards.map((card) => {
    pool
      .query(reqs.getCard(card.schId))
      .then((r) => {
        const studyRecord = JSON.parse(r.rows[0].study_record);
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
        pool.query(reqs.updateStudyRecord(studyRecord, card.schId));
      })
      .catch(() => {
        flag = true;
      });
  });
  if (flag) res.sendStatus(500);
  else res.sendStatus(200);
});

module.exports = router;
