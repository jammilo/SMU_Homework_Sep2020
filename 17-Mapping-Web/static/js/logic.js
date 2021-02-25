$(document).ready(function() {
    makeMap();
});

function makeMap() {
    // data
    // Store our API endpoint as queryUrl

    var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

    // Perform a GET request to the query URL
    $.ajax({
        type: "GET",
        url: queryUrl,
        success: function(data) {
            // make second call
            $.ajax({
                type: "GET",
                url: "/SMU_Homework_Sep2020/17-Mapping-Web/static/data/PB2002_boundaries.json",
                // url: "static/data/PB2002_boundaries.json",
                success: function(tectonic) {
                    //BUILD WITH BOTH DATASETS
                    buildMap(data, tectonic);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("Status: " + textStatus);
                    alert("Error: " + errorThrown);
                }
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
}

function buildMap(data, tectonic) {

    // Step 0: Create the Tile Layers
    // Add a tile layer
    var dark_mode = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    });

    var light_mode = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });
    var satellite_mode = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });


    // STEP 1: INIT MAP
    // Create a map object
    var myMap = L.map("mapid", {
        center: [15.5994, -28.6731],
        zoom: 5,
        layers: [light_mode, dark_mode, satellite_mode]
    });

    //STEP 2: Create Markers
    var earthquakes = [];
    var circle_list = [];
    data.features.forEach(function(earthquake) {
        var marker = L.geoJSON(earthquake, {
            onEachFeature: onEachFeature
        });
        earthquakes.push(marker);


        var circle = L.geoJSON(earthquake, {
            pointToLayer: function(feature, latlng) {
                var geojsonMarkerOptions = createMarkerOptions(feature);
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            onEachFeature: onEachFeature
        });
        circle_list.push(circle);

    });
    // create tectonic plates
    var tectonic_plates = L.geoJSON(tectonic, {
        color: "orange",
        weight: 3
    });


    var marker_group = L.layerGroup(earthquakes);
    var marker_group2 = L.layerGroup(circle_list);
    var tectonic_layer = L.layerGroup([tectonic_plates]); // note this has to be a list

    // STEP 3 : Create Layer Legend
    var baseMaps = {
        "Light Mode": light_mode,
        "Dark Mode": dark_mode,
        "Satellite Mode": satellite_mode
    };

    var overlayMaps = {
        "Markers": marker_group,
        "Circles": marker_group2,
        "Tectonic Plates": tectonic_layer
    };

    // Slap Layer Legend onto the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);


    // add layers pre-clicked to map
    tectonic_plates.addTo(myMap);
    marker_group2.addTo(myMap);




    // Step 4: CREATE THE LEGEND (of Zelda)

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        // create legend as raw html
        div.innerHTML += "<h4>Earthquake Depth</h4>";
        div.innerHTML += "<i style='background: #DAF7A6'></i><span>Less than 10 Miles</span><br>";
        div.innerHTML += "<i style='background: #FFC300'></i><span>10 - 30 Miles</span><br>";
        div.innerHTML += "<i style='background: #FF5733'></i><span>30 - 50 Miles</span><br>";
        div.innerHTML += "<i style='background: #C70039'></i><span>50 - 70 Miles</span><br>";
        div.innerHTML += "<i style='background: #900C3F'></i><span>70 - 90 Miles</span><br>";
        div.innerHTML += "<i style='background: #581845'></i><span>Greater than 90 Miles</span><br>";
        return div;
    };
    // Adding legend to the map
    legend.addTo(myMap);
}


function createMarkerOptions(feature) {
    console.log(feature);
    var depth = feature.geometry.coordinates[2];
    var depthColor = "";
    if (depth > 90) {
        depthColor = "#581845";
    } else if (depth > 70) {
        depthColor = "#900C3F";
    } else if (depth > 50) {
        depthColor = "#C70039";
    } else if (depth > 30) {
        depthColor = "#FF5733";
    } else if (depth > 10) {
        depthColor = "#FFC300";
    } else {
        depthColor = "#DAF7A6";
    }

    var geojsonMarkerOptions = {
        radius: (feature.properties.mag * 4) + 1,
        fillColor: depthColor,
        color: "#E3E3E3",
        weight: 1,
        // opacity: 1,
        fillOpacity: 0.5
    };
    return (geojsonMarkerOptions);

}
//called in the created circles
function onEachFeature(feature, layer) {

    if (feature.properties && feature.properties.place) {
        layer.bindPopup(feature.properties.place);
    }
}