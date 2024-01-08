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

            // Ajoutez un événement de clic pour déclencher la récupération du rôle
            document.getElementById('getRoleBtn').addEventListener('click', async (event) => {
                event.preventDefault();

                // Demandez à l'utilisateur de se connecter au portefeuille
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log('Account:', account);

                // Utilisez la fonction d'utilité pour récupérer le rôle
                await getRoleDetails(contract, account);
            });

            // Ajoutez un événement de clic pour déclencher la définition du rôle
            document.getElementById('setRoleForm').addEventListener('submit', async (event) => {
                event.preventDefault();

                const userAddress = document.getElementById('userAddressInput').value;
                const role = document.getElementById('roleInput').value;

                // Demandez à l'utilisateur de se connecter au portefeuille
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log('Account:', account);

                // Utilisez la fonction d'utilité pour définir le rôle
                await setRoleTransaction(contract, account, userAddress, role);
            });
        } else {
            console.error('Ethereum non détecté. Veuillez installer MetaMask ou un autre portefeuille compatible.');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        alert("Une erreur s'est produite.");
    }
})();

// Utilisez une fonction d'utilité pour récupérer le rôle
async function getRoleDetails(contract, account) {
    try {
        // Assurez-vous que votre contrat possède une fonction pour récupérer le rôle
        const result = await contract.methods.getRole(account).call();

        console.log('Rôle de l\'utilisateur:', result);
        alert("Rôle de l'utilisateur récupéré avec succès");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération du rôle de l\'utilisateur.', error);
        alert("Une erreur s'est produite lors de la récupération du rôle de l'utilisateur.");
    }
}

// Utilisez une fonction d'utilité pour définir le rôle
async function setRoleTransaction(contract, account, userAddress, role) {
    try {
        // Assurez-vous que votre contrat possède une fonction pour définir le rôle
        const result = await contract.methods.setRole(userAddress, role).send({ from: account });

        console.log('Transaction receipt:', result);
        alert("Rôle défini avec succès");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la définition du rôle.', error);
        alert("Une erreur s'est produite lors de la définition du rôle.");
    }
}
