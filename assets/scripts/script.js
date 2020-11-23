var cityEl = document.querySelector("#city");
var allForcastsDiv = document.querySelector("#all-forecasts");
var historyEls = document.querySelector("#history");
var searchBtn = document.querySelector("#search-button");
var forecastsDataEl = document.querySelector(".forecast-data");

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

            forecastsDataEl.innerHTML = "";
            var cityDate = "<h3>" + city + " (" + moment().format("L") + ")" + 
            " <img src='http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png' style='border-radius: 50%;" +
            "background-color: darkgray'/> </h3>";
            var other = "<p id = 'current-day'> temperature: " + fahr + "\u00B0f<br/>" +
                "humidity: " + response.main.humidity + "%<br/>" +
                "wind speed: " + response.wind.speed + " mph<br/></p>"; 
                forecastsDataEl.innerHTML = "<div id='today'>" + cityDate + other + "</div>";
                forecastsDataEl.removeAttribute("style");
                
            displayFutureForecasts(response.coord.lon, response.coord.lat, forecastsDataEl.querySelector("#current-day"));
            
        }
    )
}

var displayFutureForecasts = function(lon, lat, currentDayEl){
    apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lon=" + lon + "&lat=" + lat + 
    "&exclude=hourly,alerts,minutely&appid=c9e35d72613b8421a57cb99446bd1d2f";
    
    fetch(apiUrl)
    .then(function(response){
        return response.json();
    }).then(function(data){
        //append uv index for current day
        var uvEl = document.createElement("span");
        uvEl.setAttribute("style","margin-top: 1vw, border-radius: 35%, color: white");

        uvEl.style.borderRadius = "7%";
        uvEl.style.padding = "2px 6px";
        uvEl.style.color = "white";
        uvEl.style.fontWeight = "bold";
        if (data.current.uvi < 4)
        {
            uvEl.style.background = "green";
        }
        else if (data.current.uvi >= 4 && data.current.uvi < 7)
        {
            uvEl.style.background = "orange";
        }
        else if (data.current.uvi >= 7)
        {
            uvEl.style.background = "red";
        }
        uvEl.textContent = "UV index: " + data.current.uvi;
        currentDayEl.appendChild(uvEl);

        //forecast for next 5 days
        // <div id = "five-days">
        //         <!-- divs -->
        //        <div>
        //            <p><span style="font-weight: bold;">08/23/2020</span><br/>
        //             temp: 88f*<br/>
        //             humidity: 88%
        //            </p>
        //        </div>
        console.log(data);
        var fiveDaysWrapper = document.createElement("div");
        fiveDaysWrapper.id = "five-days";
        for(var i = 1; i < 5; i++)
        {
            var fahr = Math.round(data.daily[i-1].temp.day * 9/5 - 459.67);
            var fiveDaysData = "<div><p><span style='font-weight: bold;'>" + moment().add(1, "day").format("L") + 
            "</span><br/> temp: " + fahr + "\u00B0f<br/> humidity: " + data.daily[i-1].humidity + "%</p></div>";
            console.log(fiveDaysData);
            fiveDaysWrapper.innerHTML += fiveDaysData;
            console.log(fiveDaysWrapper.innerHTML);
            console.log(data.daily[i-1].humidity);
        }
        forecastsDataEl.appendChild(fiveDaysWrapper);
    });
}

//"<span data-uv = '3.5'> UV index: 3.5 </span>
//api-key = c9e35d72613b8421a57cb99446bd1d2f
//kelvin to fahrenheit (xK − 273.15) × 9/5 + 32

historyEls.addEventListener("click", displayTodaysForecast);
searchBtn.addEventListener("click", displayTodaysForecast);