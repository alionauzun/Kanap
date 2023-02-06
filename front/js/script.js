//------------intégrer l’ensemble des produits de l’API dans la page d’accueil(DOM)de façon dynamique----------------

fetch("http://localhost:3000/api/products")
.then((res) => res.json())
.then((data) => addProducts(data))

//je crée une fonction addProducts qui prend en paramètre donnes qui est un tableau qui contient les données de l'API
function addProducts(donnes){
        donnes.forEach((kanap) => {  //La méthode forEach() permet d'exécuter une fonction donnée sur chaque élément du tableau.
        // je crée un tableau qui contient les données de l'API nommé kanap
        const {_id, imageUrl, altTxt, name, description} = kanap;
        const anchor = makeAnchor(_id);//je fait appelle a la fonction makeAnchor qui prend en paramètre _id pour créer un élément de type 'a' 
        const article = document.createElement("article")//
        const image = makeImage(imageUrl, altTxt)
        const h3 = makeH3(name)
        const p = makeParagraph(description)

        //j'ajoute les donnes dans l'élément de 'article'
        appendElementsToArticle(article, [image,h3, p])
        appendArticleToAnchor(anchor, article)
    })
    }

//je crée une fonction pour ajouter les donnes de l'API dans l'élément de 'article'
function appendElementsToArticle(article, array) {
    array.forEach((item) => {
        article.appendChild(item)
    })
}

//je crée une fonction pour créer un élément de type 'a' avec l'id de chaque produit
function  makeAnchor (id){
    const anchor = document.createElement("a")
    anchor.href = "./product.html?id=" + id 
    return anchor
}

//je crée une fonction pour ajouter les donnes dans l'élément de 'article'
function appendArticleToAnchor(anchor, article){
    const items = document.getElementById("items")
    items.appendChild(anchor)
    anchor.appendChild(article)
}

//je crée une fonction pour créer un élément de type 'img' 
function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    return image
}

//je crée pour créer un élément de type 'h3'
function makeH3(name) {
    const h3 = document.createElement("h3")
    h3.textContent = name
    h3.classList.add("productName")
    return h3
}

//je crée pour créer un élément de type 'p' 
function makeParagraph(description) {
    const p = document.createElement("p")
    p.textContent = description
    p.classList.add("productDescription")
    return p
}
