const inputBusqueda = document.getElementById("inputBusqueda");
const botonBusqueda = document.getElementById("botonBusqueda");
const resultadoBusqueda = document.getElementById("resultadoBusqueda");
const listaFavoritos = document.getElementById("listaDeFavoritos");

let listaProductos = [];

fetch('products.json') //para traer los datos del archivo JSON se usa fetch
  .then(response => response.json())
  .then(resultado => {
    listaProductos = resultado; //si funciona bien trae el archivo JSON
  })
  .catch(error => console.error('La busqueda del JSON no esta funcionando!', error)); //si no funciona tira este mensaje

inputBusqueda.addEventListener('change', empezarBusqueda)
botonBusqueda.addEventListener('click', empezarBusqueda)

function empezarBusqueda() {
  const ingresoInput = inputBusqueda.value.trim();
  const productosEncontrados = filtrarProductos(ingresoInput);
  mostrarResultados(productosEncontrados);
}

function filtrarProductos(ingresoInput) {
  if (ingresoInput === "") { //para que no muestre todos los resultados sin sentido
    return [];
  }
  return listaProductos.filter(productoX => productoX.nombre.toUpperCase().includes(ingresoInput.toUpperCase()));
}

function mostrarResultados(listaProductos) { //muestra los productos encontrados
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
      }
    });
    resultadoBusqueda.appendChild(productoEncontradoDiv)
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
    });

    listaFavoritos.appendChild(productoFavorito);
  })
}

function eliminarDeFavoritos(productoX) { //elimina los favoritos que apretes el boton
  const fav = JSON.parse(localStorage.getItem('favorito')) || [];
  const nuevosFavoritos = fav.filter(seVa => seVa.nombre !== productoX.nombre);
  localStorage.setItem('favorito',JSON.stringify(nuevosFavoritos));
  mostrarFavoritos(nuevosFavoritos);
}