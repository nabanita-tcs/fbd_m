/*! 
 * palette 1.2.6
 *
 * Author: Milan Adamovsky
 * Modified: Prashant Naik
 * Modified: Srikant Sahu
 */
/* Prerequisites:
 * Incluee following JQuery Library files before palette.js
 * 		1. jquery.client.js   --- To get the browser information
 * 		2. jquery.inputselection.js  --- JQuery custom library to find the input/textarea selected character e.g $(self).getSelection() function. 
 * USAGE:
 * To apply palette on an input/textarea:
 *    $('#example').palette({
 *                                    align : 'vertical', // vertical | horizontal(default) - orientation
 *                                    auto : false,	  // false | true (default) - open on focus or click icon to open
 *                                    language : 'french', // french | spanish(default) - language
 *                                    resize : true	// true | false(default) - resize the input/textarea to accomodate the palette icon. Works only if "auto = false".
 *                                    containment : 'document'(default) - // containment will initialize the draggable containment limit of the palette.
 *                                   });
 *
 *
 * To close any open palette:
 *    $.closeAuthPalette();
 *
 *
 * To remove palette implemented an element:
 *    $("#example").palette("destroy");
 *
 * In this version of the palette, if "auto:false" & "resize:true", the input/textarea and the palette icon will both have "float:left" applied to them and will be wrapped  
 * inside a "div" element with "clearfix" class applied.
 *
 * In some cases it is desired that the above should not happen, add class "palette_no_container" to the input/textarea.
 * In some other case it is desired for the above to happen but do not require "clearfix" class applied to the wrapped "div" element. In such cases add class "palette_container_noclearfix"
 * to the input/textarea.
 *
 *
 * Version 1.2.3 - Added code to apply highest z-index to the palette.
 * Version 1.2.4 - Modified code to handle issues in IE, and uses latest a-tools version 1.5
 * Version 1.2.5 - Added new palette icon, enable deutsch/german and italiano languages, Implemented new palette UI structure
 * Version 1.2.5 - Removed check for TextArea to support Input Field 
 */
