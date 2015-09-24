if (! ("console" in window) || !("firebug" in console)) {
	var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", 
	             "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
	window.console = {};
	for (var i = 0; i <names.length; ++i) window.console[names[i]] = function () {};
} //uncomment while deploying to Production which will suppress all the console logs
(function($){
	CDAuth = { 
		init : function(options) { 
			console.log("@CDAuth");
			//Merge Shell default parametrs and user supplied parameters
			try{
				window.CD = $.extend(window.CD, options);
				window.CD.html_elm = $(this);
				var stageWidth = parseInt(window.CD.width < 800? 800 : window.CD.width);
				var stageHeight = parseInt(window.CD.height < 600 ? 600 : window.CD.height);
				resizeMe((stageHeight+100), (stageWidth+300));
			    
				new selectExerciseType(window.CD.html_elm);
			}catch (err){
				console.error("Error in CDAuth::"+err.message);
			}
		}	
	};	
})(jQuery); 

$.fn.ClickDragAuthoring = function(method) {
	if (window.CDAuth[method] ) {
		return window.CDAuth[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if (typeof method === 'object' || ! method ) {
		return window.CDAuth.init.apply(this, arguments);
	} else {
		$.error('Method ' +  method + ' does not exist on NQI Shell');
	}
};