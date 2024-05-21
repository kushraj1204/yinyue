
function onLoginFormSubmit(e) {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    (async () => {
        try {
            const response = await fetch(serverUrl+"/auth/login", {
                method: 'POST',
                body: JSON.stringify({ "username": username, "password": password }),
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw data;
            }
            if (data.status) {
                sessionStorage.setItem("user", JSON.stringify({ ...data.data, "loggedIn": true }));
                redirectToHome();
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert(err.message);
        }
    })();

}

window.onload = function () {
    redirectToHome();
    document.getElementById('loginForm').onsubmit = onLoginFormSubmit;

}

function redirectToHome() {
    
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user != null) {
        console.log(user)
        if (user.loggedIn && user.accessToken != "") {
            window.location.replace('/index.html');
        }
    }
}