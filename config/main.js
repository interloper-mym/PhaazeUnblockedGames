var sitename = "Bens Unblocked Games";
var subtext = "v1.2";

document.title = document.title + " | " + sitename;

let gamesData = [];

// DISPLAY GAMES
function displayGames(list) {
  const container = document.getElementById("gamesContainer");
  container.innerHTML = "";

  list.forEach((game) => {
    const div = document.createElement("div");
    div.className = "game";

    const img = document.createElement("img");
    img.src = `photos/${game.image}`;
    img.alt = game.name;

    img.onclick = () => {
      window.location.href = `play.html?game=${game.path}`;
    };

    const title = document.createElement("p");
    title.textContent = game.name;

    div.appendChild(img);
    div.appendChild(title);
    container.appendChild(div);
  });
}

// SEARCH
function handleSearch() {
  const value = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  const filtered = gamesData.filter((g) =>
    g.name.toLowerCase().includes(value)
  );

  displayGames(filtered);
}

// CATEGORY FILTER
function filterCategory(cat) {
  if (cat === "all") {
    displayGames(gamesData);
    return;
  }

  const filtered = gamesData.filter((g) => g.category === cat);
  displayGames(filtered);
}

window.filterCategory = filterCategory;

// LOAD JSON
fetch("config/games.json")
  .then((res) => res.json())
  .then((data) => {
    gamesData = data;
    displayGames(gamesData);
  })
  .catch((err) => console.error("Error loading games.json:", err));

// EVENTS
document
  .getElementById("searchInput")
  .addEventListener("input", handleSearch);

document.getElementById("title").textContent = sitename;
document.getElementById("subtitle").textContent = subtext;
