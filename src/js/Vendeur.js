// Vérifie la disponibilité d'Ethereum et initialise Web3
(async () => {
    try {
        if (typeof window.ethereum !== 'undefined') {
            // Utilise window.ethereum pour initialiser Web3
            const web3 = new Web3(window.ethereum);
            
            // Obtient l'adresse du contrat connecté au portefeuille
            const contractConnectWalletAddress = '0x195f078e082a4efd1ceef8544f3c8659cb8bd113';

            // Assure que l'ABI correspond à celui de votre contrat
            const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);

            // Ajoute un événement de clic pour déclencher la récupération du vendeur
            document.getElementById('getVendeurBtn').addEventListener('click', async (event) => {
                event.preventDefault();
                
                const addressVendeur = document.getElementById('VendeurAddress').value;

                // Utilise la fonction utilitaire pour récupérer les informations du vendeur
                await getVendeurDetails(contract, addressVendeur);
            });

            // Ajoute un événement de clic pour déclencher la définition du vendeur
            document.getElementById('setVendeurBtn').addEventListener('click', async (event) => {
                event.preventDefault();

                const addressVendeur = document.getElementById('VendeurAddress').value;
                const nomVendeur = document.getElementById('VendeurNom').value;

                // Demande à l'utilisateur de se connecter au portefeuille
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log('Account:', account);

                // Utilise la fonction utilitaire pour définir le vendeur
                await setVendeurTransaction(contract, addressVendeur, nomVendeur, account);
            });
        } else {
            console.error('Ethereum non détecté. Veuillez installer MetaMask ou un autre portefeuille compatible.');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        alert("Une erreur s'est produite.");
    }
})();

// Fonction utilitaire pour récupérer les informations du vendeur
async function getVendeurDetails(contract, addressVendeur) {
    try {
        // Assure que votre contrat possède une fonction pour récupérer les informations du vendeur
        const result = await contract.methods.getVendeur(addressVendeur).call();

        // Affiche les informations du vendeur
        console.log('Informations du vendeur:', result);
        alert("Informations du vendeur récupérées avec succès");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des informations du vendeur.', error);
        alert("Une erreur s'est produite lors de la récupération des informations du vendeur.");
    }
}

// Fonction utilitaire pour définir le vendeur
async function setVendeurTransaction(contract, addressVendeur, nomVendeur, account) {
    try {
        // Assure que votre contrat possède une fonction pour définir le vendeur
        const result = await contract.methods.setVendeur(addressVendeur, nomVendeur).send({ from: account });

        // Affiche le reçu de la transaction
        console.log('Transaction receipt:', result);
        alert("Vendeur défini avec succès");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la définition du vendeur.', error);
        alert("Une erreur s'est produite lors de la définition du vendeur.");
    }
}
