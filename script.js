// FUNCIÓN QUE DEVUELVE PALABRA ALEATORIA
function palabraRandom() {
    // set que almacena palabras de 5 letras
    const words = new Set(["ARRAY", "AVION", "BALON", "ACTOR", "BRAZO", "CRUDO", "ERROR", "FERIA", "GRITO", "HIELO", "ISLAS",
        "JULIO", "MONTE", "NECIO", "MARCO", "ONDAS", "PELOS", "PODER", "RELOJ", "RUBIO", "REDES", "SUCIO", "SERIO", "SELVA",
        "TABLA", "TORSO", "TORPE", "VACAS", "VELAS", "VAGOS", "VUELO", "ZURDO", "ZORRO", "YOGUR", "VALOR", "NOTAS", "MARCA",
        "INDIA", "JERGA", "RUSIA", "GORDO", "GORRO", "FINCA", "DENSO", "DADOS", "COSTO", "CORAL", "CLAVO", "BIZCO", "BACHE"]);
    // (número decimal aleatorio entre 0 y 1) * (tamaño del set) se redondea y se guarda en indiceRandom
    const indiceRandom = Math.floor(Math.random() * words.size);
    // devuelve la palabra que se encuentre en la posición indiceRandom
    return Array.from(words)[indiceRandom];
}
// la palabra seleccionada se guarda en palabraCorrecta
var palabraCorrecta = palabraRandom();

// FUNCIÓN QUE EVALÚA LAS TECLAS PULSADAS EN CADA INPUT DE INTENTO N
function intento(inputs, inputsSiguienteIntento) {
    // se recorren las letras del intento actual
    inputs.forEach(function (input, index) {
        // al introducir una letra en input N:
        input.addEventListener('input', function (event) {
            // se guarda la letra de N en letraN
            var letraN = this.value;
            // si letraN NO es una letra de la A a la Z (mayusc. o minusc.), se elimina lo introducido en input N y sale mensaje avisando
            if (!/^[a-zA-Z]+$/.test(letraN)) {
                this.value = '';
                alert("Introduce una letra válida");
            }
            // si letraN es una letra de la A a la Z (mayusc. o minusc.)
            else {
                // letraN se convierte a mayúscula
                this.value = letraN.toUpperCase();
                // se cambia el focus al siguiente input
                inputs[index + 1].focus();
            }
        });

        // al pulsar una tecla en input N (para cuando sea Backspace o Enter)
        input.addEventListener('keydown', function (event) {
            // si se pulsa Backspace
            if (event.key === 'Backspace') {
                // si input N ya se encuentra vacío, se cambia el focus al input anterior y se elimina también su contenido
                if (this.value.length === 0) {
                    inputs[index - 1].focus();
                    inputs[index - 1].value = '';
                }
                // si input N no está vacío, se elimina el contenido
                else {
                    inputs[index].value = '';
                }
            }
            // si se pulsa Enter
            else if (event.key === 'Enter') {
                // se llama a comprobar el return de la función intentoRellenado(), y si devuelve false pide rellenar todos los inputs
                if (!intentoRellenado(inputs)) {
                    alert("Rellena todos los campos.");
                    return;
                }
                // si se han rellenado todos los inputs, se llaman a las funciones cambiarColor() y siguienteIntento()
                else {
                    cambiarColor(inputs);
                    siguienteIntento(inputs, inputsSiguienteIntento);
                }
            }
        });
    });
}

// FUNCIÓN QUE COMPRUEBA SI SE HA RELLENADO TODO EL INTENTO, inputs es un querySelectorAll de las letras introducidas en el intento actual
function intentoRellenado(inputs) {
    // verifica si la longitud de los 5 inputs (las 5 letras) es igual a 1, es decir, si se ha rellenado
    return Array.from(inputs).every(input => input.value.length === 1);
}

// FUNCIÓN QUE COMPRUEBA SI SE HA GANADO EL INTENTO, inputs es un querySelectorAll de las letras introducidas en el intento actual
function haGanadoIntento(inputs) {
    // verifica si los 5 inputs (las 5 letras) coinciden con las de palabraCorrecta
    return Array.from(inputs).every((input, index) => input.value.toUpperCase() === palabraCorrecta.charAt(index));
}

