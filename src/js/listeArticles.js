// Initialise Web3 si Ethereum est disponible
const contractConnectWalletAddress = '0x195f078e082a4efd1ceef8544f3c8659cb8bd113';

(async () => {
    try {
        
        if (typeof window.ethereum !== 'undefined') {
            
            const web3 = new Web3(window.ethereum);

            // Assure que l'ABI correspond à celui de votre contrat
            const contract = new web3.eth.Contract(ABI, contractConnectWalletAddress);
            console.log("test")
            // Nouvelle fonction utilitaire pour récupérer la liste des ventes
            async function getSalesList(contract) {
        
              try {
                console.log("test2")
                  const salesCount = await contract.methods.getNombreVentes().call();
                  const salesListElement = document.getElementById('salesList');
                  salesListElement.innerHTML = '';
                  console.log("test", salesCount, salesListElement)
          
                  for (let i = 0; i < salesCount; i++) {
                      const saleDetails = await contract.methods.getVente(i).call();
          
                      const productDiv = document.createElement('div');
                      productDiv.classList.add('product');
          
                      // Remplacer 'path/to/image.jpg' par le chemin de l'image stockée sur IPFS
                      const img = document.createElement('img');
                      img.src = 'path/to/image.jpg'; // Utilisez l'IPFS hash ici si possible
                      img.alt = 'Image du produit';
          
                      const title = document.createElement('h2');
                      title.textContent = saleDetails[1]; // Nom de l'article
          
                      const description = document.createElement('p');
                      description.textContent = saleDetails[2]; // Description de l'article
          
                      const price = document.createElement('p');
                      price.textContent = `Prix : ${saleDetails[3]} ETH`;

                      const button = document.createElement('button');
                      button.textContent = 'Acheter';
                      button.dataset.venteId = i; // Ajouter un identifiant de vente comme attribut data
                      button.addEventListener('click', async () => {
                          await payerVenteTransaction(contract, button.dataset.venteId);
                      });
          
                      productDiv.appendChild(button);
                      salesListElement.appendChild(productDiv);

                      productDiv.appendChild(img);
                      productDiv.appendChild(title);
                      productDiv.appendChild(description);
                      productDiv.appendChild(price);
                      productDiv.appendChild(button);
          
                      salesListElement.appendChild(productDiv);
                  }
          
                  console.log('Liste des ventes récupérée.');
              } catch (error) {
                  console.error('Une erreur s\'est produite lors de la récupération de la liste des ventes.', error);
                  alert("Une erreur s'est produite lors de la récupération de la liste des ventes.");
              }
          }

        } else {
            console.error('Ethereum non détecté. Veuillez installer MetaMask ou un autre portefeuille compatible.');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        alert("Une erreur s'est produite.");
    }
})();
