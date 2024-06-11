const sql = require("mssql");

var config = {
  user: "tcc-database",
  password: "paodequeijo",
  server: "DESKTOP-BTTSM8K",
  database: "DBTest",
  options: {
    encrypt: false,
    trustServerCertificate: true,
    trustedConnection: false,
    enableArithAbort: true,
    instancename: "SQLEXPRESS",
  },
  port: 1433,
};

const pool = sql
  .connect(config, (err) => {
    if (err) throw err;
    console.log("Connection Successful!");
  })
  .request();

module.exports = pool;
