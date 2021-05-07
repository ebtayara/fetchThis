const express = require("express");
const db = require('../db/models');
const { Task } = db;
const { csrfProtection, asyncHandler } = require('../utils');
const {requireAuth} = require('../auth');

const router = express.Router();



router.get(
  "/", requireAuth,
  asyncHandler(async (req, res, next) => {
      // const tasks = await Task.findByPk(req.session.auth.userId);
      const tasks = await Task.findAll( { where: { userId: req.session.auth.userId } });
      // console.log(Array.isArray(tasks));
      if (tasks) {
        // res.json({ tasks });
        res.render('summary', {'tasks': tasks});
      } else {
          next(taskNotFoundError(taskId));
      }
    })
);

router.get(
  "/:id(\\d+)",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);

    if (task) {
      res.json({ task });
    } else {
      next(taskNotFoundError(taskId));
    }
  })
);


const taskNotFoundError = (id) => {
  const err = Error(`Task with id of ${id} could not be found.`);
  err.title = "Task not found.";
  err.status = 404;
  return err;
};

router.patch(
  "/:id(\\d+)", requireAuth,
  asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);

    if (task) {
      await task.update({ name: req.body.name });
      res.json({ task });
    } else {
      next(taskNotFoundError(taskId));
    }
  })
);

router.delete(
  "/:id(\\d+)",requireAuth,
  asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);

    if (task) {
      await task.destroy();
      res.status(204).end();
    } else {
      next(taskNotFoundError(taskId));
    }
  })
);


module.exports = router;
