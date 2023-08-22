const inputBusqueda = document.getElementById("inputBusqueda");
const botonBusqueda = document.getElementById("botonBusqueda");
const seccionBusqueda = document.getElementById("sectionBusqueda");
const seccionFav = document.getElementById("seccionFav")
const resultadoBusqueda = document.getElementById("resultadoBusqueda");
const listaFavoritos = document.getElementById("listaDeFavoritos");
const seccionProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("listaDeCarrito");
const seccionCarrito = document.getElementById("seccionCarrito")
let listaProductos = [];

fetch('products.json') //para traer los datos del archivo JSON se usa fetch
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
      seccionProductos.appendChild(productosGeneralesDiv);})
  })
  .catch(() => console.error("La busqueda del JSON de los productos no esta funcionando!")); //si no funciona tira este mensaje

inputBusqueda.addEventListener('change', empezarBusqueda) //si hace click en el boton o enter busca el producto
botonBusqueda.addEventListener('click', empezarBusqueda)

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
    seccionBusqueda.innerHTML= `<h3>Productos encontrados:</h3>`
    productoEncontradoDiv.innerHTML = `
      <img src="${productoX.imgURL}" title="${productoX.nombre}" alt="Imagen de ${productoX.nombre}">
      <h3>$${productoX.precio}</h3>
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
        const Toast = Swal.mixin({ 
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
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
          timer: 1500,
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
    botonAgregarFavoritos.addEventListener('click', function(){
      botonAgregarFavoritos.classList.add("favoritosActivado");
      if(!productoYaEnFavoritos(productoX)) { //funcion para que no se agregue mas de una vez a favoritos el mismo producto
        agregarFavoritos(productoX)
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
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
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        Toast.fire({
          icon: 'warning',
          iconColor:'rgba(255, 98, 0, 0.70)',
          title: 'El producto ya esta en favoritos!'
        })
      }
    });
    resultadoBusqueda.appendChild(productoEncontradoDiv)
    seccionBusqueda.appendChild(resultadoBusqueda)
  });
}


function productoYaEnFavoritos(productoX) { 
  //si no hay ninguna key "favorito" es falsy y asigna [] como valor a fav
  const fav = JSON.parse(localStorage.getItem('favorito')) || []; 
  return fav.some(yaEsta => yaEsta.nombre === productoX.nombre);
  //some (si un producto de la lista coincide con el nombre de yaEsta entonces significa que ya esta en la lista)
}

function productoYaEnCarrito(productoX) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || []; 
  return carrito.some(yaEsta => yaEsta.nombre === productoX.nombre);
}


function agregarFavoritos(productoX) { 
  const fav = JSON.parse(localStorage.getItem('favorito')) || [];
  fav.push(productoX);//agrego el producto seleccionado a fav, osea almaceno el valor en la key 'favorito
  localStorage.setItem('favorito', JSON.stringify(fav)); //Agrega el producto al localStorage
}
//son iguales pero agregan a dos key diferentes (carrito y favoritos)
function agregarCarrito(productoX) { 
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.push(productoX);
  localStorage.setItem('carrito', JSON.stringify(carrito));
}


//cuando cargue la pagina que aparezcan los que esten dentro del localStorage con la key 'favorito'
window.addEventListener('load', function(){
  const fav = JSON.parse(localStorage.getItem('favorito')) || [];
  mostrarFavoritos(fav);
});

window.addEventListener('load', function(){//no funciona si pones las dos en el mismo add event listener(osea fav y carrito) 
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  mostrarCarrito(carrito);
})

function mostrarCarrito(carrito) {
  listaCarrito.innerHTML= "";
  carrito.forEach(productoX => {
    const productoCarrito = document.createElement('div');
    productoCarrito.classList.add("productoEnCarrito");
    productoCarrito.innerHTML = `
    <img src="${productoX.imgURL}" title="${productoX.nombre}" alt="Imagen de ${productoX.nombre}">
    <div>
      <h4>${productoX.nombre}<h4>
      <p>${productoX.descripcion}</p>
    </div>
    <h3>$${productoX.precio}</h3>
    <button><img src="images/trash-can.png" alt=""></button>`;
    const botonEliminarCarrito = productoCarrito.querySelector('button');
    botonEliminarCarrito.addEventListener("click", function() {
      eliminarDeCarrito(productoX);
      const Toast = Swal.mixin({ //alert personalizado de swal
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
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
    listaCarrito.appendChild(productoCarrito);
    seccionCarrito.appendChild(listaCarrito);
  })
  
}

function mostrarFavoritos(fav) { //construye igual que cuando buscas pero ahora en la pagina de favoritos
  seccionFav.innerHTML = `<h3>Tus favoritos:</h3>`;
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
        agregarCarrito(productoX)
        const Toast = Swal.mixin({ //alert personalizado de swal
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
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
          timer: 1500,
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
        timer: 1500,
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

function eliminarDeFavoritos(productoX) { //elimina los favoritos que apretes el boton
  const fav = JSON.parse(localStorage.getItem('favorito')) || [];
  const nuevosFavoritos = fav.filter(seVa => seVa.nombre !== productoX.nombre);
  localStorage.setItem('favorito',JSON.stringify(nuevosFavoritos));
  mostrarFavoritos(nuevosFavoritos);
}

function eliminarDeCarrito(productoX) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const carritoNuevo = carrito.filter(seVa => seVa.nombre !== productoX.nombre);
  localStorage.setItem('carrito',JSON.stringify(carritoNuevo));
  mostrarCarrito(carritoNuevo);
}


//Carrusel de index
const botonIzq = document.getElementById("botonIzq");
const botonDer = document.getElementById("botonDer");
const portada = document.getElementById("portada");
const imagenes = document.querySelectorAll(".carrusel-portada-img");//crea la nodelist "imagenes"

botonIzq.addEventListener("click", x => moverIzquierda());
botonDer.addEventListener("click", x => moverDerecha());

let movimiento = 0;
let widthImg = 100 / imagenes.length; //divide el 100% en la cantidad de imagenes para que tengan el mismo tamaño
let contador = 0;

function moverDerecha() {
  if (contador >= imagenes.length-1) {//como contador empieza en 0 le resto 1 al length de imagenes
    contador= 0;
    movimiento = 0;
    portada.style.transform = `translate(-${movimiento}%)`;
    portada.style.transition = "none";
    return;
  }//asi vuelve a la primer imagen
    contador ++;
    movimiento = movimiento + widthImg;
    portada.style.transform = `translate(-${movimiento}%)`;
    portada.style.transition = "all ease .6s";
}

function moverIzquierda() {
  contador --;
  if(contador < 0) {
    contador = imagenes.length-1;//asigno el ultimo valor de imagenes
    movimiento = widthImg * (imagenes.length-1)
    portada.style.transform = `translate(-${movimiento}%)`;
    portada.style.transition = "none";
    return;
  }
    movimiento = movimiento - widthImg;
    portada.style.transform = `translate(-${movimiento}%)`;
    portada.style.transition = "all ease .6s";
}

setInterval(moverDerecha, 6000)