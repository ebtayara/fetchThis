const express = require("express");
const db = require('../db/models');
const { Task } = db;
const { csrfProtection, asyncHandler } = require('../utils');
const {requireAuth} = require('../auth');
const router = express.Router();

router.get(
  "/", requireAuth,
  asyncHandler(async (req, res, next) => {
      const tasks = await Task.findAll( {where: {userId:req.session.auth.userId}} );
      if (tasks) {
          // res.json({ tasks });
          res.render('taskForm',{ 'tasks': tasks });
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
router.get('/add', requireAuth, (req, res) => {
  // console.log(`Request method: ${req.method}`);
  // console.log(`Request path: ${req.path}`);
  res.render('addTask');
});
// router.get('/edit', requireAuth, (req, res) => {
//   // console.log(`Request method: ${req.method}`);
//   // console.log(`Request path: ${req.path}`);
//   res.render('editTask');
// });
const taskNotFoundError = (id) => {
  const err = Error(`Task with id of ${id} could not be found.`);
  err.title = "Task not found.";
  err.status = 404;
  return err;
};
router.get(
  "/:id(\\d+)/edit", requireAuth,
  asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const tasks = await Task.findByPk(taskId);
    res.render('editTask', { tasks })
  })
)
router.post(
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


