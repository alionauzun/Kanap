// je crée une fonction pour envoyer une requête HTTP GET à l'API pour récupérer les données d'un produit
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

//je récupère l'id de l'url avec la méthode URLSearchParams et la méthode get 
let url = new URL(window.location.href);//je récupère l'url
let search_params = new URLSearchParams(url.search);//je récupère les paramètres de l'url
const id = search_params.get("id");
if (search_params.has("id")) {
  getProduct(id);
}
// je crée une fonction updateDescription qui prend en paramètre product qui est un objet qui contient les données de l'API 
function updateDescription(product) {
  let imageNode = document.getElementsByClassName("item__img")[0]; 

  //j'affiche les donnes de l'API dans le HTML 
  let image = makeImage(product.imageUrl, product.altTxt);
  //on ajoute l'image dans l'élément de 'item__img'
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

//Je récupère l'élément (boutton) sur lequel je veut détecter le clic
const button = document.getElementById("addToCart");

// On écoute l'événement click, et on appelle la fonction addToCart au clic sur le bouton 
button.addEventListener("click", () => {
  const color = document.getElementById("colors").value;//je récupère la valeur de la couleur

  //je récupère la valeur de la quantité
  const quantity = parseInt (document.getElementById("quantity").value);//
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
//--------------------Le Local Storage--------------------

//Declaration de la fonction addToCart et de la variable "panier" dans laquelle on met les key et les values qui sont dans le local storage
function addToCart(produit) {
  let panier = localStorage.getItem("panier");
  if (panier == null) {
    panier = [];
  } else {
    panier = JSON.parse(panier);
  }
  
  //La méthode findIndex() renvoie l'indice du un élément du tableau qui satisfait une condition donnée par la fonction 
  let produitIndex = panier.findIndex((element) => {
    return element.id == produit.id && element.color == produit.color;
  });//si le produit n'existe pas dans le panier, 
  if (produitIndex == -1) {
    panier.push(produit); // on ajoute le produit dans le panier
  } else {
    panier[produitIndex].quantity += produit.quantity;
  }
  localStorage.setItem("panier", JSON.stringify(panier));
  console.log(produitIndex);
}
