// IMPORTACIONES

// Importamos funciones necesarias desde el módulo externo
import { objeto, validarFormulario, outFocus, limitar, validarLetras, validarNumeros, validarCaracteres, obtenerDatos, crearDato, editarDato, eliminarDato } from "../module.js";



// VARIABLES

// Seleccionamos elementos del DOM
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

const tabla = document.querySelector(".cuerpoTabla");

const generosContent = document.querySelector(".radios");
const lenguajesContent = document.querySelector(".form__checks");



// FUNCIONES

// Función para validar si el checkbox de políticas está seleccionado
const validarCheck = (event) => {
  if (!politicas.checked) btn.setAttribute("disabled", "");
  else btn.removeAttribute("disabled");
}

// Función que elimina la clase de validación cuando un género es seleccionado
const validarGenero = (event) => { 
  if (event.target.value) {
    let contenedor = document.querySelector(".radios");
    contenedor.classList.remove("form__radios");
    if (contenedor.nextElementSibling) contenedor.nextElementSibling.remove();
  }
}

// Variables donde se almacenan datos obtenidos de la base de datos
let ciudadesExist = [];
async function cargarCiudades() {
  ciudadesExist = await obtenerDatos("ciudades"); // Se obtiene la lista de ciudades
  llenarCiudades(); // Se llena el desplegable con las opciones de ciudad
}

let generosExist = [];
async function cargarGeneros(){
  generosExist = await obtenerDatos("generos"); // Se obtiene la lista de géneros
  llenarGeneros(); // Se llena la sección de géneros en el formulario
}

let lenguajesExist = [];
async function cargarLenguajes(){
  lenguajesExist = await obtenerDatos("lenguajes"); // Se obtiene la lista de lenguajes
  llenarLenguajes(); // Se llena la sección de lenguajes en el formulario
}

let lenguajesUsuariosExist = [];
async function cargarLenguajesUsuarios(){
  lenguajesUsuariosExist = await obtenerDatos("lenguajes_usuarios"); // Se obtiene la relación entre usuarios y lenguajes
}

// Función para llenar el desplegable de ciudades con las opciones obtenidas
function llenarCiudades() {
  ciudadesExist.data.forEach((ciud) => {
    const option = document.createElement("option");

    option.setAttribute("value", ciud.id);
    option.textContent = `${ciud.nombre}`;

    ciudad.append(option);
  });
}

// Función para llenar los géneros en el formulario como botones de opción (radio)
function llenarGeneros() {
  generosExist.data.forEach((gender) => {
    const input = document.createElement("input");
    const label = document.createElement("label");

    input.classList.add("form__inputs");
    input.setAttribute("type", "radio");
    input.setAttribute("value", gender.id);
    input.setAttribute("name", "id_genero");
    input.setAttribute("id", gender.nombre);
    input.setAttribute("required", "");

    // Se agrega el evento de validación cuando se selecciona un género
    input.addEventListener("change", validarGenero);

    label.setAttribute("for", gender.nombre);
    label.textContent = `${gender.nombre}`;

    generosContent.append(input, label);
  });
}

// Función para llenar los lenguajes en el formulario como casillas de verificación (checkbox)
function llenarLenguajes() {
  lenguajesExist.data.forEach((languaje) => {
    const input = document.createElement("input");
    const label = document.createElement("label");

    input.classList.add("form__inputs");
    input.setAttribute("type", "checkbox");
    input.setAttribute("value", languaje.id);
    input.setAttribute("name", "habilidades");
    input.setAttribute("id", languaje.nombre);
    input.setAttribute("required", "");
    input.textContent = `${languaje.nombre}`;

    label.setAttribute("for", languaje.nombre);
    label.textContent = `${languaje.nombre}`;

    lenguajesContent.append(input, label);
  });
}

// Variables donde se almacenan los usuarios y el ID de edición
let usuarios = [];
let idEditar = null;

// Función que carga los usuarios registrados y los lenguajes que han seleccionado
async function cargarUsuarios() {
  usuarios = await obtenerDatos("usuarios"); // Se obtiene la lista de usuarios
  await cargarLenguajesUsuarios(); // Se obtiene la relación entre usuarios y lenguajes
  renderizarTabla(); // Se muestran los usuarios en la tabla
}

