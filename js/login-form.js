
const login_form = document.querySelector('#login-form');
login_form.addEventListener('submit', function (e) {
    const username = e.target.querySelector('#username').value;
    const room = e.target.querySelector('#room').value;

    if (username == '' || room == '') {
        return;
    }
    localStorage.setItem('user', username);
    localStorage.setItem('room', room);
    e.preventDefault();

    document.body.setAttribute('data-logged', 'true');
    location.reload();

});