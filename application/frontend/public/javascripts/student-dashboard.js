// Fetch all students when the page is initially loaded
window.addEventListener('load', () => {
  getNearbyStudents();
  getFavoritesList();
});


function getNearbyStudents() {
    const studentId = document.getElementById('student-id').value;
    fetch(`/search/recommendations/${studentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
    })
    .then((response) => response.json())
    .then((res) => {
      if(res.students) {
        // render the students
        console.log(res.students);
        renderStudents(res.students)
      } else {
        // display an error
      }
    })
    .catch((err) => {
      console.log(err);
    })
}

function getFavoritesList() {
  const studentId = document.getElementById('student-id').value;
  fetch(`/favorite/student/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
  })
  .then((response) => response.json())
  .then((res) => {
    if(res.listings) {
      // render the students
      renderFavorites(res.listings)
    } else {
      // display an error
    }
  })
  .catch((err) => {
    console.log(err);
  })
}

function renderFavorites(listings) {
  const favoritesCol = document.getElementById('favorites-col');
  favoritesCol.innerHTML = "";

  listings.forEach((listing) => {
    let html = `
    <div class="col-sm-12 col-md-3">
        <div class="card h-100 text-start">
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

    favoritesCol.innerHTML += html;
  });
}

function renderStudents(students) {
  const studentsCol = document.getElementById('students-col');
  studentsCol.innerHTML = "";

  students.forEach((user) => {
    let html = `
    <div class="col-sm-12 col-md-3">
        <div class="card h-100 text-start">
            <img class="card-img-top" src="${user.photo || "/images/match.svg"}" height="150px"/>
            <div class="card-body">
              <h5 class="card-title text-center">${user.name}</h5>
              <h6 class="card-subtitle text-center text-muted">${user.major}</h6>
              <a class="stretched-link" href="/profile/${user.id}"></a>
            </div>
        </div>
    </div>
    `;

    studentsCol.innerHTML += html;
  });
}
                                                                                                                                          
