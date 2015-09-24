// Nullify console functions; if firebug doesn't exist (IE et al)
if (! ("console" in window) || !("firebug" in console)) {
	var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", 
	             "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
	window.console = {};
	for (var i = 0; i <names.length; ++i) window.console[names[i]] = function () {};
}
;(function ($) {

	var _global = this; // Reference to the host environment
	
	var ClickDragApp = function () {};
	ClickDragApp.prototype = {
		global: _global, // Reference to global object
		baseUrl: null,	// Holds the path from where the ClickDragShell.js is loaded all other modules are loaded relative to this path.
		config: {		// Kernel config object
			env: "dev"
		},
		onViewLoad: $.noop, // Callback called immediately after a new View is loaded
		onViewUnload: $.noop, // Callback while replacing an existing View with a new View
		
		/*
		 * Starter function; initialize the app
		 */
		init: function () {
			//get the base url from the source of the script tag;
			//all module files are loaded, relative to this URL
			this.getBaseUrl();
			
			if(this.is_mobile() == true){
				//this.include('lib/jquery-ui-widget-mouse.min.js');				
				this.include('lib/DragDrop_library.js');
				this.include('lib/jquery_ubaplayer.js');
				this.include('lib/swfobject.js');
				this.include('lib/vectordraw_lib.js');
				this.include('lib/jquery.modalbox-1.0.9.js');
				this.include('lib/jquery.client.js');
				this.include('lib/jquery.inputselection.js');
				this.include('lib/palette.js');
				this.include('lib/split.js');
				this.include('lib/label_connector_library.js');
				//this.include('cdstd-min.js');	
				this.include('clickdragstudent/js/common/data_validator.js');
				this.include('clickdragstudent/js/common/olddata_validator.js');
				this.include('clickdragstudent/js/common/newauthData_validator.js');
				this.include('clickdragstudent/js/common/clickdrag_model.js');
				this.include('clickdragstudent/js/component/label_component.js');
				this.include('clickdragstudent/js/component/cls_label_component.js');
				this.include('clickdragstudent/js/component/prg_label_component.js');
				this.include('clickdragstudent/js/component/FIB_component.js');
				this.include('clickdragstudent/js/component/frame_component.js');
				this.include('clickdragstudent/js/component/hint_component.js');
				this.include('clickdragstudent/js/component/zoom_hint_component.js');
				this.include('clickdragstudent/js/component/zoom_component.js');
				this.include('clickdragstudent/js/common/clickdrag_view.js');
				this.include('clickdragstudent/js/module/sletemplate.js');
				this.include('clickdragstudent/js/module/coitemplate.js');
				this.include('clickdragstudent/js/module/seqtemplate.js');
				this.include('clickdragstudent/js/module/clstemplate.js');
				this.include('clickdragstudent/js/module/prgtemplate.js');
				this.include('clickdragstudent/js/common/ClickDragShell.js');
			}else{
				this.include('lib/vectordraw_lib.js');
				//this.include('cdstd-library-min.js');
				this.include('clickdragstudent/js/lib/DragDrop_library.js');
				this.include('clickdragstudent/js/lib/label_connector_library.js');
				this.include('clickdragstudent/js/lib/jquery_ubaplayer.js');
				this.include('clickdragstudent/js/lib/swfobject.js');
				this.include('clickdragstudent/js/lib/jquery.modalbox-1.0.9.js');
				this.include('clickdragstudent/js/lib/jquery.client.js');
				this.include('clickdragstudent/js/lib/jquery.inputselection.js');
				this.include('clickdragstudent/js/lib/palette.js');
				this.include('clickdragstudent/js/lib/split.js');
				//this.include('cdstd-min.js');
				this.include('clickdragstudent/js/common/data_validator.js');
				this.include('clickdragstudent/js/common/olddata_validator.js');
				this.include('clickdragstudent/js/common/newauthData_validator.js');
				this.include('clickdragstudent/js/common/clickdrag_model.js');
				this.include('clickdragstudent/js/component/label_component.js');
				this.include('clickdragstudent/js/component/cls_label_component.js');
				this.include('clickdragstudent/js/component/prg_label_component.js');
				this.include('clickdragstudent/js/component/FIB_component.js');
				this.include('clickdragstudent/js/component/frame_component.js');
				this.include('clickdragstudent/js/component/hint_component.js');
				this.include('clickdragstudent/js/component/zoom_hint_component.js');
				this.include('clickdragstudent/js/component/zoom_component.js');
				this.include('clickdragstudent/js/common/clickdrag_view.js');
				this.include('clickdragstudent/js/module/sletemplate.js');
				this.include('clickdragstudent/js/module/coitemplate.js');
				this.include('clickdragstudent/js/module/seqtemplate.js');
				this.include('clickdragstudent/js/module/clstemplate.js');
				this.include('clickdragstudent/js/module/prgtemplate.js');
				this.include('clickdragstudent/js/common/ClickDragShell.js');
			}
			
		},
		
		/*
		 * Computes the url path from where kernel.js is loaded
		 * All app and module files are loaded relative to this path
		 */
		getBaseUrl: function () {
			var src = $("script[src*='ClickDragApp_prod.js']:first"); //only the first kernel.js used to load config
			this.baseUrl = (src.attr("src")).substring(0,(src.attr("src")).indexOf("ClickDragApp_prod.js"));
		},
		/*
		 * create: Boolean to return new empty object;
		 * if prop doesn't exist
		 */
		_getProp: function (parts, create, context) {
			var obj=context || this.global;
			for(var i=0, p; obj && (p=parts[i]); i++) {				
				obj = (p in obj ? obj[p] : (create ? obj[p]={} : undefined));
			}
			return obj;
		},
		
		/*
		 * 
		 */
		setObject: function (name, value, context) {
			var parts=name.split("."), p=parts.pop(), obj=this._getProp(parts, true, context);
			return obj && p ? (obj[p]=value) : undefined;
		},

		/*
		 * 
		 */
		getObject: function (name, create, context) {
			return this._getProp(name.split("."), create, context);
		},

		/*
		 * 
		 */
		loadResource: function (uriPath) {
			// Make synchronous ajax call to load the resource
			var uriContent;
			$.ajax({
				//url: uriPath+'?v={build.number}',
				url: uriPath+'?v=v2.0.20150309.0',
				async: false,
				dataType: "text",
				success: function (result) {
					uriContent = result;
				},
				error: function () {
					throw new Error("loadResource: Resource not found at - " + uriPath);
				}
			});
			return uriContent;
		},
		loadModule: function (path) {
			var filePath = this.baseUrl+path;
			//this.loadAppFile(filePath);
			var moduleContent = this.loadResource(filePath);
			if (moduleContent) {
				eval(moduleContent);
			}
		},
		
		/*
		 * 
		 */
		include: function (path) {
			// Includes the necessary files
			// doesn't call loadModule; if the file is already loaded
			if (!(this.getObject(path))) {
				this.loadModule(path);
			}
		},
		/**
	     * function to load a given css file 
	     */ 
	    loadCSS:function(href,baseUrl) {
	        var cssLink = $("<link>");
	        var cssBaseUrl = '';
	        if(baseUrl != undefined && baseUrl != ''){
	        	cssBaseUrl = baseUrl;
	        }else{
	        	cssBaseUrl = this.baseUrl.substring(0,this.baseUrl.indexOf('/js')+1);
	        }
	        $("head").append(cssLink);
	            cssLink.attr({
	            rel: "stylesheet",
	            type: "text/css",
	            href: cssBaseUrl+href
	       });
	    },
	    
		is_mobile: function() {
			var agents = ['iPad','android','webos','iPhone','blackberry'];
	    	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
	            return true;
	        }
		    return false;
		}

	}; // End Util Class

	// Instantiate clickdrag_app
	window.clickdragApp = new ClickDragApp();
	window.clickdragApp.init();
	function createModalWindow(content){
		var messageContent = 'Loading...';
		if(content == ''){
			messageContent = '<div class="shell_modal"></div>';
		}else{
			messageContent = content;
		}
		//Initiating jQuery ModalBox
		jQuery.fn.modalBox({ 
				directCall : {
					data : messageContent
				},
				setTypeOfFadingLayer:'white',
				killModalboxWithCloseButtonOnly:'false'
			});
	}

	function removeModalWindow(){
		$('.shell_modal').modalBox.close();
	}
})(jQuery);
