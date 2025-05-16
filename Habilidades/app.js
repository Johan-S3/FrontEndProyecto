//Importaciones

import { validarFormulario, outFocus, validarLetras , obtenerDatos, crearDato, editarDato, eliminarDato} from "../module.js";

// Variables

const formulario = document.querySelector("form");
const nombreHabilidad = document.querySelector('[name="nombreHabilidad"]');
const tabla = document.querySelector(".cuerpoTabla")

// Eventos

// nombreHabilidad.addEventListener("keydown", validarLetras);

nombreHabilidad.addEventListener("blur", outFocus);

document.addEventListener("DOMContentLoaded", () => {
  cargarHabilidades();
});

formulario.addEventListener("submit", async (e) => {
  const datos = validarFormulario(e);
  if (datos) {
    const objetoHabilidad = {
      nombre: datos.nombreHabilidad,
    };

    if (idEditar) {
      await editarDato("lenguajes", idEditar, objetoHabilidad);
      idEditar = null;
    } else {
      await crearDato("lenguajes", objetoHabilidad);
    }

    formulario.reset();
    await cargarHabilidades();
  }
});



// Funciones

let lenguajes = [];
let idEditar = null;

async function cargarHabilidades() {
  lenguajes = await obtenerDatos("lenguajes");
  renderizarTabla();
}

function renderizarTabla() {
  tabla.textContent = "";
  console.log(lenguajes);
  
  lenguajes.data.forEach((lenguaje) => {
    // Creo la fila
    const fila = document.createElement("tr");

    // Celda del ID del lenguaje
    const tdId = document.createElement("td");
    tdId.textContent = lenguaje.id;

    // Celda del Nombre del lenguaje
    const tdnombre = document.createElement("td");
    tdnombre.textContent = lenguaje.nombre;

    // Celda de los botondes de acción
    const tdAcciones = document.createElement("td");

    // Creo el selector botón con accion de editar
    const btnEditar = document.createElement("button");
    btnEditar.classList.add("botonAccion", "editar")
    btnEditar.setAttribute("data-id", lenguaje.id);
    btnEditar.textContent = "Editar";

    // Creo el selector botón con accion de eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("botonAccion", "eliminar")
    btnEliminar.setAttribute("data-id", lenguaje.id);
    btnEliminar.textContent = "Eliminar";
    
    // Agrego botones a la celda de acciones
    tdAcciones.append(btnEditar, btnEliminar);
    // Agrego celdas a la fila
    fila.append(tdId, tdnombre, tdAcciones);
    // Agrego a la tabla la fila
    tabla.append(fila);
  });

  // Eventos después de renderizar
  tabla.querySelectorAll(".editar").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      const lenguaje = lenguajes.data.find((c) => c.id === id);
      if (lenguaje) {
        nombreHabilidad.value = lenguaje.nombre;
        idEditar = lenguaje.id;
      }
    })
  );

  tabla.querySelectorAll(".eliminar").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = parseInt(e.target.dataset.id);
      let confirmacion = confirm(`¿Esta seguro de eliminar el lenguaje?`);
      if (confirmacion) {
        await eliminarDato("lenguajes", id);
        await cargarHabilidades();
      }
    })
  );
}