var buttonEl = document.querySelector("#submit");

var apiKey = "af74b68dab1264f074d3adc9cad2c136"; // api key generated under my account

var iconURL = "http://openweathermap.org/img/w/10d.png";

// function that grabs 5-day forecast and displays it to page
function getData(event) {
    //event.preventDefault();
    var inputEl = document.querySelector("#cityName");
    // pass city as parameter into API call
    var cityURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputEl.value + "&appid=" + apiKey;
    
    // latitude and longitude values
    var lat;
    var lon;

    // use this fetch to grab latitude and longitude values
    fetch(cityURL)
        .then(function (response) {
            if(response.status === 404) {
                alert("Invalid city name");
                inputEl.textContent = "";
                document.location.replace("index.html"); // redirect to same webpage
            }
            return response.json();
        })
        .then(function (data) {
            console.log("we are here");
            // grab lat and lon values
            lat = data.coord.lat;
            lon = data.coord.lon;
            // create URL that uses lat and lon as values
            queryURL = "https://api.openweathermap.org/data/2.5/forecast?" + "lat=" + lat +  "&lon=" + lon + "&appid=" + apiKey;
            
            // use this fetch to grab 5-day forecast
            fetch(queryURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    var day = 1; // keeps track of day in 5-day forecast
                    // display 5-day forecast
                    for(var i = 7; i < data.list.length; i = i + 8) {
                        // get date
                        var h3El = document.querySelector("#date-" + day);
                        h3El.textContent = data.list[i].dt_txt.split(" ")[0];
                        
                        // get icon
                        var imgEl = document.querySelector("#icon-" + day);
                        imgEl.setAttribute("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                        
                        // get temperature
                        var tempEl = document.querySelector("#temp-" + day);
                        var temp = data.list[i].main.temp;
                        temp = convertKelvinToFahrenheit(temp); // get temp in fahrenheit
                        tempEl.textContent = "Temp: " + temp + " °F";

                        var windEl = document.querySelector("#wind-" + day);
                        var wind = data.list[i].wind.speed;
                        wind = convertMetersToMilesPerSecond(wind);
                        windEl.textContent = "Wind: " + wind + " MPH";

                        var humidEl = document.querySelector("#humid-" + day);
                        humidEl.textContent = "Humidity: " + data.list[i].main.humidity + " %";

                        day++
                    }
            });
    });
}

// applies formula to convert kelvin to fahrenheit
function convertKelvinToFahrenheit(kelvin) {
    var fahrenheit = kelvin - 273.15;
    fahrenheit = fahrenheit * (9/5);
    fahrenheit = fahrenheit + 32;
    return Math.round(fahrenheit * 100) / 100; // check README for code source
}

// applies formula to convert meters per second to miles per second
function convertMetersToMilesPerSecond(wind) {
    wind = wind * 2.24;
    return Math.round(wind * 100) / 100; // check README for code source
}

// call on click of 'Search' button
buttonEl.addEventListener("click", getData);
