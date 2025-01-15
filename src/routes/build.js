const express = require("express");
const pool = require("../sql/connection");
const reqs = require("../sql/queries");
const buildRouter = express.Router();
const ankiCards = require("../../ankiCards.json");
const tccCards = require("../../tccCards.json");

const jsons = {
  anki: ankiCards,
  tcc: tccCards,
};

buildRouter.get("/:key/populateStudyTables", async (req, res) => {
  try {
    var deckId = 0;
    jsons[req.params.key].map((chapter, chapterIndex) =>
      pool.query(reqs.chapter.insert(req.params.key, chapter.name)).then(() =>
        chapter.decks.map((deck) =>
          pool
            .query(
              reqs.deck.insert(
                req.params.key,
                deck.name,
                chapterIndex + 1,
                deck.image
              )
            )
            .then(() => {
              deckId += 1;
              pool.query(reqs.card.insert(req.params.key, deckId, deck.cards));
            })
        )
      )
    );
  } catch (e) {
    res.status(400).send(e);
  } finally {
    res.sendStatus(200);
  }
});

module.exports = buildRouter;
