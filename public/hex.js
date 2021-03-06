function setup() {
	let HEX_SIZE = 40;
	createCanvas($(window).width(), $(window).height() - 42);

	let random_subtract = floor(random(-30, -10));
	let build_x, build_y

	// console.log(random_subtract);

	for (let x = 0; x < $(window).width() / HEX_SIZE + 50; x++) {
		hex[x] = [];
		for (let y = 0; y < $(window).height() / HEX_SIZE + 50; y++) {
			build_x = y % 2 == 0 ? x * HEX_SIZE + random_subtract : x * HEX_SIZE - (HEX_SIZE / 2) + random_subtract;
			build_y = y * HEX_SIZE + random_subtract;
			hex[x][y] = new OBJHexes(build_x, build_y, HEX_SIZE);
		}
	}

	background(0);
	fill(0);
	stroke(255);

	$(document).mousemove((event) => {
		hex[floor((event.pageX + 50) / HEX_SIZE)][floor(event.pageY / HEX_SIZE)].color = colors[3];
		hex[floor((event.pageX + 50) / HEX_SIZE)][floor(event.pageY / HEX_SIZE)].change = 80;
	});
}

function draw() {
	background(0);
	for (let x = 0; x < hex.length; x++) {
		for (let y = 0; y < hex[x].length; y++) {
			hex[x][y].display();
		}
	}
}

function OBJHexes(hex_x, hex_y, hex_size) {
	this.x = hex_x;
	this.y = hex_y;
	this.color = colors[0];
	this.change = 0;
	this.redo = 0;
	this.hex_size = hex_size; 

	this.display = function() {
		if (this.change != 0) {
			this.change--;
			this.color = color(red(this.color) - 5, green(this.color) - 5, blue(this.color) - 5);
			if (this.change == 0) this.redo = 1;
		} else if (this.redo == 1) { // [20, 255, 236] <-- build towards thi color
			if (red(this.color) == colors[1][0] + 60 && green(this.color) == colors[1][1] && blue(this.color) == colors[1][2])
				this.redo = 0;
			this.color = color(red(this.color) != colors[1][0] ? red(this.color) + 5 : red(this.color),
				green(this.color) != colors[1][0] ? green(this.color) + 5 : green(this.color),
				blue(this.color) != colors[1][0] ? blue(this.color) + 5 : blue(this.color));
		}
		stroke(this.color);

		let y_subtract = this.hex_size / 2 - 5;
		beginShape();
		vertex(this.x, this.y - 24.5);
		vertex(this.x + (this.hex_size / 2) - 0.5, this.y - y_subtract + 0.5);
		vertex(this.x + (this.hex_size / 2) - 0.5, this.y + y_subtract - 0.5);
		vertex(this.x, this.y + 24.5);
		vertex(this.x - (this.hex_size / 2), this.y + y_subtract - 0.5);
		vertex(this.x - (this.hex_size / 2), this.y - y_subtract + 0.5);
		endShape(CLOSE);
	}

	this.runDisplay = function() {
		this.color = colors[3];
		this.change = 80;
	}
}