// Función que renderiza los usuarios en la tabla
function renderizarTabla() {
  tabla.textContent = ""; // Limpiamos la tabla antes de llenarla nuevamente  

  usuarios.data.forEach((usuario) => {
    // Creamos la fila de la tabla para cada usuario
    const fila = document.createElement("tr");

    // Celda con el ID del usuario
    const tdId = document.createElement("td");
    tdId.textContent = usuario.id;

    // Celda con el nombre del usuario
    const tdNombre = document.createElement("td");
    tdNombre.textContent = usuario.nombre;

    // Celda con el apellido del usuario
    const tdApellido = document.createElement("td");
    tdApellido.textContent = usuario.apellido;
    
    // Celda con el teléfono del usuario
    const tdTelefono = document.createElement("td");
    tdTelefono.textContent = usuario.telefono;

    // Celda con la ciudad del usuario
    const tdCiudad = document.createElement("td");
    const ciudad = ciudadesExist.data.find(c => c.id == usuario.id_ciudad); // Se busca la ciudad correspondiente al usuario
    tdCiudad.textContent = ciudad.nombre;

    // Celda con el documento del usuario
    const tdDocumento = document.createElement("td");
    tdDocumento.textContent = usuario.documento;

    // Celda con el nombre de usuario
    const tdUsuario = document.createElement("td");
    tdUsuario.textContent = usuario.usuario;

    // Celda con la contraseña del usuario
    const tdContrasena = document.createElement("td");
    tdContrasena.textContent = usuario.contrasena;

    // Celda con el género del usuario
    const tdGenero = document.createElement("td");
    const genero = generosExist.data.find(g => g.id == usuario.id_genero); // Se busca el género correspondiente al usuario
    tdGenero.textContent = genero.nombre;

    // Celda con los lenguajes del usuario
    const tdLenguajes = document.createElement("td");
    const relacionLenguajeUsuario = lenguajesUsuariosExist.data.filter(dato => dato.id_usuario == usuario.id); // Se buscan los lenguajes asociados al usuario

    // Se obtienen los nombres de los lenguajes relacionados con el usuario
    const nombresLenguajes = relacionLenguajeUsuario.map(relacion => {
      const lenguaje = lenguajesExist.data.find(l => l.id == relacion.id_lenguaje);
      return lenguaje.nombre;
    });

    tdLenguajes.textContent = nombresLenguajes.join(", "); // Se muestran los lenguajes separados por comas

    // Celda de los botones de acción
    const tdAcciones = document.createElement("td");

    // Botón para editar el usuario
    const btnEditar = document.createElement("button");
    btnEditar.classList.add("botonAccion", "editar");
    btnEditar.setAttribute("data-id", usuario.id);
    btnEditar.textContent = "Editar";

    // Botón para eliminar el usuario
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("botonAccion", "eliminar");
    btnEliminar.setAttribute("data-id", usuario.id);
    btnEliminar.textContent = "Eliminar";
    
    // Se agregan los botones a la celda de acciones
    tdAcciones.append(btnEditar, btnEliminar);

    // Se agregan las celdas a la fila
    fila.append(tdId, tdNombre, tdApellido, tdTelefono, tdCiudad, tdDocumento, tdUsuario, tdContrasena, tdGenero, tdLenguajes, tdAcciones);

    // Se agrega la fila completa a la tabla
    tabla.append(fila);
  });
}



// EVENTOS

// Evento que valida si el checkbox de políticas está seleccionado al cargar la página
addEventListener("DOMContentLoaded", validarCheck);

// Evento que carga los usuarios registrados al iniciar la página
addEventListener("DOMContentLoaded", cargarUsuarios);

// Evento que valida el checkbox de políticas cuando cambia su estado
politicas.addEventListener("change", validarCheck);

// Evento que maneja la validación de entrada en el campo nombre (actualmente comentado)
// nombre.addEventListener("keypress", limitar);

