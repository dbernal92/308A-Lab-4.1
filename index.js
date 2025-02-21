import * as Carousel from "./carousel.js";
// import axios from "axios";

// The breed selection input element.
// const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_A5FRyucCTGG4I1mK1z4JjDIDDHUbONxtYVODAw3c2qN8XN1Przpe8FSDkdqpfy21";

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
async function initialLoad() {

  const breedSelect = document.getElementById("breedSelect");

let breeds = []
  try {
    const response = await fetch("https://api.thecatapi.com/v1/breeds", {
      headers: {
        "x-api-key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const breeds = await response.json();

    // Populate the breed selection dropdown
    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id; // Breed ID as value
      option.textContent = breed.name; // Breed name as displayed text
      breedSelect.appendChild(option);
    });

    // Add event listener to update info when a breed is selected
    breedSelect.addEventListener("change", getBreedInfo);

    // Auto-load the first breed if available
    if (breeds.length > 0) {
      breedSelect.value = breeds[0].id; // Set default selection
      getBreedInfo({ target: { value: breeds[0].id } }); // Load first breed’s info
    }
  } catch (error) {
    console.error("Error loading cat breeds:", error);
  }
}

// Execute initialLoad when DOM is fully loaded
document.addEventListener("DOMContentLoaded", initialLoad);

/**
 * Function: getBreedInfo
 * - Fetches images and detailed information about the selected breed.
 * - Populates the carousel with breed images.
 * - Displays breed details in the information section.
 */
async function getBreedInfo(e) {
  try {
    // Fetch images of the selected breed
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${e.target.value}&api_key=${API_KEY}`);
    const breedInfo = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Clear existing content in the info section and carousel
    infoDump.innerHTML = "";
    Carousel.clear();

    // Populate carousel with images
    breedInfo.forEach((image) => {
      const carouselItem = Carousel.createCarouselItem(image.url, image.name, image.id);
      Carousel.appendCarousel(carouselItem);
    });

    // Ensure breed information exists before displaying
    if (!breedInfo.length || !breedInfo[0].breeds.length) {
      throw new Error("No breed information found");
    }

    // Extract breed details
    const breedDetails = breedInfo[0].breeds[0];
    const infoSection = document.createElement("div");
    infoSection.className = "breed-info";
    infoSection.innerHTML = `
      <h2>${breedDetails.name}</h2>
      <p class="breed-description">${breedDetails.description}</p>
      <div class="breed-details">
        <p><strong>Temperament:</strong> ${breedDetails.temperament}</p>
        <p><strong>Origin:</strong> ${breedDetails.origin}</p>
        <p><strong>Life Span:</strong> ${breedDetails.life_span} years</p>
        <div class="characteristics">
          <p><strong>Intelligence:</strong> ${breedDetails.intelligence}/5</p>
          <p><strong>Adaptability:</strong> ${breedDetails.adaptability}/5</p>
          <p><strong>Affection Level:</strong> ${breedDetails.affection_level}/5</p>
          <p><strong>Child Friendly:</strong> ${breedDetails.child_friendly}/5</p>
          <p><strong>Energy Level:</strong> ${breedDetails.energy_level}/5</p>
        </div>
      </div>
    `;

    infoDump.appendChild(infoSection);
    Carousel.start(); // Restart carousel with new images
  } catch (error) {
    console.error("Error fetching breed information:", error);
  }
}

/**
 * Function: initializeCarousel
 * - Starts the carousel auto-sliding through images.
 */
let carouselInterval;
function initializeCarousel() {
  const carousel = document.getElementById("carousel");
  const items = carousel.getElementsByClassName("carousel-item");

  // Clear existing interval if running
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }

  if (items.length > 0) {
    items[0].classList.add("active"); // Mark first item as active
    let currentIndex = 0;

    // Set interval for automatic sliding
    carouselInterval = setInterval(() => {
      items[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % items.length;
      items[currentIndex].classList.add("active");
    }, 3000);
  }
}

// Ensure carousel stops when user leaves page
window.addEventListener("unload", () => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
});

/**
 * Function: favourite
 * - Toggles an image as a favorite.
 * - Uses Axios to post/delete favorites from The Cat API.
 */
export async function favourite(imgId) {
  // Placeholder: Implement favorite toggle using Axios
}

/**
 * Function: getFavourites
 * - Fetches and displays all favorited images.
 * - Clears carousel and replaces content with favorites.
 */
async function getFavourites() {
  // Placeholder: Implement fetching favorites using Axios
}

// Add event listener for favorites button
getFavouritesBtn.addEventListener("click", getFavourites);

/**
 * Final Testing Notes:
 * - Ensure different breeds load correctly, including Malayan.
 * - Verify breeds with missing data do not break the site.
 * - Check favorite functionality once implemented.
 */
