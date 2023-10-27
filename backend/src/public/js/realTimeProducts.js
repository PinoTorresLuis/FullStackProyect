const socket = io ();

const form = document.getElementById("formProduct");
const containerProducts = document.getElementById("container-products");

socket.emit("load");

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const datForm = new FormData (e.target);
    const prod = Object.fromEntries(datForm);
    socket.emit('newProduct',prod);
    console.log(prod)
    Swal.fire(
        'Producto creado correctamente!',
        'success'
      )
    form.reset();
} )


 socket.on('products', products =>{
  containerProducts.innerHTML = "";

  products.forEach(prod =>{
     const div = document.createElement("div");
     div.classList.add("product");
     div.innerHTML =`
        <p>Id: ${prod.id}</p>
        <p>Title: ${prod.title}</p>
        <p>Description: ${prod.description}</p>
        <p>Price: ${prod.price}</p>
        <p>thumbnail:${prod.thumbnail}</p>
        <p>Code: ${prod.code}</p>
        <p>Stock: ${prod.stock}</p>
        <button onclick="deleteProduct('${prod.id}')" class="btn-delete">Eliminar</button>
      `;
    containerProducts.append(div);
  })
})
