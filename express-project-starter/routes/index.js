const express = require('express');
const session = require('express-session');
const router = express.Router();

const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('../utils');

/* GET home page. */
router.get('/', csrfProtection, asyncHandler(async(req, res, next) => {

  let list = await db.List.findByPk(2)
  console.log(list.toJSON(), 'HEYYYYYYY')
  res.render('index', { title: 'fetchThis Home',  });
}));

module.exports = router;
