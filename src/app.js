const bodyParser = require("body-parser");
const express = require("express");
const server = require("./server");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", server);
app.listen(port, () => {
  console.log(`Tamo te ouvindo na porta ${port}`);
});
