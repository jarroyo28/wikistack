const express = require("express");
const router = express.Router();
const { User, Page } = require("../models");
const { userList, userPages } = require("../views");

router.get("/", async (req, res, next) => {
  const users = await User.findAll();
  res.send(userList(users));
});

router.get("/:id", async (req, res, next) => {
  const pages = await Page.findAll({
    where: { authorId: req.params.id },
  });
  const user = await User.findByPk(req.params.id);
  res.send(userPages(user, pages));
});

module.exports = router;
