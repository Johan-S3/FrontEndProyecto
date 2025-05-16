//Importaciones

import { validarFormulario, outFocus, validarLetras, obtenerDatos, crearDato, editarDato, eliminarDato } from "../module.js";

// Variables

const formulario = document.querySelector("form");
const nombreGenero = document.querySelector('[name="nombreGenero"]');
const tabla = document.querySelector(".cuerpoTabla");


// Eventos

nombreGenero.addEventListener("keydown", validarLetras);

nombreGenero.addEventListener("blur", outFocus);

document.addEventListener("DOMContentLoaded", () => {
  cargarGeneros();
});

formulario.addEventListener("submit", async (e) => {
  const datos = validarFormulario(e);
  if (datos) {
    const objetoGenero = {
      nombre: datos.nombreGenero,
    };

    if (idEditar) {
      await editarDato("generos", idEditar, objetoGenero);
      idEditar = null;
    } else {
      await crearDato("generos", objetoGenero);
    }

    formulario.reset();
    await cargarGeneros();
  }
});



// Funciones

let generos = [];
let idEditar = null;

async function cargarGeneros() {
  generos = await obtenerDatos("generos");
  renderizarTabla();
}

function renderizarTabla() {
  tabla.textContent = "";
  console.log(generos);
  
  generos.data.forEach((genero) => {
    // Creo la fila
    const fila = document.createElement("tr");

    // Celda del ID del genero
    const tdId = document.createElement("td");
    tdId.textContent = genero.id;

    // Celda del Nombre del genero
    const tdnombre = document.createElement("td");
    tdnombre.textContent = genero.nombre;

    // Celda de los botondes de acción
    const tdAcciones = document.createElement("td");

    // Creo el selector botón con accion de editar
    const btnEditar = document.createElement("button");
    btnEditar.classList.add("botonAccion", "editar")
    btnEditar.setAttribute("data-id", genero.id);
    btnEditar.textContent = "Editar";

    // Creo el selector botón con accion de eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("botonAccion", "eliminar")
    btnEliminar.setAttribute("data-id", genero.id);
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
      const genero = generos.data.find((c) => c.id === id);
      if (genero) {
        nombreGenero.value = genero.nombre;
        idEditar = genero.id;
      }
    })
  );

  tabla.querySelectorAll(".eliminar").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = parseInt(e.target.dataset.id);
      let confirmacion = confirm(`¿Esta seguro de eliminar el genero?`);
      if (confirmacion) {
        await eliminarDato("generos", id);
        await cargarGeneros();
      }      
    })
  );
}