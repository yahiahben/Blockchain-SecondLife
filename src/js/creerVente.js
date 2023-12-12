var web3 = new Web3(window.ethereum);
const contractConnectWalletAddress = '0x791A4c2BA9caE47eDe652b2F525E3Ae82CB2d13e';
const provider = await detectEthereumProvider();

// Assurez-vous que l'ABI correspond à celui de votre contrat
const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);

async function addSale(event) {
    event.preventDefault();
    
    const saleInfo = {
        photoIPFSHash: document.getElementById('SalePhotoIPFSHash').value,
        description: document.getElementById('SaleDescription').value,
        prix: parseInt(document.getElementById('SalePrix').value),
        stock: parseInt(document.getElementById('SaleStock').value),
    };

    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log('Account:', account);

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

document.getElementById('addSaleForm').addEventListener('submit', addSale);
