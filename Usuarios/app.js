//Importaciones

import { validarFormulario, outFocus, limitar, validarLetras, validarNumeros, validarCaracteres , obtenerDatos, crearDato, editarDato, eliminarDato} from "../module.js";



// Variables

const formulario = document.querySelector("form");
const nombre = document.querySelector('[name="nombre"]');
const apellido = document.querySelector('[name="apellido"]');
const telefono = document.querySelector('[name="telefono"]');
const ciudad = document.querySelector('[name="ciudad"]');
const documento = document.querySelector('[name="documento"]');
const usuario = document.querySelector('[name="usuario"]');
const constrasena = document.querySelector('[name="constrasena"]');
const politicas = document.querySelector("#politicas");
const generos = document.querySelectorAll('[name = "genero"]');
const btn = document.querySelector("#btn_validar");


const generosContent = document.querySelector(".radios");
const lenguajesContent = document.querySelector(".form__checks");

//Funciones

const validarCheck = (event) => {
  if (!politicas.checked) btn.setAttribute("disabled", "");
  else btn.removeAttribute("disabled");
}

const validarGenero = (event) => { 
  if (event.target.value) {
    let contenedor = document.querySelector(".radios");
    contenedor.classList.remove("form__radios");
    if (contenedor.nextElementSibling) contenedor.nextElementSibling.remove();
  }
}



// Eventos

addEventListener("DOMContentLoaded", validarCheck);
politicas.addEventListener("change", validarCheck);

nombre.addEventListener("keypress", limitar)

formulario.addEventListener("submit", validarFormulario)

nombre.addEventListener("keydown", validarLetras);
apellido.addEventListener("keydown", validarLetras);
telefono.addEventListener("keydown", validarNumeros);
documento.addEventListener("keydown", validarNumeros);
usuario.addEventListener("keydown", validarCaracteres);
constrasena.addEventListener("keydown", validarCaracteres);

nombre.addEventListener("blur", outFocus);
apellido.addEventListener("blur", outFocus);
telefono.addEventListener("blur", outFocus);
ciudad.addEventListener("blur", outFocus)
documento.addEventListener("blur", outFocus);
usuario.addEventListener("blur", outFocus);
constrasena.addEventListener("blur", outFocus);


addEventListener("DOMContentLoaded", cargarCiudades(), cargarGeneros(), cargarLenguajes())
let ciudadesExist = [];
async function cargarCiudades() {
  ciudadesExist = await obtenerDatos("ciudades");
  llenarCiudades();
}

let generosExist = [];
async function cargarGeneros(){
  generosExist = await obtenerDatos("generos");
  llenarGeneros();
}

let lenguajesExist = [];
async function cargarLenguajes(){
  lenguajesExist = await obtenerDatos("lenguajes");
  llenarLenguajes();
}

function llenarCiudades() {
  // ciudad.textContent = "";

  console.log(ciudadesExist);
  
  ciudadesExist.data.forEach((ciud) => {
    // Creo el option
    const option = document.createElement("option");

    option.setAttribute("value", ciud.id);
    option.textContent = `${ciud.nombre}`

    ciudad.append(option);
  })
}

function llenarGeneros() {
  console.log(generosExist);
  
  generosExist.data.forEach((gender) => {
    // Creo el input type radio y su label
    const input = document.createElement("input");
    const label = document.createElement("label");

    input.classList.add("form__inputs")
    input.setAttribute("type", "radio");
    input.setAttribute("value", gender.id);
    input.setAttribute("name", "genero");
    input.setAttribute("id", gender.nombre);
    input.setAttribute("required", "");

    // Agrego el evento que vefica si el input cambia de estado checked
    input.addEventListener("change", validarGenero);

    label.setAttribute("for", gender.nombre);
    label.textContent = `${gender.nombre}`;

    generosContent.append(input,label);
  })
}

function llenarLenguajes() {
  console.log(lenguajesExist);
  
  lenguajesExist.data.forEach((languaje) => {
     // Creo el input type checkbox y su label
     const input = document.createElement("input");
     const label = document.createElement("label");

     input.classList.add("form__inputs")
     input.setAttribute("type", "checkbox");
     input.setAttribute("value", languaje.value);
     input.setAttribute("name", "habilidades");
     input.setAttribute("id", languaje.nombre);
     input.setAttribute("required", "");
     input.textContent = `${languaje.nombre}`

     label.setAttribute("for", languaje.nombre);
     label.textContent = `${languaje.nombre}`;
 
     lenguajesContent.append(input,label);
  })
}


