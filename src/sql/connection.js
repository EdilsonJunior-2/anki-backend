//const sql = require("mssql");
const pg = require("pg");
const fs = require("fs");

const { Client } = require("ssh2");

const conn = new Client();

const connectionString = `${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.VM_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const pool = new pg.Client(connectionString);

conn.connect({
  host: `${process.env.VM_HOST}`,
  port: Number(process.env.VM_PORT),
  username: `${process.env.VM_USER}`,
  privateKey:
    process.env.SSH_KEY || fs.readFileSync("./key/ssh-key-2024-08-19.key"),
});

conn.on("ready", () => {
  conn.forwardOut(
    `${process.env.LOCAL_DB_HOST}`,
    Number(process.env.LOCAL_DB_PORT),
    `${process.env.DB_HOST}`,
    Number(process.env.DB_PORT),
    (err, channel) => {
      if (err) {
        console.error("Error forwarding port:", err);
        return;
      }
      pool
        .connect()
        .then(() => {
          console.log("Connection successful!");
          // ... your database operations
        })
        .catch((err) => {
          console.error("Error connecting to database:", err);
        });
    }
  );
});

module.exports = pool;
