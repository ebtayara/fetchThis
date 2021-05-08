lists.js
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
(edited)





8:58
task.js
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
  '/:id', requireAuth,
  asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    res.render('editTask', { task })
  })
)
router.post(
  '/:id/edit', requireAuth,
  asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    const { name } = req.body
    if (task) {
      await task.update({ name });
      res.redirect('/tasks')
    } else {
      next(listNotFoundError(taskId));
    }
  })
);
router.get('/:id/delete', requireAuth,
  asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    res.render('taskDelete', { task });
  }));
router.post(
  '/:id/delete',requireAuth,
  asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    console.log(taskId)
    console.log(task)
    if (task) {
      await task.destroy();
      res.redirect('/tasks')
    } else {
      next(taskNotFoundError(taskId));
    }
  })
);
module.exports = router;
(edited)
8:59
javascripts/tasks.js
const addButton = document.getElementById('addButton');
const description = document.getElementById('description');
const taskName = document.getElementById('name');
const taskList = document.getElementById('list');
// const divToAddToo = document.querySelector('#tasksFlex')
//check to see if checkbox is checked
// const checkbox = document.getElementById('task.id')
// console.log(checkbox.checked)
// if(checked) {
//     //route to completed task in summary page?
// }
// textarea.addEventListener('click', e => {
//     textarea.hide();
// });
// addButton.addEventListener('click', e => {
//     const button = e.target.id === 'addButton';
//     const { task } = task.name
//     if(button) {
//         text = task.name //something like that?
//     }
// });
// addButton.addEventListener('click', async (e) => {
//     const text = document.getElementById('textarea');
//     window.location.href = (`/tasks/${text.value}`)
// });
// addButton.addEventListener('click', e => {
//     divToAddToo.innerHTML = text.innerHTML //also tried text.value
// });
addButton.addEventListener('click', async(e) => {
    const taskDescriptionValue = description.value;
    const taskNameValue = taskName.value;
    const listId = taskList.value;
    // console.log('warren wants to see this', taskValue)
    let res = await fetch('/tasks', {  method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"name":taskNameValue, "description":taskDescriptionValue, "listId":listId})});
    if(res.ok) {
        window.location.href = '/tasks'
    }
});
(edited)
9:01
list.pug
extends layout.pug
append head
  link(rel="stylesheet" href="/stylesheets/lists.css")
block content
  h1(class="listsTitle") Current Lists:
    div(class="listsContainer")
      if lists
        each list in lists
          div(class="lists")
            div(class="listsFlexContainer")
              p.name= list.name
              a(href=`/lists/${list.id}/edit` role='button') Edit
              a(href=`/lists/delete/${list.id}` role='button') DELETE
          if list.Tasks
            div(class="listTasksContainer")
            each task in list.Tasks
              div(class="listTaskFlexContainer")
                  div
                      h3=task.name
                      if task.description
                          p=task.description
                  a(href=`/tasks/${task.id}/delete`) Remove
                      //- button(type='submit' class='removeButton') Remove
                  a(href=`/tasks/${task.id}`)
                      button(type='submit' class='editButton') Edit
                  a(href=`/summary`)
                      button(type='submit' class='completeButton') Complete
  div(class="")
    a(href='/lists/add' role='button') Add
9:02
taskForm.pug
extends layout.pug
//- include utils.pug
append head
    link(rel="stylesheet" href="/stylesheets/main.css")
    script(src="/javascripts/tasks.js" type="module" defer)
block content
    input(type='hidden' name='_csrf' value=csrfToken)
    h1(class="tasksTitle") Add A New Task
    div(class="addTaskForm")
        //- form(action='/tasks/add' method='POST')
        //- input(type='hidden', name='_csrf', value=csrfToken)
        div
            input(type="text"  id="name" placeholder="Enter The Name of the Task" class="addTaskName")
        div
            textarea(id='description' type='text' class='taskTextContainer' placeholder='Add a Task...')
        div
            select(class="taskListSelection" value=taskList[0].id id="list")
                each list in taskList
                    option(value=list.id)=list.name
        div
            button(id='addButton' type='submit' class='addButton') Add
    each task in tasks
        div(class="tasksContainer")
            div(class="tasksFlexContainer")
                div
                    h3=task.name
                    if task.description
                        p=task.description
                a(href=`/tasks/${task.id}/delete`) Remove
                    //- button(type='submit' class='removeButton') Remove
                a(href=`/tasks/${task.id}`)
                    button(type='submit' class='editButton') Edit
                a(href=`/summary`)
                    button(type='submit' class='completeButton') Complete
