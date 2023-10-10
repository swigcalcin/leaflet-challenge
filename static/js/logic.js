
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let myMap = L.map("map", {
    center: [39.7392,  -104.9903],
    zoom: 5,
  });
  
d3.json(url).then(function(data){
    console.log(data);
    Features(data); 
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


function MagColor(depth) {
    if (depth <= 10) {return "#1a6b1f";} 
    else if (depth <= 30) {return "#74f77d";} 
    else if (depth <= 50) {return "#ddf255";} 
    else if (depth <= 70) {return "#f2c855";} 
    else if (depth <= 90) {return "#eb6817";} 
    else if (depth > 90) {return "#d11717";}
  }

  function markerSize (magnitude){
    return Math.sqrt(magnitude)*15;
}


function Features(quakeData) {

    function Circle(feature, latlng) {
        let MarkerOptions = {
          radius: markerSize(feature.properties.mag),
          fillColor: MagColor(feature.geometry.coordinates[2]),
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 1.0 
        };
        
        return L.circleMarker(latlng, MarkerOptions);
    }

     function Popups(feature, layer) {
        layer.bindPopup(`
          <h3>${feature.properties.place}</h3>
          <hr>
          <p>
            <span class="popup-label">Magnitude</span>: ${feature.properties.mag}<br>
            <span class="popup-label">Depth</span>: ${feature.geometry.coordinates[2]}
          </p>
        `); 
    }

    L.geoJSON(quakeData, {
        pointToLayer: Circle,
        onEachFeature: Popups,
      }).addTo(myMap);

let legend = L.control({ position: 'bottomright' });

const depthRanges = ["10", "30", "50", "70", "80", "90+"];
const colors = ["#1a6b1f", "#74f77d", "#ddf255", "#f2c855", "#eb6817", "#d11717"];

legend.onAdd = function (map) {
  let div = L.DomUtil.create('div', 'info legend'),
      labels = [];

  for (let i = 0; i < depthRanges.length; i++) {
    let color = colors[i];
    labels.push(depthRanges[i]);
    div.innerHTML +=
      `<i style="background:${color}; width: 40px; height: 40px; display: inline-block;"></i> ${depthRanges[i]}<br>`;
  }
  return div;
};

legend.addTo(myMap);
}