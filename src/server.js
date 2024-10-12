const express = require("express");
const pool = require("./sql/connection");
const reqs = require("./sql/spacedRepetition");
const router = express.Router();
const jwt = require("jsonwebtoken");
const chapters = require("../cards.json");

router.get("/students", async (_, res) => {
  pool
    .query(reqs.getters.allStudents)
    .then((r) => res.status(200).send(r.rows));
});
router.get("/chapters", async (_, res) => {
  pool
    .query(reqs.getters.allChapters)
    .then((r) => res.status(200).send(r.rows));
});
router.get("/decks", async (_, res) => {
  pool.query(reqs.getters.allDecks).then((r) => res.status(200).send(r.rows));
});
router.get("/cards", async (_, res) => {
  pool.query(reqs.getters.allCards).then((r) => res.status(200).send(r.rows));
});

router.get("/setUp", async (req, res) => {
  var deckId = 0;
  chapters.map((chapter, chapterIndex) => {
    pool.query(reqs.mutations.createChapter(chapter.name)).then(() => {
      chapter.decks.map((deck) => {
        pool
          .query(
            reqs.mutations.createDeck(deck.name, chapterIndex + 1, deck.image)
          )
          .then(() => {
            deckId += 1;
            pool.query(reqs.mutations.createCards(deckId, deck.cards));
          });
      });
    });
  });
  res.sendStatus(200);
});

router.get("/studentCardHistory/:studentCode", async (req, res) => {
  pool
    .query(reqs.getters.allStudentCardsHistory(req.params.studentCode))
    .then((r) =>
      res.status(200).send(
        r.rows.map((row) => ({
          ...row,
          record: JSON.parse(row.record),
        }))
      )
    );
});

router.get("/studentCardHistory/new/:studentCode", async (req, res) => {
  pool
    .query(reqs.getters.allCards)
    .then((r) => {
      pool.query(
        reqs.mutations.createStudentCardHistory(r.rows, req.params.studentCode)
      );
    })
    .finally((r) => res.sendStatus(200));
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
  pool
    .query(
      `${reqs.getters.allChapters}; ${
        reqs.getters.allDecks
      }; ${reqs.getters.allCardsByStudent(req.params.studentCode)}`
    )
    .then((r) => {
      const decks = r[1].rows;
      decks.map((deck) => {
        deck.cardsData = { new: 0, repeated: 0 };
        r[2].rows
          .filter((card) => card.deck == deck.id)
          .map((card) => {
            const record = JSON.parse(card.record);
            const currentStage = record[record.length - 1];
            if (record.length == 1) deck.cardsData.new += 1;
            else if (currentStage.next_study_date < Date.now())
              deck.cardsData.repeated += 1;
          });
      });
      const chapters = r[0].rows;
      chapters.map((chapter) => {
        chapter.decks = decks.filter((el) => el.chapter === chapter.id);
      });

      res.status(200).send(chapters);
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
    .query(reqs.getters.cardsToStudy(req.params.studentCode, req.params.deckId))
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

router.post("/cards/newRating", (req, res) => {
  var flag = false;
  req.body.cards.map((card) => {
    pool
      .query(reqs.getters.cardHistory(card.schId))
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
        pool.query(reqs.setters.updateRecord(studyRecord, card.schId));
      })
      .catch(() => {
        flag = true;
      });
  });
  if (flag) res.sendStatus(500);
  else res.sendStatus(200);
});

module.exports = router;
