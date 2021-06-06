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

		for (let label_posn = 0; label_posn < labels.length; label_posn++) {
			let input_position = $("#" + $(labels[label_posn]).attr('id').substring(0, $(labels[label_posn]).attr('id').length - 1)).offset();
			console.log("got label of " + $(labels[label_posn]).attr('id').substring(0, $(labels[label_posn]).attr('id').length - 1), input_position);
			$(labels[label_posn]).css({ left: 0, top: input_position.top + 650 });
		}
	}
});

$(".form__field").focus(function() {
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

$("#login-form").click(function(event) {
	event.preventDefault();

	$.ajax({
		type: "POST",
		url: "/backend/login",
		dataType: "html",
		data: {
			username: $("#name").val(),
			password: $("#password").val()
		}
	});
});