let hexes = [];
let x, y;

let past_x, buffer;

function setup() {
	createCanvas($(window).width(), $(window).height());
	let random_subtract = floor(random(15, 200));

	for (let hex_y = 0; hex_y < $(window).height() / 20; hex_y++) {
		hexes[hex_y] = [];
		past_x = (hex_y % 2) == 0 ? -30 : -60;

		let rolling_x = 0;
		let adder = hex_y % 2 == 1 ? 15 : 0;
		for (let hex_x = 0; hex_x < $(window).width(); hex_x++) {
			hexes[hex_y][hex_x] = new Hexes((rolling_x + adder) - random_subtract, hex_y * 20);
			buffer = rolling_x;
			rolling_x += buffer - past_x == 60 ? 30 : 60;
			past_x += buffer - past_x == 60 ? 60 : 30;
		}
	}

	strokeWeight(3);
}

function draw() {
	for (let hex_y = 0; hex_y < $(window).height() / 20; hex_y++) {

		for (let hex_x = 0; hex_x < $(window).width(); hex_x++) {
			hexes[hex_y][hex_x].display();

			if (abs(hexes[hex_y][hex_x].x - x) < 50 && abs(hexes[hex_y][hex_x].y - y) < 50)
				stroke(20, 255, 236);
			if (hex_y % 2 == 1) {
				if (hex_x % 2 == 1) {
					if (hexes[hex_y][hex_x - 1]) line(hexes[hex_y][hex_x].x, hexes[hex_y][hex_x].y, hexes[hex_y][hex_x - 1].x, hexes[hex_y][hex_x - 1].y);
				}
				if (hexes[hex_y - 1] && hexes[hex_y - 1][hex_x]) line(hexes[hex_y][hex_x].x, hexes[hex_y][hex_x].y, hexes[hex_y - 1][hex_x].x, hexes[hex_y - 1][hex_x].y);
				if (hexes[hex_y + 1] && hexes[hex_y + 1][hex_x]) line(hexes[hex_y][hex_x].x, hexes[hex_y][hex_x].y, hexes[hex_y + 1][hex_x].x, hexes[hex_y + 1][hex_x].y);
			} else {
				if (hex_x % 2 == 1) {
					if (hexes[hex_y][hex_x + 1]) line(hexes[hex_y][hex_x].x, hexes[hex_y][hex_x].y, hexes[hex_y][hex_x + 1].x, hexes[hex_y][hex_x + 1].y);
					if (hexes[hex_y - 1] && hexes[hex_y - 1][hex_x]) line(hexes[hex_y][hex_x].x, hexes[hex_y][hex_x].y, hexes[hex_y - 1][hex_x].x, hexes[hex_y - 1][hex_x].y);
					if (hexes[hex_y + 1] && hexes[hex_y + 1][hex_x]) line(hexes[hex_y][hex_x].x, hexes[hex_y][hex_x].y, hexes[hex_y + 1][hex_x].x, hexes[hex_y + 1][hex_x].y);
				}
			}
		}
	}
}

$(document).mousemove((event) => {
	x = event.pageX;
	y = event.pageY;
});

function Hexes(hex_x, hex_y) {
	this.x = hex_x;
	this.y = hex_y;
	this.color = color(235, 88, 16);

	this.display = function() {
		stroke(this.color);
		point(this.x, this.y);
	}
}