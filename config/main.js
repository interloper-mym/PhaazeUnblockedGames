var sitename = "Bens Unblocked Games";
var subtext = "v1.2";

document.title = `${document.title} | ${sitename}`;

let gamesData = [];

/* RENDER GAMES */
function displayFilteredGames(list) {
  const container = document.getElementById("gamesContainer");
  container.innerHTML = "";

  list.forEach((game) => {
    const div = document.createElement("div");
    div.className = "game";

    const img = document.createElement("img");
    img.src = game.image; // local image path
    img.alt = game.name;

    img.onclick = () => {
      window.location.href = `play.html?gameurl=${game.path}`;
    };

    const name = document.createElement("p");
    name.textContent = game.name;

    div.appendChild(img);
    div.appendChild(name);
    container.appendChild(div);
  });
}

/* SEARCH */
function handleSearchInput() {
  const input = document.getElementById("searchInput").value.toLowerCase();

  if (!Array.isArray(gamesData)) return;

  const filtered = gamesData.filter((g) =>
    g.name.toLowerCase().includes(input)
  );

  displayFilteredGames(filtered);
}

/* LOAD JSON (SAFE) */
fetch("./config/games.json")
  .then((res) => res.text())
  .then((text) => {
    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("games.json is not valid JSON");
    }

    if (!Array.isArray(data)) {
      throw new Error("games.json must be an array []");
    }

    gamesData = data;
    displayFilteredGames(data);
  })
  .catch((err) => console.error("Error loading games.json:", err));

/* EVENTS */
document
  .getElementById("searchInput")
  .addEventListener("input", handleSearchInput);

document.getElementById("title").innerHTML = sitename;
document.getElementById("subtitle").innerHTML = subtext;
