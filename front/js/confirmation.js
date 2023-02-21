//-----------------Confirmation de la commande-----------------//
const orderId = getOrderId()
displayOrderId(orderId)
remouveLocalStorage()

//Je crée une fonction pour récupérer l'id de la commande
function getOrderId() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get("orderId")
}

//Je crée une fonction pour afficher l'id de la commande
function displayOrderId(orderId) {
    const orderIdElement = document.querySelector("#orderId")
    orderIdElement.innerHTML = orderId
}

//Je crée une fonction pour supprimer le local storage.
function remouveLocalStorage() {
    const localStorage = window.localStorage
    localStorage.clear()
}


