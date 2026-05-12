const produits = [
  { id: 1, nom: "Canapé 3 places", categorie: "salon", prix: 50000 },
  { id: 2, nom: "Table de salon", categorie: "salon", prix: 20000 },
  { id: 3, nom: "Lit double", categorie: "chambre", prix: 40000 },
  { id: 4, nom: "Armoire", categorie: "chambre", prix: 35000 },
  { id: 5, nom: "Bureau", categorie: "bureau", prix: 30000 },
  { id: 6, nom: "Chaise moderne", categorie: "bureau", prix: 12000 }
];

const savedUsers = localStorage.getItem("hm_users");
let users = savedUsers ? JSON.parse(savedUsers) : [{ email: "admin@test.com", password: "123456" }];

if (!savedUsers) {
  localStorage.setItem("hm_users", JSON.stringify(users));
}

function showPage(id) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  const currentPage = document.getElementById(id);
  if (currentPage) currentPage.classList.add("active");

  document.querySelectorAll("[data-page]").forEach(link => link.classList.remove("active"));
  document.querySelectorAll(`[data-page="${id}"]`).forEach(link => link.classList.add("active"));

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function afficherProduits(liste) {
  const div = document.getElementById("products");
  if (!div) return;

  div.innerHTML = "";

  liste.forEach(p => {
    div.innerHTML += `
      <article class="product-card">
        <h3>${p.nom}</h3>
        <p class="product-category">${p.categorie}</p>
        <p class="product-price">${p.prix} DA</p>
        <button type="button" onclick="choisir(${p.id})">Choisir</button>
      </article>
    `;
  });
}

function filter(cat) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`[data-filter="${cat}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  if (cat === "all") {
    afficherProduits(produits);
  } else {
    afficherProduits(produits.filter(p => p.categorie === cat));
  }
}

function chargerSelect() {
  const select = document.getElementById("productSelect");
  if (!select) return;

  select.innerHTML = `<option value="">-- Choisir un meuble --</option>`;
  produits.forEach(p => {
    select.innerHTML += `<option value="${p.id}">${p.nom} - ${p.prix} DA</option>`;
  });
}

function choisir(id) {
  const produit = produits.find(p => p.id === id);
  if (!produit) return;

  const select = document.getElementById("productSelect");
  const info = document.getElementById("selectedProductInfo");

  if (select) select.value = String(produit.id);
  if (info) info.textContent = `Produit sélectionné : ${produit.nom} (${produit.prix} DA)`;

  showPage("reservation");
}

function msg(id, text, color = "green") {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.style.color = color;
}

function getSelectedProduct() {
  const select = document.getElementById("productSelect");
  if (!select || !select.value) return null;
  return produits.find(p => String(p.id) === select.value) || null;
}

document.addEventListener("DOMContentLoaded", () => {
  afficherProduits(produits);
  chargerSelect();

  document.querySelectorAll("[data-page]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  document.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => filter(btn.dataset.filter));
  });

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const regex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/i;

      if (!regex.test(email)) {
        msg("msgRegister", "Email invalide", "red");
        return;
      }

      if (password.length < 6) {
        msg("msgRegister", "Le mot de passe doit contenir au moins 6 caractères", "red");
        return;
      }

      if (password !== confirmPassword) {
        msg("msgRegister", "Les mots de passe ne sont pas identiques", "red");
        return;
      }

      const exists = users.some(u => u.email === email);
      if (exists) {
        msg("msgRegister", "Cet email existe déjà", "red");
        return;
      }

      users.push({ email, password });
      localStorage.setItem("hm_users", JSON.stringify(users));
      registerForm.reset();
      msg("msgRegister", "Inscription réussie", "green");
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem("user", email);
        loginForm.reset();
        msg("msgLogin", "Connexion réussie", "green");
      } else {
        msg("msgLogin", "Email ou mot de passe incorrect", "red");
      }
    });
  }

  const orderForm = document.getElementById("orderForm");
  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("clientName").value.trim();
      const phone = document.getElementById("clientPhone").value.trim();
      const city = document.getElementById("clientCity").value.trim();
      const date = document.getElementById("visitDate").value;
      const product = getSelectedProduct();

      if (!name || !phone || !city || !date || !product) {
        msg("msgOrder", "Veuillez remplir tous les champs", "red");
        return;
      }

      msg("msgOrder", `Réservation validée pour ${product.nom}`, "green");
      orderForm.reset();
      const info = document.getElementById("selectedProductInfo");
      if (info) info.textContent = "Aucun produit sélectionné.";
    });
  }

  const select = document.getElementById("productSelect");
  if (select) {
    select.addEventListener("change", () => {
      const product = getSelectedProduct();
      const info = document.getElementById("selectedProductInfo");
      if (info) {
        info.textContent = product
          ? `Produit sélectionné : ${product.nom} (${product.prix} DA)`
          : "Aucun produit sélectionné.";
      }
    });
  }

  showPage("home");
});