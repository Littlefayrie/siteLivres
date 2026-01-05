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
