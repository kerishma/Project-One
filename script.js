/**
 * pulls information from the form and build the query URL
 * @returns {string} URL for NYT API based on form inputs     //saw this on that NYT code and unsure if this is needed
 */

function buildQueryURL() {
    //query URL goes here but don't know which site we'll get data from yet
    const queryURL = "";

    // Set the API key....need the api key lol
    const queryParams = { "api-key": "" };

    // Grab text the user typed into the search input, add to the queryParams object
    queryParams.q = $("#search-bar")
        .val()
        .trim();

    // Logging the URL so we have access to it for troubleshooting....took this part from the NYT example i think it'll be useful?
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
}

// .on("click") function associated with the Search Button
$("#submit-btn").on("click", function (event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();

    // Empty the region associated with the articles
    clear();

    // Build the query URL for the ajax request to the NYT API
    const queryURL = buildQueryURL();

    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(updatePage);
});