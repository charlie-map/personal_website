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

$(".menu-button").click(function() {
	console.log("clicked", this.id);
	if (this.id == "projects") {
		$(".project-popup").toggle();
	}
	// $.ajax("/redirect", {

	// });
});

$(".project-menu").click(() => {
	$(".project-popup").hide();
});