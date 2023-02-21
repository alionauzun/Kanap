//-------dansla page produit je récupère les données du produit sélectionné, pour les affiches dans le HTML, et permettre à l'utilisateur de sélectionner une couleur et une quantité pour ajouter le produit au panier----------------

//fonction pour récupère les données du produit sélectionné
function getProduct(id) {
  fetch("http://localhost:3000/api/products/" + id)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      const error = res.status; 
      return Promise.reject(error);
    })
    .then((data) => updateDescription(data))
    .catch((error) => {
      alert("Erreur : " + error);
    });
}

//je récupère l'id de l'url  
let url = new URL(window.location.href);
let search_params = new URLSearchParams(url.search);
const id = search_params.get("id");
if (search_params.has("id")) {
  getProduct(id);
}

// fonction pour afficher les données du produit
function updateDescription(product) {
  let imageNode = document.getElementsByClassName("item__img")[0];
  let image = makeImage(product.imageUrl, product.altTxt);
  imageNode.appendChild(image);
  makeTitle(product.name);
  makePrice(product.price);
  makeDescription(product.description);
  makeColors(product.colors);
}
//afficher l'image
function makeImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  return image;
}
//afficher le nom
function makeTitle(name) {
  let h1 = document.getElementById("title");
  h1.innerHTML = name;
}
//afficher le prix
function makePrice(price) {
  let cost = document.getElementById("price");
  cost.innerHTML = price;
}
//afficher la description
function makeDescription(description) {
  let par = document.getElementById("description");
  par.innerHTML = description;
}
//afficher les couleurs
function makeColors(colors) {
  let options = document.getElementById("colors");

  colors.forEach((color) => {
    let option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    options.appendChild(option);
  });
}

//j'ajoute un écouteur d'événement click au bouton pour declencher la fonction addToCart et ajouter le produit au panier 
const button = document.getElementById("addToCart");

button.addEventListener("click", () => {
  const color = document.getElementById("colors").value;

  const quantity = parseInt (document.getElementById("quantity").value);
  
  if (color == "") {
    alert("Veuillez choisir une couleur");
    return;
  }
  if (quantity <= 0 || quantity > 100){
    alert("Veuillez choisir une quantité");
    return; 
  }

//Je crée un objet produit
  const produit = {
    id: id,
    color: color,
    quantity: quantity,
  };
  addToCart(produit);
});

//fonction pour ajouter le produit au panier
function addToCart(produit) {
  let panier = localStorage.getItem("panier");
  if (panier == null) {
    panier = [];
  } else {
    panier = JSON.parse(panier);
  }
  
  //je crée une variable pour trouver l'index du produit dans le panier
  let produitIndex = panier.findIndex((element) => {
    return element.id == produit.id && element.color == produit.color;
  }); 
  if (produitIndex == -1) {
    panier.push(produit);
  } else {
    panier[produitIndex].quantity += produit.quantity;
  }
  localStorage.setItem("panier", JSON.stringify(panier));
}
