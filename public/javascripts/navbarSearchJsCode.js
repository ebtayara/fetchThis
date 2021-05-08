const navBarSearchButton = document.getElementById('navBarSearchButton');

navBarSearchButton.addEventListener('click', async (event) => {
  const searchString = document.getElementById('navBarJS');
  window.location.href = (`/search/${searchString.value}`)
})
