"use strict"

const log = console.log
const movieId = localStorage.getItem('id')
const postButton = document.querySelector("#commentButton");
postButton.addEventListener('click', addPostComment);

// After we have databse, the comment will be sent to the database and update specific movie's information. 
function addPostComment(e) {
    e.preventDefault();
    const parent = e.target.parentElement.parentElement.parentElement.parentElement;
    const addHere = parent.nextElementSibling;

    // Create DOM element
    const commentBox = document.createElement('div');
    const commentTitleContainer = document.createElement('div');
    const userProfileIMGContainer = document.createElement('div');
    const userName = document.createElement('p');
    const commentContentContainer = document.createElement('p');
    const userProfileImg = document.createElement('img');

    userProfileImg.src = "/image/user.png"
    userProfileImg.className = "userProfileIMG";
    userProfileImg.alt = "user"
    userProfileIMGContainer.className = "userProfileIMGContainer";
    userProfileIMGContainer.appendChild(userProfileImg);

    userName.className = "userName";
    const commentContent = document.querySelector("#commentContent").value;
    const reportButton = document.createElement('button');
    reportButton.className = 'reportButton';
    reportButton.innerText = 'Report';
    reportButton.addEventListener('click', ToReport)
    if (commentContent) {
        commentContentContainer.className = "oCommentContentContainer";
        commentContentContainer.appendChild(document.createTextNode(commentContent));

        // Get the current user's nickname
        const url = '/users/current'
        fetch(url)
        .then(function(res) {
            if (res.status === 200) {
                // If student was added successfully, tell the user.   
                res.json().then(function (result) {
                    console.log(result)
                    userName.appendChild(document.createTextNode(result));
                })
            } 
        }).catch((error) => {
            console.log(error)
        })

        commentTitleContainer.className = "oCommentTitleContainer";
        commentTitleContainer.appendChild(userProfileIMGContainer);
        commentTitleContainer.appendChild(userName);
        commentTitleContainer.appendChild(reportButton);

        commentBox.className = "otherCommentBox";
        commentBox.appendChild(commentTitleContainer);
        commentBox.appendChild(commentContentContainer);

        addHere.appendChild(commentBox);
    }

    // Get name
    const movieId = localStorage.getItem('id')
    const url1 = 'https://api.themoviedb.org/3/movie/' + movieId + '?api_key=1a296faa954277370b2890eac8443422&language=en-US'
    fetch(url1)
    .then((response) => response.json()
    ).then((result) => {
        const url2 = '/users/comment'
        let data = {
            content: commentContent,
            movie: result.title,
            poster: 'https://image.tmdb.org/t/p/w500/' + result.poster_path
        }
        const request = new Request(url2, {
            method: 'post', 
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request)
        .then(function(res) {
            if (res.status === 201) {
                window.location = '/signin'
                alert('You need to log in first')
            }
            if (res.status === 200) {
                // If student was added successfully, tell the user.
                alert('comment has been posted')
            } 
        }).catch((error) => {
            console.log(error)
        })
    }).catch((error) => {
        log(error);
    })
}

const watchTrailor = document.querySelector('#watchTtrailor');
watchTrailor.addEventListener('click', playTrailor);

// This the movie introduction link we hardcoded into the MovieInfo page, 
// It will be substituted by get link from the database operation later. 
function playTrailor(e) {
    e.preventDefault();
    const urlTrailor = "https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=1a296faa954277370b2890eac8443422"
    fetch(urlTrailor)
    .then((response) => response.json()
    ).then((result) => {
        log(result)
        const youtubeURL = "https://www.youtube.com/watch?v=" + result.results[0].key
        window.location = youtubeURL
    }).catch((error) => {
        log(error);
    })
}

document.addEventListener('DOMContentLoaded', function(){
    let stars = document.querySelectorAll(".star");
    stars.forEach(function(star){
        star.addEventListener('click', setRating); 
    });
    
    let rating = parseInt(document.querySelector('.stars').getAttribute('data-rating'));
    let target = stars[rating - 1];
    //target.dispatchEvent(new MouseEvent('click'));
});

// After we have databse, the rating will be sent to the database and update specific movie's information. 
function setRating(ev){
    let span = ev.currentTarget;
    let stars = document.querySelectorAll('.star');
    let match = false;
    let num = 0;
    stars.forEach(function(star, index){
        if(match){
            star.classList.remove('rated');
        }else{
            star.classList.add('rated');
        }
        //are we currently looking at the span that was clicked
        if(star === span){
            match = true;
            num = index + 1;
        }
    });
    document.querySelector('.stars').setAttribute('data-rating', num);
}

const movieTitle = document.querySelector('#movieNameContainer')
movieTitle.innerHTML = `<h1 id="movieName">
    One Movie
</h1>`;

const movieNameChange = document.querySelector('#movieName')
const moviePoster = document.querySelector('#moviePosterImg')
const movieOverview = document.querySelector('#movieOverviewContent')
const body = document.getElementsByTagName('body')[0];
// Movie Information section
const status = document.querySelector('#Status')
const budget = document.querySelector('#Budget')
const language = document.querySelector('#Language')
const genres = document.querySelector('#Genres')
const production = document.querySelector('#Production')
const runtime = document.querySelector('#Runtime')
const releaseDate = document.querySelector('#ReleasedDate')
const popularity = document.querySelector('#Popularity')
const homePage = document.querySelector('#Homepage')

const url = 'https://api.themoviedb.org/3/movie/' + movieId + '?api_key=1a296faa954277370b2890eac8443422&language=en-US'
fetch(url)
    .then((response) => response.json()
    ).then((result) => {
        movieNameChange.innerText = result.title
        moviePoster.src = 'https://image.tmdb.org/t/p/w500/' + result.poster_path
        movieOverview.innerText = result.overview
        status.innerText = result.status
        budget.innerText = result.budget
        language.innerText = result.spoken_languages[0].name
        genres.innerText = result.genres[0].name
        if (result.production_companies.length > 1) {
            production.innerText = result.production_companies[0].name + ", " + result.production_companies[1].name
        } else {
            production.innerText = result.production_companies[0].name
        }
        const aSec = document.createElement('a')
        aSec.href = result.homepage
        const textInA = document.createElement('span')
        textInA.innerText = result.homepage
        textInA.style.color = "white"
        homePage.appendChild(aSec)
        aSec.appendChild(textInA)
        releaseDate.innerText = result.release_date
        runtime.innerText = result.runtime
        popularity.innerText = result.popularity
        if (result.backdrop_path !== null) {
            body.style.background = `url('https://image.tmdb.org/t/p/original${result.backdrop_path}') fixed`;
            body.style['background-size'] = '100% 100%';
            body.style['background-color'] = 'hsla(0,0%,0%,0.60)';
            body.style['background-blend-mode'] = 'overlay';
            body.style['background-repeat'] = 'no-repeat';
        }
    }).catch((error) => {
        log(error);
})

const addCollectionButton = document.querySelector('#addCollectionButton')
addCollectionButton.addEventListener('click', addToCollection)

function addToCollection(e) {
    e.preventDefault()

    // the URL for the request
    const urlServer = '/users/collections';
    const url = 'https://api.themoviedb.org/3/movie/' + movieId + '?api_key=1a296faa954277370b2890eac8443422&language=en-US'
    fetch(url)
        .then((response) => response.json()
        ).then((result) => {
            const data = {
                movieid: result.id,
                name: result.title,
                poster: 'https://image.tmdb.org/t/p/w500/' + result.poster_path
            }
            const request = new Request(urlServer, {
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
                if (res.status === 201) {
                    window.location = '/signin'
                    alert('you need to log in first')
                }
                if (res.status === 200) {
                    // If student was added successfully, tell the user.
                    alert('successfully add the movie into your collection')
                } 
            }).catch((error) => {
                console.log(error)
            })
        }).catch((error) => {
            log(error);
        })
}

const url3 = 'https://api.themoviedb.org/3/movie/' + movieId + '?api_key=1a296faa954277370b2890eac8443422&language=en-US'
fetch(url3)
.then((response) => response.json()
).then((result) => {
    const name = result.title
    const get_comments = '/users/comment'
    fetch(get_comments)
    .then((response) => response.json())
    .then((r) => {
        const toDisplay = r.comments.filter((comment) => comment.movie === name)
        toDisplay.map((comment) => {
            const addHere = document.querySelector('#otherCommentContainer')
        
            // Create DOM element
            const commentBox = document.createElement('div');
            const commentTitleContainer = document.createElement('div');
            const userProfileIMGContainer = document.createElement('div');
            const userName = document.createElement('p');
            const commentContentContainer = document.createElement('p');
            const userProfileImg = document.createElement('img');
        
            userProfileImg.src = "/image/user.png"
            userProfileImg.className = "userProfileIMG";
            userProfileImg.alt = "user"
            userProfileIMGContainer.className = "userProfileIMGContainer";
            userProfileIMGContainer.appendChild(userProfileImg);
        
            userName.className = "userName";
            userName.id = "Jump"
            userName.style = "cursor: pointer"
            const reportButton = document.createElement('button');
            reportButton.className = 'reportButton';
            reportButton.innerText = 'Report';
            reportButton.addEventListener('click', ToReport)
            commentContentContainer.className = "oCommentContentContainer";
            commentContentContainer.appendChild(document.createTextNode(comment.content));

            userName.appendChild(document.createTextNode(comment.nickname));
            userName.addEventListener('click', storeUser)
    
            commentTitleContainer.className = "oCommentTitleContainer";
            commentTitleContainer.appendChild(userProfileIMGContainer);
            commentTitleContainer.appendChild(userName);
            commentTitleContainer.appendChild(reportButton);
    
            commentBox.className = "otherCommentBox";
            commentBox.appendChild(commentTitleContainer);
            commentBox.appendChild(commentContentContainer);
    
            addHere.appendChild(commentBox);
        })
    })
}).catch((error) => {
    log(error)
})

function storeUser(e) {
    e.preventDefault()
    const storeUsername = e.target.innerText
    localStorage.setItem('username', storeUsername) 
    window.location = '/user_profile'
}

function ToReport(e){
    e.preventDefault()
    const url = '/users/reports'
    const Author = e.target.parentElement.firstElementChild.nextSibling.innerText
    const content = e.target.parentElement.nextSibling.innerText
    const url4 = 'https://api.themoviedb.org/3/movie/' + movieId + '?api_key=1a296faa954277370b2890eac8443422&language=en-US'
    fetch(url4)
    .then((response) => response.json()
    ).then((result) => {
        const movie = result.title
        let data = {
            Author: Author,
            content: content,
            movie: movie
        }
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    fetch(request)
        .then(function(res) {
            if (res.status === 201) {
                window.location = '/signin'
                alert('You need to log in first')
            }
            if (res.status === 200) {
                // If student was added successfully, tell the user.
                alert('Your report has been submited')
            } 
        }).catch((error) => {
            console.log(error)
        })
    }).catch((error) => {
        log(error);
    })
}