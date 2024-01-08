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

    event VenteCreee(uint256 venteID, address vendeur);
    event AchatEffectue(address acheteur, uint256 venteID);

    constructor(){
        owner = msg.sender;
        roles[owner] = Role.Administrateur;
    }

    // Produit qui va etre acheté
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
        emit VenteCreee(venteID, msg.sender);
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

        emit AchatEffectue(msg.sender, _venteID);
    }

        // Fonction pour obtenir les détails d'un article acheté par l'acheteur
    function getDetailsArticleAchete(address _addr, uint256 _venteID) public view returns (string memory, string memory, uint256, uint256) {
        require(roles[_addr] == Role.Acheteur, "Erreur");

        // Vérifiez que l'article appartient bien à l'acheteur
        require(articleAppartientAcheteur(_addr, _venteID), "Pas d'article");

        // Récupère les détails de l'article acheté
        return (ventes[_venteID].photoIPFSHash, ventes[_venteID].description, ventes[_venteID].prix, ventes[_venteID].stock);
    }

    // Fonction interne pour vérifier si l'article appartient à l'acheteur
    function articleAppartientAcheteur(address _addr, uint256 _venteID) internal view returns (bool) {
        Proprietaire memory proprietaire = proprietaires[_addr];
        for (uint256 i = 0; i < proprietaire.articlesAchetes.length; i++) {
            if (proprietaire.articlesAchetes[i] == _venteID) {
                return true;
            }
        }
        return false;
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

    function setRole(address _user, Role _role) public {
        require(roles[msg.sender] == Role.Administrateur, "Seul l'administrateur peut definir les roles");
        roles[_user] = _role;
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
