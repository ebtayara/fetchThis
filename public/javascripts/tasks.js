const task = require("../../db/models/task")

const addButton = document.getElementById('addButton');
const text = document.getElementById('textarea');
const divToAddToo = document.querySelector('#tasksFlex')

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

addButton.addEventListener('click', e => {
    divToAddToo.innerHTML = text.innerHTML //also tried text.value
});
