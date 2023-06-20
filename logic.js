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
      // Process the GeoJSON data and add markers for each earthquake
      data.features.forEach(feature => {
        var magnitude = feature.properties.mag;
        var place = feature.properties.place;
        var coordinates = feature.geometry.coordinates;

        // Create a Leaflet marker with a popup for each earthquake
        L.marker([coordinates[1], coordinates[0]])
          .bindPopup(`<strong>Magnitude: ${magnitude}</strong><br>Location: ${place}`)
          .addTo(map);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
};
document.head.appendChild(script);

// CSS styles
var styles = `
  #map {
    height: 500px;
  }
`;
var styleNode = document.createElement('style');
styleNode.innerHTML = styles;
document.head.appendChild(styleNode);

// HTML container
var container = `
  <div id="map"></div>
`;
document.body.innerHTML = container;

  