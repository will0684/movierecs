// DOMContentLoaded listener
// get image config info with fetch

// handle results - build a list of movies

// new movie content has click listeners
// click movie to do a fetch for recommended
// with recommmended results back 
// navigate to recommended page
// build and display the list of movie recommendations

let app = {
  URL: 'https://api.themoviedb.org/3/',
  imgURL: '',
  init: function(){
    // focus on the text field
    let input = document.getElementById('search-input');
    input.focus();
    setTimeout(app.addHandlers, 1000);
  },
  addHandlers: function(){
    // add the click listener
    let btn = document.getElementById('search-button');
    btn.addEventListener('click', app.runSearch);
    let backbtn = document.getElementById('back-button');
    backbtn.addEventListener('click', function(){
      document.getElementById('search-results').classList.remove('active');
      document.getElementById('recommend-results').classList.remove('active');
      document.getElementById('search-input').value = '';
      document.getElementById('search-bar').classList.add('home');
      document.getElementById('attribution').classList.remove('not');
    })
    // add a listener for <ENTER>
    window.addEventListener('keypress', function(ev){
      let char = ev.char || ev.charCode || ev.which;
      if(char == 10 || char == 13){
        // we have enter or return key
        btn.dispatchEvent(new MouseEvent('click'));
      }
    });
  },
  runSearch: function(ev){
    ev.preventDefault();
    document.getElementById('search-bar').classList.remove('home');
    let input = document.getElementById('search-input');
    if(input.value){
      // code will not run if empty string
      let url = app.URL + 'search/movie?api_key=' + KEY + '&query=' + input.value;
      fetch(url)
      .then(response => response.json())
      .then(data => {console.log(data);
        app.showMovies(data);
      })
      .catch(err => {console.log(err);
      })
    }
  },
  showMovies: function(movies){
    document.getElementById('search-results').classList.add('active');
    document.getElementById('search-input').classList.add('results');
    let container = document.querySelector('#search-results .content');
    container.innerHTML = "";
    let df = document.createDocumentFragment();
    container.innerHTML = '';
    movies.results.forEach(function(movie){
      let div = document.createElement('div');
      let title = document.createElement('h2');
      let poster = document.createElement('img');
      let desc = document.createElement('p');
      let recmnd = document.createElement('div');
      let id = movie.id;
      title.textContent = movie.title;
      desc.textContent = movie.overview;
      poster.src = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
      div.appendChild(poster);
      div.appendChild(title);
      div.appendChild(desc);
      div.appendChild(recmnd);
      recmnd.textContent = 'View Similar Films';
      div.classList.add('movie');
      desc.classList.add('movie-desc');
      poster.classList.add('poster')
      recmnd.classList.add('recommendbtn');
      df.appendChild(div);
      // if similar movies button is clicked
      recmnd.addEventListener('click', function(){
          let url = app.URL + 'movie/' + id + '/recommendations?api_key=' + KEY + '&language=en-US&page=1';
          fetch(url)
          .then(response => response.json())
          .then(data => {
            let rec = data;
            rec.results.forEach(function(movie){
              let container = document.querySelector('#recommend-results .content');
              container.innerHTML = "";
              let df = document.createDocumentFragment();
              let div = document.createElement('div');
              let title = document.createElement('h2');
              let poster = document.createElement('img');
              let desc = document.createElement('p');
              let rev = document.createElement('a');
              let id = movie.id;
              app.getReviews(id)
              .then(revurl =>{
                console.log(revurl);
                title.textContent = movie.title;
                desc.textContent = movie.overview;
                rev.textContent = 'Read Review';
                rev.setAttribute('href', revurl)
                poster.src = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
                div.appendChild(poster);
                div.appendChild(title);
                div.appendChild(desc);
                div.appendChild(rev);
                div.classList.add('movie');
                desc.classList.add('movie-desc');
                poster.classList.add('poster')
                df.appendChild(div);
                container.appendChild(df);
                container.appendChild(df);
              })
            })
            document.getElementById('search-results'). classList.remove('active');
            document.getElementById('recommend-results'). classList.add('active');
          })
          .catch(err => {console.log(err);
          })

      });
    });
    container.appendChild(df);
  },
  getReviews: function(id){
    let url = app.URL + 'movie/' + id + '/reviews?api_key=' + KEY;
    return fetch(url)
           .then(response => response.json())
  }
};

document.addEventListener('DOMContentLoaded', app.init);