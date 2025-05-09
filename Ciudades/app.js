//Importaciones

import { validarFormulario, outFocus, validarLetras } from "../module.js";

// Variables

const formulario = document.querySelector("form");
const nombreCiudad = document.querySelector('[name="nombreCiudad"]');

// Eventos

formulario.addEventListener("submit", validarFormulario);

nombreCiudad.addEventListener("keydown", validarLetras);

nombreCiudad.addEventListener("blur", outFocus);