(function ($) {
    function AuthPalette(self, args) {
        var active = '',
            config = {},
            map = new CharacterMap,
            state = 'ready'; // ready|hidden|shown
        this.map = map,
        this.version = '1.2.5',
        this.copy = copyCharacter,
        this.hide = hidePalette,
        this.info = getKeyInfo,
        this.load = loadCharacterMap,
        this.show = showPalette,
        this.snap = snapPalette,
        this.charIndex = -1,
        this.charAdded = false,
        this.activeSelectionLength = 0,
        this.activeSelectionStart = 0,
        this.activeSelectionEnd = 0,
        this.lineNumber = 0,
        this.getActive = getActive,
        this.getConfig = getConfig,
        this.getState = getState,
        this.setState = setState;
        this.printUrl = "http://connect.mcgraw-hill.com/classwareweb/html/palette/"; //********************** SET THE BASE URL FOR THE PRINT PAGES eg: "http://connect.mcgraw-hill.com/connectweb/". This print url for spanish will become http://connect.mcgraw-hill.com/connectweb/spanish.html **********************//
        initConfig.apply(this, [args]);
        function getActive() {
                return active;
            }
        function getConfig() {
                return config;
            }
        function getState() {
                return state;
            }
        function setActive(args) {
                active = args.active;
            }
        function setState(args) {
                state = args.state;
            }
        function setConfig(args) {
                var language = args.language;
				if(language=="german"){
					language = "deutsch";
				}
                var characterSet = args.set[language];
                map.setMap(characterSet);
                config = args;
            }
        function bindSet() {
                var palette = this,
                    config = getConfig(),
                    characterSet = config.set,
                    charSetLength = characterSet.length;
                $(document).unbind('loadMap.palette').bind('loadMap.palette', this.load);
                function switchToUCase() {
                	//Binding event for iframe editor
                	if(document.getElementById('textToolTextBox_html')){
	                	$(document.getElementById('textToolTextBox_html').contentWindow.document).unbind('keydown.palette').bind('keydown.palette',function(event){
	                		if (event.keyCode == 16 && $('#palette_container').css('display') == 'block') { 
	                        	
	                        	var keyCount = map['map'].length;
	                        	for ( var count = 0; count < keyCount; count++) {
									if(map['map'][count].uppercase != undefined){
										map.setCase("uppercase");
										
		                            } else
		                            	self.charIndex = 1;
	                        	}
								self.palette.load();
								$(document.getElementById('textToolTextBox_html').contentWindow.document).unbind('keydown.palette');
								$(document).unbind('keydown.palette');
			                    if(self.charIndex!=-1 && self.charIndex!=undefined  && $(config.box.status).html()!=''){
			                        $(config.box.status).html(self.palette.info({
										  index: self.charIndex
			                        }).shortcut || '');
			                    }
	                        }
	                	});
                	} else if(document.getElementById('hintToolTextBox_html')){
	                	$(document.getElementById('hintToolTextBox_html').contentWindow.document).unbind('keydown.palette').bind('keydown.palette',function(event){
	                		if (event.keyCode == 16 && $('#palette_container').css('display') == 'block') { 
	                        	
	                        	var keyCount = map['map'].length;
	                        	for ( var count = 0; count < keyCount; count++) {
									if(map['map'][count].uppercase != undefined){
										map.setCase("uppercase");
										
		                            } else
		                            	self.charIndex = 1;
	                        	}
								self.palette.load();
								$(document.getElementById('hintToolTextBox_html').contentWindow.document).unbind('keydown.palette');
								$(document).unbind('keydown.palette');
			                    if(self.charIndex!=-1 && self.charIndex!=undefined  && $(config.box.status).html()!=''){
			                        $(config.box.status).html(self.palette.info({
										  index: self.charIndex
			                        }).shortcut || '');
			                    }
	                        }
	                	});
                	} else if(document.getElementById('feedbackToolTextBox_html')){
	                	$(document.getElementById('feedbackToolTextBox_html').contentWindow.document).unbind('keydown.palette').bind('keydown.palette',function(event){
	                		if (event.keyCode == 16 && $('#palette_container').css('display') == 'block') { 
	                        	
	                        	var keyCount = map['map'].length;
	                        	for ( var count = 0; count < keyCount; count++) {
									if(map['map'][count].uppercase != undefined){
										map.setCase("uppercase");
										
		                            } else
		                            	self.charIndex = 1;
	                        	}
								self.palette.load();
								$(document.getElementById('feedbackToolTextBox_html').contentWindow.document).unbind('keydown.palette');
								$(document).unbind('keydown.palette');
			                    if(self.charIndex!=-1 && self.charIndex!=undefined  && $(config.box.status).html()!=''){
			                        $(config.box.status).html(self.palette.info({
										  index: self.charIndex
			                        }).shortcut || '');
			                    }
	                        }
	                	});
                	}

                	//Binding event for wrapper document
                   /* $(document).unbind('keydown.palette').bind('keydown.palette', function (event) {
                        if (event.keyCode == 16 && $('#palette_container').css('display') == 'block') { 
                        	
                        	var keyCount = map['map'].length;
                        	for ( var count = 0; count < keyCount; count++) {
								if(map['map'][count].uppercase != undefined){
									map.setCase("uppercase");
									
	                            } else
	                            	self.charIndex = 1;
                        	}
							self.palette.load();
	                        $(document).unbind('keydown.palette');
		                    if(self.charIndex!=-1 && self.charIndex!=undefined  && $(config.box.status).html()!=''){
		                        $(config.box.status).html(self.palette.info({
									  index: self.charIndex
		                        }).shortcut || '');
		                    }
                        }
                    });*/
                }

                function switchToLCase() {
                	//Binding event for iframe editor
                	if(document.getElementById('textToolTextBox_html')){
	                	$(document.getElementById('textToolTextBox_html').contentWindow.document).bind('keyup.palette', function (event) {
	                        if (event.keyCode == 16) {
	                            map.setCase("lowercase");
	                            self.palette.load();
	                            switchToUCase();
	                            if(self.charIndex!=-1 && self.charIndex!=undefined && $(config.box.status).html()!=''){
									$(config.box.status).html(self.palette.info({
									    index: self.charIndex
									}).shortcut || '');
					                            }
	                        }
	            		});
                	} else if(document.getElementById('hintToolTextBox_html')){
	                	$(document.getElementById('hintToolTextBox_html').contentWindow.document).bind('keyup.palette', function (event) {
	                        if (event.keyCode == 16) {
	                            map.setCase("lowercase");
	                            self.palette.load();
	                            switchToUCase();
	                            if(self.charIndex!=-1 && self.charIndex!=undefined && $(config.box.status).html()!=''){
									$(config.box.status).html(self.palette.info({
									    index: self.charIndex
									}).shortcut || '');
					                            }
	                        }
	            		});
                	} else if(document.getElementById('feedbackToolTextBox_html')){
	                	$(document.getElementById('feedbackToolTextBox_html').contentWindow.document).bind('keyup.palette', function (event) {
	                        if (event.keyCode == 16) {
	                            map.setCase("lowercase");
	                            self.palette.load();
	                            switchToUCase();
	                            if(self.charIndex!=-1 && self.charIndex!=undefined && $(config.box.status).html()!=''){
									$(config.box.status).html(self.palette.info({
									    index: self.charIndex
									}).shortcut || '');
					                            }
	                        }
	            		});
                	}
                	
                	//Binding event for wrapper document
                    $(document).unbind('keyup.palette').bind('keyup.palette', function (event) {
                            if (event.keyCode == 16) {
                                map.setCase("lowercase");
                                self.palette.load();
                                switchToUCase();
                                if(self.charIndex!=-1 && self.charIndex!=undefined && $(config.box.status).html()!=''){
									$(config.box.status).html(self.palette.info({
									    index: self.charIndex
									}).shortcut || '');
                                }
                            }
                        });
                    }
                switchToUCase();
                switchToLCase();
            }
        function copyCharacter(args) {
                var index = args.index;
                var characterMap = this.map.getMap();
                var activeObject = getActive();
                 var selectionLength = this.activeSelectionLength,
                    selectionStart = this.activeSelectionStart,
                    selectionEnd = this.activeSelectionEnd;
                 	var foreRunner = activeObject[0].value.slice(0,selectionStart);
                 	var postRunner = activeObject[0].value.slice(selectionStart);
                 //if(index!=-1){    
					if (selectionLength != undefined && selectionLength != 0) {
						activeObject.replaceSelection(characterMap[index].character);
						activeObject.setCaretPos(selectionStart + 2);
					}
					else {
						var character = characterMap[index].character;
						
						var nls = this.lineNumber+1;

						var isTextarea = activeObject.is('textarea');
						/*if($.client.browser == 'Explorer') {
							activeObject[0].value = foreRunner+character+postRunner;
							activeObject.setCaretPos(selectionStart+3-nls);
						}else {	*/						
							//activeObject.setCaretPos(selectionStart+1);
						//if(isTextarea){   //Commented by SS to enable in Input Box
							activeObject.insertAtCaretPos(character);
						//}
						//}
						
					}
                 //}
                return (self);
            }
        function getKeyInfo(args) {
                var config = getConfig(),
                    os = config.os,
                    index = args.index,
                    characterMap = this.map.getMap(),
                    osSpecific = characterMap[index][os];
                self.charIndex = index    
                delete(characterMap[index].win);
                delete(characterMap[index].mac);
                var newConfig = $.extend(true, characterMap[index], osSpecific);
                return (characterMap[index]);
            }
        function initConfig(args) {
                setConfig($.extend({
                    align: 'horizontal',
                    auto: true,
                    box: {
                        close: '#palette_close',
                        icon: 'palette_icon',
                        key: 'palette_key',
                        palette: '#palette_container',
                        set: '#palette_set',
                        snap: '#palette_snap',
                        status: '#palette_shortcut .palette_hint_right',
                        print: '#palette_print'
                    },
                    browser: $.client.browser,
                    containment : 'document',
                    items: 100,
                    iconsize: 59,
                    language: 'spanish',
                    os: ($.client.os != 'Windows' ? 'mac' : 'win'),
                    resize: false,
                    maxrightpos:800,
                    maxbottompos:600,
        		    set : {
        		    	worldlanguages : [
        				{
        				    lowercase : {
        						    character : '\u00E1', /* Latin capital letter a with acute */
        						    mac : {
        							   hotkey : 'Option+e+a',
        							   shortcut : 'Option +e a'
        							  },
        						    win : {
        							   hotkey : 'Alt+0+2+2+5',
        							   shortcut : 'Alt +0225'
        							  }
        						   },
        				    uppercase : {
        						    character : '\u00C1', /* Latin capital letter a with acute */
        						    mac : {
        							   hotkey : 'Option+e+Shift+a',
        							   shortcut : 'Option +e Shift+a'
        							  },
        						    win : {
        							   hotkey : 'Alt+0+1+9+3',
        							   shortcut : 'Alt +0193'
        							  }
        						   }
        				   },
        				     {
        				      lowercase : {
        						   character : '\u00E0', /*Latin capital letter a with grave  */
        						   mac : {
        							  hotkey : 'Option+`+a',
        							  shortcut : 'Option +` a'
        							 },
        						   win : {
        							  hotkey : 'Alt+0+2+2+4',
        							  shortcut : 'Alt +0224'
        							 }
        						  },
        				      uppercase : {
        						   character : '\u00C0', /* Latin capital letter a with grave */
        						   mac : {
        							  hotkey : 'Option+`+Shift+a',
        							  shortcut : 'Option +` Shift+a'
        							 },
        						   win : {
        							  hotkey : 'Alt+0+1+9+2',
        							  shortcut : 'Alt +0192'
        							 }
        						  }
        				     },
        				    
        				     {
        				      lowercase : {
        						   character : '\u00E2', /* Latin capital letter a with circumflex */
        						   mac : {
        							  hotkey : 'Option+i+a',
        							  shortcut : 'Option +i a'
        							 },
        						   win : {
        							  hotkey : 'Alt+0+2+2+6',
        							  shortcut : 'Alt +0226'
        							 }
        						  },
        				      uppercase : {
        						   character : '\u00C2', /*Latin capital letter a with circumflex  */
        						   mac : {
        							  hotkey : 'Option+i+Shift+a',
        							  shortcut : 'Option +i Shift+a'
        								       },
        						   win : {
        							  hotkey : 'Alt+0+1+9+4',
        							  shortcut : 'Alt +0194'
        							 }
        						  }
        				     },
        				     {
        				      lowercase : {
        						   character : '\u00E4', /* Latin small letter a with diaeresis */
        						   mac : {
        							  hotkey : 'Option+u+a',
        							  shortcut : 'Option +u a'
        								 },
        						   win : {
        							  hotkey : 'Alt+0+2+2+8',
        							  shortcut : 'Alt +0228'
        							 }
        						  },
        				      uppercase : {
        						   character : '\u00C4', /* Latin capital letter a with diaeresis */
        						   mac : {
        							  hotkey : 'Option+u+Shift+a',
        							  shortcut : 'Option +u Shift+a'
        							 },
        						   win : {
        							  hotkey : 'Alt+0+1+9+6',
        							  shortcut : 'Alt +0196'
        							 }
        						  }
        				     },
        				     {
        					      lowercase : {
        							   character : '\u00E3', /* Latin small letter a with tilde */
        							   mac : {
        								  hotkey : 'Option+n+a',
        								  shortcut : 'Option +n a'
        									 },
        							   win : {
        								  hotkey : 'Alt+0+2+2+7',
        								  shortcut : 'Alt +0227'
        								 }
        							  },
        					      uppercase : {
        							   character : '\u00C3', /* Latin capital letter a with tilde */
        							   mac : {
        								  hotkey : 'Option+n+Shift+a',
        								  shortcut : 'Option +n Shift+a'
        								 },
        							   win : {
        								  hotkey : 'Alt+0+1+9+5',
        								  shortcut : 'Alt +0195'
        								 }
        							  }
        					     },
        					     {
        						      lowercase : {
        								   character : '\u00E5', /* Latin small letter a with ring above  */
        								   mac : {
        									  hotkey : 'Option+a',
        									  shortcut : 'Option +a'
        										 },
        								   win : {
        									  hotkey : 'Alt+0+2+2+9',
        									  shortcut : 'Alt +0229'
        									 }
        								  },
        						      uppercase : {
        								   character : '\u00C5', /* Latin capital letter a with ring above */
        								   mac : {
        									  hotkey : 'Option+Shift+a',
        									  shortcut : 'Option +Shift+a'
        									 },
        								   win : {
        									  hotkey : 'Alt+0+1+9+7',
        									  shortcut : 'Alt +0197'
        									 }
        								  }
        						     },
        						     {
        							      lowercase : {
        									   character : '\u00E6', /* Latin small letter ae  */
        									   mac : {
        										  hotkey : '',
        										  shortcut : ''
        											 },
        									   win : {
        										  hotkey : 'Alt+0+2+3+0',
        										  shortcut : 'Alt +0230'
        										 }
        									  },
        							      uppercase : {
        									   character : '\u00C6', /* Latin capital letter ae */
        									   mac : {
        										  hotkey : '',
        										  shortcut : ''
        										 },
        									   win : {
        										  hotkey : 'Alt+0+1+9+8',
        										  shortcut : 'Alt +0198'
        										 }
        									  }
        							     },
        							     {
        								      lowercase : {
        										   character : '\u00E7',  /* Latin small letter c with cedilla */
        										   mac : {
        											  hotkey : 'Option+c',
        											  shortcut : 'Option +c'
        											 },
        										   win : {
        											  hotkey : 'Alt+0+2+3+1',
        											  shortcut : 'Alt +0231'
        											 }
        										  },
        								      uppercase : {
        										   character : '\u00C7', /* Latin capital letter c with cedilla */
        										   mac : {
        											  hotkey : 'Option+e+Shift+e',
        											  shortcut : 'Option +e Shift+e'
        											 },
        										   win : {
        											  hotkey : 'Alt+0+1+9+1',
        											  shortcut : 'Alt +0199'
        											 }
        										  }
        								     },
        								     {
        									      lowercase : {
        											   character : '\u010D',  /* Latin small letter c with caron */
        											   mac : {
        												  hotkey : 'Option+c',
        												  shortcut : 'Option +c'
        												 },
        											   win : {
        												  hotkey : 'Alt+0+2+0+8',
        												  shortcut : 'Alt +0208'
        												 }
        											  },
        									      uppercase : {
        											   character : '\u010C', /*  Latin capital letter c with caron */
        											   mac : {
        												  hotkey : 'Option+e+Shift+e',
        												  shortcut : 'Option +e Shift+e'
        												 },
        											   win : {
        												  hotkey : 'Alt+0+2+0+8',
        												  shortcut : 'Alt +0208'
        												 }
        											  }
        									     },
        									     {
        										      lowercase : {
        												   character : '\u00E9',  /* Latin small letter e with acute */
        												   mac : {
        													  hotkey : 'Option+e+e',
        													  shortcut : 'Option +e e'
        													 },
        												   win : {
        													  hotkey : 'Alt+0+2+3+3',
        													  shortcut : 'Alt +0233'
        													 }
        												  },
        										      uppercase : {
        												   character : '\u00C9', /* Latin capital letter e with acute */
        												   mac : {
        													  hotkey : 'Option+e+Shift+e',
        													  shortcut : 'Option +e Shift+e'
        													 },
        												   win : {
        													  hotkey : 'Alt+0+2+0+1',
        													  shortcut : 'Alt +0201'
        													 }
        												  }
        										     },
        					     
        				     {
        				      lowercase : {
        						   character : '\u00E8', /* Latin small letter e with grave */
        						   mac : {
        							  hotkey : 'Option+`+e',
        							  shortcut : 'Option +` e'
        							 },
        						   win : {
        							  hotkey : 'Alt+0+2+3+2',
        							  shortcut : 'Alt +0232'
        							 }
        						  },
        				      uppercase : {
        						   character : '\u00C8', /* Latin capital letter e with grave */
        						   mac : {
        							  hotkey : 'Option+`+Shift+e',
        							  shortcut : 'Option +` Shift+e'
        							 },
        						   win : {
        							  hotkey : 'Alt+0+2+0+0',
        							  shortcut : 'Alt +0200'
        							 }
        						  }
        				     },
        				     {
        				      lowercase : {
        						   character : '\u00EA',  /* Latin small letter e with circumflex */
        						   mac : {
        							  hotkey : 'Option+i+e',
        							  shortcut : 'Option +i e'
        							 },
        						   win : {
        							  hotkey : 'Alt+0+2+3+3',
        							  shortcut : 'Alt +0234'
        							 }
        						  },
        				      uppercase : {
        						   character : '\u00CA', /* Latin capital letter e with circumflex */
        						   mac : {
        							  hotkey : 'Option+e+Shift+e',
        							  shortcut : 'Option +i Shift+e'
        							 },
        						   win : {
        							  hotkey : 'Alt+0+2+0+2',
        							  shortcut : 'Alt +0202'
        							 }
        						  }
        				     },
        				     {
        				      lowercase : {
        						   character : '\u00EB',  /* Latin small letter e with diaeresis */
        						   mac : {
        							  hotkey : 'Option+u+e',
        							  shortcut : 'Option +u e'
        							 },
        						   win : {
        							  hotkey : 'Alt+0+2+3+5',
        							  shortcut : 'Alt +0235'
        							 }
        						  },
        				      uppercase : {
        						   character : '\u00CB', /* Latin capital letter e with diaeresis */
        						   mac : {
        							  hotkey : 'Option+u+Shift+e',
        							  shortcut : 'Option +u Shift+e'
        							 },
        						   win : {
        							  hotkey : 'Alt+0+2+0+3',
        							  shortcut : 'Alt +0203'
        							 }
        						  }
        				     },
        				     {
        					       lowercase : {
        							    character : '\u00ED',  /* Latin small letter i with acute */
        							    mac : {
        								   hotkey : 'Option+e+i',
        								   shortcut : 'Option +e i'
        								  },
        							    win : {
        								   hotkey : 'Alt+0+2+3+7',
        								   shortcut : 'Alt +0237'
        								  }
        							   },
        					       uppercase : {
        							    character : '\u00CD', /* Latin capital letter i with acute */
        							    mac : {
        								   hotkey : 'Option+e+Shift+i',
        								   shortcut : 'Option +e Shift+i'
        								  },
        							    win : {
        								   hotkey : 'Alt+0+2+0+5',
        								   shortcut : 'Alt +0205'
        								  }
        							   }
        					      },
        					      {
        						       lowercase : {
        								    character : '\u00EC',  /* Latin small letter i with grave */
        								    mac : {
        									   hotkey : 'Option+`+i',
        									   shortcut : 'Option +` i'
        									  },
        								    win : {
        									   hotkey : 'Alt+0+2+3+6',
        									   shortcut : 'Alt +0236'
        									  }
        								   },
        						       uppercase : {
        								    character : '\u00CC', /* Latin capital letter i with grave */
        								    mac : {
        									   hotkey : 'Option+`+Shift+i',
        									   shortcut : 'Option +` Shift+i'
        									  },
        								    win : {
        									   hotkey : 'Alt+0+2+0+4',
        									   shortcut : 'Alt +0204'
        									  }
        								   }
        						      },
        				     {
        				      lowercase : {
        						   character : '\u00EE',  /* Latin small letter i with circumflex */
        						   mac : {
        							  hotkey : 'Option+i+i',
        							  shortcut : 'Option +i i'
        							 },
        						   win : {
        							  hotkey : 'Alt+0+2+3+8',
        							  shortcut : 'Alt +0238'
        							 }
        						  },
        				      uppercase : {
        						   character : '\u00CE', /* Latin capital letter i with circumflex */
        						   mac : {
        							  hotkey : 'Option+i+Shift+i',
        							  shortcut : 'Option +i Shift+i'
        							 },
        						   win : {
        							  hotkey : 'Alt+0+2+0+6',
        							  shortcut : 'Alt +0206'
        							 }
        						  }
        				     },
        				     {
       					      lowercase : {
       							   character : '\u00EF',  /* Latin small letter i with diaeresis */
       							   mac : {
       								  hotkey : 'Option+u+i',
       								  shortcut : 'Option +u i'
       								 },
       							   win : {
       								  hotkey : 'Alt+0+2+3+9',
       								  shortcut : 'Alt +0239'
       								 }
       							  },
       					      uppercase : {
       							   character : '\u00CF', /* Latin capital letter i with diaeresis */
       							   mac : {
       								  hotkey : 'Option+u+Shift+i',
       								  shortcut : 'Option +u Shift+i'
       								 },
       							   win : {
       								  hotkey : 'Alt+0+2+0+7',
       								  shortcut : 'Alt +0207'
       								 }
       							  }
       					     },
       					     {
       						       lowercase : {
       								    character : '\u00F1', /* Latin small letter n with tilde */
       								    mac : {
       									   hotkey : 'Option+n+n',
       									   shortcut : 'Option +n n'
       									  },
       								    win : {
       									   hotkey : 'Alt+0+2+4+1',
       									   shortcut : 'Alt +0241'
       									  }
       								   },
       						       uppercase : {
       								    character : '\u00D1', /* Latin capital letter n with tilde */
       								    mac : {
       									   hotkey : 'Option+n+Shift+n', 
       									   shortcut : 'Option +n Shift+n'
       									  },
       								    win : {
       									   hotkey : 'Alt+0+2+0+9', 
       									   shortcut : 'Alt +0209'
       									  }
       								   }
       						      },
       						      {
       							       lowercase : {
       									    character : '\u00F3', /* Latin small letter o with acute */
       									    mac : {
       										   hotkey : 'Option+e+o',
       										   shortcut : 'Option +e o'
       										  },
       									    win : {
       										   hotkey : 'Alt+0+2+4+3',
       										   shortcut : 'Alt +0243'
       										  }
       									   },
       							       uppercase : {
       									    character : '\u00D3', /* Latin capital letter o with acute */
       									    mac : {
       										   hotkey : 'Option+e+Shift+o', 
       										   shortcut : 'Option +e Shift+o'
       										  },
       									    win : {
       										   hotkey : 'Alt+0+2+1+1', 
       										   shortcut : 'Alt +0211'
       										  }
       									   }
       							      },
       							      {
       								       lowercase : {
       										    character : '\u00F2', /* Latin small letter o with grave */
       										    mac : {
       											   hotkey : 'Option+`+o',
       											   shortcut : 'Option +` o'
       											  },
       										    win : {
       											   hotkey : 'Alt+0+2+4+2',
       											   shortcut : 'Alt +0242'
       											  }
       										   },
       								       uppercase : {
       										    character : '\u00D2', /* Latin capital letter o with grave */
       										    mac : {
       											   hotkey : 'Option+`+Shift+o', 
       											   shortcut : 'Option +` Shift+o'
       											  },
       										    win : {
       											   hotkey : 'Alt+0+2+1+0', 
       											   shortcut : 'Alt +0210'
       											  }
       										   }
       								      },
       								      {
       									      lowercase : {
       											   character : '\u00F4',  /* Latin small letter o with circumflex */
       											   mac : {
       												  hotkey : 'Option+i+o',
       												  shortcut : 'Option +i o'
       												 },
       											   win : {
       												  hotkey : 'Alt+0+2+4+4',
       												  shortcut : 'Alt +0244'
       												 }
       											  },
       									      uppercase : {
       											   character : '\u00D4', /* Latin capital letter o with circumflex */
       											   mac : {
       												  hotkey : 'Option+i+Shift+o',
       												  shortcut : 'Option +i Shift+o'
       												 },
       											   win : {
       												  hotkey : 'Alt+0+2+1+2',
       												  shortcut : 'Alt +0212'
       												 }
       											  }
       									     },
       									     {
       									      lowercase : {
       											   character : '\u00F6',  /* Latin small letter o with diaeresis */
       											   mac : {
       												  hotkey : 'Option+u+o',
       												  shortcut : 'Option +u o'
       												 },
       											   win : {
       												  hotkey : 'Alt+0+2+4+6',
       												  shortcut : 'Alt +0246'
       												 }
       											  },
       									      uppercase : {
       											   character : '\u00D6', /* Latin capital letter o with diaeresis */
       											   mac : {
       												  hotkey : 'Option+u+Shift+o',
       												  shortcut : 'Option +u Shift+o'
       												 },
       											   win : {
       												  hotkey : 'Alt+0+2+1+4',
       												  shortcut : 'Alt +0214'
       												 }
       											  }
       									     },
       									     {
       										      lowercase : {
       												   character : '\u00F5',  /* Latin small letter o with tilde */
       												   mac : {
       													  hotkey : 'Option+n+o',
       													  shortcut : 'Option +n o'
       													 },
       												   win : {
       													  hotkey : 'Alt+0+2+4+5',
       													  shortcut : 'Alt +0245'
       													 }
       												  },
       										      uppercase : {
       												   character : '\u00D5', /* Latin capital letter o with tilde */
       												   mac : {
       													  hotkey : 'Option+n+Shift+o',
       													  shortcut : 'Option +n Shift+o'
       													 },
       												   win : {
       													  hotkey : 'Alt+0+2+1+3',
       													  shortcut : 'Alt +0213'
       													 }
       												  }
       										     },
       										     {
       											      lowercase : {
       													   character : '\u00F8',  /* Latin small letter o with stroke */
       													   mac : {
       														  hotkey : 'Option+o',
       														  shortcut : 'Option +o'
       														 },
       													   win : {
       														  hotkey : 'Alt+0+2+4+8',
       														  shortcut : 'Alt +0248'
       														 }
       													  },
       											      uppercase : {
       													   character : '\u00D8', /* Latin capital letter o with stroke */
       													   mac : {
       														  hotkey : 'Option+Shift+o',
       														  shortcut : 'Option +Shift+o'
       														 },
       													   win : {
       														  hotkey : 'Alt+0+2+1+6',
       														  shortcut : 'Alt +0216'
       														 }
       													  }
       											     },
       											     {
       											      lowercase : {
       													   character : '\u0153',  /* Latin small ligature oe */ 
       													   mac : {
       														  hotkey : 'Option+q',
       														  shortcut : 'Option +q'
       														 },
       													   win : {
       														  hotkey : 'Alt+0+1+5+6',
       														  shortcut : 'Alt +0156'
       														 }
       													  },
       											      uppercase : {
       													   character : '\u0152', /* Latin capital ligature oe */
       													   mac : {
       														  hotkey : 'Option+Shift+q',
       														  shortcut : 'Option Shift+q'
       														 },
       													   win : {
       														  hotkey : 'Alt+0+1+4+0',
       														  shortcut : 'Alt +0140'
       														 }
       													  }
       											     },
       											     {
       												      lowercase : {
       														   character : '\u0159',  /* Latin small letter r with caron */ 
       														   mac : {
       															  hotkey : '',
       															  shortcut : ''
       															 },
       														   win : {
       															  hotkey : '',
       															  shortcut : ''
       															 }
       														  },
       												      uppercase : {
       														   character : '\u0158', /* Latin capital letter r with caron */
       														   mac : {
       															  hotkey : '',
       															  shortcut : ''
       															 },
       														   win : {
       															  hotkey : '',
       															  shortcut : ''
       															 }
       														  }
       												     },
       												     
       												     {
       													      lowercase : {
       															   character : '\u015D',  /* Latin small letter s with circumflex */ 
       															   mac : {
       																  hotkey : '',
       																  shortcut : ''
       																 },
       															   win : {
       																  hotkey : '',
       																  shortcut : ''
       																 }
       															  },
       													      uppercase : {
       															   character : '\u015C', /*Latin capital letter s with circumflex */
       															   mac : {
       																  hotkey : '',
       																  shortcut : ''
       																 },
       															   win : {
       																  hotkey : '',
       																  shortcut : ''
       																 }
       															  }
       													     },
       													     {
       														      lowercase : {
       																   character : '\u0161',  /* Latin small letter s with caron */ 
       																   mac : {
       																	  hotkey : 'Option+q',
       																	  shortcut : 'Option +q'
       																	 },
       																   win : {
       																	  hotkey : 'Alt+0+1+5+6',
       																	  shortcut : 'Alt +0156'
       																	 }
       																  },
       														      uppercase : {
       																   character : '\u0160', /*Latin capital letter s with caron */
       																   mac : {
       																	  hotkey : '',
       																	  shortcut : ''
       																	 },
       																   win : {
       																	  hotkey : '',
       																	  shortcut : ''
       																	 }
       																  }
       														     },
       														     {
       															      lowercase : {
       																	   character : '\u1E61',  /*Latin small letter s with dot above */ 
       																	   mac : {
       																		  hotkey : '',
       																		  shortcut : ''
       																		 },
       																	   win : {
       																		  hotkey : '',
       																		  shortcut : ''
       																		 }
       																	  },
       															      uppercase : {
       																	   character : '\u1E60', /*Latin capital letter s with dot above */
       																	   mac : {
       																		  hotkey : '',
       																		  shortcut : ''
       																		 },
       																	   win : {
       																		  hotkey : '',
       																		  shortcut : ''
       																		 }
       																	  }
       															     },
       															     {
       																      lowercase : {
       																		   character : '\u00DF', /* Latin small letter sharp s */
       																		   mac : {
       																			  hotkey : 'Option+s',
       																			  shortcut : 'Option +s'
       																			 },
       																		   win : {
       																			  hotkey : 'Alt+0+2+2+3',
       																			  shortcut : 'Alt +0223'
       																			 }
       																		  },
       																      uppercase : {
       																		   character : '\u1E9E', /* Latin capital letter sharp s */
       																		   mac : {
       																			  hotkey : 'Option+s',
       																			  shortcut : 'Option +s'
       																			 },
       																		   win : {
       																			  hotkey : 'Alt+0+2+2+3',
       																			  shortcut : 'Alt +0223'
       																			 }
       																		  }
       																     },
       																      {
       																       lowercase : {
       																		    character : '\u00FA', /* Latin small letter u with acute */
       																		    mac : {
       																			   hotkey : 'Option+e+u',
       																			   shortcut : 'Option +e u'
       																			  },
       																		    win : {
       																			   hotkey : 'Alt+0+2+5+0',
       																			   shortcut : 'Alt +0250'
       																			  }
       																		   },
       																       uppercase : {
       																		    character : '\u00DA', /* Latin capital letter u with acute */
       																		    mac : {
       																			   hotkey : 'Option+e+Shift+u', 
       																			   shortcut : 'Option +e Shift+u'
       																			  },
       																		    win : {
       																			   hotkey : 'Alt+0+2+1+8', 
       																			   shortcut : 'Alt +0218'
       																			  }
       																		   }
       																      },
       																	     {
       																	      lowercase : {
       																			   character : '\u00F9',  /* Latin small letter u with grave */
       																			   mac : {
       																				  hotkey : 'Option+`+u',
       																				  shortcut : 'Option +` u'
       																				 },
       																			   win : {
       																				  hotkey : 'Alt+0+2+4+9',
       																				  shortcut : 'Alt +0249'
       																				 }
       																			  },
       																	      uppercase : {
       																			   character : '\u00D9', /* Latin capital letter u with grave */
       																			   mac : {
       																				  hotkey : 'Option+`+Shift+u',
       																				  shortcut : 'Option +` Shift+u'
       																				 },
       																			   win : {
       																				  hotkey : 'Alt+0+2+1+7',
       																				  shortcut : 'Alt +0217'
       																				 }
       																			  }
       																	     },
       																	     {
       																		      lowercase : {
       																				   character : '\u00FB',  /* Latin small letter u with circumflex */
       																				   mac : {
       																					  hotkey : 'Option+i+u',
       																					  shortcut : 'Option +i u'
       																					 },
       																				   win : {
       																					  hotkey : 'Alt+0+2+5+1',
       																					  shortcut : 'Alt +0251'
       																					 }
       																				  },
       																		      uppercase : {
       																				   character : '\u00DB', /* Latin capital letter u with circumflex */
       																				   mac : {
       																					  hotkey : 'Option+i+Shift+u',
       																					  shortcut : 'Option +i Shift+u'
       																					 },
       																				   win : {
       																					  hotkey : 'Alt+0+2+1+9',
       																					  shortcut : 'Alt +0219'
       																					 }
       																				  }
       																		     },
       																		     {
       																			      lowercase : {
       																					   character : '\u00FC',  /* Latin small letter u with diaeresis */
       																					   mac : {
       																						  hotkey : 'Option+u+u',
       																						  shortcut : 'Option +u u'
       																						 },
       																					   win : {
       																						  hotkey : 'Alt+0+2+5+2',
       																						  shortcut : 'Alt +0252'
       																						 }
       																					  },
       																			      uppercase : {
       																					   character : '\u00DC', /* Latin capital letter u with diaeresis */
       																					   mac : {
       																						  hotkey : 'Option+u+Shift+u',
       																						  shortcut : 'Option +u Shift+u'
       																						 },
       																					   win : {
       																						  hotkey : 'Alt+0+2+2+0',
       																						  shortcut : 'Alt +0220'
       																						 }
       																					  }
       																			     },
    																			     {
   																				      lowercase : {
   																						   character : '\u00FD',  /* Latin capital letter y with acute */
   																						   mac : {
   																							  hotkey : 'Option+u+u',
   																							  shortcut : 'Option +u u'
   																							 },
   																						   win : {
   																							  hotkey : 'Alt+0+2+5+3',
   																							  shortcut : 'Alt +0253'
   																							 }
   																						  },
   																				      uppercase : {
   																						   character : '\u00DD', /* Latin capital letter y with acute */
   																						   mac : {
   																							  hotkey : '',
   																							  shortcut : ''
   																							 },
   																						   win : {
   																							  hotkey : '',
   																							  shortcut : ''
   																							 }
   																						  }
   																				     },
   																				     {
   																					      lowercase : {
   																							   character : '\u00FF',  /* Latin small letter y with diaeresis */
   																							   mac : {
   																								  hotkey : 'Option+u+u',
   																								  shortcut : 'Option +u u'
   																								 },
   																							   win : {
   																								  hotkey : 'Alt+0+1+5+9',
   																								  shortcut : 'Alt +0159'
   																								 }
   																							  },
   																					      uppercase : {
   																							   character : '\u0178', /* Latin capital letter y with diaeresis */
   																							   mac : {
   																								  hotkey : '',
   																								  shortcut : ''
   																								 },
   																							   win : {
   																								  hotkey : '',
   																								  shortcut : ''
   																								 }
   																							  }
   																					     },
   																					     {
   																						      lowercase : {
   																								   character : '\u0177',  /* Latin small letter y with circumflex */
   																								   mac : {
   																									  hotkey : '',
   																									  shortcut : ''
   																									 },
   																								   win : {
   																									  hotkey : '',
   																									  shortcut : ''
   																									 }
   																								  },
   																						      uppercase : {
   																								   character : '\u0176', /* Latin capital letter y with circumflex */
   																								   mac : {
   																									  hotkey : '',
   																									  shortcut : ''
   																									 },
   																								   win : {
   																									  hotkey : '',
   																									  shortcut : ''
   																									 }
   																								  }
   																						     },
   																						     {
   																							      lowercase : {
   																									   character : '\u017E',  /*Latin small letter z with caron */
   																									   mac : {
   																										  hotkey : '',
   																										  shortcut : ''
   																										 },
   																									   win : {
   																										  hotkey : 'Alt+0+1+4+2',
   																										  shortcut : 'Alt +0142'
   																										 }
   																									  },
   																							      uppercase : {
   																									   character : '\u017D', /* Latin capital letter z with caron */
   																									   mac : {
   																										  hotkey : '',
   																										  shortcut : ''
   																										 },
   																									   win : {
   																										  hotkey : '',
   																										  shortcut : ''
   																										 }
   																									  }
   																							     }
   																							     
   																								],

   																																					   //Spanish : [],
   																																				     //----------- symbols palette starts here---------------
   																																				     
   																																				     //Symbols : [],
   																																							     
   																																				     // ----------special character palette starts here --------------------------
   																																				     
   																																				     symbols : [
   																																					              
   																																							      {
   																																							    	  lowercase : {
   																																									    character : '\u2122', /* Trademark sign */
   																																									    mac : {
   																																										   hotkey : 'Option+2',
   																																										   shortcut : 'Option +2'
   																																										  },
   																																									    win : {
   																																										   hotkey : 'Alt+0+1+5+3',
   																																										   shortcut : 'Alt +0153'
   																																										  }
   																																									   },
   																																							      },
   																																							      {
   																																							    	  lowercase : {
   																																									    character : '\u0192', /* Latin small letter f with hook */
   																																									    mac : {
   																																										   hotkey : 'Option+f',
   																																										   shortcut : 'Option +f'
   																																										  },
   																																									    win : {
   																																										   hotkey : 'Alt+0+1+3+1',
   																																										   shortcut : 'Alt +0131'
   																																										  }
   																																									   },
   																																							      },
   																																								     {
   																																								    	  lowercase : {
   																																										    character : '\u00A4', /* Currency sign */
   																																										    mac : {
   																																											   hotkey : '',
   																																											   shortcut : ''
   																																											  },
   																																										    win : {
   																																											   hotkey : 'Alt+0+1+6+4',
   																																											   shortcut : 'Alt +0164'
   																																											  }
   																																										   },
   																																								      },
   																																								     
   																																									    {
   																																										      lowercase : {
   																																										    	  character : '\u25CA',/*---- for SQUARE LOZENGE sign -----*/
   																																										    	  mac : {
   																																										    		  hotkey : '',
   																																										    		  shortcut : ''
   																																										    	  },
   																																										    	  win : {
   																																													   hotkey : '',
   																																													   shortcut : ''
   																																												  }
   																																										      }
   																																										      
   																																										      
   																																										    }, 
   																																									    {
   																																										      lowercase : {
   																																										    	  character : '\u2261',/*---- IDENTICAL TO (three lines) sign -----*/
   																																										    	  mac : {
   																																										    		  hotkey : '',
   																																										    		  shortcut : ''
   																																										    	  },
   																																										    	  win : {
   																																													   hotkey : 'Alt+0+2+4+0',
   																																													   shortcut : 'Alt +0240'
   																																												  }
   																																										      }
   																																										      
   																																										      
   																																										    },
   																																								     {
   																																									      lowercase : {
   																																											   character : '\u00A3',  /* GREEK CURRENCY POUND SIGN */
   																																											   mac : {
   																																												  hotkey : 'Option+3',
   																																												  shortcut : 'Option +3'
   																																												 },
   																																											   win : {
   																																												  hotkey : 'Alt+0+1+6+3',
   																																												  shortcut : 'Alt +0163'
   																																												 }
   																																											  }				
   																																									     },
   																																								     {
   																																								     lowercase : {
   																																										   character : '\u00A2',  /* GREEK CURRENCY CENT SIGN */
   																																										   mac : {
   																																											  hotkey : 'Option+4',
   																																											  shortcut : 'Option +4'
   																																											 },
   																																										   win : {
   																																											  hotkey : 'Alt+0+1+6+2',
   																																											  shortcut : 'Alt +0162'
   																																											 }
   																																										  }
   																																								     },
   																																							      
   																																							     
   																																							     
   																																							      
   																																							     
   																																							      
   																																							      {
   																																							    	  lowercase : {
   																																									    character : '\u005F', /*  Low line */
   																																									    mac : {
   																																										   hotkey : '',
   																																										   shortcut : ''
   																																										  },
   																																									    win : {
   																																										   hotkey : '',
   																																										   shortcut : ''
   																																										  }
   																																									   },
   																																							      },
   																																							      
   																																							     																					      
   																																							      //#########################punctuation added
   																																													      {
   																																															   lowercase : {
   																																																    character : '\u201D', /* RIGHT DOUBLE QUOTATION MARK */
   																																																	mac : {
   																																																		hotkey : '',
   																																																		shortcut : ''
   																																																	},
   																																																	win : {
   																																																		hotkey : 'Alt+0+1+4+8',
   																																																		shortcut : 'Alt +0148'
   																																																	}
   																																																	}
   																																															      },
   																																															      // next line 1
   																																															      {
   																																																	   lowercase : {
   																																																			 character : '\u2018', /* LEFT SINGLE QUOTATION MARK */
   																																																			 mac : {
   																																																				 hotkey : '',
   																																																				  shortcut : ''
   																																																				},
   																																																			    win : {
   																																																				   hotkey : 'Alt+0+1+4+5',
   																																																				   shortcut : 'Alt +0145'
   																																																				  }
   																																																			   }
   																																																	      },{
   																																																		       lowercase : {
   																																																				    character : '\u2019', /* RIGHT SINGLE QUOTATION MARK */
   																																																				    mac : {
   																																																					   hotkey : '',
   																																																					   shortcut : ''
   																																																					  },
   																																																				    win : {
   																																																					   hotkey : 'Alt+0+1+4+6',
   																																																					   shortcut : 'Alt +0146'
   																																																					  }
   																																																				   }
   																																																		      },{
   																																																			       lowercase : {
   																																																					    character : '\u201B', /* SINGLE HIGH-REVERSED-9 QUOTATION MARK */
   																																																					    mac : {
   																																																						   hotkey : '',
   																																																						   shortcut : ''
   																																																						  },
   																																																					    win : {
   																																																						   hotkey : 'Alt+0+1+8+0',
   																																																						   shortcut : 'Alt +0180'
   																																																						  }
   																																																					   }
   																																																			      },
   																																																			      {
   																																																				       lowercase : {
   																																																						    character : '\u201F', /* DOUBLE HIGH-REVERSED-9 QUOTATION MARK */
   																																																						    mac : {
   																																																							   hotkey : '',
   																																																							   shortcut : ''
   																																																							  },
   																																																						    win : {
   																																																							   hotkey : 'Alt+0+1+4+7',
   																																																							   shortcut : 'Alt +0147'
   																																																							  }
   																																																						   }
   																																																				      },
   																																																				   // next line 2
   																																																				      {
   																																																					       lowercase : {
   																																																							    character : '\u201B', /* SINGLE HIGH-REVERSED-9 QUOTATION MARK */
   																																																							    mac : {
   																																																								   hotkey : '',
   																																																								   shortcut : ''
   																																																								  },
   																																																							    win : {
   																																																								   hotkey : 'Alt+0+1+4+5',
   																																																								   shortcut : 'Alt +0145'
   																																																								  }
   																																																							   }
   																																																					      },
   																																																					      {
   																																																						       lowercase : {
   																																																								    character : '\u201F', /* DOUBLE HIGH-REVERSED-9 QUOTATION MARK */
   																																																								    mac : {
   																																																									   hotkey : '',
   																																																									   shortcut : ''
   																																																									  },
   																																																								    win : {
   																																																									   hotkey : 'Alt+0+1+4+7',
   																																																									   shortcut : 'Alt +0147'
   																																																									  }
   																																																								   }
   																																																						      },
   																																																							      
   																																																								      {
   																																																										   lowercase : {
   																																																											    character : '\u201E', /* DOUBLE LOW-9 QUOTATION MARK */
   																																																												mac : {
   																																																													hotkey : '',
   																																																													shortcut : ''
   																																																												},
   																																																												win : {
   																																																													hotkey : 'Alt+0+1+3+2',
   																																																													shortcut : 'Alt +0132'
   																																																												}
   																																																												}
   																																																										      },
   																																																										      // next line 3
   																																																								
   																																																															      {
   																																																																       lowercase : {
   																																																																		    character : '\u00B0', /* DEGREE SIGN */
   																																																																		    mac : {
   																																																																			   hotkey : '',
   																																																																			   shortcut : ''
   																																																																			  },
   																																																																		    win : {
   																																																																			   hotkey : 'Alt+0+1+7+6',
   																																																																			   shortcut : 'Alt +0176'
   																																																																			  }
   																																																																		   }
   																																																																      },
   																																																																			      // next line 4
   																																																																			      {
   																																																																							       lowercase : {
   																																																																									    character : '\u2237', /* COMBINING DIAERESIS */
   																																																																									    mac : {
   																																																																										   hotkey : '',
   																																																																										   shortcut : ''
   																																																																										  },
   																																																																									    win : {
   																																																																										   hotkey : '',
   																																																																										   shortcut : ''
   																																																																										  }
   																																																																									   }
   																																																																							      },
   																																																																							      {
   																																																																								       lowercase : {
   																																																																										    character : '\u2035', /* REVERSED PRIME */
   																																																																										    mac : {
   																																																																											   hotkey : '',
   																																																																											   shortcut : ''
   																																																																											  },
   																																																																										    win : {
   																																																																											   hotkey : 'Alt+0+1+4+5',
   																																																																											   shortcut : 'Alt +0145'
   																																																																											  }
   																																																																										   }
   																																																																								      },
   																																																																								      
   																																																																												   // next line 5
   																																																																												      {
   																																																																														   lowercase : {
   																																																																																 character : '\u2026', /* HORIZONTAL ELLIPSIS */
   																																																																																 mac : {
   																																																																																	 hotkey : 'Option++',
   																																																																																	  shortcut : 'Option ++'
   																																																																																	},
   																																																																																    win : {
   																																																																																	   hotkey : 'Alt+0+1+3+3',
   																																																																																	   shortcut : 'Alt +0133'
   																																																																																	  }
   																																																																																   }
   																																																																														      },																																																						      
   																																																																														      	// next line 3
   																																																																															      {
   																																																																																       lowercase : {
   																																																																																		    character : '\u00AF', /* MACRON */
   																																																																																		    mac : {
   																																																																																			   hotkey : '',
   																																																																																			   shortcut : ''
   																																																																																			  },
   																																																																																		    win : {
   																																																																																			   hotkey : '',
   																																																																																			   shortcut : ''
   																																																																																			  }
   																																																																																		   }
   																																																																																      },
   																																																																																			      // next line 6
   																																																																																			      {
   																																																																																						       lowercase : {
   																																																																																								    character : '\u0332', /* COMBINING LOW LINE */
   																																																																																								    mac : {
   																																																																																									   hotkey : '',
   																																																																																									   shortcut : ''
   																																																																																									  },
   																																																																																								    win : {
   																																																																																									   hotkey : '',
   																																																																																									   shortcut : ''
   																																																																																									  }
   																																																																																								   }
   																																																																																						      },{
   																																																																																							       lowercase : {
   																																																																																									    character : '\u00A7', /* SECTION SIGN */
   																																																																																									    mac : {
   																																																																																										   hotkey : '',
   																																																																																										   shortcut : ''
   																																																																																										  },
   																																																																																									    win : {
   																																																																																										   hotkey : 'Alt+0+1+6+7',
   																																																																																										   shortcut : 'Alt +0167'
   																																																																																										  }
   																																																																																									   }
   																																																																																							      },																																															
   																																																																																								      {
   																																																																																									       lowercase : {
   																																																																																											    character : '\u00AC', /* NOT SIGN */
   																																																																																											    mac : {
   																																																																																												   hotkey : '',
   																																																																																												   shortcut : ''
   																																																																																												  },
   																																																																																											    win : {
   																																																																																												   hotkey : 'Alt+0+1+7+2',
   																																																																																												   shortcut : 'Alt +0172'
   																																																																																												  }
   																																																																																											   }
   																																																																																									      },
   																																																																																								      {
   																																																																																									       lowercase : {
   																																																																																											    character : '\u00B6', /* PILCROW SIGN */
   																																																																																											    mac : {
   																																																																																												   hotkey : '',
   																																																																																												   shortcut : ''
   																																																																																												  },
   																																																																																											    win : {
   																																																																																												   hotkey : 'Alt+0+1+8+2',
   																																																																																												   shortcut : 'Alt +0182'
   																																																																																												  }
   																																																																																											   }
   																																																																																									      },
   																																																																																									      {
   																																																																																										   lowercase : {
   																																																																																											    character : '\u2020', /* DAGGER */
   																																																																																												mac : {
   																																																																																													hotkey : 'Option+t',
   																																																																																													shortcut : 'Option +t'
   																																																																																												},
   																																																																																												win : {
   																																																																																													hotkey : 'Alt+0+1+3+4',
   																																																																																													shortcut : 'Alt +0134'
   																																																																																												}
   																																																																																												}
   																																																																																										      },
   																																																																																										      {
   																																																																																												   lowercase : {
   																																																																																													    character : '\u2021', /* DOUBLE DAGGER */
   																																																																																														mac : {
   																																																																																															hotkey : '',
   																																																																																															shortcut : ''
   																																																																																														},
   																																																																																														win : {
   																																																																																															hotkey : 'Alt+0+1+3+5',
   																																																																																															shortcut : 'Alt +0135'
   																																																																																														}
   																																																																																														}
   																																																																																														
   																																																																																												      },
   																																																																																												      
   																																																																																												      {
   																																																																																														   lowercase : {
   																																																																																																 character : '\u0040', /* COMMERCIAL AT */  
   																																																																																																 mac : {
   																																																																																																	 hotkey : '',
   																																																																																																	  shortcut : ''
   																																																																																																	},
   																																																																																																    win : {
   																																																																																																	   hotkey : 'Alt+6+4',
   																																																																																																	   shortcut : 'Alt +64'
   																																																																																																	  }
   																																																																																																   }
   																																																																																														      },
   																																																																																															      {
   																																																																																																       lowercase : {
   																																																																																																		    character : '\u2030',  /* PER MILLE SIGN */ 
   																																																																																																		    mac : {
   																																																																																																			   hotkey : 'Shift+Option+r',
   																																																																																																			   shortcut : 'Shoft +Option +r'
   																																																																																																			  },
   																																																																																																		    win : {
   																																																																																																			   hotkey : 'Alt+0+1+3+7',
   																																																																																																			   shortcut : 'Alt +0137'
   																																																																																																			  }
   																																																																																																		   }
   																																																																																																      },
   																																																																																																      {
   																																																																																																	       lowercase : {
   																																																																																																			    character : '\u2031',  /*PER TEN THOUSAND SIGN */  
   																																																																																																			    mac : {
   																																																																																																				   hotkey : '',
   																																																																																																				   shortcut : ''
   																																																																																																				  },
   																																																																																																			    win : {
   																																																																																																				   hotkey : '',
   																																																																																																				   shortcut : ''
   																																																																																																				  }
   																																																																																																			   }
   																																																																																																	      },
   																																																																																																	   // next line 4
   																																																																																																	      {
   																																																																																																		       lowercase : {
   																																																																																																				    character : '\u00A6',  /*  */  
   																																																																																																				    mac : {
   																																																																																																					   hotkey : '',
   																																																																																																					   shortcut : ''
   																																																																																																					  },
   																																																																																																				    win : {
   																																																																																																					   hotkey : 'Alt+0+1+6+6',
   																																																																																																					   shortcut : 'Alt +0166'
   																																																																																																					  }
   																																																																																																				   }
   																																																																																																		      },
   																																																																																																	      
   																																																																																																		      {
   																																																																																																			   lowercase : {
   																																																																																																				    character : '\u002F',  /*  */  
   																																																																																																					mac : {
   																																																																																																						hotkey : '',
   																																																																																																						shortcut : ''
   																																																																																																					},
   																																																																																																					win : {
   																																																																																																						hotkey : 'Alt+4+7',
   																																																																																																						shortcut : 'Alt +47'
   																																																																																																					}
   																																																																																																					}
   																																																																																																			      },
   																																																																																																			      {
																																																																																																				   lowercase : {
																																																																																																					    character : '\u005C', /*  */   
																																																																																																						mac : {
																																																																																																							hotkey : '',
																																																																																																							shortcut : ''
																																																																																																						},
																																																																																																						win : {
																																																																																																							hotkey : 'Alt+9+2',
																																																																																																							shortcut : 'Alt +92'
																																																																																																						}
																																																																																																						}
																																																																																																				      },
																																																																																																				      {
																																																																																																					       lowercase : {
																																																																																																							    character : '\u2014',  /*  */  
																																																																																																							    mac : {
																																																																																																								   hotkey : 'Shift+Option+-',
																																																																																																								   shortcut : 'Shift+Option+-'
																																																																																																								  },
																																																																																																							    win : {
																																																																																																								   hotkey : 'Ctrl+Alt+-',
																																																																																																								   shortcut : 'Alt +0151'
																																																																																																								  }
																																																																																																							   }
																																																																																																					      },
   																																																																																																										      
																																																																																																					      {
																																																																																																						       lowercase : {
																																																																																																								    character : '\u0336',   
																																																																																																								    mac : {
																																																																																																									   hotkey : '',
																																																																																																									   shortcut : ''
																																																																																																									  },
																																																																																																								    win : {
																																																																																																									   hotkey : '',
																																																																																																									   shortcut : ''
																																																																																																									  }
																																																																																																								   }
																																																																																																						      },
																																																																																																						             
																																																																																									      
   																										
   																													      
   																													     							      
   																													      {
   																													       lowercase : {
   																															    character : '\u00A9',  /*  */
   																															    mac : {
   																																   hotkey : 'Option+g',
   																																   shortcut : 'Option +g'
   																																  },
   																															    win : {
   																																   hotkey : 'Alt+0+1+6+9',
   																																   shortcut : 'Alt +0169'
   																																  }
   																															   }
   																													       
   																													      },
   																													      
   																													
   																													   {
   																													       lowercase : {
   																															    character : '\u00A5', /*  */
   																															    mac : {
   																																   hotkey : '',
   																																   shortcut : ''
   																																  },
   																															    win : {
   																																   hotkey : 'Alt+0+1+6+5',
   																																   shortcut : 'Alt +0165'
   																																  }
   																															   }
   																													       
   																													      },
   																													      
   																													      {
   																													       lowercase : {
   																															    character : '\u00AE', /*  */
   																															    mac : {
   																																   hotkey : 'Option+R',
   																																   shortcut : 'Option +R'
   																																  },
   																															    win : {
   																																   hotkey : 'Alt+0+1+7+4',
   																																   shortcut : 'Alt +0174'
   																																  }
   																															   }
   																													     
   																													      },
   																													   //line Number 5
   																													      
   																													      {
   																													       lowercase : {
   																															    character : '\u00B1', /*  */
   																															    mac : {
   																																   hotkey : 'Shift+Option+=',
   																																   shortcut : 'Shift +Option +='
   																																  },
   																															    win : {
   																																   hotkey : 'Alt+0+1+7+7',
   																																   shortcut : 'Alt +0177'
   																																  }  
   																															   }
   																													      },
   																													      	     {
   																																	      lowercase : {
   																																			   character : '\u00BF',  /*  */
   																																			   mac : {
   																																				  hotkey : '',
   																																				  shortcut : ''
   																																				 },
   																																			   win : {
   																																				  hotkey : '',
   																																				  shortcut : ''
   																																				 }
   																																			  }
   																																	     },
   																																	     
   																																		    //line Number 5
   																																			     {
   																																				      lowercase : {
   																																						   character : '\u266B',  /*  */
   																																						   mac : {
   																																							  hotkey : '',
   																																							  shortcut : ''
   																																							 },
   																																						   win : {
   																																							  hotkey : '',
   																																							  shortcut : ''
   																																							 }
   																																						  }
   																																				     },
   																																					     {
   																																						      lowercase : {
   																																								   character : '\u260E',  /*  */
   																																								   mac : {
   																																									  hotkey : '',
   																																									  shortcut : ''
   																																									 },
   																																								   win : {
   																																									  hotkey : '',
   																																									  shortcut : ''
   																																									 }
   																																								  }
   																																						     },
   																																						     {
   														   																								       lowercase : {
   													   																										    character : '\u00A1', /* Inverted exclamation mark */
   													   																										    mac : {
   													   																											   hotkey : 'Option+1',
   													   																											   shortcut : 'Option +1'
   													   																											  },
   													   																										    win : {
   													   																											   hotkey : 'Alt+0+1+6+1',
   													   																											   shortcut : 'Alt +0161'
   													   																											  }  
   													   																										   },
   													   																								       uppercase : {
   													   																										    character : '\u00A1', /* Inverted exclamation mark */
   													   																										    mac : {
   													   																											   hotkey : 'Option+1',
   													   																											   shortcut : 'Option +1'
   													   																											  },
   													   																										    win : {
   													   																											   hotkey : 'Alt+0+1+6+1', 
   													   																											   shortcut : 'Alt +0161'
   													   																											  }
   													   																										   }
   													   																								      },
   											   																										     {
   											   																											      lowercase : {
   											   																													   character : '\u20AC', /* EURO SIGN */
   											   																													   mac : {
   											   																														  hotkey : 'Shift+Option+2',
   											   																														  shortcut : 'Shift +Option+2'
   											   																														 },
   											   																													   win : {
   											   																														  hotkey : 'Alt+0+1+2+8',  
   											   																														  shortcut : 'Alt +0128'
   											   																														 }
   											   																													  },
   											   																											      uppercase : {
   											   																													   character : '\u20AC', /* EURO SIGN */
   											   																													   mac : {
   											   																														  hotkey : 'Shift+Option+2',
   											   																														  shortcut : 'Shift +Option+2'
   											   																														 },
   											   																													   win : {
   											   																														  hotkey : 'Alt+0+1+2+8',  
   											   																														  shortcut : 'Alt +0128'
   											   																														 }
   											   																													  }
   											   																											     }
   																													     
   																													      
   																													     ],
   																										math : [
   																										    {
   																										      lowercase : {
   																										    	  character : '\u002B',//  '\u002B',/*---for plus sign-----*/
   																										    	  mac : {
   																										    		  hotkey : '',
   																										    		  shortcut : ''
   																										    	  },
   																										    	  win : {
   																													   hotkey : 'Alt+0+0+2+B',
   																													   shortcut : 'Alt +002B'
   																												  }
   																										      }
   																										    },
   																										    {
   																											      lowercase : {
   																											    	  character : '\u002D',/*---for minus sign ---*/
   																											    	  mac : {
   																											    		  hotkey : '',
   																											    		  shortcut : ''
   																											    	  },
   																											    	  win : {
   																														   hotkey : 'Alt+0+0+2+D',
   																														   shortcut : 'Alt +002D'
   																													  }
   																											      }
   																											      
   																											      
   																											    },
   																											    {
   																												      lowercase : {
   																												    	  character : '\u00D7',/*---for multiplication sign ---*/
   																												    	  mac : {
   																												    		  hotkey : '',
   																												    		  shortcut : ''
   																												    	  },
   																												    	  win : {
   																															   hotkey : '',
   																															   shortcut : ''
   																														  }
   																												      }
   																												      
   																												      
   																												    },
   																												    {
   																													      lowercase : {
   																													    	  character : '\u00F7',/*---for division sign ---*/
   																													    	  mac : {
   																													    		  hotkey : 'Option+/',
   																													    		  shortcut : 'Option +/'
   																													    	  },
   																													    	  win : {
   																																   hotkey : 'Alt+0+2+4+7',
   																																   shortcut : 'Alt +0247'
   																															  }
   																													      }
   																													      
   																													      
   																													    },
   																													    {
   																														      lowercase : {
   																														    	  character : '\u00B1',/*---- for plus - minus sign -----*/
   																														    	  mac : {
   																														    		  hotkey : 'Shift+Option+=',
   																														    		  shortcut : 'Shift +Option +='
   																														    	  },
   																														    	  win : {
   																																	   hotkey : 'Alt+0+1+7+7',
   																																	   shortcut : 'Alt +0177'
   																																  }
   																														      }
   																														      
   																														      
   																														    },
   																														    
   																															    {
   																																      lowercase : {
   																																    	  character : '\u003C',/*---- for less than sign -----*/
   																																    	  mac : {
   																																    		  hotkey : '',
   																																    		  shortcut : ''
   																																    	  },
   																																    	  win : {
   																																			   hotkey : 'Alt+6+0',
   																																			   shortcut : 'Alt +60'
   																																		  }
   																																      }
   																																      
   																																      
   																																    },
   																																    {
   																																	      lowercase : {
   																																	    	  character : '\u003E',/*---- for greater than sign -----*/
   																																	    	  mac : {
   																																	    		  hotkey : '',
   																																	    		  shortcut : ''
   																																	    	  },
   																																	    	  win : {
   																																				   hotkey : 'Alt+6+2',
   																																				   shortcut : 'Alt +62'
   																																			  }
   																																	      }
   																																	      
   																																	      
   																																	    },
   																																	    {
   																																		      lowercase : {
   																																		    	  character : '\u003D',/*---- for = sign -----*/
   																																		    	  mac : {
   																																		    		  hotkey : '',
   																																		    		  shortcut : ''
   																																		    	  },
   																																		    	  win : {
   																																					   hotkey : 'Alt+6+1',
   																																					   shortcut : 'Alt +61'
   																																				  }
   																																		      }
   																																		      
   																																		      
   																																		    },
   																																		    {
   																																			      lowercase : {
   																																			    	  character : '\u2260',/*---- for not = sign -----*/
   																																			    	  mac : {
   																																			    		  hotkey : 'Option+=',
   																																			    		  shortcut : 'Option +='
   																																			    	  },
   																																			    	  win : {
   																																						   hotkey : '',
   																																						   shortcut : ''
   																																					  }
   																																			      }
   																																			      
   																																			      
   																																			    },
   																																			    {
   																																				      lowercase : {
   																																				    	  character : '\u2264',/*---- for <= sign -----*/
   																																				    	  mac : {
   																																				    		  hotkey : 'Option+<',
   																																				    		  shortcut : 'Option +<'
   																																				    	  },
   																																				    	  win : {
   																																							   hotkey : 'Alt+2+4+3',
   																																							   shortcut : 'Alt +243'
   																																						  }
   																																				      }
   																																				      
   																																				      
   																																				    },
   																																				    {
   																																					      lowercase : {
   																																					    	  character : '\u2265',/*---- for >= sign -----*/
   																																					    	  mac : {
   																																					    		  hotkey : 'Option+>',
   																																					    		  shortcut : 'Option +>'
   																																					    	  },
   																																					    	  win : {
   																																								   hotkey : 'Alt+2+4+2',
   																																								   shortcut : 'Alt +242'
   																																							  }
   																																					      }
   																																					      
   																																					      
   																																					    },
   																																					    {
   																																						      lowercase : {
   																																						    	  character : '\u2245',/*---- for approximately equal sign -----*/
   																																						    	  mac : {
   																																						    		  hotkey : '',
   																																						    		  shortcut : ''
   																																						    	  },
   																																						    	  win : {
   																																									   hotkey : '',
   																																									   shortcut : ''
   																																								  }
   																																						      }
   																																						      
   																																						      
   																																						    },
   																																						    {
   																																							      lowercase : {
   																																							    	  character : '\u2249',/*---- for NOT ALMOST EQUAL TO sign -----*/
   																																							    	  mac : {
   																																							    		  hotkey : '',
   																																							    		  shortcut : ''
   																																							    	  },
   																																							    	  win : {
   																																										   hotkey : '',
   																																										   shortcut : ''
   																																									  }
   																																							      }
   																																							      
   																																							      
   																																							    },
   																																						    {
   																																							      lowercase : {
   																																							    	  character : '\u03C0',/*---- for pi sign -----*/
   																																							    	  mac : {
   																																							    		  hotkey : '',
   																																							    		  shortcut : ''
   																																							    	  },
   																																							    	  win : {
   																																										   hotkey : 'Alt+2+2+7',
   																																										   shortcut : 'Alt +227'
   																																									  }
   																																							      }
   																																							      
   																																							      
   																																							    },
   																																							    {
   																																								      lowercase : {
   																																								    	  character : '\u223C',/*---- for TILDE SIMILAR TO sign -----*/
   																																								    	  mac : {
   																																								    		  hotkey : '',
   																																								    		  shortcut : ''
   																																								    	  },
   																																								    	  win : {
   																																											   hotkey : '',
   																																											   shortcut : ''
   																																										  }
   																																								      }
   																																								      
   																																								      
   																																								    },
   																																								    {
   																																									      lowercase : {
   																																									    	  character : '\u2248',/*---- for ALMOST EQUAL (ASYMPTOTIC) â‰ˆ sign -----*/
   																																									    	  mac : {
   																																									    		  hotkey : 'Option+X',
   																																									    		  shortcut : 'Option +X'
   																																									    	  },
   																																									    	  win : {
   																																												   hotkey : 'Alt+2+4+7',
   																																												   shortcut : 'Alt +247'
   																																											  }
   																																									      }
   																																									      
   																																									      
   																																									    },												
   																																											    {
   																																												      lowercase : {
   																																												    	  character : '\u221E',/*----for INFINITY	âˆž sign -----*/
   																																												    	  mac : {
   																																												    		  hotkey : 'Option+5',
   																																												    		  shortcut : 'Option +5'
   																																												    	  },
   																																												    	  win : {
   																																															   hotkey : '',
   																																															   shortcut : ''
   																																														  }
   																																												      }
   																																												      
   																																												      
   																																												    },
   																																												    {
   																																												    	  lowercase : {
   																																														    character : '\u002F', /* Slash (Solidus) */
   																																														    mac : {
   																																															   hotkey : '',
   																																															   shortcut : ''
   																																															  },
   																																														    win : {
   																																															   hotkey : 'Alt+4+7',
   																																															   shortcut : 'Alt +47'
   																																															  }
   																																														   },
   																																												      },																						   
   																																												    {
   																																													      lowercase : {
   																																													    	  character : '\u00B0',/*---- for degree sign -----*/
   																																													    	  mac : {
   																																													    		  hotkey : 'Option+Shift+8',
   																																													    		  shortcut : 'Option +Shift 8'
   																																													    	  },
   																																													    	  win : {
   																																																   hotkey : 'Alt+0+1+7+6',
   																																																   shortcut : 'Alt +0176'
   																																															  }
   																																													      }
   																																													      
   																																													      
   																																													    },
   																																												    {
   																																													      lowercase : {
   																																													    	  character : '\u221D',/*----for INFINITY	âˆž sign -----*/  
   																																													    	  mac : {
   																																													    		  hotkey : 'Option+5',
   																																													    		  shortcut : 'Option +5'
   																																													    	  },
   																																													    	  win : {
   																																																   hotkey : '',
   																																																   shortcut : ''
   																																															  }
   																																													      }
   																																													      
   																																													      
   																																													    },
   																																												    {
   																																													      lowercase : {
   																																													    	  character : '\u221A',/*----SQUARE ROOT RADICAL	âˆš  sign -----*/
   																																													    	  mac : {
   																																													    		  hotkey : 'Option+v',
   																																													    		  shortcut : 'Option +v'
   																																													    	  },
   																																													    	  win : {
   																																																   hotkey : 'Alt+2+5+1',
   																																																   shortcut : 'Alt +251'
   																																															  }
   																																													      }
   																																													      
   																																													      
   																																													    },
   																																													    {
   																																														      lowercase : {
   																																														    	  character : '\u00BC ',/*---- for ONE QUARTER 1/4 sign -----*/
   																																														    	  mac : {
   																																														    		  hotkey : '',
   																																														    		  shortcut : ''
   																																														    	  },
   																																														    	  win : {
   																																																	   hotkey : 'Alt+0+1+8+8',
   																																																	   shortcut : 'Alt +0188'
   																																																  }
   																																														      }
   																																														      
   																																														      
   																																														    },
   																																														    {
   																																															      lowercase : {
   																																															    	  character : '\u00BD',/*---- for ONE HALF 1/2 sign-----*/
   																																															    	  mac : {
   																																															    		  hotkey : '',
   																																															    		  shortcut : ''
   																																															    	  },
   																																															    	  win : {
   																																																		   hotkey : 'Alt+0+1+8+9',
   																																																		   shortcut : 'Alt +0189'
   																																																	  }
   																																															      }
   																																															      
   																																															      
   																																															    },
   																																																    {
   																																																	      lowercase : {
   																																																	    	  character : '\u00BE',/*---- for THREE QUARTER 3/4 sign-----*/
   																																																	    	  mac : {
   																																																	    		  hotkey : '',
   																																																	    		  shortcut : ''
   																																																	    	  },
   																																																	    	  win : {
   																																																				   hotkey : 'Alt+0+1+9+0',
   																																																				   shortcut : 'Alt +190'
   																																																			  }
   																																																	      }
   																																																	      
   																																																	      
   																																																	    },
   																																																	    {
   																																																		      lowercase : {
   																																																		    	  character : '\u22C5',/*---- for DOT OPERATOR  sign-----*/
   																																																		    	  mac : {
   																																																		    		  hotkey : '',
   																																																		    		  shortcut : ''
   																																																		    	  },
   																																																		    	  win : {
   																																																					   hotkey : 'Alt+0+1+8+3',
   																																																					   shortcut : 'Alt +0183'
   																																																				  }
   																																																		      }
   																																																		      
   																																																		      
   																																																		    },
   																																							    {
   																																								      lowercase : {
   																																								    	  character : '\u212F',/*---- for exponential sign -----*/
   																																								    	  mac : {
   																																								    		  hotkey : '',
   																																								    		  shortcut : ''
   																																								    	  },
   																																								    	  win : {
   																																											   hotkey : '',
   																																											   shortcut : ''
   																																										  }
   																																								      }
   																																								      
   																																								      
   																																								    },																		    
   																																													    {
   																																													    	  lowercase : {
   																																															    character : '\u2190', /* LEFTWARDS ARROW â†� */
   																																															    mac : {
   																																																   hotkey : '',
   																																																   shortcut : ''
   																																																  },
   																																															    win : {
   																																																   hotkey : 'Alt+2+7',
   																																																   shortcut : 'Alt +27'
   																																																  }
   																																															   },
   																																													      },
   																																													      {
   																																													    	  lowercase : {
   																																															    character : '\u2191', /* 	UPWARDS ARROW 	â†‘ */
   																																															    mac : {
   																																																   hotkey : '',
   																																																   shortcut : ''
   																																																  },
   																																															    win : {
   																																																   hotkey : 'Alt+2+4',
   																																																   shortcut : 'Alt +24'
   																																																  }
   																																															   },
   																																													      },
   																																													      {
   																																													    	  lowercase : {
   																																															    character : '\u2192', /* 	RIGHTWARDS ARROW 	â†’ */
   																																															    mac : {
   																																																   hotkey : '',
   																																																   shortcut : ''
   																																																  },
   																																															    win : {
   																																																   hotkey : 'Alt+2+6',
   																																																   shortcut : 'Alt +26'
   																																																  }
   																																															   },
   																																													      },
   																																													      {
   																																													    	  lowercase : {
   																																															    character : '\u2193', /* DOWNWARDS ARROW 	â†“ */
   																																															    mac : {
   																																																   hotkey : '',
   																																																   shortcut : ''
   																																																  },
   																																															    win : {
   																																																   hotkey : 'Alt+2+5',
   																																																   shortcut : 'Alt +25'
   																																																  }
   																																															   },
   																																													      },
   																																													      {
   																																													    	  lowercase : {
   																																															    character : '\u2195', /* UP DOWN ARROW â†• */
   																																															    mac : {
   																																																   hotkey : '',
   																																																   shortcut : ''
   																																																  },
   																																															    win : {
   																																																   hotkey : 'Alt+2+3',
   																																																   shortcut : 'Alt +23'
   																																																  }
   																																															   },
   																																													      },
   																																													      {
   																																													    	  lowercase : {
   																																															    character : '\u2194', /*LEFT RIGHT ARROW*/
   																																															    mac : {
   																																																   hotkey : '',
   																																																   shortcut : ''
   																																																  },
   																																															    win : {
   																																																   hotkey : 'Alt+2+1+9+4',
   																																																   shortcut : 'Alt +2194'
   																																																  }
   																																															   },
   																																													      },
   																																													      {
   																																													    	  lowercase : {
     																																															    character : '\u2202', /*PARTIAL DIFFERENTIAL*/
     																																															    mac : {
     																																																   hotkey : '',
     																																																   shortcut : ''
     																																																  },
     																																															    win : {
     																																																   hotkey : 'Alt+2+2+0+2',
     																																																   shortcut : 'Alt +2202'
     																																																  }
     																																															   },
     																																													      }																					      
   																																													      
   																										],
   																										//-------------- math unicode ends here --------------------
   																										  
   																									      
   																									      //######## Subscript starts here --------------------
   																										
   																										subscript : [{
   																									      lowercase : {
   																									    	  character : '\u2080',/*---for zero-----*/
   																									    	  mac : {
   																									    		  hotkey : '',
   																									    		  shortcut : ''
   																									    	  },
   																									    	  win : {
   																												   hotkey : '',
   																												   shortcut : ''
   																											  }
   																									      }
   																									      
   																									      
   																									    },
   																									    {
   																									      lowercase : {
   																									    	  character : '\u2081',/*---for one-----*/
   																									    	  mac : {
   																									    		  hotkey : '',
   																									    		  shortcut : ''
   																									    	  },
   																									    	  win : {
   																												   hotkey : '',
   																												   shortcut : ''
   																											  }
   																									      }
   																									      
   																									      
   																									    },
   																									    {
   																										      lowercase : {
   																										    	  character : '\u2082',/*---for two-----*/
   																										    	  mac : {
   																										    		  hotkey : '',
   																										    		  shortcut : ''
   																										    	  },
   																										    	  win : {
   																													   hotkey : '',
   																													   shortcut : ''
   																												  }
   																										      }
   																										      
   																										      
   																										  },
   																										  {
   																										      lowercase : {
   																										    	  character : '\u2083',/*---for three-----*/
   																										    	  mac : {
   																										    		  hotkey : '',
   																										    		  shortcut : ''
   																										    	  },
   																										    	  win : {
   																													   hotkey : '',
   																													   shortcut : ''
   																												  }
   																										      }
   																										      
   																										      
   																										  },
   																										  {
   																										      lowercase : {
   																										    	  character : '\u2084',/*---for four-----*/
   																										    	  mac : {
   																										    		  hotkey : '',
   																										    		  shortcut : ''
   																										    	  },
   																										    	  win : {
   																													   hotkey : '',
   																													   shortcut : ''
   																												  }
   																										      }
   																										  },
   																										  {
   																										      lowercase : {
   																										    	  character : '\u2085',/*---for five-----*/
   																										    	  mac : {
   																										    		  hotkey : '',
   																										    		  shortcut : ''
   																										    	  },
   																										    	  win : {
   																													   hotkey : '',
   																													   shortcut : ''
   																												  }
   																										      }
   																										      
   																										      
   																										    },
   																										    {
   																											      lowercase : {
   																											    	  character : '\u2086',/*---for six-----*/
   																											    	  mac : {
   																											    		  hotkey : '',
   																											    		  shortcut : ''
   																											    	  },
   																											    	  win : {
   																														   hotkey : '',
   																														   shortcut : ''
   																													  }
   																											      }
   																											      
   																											      
   																											  },
   																											  {
   																											      lowercase : {
   																											    	  character : '\u2087',/*---for seven-----*/
   																											    	  mac : {
   																											    		  hotkey : '',
   																											    		  shortcut : ''
   																											    	  },
   																											    	  win : {
   																														   hotkey : '',
   																														   shortcut : ''
   																													  }
   																											      }
   																											      
   																											      
   																											  },
   																											  {
   																											      lowercase : {
   																											    	  character : '\u2088',/*---for eight-----*/
   																											    	  mac : {
   																											    		  hotkey : '',
   																											    		  shortcut : ''
   																											    	  },
   																											    	  win : {
   																														   hotkey : '',
   																														   shortcut : ''
   																													  }
   																											      }
   																											  },
   																											  {
   																											      lowercase : {
   																											    	  character : '\u2089',/*---for nine-----*/
   																											    	  mac : {
   																											    		  hotkey : '',
   																											    		  shortcut : ''
   																											    	  },
   																											    	  win : {
   																														   hotkey : '',
   																														   shortcut : ''
   																													  }
   																											      }
   																											      
   																											      
   																											  },
   																											  {
   																											      lowercase : {
   																											    	  character : '\u208A',/*---for plus sign-----*/
   																											    	  mac : {
   																											    		  hotkey : '',
   																											    		  shortcut : ''
   																											    	  },
   																											    	  win : {
   																														   hotkey : '',
   																														   shortcut : ''
   																													  }
   																											      }
   																											      
   																											      
   																											  },
   																											  {
   																											  lowercase : {
   																										    	  character : '\u208B',/*---for minus sign-----*/
   																										    	  mac : {
   																										    		  hotkey : '',
   																										    		  shortcut : ''
   																										    	  },
   																										    	  win : {
   																													   hotkey : '',
   																													   shortcut : ''
   																												  }
   																										      }
   																										      
   																										      
   																										    },
   																										    {
   																										      lowercase : {
   																										    	  character : '\u208C',/*---for equal sign-----*/
   																										    	  mac : {
   																										    		  hotkey : '',
   																										    		  shortcut : ''
   																										    	  },
   																										    	  win : {
   																													   hotkey : '',
   																													   shortcut : ''
   																												  }
   																										      }
   																										      
   																										      
   																										    },
   																										    {
   																											      lowercase : {
   																											    	  character : '\u208D',/*---for first open bracket-----*/
   																											    	  mac : {
   																											    		  hotkey : '',
   																											    		  shortcut : ''
   																											    	  },
   																											    	  win : {
   																														   hotkey : '',
   																														   shortcut : ''
   																													  }
   																											      }
   																											      
   																											      
   																											  },
   																											  {
   																											      lowercase : {
   																											    	  character : '\u208E',/*---for first close bracket-----*/
   																											    	  mac : {
   																											    		  hotkey : '',
   																											    		  shortcut : ''
   																											    	  },
   																											    	  win : {
   																														   hotkey : '',
   																														   shortcut : ''
   																													  }
   																											      }
   																											      
   																											      
   																											  },
   																											  {
   																											      lowercase : {
   																											    	  character : '\u2090',/*---for a-----*/
   																											    	  mac : {
   																											    		  hotkey : '',
   																											    		  shortcut : ''
   																											    	  },
   																											    	  win : {
   																														   hotkey : '',
   																														   shortcut : ''
   																													  }
   																											      }
   																											  },
   																												    {
   																												      lowercase : {
   																												    	  character : '\u2091',/*---for e----*/
   																												    	  mac : {
   																												    		  hotkey : '',
   																												    		  shortcut : ''
   																												    	  },
   																												    	  win : {
   																															   hotkey : '',
   																															   shortcut : ''
   																														  }
   																												      }
   																												      
   																												      
   																												    },
   																												    {
   																												      lowercase : {
   																												    	  character : '\u2092',/*---for o----*/
   																												    	  mac : {
   																												    		  hotkey : '',
   																												    		  shortcut : ''
   																												    	  },
   																												    	  win : {
   																															   hotkey : '',
   																															   shortcut : ''
   																														  }
   																												      }
   																												      
   																												      
   																												    },
   																												    {
   																													      lowercase : {
   																													    	  character : '\u2093',/*---for x-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },				],
   																													  
   																												      //########Subscript ended here

   																													//***************Superscript added here																										  							
   																													  superscript : [ {
   																												      lowercase : {
   																												    	  character : '\u2070',/*---for zero-----*/
   																												    	  mac : {
   																												    		  hotkey : '',
   																												    		  shortcut : ''
   																												    	  },
   																												    	  win : {
   																															   hotkey : '',
   																															   shortcut : ''
   																														  }
   																												      }
   																												      
   																												      
   																												    },
   																												 {
   																												      lowercase : {
   																												    	  character : '\u00B9',/*---for one-----*/
   																												    	  mac : {
   																												    		  hotkey : '',
   																												    		  shortcut : ''
   																												    	  },
   																												    	  win : {
   																															   hotkey : '',
   																															   shortcut : ''
   																														  }
   																												      }
   																												      
   																												      
   																												  },
   																												  {
   																												      lowercase : {
   																												    	  character : '\u00B2',/*---for two-----*/
   																												    	  mac : {
   																												    		  hotkey : '',
   																												    		  shortcut : ''
   																												    	  },
   																												    	  win : {
   																															   hotkey : '',
   																															   shortcut : ''
   																														  }
   																												      }
   																												      
   																												      
   																												  },
   																												  {
   																												      lowercase : {
   																												    	  character : '\u00B3',/*---for three-----*/
   																												    	  mac : {
   																												    		  hotkey : '',
   																												    		  shortcut : ''
   																												    	  },
   																												    	  win : {
   																															   hotkey : '',
   																															   shortcut : ''
   																														  }
   																												      }
   																												  },
   																												  {
   																												      lowercase : {
   																												    	  character : '\u2074',/*---for four-----*/
   																												    	  mac : {
   																												    		  hotkey : '',
   																												    		  shortcut : ''
   																												    	  },
   																												    	  win : {
   																															   hotkey : '',
   																															   shortcut : ''
   																														  }
   																												      }
   																												      
   																												      
   																												    },
   																												    {
   																													      lowercase : {
   																													    	  character : '\u2075',/*---for five-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u2076',/*---for six-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u2077',/*---for seven-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u2078',/*---for eight-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u2079',/*---for nine-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u207A',/*---for plus sign-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													  }, {
   																													      lowercase : {
   																													    	  character : '\u207B',/*---for minus sign-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u207C',/*---for equal sign-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u207D',/*---for (-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													  }, {
   																													      lowercase : {
   																													    	  character : '\u207E',/*---for )-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u02C2',/*---for < -----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u02C3',/*---for >-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  }, {
   																													      lowercase : {
   																													    	  character : '\u02C4',/*---for ^-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u02D9',/*---for .-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													  }, {
   																													      lowercase : {
   																													    	  character : '\u1D43',/*---for a-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u1D47',/*---for b-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u02D3',/*---for c-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  }, {
   																													      lowercase : {
   																													    	  character : '\u1D48',/*---for d-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u1D49',/*---for e-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													  }, {
   																													      lowercase : {
   																													    	  character : '\u02B0',/*---for h-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u02C8',/*---for i----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u02B2',/*---for j-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  }, {
   																													      lowercase : {
   																													    	  character : '\u1D37',/*---for k-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u02E1',/*---for l-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  }, {
   																													      lowercase : {
   																													    	  character : '\u1D50',/*---for m-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u207F',/*---for n-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  }, {
   																													      lowercase : {
   																													    	  character : '\u1D52',/*---for o-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u1D56',/*---for p-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  }, {
   																													      lowercase : {
   																													    	  character : '\u02B3',/*---for r-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u02E2',/*---for s-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  }, {
   																													      lowercase : {
   																													    	  character : '\u1D57',/*---for t-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													 {
   																													      lowercase : {
   																													    	  character : '\u1D58',/*---for u-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  }, {
   																													      lowercase : {
   																													    	  character : '\u02C5',/*---for v-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u02B7',/*---for w-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  },
   																													  {
   																													      lowercase : {
   																													    	  character : '\u02B8',/*---for y-----*/
   																													    	  mac : {
   																													    		  hotkey : '',
   																													    		  shortcut : ''
   																													    	  },
   																													    	  win : {
   																																   hotkey : '',
   																																   shortcut : ''
   																															  }
   																													      }
   																													      
   																													      
   																													  } 
   																									
   																					],
   																					//********* *****Superscript ended here	
   																					//********* *****Greek palette starts from here*********************//
   																					greek : [
   																	        				{
   																	        				   lowercase : {
   																	        						    character : '\u03b1', 
   																	        						    mac : {
   																	        							   hotkey : '',
   																	        							   shortcut : ''
   																	        							  },
   																	        						    win : {
   																	        							   hotkey : '',
   																	        							   shortcut : ''
   																	        							  }
   																	        						   },
   																	        				    uppercase : {
   																	        						    character : '\u0391', 
   																	        						    mac : {
   																	        							   hotkey : '',
   																	        							   shortcut : ''
   																	        							  },
   																	        						    win : {
   																	        							   hotkey : '',
   																	        							   shortcut : ''
   																	        							  }
   																	        						   }
   																	        				   },
   																	        				     {
   																	        				      lowercase : {
   																	        						   character : '\u03b2', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u0392', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },
   																	        				     {
   																	        				      lowercase : {
   																	        						   character : '\u03b3', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u0393', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },
   																	        				     {
   																	        				      lowercase : {
   																	        						   character : '\u03b4', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u0394', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03b5', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u0395', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03b6', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u0396', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03b7', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u0397', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03b8', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u0398', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03b9', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u0399', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03ba', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u039a', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03bb', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u039b', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03bc', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u039c', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03bd', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u039d', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03be', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u039e', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03bf', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u039f', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03c0', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u03a0', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03c1', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u03a1', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03c3', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u03a3', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03c4', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u03a4', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03c5', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u03a5', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03c6', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u03a6', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03c7', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u03a7', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03c8', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u03a8', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
   																	        				      lowercase : {
   																	        						   character : '\u03c9', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  },
   																	        				      uppercase : {
   																	        						   character : '\u03a9', 
   																	        						   mac : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 },
   																	        						   win : {
   																	        							  hotkey : '',
   																	        							  shortcut : ''
   																	        							 }
   																	        						  }
   																	        				     },{
      																	        				      lowercase : {
      																	        						   character : '\u03D5', 
      																	        						   mac : {
      																	        							  hotkey : '',
      																	        							  shortcut : ''
      																	        							 },
      																	        						   win : {
      																	        							  hotkey : '',
      																	        							  shortcut : ''
      																	        							 }
      																	        						  },
      																	        				      uppercase : {
      																	        						   character : '\u03D5', 
      																	        						   mac : {
      																	        							  hotkey : '',
      																	        							  shortcut : ''
      																	        							 },
      																	        						   win : {
      																	        							  hotkey : '',
      																	        							  shortcut : ''
      																	        							 }
      																	        						  }
      																	        				     }],
			  },
                    speed: 1000
                }, args));
                //Added to show SHIFT instruction for greek and worldlanguage
                if(args.language =="worldlanguages" || args.language =="greek"){
                	console.info("selected language is world languages");
                	$("#palette_set_inst").css('display','block');
                }else{
                	$("#palette_set_inst").hide();
                }
                return (self);
            }
        function hidePalette() {
                var config = getConfig(),
                    container = config.box.palette,
                    activeObject = getActive();
                setState({
                        state: 'hidden'
                    });
                if ($(container).css('display') == 'none') {
                        return (this);
                    }
                if ($.prototype.jquery < '1.4.1') {
                        $(container).hide(1, function () {});
                    }
                else {
                        $(container).hide("clip", function () {});
                    }
                return (self);
            }
        function loadCharacterMap() {
                bindSet.call(this);
                var jquery_version = $.prototype.jquery;
                var config = getConfig(),
                    align = config.align,
                    browser = config.browser,
                    container = config.box.palette,
                    palette = config.box.set,
                    palette_key = config.box.key,
                    palette_status = config.box.status,
                    characterMap = this.map.getMap(),
                    charSetLength = characterMap.length,
                    itemLimit = config.items,
                    listHTML = [];
                for (var i = 0; i < charSetLength && i < itemLimit; i++) {
                        listHTML.push('<div class="', palette_key, '">', characterMap[i].character, '</div>');
                    }
                $(palette).html(listHTML.join('')).bind('mousewheel.palette', carouselify);
                $('.' + palette_key).unbind('mouseenter.palette').bind('mouseenter.palette', function () {
                        $(palette_status).html(self.palette.info({
                            index: $(this).parent().find('.' + palette_key).index(this)
                        }).shortcut || '');
                    }).unbind('mouseleave.palette').bind('mouseleave.palette', function () {
                        $(palette_status).html('');
                        self.charIndex = -1;
                    });
                $(container).removeClass(align == 'vertical' ? 'horizontal' : 'vertical').addClass(align == 'vertical' ? 'vertical' : 'horizontal');
                return (self);
                function carouselify(event, delta) {
                        var direction = delta > 0 ? 1 : 0;
                        // placeholder for mousewheeling
                    }
            }
        function showPalette(args) {
                setActive({
                    active: self
                });
                self.palette = this;
                var config = getConfig(),
                    container = config.box.palette,
                    callback = args && args.callback,
                    containment = config.containment,
                    element = getActive(),
                    openSpeed = config.speed,
                    position = element.offset(),
                    elementHeight = element.outerHeight(),
                    newTop = (parseInt(element.css('top')) + elementHeight),
                    newLeft = position.left,
                    css = {
                		width:'auto',
                        left: newLeft + 'px',
                        top: newTop +74+ 'px',
						'z-index': $.topZIndex()+1
                    };
             
                
              /*  if((parseInt($('#palette_container').width()) + parseInt(newLeft)) > config.maxrightpos){
              //  	newLeft += (config.maxrightpos - (parseInt($('#palette_container').width()) + parseInt(newLeft)));
               // }

                //if( (parseInt($('#palette_container').height()) + parseInt(newTop))  >  config.maxbottompos) {
                	//newTop += position.top - elementHeight;
                }*/
                /*
                css = {
                		width:'auto',
                        left: newLeft + 'px',
                        top: newTop +74+ 'px',
						'z-index': $.topZIndex()+1
                    };
                */
                preShow({
                        args: args,
                        callback: displayPalette,
                        container: container,
                        containment: containment,
                        css: $.extend({}, css, {
                            visibility: 'hidden'
                        }),
                        speed: openSpeed
                    });
                function displayPalette(args) {
                        var callback = args.callback,
                            container = args.container,
                            css = args.css,
                            openSpeed = args.speed;
                        $.extend(css, {
                                visibility: 'visible'
                            });
                        
                        $(container).css(css).data('css', css);
                        if ($.prototype.jquery < '1.4.1') {
                                $(container).show(openSpeed, function () {
                                    $(container).draggable({
                                        containment: args.containment,
                                        cursor: 'move',
                                        handle: '#palette_drag'
                                    });
                                    callback && callback();
                                });
                            }
                        else {
                                $(container).show("clip", function () {
                                    $(container).draggable({
                                        containment: args.containment,
                                        cursor: 'move',
                                        handle: '#palette_drag'
                                    });
                                    callback && callback();
                                });
                            }
                        var sel = self.data('openCursorAt');
                        //var startAt = sel ? sel.start-sel.onLine+1 : $(self).val().length+1;
                        if(!sel) {
                        	sel = self.getSelection();
                        }
                        if($.client.browser == 'Explorer' && sel) {
                        	if((self.val().charAt(sel.start) + self.val().charAt(sel.start+1)) === '\n') {
                        		self.setCaretPos(sel.start+2);
                        	} else {
                        		self.setCaretPos(sel.start+1);
                        	}
                        }
						if($('#palette_container').hasClass('horizontal')){
							$('#palette_print').css('height',$('#palette_set').height()+"px");
							$('#palette_drag').css('height',$('#palette_container li').height()+"px");
						}
						if($('#facebox_overlay').css('display')=="block"){
							$('.horizontal #palette_set_container').css('background-color','transparent');
							$('.horizontal h3').css('background-color','transparent');
						}
						else{
							$('.horizontal #palette_set_container').css('background-color','#fff');							
							$('.horizontal h3').css('background-color','#fff');
						}
                       setState({
                                state: 'shown'
                            });
                    }
                return (self);
                function preShow(args) {
                        var afterShow = args.args.callback,
                            callback = args.callback,
                            container = args.container,
                            containment = args.containment,
                            css = args.css,
                            openSpeed = args.speed,
                            viewportHeight = $(window).height();
                        	$(container).css(css).show(1, function () {
                                var containerHeight = $(this).height(),
                                    viewportTop = $(window).scrollTop(),
                                    bottom = $(this).offset().top + containerHeight - viewportTop +window.scrollY,
                                    newTop = (position.top - (containerHeight + parseInt($(this).css('margin-top')) + parseInt($(this).css('margin-top')))) - window.scrollY;
                                if (callback && (viewportHeight < bottom) && (parseInt(css.top) > (viewportHeight / 2)) && (newTop > viewportTop)) {
                                        css.top = newTop -14;
                                    }
                                callback({
                                        callback: afterShow,
                                        container: container,
                                        css: css,
                                        speed: openSpeed,
                                        containment : containment
                                    });
                            });
                    }
            }
        function snapPalette() {
                var config = getConfig(),
                    container = config.box.palette;
                $(container).css($(container).data('css'));
                return (self);
            }
        return (this);
    }
    function CharacterMap(args) {
        this.casing = '';
        this.map = {};
        this.getCase = getCase;
        this.getMap = getMap;
        this.setCase = setCase;
        this.setMap = setMap;
        function getCase() {
            var currentCase = this.casing;
            if (currentCase == '') {
                this.setCase('lowercase');
            }
            return (this.casing);
        }
        function getMap() {
            var currentCase = this.getCase(),
                characterMap = this.map,
                mapLength = characterMap.length - 1,
                newMap = [];
            for (var i = mapLength; i >= 0; i--) {
                    newMap[i] = characterMap[i][currentCase];
                }
            this.getMap = function () {
                    var storedCase = currentCase;
                    currentCase = this.getCase();
                    /** For shift press in symbol palette **/
                    var paletteItem = $('#paletteDropdown').html();
                    if (storedCase != currentCase && paletteItem != 'symbols') {
                        return (getMap.call(this));
                    }
                    else {
                        return (newMap);
                    }
                };
            return (this.getMap());
        }
        function setCase(value) {
            this.casing = value;
        }
        function setMap(value) {
            this.map = value;
        }
    }
    $.fn.authpalette = function (args) {
        var jquery_version = $.prototype.jquery;
        if (typeof args == "string") {
            if (args.match(/destroy/i)) {
                return $(this).each(function () {
                    $(this).unbind("focus.palette");
				    if ($(this).hasClass('palette_resized')){
						$(this).removeClass('palette_resized').removeClass('palette_added').css('float','none').css('cssText',$(this).attr('style')+';width:'+parseInt($(this).data('palette_oldwidth'))+'px !important');
				    }
                    $(this).next(".palette_icon").remove();
                });
            } else {
                return null;
            }
        } else {
            $('#palette_container:not(.palette_init)').remove();
            if ($('#palette_container.palette_init').length == 0) {
                //$('#palette_container')
                $('body').append('\
					<ul id="palette_container" class="clearfix palette_init noPrint">\
						<li>\
								<div id="palette_set_container" class="clearfix">\
                					<div id="palette_set"></div>\
                					<div id="palette_set_inst">SHIFT for upper case.</div>\
								</div>\
							</div>\
						</li>\
					</ul>');
            }
            return this.each(function () {
            	
            	$(this).parent().children().each(function(){
	    			if(this.id != ''){
	    				if(!$(this).is('iframe')){
	    					if($(this).is('textarea')){
	    						if(!$(this).hasClass('display_none')){
		    						selectedTextArea = $(this);
		    					}
	    					}			    					
				    	}
	    			}
	    			
	    		});
            	
            	var self = selectedTextArea,
                    palette = new AuthPalette(self, args);
                $(self).attr('autocomplete','off');    
                $.fn.authpalette = $.extend(true, $.fn.authpalette, palette);
                self = $.extend(true, {}, selectedTextArea);
                var config = palette.getConfig(),
                    close_button = config.box.close,
                    palette_container = config.box.palette,
                    palette_icon = config.box.icon,
                    palette_key = '.' + config.box.key,
                    palette_set = config.box.set,
                    palette_status = config.box.status,
                    print_button = config.box.print,
                    snap_button = config.box.snap;
                var display = function (event) {
                        self.palette = palette;
                        var selector = this,
                            currentState = self.palette.getState(),
                            currentDisplay = $(palette_container).css('display');
                        if (currentState == 'shown' && currentDisplay == 'none') {
                                self.palette.setState('hidden');
                            }
                        else if (currentState == 'shown') {
                                return;
                            }
                        self.palette.map.setCase("lowercase");
                        self.palette.load();
                        self.palette.show({
                                callback: function () {
                                    $(config.box.status).html('');
                                    self.charIndex = -1;
                                    self.palette.charAdded = false;
                                    var selection = self.getSelection();
                                    if (selection.length){
                                    	self.palette.activeSelectionLength = selection.length;
                                    }
                                    else{
                                    	self.palette.activeSelectionLength = 0;
                                    }
                                    self.palette.activeSelectionStart = selection.start;
                                    self.palette.activeSelectionEnd = selection.end;
                                    $(palette_container).disableSelection();
                                    $(palette_container).bind('mousedown.palette', function (event) {
                                        selectedTextArea.data('containerEventCanceller', true);
                                        var target = event.target;
                                        if ($.client.browser != 'Explorer') {
                                            if (!$(target).is(palette_key)) {
                                                return (0);
                                            }
                                        }
                                        else {
                                            if ($(target).is(palette_key)) {
                                                return (0);
                                            }
                                        }
                                    });
                                    $(print_button).unbind('click.palette').bind('click.palette', function () {
                                        window.open(self.palette.printUrl + config.language + '.html');
                                    });
                                    $(snap_button).unbind('click.palette').bind('click.palette', function () {
                                        self.palette.snap();
                                    });
                                    $(close_button).unbind('click.palette').bind('click.palette', function () {
                                        $(palette_container).data('containerEventCanceller', false);
                                        self.palette.getActive().focus();
                                        if (!self.palette.getActive().is('textarea')) {
                                            if (self.palette.charAdded) {
                                                self.palette.getActive().setCaretPos(self.palette.activeSelectionStart + 2);
                                            }
                                            else {
                                                self.palette.getActive().setCaretPos(self.palette.activeSelectionStart + 1);
                                            }
                                        }
                                        window.setTimeout('$.closePalette()', 0);
                                    });
                                    $(palette_container).unbind('mouseup.palette').bind('mouseup.palette', function (event) {
                                        var target = event.target;
                                        if ($(target).is(close_button)) {
                                            return (0);
                                        }
                                        if (selectedTextArea.data('containerEventCanceller') == true) {
                                            self.palette.getActive().focus();
                                            if (!self.palette.getActive().is('textarea')) {
                                                if (self.palette.charAdded && !$(target).is(palette_set)) {
                                                    self.palette.getActive().setCaretPos(self.palette.activeSelectionStart + 2);
                                                }
                                                else {
                                                    self.palette.getActive().setCaretPos(self.palette.activeSelectionStart + 1);
                                                }
                                            }
                                        }
                                        selectedTextArea.data('containerEventCanceller', false);
                                    });
                                    $(palette_set).unbind('mousedown.palette').bind('mousedown.palette', function (event) {
                                        self.palette.charAdded = true;
                                        var selectedIframeId = '#'+selectedTextArea.attr('id')+'_html';
                                        if($(selectedIframeId).contents()[0]){
                                        	var selection = $(selectedIframeId).contents()[0].getSelection();
	                                        if (selection.length) {
	                                            self.palette.activeSelectionLength = selection.length;
	                                        }
	                                        else {
	                                            self.palette.activeSelectionLength = 0;
	                                        }
	                                        self.palette.activeSelectionStart = $(selectedIframeId).contents()[0].getSelection().anchorOffset;
	                                        self.palette.activeSelectionEnd = $(selectedIframeId).contents()[0].getSelection().anchorOffset;
	                                        self.palette.lineNumber = selection.onLine;	
                                        }
                                        var target = event.target;
                                        if ($(target).is('div.palette_key')) {
                                            var index = $(event.target).parent().find(palette_key).index(event.target);
                                            var characterMap = self.palette.map.getMap();
                                            var character = characterMap[index].character;
                                            if(textNodeObj){
	                                            var nodeText = textNodeObj.textContent.substr(0, textSelectionStart) + character + textNodeObj.textContent.substr(textSelectionEnd);
	                                            textNodeObj.textContent = nodeText;	                                 
	                                            selectedTextArea.val($(selectedIframeId).contents()[0].body.innerHTML);
                                            } else {
                                            	var iFrameHTML = $(selectedIframeId).contents()[0].body.innerHTML;
	                                            var finalText = iFrameHTML.substr(0, textSelectionStart) + character + iFrameHTML.substr(textSelectionEnd);
	                                            $(selectedIframeId).contents()[0].body.innerHTML = finalText;
	                                            selectedTextArea.val(iFrameHTML);
                                            }
                                            textSelectionStart++;
                                            textSelectionEnd++;
                                        }
                                        if($.client.browser === 'Explorer'){
                                        	var newval = $(self).getSelection();
                                        	self.data('openCursorAt', newval);
                                        }
                                        if($.client.browser === 'Chrome'){
                                        	return false;                                        	
                                        }
                                    }).unbind('click.palette').bind('click.palette', function (event) {
                                    	var target = event.target;
                                        if (!$(target).is('div.palette_key')) {
                                            return (0);
                                        }
                                    });
                                    
                                }
                            }).unbind('blur.palette').bind('blur.palette', function (event) {
                            	if (!$(palette_container).data('containerEventCanceller')) {
                                    $(palette_container).data('containerEventCanceller', false);
                                    self.palette.hide();
                                    $("#paletteDropdown").text('Insert special characters');
                                    self.palette.setState({
                                        state: 'hidden'
                                    });
                                }
                            });
                    };
                if (config.auto) {
                        $(this).unbind('focus.palette').bind('focus.palette', display);
                    }
                else {
                        if(!$(this).hasClass('palette_added')){
				if (config.resize){
					var w = $(this).width()==0?$(this).css('width').replace(/px/i,""):$(this).width();
					w = isNaN(w) ? 0: parseInt(w);
					$(this).addClass('palette_resized').data('palette_oldwidth',w).css('cssText',$(this).attr('style')+';width:'+(w-config.iconsize)+'px !important');
					if(!$(this).hasClass('palette_no_container')){
						if(!$(this).hasClass('palette_container_noclearfix')){
							$(this).wrap('<div class="clearfix" />');
						}
						else{
							$(this).wrap('<div class="noclearfix" />');
						}
					}
					else{
						$(this).css('float','none');
					}
				}
				//$(this).addClass('palette_added').after('<span class="' + palette_icon + '" title="special character palette" style="margin-top:'+$(this).css('margin-top')+'">palette</span>');

				if (config.resize){
					selectedTextArea.css('float','left');
					selectedTextArea.next().css('float','left');
					if(selectedTextArea.hasClass('palette_no_container')){
						selectedTextArea.css('float','none').next().css('float','none');
					}
				}
                        }
                        selectedTextArea.unbind('showPalette.palette').bind('showPalette.palette', display);
                        $('.' + palette_icon).unbind('click.palette').bind('click.palette', function () {
                            $(this).prev().trigger('showPalette');
                        });
                    }
                updateCursor = function(el) {
                	var sel = $(el).getSelection();
                	return sel;
                };
                $(this).unbind('click.palette').bind('click.palette',function() {
                	$(this).data('openCursorAt', updateCursor(this));
                }).unbind('keyup.palette').bind('keyup.palette',function() {
                	$(this).data('openCursorAt', updateCursor(this));
                });
                
                return (palette);
            });
        }
    };
    $.closeAuthPalette = function () {
        $("#palette_container").hide();
    };
})(jQuery);
  
  /*
   TopZIndex 1.2 (October 21, 2010) plugin for jQuery
   http://topzindex.googlecode.com/
   Copyright (c) 2009-2011 Todd Northrop
   http://www.speednet.biz/
   Licensed under GPL 3, see  <http://www.gnu.org/licenses/>
  */
(function(a){a.topZIndex=function(b){return Math.max(0,Math.max.apply(null,a.map((b||"*")==="*"?a.makeArray(document.getElementsByTagName("*")):a(b),function(b){return parseFloat(a(b).css("z-index"))||null})))};a.fn.topZIndex=function(b){if(this.length===0)return this;b=a.extend({increment:1},b);var c=a.topZIndex(b.selector),d=b.increment;return this.each(function(){this.style.zIndex=c+=d})}})(jQuery);