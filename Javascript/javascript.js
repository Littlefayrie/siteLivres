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

const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

function genererHeaderFooter() {
  // Détection automatique du chemin pour que les liens marchent partout
  const estDansDossierHtml = window.location.pathname.toLowerCase().includes("/html/");
  const basePath = estDansDossierHtml ? "../" : "./";

  const headerHTML = `
    <header>
        <button class="hamburger" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <h1 class="Titre">Mon Univers Livresque</h1>
        <nav class="liens">
            <a href="${basePath}index.html">Accueil</a>
            <a href="${basePath}html/3annotation.html">Mes Annotations</a>
            <a href="${basePath}html/4mapal.html">Ma PAL</a>
            <a href="${basePath}html/5wishlist.html">Ma Wishlist</a>
            <a href="${basePath}html/challenge%20.html">Challenge</a>
            <a href="${basePath}html/avis.html">Avis</a>
            <a href="${basePath}html/contact.html">Contact</a>
        </nav>
    </header>
    <button id="btnTheme" class="theme-btn" aria-label="Changer de thème">${moonIcon}</button>`;

  const footerHTML = `
    <footer>
        <div class="footer-links">
            <a href="${basePath}index.html">Accueil</a>
            <a href="${basePath}html/3annotation.html">Annotations</a>
            <a href="${basePath}html/4mapal.html">PAL</a>
            <a href="${basePath}html/5wishlist.html">Wishlist</a>
            <a href="${basePath}html/challenge%20.html">Challenge</a>
            <a href="${basePath}html/avis.html">Avis</a>
            <a href="${basePath}html/chronomettre.html">Chronomètre</a>
            <a href="${basePath}html/contact.html">Contact</a>
        </div>
        <div class="footer-action">
            <a href="${basePath}html/chronomettre.html" class="btn-footer-chrono">Lancer une session lecture ⏱️</a>
        </div>
        <p class="couleur">© 2026 - Site de Livres. Fait avec passion.</p>
    </footer>`;

  document.body.insertAdjacentHTML("afterbegin", headerHTML);
  document.body.insertAdjacentHTML("beforeend", footerHTML);
  initTheme();
  initMobileMenu();
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

    // Ouverture de la modale de résultat
    const modal = document.getElementById("roueModal");
    const resultText = document.getElementById("roueResultatText");
    
    if (modal && resultText) {
      resultText.textContent = livres[safeIndex];
      modal.dataset.selectedIndex = safeIndex;
      modal.classList.add("open");
    }

    // Animation de célébration optionnelle
  }, 4000); // Correspond à la durée css transition (4s)
}

function initTheme() {
  const btn = document.getElementById("btnTheme");
  const themeActuel = localStorage.getItem("theme");

  if (themeActuel === "light") {
    document.body.classList.add("light-mode");
    if (btn) btn.innerHTML = sunIcon;
  }

  if (btn) {
    btn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      const estLight = document.body.classList.contains("light-mode");
      btn.innerHTML = estLight ? sunIcon : moonIcon;
      localStorage.setItem("theme", estLight ? "light" : "dark");
    });
  }
}

function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".liens");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      nav.classList.toggle("open");
    });
  }
}

