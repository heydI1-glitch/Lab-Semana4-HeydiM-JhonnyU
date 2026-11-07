
// Formato tiempo 
function formatoTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segRestantes = segundos % 60;
    const segTexto = segRestantes < 10 ? `0${segRestantes}` : `${segRestantes}`;
    return `${minutos}:${segTexto}`;
}

//  Tipo com_Can
class Cancion {
    constructor(titulo, artista, duracion) {
        this.titulo = titulo;
        this.artista = artista;
        this.duracion = duracion; // entero en segundos
    }

    formato() {
        return `${this.titulo} - ${this.artista} (${formatoTiempo(this.duracion)})`;
    }
}

// Tipo com_acci
class Accion {
    constructor(tipo, cancion, posicion) {
        this.tipo = tipo;       // "agregar" o "eliminar"
        this.cancion = cancion; // Objeto Cancion
        this.posicion = posicion; // Entero
    }
}

// 1.4 Tipo compuesto Album
class Album {
    constructor(titulo, anio, canciones) {
        this.titulo = titulo;
        this.anio = anio;
        this.canciones = canciones; // Arreglo de 4 canciones
    }

    cantidad() {
        return this.canciones.length;
    }

    duracionTotal() {
        let total = 0;
        for (let i = 0; i < this.canciones.length; i++) {
            total += this.canciones[i].duracion;
        }
        return total;
    }
}

// Paso 2: Pila estática C3
class PilaEstatica {
    #elementos;
    #tope;
    #capacidad;

    constructor(capacidad = 3) {
        this.#capacidad = capacidad;
        this.#elementos = new Array(capacidad);
        this.#tope = 0;
    }

    push(elemento) {
        if (this.estAllena()) {
            throw new Error("Error Pila llena: no cabe otro elemento");
        }
        this.#elementos[this.#tope] = elemento;
        this.#tope++;
    }

    pop() {
        if (this.estaVacia()) {
            throw new Error("Error Pila vacía: no hay nada que sacar");
        }
        this.#tope--;
        const elemento = this.#elementos[this.#tope];
        this.#elementos[this.#tope] = undefined;
        return elemento;
    }

    peek() {
        if (this.estaVacia()) {
            return undefined;
        }
        return this.#elementos[this.#tope - 1];
    }

    estaVacia() {
        return this.#tope === 0;
    }

    estAllena() {
        return this.#tope === this.#capacidad;
    }

    tamano() {
        return this.#tope;
    }

    capacidad() {
        return this.#capacidad;
    }
}


//Pila dinámica 
class PilaDinamica {
    #elementos;

    constructor() {
        this.#elementos = [];
    }

    push(elemento) {
        this.#elementos.push(elemento);
    }

    pop() {
        if (this.estaVacia()) {
            throw new Error("Error Pila vacía: no hay nada que sacar");
        }
        return this.#elementos.pop();
    }

    peek() {
        if (this.estaVacia()) {
            return undefined;
        }
        return this.#elementos[this.#elementos.length - 1];
    }

    estaVacia() {
        return this.#elementos.length === 0;
    }

    tamano() {
        return this.#elementos.length;
    }
}
// Editor de playlist en JavaScript

class EditorPlaylist {
    #playlist;
    #deshacer;
    #rehacer;

    constructor() {
        this.#playlist = [];
        this.#deshacer = new PilaEstatica(3);
        this.#rehacer = new PilaDinamica();
    }

