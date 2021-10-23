let boy;

function setup() {
	createCanvas($(window).width(), $(window).height() - 42);
	noStroke();

	//image(boy, 0, 0);
	loadImage("https://overfload.nyc3.cdn.digitaloceanspaces.com/873e8be3-19a8-488a-bed1-24e02f139056", (image) => {
		boy = image;
	});
}

function draw() {
	if (boy) {
		boy.resize($(window).width(), $(window).height() - 42);
		for (let i = 0; i < 6; i++) pointillism();
	}
}

function pointillism() {
	// 1: pick a spot for our point (random X, random Y)
	let spotX = random($(window).width());
	let spotY = random($(window).height() - 42);
	// 2: pick a size for our point (random)
	let size = random(10);
	// 3: get color at this spot in the image
	let originalColor = boy.get(spotX, spotY);
	// 4: draw a circle with that color at this spot
	fill(originalColor);
	ellipse(spotX, spotY, size, size);
}