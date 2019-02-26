const canvasHeight = 400;
const canvasWidth = 1.1 * canvasHeight;
var middle = {
	x: -0.5,
	y: 0
};
var zoom = canvasHeight / 3;
const checkingLimit = 720;

var canvas = document.getElementById('canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;

//zooming functunality 
canvas.addEventListener('click', function (event) {
	var xMin = middle.x - ((canvasWidth / 2) / zoom);
	var yMin = middle.y - ((canvasHeight / 2) / zoom);
	var pxDelta = (1/zoom);

	middle = {
		x: xMin + event.x * pxDelta,
		y: yMin + event.y * pxDelta
	}
	zoom *= 4

	DrawSet();
}, false);

var ctx = canvas.getContext('2d');

//loops over everypixel in the canvas and colors it according to the mandelbrot set
function DrawSet() {
	var xMin = middle.x - ((canvasWidth / 2) / zoom);
	var xMax = middle.x + ((canvasWidth / 2) / zoom);
	var yMin = middle.y - ((canvasHeight / 2) / zoom);
	var yMax = middle.y + ((canvasHeight / 2) / zoom);

	var pxDelta = (1/zoom);
	for (let cvH = 0; cvH < canvasHeight; cvH++) {
		for (let cvW = 0; cvW < canvasWidth; cvW++) {
			var currentCoord = {
				x: (xMin + pxDelta * cvW),
				y: (yMin + pxDelta * cvH)
			}
			if (MandelbrotOperation(currentCoord) == checkingLimit) {
				ctx.fillStyle = 'hsl(' + MandelbrotOperation(currentCoord) + ',100%,0%)'; //draw pixel outside set
			} else {
				ctx.fillStyle = 'hsl(' + MandelbrotOperation(currentCoord) + ',100%,50%)'; //draw pixel inside set
			}

			ctx.fillRect(cvW, cvH, 1, 1) //draw said pixel
		}
	}
}

// (x,y) => when that coordinate diverges (or checkingLimit if it doesnt within that limit)
function MandelbrotOperation(coord) {
	var originalCoord = coord;
	coord = {
		x: 0,
		y: 0
	}
	for (let limit = 0; limit < checkingLimit; limit++) {
		var newX = (coord.x) * (coord.x) - (coord.y) * (coord.y) + originalCoord.x;
		var newY = 2 * (coord.x) * (coord.y) + originalCoord.y;
		coord = {
			x: newX,
			y: newY
		};
		if (!isBound(coord)) {
			return limit
		}
	}
	return checkingLimit
}

function isBound(num) {
	var dist = Math.sqrt(num.x * num.x + num.y * num.y);
	return (dist < 2);
}

DrawSet();
