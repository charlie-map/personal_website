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
	console.log("clicked", this.id);
	if (this.id == "projects") {
		$(".project-popup").toggle();
	} else {
		$.ajax({
			type: "GET",
			url: "/go-to-page/" + this.id,
			beforeSend: function() { // some loading animation
				
			}
		});
	}
});

$(".project-menu").click(() => {
	$(".project-popup").hide();
});