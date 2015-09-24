/* textbox CharCounter plugin

 
 */
(function($) {

$.fn.extend({
    charCounter: function(givenOptions) {
        return this.each(function() {
            var $this = $(this),
                options = $.extend({
                    maxChars: 80,
					maxCharsWarning: 70,
					msgFontSize: '10px',
					msgFontColor: '#000000',
					msgFontFamily: 'Helvetica',
					msgTextAlign: 'right',
					msgWarningColor: '#F00',
					msgAppendMethod: 'insertAfter',
					msgTop		   : '147px',
					msgZindex        : '9999',
                	msgRight			:'10px',
                	msgLeft				:'',
                	msgDisplay          :'inline',
                	msgPosition         :'absolute'					
                }, givenOptions);

			if(options.maxChars <= 0) return;
			
			// create counter element
			
			var counterMsg = $("<div class='counterMsg'>&nbsp;</div>");
			var counterMsgStyle = {
				'font-size' : options.msgFontSize,
				'font-family' : options.msgFontFamily,
				'color' : options.msgFontColor,
				'text-align' : options.msgTextAlign,
				'width' : $this.width(),
				'position': options.msgPosition,
				'display' : options.msgDisplay,
				'right'   : options.msgRight,
				'left'	  : options.msgLeft,
				'top'     : options.msgTop,
				'z-index' : options.msgZindex,
				'opacity' : 1
				};
			counterMsg.css(counterMsgStyle);
			// append counter element to DOM
			counterMsg[options.msgAppendMethod]($this);
			
			// bind events to this element
			$this
				.bind('keydown keyup keypress', doCount)
				.bind('focus paste', function(){setTimeout(doCount, 10);})
				.bind('blur', function(){counterMsg.stop().fadeTo( 'fast', 0);return false;});
			/*$this
			.bind('keydown keyup keypress', doCount);
			*/
			function doCount(){
				var val = $this.val(),
					length = val.length;
				
				if(length >= options.maxChars) {
					val = val.substring(0, options.maxChars); 				
				};
				
				if(length > options.maxChars){
					// keep scroll bar position
					var originalScrollTopPosition = $this.scrollTop();
					$this.val(val.substring(0, options.maxChars));
					$this.scrollTop(originalScrollTopPosition);
				};
				
				if(length >= options.maxCharsWarning){
					counterMsg.css({"color" : options.msgWarningColor});
				}else {
					counterMsg.css({"color" : options.msgFontColor});
				};
				
				counterMsg.html('Characters: ' + $this.val().length + "/" + options.maxChars);
                counterMsg.stop().fadeTo( 'fast', 1);
			};
        });
    }
});

})(jQuery);