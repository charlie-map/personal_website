$(".menu-btn").addClass('open');
$(".menu-options").addClass('open');
$(".menu-options_color").addClass('color');

$(".open-greeting").addClass('play');

$(".rename").hide();
$(".delete").hide();
$(".add").hide();

setTimeout(function() {
	$(".open-greeting").removeClass('play');
}, 7000);

$(".menu-btn").click(() => {
	$(".unlock").removeClass('login');
});

$(".lock.box").hover(function() {
	$(".lock.loop").addClass('open');
	$(".lock.box").addClass('open');
}, function() {
	$(".lock.loop").removeClass('open');
	$(".lock.box").removeClass('open');
});

$(".lock.loop").hover(function() {
	$(".lock.loop").addClass('open');
}, function() {
	$(".lock.loop").removeClass('open');
});

$(".lock.box").click(function() {
	if ($(".unlock").hasClass('login')) $(".unlock").removeClass('login');
	else {
		$(".unlock").addClass('login');
		let labels = $(".unlock.layout").find('label');

		$("#name").empty();
		$("#password").empty();

		// for (let label_posn = 0; label_posn < labels.length; label_posn++) {

		// 	console.log($(labels[label_posn]).attr('id'));
		// 	$(labels[label_posn]).css("padding-top: " + label_posn * 40 + ";");
		// }
	}
});

let window_values = window.location.href.split("/");

$(".form__field").focus(function() {
	$("#wrong-password").removeClass('open');
	if (window_values[3] == "backend" && window_values[4].split("#")[0] == "overview") $("label[for='" + $(this).attr('name') + "']").addClass('open');
	else if (window_values[3] == "backend") $("label[for='" + this.id + "']").addClass('open');
});

$(".form__field").focusout(function() {
	let work_on = window_values[3] == "backend" && window_values[4].split("#")[0] == "overview" ?
		$(this).attr('name') : window_values[3] == "backend" ? this.id : null;
	if (!work_on) return;

	$("label[for='" + work_on + "']").removeClass('open');
	if ($(this).val()) {
		$("label[for='" + work_on + "']").empty();
	} else {
		$("label[for='" + work_on + "']").text(window_values[4].split("#")[0] == "overview" ? "new name" : this.id);
	}
});

$("#submit").click(function(event) {
	event.preventDefault();

	if ($("#name").val().length == 0) {
		$("#wrong-password").text("please fill out the username field");
		$("#wrong-password").addClass('open');
	} else if ($("#password").val().length == 0) {
		$("#wrong-password").text("please fill out the password field");
		$("#wrong-password").addClass('open');
	} else {
		$("#wrong-password").text("incorrect login details");

		$.ajax({
			type: "POST",
			url: "/backend/login",
			dataType: "html",
			data: {
				username: $("#name").val(),
				password: $("#password").val()
			},
			success: function(result) {
				if (result == "1") {
					window.location = "/backend/overview#question1";
				} else {
					if (result == "-1") $("#wrong-password").text("uh oh! that username doesn't exist");
					else if (result == "-2") $("#wrong-password").text("uh oh! incorrect password");
					else $("#wrong-password").text("there was an error in trying to login...");
					$("#wrong-password").addClass('open');
				}
			}
		});
	}
});

function hide_err() {
	$("#wrong-password").removeClass('open');
	$("#wrong-password-background").removeClass('open');
}

$("#submit-rename").click(function(event) {
	event.preventDefault();

	if ($("#renamed").val().length == 0) {
		$("#wrong-password").text("please fill out the selected field");
		$("#wrong-password").addClass('open');
		$("#wrong-password-background").addClass('open');
		setTimeout(hide_err, 4000);
	} else {
		let important_data_split = $(".important_data").text().split("_");
		let new_build_data = $($(".important_data").text()).parent().parent().children("p")[0].text();
		console.log(new_build_data);

		$.ajax({
			type: "POST",
			url: "/backend/rename",
			dataType: "html",
			data: {
				change_item: $(".important_data").text(),
				renamed_value: $("#renamed").val(),
			},
			success: function(result) {
				console.log(result);
				if (result == "1") { // renaming
					console.log("running for level", $(".important_data").text());
					let level = $(".important_data").text().split("_")[2];
					let check_buttons = $(".old-project-web." + $(".important_data").text().split("_")[4]).find('button');
					
					for (let find_button = 0; find_button < check_buttons.length; find_button++) {

						if ($(check_buttons[find_button]).attr('id').split("||")[3] == level) {

							$(check_buttons[find_button]).html($("#renamed").val());

							$("#renamed").val("");
							$("#renamed").blur();
							break;
						}
					}
				}
			}
		});
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
			$("#clear-old-page-space").css("height", path_depth * 100 + 100);
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
		$("#clear-old-page-space").css("height", path_depth * 100 + 100);

		connectAll(this);
	} else if (values[0] == "open-new-render") {
		// need to find the old open background and remove the 'open' class from it
		let all_buttons = $("#old-page").find('button').removeClass("current-background");

		// remove the old canvase
		$("#defaultCanvas0").remove();

		// change nothing on old projects, just open the background to a different game
		$(this).addClass('current-background');
		$("#current_script").remove();
		$('body').append('<script id="current_script" language="javascript" type="text/javascript" src="' + this.id.split("||")[4] + '"></script>');
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

$(".accordion-item").click(function() {
	if (this.id == "question1" || this.id == "question2") {
		$(".rename").hide();
		$(".delete").hide();
		$(".add").hide();
	}
});

$("ion-icon").hover(function() {
	let id_split = $(this).attr('id').split("_");
	$("#display-icon-descript" + id_split[0] + id_split[1]).text($(this).attr('title'));
}, function() { /*do nothing*/ });

$("ion-icon").click(function() {
	let id_split = $(this).attr('id').split("_");
	if ($(this).attr('title') == "rename") {
		$(".important_data").text(this.id);
		$(".rename").show();
	} else if ($(this).attr('title') == "delete") {
		$(".important_data").text(this.id);
	}
});