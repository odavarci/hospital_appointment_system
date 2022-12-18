//const read_data = require("./Database/read_data.js");

function getSignUpData() {
    tc = document.querySelector('#tc').value;
    name = document.querySelector('#name').value;
    surname = document.querySelector('#surname').value;
    age = document.querySelector('#age').value;
    cinsiyet = document.querySelector('#sex').value;
    if (cinsiyet == "Male")
        cinsiyet = "E";
    else
        cinsiyet = "K";

    insurance = document.querySelector('#insurance').value;
    password = document.querySelector('#password').value;
    password_again = document.querySelector('#password-again').value;

    var exists = isItIn(tc);

    if (exists) {
        alert("User already exists!");
    }
    else if (password != password_again) {
        alert("Passwords are not matched!");
    }
    else {
        window.open("profile.html");
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

(async () => {
    var sth = read_data.getDepartmentName();
    console.log(sth);
})()
