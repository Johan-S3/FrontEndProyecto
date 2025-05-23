// IMPORTACIONES

// Importamos funciones necesarias desde el módulo externo
import { objeto, validarFormulario, outFocus, validarLetras, obtenerDatos, crearDato, editarDato, eliminarDato } from "../module.js";



// VARIABLES

// Seleccionamos elementos del DOM
const formulario = document.querySelector("form");
const nombreGenero = document.querySelector('[name="nombreGenero"]');
const tabla = document.querySelector(".cuerpoTabla");

// Variables donde se almacenan los datos registrados y el ID de edición
let generos = []; // Aquí se guardan los géneros obtenidos de la base de datos
let idEditar = null; // Se inicializa como null para indicar que no hay género en edición



// EVENTOS

// Validamos las letras permitidas en el campo de nombre
nombreGenero.addEventListener("keydown", validarLetras);

// Detectamos cuando el usuario sale del campo de nombre
nombreGenero.addEventListener("blur", outFocus);

// Evento que se ejecuta al cargar la página, obteniendo los géneros registrados
document.addEventListener("DOMContentLoaded", () => {
  cargarGeneros();
});

// Evento que maneja el envío del formulario
formulario.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evitamos el comportamiento por defecto del formulario, previniendo el evento.

  // Validamos el formulario antes de continuar
  if (!validarFormulario(e)) return;
  
  // Se obtiene el objeto con los datos del formulario
  const datos = objeto; 
  if (datos) {
    // Se crea un objeto con los datos del género a registrar
    const objetoGenero = {
      nombre: datos.nombreGenero,
    };

    // Si hay un ID de edición, se actualiza el género existente mediante una solicitud al servidor
    if (idEditar) {
      await editarDato("generos", idEditar, objetoGenero); // Enviamos la solicitud para actualizar el género en la base de datos
      idEditar = null; // Se reinicia la variable después de la edición
    } else {
      // Enviamos la solicitud al servidor para crear un nuevo género
      const genero = await crearDato("generos", objetoGenero);
      const generoDato = await genero.json(); // Convertimos la respuesta en JSON

      // Si la respuesta tiene errores, los mostramos en alertas
      if (!generoDato.success) {
        alert(generoDato.erros[0].message); // Mostramos el primer mensaje de error
      }

      formulario.reset(); // Limpiamos el formulario después de enviar
    }

    await cargarGeneros(); // Actualizamos la lista de géneros después de la solicitud
  }
});

// FUNCIONES

// Función que obtiene y muestra los géneros en la tabla
async function cargarGeneros() {
  generos = await obtenerDatos("generos"); // Se obtiene la lista de géneros desde la base de datos
  renderizarTabla(); // Se llama la función para mostrarlos en la tabla
}

// Función que crea y agrega las filas de la tabla con los datos de los géneros
function renderizarTabla() {
  tabla.textContent = ""; // Limpiamos la tabla antes de llenarla nuevamente
  console.log(generos); // Mostramos los datos en consola para depuración
  
  generos.data.forEach((genero) => {
    // Creamos la fila
    const fila = document.createElement("tr");

    // Celda con el ID del género
    const tdId = document.createElement("td");
    tdId.textContent = genero.id;

    // Celda con el nombre del género
    const tdNombre = document.createElement("td");
    tdNombre.textContent = genero.nombre;

    // Celda para los botones de acción
    const tdAcciones = document.createElement("td");

    // Botón para editar el género
    const btnEditar = document.createElement("button");
    btnEditar.classList.add("botonAccion", "editar");
    btnEditar.setAttribute("data-id", genero.id);
    btnEditar.textContent = "Editar";

    // Botón para eliminar el género
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("botonAccion", "eliminar");
    btnEliminar.setAttribute("data-id", genero.id);
    btnEliminar.textContent = "Eliminar";

    // Agregamos los botones a la celda de acciones
    tdAcciones.append(btnEditar, btnEliminar);
    
    // Agregamos las celdas a la fila
    fila.append(tdId, tdNombre, tdAcciones);

    // Agregamos la fila a la tabla
    tabla.append(fila);
  });

  // Asignamos eventos a los botones de edición
  tabla.querySelectorAll(".editar").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      
      // Buscamos el género por su ID dentro del array de géneros
      const genero = generos.data.find((c) => c.id === id);
      
      // Si el género existe, cargamos sus datos en el formulario para editarlo
      if (genero) {
        nombreGenero.value = genero.nombre;
        idEditar = genero.id; // Se asigna el ID del género a editar
      }
    })
  );

  // Asignamos eventos a los botones de eliminación
  tabla.querySelectorAll(".eliminar").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = parseInt(e.target.dataset.id);

      // Se muestra una confirmación antes de eliminar el género
      let confirmacion = confirm(`¿Está seguro de eliminar el género?`);
      
      if (confirmacion) {
        // Enviamos la solicitud para eliminar el género en la base de datos
        const respuesta = await eliminarDato("generos", id);
        
        // Si la respuesta tiene errores, los mostramos en alertas
        if (!respuesta.success) {
          alert(respuesta.message);
        }

        await cargarGeneros(); // Refrescamos la lista de géneros después de la eliminación
      }
    })
  );
}
