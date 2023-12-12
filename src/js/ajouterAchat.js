var web3 = new Web3(window.ethereum);
const contractConnectWalletAddress = '0x791A4c2BA9caE47eDe652b2F525E3Ae82CB2d13e';
const provider = await detectEthereumProvider();

// Assurez-vous que l'ABI correspond à celui de votre contrat
const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);

async function addAchat(event) {
    event.preventDefault();
    
    const achatInfo = {
        addressAcheteur: await getCurrentUserAddress(), // Utilisez une fonction pour obtenir l'adresse de l'acheteur
        venteID: parseInt(document.getElementById('AchatVenteID').value),
    };

    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log('Account:', account);

        // Assurez-vous que votre contrat possède une fonction pour ajouter un achat
        const result = await contract.methods.ajouterAchat(
            achatInfo.addressAcheteur,
            achatInfo.venteID
        ).send({ from: account });

        console.log('Transaction receipt:', result);
        alert("Achat ajouté avec succès");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de l\'ajout de l\'achat.', error);
        alert("Une erreur s'est produite lors de l'ajout de l'achat.");
    }
}

document.getElementById('addAchatForm').addEventListener('submit', addAchat);

// Fonction pour obtenir l'adresse de l'utilisateur connecté
async function getCurrentUserAddress() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
}
