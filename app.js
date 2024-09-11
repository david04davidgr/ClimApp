// Variables
const api = {
    key: '31f4d806d7e7b5239acf46843549dcd7',
    url: 'https://api.openweathermap.org/data/2.5/weather'
};

const formulario = document.getElementById('formulario');
const buscador = document.getElementById('buscador');
const container = document.querySelector('.container');
const city = document.querySelector('#city');
const date = document.querySelector('#date');
const tempImg = document.querySelector('#temp-img');
const temp = document.querySelector('#temp');
const estado = document.querySelector('#estado');
const rango = document.querySelector('#rango');

// Eventos
formulario.addEventListener('submit', onSubmit);

// Obtiene las coordenadas (geolocalización)
window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                obtenerCiudadPorCoordenadas(lat, lon);
            },
            (error) => {
                console.error('Error al obtener la ubicación:', error);
                alert('No se pudo obtener la ubicación.');
            }
        );
    } else {
        alert('Geolocalización no soportada.');
    }
};

// Obtiene nombre de city por las coordenadas
async function obtenerCiudadPorCoordenadas(lat, lon) {
    const url = `${api.url}?lat=${lat}&lon=${lon}&appid=${api.key}&lang=es&units=metric`;
    try {
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        mostrarDatosClima(data); // Muestra el clima de la ciudad
    } catch (error) {
        console.error('Error al obtener el clima:', error);
        alert('Ha ocurrido un error al obtener el clima.');
    }
}

// Busca el clima del nombre de ciudad
async function buscar(query) {
    try {
        const respuesta = await fetch(`${api.url}?q=${query}&appid=${api.key}&lang=es&units=metric`);
        const data = await respuesta.json();
        mostrarDatosClima(data); // Muestra los datos del clima de la ciudad buscada
    } catch (error) {
        console.log('Error al buscar el clima:', error);
        alert('Ha ocurrido un error al buscar el clima.');
    }
}

// Muestra los datos en la página
function mostrarDatosClima(data) {
    container.style.display = 'flex';
    city.innerHTML = `${data.name}, ${data.sys.country}`;
    date.innerHTML = (new Date()).toLocaleDateString();
    temp.innerHTML = `${Math.round(data.main.temp)}ºC`;
    estado.innerHTML = data.weather[0].description;
    rango.innerHTML = `${Math.round(data.main.temp_min)}ºC / ${Math.round(data.main.temp_max)}ºC`;
    updateImg(data);
}

// Convierte Kelvin a Celsius
function toCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

// Actualiza la imagen
function updateImg(data) {
    const weather = data.weather[0].description;
    let src = 'img/soleado.png'; // Imagen por defecto

    if (weather.includes('nubes') || weather.includes('nuboso')) {
        src = 'img/clima-caliente.png';
    } else if (weather.includes('lluvia')) {
        src = 'img/lluvia.png';
    }

    tempImg.src = src;
}

// Envia el nombre de la ciudad introducido en el buscador
function onSubmit(event) {
    event.preventDefault();
    buscar(buscador.value);
}
