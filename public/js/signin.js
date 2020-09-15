const signinForm = document.getElementById('signin');

signinForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const {
    username: { value: username },
    password: { value: password },
  } = event.target;
  console.log(username, password);
  if (username.length >= 4 && password.length >= 4) {
    const body = {
      username,
      password,
    };
    console.log(body);
    const response = await fetch('/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    response.json().then((data) => {
      if (data.success) {
        window.location.href = '/';
      } else {
        signinForm.insertAdjacentHTML(
          'afterend',
          '<h2>Ошибка авторизации. Неверный логин или пароль</h2>'
        );
      }
    });
  } else {
    signinForm.insertAdjacentHTML(
      'afterend',
      '<h2>Заполните форму корректно!</h2>'
    );
  }
});
