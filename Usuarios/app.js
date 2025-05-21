//Importaciones

import { validarFormulario, outFocus, limitar, validarLetras, validarNumeros, validarCaracteres , obtenerDatos, crearDato, editarDato, eliminarDato} from "../module.js";



// Variables

const formulario = document.querySelector("form");
const nombre = document.querySelector('[name="nombre"]');
const apellido = document.querySelector('[name="apellido"]');
const telefono = document.querySelector('[name="telefono"]');
const ciudad = document.querySelector('[name="id_ciudad"]');
const documento = document.querySelector('[name="documento"]');
const usuario = document.querySelector('[name="usuario"]');
const contrasena = document.querySelector('[name="contrasena"]');
const politicas = document.querySelector("#politicas");
const btn = document.querySelector("#btn_validar");

const tabla = document.querySelector(".cuerpoTabla")

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
    input.setAttribute("name", "id_genero");
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
     input.setAttribute("value", languaje.id);
     input.setAttribute("name", "habilidades");
     input.setAttribute("id", languaje.nombre);
     input.setAttribute("required", "");
     input.textContent = `${languaje.nombre}`

     label.setAttribute("for", languaje.nombre);
     label.textContent = `${languaje.nombre}`;
 
     lenguajesContent.append(input,label);
  })
}


let usuarios = [];
let idEditar = null;

async function cargarUsuarios() {
  usuarios = await obtenerDatos("usuarios");
  renderizarTabla();
}

function renderizarTabla() {
  tabla.textContent = "";
  console.log(usuarios);
  
  usuarios.data.forEach((usuario) => {
    // Creo la fila
    const fila = document.createElement("tr");

    // Celda del ID del usuario
    const tdId = document.createElement("td");
    tdId.textContent = usuario.id;

    // Celda del Nombre del usuario
    const tdnombre = document.createElement("td");
    tdnombre.textContent = usuario.nombre;

    // Celda del apellido del usuario
    const tdApellido = document.createElement("td");
    tdApellido.textContent = usuario.apellido;
    
    // Celda del telefono del usuario
    const tdTelefono = document.createElement("td");
    tdTelefono.textContent = usuario.telefono;

    // Celda de la ciudad del usuario
    const tdCiudad = document.createElement("td");
    tdCiudad.textContent = usuario.id_ciudad;

    // Celda del documento del usuario
    const tdDocumento = document.createElement("td");
    tdDocumento.textContent = usuario.documento;

    // Celda del nombre de usuario del usuario
    const tdUsuario = document.createElement("td");
    tdUsuario.textContent = usuario.usuario;

    // Celda de la contraseña del usuario
    const tdContrasena = document.createElement("td");
    tdContrasena.textContent = usuario.contrasena;

    // Celda del genero del usuario
    const tdGenero = document.createElement("td");
    tdGenero.textContent = usuario.id_genero;

    // Celda del genero del usuario
    const tdLenguajes = document.createElement("td");
    // ......Falta

    // Celda de los botondes de acción
    const tdAcciones = document.createElement("td");

    // Creo el selector botón con accion de editar
    const btnEditar = document.createElement("button");
    btnEditar.classList.add("botonAccion", "editar")
    btnEditar.setAttribute("data-id", usuario.id);
    btnEditar.textContent = "Editar";

    // Creo el selector botón con accion de eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("botonAccion", "eliminar")
    btnEliminar.setAttribute("data-id", usuario.id);
    btnEliminar.textContent = "Eliminar";
    
    // Agrego botones a la celda de acciones
    tdAcciones.append(btnEditar, btnEliminar);
    // Agrego celdas a la fila
    fila.append(tdId, tdnombre, tdApellido, tdTelefono, tdCiudad, tdDocumento, tdUsuario, tdContrasena, tdGenero, tdLenguajes, tdAcciones);
    // Agrego a la tabla la fila
    tabla.append(fila);
  });

  // Eventos después de renderizar
  tabla.querySelectorAll(".editar").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      const user = usuarios.data.find((c) => c.id === id);
      if (user) {
        nombre.value = user.nombre;
        apellido.value = user.apellido;
        telefono.value = user.telefono;
        ciudad.value = user.id_ciudad
        documento.value = user.documento;
        usuario.value = user.usuario;
        contrasena.value = user.contrasena;
        document.querySelector(`input[type="radio"][value="${user.id_genero}"]`).checked = true;
        idEditar = user.id;
      }
    })
  );

  tabla.querySelectorAll(".eliminar").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = parseInt(e.target.dataset.id);
      let confirmacion = confirm(`¿Esta seguro de eliminar el usuario?`);
      if (confirmacion) {
        await eliminarDato("usuarios", id);
        await cargarUsuarios();
      }
    })
  );
}


// Eventos

addEventListener("DOMContentLoaded", validarCheck);
addEventListener("DOMContentLoaded", cargarUsuarios);
politicas.addEventListener("change", validarCheck);

nombre.addEventListener("keypress", limitar)

formulario.addEventListener("submit", async (e) => {
  const datos = validarFormulario(e);

  if (datos) {
    const objetoUsuario = {
      nombre: datos.nombre,
      apellido: datos.apellido,
      telefono: datos.telefono,
      documento: datos.documento,
      usuario: datos.usuario,
      contrasena: datos.contrasena,
      id_genero: datos.id_genero,
      id_ciudad: datos.id_ciudad
    };

    if (idEditar) {
      await editarDato("usuarios", idEditar, objetoUsuario);
      idEditar = null;
    } else {
      await crearDato("usuarios", objetoUsuario);
    }

    formulario.reset();
    await cargarUsuarios();
  }
})

nombre.addEventListener("keydown", validarLetras);
apellido.addEventListener("keydown", validarLetras);
telefono.addEventListener("keydown", validarNumeros);
documento.addEventListener("keydown", validarNumeros);
usuario.addEventListener("keydown", validarCaracteres);
contrasena.addEventListener("keydown", validarCaracteres);

nombre.addEventListener("blur", outFocus);
apellido.addEventListener("blur", outFocus);
telefono.addEventListener("blur", outFocus);
ciudad.addEventListener("blur", outFocus)
documento.addEventListener("blur", outFocus);
usuario.addEventListener("blur", outFocus);
contrasena.addEventListener("blur", outFocus);


addEventListener("DOMContentLoaded", cargarCiudades(), cargarGeneros(), cargarLenguajes())


