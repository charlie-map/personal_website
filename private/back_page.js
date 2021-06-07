$(".menu-btn").addClass('open');
$(".menu-options").addClass('open');
$(".menu-options_color").addClass('color');

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

$(".form__field").focus(function() {
	$("#wrong-password").removeClass('open');
	$("label[for='" + this.id + "']").addClass('open');
});

$(".form__field").focusout(function() {
	$("label[for='" + this.id + "']").removeClass('open');
	if ($(this).val()) {
		$("label[for='" + this.id + "']").empty();
	} else {
		$("label[for='" + this.id + "']").text(this.id);
	}
});

$("#submit").click(function(event) {
	event.preventDefault();

	console.log($("#name").val());
	if ($("#name").val().length == 0) {
		$("#wrong-password").text("please fill out the username field");
		$("#wrong-password").addClass('open');
	} else if ($("#password").val().length == 0) {
		$("#wrong-password").text("please fill out the password field");
		$("#wrong-password").addClass('open');
	} else {
		console.log("else");
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
					window.location = "/backend/overview";
				} else {
					if (result == "-1") $("#wrong-password").text("uh oh! that username doesn't exist");
					else if (result == "0") $("#wrong-password").text("uh oh! incorrect password");
					$("#wrong-password").addClass('open');
				}
			}
		});
	}
});