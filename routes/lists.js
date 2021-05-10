const express = require("express");
const db = require('../db/models');
// console.log(db.dataValues)
const { List, Task, User } = db;
// console.log(List)
const { csrfProtection, asyncHandler } = require('../utils');
const {requireAuth, restoreUser} = require('../auth');
const { Session } = require("express-session");



const router = express.Router();



router.get(
  "/", requireAuth,
  asyncHandler(async (req, res, next) => {
    const lists = await List.findAll({
      where : { userId: req.session.auth.userId } ,
      include:Task
    });
      if (lists) {
          res.render('list', { "lists":lists });
      } else {
          next(listNotFoundError(listId));
      }
    })
);


const listNotFoundError = (id) => {
  const err = Error(`List with id of ${id} could not be found.`);
  err.title = "List not found.";
  err.status = 404;
  return err;
};


router.get(
  "/:id(\\d+)/edit", requireAuth,
  asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const list = await List.findByPk(listId);

    res.render('listForm', { list })
  })
)


router.post(
  "/:id(\\d+)/edit", requireAuth,
  asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const list = await List.findByPk(listId);

    const { name } = req.body
    if (list) {
      await list.update({ name });
      res.redirect('/lists')

    } else {
      next(listNotFoundError(listId));
    }
  })
);


router.get(
  "/add", requireAuth,
  asyncHandler(async (req, res, next) => {
    const lists = await List.findAll({
      where : { userId: req.session.auth.userId }
    });
    res.render('addListForm')
  })
)

router.post('/add', requireAuth,
asyncHandler(async (req, res) => {

  const { name } = req.body;

  const list = db.List.build({
    name,
    userId: res.locals.user.id,
  });

  await list.save();
  res.redirect(`/lists`);
}));


router.get('/delete/:id(\\d+)', requireAuth,
asyncHandler(async (req, res) => {
  const listId = parseInt(req.params.id, 10);
  const list = await List.findByPk(listId);
  res.render('listDelete', { list });
}));

router.post('/delete/:id(\\d+)', requireAuth,
  asyncHandler(async (req, res) => {
    const listId = parseInt(req.params.id, 10);
    const list = await List.findByPk(listId);

    if (list) {
      await list.destroy();
      res.redirect('/lists');
    } else {
      next(listNotFoundError(listId));
    }
}));

// user logs in with credentials
// user should be able to see all of their lists
// user should be able to add, edit and delete a list


module.exports = router;