//- extends layout.pug
//- //- include utils.pug
//- append head
//-     link(rel="stylesheet" href="/stylesheets/main.css")
//- //-     script(src="/javascripts/tasks.js" type="module" defer)
//- block content
//-     input(type='hidden' name='_csrf' value=csrfToken)
//-     h1(class="tasksTitle") Tasks
//-         each task in tasks
//-             div(class="tasksContainer")
//-                 div(class="tasksFlexContainer")
//-                     input(id=task.id type='checkbox' class='checkbox' checked=false)
//-                     p=task.name
//-                     a(href=`/tasks/${task.id}/edit`)
//-             div
//-                 textarea(type='textarea' class='taskTextContainer' placeholder='Add a Task...')
//-             div(class='addButton')
//-                 button(type='submit' class='taskButton') Add
//-                     div(class='editButton')
//-                     button(type='submit' class='editButton') Edit
//-                     a(href='/' class='cancelTask') Back to List
(edited)
9:03
editTask.pug
extends layout.pug
//- include utils.pug
append head
    link(rel="stylesheet" href="/stylesheets/main.css")
block content
    body
        form(action=`/tasks/${task.id}/edit` method='POST')
            input(type='hidden', name='_csrf', value=csrfToken)
            label(for="name") Name
            input(type="text" value=task.name id="name")
            label(for="description") Description
            input(type="text" value=task.description id="description")
            input(type="submit" value="submit")

Alexandra_B (she/her/hers):dancing-tube-arms:  9:21 AM
summary.pug
extends layout.pug
append head
  //- add page specific styles by appending to the head
  link(rel="stylesheet" href="/stylesheets/main.css")
  //- add page specific js
//-   script(src="/javascripts/index.js" type="module" defer)
block content
  div(class="imageContainer")
    a(href="/")
    img(src="/fetchThis.png" class = "fetchThisImg")
  h1(class="summaryTitle") Task Summary
  div(class="summaryFlexContainer")
    div(class="summaryPendingFlexChild")
      h2(class="summaryPendingTaskHeader") Pending Tasks
      if !tasks.length
        div(class="summaryPendingTaskContainerEmpty")
          a(href="/tasks")
            img(src="/favicon.ico" class="fetchThisPendingImg")
      else
        each task in tasks
          if !task.completed
            div(class="summaryPendingTaskContainer")
              p=task.name
              p=task.description
    div(class="summaryCompletedFlexChild")
      h2(class="summaryCompletedTaskHeader") Completed Tasks
      if !tasks.length
        div(class="summaryCompletedTaskContainerEmpty")
          a(href="/lists")
            img(src="/pic1.png" class="fetchThisCompletedImg")
      else
      each task in tasks
        if task.completed
          div(class="summaryCompletedTaskContainer")
            p=task.name
            p=task.description
    div(class="footer") Fetch more information?
        div(class="navFooterContainer")
            a(href="/demoCeviche") play fetch with Ceviche 😺
            a(href="/demoTyrion") play fetch with Tyrion 🐶
            //- a(href="/fetchThisTeam") fetch This Team
