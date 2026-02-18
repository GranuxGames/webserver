window.addEventListener('load', () => {
  document.querySelector('#button-login').addEventListener('click', async () => {
    var username = document.querySelector('#input-username').value;
    var password = document.querySelector('#input-password').value;

    var output = document.querySelector('#output');

    if (username.length <= 0) {
      output.innerText = 'You must enter a username!'
      return;
    }

    if (password.length <= 0) {
      output.innerText = 'You must enter a password!';
      return;
    }

    var body = {
      username: username,
      password: password
    };

    var error = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    error = await error.json().catch(() => {
      output.innerText = 'Something went wrong.';
    });

    if (error.ok)
      location.href = '/';

    switch (error.error) {
      case 0:
        output.innerText = 'Your username is too short.';
        break;
      case 1:
        output.innerText = 'Your username is too long.';
        break;
      case 2:
        output.innerText = 'Your username can not have spaces at its ends.';
        break;
      case 3:
        output.innerText = 'Your username includes profanity.';
        break;
      case 4:
        output.innerText = 'Your password is too short.';
        break;
      case 5:
        output.innerText = 'Your password is too long.';
        break;
      case 6:
        output.innerText = 'Your username is already taken.';
        break;
      case 7:
        output.innerText = 'Your email is already taken.';
        break;
      case 8:
        output.innerText = 'Your account could not be created, please try again later.';
        break;
      case 9:
        output.innerText = 'You could not be logged in, please try again later.';
        break;
      case 10:
        output.innerText = 'Your account could not be created, please try again later.';
    }
  });
});