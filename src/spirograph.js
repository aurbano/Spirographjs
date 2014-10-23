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

	// Setup pixi
	// create an new instance of a pixi stage
	var stage = new PIXI.Stage(spiro.settings.bgColor),
		renderer = PIXI.autoDetectRenderer(spiro.settings.container.width(), spiro.settings.container.height(), null, false, true),
		blurFilter = new PIXI.BlurFilter();

	blurFilter.blur = 0;

	//stage.cacheAsBitmap = true;

	spiro.circles = [];

	// Set up the circles' data
	setup();

	// add the renderer view element to the DOM
	spiro.settings.container.append(renderer.view);

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
			var graphics = new PIXI.Graphics();
			graphics.blendMode = PIXI.blendModes[spiro.settings.blendMode];
			stage.addChild(graphics);

			circles.push({
				rad: Math.floor(Math.random() * spiro.settings.maxRad) + spiro.settings.minRad,
				pos: 0,
				center: {
					x: x,
					y: y
				},
				increment: 2 * Math.PI / ((Math.random() * spiro.settings.maxIncrements + spiro.settings.maxIncrements) * (i + 1)),
				graphics: graphics
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
			drawCircle(i, 0);
		}



		renderer.render(stage);

		//stage.updateCache();

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
	function drawCircle(index, iteration) {

		var circle = spiro.circles[index][iteration];

		//circle.graphics.clear();

		// Calculate end coordinates
		var coords = {
			x: circle.rad * Number((Math.cos(circle.pos)).toFixed(10)),
			y: circle.rad * Number((Math.sin(circle.pos)).toFixed(10))
		};

		if (!isFinite(coords.x)) coords.x = 0;
		if (!isFinite(coords.y)) coords.y = 0;

		circle.graphics.lineStyle(1, 0xffffff, 0.4);
		circle.graphics.beginFill(0xffffff, 0.7);

		coords.x += circle.center.x;
		coords.y += circle.center.y;

		circle.graphics.moveTo(circle.center.x, circle.center.y);
		circle.graphics.lineTo(coords.x, coords.y);

		circle.graphics.drawCircle(coords.x, coords.y, 2);

		circle.pos += circle.increment;

		iteration++;

		if (iteration > spiro.circles[index].length - 1) {
			return;
		}

		circle = spiro.circles[index][iteration];
		circle.center = coords;

		drawCircle(index, iteration);
	}

	return spiro;
};