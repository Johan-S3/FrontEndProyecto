//Importaciones

import { validarFormulario, outFocus, validarLetras } from "../module.js";

// Variables

const formulario = document.querySelector("form");
const nombreCiudad = document.querySelector('[name="nombreCiudad"]');
const tabla = document.querySelector(".cuerpoTablaCiudades");

// Eventos

// formulario.addEventListener("submit", validarFormulario);

nombreCiudad.addEventListener("keydown", validarLetras);

nombreCiudad.addEventListener("blur", outFocus);


let ciudades = [];
let idEditar = null;

formulario.addEventListener("submit", (e) => {
  const datos = validarFormulario(e);
  if (datos) {
    if (idEditar) {
      // editar ciudad
      ciudades = ciudades.map((c) =>
        c.id === idEditar ? { id: c.id, nombre: datos.nombreCiudad } : c
      );
      idEditar = null;
    } else {
      // agregar ciudad
      const nuevoId = ciudades.length > 0 ? ciudades[ciudades.length - 1].id + 1 : 1;
      ciudades.push({ id: nuevoId, nombre: datos.nombreCiudad });
    }
    renderizarTabla();
    formulario.reset();
  } else {
    console.log("Error: formulario no válido");
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

  // Eventos de Editar y Eliminar se agregan después de renderizar
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
      const index = ciudades.findIndex((c) => c.id === id);
      if (index !== -1) {
        ciudades.splice(index, 1);
        renderizarTabla(); // Vuelve a dibujar la tabla
      }
    });
  });
}