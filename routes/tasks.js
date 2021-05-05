const express = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('../utils');

const router = express.Router();

router.get('/tasks', asyncHandler(async (req, res) => { //task or tasks. actual table name in schema is task, but table names should be plural?
  const tasks = await db.Task.findAll({ include: ['list'], order: [['name', 'ASC']] });
  res.render('fetchList', { title: 'Tasks', tasks }); //need to confirm name of pug being rendered with team. currently set as 'fetchList'
}));
