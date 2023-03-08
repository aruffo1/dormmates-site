
async function displayAlert(m) {
    const alert = document.getElementById('alert');
    const message = document.getElementById('alert-message');
    message.innerHTML = m;
    alert.removeAttribute('hidden');
}

async function postalisting(e) {
    e.preventDefault();
  
    const postContainer = document.getElementById('post-listing-container');
    const successContainer = document.getElementById('success-container');
    const listingLink = document.getElementById('listing-link');
    const alert = document.getElementById('alert');
  
    alert.setAttribute('hidden', true);
  
    const form = document.getElementById('post-listing');
    const formData = new URLSearchParams(new FormData(form));
  
    const photos = document.getElementById('photos');
    const photosEncoded = [];
    for(let i = 0; i<photos.files.length; i++) {
      // Check if the image is less than 50kb.
      if(photos.files[0].size > 50000) {
        displayAlert('Some photos exceed the max size requirement. Max size is 50kb.');
        return;
      }
      photosEncoded.push(await base64Encode(photos.files[i]));
    };

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
  

    fetch('/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((res) => {
        // If the listing was successfully created, upload the photos.
        if (res.id) {
      
          for(let i = 0; i<photos.files.length; i++) {
            fetch('/photo/upload', {
              method: "POST",
              headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  listingId: res.id,
                  photo: photosEncoded[i]
              })
            })
            .then((response) => response.json())
            // .then((response) => {})
            .catch((err) => console.log(err))
          }
          successContainer.removeAttribute('hidden');
          postContainer.setAttribute('hidden', true);
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
  const form = document.getElementById('post-listing');
  form.addEventListener('submit', postalisting);
};

// Helper function for base64 encoding an image.
async function base64Encode(image) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
    reader.readAsDataURL(image)
  })
}