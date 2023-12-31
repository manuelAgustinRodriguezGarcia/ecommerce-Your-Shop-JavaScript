const inputBusqueda = document.getElementById("inputBusqueda");
const botonBusqueda = document.getElementById("botonBusqueda");
const seccionBusqueda = document.getElementById("sectionBusqueda");
const seccionFav = document.getElementById("seccionFav")
const resultadoBusqueda = document.getElementById("resultadoBusqueda");
const listaFavoritos = document.getElementById("listaDeFavoritos");
const seccionProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("listaDeCarrito");
const seccionCarrito = document.getElementById("seccionCarrito");
const contadorCarrito = document.getElementById("contadorCarrito");
let listaProductos = [];
let contadorCarritoValor = parseInt(localStorage.getItem("contadorCarrito")) || 0;
contadorCarrito.textContent = contadorCarritoValor;

document.addEventListener('DOMContentLoaded', function(){ //trae el json solo cuando se carga el index, sino tira el error de que falla la busqueda en favoritos y carrito
  if(window.location.pathname === '/index.html') {
    window.addEventListener('load', function(){
      fetch('products.json') //para traer los datos del archivo JSON
      .then(resp => resp.json())//lo convierte a json
      .then(resultado => { //si funciona bien trae el archivo JSON
        listaProductos = resultado;
        listaProductos.forEach(productoX => {
          const productosGeneralesDiv = document.createElement('div');
          productosGeneralesDiv.classList.add('productoGeneral');
          productosGeneralesDiv.innerHTML = `
            <img src="${productoX.imgURL}" title="${productoX.nombre}" alt="Imagen de ${productoX.nombre}">
            <div>
              <h3>${productoX.nombre}</h3>
              <p>${productoX.descripcion}</p>
            </div>`
          seccionProductos.appendChild(productosGeneralesDiv);})})
    .catch(() => console.error("La busqueda del JSON de los productos no esta funcionando!")); //si no funciona el fetch...
    });
  }
})

inputBusqueda.addEventListener('change', empezarBusqueda); //si hace click en el boton o enter busca el producto
botonBusqueda.addEventListener('click', empezarBusqueda);

function empezarBusqueda() {
  const ingresoInput = inputBusqueda.value.trim();
  const productosEncontrados = filtrarProductos(ingresoInput);
  mostrarResultados(productosEncontrados);
}

function filtrarProductos(ingresoInput) {
  if (ingresoInput === "") { //si no ingresa nada, no se hace nada
    return [];
  }
  const productosFiltrados = listaProductos.filter(productoX => productoX.nombre.toUpperCase().includes(ingresoInput.toUpperCase()));
  if (productosFiltrados.length === 0) { //si no se encuentra ningun producto devuelve un ALERT de swal
    Swal.fire({ //alert personalizado de swal
      position: 'center',
      icon: 'error',
      title: 'No se ha encontrado ningún producto!',
      showConfirmButton: true,
      allowEnterKey: true,
      timerProgressBar: true,
      timer: 3000,
      iconColor:'rgba(255, 98, 0, 0.70)'
    })
  }
  return productosFiltrados ;
}

