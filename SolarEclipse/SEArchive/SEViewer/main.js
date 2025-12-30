import { getLocalCircumstances } from "./localcircumstances.js";

function main() {
    let maxlat = 0;
    let maxlon = 0;
    // Initialize map
    let map = L.map('map').setView([maxlat, maxlon], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    function plotPoint(ll, color, fillOpacity, iter) {
        let squareBounds = [
            [ll.lat - iter, ll.lon - iter],
            [ll.lat + iter, ll.lon + iter]
        ];

        // Add red semi-transparent square
        L.rectangle(squareBounds, {
            stroke: false,
            fillColor: color,
            fillOpacity: fillOpacity
        }).addTo(map);
    }

    const urlParams = new URLSearchParams(window.location.search);
    let iterationsmap = parseFloat(urlParams.get('iter'));
    if (!Number.isFinite(iterationsmap)) {
        iterationsmap = 1;
    }

    for (let lat = -90; lat < 90; lat += iterationsmap) {
        for (let lon = -180; lon < 180; lon += iterationsmap) {
            const c = getLocalCircumstances(lat, -lon, 0);

            if (c.h < -.5) {
                //plotPoint({ lat: lat, lon: lon }, "rgb(0,0,0)", "rgb(0,0,0)", 2, 0, iterationsmap);
            } else if (c.m < c.elements.L2p || c.m < -c.elements.L2p) {
                //in annular or total path
                if (c.elements.L2p < 0) {
                    plotPoint({ lat: lat, lon: lon }, "rgb(0,0,255)", 0.08, iterationsmap);
                } else {
                    plotPoint({ lat: lat, lon: lon }, "rgb(255,0,0)", 0.08, iterationsmap);
                }
            } else if (c.mag > 0) {
                plotPoint({ lat: lat, lon: lon }, "rgb(100,100,100)", 0.08, iterationsmap);
            } else {
                //plotPoint({ lat: lat, lon: lon }, "rgb(0,0,0)", "rgb(0,0,0)", 2, 0, iterationsmap);
            }

            //return;
        }
    }
    // Create draggable marker
    let marker = L.marker([maxlat, maxlon], {
        draggable: true
    }).addTo(map);

    // Coordinate display element
    let coordsDiv = document.getElementById('coords');

    function decimalToHMS(t) {
        let hcomponentf = t;
        let hcomponent = Math.floor(hcomponentf);
        let mcomponentf = (hcomponentf - hcomponent) * 60;
        let mcomponent = Math.floor(mcomponentf);
        let scomponentf = (mcomponentf - mcomponent) * 60;
        let scomponent = Math.floor(scomponentf);
        let str = `${hcomponent}:${mcomponent}:${scomponent}`;
        return { str: str, hf: hcomponentf, h: hcomponent, mf: mcomponentf, m: mcomponent, sf: scomponentf, s: scomponent };
    }
    // Function to update coordinates
    function updateCoords(latlng) {
        let c = getLocalCircumstances(latlng.lat, -latlng.lng, 0);
        let data = '';

        if (c.h < -.5) {
            data = 'Eclipse not seen is this location';
        } else if (c.m < c.elements.L2p || c.m < -c.elements.L2p) {
            //in annular or total path
            if (c.elements.L2p < 0) {
                data = `Total Eclipse on location. Eclipse Start: ${decimalToHMS(c.UTFirstContact).str}, Umbral Start: ${decimalToHMS(c.UTSecondContact).str}, Maximum Eclipse: ${decimalToHMS(c.UTMaximum).str}, Umbral End: ${decimalToHMS(c.UTThirdContact).str}, Eclipse End: ${decimalToHMS(c.UTLastContact).str}, Magnitude: ${c.mag.toFixed(6)}`;
            } else {
                data = `Annular Eclipse on location. Eclipse Start: ${decimalToHMS(c.UTFirstContact).str}, Umbral Start: ${decimalToHMS(c.UTSecondContact).str}, Maximum Eclipse: ${decimalToHMS(c.UTMaximum).str}, Umbral End: ${decimalToHMS(c.UTThirdContact).str}, Eclipse End: ${decimalToHMS(c.UTLastContact).str}, Magnitude: ${c.mag.toFixed(6)}`;
            }
        } else if (c.mag > 0) {
            data = `Eclipse Start: ${decimalToHMS(c.UTFirstContact).str}, Maximum Eclipse: ${decimalToHMS(c.UTMaximum).str}, Eclipse End: ${decimalToHMS(c.UTLastContact).str}, Magnitude: ${c.mag.toFixed(6)}`;
        } else {
            data = 'Eclipse not seen is this location';
        }

        coordsDiv.textContent =
            `Lat: ${latlng.lat}, Lng: ${latlng.lng}, ${data}`;
    }
    // Initial coordinates
    updateCoords(marker.getLatLng());

    // Update on marker drag
    marker.on('drag', function (e) {
        updateCoords(e.target.getLatLng());
    });
}

main();
