const homeLat = document.getElementById('home-lat').value;
const homeLng = document.getElementById('home-lng').value;
let mymap = L.map('map').setView([homeLat, homeLng], 13);

// Fetch all listings when the page is initially loaded
window.addEventListener('load', (e) => {
  // Initialize map
  // renderMap();
  
  // Get initial listings
  search(e);
});

// Run the search function whenever the listing filters are updated
const filterForm = document.getElementById('listing-filters');
filterForm.addEventListener('submit', search);

function search(e) {
  e.preventDefault();

  // Get the form data for the fetch request
  const formData = new URLSearchParams(new FormData(filterForm));
  let requestBody = Object.fromEntries(formData);

  // Generate the url if filters are present
  let url = `/search/listing`;
  const filters = Object.keys(requestBody);
  if(filters.length > 0) {
    for(let i = 0; i < filters.length; i++) {
      if(i == 0) {
        url += `?${filters[i]}=1` 
      } else {
        url += `&${filters[i]}=1` 
      }
    }
  }

  // Make the fetch request to the backend for listings that matched our filters
  fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((response) => response.json())
  .then((res) => {
    if(res.listings) {
      // render the listings
      renderMap();
      renderListings(res.listings)
    }
  })
  .catch((err) => {
    console.log(err);
  })

}

function renderMap() {
  mymap.remove();
  mymap = L.map('map').setView([homeLat, homeLng], 13)
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZG94aWZ5IiwiYSI6ImNrcmU3Y2NlZzBhcHgyb28ybTF6bGVyN24ifQ.wIgcmm8AY1ByZiR7PPvv-g'
  }).addTo(mymap);
}


function renderListings(listings) {
  let listingsColumn = document.getElementById('listings-col');
  listingsColumn.innerHTML = "";

  listings.forEach((listing) => {
    console.log(listing);
    if(listing.listingLongitude != null && listing.listingLatitude != null) {
      // Create listing container HTML
      let html = `
        <div class="card mb-3" style="width:18rem;">
          <img class="card-img-top" src=${listing.photos ? listing.photos[0].photo : "/images/a-room-at-the-beach.jpg"} width="150px">
          <div class="card-body">
            <small class="card-text text-muted">Location</small>
            <p class="card-title">${listing.location}</p>
            <small class="card-text text-muted">Price</small>
            <p class="card-text text-dark">$${listing.price}/month</p>
            <a class="btn btn-primary d-block" href="/listing/${listing.id}">View</a>
          </div>
        </div>
      `;

      // Add listing to the map
      L.marker([listing.listingLatitude, listing.listingLongitude]).addTo(mymap)
      .bindPopup(
        `
          
          <small class="card-text text-muted">Location</small>
          <span class="card-title">${listing.location}</span>
          <br>
          <small class="card-text text-muted">Price</small>
          <span class="card-text text-dark">$${listing.price}/month</span>
          <br>
          <a class="" href="/listing/${listing.id}">View more details</a>
            
        `
      )

      listingsColumn.innerHTML += html;
    }
  });

}