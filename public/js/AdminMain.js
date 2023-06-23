'use strict'

const reports = document.querySelector("#reports");
reports.addEventListener('click', changeToReport);

const users = document.querySelector("#users");
users.addEventListener('click', changeToUsers);

const account = document.querySelector('#account');
account.addEventListener('click', changeToAccount);

const Messages = document.querySelector('#Message')
Messages.addEventListener('click', changeToMessages)

function changeToReport(e){
    e.preventDefault();
    const content = document.querySelector("#contents");
    const newContent = document.createElement('div');
    newContent.id = 'contents';

    // Add a report
    const url = '/admin/reports'
    fetch(url)
    .then(function(res) {
        if (res.status === 200) {
            // If student was added successfully, tell the user.    
            res.json().then(function (result) {
                result.reports.map((report) => {
                    newContent.appendChild(addReport(report.Reporter, report.Author, report.movie, report.content))
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

function addReport(ReporterName, author, movieName, words){
    const report = document.createElement('div');
    report.className = 'report';
    const reporter = document.createElement('p');
    reporter.innerText = 'Reporter:';
    const reporterName = document.createElement('span');
    reporterName.class = 'bold';
    reporterName.innerText = ReporterName;
    reporter.appendChild(reporterName);
    report.appendChild(reporter);

    const h4 = document.createElement('h4');
    h4.innerText = 'Reported comment:'
    report.appendChild(h4);
    // Create table and title
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');

    const th1 = document.createElement('th');
    th1.innerText = 'Username';
    const th2 = document.createElement('th');
    th2.innerText = 'movie';
    const th3 = document.createElement('th');
    th3.innerText = 'Contents';
    const th4 = document.createElement('th');
    th4.innerText = 'Operation';
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
    tbody.appendChild(tr);
    // Information of reported comment 
    const firstReport = document.createElement('tr');
    const name = document.createElement('td');
    const movie = document.createElement('td');
    const comment = document.createElement('td');
    const operation = document.createElement('td');
    name.innerText = author;
    movie.innerText = movieName;
    comment.innerText = words;
    const Ignore = document.createElement('button');
    const Delete = document.createElement('button');
    Ignore.innerText = 'Ignore';
    Ignore.className = 'ignoreButton';
    Ignore.style = "cursor: pointer";
    Delete.innerText = 'Delete';
    Delete.style = "cursor: pointer";
    Ignore.addEventListener('click', ignoreReport);
    Delete.addEventListener('click', deleteReport);
    operation.appendChild(Ignore);
    operation.appendChild(Delete);
    firstReport.appendChild(name);
    firstReport.appendChild(movie);
    firstReport.appendChild(comment);
    firstReport.appendChild(operation);
    tbody.appendChild(firstReport);
    table.appendChild(tbody);
    report.appendChild(table);
    return report;
}

function ignoreReport(e){
    e.preventDefault();
    const reporter = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.innerText
    const content = e.target.parentElement.parentElement.firstElementChild.nextSibling.nextSibling.innerText
    const url = "/reports"
    let data = {
        reporter: reporter,
        content: content
    }
    const request = new Request(url, {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    // Send the request with fetch()
    fetch(request)
    .then(function(res) {

        // Handle response we get from the API.
        // Usually check the error codes to see what happened.
        if (res.status === 200) {
            window.location = '/admin'
        } else {
            // If server couldn't add the student, tell the user.
            // Here we are adding a generic message, but you could be more specific in your app.
            console.log("server counldn't delete the report")
        }
    }).catch((error) => {
        log(error)
    })
}

function deleteReport(e){
    e.preventDefault();
    const reporter = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.innerText
    const content = e.target.parentElement.parentElement.firstElementChild.nextSibling.nextSibling.innerText
    const author = e.target.parentElement.parentElement.firstElementChild.innerText
    const movie = e.target.parentElement.parentElement.firstElementChild.nextSibling.innerText
    // Delete the comment 
    const url1 = "/comments"
    let comment_data = {
        nickname: author,
        movie: movie,
        content: content
    }
    const request = new Request(url1, {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(comment_data)
    });
    // Send the request with fetch()
    fetch(request)
    .then(function(res) {
        if (res.status === 200) {
            const url = "/reports"
            let data = {
                reporter: reporter,
                content: content
            }
            const request = new Request(url, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            // Send the request with fetch()
            fetch(request)
            .then(function(res) {
                if (res.status === 200) {
                    window.location = '/admin'
                } else {
                    console.log("server counldn't delete the report")
                }
            }).catch((error) => {
                log(error)
            })
        } else {
            console.log("server counldn't delete the report")
        }
    }).catch((error) => {
        log(error)
    })
}

function changeToUsers(e){
    e.preventDefault();
    const content = document.querySelector("#contents");

    const newContent = document.createElement('div');
    newContent.id = 'contents';
    // Create table and title
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');

    const th1 = document.createElement('th');
    th1.innerText = 'Nickname';
    const th2 = document.createElement('th');
    th2.innerText = 'Username';
    const th3 = document.createElement('th');
    th3.innerText = 'Opearation';
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);

    tbody.appendChild(tr);
    const url = '/users'
    fetch(url)
    .then(function(res) {
        // Handle response we get from the API.
        // Usually check the error codes to see what happened.
        if (res.status === 200) {
            // If student was added successfully, display
            res.json().then(function (result) {
                result.users.map((user) => {
                    if (user.type === 0) {
                        const tr = document.createElement('tr');
                        const nickname = document.createElement('td');
                        const username = document.createElement('td');
                        const operation = document.createElement('td');
                        nickname.innerText = user.nickname;
                        username.innerText = user.username;
                        const a = document.createElement('a');
                        const Info = document.createElement('button');
                        const Delete = document.createElement('button');
                        Info.innerText = 'Profile';
                        Info.className = 'ProfileButton';
                        Info.addEventListener('click', toProfile)
                        Info.style = "cursor: pointer";
                        Delete.innerText = 'BAN';
                        Delete.addEventListener('click', removeUser);
                        Delete.style = "cursor: pointer";
                        
                        a.appendChild(Info);
                        operation.appendChild(a);
                        operation.appendChild(Delete);
                        tr.appendChild(nickname);
                        tr.appendChild(username);
                        tr.appendChild(operation);
                        tbody.appendChild(tr);
                    }
                })
            })
        } 
    }).catch((error) => {
        console.log(error)
    })

    table.appendChild(tbody);
    newContent.appendChild(table);
    content.parentElement.appendChild(newContent);
    content.parentElement.removeChild(content);
}

function toProfile(e) {
    e.preventDefault()
    const storeUsername = e.target.parentElement.parentElement.parentElement.firstElementChild.innerText
    localStorage.setItem('username', storeUsername) 
    window.location = '/user_profile'
}

function removeUser(e){
    const nickname = e.target.parentElement.parentElement.firstElementChild.innerText
    const url = "/users/" + nickname
    const request = new Request(url, {
        method: 'delete'
    });
    // Send the request with fetch()
    fetch(request)
    .then(function(res) {

        // Handle response we get from the API.
        // Usually check the error codes to see what happened.
        if (res.status === 200) {
            // If student was added successfully, tell the user.
            const userToDelete = e.target.parentElement.parentElement;
            userToDelete.parentElement.removeChild(userToDelete);
        } else {
            // If server couldn't add the student, tell the user.
            // Here we are adding a generic message, but you could be more specific in your app.
            console.log("server counldn't add a user")
        }
    }).catch((error) => {
        log(error)
    })
}

function changeToAccount(e){
    e.preventDefault();
    const content = document.querySelector('#contents');
    const newContent = document.createElement('div');
    newContent.id = 'contents';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'username';
    nameInput.id = 'usernameInput'
    // Password
    const newPassword = document.createElement('input');
    newPassword.type = 'text';
    newPassword.placeholder = 'New Password';
    newPassword.id = 'newPassword'
    // Update Button
    const update = document.createElement('button');
    update.innerText = 'Update';
    update.id = 'updateButton';
    update.style = "cursor: pointer";
    update.addEventListener('click', updatePassword)

    newContent.appendChild(nameInput);
    newContent.appendChild(newPassword);
    newContent.appendChild(update);
    content.parentElement.appendChild(newContent);
    content.parentElement.removeChild(content);
}

function updatePassword(e) {
    e.preventDefault()
    const url = '/admin/update'
    const username = document.querySelector('#usernameInput').value
    const password = document.querySelector('#newPassword').value
    let data = {
        username: username,
        password: password
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
            alert('You have changed the password successfully!')
        } 
    }).catch((error) => {
        console.log(error)
    })
}

const logOutButton = document.querySelector('#log_out');
logOutButton.addEventListener('click', logOut);

function logOut(e) {
    e.preventDefault();
    window.location = 'users/logout/'
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
    img.className = 'moviePoster';
    container.appendChild(img);
    com.appendChild(container);

    const commentContent = document.createElement('div');
    commentContent.className = 'messageContent';

    const messageFrom = document.createElement('div');
    const messageFromWho = document.createElement('h3');
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

function storeUser(e) {
    e.preventDefault()
    const storeUsername = e.target.innerText
    localStorage.setItem('username', storeUsername) 
    window.location = '/user_profile'
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