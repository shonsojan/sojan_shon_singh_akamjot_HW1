(() => {

    const characterBox = document.querySelector("#character-box");
    const reviewTemplate = document.querySelector("#review-template");
    const reviewCon = document.querySelector("#review-con");
    const baseUrl = `https://swapi.dev/api`;

    function getMovies() {

        fetch(`${baseUrl}?people`)
        .then(response => response.json())
        .then(function(response) {
            console.log(response);
            const movies = response.description;
            const ul = document.createElement("ul");
            movies.forEach(movie => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.textContent = movie["#name"];
                a.dataset.review = movie["#IMDB_ID"];
                li.appendChild(a);
                ul.appendChild(li);
            })
            characterBox.appendChild(ul);
        })
        .then(function() {
            const links = document.querySelectorAll("#movie-box li a");
            links.forEach(function(link){
                link.addEventListener("click", getReview) 
                    
                })
            })
   
        .catch(function(err) {
            console.log(err);
        })
    }

    function getReview(e) {
        // console.log("Review called");
        // console.log(e.currentTarget.dataset.review);
        const reviewID = e.currentTarget.dataset.review;

        fetch(`${baseUrl}?tt=${reviewID}`)
        .then(response => response.json())
        .then(function(response) {
            console.log(response.short.review.reviewBody);
            reviewCon.innerHTML = "";
            const clone = reviewTemplate.content.cloneNode(true);
            const reviewDescription = clone.querySelector(".review-description");
            reviewDescription.innerHTML = response.short.review.reviewBody;
            reviewCon.appendChild(clone);   
        })
        .catch(function(err) {
            reviewCon.innerHTML = "No review for this movie";
        })
    }
    getMovies();


})();
