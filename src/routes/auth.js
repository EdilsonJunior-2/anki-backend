const express = require("express");
const pool = require("../sql/connection");
const reqs = require("../sql/queries");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();

authRouter.post("/:key/login", (req, res) => {
  pool
    .query(reqs.student.getByCode(req.params.key, req.body.code))
    .then((r) => {
      if (r.rows.length > 0) {
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
      } else res.status(400).send({ message: "Usuário inválido" });
    })
    .catch((err) => {
      res.status(400).send({ message: "Usuário inválido" });
    });
});

module.exports = authRouter;
