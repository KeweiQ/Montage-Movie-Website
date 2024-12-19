'use strict'
const log = console.log
/* mongo-find-student */
// Vanilla methods to find student(s) on a mongo database (no Mongoose).

// const {MongoClient, ObjectID} = require('mongodb')
const toUser = localStorage.getItem('username')
const userName = document.querySelector('#user_name')
userName.innerText = toUser

const pastComment = document.querySelector('#pastComment')
pastComment.addEventListener('click', changeToComment);

const sendMessage = document.querySelector('#sendMessage');
sendMessage.addEventListener('click', changeToSend);

const collection = document.querySelector("#Collection");
collection.addEventListener('click', changeToCollection);

// After we have databse, the comment will be fetched from the database and loaded in the page. 
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
                const toUser = localStorage.getItem('username')
                const comments = result.comments
                const byHim = comments.filter((comment) => comment.nickname === toUser)
                byHim.map((comment) => {
                    newContent.appendChild(addComment(comment.poster, comment.movie, comment.content))
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
    img.className = 'messageIcon';
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

function changeToSend(e){
    e.preventDefault();
    const content = document.querySelector("#contents");
    const newContent = document.createElement('div');
    newContent.id = 'contents';
    // Add message box
    const message = document.createElement('div');
    const messageArea = document.createElement('textarea');
    messageArea.id = 'commentContent';
    messageArea.placeholder = 'Write your message here: ';
    message.appendChild(messageArea);
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'buttonCommentContainer'
    const sendButton = document.createElement('button');
    sendButton.id = 'sendButton';
    sendButton.innerText = 'send';
    sendButton.style = "cursor: pointer"
    sendButton.addEventListener('click', sendMsgToUser)
    buttonContainer.appendChild(sendButton);
    message.appendChild(buttonContainer);
    newContent.appendChild(message);
    
    // Append new content 
    content.parentElement.appendChild(newContent);
    content.parentElement.removeChild(content);
}


function sendMsgToUser(e) {
    e.preventDefault()
    const toUser = localStorage.getItem('username')
    const msgContent = document.querySelector('#commentContent').value
    const url = '/users/sendmsg'

    let data = {
        From: "",
        To: toUser,
        content: msgContent
    }

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
            window.location = '/user_profile'
            alert("message sent successfully")
        } 
    }).catch((error) => {
        console.log(error)
    })
}

function changeToCollection(e) {
    e.preventDefault();
    const content = document.querySelector("#contents");
    const newContent = document.createElement('div');
    const current = localStorage.getItem('username')
    newContent.id = 'contents';

    const url = "/users/collections/bynickname"
    let data = {
        nickname: current
    }
    const request = new Request(url, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    fetch(request)
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
    const movieName = document.createElement('p')
    movieName.className = 'movie_link_text'
    movieName.innerText = name
    movieNameContainer.appendChild(movieName)

    block.appendChild(movieCover)
    block.appendChild(movieNameContainer)
    block.addEventListener('click', function() {
        localStorage.setItem('id', id)
        window.location = '/movieinfo';
    })

    return block
}
