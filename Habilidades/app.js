// IMPORTACIONES

// Importamos funciones necesarias desde el módulo externo
import { objeto, validarFormulario, outFocus, validarLetras , obtenerDatos, crearDato, editarDato, eliminarDato} from "../module.js";



// VARIABLES

// Seleccionamos elementos del DOM
const formulario = document.querySelector("form");
const nombreHabilidad = document.querySelector('[name="nombreHabilidad"]');
const tabla = document.querySelector(".cuerpoTabla");

// Variables donde se almacenan los datos registrados y el ID de edición
let lenguajes = []; // Aquí se guardan los lenguajes obtenidos de la base de datos
let idEditar = null; // Se inicializa como null para indicar que no hay lenguaje en edición



// EVENTOS

// Evento que se ejecuta al cargar la página, obteniendo los lenguajes registrados
document.addEventListener("DOMContentLoaded", () => {
  cargarHabilidades();
});

// Detectamos cuando el usuario sale del campo de nombre
nombreHabilidad.addEventListener("blur", outFocus);

// Evento que maneja el envío del formulario
formulario.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evitamos el comportamiento por defecto del formulario, previniendo el evento.

  // Validamos el formulario antes de continuar
  if (!validarFormulario(e)) return;
  
  // Se obtiene el objeto con los datos del formulario
  const datos = objeto; 
  if (datos) {
    // Se crea un objeto con los datos del lenguaje a registrar
    const objetoHabilidad = {
      nombre: datos.nombreHabilidad,
    };

    // Si hay un ID de edición, se actualiza el lenguaje existente mediante una solicitud al servidor
    if (idEditar) {
      await editarDato("lenguajes", idEditar, objetoHabilidad); // Enviamos la solicitud para actualizar el lenguaje en la base de datos
      idEditar = null; // Se reinicia la variable después de la edición
    } else {
      // Enviamos la solicitud al servidor para crear un nuevo lenguaje
      const habilidad = await crearDato("lenguajes", objetoHabilidad);
      const habilidadDato = await habilidad.json(); // Convertimos la respuesta en JSON

      // Si la respuesta tiene errores, los mostramos en alertas
      if (!habilidadDato.success) {
        alert(habilidadDato.erros[0].message); // Mostramos el primer mensaje de error
      }

      formulario.reset(); // Limpiamos el formulario después de enviar
    }

    await cargarHabilidades(); // Actualizamos la lista de lenguajes después de la solicitud
  }
});

// FUNCIONES

// Función que obtiene y muestra los lenguajes en la tabla
async function cargarHabilidades() {
  lenguajes = await obtenerDatos("lenguajes"); // Se obtiene la lista de lenguajes desde la base de datos
  renderizarTabla(); // Se llama la función para mostrarlos en la tabla
}

// Función que crea y agrega las filas de la tabla con los datos de los lenguajes
function renderizarTabla() {
  tabla.textContent = ""; // Limpiamos la tabla antes de llenarla nuevamente
  console.log(lenguajes); // Mostramos los datos en consola para depuración
  
  lenguajes.data.forEach((lenguaje) => {
    // Creamos la fila
    const fila = document.createElement("tr");

    // Celda con el ID del lenguaje
    const tdId = document.createElement("td");
    tdId.textContent = lenguaje.id;

    // Celda con el nombre del lenguaje
    const tdNombre = document.createElement("td");
    tdNombre.textContent = lenguaje.nombre;

    // Celda para los botones de acción
    const tdAcciones = document.createElement("td");

    // Botón para editar el lenguaje
    const btnEditar = document.createElement("button");
    btnEditar.classList.add("botonAccion", "editar");
    btnEditar.setAttribute("data-id", lenguaje.id);
    btnEditar.textContent = "Editar";

    // Botón para eliminar el lenguaje
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("botonAccion", "eliminar");
    btnEliminar.setAttribute("data-id", lenguaje.id);
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
      
      // Buscamos el lenguaje por su ID dentro del array de lenguajes
      const lenguaje = lenguajes.data.find((c) => c.id === id);
      
      // Si el lenguaje existe, cargamos sus datos en el formulario para editarlo
      if (lenguaje) {
        nombreHabilidad.value = lenguaje.nombre;
        idEditar = lenguaje.id; // Se asigna el ID del lenguaje a editar
      }
    })
  );

  // Asignamos eventos a los botones de eliminación
  tabla.querySelectorAll(".eliminar").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = parseInt(e.target.dataset.id);

      // Se muestra una confirmación antes de eliminar el lenguaje
      let confirmacion = confirm(`¿Está seguro de eliminar el lenguaje?`);
      
      if (confirmacion) {
        // Enviamos la solicitud para eliminar el lenguaje en la base de datos
        const respuesta = await eliminarDato("lenguajes", id);
        
        // Si la respuesta tiene errores, los mostramos en alertas
        if (!respuesta.success) {
          alert(respuesta.message);
        }

        await cargarHabilidades(); // Refrescamos la lista de lenguajes después de la eliminación
      }
    })
  );
}
