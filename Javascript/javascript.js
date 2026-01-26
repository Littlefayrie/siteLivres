let livres = [];
let rotationActuelle = 0;
const colors = [
  "#e0f7fa",
  "#b2ebf2",
  "#80deea",
  "#4dd0e1",
  "#26c6da",
  "#00bcd4",
  "#00acc1",
  "#0097a7",
  "#00838f",
  "#006064",
];
// Palette harmonieuse avec le thème (bleu/vert d'eau)

function genererHeaderFooter() {
  const headerHTML = `
    <header>
        <h1 class="Titre">Mon Univers Livresque</h1>
        <nav class="liens">
            <a href="index.html">Accueil</a>
            <a href="pal.html">Ma PAL</a>
            <a href="challenge.html">Challenge</a>
        </nav>
    </header>`;

  const footerHTML = `
    <footer>
        <p class="couleur">© 2026 - Site de Livres. Fait avec passion.</p>
    </footer>`;

  document.body.insertAdjacentHTML("afterbegin", headerHTML);
  document.body.insertAdjacentHTML("beforeend", footerHTML);
}

function ajouterLivre() {
  const input = document.getElementById("nouveauLivre");
  const titre = input.value.trim();

  if (titre === "") {
    alert("Ajoute un titre de livre 😊");
    return;
  }

  livres.push(titre);
  input.value = "";
  updateRoue();
}

function updateRoue() {
  const roue = document.getElementById("roue");
  if (!roue) return; // Sécurité : on arrête si la roue n'existe pas sur cette page
  roue.innerHTML = ""; // Vider la roue
  const nbLivres = livres.length;

  if (nbLivres === 0) {
    roue.style.background = "#5b7cab";
    return;
  }

  const step = 360 / nbLivres;
  let gradientParts = [];

  for (let i = 0; i < nbLivres; i++) {
    const color = colors[i % colors.length];
    const startDeg = i * step;
    const endDeg = (i + 1) * step;
    gradientParts.push(`${color} ${startDeg}deg ${endDeg}deg`);

    // Ajout du label
    const label = document.createElement("div");
    label.className = "roue-label";
    const labelAngle = startDeg + step / 2 - 90; // -90 car 0deg est à droite en CSS transform
    label.style.transform = `rotate(${labelAngle}deg)`;

    const span = document.createElement("span");
    span.textContent = livres[i];
    // On inverse le texte si on est sur la partie gauche pour la lisibilité ?
    // Pour l'instant on garde simple, le texte rayonne depuis le centre

    label.appendChild(span);
    roue.appendChild(label);
  }

  roue.style.background = `conic-gradient(${gradientParts.join(", ")})`;
}

function tournerRoue() {
  if (livres.length === 0) {
    alert("Ajoute au moins un livre avant de lancer la roue !");
    return;
  }

  const btn = document.getElementById("btnLancer");
  const resultDiv = document.getElementById("resultat");
  btn.disabled = true;
  resultDiv.textContent = "La roue tourne...";

  // Rotation aléatoire : au moins 5 tours (1800deg) + aléatoire
  const randomDeg = Math.floor(Math.random() * 360);
  const totalRotation = rotationActuelle + 1800 + randomDeg;

  // On s'assure que rotationActuelle augmente toujours pour que ça tourne dans le même sens
  rotationActuelle = totalRotation;

  const roue = document.getElementById("roue");
  // Rotation sens horaire
  roue.style.transform = `rotate(${rotationActuelle}deg)`;

  setTimeout(() => {
    btn.disabled = false;

    // Calcul du gagnant
    // La flèche est statique en haut (0deg).
    // La roue a tourné de `rotationActuelle`.
    // La position 0 de la roue est maintenant à `rotationActuelle % 360`.
    // L'élément sous la flèche (0deg global) est celui qui était à `(360 - (rotationActuelle % 360)) % 360` au départ.

    const actualDeg = rotationActuelle % 360;
    const winningAngle = (360 - actualDeg) % 360;
    const sliceSize = 360 / livres.length;

    const index = Math.floor(winningAngle / sliceSize);

    // Protection contre index hors bornes (arrondi)
    const safeIndex = index >= livres.length ? 0 : index;

    resultDiv.textContent = `📖 Lecture choisie : ${livres[safeIndex]}`;

    // Animation de célébration optionnelle
  }, 4000); // Correspond à la durée css transition (4s)
}

// Initialisation au chargement
document.addEventListener("DOMContentLoaded", () => {
  genererHeaderFooter();
  updateRoue();
});

/* ajout pour ma page challenge */ 
const cases = document.querySelectorAll(".case");

cases.forEach(caseBingo => {
  caseBingo.addEventListener("click", () => {
    caseBingo.classList.toggle("active");
  });
});