    agregar(cancion) {
        if (this.#deshacer.estAllena()) {
            console.log("Historial lleno: guarda la playlist para seguir editando");
            return;
        }
        this.#playlist.push(cancion);
        const acc = new Accion("agregar", cancion, this.#playlist.length - 1);
        this.#deshacer.push(acc);
        this.#rehacer = new PilaDinamica(); // vacia rehacer
    }

    eliminar(posicion) {
        if (this.#deshacer.estAllena()) {
            console.log("Historial lleno: guarda la playlist para seguir editando");
            return;
        }
        if (posicion < 0 || posicion >= this.#playlist.length) {
            console.log("Posición inválida");
            return;
        }
        const cancionEliminada = this.#playlist[posicion];
        this.#playlist.splice(posicion, 1);
        const acc = new Accion("eliminar", cancionEliminada, posicion);
        this.#deshacer.push(acc);
        this.#rehacer = new PilaDinamica(); // vacia rehacer
    }

    deshacer() {
        if (this.#deshacer.estaVacia()) {
            console.log("Nada que deshacer");
            return;
        }
        const accion = this.#deshacer.pop();
        if (accion.tipo === "agregar") {
            this.#playlist.splice(accion.posicion, 1);
        } else if (accion.tipo === "eliminar") {
            this.#playlist.splice(accion.posicion, 0, accion.cancion);
        }
        this.#rehacer.push(accion);
    }

    rehacer() {
        if (this.#rehacer.estaVacia()) {
            console.log("Nada que rehacer");
            return;
        }
        const accion = this.#rehacer.pop();
        if (accion.tipo === "agregar") {
            this.#playlist.splice(accion.posicion, 0, accion.cancion);
        } else if (accion.tipo === "eliminar") {
            this.#playlist.splice(accion.posicion, 1);
        }
        this.#deshacer.push(accion);
    }

    guardar() {
        this.#deshacer = new PilaEstatica(3);
        this.#rehacer = new PilaDinamica();
        console.log("Playlist guardada");
    }

    estado() {
        const titulos = this.#playlist.map(c => c.titulo).join(", ");
        return `[ ${titulos} ] · Deshacer ${this.#deshacer.tamano()}/3 · Rehacer ${this.#rehacer.tamano()}`;
    }

    mostrar() {
        console.log("--- PLAYLIST ACTUAL ---");
        let duracionTotal = 0;
        for (let i = 0; i < this.#playlist.length; i++) {
            console.log(`${i + 1}. ${this.#playlist[i].formato()}`);
            duracionTotal += this.#playlist[i].duracion;
        }
        console.log(`Duración total: ${formatoTiempo(duracionTotal)}`);
    }
}

function main() {
    //Crear album con 4 canciones reales
    const cancionesAlbum = [
        new Cancion("Cancion uno", "Cantante A", 354),
        new Cancion("cancion dos", "Cantante B", 209),
        new Cancion("cancion tres", "Cantante C", 215),
        new Cancion("cancion cuatro", "Cantante D", 248)
    ];

    const miAlbum = new Album("ALBUN", 1975, cancionesAlbum);

    console.log("=== MOSTRANDO ALBUM ===");
    console.log(`TItulo del Album (${miAlbum.anio}) · ${miAlbum.cantidad()} canciones`);
    for (let i = 0; i < miAlbum.canciones.length; i++) {
        console.log(`${i + 1}. ${miAlbum.canciones[i].formato()}`);
    }
    console.log(`Duración del Album: ${formatoTiempo(miAlbum.duracionTotal())}\n`);

    // Secuencia de 13 Pasos 
    console.log("=== EJECUTANDO SECUENCIALMENTE LOS 13 PASOS ===");
    const editor = new EditorPlaylist();

    const operaciones = [
        () => editor.agregar(cancionesAlbum[0]), // Paso 1
        () => editor.agregar(cancionesAlbum[1]), // Paso 2
        () => editor.agregar(cancionesAlbum[2]), // Paso 3
        () => editor.agregar(cancionesAlbum[3]), // Paso 4
        () => editor.deshacer(),                 // Paso 5
        () => editor.deshacer(),                 // Paso 6
        () => editor.rehacer(),                  // Paso 7
        () => editor.eliminar(0),                // Paso 8
        () => editor.rehacer(),                  // Paso 9
        () => editor.deshacer(),                 // Paso 10
        () => editor.guardar(),                  // Paso 11
        () => editor.deshacer(),                 // Paso 12
        () => editor.agregar(cancionesAlbum[3])  // Paso 13
    ];

    const nombresOperaciones = [
        "agregar cancion 1 del álbum",
        "agregar cancion 2",
        "agregar cancion 3",
        "agregar cancion 4",
        "deshacer",
        "deshacer",
        "rehacer",
        "eliminar(1)",
        "rehacer",
        "deshacer",
        "guardar",
        "deshacer",
        "agregar canción 4"
    ];

    for (let i = 0; i < operaciones.length; i++) {
        const numPaso = i + 1;
        operaciones[i]();
        console.log(`Paso ${numPaso} · ${nombresOperaciones[i]} -> ${editor.estado()}`);
    }

    console.log("\n=== SALIDA FINAL DEL EDITOR ===");
    editor.mostrar();
}

main();