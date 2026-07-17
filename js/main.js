let productos = [];

// 1. Conectamos con tu base de datos alojada en Render
fetch("https://e-commerce-b1jt.onrender.com/api/productos")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })
    .catch(error => console.error("Error cargando los productos:", error));

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");
const aside = document.querySelector("aside"); // Se añade la constante aside que faltaba definir

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        // 2. Utilizamos el sistema de columnas de Bootstrap
        div.classList.add("col-12", "col-md-6", "col-lg-4", "mb-4");
        
        // 3. Implementamos la estructura Card de Bootstrap
        div.innerHTML = `
            <div class="card h-100 shadow-sm border-0 bg-light">
                <img src="${producto.imagen}" class="card-img-top rounded-top-3" alt="${producto.titulo}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-dark fw-bold">${producto.titulo}</h5>
                    <p class="card-text fw-bold fs-5 text-primary mb-3">$${producto.precio}</p>
                    <!-- Es vital mantener la clase 'producto-agregar' y el id para que el carrito funcione -->
                    <button class="btn btn-dark mt-auto producto-agregar w-100 rounded-pill" id="${producto.id}">
                        <i class="bi bi-cart-plus"></i> Agregar
                    </button>
                </div>
            </div>
        `;

        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar();
}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            // Validamos que el producto exista para evitar errores al leer el nombre de la categoría
            if(productosBoton.length > 0) {
                tituloPrincipal.innerText = productosBoton[0].categoria.nombre;
            }
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    })
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: { x: '1.5rem', y: '1.5rem' },
        onClick: function(){} 
      }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}