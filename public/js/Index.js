'use strict'
const log = console.log;

const content = document.querySelector(".content");
content.addEventListener('mouseover', hover);

//var autoScrolling = 0;
//var lastScrollTop = window.pageYOffset || window.scrollTop;
//window.addEventListener('scroll', scrollDirection);

function hover(e) {
    e.preventDefault();

    if (e.target.classList.contains('movie_link')) {
        const movie_link = e.target;
        const yearContainer = movie_link.parentElement.parentElement;
        changeBackdrop(movie_link.id, yearContainer)
    } else if (e.target.classList.contains('movie_link_img_container') || e.target.classList.contains('movie_link_text_container')) {
        const movie_link = e.target.parentElement;
        const yearContainer = movie_link.parentElement.parentElement;
        changeBackdrop(movie_link.id, yearContainer)
    } else if (e.target.classList.contains('movie_link_img') || e.target.classList.contains('movie_link_text')) {
        const movie_link = e.target.parentElement.parentElement;
        const yearContainer = movie_link.parentElement.parentElement;
        changeBackdrop(movie_link.id, yearContainer)
    }
}

function changeBackdrop(movieId, yearContainer) {
    // log(movieId);
    let backdropUrl;
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=33da95ec55c42e5b21c3d72c61fc0fa0&language=en-US`;
    //log(url);
    fetch(url)
        .then((response) => response.json()
        ).then((result) => {
            if (result.backdrop_path == null) {
                yearContainer.lastElementChild.firstElementChild.src = 'image/empty.png';
            } else {
                const backdrop = 'https://image.tmdb.org/t/p/original' + result.backdrop_path;
                yearContainer.lastElementChild.firstElementChild.src = backdrop;
            }
        }).catch((error) => {
            log(error);
        })
}

function addMovie(movieId, movieTitle, movieImg, yearContainer) {
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
        img.src = 'https://image.tmdb.org/t/p/w500/' + movieImg;
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
    
    yearContainer.firstElementChild.appendChild(element);
}

for (let i = 1; i < 11; i++) {
    const year = '#year' + i;
    const yearContainer = document.querySelector(year);
    const url = 'https://api.themoviedb.org/3/movie/popular?include_adult=false&api_key=33da95ec55c42e5b21c3d72c61fc0fa0&page=' + i;
    fetch(url)
        .then((response) => response.json()
        ).then((result) => {
            const movies = result.results;
            changeBackdrop(movies[0].id, yearContainer);
            for (let i = 0; i < 8; i++) {
                const movieId = movies[i].id;
                const movieTitle = movies[i].title;
                const movieImg = movies[i].poster_path;
                addMovie(movieId, movieTitle, movieImg, yearContainer);
            }
        }).catch((error) => {
            log(error);
        })
}

// Unfinished feature

// function scrollDirection(e) {
//     e.preventDefault();

//     if (autoScrolling === 0) {
//         var st = window.pageYOffset || window.scrollTop;
//         if (st > lastScrollTop) { // downscroll
//             autoScrolling = 1;
//             var year_num = Math.floor((window.pageYOffset - 10) / 542.7);
//             if ((year_num + 1) < content.childElementCount) {
//                 const year_id = content.children[year_num + 1].id;
//                 console.log("down");
//                 mScroll(year_id);
//             }
//         } else if (st < lastScrollTop) { // upscroll
//             autoScrolling = 1;
//             var year_num = Math.floor((window.pageYOffset + 10) / 542.7);
//             if (year_num > 0) {
//                 const year_id = content.children[year_num - 1].id;
//                 console.log("up");
//                 mScroll(year_id);
//             } else if (year_num === 0) {
//                 console.log("up");
//                 mScroll("year1");
//             }
//         }
//         lastScrollTop = st <= 0 ? 0 : st;
//     }
// }

// function mScroll(id) {
//     $("html,body").stop(true);
//     $("html,body").animate({scrollTop: $("#"+id).offset().top}, 1000, function() {setTimeout(function(){ autoScrolling = 0; }, 500)});
// }
