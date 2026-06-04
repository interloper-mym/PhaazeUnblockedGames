var sitename = "Phaaze Unblocked Games";
var subtext = "v1.0";

document.title = document.title + " | " + sitename;

let gamesData = [];

// =======================
// DISPLAY GAMES
// =======================
function displayGames(list) {
  const container = document.getElementById("gamesContainer");
  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML = "<p>No games found</p>";
    return;
  }

  list.forEach((game) => {
    const div = document.createElement("div");
    div.className = "game";

    // WRAPPER (for badge positioning)
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";

    const img = document.createElement("img");

    // SAFE IMAGE HANDLING
    if (!game.image) {
      img.src = "photos/placeholder.png";
    } else if (game.image.startsWith("http")) {
      img.src = game.image;
    } else {
      img.src = game.image.startsWith("photos/")
        ? game.image
        : `photos/${game.image}`;
    }

    img.alt = game.name;

    img.onerror = () => {
      img.src = "photos/placeholder.png";
    };

    img.onclick = () => {
      if (game.path) {
        window.location.href = `play.html?gameurl=${game.path}`;
      }
    };

    const title = document.createElement("p");
    title.textContent = game.name;

    // =======================
    // NEW BADGE (ADDED PART)
    // =======================
    if (game.new === true) {
      const badge = document.createElement("div");
      badge.textContent = "NEW";
      badge.style.position = "absolute";
      badge.style.top = "8px";
      badge.style.left = "8px";
      badge.style.background = "red";
      badge.style.color = "white";
      badge.style.padding = "4px 8px";
      badge.style.fontSize = "12px";
      badge.style.fontWeight = "bold";
      badge.style.borderRadius = "6px";
      badge.style.zIndex = "10";

      wrapper.appendChild(badge);
    }

    wrapper.appendChild(img);

    div.appendChild(wrapper);
    div.appendChild(title);
    container.appendChild(div);
  });
}

// =======================
// SEARCH
// =======================
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

// =======================
// CATEGORY FILTER
// =======================
function filterCategory(cat) {
  if (cat === "all") {
    displayGames(gamesData);
    return;
  }

  const filtered = gamesData.filter(
    (g) => (g.category || "game") === cat
  );

  displayGames(filtered);
}

window.filterCategory = filterCategory;

// =======================
// LOAD JSON
// =======================
fetch("./config/games.json")
  .then((res) => res.json())
  .then((data) => {
    console.log("Loaded games:", data);
    gamesData = data;
    displayGames(gamesData);
  })
  .catch((err) => {
    console.error("Error loading games.json:", err);
  });

// =======================
// EVENTS
// =======================
document
  .getElementById("searchInput")
  .addEventListener("input", handleSearch);

document.getElementById("title").textContent = sitename;
document.getElementById("subtitle").textContent = subtext;
