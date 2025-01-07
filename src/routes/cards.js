const express = require("express");
const pool = require("../sql/connection");
const reqs = require("../sql/queries");
const cardRouter = express.Router();

cardRouter.get("/:key/card/createTable", async (req, res) =>
  pool
    .query(reqs.card.createTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

cardRouter.get("/:key/card", async (req, res) =>
  pool
    .query(reqs.card.get(req.params.key))
    .then((r) => res.status(200).send(r.rows))
    .catch((e) => res.status(400).send(e))
);

cardRouter.delete("/:key/card/clearTable", async (req, res) =>
  pool
    .query(reqs.card.clearTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

cardRouter.delete("/:key/card/dropTable", async (req, res) =>
  pool
    .query(reqs.card.dropTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

module.exports = cardRouter;
