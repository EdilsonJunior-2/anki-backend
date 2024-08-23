//const sql = require("mssql");
const pg = require("pg");
const fs = require("fs");

const { Client } = require("ssh2");

const conn = new Client();

const connectionString = `postgres://testuser:paodequeijo@132.226.62.90:5432/testdb`;

const pool = new pg.Client(connectionString);

conn.connect({
  host: "132.226.62.90",
  port: 22,
  username: "ubuntu",
  privateKey: fs.readFileSync("./src/key/ssh-key-2024-08-19.key"),
});

conn.on("ready", () => {
  conn.forwardOut(
    "127.0.0.1",
    5432,
    "instance-20240820-1649",
    5432,
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
