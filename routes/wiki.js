const express = require("express");
const router = express.Router();
const { addPage, wikiPage, main, editPage, deletePage } = require("../views");
const { Page, User } = require("../models");

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
    const page = await Page.findAll({
      where: {
        slug: title,
      },
    });
    if (page.length === 0) {
      next();
    }
    const author = await page[0].getAuthor();
    res.send(wikiPage(page[0], author));
  } catch (error) {
    next(error);
  }
});

router.get("/:slug/edit", async (req, res, next) => {
  try {
    const title = req.params.slug;
    const page = await Page.findAll({
      where: {
        slug: title,
      },
    });
    if (page.length === 0) {
      next();
    }
    const author = await page[0].getAuthor();
    console.log(page);
    res.send(editPage(page[0], author));
  } catch (error) {
    next(error);
  }
});

router.get("/:slug/delete", async (req, res, next) => {
  try {
    const title = req.params.slug;
    const page = await Page.findAll({
      where: {
        slug: title,
      },
    });
    if (page.length === 0) {
      next();
    }
    const author = await page[0].getAuthor();
    console.log(page);
    res.send(deletePage(page[0], author));
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
    const [user, created] = await User.findOrCreate({
      where: { name: req.body.name },
      defaults: {
        name: req.body.name,
        email: req.body.email,
      },
    });
    await page.setAuthor(user);
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
});

router.put("/:slug", async (req, res, next) => {
  try {
    await Page.update(
      {
        title: req.body.title,
        content: req.body.content,
        status: req.body.status,
      },
      {
        where: {
          slug: req.params.slug,
        },
      }
    );

    const page = await Page.findAll({
      where: {
        slug: req.params.slug,
      },
    });

    await User.update(
      {
        name: req.body.name,
        email: req.body.email,
      },
      {
        where: {
          id: page[0].authorId,
        },
      }
    );
    res.redirect(`/wiki/${page[0].slug}`);
  } catch (error) {
    next(error);
  }
});

router.delete("/:slug", async (req, res, next) => {
  try {
    await Page.destroy({
      where: {
        slug: req.params.slug,
      },
    });
    res.redirect("/wiki");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
