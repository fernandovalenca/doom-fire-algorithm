const firePixelsArray = [];
let fireWidth = 60;
let fireHeight = 40;
let debug = false;
let windDirection = 0;
const fireColorsPalette = [{ "r": 7, "g": 7, "b": 7 }, { "r": 31, "g": 7, "b": 7 }, { "r": 47, "g": 15, "b": 7 }, { "r": 71, "g": 15, "b": 7 }, { "r": 87, "g": 23, "b": 7 }, { "r": 103, "g": 31, "b": 7 }, { "r": 119, "g": 31, "b": 7 }, { "r": 143, "g": 39, "b": 7 }, { "r": 159, "g": 47, "b": 7 }, { "r": 175, "g": 63, "b": 7 }, { "r": 191, "g": 71, "b": 7 }, { "r": 199, "g": 71, "b": 7 }, { "r": 223, "g": 79, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 103, "b": 15 }, { "r": 207, "g": 111, "b": 15 }, { "r": 207, "g": 119, "b": 15 }, { "r": 207, "g": 127, "b": 15 }, { "r": 207, "g": 135, "b": 23 }, { "r": 199, "g": 135, "b": 23 }, { "r": 199, "g": 143, "b": 23 }, { "r": 199, "g": 151, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 175, "b": 47 }, { "r": 183, "g": 175, "b": 47 }, { "r": 183, "g": 183, "b": 47 }, { "r": 183, "g": 183, "b": 55 }, { "r": 207, "g": 207, "b": 111 }, { "r": 223, "g": 223, "b": 159 }, { "r": 239, "g": 239, "b": 199 }, { "r": 255, "g": 255, "b": 255 }];

function start() {
    createFireDataStructure();
    createFireSource();
    renderFire();

    setInterval(() => {
        calculateFirePropagation();
    }, 50);
};

function createFireDataStructure() {
    const numberOfPixels = fireHeight * fireWidth;

    for (let i = 0; i < numberOfPixels; i++) {
        firePixelsArray[i] = 0;
    };
};

function createFireSource() {
    for (let column = 0; column < fireWidth; column++) {
        const overflowPixelIndex = fireWidth * fireHeight;
        const pixelIndex = (overflowPixelIndex - fireWidth) + column;

        firePixelsArray[pixelIndex] = 36;
    };
};

function renderFire() {
    let html = '<table>';

    for (let row = 0; row < fireHeight; row++) {
        html += '<tr>';
        for (let column = 0; column < fireWidth; column++) {
            const pixelIndex = column + (fireWidth * row);
            const fireIntensity = firePixelsArray[pixelIndex]
            const color = fireColorsPalette[fireIntensity];
            const colorString = `${color.r},${color.g},${color.b}`

            if (debug === true) {
                html += `<td style="color: rgb(${colorString})">`;
                html += `<div class="pixel-index">${pixelIndex}</div>`
                html += fireIntensity;
                html += '</td>';
            } else {
                html += `<td class="pixel" style="background-color: rgb(${colorString})">`;
                html += `</td>`;
            };
        };
        html += '</tr>';
    };
    html += '</table>';

    document.querySelector('#fireCanvas').innerHTML = html;
};

function calculateFirePropagation() {
    for (let column = 0; column < fireWidth; column++) {
        for (let row = 0; row < fireHeight; row++) {
            const pixelIndex = column + (fireWidth * row);

            updateFireIntensityPerPixel(pixelIndex);
        };
    };
    renderFire();
};

function updateFireIntensityPerPixel(currentPixelIndex) {
    const belowPixelIndex = currentPixelIndex + fireWidth;

    if (belowPixelIndex >= fireWidth * fireHeight) {
        return
    };

    const decay = Math.floor(Math.random() * 3);
    const belowPixelFireIntensity = firePixelsArray[belowPixelIndex];
    const newFireIntensity = belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0;

    switch (windDirection) {
        case 0: firePixelsArray[currentPixelIndex - decay] = newFireIntensity;
            break;
        case 1: firePixelsArray[currentPixelIndex] = newFireIntensity;
            break;
        case 2: firePixelsArray[currentPixelIndex + decay] = newFireIntensity;
            break;
    };
};

function changeWindDirection(direction) {
    windDirection = direction;
};

function destroyFireSource() {
    for (let column = 0; column <= fireWidth; column++) {
        const overflowPixelIndex = fireWidth * fireHeight;
        const pixelIndex = (overflowPixelIndex - fireWidth) + column;

        firePixelsArray[pixelIndex] = 0;
    };
};

function decreaseFireSource() {
    for (let column = 0; column <= fireWidth; column++) {
        const overflowPixelIndex = fireWidth * fireHeight;
        const pixelIndex = (overflowPixelIndex - fireWidth) + column;
        const currentFireIntensity = firePixelsArray[pixelIndex];

        if (currentFireIntensity > 0) {
            const decay = Math.floor(Math.random() * 10);

            const newFireIntensity = currentFireIntensity - decay >= 0 ? currentFireIntensity - decay : 0;
            firePixelsArray[pixelIndex] = newFireIntensity;
        };
    };
};

function increaseFireSource() {
    for (let column = 0; column <= fireWidth; column++) {
        const overflowPixelIndex = fireWidth * fireHeight;
        const pixelIndex = (overflowPixelIndex - fireWidth) + column;
        const currentFireIntensity = firePixelsArray[pixelIndex];

        if (currentFireIntensity < 36) {
            const decay = Math.floor(Math.random() * 10);

            const newFireIntensity = currentFireIntensity + decay <= 36 ? currentFireIntensity + decay : 36;
            firePixelsArray[pixelIndex] = newFireIntensity;
        };
    };
};

function toggleDebugMode() {
    if (debug === false) {
        fireWidth = 30;
        fireHeight = 15;
        debug = true;
        createFireSource();
    } else {
        fireWidth = 60;
        fireHeight = 40;
        debug = false;
    };
};

start();