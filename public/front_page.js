$(document).on({
	ajaxStart: function() {
		$("svg.loader").addClass('open');
	},
	ajaxStop: function() {
		$("svg.loader").removeClass('open');
	}
});


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

function connectElements(svg, path, startElem, endElem, svgContain) {
	var svgContainer = svgContain ? $(svgContain) : $("#svgContainer");

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
	let pathes = [...$("#svgContainer").find('path'),
		...$("#svgContainer2").find('path')
	];

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

function hide_about_me() {
	$("#home-base-background-info").empty();
	continue_run = false;
	$("#hobbies-select-connect").removeClass('open');
	$("#img-location-button-connect").removeClass('open');

	$(".about-me-close").addClass('close');
	$(".about-me-hobbies").hide();
	$(".hobby-station").addClass('remove');

	// hide all bits:
	hidePiano();
	$("#hobby-station-piano-open").removeClass('open');
}

function setupOldPage() {

	console.log("fixing?");
	let project_web_pages = $("#old-page").children('div');
	for (let web_search = 0; web_search < project_web_pages.length; web_search++) {

		if ($(project_web_pages[web_search]).hasClass('open')) {
			let correct_page = $(project_web_pages[web_search]).attr('class').split(" ")[1];
			console.log(correct_page);
			redraw_svg_elements($(".old-project-web." + correct_page), correct_page);
			break;
		}
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

	hide_about_me();
	$("#about-page").hide();
	hide_svg_lines();
	$("#old-page").hide();

	$("#svgContainer").css("z-index", 4);

	if (this.id == "about me") {
		$("#svgContainer").css("z-index", 0);

		$("#about-page").show();

		$("#home-base-nametag").removeClass('open');
		$("#home-base-nametag").removeClass('height');
		$("#home-base-nametag-base").remove();

		$(".img-homeland-location").removeClass('open');
		$("#img-location-div-connect").hide();
	}
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

/*
       _                 _                          _          __  __ 
  __ _| |__   ___  _   _| |_   _ __ ___   ___   ___| |_ _   _ / _|/ _|
 / _` | '_ \ / _ \| | | | __| | '_ ` _ \ / _ \ / __| __| | | | |_| |_ 
| (_| | |_) | (_) | |_| | |_  | | | | | |  __/ \__ \ |_| |_| |  _|  _|
 \__,_|_.__/ \___/ \__,_|\__| |_| |_| |_|\___| |___/\__|\__,_|_| |_|  
                                                                      
*/

function scroll_bottom_about_page() {
	$("#about-page").animate({
		scrollTop: 10000
	}, "slow");
}

function set_div_img_position() {
	let img_margin = ($(".img-homeland-location").outerWidth(true) - $(".img-homeland-location").outerWidth()) / 2;
	let img_width = $(".img-homeland-location").outerWidth() * 0.5;
	let img_height = $(".img-homeland-location").outerHeight() * 0.5;

	$("#home-base-background-info").css("max-width", img_width * 2 + 200);

	$("#img-location-div-connect").css("margin-left", img_margin + img_width + (IMG_LOCATION_MAP_WIDTH * (img_width / IMG_LOCATION_MAXIMUM_WIDTH)));
	$("#img-location-div-connect").css("margin-top", -1 * img_height - (IMG_LOCATION_MAP_HEIGHT * (img_height / IMG_LOCATION_MAXIMUM_HEIGHT)));

	// svg, path, startElem, endElem
	hide_svg_lines();
	connectElements($("#svgAboutMeCurrentLocation"), $("#pathOffCurrentLocation"), $("#img-location-button-connect"), $("#img-location-div-connect"), $("#svgContainer2"));
}

let type_background;
let continue_run = true;

function background_info_type_words() {
	if (type_background < HOME_BASE_BACKGROUND_INFO.length && continue_run) {
		document.getElementById("home-base-background-info").innerHTML += HOME_BASE_BACKGROUND_INFO.charAt(type_background);
		type_background++;
		setTimeout(background_info_type_words, 50);
	}

	if (type_background == HOME_BASE_BACKGROUND_INFO.length) {
		$(".about-me-hobbies").show();

		connectElements($("#svgAboutMeCurrentLocation"), $("#pathCurrentLocation-Hobbies"), $("#img-location-div-connect"), $("#hobbies-select-connect"), $("#svgContainer2"));
	}
	scroll_bottom_about_page();
	return;
}

function check_home_base_nametag() {
	if ($(window).width() < 800) {
		if (!$("#home-base-nametag").prev().hasClass('img-homeland-location')) {
			let nametag_contents = $("#home-base-nametag").html();

			$("#home-base-nametag").removeClass('open');

			$("#home-base-nametag-base").remove();
			$(`<div id='home-base-nametag-base' class='height open'>${nametag_contents}</div>`).insertAfter("#img-location-div-connect");
		}
	} else {
		let nametag_contents = $("#home-base-nametag").html();

		$("#home-base-nametag-base").remove();
		$("#home-base-nametag").addClass('open');
	}
	return;
}

function connect_about_me_elements() {
	let all_pathes = $("#svgAboutMeCurrentLocation").children("path");

	for (let check_pathes = 0; check_pathes < all_pathes.length; check_pathes++) {

		if ($(all_pathes[check_pathes]).attr('d') != "M0 0") {
			let element_connects = $(all_pathes[check_pathes]).attr('title').split("||");
			connectElements($("#svgAboutMeCurrentLocation"), $(all_pathes[check_pathes]), $(document.getElementById(element_connects[0])), $(document.getElementById(element_connects[1])), $("#svgContainer2"));
		}
	}
}

$("#about-page").scroll(function() {
	connect_about_me_elements();
});

let prev_hobby_img_width = 0;

$(window).resize(function() {
	if ($("#img-location-div-connect").is(":visible")) {
		check_home_base_nametag();

		set_div_img_position();
	}
	if ($(".about-me-hobbies").is(":visible")) {
		prev_hobby_img_width = $("#about-page").outerWidth() * 0.9;

		$(".img-hobby-station-biking").css('width', prev_hobby_img_width);

		connectElements($("#svgAboutMeCurrentLocation"), $("#pathThroughBiking-Hobbies"), $("#hobbies-select-connect"), $("#hobby-station-biking-redball"), $("#svgContainer2"));
		connectElements($("#svgAboutMeCurrentLocation"), $("#pathCurrentLocation-Hobbies"), $("#img-location-div-connect"), $("#hobbies-select-connect"), $("#svgContainer2"));
		connectElements($("#svgAboutMeCurrentLocation"), $("#pathThroughBiking-Piano"), $("#hobby-station-biking-redball"), $("#hobby-station-piano-open"), $("#svgContainer2"));
	}

	if (!$(".about-me-close").hasClass('close')) {

		connectElements($("#svgAboutMeCurrentLocation"), $("#pathToClose-see-more"), $("#see-more-about-me"), $("#about-me-close-redball"), $("#svgContainer2"));
		connectElements($("#svgAboutMeCurrentLocation"), $("#pathToOld-projects"), $("#see-more-about-me"), $("#attach-to-old-projs-about-me"), $("#svgContainer2"));
	}
});

$(".homeland-current-location").click(function() {
	if ($(".homeland-current-location").hasClass('open')) {
		$("#pathOffCurrentLocation").attr('d', "M0 0");
		$("#pathCurrentLocation-Hobbies").attr('d', "M0 0");

		$("#home-base-nametag-base").remove();

		$(".img-homeland-location").removeClass('open');
		$("#img-location-div-connect").hide();
		$("#home-base-nametag").removeClass('open');
		$("#home-base-nametag").removeClass('height');

		$("#hobbies-select-connect").removeClass('open');
		$(".about-me-hobbies").hide();

		$(".homeland-current-location").removeClass('open');

		continue_run = false;
		$("#home-base-background-info").empty();

		return;
	}
	// sets off the start of an animation

	$(".homeland-current-location").addClass('open');
	$("#home-base-nametag").addClass('height');

	$(".img-homeland-location").addClass('open');
	// first display the image

	// then display the animation on top of it
	setTimeout(function() {
		$("#img-location-div-connect").show();

		set_div_img_position();

		setTimeout(function() {
			type_background = 0;
			continue_run = true;
			background_info_type_words();

			check_home_base_nametag();
			scroll_bottom_about_page();
		}, 800);
	}, 1500);
});

/*
	This function will push the bike into frame, and attempt to make the bike
	climb up a portion of the mountain
*/
function biking_about_me_animation() {

	//$(".bicycle-container").css("left", "60%");

	$(".bicycle-container").show();

	connectElements($("#svgAboutMeCurrentLocation"), $("#pathThroughBiking-Hobbies"), $("#hobbies-select-connect"), $("#hobby-station-biking-redball"), $("#svgContainer2"));
	background_info_type_bike_words();
}

let type_biking = 0;
let continue_bike_type = true;

function background_info_type_bike_words() {
	if (type_biking < BIKE_OUTDOOR_INFO.length && continue_bike_type) {
		document.getElementById("hobby-station-biking-info").innerHTML += BIKE_OUTDOOR_INFO[type_biking];
		type_biking++;
		setTimeout(background_info_type_bike_words, 50);
	}

	if (type_biking == BIKE_OUTDOOR_INFO.length) {

		$("#hobby-station-piano-open").show();
		connectElements($("#svgAboutMeCurrentLocation"), $("#pathThroughBiking-Piano"), $("#hobby-station-biking-redball"), $("#hobby-station-piano-open"), $("#svgContainer2"));
	}

	scroll_bottom_about_page();
	return;
}

$("#hobbies-select-connect").click(function() {
	$("#hobby-station-piano-open").hide();

	$(".bicycle-container").hide();

	$("#see-more-about-me").removeClass('open');
	$("#see-more-about-me").hide();
	if ($("#hobbies-select-connect").hasClass('open')) {
		$("#hobbies-select-connect").removeClass('open');

		$(".img-hobby-station-biking").removeClass('move-up');
		$(".img-hobby-station-biking").css("margin-top", 0);

		$(".hobby-station-biking").removeClass('open');
		$(".hobby-station").addClass('remove');

		$(".bicycle-container").removeClass('animate');
		hide_svg_lines();
		connectElements($("#svgAboutMeCurrentLocation"), $("#pathOffCurrentLocation"), $("#img-location-button-connect"), $("#img-location-div-connect"), $("#svgContainer2"));
		connectElements($("#svgAboutMeCurrentLocation"), $("#pathCurrentLocation-Hobbies"), $("#img-location-div-connect"), $("#hobbies-select-connect"), $("#svgContainer2"));
		return;
	}

	$(".hobby-station").removeClass('remove');

	$("#hobbies-select-connect").addClass('open');

	$(".hobby-station-biking").addClass('open');

	$(".img-hobby-station-biking").css("margin-top", $(".img-hobby-station-biking").outerHeight());
	$(".img-hobby-station-biking").css('width', $("#about-page").outerWidth() - $("#about-page").outerWidth() * 0.08);

	$(".hide-img-hobby-station-biking").css("width", $(".img-hobby-station-biking").outerWidth());
	$(".hide-img-hobby-station-biking").css("height", $(".img-hobby-station-biking").outerHeight());

	$(".hide-img-hobby-station-biking").css("top", $(".img-hobby-station-biking").outerHeight());

	scroll_bottom_about_page();
	$(".img-hobby-station-biking").addClass('move-up');

	$(".hide-img-hobby-station-biking").css("width", 0);
	$(".hide-img-hobby-station-biking").css("height", 0);

	//$(".hobby-station-biking").css("height", $(".img-hobby-station-biking").outerHeight());

	prev_hobby_img_width = $(".img-hobby-station-biking").outerWidth();
	biking_about_me_animation();
});

function hidePiano() {

	$(".hobby-station-piano").addClass('close');
	$("#hobby-piano-story").hide();

	$(".about-me-close").addClass('close');
	$("#see-more-about-me").removeClass('open');
	$("#see-more-about-me").hide();
}

$("#hobby-station-piano-open").click(function() {

	if ($("#hobby-station-piano-open").hasClass('open')) {

		// hide all bits:
		hidePiano();
		$("#hobby-station-piano-open").removeClass('open');
	} else {
		$("#hobby-station-piano-open").addClass('open');
		$("#hobby-piano-story").show();

		$(".hobby-station-piano").removeClass('close');
		setTimeout(function() {
			scroll_bottom_about_page();

			background_piano();
		}, 1010);
	}
});

let piano_run_back = 0;
let continue_piano_run = true;

function background_piano() {

	if (piano_run_back < PIANO_BACKGROUND.length && continue_piano_run) {
		document.getElementById("hobby-piano-story").innerHTML += PIANO_BACKGROUND[piano_run_back];
		piano_run_back++;
		setTimeout(background_piano, 50);
	}

	if (piano_run_back == PIANO_BACKGROUND.length) {

		$("#see-more-about-me").show();
	}

	scroll_bottom_about_page();
	return;
}

$(".key").click(function() {
	$(this).addClass('compress');
	// play sound of key:

	let audio = new Audio(AUDIO_URL + this.id + ".mp3");
	audio.play();

	let remove = this.id;
	setTimeout(function(id) {
		$(`#${id}`).removeClass('compress');
	}, 1010, remove);
});

$("#see-more-about-me").click(function() {

	if ($("#see-more-about-me").hasClass('open')) {
		$("#pathToClose-see-more").attr('d', "M0 0");
		$("#pathToOld-projects").attr('d', "M0 0");

		$("#see-more-about-me").removeClass('open');

		$(".about-me-close").addClass('close');

	} else {
		$("#see-more-about-me").addClass('open');

		$(".about-me-close").removeClass('close');
		connectElements($("#svgAboutMeCurrentLocation"), $("#pathToClose-see-more"), $("#see-more-about-me"), $("#about-me-close-redball"), $("#svgContainer2"));
		connectElements($("#svgAboutMeCurrentLocation"), $("#pathToOld-projects"), $("#see-more-about-me"), $("#attach-to-old-projs-about-me"), $("#svgContainer2"));
	}
});

$("#attach-to-old-projs-about-me").click(function() {

	$("#about-page").hide();
	hide_about_me();

	hide_svg_lines();

	$("#old-page").show();

	$("#project-name").html("old projects");
	setupOldPage();
});

$("#github-cat").mouseenter(function() {
	$("#body").attr('fill', '#12e6d4');
}).mouseleave(function() {
	$("#body").attr('fill', '#959DA5');
});

$("#send-email").click(function() {

	$("#send-email-email").css("border", "none");
	if ($("#send-email").hasClass('open')) {

		$(".separater").css("margin-top", "10px");
		$("#send-email").removeClass('open');
		$("#send-email-fillout").removeClass('open');
	} else {

		$(".separater").css("margin-top", "140px");
		$("#send-email").addClass('open');
		$("#send-email-fillout").addClass('open');
	}
});

$("#shoot-off-email").click(function(event) {
	console.log("submitting");
	let name = $("#send-email-name").val();
	let email = $("#send-email-email").val();
	let note = $("#send-email-note").val();

	if (!name || !email) {
		console.log(false);
	}

	event.preventDefault();

	$.ajax({
		url: "/interest",
		type: "POST",
		data: {
			name,
			email,
			note
		},
		success: function(dat) {
			console.log(dat);

			if (dat == "complete") {
				$(".separater").css("margin-top", "10px");
				$("#send-email").removeClass('open');
				$("#send-email-fillout").removeClass('open');
			} else {

				$("#send-email-email").val(dat);
				$("#send-email-email").css("border", "solid 1px #d44f0e");
			}
		}
	});
});

$("#send-email-email").focus(function() {
	$("#send-email-email").css("border", "none");
}).focusout(function() {
	$("#send-email-email").css("border", "none");
});