const log = console.log
const pastComment = document.querySelector('#pastComment')
pastComment.addEventListener('click', changeToComment);

const collection = document.querySelector("#Collection");
collection.addEventListener('click', changeToCollection);

const update = document.querySelector("#Update");
update.addEventListener('click', changeToUpdate);

const Messages = document.querySelector('#Message')
Messages.addEventListener('click', changeToMessages)

function changeToComment(e){
    e.preventDefault();
    const content = document.querySelector("#contents");
    const newContent = document.createElement('div');
    newContent.id = 'contents';

    const url = '/users/comment'

    // Send the request with fetch()
    fetch(url)
    .then(function(res) {
        if (res.status === 200) {
            // If student was added successfully, tell the user.    
            res.json().then(function (result) {
                const comments = result.comments
                const url1 = '/users/current'
                fetch(url1)
                .then(function(res) {
                    if (res.status === 200) {
                        // If student was added successfully, tell the user.   
                        res.json().then(function (nickname) {
                            const byCurrent = comments.filter((comment) => comment.nickname === nickname)
                            byCurrent.map((comment) => {
                                newContent.appendChild(addComment(comment.poster, comment.movie, comment.content))
                            })
                        })
                    } 
                }).catch((error) => {
                    console.log(error)
                })
            })
        } 
    }).catch((error) => {
        console.log(error)
    })

    // newContent.appendChild(addComment('One Movie', 'Love this!'));
    // newContent.appendChild(addComment('One Movie', 'Gonna tell my friends to watch this!'));
    // Append new content 
    content.parentElement.appendChild(newContent);
    content.parentElement.removeChild(content);
}

function addComment(src, movie, content){
    const com = document.createElement('div');
    com.className = 'message';
    const container = document.createElement('div');
    container.className = 'messageIconContainer';
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.className = 'moviePoster';
    container.appendChild(img);
    com.appendChild(container);

    const commentContent = document.createElement('div');
    commentContent.className = 'messageContent';
    const movieName = document.createElement('h3');
    movieName.innerText = movie;
    commentContent.appendChild(movieName);
    const contents = document.createElement('div');
    contents.innerText = content;
    commentContent.appendChild(movieName);
    commentContent.appendChild(contents);
    com.appendChild(commentContent);
    return com;
}

function changeToCollection(e) {
    e.preventDefault();
    const content = document.querySelector("#contents");
    const newContent = document.createElement('div');
    newContent.id = 'contents';

    const url = "/users/collections"
    fetch(url)
    .then(function(res) {
        if (res.status === 200) {
            // If student was added successfully
            res.json().then(function (result) {
                result.map((movie) => {
                    newContent.appendChild(addMovie(movie.poster, movie.name, movie.movieid));
                })
            })
        } 
    }).catch((error) => {
        console.log(error)
    })
    // Append new content 
    content.parentElement.replaceChild(newContent, content);
}

function addMovie(src, name, id) {
    const block = document.createElement('a')
    block.className = "movie_link"
    
    const movieCoverContainer = document.createElement('div')
    movieCoverContainer.className = 'movie_link_img_container'

    const movieCover = document.createElement('img')
    movieCover.src = src
    movieCover.className = "movie_link_img"
    movieCover.alt = ""
    movieCoverContainer.appendChild(movieCover)

    const movieNameContainer = document.createElement('div')
    movieName = document.createElement('p')
    movieName.className = 'movie_link_text'
    movieName.innerText = name
    movieNameContainer.appendChild(movieName)

    block.appendChild(movieCover)
    block.appendChild(movieNameContainer)
    block.addEventListener('click', function() {
        log(id)
        localStorage.setItem('id', id)
        window.location = '/movieinfo';
    })

    return block
}

