async function searchDestination(){

    // wait for home html to load in
    let homeLoaded = await loadHome();
    var destinationSearch = document.getElementById("dest_search").value.toLowerCase();
    produceRecommendations(destinationSearch);    
}

function produceRecommendations(search){
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
                
                //let destinationTime = ct.getTimeZone(destination.name);
                //console.log(destinationTime);//displayTime(destination.name);
                destinationTime = "14:00";
                let titleConfig = getTitle(destination.name);
                
                contentDiv.innerHTML += getHTML(destination);                                     

                                        
                                    });
        }
    })
    .catch(error => "Cannot access JSON");

}

function getCountryData(){
    //FIX!!!!!!!!!!!!!!!!!!!!!!!!!!
}

function getHTML(destination){
    let htmlString =`<h2 class="accordion-header recommendation">
                                        <button class="accordion-button rounded collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${destination.id}" aria-expanded="false" aria-controls=${destination.id}>
                                            <h3>
                                              ${titleConfig[0]}
                                              <small class="text-body-secondary">${titleConfig[1]}</small>
                                            </h3>
                                        </button>
                                        </h2>
                                        <div id=${destination.id} class="accordion-collapse collapse" data-bs-parent="#recommend_list">
                                            <div class="accordion-body">
                                                <img class="imageUrl rounded" src="${destination.imageUrl}">
                                                ${destination.description} <br />
                                                <em>Local Time: ${destinationTime}</em>
                                            </div>
                                        </div>`
    return htmlString;
}

function getTitle(name){
    if (name.includes(",")){
        return name.split(",");
    } else {
        return [name, ""];
    }
}

function getLocalTime(){}

function displayTime(countryName){
    const options = { timeZone: countryName, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const countryTime = new Date().toLocaleTimeString('en-US', options);
    console.log(`Current time in ${countryName}:`, countryTime);
}

function clearHighlighted(){

    var keywords = document.querySelectorAll(".keyword");
    keywords.forEach(keyword => {
        keyword.style["font-weight"]="";
    });
}

function clearSearch(){
    // Clear recommendations
    let recommendations = document.getElementById("recommendations");
    recommendations.style.visibility="hidden";

    clearHighlighted();
}

function togglePopup(popupId){
    var popup = document.getElementById(popupId);
    if (popup.style.visibility == 'visible'){
        popup.style.visibility = 'hidden';
    } else {
        popup.style.visibility = 'visible';
    }
}

async function loadContent(pageURL){
    let getContnet = await fetch(pageURL)
    .then(response => response.text())
    .then(text => {
            let contentDiv = document.getElementById("main_content");
                contentDiv.innerHTML = text;
        });

    // re-initialise any popovers in the html
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
}

function loadHome(){
    loadContent("../Templates/home.html");
}

// event listeners for navigation tab
$(document).on("click", "#home", function(){loadContent("../Templates/home.html")});
$(document).on("click", "#about_us", function(){loadContent("../Templates/about_us.html")});
$(document).on("click", "#contact_us", function(){loadContent("../Templates/contact_us.html")});


// event listeners for recommendations via homepage

// beach
$(document).on("click", "#beach", function(){
    produceRecommendations("beaches");
    clearHighlighted();
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

// temples

$(document).on("click", "#culture", function(){
    produceRecommendations("temples");
    clearHighlighted();
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

// cities

$(document).on("click", "#country", function(){
    produceRecommendations("countries");
    clearHighlighted();
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

    //countries also only has a description for cities so another depth in