let monto
let plazo
let tasa_anual
let tasa_mensual
let cuota
let intereses
let capital
let saldo
let saldo_inicial = 0

let get_datos = function(){
    monto = document.getElementById("monto").value
    plazo = document.getElementById("plazo").value
    tasa_anual = document.getElementById("interes").value
}

let btn_registro = document.getElementById("btn_registro");
let btn_login = document.getElementById("btn_login");
let msj = document.getElementById("mensaje");
let clima = document.getElementById("clima");

btn_registro.addEventListener ("click" , alta_usuario);
btn_login.addEventListener("click" , login_usuario);

let arr_usuarios = [];

function alta_usuario(){

    let nombre_usuario = document.getElementById("nombre");
    let pass_usuario = document.getElementById("pass");

    let usuario = {nombre:nombre_usuario.value , password:pass_usuario.value};

    arr_usuarios.push(usuario);

    let arreglo_JSON = JSON.stringify(arr_usuarios);

    localStorage.setItem("arr_usuarios" , arreglo_JSON);

}

function login_usuario(){

    let arr = JSON.parse(localStorage.getItem("arr_usuarios"));

    let nombre_usuario = document.getElementById("nombre").value;
    let pass_usuario = document.getElementById("pass").value;

    for( let usuario of arr){

        if( nombre_usuario == usuario.nombre && pass_usuario == usuario.password){

            let parrafo = document.createElement("h1");
            parrafo.innerText = `Bienvenido/a a Préstamos Delorean, ${usuario.nombre}.`;
            parrafo.style.fontSize = "24px";
            parrafo.style.marginLeft = "3rem";
            msj.append( parrafo );

            break
        }
        else{
            Swal.fire({
                confirmButtonColor: 'rgb(229, 112, 22)',
                title:"ERROR 404",
                text:"Usuario NO encontrado",
                icon:"error"                
            }); 
        }
    }
}

// Ahora empezamos con el simulador definiendo las variables y la logica del prestamo




function calcular_tasa_mensual(){
    tasa_mensual = (tasa_anual / 10 / 12)
    return tasa_mensual
}

function pago_mensual() {
    cuota = (monto / plazo) + (monto / plazo)* calcular_tasa_mensual();
    return cuota

}


function calculo_intereses() {    
    intereses = tasa_mensual * monto / plazo
    return intereses
}


function calculo_capital() {
    capital = cuota - intereses
    return capital
    }


function saldo_pendiente() {
    if (saldo_inicial == 0) {
        saldo = monto - capital
        saldo_inicial = saldo
    } else {
        saldo -= calculo_capital()
    }
    return saldo
}

function simular_prestamo() {
    get_datos()
    pago_mensual()

    let arr = ["No.", "Cuota", "Intereses", "Capital", "Saldo"]

    let tabla_amortizaciones = document.getElementById("amortizaciones")
    let tabla = document.createElement("table")
    let cabecera_tabla = document.createElement("thead")
    let cuerpo_tabla = document.createElement("tbody")
    let fila = document.createElement("tr")

    // este for, lo utilizo para el header de la tabla
    for (let j = 0; j < arr.length; j++) {
        let celda = document.createElement("td")
        let texto = arr[j]
        let texto_celda = document.createTextNode(texto)
        celda.appendChild(texto_celda)
        fila.appendChild(celda)
    }
    cabecera_tabla.appendChild(fila)

    // este ciclo for, lo uso para el cuerpo de la tabla
    for (let i = 0; i < plazo; i++) {
        let intereses = calculo_intereses();
        let capital = calculo_capital();
        let saldo = saldo_pendiente();
        
        let fila = document.createElement("tr")
        for (let j = 0; j < arr.length; j++) {
            let celda = document.createElement("td")
            let texto 
            switch(arr[j]) {
                case "No.":
                    texto = (i+1)
                    break
                case "Cuota":
                    texto = "$" + cuota.toFixed(2)
                    break
                case "Intereses":
                    texto = "$" + intereses.toFixed(2)
                    break
                case "Capital":
                    texto = "$" + capital.toFixed(2)
                    break
                case "Saldo":
                    texto = "$" + Math.abs(saldo.toFixed(2))
                    break
                
            }
            let texto_celda = document.createTextNode(texto)
            celda.appendChild(texto_celda)
            fila.appendChild(celda)
        }
        cuerpo_tabla.appendChild(fila)
    }

    tabla.appendChild(cabecera_tabla)
    tabla.appendChild(cuerpo_tabla)
    tabla_amortizaciones.appendChild(tabla)

}


function mostrar_ubicacion( ubicacion ){
    let lat = ubicacion.coords.latitude;
    let long = ubicacion.coords.longitude;
    let key = "4d83d74df60c9928fe7b4441f6efc67b";



fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}&units=metrics&lang=es`)
    .then( response=> response.json() )
    .then( data =>{
            let parrafo = document.createElement("h1");
            parrafo.innerText = `El pronóstico en ${data.name} para hoy es: ${data.weather[0].description}`;
            parrafo.style.fontSize = "18px";
            parrafo.style.marginLeft = "3rem";
            clima.append( parrafo );
    })


}

navigator.geolocation.getCurrentPosition( mostrar_ubicacion )