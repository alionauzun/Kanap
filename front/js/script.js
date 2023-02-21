//------------dans ce fichier j'integre le code suivant pour afficher les produits sur la page d'accueil de façon dynamique

//je fais une requête fetch pour récupérer les données de l'API 
fetch("http://localhost:3000/api/products")
.then((res) => res.json())
.then((data) => addProducts(data))

//fonction pour ajouter les produits sur la page d'accueil
function addProducts(donnes){
        donnes.forEach((kanap) => {
        const {_id, imageUrl, altTxt, name, description} = kanap;
        
        //je crée les éléments de chaque produit 
        const anchor = makeAnchor(_id);
        const article = document.createElement("article")
        const image = makeImage(imageUrl, altTxt)
        const h3 = makeH3(name)
        const p = makeParagraph(description)

        //ajouter les éléments dans l'article
        appendElementsToArticle(article, [image,h3, p])
        appendArticleToAnchor(anchor, article)
    })
    }

//fonction pour ajouter les éléments dans l'article
function appendElementsToArticle(article, array) {
    array.forEach((item) => {
        article.appendChild(item)
    })
}

//fonction pour créer l'ancre
function  makeAnchor (id){
    const anchor = document.createElement("a")
    anchor.href = "./product.html?id=" + id 
    return anchor
}

//fonction pour ajouter l'article dans l'ancre
function appendArticleToAnchor(anchor, article){
    const items = document.getElementById("items")
    items.appendChild(anchor)
    anchor.appendChild(article)
}

//function pour créer l'image de chaque produit 
function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    return image
}

//fonction pour créer le nom de chaque produit
function makeH3(name) {
    const h3 = document.createElement("h3")
    h3.textContent = name
    h3.classList.add("productName")
    return h3
}

//function pour créer la description de chaque produit
function makeParagraph(description) {
    const p = document.createElement("p")
    p.textContent = description
    p.classList.add("productDescription")
    return p
}
