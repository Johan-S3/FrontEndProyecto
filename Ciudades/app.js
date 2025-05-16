//Importaciones

import { validarFormulario, outFocus, validarLetras, obtenerDatos, crearDato, editarDato, eliminarDato } from "../module.js";

// Variables

const formulario = document.querySelector("form");
const nombreCiudad = document.querySelector('[name="nombreCiudad"]');
const tabla = document.querySelector(".cuerpoTabla");

// Eventos
document.addEventListener("DOMContentLoaded", () => {
  cargarCiudades();
});

nombreCiudad.addEventListener("keydown", validarLetras);

nombreCiudad.addEventListener("blur", outFocus);

formulario.addEventListener("submit", async (e) => {
  const datos = validarFormulario(e);
  if (datos) {
    const objetoCiudad = {
      nombre: datos.nombreCiudad,
    };

    if (idEditar) {
      await editarDato("ciudades", idEditar, objetoCiudad);
      idEditar = null;
    } else {
      await crearDato("ciudades", objetoCiudad);
    }

    formulario.reset();
    await cargarCiudades();
  }
});

// Variables donde se almacenan los datos registrados y donde se almacena el id del elemento que se quiere editar temporalmente.
let ciudades = [];
let idEditar = null;

async function cargarCiudades() {
  ciudades = await obtenerDatos("ciudades");
  renderizarTabla();
}

function renderizarTabla() {
  tabla.textContent = "";
  console.log(ciudades);
  
  ciudades.data.forEach((ciudad) => {
    // Creo la fila
    const fila = document.createElement("tr");

    // Celda del ID de la ciudad
    const tdId = document.createElement("td");
    tdId.textContent = ciudad.id;

    // Celda del Nombre de la ciudad
    const tdnombre = document.createElement("td");
    tdnombre.textContent = ciudad.nombre;

    // Celda de los botondes de acción
    const tdAcciones = document.createElement("td");

    // Creo el selector botón con accion de editar
    const btnEditar = document.createElement("button");
    btnEditar.classList.add("botonAccion", "editar")
    btnEditar.setAttribute("data-id", ciudad.id);
    btnEditar.textContent = "Editar";

    // Creo el selector botón con accion de eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("botonAccion", "eliminar")
    btnEliminar.setAttribute("data-id", ciudad.id);
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
      const ciudad = ciudades.data.find((c) => c.id === id);
      if (ciudad) {
        nombreCiudad.value = ciudad.nombre;
        idEditar = ciudad.id;
      }
    })
  );

  tabla.querySelectorAll(".eliminar").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = parseInt(e.target.dataset.id);
      let confirmacion = confirm(`¿Esta seguro de eliminar la ciudad?`);
      if (confirmacion) {
        await eliminarDato("ciudades", id);
        await cargarCiudades();
      }
    })
  );
}