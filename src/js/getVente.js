// Vérifie la disponibilité d'Ethereum et initialise Web3
(async () => {
    try {
        if (typeof window.ethereum !== 'undefined') {
            const web3 = new Web3(window.ethereum);
            
            // Adresse du contrat connecté au portefeuille
            const contractConnectWalletAddress = '0x791A4c2BA9caE47eDe652b2F525E3Ae82CB2d13e';

            // Assure que l'ABI correspond à celui de votre contrat
            const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);

            // Ajoute un événement de clic pour déclencher la récupération des détails de la vente
            document.getElementById('getVenteBtn').addEventListener('click', async (event) => {
                event.preventDefault();
                
                const venteID = parseInt(document.getElementById('VenteID').value);

                // Utilise une fonction utilitaire pour récupérer les détails de la vente
                await getVenteDetails(contract, venteID);
            });
        } else {
            console.error('Ethereum non détecté. Veuillez installer MetaMask ou un autre portefeuille compatible.');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        alert("Une erreur s'est produite.");
    }
})();

// Fonction utilitaire pour récupérer les détails de la vente
async function getVenteDetails(contract, venteID) {
    try {
        // Vérifie que le contrat possède une fonction pour récupérer les détails de la vente
        const result = await contract.methods.getVente(venteID).call();

        // Affiche les détails de la vente récupérés
        console.log('Détails de la vente:', result);
        alert("Détails de la vente récupérés avec succès");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des détails de la vente.', error);
        alert("Une erreur s'est produite lors de la récupération des détails de la vente.");
    }
}
