const express = require("express");
const pool = require("../sql/connection");
const reqs = require("../sql/queries");
const adminRouter = express.Router();

adminRouter.get("/:key/admin/:code/students", async (req, res) => {
  try {
    const requester = await pool.query(
      reqs.student.getByCode(req.params.key, req.params.code)
    );
    if (!requester.rows[0].admin) res.status(401).send("Access denied");
    const students = await pool.query(reqs.admin.getStudents(req.params.key));

    res.status(200).send(students.rows);
  } catch (err) {
    res.status(400).send(err);
  }
});

adminRouter.get("/:key/admin/:code/:studentCode", async (req, res) => {
  try {
    const requester = await pool.query(
      reqs.student.getByCode(req.params.key, req.params.code)
    );
    if (!requester.rows[0].admin) res.status(401).send("Access denied");
    const student = await pool.query(
      reqs.student.getByCode(req.params.key, req.params.studentCode)
    );
    const studentSch = await pool.query(
      reqs.admin.get(req.params.key, req.params.studentCode)
    );

    const decks = await pool.query(reqs.deck.get(req.params.key));
    const chapters = await pool.query(reqs.chapter.get(req.params.key));

    res.status(200).send({
      student: student.rows[0],
      decksCount: decks.rows.length,
      decks: decks.rows,
      chaptersCount: chapters.rows.length,
      chapters: chapters.rows,
      studentData: studentSch.rows,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});
module.exports = adminRouter;
