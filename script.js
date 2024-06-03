document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('routeForm');
    const canvas = document.getElementById('routeCanvas');
    const ctx = canvas.getContext('2d');
    const mapImage = document.querySelector('.map-image');

    function textToSpeech(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
    }
    
    document.getElementById('text-to-speech-btn').addEventListener('click', () => {
        const start = document.getElementById('start').value;
        const end = document.getElementById('end').value;
        const routeId = `${start}-${end}`;
        let text;

        switch (routeId) {
            case 'Lobby-Redes':
                text = `Siga recto, cuidado con la rejilla de desague, cuando llegue enfrente del bloque de redes suba por la rampa, gire a la derecha y suba al elevador, en el elevador presione el boton del segundo piso, al salir siga recto, doble a la derecha al llegar a la entrada de redes y siga recto hasta la puerta del fondo.`; 
                break;
            case 'Lobby-Laboratorio':
                text = `Siga recto, cuidado con la rejilla de desague, cuando llegue enfrente del bloque de redes suba por la rampa, gire a la izquierda y siga recto, cuando llegue a la rampa baje por ahí, cuando baje la rampa doble a la derecha, cuando llegue a la carretera doble a la izquierda, siga por ahí hasta encontrar la rampa y suba por la rampa.`;
                break;
            case 'Lobby-Cafeteria':
                text = `Siga recto, cuidado con la rejilla de desague, cuando vea un pasillo a su derecha doble por ese pasillo, siga recto hasta llegar a una rampa a su izquierda, suba por esa rampa, al llegar arriba siga recto hasta llegar a la cafeteria.`;
                break;
            default:
                text = 'Ruta no encontrada.';
                break;
        }

        textToSpeech(text);
    });

    const routes = {
        "Lobby": { x: 150, y: 140 },
        "Cafeteria": { x: 195, y: 100 },
        "Laboratorio": { x: 160, y: 20 },
        "Biblioteca": { x: 160, y: 60 },
        "Redes": { x: 400, y: 400 },
        "Bloque A": { x: 100, y: 110 },
        "Bloque B": { x: 100, y: 99 },
        "Bloque C": { x: 100, y: 79 },

        //  INTERSECCIONES
        // Ruta Lobby-Cafeteria
        "1": {x: 150, y: 115},
        "2": {x: 195, y: 115},

        //Ruta Lobby-redes, biblioteca
        "3": {x: 150, y: 90},
        "4": {x:150, y: 71},
        "elevador2": { x: 160, y: 70 },

        // Ruta Lobby-A,B,C
        "5": { x: 100, y: 140},

        // Laboratorio
        "6": { x: 90, y: 71},
        "7": { x: 90, y: 40},
        "8": { x: 160, y: 40}
    };



    const predefinedRoutes = {
        "Lobby-Laboratorio": ["Lobby", "3", "4", "6", "7", "8", "Laboratorio"],
        "Lobby-Biblioteca": ["Lobby", "3", "4", "elevador2", "Biblioteca"],
        "Lobby-Redes": ["Lobby", "3", "4", "elevador2", "Biblioteca"],
        "Lobby-Cafeteria": ["Lobby", "1", "2", "Cafeteria"],
        "Lobby-Bloque A": ["Lobby", "5", "Bloque A"],
        "Lobby-Bloque B": ["Lobby", "5", "Bloque B"],
        "Lobby-Bloque C": ["Lobby", "5", "Bloque C"]
    };

    mapImage.onload = () => {
        canvas.width = mapImage.clientWidth;
        canvas.height = mapImage.clientHeight;
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const start = document.getElementById('start').value;
        const end = document.getElementById('end').value;

        if (routes[start] && routes[end]) {
            const routeKey = `${start}-${end}`;
            if (predefinedRoutes[routeKey]) {
                drawRoute(predefinedRoutes[routeKey]);
            } else {
                alert('Ruta no definida. Por favor, selecciona otra combinación.');
            }
        } else {
            alert('Ruta no encontrada. Por favor, verifica los puntos seleccionados.');
        }
    });

    function drawRoute(points) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(routes[points[0]].x, routes[points[0]].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(routes[points[i]].x, routes[points[i]].y);
        }
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
});