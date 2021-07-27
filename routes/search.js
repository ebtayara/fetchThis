const express = require('express');
const db = require('../db/models');
const { Task } = db;
const { csrfProtection, asyncHandler } = require('../utils');
const { requireAuth } = require('../auth');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get("/:searchString", requireAuth, asyncHandler(async (req, res, next) => {
  const searchString = req.params.searchString
  const tasks = await Task.findAll({ where: { userId: req.session.auth.userId, name: { [Op.iLike]: `%${searchString}%` } }});
  res.render('search', { 'tasks': tasks });
  })
);

router.get("/", requireAuth, asyncHandler(async (req, res, next) => {

    const tasks = await Task.findAll({ where: { userId: req.session.auth.userId }});
    res.render('search', { 'tasks': tasks });
  })
);

module.exports = router;
