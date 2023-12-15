// obtener los elementos del documento HTML
const app = document.getElementById('app');

const teclado = document.getElementById('teclado');

const titulo = document.getElementsByClassName('titulo');
const palabra = document.getElementsByClassName('palabra');

const tiempoDOM = document.getElementById('tiempo');

const startGame = document.getElementById('startGame');
const reset = document.getElementById('reset');
const mensaje = document.getElementById('mensaje');
const mensajeFinal = document.getElementById('mensajeFinal');

const erroresDOM = document.getElementById('errores');
const intentosDOM = document.getElementById('intentos');

const palabraDOM = document.getElementById('palabra');
const wordToGuessDOM = document.getElementById('wordToGuess');

// seleccionar todos los botones con data-categoria
const categorias = document.querySelectorAll('[data-categoria]');

let categoryMessage = document.getElementById('categoryMessage');

const menu = document.getElementById('menu');

// añadir evento click a cada botón
categorias.forEach((categoria) => {
    categoria.addEventListener('click', (e) => {
        // obtener el valor del data-categoria
        const categoriaSeleccionada = categoria.getAttribute('data-categoria');

        seleccionarTipoPalabra(categoriaSeleccionada);

        // función para que el jugador introduzca su nombre
        pedirNombre();

    });
});

let nombre = "";

// ocultamos por defecto los datos del usuario
document.getElementById('datosUsuario').style.display = "none";

// función para que el jugador introduzca su nombre
function pedirNombre() {
    nombre = prompt("Introduce tu nombre:");

    // transformar el nombre a minusculas
    nombre = nombre.toLowerCase();

    // comprobar si el usuario existe en el localstorage
    if (localStorage.getItem(nombre)) {
        // mostramos el div de los datos del usuario
        document.getElementById('datosUsuario').style.display = "grid";
        // obtener los datos del usuario del localstorage
        let datosUsuario = JSON.parse(localStorage.getItem(nombre));

        // mostramos los datos del usuario
        document.getElementById("nombreUsuario").innerHTML = datosUsuario.nombre;
        document.getElementById("puntuacionUsuario").innerHTML = datosUsuario.puntuacion;
        document.getElementById("tiempoUsuario").innerHTML = datosUsuario.tiempo;
        document.getElementById("partidasJugadasUsuario").innerHTML = datosUsuario.partidas;
        document.getElementById("partidasGanadasUsuario").innerHTML = datosUsuario.partidasGanadas;
        document.getElementById("partidasPerdidasUsuario").innerHTML = datosUsuario.partidasPerdidas;

    }
    else {

        // un json para guardar los datos del jugador
        let jugador = {
            "nombre": nombre,
            "puntuacion": 0,
            "tiempo": 0,
            "partidas": 0,
            "partidasGanadas": 0,
            "partidasPerdidas": 0
        };

        // guardar los datos del usuario en el localstorage
        localStorage.setItem(nombre, JSON.stringify(jugador));

        // mostramos el div de los datos del usuario
        document.getElementById('datosUsuario').style.display = "grid";

        // mostramos los datos del usuario
        document.getElementById("nombreUsuario").innerHTML = jugador.nombre;
        document.getElementById("puntuacionUsuario").innerHTML = jugador.puntuacion;
        document.getElementById("tiempoUsuario").innerHTML = jugador.tiempo;
        document.getElementById("partidasUsuario").innerHTML = jugador.partidas;
        document.getElementById("partidasGanadasUsuario").innerHTML = jugador.partidasGanadas;
        document.getElementById("partidasPerdidasUsuario").innerHTML = jugador.partidasPerdidas;

    }

    // mostrar el nombre del jugador en el DOM
    let nombreDOM = document.getElementById('nombreUsuario');
    nombreDOM.innerHTML = nombre;
}

let contador;

// flag para saber si el contador está activo o no
let flagContador = false;

let lIntentos = 10;


// array de botones del documento
const botones = document.getElementsByClassName('letra');

let opcUsuario = 0;

let arrPalabras = [
    {
        "tipo": "perifericos",
        "palabras": [
            "Ordenador",
            "Monitor",
            "Cable",
            "Teclado",
            "Raton"
        ]
    },
    {
        "tipo": "paises",
        "palabras": [
            "España",
            "Suecia",
            "Albania",
            "Montenegro",
            "Paises Bajos"
        ]
    }
];

let wordToGuess = "";

// array de jugadores
let arrJugadores = [];

// función para seleccionar el tipo de palabra
function seleccionarTipoPalabra(categoria) {

    // seleccionamos una palabra random del array de palabras según la categoría seleccionada

    // recorrer el array de palabras
    arrPalabras.forEach((palabra) => {
        // si la categoría seleccionada es igual a la categoría del array
        if (categoria === palabra.tipo) {


            // seleccionar una palabra random del array de palabras
            wordToGuess = palabra.palabras[Math.floor(Math.random() * palabra.palabras.length)];
            // convertir la palabra a array
            wordToGuess = wordToGuess.split("");

            // este split es simplementa para mostrar bien la palabra
            // mostrar la palabra en el DOM
            wordToGuess.forEach(() => {
                wordToGuessDOM.innerHTML += `<li>?</li>`;
            });

            // empezar el juego
            menu.style.display = "none";
            categoryMessage.style.display = "none";

            teclado.classList.remove("d-none");
            palabraDOM.classList.remove("d-none");
            wordToGuessDOM.classList.remove("d-none");
        }
    });

}


