window.addEventListener('load', (e) => {
    search(e);
});

const filterForm = document.getElementById('roommate-filters');
filterForm.addEventListener('submit', search);

function search(e) {
    e.preventDefault();
    
    // Get the form data
    const formData = new URLSearchParams(new FormData(filterForm));
    let requestBody = Object.fromEntries(formData);    
    

    // Only care about filters that are not undefined / have been selected.
    const filters = Object.keys(requestBody).filter((key) => {
        return requestBody[key] !== 'undefined';
    });


    // Append the filters to the url as a query string
    let url = `/search/student`;
    if(filters.length > 0) {
      for(let i = 0; i < filters.length; i++) {
        if(i == 0) {
              url += `?${filters[i]}=${requestBody[filters[i]]}` 
          } else {
              url += `&${filters[i]}=${requestBody[filters[i]]}` 
        }
      }
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((response) => {
      renderStudents(response.students);
    })
    .catch((error) => {
      console.log(error);
    })

}

function renderStudents(students) {
  let studentsColumn = document.getElementById('students-col');
  studentsColumn.innerHTML = "";

  students.forEach((student) => {
    console.log(student);
    let html = `
      <div class="col-sm-12 col-md-3">
        <div class="card mb-3">
          <img class="card-img-top" src="${student.photo}" height="150px"/>
          <div class="card-body">
            <h5 class="card-title text-center">${student.name}</h5>
            <h6 class="card-subtitle text-center text-muted">${student.major}</h6>
            <a class="stretched-link" href="/profile/${student.userId}"></a>
          </div>
        </div>
      </div>
    `;

    studentsColumn.innerHTML += html;
  });
}