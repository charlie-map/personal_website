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
	if ($(this).hasClass('open')) {
		$(this).removeClass('open');
		$(this).parent().find('div').removeClass('open');
		return;
	}

	// make sure all pathes are closed on sibling divs
	$(this).parent().siblings().removeClass('open');
	$(this).parent().siblings().children('button').removeClass('open');
	$(this).parent().siblings().children('div').removeClass('open');
	// first go through this level and make sure every other div is closed
	let values = this.id.split("||");

	if (values[0] == "open-child") {

		// add the 'open' class so css can correctly draw everything
		$(this).addClass('open');
		$(this).parent().children('div').addClass('open');
		$(this).parent().children('div').css(width: $("#old-page").width());
	}
});