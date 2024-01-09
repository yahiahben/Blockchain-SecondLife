<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Second Life Marketplace - Créer un nouvel article</title>
  <script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js/dist/web3.min.js"></script>
  <script src="contracts/ABI.js"></script>
  <script src="https://unpkg.com/@metamask/detect-provider/dist/detect-provider.min.js"></script>
</head>
<body>
  <div class="creerarticle">
    <h1>Créer un nouvel article</h1>
    <form id="createSaleForm" method="post">
      <div>
        <label for="description">Description</label>
        <input type="text" id="description" name="description" required>
      </div>
      <div>
        <label for="prix">Prix</label>
        <input type="number" id="prix" name="prix" required>
      </div>
      <div>
        <label for="stock">Stock</label>
        <input type="number" id="stock" name="stock" required>
      </div>
      <div>
        <label for="photo">Adresse IPFS de la photo</label>
        <input type="text" id="photo" name="photo" required>
      </div>
      <input type="submit" name="submit" id="btn" value="Submit">
    </form>
    <script type="module" src="src/js/creerVente.js"></script>
  </div>
</body>
</html>