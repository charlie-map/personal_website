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
		let new_data_name = $("#renamed").val();
		let new_build_data = $(`#display-icon-descript${important_data_split[0] + important_data_split[1]}`).parent().parent().children("p").text();

		$.ajax({
			type: "POST",
			url: "/backend/rename",
			dataType: "html",
			data: {
				previous_name: new_build_data,
				renamed_value: $("#renamed").val(),
				parent_id: important_data_split[3]
			},
			success: function(result) {
				if (result == "1") { // renaming
					let level = $(".important_data").text().split("_")[2];
					let check_buttons = $(".old-project-web." + $(".important_data").text().split("_")[4]).find('button');

					for (let find_button = 0; find_button < check_buttons.length; find_button++) {

						if ($(check_buttons[find_button]).attr('id').split("||")[3] == level) {

							$(check_buttons[find_button]).empty();
							let renamed_value = $("#renamed").val().replace(/ /g, '');
							let new_title = renamed_value + '_' + important_data_split[1] + '_' + important_data_split[2] + '_' + important_data_split[3] + '_' + important_data_split[4] + '_' + important_data_split[5];
							$(check_buttons[find_button]).append(
								`<p>${$("#renamed").val()}</p>` +
								`<div class='tooltip'>` +
								`<ion-icon id='${new_title}' title='delete' name='trash-outline'></ion-icon>` +
								`<ion-icon id='${new_title}' title='rename' name='clipboard-outline'></ion-icon>` +
								`<ion-icon id='${new_title}' title='add' name='add-circle-outline'></ion-icon>` +
								`<div id='display-icon-descript${renamed_value + important_data_split[1]}'></div>` +
								`</div>`
							);

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

function draw_routes(object, id) {
	// if this route is already open, close it
	let values = id.split("||");

	if (values[0] == "open-child") {
		$(".old-project-web").removeClass('open');

		if ($(object).hasClass('open')) {
			//$("#path" + object.id.split("||")[2]).attr('d', 'M0 0');
			let children_object = $("#old-page").children('.' + values[1]).find('button');
			// loop through only ones that have a level the same or greater than the one we are currently on

			let build_children_id;

			for (let sub_proj = 0; sub_proj < children_object.length; sub_proj++) {
				build_children_id = $(children_object[sub_proj]).attr('id').split("||");
				if (build_children_id[3] > values[3])
					$("#path" + build_children_id[2]).attr('d', "M0 0");
			}

			$(object).removeClass('open');
			$(object).parent().find('div').removeClass('open');
			$(object).parent().find('button').removeClass('open');

			let path_depth = $(".old-project-web." + values[1]).find(".children-project-web.open").length;
			$("#clear-old-page-space").css("height", path_depth * 100 + 100);
			return;
		}

		// make sure all pathes are closed on sibling divs
		$(object).parent().siblings().removeClass('open');
		$(object).parent().siblings().children('button').removeClass('open');
		$(object).parent().siblings().children('div').removeClass('open');

		children_object = $("#svgContainer").children('svg');
		let possible_pathes;

		for (let sub_proj = 0; sub_proj < children_object.length; sub_proj++) {

			let pathes = $(children_object[sub_proj]).find('path');
			if ($(children_object[sub_proj]).attr('id').substring(3) == values[1]) possible_pathes = pathes;
			for (let run_pathes_proj = 0; run_pathes_proj < pathes.length; run_pathes_proj++) {

				$(pathes[run_pathes_proj]).attr('d', "M0 0");
			}
		}

		// first go through object level and make sure every other div is closed

		// add the 'open' class so css can correctly draw everything
		$(object).addClass('open');
		$(object).parent().children('div').addClass('open');
		$(object).parent().children('div').css('width', $("#old-page").width());
		// then draw the lines between the parent and the children

		$(".old-project-web." + values[1]).addClass('open');
		redraw_svg_elements($(".old-project-web." + values[1]), values[1]);

		let path_depth = $(".old-project-web." + values[1]).find(".children-project-web.open").length;
		$("#clear-old-page-space").css("height", path_depth * 100 + 100);

		connectAll(object);
	} else if (values[0] == "open-new-render") {
		// need to find the old open background and remove the 'open' class from it
		let all_buttons = $("#old-page").find('button').removeClass("current-background");

		// remove the old canvase
		$("#defaultCanvas0").remove();

		// change nothing on old projects, just open the background to a different game
		$(object).addClass('current-background');
		$("#current_script").remove();
		$('body').append('<script id="current_script" language="javascript" type="text/javascript" src="' + this.id.split("||")[4] + '"></script>');
		setup();
	}
}

$(".project-web-open-child").on('click', function() {
	draw_routes(this, this.id);
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

$(".delete").on('click', '.delete-button', function() {
	let item_id = $(`#display-icon-descript${$(".important_data").text().split("_")[0] + $(".important_data").text().split("_")[1]}`).parent().siblings("p").attr('id');
	let parent_id = $(`#display-icon-descript${$(".important_data").text().split("_")[0] + $(".important_data").text().split("_")[1]}`).parent().parent().parent().parent().siblings("button").children("p").attr('id');

	let display_name = $(".important_data").text();
	let named_item = $(this).text();

	console.log(item_id);
	$.ajax({
		url: "/backend/delete",
		type: "POST",
		data: {
			id: item_id,
			delete_flow: $(this).attr('id') == "delete_recursive" ? 0 : $(this).attr('id') == "delete_merge" ? $(this).text() : null,
			parent_id: parent_id ? parent_id : 0
		},
		success: function(value) {
			// make sure to grab the children first
			let build_html = "";
			if (parseInt(value, 10) == 1) {

				let children_html = $("#" + display_name).parent().parent().siblings(".children-project-web");

				for (let add_html = 0; add_html < children_html.length; add_html++) {
					build_html += $(children_html[add_html]).html();
				}
			}
			$("#" + display_name).parent().parent().parent().remove();



			let all_tags = $("#old-page").find("p");
			let button_object;

			for (let find_item = 0; find_item < all_tags.length; find_item++) {

				if ($(all_tags[find_item]).text() == named_item) {
					button_object = $(all_tags[find_item]).parent();
					break;
				}
			}

			console.log(build_html);
			if (build_html) {
				console.log($(button_object).parent().children('.children-project-web').length);
				if (!$(button_object).parent().children('.children-project-web').length)
					$(button_object).parent().append(`<div class='children-project-web'></div>`);

				$(button_object).parent().children('.children-project-web').append(build_html);
			}

			if (button_object) draw_routes(button_object, $(button_object).attr('id'));
			else draw_routes($($("#old-page").children(".old-project-web")[0]), $($("#old-page").children(".old-project-web")[0]).attr('id'));
		}
	})
});

$("ion-icon").hover(function() {
	let id_split = $(this).attr('id').split("_");
	$("#display-icon-descript" + id_split[0] + id_split[1]).text($(this).attr('title'));
}, function() { /*do nothing*/ });

let branch_title = [];

$("ion-icon").click(function() {
	let id_split = $(this).attr('id').split("_");
	if ($(this).attr('title') == "rename") {
		$(".important_data").text(this.id);
		$(".rename").show();
	} else if ($(this).attr('title') == "delete") {
		$(".important_data").text(this.id);

		// grab each sibling branch - title
		$(".dropdown-content").empty();
		let branches = $(`#display-icon-descript${this.id.split("_")[0] + this.id.split("_")[1]}`).parent().parent().parent().siblings(".old-project-web");

		for (let get_titles = 0; get_titles < branches.length; get_titles++) {
			$(".dropdown-content").append(`<a id='delete_merge' class='delete-button'>${$(branches[get_titles]).children("button").children("p").text()}</a>`)
			branch_title.push($(branches[get_titles]).children("button").children("p").text());
		}
		$(".delete").show();
	}
});