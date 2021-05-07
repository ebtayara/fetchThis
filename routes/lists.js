const express = require("express");
const db = require('../db/models');
const { List, User } = db;
const { csrfProtection, asyncHandler } = require('../utils');
const {requireAuth, restoreUser} = require('../auth');
const { Session } = require("express-session");



const router = express.Router();



  router.get(
    "/", requireAuth,
    asyncHandler(async (req, res, next) => {
      const lists = await List.findAll({
        where : { userId: req.session.auth.userId }
      });
      // console.log(lists.toJSON())
        if (lists) {
            // res.json({lists})
            res.render('list', { lists });
        } else {
            next(listNotFoundError(listId));
        }
      })
  );



  router.get(
    "/:id(\\d+)",
    requireAuth,
    asyncHandler(async (req, res, next) => {
      const listId = parseInt(req.params.id, 10);
      const list = await List.findByPk(listId);
      if (list) {
        res.json({ list });
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



  // router.post(
  //   "/", requireAuth,
  //   asyncHandler(async (req, res, next) => {
  //     const { name } = req.body
  //     const newList = List.build({ name });

  //     await newList.save()
  //     res.render('list', );

  //     if (list) {
  //       await list.update({ name: req.body.name });
  //       res.render('list', { list });
  //     } else {
  //       next(listNotFoundError(listId));
  //     }
  //   })
  // );


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

      if (list) {
        // let { name } = req.body
        // const newList = await List.create({ name })

        await list.update({ name: req.body.name });
        res.render('list', { list, newList });

      } else {
        next(listNotFoundError(listId));
      }
    })
  );

//   router.delete(
//     "/:id(\\d+)",requireAuth,
//     asyncHandler(async (req, res, next) => {
//       const taskId = parseInt(req.params.id, 10);
//       const task = await Task.findByPk(taskId);
//       if (task) {
//         await task.destroy();
//         res.status(204).end();
//       } else {
//         next(taskNotFoundError(taskId));
//       }
//     })
//   );

// user logs in with credentials
// user should be able to see all of their lists
// user should be able to add, edit and delete a list


module.exports = router;
