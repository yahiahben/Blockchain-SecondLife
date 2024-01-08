// Utilisez une fonction immédiatement invoquée pour encapsuler votre code
(async () => {
    try {
        // Vérifiez si Ethereum est disponible
        if (typeof window.ethereum !== 'undefined') {
            // Utilisez window.ethereum pour initialiser Web3
            const web3 = new Web3(window.ethereum);
            
            // Obtenez l'adresse du contrat connecté au portefeuille
            const contractConnectWalletAddress = '0x791A4c2BA9caE47eDe652b2F525E3Ae82CB2d13e';

            // Assurez-vous que l'ABI correspond à celui de votre contrat
            const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);

            // Ajoutez un événement de clic pour déclencher la récupération du vendeur
            document.getElementById('getVendeurBtn').addEventListener('click', async (event) => {
                event.preventDefault();
                
                const addressVendeur = document.getElementById('VendeurAddress').value;

                // Utilisez une fonction d'utilité pour récupérer les informations du vendeur
                await getVendeurDetails(contract, addressVendeur);
            });

            // Ajoutez un événement de clic pour déclencher la définition du vendeur
            document.getElementById('setVendeurBtn').addEventListener('click', async (event) => {
                event.preventDefault();

                const addressVendeur = document.getElementById('VendeurAddress').value;
                const nomVendeur = document.getElementById('VendeurNom').value;

                // Demandez à l'utilisateur de se connecter au portefeuille
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log('Account:', account);

                // Utilisez une fonction d'utilité pour définir le vendeur
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

// Utilisez une fonction d'utilité pour récupérer les informations du vendeur
async function getVendeurDetails(contract, addressVendeur) {
    try {
        // Assurez-vous que votre contrat possède une fonction pour récupérer les informations du vendeur
        const result = await contract.methods.getVendeur(addressVendeur).call();

        console.log('Informations du vendeur:', result);
        alert("Informations du vendeur récupérées avec succès");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des informations du vendeur.', error);
        alert("Une erreur s'est produite lors de la récupération des informations du vendeur.");
    }
}

// Utilisez une fonction d'utilité pour définir le vendeur
async function setVendeurTransaction(contract, addressVendeur, nomVendeur, account) {
    try {
        // Assurez-vous que votre contrat possède une fonction pour définir le vendeur
        const result = await contract.methods.setVendeur(addressVendeur, nomVendeur).send({ from: account });

        console.log('Transaction receipt:', result);
        alert("Vendeur défini avec succès");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la définition du vendeur.', error);
        alert("Une erreur s'est produite lors de la définition du vendeur.");
    }
}
