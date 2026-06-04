// This changes the title of your site

var sitename = "Bens Unblocked Games";
var subtext = "v1.2";
// more settings in main.css



// END CONFIG
// DO NOT MODIFY IF YOU DO NOT KNOW WHAT YOUR DOING!

// Optional extra config (only if you actually use it)
import "/./config/custom.js";

var currentPageTitle = document.title;
document.title = `${currentPageTitle} | ${sitename}`;

let gamesData = [];

// -----------------------------
// RENDER GAMES
// -----------------------------
function displayFilteredGames(filteredGames) {
  const gamesContainer = document.getElementById("gamesContainer");
  gamesContainer.innerHTML = "";

  filteredGames.forEach((game) => {
    const gameDiv = document.createElement("div");
    gameDiv.classList.add("game");

    const gameImage = document.createElement("img");

    // ✅ LOCAL IMAGE (NO SERVER)
    gameImage.src = game.image;
    gameImage.alt = game.name;

    gameImage.onclick = () => {
      window.location.href = `play.html?gameurl=${game.path}`;
    };

    const gameName = document.createElement("p");
    gameName.textContent = game.name;

    gameDiv.appendChild(gameImage);
    gameDiv.appendChild(gameName);
    gamesContainer.appendChild(gameDiv);
  });
}

// -----------------------------
// SEARCH SYSTEM
// -----------------------------
function handleSearchInput() {
  const searchInputValue = document
    .getElementById("searchInput")
    .value.toLowerCase();

  const filteredGames = gamesData.filter((game) =>
    game.name.toLowerCase().includes(searchInputValue)
  );

  displayFilteredGames(filteredGames);
}

// -----------------------------
// LOAD JSON
// -----------------------------
fetch("./config/games.json")
  .then((response) => response.json())
  .then((data) => {
    gamesData = data;
    displayFilteredGames(data);
  })
  .catch((error) => console.error("Error fetching games:", error));

// -----------------------------
// EVENTS + UI TEXT
// -----------------------------
document
  .getElementById("searchInput")
  .addEventListener("input", handleSearchInput);

document.getElementById("title").innerHTML = sitename;
document.getElementById("subtitle").innerHTML = subtext;