function initChrono() {
  const display = document.getElementById("chrono-display");
  if (!display) return; // On n'est pas sur la page chrono

  // Injection de la modale personnalisée (style bleu et noir)
  if (!document.getElementById("chronoModal")) {
    const modalHTML = `
      <div id="chronoModal" class="modal-overlay">
        <div class="modal-card">
          <h3>Session terminée ! 📖</h3>
          <p style="margin-bottom: 20px; color: #c5dbf5; font-size: 1.1rem;">Voulez-vous configurer une pause de 5 minutes ?</p>
          <div style="display: flex; justify-content: center; gap: 15px;">
            <button id="btnChronoYes" class="modal-btn">Oui, pause !</button>
            <button id="btnChronoNo" class="modal-btn" style="background-color:#d9534f;">Non</button>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  const rangeInput = document.getElementById("pomodoroRange");
  const rangeValue = document.getElementById("rangeValue");
  const btnStart = document.getElementById("btnStart");
  const btnPause = document.getElementById("btnPause");
  const btnReset = document.getElementById("btnReset");

  // Éléments de la modale
  const chronoModal = document.getElementById("chronoModal");
  const btnYes = document.getElementById("btnChronoYes");
  const btnNo = document.getElementById("btnChronoNo");

  let timeLeft = parseInt(rangeInput.value) * 60;
  let interval = null;
  let isRunning = false;

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const updateDisplay = () => {
    display.textContent = formatTime(timeLeft);
  };

  // Initialisation
  updateDisplay();

  // Mise à jour quand on bouge le curseur
  rangeInput.addEventListener("input", (e) => {
    if (!isRunning) {
      const minutes = parseInt(e.target.value);
      rangeValue.textContent = minutes;
      timeLeft = minutes * 60;
      updateDisplay();
    }
  });

  // Gestion de la modale personnalisée
  const closeChronoModal = () => {
    chronoModal.classList.remove("open");
  };

  btnYes.onclick = () => {
    rangeInput.value = 5;
    rangeValue.textContent = "5";
    timeLeft = 5 * 60;
    updateDisplay();
    closeChronoModal();
  };

  btnNo.onclick = closeChronoModal;

  btnStart.addEventListener("click", () => {
    if (isRunning) return;
    if (timeLeft <= 0) {
      // Si on est à 0, on remet le temps du slider
      timeLeft = parseInt(rangeInput.value) * 60;
    }

    isRunning = true;
    rangeInput.disabled = true; // Bloque le slider pendant le chrono

    interval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(interval);
        isRunning = false;
        rangeInput.disabled = false;
        // Ouvre la modale personnalisée au lieu de l'alerte navigateur
        chronoModal.classList.add("open");
      }
    }, 1000);
  });

  btnPause.addEventListener("click", () => {
    if (isRunning) {
      clearInterval(interval);
      isRunning = false;
      rangeInput.disabled = false;
    }
  });

  btnReset.addEventListener("click", () => {
    if (interval) clearInterval(interval);
    isRunning = false;
    rangeInput.disabled = false;
    
    // Remet le temps selon le slider
    const minutes = parseInt(rangeInput.value);
    timeLeft = minutes * 60;
    updateDisplay();
  });
}

// Initialisation au chargement
document.addEventListener("DOMContentLoaded", () => {
  genererHeaderFooter();
  updateRoue();
  initBingo();
  initChrono();
  initRoueInteraction();
});

/* ajout pour ma page challenge */ 
function initBingo() {
  const bingoContainer = document.querySelector(".bingo");
  if (!bingoContainer) return;

  // 1. Injecter l'interface d'ajout (Input + Boutons)
  if (!document.getElementById("bingoControls")) {
    const controlsHTML = `
      <div id="bingoControls" class="ajout-livre" style="text-align:center; margin-bottom: 20px;">
        <input type="text" id="newBingoInput" placeholder="Nouveau défi..." />
        <button id="btnAddBingo">Ajouter</button>
        <button id="btnResetBingo" style="background-color:#d9534f;">Tout effacer</button>
      </div>`;
    bingoContainer.insertAdjacentHTML("beforebegin", controlsHTML);
  }

  // 2. Gestion des données (LocalStorage)
  let challenges = JSON.parse(localStorage.getItem("bingoData")) || [];

  // Initialisation depuis le HTML existant si localStorage vide (pour ne pas perdre tes cases actuelles au début)
  if (challenges.length === 0) {
    const staticCases = bingoContainer.querySelectorAll(".case");
    if (staticCases.length > 0) {
      staticCases.forEach(c => {
        challenges.push({ text: c.textContent.trim(), active: c.classList.contains("active") });
      });
      localStorage.setItem("bingoData", JSON.stringify(challenges));
    }
  }

  // Fonction de sauvegarde et affichage
  const saveAndRender = () => {
    localStorage.setItem("bingoData", JSON.stringify(challenges));
    renderGrid();
  };

  const renderGrid = () => {
    bingoContainer.innerHTML = "";
    challenges.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = `case ${item.active ? "active" : ""}`;
      div.textContent = item.text;
      div.dataset.index = index; // Pour retrouver l'élément
      bingoContainer.appendChild(div);
    });
  };

  renderGrid();

  // Événements Ajout / Reset
  const btnAdd = document.getElementById("btnAddBingo");
  const btnReset = document.getElementById("btnResetBingo");
  const input = document.getElementById("newBingoInput");

  btnAdd.onclick = () => {
    const text = input.value.trim();
    if (text) {
      challenges.push({ text: text, active: false });
      input.value = "";
      saveAndRender();
    }
  };

  btnReset.onclick = () => {
    if (confirm("Voulez-vous vraiment tout effacer et recommencer à zéro ?")) {
      challenges = [];
      saveAndRender();
    }
  };

  // 3. Modal (Carte en avant)
  if (!document.getElementById("bingoModal")) {
    const modalHTML = `
      <div id="bingoModal" class="modal-overlay">
        <div class="modal-card">
          <span class="close-modal">&times;</span>
          <h3 id="modalText"></h3>
          <button id="btnMissionAccomplie" class="modal-btn">Mission Accomplie !</button>
          <button id="btnDeleteCase" class="modal-btn" style="background-color:#d9534f; margin-top:10px; font-size:0.9rem;">Supprimer ce défi</button>
        </div>
      </div>`;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  const modal = document.getElementById("bingoModal");
  const modalText = document.getElementById("modalText");
  const btnMission = document.getElementById("btnMissionAccomplie");
  const btnDelete = document.getElementById("btnDeleteCase");
  const btnClose = document.querySelector(".close-modal");
  let currentIndex = null;

  const closeModal = () => {
    modal.classList.remove("open");
  };

  // Délégation d'événement sur le conteneur (car les cases sont dynamiques)
  bingoContainer.onclick = (e) => {
    if (e.target.classList.contains("case")) {
      currentIndex = e.target.dataset.index;
      const item = challenges[currentIndex];
      
      modalText.textContent = item.text;
      modal.classList.add("open");

      if (item.active) {
        btnMission.textContent = "Annuler la mission";
        btnMission.style.backgroundColor = "#d9534f"; // Rouge
      } else {
        btnMission.textContent = "Mission Accomplie !";
        btnMission.style.backgroundColor = ""; // Couleur par défaut
      }
    }
  };

  btnMission.onclick = () => {
    if (currentIndex !== null) {
      challenges[currentIndex].active = !challenges[currentIndex].active;
      saveAndRender();
      closeModal();
    }
  };

  // Bouton Supprimer (nouveau)
  btnDelete.onclick = () => {
    if (currentIndex !== null && confirm("Supprimer ce défi ?")) {
      challenges.splice(currentIndex, 1);
      saveAndRender();
      closeModal();
    }
  };

  btnClose.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

function initRoueInteraction() {
  // Injection de la modale pour la roue
  if (!document.getElementById("roueModal")) {
    const modalHTML = `
      <div id="roueModal" class="modal-overlay">
        <div class="modal-card">
          <span class="close-modal" id="closeRoueModal">&times;</span>
          <h3>C'est tombé sur :</h3>
          <p id="roueResultatText" style="color: #c5dbf5; font-size: 1.4rem; margin: 20px 0; font-weight: bold; text-shadow: 0 0 10px rgba(91, 124, 171, 0.3);"></p>
          <button id="btnRoueKeep" class="modal-btn">Garder</button>
          <button id="btnRoueDelete" class="modal-btn" style="background-color:#d9534f; margin-top:10px;">Supprimer de la liste</button>
        </div>
      </div>`;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  const modal = document.getElementById("roueModal");
  const btnKeep = document.getElementById("btnRoueKeep");
  const btnDelete = document.getElementById("btnRoueDelete");
  const btnClose = document.getElementById("closeRoueModal");

  const closeModal = () => {
    modal.classList.remove("open");
  };

  if (btnKeep) btnKeep.onclick = closeModal;
  if (btnClose) btnClose.onclick = closeModal;
  
  if (btnDelete) {
    btnDelete.onclick = () => {
        const index = modal.dataset.selectedIndex;
        if (index !== undefined) {
            livres.splice(index, 1);
            updateRoue();
            closeModal();
            const resultDiv = document.getElementById("resultat");
            if (resultDiv) resultDiv.textContent = "Livre retiré !";
        }
    };
  }

  if (modal) {
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
  }
}
