// Initialise Web3 si Ethereum est disponible
const contractConnectWalletAddress = '0x791A4c2BA9caE47eDe652b2F525E3Ae82CB2d13e';

(async () => {
    try {
        if (typeof window.ethereum !== 'undefined') {
            const web3 = new Web3(window.ethereum);

            // Assure que l'ABI correspond à celui de votre contrat
            const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);

            // Fonction utilitaire pour ajouter une vente
            async function createSale(event) {
                event.preventDefault();

                const saleInfo = {
                    photoIPFSHash: document.getElementById('photo').value,
                    description: document.getElementById('description').value,
                    prix: parseInt(document.getElementById('prix').value),
                    stock: parseInt(document.getElementById('stock').value),
                };

                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];

                await addSaleTransaction(contract, saleInfo, account);
                await getSalesList(contract);
            }

            // Fonction utilitaire pour effectuer la transaction d'ajout de vente
            async function addSaleTransaction(contract, saleInfo, account) {
                try {
                    const result = await contract.methods.creerVente(
                        saleInfo.photoIPFSHash,
                        saleInfo.description,
                        saleInfo.prix,
                        saleInfo.stock
                    ).send({ from: account });

                    console.log('Reçu de transaction:', result);
                    alert("Vente ajoutée avec succès");
                } catch (error) {
                    console.error('Une erreur s\'est produite lors de l\'ajout de la vente.', error);
                    alert("Une erreur s'est produite lors de l'ajout de la vente.");
                }
            }

            // Nouvelle fonction utilitaire pour récupérer la liste des ventes
            async function getSalesList(contract) {
                try {
                    const salesCount = await contract.methods.getNombreVentes().call();

                    const salesListElement = document.getElementById('salesList');
                    salesListElement.innerHTML = '';

                    for (let i = 0; i < salesCount; i++) {
                        const saleDetails = await contract.methods.getVente(i).call();

                        const listItem = document.createElement('li');
                        listItem.textContent = `Vente ${i + 1}: ${saleDetails[1]} - Prix: ${saleDetails[2]} - Stock: ${saleDetails[3]}`;
                        salesListElement.appendChild(listItem);
                    }

                    console.log('Liste des ventes récupérée.');
                } catch (error) {
                    console.error('Une erreur s\'est produite lors de la récupération de la liste des ventes.', error);
                    alert("Une erreur s'est produite lors de la récupération de la liste des ventes.");
                }
            }

            // Ajoute un événement de clic pour déclencher la récupération des détails de la vente
            document.getElementById('getVenteBtn').addEventListener('click', async (event) => {
                event.preventDefault();

                const venteID = parseInt(document.getElementById('VenteID').value);

                // Utilise une fonction utilitaire pour récupérer les détails de la vente
                await getVenteDetails(contract, venteID);
            });
        } else {
            console.error('Ethereum non détecté. Veuillez installer MetaMask ou un autre portefeuille compatible.');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        alert("Une erreur s'est produite.");
    }
})();

// Fonction utilitaire pour récupérer les détails de la vente
async function getVenteDetails(contract, venteID) {
    try {
        // Vérifie que le contrat possède une fonction pour récupérer les détails de la vente
        const result = await contract.methods.getVente(venteID).call();

        // Affiche les détails de la vente récupérés
        console.log('Détails de la vente:', result);
        alert("Détails de la vente récupérés avec succès");
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des détails de la vente.', error);
        alert("Une erreur s'est produite lors de la récupération des détails de la vente.");
    }
}

// Fonction utilitaire pour afficher les ventes sur la page principale
function displayVentes(ventes) {
    // Assurez-vous d'avoir une logique appropriée pour afficher les ventes sur votre page
    // Cela peut inclure la création d'éléments HTML, l'ajout à une liste, etc.
    console.log('Ventes disponibles:', ventes);
    alert("Ventes disponibles récupérées avec succès");
}
