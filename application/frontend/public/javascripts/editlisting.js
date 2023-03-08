function displayAlert(m) {
    const alert = document.getElementById('alert');
    const message = document.getElementById('alert-message');
    message.innerHTML = m;
    alert.removeAttribute('hidden');
}

async function editlisting(e) {
    e.preventDefault();
  
    const editContainer = document.getElementById('edit-listing-container');
    const successContainer = document.getElementById('success-container');
    const listingLink = document.getElementById('listing-link');
    const alert = document.getElementById('alert');
  
    alert.setAttribute('hidden', true);
  
    const form = document.getElementById('edit-listing');
    const formData = new URLSearchParams(new FormData(form));
  
    const listPhotos = document.getElementById('photos');

    let requestBody = Object.fromEntries(formData);

    // Lookup address to verify it exists
    const locationData = await lookupAddress();
    if(locationData.error !== null || locationData.data.length === 0) {
      displayAlert(locationData.error);
      return;
    }

    // Add location data to request body
    requestBody.location = locationData.data[0].label;
    requestBody.longitude = locationData.data[0].longitude;
    requestBody.latitude = locationData.data[0].latitude;
  
    fetch('/listings/edit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((res) => {
          console.log(res);
        // If the user was successfully registered, show the success message.
        if (res.id) {
            successContainer.removeAttribute('hidden');
            editContainer.setAttribute('hidden', true);
            listingLink.setAttribute('href', `/listing/${res.id}`)
        } else {
          // If the user was not registered, show the error message.
          displayAlert(res.error);
        }
      })
      .catch(() => {
        // If the user was not registered, show the error message.
        displayAlert('Sorry, an error occurred.');
      });
}

async function lookupAddress() {
    return new Promise((resolve, reject) => {
      const location = document.getElementById('location').value;
    
      fetch(`/search/location/${location}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then((response) => response.json())
      .then((response) => resolve(response))
      .catch((error) => resolve(error))
    });
  
  }

window.onload = () => {
    const form = document.getElementById('edit-listing');
    form.addEventListener('submit', editlisting);
}