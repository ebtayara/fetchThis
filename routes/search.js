const express = require('express');
const db = require('../db/models');
const { Task } = db;
const { csrfProtection, asyncHandler } = require('../utils');
const { requireAuth } = require('../auth');
const router = express.Router();


router.get("?", requireAuth, asyncHandler(async (req, res, next) => {
  const tasks = await Task.findAll( );
    if (tasks) {
        res.json({ tasks });
    } else {
        next(taskNotFoundError(taskId));
    }
  })
);
