//Importaciones

import { validarFormulario, outFocus, validarLetras, crearRegistro, editarRegistro, eliminarRegistro } from "../module.js";

// Variables

const formulario = document.querySelector("form");
const nombreCiudad = document.querySelector('[name="nombreCiudad"]');
const tabla = document.querySelector(".cuerpoTablaCiudades");

// Eventos

// formulario.addEventListener("submit", validarFormulario);

nombreCiudad.addEventListener("keydown", validarLetras);

nombreCiudad.addEventListener("blur", outFocus);




// Variables donde se almacenan los datos registrados y donde se almacena el id del elemento que se quiere editar temporalmente.
let ciudades = [];
let idEditar = null;

formulario.addEventListener("submit", (e) => {
  const datos = validarFormulario(e);
  if (datos) {
    if (idEditar) {
      ciudades = editarRegistro(ciudades, idEditar, { nombre: datos.nombreCiudad });
      idEditar = null;
    } else {
      ciudades = crearRegistro(ciudades, { nombre: datos.nombreCiudad });
    }
    renderizarTabla();
    formulario.reset();
  }
});

function renderizarTabla() {
  tabla.innerHTML = "";
  ciudades.forEach((ciudad) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${ciudad.id}</td>
      <td>${ciudad.nombre}</td>
      <td>
        <button class="botonAccion editar" data-id="${ciudad.id}">Editar</button>
        <button class="botonAccion eliminar" data-id="${ciudad.id}">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });

  const botonesEditar = tabla.querySelectorAll(".editar");
  const botonesEliminar = tabla.querySelectorAll(".eliminar");

  botonesEditar.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      const ciudad = ciudades.find((c) => c.id === id);
      if (ciudad) {
        nombreCiudad.value = ciudad.nombre;
        idEditar = ciudad.id;
      }
    });
  });

  botonesEliminar.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      ciudades = eliminarRegistro(ciudades, id);
      renderizarTabla();
    });
  });
}