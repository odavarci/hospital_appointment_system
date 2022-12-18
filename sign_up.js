function getSignUpData() {
    tc = document.querySelector('#tc').value;
    name = document.querySelector('#name').value;
    surname = document.querySelector('#surname').value;
    age = document.querySelector('#age').value;
    sex = document.querySelector('#sex').value;
    if (sex == "Male")
        sex = "E";
    else
        sex = "K";

    insurance = document.querySelector('#insurance').value;
    password = document.querySelector('#password').value;
    password_again = document.querySelector('#password-again').value;

    if (password_again != password) {
        alert("passwords are not matched!");
    }
    else {
        fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "tcno": tc,
                "name": name,
                "surname": surname,
                "age": age,
                "sex": sex,
                "insurance": insurance,
                "password": password
            })
        });
    }

}
