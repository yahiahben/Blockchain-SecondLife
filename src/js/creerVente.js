// Vérifie la disponibilité d'Ethereum et initialise Web3
(async () => {
    try {
        if (typeof window.ethereum !== 'undefined') {
            const web3 = new Web3(window.ethereum);

            // Adresse du contrat connecté au portefeuille
            const contractConnectWalletAddress = '0x195f078e082a4efd1ceef8544f3c8659cb8bd113';

            // Assure que l'ABI correspond à celui de votre contrat
            const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);

            // Ajoute un événement de clic pour déclencher l'ajout de vente
            document.getElementById('createSaleForm').addEventListener('submit', async (event) => {
                event.preventDefault();

                const saleInfo = {
                    titre: document.getElementById('titre').value,
                    description: document.getElementById('description').value,
                    prix: parseInt(document.getElementById('prix').value),
                    stock: parseInt(document.getElementById('stock').value),
                    photoId: parseInt(document.getElementById('photoId').value),
                };

                // Demande à l'utilisateur de se connecter au portefeuille
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log('Compte utilisateur:', account);

                // Utilise une fonction utilitaire pour effectuer la transaction
                await addSaleTransaction(contract, saleInfo, account);
            });
        } else {
            console.error('Ethereum non détecté. Veuillez installer MetaMask ou un autre portefeuille compatible.');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        alert("Une erreur s'est produite.");
    }
})();

// Fonction utilitaire pour effectuer la transaction d'ajout de vente
async function addSaleTransaction(contract, saleInfo, account) {
    try {
        // Vérifie que le contrat possède une fonction pour ajouter une vente
        const result = await contract.methods.creerVente(
            saleInfo.titre,
            saleInfo.description,
            saleInfo.prix,
            saleInfo.stock,
            saleInfo.photoId
        ).send({ from: account });

        // Affiche le reçu de transaction
        console.log('Reçu de transaction:', result);
        alert("Vente ajoutée avec succès");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de l\'ajout de la vente.', error);
        alert("Une erreur s'est produite lors de l'ajout de la vente.");
    }
}
