const addButton = document.getElementById('addButton');
const description = document.getElementById('description');
const taskName = document.getElementById('name');
const taskList = document.getElementById('list');
const taskEditButtons = document.getElementsByClassName('editButton');

// console.log(description, "description 🎾")

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
if (addButton !== null) {
    addButton.addEventListener('click', async(e) => {
        if (taskList !== null) {
            const taskDescriptionValue = description.value;
            const taskNameValue = taskName.value;
            const listId = taskList.value;
            // console.log('warren wants to see this', taskValue)
            // console.log(description,"description🙂")
            // console.log(taskDescriptionValue, "⏰");
            let res = await fetch('/tasks', {  method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"name":taskNameValue, "description":taskDescriptionValue, "listId":listId})});
            if(res.ok) {
                window.location.href = '/tasks'
            }
        }
    });
}