let intentos = 0;
let errores = 0;

// hay que iterar los botones, porqué hay varios
for (let i = 0; i < botones.length; i++) {

    botones[i].addEventListener("click", (e) => {
        checkLetter(e.target.innerHTML.toLowerCase());

        if (checkLetter(e.target.innerHTML)) {
            e.target.classList.add("letra-correcta");
            // deshabilitar el botón
            e.target.setAttribute("disabled", "disabled");
        }
        else {
            errores++;
            erroresDOM.innerHTML = errores;
            e.target.classList.add("letra-incorrecta");
            // deshabilitar el botón
            e.target.setAttribute("disabled", "disabled");
        }

        intentos++;

        if (errores == lIntentos) {
            clearInterval(contador);
            teclado.classList.add("d-none");

            // mostrar mensaje de perdedor
            mensaje.classList.remove("d-none");
            mensajeFinal.classList.add("text-danger");
            mensajeFinal.innerHTML = "Has llegado al límite de errores!";

            // mostrar la palabra

            let palabraCorrecta = document.getElementById('palabraCorrecta');

            palabraCorrecta.innerHTML = "La palabra era: " + wordToGuess.join("");

            // obtener los datos del usuario del localstorage
            let datosUsuario = JSON.parse(localStorage.getItem(nombre));

            // actualizar los datos del usuario
            datosUsuario.partidas++;
            datosUsuario.partidasPerdidas++;
            datosUsuario.tiempo += 180 - parseInt(tiempoDOM.innerHTML);

            // guardar los datos del usuario en el localstorage
            localStorage.setItem(nombre, JSON.stringify(datosUsuario));

            palabraDOM.classList.add("d-none");
            flagContador = false;

        }

        intentosDOM.innerHTML = intentos;

        if (checkWord()) {
            clearInterval(contador);
        }
    });

    botones[i].addEventListener("click", (e) => {
        // empezar el cronómetro
        if (!flagContador) {
            tiempo();
        }

        if (
            e.target.classList.contains("letra") &&
            !e.target.classList.contains("seleccionada")
        ) {
            e.target.classList.toggle("seleccionada");

        }
    });
}


// función que comprueba si la letra está en la palabra
function checkLetter(letter) {
    if (wordToGuess.includes(letter.toLowerCase()) || wordToGuess.includes(letter.toUpperCase())) {
        // mostrar por pantalla
        // recorrer el array de la palabra
        wordToGuess.forEach((letraAdivinar, index) => {
            if (letraAdivinar.toLowerCase() === letter.toLowerCase()) {
                // mostrar la letra en el DOM
                wordToGuessDOM.children[index].innerHTML = letraAdivinar;
            }
        });
        return true;
    }
    else {
        return false;
    }
}

// función que comprueba si la palabra está completa
function checkWord() {
    // recorrer el array de la palabra
    let palabraCompleta = true;

    let palabrasDOM = wordToGuessDOM.children;

    // solo se puede iterar asi?
    for (let i = 0; i < palabrasDOM.length; i++) {
        if (palabrasDOM[i].innerHTML === "?") {
            palabraCompleta = false;
        }
    }

    if (palabraCompleta) {
        clearInterval(contador);
        teclado.classList.add("d-none");

        // mensaje de ganador
        mensaje.classList.remove("d-none");
        mensajeFinal.classList.add("text-success");
        mensajeFinal.innerHTML = "Has ganado!";

        // obtener los datos del usuario del localstorage
        let datosUsuario = JSON.parse(localStorage.getItem(nombre));

        // actualizar los datos del usuario
        if (intentos < 10) {
            datosUsuario.puntuacion += 100;
        }
        else if (intentos < 20) {
            datosUsuario.puntuacion += 50;
        }
        else if (intentos < 30) {
            datosUsuario.puntuacion += 25;
        }
        else {
            datosUsuario.puntuacion += 10;
        }

        // obtener el tiempo que ha tardado en completar la palabra
        datosUsuario.tiempo += 180 - parseInt(tiempoDOM.innerHTML);

        datosUsuario.partidas++;

        datosUsuario.partidasGanadas++;

        // guardar los datos del usuario en el localstorage
        localStorage.setItem(nombre, JSON.stringify(datosUsuario));

        // mostrar los datos del usuario
        console.table(datosUsuario);

    }
}

// función para que cuando el jugador empieze a jugar, se inicie un contador de tiempo

function tiempo() {
    let tiempo = 180;
    let minutos = 0;
    let segundos = 0;

    flagContador = true;

    contador = setInterval(() => {
        tiempo--;

        segundos = tiempo % 60;
        minutos = Math.floor(tiempo / 60);

        if (tiempo < 60) {
            tiempoDOM.classList.add("contador-peligro");
        }

        if (segundos < 10) {
            segundos = "0" + segundos;
        }

        if (tiempo <= 0) {
            clearInterval(contador);
            mensaje.classList.remove("d-none");
            mensajeFinal.innerHTML = "Se acabó el tiempo!";
            mensajeFinal.classList.add("text-danger");
            teclado.classList.add("d-none");
            palabraDOM.classList.add("d-none");

            flagContador = false;
        }

        tiempoDOM.innerHTML = minutos + ":" + segundos;
    }, 1000);
}


// función para resetear el juego
reset.addEventListener("click", () => {
    // volver a generar una palabra random
    // de momento hará el reset de la página
    location.reload();
});