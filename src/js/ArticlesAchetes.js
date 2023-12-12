var web3 = new Web3(window.ethereum);
const contractConnectWalletAddress = '0x791A4c2BA9caE47eDe652b2F525E3Ae82CB2d13e';
const provider = await detectEthereumProvider();

// Assurez-vous que l'ABI correspond à celui de votre contrat
const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);

async function getArticlesAchetes() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log('Account:', account);

        // Assurez-vous que votre contrat possède une fonction pour obtenir les articles achetés
        const articlesAchetes = await contract.methods.getArticlesAchetes(account).call();

        console.log('Articles achetés:', articlesAchetes);
        // Traitez les articles achetés comme vous le souhaitez
        alert("Articles achetés récupérés avec succès");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des articles achetés.', error);
        alert("Une erreur s'est produite lors de la récupération des articles achetés.");
    }
}

document.getElementById('getArticlesAchetesButton').addEventListener('click', getArticlesAchetes);
