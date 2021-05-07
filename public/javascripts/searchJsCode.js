const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('submit', async (event) => {
  const res = await fetch('/tasks', {})
  const tasks = res.json()

  const searchString = event.target.value.toLowerCase();
  const filtered = tasks.filter( task => {
    return task.name.toLowerCase().includes(searchString)
  })
})
