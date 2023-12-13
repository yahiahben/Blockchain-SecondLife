<!DOCTYPE HTML>
<html lang="fr-FR">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="src\css\style-création.css" type="text/css" rel="stylesheet" />
    <link href="src\css\style.css" type="text/css" rel="stylesheet" />
    <link href="src\css\style-rapport.css" type="text/css" rel="stylesheet" />
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    <script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js/dist/web3.min.js"></script>
    <title>VELOCK</title>
    <link rel="icon" href="src\Icons\Icone-logo.png">
</head>

<body id="page-top" class="b-lng-fr pg-report-view">

    <div class="Page_top__h8pt8">
        <header class="Header_root__l5VTQ">
            <div class="_root_otub2_1 Header_container__BKAYt" style="border-bottom: 1px solid grey">
                <a href="index.php" class="Logo_link__X8gK6" data-testid="Link-innerLink">
                    <div class="Logo_root__4WTbI Header_logo__vHf_w">
                        <img alt="VELOCK LOGO" src="src\image_VELOCK.png" width="250" height="60">
                    </div>
                </a>
            </div>
        </header>
    </div>
    <div class="page-content">
        <main>
            <div id="report-cont">
                <div class="view-report">
                    <section id="rep-specs" class="t-30 r-section">
                        <div class="container cont-lg">

                            <div class=" frm">

                                <h1 class="_root_k4hgl_1 _dark_k4hgl_33 _xxl_10vh9_1" style="text-align: center">
                                    Renseigne les informations de ton véhicule
                                </h1>

                                <form method="post" id="createCarForm" name="CarSpecs">
                                    <br><br>
                                    VIN:
                                    <span class="error">*</span>
                                    <input type="text" name="vin" placeholder="..." required />
                                    <br>
                                    Plaque d'immatriculation:
                                    <span class="error">*</span>
                                    <input type="text" name="plaque" placeholder="..." required />
                                    <br>
                                    Marque:
                                    <span class="error">*</span>
                                    <input type="text" name="marque" placeholder="..." required />
                                    <br>
                                    Modèle:
                                    <span class="error">*</span>
                                    <input type="text" name="modele" placeholder="..." required />
                                    <br>
                                    Année:
                                    <span class="error">*</span>
                                    <input type="number" name="yearInput" min="2000" max="2023" placeholder="..." required />
                                    <br>
                                    Déplacement moteur:
                                    <span class="error">*</span>
                                    <input type="text" name="deplacement" placeholder="..." required />
                                    <br>
                                    Puissance moteur:
                                    <span class="error">*</span>
                                    <input type="text" name="puissance" placeholder="..." required />
                                    <br>
                                    Style:
                                    <span class="error">*</span>
                                    <select name="choice" name="style" required>
                                        <option value="" disabled selected hidden>...</option>
                                        <option value="Berline">Berline</option>
                                        <option value="Coupe">Coupe</option>
                                        <option value="SUV">SUV</option>
                                        <option value="Citadine">Citadine</option>
                                        <option value="Monospace">Monospace</option>
                                        <option value="Ludospace">Ludospace</option>
                                    </select>
                                    <br>
                                    Transmission:
                                    <span class="error">*</span>
                                    <select name="choice" name="transmission" required>
                                        <option value="" disabled selected hidden>...</option>
                                        <option value="Automatique">Automatique</option>
                                        <option value="Manuelle">Manuelle</option>
                                    </select>
                                    <br>
                                    <br>

                                    <p><span class="error">* required field</span></p>
                                    <br>

                                    <input type="submit" name="submit" id="btn" value="Submit" />
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    </div>
    <script>
        // Gérer la logique de création de voiture en JavaScript
        document.getElementById("createCarForm").addEventListener("submit", async function(e) {
            e.preventDefault(); // Empêcher le formulaire de se soumettre normalement

            const specs = document.getElementById("createCarForm").value;
            const contractAddress = '0x7535823a292ff0512aff68e11dc5a9a6ad291bfb'; // Adresse du contrat Velock (à remplacer par votre propre adresse)

            // Vérifier si l'utilisateur a installé MetaMask
            if (typeof ethereum === 'undefined') {
                alert("Veuillez installer MetaMask pour exécuter cette action.");
                return;
            }

            try {
                // Demander l'autorisation à l'utilisateur d'accéder à son compte Ethereum
                const accounts = await ethereum.request({
                    method: 'eth_requestAccounts'
                });

                // Créer une instance du contrat Velock
                const myContract = new web3.eth.Contract(VelockContractABI, contractAddress);

                // Appeler la fonction createCar du contrat Velock
                const result = await myContract.methods.createCar(specs).send({
                    from: accounts[0]
                });

                // Envoyer le résultat à PHP pour traitement
                sendResultToPHP(result.transactionHash, result.events.CarCreated.returnValues.vin);
            } catch (error) {
                console.error(error);
                alert("Une erreur s'est produite lors de la création de la voiture.");
            }
        });

        // Envoyer le résultat à PHP pour traitement
        function sendResultToPHP(transactionHash, vin) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "process_result.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    // Requête terminée et réponse du serveur reçue
                    console.log(xhr.responseText);
                    document.getElementById("output").innerHTML = xhr.responseText;
                }
            };
            var params = "transactionHash=" + encodeURIComponent(transactionHash) +
                "&vin=" + encodeURIComponent(vin);
            xhr.send(params);
        }
    </script>
    <?php
    // Le code PHP doit être placé après le code HTML ou JavaScript

    // Traiter la logique de création de voiture
    if (isset($_POST['submit'])) {
        $specs = $_POST['CarSpecs'];

        // Envoyer le résultat à PHP pour traitement
        createCar($specs);
    }

    function createCar($specs)
    {
        $specs = $_POST['CarSpecs']; // Récupérer les spécifications de la voiture à partir du formulaire
        $velockContractAddress = '0x7535823a292ff0512aff68e11dc5a9a6ad291bfb'; // Adresse du contrat Velock (à remplacer par votre propre adresse)

        // Envoyer les résultats à JavaScript pour traitement
        echo "<script>createCarJS('$specs', '$velockContractAddress');</script>";
    }
    ?>
    <footer class="footer">
        <div class="inner-footercover">
            <nav class="block block--menu block--pieddepage" role="navigation" aria-labelledby="block-pieddepage-menu">
                <ul class="footer-linklist d-flex flex-wrap align-items-center justify-content-center">
                    <li class="footer-linkitem">
                        <p class="c-footer__copyright" style="margin: 15px">© 2023 ESIGELEC</p>
                    </li>
                </ul>
            </nav>
        </div>
    </footer>

</body>

</html>