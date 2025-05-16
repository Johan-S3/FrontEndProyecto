//Importaciones

import { validarFormulario, outFocus, validarLetras, obtenerDatos, crearDato, editarDato, eliminarDato } from "../module.js";

// Variables

const formulario = document.querySelector("form");
const nombreGenero = document.querySelector('[name="nombreGenero"]');
const tabla = document.querySelector(".cuerpoTabla");


// Eventos

// formulario.addEventListener("submit", validarFormulario);

document.addEventListener("DOMContentLoaded", () => {
  cargarGeneros();
});

nombreGenero.addEventListener("keydown", validarLetras);

nombreGenero.addEventListener("blur", outFocus);

formulario.addEventListener("submit", async (e) => {
  const datos = validarFormulario(e);
  if (datos) {
    const objetoGenero = {
      nombre: datos.nombreGenero,
    };

    if (idEditar) {
      await editarDato("genero", idEditar, objetoGenero);
      idEditar = null;
    } else {
      await crearDato("genero", objetoGenero);
    }

    formulario.reset();
    await cargarGeneros();
  }
});

let generos = [];
let idEditar = null;

async function cargarGeneros() {
  generos = await obtenerDatos("genero");
  renderizarTabla();
}

function renderizarTabla() {
  tabla.innerHTML = "";
  console.log(generos);
  
  generos.data.forEach((genero) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${genero.id}</td>
      <td>${genero.nombre}</td>
      <td>
        <button class="botonAccion editar" data-id="${genero.id}">Editar</button>
        <button class="botonAccion eliminar" data-id="${genero.id}">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
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
      await eliminarDato("genero", id);
      await cargarGeneros();
    })
  );
}