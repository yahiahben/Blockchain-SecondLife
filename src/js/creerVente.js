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

            // Ajoutez un événement de clic pour déclencher l'ajout de vente
            document.getElementById('addSaleBtn').addEventListener('click', async (event) => {
                event.preventDefault();
                
                const saleInfo = {
                    photoIPFSHash: document.getElementById('SalePhotoIPFSHash').value,
                    description: document.getElementById('SaleDescription').value,
                    prix: parseInt(document.getElementById('SalePrix').value),
                    stock: parseInt(document.getElementById('SaleStock').value),
                };

                // Demandez à l'utilisateur de se connecter au portefeuille
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log('Account:', account);

                // Utilisez une fonction d'utilité pour effectuer la transaction
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

// Utilisez une fonction d'utilité pour effectuer la transaction
async function addSaleTransaction(contract, saleInfo, account) {
    try {
        // Assurez-vous que votre contrat possède une fonction pour ajouter une vente
        const result = await contract.methods.creerVente(
            saleInfo.photoIPFSHash,
            saleInfo.description,
            saleInfo.prix,
            saleInfo.stock
        ).send({ from: account });

        console.log('Transaction receipt:', result);
        alert("Vente ajoutée avec succès");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de l\'ajout de la vente.', error);
        alert("Une erreur s'est produite lors de l'ajout de la vente.");
    }
}