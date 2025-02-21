// * 4. Change all of your fetch() functions to axios!
//  * - axios has already been imported for you within index.js.
//  * - If you've done everything correctly up to this point, this should be simple.
//  * - If it is not simple, take a moment to re-evaluate your original code.
//  * - Hint: Axios has the ability to set default headers. Use this to your advantage
//  *   by setting a default header with your API key so that you do not have to
//  *   send it manually with all of your requests! You can also set a default base URL!
//  */
// /**
//  * 5. Add axios interceptors to log the time between request and response to the console.
//  * - Hint: you already have access to code that does this!
//  * - Add a console.log statement to indicate when requests begin.
//  * - As an added challenge, try to do this on your own without referencing the lesson material.
//  */
/**
* 6. Next, we'll create a progress bar to indicate the request is in progress.
* - The progressBar element has already been created for you.
*  - You need only to modify its "width" style property to align with the request progress.
* - In your request interceptor, set the width of the progressBar element to 0%.
*  - This is to reset the progress with each request.
* - Research the axios onDownloadProgress config option.
* - Create a function "updateProgress" that receives a ProgressEvent object.
*  - Pass this function to the axios onDownloadProgress config option in your event handler.
* - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
*  - Update the progress of the request using the properties you are given.
* - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
*   once or twice per request to this API. This is still a concept worth familiarizing yourself
*   with for future projects.
*/
/**
* 7. As a final element of progress indication, add the following to your axios interceptors:
* - In your request interceptor, set the body element's cursor style to "progress."
* - In your response interceptor, remove the progress cursor style from the body element.
*/
// / API Key and Default Setup
import * as Carousel from "./carousel.js";
// import axios from "axios";
const API_KEY = "live_A5FRyucCTGG4I1mK1z4JjDIDDHUbONxtYVODAw3c2qN8XN1Przpe8FSDkdqpfy21";
// Configure Axios Defaults
axios.defaults.headers.common['x-api-key'] = API_KEY;
axios.defaults.baseURL = "https://api.thecatapi.com/v1";
// DOM Elements
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");
const breedSelect = document.getElementById("breedSelect");
// Axios Interceptors for Progress and Timing
axios.interceptors.request.use((config) => {
  config.metadata = { startTime: new Date() };
  console.log('Request started');
  progressBar.style.width = '0%';
  document.body.style.cursor = 'progress';
  return config;
});
axios.interceptors.response.use((response) => {
  const endTime = new Date();
  const duration = endTime - response.config.metadata.startTime;
  console.log(`Request took ${duration}ms`);
  progressBar.style.width = '100%';
  document.body.style.cursor = 'default';
  return response;
});
// Progress Update Function
function updateProgress(progressEvent) {
  if (progressEvent.lengthComputable) {
    const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
    progressBar.style.width = percentComplete + '%';
  }
}
// Initial Load Function
async function initialLoad() {
  try {
    const response = await axios.get("/breeds");
    const breeds = response.data;
    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
    if (breeds.length > 0) {
      getBreedInfo({ target: { value: breeds[0].id } });
    }
  } catch (error) {
    console.error("Error loading cat breeds:", error);
  }
}
// Get Breed Information Function
async function getBreedInfo(e) {
  try {
    const response = await axios.get("/images/search", {
      params: {
        limit: 10,
        breed_ids: e.target.value
      },
      onDownloadProgress: updateProgress
    });
    const breedInfo = response.data;
    infoDump.innerHTML = "";
    Carousel.clear();
    // Create carousel items
    breedInfo.forEach((image) => {
      const carouselItem = Carousel.createCarouselItem(image.url, image.name, image.id);
      Carousel.appendCarousel(carouselItem);
    });
    // Display breed information
    if (breedInfo[0]?.breeds?.[0]) {
      const breed = breedInfo[0].breeds[0];
      const infoSection = document.createElement("div");
      infoSection.className = "breed-info";
      infoSection.innerHTML = `
      <h2>${breedInfo[0].breeds[0].name}</h2>
      <p class="breed-description">${breedInfo[0].breeds[0].description}</p>
      <div class="breed-details">
        <p><strong>Temperament:</strong> ${breedInfo[0].breeds[0].temperament}</p>
        <p><strong>Origin:</strong> ${breedInfo[0].breeds[0].origin}</p>
        <p><strong>Life Span:</strong> ${breedInfo[0].breeds[0].life_span} years</p>
        <div class="characteristics">
          <p><strong>Intelligence:</strong> ${breedInfo[0].breeds[0].intelligence}/5</p>
          <p><strong>Adaptability:</strong> ${breedInfo[0].breeds[0].adaptability}/5</p>
          <p><strong>Affection Level:</strong> ${breedInfo[0].breeds[0].affection_level}/5</p>
          <p><strong>Child Friendly:</strong> ${breedInfo[0].breeds[0].child_friendly}/5</p>
          <p><strong>Energy Level:</strong> ${breedInfo[0].breeds[0].energy_level}/5</p>
        </div>
      </div>
    `;
      infoDump.appendChild(infoSection);
    }
    Carousel.start();
  } catch (error) {
    console.error('Error fetching breed information:', error);
  }
}
// Favorite Toggle Function
 async function favourite(imgId) {
  try {
    // Check if image is already favorited
    const favorites = await axios.get('/favourites');
    const existingFavorite = favorites.data.find(fav => fav.image_id === imgId);
    if (existingFavorite) {
      // Remove from favorites
      await axios.delete(`/favourites/${existingFavorite.id}`);
      return false;
    } else {
      // Add to favorites
      await axios.post('/favourites', { image_id: imgId });
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
}
// Get Favorites Function
async function getFavorites() {
  try {
    const response = await axios.get('/favourites');
    const favorites = response.data;
    infoDump.innerHTML = "";
    Carousel.clear();
    // Create carousel items for favorites
    favorites.forEach((favorite) => {
      const carouselItem = Carousel.createCarouselItem(favorite.image.url, favorite.image.name, favorite.image_id);
      Carousel.appendCarousel(carouselItem);
    });
    Carousel.start();
  } catch (error) {
    console.error('Error fetching favorites:', error);
  }
}
// Event Listeners
document.addEventListener("DOMContentLoaded", initialLoad);
breedSelect.addEventListener("change", getBreedInfo);
getFavouritesBtn.addEventListener("click", getFavorites);
// Carousel Cleanup
window.addEventListener('unload', () => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
});
// 8. To practice posting data, we'll create a system to "favourite" certain images.
//  * - The skeleton of this function has already been created for you.
//  * - This function is used within Carousel.js to add the event listener as items are created.
//  *  - This is why we use the export keyword for this function.
//  * - Post to the cat API's favourites endpoint with the given ID.
//  * - The API documentation gives examples of this functionality using fetch(); use Axios!
//  * - Add additional logic to this function such that if the image is already favourited,
//  *   you delete that favourite using the API, giving this function "toggle" functionality.
//  * - You can call this function by clicking on the heart at the top right of any image.
//  */