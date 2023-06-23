'use strict'
const log = console.log;

const allMovies = document.querySelector("#all_movies");
const searchResult = document.querySelector("#search_result");
let movieListContainer = document.querySelector("#movie_list_container");
let searchResultContainer = document.querySelector("#search_result_container");

searchResult.firstElementChild.addEventListener('click', changeToResult);
allMovies.firstElementChild.addEventListener('click', showAll);

function changeToResult() {
    movieListContainer.innerHTML = searchResultContainer.innerHTML;

    const movies = movieListContainer.children;
    const movieNum = movies.length;
    for (let i = 0; i < movieNum; i++) {
        const movieLink = movies[i];
        (function() {
            'use strict'
            movieLink.addEventListener('click', function() {
                const id = movieLink.id;        
                localStorage.setItem('id', id);
                window.location = '/movieinfo';
            });
        }())
    }

    localStorage.setItem('mode', 'search');
    searchResult.style.background = 'rgba(0, 0, 0, .5)';
    allMovies.style.background = 'rgba(0, 0, 0, .0)';
}

function showAll() {
    localStorage.setItem('mode', 'all');
    searchResult.style.background = 'rgba(0, 0, 0, .0)';
    allMovies.style.background = 'rgba(0, 0, 0, .5)';
}

function addMovie(movieId, movieTitle, movieImg) {
    const element = document.createElement('div');
    element.id = movieId;
    element.className = 'movie_link';
    element.innerHTML = `<div class="movie_link_img_container">
        <img src="image/empty.png" class="movie_link_img" alt="">
    </div>
    <div class="movie_link_text_container">
        <p class="movie_link_text">One movie</p>
    </div>`;
    
    const img = element.firstElementChild.firstElementChild;
    if (movieImg === null) {
        img.src = 'image/empty.png';
    } else {
        img.src = 'http://image.tmdb.org/t/p/w500/' + movieImg;
    }

    const name = element.lastElementChild.firstElementChild;
    name.innerText = movieTitle;

    (function() {
        'use strict'
        element.addEventListener('click', function() {
            const id = element.id;        
            localStorage.setItem('id', id);
            window.location = '/movieinfo';
        });
    }())
    
    movieListContainer.appendChild(element);
    if (mode === 'search') {
        searchResultContainer.appendChild(element);
    }
}

const mode = localStorage.getItem('mode');
if (mode === 'search') {
    const searchMovieTitle = localStorage.getItem('title');
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=33da95ec55c42e5b21c3d72c61fc0fa0&language=en-US&query=' + searchMovieTitle;
    fetch(url)
        .then((response) => response.json()
        ).then((result) => {
            const movies = result.results;
            const length = movies.length;
            for (let i = 0; i < length; i++) {
                const movieId = movies[i].id;
                const movieTitle = movies[i].title;
                const movieImg = movies[i].poster_path;
                addMovie(movieId, movieTitle, movieImg);
            }
            changeToResult();
        }).catch((error) => {
            log(error);
        })
}

if (mode === 'all') {
    for (let i = 1; i < 50; i++) {
        const url = 'https://api.themoviedb.org/3/movie/popular?api_key=33da95ec55c42e5b21c3d72c61fc0fa0&page=' + 'i';
        fetch(url)
            .then((response) => response.json()
            ).then((result) => {
                const movies = result.results;
                const length = movies.length;
                
                for (let i = 0; i < length; i++) {
                    const movieId = movies[i].id;
                    const movieTitle = movies[i].title;
                    const movieImg = movies[i].poster_path;
                    addMovie(movieId, movieTitle, movieImg);
                }
            }).catch((error) => {
                log(error);
            })
    }
}
