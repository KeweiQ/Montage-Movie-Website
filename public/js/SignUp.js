"user strict"
// Now the SignUp has not connect to the database, as long as it does, 
// we will add functions to add user's information to the databse so that an account is created.
const log = console.log

const signUpButton = document.querySelector('#signUpButton');
signUpButton.addEventListener('click', addUser);

function addUser(e) {
    e.preventDefault();
    // the URL for the request
    const url = '/signup';

    // The data we are going to send in our request
    const password1 = document.querySelector('#password1').value
    const password2 = document.querySelector('#password2').value
    if (password1 === password2) {
        let data = {
            username: document.querySelector('#userId').value,
            password: document.querySelector('#password1').value,
            nickname: document.querySelector('#nickname').value
        }

            // Create our request constructor with all the parameters we need
        const request = new Request(url, {
            method: 'post', 
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

        // Send the request with fetch()
        fetch(request)
        .then(function(res) {

            // Handle response we get from the API.
            // Usually check the error codes to see what happened.
            if (res.status === 200) {
                // If student was added successfully, tell the user.
                console.log('Added user')
                window.location = '/user';
            } else {
                // If server couldn't add the student, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                console.log("server counldn't add a user")
            }
            log(res)  // log the result in the console for development purposes,
                            //  users are not expected to see this.
        }).catch((error) => {
            log(error)
        })

    } else {
        alert('password inconsistent')
    }
}