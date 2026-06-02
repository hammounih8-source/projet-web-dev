const produits = [
  { id: 1, nom: "Canapé 3 places", categorie: "salon",   prix: 50000, image: "images/canape.png"  },
  { id: 2, nom: "Table de salon",  categorie: "salon",   prix: 20000, image: "images/table.png"   },
  { id: 3, nom: "Lit double",      categorie: "chambre", prix: 40000, image: "images/lit.png"     },
  { id: 4, nom: "Armoire",         categorie: "chambre", prix: 35000, image: "images/armoire.png" },
  { id: 5, nom: "Bureau",          categorie: "bureau",  prix: 30000, image: "images/bureau.png"  },
  { id: 6, nom: "Chaise moderne",  categorie: "bureau",  prix: 12000, image: "images/chaise.png"  }
];

const REGEX_EMAIL    = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const REGEX_PHONE    = /^0[5-7]\d{8}$/;
const REGEX_PASSWORD = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

const savedUsers = localStorage.getItem("hm_users");
let users = savedUsers
  ? JSON.parse(savedUsers)
  : [{ email: "admin@test.com", password: "Admin1" }];

if (!savedUsers) {
  localStorage.setItem("hm_users", JSON.stringify(users));
}

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById(id);
  if (page) page.classList.add("active");

  document.querySelectorAll("[data-page]").forEach(l => l.classList.remove("active"));
  document.querySelectorAll(`[data-page="${id}"]`).forEach(l => l.classList.add("active"));

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateNavbar() {
  const email        = localStorage.getItem("hm_session");
  const loginItem    = document.getElementById("nav-login-item");
  const registerItem = document.getElementById("nav-register-item");
  const userItem     = document.getElementById("nav-user-item");
  const usernameSpan = document.getElementById("nav-username");

  if (email) {
    loginItem.style.display    = "none";
    registerItem.style.display = "none";
    userItem.style.display     = "flex";
    userItem.style.alignItems  = "center";
    userItem.style.gap         = "10px";
    usernameSpan.textContent   = email.split("@")[0];
  } else {
    loginItem.style.display    = "";
    registerItem.style.display = "";
    userItem.style.display     = "none";
  }
}

function afficherProduits(liste) {
  const div = document.getElementById("products");
  if (!div) return;
  div.innerHTML = "";
  liste.forEach(p => {
    div.innerHTML += `
      <article class="product-card">
        <img class="product-image" src="${p.image}" alt="${p.nom}" loading="lazy" />
        <h3>${p.nom}</h3>
        <p class="product-category">${p.categorie}</p>
        <p class="product-price">${p.prix.toLocaleString("fr-DZ")} DA</p>
        <button type="button" onclick="choisir(${p.id})">Réserver</button>
      </article>
    `;
  });
}

function filter(cat) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`[data-filter="${cat}"]`);
  if (activeBtn) activeBtn.classList.add("active");
  afficherProduits(cat === "all" ? produits : produits.filter(p => p.categorie === cat));
}

function chargerSelect() {
  const select = document.getElementById("productSelect");
  if (!select) return;
  select.innerHTML = `<option value="">-- Choisir un meuble --</option>`;
  produits.forEach(p => {
    select.innerHTML += `<option value="${p.id}">${p.nom} — ${p.prix.toLocaleString("fr-DZ")} DA</option>`;
  });
}

function choisir(id) {
  const produit = produits.find(p => p.id === id);
  if (!produit) return;

  const select = document.getElementById("productSelect");
  const info   = document.getElementById("selectedProductInfo");

  if (select) select.value = String(produit.id);
  if (info)   info.textContent = `Produit sélectionné : ${produit.nom} (${produit.prix.toLocaleString("fr-DZ")} DA)`;

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

function setDateMin() {
  const visitDate = document.getElementById("visitDate");
  if (!visitDate) return;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  visitDate.min = tomorrow.toISOString().split("T")[0];
}

document.addEventListener("DOMContentLoaded", () => {

  afficherProduits(produits);
  chargerSelect();
  setDateMin();
  updateNavbar();
  showPage("home");

  document.querySelectorAll("[data-page]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  document.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => filter(btn.dataset.filter));
  });

  const select = document.getElementById("productSelect");
  if (select) {
    select.addEventListener("change", () => {
      const produit = getSelectedProduct();
      const info = document.getElementById("selectedProductInfo");
      if (info) {
        info.textContent = produit
          ? `Produit sélectionné : ${produit.nom} (${produit.prix.toLocaleString("fr-DZ")} DA)`
          : "Aucun produit sélectionné.";
      }
    });
  }

  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("hm_session");
      updateNavbar();
      msg("msgLogin", "", "green");
      showPage("home");
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email    = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value;
      const confirm  = document.getElementById("regConfirm").value;

      if (!REGEX_EMAIL.test(email)) {
        msg("msgRegister", "❌ Adresse email invalide.", "red");
        return;
      }

      if (!REGEX_PASSWORD.test(password)) {
        msg("msgRegister", "❌ Le mot de passe doit contenir au moins 6 caractères, une majuscule et un chiffre.", "red");
        return;
      }

      if (password !== confirm) {
        msg("msgRegister", "❌ Les mots de passe ne correspondent pas.", "red");
        return;
      }

      if (users.some(u => u.email === email)) {
        msg("msgRegister", "❌ Cet email est déjà utilisé.", "red");
        return;
      }

      users.push({ email, password });
      localStorage.setItem("hm_users", JSON.stringify(users));
      registerForm.reset();
      msg("msgRegister", "✅ Inscription réussie ! Vous pouvez vous connecter.", "green");
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email    = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      if (!REGEX_EMAIL.test(email)) {
        msg("msgLogin", "❌ Adresse email invalide.", "red");
        return;
      }

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem("hm_session", email);
        loginForm.reset();
        msg("msgLogin", "", "green");
        updateNavbar();
        showPage("home");
      } else {
        msg("msgLogin", "❌ Email ou mot de passe incorrect.", "red");
      }
    });
  }

  const orderForm = document.getElementById("orderForm");
  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name    = document.getElementById("clientName").value.trim();
      const phone   = document.getElementById("clientPhone").value.trim();
      const city    = document.getElementById("clientCity").value.trim();
      const date    = document.getElementById("visitDate").value;
      const product = getSelectedProduct();

      if (!name) {
        msg("msgOrder", "❌ Veuillez entrer votre nom.", "red"); return;
      }

      if (!REGEX_PHONE.test(phone)) {
        msg("msgOrder", "❌ Numéro invalide. Format attendu : 05XXXXXXXX, 06XXXXXXXX ou 07XXXXXXXX.", "red");
        return;
      }

      if (!city) {
        msg("msgOrder", "❌ Veuillez entrer votre ville.", "red"); return;
      }

      if (!date) {
        msg("msgOrder", "❌ Veuillez choisir une date de visite.", "red"); return;
      }

      const today    = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(date);
      if (selected <= today) {
        msg("msgOrder", "❌ La date de visite doit être dans le futur.", "red");
        return;
      }

      if (!product) {
        msg("msgOrder", "❌ Veuillez sélectionner un meuble.", "red"); return;
      }

      const dateFormatee = new Date(date).toLocaleDateString("fr-FR", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
      });
      msg("msgOrder", `✅ Réservation validée pour « ${product.nom} » le ${dateFormatee}.`, "green");
      orderForm.reset();
      const info = document.getElementById("selectedProductInfo");
      if (info) info.textContent = "Aucun produit sélectionné.";
      setDateMin();
    });
  }

});
