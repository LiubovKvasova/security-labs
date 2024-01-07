"use strict";

const loginForm = document.getElementById('login-form');
const loginErrorMsg = document.getElementById('login-error-msg');
const logoutLink = document.getElementById('logout');

const session = sessionStorage.getItem('session');
let token;

const param = new URL(location.href).searchParams;
const code = param.get('code');

console.log(code);

if (code) {
    axios({
        method: 'post',
        url: '/api/codelogin',
        data: { code }
    }).then((response) => {
        sessionStorage.setItem('session', JSON.stringify(response.data));
        location.assign('/');
    }).catch((error) => {
        console.log(`Error: ${error}`);
    });
}

if (session) {
    token = JSON.parse(session).token;
}

if (token) {
    axios.get('/page-info', {
        headers: {
            Authorization: token,
        },
    }).then((response) => {
        const { username } = response.data;

        if (username) {
            const mainHolder = document.getElementById('main-holder');
            const loginHeader = document.getElementById('login-header');

            loginForm.classList.add("hidden");
            loginErrorMsg.classList.add("hidden");
            loginHeader.classList.add("hidden");
            logoutLink.style.visibility = "visible";

            const informationTag = document.createElement('p');
            informationTag.textContent = `Username: ${username}`
            mainHolder.append(informationTag);
        }
    });
}

logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('session');
    location.assign('/');
});
