function selectInstitution(name) {
  // Hide the search input form
  const form = document.getElementById('institution-search-form');
  form.setAttribute('hidden', true);

  // Show selected institution section
  const container = document.getElementById('institution-section');
  const message = document.getElementById('selected-institution-message');
  message.innerHTML = `
    Are you looking for roommates near <strong>${name}</strong>
    or are you posting a new unit listing?
  `;
  container.removeAttribute('hidden');
}

function search(event) {
  const resultsContainer = document.querySelector(
    '#institution-search__searchField',
  );

  if (!event.target.value.length) {
    resultsContainer.innerHTML = '';
    return;
  }

  fetch(`/search/institution/${event.target.value}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // data is an array of institutions
      const { institutions } = data;

      // If there are no results, display an appropriate message
      if (institutions.length === 0) {
        resultsContainer.innerHTML = 'No institutions found.';
        return;
      }

      // Render the results
      const resultsList = institutions.map((element) => `
        <li class="list-group-item list-group-item-action" id="${element.id}" onclick="selectInstitution('${element.name}')">
          ${element.name}
        </li>
      `);
      resultsContainer.innerHTML = `${resultsList.join('')}`;
    })
    .catch(() => {
      resultsContainer.innerHTML = 'No institutions found.';
    });
}

window.onload = function init() {
  const input = document.getElementById('institution-search');
  input.addEventListener('input', search);
};