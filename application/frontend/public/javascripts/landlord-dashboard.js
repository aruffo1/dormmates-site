// Fetch all students when the page is initially loaded
window.addEventListener('load', () => {
  getListings();
});


function getListings() {
    const landlordId = document.getElementById('landlord-id').value;
    fetch(`/listings/landlord/${landlordId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
    })
    .then((response) => response.json())
    .then((res) => {
      if(res.listings) {
        // render the students
        renderListings(res.listings)
      } else {
        // display an error
      }
    })
    .catch((err) => {
      console.log(err);
    })
}

function renderListings(listings) {
  const listingsCol = document.getElementById('listings-col');
  listingsCol.innerHTML = "";

  listings.forEach((listing) => {
    let html = `
    <div class="col-sm-12 col-md-3 mb-3">
        <div class="card h-100 text-start mb-3">
            <img class="card-img-top" src="${listing.photos ? listing.photos[0].photo : "/images/a-room-at-the-beach.jpg"}" height="150px"/>
            <div class="card-body">
                <small class="card-text text-muted">Location</small>
                <p class="card-text">${listing.location}</p>
                <small class="card-text text-muted">Price</small>
                <p class="card-text">$${listing.price}</p>
                <a class="stretched-link" href="/listing/${listing.id}"></a>
            </div>
        </div>
    </div>
    `;

    listingsCol.innerHTML += html;
  });
}