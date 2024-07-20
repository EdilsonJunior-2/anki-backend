const sql = require("mssql");

var config = {
  server: process.env.DATABASE_SERVER || "DESKTOP-BTTSM8K",
  database: process.env.DATABASE_NAME || "DBTest",
  user: process.env.DATABASE_USER || "tcc_database",
  password: process.env.DATABASE_PW || "paodequeijo",
  port: process.env.DATABASE_PORT || 1433,
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
