function log() {
    tc = document.querySelector('#tc').value;
    password = document.querySelector('#password').value;

    if (isItIn(tc)) {
        real_password = getPassword(tc).substring(0,11);
        if (real_password == password) {
            res.redirect("/profile.html");
            console.log("replaced");
        }
        else {
            alert("Wrong password or TC");
        }
    }
    else {
        alert("No such user exists!");
    }
}

function isItIn(tc) {
    var toReturn = false;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "./passwords.txt", false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                var arr = allText.split("\n");
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].split(" ");
                }
                for (let i = 0; i < arr.length; i++) {
                    if (tc == arr[i][0]) {
                        toReturn = true;
                    }
                }
            }
        }
    }
    rawFile.send(null);
    return toReturn;
}

function getPassword(tc) {
    var toReturn = null;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "./passwords.txt", false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                var arr = allText.split("\n");
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].split(" ");
                }
                for (let i = 0; i < arr.length; i++) {
                    if (tc == arr[i][0]) {
                        toReturn = arr[i][1];
                    }
                }
            }
        }
    }
    rawFile.send(null);
    return toReturn;
}