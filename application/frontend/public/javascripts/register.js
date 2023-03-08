// This holds data we want to send to the backend through fetch.
const data = {
  userType: undefined
}

function displayAlert(m) {
  const alert = document.getElementById('alert');
  const message = document.getElementById('alert-message');
  message.innerHTML = m;
  alert.removeAttribute('hidden');
}

function userType(type) {
  if(type.toLowerCase() === 'student' || type.toLowerCase() === 'landlord') {
    // Store the type in the data object.
    data.userType = type;

    // update the hidden input
    const hiddenInput = document.getElementById('user-type-input');
    hiddenInput.setAttribute('value', data.userType);

    // Update user-type elements
    document.getElementById('user-type-title').innerText = `Creating a new ${data.userType} account`;
    document.getElementById('email-help-text').innerText = (
      data.userType === 'student' 
      ? 'Enter your edu email address.' 
      : '' 
    )

    // Hide the user selection container and show the register container.
    document.getElementById('user-type-container').setAttribute('hidden', 'true');
    document.getElementById('register-container').removeAttribute('hidden');
  }
}

async function register(e) {
  e.preventDefault();

  // Get elements from the register page.
  const registerContainer = document.getElementById('register-container');
  const successContainer = document.getElementById('success-container');
  const alert = document.getElementById('alert');

  // Hide the alert.
  alert.setAttribute('hidden', true);

  // Get form data and base64 encode avatar.
  const form = document.getElementById('register-form');
  const formData = new URLSearchParams(new FormData(form));

  const avatar = document.getElementById('avatar');
  // Check if the image is less than 50kb.
  if(avatar.files[0].size > 50000) {
    displayAlert('Your avatar is too large. Max size is 50kb.');
    return;
  }
  const base64Avatar = await base64Encode(avatar.files[0]);
 
  // Create the request body.
  let requestBody = Object.fromEntries(formData);
  requestBody.avatar = base64Avatar; // set the base 64 encoding of the avatar.

  // Make an AJAX request to the backend to register the user.
  fetch('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((res) => {
      // If the user was successfully registered, show the success message.
      if (res.id) {
        if(data.userType === 'student') {
          window.location.href = `/questionnaire/${res.id}`;
        } else {
          successContainer.removeAttribute('hidden');
          registerContainer.setAttribute('hidden', true);
        }
      } else {
        // If the user was not registered, show the error message.
        displayAlert(res.error || res.message);
      }
    })
    .catch(() => {
      // If the user was not registered, show the error message.
      displayAlert('Sorry, an error occurred.');
    });
}

window.onload = function init() {
  const selectStudentButton = document.getElementById('select-student');
  const selectLandlordButton = document.getElementById('select-landlord');
  selectStudentButton.addEventListener('click', userType.bind(null, 'student'));
  selectLandlordButton.addEventListener('click', userType.bind(null, 'landlord'));
  
  const form = document.getElementById('register-form');
  form.addEventListener('submit', register);
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