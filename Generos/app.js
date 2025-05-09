//Importaciones

import { validarFormulario, outFocus, validarLetras } from "../module.js";

// Variables

const formulario = document.querySelector("form");
const nombreGenero = document.querySelector('[name="nombreGenero"]');

// Eventos

formulario.addEventListener("submit", validarFormulario);

nombreGenero.addEventListener("keydown", validarLetras);

nombreGenero.addEventListener("blur", outFocus);