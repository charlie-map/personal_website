$(".lock.box").hover(function () {
	console.log("hovered");
	$(".lock.loop").addClass('open');
}, function() {
	$(".lock.loop").removeClass('open');
});