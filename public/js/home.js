const URL = `https://yts.am/api/v2/list_movies.json`


let $actionListContainer = document.getElementById('actionList')
let $dramaListContainer = document.getElementById('dramaList')
let $animationListContainer = document.getElementById('animationList')

// Buscar una Película
const getMovie = async (url, title) => {

        let response = await fetch(`${url}?query_term=${title}`)
        let {data: {movies: [movie]}} = await response.json()
    
        return movie
}


let actionList, dramaList, animationList
// Get Peliculas por género
const getMoviesforGenre = async (url) => {

    let responseActionList = await fetch(`${url}?genre=action`);
    console.log(responseActionList);
    ({data: {movies: actionList}} = await responseActionList.json());

    let responseDramaList = await fetch(`${url}?genre=drama`);
    ({data: {movies: dramaList}} = await responseDramaList.json());

    let responseAnimationList = await fetch(`${url}?genre=animation`);
    ({data: {movies: animationList}} = await responseAnimationList.json());

    return Promise.all([actionList, dramaList, animationList])

}


let inicializeDom = () => {

    // Movie Element
    let $movieItem = document.getElementsByClassName('movieItem')

    // === Modal Events
    ModalEvents()
    // Search Movie Events
    SearchMovieEvents()
 
}

function ModalEvents () {

    let $modal = document.getElementById('modal')
    let $wrapper = document.getElementById('wrapper')
    let $btnShow = document.getElementsByClassName('btn-show')
    let $btnHide = ''

    for(let $elBtn of $btnShow){
        
        $elBtn.addEventListener('mouseenter', (e) => {
            $elBtn.parentElement.classList.add('focusMovie')
        })

        $elBtn.addEventListener('mouseleave', (e) => {
            $elBtn.parentElement.classList.remove('focusMovie')
        })

        $elBtn.addEventListener('click', (e) => {
            let movieParent = $elBtn.parentElement
            $modal.innerHTML = modalTemplate(movieParent)

            $modal.style.animation = 'fadeIn .5s'
            $modal.style.display = 'flex'
            $wrapper.style.animation = 'fadeIn .5s'
            $wrapper.style.display = 'block'   
            
            $btnHide = document.getElementById('btn-hide')

            $btnHide.addEventListener('click', (e) => {
                $modal.style.animation = 'fadeOut .3s'
                $modal.style.display = 'none'
                $wrapper.style.animation = 'fadeOut .3s'
                $wrapper.style.display = 'none'                
            })
        })    
    }
}

function SearchMovieEvents () {

    let $btnSearch = document.getElementById('btn-search')
    let $searchForm = document.getElementById('search-form')
    let $searchBox = document.getElementById('search-box')
    
    // Movie find
    let $wantedContainer = document.getElementById('wantedContainer')

    let $btnWatch = document.getElementById('btn-watch')
    let $btnWatchLeave = ''

    $searchForm.addEventListener('submit', (e) => {
        e.preventDefault()
    })

    $btnSearch.addEventListener('click', (e) => {

        let movieName = $searchBox.value

        console.log(movieName);

        getMovie(URL, movieName)
            .then(movie => {

                $wantedContainer.innerHTML = wantedTemplate(movie, $wantedContainer)
                $wantedContainer.style.animation = 'moveIn 1s forwards'    

                $btnWatchLeave = document.getElementById('btn-watchleave')
                $btnWatchLeave.addEventListener('click', (e) => {
                    $wantedContainer.style.animation = 'moveOut 1s forwards'
                })  
            

            })
            .catch(err => {
                console.log(err);
                $wantedContainer.innerHTML = wantedTemplate(null, $wantedContainer)
                $wantedContainer.style.animation = 'moveIn 1s forwards'    

                $btnWatchLeave = document.getElementById('btn-watchleave')
                $btnWatchLeave.addEventListener('click', (e) => {
                    $wantedContainer.style.animation = 'moveOut 1s forwards'
                })  
            })
   
    })


}


// TEMPLATES

let modalTemplate = (movie) => {

    let id = movie.dataset.id
    let category = movie.dataset.category

    let movieFind = findMovie(id, category)
    console.log(movieFind);

    return `
        <div class="imageContainer">
            <img src="${movieFind.medium_cover_image}" alt="">
        </div>
        <div class="infoContainer">
            <h3 class="title">${movieFind.title}</h3>
            <p class="description">${movieFind.summary}</p>
            <button id="btn-hide">Cerrar</button>
        </div>
    `
}

let findMovie = (id, category) => {

    switch (category) {

        case 'action': {
            return actionList.find(movie => movie.id == id)
        }

        case 'drama': {
            return dramaList.find(movie => movie.id == id)
        }

        case 'animation': {
            return animationList.find(movie => movie.id == id)
        }
    }
}

let wantedTemplate = (movie, $container) => {

    if( movie ){
        $container.style.background = `url(${movie.large_cover_image})`
        $container.style.backgroundSize = `cover`
        $container.style.backgroundPosition = `center`

        return `
            <div class="infoContainer">
                <h3 class="title">${movie.title}</h3>
                <div class="buttons">
                    <button id="btn-watch">Ver ahora</button>
                    <button id="btn-watchleave"><i class="fas fa-arrow-circle-up"></i></button>
                </div>
            </div> 
        `
    }

    else{
        $container.style.background = `#ff3232`
        return `
                <div class="infoContainer">
                    <h3 class="title">No sé encontró la película</h3>
                    <div class="buttons">
                        <button id="btn-watch">Ver más películas</button>
                        <button id="btn-watchleave"><i class="fas fa-arrow-circle-up"></i></button>
                    </div>
                </div>     
        `
    }


}

let movieTemplate = (movie, category) => {
    return `<div class="movieItem" data-category="${category}" data-id="${movie.id}">
                <img src="${movie.medium_cover_image}" alt="">
                <div class="info">
                    <h3 class="title">${movie.title}</h3>
                    <p class="genres">${movieGenres(movie)}</p>
                </div>
                <button class="btn-show">Ver ahora</button>
            </div>`
}

let movieGenres = (movie) => {
    let HTMLgenre = ''
    movie.genres.forEach(genre => {
        HTMLgenre += `<span>${genre}</span>`
    })

    return HTMLgenre
}

// Renderizar películas
let renderMovies = (listMovies) => {

    let HTMLAction = ''
    let HTMLDrama = ''
    let HTMLAnimation = ''

    listMovies[0].forEach(movie => {
        HTMLAction += movieTemplate(movie, 'action')
    })

    $actionListContainer.innerHTML = HTMLAction
    
    listMovies[1].forEach(movie => {
        HTMLDrama += movieTemplate(movie, 'drama')
    })
    
    $dramaListContainer.innerHTML = HTMLDrama

    listMovies[2].forEach(movie => {
        HTMLAnimation += movieTemplate(movie, 'animation')
    })

    $animationListContainer.innerHTML = HTMLAnimation
}

getMoviesforGenre(URL)
    .then(res => {
        renderMovies(res)
        inicializeDom()    
    }) 
    .catch(err => {
        console.log(err);
    })
