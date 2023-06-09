import { Controller } from "@hotwired/stimulus";

const apiKey = 'f5191f73c320e67df9461049016befe3';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
const backgroundContainer = document.getElementById('backgroundContainer');


export default class extends Controller {
  static targets = ["searchBox", "result", "date", "weather", "image", "temp", "co", "no", "pm"]

  connect() {
    console.log("The 'date' controller is now loaded!");
  }

  display(event) {
    event.preventDefault();
    const name = this.searchBoxTarget.value;
    this.resultTarget.innerText = "";
    console.log(name);
    this.resultTarget.insertAdjacentHTML("beforeend", `${name.charAt(0).toUpperCase() + name.slice(1)}`);
    this.date();
    this.weather();
    this.image();
    this.temp();
    this.latlon();
  }

  date() {
    const name = this.searchBoxTarget.value;
    const url = `${baseUrl}${name}&appid=${apiKey}`;
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        const timezone = data.timezone;
        const offset = new Date().getTimezoneOffset() * 60;
        const currentTime = new Date((data.dt + timezone + offset) * 1000);
        this.dateTarget.innerText = "";
        console.log(`Current time in ${name}: ${currentTime.toLocaleString()}`);
        this.dateTarget.insertAdjacentHTML("beforeend", `Current time in ${name}: ${currentTime.toLocaleString()}`);
      });
  }

  weather() {
    const name = this.searchBoxTarget.value;
    const url = `${baseUrl}${name}&appid=${apiKey}`;
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        const description = data.weather[0].description;
        this.weatherTarget.innerText = "";
        console.log(description);
        this.weatherTarget.insertAdjacentHTML("beforeend", description);
      });
  }

  image() {
    const name = this.searchBoxTarget.value;
    const url = `${baseUrl}${name}&appid=${apiKey}`;
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        const id = data.weather[0].icon;
        this.imageTarget.innerText = "";
        console.log(id);
        this.imageTarget.src = `https://openweathermap.org/img/w/${id}.png`;
      });
  }

  temp() {
    const name = this.searchBoxTarget.value;
    const url = `${baseUrl}${name}&appid=${apiKey}`;
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        const temp = (data.main.temp - 273.15).toFixed(2);
        this.tempTarget.innerText = "";
        console.log(temp);
        this.tempTarget.insertAdjacentHTML("beforeend", `${temp} °C`);
      });
  }

  latlon() {
    const name = this.searchBoxTarget.value;
    const url = `${baseUrl}${name}&appid=${apiKey}`;
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        const latitude = data.coord.lat;
        const longitude = data.coord.lon;
        this.weatherTarget.innerText = "";
        console.log(latitude);
        console.log(longitude);
        // Call the poll() method and pass the latitude and longitude
        this.poll(latitude, longitude);
      });
  }

  poll(latitude, longitude) {
    const name = this.searchBoxTarget.value;
    const pollUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    fetch(pollUrl)
      .then(response => response.json())
      .then((data) => {
        const co = data.list[0].components.co;
        const no = data.list[0].components.no;
        const pm2_5 = data.list[0].components.pm2_5;

        this.coTarget.innerText = "";
        this.noTarget.innerText = "";
        this.pmTarget.innerText = "";
        console.log(co);
        console.log(no);
        console.log(pm2_5);
        this.coTarget.insertAdjacentHTML("beforeend", `CO: ${co}`);
        this.noTarget.insertAdjacentHTML("beforeend", `NO: ${no}`);
        this.pmTarget.insertAdjacentHTML("beforeend", `PM2.5: ${pm2_5}`);
      });
  }
}
