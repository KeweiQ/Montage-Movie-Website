/* AJAX fetch() calls */
const log = console.log

log('Loaded front-end javascript.')


// A function to send a POST request with a new user.
function addUser() {
    // the URL for the request
    const url = '/signup';

    // The data we are going to send in our request
    let data = {
        usernmae: document.querySelector('#userId').value,
        password: document.querySelector('#password1').value
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
}


