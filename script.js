const windDirection = (wind_degrees) => {
  if (wind_degrees >= 11.25 && wind_degrees <= 78.75) return "northeast";
  else if (wind_degrees >= 78.75 && wind_degrees <= 101.25) return "east";
  else if (wind_degrees >= 101.25 && wind_degrees <= 168.75) return "southeast";
  else if (wind_degrees >= 168.75 && wind_degrees <= 191.25) return "south";
  else if (wind_degrees >= 191.25 && wind_degrees <= 258.75) return "southwest";
  else if (wind_degrees >= 258.75 && wind_degrees <= 281.25) return "west";
  else if (wind_degrees >= 281.25 && wind_degrees <= 348.75) return "northwest";
  else if (wind_degrees == undefined) return "undefined";
  else return "north";
};

const tempMessage = (temp) => {
  if (temp > 25) return "Summer means happy times and good sunshine.";
  else if (temp >= 10)
    return "No winter lasts forever; no spring skips its turn.";
  else if (temp > 3) return "Nothing burns like the cold.";
};

const pctMessage = (pct) => {
  if (pct == 100) return "Enjoy the rain inside with loved ones.";
  else if (pct > 75) return "It must rain today, don't forget umbrella.";
  else if (pct > 30) return "It shows some clouds around you. It may rain.";
  else if (pct == 0) return "You can plan a trip. It would be mostly sunny.";
  else if (pct < 15) return "No showers. You can definetly go out.";
};

const dayMessage = (hours) => {
  if (hours > 12) return "Uff! It's a long day. Be ready to fight";
  else if (hours > 8)
    return "You should have some rest after an exhausting day.";
  else if (hours > 0) return "You will have long dreams.";
};

const getSetRise = (loc) => {
  const API_KEY = config.GEO_KEY;
  const options = {
    method: "GET",
  };
  fetch(
    `https://api.ipgeolocation.io/astronomy?apiKey=${API_KEY}&location=${loc}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      if (!response.message) {
        sunrise.innerHTML = formatTime(response.sunrise);
        sunset.innerHTML = formatTime(response.sunset);
        ld_hours.innerHTML = getTime(response.day_length, "h");
        ld_mins.innerHTML = getTime(response.day_length, "m");
        day_message.innerHTML = dayMessage(getTime(response.day_length, "h"));
      } else {
        toastr.error("Try a different location.", "Invalid Location");
      }
    })
    .catch((err) => console.log(err));
};

const getWeather = (city) => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "e45ca88171msh8071d07f5bfb384p10a665jsn295db7911ae9",
      "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
    },
  };

  url = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`;

  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
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
      } else {
        toastr.error("Try a different one.", "Invalid Location");
      }
    })
    .catch((err) => console.log(err));
};

const check = () => {
  if (city.value == "") return false;
  // else if (!isValid) return false;
  else return true;
};

submit.addEventListener("click", (e) => {
  e.preventDefault();
  if (check()) {
    getWeather(city.value);
    getSetRise(city.value);
  }
});

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

function getTime(time, part) {
  var hoursMins = time.split(":");
  if (part == "h") return hoursMins[0];
  else if (part == "m") return hoursMins[1];
}

getWeather("srinagar");
getSetRise("srinagar");

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
