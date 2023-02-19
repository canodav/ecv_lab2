const logged = localStorage.getItem('user');

if(!logged) {
    document.body.setAttribute('data-logged', 'false');

}else{
    document.body.setAttribute('data-logged', 'true');
}

