let degerProfile;
let depProfile;

(async () => {
    degerProfile = fetch('/profile').then(res => res.json()).then(data => { return data });
})()

degerProfile.then(a => {
    depProfile = a;
    console.log(depProfile);
})

document.getElementById("profile-tc").innerHTML = depProfile[0];
document.getElementById("profile-name").innerHTML = depProfile[1];
document.getElementById("profile-surname").innerHTML = depProfile[2];
document.getElementById("profile-age").innerHTML = depProfile[3];
document.getElementById("profile-sex").innerHTML = depProfile[4];
document.getElementById("profile-insurance").innerHTML = depProfile[5];