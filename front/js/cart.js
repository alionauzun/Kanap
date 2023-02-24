let total = 0;
let totalQuantity = 0;

//---------Récupération des données du localStorage---------

let produit = localStorage.getItem("panier"); 
produit = JSON.parse(produit);


//-----------Création de la structure HTML----------------

// Je crée une boucle for pour parcourir les elements du panier stocké dans l'objet produit
for (let i = 0; i < produit.length; i++) {
    let panierElement = produit[i];
    getProduct(panierElement.id, panierElement.color, panierElement.quantity);
}

// Cette fonction crée une representation visuelle du produit dans le panier
function createArticle(panierElement, color, quantity) {
    const sectionCartItems = document.getElementById("cart__items");

//Creation d'une balise article dédiée à un élément du panier 
    const article = document.createElement("article");
    article.classList.add("cart__item");
    article.setAttribute("data-id", panierElement._id);
    article.setAttribute("data-color", color);

//Creation d'une balise dédiée à l'image de l'élément du panier
    const divImg = document.createElement("div");
    divImg.classList.add("cart__item__img");
    const imgageElement = document.createElement("img");

//Je recupere l'image de l'élément du panier 
    imgageElement.src = panierElement.imageUrl;
    imgageElement.alt = panierElement.altTxt;

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

//Je recupere les paramètres de l'élément du panier
    const divSettings = document.createElement("div");
    divSettings.classList.add("cart__item__content__settings");

    const settingsQuantity = document.createElement("div");
    settingsQuantity.classList.add("cart__item__content__settings__quantity");

    const quanityElement = document.createElement("p");
    quanityElement.innerText = "Qté :";
// je ajoute des attributs à l'input pour pouvoir le modifier et le supprimer 
    const inputQuantity = document.createElement("input");
    inputQuantity.setAttribute("type", "number");
    inputQuantity.setAttribute("name", "itemQuantity");
    inputQuantity.setAttribute("min", "1");
    inputQuantity.setAttribute("max", "100");
    inputQuantity.setAttribute("value", quantity);
    inputQuantity.setAttribute("data-id", panierElement._id);
    inputQuantity.setAttribute("data-color", color);
    inputQuantity.classList.add("itemQuantity");
    inputQuantity.addEventListener("change", (event) => {
    const input = event.target;

    // Je met à jour le prix et la quantité de l'élément du panier
    updatePriceAndQuantity(
        input.dataset.id,
        input.dataset.color,
        input.value,
        panierElement.price
        );
    // Je met à jour le local storage
        updateItemsToLocalStorage(
        input.dataset.id,
        input.dataset.color,
        input.value
    );
    });

 //Je crée un bouton supprimer pour supprimer un élément du panier
    const settingsDelete = document.createElement("div");
    settingsDelete.classList.add("cart__item__content__settings__delete");

    const deleteElement = document.createElement("p");
    deleteElement.classList.add("deleteItem");
    deleteElement.innerText = "Supprimer";

    deleteElement.addEventListener("click", () => {
    deleteArticle(panierElement, color, quantity);
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

//le bouton commander qui soumis le formulaire de commande et envoie les données au serveur 
const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", (event) => {
    event.preventDefault();
    submitForm()
}); 

//Je crée une fonction pour récupérer les données de l'API
function getProduct(id, color, quantity) {
    fetch("http://localhost:3000/api/products/" + id) 
    .then((res) => res.json()) 
    .then((data) => createArticle(data, color, quantity)); 
}

//Je crér une fonction pour supprimer un élément du panier
function deleteArticle(product, color, quantity) {
    const article = document.querySelector(
        "[data-id='" + product._id + "'][data-color='" + color + "']"
    );
    article.remove();
    updateCartTotal(-quantity, product.price);
}

//Je crée une fonction pour mettre à jour le prix et la quantité des produits de panier
function updatePriceAndQuantity(id, color, newInputQuantity, price) {
    let produitIndex = getIndexElementByIdAndColor(id, color);
    if (produitIndex == -1) {
        alert("produit n'existe pas");
        return;
    }
    const previousQuantity = produit[produitIndex].quantity;
    let difference = parseInt(newInputQuantity) - previousQuantity; 
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

//Je crée une fonction pour récupérer l'index d'un élément du panier
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
    }
    if (isFormInvalid()) return; 
    if (isEmailInvalid()) return; 
    const body = makeRequestBody();

    //Je crée une requête POST pour envoyer les données au serveur
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
      }) //Je récupère l'identifiant de la commande et je le stocke dans le localStorage pour l'afficher sur la page de confirmation de commande 
    .then((res) => res.json())
    .then((data) => {
    let orderId = data.orderId
    window.location.href = "/front/html/confirmation.html" + "?orderId=" + orderId;
    })
}
//fonction pour valider le formulaire
function isFormInvalid() {
    const form = document.querySelector(".cart__order__form");
    const input = form.querySelectorAll("input");
    const regex = /^[a-zA-Z]+$/;
    const regexAddress = /^[0-9]+[a-zA-Z\s,'-]*$/;
    if (!regex.test(input[0].value)) {
        let message = document.getElementById("firstNameErrorMsg");
        message.innerHTML = "Veuillez entrer un prenom valide";
        return true;
    }
    if (!regex.test(input[1].value)) {
        let message = document.getElementById("lastNameErrorMsg");
        message.innerHTML = "Veuillez entrer un nom valide";
        return true;
    }
    if (!regexAddress.test(input[2].value)) {
        let message = document.getElementById("addressErrorMsg");
        message.innerHTML = "Veuillez entrer une adresse valide";
        return true;
    }
    if (!regex.test(input[3].value)) {
        let message = document.getElementById("cityErrorMsg");
        message.innerHTML = "Veuillez entrer une ville valide";
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

//fonction pour valider l'email
function isEmailInvalid() {
    const email = document.getElementById("email").value;
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; 
    if (!regex.test(email)) {
        let message = document.getElementById("emailErrorMsg");
        message.innerHTML = "Veuillez entrer une adresse email valide";
        return true;
    }
    return false;
}

//fonction pour créer le corps de la requête
function makeRequestBody() {
    const form = document.querySelector(".cart__order__form");
    const firstName = form.elements.firstName.value;
    const lastName = form.elements.lastName.value;
    const address = form.elements.address.value;
    const city = form.elements.city.value;
    const email = form.elements.email.value;
//je recupère les données du formulaire qui ont été entrées par l'utilisateur
//je les stocke dans un objet
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

//fonction pour récupérer les ids des produits du local storage
//pour les envoyer au serveur
function getIdsFromLocalStorage() {
    const numberOrder = produit.length;
    const ids = [];
    for (let i = 0; i < numberOrder; i++) {
        ids.push (produit[i].id);
    }
    return ids;
}


