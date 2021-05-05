const express = require("express");
const db = require('../db/models');
const { List } = db;
const { csrfProtection, asyncHandler } = require('../utils');
const {requireAuth, restoreUser} = require('../auth');



const router = express.Router();

console.log(db)
console.log(List)

router.get(
    "/", requireAuth,
    asyncHandler(async (req, res, next) => {
        const lists = await List.findAll();
        console.log(lists)
        if (lists) {
            res.json({ lists });
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

  router.post(
    "/:id(\\d+)/edit", requireAuth,
    asyncHandler(async (req, res, next) => {
      const listId = parseInt(req.params.id, 10);
      const list = await List.findByPk(listId);
      if (list) {
        await list.update({ name: req.body.name });
        res.json({ list });
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


module.exports = router;
