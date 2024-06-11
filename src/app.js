const bodyParser = require("body-parser");
const express = require("express");
const server = require("./server");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", server);
app.listen(port, () => {
  console.log(`Tamo te ouvindo na porta ${port}`);
});

// const express = require("express");
// const server = require("./server");
// const cors = require("cors");
// const sql = require("mssql");
// const app = express();
// app.use(cors());
// const port = 3000;

// var config = {
//   user: "tcc-database",
//   password: "paodequeijo",
//   server: "DESKTOP-BTTSM8K",
//   database: "DBTest",
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//     trustedConnection: false,
//     enableArithAbort: true,
//     instancename: "SQLEXPRESS",
//   },
//   port: 1433,
// };

// const pool = sql.connect(config, (err) => {
//   if (err) throw err;
//   console.log("Connection Successful!");
// });

// app.get("/", async (req, res) => {
//   pool.request().query("SELECT * FROM Deck", (err, result) => {
//     if (err) {
//       console.error("Error executing query:", err);
//     } else {
//       res.send(result.recordset);
//       console.dir(result.recordset);
//     }
//   });
// });

// app.post("/updateData", async (req, res) => {
//   console.log(req);
//   res.sendStatus(200);
// });

// app.use("/", admi)
// app.listen(port, () => {
//   console.log(`Tamo te ouvindo na porta ${port}`);
// });
