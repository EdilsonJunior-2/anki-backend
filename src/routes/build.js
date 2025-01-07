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

buildRouter.post("/:key/populateStudyTables", async (req, res) => {
  try {
    jsons[req.params.key].map((chapter, chapterIndex) =>
      pool
        .query(reqs.mutations.createChapter(chapter.name, req.params.key))
        .then(() =>
          chapter.decks.map((deck, deckId) =>
            pool
              .query(
                reqs.mutations.createDeck(
                  deck.name,
                  chapterIndex + 1,
                  deck.image,
                  req.params.key
                )
              )
              .then(() =>
                pool.query(
                  reqs.mutations.createCards(
                    deckId + 1,
                    deck.cards,
                    req.params.key
                  )
                )
              )
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
