(() => {

    const characterBox = document.querySelector("#character-box");
    const reviewTemplate = document.querySelector("#review-template");
    const reviewCon = document.querySelector("#review-con");
    const baseUrl = `https://swapi.dev/api`;



   
    function getMoviePoster(episodeId) {
    
        const posters = {
            1: "images/ep1.jpg", 
            2: "images/ep2.jpg",
            3: "images/ep3.jpg",
            4: "images/ep4.jpg",
            5: "images/ep5.jpg",
            6: "images/ep6.jpg",

        };

        return posters[episodeId] || "images/no-poster.jpg"; 
    }

    function getPeople() {
        fetch(`${baseUrl}/people/`)  
            .then(response => response.json())
            .then(function(response) {
                console.log(response);
                const people = response.results;  
                const ul = document.createElement("ul");

                people.forEach(person => {
                    const li = document.createElement("li"); 
                    const a = document.createElement("a");                    
                    a.textContent = person.name; 
                    a.dataset.characterUrl = person.url;  
                    li.appendChild(a);
                    ul.appendChild(li);
                });

                characterBox.appendChild(ul);

                // Add event listeners to links
                const links = document.querySelectorAll("#character-box li a");
                links.forEach(link => {
                    link.addEventListener("click", getCharacterMovies);
                });
            })
            .catch(function(err) {
                console.error("Error fetching people:", err);
                characterBox.innerHTML = "Failed to load characters.";
            });
    }

    function getCharacterMovies(e) {
        e.preventDefault();

        const characterUrl = e.currentTarget.dataset.characterUrl;
        
        reviewCon.innerHTML = `Fetching movies...`;

        fetch(characterUrl)
            .then(response => response.json())
            .then(function(response) {
                console.log("Character movies:", response.films);

                // I saw this way of fetching the exact information needed using promise constructor on youtube i dont know if you like it or allow it.
                
                if (!response.films.length) {
                    reviewCon.innerHTML = "No movies found for this character.";
                    return;
                }

                const moviePromises = response.films.map(filmUrl => fetch(filmUrl).then(res => res.json()));

                Promise.all(moviePromises)
                    .then(movies => {
                        reviewCon.innerHTML = "";
                        const clone = reviewTemplate.content.cloneNode(true);
                        const reviewDescription = clone.querySelector(".review-description");

                        let movieList = `<ul>`;
                        movies.forEach(movie => {
                            // Get the movie poster based on episode_id
                            const poster = getMoviePoster(movie.episode_id);

                            movieList += `
                                <li>
                                    <img src="${poster}" alt="${movie.title} Poster" width="100"> 
                                    ${movie.title} (Episode ${movie.episode_id})
                                </li>
                            `;
                        });
                        movieList += `</ul>`;

                        reviewDescription.innerHTML = movieList;
                        reviewCon.appendChild(clone);
                    })
                    .catch(err => {
                        reviewCon.innerHTML = "Error fetching movie details.";
                        console.error("Error fetching movies:", err);
                    });
            })
            .catch(function(err) {
                reviewCon.innerHTML = "No movies available for this character.";
                console.error("Error fetching character details:", err);
            });
    }

    getPeople(); 

})();
