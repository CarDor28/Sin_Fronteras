document.addEventListener("DOMContentLoaded", function () {
    const map = L.map('map').setView([0, 0], 2); // Mapa centrado en el ecuador con zoom global

    // Agregar capa de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Intentar obtener la ubicación actual del usuario
    map.locate({setView: true, maxZoom: 16});
    
    function onLocationFound(e) {
        const radius = e.accuracy;
        L.marker(e.latlng).addTo(map)
            .bindPopup(`Estás dentro de ${radius} metros de este punto.`).openPopup();
        L.circle(e.latlng, radius).addTo(map);
    }

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    // Funcionalidad de selección de puntos y rutas
    let startMarker, endMarker, routeLayer;
    let selectingStartPoint = true;

    map.on('click', function(e) {
        if (selectingStartPoint) {
            if (startMarker) map.removeLayer(startMarker);
            startMarker = L.marker(e.latlng).addTo(map).bindPopup('Punto de partida').openPopup();
            selectingStartPoint = false;
        } else {
            if (endMarker) map.removeLayer(endMarker);
            endMarker = L.marker(e.latlng).addTo(map).bindPopup('Destino').openPopup();
            selectingStartPoint = true;
            calculateRoute(startMarker.getLatLng(), endMarker.getLatLng());
        }
    });

    function calculateRoute(start, end) {
        if (routeLayer) map.removeLayer(routeLayer);

        const startCoords = `${start.lng},${start.lat}`;
        const endCoords = `${end.lng},${end.lat}`;
        const apiKey = '5b3ce3597851110001cf624889a90272198d4f68865ccbdcf674b646'; // Reemplaza con tu clave de API de OpenRouteService

        fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoords}&end=${endCoords}`)
            .then(response => response.json())
            .then(data => {
                const coordinates = data.features[0].geometry.coordinates;
                const latLngs = coordinates.map(coord => [coord[1], coord[0]]);
                routeLayer = L.polyline(latLngs, {color: 'blue'}).addTo(map);
                map.fitBounds(routeLayer.getBounds());
            })
            .catch(error => {
                console.error('Error al calcular la ruta:', error);
            });
    }

    document.getElementById('saveRoute').addEventListener('click', function () {
        if (startMarker && endMarker) {
            const start = startMarker.getLatLng();
            const end = endMarker.getLatLng();
            // Guardar las coordenadas de inicio y fin en el servidor o localStorage
            // Aquí podrías hacer una llamada AJAX a tu servidor para guardar la ruta
            console.log('Ruta guardada:', { start, end });
        } else {
            alert('Selecciona puntos de partida y destino antes de guardar la ruta.');
        }
    });
});