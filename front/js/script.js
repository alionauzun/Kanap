fetch("http://localhost:3000/api/products")
.then((res) => res.json())
.then((data) => addProducts(data))

function addProducts(products){
    const imageUrl = products[0].imageUrl

    const anchor = document.createElement("a")
    anchor.innerHTML = "je suis un lien"
    anchor.href = imageUrl
    const listNode = document.getElementById("items")
    listNode.appendChild(anchor)
}