// FUNCIÓN QUE DETERMINA SI SE HA GANADO O SE HA PERDIDO EL JUEGO
function siguienteIntento(inputs, inputsSiguienteIntento) {
    // si se acierta en el intento que sea, sale un mensaje de enhorabuena y se deshabilitan los inputs
    if (haGanadoIntento(inputs)) {
        alert("¡ENHORABUENA!");
        document.querySelectorAll('input').forEach(input => input.disabled = true);
    }
    // si el intento actual no es el último, pasa al siguiente intento (hay 6)
    else if (inputsSiguienteIntento) {
        // se deshabilitan los inputs actuales
        inputs.forEach(input => input.disabled = true);
        // se habilitan los inputs del siguiente intento
        inputsSiguienteIntento.forEach(input => input.disabled = false);
        // se cambia el focus al primer input del siguiente intento
        inputsSiguienteIntento[0].focus();
    }
    // si se falla el último intento, sale un mensaje con la palabra correcta y se deshabilitan los inputs
    else {
        alert("HAS PERDIDO :( PALABRA: " + palabraCorrecta);
        document.querySelectorAll('input').forEach(input => input.disabled = true);
    }
}

// FUNCIÓN QUE CAMBIA COLOR A VERDE, ROJO O AMARILLO EN FUNCIÓN DE SI SE HA ACERTADO LA LETRA O SE ENCUENTRA EN OTRA POSICIÓN
function cambiarColor(inputs) {
    // se declaran e inicializan arr1 (copia de palabraCorrecta en array) y arr2 (palabra introducida) en cada intento
    var arr1 = palabraCorrecta.split('');
    var arr2 = [];
    // se recorren las letras del intento actual
    inputs.forEach((input, index) => {
        // se guarda la letra de N en letraN
        var letraN = input.value;
        // rellenamos arr2 con la palabra introducida
        arr2.push(letraN);
    });

    // comprobamos mediante un bucle for si se ha acertado alguna letra, para ello arr2[i] debe ser igual que arr1[i]
    for (let i = 0; i < arr1.length; i++) {
        // las letras acertadas se convierten en null en arr1, para comprobar posteriormente si se debe cambiar el color a amarillo

        // EJEMPLO: si la palabra es [a,r,r,a,y] y se aciertan las 'r', arr1 = [a,null,null,a,y], entonces si se ha introducido [r,r,r,r,r],
        // sabemos que las demás 'r' no acertadas no deben cambiar a amarillo. Sin embargo, si se acierta una sola 'r', arr1 = [a,null,r,a,y],
        // entonces si se ha introducido [r,r,a,r,r] sabemos que las 'r' no acertadas sí deben cambiar a amarillo, ya que aún falta una por acertar
        if (arr1[i] == arr2[i]) {
            arr1[i] = null;
        }
    }

    inputs.forEach((input, index) => {
        // se guarda la letra de N en letraN
        var letraN = input.value;

        // si letraN coincide con la letra N de palabraCorrecta, cambia color a verde
        if (letraN.toUpperCase() === palabraCorrecta.charAt(index)) {
            input.classList.add('bg-green-500');

        }

        // si letraN no coincide con la letra N de palabraCorrecta, pero arr1 contiene letraN, es que la letra está en otra posición, cambia color a amarillo
        else if (letraN.toUpperCase() !== palabraCorrecta.charAt(index) && arr1.includes(letraN.toUpperCase())) {
            input.classList.add('bg-yellow-400');
        }

        // si letraN NO coincide con la letra N de palabraCorrecta, NI ESTÁ en otra posición, cambia color a rojo
        else {
            input.classList.add('bg-red-500');
        }
    });
}

// SE LLAMA A LA FUNCIÓN intento() CON INTENTO N (ACTUAL) E INTENTO N+1 (SIGUIENTE) COMO PARÁMETROS
intento(document.querySelectorAll('#i1 input'), document.querySelectorAll('#i2 input'));
intento(document.querySelectorAll('#i2 input'), document.querySelectorAll('#i3 input'));
intento(document.querySelectorAll('#i3 input'), document.querySelectorAll('#i4 input'));
intento(document.querySelectorAll('#i4 input'), document.querySelectorAll('#i5 input'));
intento(document.querySelectorAll('#i5 input'), document.querySelectorAll('#i6 input'));
intento(document.querySelectorAll('#i6 input'), null);