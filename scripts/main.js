const inputBusqueda = document.getElementById("inputBusqueda");
const botonBusqueda = document.getElementById("botonBusqueda");
const seccionBusqueda = document.getElementById("sectionBusqueda");
const seccionFav = document.getElementById("seccionFav")
const resultadoBusqueda = document.getElementById("resultadoBusqueda");
const listaFavoritos = document.getElementById("listaDeFavoritos");
const seccionProductos = document.getElementById("productos")

let listaProductos = [];

fetch('products.json') //para traer los datos del archivo JSON se usa fetch
  .then(response => response.json())
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
  .catch(error => console.error('La busqueda del JSON no esta funcionando!', error)); //si no funciona tira este mensaje

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
    Swal.fire({
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
  return productosFiltrados;
}

function mostrarResultados(listaProductos) {
  seccionBusqueda.innerHTML = `<h3>Productos encontrados:</h3>`;
  resultadoBusqueda.innerHTML = "";
  listaProductos.forEach(productoX => {
    const productoEncontradoDiv = document.createElement('div');
    productoEncontradoDiv.classList.add('productoEncontrado');
    
    productoEncontradoDiv.innerHTML = `
      <img src="${productoX.imgURL}" title="${productoX.nombre}" alt="Imagen de ${productoX.nombre}">
      <h3>$${productoX.precio}</h3>
      <p>${productoX.nombre} | ${productoX.stock} unid.</p>
      <p>${productoX.descripcion}</p>
      <button>Agregar a Favoritos</button>`;
    
    resultadoBusqueda.appendChild(productoEncontradoDiv);
    
    const botonAgregarFavoritos = productoEncontradoDiv.querySelector('button');
    botonAgregarFavoritos.addEventListener('click', function(){
      if(!productoYaEnFavoritos(productoX)) { //funcion para que no se agregue mas de una vez a favoritos el mismo producto
        agregarFavoritos(productoX)
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
          title: 'Agregado a Favoritos!'
        })
      }
    });
    resultadoBusqueda.appendChild(productoEncontradoDiv)
    seccionBusqueda.appendChild(resultadoBusqueda)
  });
}

function productoYaEnFavoritos(productoX) { 
  //si no hay ninguna key "favorito" es falsy y asigna []como valor a fav
  const fav = JSON.parse(localStorage.getItem('favorito')) || []; 
  return fav.some(yaEsta => yaEsta.nombre === productoX.nombre)
  //some (si un producto de la lista coincide con el nombre de yaEsta entonces significa que ya esta en la lista)
}

function agregarFavoritos(productoX) { 
  const fav = JSON.parse(localStorage.getItem('favorito')) || [];
  fav.push(productoX);//agrego el producto seleccionado a fav, osea almaceno el valor en la key 'favorito
  localStorage.setItem('favorito', JSON.stringify(fav)); //Agrega el producto al localStorage
}

//cuando cargue la pagina que aparezcan los que esten dentro del localStorage con la key 'favorito'
window.addEventListener('load', function(){ 
  const fav = JSON.parse(localStorage.getItem('favorito')) || []; 
  mostrarFavoritos(fav); 
});

function mostrarFavoritos(fav) { //construye igual que cuando buscas pero ahora en la pagina de favoritos
  seccionFav.innerHTML = `<h3>Tus favoritos:</h3>`;
  listaFavoritos.innerHTML = ""; //esto tira un error cuando volves a index!!!!(ARREGLAR)
  fav.forEach(productoX => {
    const productoFavorito = document.createElement('div');
    productoFavorito.classList.add("productoEncontrado");

    productoFavorito.innerHTML = `
    <img src="${productoX.imgURL}" title="${productoX.nombre}" alt="Imagen de ${productoX.nombre}">
    <h3>$${productoX.precio}</h3>
    <p>${productoX.nombre} | ${productoX.stock} unid.</p>
    <p>${productoX.descripcion}</p>
    <button>Eliminar de Favoritos</button>`;

    const botonEliminarFavoritos = productoFavorito.querySelector('button'); //funcionalidad del boton eliminar
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

