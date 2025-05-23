// Creo el objeto fuera y lo exporto para poder importarlo en otros archivos
export let objeto = {};

// FUNCIÓN PARA VALIDAR FORMULARIO
export const validarFormulario = (e) => {
  objeto = {}; // Limpio el objeto en cada validación

  let isValid = true; // Variable que controla si todo está correcto

  // Capturo todos los campos requeridos dentro del formulario
  const campos = [...e.target].filter((elemento) => {
    if (elemento.hasAttribute("required")) return elemento;
  });

  // Validación para campos tipo radio (selección única)
  const radios = campos.filter(elemento => elemento.type === "radio");
  
  let isChecked = null;
  if (radios.length > 0) {
    isChecked = radios.find(radio => radio.checked) || null;
    if (!isChecked) {
      objeto[radios[0].name] = "";
      isValid = false;
    } else {
      objeto[isChecked.name] = isChecked.value;
    }
  }

  // Validación para campos tipo checkbox (múltiples opciones)
  const checks = campos.filter(elemento => elemento.type === "checkbox");

  if (checks.length > 0) {
    const checkBoxSelected = checks.filter(check => check.checked);
    if (checkBoxSelected.length < 3) {
      setTimeout(() => {
        alert("Debe seleccionar 3 o más habilidades");
      }, 300);
      isValid = false;
    } else {
      objeto.lenguaje = checkBoxSelected.map(el => el.value);
    }
  }

  // Validaciones para inputs y selects
  campos.forEach(campo => {
    const nameCampo = campo.getAttribute("name");
    const placeHolder = campo.getAttribute("placeholder");

    switch (campo.tagName) {
      case "INPUT":
        if (["text", "number", "tel", "password"].includes(campo.type)) {
          if (!campo.value) {
            if (campo.nextElementSibling) campo.nextElementSibling.remove();
            campo.classList.add("form__input");
            let mensaje = document.createElement("span");
            mensaje.classList.add("form__mensaje");
            mensaje.textContent = `El campo ${placeHolder} es obligatorio.`;
            campo.insertAdjacentElement("afterend", mensaje);
            isValid = false;
          }
        }
        break;
      case "SELECT":
        if (!campo.selectedIndex) {
          if (campo.nextElementSibling) campo.nextElementSibling.remove();
          campo.classList.add("form__input");
          let mensaje = document.createElement("span");
          mensaje.classList.add("form__mensaje");
          mensaje.textContent = `Debe seleccionar una opción de ${nameCampo}`;
          campo.insertAdjacentElement("afterend", mensaje);
          isValid = false;
        }
        break;
      default:
        break;
    }

    // Si el campo tiene datos válidos, lo agregamos al objeto
    if (!["radio", "checkbox"].includes(campo.type)) {
      if ((campo.tagName === "INPUT" && campo.value) || (campo.tagName === "SELECT" && campo.selectedIndex !== 0)) {
        objeto[nameCampo] = campo.value;
      } else if (campo.hasAttribute("required")) {
        isValid = false;
      }
    }
  });

  return isValid;
};

// FUNCIÓN PARA LIMPIAR VALIDACIÓN AL PERDER EL FOCO
export const outFocus = (event) => {
  if (event.target.value) {
    event.target.classList.remove("form__input");
    if (event.target.nextElementSibling) event.target.nextSibling.remove();
  }
};

// FUNCIÓN PARA LIMITAR EL NÚMERO DE CARACTERES EN UN INPUT
export const limitar = (event) => {
  if (event.target.value.length === 10) {
    event.preventDefault();
  }
};

// Expresiones regulares para validaciones
const teclasEspeciales = ["Backspace", "Delete", "Tab", "Enter", "Home", "End", "Shift", "ArrowLeft", "ArrowRight"];
const regexLetras = /^[a-zñáéíóú ]$/i;
const regexNumeros = /^[0-9]$/;
const regexCaracteres = /^[a-zñáéíóú0-9\-._&# ]$/i;

// VALIDACIÓN DE ENTRADA PARA LETRAS
export const validarLetras = (event) => {
  if (!regexLetras.test(event.key) && !teclasEspeciales.includes(event.key)) event.preventDefault();
};

// VALIDACIÓN DE ENTRADA PARA NÚMEROS
export const validarNumeros = (event) => {
  if (!regexNumeros.test(event.key) && !teclasEspeciales.includes(event.key)) event.preventDefault();
};

// VALIDACIÓN DE ENTRADA PARA CARACTERES ESPECIALES
export const validarCaracteres = (event) => {
  if (!regexCaracteres.test(event.key) && !teclasEspeciales.includes(event.key)) event.preventDefault();
};

// FUNCIONES CRUD (INTERACCIÓN CON EL SERVIDOR)
const url = "http://localhost:3000";

// OBTENER DATOS DE UN ENDPOINT
export async function obtenerDatos(endpoint) {
  try {
    const respuesta = await fetch(`${url}/${endpoint}`);
    return await respuesta.json();
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return [];
  }
}

// CREAR UN NUEVO REGISTRO EN EL SERVIDOR
export async function crearDato(endpoint, datos) {
  try {    
    const respuesta = await fetch(`${url}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    return respuesta;
  } catch (error) {
    console.log("Error al crear dato:", error);
  }
}

// EDITAR UN REGISTRO EXISTENTE
export async function editarDato(endpoint, id, datos) {
  try {
    const respuesta = await fetch(`${url}/${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al editar dato:", error);
  }
}

// ELIMINAR UN REGISTRO DEL SERVIDOR
export async function eliminarDato(endpoint, id) {
  try {    
    const response = await fetch(`${url}/${endpoint}/${id}`, {
      method: "DELETE",
    });    
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar dato:", error);
  }
}
