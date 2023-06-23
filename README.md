# team45
# CSC309 Project Phase1

# Process to start our project
 - Open Google Chrome.
 
 - Under `File` in tool bar, choose `Open File` and open `Index.html`. This is our starting page.
 
 - Aftering loading the `Index.html`, you can see a header at the top of the webpage. It contains (from left to right) a sidebar       `menu`,  `Montage` logo, `Search` button, and `log-in` button. Press the `menu` logo (leftmost), you can      see the whole sidebar and press the logo again to close it. We will go through all of these buttons below.
 
 - Before going to other pages, let's see the content of this page first. You can see that this page is pretty long   with several views, as we are planing to make each year a single view with 5 hottest movies of this year on   it.
 
 - Use mouse to hover over different `movies` of each year, the background of each view would change to the      hovered movie.

 # Now we are going to introduce all buttons on this page and the sidebar.
 - By pressing `Montage` logo or `Main` in sidebar `menu` at any pages of our project, you will go to `Index.html`    page.
 - By pressing `Movies` in sidebar `menu` or `Search` button, you will go to `Search.html`.

    # Search.html
    - This page has a form with 2 fields, `All movies` and `Search Result`. The search function does not           actually work for now, we will implement it in phase2 because we don't store anything locally in phase1.
    - By pressing any movie on this page, you will go to `MovieInfo.html`.
        # MovieInfo.html
        - This page contains all detailed information for a movie. As we only hardcode the datas in phase1, all       movies for now have the same `MovieInfo` page.

        - The `watch trailor` button will link to its trailor website and `add collection` button will add 
          this movie into current user's collection.

        - Below movie's info, we have all comments from users. You can rate and post a comment in the given 
          input box.

 - By pressing `log-in` logo on the rightmost side of header or `SignIn` in `menu`, you will go to the logo in   page `SignIn.html`.
    # SignIn.html
    - For new users, press `Sign Up` to register an new account.
    - For normal user and administrator, here are instructions for them separately.
    # Administrator
    - Input `admin` as username and password, press `Sign in`.
    - Now you are in `AdminMain.html` page.
    - At the top of webpage, it is a banner containing admin's name, profile picture and description. 
    - User can update and upload his profile picture by clicking the `Upload` button in the profile picture.
    - Below, as we wrote in project proposal, admin has 4 functionalities.
    
        (1) Message: This block shows messages sent to the current user. To reply message, click the name (In this page, it would be `User 2`). This will lead you to a new page `UserProfile.html`. And it would be the profile page for `User 2` in this case.
        # UserProfile
            - Banner part contains the same content as before
            - Below we have `Collection`, `Comments`, `Send Message` blocks
                (a) Collection: Show all the collections of this user.
                (b) Comments: Show all the past comments made by this user
                (c) Send Message: Send a message to him.
            - Now log in as `admin` and go back to `AdminMain.html` again
        (2) Reports: Admin has right to handle reports from normal users, each report would show the reporter's name and detailed information of the reported message. Admin can choose to `Ignore` this report or `Delete` this comment. 

        (3) Users: A form of all users, admin can check their profile and `delete` any user's account if he is doing something not allowed.

        (4) Password: Assign new password to user with input username. If admin wants to change his own password, just simply input his username in `username`. (Since it is an admin account, we dont need the old password.)

    - Press the `LOG OUT` button on the right side of banner

    # Normal User
    - Input `user` as username and password, press `Sign in`.
    - Now you are in `UserMain.html` page.
    - Banner contains the same information as before.
    - Below, normal user has 4 functionalities as well, but different from admin's.
    
        (1) Message: This is exactly same with the `Message` part of admin's.

        (2) Comments: Show all the past comments made by this user.

        (3) Collection: Show all the movies that are collected by this user.
        (Comments and Collection are also in profile page since they are public to all.)

        (4) Update: User can change his own username and password. If user only wants to change one of them, just leave the other one blank.





