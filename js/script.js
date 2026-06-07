document.addEventListener('DOMContentLoaded', function() {

    
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('newsEmail').value;
            const messageDiv = document.getElementById('newsMessage');
            if (email && email.includes('@')) {
                messageDiv.style.color = '#2d5a3b';
                messageDiv.textContent = '✅ Merci ! Vous êtes inscrit à notre newsletter.';
                newsletterForm.reset();
            } else {
                messageDiv.style.color = 'red';
                messageDiv.textContent = '❌ Veuillez entrer un email valide.';
            }
        });
    }

    
    const grille = document.getElementById('grille-produits');
    if (grille) {
        let tousLesProduits = 'tous';

    
        fetch('data/produits.json')
    .then(response => response.json())
    .then(data => {
        tousLesProduits = data.produits;
        
      
        const urlParams = new URLSearchParams(window.location.search);
        const categorieUrl = urlParams.get('categorie');
        
        if (categorieUrl && categorieUrl !== 'tous') {
            categorieActive = categorieUrl;
            
            const boutonFiltre = document.querySelector(`.filtre-btn[data-categorie="${categorieUrl}"]`);
            if (boutonFiltre) {
                document.querySelectorAll('.filtre-btn').forEach(btn => btn.classList.remove('active'));
                boutonFiltre.classList.add('active');
            }
            const produitsFiltres = tousLesProduits.filter(p => p.categorie === categorieUrl);
            afficherProduits(produitsFiltres);
        } else {
            afficherProduits(tousLesProduits);
        }
    })
    .catch(error => {
        console.error('Erreur chargement produits:', error);
        grille.innerHTML = '<p>❌ Erreur lors du chargement des produits.</p>';
    });
        
        function afficherProduits(produits) {
            if (produits.length === 0) {
                grille.innerHTML = '<p>Aucun produit dans cette catégorie.</p>';
                return;
            }

            let html = '';
            for (let i = 0; i < produits.length; i++) {
                const p = produits[i];
                html += `
                    <div class="carte-produit" data-id="${p.id}">
                        <img src="${p.image}" alt="${p.nom}" onerror="this.src='https://placehold.co/300x200/f4c542/2d5a3b?text=${encodeURIComponent(p.nom)}'">
                        <h3>${p.nom}</h3>
                        <p class="prix">${p.prix} DZD</p>
                        <p class="description">${p.description}</p>
                        <button class="btn-ajouter" data-id="${p.id}" data-nom="${p.nom}" data-prix="${p.prix}">Ajouter au panier</button>
                    </div>
                `;
            }
            grille.innerHTML = html;
            ajouterEcouteursPanier();
        }

       
        const filtres = document.querySelectorAll('.filtre-btn');
        if (filtres.length > 0) {
            filtres.forEach(btn => {
                btn.addEventListener('click', function() {
                    filtres.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const categorie = this.getAttribute('data-categorie');
                    if (categorie === 'tous') {
                        afficherProduits(tousLesProduits);
                    } else {
                        const filtresProduits = tousLesProduits.filter(p => p.categorie === categorie);
                        afficherProduits(filtresProduits);
                    }
                });
            });
        }

        
        function ajouterEcouteursPanier() {
            const btns = document.querySelectorAll('.btn-ajouter');
            btns.forEach(btn => {
                btn.removeEventListener('click', gestionAjoutPanier);
                btn.addEventListener('click', gestionAjoutPanier);
            });
        }

        function gestionAjoutPanier(e) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const nom = e.target.getAttribute('data-nom');
            const prix = parseFloat(e.target.getAttribute('data-prix'));
            ajouterAuPanier(id, nom, prix);
        }
    }

   
 
function ajouterAuPanier(id, nom, prix, quantite = 1) {
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    const existant = panier.find(item => item.id === id);
    if (existant) {
        existant.quantite += quantite;
    } else {
        panier.push({ id, nom, prix, quantite });
    }
    localStorage.setItem('panier', JSON.stringify(panier));
    alert(`${nom} ajouté au panier !`);
}


const recapPanier = document.getElementById('recap-panier');
if (recapPanier) {
    afficherRecapPanier();
}