9:22
summary.css
body {
    background: #DEF6CA;
    overflow-y: scroll;
    scroll-behavior: smooth;
    scroll-snap-type: y mandatory;
    scroll-snap-align: center;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
.summaryTitle{
    font-weight: bold;
    font-size: 40px;
    opacity: 0.70;
}
.summaryFlexContainer{
    display:flex;
    justify-content: space-around;
}
.summaryPendingFlexChild {
    border: 0.5px solid grey;
    background-color: #A7C957;
    border-radius: 10px;
    width: 45%;
    margin: 10px;
    padding: 10px;
}
.summaryPendingTaskHeader{
    /* color: #bc4749; */
    color: #3D3A4B;
}
.fetchThisPendingImg {
    display:flex;
    justify-content: flex-start;
    height: 150px;
    width: 150px;
    margin: auto;
    max-width: 375px;
    opacity: 0.75;
}
.summaryPendingTaskContainer{
    border: 0.5px solid grey;
    border-radius: 10px;
    background-color:#DEF6CA;
    margin: 10px 0;
    padding: 10px;
}
.summaryCompletedFlexChild {
    border: 0.5px solid grey;
    background-color: #b4a0e5;
    border-radius: 10px;
    width: 45%;
    margin: 10px;
    padding: 10px;
}
.summaryCompletedTaskHeader{
    color:black;
    opacity: 0.75;
}
.fetchThisCompletedImg {
    display:flex;
    justify-content: flex-start;
    height: 150px;
    width: 150px;
    margin: auto;
    max-width: 375px;
    opacity: 0.75;
}
.summaryCompletedTaskContainer{
    border: 0.5px solid grey;
    border-radius: 10px;
    background-color:lightgray;
    margin: 10px 0;
    padding: 10px;
}
.summaryTitle{
    text-align:center;
    margin: 10px;
}
.fetchThisImg {
    height: 150px;
    width: 375px;
    margin: auto;
    max-width: 375px;
}
.footer{
    padding: 10px;
}
New
9:22
lists.css
body {
    background: #DEF6CA;
    overflow-y: scroll;
    scroll-behavior: smooth;
    scroll-snap-type: y mandatory;
    scroll-snap-align: center;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
.listsTitle{
    text-align:center;
    margin: 10px;
}
.listsFlexContainer {
    display:flex;
    justify-content: space-around;
    border: 0.5px solid grey;
    background-color: #548c2f;
    border-radius: 10px;
    width: 45%;
    margin: 10px;
    padding: 10px;
}
.listTaskFlexContainer {
    display:flex;
    justify-content: space-around;
    border: 0.5px solid grey;
    background-color: #B4A0E5;
    border-radius: 10px;
    width: 45%;
    margin: 10px;
    margin-left: 60px;
    padding: 10px;
}
.listsContainer{
    border: 0.5px solid grey;
    border-radius: 10px;
    background-color:#DEF6CA;
    margin: 10px 0;
    padding: 10px;
}
(edited)
9:23
tasks.css
body {
    background: #DEF6CA;
    overflow-y: scroll;
    scroll-behavior: smooth;
    scroll-snap-type: y mandatory;
    scroll-snap-align: center;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
/* .tasksContainer{
    justify-content: space-around;
}
.tasksFlexContainer{
    display:flex;
    justify-content: space-around;
} */
/* .checkbox{
    margin: 10px;
    padding: 10px;
} */
.addButton{
    justify-content: center;
    align-self: center;
    width: 50%;
    margin: 10px;
    font-size: 1.02em;
    padding: 5px;
}
.tasksTitle{
    text-align:center;
    margin: 10px;
}
.tasksFlexContainer{
    display:flex;
    justify-content: space-around;
    align-items: center;
    border: 0.5px solid grey;
    background-color: #548c2f;
    border-radius: 10px;
    width: 45%;
    margin: 10px;
    padding: 10px;
}
.tasksContainer{
    display: flex;
    justify-content: center;
    border: 0.5px solid grey;
    border-radius: 10px;
    background-color:#DEF6CA;
    margin: 10px 0;
    padding: 10px;
}
.addTaskForm{
    width: 300px;
    margin: 10px auto;
    text-align: center;
}
.addTaskName, .taskTextContainer, .taskListSelection{
    width: 100%;
    margin: 10px;
    font-size: 1.2em;
    /* border: 0; */
    padding: 10px;
    border-radius: 10px;
}
