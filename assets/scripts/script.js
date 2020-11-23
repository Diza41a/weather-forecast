var cityEl = document.querySelector("#city");
var allForcastsDiv = document.querySelector("#all-forecasts");
var searchEls = document.querySelector("#history");
var searchBtn = document.querySelector("#search-button");

var warningEl = document.querySelector("#warning");

var getUserInput = function(event){
    warningEl.setAttribute("style", "display: none");
    if (event!==undefined)
    {
        var entry = "";
        if (event.target.getAttribute("id") === "history-entry" )
        {
            return event.target.textContent;
        }
        else if (event.target.getAttribute("id") === "search-button")
        {
            if (document.querySelector("#city").value !== ""){
                return document.querySelector("#city").value;
            }
            else{
                warningEl.textContent = "Please enter a city for your forecast";
                warningEl.setAttribute("style", "padding-top:6px; color:red; display:block");
                document.querySelector("#search-tools").appendChild(warningEl);
            }
        }
    }
}

var displayTodaysForecast = function(event){
    var city = getUserInput(event).trim();
    if (city === "")
    {
        return alert("Enter a valid city option");
    }
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=c9e35d72613b8421a57cb99446bd1d2f")
    .then(function(response){
        if (response.ok)
        {
            return response.json();
        }
        else{
            warningEl.setAttribute("style","display:block");
            warningEl.style.color = "yellow";
            warningEl.textContent = "Please enter a valid city";
            return;
        }
    })
    .then(
        function(response){
            console.log(response);
            
            //Calv to fahrenheit T(K) × 9/5 - 459.67
            var fahr = Math.round(response.main.temp * 9/5 - 459.67);

            var todaysDataEl = document.querySelector(".forecast-data");
            todaysDataEl.innerHTML = "";
            var cityDate = "<h3>" + city + " (" + moment().format("L") + ")" + 
            " <img src='http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png' style='border-radius: 50%;" +
            "background-color: darkgray'/> </h3>";
            var other = "<p> temperature: " + fahr + "\u00B0f<br/>" +
                "humidity: " + response.main.humidity + "%<br/>" +
                "wind speed: " + response.wind.speed + " mph<br/>" +
                "<span data-uv = '3.5'> UV index: 3.5 </span></p>"; 
                todaysDataEl.innerHTML = "<div id='today'>" + cityDate + other + "</div>";
                todaysDataEl.removeAttribute("style");
                console.log(todaysDataEl);

            
        }
    )
}


//api-key = c9e35d72613b8421a57cb99446bd1d2f
//kelvin to fahrenheit (xK − 273.15) × 9/5 + 32

searchEls.addEventListener("click", displayTodaysForecast);
searchBtn.addEventListener("click", displayTodaysForecast);