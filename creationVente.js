const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const description = document.querySelector("#description").value;
  const prix = document.querySelector("#prix").value;
  const stock = document.querySelector("#stock").value;
  const photo = document.querySelector("#photo").value;

  // Vérifie que les données sont valides
  if (description.length === 0) {
    alert("La description est obligatoire.");
    return;
  }

  if (prix <= 0) {
    alert("Le prix doit être supérieur à 0.");
    return;
  }

  if (stock <= 0) {
    alert("Le stock doit être supérieur à 0.");
    return;
  }

  // Vérifie que l'adresse IPFS est valide
  if (!ipfs.validate(photo)) {
    alert("L'adresse IPFS n'est pas valide.");
    return;
  }

  // Crée l'article
  const contract = new web3.eth.contract(JSON.parse("contract.json"));
  contract.methods.creerVente(description, prix, stock, photo).send();

  // Affiche un message de confirmation
  alert("Article créé avec succès !");
});
