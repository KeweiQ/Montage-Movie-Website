let sidebarStatus = true

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    sidebarStatus = false
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    sidebarStatus = true
}

function manageNav() {
    if (sidebarStatus) {
        openNav();
    } else {
        closeNav();
    }
}
