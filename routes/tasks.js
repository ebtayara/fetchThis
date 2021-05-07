const express = require("express");
const db = require('../db/models');
const { Task, User } = db;
const { csrfProtection, asyncHandler } = require('../utils');
const {requireAuth} = require('../auth');

const router = express.Router();

router.get(
  "/", requireAuth,
  asyncHandler(async (req, res, next) => {
      const tasks = await Task.findAll( {where: {userId:req.session.auth.userId}} );
      console.log("Task Object", tasks[0])
      console.log("data values", tasks.dataValues)
      // console.log("individual values", tasks.task)
      if (tasks) {
          // res.json({ tasks });
          res.render('taskForm',{ 'tasks': tasks });
      } else {
          next(taskNotFoundError(taskId));
      }
    })
);

router.get(
  "/:id(\\d+)/add",
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

router.post('/add', asyncHandler(async(req, res, next) => {
  console.log('hitting the add route');
  // console.log(`Request path: ${req.path}`);
  console.log(req.body)
  const {taskValue} = req.body
  console.log(taskValue)
  const task = await Task.create({ name: taskValue })
  res.redirect('/summary');
}));

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

// router.get(
//   "/:id(\\d+)/edit", requireAuth,
//   asyncHandler(async (req, res, next) => {
//     const taskId = parseInt(req.params.id, 10);
//     const tasks = await Task.findByPk(taskId);
//     res.render('editTask', { tasks })
//   })
// )

router.get(
  "/:id(\\d+)/edit", requireAuth,
  asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    res.render('editTask', { task })
  })
)
router.post(
  "/:id(\\d+)/edit", requireAuth,
  asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    const { name } = req.body
    if (task) {
      await task.update({ name });
      // console.log(list)
      res.redirect('/tasks')
    } else {
      next(listNotFoundError(taskId));
    }
  })
);

// router.post(
//   "/:id(\\d+)", requireAuth,
//   asyncHandler(async (req, res, next) => {
//     const taskId = parseInt(req.params.id, 10);
//     const task = await Task.findByPk(taskId);

//     if (task) {
//       await task.update({ name: req.body.name });
//       res.json({ task });
//     } else {
//       next(taskNotFoundError(taskId));
//     }
//   })
// );

// router.delete(
//   "/:id(\\d+)",requireAuth,
//   asyncHandler(async (req, res, next) => {
//     const taskId = parseInt(req.params.id, 10);
//     const task = await Task.findByPk(taskId);

//     if (task) {
//       await task.destroy();
//       res.status(204).end();
//     } else {
//       next(taskNotFoundError(taskId));
//     }
//   })
// );

module.exports = router;
