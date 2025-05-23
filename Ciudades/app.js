// IMPORTACIONES

// Importamos funciones necesarias desde el módulo externo
import { objeto, validarFormulario, outFocus, validarLetras, obtenerDatos, crearDato, editarDato, eliminarDato } from "../module.js";



// VARIABLES

// Seleccionamos elementos del DOM
const formulario = document.querySelector("form");
const nombreCiudad = document.querySelector('[name="nombreCiudad"]');
const tabla = document.querySelector(".cuerpoTabla");

// Variables donde se almacenan los datos registrados y el ID de edición
let ciudades = []; // Aquí se guardan las ciudades obtenidas de la base de datos
let idEditar = null; // Se inicializa como null para indicar que no hay ciudad en edición



// EVENTOS

// Evento que se ejecuta al cargar la página, obteniendo las ciudades registradas
document.addEventListener("DOMContentLoaded", () => {
  cargarCiudades();
});

// Validamos las letras permitidas en el campo de nombre
nombreCiudad.addEventListener("keydown", validarLetras);

// Detectamos cuando el usuario sale del campo de nombre
nombreCiudad.addEventListener("blur", outFocus);

// Evento que maneja el envío del formulario
formulario.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evitamos el comportamiento por defecto del formulario, previniendo el evento.

  // Validamos el formulario antes de continuar
  if (!validarFormulario(e)) return;
  
  // Se obtiene el objeto con los datos del formulario
  const datos = objeto; 
  if (datos) {
    // Se crea un objeto con los datos de la ciudad a registrar
    const objetoCiudad = {
      nombre: datos.nombreCiudad,
    };

    // Si hay un ID de edición, se actualiza la ciudad existente mediante una solicitud al servidor
    if (idEditar) {
      await editarDato("ciudades", idEditar, objetoCiudad); // Enviamos la solicitud para actualizar la ciudad en la base de datos
      idEditar = null; // Se reinicia la variable después de la edición
    } else {
      // Enviamos la solicitud al servidor para crear una nueva ciudad
      const ciudad = await crearDato("ciudades", objetoCiudad);
      const ciudadDato = await ciudad.json(); // Convertimos la respuesta en JSON

      // Si la respuesta tiene errores, los mostramos en alertas
      if (!ciudadDato.success) {
        alert(ciudadDato.erros[0].message); // Mostramos el primer mensaje de error
      }
      formulario.reset(); // Limpiamos el formulario después de enviar
    }

    await cargarCiudades(); // Actualizamos la lista de ciudades después de la solicitud
  }
});

// FUNCIONES

// Función que obtiene y muestra las ciudades en la tabla
async function cargarCiudades() {
  ciudades = await obtenerDatos("ciudades"); // Se obtiene la lista de ciudades desde la base de datos
  renderizarTabla(); // Se llama la función para mostrarlas en la tabla
}

// Función que crea y agrega las filas de la tabla con los datos de las ciudades
function renderizarTabla() {
  tabla.textContent = ""; // Limpiamos la tabla antes de llenarla nuevamente
  console.log(ciudades); // Mostramos los datos en consola para depuración
  
  ciudades.data.forEach((ciudad) => {
    // Creamos la fila
    const fila = document.createElement("tr");

    // Celda con el ID de la ciudad
    const tdId = document.createElement("td");
    tdId.textContent = ciudad.id;

    // Celda con el nombre de la ciudad
    const tdNombre = document.createElement("td");
    tdNombre.textContent = ciudad.nombre;

    // Celda para los botones de acción
    const tdAcciones = document.createElement("td");

    // Botón para editar la ciudad
    const btnEditar = document.createElement("button");
    btnEditar.classList.add("botonAccion", "editar");
    btnEditar.setAttribute("data-id", ciudad.id);
    btnEditar.textContent = "Editar";

    // Botón para eliminar la ciudad
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("botonAccion", "eliminar");
    btnEliminar.setAttribute("data-id", ciudad.id);
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
      
      // Buscamos la ciudad por su ID dentro del array de ciudades
      const ciudad = ciudades.data.find((c) => c.id === id);
      
      // Si la ciudad existe, cargamos sus datos en el formulario para editarla
      if (ciudad) {
        nombreCiudad.value = ciudad.nombre;
        idEditar = ciudad.id; // Se asigna el ID de la ciudad a editar
      }
    })
  );

  // Asignamos eventos a los botones de eliminación
  tabla.querySelectorAll(".eliminar").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = parseInt(e.target.dataset.id);

      // Se muestra una confirmación antes de eliminar la ciudad
      let confirmacion = confirm(`¿Está seguro de eliminar la ciudad?`);
      
      if (confirmacion) {
        // Enviamos la solicitud para eliminar la ciudad en la base de datos
        const respuesta = await eliminarDato("ciudades", id);
        
        // Si la respuesta tiene errores, los mostramos en alertas
        if (!respuesta.success) {
          alert(respuesta.message);
        }

        await cargarCiudades(); // Refrescamos la lista de ciudades después de la eliminación
      }
    })
  );
}
