var apiKey = "af74b68dab1264f074d3adc9cad2c136"; // api key generated under my account
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=47.6062&lon=-122.3321&appid=" + apiKey;

function getData() {
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

getData();