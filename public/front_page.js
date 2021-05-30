let menuOpen = false;

$(".project-popup").hide();

$(".menu-btn").click(() => {
	if (!menuOpen) {
		$(".menu-btn").addClass('open');
		$(".menu-options").addClass('open');
		$(".menu-options_color").addClass('color');
		menuOpen = !menuOpen;
	} else {
		$(".menu-btn").removeClass('open');
		$(".menu-options").removeClass('open');
		$(".menu-options_color").removeClass('color');
		$(".project-popup").hide();
		menuOpen = !menuOpen;
	}
});

$(window).resize(() => {
	setup();
});

$(".menu-button").click(function() {
	if ($("#project-name").html() != this.id) {

		$("#project-name").html(this.id);
		$(".project-popup").hide();
		console.log(this.id);
	} else {
		$("#project-popup").show();
	}

	$("#about-page").hide();
	$("#current-works-page").hide();
	$("#old-page").hide();

	if (this.id == "about me") $("#about-page").show();
	if (this.id == "current works") $("#current-works-page").show();
	if (this.id == "old projects") $("#old-page").show();

	$(".project-popup").toggle();
});

$(".project-menu").click(() => {
	$(".project-popup").hide();
});

$(".project-web-open-child").on('click', function() {
	// if this route is already open, close it
	let values = this.id.split("||");

	if ($(this).hasClass('open')) {
		//$("#path" + this.id.split("||")[2]).attr('d', 'M0 0');
		let children_object = $("#old-page").children('.' + values[1]).find('button');
		// loop through only ones that have a level the same or greater than the one we are currently on

		let build_children_id;

		for (let sub_proj = 0; sub_proj < children_object.length; sub_proj++) {
			build_children_id = $(children_object[sub_proj]).attr('id').split("||");
			if (build_children_id[3] > values[3])
				$("#path" + build_children_id[2]).attr('d', "M0 0");
		}

		$(this).removeClass('open');
		$(this).parent().find('div').removeClass('open');
		$(this).parent().find('button').removeClass('open');
		return;
	}

	// make sure all pathes are closed on sibling divs
	$(this).parent().siblings().removeClass('open');
	$(this).parent().siblings().children('button').removeClass('open');
	$(this).parent().siblings().children('div').removeClass('open');

	children_object = $("#svgContainer").children('svg');

	for (let sub_proj = 0; sub_proj < children_object.length; sub_proj++) {
		$(children_object[sub_proj]).css('left', $(window).width());
	}

	// first go through this level and make sure every other div is closed

	if (values[0] == "open-child") {

		// add the 'open' class so css can correctly draw everything
		$(this).addClass('open');
		$(this).parent().children('div').addClass('open');
		$(this).parent().children('div').css('width', $("#old-page").width());
		// then draw the lines between the parent and the children
		$("#svg" + this.id.split("||")[1]).css('left', '0px');
		connectAll(this);
	}
});

//helper functions, it turned out chrome doesn't support Math.sgn() 
function signum(x) {
	return (x < 0) ? -1 : 1;
}

function absolute(x) {
	return (x < 0) ? -x : x;
}

function drawPath(svg, path, startX, startY, endX, endY) {
	// get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)
	var stroke = parseFloat(path.attr("stroke-width"));
	// check if the svg is big enough to draw the path, if not, set height/width
	if (svg.attr("height") < endY) svg.attr("height", endY);
	if (svg.attr("width") < (startX + stroke)) svg.attr("width", (startX + stroke));
	if (svg.attr("width") < (endX + stroke)) svg.attr("width", (endX + stroke));

	var deltaX = (endX - startX) * 0.15;
	var deltaY = (endY - startY) * 0.15;
	// for further calculations which ever is the shortest distance
	var delta = deltaY < absolute(deltaX) ? deltaY : absolute(deltaX);

	// set sweep-flag (counter/clock-wise)
	// if start element is closer to the left edge,
	// draw the first arc counter-clockwise, and the second one clock-wise
	var arc1 = 0;
	var arc2 = 1;
	if (startX > endX) {
		arc1 = 1;
		arc2 = 0;
	}

	// draw tha pipe-like path
	// 1. move a bit down, 2. arch,  3. move a bit to the right, 4.arch, 5. move down to the end 
	path.attr("d", "M" + startX + " " + startY +
		" V" + (startY + delta) +
		" A" + delta + " " + delta + " 0 0 " + arc1 + " " + (startX + delta * signum(deltaX)) + " " + (startY + 2 * delta) +
		" H" + (endX - delta * signum(deltaX)) +
		" A" + delta + " " + delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3 * delta) +
		" V" + endY);
}

function connectElements(svg, path, startElem, endElem) {
	var svgContainer = $("#svgContainer");

	// if first element is lower than the second, swap!
	if (startElem.offset().top > endElem.offset().top) {
		var temp = startElem;
		startElem = endElem;
		endElem = temp;
	}

	// get (top, left) corner coordinates of the svg container   
	var svgTop = svgContainer.offset().top;
	var svgLeft = svgContainer.offset().left;

	// get (top, left) coordinates for the two elements
	var startCoord = startElem.offset();
	var endCoord = endElem.offset();

	// calculate path's start (x,y)  coords
	// we want the x coordinate to visually result in the element's mid point
	var startX = startCoord.left + 0.5 * startElem.outerWidth() - svgLeft; // x = left offset + 0.5*width - svg's left offset
	var startY = startCoord.top + startElem.outerHeight() - svgTop; // y = top offset + height - svg's top offset

	// calculate path's end (x,y) coords
	var endX = endCoord.left + 0.5 * endElem.outerWidth() - svgLeft;
	var endY = endCoord.top - svgTop;

	// call function for drawing the path
	drawPath(svg, path, startX, startY, endX, endY);

}



function connectAll(id) {
	let children_ids = [];
	let children_object = $(id).siblings().children('div').children('button');

	for (let sub_proj = 0; sub_proj < children_object.length; sub_proj++) {
		children_ids.push(children_object[sub_proj]);
	}

	let full_tree_id = $(id).attr('id').split("||")[1];
	let children_uuid;

	children_ids.forEach((connect_children) => {
		children_uuid = $(connect_children).attr('id').split("||")[2];
		connectElements($("#svg" + full_tree_id), $("#path" + children_uuid), $(connect_children), $(id));
	});
}