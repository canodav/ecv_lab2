const logout_button = document.querySelector("#logout-button");
logout_button.addEventListener("click", function () {
    localStorage.removeItem("user");
    localStorage.removeItem("room");

    document.body.setAttribute("data-logged", "false");
    location.reload();

});