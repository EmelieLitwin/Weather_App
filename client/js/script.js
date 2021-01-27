const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const city = document.querySelector(".location");
const weatherTable = document.querySelector("table");

//createFiveElements is called for every cell in weather forecast table
//createFiveElements(variableName, queryName)
createFiveElements("weekday", ".weekday")
createFiveElements("weatherIcons", ".icon")
createFiveElements("description", ".description")
createFiveElements("temp", ".temp")
createFiveElements("date", ".date")
createFiveElements("wind", ".wind")
createFiveElements("humidity", ".humidity")
createFiveElements("rain", ".rain")

//Date format for weather table
var options = {year: "numeric", month: "short", day: "numeric" };
var today = new Date();

for (let i = 2; i < 6; i++) {
    this["day"+ i.toString()] = new Date()
    var day = this["day"+ i.toString()]
    var date = this["date"+ i.toString()]
    var weekday = this["weekday"+ i.toString()]

    day.setDate(today.getDate() + (i-1));
    date.textContent = day.toLocaleDateString("en-GB", options);
    if(i===2){
    continue
    }else{
        weekday.textContent = day.toLocaleDateString("en-GB", {weekday: 'long'});
    }   
}
date1.textContent = today.toLocaleDateString("en-GB", options);

//Makes Stockholm default city
apiCall('/weather?address=stockholm')

//Takes users input and uses in API-call
weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const locationApi = "/weather?address=" + search.value;
    apiCall(locationApi)
})
    
  function apiCall(locationApi){
  fetch(locationApi).then((response) => {
    response.json().then((data) => {
      //If city is not found, the table disappears and an error messange is shown
      if (data.error) {
        city.textContent =  data.error
        weatherTable.style.display = "none";       
    } else {
      weatherTable.style.display = ""; 
      //Calculates the avarage precipitation from 3-hour forecast
      rain1.textContent = precipitation(data.allData, 0, 8) + " mm/h";
      rain2.textContent = precipitation(data.allData, 9, 16) + " mm/h";
      rain3.textContent = precipitation(data.allData, 17, 24) + " mm/h";
      rain4.textContent = precipitation(data.allData, 25, 32) + " mm/h";
      rain5.textContent = precipitation(data.allData, 33, 40) + " mm/h";

      //Displays the city and transform country abbreviation to full name
      city.textContent = data.cityName + ", " + getCountryName(data.countryName.toString());
      
      //Weather icons for each day
      weatherIcons1.src = "http://openweathermap.org/img/wn/" + data.day1.weather[0].icon + "@2x.png";
      weatherIcons2.src = "http://openweathermap.org/img/wn/" + data.day2.weather[0].icon + "@2x.png";
      weatherIcons3.src = "http://openweathermap.org/img/wn/" + data.day3.weather[0].icon + "@2x.png";
      weatherIcons4.src = "http://openweathermap.org/img/wn/" + data.day4.weather[0].icon + "@2x.png";
      weatherIcons5.src = "http://openweathermap.org/img/wn/" + data.day5.weather[0].icon + "@2x.png";

      //Displays weather description in uppercase
      description1.textContent = data.day1.weather[0].description.charAt(0).toUpperCase() + data.day1.weather[0].description.slice(1);
      description2.textContent = data.day2.weather[0].description.charAt(0).toUpperCase() + data.day2.weather[0].description.slice(1);
      description3.textContent = data.day3.weather[0].description.charAt(0).toUpperCase() + data.day3.weather[0].description.slice(1);
      description4.textContent = data.day4.weather[0].description.charAt(0).toUpperCase() + data.day4.weather[0].description.slice(1);
      description5.textContent = data.day5.weather[0].description.charAt(0).toUpperCase() + data.day5.weather[0].description.slice(1);

      //Transforms API temp to celsius ang no decimals
      temp1.textContent = Math.round(data.day1.main.temp - 273.5) + String.fromCharCode(176) + "C";
      temp2.textContent = Math.round(data.day2.main.temp - 273.5) + String.fromCharCode(176) + "C";
      temp3.textContent = Math.round(data.day3.main.temp - 273.5) + String.fromCharCode(176) + "C";
      temp4.textContent = Math.round(data.day4.main.temp - 273.5) + String.fromCharCode(176) + "C";
      temp5.textContent = Math.round(data.day5.main.temp - 273.5) + String.fromCharCode(176) + "C";

      //Wind speed with no decimals
      wind1.textContent = Math.round(data.day1.wind.speed) + " m/s";
      wind2.textContent = Math.round(data.day2.wind.speed) + " m/s";
      wind3.textContent = Math.round(data.day3.wind.speed) + " m/s";
      wind4.textContent = Math.round(data.day4.wind.speed) + " m/s";
      wind5.textContent = Math.round(data.day5.wind.speed) + " m/s";
    
      //Humidity
      humidity1.textContent = data.day1.main.humidity + " %";
      humidity2.textContent = data.day2.main.humidity + " %";
      humidity3.textContent = data.day3.main.humidity + " %";
      humidity4.textContent = data.day4.main.humidity + " %";
      humidity5.textContent = data.day5.main.humidity + " %";
      
    }
    })

  })

}

//Function for calculation the avarage precipitation (rain + snow)/hour.
function precipitation(data, start, stop) {
  var precipitation = 0;
  for (var i = start; i < stop; i++) {
    try {
      precipitation += data[i].rain["3h"];
    } catch (err) {
    }
    try {
      precipitation += data[i].snow["3h"];
    } catch (err) {
    }
  }
  return (precipitation / 24).toFixed(1);
}


function createFiveElements(variableName, queryName){
    for (let i = 1; i < 6; i++) {
        queryName = queryName +i
        this[variableName + i] = document.querySelector(queryName);
        queryName = queryName.slice(0, -1);
        
    }
}