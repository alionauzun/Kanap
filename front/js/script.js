fetch("http://localhost:3000/api/products")
.then((res) => res.json())
.then((data) => console.log(data))

const anchor = document.createElement("a")
anchor.href = "http://localhost:3000/images/kanap0"
