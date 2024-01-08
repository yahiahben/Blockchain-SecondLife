// Initialise Web3 si Ethereum est disponible
var web3 = new Web3(window.ethereum);
const contractConnectWalletAddress = '0x791A4c2BA9caE47eDe652b2F525E3Ae82CB2d13e';

// Assurez-vous que l'ABI correspond à celui de votre contrat
const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);

// Fonction pour récupérer les articles achetés par l'utilisateur
async function getArticlesAchetes() {
    try {
        // Demande à l'utilisateur de se connecter au portefeuille
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log('Compte utilisateur:', account);

        // Assurez-vous que votre contrat possède une fonction pour obtenir les articles achetés
        const articlesAchetes = await contract.methods.getArticlesAchetes(account).call();

        // Affiche les articles achetés récupérés
        console.log('Articles achetés:', articlesAchetes);
        alert("Articles achetés récupérés avec succès");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des articles achetés.', error);
        alert("Une erreur s'est produite lors de la récupération des articles achetés.");
    }
}

// Ajoute un événement de clic pour déclencher la fonction de récupération des articles achetés
document.getElementById('getArticlesAchetesButton').addEventListener('click', getArticlesAchetes);
