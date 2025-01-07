const express = require("express");
const pool = require("../sql/connection");
const reqs = require("../sql/queries");
const studentRouter = express.Router();

studentRouter.get("/:key/student/createTable", async (req, res) =>
  pool
    .query(reqs.student.createTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

studentRouter.get("/:key/student", async (req, res) =>
  pool
    .query(reqs.student.get(req.params.key))
    .then((r) => res.status(200).send(r.rows))
    .catch((e) => res.status(400).send(e))
);

studentRouter.get("/:key/student/:code", async (req, res) =>
  pool
    .query(reqs.student.getByCode(req.params.key, req.params.code))
    .then((r) => res.status(200).send(r.rows[0]))
    .catch((e) => res.status(400).send(e))
);

studentRouter.post("/:key/student", async (req, res) =>
  pool
    .query(reqs.student.insert(req.params.key, req.body))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

studentRouter.delete("/:key/student/:studentCode", async (req, res) =>
  pool
    .query(reqs.student.clear(req.params.key, req.params.studentCode))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

studentRouter.delete("/:key/student/clearTable", async (req, res) =>
  pool
    .query(reqs.student.clearTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

studentRouter.delete("/:key/student/dropTable", async (req, res) =>
  pool
    .query(reqs.student.dropTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

studentRouter.get("/:key/setupStudent/:studentCode", async (req, res) => {
  pool
    .query(reqs.card.get(req.params.key))
    .then((r) => {
      pool.query(
        reqs.studentCardHistory.insert(
          req.params.key,
          r.rows,
          req.params.studentCode
        )
      );
    })
    .finally(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e));
});

module.exports = studentRouter;
