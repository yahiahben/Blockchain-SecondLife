// Initialise Web3 si Ethereum est disponible
const contractConnectWalletAddress = "0x195f078e082a4efd1ceef8544f3c8659cb8bd113";

// Fonction utilitaire pour effectuer le paiement de la vente
async function payerVenteTransaction(contract, venteID, account) {
  try {

    // Assurez-vous que votre contrat possède une fonction pour payer une vente
    const result = await contract.methods
      .payerVente(venteID)
      .send({ from: account, value: web3.utils.toWei("1", "ether") });

    // Génère le reçu de la transaction au format PDF
    await generateTransactionReceiptPDF(result);

    // Affiche le reçu de la transaction
    console.log("Transaction receipt:", result);
    alert("Paiement effectué avec succès");
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du paiement de la vente.",
      error
    );
    alert("Une erreur s'est produite lors du paiement de la vente.");
  }
}

async function generateTransactionReceiptPDF(result) {

  const receiptContent = `
    <h2>Transaction Receipt</h2>
    </br>
    <p>Block Number: ${result.blockNumber}</p>
    <p>Block Hash: ${result.blockHash}</p> 
    <p>Transaction Hash: ${result.transactionHash}</p>
    <p>Transaction from: ${result.from}</p>
    <p>Transaction to: ${result.to}</p>
    <p>Gas Used: ${result.gasUsed}</p>
  `;

  try {
    // Convertit le contenu HTML en fichier PDF
    const pdfBlob = await html2pdf().from(receiptContent).output('blob');

    // Crée un objet Blob pour le fichier PDF
    const blob = new Blob([pdfBlob], { type: "application/pdf" });

    // Télécharge le fichier PDF
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transaction_receipt.pdf";
    link.click();
} catch (error) {
    console.error("Une erreur s'est produite lors de la génération du fichier PDF.", error);
    alert("Une erreur s'est produite lors de la génération du fichier PDF.");
}
}

// Initialise Web3 avec window.ethereum
const web3 = new Web3(window.ethereum);

// Vérifie la disponibilité d'Ethereum
if (typeof window.ethereum !== "undefined") {
  try {
    // Obtient l'adresse du contrat connecté au portefeuille
    const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);

    // Fonction utilitaire pour récupérer la liste des ventes
    async function getAllVentes(contract) {
      try {
        const ventesCount = await contract.methods.getNombreVentes().call();
        const productsSection = document.getElementById("productsSection");

        for (let i = 0; i < ventesCount; i++) {
          const venteDetails = await contract.methods.getVente(i).call();

          const productDiv = document.createElement("div");
          productDiv.className = "product";

          const img = document.createElement("img");
          const photoId = venteDetails[5];
          const imagePath = `/src/img/photo_${photoId}.png`;
          console.log("Chemin de l'image:", imagePath);
          img.src = imagePath;

          const title = document.createElement("h2");
          title.textContent = venteDetails[0];

          const description = document.createElement("p");
          description.textContent = `Apropos : ${venteDetails[1]} `;

          const quantité = document.createElement("p");
          quantité.textContent = `Quantité disponible : ${venteDetails[2]} `;

          const price = document.createElement("p");
          price.textContent = `Prix : ${venteDetails[3]} ETH`;

          const addButton = document.createElement("button");
          addButton.textContent = "Acheter cet article";

          // Ajoutez l'événement de clic pour déclencher le paiement de la vente
          addButton.addEventListener("click", async () => {
            const accounts = await ethereum.request({
              method: "eth_requestAccounts",
            });
            const account = accounts[0];
            await payerVenteTransaction(contract, i, account);
          });

          productDiv.appendChild(img);
          productDiv.appendChild(title);
          productDiv.appendChild(description);
          productDiv.appendChild(quantité);
          productDiv.appendChild(price);
          productDiv.appendChild(addButton);

          productsSection.appendChild(productDiv);
        }

        console.log("Ventes disponibles affichées.");
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la récupération de toutes les ventes.",
          error
        );
        alert(
          "Une erreur s'est produite lors de la récupération de toutes les ventes."
        );
      }
    }

    // Appeler la fonction pour récupérer toutes les ventes lors du chargement de la page
    window.addEventListener("load", async () => {
      await getAllVentes(contract);
    });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    alert("Une erreur s'est produite.");
  }
} else {
  console.error(
    "Ethereum non détecté. Veuillez installer MetaMask ou un autre portefeuille compatible."
  );
}
