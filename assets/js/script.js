var formEl = document.querySelector("#searchCity"); // Search button element

var apiKey = "af74b68dab1264f074d3adc9cad2c136"; // api key generated under my account

// function that grabs 5-day forecast and displays it to page
function getData(event) {
    event.preventDefault();

    var btn = document.activeElement; // check README for source code
    var inputEl = ""; // will represent value of our input, whether it comes from search history or text box

    // this if/else block checks if the user clicked on a search history button or inputted a new city name
    if(btn.className === "historyButton") {
        inputEl = btn.textContent;
    }
    else {
        // name of city user inputted
        inputEl = document.querySelector("#cityName").value;
    }

    // pass city as parameter into API call
    var cityURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputEl + "&appid=" + apiKey;

    // latitude and longitude values
    var lat;
    var lon;

    // use this fetch to grab latitude and longitude values of specified city
    fetch(cityURL)
        .then(function (response) {
            // check if city name is invalid
            if(!response.ok) {
                console.log("Invalid city name");
                document.querySelector("#cityName").textContent = "";
                document.location.replace("index.html"); // redirect to same webpage
                return;
            }

            var cityList = JSON.parse(localStorage.getItem("cityList")); // represents array of cities user has searched for

            if(cityList === null) {
                cityList = []; // set var to an empty array instead of null
            }

            var isCityRepresented = false;
            
            // check if city is already in search history
            for(var i = 0; i < cityList.length; i++) {
                if(cityList[i].toLowerCase() === inputEl.toLowerCase()) {
                    isCityRepresented = true; // found city in search history
                    break;
                }
            }

            if(!isCityRepresented) {
                cityList.push(inputEl); // put city name in list of user searched cities
                localStorage.setItem("cityList", JSON.stringify(cityList));
                
                // add a new button to page to represent city in our search history
                createButtonElement(cityList[i]);
            }

            return response.json();
        })
        .then(function (data) {
            // grab lat and lon values
            lat = data.coord.lat;
            lon = data.coord.lon;
            // create URL that uses lat and lon as values
            var queryURL = "https://api.openweathermap.org/data/2.5/forecast?" + "lat=" + lat +  "&lon=" + lon + "&appid=" + apiKey;
            
            // use this fetch to grab 5-day forecast
            fetch(queryURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    // add dynamic styling to webpage
                    var sectionEl = document.querySelector("#forecast-today");
                    sectionEl.style.border = "solid black 1px";

                    // get forecast for current day
                    var currentH3 = document.querySelector("#city-date");
                    currentH3.textContent = inputEl + " " + dayjs().format("M/D/YYYY");

                    var currentImg = document.querySelector("#icon-today");
                    currentImg.setAttribute("src", "https://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png");

                    var currentTmp = document.querySelector("#temp-today");
                    var temp = data.list[0].main.temp;
                    temp = convertKelvinToFahrenheit(temp); // get temp in fahrenheit
                    currentTmp.textContent = "Temp: " + temp + " °F";

                    var currentWind = document.querySelector("#wind-today");
                    var wind = data.list[0].wind.speed;
                    wind = convertMetersToMilesPerSecond(wind);
                    currentWind.textContent = "Wind: " + wind + " MPH";

                    var currentHumid = document.querySelector("#humid-today");
                    currentHumid.textContent = "Humidity: " + data.list[0].main.humidity + " %";

                    var day = 1; // keeps track of day in 5-day forecast
                    // display 5-day forecast
                    for(var i = 7; i < data.list.length; i = i + 8) {
                        // add dynamic styling
                        var forecastEl = document.querySelector("#forecast-" + day);
                        forecastEl.style.padding = "20px";
                        forecastEl.style.margin = "5px";
                        
                        // get date
                        var h3El = document.querySelector("#date-" + day);
                        h3El.textContent = dayjs(data.list[i].dt_txt.split(" ")[0]).format("M/D/YYYY"); // display date in mm/dd/yyyy format

                        // get icon
                        var imgEl = document.querySelector("#icon-" + day);
                        imgEl.setAttribute("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                        
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

// loads search history on page
function displaySearchHistory() {
    // end function call if there is no search history
    if(localStorage.getItem("cityList") === null) {
        return;
    }

    var cityList = JSON.parse(localStorage.getItem("cityList"));

    // create a button element for each previously searched city and append to aside element
    for(var i = 0; i < cityList.length; i++) {
        createButtonElement(cityList[i]);
    }
}

// creates a new button element and appends it to our form
function createButtonElement(cityName) {
    var btnEl = document.createElement("button");
    btnEl.classList.add("historyButton");
    btnEl.style.marginTop = "0.8rem"; // gives buttons some space between them
    btnEl.textContent = cityName;

    formEl.append(btnEl);
}

displaySearchHistory();

// call on click of 'Search' button
formEl.addEventListener("submit", getData);
