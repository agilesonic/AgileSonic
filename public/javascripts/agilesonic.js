$(function() {
	show_div(0);
	$('#features #tabs li').click(function() {
		$('#features #tabs li').removeClass('active');
		$(this).addClass('active');
		show_div($(this).index());
	});
	$('#features #tabs li').hover(function() {
		if( !$(this).hasClass('active') )
			$(this).addClass('hover');
	}, function() {
		$(this).removeClass('hover');
	});
});

function show_div(index) {
	$('#content_holder > article').each(function(i) {
		if( index != i ) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
	$('#slider').animate({left: $('#features #tabs li.active').offset().left}, 500);
}

