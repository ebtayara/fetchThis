const express = require("express");
const db = require('../db/models');
const { Task, List } = db;
const { csrfProtection, asyncHandler } = require('../utils');
const {requireAuth} = require('../auth');

const router = express.Router();

router.get(
  '/', requireAuth,
  asyncHandler(async (req, res, next) => {
      const tasks = await Task.findAll( {where: {userId:req.session.auth.userId}} );
      const taskList = await List.findAll({where: {userId:req.session.auth.userId}})
      if (tasks) {
          // res.json({ tasks });
          res.render('taskForm',{ 'tasks': tasks , 'taskList': taskList});
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

router.post('/', asyncHandler(async(req, res, next) => {
  const {name, description, listId} = req.body
  // console.log(typeof req.session.auth.userId)
  // console.log(res.locals.user.id)
  await Task.create({ name:name, description:description
  ,userId: res.locals.user.id, listId: listId, completed: false })
  res.redirect('back');
}));

router.get(
  '/:id(\\d+)/edit', requireAuth,
  asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    // console.log(taskId,'hi from EDIT FORM 🙂')
    res.render('editTask', { task })
  })
)

router.post(
  '/:id(\\d+)/edit', requireAuth,
  asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    // console.log(taskId);
    const task = await Task.findByPk(taskId);
    // const { name } = req.body
    const {name, description} = req.body
    console.log(name, description, '🤓')
    if (task) {
      // await task.update({ name });
       await task.update({  name:name, description:description
  ,userId: res.locals.user.id, completed: false  });
      res.redirect('/tasks')
    } else {
      next(listNotFoundError(taskId));
    }
  })
);

router.get('/:id(\\d+)/delete', requireAuth,
  asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    res.render('taskDelete', { task });
  }));

router.post(
  '/:id(\\d+)/delete',requireAuth,
  asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    // console.log(taskId)
    // console.log(task)

    if (task) {
      await task.destroy();
      res.redirect('/tasks')
    } else {
      next(taskNotFoundError(taskId));
    }
  })
);

module.exports = router;