function afficherRecapPanier() {
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    const recapDiv = document.getElementById('recap-panier');
    const totalSpan = document.getElementById('total-panier');
    const sousTotalSpan = document.getElementById('sous-total');
    
    if (panier.length === 0) {
        recapDiv.innerHTML = '<p>Votre panier est vide.</p>';
        if (totalSpan) totalSpan.textContent = '0';
        if (sousTotalSpan) sousTotalSpan.textContent = '0';
        return;
    }

    let html = '<ul class="liste-panier">';
    let total = 0;
    for (let i = 0; i < panier.length; i++) {
        const item = panier[i];
        const sousTotal = item.prix * item.quantite;
        total += sousTotal;
        html += `
            <li>
                ${item.nom} - ${item.prix} DZD x ${item.quantite} = ${sousTotal} DZD
                <button class="btn-supprimer" data-id="${item.id}">❌ Supprimer</button>
            </li>
        `;
    }
    html += '</ul>';
    recapDiv.innerHTML = html;
    
    if (sousTotalSpan) sousTotalSpan.textContent = total;
    if (totalSpan) totalSpan.textContent = total+600;

    document.querySelectorAll('.btn-supprimer').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            supprimerDuPanier(id);
        });
    });
}

function supprimerDuPanier(id) {
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    panier = panier.filter(item => item.id !== id);
    localStorage.setItem('panier', JSON.stringify(panier));
    afficherRecapPanier();
}

    const formulaireLivraison = document.getElementById('formulaire-livraison');
    if (formulaireLivraison) {
        formulaireLivraison.addEventListener('submit', function(e) {
            e.preventDefault();
            const prenom = document.getElementById('prenom').value.trim();
            const nom = document.getElementById('nom').value.trim();
            const adresse = document.getElementById('adresse').value.trim();
            const ville = document.getElementById('ville').value.trim();
            const codePostal = document.getElementById('codePostal').value.trim();
            const telephone = document.getElementById('telephone').value.trim();

            if (!prenom || !nom || !adresse || !ville || !codePostal || !telephone) {
                alert('Veuillez remplir tous les champs.');
                return;
            }
            if (!/^\d{5}$/.test(codePostal)) {
                alert('Code postal invalide (5 chiffres).');
                return;
            }
            if (!/^(0|\+213)[0-9]{9,10}$/.test(telephone)) {
                alert('Numéro de téléphone invalide.');
                return;
            }
            alert(`✅ Merci ${prenom} ! Votre commande a été enregistrée.`);
            localStorage.removeItem('panier');
            afficherRecapPanier();
            formulaireLivraison.reset();
        });
    }

   
    const formulaireInscription = document.getElementById('formulaire-inscription');
    if (formulaireInscription) {
        formulaireInscription.addEventListener('submit', function(e) {
            e.preventDefault();
            const nom = document.getElementById('inscrit_nom').value.trim();
            const email = document.getElementById('inscrit_email').value.trim();
            const password = document.getElementById('inscrit_password').value;
            const confirm = document.getElementById('inscrit_confirm').value;

            if (!nom || !email || !password || !confirm) {
                alert('Tous les champs sont obligatoires.');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Email invalide.');
                return;
            }
            if (password.length < 6) {
                alert('Mot de passe : au moins 6 caractères.');
                return;
            }
            if (password !== confirm) {
                alert('Les mots de passe ne correspondent pas.');
                return;
            }

            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(u => u.email === email)) {
                alert('Cet email est déjà utilisé.');
                return;
            }

            users.push({ nom, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Inscription réussie ! Vous pouvez vous connecter.');
            window.location.href = 'connexion.html';
        });
    }

    
    const formulaireConnexion = document.getElementById('formulaire-connexion');
    if (formulaireConnexion) {
        formulaireConnexion.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login_email').value.trim();
            const password = document.getElementById('login_password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('userConnected', JSON.stringify({ nom: user.nom, email: user.email }));
                alert(`Bonjour ${user.nom} ! Connexion réussie.`);
                window.location.href = 'index.html';
            } else {
                alert('Email ou mot de passe incorrect.');
            }
        });
    }

    
    const userConnected = JSON.parse(localStorage.getItem('userConnected'));
    if (userConnected) {
        console.log(`Connecté : ${userConnected.nom}`);
    }
});
