const inputBusqueda = document.getElementById("inputBusqueda");
const botonBusqueda = document.getElementById("botonBusqueda");
const resultadoBusqueda = document.getElementById("resultadoBusqueda");
const listaFavoritos = document.getElementById("listaDeFavoritos");

let listaProductos = [];

fetch('products.json')
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
      <img src= "${productoX.imgURL}" title= "${productoX.nombre}">
      <h3>$${productoX.precio}</h3>
      <p>${productoX.nombre} | ${productoX.stock} unid.</p>
      <p>${productoX.descripcion}</p>
      <button>Agregar a Favoritos</button>`;
    
    resultadoBusqueda.appendChild(productoEncontradoDiv);
    
    const botonAgregarFavoritos = productoEncontradoDiv.querySelector('button');
    botonAgregarFavoritos.addEventListener('click', function(){
      if(!productoYaEnFavoritos(productoX)) {
        agregarFavoritos(productoX)
      }
    });
    resultadoBusqueda.appendChild(productoEncontradoDiv)
  });
}

function productoYaEnFavoritos (productoX) { //verifica si esta en favoritos ya, si esta no lo agrega de nuevo
  const favoritxs = JSON.parse(localStorage.getItem('favorito')) || [];
  return favoritxs.some(yaEsta => yaEsta.nombre === productoX.nombre)
}

function agregarFavoritos(productoX) { //Agrega el producto al localStorage
  const fav = JSON.parse(localStorage.getItem('favorito')) || [];
  fav.push(productoX);
  localStorage.setItem('favorito', JSON.stringify(fav));
}

//cuando cargue la pagina que aparezcan los que esten dentro del localStorage con la key 'favorito'
window.addEventListener('load', function(){ 
  const fav = JSON.parse(localStorage.getItem('favorito')) || [];
  mostrarFavoritos(fav); 
});

function mostrarFavoritos(fav) { //construye igual que cuando buscas pero ahora en la pagina de favoritos
  listaFavoritos.innerHTML = ""; //tira un error pero el programa funciona, buscar la manera de arreglarlo
  fav.forEach(productoX => {
    const productoFavorito = document.createElement('div');
    productoFavorito.classList.add("productoEncontrado");

    productoFavorito.innerHTML = `
    <img src= "${productoX.imgURL}" title= "${productoX.nombre}">
    <h3>$${productoX.precio}</h3>
    <p>${productoX.nombre} | ${productoX.stock} unid.</p>
    <p>${productoX.descripcion}</p>
    <button>Eliminar de Favoritos</button>`;

    const botonEliminarFavoritos = productoFavorito.querySelector('button'); //le da funcionalidad al boton de eliminar
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