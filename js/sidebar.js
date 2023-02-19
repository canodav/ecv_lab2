const sidebar = document.querySelector("#chat-sidebar");
const sidebar_toggle_open = document.querySelector("#sidebar-toggle-button-open");
const sidebar_toggle_close = document.querySelector("#sidebar-toggle-button-close");


sidebar_toggle_open.addEventListener("click", function () {
    sidebar.classList.remove("close");
    sidebar.classList.add("open");
});

sidebar_toggle_close.addEventListener("click", function(){
    sidebar.classList.remove("open");
    sidebar.classList.add("close");
})