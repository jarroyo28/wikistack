const express = require("express");
const router = express.Router();
const { addPage } = require("../views");
const { Page } = require("../models");

// For RESTful routing, I'll do GET, POST, PUT, DELETE routes in that order

router.get("/", (req, res, next) => {
  res.send("<h1>/wiki get route</h1>");
});

router.get("/add", (req, res, next) => {
  res.send(addPage());
});

router.post("/", async (req, res, next) => {
  try {
    const page = await Page.create({
      title: req.body.title,
      content: req.body.content,
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
