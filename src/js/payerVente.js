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

            // Ajoutez un événement de clic pour déclencher le paiement de la vente
            document.getElementById('paySaleBtn').addEventListener('click', async (event) => {
                event.preventDefault();
                
                const venteID = parseInt(document.getElementById('VenteID').value);

                // Demandez à l'utilisateur de se connecter au portefeuille
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log('Account:', account);

                // Utilisez une fonction d'utilité pour effectuer le paiement de la vente
                await payerVenteTransaction(contract, venteID, account);
            });
        } else {
            console.error('Ethereum non détecté. Veuillez installer MetaMask ou un autre portefeuille compatible.');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        alert("Une erreur s'est produite.");
    }
})();

// Utilisez une fonction d'utilité pour effectuer le paiement de la vente
async function payerVenteTransaction(contract, venteID, account) {
    try {
        // Assurez-vous que votre contrat possède une fonction pour payer une vente
        const result = await contract.methods.payerVente(venteID).send({ from: account, value: web3.utils.toWei('1', 'ether') });

        console.log('Transaction receipt:', result);
        alert("Paiement effectué avec succès");
    } catch (error) {
        console.error('Une erreur s\'est produite lors du paiement de la vente.', error);
        alert("Une erreur s'est produite lors du paiement de la vente.");
    }
}