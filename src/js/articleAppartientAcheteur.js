// Vérifie la disponibilité d'Ethereum et initialise Web3
(async () => {
    try {
        if (typeof window.ethereum !== 'undefined') {
            const web3 = new Web3(window.ethereum);
            
            // Adresse du contrat connecté au portefeuille
            const contractConnectWalletAddress = '0x791A4c2BA9caE47eDe652b2F525E3Ae82CB2d13e';

            // Vérifie que l'ABI correspond à celui de votre contrat
            const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);

            // Ajoute un événement de clic pour vérifier l'appartenance de l'article à l'acheteur
            document.getElementById('checkArticleAppartientAcheteurBtn').addEventListener('click', async (event) => {
                event.preventDefault();
                
                // Récupère l'ID de la vente depuis le formulaire
                const venteID = parseInt(document.getElementById('VenteID').value);

                // Demande à l'utilisateur de se connecter au portefeuille
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log('Compte utilisateur:', account);

                // Utilise une fonction utilitaire pour vérifier si l'article appartient à l'acheteur
                await checkArticleAppartientAcheteur(contract, venteID, account);
            });
        } else {
            console.error('Ethereum non détecté. Veuillez installer MetaMask ou un autre portefeuille compatible.');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        alert("Une erreur s'est produite.");
    }
})();

// Fonction utilitaire pour vérifier si l'article appartient à l'acheteur
async function checkArticleAppartientAcheteur(contract, venteID, account) {
    try {
        // Vérifie si le contrat possède une fonction pour cette vérification
        const result = await contract.methods.articleAppartientAcheteur(account, venteID).call();

        // Affiche le résultat de la vérification
        console.log('L\'article appartient à l\'acheteur:', result);
        alert(result ? "L'article appartient à l'acheteur." : "L'article n'appartient pas à l'acheteur.");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la vérification de l\'appartenance de l\'article à l\'acheteur.', error);
        alert("Une erreur s'est produite lors de la vérification de l'appartenance de l'article à l'acheteur.");
    }
}
