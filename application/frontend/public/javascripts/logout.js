function logout() {
  fetch('/auth/logout', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then(() => {
      window.location.href = '/';
    })
    .catch((error) => {
      console.log(error);
    });
}
