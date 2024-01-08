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

            // Ajoutez un événement de clic pour déclencher la vérification de l'appartenance de l'article à l'acheteur
            document.getElementById('checkArticleAppartientAcheteurBtn').addEventListener('click', async (event) => {
                event.preventDefault();
                
                const venteID = parseInt(document.getElementById('VenteID').value);

                // Demandez à l'utilisateur de se connecter au portefeuille
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log('Account:', account);

                // Utilisez une fonction d'utilité pour vérifier si l'article appartient à l'acheteur
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

// Utilisez une fonction d'utilité pour vérifier si l'article appartient à l'acheteur
async function checkArticleAppartientAcheteur(contract, venteID, account) {
    try {
        // Assurez-vous que votre contrat possède une fonction pour vérifier si l'article appartient à l'acheteur
        const result = await contract.methods.articleAppartientAcheteur(account, venteID).call();

        console.log('L\'article appartient à l\'acheteur:', result);
        alert(result ? "L'article appartient à l'acheteur." : "L'article n'appartient pas à l'acheteur.");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la vérification de l\'appartenance de l\'article à l\'acheteur.', error);
        alert("Une erreur s'est produite lors de la vérification de l'appartenance de l'article à l'acheteur.");
    }
}
