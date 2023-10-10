// Assigning the url to pull the geojson from
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Creating our map object
let myMap = L.map("map", {
    center: [39.7392,  -104.9903],
    zoom: 5,
  });


  // Using D3 to display the geojson data on the console
d3.json(url).then(function(data){
    console.log(data);
    Features(data); // This function will create our map markers, and legend
});

  // Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// The color of the marker depends on the depth of the earthquake. I've pulled the ranges directly from the map screenshot
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


// This is the function that is called in our console
function Features(quakeData) {

   

    // For our markers to appear as circles, we create those properties in this function
    function Circle(feature, latlng) {
        let MarkerOptions = {
          radius: markerSize(feature.properties.mag),       // Calling our marker size function
          fillColor: MagColor(feature.geometry.coordinates[2]), // Calling our choose color function
          color: "black",     // Border color of the circle
          weight: 1,          // Border weight
          opacity: 1,         // Border opacity
          fillOpacity: 1.0 
        };
        
        return L.circleMarker(latlng, MarkerOptions);
    }

     // Creating a function to add a pop up element to each marker
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
    // Using GeoJSON on Leaflet to use the given data to add markers and popups to our map object
    L.geoJSON(quakeData, {
        pointToLayer: Circle,
        onEachFeature: Popups,
      }).addTo(myMap);

   // Creating our legend object
let legend = L.control({ position: 'bottomright' });

// Assigning labels and colors manually to make them appear in our legend
const depthRanges = ["10", "30", "50", "70", "80", "90+"];
const colors = ["#1a6b1f", "#74f77d", "#ddf255", "#f2c855", "#eb6817", "#d11717"];

// Function to generate the legend HTML content
legend.onAdd = function (map) {
  let div = L.DomUtil.create('div', 'info legend'),
      labels = [];

  // Loop through depth ranges and generate labels
  for (let i = 0; i < depthRanges.length; i++) {
    let color = colors[i];
    labels.push(depthRanges[i]);
    div.innerHTML +=
      `<i style="background:${color}; width: 40px; height: 40px; display: inline-block;"></i> ${depthRanges[i]}<br>`;
  }
  return div;
};

// Add the legend to the map
legend.addTo(myMap);
}