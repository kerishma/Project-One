const proxyurl = "https://cors-anywhere.herokuapp.com/";

let userLocation;

$(document).ready(function () {
  getUserLocation();
});

function buildQueryURL(term, lat, lon) {

    $("#rCards").empty()

    // We have to pass a proxy URL for the Yelp API because we are using Vanilla
    // Javascript; by not having a middleware we cannot call the API properly
    // and satisfy their requirement, so we need to use a proxy; CORS;
    //query URL goes here but don't know which site we'll get data from yet
    const queryURL = proxyurl + "https://api.yelp.com/v3/businesses/search?";

    // Set the API key....need the api key lol
    const queryParams = {
        "term": term,
        "latitude": lat,
        "longitude": lon
    };

    // Logging the URL so we have access to it for troubleshooting....took this part from the NYT example i think it'll be useful?
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    // return queryURL + $.param(queryParams);
    return queryURL + $.param(queryParams);
}

// .on("click") function associated with the Search Button
$("#submit-btn").click(function (event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();

    let searchBar = $('#search-bar').val();
    if (!searchBar) {
        $("#search-bar").attr("placeholder", "I SAID, Search For Foods!...");
        return;
    }
    console.log(searchBar);

    getYelpData(userLocation);

    
    

});

$("#randomBtn").click(function (event) {
  // this code is for the 'surprise me!' button
    event.preventDefault();


});


function createRestaurantCards(data) {
    let places = data.businesses;


    for (let i = 0; i < places.length; i++) {
        let defaultUnknown = "Not Confirmed";
        let cardDeck = $("<div class='card-deck'></div>");
        let card = $("<div class='card mb-3'></div>");
        let cardRow = $("<div class='row no-gutters'></div>");
        let cardImgCol = $("<div class='col'></div>");
        let yelpUrl = places[i].url
        let yelpImg = $(`<a href=${yelpUrl} target="_blank"> <img class='card-img img-fluid' src=${places[i].image_url}></a>`);
        let cardColBody = $("<div class='col-md-8'></div>");
        let cardBody = $("<div class='card-body'>");
        let cardH = $("<h5 class='card-title'></h5>").text(places[i].name);
        let rating = $("<p class='card-text'></p>").text(`Rating: ${places[i].rating}`);
        if (places[i].price) {
          defaultUnknown = places[i].price  
        }
        let price = $("<p class='card-text'></p>").text(`Price: ${defaultUnknown}`)
        let takeout = $("<p class='card-text'></p>").text(`Takeout: ${places[i].transactions}`);
        if (places[i].phone) {
            defaultUnknown = places[i].phone 
        }
        let phoneNum = $("<p class='card-text'></p>").text(`Phone: ${places[i].phone}`);


        card.css("max-width", "540px");
        cardImgCol.append(yelpImg);
        cardBody.append(cardH, rating, price, takeout, phoneNum);
        cardColBody.append(cardBody);
        cardRow.append(cardImgCol, cardColBody)
        card.append(cardRow);
        cardDeck.append(card)
        $("#rCards").append(cardDeck);
    }
    }



// We are asking the user for their location as soon as the HTML page loads
// that way we can show them restaurants close to their location
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition(position) {
  userLocation = position.coords;
}

function getYelpData(data) {

    let lat = data.latitude
    let lon = data.longitude
    let term = $("#search-bar").val()
    // Build the query URL for the ajax request to the NYT API
    const queryURL = buildQueryURL(term, lat, lon);

    $.ajax({
        url: queryURL + "&categories=restaurants",
        headers: {
            'Content-Type': 'application/json',
            "x-requested-with": "xmlhttprequest",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${config.apiKey}`,
        },
        crossDomain: true,
        method: "GET",
        success: function (result) {
            createRestaurantCards(result)
            console.log(result);
        },
        error: function (error) {
            // console.log("error reaching API: " + error)
        },
    })
}

