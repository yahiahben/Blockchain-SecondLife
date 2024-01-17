// Initialise Web3 si Ethereum est disponible
const contractConnectWalletAddress =
  "0x195f078e082a4efd1ceef8544f3c8659cb8bd113";

// Créez le contrat en dehors de la fonction anonyme
const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);

// Fonction pour récupérer les articles achetés
async function getArticlesAchetes() {
  try {
    // Demande à l'utilisateur de se connecter au portefeuille
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    console.log("Compte utilisateur:", account);

    // Assurez-vous que votre contrat possède une fonction pour obtenir les articles achetés
    const articlesAchetesIDs = await contract.methods
      .getArticlesAchetes(account)
      .call();

    // Affiche l'id des articles achetés récupérés
    console.log("Articles achetés IDs:", articlesAchetesIDs);
    // Affiche les détails de chaque article acheté
    for (let i = 0; i < articlesAchetesIDs.length; i++) {
        const venteID = articlesAchetesIDs[i];
        const details = await contract.methods
          .getDetailsArticleAchete(account, venteID)
          .call();
        console.log(`Détails de l'article acheté (ID ${venteID}):`, details);
  
        // Ajouter du code pour afficher les détails dans le frontend
        const detailsContainer = document.getElementById("articlesAchetesSection");
        const articleDetails = document.createElement("div");
        articleDetails.innerHTML = `
          <p>Détails de l'article (ID ${venteID}):</p>
          <p>Photo ID: ${details[5]}</p>
          <p>Titre: ${details[0]}</p>
          <p>Description: ${details[1]}</p>
          <p>Prix: ${details[2]}</p>
          <p>Stock: ${details[3]}</p>
          <hr>
        `;
        detailsContainer.appendChild(articleDetails);
      }

    alert("ID Articles achetés récupérés avec succès");
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des articles achetés.",
      error
    );
    alert(
      "Une erreur s'est produite lors de la récupération des articles achetés."
    );
  }
}

// Appeler la fonction pour récupérer les articles achetés lors du chargement de la page
window.addEventListener("load", async () => {
  await getArticlesAchetes();
});

// Fonction pour récupérer les détails d'un article acheté
async function getArticleAcheteDetails() {
  try {
    // Récupérer l'adresse du compte connecté
    const account = ethereum.selectedAddress;

    // Vérifier que l'adresse du compte est définie
    if (!account) {
      console.error("Adresse du compte non définie.");
      alert("Adresse du compte non définie.");
      return;
    }

    // Demander à l'utilisateur de se connecter au portefeuille si ce n'est pas déjà fait
    if (!account) {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      account = accounts[0];
    }

    // Vérifie que le contrat possède une fonction pour récupérer les détails de l'article acheté
    const result = await contract.methods
      .getDetailsArticleAchete(account, venteID)
      .call();

    // Extract les détails de l'article acheté du tableau retourné
    const [titre, description, prix, stock, photoId] = result;

    // Affiche les détails de l'article acheté récupérés
    console.log("Détails de l'article acheté:");
    console.log("Titre:", titre);
    console.log("Description:", description);
    console.log("Prix:", prix);
    console.log("Stock:", stock);
    console.log("Photo ID:", photoId);

    alert("Détails de l'article acheté récupérés avec succès");
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des détails de l'article acheté.",
      error
    );
    alert(
      "Une erreur s'est produite lors de la récupération des détails de l'article acheté."
    );
  }
}

// Vérifie la disponibilité d'Ethereum et initialise Web3
(async () => {
  try {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);

      // Adresse du contrat connecté au portefeuille
      const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);

      // Ajoute un événement de clic pour déclencher la récupération des articles achetés
      document
        .getElementById("getArticlesAchetesBtn")
        .addEventListener("click", getArticlesAchetes);

      // Ajoute un événement de clic pour déclencher la récupération des détails de l'article acheté
      document
        .getElementById("getArticleAcheteBtn")
        .addEventListener("click", async (event) => {
          event.preventDefault();

          const venteID = parseInt(document.getElementById("VenteID").value);

          // Demande à l'utilisateur de se connecter au portefeuille
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          const account = accounts[0];
          console.log("Compte utilisateur:", account);

          // Utilise une fonction utilitaire pour récupérer les détails de l'article acheté
          await getArticleAcheteDetails(contract, venteID, account);
        });
    } else {
      console.error(
        "Ethereum non détecté. Veuillez installer MetaMask ou un autre portefeuille compatible."
      );
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    alert("Une erreur s'est produite.");
  }
})();
