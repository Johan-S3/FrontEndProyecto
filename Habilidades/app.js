//Importaciones

import { validarFormulario, outFocus, validarLetras } from "../module.js";

// Variables

const formulario = document.querySelector("form");
const nombreHabilidad = document.querySelector('[name="nombreHabilidad"]');

// Eventos

formulario.addEventListener("submit", validarFormulario);

nombreHabilidad.addEventListener("keydown", validarLetras);

nombreHabilidad.addEventListener("blur", outFocus);