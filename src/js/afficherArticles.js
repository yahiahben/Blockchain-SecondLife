// Fonction pour charger la liste des articles
function loadArticles() {
    // Récupère l'adresse du contrat
    const contractAddress = '0x791A4c2BA9caE47eDe652b2F525E3Ae82CB2d13e';

    // Crée un objet Web3
    const web3 = new Web3(window.ethereum);

    // Crée un contrat intelligent
    const contract = new web3.eth.Contract(ABI, contractAddress);

    // Demande la liste des articles
    const result = await contract.methods.getArticles().call();

    // Met à jour la liste des articles
    const articles = result.map((article) => {
      return {
        id: article.id,
        photoIPFSHash: article.photoIPFSHash,
        description: article.description,
        prix: article.prix,
        stock: article.stock,
      };
    });

    // Affiche la liste des articles
    const articleNodes = articles.map((article) => {
      return `
        <tr>
          <td>${article.id}</td>
          <td><img src="${article.photoIPFSHash}" alt="Photo de l'article"></td>
          <td>${article.description}</td>
          <td>${article.prix}</td>
          <td>${article.stock}</td>
        </tr>
      `;
    });

    document.getElementById('articles').innerHTML = articleNodes.join('');
  }

  // Charge la liste des articles au chargement de la page
  loadArticles();