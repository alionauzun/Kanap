let total = 0;
let totalQuantity = 0;

//---------Récupération des données du localStorage---------

let produit = localStorage.getItem("panier"); //panier est le nom de la clé dans le localStorage

produit = JSON.parse(produit); //produit est un tableau d'objet et je les transforme en objet JavaScript avec JSON.parse


//-----------Création de la structure HTML----------------
// Je crée une boucle for de génération de la structure HTML pour chaque élément du panier
for (let i = 0; i < produit.length; i++) {
    let panierElement = produit[i];
    getProduct(panierElement.id, panierElement.color, panierElement.quantity);
}

// Je crée une fonction qui permet de récupérer les données de l'API
function createArticle(panierElement, color, quantity) {
    const sectionCartItems = document.getElementById("cart__items");

//Creation d'une balise article dédiée à un élément du panier 
    const article = document.createElement("article");
    article.classList.add("cart__item");
    article.setAttribute("data-id", panierElement._id);
    article.setAttribute("data-color", panierElement.colors);

//Creation d'une balise dédiée à l'image de l'élément du panier
    const divImg = document.createElement("div");
    divImg.classList.add("cart__item__img");
    const imgageElement = document.createElement("img");

//Je recupere l'image de l'élément du panier 
    imgageElement.src = panierElement.imageUrl;
    imgageElement.alt = panierElement.altTxt;//altTxt est une propriété de l'objet panierElement

//Je recupere le nom de l'élément du panier
    const divContent = document.createElement("div");
    divContent.classList.add("cart__item__content");

    const divDescription = document.createElement("div");
    divDescription.classList.add("cart__item__content__description");

    const nomElement = document.createElement("h2");
    nomElement.innerText = panierElement.name;

//Je recupere la couleur de l'élément du panier
    const couleurElement = document.createElement("p");
    couleurElement.innerText = color;

//Je recupere le prix de l'élément du panier
    const prixElement = document.createElement("p");
    prixElement.innerText = panierElement.price + " €";

//Je recupere la quantité de l'élément du panier
    const divSettings = document.createElement("div");
    divSettings.classList.add("cart__item__content__settings");

    const settingsQuantity = document.createElement("div");
    settingsQuantity.classList.add("cart__item__content__settings__quantity");

    const quanityElement = document.createElement("p");
    quanityElement.innerText = "Qté :";

    const inputQuantity = document.createElement("input");
    inputQuantity.setAttribute("type", "number");//type number pour avoir un input avec des flèches pour augmenter ou diminuer la quantité de l'élément du panier 
    inputQuantity.setAttribute("name", "itemQuantity");//name itemQuantity pour pouvoir récupérer la valeur de l'input dans le localStorage 
    inputQuantity.setAttribute("min", "1");//min 1 pour ne pas avoir de quantité négative 
    inputQuantity.setAttribute("max", "100");//max 100 pour ne pas avoir de quantité trop élevée
    inputQuantity.setAttribute("value", quantity);//je fais appel à la variable quantity pour récupérer la quantité de l'élément du panier 
    inputQuantity.setAttribute("data-id", panierElement._id);//je fais appel à l'id de l'élément du panier pour pouvoir récupérer la valeur de l'input dans le localStorage 
    inputQuantity.setAttribute("data-color", color);
    inputQuantity.classList.add("itemQuantity");// classList.add pour ajouter une classe à l'input pour pouvoir récupérer la valeur de l'input dans le localStorage
    inputQuantity.addEventListener("change", (event) => {
    const input = event.target; ////Je crée un événement au clic sur l'input pour mettre à jour le prix et la quantité de l'élément du panier dans le HTML
    updatePriceAndQuantity(
        input.dataset.id,//dataset.id pour pouvoir récupérer la valeur de l'input dans le localStorage
        input.dataset.color,
        input.value,
        panierElement.price
        );
        updateItemsToLocalStorage(//updateItemsToLocalStorage est une fonction qui permet de mettre à jour les données du localStorage
        input.dataset.id,
        input.dataset.color,
        input.value
    );
    });

 //Je recupere le bouton supprimer de l'élément du panier
    const settingsDelete = document.createElement("div");
    settingsDelete.classList.add("cart__item__content__settings__delete");

    const deleteElement = document.createElement("p");
    deleteElement.classList.add("deleteItem");
    deleteElement.innerText = "Supprimer";

    deleteElement.addEventListener("click", () => {
    deleteArticle(panierElement, quantity);
    deleteItemToLocalStorage(panierElement._id, color);
    });

  //----------Placement des éléments dans le DOM-----------

  //Je place les éléments du panier dans le DOM
    sectionCartItems.appendChild(article);

  //Je place l'image de l'élément du panier dans le DOM
    article.appendChild(divImg);
    divImg.appendChild(imgageElement);

//Je place le contenu de l'élément du panier dans le DOM
    article.appendChild(divContent);
    divContent.appendChild(divDescription);
    divDescription.appendChild(nomElement);
    divDescription.appendChild(couleurElement);
    divDescription.appendChild(prixElement);

//Je place les paramètres de l'élément du panier dans le DOM
    divContent.appendChild(divSettings);
    divSettings.appendChild(settingsQuantity);
    settingsQuantity.appendChild(quanityElement);
    settingsQuantity.appendChild(inputQuantity);

//Je place le bouton supprimer de l'élément du panier dans le DOM
    divSettings.appendChild(settingsDelete);
    settingsDelete.appendChild(deleteElement);
    updateCartTotal(quantity, panierElement.price);
}

