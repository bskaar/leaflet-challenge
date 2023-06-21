// Leaflet library
var script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js';
script.onload = function () {
  // Create a Leaflet map centered on the United States
  var map = L.map('map').setView([37.0902, -95.7129], 4);

  // Add the base OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  // Fetch the earthquake data from the provided GeoJSON URL
  fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
    .then(response => response.json())
    .then(data => {
      // Define function to calculate marker size based on magnitude
      function getMarkerSize(magnitude) {
        return Math.sqrt(magnitude) * 4;
      }

      // Define function to calculate marker color based on depth
      function getMarkerColor(depth) {
        if (depth < 10) {
          return '#7fff00'; // Shallow depth (green)
        } else if (depth < 50) {
          return '#ffd700'; // Intermediate depth (gold)
        } else {
          return '#ff4500'; // Deep depth (orange-red)
        }
      }

      // Process the GeoJSON data and add markers for each earthquake
      data.features.forEach(feature => {
        var magnitude = feature.properties.mag;
        var place = feature.properties.place;
        var depth = feature.geometry.coordinates[2];
        var coordinates = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

        // Create a Leaflet circle marker with size and color based on magnitude and depth
        L.circleMarker(coordinates, {
          radius: getMarkerSize(magnitude),
          fillColor: getMarkerColor(depth),
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        })
          .bindPopup(`<strong>Magnitude: ${magnitude}</strong><br>Location: ${place}<br>Depth: ${depth} km`)
          .addTo(map);
      });

      // Create a legend
      var legend = L.control({ position: 'bottomright' });
      legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'legend');
        var depths = [0, 10, 50];
        var colors = ['#7fff00', '#ffd700', '#ff4500'];
        var labels = ['Shallow', 'Intermediate', 'Deep'];

        // Add legend title
        div.innerHTML = '<strong>Depth Legend</strong><br>';

        // Add legend items
        for (var i = 0; i < depths.length; i++) {
          div.innerHTML += `<i style="background: ${colors[i]}"></i> ${depths[i]} - ${labels[i]}<br>`;
        }

        return div;
      };
      legend.addTo(map);
    })
    .catch(error => {
      console.error('Error:', error);
    });
};
document.head.appendChild(script);

  