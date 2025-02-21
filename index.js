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

    // Create and append options for each breed
    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading cat breeds:", error);
  }
  if (breeds.length>0) {
    getBreedInfo({ target: { value: breeds[0].id } })
  } else {
    console.error("No breeds found.");
  }
  }


// Wait for DOM to load before executing
// document.addEvenListener("DOMContentLoaded", () => {
  // initialLoad();
// });
document.addEventListener("DOMContentLoaded", initialLoad)

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */


    // Fetch images for the selected breed

    async function getBreedInfo(e) {
      try {
        const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${e.target.value}&api_key=${API_KEY}`)
        const breedInfo = await response.json();  

        const infoDump = document.getElementById("infoDump");
        const  carouselContent = document.getElementById("carouselInner")

        infoDump.innerHTML= ""
        Carousel.clear();
        
       if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(response);
        // return breedInfo;
      


    // Create carousel items

    breedInfo.forEach((image) => {
      
     const carouselItem = Carousel.createCarouselItem(image.url,image.name,image.id)
      Carousel.appendCarousel(carouselItem)
    });
    
    // Add breed information to infoDump
  
    // const breedInfo = images[0]?.breeds?.[0];
    if (!breedInfo) {
      throw new Error("No breed information found");
    }
    const infoSection = document.createElement("div");
    infoSection.breedInfo = "breed-info";

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
    Carousel.start();
  }catch (error) {
      console.error('Error fetching breed information:', error);
      throw error;
    }
  }

    // Initialize carousel functionality
   window.addEventListener('unload', () => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
});

// Function to handle carousel functionality
let carouselInterval; // Add this at the top of your file

function initializeCarousel() {
  const carousel = document.getElementById("carousel");
  const items = carousel.getElementsByClassName("carousel-item");

  // Clear any existing interval
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }

  if (items.length > 0) {
    items[0].classList.add("active");
    let currentIndex = 0;

    // Store the interval reference
    carouselInterval = setInterval(() => {
      items[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % items.length;
      items[currentIndex].classList.add("active");
    }, 3000);
  }
}

// Update your initialLoad function to add the event listener and trigger initial load

// async function initialLoad() {
  const breedSelect = document.getElementById("breedSelect");
  
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

    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    // Add event listener for breed selection
    breedSelect.addEventListener("change", getBreedInfo);

    // Trigger initial load with first breed
   
    if (breeds.length > 0) {
      breedSelect.value = breeds[0].id;
      const event = new Event("change");
      breedSelect.dispatchEvent(event);

    }
  } catch (error) {
    console.error("Error loading cat breeds:", error);
  }


//  * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
//  */ (see axios_script.js)
/**
 * 
 * 
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */