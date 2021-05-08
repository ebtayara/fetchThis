const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', async (event) => {
  const searchString = document.getElementById('searchBarJS');
  window.location.href = (`/search/${searchString.value}`)
})
