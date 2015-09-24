var dName = document.domain;
if ((dName.indexOf(".com") > -1) && (dName.indexOf(".") > -1)) {
	var temp = dName.split(".");
	dName = temp[temp.length - 2] + "." + temp[temp.length - 1];
}
//alert('base domain: ' + dName);
//document.domain= dName;


$(document).ready(function() {
	window.setTimeout('sbysInit();', 400);
	triggerResize();
});


function sbysInit() {
	$('.sideBySideToggle').each(function(){
		var theToggle= $(this);
		theToggle.css('height', theToggle.parents('.questionWrap').height());
		theToggle.click(function(){
			theToggle.parents('.questionWrap').find('.myAnswers').toggleClass('noScreen');
			theToggle.parents('.questionWrap').find('.rightAnswers').toggleClass('noScreen');
			
			theToggle.find('.sbs_button').each(function(){
				$(this).toggleClass('myResponses');
				$(this).toggleClass('correctResponses');
				if ($(this).hasClass('correctResponses')) triggerResize();
			});
			
			/*
			theToggle.toggleClass('myAnswersButtons');
			theToggle.toggleClass('rightAnswersButtons');
			if (theToggle.hasClass('rightAnswersButtons')) triggerResize();
			*/
		});
	});

	$('.sb_popup').each(function(){
		var theToggle= $(this);
		theToggle.css('height', theToggle.parents('.questionWrap').height());
	});

	try {
		$('.relatedLinksControl').relatedLinks({
			openClass:'openRelatedLinks',
			closedClass:'closedRelatedLinks',
			sublevelElement: 'dl',
			speed: 200,
			easing: 'swing'
		});
	} catch(err) {};
}

function sbysReInit() {
	$('#gradeContent').find('.sideBySideToggle').each(function(){
		$(this).css('height', $(this).parents('.questionWrap').height());
	});
	try {
		$('.sb_popup_ctrl').scrollFollow({offset:100});
	} catch (err) {};
}

/*
function osbysReInit() {
	$('#gradeContent').find('.sideBySideToggle').each(function(){
		$(this).css('height', $(this).parents('.questionWrap').height());
		$(this).css('display', '');
		$(this).mouseup(null);
		$(this).mousedown(function(){
			$(this).parents('.questionWrap').find('.myAnswers').toggleClass('noScreen');
			$(this).parents('.questionWrap').find('.rightAnswers').toggleClass('noScreen');
			$(this).toggleClass('myAnswersButtons');
			$(this).toggleClass('rightAnswersButtons');
			if ($(this).hasClass('rightAnswersButtons')) triggerResize();
		});
	});

	try {
		$('.relatedLinksControl').relatedLinks({
			openClass:'openRelatedLinks',
			closedClass:'closedRelatedLinks',
			sublevelElement: 'dl',
			speed: 200,
			easing: 'swing'
		});
	} catch(err) {};
}
*/

function triggerResize() {
	if (parent == window) return;
	try {
		if (parent.eztoResize) window.setTimeout('completeResize();', 500);
	} catch(err) {};
}

function completeResize() {
	try {
		parent.eztoResize();
		if (tb_position) tb_position();
	} catch(err) {};
}
