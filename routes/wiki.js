const express = require("express");
const router = express.Router();
const { addPage, wikiPage, main } = require("../views");
const { Page } = require("../models");

// For RESTful routing, I'll do GET, POST, PUT, DELETE routes in that order

router.get("/", async (req, res, next) => {
  const pages = await Page.findAll();
  res.send(main(pages));
});

router.get("/add", (req, res, next) => {
  res.send(addPage());
});

router.get("/:slug", async (req, res, next) => {
  try {
    const title = req.params.slug;
    console.log(title);
    const page = await Page.findAll({
      where: {
        slug: title,
      },
    });
    res.send(wikiPage(page[0]));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const page = await Page.create({
      title: req.body.title,
      content: req.body.content,
    });
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
