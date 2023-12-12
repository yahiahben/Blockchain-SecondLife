// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18 <0.9.0;

contract SecondLifeMarketplace {
    enum Role {
        Acheteur,
        Vendeur,
        Administrateur
    }
    
    mapping(address => Role) public roles;
    mapping(address => Proprietaire) private proprietaires;
    mapping(uint256 => Vente) public ventes;
    mapping(uint256 => string[]) public achats;
    address private owner;

    constructor(){
        owner = msg.sender;
        roles[owner] = Role.Administrateur;
    }

    struct Vente {
        string photoIPFSHash; // Ajout d'une référence IPFS pour la photo de l'article
        string description;
        uint256 stock;
        uint256 prix;
        address vendeur;
    }

    struct Proprietaire {
        address addr;
        string nom;
        uint256[] articlesAchetes;
    }

    uint256 private prochaineVenteID;

    // Crée une nouvelle vente avec la description et le prix fournis et renvoie l'identifiant unique de la vente
    function creerVente(string memory _photoIPFSHash, string memory _description, uint256 _prix, uint256 _stock) public returns (uint256) {
        uint256 venteID = prochaineVenteID;
        ventes[venteID].photoIPFSHash = _photoIPFSHash;
        ventes[venteID].description = _description;
        ventes[venteID].prix = _prix;
        ventes[venteID].stock = _stock;
        ventes[venteID].vendeur = msg.sender; // Enregistre l'adresse du vendeur
        prochaineVenteID++;
        return venteID;
    }

    // Récupère la description de la vente correspondant à l'identifiant unique fourni
    function getVente(uint256 _venteID) public view returns (string memory, string memory, uint256, uint256) {
        return (ventes[_venteID].photoIPFSHash, ventes[_venteID].description, ventes[_venteID].prix, ventes[_venteID].stock);
    }

        // Fonction de paiement
    function payerVente(uint256 _venteID) public payable {
        require(ventes[_venteID].stock > 0, "Article en rupture de stock");
        require(msg.value >= ventes[_venteID].prix, "Fonds insuffisants pour acheter cet article");

        // Décrémente le stock
        ventes[_venteID].stock--;

        // Effectue le paiement au vendeur
        payable(ventes[_venteID].vendeur).transfer(msg.value);
    }

    // Ajoute un article à la liste des articles achetés par l'acheteur correspondant à l'adresse fournie
    function ajouterAchat(address _addr, uint256 _venteID) public {
        Proprietaire storage proprietaire = proprietaires[_addr];
        proprietaire.articlesAchetes.push(_venteID);
    }

    // Récupère tous les articles achetés par l'acheteur correspondant à l'adresse fournie
    function getArticlesAchetes(address _addr) public view returns (uint256[] memory) {
        Proprietaire memory proprietaire = proprietaires[_addr];
        return proprietaire.articlesAchetes;
    }

    //Ajoute un utilisateur sans droit particulier
    function creerAcheteurSansAchat(address _addr, string memory _nom) public {
        proprietaires[_addr] = Proprietaire(_addr, _nom, new uint256[](0));
        roles[_addr] = Role.Acheteur;
    }

    // Getters et setters pour la structure Vendeur
    mapping(address => Vendeur) public vendeurs;

    // Définit un vendeur avec l'adresse et le nom fournis
    function setVendeur(address _addr, string memory _nom) public {
        vendeurs[_addr] = Vendeur(_addr, _nom);
        roles[_addr] = Role.Vendeur;
    }

    // Récupère les informations du vendeur correspondant à l'adresse fournie
    function getVendeur(address _addr) public view returns (address, string memory) {
        Vendeur memory vendeur = vendeurs[_addr];
        return (vendeur.addr, vendeur.nom);
    }

    //Fonction retournant le rôle d'un utilisateur
    function getRole(address utilisateur) public view returns (Role) {
        return roles[utilisateur];
    }

    struct Vendeur {
        address addr;
        string nom;
    }

}
