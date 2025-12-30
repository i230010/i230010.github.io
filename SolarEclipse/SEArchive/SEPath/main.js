import { getLocalCircumstances, getElements } from "./localcircumstances.js";

const rad = Math.PI / 180;

function project(ll) {
    const x = (ll.lon + Math.PI) / (Math.PI * 2) * w;
    const y = h - (ll.lat + Math.PI / 2) / Math.PI * h;

    return { x: x, y: y };
}

function plotPoint(ll, color) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;

    const xy = project({ lat: ll.lat * Math.PI / 180, lon: ll.lon * Math.PI / 180 });
    ctx.beginPath();
    ctx.fillRect(xy.x - 3, xy.y - 3, 6, 6);

    ctx.fill();
}

function drawAll() {

    const urlParams = new URLSearchParams(window.location.search);
    let iterationsmap = parseFloat(urlParams.get('iter'));
    if (!Number.isFinite(iterationsmap)) {
        iterationsmap = 1;
    }

    for (let lat = -90; lat < 90; lat += iterationsmap) {
        for (let lon = -180; lon < 180; lon += iterationsmap) {
            const c = getLocalCircumstances(lat, -lon, 0);

            if (c.h < -.5) {
                plotPoint({ lat: lat, lon: lon }, "rgba(0,0,0,0)");
            } else if (c.m < c.elements.L2p || c.m < -c.elements.L2p) {
                //in annular or total path
                if (c.elements.L2p < 0) {
                    plotPoint({ lat: lat, lon: lon }, "rgba(0,0,255,.08)");  //Total
                } else {
                    plotPoint({ lat: lat, lon: lon }, "rgba(255,0,0,.08)");  //Annular
                }
            } else if (c.mag > 0) {
                plotPoint({ lat: lat, lon: lon }, "rgba(100,100,100,.08)");
            } else {
                plotPoint({ lat: lat, lon: lon }, "rgba(0,0,0,0)");
            }

            //return;
        }
    }

}

function drawGraphic() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);

    const e = getElements();

    //getLocalCircumstances(38 + 55/60 + 17/60/60, 77 +  3/60 + 56/60/60, 84);
    drawAll();
}

function imageload() {
    drawGraphic();
}

const canvas = document.getElementById('canvas');
const h = canvas.height;
const w = canvas.width;

const image = document.createElement("img");
image.addEventListener("load", imageload);
image.src = "2k_earth_daymap.jpg";