// Evento que maneja el envío del formulario
formulario.addEventListener("submit", async (e) => {
  e.preventDefault(); // Se previene el comportamiento por defecto del formulario

  // Se valida el formulario antes de continuar
  if (!validarFormulario(e)) return;

  // Se obtiene el objeto con los datos ingresados en el formulario
  const datos = objeto;

  if (datos) {
    // Se crea un objeto con los datos del usuario para enviarlo a la base de datos
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

    // Se obtienen los lenguajes seleccionados por el usuario
    const checkBoxMarcados = document.querySelectorAll(`[name="habilidades"]:checked`);
    const lenguajesSeleccionados = [];

    checkBoxMarcados.forEach((checkbox) => {
      const valor = parseInt(checkbox.value); // Se convierte el valor del checkbox a número
      lenguajesSeleccionados.push(valor); // Se guarda el ID del lenguaje seleccionado
    });

    // Si hay un ID de edición, se actualiza el usuario existente
    if (idEditar) {
      await editarDato("usuarios", idEditar, objetoUsuario); // Se envía la solicitud para actualizar el usuario

      // Se obtienen los lenguajes que tenía el usuario y se eliminan para actualizar los datos
      const lenguajesUsuarios = await obtenerDatos("lenguajes_usuarios");
      const promesas = lenguajesUsuarios.data.filter((dato) => dato.id_usuario == idEditar).map((dato) => eliminarDato("lenguajes_usuarios", dato.id));
      await Promise.all(promesas); // Se espera a que todos los datos sean eliminados

      // Se asignan los nuevos lenguajes al usuario
      await Promise.all(lenguajesSeleccionados.map(async (idLenguaje) => {
        const objetoLenguajesUsuario = {
          id_usuario: idEditar,
          id_lenguaje: idLenguaje
        };
        return await crearDato("lenguajes_usuarios", objetoLenguajesUsuario);
      }));

      location.reload(); // Se recarga la página para reflejar los cambios
      idEditar = null; // Se reinicia la variable de edición
    } else {
      // Se envía la solicitud para crear un nuevo usuario
      const nuevoUsuario = await crearDato("usuarios", objetoUsuario);
      const nuevoUsuarioDatos = await nuevoUsuario.json(); // Se convierte la respuesta en JSON

      // Si la respuesta tiene errores, se muestra una alerta con el mensaje de error
      if (!nuevoUsuarioDatos.success) {
        alert(nuevoUsuarioDatos.erros[0].message);
      } else {
        // Si el usuario fue creado con éxito, se asignan sus lenguajes seleccionados
        await Promise.all(lenguajesSeleccionados.map(async (idLenguaje) => {
          console.log(nuevoUsuarioDatos.data);
          
          const objetoLenguajesUsuario = {
            id_usuario: nuevoUsuarioDatos.data.id,
            id_lenguaje: idLenguaje
          };
  
          await crearDato("lenguajes_usuarios", objetoLenguajesUsuario);
        }));  
        
        formulario.reset(); // Se limpia el formulario después de enviar los datos
      }
    }

    await cargarUsuarios(); // Se actualiza la lista de usuarios
  }
});

// Eventos de validación para los campos del formulario
nombre.addEventListener("keydown", validarLetras);
apellido.addEventListener("keydown", validarLetras);
telefono.addEventListener("keydown", validarNumeros);
documento.addEventListener("keydown", validarNumeros);
usuario.addEventListener("keydown", validarCaracteres);
contrasena.addEventListener("keydown", validarCaracteres);

// Eventos de validación cuando los campos pierden el foco
nombre.addEventListener("blur", outFocus);
apellido.addEventListener("blur", outFocus);
telefono.addEventListener("blur", outFocus);
ciudad.addEventListener("blur", outFocus);
documento.addEventListener("blur", outFocus);
usuario.addEventListener("blur", outFocus);
contrasena.addEventListener("blur", outFocus);

// Evento que carga las ciudades, géneros y lenguajes al iniciar la página
addEventListener("DOMContentLoaded", cargarCiudades(), cargarGeneros(), cargarLenguajes(), cargarLenguajesUsuarios());
