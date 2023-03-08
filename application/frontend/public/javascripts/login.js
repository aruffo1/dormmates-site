function displayAlert(m) {
  const alert = document.getElementById('alert');
  const message = document.getElementById('alert-message');
  message.innerHTML = m;
  alert.removeAttribute('hidden');
}

function login(e) {
  e.preventDefault();

  const loginContainer = document.getElementById('login-container');
  const successContainer = document.getElementById('success-container');
  const alert = document.getElementById('alert');

  alert.setAttribute('hidden', true);

  const form = document.getElementById('login-form');
  const formData = new URLSearchParams(new FormData(form));

  fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        window.location.replace("/");
        successContainer.removeAttribute('hidden');
        loginContainer.setAttribute('hidden', true);
      }
      displayAlert('You have entered an incorrect username or password.');
    })
    // .then((data) => {
    //   if (data) {
    //     window.location.replace("/");
    //   } else {
    //     console.log(
    //   }
    // })
    .catch((error) => {
      displayAlert('Sorry, an error occurred.');
    });
}

window.onload = function init() {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', login);
};

$("sign in").click(function(){ 'not good'})