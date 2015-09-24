function Util(){
	console.log("@Util");
	var that = this;
	var charset;
	this.getTemplate = function(options) {
		console.log('@Util.getTemplate :: url ::' + options.url);
		var xhr = $.ajax({
			'url' : options.url,
			'async' : false,
			'dataType': "html",
			'success' : function(data) {
				
			},
			'error' : function() {
				console.log('@Util.getTemplate Error:: url ::' + url);
			}
		});
		return (xhr.status === 200) ? xhr.responseText : '';
	};
	this.loadCss = function(options) {
		console.log('@Util.loadCss :: url ::' + options.url);
		var $ = window.gte.services.jq;
		if ($('#tpl_css').length < 1) {
			var css = document.createElement('link');
			css.rel = 'stylesheet';
			css.href = options.url;
			css.type = 'text/css';
			css.id = 'tpl_css_' + options.theme_id;
			document.getElementsByTagName('head')[0].appendChild(css);
		} else {
			var tplObject = $('#tpl_css');
			if (tplObject.attr('href') != options.url) {
				tplObject.attr({
					'href' : options.url
				});
			}
		}
	};
	
	this.loadingImage = function(show_hide) {
		if (show_hide) {
			$('#loading_image').css("display", "block");
		} else {
			$('#loading_image').css("display", "none");
		}
	};
	this.getBaseUrl = function() {
		var src = $("script[src*='cdezto.js']:first");
		
		var baseUrl = (src.attr("src")).substring(0,(src.attr("src")).indexOf("cdezto.js"));
		/*var cfg = src.attr("config"); //get the kernel config info from the 'config' attribute in kernel.js script tag
		if(cfg === "dev"){
			this.baseUrl = this.baseUrl + 'src/main/com/mhhe/clickdragauthoring/';
		}*/
		return baseUrl;
		//TODO: Loop on to extract properties and avoid using eval
		//TODO: Add config parameters via query string in the script src url (more standards compliant)
		//this.config = $.extend(this.config, eval("({"+cfg+"})"));
	};
	this.getIEVersion = function() {
		console.log("@Util.getIEVersion");
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.test(ua) != null)
                rv = parseFloat( RegExp.$1 );
        }
        return rv;
    };
    this.getImageUrl= function(){
    	var imageBaseUrl = "resources/themes/default/images/";
    		return imageBaseUrl;
    };
	/** 
	 * This function processes the Media resources mostly Images to generate the actual Eztest media URL.
	 * If mediaID is "NotFound" then it logs an console error message that media is missing. 
	 * If mediaID is available returns the Eztest meidaID and full URL
	 * Input: Media Name
	 * Output: Eztest actual media URL
	 */
	this.proccessMediaID = function(mediaID){
		try{
			var cd = window.CD;
			if (mediaID != "" && mediaID != undefined){
				var mediaBaseURL = cd.mediaBaseURL;
				mediaBaseURL.replace("SHOWmedia","GETmedia");
				if(mediaID.indexOf('http://') > -1 || mediaID.indexOf('https://') > -1){
					if(mediaID.indexOf('=SHOWmedia&media=') > -1){
						mediaID = mediaID.substring(mediaID.lastIndexOf('=SHOWmedia&media=')+17 , mediaID.length);
					}else{
						mediaID = mediaID.substring(mediaID.lastIndexOf('/')+1 , mediaID.length);
					}
					
				}
				var mediaType= mediaID.substring(mediaID.lastIndexOf('.')+1, mediaID.length);
				if(mediaType == "png" || mediaType == "jpg" || mediaType == "gif" || mediaType == "jpeg" || mediaType == "JPG"){
					
					var EztestMediaList = new Array();
					if(mediaBaseURL == '' || mediaBaseURL == undefined){
						var questionId = cd.questionId || ClickDrag.GlobalVars.questionId;
						var EztestMediaValue = $('#'+ questionId.replace('P_','Q_') + '_media', parent.document).val();
						if (EztestMediaValue != ''){
							var EztestMediaArray =  EztestMediaValue.split(',');
							if (EztestMediaArray.length > 1)
							{
								mediaBaseURL = EztestMediaArray[0];
								for (i=1; i<EztestMediaArray.length; i++)
									EztestMediaList.push(EztestMediaArray[i]);
							}
						}
						
					}else{
						EztestMediaList = cd.mediaValue;
					}
					if(EztestMediaList.length >= 1){
						for(var i=0; i < EztestMediaList.length;i++){
							/**
							 * previously the checking was like "i >= EztestMediaList.length -1", now it has been modified
							 * to "i > EztestMediaList.length -1". This is because for the last image of EztestMediaList it is not 
							 * checking for "mediaID == getMediaRoot(EztestMediaList[i]". Hence for images with changed name in json
							 * are not getting rendered(e.g cat.jpg in json while original name is 520cat.jpg).
							 */
							if(i >= EztestMediaList.length){
								//console.info('Returning original MediaID--media unavailable.');
								return mediaBaseURL +  mediaID;
							}
							if(mediaID == getMediaRoot(EztestMediaList[i])){
								//console.info('Returning Eztest mapped MediaID---');
								return mediaBaseURL + EztestMediaList[i];
							}
						}
						//console.info("No media matched is available "+mediaID);
						return mediaBaseURL + mediaID;
					}else{
						//console.log('Error:: unable to get Media file');
						$('.shell_modal').modalBox.close();
						//Initiating jQuery ModalBox
						jQuery.fn.modalBox({ 
								directCall : {
									data : "Error:: Unable to get media file(s)."
								},
								setTypeOfFadingLayer:'white',
								killModalboxWithCloseButtonOnly:'false'
							});
					}
					 
				}else if(mediaType == "mp3" || mediaType == "flv"){
					if(mediaBaseURL == '' || mediaBaseURL == undefined){
						var questionId = cd.questionId || ClickDrag.GlobalVars.questionId;
						var EztestMediaValue = $('#'+ questionId.replace('P_','Q_') + '_media', parent.document).val();
						mediaBaseURL = EztestMediaValue.split(',')[0];
					}
					videoBaseURL = mediaBaseURL.substring(0,mediaBaseURL.indexOf('.com')+4);
					videoURL =  videoBaseURL+'/extMedia'+mediaID;
					if(mediaBaseURL.indexOf('imagebank/') != -1){
						videoBaseURL = mediaBaseURL.substring(0,mediaBaseURL.length-1);
						videoURL =  videoBaseURL+ mediaID;
					}
					
					return videoURL;
				}
				     
			}
		}catch(err){
			console.info("Error in processMeidaID::"+err.message);
		}
		
		/**
		 * This function searches for number in the rawName parameter
		 * It returns the sub string starting from the position it finds a non numeric character
		 * Input:rawName (String)
		 * Output:root media name (String)
		 */

		function getMediaRoot(rawName)
		{
			var ci = 0;
			var rawNameFirstTwoDigit = rawName.substring(0, 2);//Added for CTCD-225
			var rawNameNumerics = parseInt(rawName);
			if (rawNameFirstTwoDigit == "00") {//Added for CTCD-225
				return rawName.substring(2,rawName.length);
			} else if(rawNameNumerics){
				while (Number(rawName.charAt(ci)) || Number(rawName.charAt(ci)) == 0)
				{
					ci++;
				}
				
				return rawName.substring(ci,rawName.length);
			}
			return rawName;
		}

		
	};
	this.isEncoded = function(str) {
		if(str.match(/ET%3D/)) {
			return true;
		} else if(str.match(/ET=/)) {
			return false;
		}
	};
	this.isJSON = function(str){
		var is_JSON = false;
		try{
			var strObj = $.parseJSON(str);
			if(typeof strObj == 'object'){
				is_JSON = true;
			}
		}catch(err){
			console.info("no a JSON boject")
			is_JSON = false;
		}
		return is_JSON;
	};
	this.removeArrayElm = function(arr,from, to,imgAvailability) {
		/*change due to error on image delete on rendering of string*/
		if(from == -1)
			from = 0;
		/**/
		if(imgAvailability){
			var rest = arr.slice((to || from) + 1 || arr.length);
			arr.length = from < 0 ? arr.length + from : from;
			
			return arr.push.apply(arr, rest);
		}
	};
	/*
	 * Computes the url path from where kernel.js is loaded
	 * All app and module files are loaded relative to this path
	 */
	function getBaseUrl() {
		var src = $("script[src*='cdezto.js']:first");
		
		var baseUrl = (src.attr("src")).substring(0,(src.attr("src")).indexOf("cdezto.js"));
		/*var cfg = src.attr("config"); //get the kernel config info from the 'config' attribute in kernel.js script tag
		if(cfg === "dev"){
			this.baseUrl = this.baseUrl + 'src/main/com/mhhe/clickdragauthoring/';
		}*/
		return baseUrl;
		//TODO: Loop on to extract properties and avoid using eval
		//TODO: Add config parameters via query string in the script src url (more standards compliant)
		//this.config = $.extend(this.config, eval("({"+cfg+"})"));
	};
	/*(function() {
	$.ajax({
		'url' : 'resources/themes/default/views/specialchar.json',
		'dataType' : 'json',
		'async' : false,
		'success' : function(data) {
			charset = data;
		},
		'error' : function() {
			console.log('@Util.getSpecialChar :: url ::' + url);
		}
	});
	})();*/
}