const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", (event) => {
    event.preventDefault();//event.preventDefault pour empêcher le comportement par défaut au clic sur le bouton commander de recharger la page
    submitForm()
}); //Je crée un événement au clic sur le bouton commander pour soumettre le formulaire

//Je crée une fonction pour récupérer les données de l'API
function getProduct(id, color, quantity) {
    fetch("http://localhost:3000/api/products/" + id) 
    .then((res) => res.json()) //Je transforme les données de l'API en objet javascript
    .then((data) => createArticle(data, color, quantity)); 
}

//Je crér une fonction pour supprimer un élément du panier
function deleteArticle(product, quantity) {
    const article = document.querySelector(
        "[data-id='" + product._id + "'][data-color='" + product.colors + "']"
    );
    article.remove();
    updateCartTotal(-quantity, product.price);
}

//Je crée une fonction pour modifier la quantité des produits de panier et le prix total du panier
function updatePriceAndQuantity(id, color, newInputQuantity, price) {
    let produitIndex = getIndexElementByIdAndColor(id, color);
    if (produitIndex == -1) {
        alert("produit n'existe pas");
        return;
    }
    const previousQuantity = produit[produitIndex].quantity;
    let difference = parseInt(newInputQuantity) - previousQuantity; //previousQuantity est la quantité de l'élément du panier avant la modification
    updateCartTotal(difference, price);
}

//Je crée une fonction pour calculer le total du panier
function updateCartTotal(quantity, price) {
  total += price * quantity;
    totalQuantity = parseInt(totalQuantity) + parseInt(quantity);
    const cartTotalQuantity = document.getElementById("totalQuantity");
    const cartTotalPrice = document.getElementById("totalPrice");
    cartTotalQuantity.innerText = totalQuantity;
    cartTotalPrice.innerText = total;
}

//Je crée une fonction pour modifier la quantité des produits de panier dans le localStorage
function updateItemsToLocalStorage(id, color, quantity) {
    let produitIndex = getIndexElementByIdAndColor(id, color);
    if (produitIndex == -1) {
    alert("produit n'existe pas");
    return;
    }
  //incrémenter la quantité des produits de panier
    produit[produitIndex].quantity = parseInt(quantity);
    localStorage.setItem("panier", JSON.stringify(produit));
}

//Je crée une fonction pour récupérer les données de l'API
function getIndexElementByIdAndColor(id, color) {
    return produit.findIndex((element) => {
    return element.id == id && element.color == color;
    });
}

//Je crée une fonction pour supprimer un élément du panier dans le localStorage
function deleteItemToLocalStorage(id, color) {
    let produitIndex = getIndexElementByIdAndColor(id, color);
    if (produitIndex == -1) {
    alert("produit n'existe pas");
    return;
}
produit.splice(produitIndex, 1);
localStorage.setItem("panier", JSON.stringify(produit));
}

//---------------------Formulaire--------------------

//Je crée une fonction pour soumettre le formulaire
function submitForm() {
    if (produit.length ===0) {
    alert("Votre panier est vide");
    return;
    } //Je crée une condition pour vérifier si le panier est vide

  if (isFormInvalid()) return; 
  if (isEmailInvalid()) return; //Je fait appel à la fonction pour valider l'email


  //Je crée une fonction pour créer un objet avec les données du formulaire et les données du panier pour envoyer les données au serveur 
const body = makeRequestBody();
console.log(body);
    fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
    "Content-Type": "application/json"
    }
    }) 

  //Je crée une requête POST pour envoyer les données du formulaire à l'API
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
    let orderId = data.orderId
    window.location.href = "/front/html/confirmation.html" + "?orderId=" + orderId;
    })
}

//Je crée une fonction pour valider le formulaire
function isFormInvalid() {
    const form = document.querySelector(".cart__order__form");
    const input = form.querySelectorAll("input");
    const regex = /^[a-zA-Z]+$/;//+$ pour dire que le nom doit contenir au moins un caractère 
    if (!regex.test(input[0].value)) {
        alert("Veuillez entrer un nom valide");
        return true;
    }
    input.forEach((input) => {
        if (input.value === "") {
            alert("Veuillez remplir tous les champs");
            return true;
        }
        return false;
    })
}

//Je crée une fonction pour valider l'email
function isEmailInvalid() {
    const email = document.getElementById("email").value;
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; 
    if (!regex.test(email)) {
        alert("Veuillez entrer une adresse email valide");
        return true;
    }
    return false;
}


//Je crée une fonction pour envoyer les données du formulaire
function makeRequestBody() {
    const form = document.querySelector(".cart__order__form");
    const firstName = form.elements.firstName.value;
    const lastName = form.elements.lastName.value;
    const address = form.elements.address.value;
    const city = form.elements.city.value;
    const email = form.elements.email.value;

    const body = {
        contact: {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email
    },
    products: getIdsFromLocalStorage()
    }
    return body;
}

//Je crée une fonction pour récupérer les id des produits du local storage
function getIdsFromLocalStorage() {
    const numberOrder = produit.length;
    const ids = [];
    for (let i = 0; i < numberOrder; i++) {
        ids.push (produit[i].id);
    }
    return ids;
}


