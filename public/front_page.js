//helper functions, it turned out chrome doesn't support Math.sgn() 
function signum(x) {
	return (x < 0) ? -1 : 1;
}

function absolute(x) {
	return (x < 0) ? -x : x;
}

// pulled SVG code from: https://gist.github.com/alojzije/11127839
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

let menuOpen = false;

$(".project-popup").hide();

$("#menuSelectorOpen").click(function() {
	console.log("clicked");
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

function hide_svg_lines() {
	let pathes = $("#svgContainer").find('path');

	for (let delete_pathes = 0; delete_pathes < pathes.length; delete_pathes++) {

		$(pathes[delete_pathes]).attr('d', "M0 0");
	}
}

function redraw_svg_elements(main_web_obj, web_project_path) {
	// follow the path from top to bottom following the buttons with the class 'open'
	let children_object = $(main_web_obj).find('button');
	for (let find_button_path = 0; find_button_path < children_object.length; find_button_path++) {

		if ($(children_object[find_button_path]).hasClass('open') || $(children_object[find_button_path]).hasClass('current-background'))
			// grab children of the button and connect the elements

			connectAll(children_object[find_button_path]);
	}
}

$(".menu-button").click(function() {
	if ($("#project-name").html() != this.id) {

		$("#project-name").html(this.id);
		hide_svg_lines();
		$(".project-popup").hide();
	} else {
		$("#project-popup").show();
	}

	$("#about-page").hide();
	$("#current-works-page").hide();
	hide_svg_lines();
	$("#old-page").hide();

	if (this.id == "about me") $("#about-page").show();
	if (this.id == "current works") $("#current-works-page").show();
	if (this.id == "old projects") {
		// look at which one of the projects is open

		$("#old-page").show();
	}

	$(".project-popup").toggle();

	if (this.id == "old projects" && $(".project-popup").is(":visible")) {

		let project_web_pages = $("#old-page").children('div');
		for (let web_search = 0; web_search < project_web_pages.length; web_search++) {

			if ($(project_web_pages[web_search]).hasClass('open')) {
				let correct_page = $(project_web_pages[web_search]).attr('class').split(" ")[1];
				redraw_svg_elements($(".old-project-web." + correct_page), correct_page);
				break;
			}
		}
	}
});

$(".project-menu").click(() => {
	hide_svg_lines();
	$(".project-popup").hide();
});

$(".project-web-open-child").on('click', function() {
	// if this route is already open, close it
	let values = this.id.split("||");

	if (values[0] == "open-child") {
		$(".old-project-web").removeClass('open');

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

			let path_depth = $(".old-project-web." + values[1]).find(".children-project-web.open").length;
			$("#clear-old-page-space").css("height", path_depth == 0 ? 70 : path_depth * 140 + (path_depth * -10));
			return;
		}

		// make sure all pathes are closed on sibling divs
		$(this).parent().siblings().removeClass('open');
		$(this).parent().siblings().children('button').removeClass('open');
		$(this).parent().siblings().children('div').removeClass('open');

		children_object = $("#svgContainer").children('svg');
		let possible_pathes;

		for (let sub_proj = 0; sub_proj < children_object.length; sub_proj++) {

			let pathes = $(children_object[sub_proj]).find('path');
			if ($(children_object[sub_proj]).attr('id').substring(3) == values[1]) possible_pathes = pathes;
			for (let run_pathes_proj = 0; run_pathes_proj < pathes.length; run_pathes_proj++) {

				$(pathes[run_pathes_proj]).attr('d', "M0 0");
			}
		}

		// first go through this level and make sure every other div is closed

		// add the 'open' class so css can correctly draw everything
		$(this).addClass('open');
		$(this).parent().children('div').addClass('open');
		$(this).parent().children('div').css('width', $("#old-page").width());
		// then draw the lines between the parent and the children

		$(".old-project-web." + values[1]).addClass('open');
		redraw_svg_elements($(".old-project-web." + values[1]), values[1]);
		let path_depth = $(".old-project-web." + values[1]).find(".children-project-web.open").length;
		$("#clear-old-page-space").css("height", path_depth * 140 + (path_depth * -10));

		connectAll(this);
	} else if (values[0] == "open-new-render") {
		// need to find the old open background and remove the 'open' class from it
		let all_buttons = $("#old-page").find('button').removeClass("current-background");
		$(".p5-buttons").remove();

		// remove the old canvase
		$("#defaultCanvas0").remove();

		// change nothing on old projects, just open the background to a different game
		$(this).addClass('current-background');
		$("#current_script").remove();
		$('body').append(`<script id="current_script" language="javascript" type="text/javascript" src='${this.id.split("||")[4]}'></script>`);
		setup();
	}
});

function connectAll(id) {
	let children_ids = [];
	let children_object = $(id).siblings().children('div').children('button');

	for (let sub_proj = 0; sub_proj < children_object.length; sub_proj++) {
		children_ids.push(children_object[sub_proj]);
	}

	let full_tree_id = $(id).attr('id').split("||")[1];
	let children_uuid;

	children_ids.forEach((connect_children) => {
		// check the child for if they are an open-new-render child, and if they are the background
		children_uuid = $(connect_children).attr('id').split("||");
		if (children_uuid[0] == "open-new-render" && children_uuid[4] == $("#current_script").attr('src')) {
			$(connect_children).addClass('current-background');
		}

		connectElements($("#svg" + full_tree_id), $("#path" + children_uuid[2]), $(connect_children), $(id));
	});
}