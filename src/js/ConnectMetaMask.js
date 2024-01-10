var web3 = new Web3(window.ethereum);

const contractConnectWalletAddress = '0xC0f68c3dD40266656f5198078bE3d0dCc31Af939';

var userAddress;
const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);

function updateButtonStatus(connected) {
    const button = document.getElementById('connect-button');
    button.innerText = connected ? "MetaMask Connecté" : "Connecter MetaMask";
}

async function checkWalletConnection() {
    try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length > 0) {
            userAddress = accounts[0];
            updateButtonStatus(true);
        } else {
            updateButtonStatus(false);
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de la connexion du portefeuille:", error);
        updateButtonStatus(false);
    }
}

document.getElementById('connect-button').addEventListener('click', async () => {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

        if (accounts.length > 0) {
            updateButtonStatus(true);
            document.cookie = "walletConnected=true; path=/";

            const role = parseInt(await contract.methods.getRoleValue(accounts[0]).call());

            switch (role) {
                case 0: window.location.href = "indexAdmin.php"; break; // Administrateur
                case 1: window.location.href = "indexVendeur.php"; break; // Vendeur
                case 2: window.location.href = "indexAcheteur.php"; break; // Acheteur
                default: console.error("Rôle inconnu:", role);
            }
        }
    } catch (error) {
        console.error("Erreur lors de la connexion du portefeuille:", error);
        updateButtonStatus(false);
    }
});

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
        } catch (error) {
            console.error("L'utilisateur a refusé l'accès au compte");
        }
    } else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log("Navigateur non-Ethereum détecté. Vous devriez envisager d'essayer MetaMask!");
    }

    checkWalletConnection();
});
