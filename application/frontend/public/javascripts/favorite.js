function addToFavorites(studentId, listingId) {
  const favoritesButton = document.getElementById('favorite-button');

  fetch('/favorite/listing', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      studentId: studentId,
      listingId: listingId
    })
  })
  .then((response) => response.json())
  .then((response) => {
    favoritesButton.setAttribute('onclick', `removeFromFavorites("${studentId}", "${listingId}")`);
    favoritesButton.innerHTML = "Unfavorite"
  })
  .catch((error) => { console.log(error) })
}

function removeFromFavorites(studentId, listingId) {
  const favoritesButton = document.getElementById('favorite-button');

  fetch(`/favorite/delete/${studentId}/${listingId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then((response) => response.json())
  .then((response) => {
    favoritesButton.setAttribute('onclick', `addToFavorites("${studentId}", "${listingId}")`);
    favoritesButton.innerHTML = "Favorite"
  })
  .catch((error) => { console.log(error) })

}

async function renderFavoritesButton(studentId, listingId) {
  const favoritesButton = document.getElementById('favorite-button');

  fetch(`/favorite/student/${studentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((response) => response.json())
  .then((res) => {
    if(res.listings) {
      // check if this listing is favorited
      res.listings.forEach((listing) => {
        if(listing.id === listingId) {
          // if it is, add the unfavorite button
          favoritesButton.setAttribute('onclick', `removeFromFavorites("${studentId}", "${listingId}")`);
          favoritesButton.innerHTML = "Unfavorite"
          favoritesButton.removeAttribute('hidden');
          return;
        }
      })
      favoritesButton.removeAttribute('hidden');
    } else {
      // display an error
    }
  })
  .catch((err) => {
    console.log(err);
  })
}

window.onload = () => {
  const studentId = document.getElementById("student-id").value;
  const listingId = document.getElementById("listing-id").value;
  renderFavoritesButton(studentId, listingId);
}