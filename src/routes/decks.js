const express = require("express");
const pool = require("../sql/connection");
const reqs = require("../sql/queries");
const deckRouter = express.Router();

deckRouter.get("/:key/deck/createTable", async (req, res) =>
  pool
    .query(reqs.deck.createTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

deckRouter.get("/:key/deck", async (req, res) =>
  pool
    .query(reqs.deck.get(req.params.key))
    .then((r) => res.status(200).send(r.rows))
    .catch((e) => res.status(400).send(e))
);

deckRouter.delete("/:key/deck/clearTable", async (req, res) =>
  pool
    .query(reqs.deck.clearTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

deckRouter.delete("/:key/deck/dropTable", async (req, res) =>
  pool
    .query(reqs.deck.dropTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

deckRouter.post("/:key/deck/insert", async (req, res) =>
  pool
    .query(
      reqs.deck.insert(
        req.params.key,
        req.body.deck,
        req.body.chapter,
        req.body.image
      )
    )
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

module.exports = deckRouter;
