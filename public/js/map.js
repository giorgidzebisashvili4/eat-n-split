document.addEventListener('DOMContentLoaded', () => {
  const locationsData = JSON.parse(
    document.getElementById('map').dataset.locations,
  );

  const [longStart, latStart] = locationsData[0].coordinates;

  const map = L.map('map', {
    scrollWheelZoom: false,
  }).setView([latStart, longStart], 8);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const bounds = [];
  const markers = [];

  for (let i = 0; i < locationsData.length; i++) {
    const currLocation = locationsData[i];
    const [long, lat] = currLocation.coordinates;
    bounds.push([lat, long]);

    const marker = L.marker([lat, long]).addTo(map);

    marker.bindPopup(
      `<h1>Arrive on Day ${currLocation.day}</h1><br><h1>Location: ${currLocation.description}.</h1>`,
    );

    markers.push(marker);
  }

  // Fit the map to the bounds of all the locations with padding
  map.fitBounds(bounds, { padding: [150, 150] });

  // Center the zoom control
  const zoomControl = document.querySelector('.leaflet-control-zoom');
  zoomControl.style.marginTop = '200px';

  // Open the popup of the first location
  markers[0].openPopup();
});
