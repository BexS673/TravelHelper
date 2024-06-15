/**
 * Search function.
 */
function searchDestination() {

    let homeLoaded = loadHome();
    var destinationSearch = document.getElementById("dest_search").value.toLowerCase();
    produceRecommendations(destinationSearch); 
}

/**
 * This function updates the page to show the recommendations based on the user's search.
 * @param {String} search seach value
 */
function produceRecommendations(search) {

    // make this async function?????
    fetch("../travel_recommendations.json")
    .then(response => {
        return response.json();
     })
    .then(data => {
        var destinations = data;        

        // Must first check that the input is valid
        if (!Object.keys(destinations).includes(search)) {
            togglePopup("invalid_search_popup");
        } else {

            let recommendationList = document.getElementById("recommendations");
            recommendationList.style.visibility = "visible";

            let destinationResults = destinations[search];
            let contentDiv = document.getElementById("recommend_list");            
            contentDiv.innerHTML = "";

            // add to the html each of the recommendations from the returned results
            destinationResults.forEach(destination => {                                
                // 
                getHTML(search, destination);    
            });
        }
    })
    .catch(error => "Cannot access JSON");

}

/**
 * Insert the HTML into page for each destination of the search result
 * @param {String} searchResult search value
 * @param {any} destination element in array of search object
 */
function getHTML(searchResult, destination) {

    function getTitle(name) {
        if (name.includes(",")) {
            return name.split(",");
        } else {
            return [name, ""];
        }
    }

    let titleConfig = getTitle(destination.name);
    destinationTime = "14:00";

    // HTML accordion item and add to the recommend list
    let htmlString = `<h2 class="accordion-header recommendation">
                        <button class="accordion-button rounded collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${destination.id}" aria-expanded="false" aria-controls=${destination.id}>
                            <h3>
                                ${titleConfig[0]}
                                <small class="text-body-secondary">${titleConfig[1]}</small>
                            </h3>
                        </button>
                      </h2>
                     <div id="${destination.id}" class="accordion-collapse collapse" data-bs-parent="#recommend_list">
                        <div class="accordion-body" id="${destination.id}_body">
                        </div>
                     </div>`;

    let contentDiv = document.getElementById("recommend_list");
    contentDiv.innerHTML += htmlString;

    // Get the HTML for the accordion item's body, depending on the search type
    let htmlBody = "";
    var bodyElement = document.getElementById(`${destination.id}_body`);

    if (searchResult != "countries") {
        htmlBody += `<div class="card">
                      <img src="${destination.imageUrl}" class="card-img-top" alt="">
                      <div class="card-body">
                        <p class="card-text">${destination.description}</p>
                      </div>
                    </div>`;
        bodyElement.innerHTML = htmlBody;
                        
    } else {   

        bodyElement.innerHTML = `<ul id="${destination.id}_card_list"></ul>`;
        var cardList = document.getElementById(`${destination.id}_card_list`);

        destination.cities.forEach(city => {
            
            htmlBody = `<li><div class="card" style="width: 18rem;">
                          <img src="${city.imageUrl}" class="card-img-top" alt="...">
                          <div class="card-body">
                          <h5 class="card-title">${city.name}</h5>
                            <p class="card-text">${city.description}</p>
                          </div>
                        </div></li>`;             
            cardList.innerHTML += htmlBody;
        });        
    }
        
}

/**
 * Clear the recommendations from the page.
 */
function clearSearch(){
    // Clear recommendations

    // FIX: when cards are open, the bars close first and leave the cards...
    let recommendations = document.getElementById("recommendations");
    recommendations.style.visibility="hidden";
}

/**
 * 
 * @param {String} pageURL HTML page to fetch HTML content from to update the main content of the page
 */
async function loadContent(pageURL){
    let getContent = await fetch(pageURL)
    .then(response => response.text())
    .then(text => {
            let contentDiv = document.getElementById("main_content");
                contentDiv.innerHTML = text;
        });

    // re-initialise any popovers in the updated HTML
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
}

function loadHome(){
    loadContent("../Templates/home.html");
}


//****************************** EVENT LISTENERS ****************************************/

/**
 * Event listeners for updating the page content from the navigation page.
 */
$(document).on("click", "#home", function(){loadContent("../Templates/home.html")});
$(document).on("click", "#about_us", function(){loadContent("../Templates/about_us.html")});
$(document).on("click", "#contact_us", function(){loadContent("../Templates/contact_us.html")});

/**
 * Event listeners for user interaction with the beach search
 */
$(document).on("click", "#beach", function(){
    produceRecommendations("beaches");
    document.getElementById("beach").style["font-weight"] = "bolder";
    });

$(document).on("mouseover", "#beach", function(){
    const popover = bootstrap.Popover.getOrCreateInstance('#beach');
    popover.show();
});

$(document).on("mouseout", "#beach", function(){
    const popover = bootstrap.Popover.getOrCreateInstance('#beach');
    popover.hide();   
});

/**
 * Event listeners for user interaction with the temple search
 */
$(document).on("click", "#culture", function(){
    produceRecommendations("temples");
    document.getElementById("culture").style["font-weight"] = "bolder";
    });

$(document).on("mouseover", "#culture", function(){
    const popover = bootstrap.Popover.getOrCreateInstance('#culture');
    popover.show();
});

$(document).on("mouseout", "#culture", function(){
    const popover = bootstrap.Popover.getOrCreateInstance('#culture');
    popover.hide();
});

/**
 * Event listeners for user interaction with the country search
 */
$(document).on("click", "#country", function(){
    produceRecommendations("countries");
    document.getElementById("country").style["font-weight"] = "bolder";
    });

$(document).on("mouseover", "#country", function(){
    const popover = bootstrap.Popover.getOrCreateInstance('#country');
    popover.show();
});

$(document).on("mouseout", "#country", function(){
    const popover = bootstrap.Popover.getOrCreateInstance('#country');
    popover.hide();
});



    //to do:

    //The search button isn't working anymore!'
    //appears then disappears....





function togglePopup(popupId) {
    var popup = document.getElementById(popupId);
    if (popup.style.visibility == 'visible') {
        popup.style.visibility = 'hidden';
    } else {
        popup.style.visibility = 'visible';
    }
}