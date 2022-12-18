function log() {
    tc = document.querySelector('#tc').value;
    password = document.querySelector('#password').value;

    fetch('login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "tcno": tc,
            "password": password
        })
    });
}