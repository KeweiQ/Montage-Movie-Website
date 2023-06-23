// "use strict"
// // Now the SignIn has not connect to the database, as long as it does, 
// // we will add functions to fetch user information and check password to set signal to allow the user to log in his account. 


// const signin_btn = document.querySelector("#signin_btn");
// signin_btn.addEventListener('click', signIn);

const signUpButton = document.querySelector('#signup_btn');
signUpButton.addEventListener('click', signUp);

// function signIn(e) {
//     e.preventDefault();
//     window.location = "UserMain.html";
// }

function signUp(e) {
    e.preventDefault();
    window.location = '/signup';
}
