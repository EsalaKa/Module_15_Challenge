// Set color based on magnitude function
function getColor(magnitude) {
    return magnitude > 5 ? 'red' :
       magnitude > 4 ? 'orange' :
       magnitude > 3 ? 'yellow' :
       magnitude > 2 ? 'green' :
       magnitude > 1 ? 'lightblue' :
                      'brown';
}

// Set size based on magnitude function
function getSize(magnitude) {
    return magnitude * 4;
}

// Create legend function
function addLegend(map) {
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [1, 2, 3, 4, 5];

        div.innerHTML += '<strong>Magnitude</strong><br>';

        magnitudes.forEach(mag => {
            div.innerHTML +=
                `<i style="width:${getSize(mag)}px; height:${getSize(mag)}px; background:${getColor(mag)};"></i> ${mag} ${mag !== 5 ? '&ndash;' + (mag + 1) + '<br>' : '+<br>'}`;
        });

        return div;
    };

    legend.addTo(map);
}

// Create map function
function createMap(earthquakeInfo) {
    var map = L.map('map').setView([35, -100], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    addLegend(map);

    earthquakeInfo.features.forEach(feature => {
        var coordinates = feature.geometry.coordinates;
        var magnitude = feature.properties.mag;
        var depth = feature.geometry.coordinates[2];

        
        // Filter  within  Texas, San Francisco, and surrounding areas
        // Bounding Latitude range 25 to 40, Longitude range -130 to -90
        if (coordinates[0] > -130 && coordinates[0] < -90 && coordinates[1] > 25 && coordinates[1] < 40) {
            // Create a circle marker for each earthquake, variations of size and color 
            L.circleMarker([coordinates[1], coordinates[0]], {
                radius: getSize(magnitude),
                fillColor: getColor(magnitude),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth} km`).addTo(map);
        }
    });
}

// GeoJSON data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => createMap(data));