function changeToUpdate(e) {
    e.preventDefault();
    const content = document.querySelector("#contents");
    const newContent = document.createElement('div');
    newContent.id = 'contents';
    // Username
    const username = document.createElement('div');
    // username.innerText = 'Username :';
    // username.className = 'updateInfo';
    const nameInput = document.createElement('input');
    nameInput.className = 'updateInfo';
    nameInput.type = 'text';
    nameInput.placeholder = 'Nickname';
    nameInput.id = 'nickname';
    // New Password
    const newPassword = document.createElement('input');
    newPassword.id = 'newPassword';
    newPassword.className = 'updateInfo';
    newPassword.type = 'text';
    newPassword.placeholder = 'New Password';
    // Old Password
    const oldPassword = document.createElement('input');
    oldPassword.className = 'updateInfo';
    oldPassword.id = 'oldPassword'
    oldPassword.type = 'text';
    oldPassword.placeholder = 'Old Password';
    // Update Button
    const update = document.createElement('button');
    update.innerText = 'Update';
    update.id = 'updateButton';
    update.style = "cursor: pointer";

    // Update Button Listener
    update.addEventListener('click', updateInfo);

    newContent.appendChild(username);
    newContent.appendChild(nameInput);
    newContent.appendChild(oldPassword);
    newContent.appendChild(newPassword);
    newContent.appendChild(update);
    // Append new content 
    content.parentElement.appendChild(newContent);
    content.parentElement.removeChild(content);
}

function updateInfo(e) {
    e.preventDefault();
    // the URL for the request
    const url = '/users/update';

    // The data we are going to send in our request
    const nickname = document.querySelector('#nickname').value
    const newPassword = document.querySelector('#newPassword').value
    const oldPassword = document.querySelector('#oldPassword').value
    let data = {
        nickname: nickname,
        password: newPassword,
        oldPassword: oldPassword
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
            window.location = '/user';
        } 
    }).catch((error) => {
        console.log(error)
    })
}

const logOutButton = document.querySelector('#log_out');
logOutButton.addEventListener('click', logOut);

function logOut(e) {
    e.preventDefault();
    window.location = '/users/logout';
}

const user_portrait = document.querySelector(".user_portrait");
const upload_button_container = document.querySelector("#upload_button_container");
user_portrait.addEventListener('mouseover', showButton);
user_portrait.addEventListener('mouseout', hideButton);
upload_button_container.addEventListener('mouseover', showButton);
upload_button_container.addEventListener('mouseout', hideButton);

function showButton() {
    upload_button_container.style.visibility = "visible";
}

function hideButton() {
    upload_button_container.style.visibility = "hidden";
}

function storeUser(e) {
    e.preventDefault()
    const storeUsername = e.target.innerText
    localStorage.setItem('username', storeUsername) 
    log(localStorage.getItem('username'))
    window.location = '/user_profile'
}


function changeToMessages(e){
    e.preventDefault();
    const content = document.querySelector("#contents");
    const newContent = document.createElement('div');
    newContent.id = 'contents';

    const url = '/users/sendmsg'

    // Send the request with fetch()
    fetch(url)
    .then(function(res) {
        if (res.status === 200) {
            // If student was added successfully, tell the user.    
            res.json().then(function (result) {
                result.map((msg) => {
                    newContent.appendChild(addMessage(msg.From, msg.content))
                })
            })
        } 
    }).catch((error) => {
        console.log(error)
    })

    // Append new content 
    content.parentElement.appendChild(newContent);
    content.parentElement.removeChild(content);
}

function addMessage(From, content){
    const com = document.createElement('div');
    com.className = 'message';

    const container = document.createElement('div');
    container.className = 'messageIconContainer';
    const img = document.createElement('img');
    img.src = '/image/ProfilePic2.jpeg';
    img.alt = '';
    img.className = 'profilePoster';
    container.appendChild(img);
    com.appendChild(container);

    const commentContent = document.createElement('div');
    commentContent.className = 'messageContent';

    const messageFrom = document.createElement('div');
    const messageFromWho = document.createElement('h3');
    messageFrom.style = "cursor: pointer"
    messageFromWho.innerText = From;
    messageFrom.appendChild(messageFromWho)
    messageFrom.addEventListener('click', storeUser);
    
    commentContent.appendChild(messageFrom);
    const contents = document.createElement('div');
    contents.innerText = content;
    commentContent.appendChild(contents);
    com.appendChild(commentContent);
    return com;
}

const url2 = '/users/current'
fetch(url2)
.then(function(res) {
    if (res.status === 200) {
        // If student was added successfully, tell the user.   
        res.json().then(function (nickname) {
            const userName = document.querySelector('#user_name')
            userName.innerText = nickname
        })
    } 
}).catch((error) => {
    console.log(error)
})