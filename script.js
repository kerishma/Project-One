const proxyurl = "https://cors-anywhere.herokuapp.com/";

let userLocation;

$(document).ready(function () {
  getUserLocation();
});

function buildQueryURL(term, lat, lon) {
  $("#rCards").empty();

  // We have to pass a proxy URL for the Yelp API because we are using Vanilla
  // Javascript; by not having a middleware we cannot call the API properly
  // and satisfy their requirement, so we need to use a proxy; CORS;
  // When we use the proxy, the cors-anywhere.herokuapp makes the API call
  // for us so we can pass the CORS along
  // query URL goes here but don't know which site we'll get data from yet

  const queryURL = proxyurl + "https://api.yelp.com/v3/businesses/search?";

  // Set the API key....need the api key lol
  const queryParams = {
    term: term,
    latitude: lat,
    longitude: lon,
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

  let searchBar = $("#search-bar").val();
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

  getYelpData(userLocation);
});

$("#submitNutBtn").click(function (event) {
  // this is the setup for the nurtition button and search
    event.preventDefault();
  
    let nutBar = $("#nutrition-bar").val();
    if (!nutBar) {
      $("#nutrition-bar").attr("placeholder", "I SAID, Enter Foods!");
      return;
    }
});

function createRestaurantCards(data, term) {
  let arrLength = 4;
  let places = data.businesses;
  if (term != "") {
    arrLength = places.length;
  }
  let mapID = 0;
  for (let i = 0; i < arrLength; i++) {
    // to make the restaurants random every time. changes [i] to randomPlace
    let randomPlace = Math.floor(Math.random() * (19 - 0) + 0);
    let defaultUnknown = "Not Confirmed";
    let cardDeck = $("<div class='card-deck'></div>");
    let card = $("<div class='card mb-3'></div>");
    let cardRow = $("<div class='row no-gutters'></div>");
    let cardImgCol = $("<div class='col'></div>");
    let yelpUrl = places[randomPlace].url;
    let yelpImg = $(
      `<a href=${yelpUrl} target="_blank"> <img class='card-img img-fluid' src=${places[randomPlace].image_url}></a>`
    );
    let cardColBody = $("<div class='col-md-8'></div>");
    let cardBody = $("<div class='card-body'>");
    let cardH = $("<h5 class='card-title'></h5>").text(
      places[randomPlace].name
    );
    let rating = $("<p class='card-text'></p>").text(
      `Rating: ${places[randomPlace].rating}`
    );
    if (places[randomPlace].price) {
      defaultUnknown = places[randomPlace].price;
    }
    let price = $("<p class='card-text'></p>").text(`Price: ${defaultUnknown}`);
    let takeout = $("<p class='card-text'></p>").text(
      `Takeout: ${places[randomPlace].transactions}`
    );
    if (places[i].phone) {
      defaultUnknown = places[randomPlace].phone;
    }
    let phoneNum = $("<p class='card-text'></p>").text(
      `Phone: ${places[randomPlace].phone}`
    );
    let googleMap = $(`<div id='map-${mapID}'></div>`);
    googleMap.css({ height: "100px", width: "70%" });
    card.css("max-width", "540px");
    cardImgCol.append(yelpImg);
    cardBody.append(cardH, rating, price, takeout, phoneNum, googleMap);
    cardColBody.append(cardBody);
    cardRow.append(cardImgCol, cardColBody);
    card.append(cardRow);
    cardDeck.append(card);
    $("#rCards").append(cardDeck);
    initMap(
      mapID,
      places[randomPlace].coordinates.latitude,
      places[randomPlace].coordinates.longitude
    );
    mapID++;
  }
  mapID = 0;
}

// We are asking the user for their location as soon as the HTML page loads
// that way we can show them restaurants close to their location
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, blockedSelection);
  }
}

function blockedSelection() {
  console.log("User has blocked location request!");
}

function showPosition(position) {
  userLocation = position.coords;
  $("#submit-btn").attr("disabled", false);
  $("#randomBtn").attr("disabled", false);
}

function getYelpData(data) {
  let lat = data.latitude;
  let lon = data.longitude;
  let term = $("#search-bar").val();
  // Build the query URL for the ajax request to the NYT API
  const queryURL = buildQueryURL(term, lat, lon);

  $.ajax({
    url: queryURL + "&categories=restaurants",
    headers: {
      "Content-Type": "application/json",
      "x-requested-with": "xmlhttprequest",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${config.apiKey}`,
    },
    crossDomain: true,
    method: "GET",
    success: function (result) {
      createRestaurantCards(result, term);
      console.log(result);
    },
    error: function (error) {
      // console.log("error reaching API: " + error)
    },
  });
}

function initMap(mapID, lat, lon) {
  // The location of Uluru
  var uluru = { lat: lat, lng: lon };
  // The map, centered at Uluru
  var map = new google.maps.Map(document.getElementById(`map-${mapID}`), {
    zoom: 4,
    center: uluru,
  });
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({ position: uluru, map: map });
}
