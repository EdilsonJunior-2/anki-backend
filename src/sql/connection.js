const sql = require("mssql");

var config = {
  server: "tcc-dbase.ct2w26gwe3t6.us-east-2.rds.amazonaws.com",
  database: "TCC_DB",
  user: "admin",
  password: "paodebatata1",
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: false,
  },
};

const pool = sql
  .connect(config, (err) => {
    if (err) throw err;
    console.log("Connection Successful!");
  })
  .request();

module.exports = pool;
