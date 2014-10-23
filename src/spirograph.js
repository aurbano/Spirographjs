/**
 * Spirographjs - JavaScript library to generate Spirographs
 * @author Alejandro U. Alvarez (http://urbanoalvarez.es)
 *
 *  -- Powered by Pixi.js for the rendering --
 *  	     http://www.pixijs.com/
 *
 * @param {Object} options Associative array of settings
 */
var Spirograph = function (options) {
	var spiro = {};

	spiro.settings = {
		container: $('#spiro'),
		blendMode: 'ADD',
		bgColor: 0x000000,
		circles: 3,
		active: false,
		minRad: 20,
		maxRad: 200,
		centerX: null,
		centerY: null,
		centerRad: null,
		minIncrements: 30,
		maxIncrements: 150
	};

	spiro.settings = $.extend(spiro.settings, options);

	// Setup canvas
	var canvas = $('<canvas></canvas>').appendTo(spiro.settings.container),
		ctx = canvas.get(0).getContext('2d');

	canvas.attr('width', spiro.settings.container.width());
	canvas.attr('height', spiro.settings.container.height());

	spiro.circles = [];

	// Set up the circles' data
	setup();

	/**
	 * Start the animation
	 */
	spiro.start = function () {
		spiro.settings.active = true;

		console.log("Spirograph started");

		requestAnimFrame(animate);
	};

	/**
	 * Stop the animation
	 */
	spiro.stop = function () {
		spiro.settings.active = false;

		console.log("Spirograph stopped");
	}

	spiro.add = function (x, y) {
		spiro.circles.push(setup(x, y));
	};

	/**
	 * Return a new set of circle data
	 */
	function setup(x, y) {
		var circles = [];

		for (var i = 0; i < spiro.settings.circles; i++) {
			circles.push({
				rad: Math.floor(Math.random() * spiro.settings.maxRad) + spiro.settings.minRad,
				pos: 0,
				center: {
					x: x,
					y: y
				},
				increment: 2 * Math.PI / ((Math.random() * spiro.settings.maxIncrements + spiro.settings.maxIncrements) * (i + 1))
			});
		}

		return circles;
	}

	var count = 0;

	/**
	 * Update the frame
	 */
	function animate() {

		// Draw the main circle
		for (var i = 0; i < spiro.circles.length; i++) {
			drawSpiro(i, 0);
		}

		count++;

		//if (count > 100) return;

		if (spiro.settings.active)
			requestAnimFrame(animate);
	}

	/**
	 * Draw current circle part, updates its position
	 * and returns the coordinates for the next circle on the spirograph.
	 *
	 * @param  {Object} circle 	 Circle object, must contain center{x,y}, graphics (Pixijs Graphics), rad (int) and pos (Position along the circumference in radians).
	 */
	function drawSpiro(index, iteration) {

		var circle = spiro.circles[index][iteration];

		// Calculate end coordinates
		var coords = {
			x: circle.rad * Number((Math.cos(circle.pos)).toFixed(10)),
			y: circle.rad * Number((Math.sin(circle.pos)).toFixed(10))
		};

		if (!isFinite(coords.x)) coords.x = 0;
		if (!isFinite(coords.y)) coords.y = 0;

		ctx.strokeStyle = 'rgba(255,255,255,0.01)';
		ctx.fillStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 1;

		coords.x += circle.center.x;
		coords.y += circle.center.y;

		ctx.beginPath();
		ctx.moveTo(circle.center.x, circle.center.y);
		ctx.lineTo(coords.x, coords.y);
		ctx.closePath();
		ctx.stroke();

		drawCircle(coords.x, coords.y, 2);

		circle.pos += circle.increment;

		iteration++;

		if (iteration > spiro.circles[index].length - 1) {
			return;
		}

		circle = spiro.circles[index][iteration];
		circle.center = coords;

		drawSpiro(index, iteration);
	}

	/**
	 * Draw a circle
	 * @param  {int} 	x     Center x coordinate
	 * @param  {int} 	y     Center y coordinate
	 * @param  {int} 	rad   Radius
	 * @param  {String} color HTML color
	 * @return {void}
	 */
	function drawCircle(x, y, rad) {
		ctx.beginPath();
		ctx.arc(x, y, rad, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();

		console.log("Drawing circle at: ", x, y, rad);
	}

	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function () {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	return spiro;
};