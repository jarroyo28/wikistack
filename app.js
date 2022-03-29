const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const PORT = 1337;

const layout = require("./views/layout");

// Logging middleware
app.use(morgan("dev"));

// Static middleware
app.use(express.static(path.join(__dirname, "public")));

// Body parsing middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res, next) => {
  res.send(layout(""));
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