function mostrarResultados(listaProductos) { //muestra los resultados de la busqueda en el index
  resultadoBusqueda.innerHTML = "";
  listaProductos.forEach(productoX => {
    const productoEncontradoDiv = document.createElement('div');
    productoEncontradoDiv.classList.add('productoEncontrado');
    productoEncontradoDiv.innerHTML = `
      <img src="${productoX.imgURL}" title="${productoX.nombre}" alt="Imagen de ${productoX.nombre}">
      <h3>$${productoX.precio.toLocaleString()}</h3>
      <p>${productoX.nombre} | ${productoX.stock} unid.</p>
      <p>${productoX.descripcion}</p>
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
      </svg>
      <button>Agregar al Carrito</button>`;
    resultadoBusqueda.appendChild(productoEncontradoDiv);
    const botonAgregarCarrito = productoEncontradoDiv.querySelector('button');
    botonAgregarCarrito.addEventListener('click', function (){
      if(!productoYaEnCarrito(productoX)) {
        agregarCarrito(productoX);
        contadorCarritoValor++;
        localStorage.setItem("contadorCarrito", contadorCarritoValor);
        contadorCarrito.innerText = contadorCarritoValor;
        const Toast = Swal.mixin({ 
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        Toast.fire({
          icon: 'success',
          iconColor:'rgba(255, 98, 0, 0.70)',
          title: 'Agregado al Carrito!'
        })
      }else {
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        Toast.fire({
          icon: 'warning',
          iconColor:'rgba(255, 98, 0, 0.70)',
          title: 'El producto ya esta en el carrito!'
        })
      }
    });
    //ambas son para que los botones agreguen al carrito(button) y a favoritos(corazon svg) 
    const botonAgregarFavoritos = productoEncontradoDiv.querySelector('svg');
    productoYaEnFavoritos(productoX) && botonAgregarFavoritos.classList.add("favoritosActivado");//si ya esta en favoritos que el corazon sea naranja
    botonAgregarFavoritos.addEventListener('click', function(){
      botonAgregarFavoritos.classList.add("favoritosActivado");
      if(!productoYaEnFavoritos(productoX)) { //funcion para que no se agregue mas de una vez a favoritos el mismo producto
        agregarFavoritos(productoX);
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        Toast.fire({
          icon: 'success',
          iconColor:'rgba(255, 98, 0, 0.70)',
          title: 'Agregado a Favoritos!'
        })
      }else {
        function eliminarDeFavoritos(productoX) {//elimina de favoritos si toca de nuevo el corazon
          const fav = JSON.parse(localStorage.getItem('favorito')) || [];
          const nuevosFavoritos = fav.filter(seVa => seVa.nombre !== productoX.nombre);
          localStorage.setItem('favorito',JSON.stringify(nuevosFavoritos));
          botonAgregarFavoritos.classList.remove("favoritosActivado");
        }
        eliminarDeFavoritos(productoX);
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        Toast.fire({
          icon: 'error',
          title: 'Eliminado de Favoritos!'
        })
      }
    });
    resultadoBusqueda.appendChild(productoEncontradoDiv)
    seccionBusqueda.appendChild(resultadoBusqueda)
    seccionBusqueda.classList.add("sectionBusqueda")
    const carrusel = document.getElementById('carrusel'); //cambia el margin del carrusel asi no queda muy separado
    carrusel.style.marginTop = `5px`;
  });
}


function productoYaEnFavoritos(productoX) {
  //si no hay ninguna key "favorito" es falsy y asigna [] como valor a fav
  const fav = JSON.parse(localStorage.getItem('favorito')) || []; 
  return fav.some(yaEsta => yaEsta.nombre === productoX.nombre);
  //some (si un producto de la lista coincide con el nombre de yaEsta entonces significa que ya esta en favoritos)
}

function productoYaEnCarrito(productoX) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || []; 
  return carrito.some(yaEsta => yaEsta.nombre === productoX.nombre);
}

function agregarFavoritos(productoX) { 
  const fav = JSON.parse(localStorage.getItem('favorito')) || [];
  fav.push(productoX);//agrego el producto seleccionado a fav, osea almaceno el valor en la key 'favorito'
  localStorage.setItem('favorito', JSON.stringify(fav)); //Agrega el producto al localStorage
}
//son iguales pero agregan a dos key diferentes (carrito y favoritos)
function agregarCarrito(productoX) { 
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.push(productoX);
  localStorage.setItem('carrito', JSON.stringify(carrito));
}


//cuando cargue la pagina que aparezcan los que esten dentro del localStorage con la key 'favorito'
document.addEventListener('DOMContentLoaded', function(){ //arregla el error de intentar cargarlo sin estar en la pagina
  if(window.location.pathname === '/favorites.html') {
    window.addEventListener('load', function(){
      const fav = JSON.parse(localStorage.getItem('favorito')) || [];
      mostrarFavoritos(fav);
    });
  }
})

document.addEventListener('DOMContentLoaded', function(){
  if(window.location.pathname === '/cart.html') {
    window.addEventListener('load', function(){ 
      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      mostrarCarrito(carrito);
    })
  }
})

function mostrarCarrito(carrito) {
  listaCarrito.innerHTML= "";
  carrito.forEach(productoX => {
    const productoCarrito = document.createElement('div');
    productoCarrito.classList.add("productoEnCarrito");
    productoCarrito.innerHTML = `
    <img src="${productoX.imgURL}" title="${productoX.nombre}" alt="Imagen de ${productoX.nombre}">
    <div>
      <h4>${productoX.nombre}</h4>
      <p>${productoX.descripcion}</p>
    </div>
    <span class="cantidad">
      <button id="restaBtn"> - </button>
      <input type="number" readonly>
      <button id="sumaBtn"> + </button>
    </span>`
    
    const restaBtn = productoCarrito.querySelector('#restaBtn');
    const sumaBtn = productoCarrito.querySelector('#sumaBtn');
    let inputCantidad = productoCarrito.querySelector("input");
    inputCantidad.value = productoX.cantidad //el valor del input va a ser siempre igual al de la cantidad seleccionada
    sumaBtn.addEventListener("click",sumarUno);
    restaBtn.addEventListener("click",restarUno);
    let precioParcial = parseInt(productoX.precio) * inputCantidad.value;
    const precioProductoCarrito = document.createElement('span');
    precioProductoCarrito.classList.add("precioCarritoDiv");
    precioProductoCarrito.innerHTML =`
    <h3>$${precioParcial.toLocaleString()}</h3>
    <button id="eliminarCart">
      <img src="images/trash-can.png" alt="Boton para eliminar del carrito">
    </button>`
    const precioParcialProducto = precioProductoCarrito.querySelector('h3');
    function sumarUno() {
      const precioFinalDiv = document.getElementById("precioFinal");//si toca el input que aparezca el boton de actualizar
      const actualizarPrecioFinal = precioFinalDiv.querySelector('p');
      const botonComprarAhora = precioFinalDiv.querySelector('button');
      botonComprarAhora.classList.add("botonComprar-oculto");//esconde el boton de compra para evitar la venta sin actualizar el valor final
      actualizarPrecioFinal.classList.remove('actualizarPrecioFinal-oculto')
      actualizarPrecioFinal.classList.add("actualizarPrecioFinal");

      inputCantidad.value = parseInt(inputCantidad.value) + 1;
      precioParcial = parseInt(productoX.precio) * inputCantidad.value;
      precioParcialProducto.innerText = "$" + precioParcial.toLocaleString();
      let productosCarrito = JSON.parse(localStorage.getItem('carrito'));
      let nuevaCantidad = inputCantidad.value;
      let mismoNombre = productosCarrito.find(producto => {//especifica para cambiar la cantidad del producto indicado
        return producto.nombre === productoX.nombre;
      })
      if(mismoNombre) {
        mismoNombre.cantidad = nuevaCantidad;//si tiene el mismo nombre, asignale la nueva cantidad del input
        inputCantidad.value = nuevaCantidad;
        localStorage.setItem('carrito',JSON.stringify(productosCarrito));
      }
    }

    function restarUno() {
      if (inputCantidad.value > 1 ) {
        const precioFinalDiv = document.getElementById("precioFinal");
        const actualizarPrecioFinal = precioFinalDiv.querySelector('p');
        const botonComprarAhora = precioFinalDiv.querySelector('button');
        botonComprarAhora.classList.add("botonComprar-oculto");
        actualizarPrecioFinal.classList.remove('actualizarPrecioFinal-oculto')
        actualizarPrecioFinal.classList.add("actualizarPrecioFinal");

        inputCantidad.value = parseInt(inputCantidad.value) - 1;
        precioParcial = parseInt(productoX.precio) * inputCantidad.value;
        precioParcialProducto.innerText = "$" + precioParcial.toLocaleString();
        let productosCarrito = JSON.parse(localStorage.getItem('carrito'));
        let nuevaCantidad = inputCantidad.value;
        let mismoNombre = productosCarrito.find(producto => {
          return producto.nombre === productoX.nombre;
        })
        if(mismoNombre) {
          mismoNombre.cantidad = nuevaCantidad;
          inputCantidad.value = nuevaCantidad;
          localStorage.setItem('carrito',JSON.stringify(productosCarrito));
        }
      }
    }
    const botonEliminarCarrito = precioProductoCarrito.querySelector('button');
    botonEliminarCarrito.addEventListener("click", function() {
      eliminarDeCarrito(productoX);
      const Toast = Swal.mixin({ //alert personalizado de swal
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      Toast.fire({
        icon: 'error',
        title: 'Eliminado de tu carrito!'
      })
    })
    productoCarrito.appendChild(precioProductoCarrito);
    listaCarrito.appendChild(productoCarrito);
    seccionCarrito.appendChild(listaCarrito);
  })
  
  if (carrito.length > 0) {
    const preciosEnCarrito = carrito.map(productoX => productoX.precio * productoX.cantidad);
    let precioFinal = preciosEnCarrito.reduce((acumulador,valorActual) => acumulador + valorActual);
    const precioFinalDiv = document.getElementById("precioFinal");
    precioFinalDiv.classList.add("precioFinal");
    precioFinalDiv.innerHTML = `
    <div>
      <h3>Total: $${precioFinal.toLocaleString()}</h3>
      <p>Actualizar valor total</p>
    </div>
    <button>Comprar Ahora</button>`
    seccionCarrito.appendChild(precioFinalDiv);
    const botonComprarAhora = precioFinalDiv.querySelector('button');
    const actualizarPrecioFinal = precioFinalDiv.querySelector('p');
    actualizarPrecioFinal.classList.add('actualizarPrecioFinal-oculto');
    actualizarPrecioFinal.addEventListener('click' ,() => {
      location.reload();
    })
    botonComprarAhora.addEventListener('click',vaciarDespues);
    function vaciarDespues() {
      Swal.fire({
        position: 'center',
        icon: 'success',
        showConfirmButton: false,
        title: 'La compra se realizó con éxito!',
        allowOutsideClick: false,
        allowEnterKey: false,
        timerProgressBar: true,
        timer: 3000,
        iconColor:'rgba(255, 98, 0, 0.70)'
      })
      setTimeout(vaciarCarrito,3000);//a los 3 segundos cuando termina el alert vacia el carrito
    }
    function vaciarCarrito() {
      location.reload();
      contadorCarritoValor = 0;
      localStorage.setItem('contadorCarrito',contadorCarritoValor);
      const carritoNuevo = 0;
      localStorage.setItem('carrito',carritoNuevo);
    }
  } else {
    const precioFinalDiv = document.getElementById("precioFinal");
    precioFinalDiv.classList.remove("precioFinal")
    precioFinalDiv.classList.add("imagenVacio");
    precioFinalDiv.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-emoji-frown" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
    </svg>
    <p>No hay ningún producto agregado al carrito!</p>`
    seccionCarrito.appendChild(precioFinalDiv);
  }
}

function mostrarFavoritos(fav) {
  if (fav.length === 0) {
    const favoritosVacio = document.createElement("div");
    favoritosVacio.classList.add("imagenVacio");
    favoritosVacio.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heartbreak" viewBox="0 0 16 16">
    <path d="M8.867 14.41c13.308-9.322 4.79-16.563.064-13.824L7 3l1.5 4-2 3L8 15a38.094 38.094 0 0 0 .867-.59Zm-.303-1.01-.971-3.237 1.74-2.608a1 1 0 0 0 .103-.906l-1.3-3.468 1.45-1.813c1.861-.948 4.446.002 5.197 2.11.691 1.94-.055 5.521-6.219 9.922Zm-1.25 1.137a36.027 36.027 0 0 1-1.522-1.116C-5.077 4.97 1.842-1.472 6.454.293c.314.12.618.279.904.477L5.5 3 7 7l-1.5 3 1.815 4.537Zm-2.3-3.06-.442-1.106a1 1 0 0 1 .034-.818l1.305-2.61L4.564 3.35a1 1 0 0 1 .168-.991l1.032-1.24c-1.688-.449-3.7.398-4.456 2.128-.711 1.627-.413 4.55 3.706 8.229Z"/>
    </svg>
    <p>No hay ningún producto guardado en favoritos!</p>`
    seccionFav.appendChild(favoritosVacio);
  }
  listaFavoritos.innerHTML = "";
  fav.forEach(productoX => {
    const productoFavorito = document.createElement('div');
    productoFavorito.classList.add("productoEncontrado");
    productoFavorito.innerHTML = `
    <img src="${productoX.imgURL}" title="${productoX.nombre}" alt="Imagen de ${productoX.nombre}">
    <h3>$${productoX.precio}</h3>
    <p>${productoX.nombre} | ${productoX.stock} unid.</p>
    <p>${productoX.descripcion}</p>
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
    <button>Agregar al Carrito</button>`;

    const botonAgregarCarrito = productoFavorito.querySelector('button'); //mismo codigo pero en la pag de favoritos
    botonAgregarCarrito.addEventListener("click",function(){
      if(!productoYaEnCarrito(productoX)) {
        contadorCarritoValor++;
        localStorage.setItem("contadorCarrito", contadorCarritoValor);
        contadorCarrito.innerText = localStorage.getItem("contadorCarrito");
        agregarCarrito(productoX)
        const Toast = Swal.mixin({ //alert personalizado de swal
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        Toast.fire({
          icon: 'success',
          iconColor:'rgba(255, 98, 0, 0.70)',
          title: 'Agregado a Carrito!'
        })
      }else {
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        Toast.fire({
          icon: 'warning',
          iconColor:'rgba(255, 98, 0, 0.70)',
          title: 'El producto ya esta en el carrito!'
        })
      }
    })
    const botonEliminarFavoritos = productoFavorito.querySelector('svg'); //funcionalidad del boton eliminar
    botonEliminarFavoritos.addEventListener('click', function() {
      eliminarDeFavoritos(productoX);
      const Toast = Swal.mixin({ //alert personalizado de swal
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      Toast.fire({
        icon: 'error',
        title: 'Eliminado de Favoritos!'
      })
    });
    listaFavoritos.appendChild(productoFavorito);
    seccionFav.appendChild(listaFavoritos);
  })
}
//si el filter encuentra un producto en favoritos o en el carrito con el mismo nombre lo elimina
function eliminarDeFavoritos(productoX) {
  const fav = JSON.parse(localStorage.getItem('favorito')) || [];
  const nuevosFavoritos = fav.filter(seVa => seVa.nombre !== productoX.nombre);
  localStorage.setItem('favorito',JSON.stringify(nuevosFavoritos));
  mostrarFavoritos(nuevosFavoritos);
}

function eliminarDeCarrito(productoX) {
  contadorCarritoValor--;
  localStorage.setItem("contadorCarrito", contadorCarritoValor);
  contadorCarrito.innerText = contadorCarritoValor;
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const carritoNuevo = carrito.filter(seVa => seVa.nombre !== productoX.nombre);
  localStorage.setItem('carrito',JSON.stringify(carritoNuevo));
  mostrarCarrito(carritoNuevo);
}

//Carrusel de index
document.addEventListener('DOMContentLoaded', function(){ //arregla el error de intentar cargarlo sin que este en la pagina
  if(window.location.pathname === '/index.html') {
    const botonIzq = document.getElementById("botonIzq");
const botonDer = document.getElementById("botonDer");
const portada = document.getElementById("portada");
const imagenes = document.querySelectorAll(".carrusel-portada-img");//crea la nodelist "imagenes"

botonIzq.addEventListener("click", x => moverIzquierda());
botonDer.addEventListener("click", x => moverDerecha());

let movimiento = 0;
let widthImg = 100 / imagenes.length; //divide el 100% en la cantidad de imagenes para que tengan el mismo tamaño
let contadorPortada = 0;

function moverDerecha() {
  if (contadorPortada >= imagenes.length-1) {//como contador empieza en 0 le resto 1 al length de imagenes
    contadorPortada = 0;
    movimiento = 0;
    portada.style.transform = `translate(-${movimiento}%)`;
    portada.style.transition = "none";
    return;
  }//asi vuelve a la primer imagen
    contadorPortada ++;
    movimiento = movimiento + widthImg;
    portada.style.transform = `translate(-${movimiento}%)`;
    portada.style.transition = "all ease .8s";
}

function moverIzquierda() {
  contadorPortada --;
  if(contadorPortada < 0) {
    contadorPortada = imagenes.length-1;//asigno el ultimo valor de imagenes
    movimiento = widthImg * (imagenes.length-1)
    portada.style.transform = `translate(-${movimiento}%)`;
    portada.style.transition = "none";
    return;
  }
  movimiento = movimiento - widthImg;
  portada.style.transform = `translate(-${movimiento}%)`;
  portada.style.transition = "all ease .8s";
}
  setInterval(moverDerecha, 6000)//cada 6 seg se mueve sola la imagen del carrusel
  }
})