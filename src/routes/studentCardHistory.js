const express = require("express");
const pool = require("../sql/connection");
const reqs = require("../sql/queries");
const schRouter = express.Router();

schRouter.get("/:key/studentCardHistory/createTable", async (req, res) =>
  pool
    .query(reqs.studentCardHistory.createTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

schRouter.get("/:key/studentCardHistory", async (req, res) =>
  pool
    .query(reqs.studentCardHistory.get(req.params.key))
    .then((r) => res.status(200).send(r.rows))
    .catch((e) => res.status(400).send(e))
);

schRouter.get("/:key/studentCardHistory/:studentCode", async (req, res) =>
  pool
    .query(
      reqs.studentCardHistory.byStudent(req.params.key, req.params.studentCode)
    )
    .then((r) => res.status(200).send(r.rows))
    .catch((e) => res.status(400).send(e))
);

schRouter.post("/:key/studentCardHistory/setupSch", async (req, res) => {
  pool
    .query(reqs.card.get(req.params.key))
    .then((r) => {
      req.body.map((student) =>
        pool.query(
          reqs.studentCardHistory.insert(req.params.key, r.rows, student.code)
        )
      );
    })
    .finally(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e));
});

schRouter.delete("/:key/studentCardHistory/clearTable", async (req, res) =>
  pool
    .query(reqs.studentCardHistory.clearTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

schRouter.delete("/:key/studentCardHistory/dropTable", async (req, res) =>
  pool
    .query(reqs.studentCardHistory.dropTable(req.params.key))
    .then(() => res.sendStatus(200))
    .catch((e) => res.status(400).send(e))
);

schRouter.post("/:key/studentCardHistory/insertByCard", async (req, res) => {
  try {
    const students = await pool.query(reqs.student.get(req.params.key));
    students.rows.map((student) =>
      pool.query(
        reqs.studentCardHistory.insert(
          req.params.key,
          req.body.cards,
          student.code
        )
      )
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = schRouter;
