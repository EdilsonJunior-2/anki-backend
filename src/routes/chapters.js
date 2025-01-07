const express = require("express");
const pool = require("../sql/connection");
const reqs = require("../sql/queries");
const chapterRouter = express.Router();

chapterRouter.get("/:key/chapter/createTable", async (req, res) =>
  pool
    .query(reqs.chapter.createTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

chapterRouter.get("/:key/chapter", async (req, res) =>
  pool
    .query(reqs.chapter.get(req.params.key))
    .then((r) => res.status(200).send(r.rows))
    .catch((e) => res.status(400).send(e))
);

chapterRouter.delete("/:key/chapter/clearTable", async (req, res) =>
  pool
    .query(reqs.chapter.clearTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

chapterRouter.delete("/:key/chapter/dropTable", async (req, res) =>
  pool
    .query(reqs.chapter.dropTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

module.exports = chapterRouter;
