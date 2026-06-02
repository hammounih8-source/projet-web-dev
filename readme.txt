===============================================
  HM MOBILIER — README
===============================================

DESCRIPTION DU SITE
---------------------
HM MOBILIER est un mini site e-commerce dédié
à la vente de mobilier. Il permet de :
  - Consulter un catalogue de meubles filtrable
    par catégorie (Salon, Chambre, Bureau)
  - Créer un compte client (inscription)
  - Se connecter et avoir une session persistante
  - Réserver un meuble via un formulaire validé
  - Naviguer entre les pages sans rechargement

STRUCTURE DES FICHIERS
-----------------------
HM_MOBILIER/
├── index.html          → Page principale (SPA)
├── content/            → (pages HTML supplémentaires si besoin)
├── style/
│   └── styles.css      → Feuille de styles externe
├── javascript/
│   └── app.js          → Logique JavaScript externe
├── images/
│   ├── canape.svg
│   ├── table.svg
│   ├── lit.svg
│   ├── armoire.svg
│   ├── bureau.svg
│   └── chaise.svg
└── readme.txt          → Ce fichier

INSTRUCTIONS D'UTILISATION
----------------------------
1. Ouvrir index.html dans un navigateur moderne
   (Chrome, Firefox, Edge, Safari)

2. Compte de test disponible :
     Email    : admin@test.com
     Mot de passe : Admin1

3. Créer un nouveau compte :
   - Email valide requis
   - Mot de passe : min. 6 caractères, 1 majuscule, 1 chiffre
   - Ex: MonMot1

4. Réservation :
   - Cliquer sur "Réserver" depuis le catalogue
   - Ou aller dans l'onglet Réservation
   - Téléphone au format algérien : 05/06/07 + 8 chiffres
   - La date de visite doit être dans le futur

5. Les données sont stockées dans le localStorage
   du navigateur (simulation sans backend)

FONCTIONNALITÉS TECHNIQUES
----------------------------
- Affichage dynamique des produits (tableau JS)
- Filtrage côté client par catégorie
- Validation formulaires avec expressions régulières :
    Email    : /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i
    Téléphone: /^0[5-7]\d{8}$/
    Password : /^(?=.*[A-Z])(?=.*\d).{6,}$/
- Session utilisateur via localStorage
- Navbar dynamique (affiche utilisateur connecté)
- Site responsive (mobile & desktop)
- Balises sémantiques HTML5

MEMBRES DU GROUPE
------------------
[hammouni hamza]

Année universitaire : 2025/2026
Module : Développement d'Applications Web
Université Mouloud Mammeri de Tizi-Ouzou
===============================================
