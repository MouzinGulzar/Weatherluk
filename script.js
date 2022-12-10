// Changes loader color to visible
const loaderShow = () => {
  loader.classList.add("show");
};

// Changes loader width to load
const load = (load_class) => {
  loaderShow();
  loader.classList.add(load_class);
};

const loaderHide = () => {
  loader.classList.remove("_5");
  loader.classList.remove("_25");
  loader.classList.remove("_50");
  loader.classList.remove("_75");
  loader.classList.remove("_100");
  loader.classList.remove("show");
};

// Fetches Sunset, Sunrise and Day lenght from API
const getSetRise = async (loc) => {
  // const API_KEY = config.GEO_KEY;
  load("_5");
  const options = {
    method: "GET",
  };
  await fetch(
    `https://api.ipgeolocation.io/astronomy?apiKey=023098b0121f4352918342e1d60af5bf&location=${loc}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      load("_25");
      // Check if API returned time details for current city. If not, it returns json text with error message.
      if (!response.message) {
        tcity_name.innerHTML = `in ${loc}`;
        sunrise.innerHTML = formatTime(response.sunrise);
        sunset.innerHTML = formatTime(response.sunset);
        ld_hours.innerHTML = getTime(response.day_length, "h");
        ld_mins.innerHTML = getTime(response.day_length, "m");
        day_message.innerHTML = dayMessage(getTime(response.day_length, "h"));
        sun_distance.innerHTML = Math.ceil(response.sun_distance);
        moon_distance.innerHTML = Math.ceil(response.moon_distance);
        load("_50");
        solar_noon.innerHTML = formatTime(response.solar_noon);
      } else {
        toastr.error(`Can't get time for ${loc}`, "Try a different one!");
        load("_100");
      }
    })
    .then(() => getWeather(loc)) // Calls getWeather function.
    .catch((err) => console.log(err));
};

// Fectches weather from API
const getWeather = async (city) => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "e45ca88171msh8071d07f5bfb384p10a665jsn295db7911ae9",
      "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
    },
  };

  url = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`;

  load("_75");
  await fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      // Check if API returned weather details for current city. If not, it returns json text with error message.
      if (!response.error) {
        city_name.innerHTML = city;
        temp.innerHTML = response.temp;
        feels_like.innerHTML = response.feels_like;
        min_temp.innerHTML = response.min_temp;
        max_temp.innerHTML = response.max_temp;
        wind_speed.innerHTML = response.wind_speed;
        wind_direction.innerHTML = windDirection(response.wind_degrees);
        cloud_pct.innerHTML = response.cloud_pct;
        humidity.innerHTML = response.humidity;
        temp_message.innerHTML = tempMessage(response.temp);
        pct_message.innerHTML = pctMessage(response.cloud_pct);
        load("_100");
      } else {
        toastr.error(`Weather unavailable for ${city}`, "Try a different one!");
        load("_100");
      }
    })
    .catch((err) => console.log(err));
  loaderHide();
};

// By default shows weather of srinagar
getSetRise("srinagar");

// Check if user searched for an empty string
const check = () => {
  if (city.value == "") return false;
  else return true;
};

submit.addEventListener("click", (e) => {
  e.preventDefault();
  if (check()) {
    getSetRise(city.value);
  }
});

// Calculate wind direction from wind degree angles.
const windDirection = (wind_degrees) => {
  if (wind_degrees >= 11.25 && wind_degrees <= 78.75) return "northeast";
  else if (wind_degrees >= 78.75 && wind_degrees <= 101.25) return "east";
  else if (wind_degrees >= 101.25 && wind_degrees <= 168.75) return "southeast";
  else if (wind_degrees >= 168.75 && wind_degrees <= 191.25) return "south";
  else if (wind_degrees >= 191.25 && wind_degrees <= 258.75) return "southwest";
  else if (wind_degrees >= 258.75 && wind_degrees <= 281.25) return "west";
  else if (wind_degrees >= 281.25 && wind_degrees <= 348.75) return "northwest";
  else return "north";
};

// Returns a suitable sentence according to current temperature of city.
const tempMessage = (temp) => {
  if (temp > 25) return "Summer means happy times and good sunshine.";
  else if (temp >= 10)
    return "No winter lasts forever; no spring skips its turn.";
  else if (temp > 3) return "Nothing burns like the cold.";
};

// Returns a suitable sentence according to current precipitation of city.
const pctMessage = (pct) => {
  if (pct == 100) return "Enjoy the rain inside with loved ones.";
  else if (pct > 75) return "It must rain today, don't forget umbrella.";
  else if (pct > 30) return "It shows some clouds around you. It may rain.";
  else if (pct == 0) return "You can plan a trip. It would be mostly sunny.";
  else if (pct < 15) return "No showers. You can definetly go out.";
};

// Returns a suitable sentence according to current day lenght of city.
const dayMessage = (hours) => {
  if (hours > 12) return "Uff! It's a long day. Be ready to fight";
  else if (hours > 8)
    return "You should have some rest after an exhausting day.";
  else if (hours > 0) return "You will have long dreams.";
};

// Formats 24h format into 12h format
function formatTime(date) {
  var hoursMins = date.split(":");
  var hours = hoursMins[0];
  var mins = hoursMins[1];
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // hour 0 shoud be 12
  var time = `${hours}:${mins} ${ampm}`;
  return time;
}

// Returns hours or mins from a time
function getTime(time, part) {
  var hoursMins = time.split(":");
  if (part == "h") return hoursMins[0];
  else if (part == "m") return hoursMins[1];
}

// Toastr configuration
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: "toast-bottom-center",
  preventDuplicates: true,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};
