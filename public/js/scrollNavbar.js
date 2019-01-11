let $header = document.getElementById('header')
let $moviesContainer = document.getElementById('moviesContainer')

window.addEventListener('scroll', (e) => {

    if(window.scrollY >= $moviesContainer.offsetTop) {
        $header.classList.add('scroll')
    }else{
        $header.classList.remove('scroll')
    }

})
