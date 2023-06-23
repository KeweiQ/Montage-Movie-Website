'use strict'

const headerContainer = document.querySelector('.headerContainer');
headerContainer.innerHTML = `<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<div id="mySidenav" class="sidenav">
    <a href="/index"><img src="image/main.png" class="sidebar_button" alt="">Main</a>
    <a href="/search"><img src="image/movie.png" class="sidebar_button" alt="">Movies</a>
    <a href="" id="moviesButton"><img src="image/signin.png" class="sidebar_button" alt="">SignIn</a>
    <a href="#"><img src="image/logosmall.png" class="sidebar_button" alt="">AboutUs</a>
</div>

<div class="header">
    <img src="image/menu.png" alt="menu" class="header_content header_left" style="cursor: pointer" onclick="manageNav()">
    <a href="/index">
        <img src="image/logo.png" class="header_content header_left" id="header_logo" alt="">
    </a>
    <a href="/user">
        <img src="image/user.png" class="header_content header_right" alt="">
    </a>
    <img src="image/search.png" class="header_content header_right" id="searchButton" style="cursor: pointer" alt="">
    <input class="header_content header_right" id='header_input' type="text" placeholder="Movie name or id">
</div>`;

(function() {
    'use strict';
    const searchButton = document.querySelector("#searchButton")
    searchButton.addEventListener('click', function() {
        'use strict';
        const searchMovieTitle = document.querySelector("#header_input").value;
        if (searchMovieTitle.includes('/') || searchMovieTitle ==""){
            alert('Invalid input. Please tap in movie ID or title.');
        } else {
            localStorage.setItem('title', searchMovieTitle);
            localStorage.setItem('mode', 'search');
            window.location = '/search';
        }
      });
}());

(function() {
    'use strict';
    const moviesButton = document.querySelector("#moviesButton")
    moviesButton.addEventListener('click', function() {
        localStorage.setItem('mode', 'all');
        window.location = '/search';
    });
}());
