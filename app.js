const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const PORT = 1337;
const { db } = require("./models");
const methodOverride = require("method-override");

// HTML Forms only let you send GET or POST requests, so if we want our Form to be a PUT method
// We use a library called methodOverride
app.use(methodOverride("_method"));

// Logging middleware
app.use(morgan("dev"));

// Static middleware
app.use(express.static(path.join(__dirname, "public")));

// Body parsing middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// This will contain all our paths
app.use("/wiki", require("./routes/wiki"));
app.use("/users", require("./routes/users"));

app.get("/", (req, res, next) => {
  res.redirect("/wiki");
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that page!");
});

db.authenticate().then(() => {
  console.log("connected to the database");
});

// This function is used to initialize and sync our db
// as well as start the server
const init = async () => {
  await db.sync({ force: true });
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
};

init();
