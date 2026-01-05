let livres = [];
let rotationActuelle = 0;

function ajouterLivre() {
  const input = document.getElementById("nouveauLivre");
  const titre = input.value.trim();

  if (titre === "") {
    alert("Ajoute un titre de livre 😊");
    return;
  }

  livres.push(titre);
  input.value = "";

  alert(`📚 "${titre}" ajouté à la roue !`);
}

function tournerRoue() {
  if (livres.length === 0) {
    alert("Ajoute au moins un livre avant de lancer la roue !");
    return;
  }

  const roue = document.getElementById("roue");
  const rotation = Math.floor(Math.random() * 360) + 720;
  rotationActuelle += rotation;

  roue.style.transform = `rotate(${rotationActuelle}deg)`;

  setTimeout(() => {
    const index = Math.floor(Math.random() * livres.length);
    document.getElementById("resultat").textContent =
      "📖 Ta prochaine lecture : " + livres[index];
  }, 3000);
}
