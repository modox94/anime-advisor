const newUserForm = document.getElementById('signup');

newUserForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const {
    username: { value: username },
    password: { value: password },
    corpassword: { value: corpassword },
  } = event.target;
  console.log(username, password, corpassword);
  if (username.length >= 4 && password.length >= 4) {
    console.log('Ok');
    if (password === corpassword) {
      console.log('Ok');
      const body = {
        username,
        password,
      };
      console.log(body);
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      window.location.assign('/');
    } else {
      newUserForm.insertAdjacentHTML('afterend', 'Заполните форму корректно!');
    }
  } else {
    newUserForm.insertAdjacentHTML('afterend', 'Заполните форму корректно!');
  }
});
