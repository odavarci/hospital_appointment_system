function log() {
    tc = document.querySelector('#tc').value;
    password = document.querySelector('#password').value;

    fetch('/tcno1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "tcno": tc
        })
    });
}