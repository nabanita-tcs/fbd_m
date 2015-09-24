/*tool text code*/
var TextTool=TextTool || {};
/**
 * class name: textToolConfig()
 * description:All config initialization done here
 
 */
TextTool.dockText = function (){
	this.textToolStatus=false;
	this.cs = window.CD.services.cs;
	this.ds = window.CD.services.ds;
	this.Util=window.CD.util;
	this.createTools=window.CD.tools.create;
	this.formatTools = window.CD.tools.format;
	this.boxWidthID="#boxWidth";
	this.boxHeightID="#boxHeight";
	this.textSbSpScript=new TextSuperSubScript();
	this.SupErrorMesg="Please enter valid subscript/superscript character from palette";
	this.SubErrorMesg="Please enter valid subscript/superscript character from palette";
	this.textToolBoxId="textToolTextBox";
	this.textToolContainerId="textToolContainer";
	this.hintBoxId="hintToolTextBox";
	this.feedbackBoxId="feedbackToolTextBox";
	this.textMaxChar=256;
	this.maxCharWarning=(this.textMaxChar)-5;
	this.textFormat = new TextFormat();
	this.textEditor = new TextEditor();
	/*canvas object initialization*/
	this.stg = this.cs.getCanvas();
	this.layeObj= this.cs.getLayer();
	
	/*highlight color initialization*/
	this.highlightFill="#1086D9";
	this.normalFill="#555";
	this.highlightedTxtObj={};
	
	/*border */
	this.borderDfltClr="transparent";
	this.borderChgClr="black";
	this.borderWidth=1;
	
	/*fill*/
	this.fillDflClr="transparent";
	this.fillChngClr="white";
		
	this.style={align:"center",border:"F",fontType:"normal",fill:"F"};
	
	this.getBoxWidthHeight=function(){
		var W=$("#propertiesDiv").find("#boxWidth").val()+"px",
	        H=$("#propertiesDiv").find("#boxHeight").val()+"px";
	     return {w:W,h:H};
		
	};
	this.drawLayer=function(){
		this.cs.getLayer().draw();
	};
	this.getTextStyle=function(txtObj){
		/* for align*/
		if($("#leftAlignTool").hasClass('active')) this.style.align="left";
		else if($("#middleAlignTool").hasClass('active')) this.style.align="center";
		else if($("#rightAlignTool").hasClass('active')) this.style.align="right";
		else if($("#justifyAlignTool").hasClass('active')) this.style.align="justify";
		else if(txtObj) this.style.align=txtObj.attrs.align;
		else this.style.align="left";
		/* align end*/
			
		/* for font type bold & italic */	
			if($("#boldTool").hasClass('active'))this.style.fontType="bold";
			if($("#italicsTool").hasClass('active'))this.style.fontType="italic";
			if($("#boldTool").hasClass('active') && $("#italicsTool").hasClass('active')) this.style.fontType="bold italic";
			if(!($("#boldTool").hasClass('active')) && (!($("#italicsTool").hasClass('active')))) this.style.fontType="normal";
		/* bold & italic font type end*/		
			
			
	    /*border property*/
			if ($('#borderGuide').is(':checked'))this.style.border="T";
			else this.style.border="F";
			
		/*end border property*/
			
		/*fill property*/
			if ($('#fillGuide').is(':checked'))this.style.fill="T";
			else this.style.fill="F";
			
		/*end border property*/	
			
			
		return this.style;
	};
	
	/**
	 * function name: onchangeTxtobjChangeGrpObj()
	 * description:this method change group 
	 * object height once user edited text
	 
	 * param: 
	 * txtObj:object of text
	 * grpObj:text group object
	 *  
	 */
	this.onchangeTxtobjChangeGrpObj=function(txtObj,grpObj,editBox,noNeedChange){
		var rectObj;
		var txtCfg=this;
		var txtStyle=txtCfg.getTextStyle();
		$.each(grpObj.children, function(index,value) {
			
			if(value.className==="Rect")
			{
				rectObj=value;
				
			}
		});
		
		if(!noNeedChange){
			var box=this.getBoxWidthHeight(),W=box.w;
		 if(parseInt(txtObj.getWidth())>parseInt(W))txtObj.setWidth(parseInt(W));
		}
		var rectStrok=rectObj.getStroke(),rectFill=rectObj.getFill();
		
		/*change border*/
		
		if(txtStyle.border==="T")
		{
			rectObj.setStroke(txtCfg.borderChgClr);
		}else
		{
			rectObj.setStroke(txtCfg.borderDfltClr);
			
		}
		
		
	    /*change fill*/
		if(txtStyle.fill==="T")
		{
			rectObj.setFill(txtCfg.fillChngClr);
			
		}else
		{
			rectObj.setFill(txtCfg.fillDflClr);
			
		}
		/*for editted text*/
		if(editBox)
		{
			rectObj.setStroke(rectStrok);
			rectObj.setFill(rectFill);
			
		}
			
		rectObj.setWidth(txtObj.getWidth());
		rectObj.setHeight(txtObj.getHeight());
		var newTxtObjY= (rectObj.getHeight()-txtObj.getHeight())/2;
		txtObj.setY(newTxtObjY);

	};

	/**
	 * function name: createHtmlElement()
	 * description:create html element for 
	 * text tool box
	 
	 * param: options
	 * e.g:options={
	 *	containerId:'<container id>',
	 *	ContainerExtAttr:<extra attribute>,
	 *	ContainerStyle: <container inline style>,
	 * 	textId :  <text box id>,
	 * 	textStyle: <text box style>,
	 * 	footerContId:<footer container id>,
	 * 	footerContClass:<footer container class>,
	 *	footerConStyle : <footer style>
	 *   }
	 * 
	 */
	this.createHtmlElement=function(options)
	{
		console.log("@dockText.createHtmlElement");
		this.clearAlignClicked();
		
		var maskTop = $('#toolPalette').position().top;
		var maskLeft = $('#toolPalette').position().left;
		var maskWidth = $('#toolPalette').width();
		var maskHeight = $('#toolPalette').height();
		var maskToolBar = $('<div id="maskTool" style="position:absolute;opacity:0.05;z-index:99;"></div>');
		maskToolBar.css({ top: maskTop+'px', left: maskLeft+'px', width:maskWidth+'px', height:maskHeight+'px'});
		
		
		var textAreaContainer=$('<div id="'+options.containerId+'" '+options.ContainerExtAttr+' style="'+options.ContainerStyle+'"><div>'),
		textArea=$('<textarea id="'+this.textToolBoxId+'" '+options.ContainerExtAttr+'  style="'+options.textStyle+'">'+options.textVal+'</textarea>'),
		footerContainer=$('<div id="'+options.footerContId+'" class="'+options.footerContClass+'" style="'+options.footerConStyle+'"></div>'),
		footerGuide = $('<div class="footerGuide"><span>Create fill-in-the-blank using double underscores. Separate </span><span>alternate answers with a pipe:__FIB answer|alternate answer__</span></div>');
	    
		  
		/** hint text area **/
		var hintTextArea=$('<textarea id="'+this.hintBoxId+'" '+options.ContainerExtAttr+' class = "display_none" style="'+options.textStyle+'">'+options.hintVal+'</textarea>');
		
		/** feedback text area **/
		var fdbkTextArea=$('<textarea id="'+this.feedbackBoxId+'" '+options.ContainerExtAttr+' class = "display_none"  style="'+options.textStyle+'">'+options.feedbackVal+'</textarea>');
		
	    var footerContent=window.CD.util.getTemplate({
				url: 'resources/themes/default/views/palette.html'
			});
		 
	    /*check for existance of texttoolcontainer*/
	    if($("#"+options.containerId)){
	    	$("#"+options.containerId).remove();
	    	$('#maskTool').remove();
	    }    

	    $(footerContainer).off('click').on('click',function(e){
	    	if(!$(e.target).hasClass('left') && !$(e.target).parents().hasClass('left')){
	    		if($('.palette_options').css('display') == 'block'){
		    		$('.palette_options').css('display','none');
		    		$("#paletteDropdown").text('Insert special characters');
		    	}	    		
	    		$.closeAuthPalette();
	    	}
	    	
	    });
	    
	    var commonLabelTextToolChar=this;
	    footerContainer.append(footerGuide);
	    footerContainer.append(footerContent);
	    textAreaContainer.append(textArea);
	    
	    textAreaContainer.append(hintTextArea);
	    textAreaContainer.append(fdbkTextArea);
	    
	    textAreaContainer.append(footerContainer);
	    $('body').append(textAreaContainer);
	    $('body').append(maskToolBar);

	    this.textEditor.createTextEditor(textAreaContainer,'text','docktext');
	    
	    //$("#"+options.textId).focus();
	    $("#"+this.feedbackBoxId).charCounter({
	    	maxChars: commonLabelTextToolChar.textMaxChar,
	    	maxCharsWarning : commonLabelTextToolChar.maxCharWarning
	    });
		
	};
	/**
	 * function name: fetchEditedText()
	 * description: fetch text value
	 
	 * param: 
	 * txtObj=text object[object]
	 * evt =click event
	 * 
	 */

	this.fetchEditedText=function(labelObj){
		console.log("@dockText.fetchEditedText");
		//var sle = SLEData.getSLEIndex(labelObj);
		//var textVal= window.CD.module.data.Json.SLEData[sle].label_value
		return textVal;
	 	
	};	
	
	
	/**
	 * function name: createTextBox()
	 * description: when click on text 
	 * tool icon to create a text tool box
	 * this method get called
	 
	 * param: 
	 * layerObj=kinetic layer object
	 * event =click event
	 * 
	 */
	

	this.createTextBoxForLabel= function(event){
		var txtConfg=this,
		   layerObj=txtConfg.layeObj;
		   this.checkOldText(true);
		var x = parseInt(event.x),
		    y = parseInt(event.y),
		    box=txtConfg.getBoxWidthHeight(),
			W=box.w,
			H=box.h;
		x=event.selectorObj.getAbsolutePosition().x;
		y=event.selectorObj.getAbsolutePosition().y + $('.header').height();//+$('canvas').first().offset().top;
		if((y+100) > $('canvas').first().height()){
			y = y -140; 
		}
		 var textGrpObjectId = event.selectorObj.attrs.id.split('_')[2];
		// var txtObj = event.selectorObj.get('#txt_'+textGrpObjectId);
		 var textVal ="";
		 var prgId = event.selectorObj.parent.attrs.id;
		 var prg = PRGData.getDockIndex(prgId);
		 
		 if(event.selectorObj.children.length > 2){
			 textVal = window.CD.module.data.Json.PRGData.PRGDockData[prg].sentence;//this.fetchEditedText('label_'+textGrpObjectId);
		 }
			 
		var hintFeedbackObj = window.CD.module.data.getHintFeedbackValue(prgId);
		hVal = hintFeedbackObj.hintValue;
		fVal = hintFeedbackObj.feedbackValue;
		 var options={
		  			containerId:'textToolContainer',
		  			ContainerExtAttr:'editedid="'+event.selectorObj.attrs.id+'"',
		  			ContainerStyle: 'position:fixed;left:'+x+'px;top:'+y+'px;',
		  			textId :  'textToolTextBox',
		  			textStyle: 'left:'+x+'px;top:'+y+'px;height:70px;width:283px;',
		  			footerContId:'textToolFooter',
		  			footerContClass: 'palette_div',
		  			footerConStyle : 'width:283px',//'width:'+(parseInt(W)-18)+'px;',
		  			textVal :textVal,
		  			hintVal : hVal,
		  			feedbackVal : fVal,
	       };
		      
		      this.createHtmlElement(options);
		      
		      var el = $("#"+this.textToolBoxId);
		      var elemLen = el.val().length;
		      el.selectionStart = elemLen;
		      el.selectionEnd = elemLen;
		      el.focus();
		      
		      if(event.selectorObj){
		    	  event.selectorObj.hide();
		    	  this.drawLayer();
		    	  this.processSaveOrCancelDock(this.textToolBoxId,'dock_label_'+textGrpObjectId,false,"",event);

		      }
	};
	

	/**
	 * function name: initPalete()
	 * description:initialize palete
	 
	 * param: 
	 * paleteboxSelector=textarea/input id
	 *  
	 */
	this.initPalete=function(paleteboxSelector,language)
	{
		if(!language)language='spanish';
		 /*adding palelte to textare*/
		  $(paleteboxSelector).authpalette({
			  align : 'horizontal',
			  auto : false,	  
			  language : language, 
			  resize : false,
			  containment : 'document' 
			  });
		  
		
	};
	/**
	 * function name: prepareDropdownListAndAction()
	 * description:prepare list of drop down and 
	 * on change functionality for that drop down
	 
	 * param: 
	 * appendConId=append container id
	 * paleteboxSelector=palete input/textarea element id
	 *  
	 */
	this.prepareDropdownListAndAction=function(appendConId,paleteboxSelector)
	{
		if(window.CD.module.data.customLanguageFlage == ''){
			 var labelTextObj=this;
			  var dropdownlist=$('<span class="palette_option" style="width:100%;">Insert special characters</span>'+
			  			 		'<span class="palette_option" style="width:100%;">symbols</span>'+
	 		  			 		'<span class="palette_option" style="width:100%;">math</span>'+
			  			 		'<span class="palette_option" style="width:100%;">subscript</span>'+
					            '<span class="palette_option" style="width:100%;">superscript</span>'+
					            '<span class="palette_option" style="width:100%;">greek</span>'+
			  			 		'<span class="palette_option" style="width:100%;">world languages</span>'			             
		  					);
			  $("#textToolFooter .palette_options").html("").append(dropdownlist);
			
			  
			  $('.palette_div div.select_box').each(function(){
				 
					$(this).children('span.selected').html($(this).children('div.palette_options').children('span.palette_option:first').html());
					$(this).attr('value',$(this).children('div.palette_options').children('span.palette_option:first').attr('value'));
					
					
					$(this).children('span,span.select_box').off('click').click(function(){
						
						if($('#palette_container').css('display') == 'block'){
							  $('#palette_container').css('display','none');
						}
						if($(this).parent().children('div.palette_options').css('display') == 'none'){
							var calTop =0;
							$(this).parent().children('div.palette_options').css('display','inline');
							$.closeAuthPalette();
							var calY = parseInt($(this).parents('#textToolContainer').position().top) - window.scrollY;
							
							if((calY + 250) > parseInt($('canvas').first().height())){
								//calTop = calY - parseInt($(this).parent().children('div.palette_options').height());
								calTop = calY - parseInt($(this).parent().children('div.palette_options').height()); 
							}
							$(this).parent().children('div.palette_options').css('top', parseInt(calTop*(-1)) + 'px');
					
						}
						else
						{
							$(this).parent().children('div.palette_options').css('display','none');
						}
					});
					
					$(this).find('span.palette_option').off('click').on('click',function(){
						$(this).parent().css('display','none');
						$(this).closest('div.select_box').attr('value',$(this).attr('value'));
						$(this).parent().siblings('span.selected').html($(this).html());
						$.closeAuthPalette();
						var lan=$("#paletteDropdown").text().replace(/\s/g, "");
						
						var textContainer = $('#'+labelTextObj.textToolContainerId);
						
						var selectedText = labelTextObj.getSelectedTextArea(labelTextObj);
						
						var selectedTextArea = selectedText.selectedTextArea;
						var selectedAreaId = selectedText.selectedAreaId;
						
						if(lan!=="Insertspecialcharacters")
						{
							window.CD.module.data.customLanguageFlage = $(this);
							labelTextObj.initPalete(selectedTextArea,lan);
							selectedTextArea.css('display','block');
							$('#'+selectedAreaId+'_html').css('display','none');
							selectedTextArea.trigger("showPalette");
							
							if(lan==="Superscript" || lan==="Subscript"){
								$("#palette_set .palette_key").css('font-size','17px');
							}
							selectedTextArea.css('display','none');
							$('#'+selectedAreaId+'_html').css('display','block');
						}
						
						selectedTextArea.focus();
					});
					$('body').on('keydown',function(e) {
					    // ESCAPE key pressed
					    if (e.keyCode == 27) {
					    	$('div.palette_options').each(function(){
					    		$(this).hide();
					    	});
					    }
					});
				});
				
		}
		else{
			 var labelTextObj=this;
			  var dropdownlist=$('<span class="palette_option" style="width:100%;">Insert special characters</span>'+
			  			 		'<span class="palette_option" style="width:100%;">symbols</span>'+
	 		  			 		'<span class="palette_option" style="width:100%;">math</span>'+
			  			 		'<span class="palette_option" style="width:100%;">subscript</span>'+
					            '<span class="palette_option" style="width:100%;">superscript</span>'+
					            '<span class="palette_option" style="width:100%;">greek</span>'+
			  			 		'<span class="palette_option" style="width:100%;">world languages</span>'			             
		  					);
			  $("#textToolFooter .palette_options").html("").append(dropdownlist);
			
			  $('.palette_div div.select_box').each(function(){
				 
//					$(this).children('span.selected').html($(this).children('div.palette_options').children('span.palette_option:first').html());
//					$(this).attr('value',$(this).children('div.palette_options').children('span.palette_option:first').attr('value'));
				 
				 	$('.palette_div').children().find('.select_box').children('span.selected').html($(window.CD.module.data.customLanguageFlage).html());
				 	$(this).attr('value',$(window.CD.module.data.customLanguageFlage).attr('value'));
					$(this).children('span,span.select_box').click(function(){
						if($(this).parent().children('div.palette_options').css('display') == 'none'){
							var calTop =0;
							$(this).parent().children('div.palette_options').css('display','inline');
							$.closeAuthPalette();
							var calY = parseInt($(this).parents('#textToolContainer').position().top) - window.scrollY;
							if((calY + 250) > parseInt($('canvas').first().height())){
								//calTop = calY - parseInt($(this).parent().children('div.palette_options').height());
								calTop = calY - parseInt($(this).parent().children('div.palette_options').height()); 
							}
							$(this).parent().children('div.palette_options').css('top', parseInt(calTop*(-1)) + 'px');
					
						}
						else
						{
							$(this).parent().children('div.palette_options').css('display','none');
						}
					});
					
					$(this).find('span.palette_option').on('click',function(){
						$(this).parent().css('display','none');
						$(this).closest('div.select_box').attr('value',$(this).attr('value'));
						$(this).parent().siblings('span.selected').html($(this).html());
						$.closeAuthPalette();
						//var lan=$("#paletteDropdown").text().replace(/\s/g, "");
						lan=$("#paletteDropdown").text().replace(/\s/g, "");
						window.CD.module.data.customLanguageFlage = $(this);
						if(lan!=="Insertspecialcharacters")
						{
							labelTextObj.initPalete(selectedTextArea,lan);
							selectedTextArea.css('display','block');
							$('#'+selectedAreaId+'_html').css('display','none');
							selectedTextArea.trigger("showPalette");
							
							if(lan==="Superscript" || lan==="Subscript"){
								$("#palette_set .palette_key").css('font-size','17px');
							}
							selectedTextArea.css('display','none');
							$('#'+selectedAreaId+'_html').css('display','block');
						}
						
						selectedTextArea.focus();
					});
					$('body').on('keydown',function(e) {
					    // ESCAPE key pressed
					    if (e.keyCode == 27) {
					    	$('div.palette_options').each(function(){
					    		$(this).hide();
					    	});
					    }
					});
				});
			 	var lan=$(window.CD.module.data.customLanguageFlage).text().replace(/\s/g, "");
			 	
			 	var textContainer = $('#'+labelTextObj.textToolContainerId);
				
			 	var selectedText = labelTextObj.getSelectedTextArea(labelTextObj);
				
				var selectedTextArea = selectedText.selectedTextArea;
				var selectedAreaId = selectedText.selectedAreaId;
				
				if(lan!=="Insertspecialcharacters")
				{
					labelTextObj.initPalete(selectedTextArea,lan);
					selectedTextArea.css('display','block');
					$('#'+selectedAreaId+'_html').css('display','none');
					selectedTextArea.trigger("showPalette");
					
					if(lan==="Superscript" || lan==="Subscript"){
						$("#palette_set .palette_key").css('font-size','17px');
					}
					selectedTextArea.css('display','none');
					$('#'+selectedAreaId+'_html').css('display','block');
				}
				$("#"+labelTextObj.textToolBoxId).focus();
		}

	};
	
	
	/**
	 * This method is used to get the selected textarea and its id
	 * 
	 */
	this.getSelectedTextArea = function(labelTextObj){
		console.log("@getSelectedTextArea :: dockText");
		try{
			var textContainer = $('#'+labelTextObj.textToolContainerId);
			
			var selectedText = {};
			
			textContainer.children().each(function(){
    			if(this.id != ''){
    				if(!$(this).is('iframe')){
    					if($(this).is('textarea')){
    						if(!$(this).hasClass('display_none')){
    							selectedText.selectedTextArea = $(this);
    							selectedText.selectedAreaId = this.id;
	    					}
    					}			    					
			    	}
    			}
    			
    		});
			return selectedText;
		}catch(error){
			console.log("Error in getSelectedTextArea :: dockText "+error.message);
		}
	};
	/**
	 * function name: processSaveOrCancel()
	 * description: on click of save or cancel
	 * link called this method
	 
	 * param: 
	 * paleteboxSelector: palete selector id
	 * left: x cordinator
	 * top : y coordinator
	 * layerObj: layer object of canvas[object]
	 * editBox : true/false[boolean]
	 * txtObj :  created/edited text object[object]
	 * event : event object contain event.x,event.y coordinator
	 * 
	 */
	this.processSaveOrCancelDock=function(paleteboxSelector,dockObj,editBox,txtGrpObj,event){
		var txtTool=this;
		var txtObj=this.getTextObjFromGroupObject(txtGrpObj);
		
		this.prepareDropdownListAndAction("textToolFooter",paleteboxSelector);
		
		 /*close text tool box*/
			$('#textToolFooter .cancel_palette').on('click',function(){
				/** For palette window close **/
				if($('#palette_container').css('display') == 'block'){
					  $('#palette_container').css('display','none');
					  $("#paletteDropdown").text('Insert special characters');
				}
				txtTool.closeTextToolBox('#textToolContainer',editBox,txtGrpObj,event);
				$('#maskOnFrame').remove();
			});
			/*save text tool*/
			$('#textToolFooter .save_palette').on('click',function(){ 
				
				$('#maskOnFrame').remove();
				/** For palette window close **/
				if($('#palette_container').css('display') == 'block'){
					  $('#palette_container').css('display','none');
					  $("#paletteDropdown").text('Insert special characters');
				}
				var cs = window.CD.services.cs; 
				var activeElm = window.CD.elements.active.element[0];
				var lbGroup = activeElm.parent;
				
				var txtGrpObj = activeElm;
				var labelGropId = activeElm.parent.getId();
				
				var activeBar = $(this).parents('div#textToolContainer').children('ul').children('.active');
				var activeId = activeBar.attr('id').split('Bar')[0];
				
				var hValue = txtTool.removeLastBR($("#hintToolTextBox").val());
				var fValue = txtTool.removeLastBR($("#feedbackToolTextBox").val());
				
				if(hValue !== '' || fValue !== ''){
					var selectedTab = activeId+'ToolTextBox';
					
					var hintType = $('input[name=hoverHint]:checked').val();
					var feedbackType = $('input[name=feedbackType]:checked').val();
					
					cs.setActiveElement(lbGroup,'dock');
					
					window.CD.module.view.bindFeedbackHintEvent($('input[name=hintFeedback]:checked').val(),hintType,feedbackType);
					
					window.CD.module.view.updateHintFeedbackVal(hValue,fValue);
					
					if(fValue !== ''){
						window.CD.module.view.onTypeingHintAndFeedback(fValue,'textareaFeedback');
					}
					if(hValue !== ''){
						window.CD.module.view.onTypeingHintAndFeedback(hValue,'textareaHint');
					}
														
				}
				
				if(hValue == '' || fValue == ''){
					window.CD.module.view.updateHintFeedbackVal(hValue,fValue);
					var labelGrop = cs.findGroup(labelGropId);
					window.CD.module.view.removeHintFeedbackFlag(labelGrop,hValue,fValue);
				}
				
				var textBoxValue=$('#'+txtTool.textToolBoxId).val();
				if(textBoxValue!=="" && textBoxValue!==null && $.trim(textBoxValue).length > 0){
				
			       var cs = window.CD.services.cs;
			       var ds = window.CD.services.ds;
			       var prg = PRGData.getDockIndex(dockObj);
			       var oldVal = window.CD.module.data.Json.PRGData.PRGDockData[prg].sentence
			       var label_text_value=$('#'+txtTool.textToolBoxId).val().replace(/<\/sb><sb>/g,'').replace(/<\/sp><sp>/g,'');
			       window.CD.module.data.Json.PRGData.PRGDockData[prg].sentence = txtTool.checkAndUpdateCharFromPalete(label_text_value);
			       ds.setOutputData();
			       event.oldValue = oldVal;
			       txtTool.saveTextToolBoxDock("#textToolContainer",event,dockObj);
			       
				}else{
					$('#textToolFooter .cancel_palette').trigger('click');
				}
		});
		  
	};


	/**
	 * function name: checkOldText()
	 * description:For edit box click on 
	 * each text check old text if text click
	 * happen without cancel previous box
	 
	 * param: creatBox
	 * {boolean}
	 * 
	 */

	this.checkOldText= function(creatBox)
	{
		var cs = window.CD.services.cs;
		var stg = cs.getCanvas();
		var layerObj = cs.getLayer(),OldTextVal=$("#textToolContainer").attr('editedid');
		if($("#textToolContainer").is(":visible") && OldTextVal!==""){
			var oldId=$("#textToolContainer").attr('editedid');
			var oldTxtObj=stg.get('#'+oldId);
			oldTxtObj[0].show();
			layerObj.draw();
		}
	};
	/**
	 * function name: saveTextToolBox()
	 * description:on click of save in create box
	 * and draw that text to canvas
	 
	 * param: 
	 * selector:container div id
	 * layerObj:layer object[object]
	 * event : event object
	 *  
	 */

	this.saveTextToolBoxDock=function(selector,event){
		
		  var cdLayer = window.CD.services.cs.getLayer();
		  var cs = window.CD.services.cs;
                   var textConfg = this,
		  textStyle=textConfg.getTextStyle(),	  
		  maxwidth=300,
		  buffer= 20,
		  txtGrpObj= event.selectorObj,
		  labelCount = cs.objLength(window.CD.module.data.Json.PRGData.PRGDockData);
		  txtGrpId = txtGrpObj.attrs.id.split('_')[2];
		  txtGrpObj.setWidth(txtGrpObj.parent.children[0].getWidth());
		  var labelCount=0;
		  var prg = PRGData.getDockIndex('dock_label_'+txtGrpId);
		  var prgData = PRGData.getDockJsonData()[prg];
		  var fontsize= prgData.textFormat.fontSize;
		  var ds = window.CD.services.ds; 	  
		  var textAlign=textStyle.align;
		  textFontType=textStyle.fontType;
		  var undoMng = window.CD.undoManager;
		  var initValue = event.oldValue; 
		  /*checking sb and sp tag in a text*/
			var textValue=$('#'+this.textToolBoxId).val().replace(/<\/sb><sb>/g,'').replace(/<\/sp><sp>/g,'');
			textValue = this.removeLastBR(textValue);
			//if(this.checkSubOrSuperTagExist(textValue)){
				//textValue=this.changeSubscriptSuperScript(textValue);	
			//}
			if(textValue===false){
				return false;
			}
			 var textFormat = {
	                 "underline_value": prgData.textFormat.underline_value, 
	                 "fontSize":  prgData.textFormat.fontSize, 
	                 "fontStyle": prgData.textFormat.fontStyle, 
	                 "align": prgData.textFormat.align
	             }; 
			 
		 if(txtGrpObj.children.length > 2){
			 if(initValue != textValue){
				 this.deleteActiveDockText(undefined,undefined,'true');
				 this.deleteActiveDockTextObj(txtGrpObj);
				 txtGrpObj = this.createText(textValue,txtGrpObj,textFormat,'','callFromSaveTextToolBoxDockEdit');			
				 txtGrpObj.get('#dock_txtBox_'+txtGrpId)[0].setFill("transparent");	
			 }			 		
		 }else{
			
			 txtGrpObj = this.createText(textValue,txtGrpObj,textFormat,'','callFromSaveTextToolBoxDock');
		 }
		    if(initValue != ''){
		    	if(initValue != textValue){//So that create label undo/redo dont get register for same text change
		    		undoMng.register(this, this.textCreation,[prg,initValue,txtGrpObj] , 'Undo Text',this, this.textCreation,[prg,textValue,txtGrpObj] , 'Redo Text');
		    	}
		    }		    	
		    else
		    	undoMng.register(this, this.deleteActiveDockText,['delete Text',txtGrpObj] , 'Undo Text',this, this.textCreation,[prg,textValue,txtGrpObj] , 'Redo Text');
		    updateUndoRedoState(undoMng);
			 $(selector).remove();
			 event.selectorObj.show();
			 $('#maskTool').remove();
			 
			 txtGrpObj.get('#dock_txtBox_'+txtGrpId)[0].setFill("transparent");
			 if(txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0] == undefined){
				 for(var a=0;a<txtGrpObj.children.length;a++){
					 if(txtGrpObj.children[a].attrs.id){
						 if(txtGrpObj.children[a].attrs.id == 'dock_addTxt_'+txtGrpId){
							 txtGrpObj.children[a].hide();
						 }
					 }
				 }
			 }else{
				 txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0].hide();
			 }
			 
			 textValue = this.removeLastBR(textValue);
			 if(textValue == '' || (PRGData.prgOtoDuplicateElm == true)){
				 	var textGrpHeight = txtGrpObj.children[txtGrpObj.children.length-1].getY() + txtGrpObj.children[txtGrpObj.children.length-1].getHeight();
					txtGrpObj.setY((txtGrpObj.parent.children[0].getHeight()-textGrpHeight)/2);
					txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0].show();
					txtGrpObj.get('#dock_txtBox_'+txtGrpId)[0].setFill("#fff");
			 }
			 if($('#UnderlinetTool').hasClass('active')){
				 this.applyTextUnderline(txtGrpObj);			  
			 }
			 var txtConfg = new TextTool.commonLabelText();
			var count = txtGrpObj.children.length-1;
			var lastChild = txtConfg.findLastTextchild(txtGrpObj,count);
			var textGrpHeight = txtGrpObj.children[lastChild].getY() + txtGrpObj.children[lastChild].getHeight();
			var topPadding = (txtGrpObj.parent.children[0].getHeight()-textGrpHeight)/2;
			if(topPadding < 0)
				topPadding = 0;
			txtGrpObj.setY(topPadding);
			
			 this.drawLayer();
			 textConfg.textSetActive(txtGrpObj, 'docktext');
			// this.cleanSelectedOptionFromOldTxt();
            // this.applyIndentation();               
			 this.bindLabelTextEvent(txtGrpObj);
			 
	},
	
	this.deleteActiveDockTextObj = function(labelTextObj){
		console.log("@dockText.deleteActiveDockTextObj");
		try{
			var txtToolCfg = new TextTool.commonLabelText();
			var active = window.CD.elements.active;
			var activeElm = active.element[0];
			if(labelTextObj)
				activeElm = labelTextObj;
			
			var activeElmParent = activeElm.parent;
			var labelId = activeElmParent.getId();
			var etIndex = window.CD.module.data.getDockIndex(labelId);
			var txtGrpObjId = activeElm.attrs.id;
			var splittedid = txtGrpObjId.split("_");
			var parentLayer = activeElm.getLayer();
			var etJson = window.CD.module.data.getDockJsonData();
			var initVal = etJson[etIndex].sentence;
			
			txtToolCfg.cs.setActiveElement(txtToolCfg.cs.getGroup('frame_0'),'frame');
			var childrenLen = activeElm.getChildren().length;
			if(childrenLen == 0){
				activeElm = activeElmParent.get('#'+activeElm.getId())[0];
			}
			this.deleteEachDockText(activeElm);
			
			if(parentLayer && parentLayer.attrs.id==="text_layer"){
				   parentLayer.draw();
			}
			txtToolCfg.drawLayer();
			
			window.CD.module.data.textGroupComponent = [];
			
			var lblDataObj = etJson[etIndex];
			delete lblDataObj;
			txtToolCfg.ds.setOutputData();
		}
		catch(error){
			console.info("Error @deleteActiveDockTextObj :: dockText "+error.message);
		}
	};
	
	this.deleteEachDockText = function(object){
		console.log("@dockText : deleteEachDockText");
		try{
			var childrenLengt = object.children.length;
			var k = 2;
			
			for(var i=k; i<childrenLengt; i++){
				if(!object.children[i]){
					this.deleteEachDockText(object);
				}
				if(object.children[i]) {
					if(object.children[i].nodeType == "Group"){
						this.deleteEachDockText(object.children[i]);
					} else {
						object.children[i].remove();
					}
				}
			}
		}catch(error){
			console.info("Error in dockText :: deleteEachDockText "+error.message);
		}
	};
	 /**
     * @param : whole text group and last child count
     * @description : For a label text with partial format (with underline), the text children count 
     * also includes underline object count. This method is used for getting actual label text 
     * children count
     */
    this.findLastTextchild = function(textGroup,count){
   	 console.log("@findLastTextchild :: dockText");
   	 try{
   		 var childTextObj = textGroup.children[count];
   		 if(childTextObj.className == "Line"){
   			 count--;
   			 return this.findLastTextchild(textGroup,count);
   		 }else{
   			 return count;
   		 }    		 
   	 }catch(error){
   		 console.info("Error @findLastTextchild :: dockText: "+error.message);
   	 }
    };
    
    this.removeLastBR = function(textValue){
    	console.log("@removeLastBR :: dockText");
    	try{
    		if(textValue.indexOf('<br>') != -1){
    			textValue = textValue.replace(/(<br>|\s|&nbsp;)*$/,'');
    		}		
        	return textValue;
    	}catch(error){
      		 console.info("Error @removeLastBR :: dockText: "+error.message);
      	 }
    };
    
	this.createText = function(textValue,txtGrpObj,textFormat,globalFontStyle,callFrom){
		console.log("@createText :: dockText");
		var cdLayer = window.CD.services.cs.getLayer();
		var textFormatPRG = new TextFormat();
		var labelTextStyling = new labelTextStyle();
		 PRGData.prgOtoDuplicateElm = false;
		  var cs = window.CD.services.cs;
		  var textConfg=this,
		  textStyle=textConfg.getTextStyle(),	
		  maxwidth=300,
		  buffer= 20,
		  labelCount = cs.objLength(window.CD.module.data.Json.PRGData.PRGDockData);
		  txtGrpId = txtGrpObj.attrs.id.split('_')[2];
		  txtGrpObj.setWidth(txtGrpObj.parent.children[0].getWidth());
		  var prg = PRGData.getDockIndex('dock_label_'+txtGrpId);
		  var labelCount=0;
		  window.CD.module.data.Json.PRGData.PRGDockData[prg].sentence = textValue;
		  this.ds.setOutputData();
		  var otoFlag2 = false;
		  /*get text formatinf details*/
			if(textFormat){
			 	var boldItalicStatus = textFormat.fontStyle;
			 	var underline_value = textFormat.underline_value;
			 	var fontSize = textFormat.fontSize;
			 	var align =  textFormat.align;
			}else{
				var boldItalicStatus = 'normal';
			 	var underline_value = 'F';
			 	var fontSize = window.CD.module.data.Json.adminData.GFS;
			 	var align = 'center';
			}
			textValue = this.removeLastBR(textValue);
			 if(textValue.match(/\r|\n/) != null){	
					textValue = textValue.replace(/\n|\r/g, ' ^^');
			 }
			 var hiddenDiv = $('<div id="preformat" contenteditable="true" style="height:1px;display:none;"></div>');
			 $('body').append(hiddenDiv);
			 textValue = this.parseFormattedText(textValue);
			 var c = textValue.replace((/__([a-z0-9A-Z\W\s]+)__/g), '__~~$1~~__');
			 var splittedWords = c.split(/__([a-z0-9A-Z\W\s]+)__/g);
			 
			 
			 var splittedTextArray = splittedWords;
			 
			 var splittedTextArrayLen = splittedTextArray.length;
			 var formattedTextArr = [];
			 var fibArr = [];
			 
			 for(var cnt = 0;cnt<splittedTextArrayLen;cnt++){
				 var tempTextVal = splittedTextArray[cnt];
				 var formattedTextArray = [];
				 formattedTextArray = this.textFormat.formatText(tempTextVal);
				 if(tempTextVal.indexOf('~~') != -1){
					 /** done for space adjustment **/
					 var tempTextValue = splittedTextArray[cnt+1];
					 var tempformattedTextArray = this.textFormat.formatText(tempTextValue);
					 
					 if(tempformattedTextArray[0] == '#'){
						 formattedTextArray.push('#');
					 }	
					 formattedTextArr.push(formattedTextArray);
					 fibArr.push(tempTextVal);
				 }else{
					 $.merge(formattedTextArr, formattedTextArray);					 
				 }
			 }
			 
			// formattedTextArr = this.prepareFormattedText(formattedTextArray);
			 
			 var newLabelCount = 0;
			 for(var i=0; i<splittedWords.length; i++){
				 if(splittedWords[i].indexOf('~~') != -1){
					 newLabelCount++;
				 }
			 }
			 var newCount = cs.objLength(window.CD.module.data.Json.PRGData.PRGLabelData);
			 var stg = cs.getCanvas();
			 var labelConfig = new LabelConfig();
	    	 var overLapVal = 0;
	    	 var colorText= '';
	    	 var nameParam = '';
	         var canvasHeight = parseInt(stg.getHeight());
	         var distractorHeight = parseInt(labelConfig.style.height);
	         var newCanvasHeight = (canvasHeight-70)-distractorHeight;
	         var totDistractorCount = parseInt(newCount)+parseInt(newLabelCount);
	         var otoFlag = false;
	         if(totDistractorCount>10){
	        	 overLapVal = newCanvasHeight/parseInt(totDistractorCount);
	         }else{
	        	 overLapVal = 30;
	         }
			 var txtSeq = 0;
			 var fibCount = 0;
			 for(var i=0; i<formattedTextArr.length; i++){
				 var tempValues = formattedTextArr[i];
				 var testTxt = '';
				
				 if(tempValues != '' && (!$.isArray(tempValues))){
					 testTxt = tempValues.replace(/#/g,' ').replace('[b]','').replace('[i]','').replace('[u]','');
				 }
				 if((testTxt != '' && testTxt != ' ') || ($.isArray(tempValues))){
					 if($.isArray(tempValues)){
						 var flag = false;	
						 var diElm ='';
						 labelCount = cs.objLength(window.CD.module.data.Json.PRGData.PRGLabelData);					 
						
						 if(labelCount){						 
							 for(var j=0; j<labelCount; j++){
								 var checkTxt = fibArr[fibCount];
								 
								 checkTxt = checkTxt.replace(/~~/g,'');
								 if(window.CD.module.data.Json.PRGData.PRGLabelData['PRGT'+j].term == checkTxt){
									 if(window.CD.module.data.Json.PRGData.PRGLabelData['PRGT'+j].distractor_label== "T"){									 
										 diElm = cdLayer.get('#'+window.CD.module.data.Json.PRGData.PRGLabelData['PRGT'+j].labelGroupId)[0];
										 flag =false;
									 }else{
										 flag = true;
									 }
								 }							 
							 }
							 if(labelCount){
								 for(var j=0; j<labelCount; j++){
									 var checkTxt = fibArr[fibCount];
									 checkTxt = checkTxt.replace(/~~/g,'');
									 if(window.CD.module.data.Json.PRGData.PRGLabelData['PRGT'+j].term == checkTxt){
										 if(window.CD.module.data.Json.PRGData.PRGLabelData['PRGT'+j].name != txtGrpObj.parent.attrs.id){
											 otoFlag = true;
										 }
									 }							 
								 }
							 }
							 var duplicateFibFlag = false;
							 if(window.CD.module.data.Json.adminData.OTO){
								 for(var n=0;n<fibArr.length;n++){
									 for(var m=n+1;m<fibArr.length;m++){
										 if(fibArr[n]==fibArr[m]){
											 duplicateFibFlag = true; 
										 }
									 }
								 }
							 }
							
							 
							 if(!flag && !duplicateFibFlag){
								 var checkTxt = fibArr[fibCount];
								 var labelStartId = PRGData.getLabelStartId();
								 var outputJson = PRGData.getJsonData()['PRGT'+(parseInt(labelCount)-1)];
								 var labelData = {
							                "term_pos_x": 100, 
							                "term_pos_y": 50 + (labelCount*parseInt(overLapVal)), 
							                "current_item_transparency_border": outputJson.current_item_transparency_border,
							                "current_item_transparency": outputJson.current_item_transparency,
							                "media_PRGT_value": "N", 
							                "coor_PRGT_value": {}, 
							                "media_dock_x": 233, 
							                "media_dock_y": 259, 
							                "textFormat": {
							                	 "underline_value": "F", 
							                     "fontSize": 14, 
							                     "fontStyle": "normal", 
							                     "align": "center"
							                }, 
							                "lockStatus": false, 
							                "labelGroupId": 'label_'+labelStartId,
							                "distractor_label": "F"
								 };
								 var labetText = checkTxt.replace(/~~/g,'');
								 PRGView.createPrgLabel(tempValues,labelStartId,txtGrpObj,false,overLapVal,labelData,labetText);
								 //textAdd.attrs.name = 'label_'+labelCount;
							 }
							 if(diElm && diElm!= ''){
								 var activeDis ={};
								 activeDis.element = diElm;
								 PRGView.deleteLabel(activeDis);
							 }
							 
							fibCount++; 
							 
							 
						 }else{
							 fibCount++;
							 var labetText = fibArr[0];
							 var labelData = {
						                "term_pos_x": 100, 
						                "term_pos_y": 50, 
						                "current_item_transparency_border": "F", 
						                "current_item_transparency": "F", 
						                "media_PRGT_value": "N", 
						                "coor_PRGT_value": {}, 
						                "media_dock_x": 233, 
						                "media_dock_y": 259, 
						                "textFormat": {
						                	 "underline_value": "F", 
						                     "fontSize": 14, 
						                     "fontStyle": "normal", 
						                     "align": "center"
						                }, 
						                "lockStatus": false, 
						                "labelGroupId": "label_0", 
						                "distractor_label": "F"
							 };
							 labetText = labetText.replace(/\^/g,'').replace(/~~/g,'').replace(/! !/g,' ');
							 PRGView.createPrgLabel(tempValues,0,txtGrpObj,false,overLapVal,labelData,labetText);
							 //textAdd.attrs.name = 'label_0';
							 
						 }
						 
						 if((otoFlag && window.CD.module.data.Json.adminData.OTO && callFrom != 'showPRGLabelForOTM') || otoFlag2 || duplicateFibFlag){
							 if(callFrom != 'showPRGLabelForOTM'  && callFrom != 'showPRGLabelForOTO'){
								 var errorModal = window.CD.util.getTemplate({url: 'resources/themes/default/views/error_modal.html?{build.number}'});
									var alertMsg = "The text has already been used in another label.";
									$('#toolPalette #errorModal').remove();
									$('#toolPalette').append(errorModal);
									$("#errorModal span#errorCancel").hide();
									$("#errorModal span#errorOk").html("Ok");
									$('#alertText .frame_warning_text').show();
									$('#errorModal #errAlertText').html(alertMsg);
									$('#errorModal').slideDown(200);		
									$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
									$("#errorContainer span#errorOk").off('click').on('click',function(){						
										$('#errorModal').slideUp(100);
									});
							 }
							 
							 if(txtGrpObj.children.length>0){
								 for(var k=0;k<txtGrpObj.children.length;k++){
									 if(txtGrpObj.children[k].attrs.id.match(/^dockTxt_[0-9]_[0-9]+/) /*|| (txtGrpObj.children[k].attrs.id.match(/^dock_addTxt_[0-9]+/))*/){
										 txtGrpObj.children[k].destroy(); 
										 k--;
									 }
								 }
							 }
							otoFlag2 = true;
							PRGData.prgOtoDuplicateElm = true;
							window.CD.module.data.Json.PRGData.PRGDockData[prg].sentence = '';
							
						 }else{
							 colorText ='red';
							 underlinedTextStyle = underlinedTextStyle+',fillIn';	
							 var txtObj = textFormatPRG.createPRGText(txtGrpObj, tempValues, 'center',globalFontStyle,txtSeq,'dock');
							 txtSeq = txtObj.txtSeq;
							 txtGrpObj = txtObj.labelTxtGrp;
						 }
						 
						 
					 }else{
						 if(!otoFlag2){
							 var style = '';
								if(formattedTextArr[i].toString().indexOf('[b]') != -1){
									if(formattedTextArr[i].indexOf('#') == -1){
										tempValues = formattedTextArr[i]+'#';
									}
									style = 'bold';
								}
									
								if(formattedTextArr[i].toString().indexOf('[i]') != -1){
									if(formattedTextArr[i].indexOf('#') == -1){
										tempValues = formattedTextArr[i]+'#';
									}
									style = style+' italic';
								}
									
								
								
								var fontStyle = 'normal';
								if((formattedTextArr[i].indexOf('[i]')!= -1) || (formattedTextArr[i].indexOf('[b]')!= -1))
									fontStyle = style;
								
								var underlinedTextStyle = 'normal_text,nametxt';
								if(formattedTextArr[i].toString().indexOf('[u]') != -1){
									if(formattedTextArr[i].indexOf('#') == -1){
										tempValues = formattedTextArr[i]+'#';
									}
									underlinedTextStyle = 'underlined_text,nametxt';
								}
								
								tempValues = tempValues.replace(/#/g,' ');
								
								if(underline_value == 'T'){
									underlinedTextStyle = 'underlined_text,nametxt';
								}
								if(globalFontStyle){
									if(globalFontStyle.fontStyle){
										if(style!= ''){
											var globalFontType = globalFontStyle.fontStyle;
											var textStyleArr = globalFontType.split(' ');
											var eachStyleArr = style.split(' ');
											for(var eachStyle in textStyleArr){
												if(eachStyleArr.indexOf(textStyleArr[eachStyle]) == -1){
													fontStyle = $.trim(fontStyle)+' '+textStyleArr[eachStyle];
												}
											}
										}else{
											fontStyle = globalFontStyle.fontStyle;
										}
									}
									if(globalFontStyle.fontSize){
										textFontSize = globalFontStyle.fontSize;
									}							
								}else{
									if(boldItalicStatus && boldItalicStatus != 'normal'){
										if(style != ""){
											var fontStyleArr = style.split(' ');
											var boldItalicStatusArr = boldItalicStatus.split(' ');
											for(var eachStyle in boldItalicStatusArr){
												if(fontStyleArr.indexOf(boldItalicStatusArr[eachStyle]) == -1){
													if(fontStyleArr.indexOf('normal') == -1)
														fontStyle = $.trim(style)+' '+boldItalicStatusArr[eachStyle];
													else
														fontStyle = boldItalicStatusArr[eachStyle];
												}
											}
										}
										else{
											fontStyle = boldItalicStatus;
										}
									}
								}
							 colorText ='#555';
							 nameParam = 'nametxt';
							 
							 tempValues = tempValues.replace(/\^/g,'');
							 if((tempValues.indexOf('[b]') != -1) || (tempValues.indexOf('[i]') != -1) || (tempValues.indexOf('[u]') != -1)){
								 
								if(tempValues.indexOf('[b]') != -1){
									tempValues = tempValues.replace('[b]','');			
								}
								if(tempValues.indexOf('[u]') != -1){
									tempValues = tempValues.replace('[u]','');			
								}
								if(tempValues.indexOf('[i]') != -1){
									tempValues = tempValues.replace('[i]','');			
								}
								 
							 }
							 if(tempValues.indexOf('~~') != -1){
								 tempValues = tempValues.replace(/~~/g,'').replace(/! !/g,' ');
							 }
							 if(tempValues.indexOf('! !') != -1){
								 tempValues = tempValues.replace(/! !/g,' ');
							 }
							 if(tempValues.indexOf('__') != -1){
								 tempValues = tempValues.replace(/__/g,'');
							 }
							 var textAdd = new Kinetic.Text({	       
							        text: tempValues,//$("#textToolTextBox").val(),						        
							        fontSize: fontSize,
							        fontFamily: 'sans-serif',
							        fill: colorText,
							        width: 'auto',
							        height: 'auto',
							        opacity: '1',
							        verticalAlign:'top',
							        fontStyle: fontStyle,
							        id: 'dockTxt_'+txtGrpId+'_'+txtSeq,
							        name : underlinedTextStyle,
							        padding:2
							      }); 
							 
							 if(txtSeq == 0){
								 txtGrpObj.add(textAdd);
								 textAdd.setX(0);
								 textAdd.setY(0);
							 }
							 else{
								 var prevtxtObj = cdLayer.get('#dockTxt_'+txtGrpId+'_'+(txtSeq-1))[0];
								 var textObj = this.addValuefromPreviousObj(formattedTextArr[i],prevtxtObj,textAdd, txtGrpObj.getWidth(),buffer);
								 txtGrpObj.add(textObj);
							 }
							 
							 /*var updatedTextFormat = {
										fontStyle : fontStyle,
										textComponentID : 'dock_txt_'+txtSeq+'_'+txtGrpId,
										underline_value : underline_val,
										componentValue : tempValues
							}
								
							updatedTextFormat = jQuery.extend(true, {}, updatedTextFormat);
								*/
							txtSeq++;
							//window.CD.module.data.textGroupComponent.push(updatedTextFormat); 
						 }else{
							 if(txtGrpObj.children.length>2){
								 for(var j=2;j<txtGrpObj.children.length;j++){
									 if(txtGrpObj.children[j].attrs.id.match(/^dockTxt_[0-9]_[0-9]+/)){
										 txtGrpObj.children[j].remove(); 
									 }
								 }
							 }
						 }
					 }
				 }
			 }			
			 var txtGrpAlignArray = [];
			 txtGrpAlignArray.push(txtGrpObj);
			 if(align == 'left' || align == 'justify'){
				 this.alignActiveTextLeft(txtGrpAlignArray);      
			 }else if(align == 'right'){
				 this.alignActiveTextRight(txtGrpAlignArray);      
			 }else if(align == 'center'){
				 this.alignActiveTextMiddle(txtGrpAlignArray);      
			 }
			 
			 var params = {};
			 
			 params.fontStyle = textFormat.fontStyle;
			 params.underline_value = textFormat.underline_value;
			 params.fontSize = textFormat.fontSize;
			 params.align = textFormat.align;
			 
			 PRGData.updateDockTextData(params,txtGrpObj.parent.getId());
			 
			 var globLoc = undefined;
			 if(underline_value == 'T'){
				 globLoc = 'global';
			 }
			 this.applyTextUnderline(txtGrpObj,undefined,globLoc);
			 PRGView.deleteExtraLabels(txtGrpObj.parent);	
			 return txtGrpObj;
	},
	
	this.reformat = function(str,tag){
		console.log("@reformat :: dockText");
		try{
			var patternHash = new RegExp('#'+tag+'#(.+)#/'+tag+'#','g');
			var hashFormatStart = new RegExp('#'+tag+'#','g');
			var hashFormatEnd = new RegExp('#/'+tag+'#','g');
			var startSpace = new RegExp('<'+tag+'>([\\s])','g');
			var endSpace = new RegExp('([\\s])</'+tag+'>','g');
			var blankPattern = new RegExp('<'+tag+'></'+tag+'>','g');

			var wrapTag = new RegExp('<'+tag+'>(</(b|i|u)>)','g');
			
			if(str.match(patternHash)){
				str = str.replace(/__/g, '</'+tag+'>__<'+tag+'>').replace(hashFormatStart,'<'+tag+'>').replace(hashFormatEnd,'</'+tag+'>').replace(startSpace,' <'+tag+'>').replace(endSpace,'</'+tag+'> ').replace(blankPattern,'');
				str = str.replace(wrapTag,'$1<'+tag+'>');
			}
			return str;
		}catch(error){
			console.info("Error in reformat :: dockText "+error.message);
		}
	};

	this.parseFormattedText = function(str) {
		console.log("@parseFormattedText :: dockText");
		try{
			if(str != ""){
				var thisObj = this;
				var patternB = new RegExp("<b>(.+?)</b>","g");
				var patternI = new RegExp("<i>(.+?)</i>","g");
				var patternU = new RegExp("<u>(.+?)</u>","g");


				var patternWrapB = new RegExp('<b></(i|u)>','g');
				var patternWrapI = new RegExp('<i></(b|u)>','g');
				var patternWrapU = new RegExp('<u></(i|b)>','g');
				
				//var patternBHash = new RegExp("#b#(.+)#/b#","g");
				var boldMatch = str.match(patternB);
				var arr = new Array();

				var boldSplitted = str.replace(patternB,'<b>#b#$1#/b#</b>').split(patternB);

				$.each(boldSplitted,function(i,v){
					boldSplitted[i] = thisObj.reformat(v,'b');
				});
				str = boldSplitted.join('');
				
				var italicsSplitted = str.replace(patternI,'<i>#i#$1#/i#</i>').split(patternI);

				$.each(italicsSplitted,function(i,v){
					italicsSplitted[i] = thisObj.reformat(v,'i');
				});

				str = italicsSplitted.join('');

				var underlinedSplitted = str.replace(patternU,'<u>#u#$1#/u#</u>').split(patternU);

				$.each(underlinedSplitted,function(i,v){
					underlinedSplitted[i] = thisObj.reformat(v,'u');
				});
				str = underlinedSplitted.join('');
				$('#preformat').html(str.replace(/([\s])/g,'`'));
				str = new XMLSerializer().serializeToString($("#preformat")[0]).replace(/`/g,' ').replace(/<div(.*)">(.*)<\/div>/,'$2');
				console.log(str);
			}else{
				console.log("blank string");
			}			
			return str;
		}catch(err){
			console.info("Error in parseFormattedText :: dockText "+err.message);
		}
	};
	
	this.prepareFIBSpace = function(textarr){
		console.log('@prepareFIBSpace :: dockText');
		try{
			var formattedText = "";
			var textArrLen = textarr.length;
			for(var k=0;k<textArrLen;k++){
				var text = textarr[k];
				if(text.indexOf('~~') != -1){
					var frmtdText = text.replace(/\s/g,'!#!').replace(/~~/g,'__');
					formattedText = formattedText+frmtdText;
				}else{
					formattedText = formattedText+text;
				}
			}
			return formattedText;
		}catch(err){
			console.log("Error in prepareFIBSpace :: dockText "+err.message);
		}
	},
	
	this.TextAlignMent= function(txtGrpObj,align){
		console.log('@TextAlignMent :: dockText');
		var childTxtObj=this.getTextObjFromGroupObject(txtGrpObj);
		if(childTxtObj.length > 0){
			 var initY =0;
			 var totWidth = 0;	
			 var totalTexts =0;
			 var txtArrayC = new Array();
			 var txtArrayP = new Array();
			 var buffer = (parseInt(txtGrpObj.parent.children[0].getWidth())*0.1)/2;
			 
			 $.each(childTxtObj, function(index,val) {
				if(val.attrs.id.match(/dockTxt_[0-9]+/) || val.attrs.id.match(/lblTxt_[0-9]+/)){
					if(val.attrs.id.match(/^dock_txt_0_[0-9]+/)){
						initY = val.getY();
					}
					if(initY == val.getY()){
						txtArrayC.push(val);
					}
					else{
						txtArrayP.push(txtArrayC);
						txtArrayC = new Array();
						txtArrayC.push(val);
						initY = val.getY();					
					}
					totalTexts++;
				}
			 });
			 txtArrayP.push(txtArrayC);
			 txtGrpObj.setX(0);
			 for(j=0; j<txtArrayP.length;j++){
				 var tempArr = txtArrayP[j];
				for(i=0; i< tempArr.length; i++){
					if(i==0){
						totWidth = tempArr[i].getX();
					}
					totWidth  =  totWidth+ tempArr[i].getTextWidth();
				}
				
				for(i=0; i< tempArr.length; i++){
					if(i==0){
						if(align == 'left' || align == 'justify')
							tempArr[i].setX(buffer);
						else if(align == 'center'){
							tempArr[i].setX((txtGrpObj.getWidth()- totWidth)/2);
						}else if(align == 'right')
							tempArr[i].setX(txtGrpObj.getWidth() - totWidth);
							
					}else{
						tempArr[i].setX(tempArr[i-1].getX() +  tempArr[i-1].getTextWidth());
					}
				}
			}
		}
	},
	this.addValuefromPreviousObj = function(txtPartVal,prevtxtObj,textObj, textGrpObjWidth,buffer){		
		console.log('@addValuefromPreviousObj :: dockText');
		var prevTextX = prevtxtObj.getX() + prevtxtObj.getTextWidth() + textObj.getTextWidth() + buffer;
		var buffer = (parseInt(textGrpObjWidth)*0.1)/2;
		textGrpObjWidth = textGrpObjWidth - buffer;
		var txtGrpObj = prevtxtObj.parent;
		txtGrpObj.show();
		var totWid = 0;
		var count = 0;
		
		var txtGrpId = txtGrpObj.attrs.id.split('_')[2];
		if(prevTextX > textGrpObjWidth){
			textObj.setY(prevtxtObj.getY()+15);
			textObj.setX(0);

		}else{	
			if(txtPartVal.indexOf('^^') != -1){	
				textObj.setY(prevtxtObj.getY()+ 15);
				textObj.setX(0);
			}else{
				textObj.setY(prevtxtObj.getY());
				textObj.setX(prevtxtObj.getX() + prevtxtObj.getTextWidth());
			}
		}		
		return textObj;
	},
	this.bindLabelTextEvent=function(txtGrpObject){
		console.log('@bindLabelTextEvent :: dockText');
		var childTxtObj=this.getTextObjFromGroupObject(txtGrpObject);
		var txtNameSpace= this;

		$.each(childTxtObj, function(index,value) {
			value.on('click',function(evt){		
				txtNameSpace.textSetActive(this.parent, 'docktext');
				var evtObj = {selectorObj:txtGrpObject,x:txtGrpObject.getAbsolutePosition().x,y:txtGrpObject.getAbsolutePosition().y+$('canvas').first().offset().top};
				txtNameSpace.createTextBoxForLabel(evtObj);
				evt.cancelBubble = true;
				txtNameSpace.createMaskOnCanvas();
				$('#textToolContainer').css('z-index',100);
			});
			value.on("dblclick dbltap", function(evt) {
				var evtObj = {selectorObj:txtGrpObject,x:txtGrpObject.getAbsolutePosition().x,y:txtGrpObject.getAbsolutePosition().y+$('canvas').first().offset().top};
				txtNameSpace.createTextBoxForLabel(evtObj);
				evt.cancelBubble = true;
			});
	     });		
	};
	this.adjustFontSize=function(txtGrpObject,totHeight,cdLayer){
		var textObj = txtGrpObject.get('#dock_txt_'+txtGrpObject.attrs.id.split('_')[2])[0];
		textObj.setFontSize = (textObj.getFontSize()-1);
		if(totHeight < (textObj.textArr.length * textObj.getTextHeight())){
			this.adjustFontSize(txtGrpObject,totHeight);			
		  }
		cdLayer.draw();
	};
	/**
	 * function name: closeTextToolBox()
	 * description:on click on close link 
	 * called this method
	 
	 * param: 
	 * selector:container div id
	 * editBox:true/false[boolean]
	 * txtObj:added/edited text object[object]
	 * layerObj:layer object[object]
	 * 
	 */

	this.closeTextToolBox=function(selector,editBox,txtGrpObj,event){
		var textToolCfg=this,
		layerObj=textToolCfg.layeObj,
		txtObj=this.getTextObjFromGroupObject(txtGrpObj);
		
		  if(editBox)
		  {
			  txtGrpObj.show();
			  layerObj.draw();
		  }
		  event.selectorObj.show();
		  this.drawLayer();
		  $('#toolPalette li#'+this.createTools[0]).addClass('active');
		  $('#toolPalette li#'+this.createTools[1]).removeClass('active');
		  $(selector).remove();
		  $('#maskTool').remove();
		  this.closErrormodal();
		  
	};

	/**
	 * function name: getdockTextList()
	 * description:get total text list number
	 * plus one in a label 
	 
	 * param: 
	 * labelJsonObj-label json object[object]
	 * 
	 */

	this.getdockTextList=function(labelJsonObj,framId){
		  var textCount=0;
		  if(!labelJsonObj[framId])
		  {
			  labelJsonObjcount=0;
		  }else{
		     labelJsonObjcount=labelJsonObj[framId].dockTextList.length;
		  }
		  if(labelJsonObjcount > 0)
		  {
			  textCount=(labelJsonObjcount-1)+1;
		  }else{
			  textCount=labelJsonObjcount;
		  }
		  return textCount;
	};


	

	/**
	 * function name: textSetActive()
	 * description:this method bind all the
	 * required event for the text object 
	 
	 */
	this.textSetActive=function(txtGrpObject,type){
		console.log('@textSetActive :: dockText');
		var textToolCfg=this;//new textToolConfig();
		if(type){
			var textparam ="docktext";		
		}else{
			var textparam ="text";		
		}
		textToolCfg.cs.setActiveElement(txtGrpObject,textparam);		
	};


	
	/**
	 * function name: clearAlignClicked()
	 * description:this method clear all the
	 * old clicked align data 
	 
	 */
	this.clearAlignClicked=function(){
		console.log('@clearAlignClicked :: dockText');
		try{
			$("#leftAlignTool").data('clicked',false);
			$("#middleAlignTool").data('clicked',false);
			$("#rightAlignTool").data('clicked',false);
			$("#justifyAlignTool").data('clicked',false);
			$("#boldTool").data('clicked',false);
			$("#italicsTool").data('clicked',false);
			$("#UnderlineTool").data('clicked',false);
		}catch(err){
			console.log('Error @clearAlignClicked :: dockText '+err.message);
		}		
	};

	/**
	 * function name: getTextObjFromGroupObject()
	 * description:get text object from a group 
	 * object
	 
	 * param: 
	 * txtGrpObj-text group object[object]
	 */
	this.getTextObjFromGroupObject=function(txtGrpObj){
	  if(typeof txtGrpObj==="object" && txtGrpObj.nodeType==="Group"){
		var txtObj = new Array();
		$.each(txtGrpObj.children, function(index,value) {
				if(value.className === "Text" && value.getText() != 'Reset' && value.getText() != 'Zoom')   //excluded Student GUI text elements
				{
					txtObj.push(value);
				}
		});
		return txtObj;
	  }
	   
	};
	
	/**
	 * function name: removeSelectedTextOptions()
	 * description:on remove selected text options 
	 
	 */
	this.removeSelectedTextOptions=function(){
		
		$('.tool_select').trigger('click');
		$("#fontTextbox").val(window.CD.module.data.Json.adminData.GFS);
		$("#borderGuide").prop("checked",false);
		$("#fillGuide").prop("checked",false);
		//$("#boxWidth").val("300");
		//$("#boxHeight").val("70");
		this.cleanSelectedOptionFromOldTxt();
		
	};


	/**
	 * function name: getSelectedTextOptions()
	 * description:on setActiveElement method
	 * this method will call to highlight text 
	 
	 */
	this.getSelectedTextOptions=function(txtGrpObj){
		this.cleanSelectedOptionFromOldTxt();
		var txtCfg=this;//new textToolConfig();
		var rectObj;
		var textAlign;
		var textFontSize;
		var textFontStyle ='normal';
		var moduleData = window.CD.module.data;
		var jsonData = moduleData.getDockJsonData()[moduleData.getDockIndex(txtGrpObj.parent.attrs.id)];
		txtOpt={align:'',bold:'',italic:'',underline:''};//var txtOptArr=txtOpt.split(',');
		/*txt*/
		var txtObj=this.getTextObjFromGroupObject(txtGrpObj);
		$.each(txtObj,function(i,val){
			if(!(val.attrs.id.match(/dock_addTxt_[0-9]+/)) && val.nodeType == 'Shape' && val.className == 'Text') {
				textAlign=val.getAlign();
				textFontSize=val.getFontSize();
				textFontStyle=val.getFontStyle();
			}
		});
		
		/*rect*/
		
		var rectStrok=txtGrpObj.children[0].getStroke();
		var rectFill=txtGrpObj.children[0].getFill();
		/*align part*/
		if(textAlign==="center"){
			$("#middleAlignTool").addClass('active');
			 txtOpt.align='middleAlignTool';
			}
		else if(textAlign==="left"){
			$("#leftAlignTool").addClass('active');
			
			txtOpt.align='leftAlignTool';
		}
		else if(textAlign==="right"){
			$("#rightAlignTool").addClass('active');
			//if($.inArray('rightAlignTool',txtOptArr)=="-1")txtOpt+=',rightAlignTool';
			txtOpt.align='rightAlignTool';
		}
		else if(textAlign==="justify"){
			$("#justifyAlignTool").addClass('active');
			//if($.inArray('justifyAlignTool',txtOptArr)=="-1")txtOpt+=',justifyAlignTool';
			txtOpt.align='justifyAlignTool';
		}
		
		/*font part*/
		if(textFontSize!==""){
			$("#fontTextbox").val(textFontSize);
			//if($.inArray('fontTextbox',txtOptArr)=="-1")txtOpt+=',fontTextbox';
			
		}
		
		/*bold part*/
		if(textFontStyle.match(/bold+/)){
			$("#boldTool").addClass('active');
			//if($.inArray('boldTool',txtOptArr)=="-1")txtOpt+=',boldTool';
			txtOpt.bold='boldTool';
		}
		/*italic*/
		if(textFontStyle.match(/italic+/)){
			
			$("#italicsTool").addClass('active');
			//;if($.inArray('italicsTool',txtOptArr)=="-1")txtOpt+=',italicsTool';
			txtOpt.italic='italicsTool';
		}
		
		/*border*/
		if(rectStrok===txtCfg.borderChgClr){
			$("#borderGuide").prop("checked",true);
			
		}
		else {
			 $("#borderGuide").prop("checked",false);
			 
			
		}
		/*fill*/
		if(rectFill===txtCfg.fillChngClr){
			//$("#borderGuide").attr('checked', true);
			$("#fillGuide").prop("checked",true);
			
		}
		else {
			 $("#fillGuide").prop("checked",false);
			
			
		}
		
		$.each(txtGrpObj.children, function(index,value) {
			
			if(value.className==="Rect")
			{
				rectObj=value;
				
			}
		});
		if(rectObj)
		{
		   w=rectObj.getWidth();
		   h=rectObj.getHeight();
		   //$("#boxWidth").val(w);
		   //$("#boxHeight").val(h)
		}
		if(jsonData.textFormat.underline_value  == 'T'){
			$('#UnderlinetTool').addClass('active');
		}else{
			$('#UnderlinetTool').removeClass('active');
		}
		$("#toolPalette").data('textSelectedOpt',txtOpt);
		
	};
	
	/**
	 * function name: cleanSelectedOption()
	 * description:on clean all selected options 
	 
	 */
	this.cleanSelectedOptionFromOldTxt=function(){
	  /*bold*/
	  	 $("#boldTool").removeClass('active');
			
	  /*italic*/
		   $("#italicsTool").removeClass('active');
	  /*underline*/
		   $("#UnderlinetTool").removeClass('active');
		/*align*/
		$("#leftAlignTool").removeClass('active');
  	    $("#middleAlignTool").removeClass('active');
  	    $("#rightAlignTool").removeClass('active');
  	    $("#justifyAlignTool").removeClass('active');
  	   
  	   
  	  
	};

	/**
	 * function name: setdockTextHighlight()
	 * description:on setActiveElement method
	 * this method will call to highlight text 
	 
	 */
	this.setdockTextHighlight=function(newObject){
		console.log("@dockText.setdockTextHighlight");
		var nameSpace = this;
		var  oldObj=window.CD.elements.active.element[0];
		var textTool= this;//new textToolConfig();
		if(typeof newObject==="object" && newObject.nodeType==="Group" && (newObject.attrs.id.match(/txtGrp_[0-9]+/)))
		{
			var childrenTxtObj=this.getTextObjFromGroupObject(newObject);
			if(typeof oldObj==="object")
			{
				nameSpace.removeTextHighlight(oldObj);
			}
			
			$.each(childrenTxtObj, function(index,value) {    
				
				if(typeof value==="object" && value.nodeType==="Shape" && value.className==="Text")
				{
					value.setFill(textTool.highlightFill);
					nameSpace.getSelectedTextOptions(newObject);
				}
			});
		}else if(typeof oldObj==="object" && oldObj.nodeType==="Group" && (oldObj.attrs.id.match(/txtGrp_[0-9]+/)))
		{
			nameSpace.removeTextHighlight(oldObj);
		}
		
		textTool.drawLayer();	
	};
	/**
	 * function name: removeTextHighlight()
	 * description:to remove highlight
	 * colour of 
	 * Highlight text 
	 
	 */
	this.removeTextHighlight=function(oldObject){
		
		var nodeType=oldObject.nodeType;
		if(typeof oldObject==="object" && oldObject.nodeType==="Group" && oldObject.attrs.id.match(/txtGrp_[0-9]+/))
		{
		   var textTool= this,//new textToolConfig(),
		   oldChildrenTxtObj=this.getTextObjFromGroupObject(oldObject);
		   $.each(oldChildrenTxtObj, function(index,value) {    
		   if(typeof value==="object" && value.nodeType==="Shape" && value.className==="Text" && (!(value.attrs.id.match(/dock_addTxt_[0-9]+/))))
			   {
					value.setFill(textTool.normalFill);					
			   }
		  });
                    textTool.drawLayer();
                    this.removeSelectedTextOptions();
		}
	};
	/**
	 * function name: setTextToolEvent()
	 * description:on click of each group
	 * it will call this method to check 
	 * texttool clicked or not and open 
	 * text box accordingly 
	 
	 * param:
	 *   evt-event
	 */
	this.setTextToolEvent = function(evt){
		if($("#textTool").data('clicked')){
			 $("#textTool").data('clicked',false);
			 eventObj = {x:evt.pageX,y:evt.pageY};
			 this.createTextBox(eventObj);
			 evt.cancelBubble = true;
		}
	};
	/**
	 * function name: alignActiveText()
	 * description:align active text
	 
	 * 
	 */
	this.alignActiveTextLeft=function(elm,undoAlign,type){
		console.log('@alignActiveTextLeft :: dockText');
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		activeAlign=textStyle.align;
		var activeObj=window.CD.elements.active.element;
		var undoMng = window.CD.undoManager;
		var activeObjLength = window.CD.elements.active.element.length;
		if(elm){
			activeObjLength = elm.length;
		}
		var activeObjs = [];
		if(!elm){
			for(var j=0;j<activeObjLength;j++){
				activeObjs.push(window.CD.elements.active.element[j]);
			}
		}else{
			for(var j=0;j<activeObjLength;j++){
				activeObjs.push(elm[j]);
			}
		}
		if(!type){
			var activeObjType = window.CD.elements.active.type;
		}else{
			var activeObjType = type;
		}
		for(var i=0;i<activeObjLength;i++){
			var activeObj = activeObjs[i];
			if(activeObj.getId().match(/^dock_txtGrp_[0-9]+/) == null){
				if(activeObjType == 'dock'){
					var dock = activeObj;
					var txtId = 'dock_txtGrp_' + dock.attrs.id.split('_')[2];
					activeObj = activeObj.get('#'+txtId)[0];
				}else{
					activeObj = activeObj;
				}
			}
			
			if(activeObj.children.length == 0)
				activeObj = txtConfg.cs.getLayer().get('#'+activeObj.attrs.id)[0];
			
			var activeGrpObj=activeObj;
			
			var totalWidth =0;
			var childrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			$.each(childrenTxtObj,function(index,value){
				if(!(value.attrs.id.match(/dock_addTxt_[0-9]+/))){
					totalWidth = totalWidth + value.getTextWidth();	
					value.setAlign('left');
				}
			});
			if(typeof activeObj==="object" && activeObj.nodeType==="Group" && (activeObj.children.length>2))
			{
				this.TextAlignMent(activeObj,"left");
					
			}
			txtConfg.drawLayer();	
			
			var prg = PRGData.getDockIndex(activeObj.parent.attrs.id);
			if(prg){
				var initAlign= PRGData.getDockJsonData()[prg].textFormat.align;
				
				PRGData.getDockJsonData()[prg].textFormat.align = 'left' ;
				this.ds.setOutputData();
			}
			txtConfg.applyTextUnderline(activeObj);
			txtConfg.drawLayer();
		}
		if(undoAlign){
			undoMng.register(this, this.applyIndentation,[activeObjs,initAlign,activeObjType] , 'Text Formatting',this, this.applyIndentation,[activeObjs,'left',activeObjType] , 'Text Formatting');
			updateUndoRedoState(undoMng);
		}
			
		
	};
        
	
	this.alignActiveTextJustify=function(elm,undoAlign,type){
		console.log('@alignActiveTextJustify :: dockText');
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		activeAlign=textStyle.align;
		var activeObj=window.CD.elements.active.element;
		var undoMng = window.CD.undoManager;
		var activeObjLength = window.CD.elements.active.element.length;
		if(elm){
			activeObjLength = elm.length;
		}
		var activeObjs = [];
		if(!elm){
			for(var j=0;j<activeObjLength;j++){
				activeObjs.push(window.CD.elements.active.element[j]);
			}
		}else{
			for(var j=0;j<activeObjLength;j++){
				activeObjs.push(elm[j]);
			}
		}
		if(!type){
			var activeObjType = window.CD.elements.active.type;
		}else{
			var activeObjType = type;
		}
		for(var i=0;i<activeObjLength;i++){
			var activeObj = activeObjs[i];
			if(activeObj.getId().match(/^dock_txtGrp_[0-9]+/) == null){
				if(activeObjType == 'dock'){
					var dock = activeObj;
					var txtId = 'dock_txtGrp_' + dock.attrs.id.split('_')[2];
					activeObj = activeObj.get('#'+txtId)[0];
				}else{
					activeObj = activeObj;
				}
			}
			
			
			if(activeObj.children.length == 0)
				activeObj = txtConfg.cs.getLayer().get('#'+activeObj.attrs.id)[0];
			
			var activeGrpObj=activeObj;
			var totalWidth =0;
			var childrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			$.each(childrenTxtObj,function(index,value){
				if(!(value.attrs.id.match(/dock_addTxt_[0-9]+/))){
					totalWidth = totalWidth + value.getTextWidth();	
					value.setAlign('justify');
				}
			});
			if(typeof activeObj==="object" && activeObj.nodeType==="Group" && (activeObj.children.length>2))
			{
				this.TextAlignMent(activeObj,"justify");
					
			}
			txtConfg.drawLayer();
	//		if($('#UnderlinetTool').hasClass('active')){
	//			 txtConfg.applyTextUnderline(activeObj);			  
	//		 }
			var prg = PRGData.getDockIndex(activeObj.parent.attrs.id);
			if(prg){
				var initAlign= PRGData.getDockJsonData()[prg].textFormat.align;
				
				PRGData.getDockJsonData()[prg].textFormat.align = 'justify' ;
				this.ds.setOutputData();
			}
			txtConfg.applyTextUnderline(activeObj);
			txtConfg.drawLayer();
		}
		if(undoAlign){
			undoMng.register(this, this.applyIndentation,[activeObjs,initAlign,activeObjType] , 'Text Formatting',this, this.applyIndentation,[activeObjs,'justify',activeObjType] , 'Text Formatting');
			updateUndoRedoState(undoMng);
		}
			
		
	};
	
	this.alignActiveTextRight=function(elm,undoAlign,type){
		console.log('@alignActiveTextRight :: dockText');
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		activeAlign=textStyle.align;
		var activeObj=window.CD.elements.active.element;
		var undoMng = window.CD.undoManager;
		var activeObjLength = window.CD.elements.active.element.length;
		if(elm){
			activeObjLength = elm.length;
		}
		var activeObjs = [];
		if(!elm){
			for(var j=0;j<activeObjLength;j++){
				activeObjs.push(window.CD.elements.active.element[j]);
			}
		}else{
			for(var j=0;j<activeObjLength;j++){
				activeObjs.push(elm[j]);
			}
		}
		if(!type){
			var activeObjType = window.CD.elements.active.type;
		}else{
			var activeObjType = type;
		}
		for(var i=0;i<activeObjLength;i++){
			var activeObj = activeObjs[i];
			if(activeObj.getId().match(/^dock_txtGrp_[0-9]+/) == null){
				if(activeObjType == 'dock'){
					var dock = activeObj;
					var txtId = 'dock_txtGrp_' + dock.attrs.id.split('_')[2];
					activeObj = activeObj.get('#'+txtId)[0];
				}else{
					activeObj = activeObj;
				}
			}
			
			
			if(activeObj.children.length == 0)
				activeObj = txtConfg.cs.getLayer().get('#'+activeObj.attrs.id)[0];
			var activeGrpObj = activeObj;
			
			var totalWidth =0;
			var childrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			$.each(childrenTxtObj,function(index,value){
				if(!(value.attrs.id.match(/dock_addTxt_[0-9]+/))){
					totalWidth = totalWidth + value.getTextWidth();	
					value.setAlign('right');
				}
			});
			if(typeof activeObj==="object" && activeObj.nodeType==="Group" && (activeObj.children.length>2))
			{
				this.TextAlignMent(activeObj,"left");
				this.TextAlignMent(activeObj,"right");
			}
			txtConfg.drawLayer();
	
			var prg = PRGData.getDockIndex(activeObj.parent.attrs.id);
			if(prg){
				var initAlign= PRGData.getDockJsonData()[prg].textFormat.align;
				PRGData.getDockJsonData()[prg].textFormat.align = 'right' ;
				this.ds.setOutputData();
			}
			txtConfg.applyTextUnderline(activeObj);
			txtConfg.drawLayer();
		}
		
		if(undoAlign){
			undoMng.register(this, this.applyIndentation,[activeObjs,initAlign,activeObjType] , 'Text Formatting',this, this.applyIndentation,[activeObjs,'right',activeObjType] , 'Text Formatting');
			updateUndoRedoState(undoMng);
		}
			
	};
	
	this.alignActiveTextMiddle=function(elm,undoAlign,type){
		console.log('@alignActiveTextMiddle :: dockText');
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		activeAlign=textStyle.align;
		var activeObj=window.CD.elements.active.element;
		var undoMng = window.CD.undoManager;
		var activeObjLength = window.CD.elements.active.element.length;
		if(elm){
			activeObjLength = elm.length;
		}
		var activeObjs = [];
		if(!elm){
			for(var j=0;j<activeObjLength;j++){
				activeObjs.push(window.CD.elements.active.element[j]);
			}
		}else{
			for(var j=0;j<activeObjLength;j++){
				activeObjs.push(elm[j]);
			}
		}
		if(!type){
			var activeObjType = window.CD.elements.active.type;
		}else{
			var activeObjType = type;
		}
		for(var i=0;i<activeObjLength;i++){
			var activeObj = activeObjs[i];
			if(activeObj.getId().match(/^dock_txtGrp_[0-9]+/) == null){
				if(activeObjType == 'dock'){
					var dock = activeObj;
					var txtId = 'dock_txtGrp_' + dock.attrs.id.split('_')[2];
					activeObj = activeObj.get('#'+txtId)[0];
				}else{
					activeObj = activeObj;
				}
			}
			
			
			if(activeObj.children.length == 0)
				activeObj = txtConfg.cs.getLayer().get('#'+activeObj.attrs.id)[0];
			
			var activeGrpObj=activeObj;
			var totalWidth =0;
			var childrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			$.each(childrenTxtObj,function(index,value){
				if(!(value.attrs.id.match(/dock_addTxt_[0-9]+/))){
					totalWidth = totalWidth + value.getTextWidth();	
					value.setAlign('center');
				}
			});
			if(typeof activeObj==="object" && activeObj.nodeType==="Group" && (activeObj.children.length>2))
			{
				this.TextAlignMent(activeObj,"left");
				this.TextAlignMent(activeObj,"center");
			}
			txtConfg.drawLayer();
	//		if($('#UnderlinetTool').hasClass('active')){
	//			 txtConfg.applyTextUnderline(activeObj);			  
	//		 }
			var prg = PRGData.getDockIndex(activeObj.parent.attrs.id);
			if(prg){
				var initAlign= PRGData.getDockJsonData()[prg].textFormat.align;
				
				PRGData.getDockJsonData()[prg].textFormat.align = 'center' ;
				this.ds.setOutputData();
			}
			txtConfg.applyTextUnderline(activeObj);
			txtConfg.drawLayer();
		}
		if(undoAlign){
			undoMng.register(this, this.applyIndentation,[activeObjs,initAlign,activeObjType] , 'Text Formatting',this, this.applyIndentation,[activeObjs,'center',activeObjType] , 'Text Formatting');
			updateUndoRedoState(undoMng);
		}
	};

	/**
	 * function name: boldActiveText()
	 * description:bold active text
	 
	 * 
	 */
	this.boldActiveText=function(activeGrpObj1,undoRedoTxtStyle,type){
		console.log('@boldActiveText :: dockText');
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var activeObjLength = window.CD.elements.active.element.length;
		var undoMng = window.CD.undoManager;
		if(activeGrpObj1){
			activeObjLength = activeGrpObj1.length;
		}
		var activeObjs = [];
		if(!undoRedoTxtStyle){
			for(var j=0;j<activeObjLength;j++){
				activeObjs.push(window.CD.elements.active.element[j]);
			}
		}else{
			for(var j=0;j<activeObjLength;j++){
				activeObjs.push(activeGrpObj1[j]);
			}
		}
		if(!type){
			var activeObjType = window.CD.elements.active.type;
		}else{
			var activeObjType = type;
		}
		for(var i=0;i<activeObjLength;i++){
			var activeObj = activeObjs[i];
			var globalStyle='';
			
			if(activeObjType == 'dock'){
				var dock = activeObj;
				var txtId = 'dock_txtGrp_' + dock.attrs.id.split('_')[2];
				activeObj = activeObj.get('#'+txtId)[0];
			}else{
				activeObj = activeObj;
			}
			var activeGrpObj=activeObj;
			
			if(typeof activeObj==="object" && activeObj.nodeType==="Group")
			{			
				var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);			
				
				var textStyleObj = window.CD.module.data.getTextStyleData(activeObj.getId().split('_')[2]);
				var textStyle = textStyleObj.fontStyle;
							
				if(undoRedoTxtStyle){
					textStyle = undoRedoTxtStyle;
				}
				if(textStyle == "bold")
					newFont = "normal";
				else if(textStyle == "italic")
					newFont = "bold italic";
				else if(textStyle == "normal italic")
					newFont = "bold italic";
				else if(textStyle == "bold italic")
					newFont = "italic";
				else if(textStyle == "bold normal")
					newFont = "normal";
				else 
					newFont = "bold";
				
				globalStyle = newFont;
				
				var prg = PRGData.getDockIndex(activeObj.parent.attrs.id);
				if(prg){
					var initStyle = PRGData.getDockJsonData()[prg].textFormat.fontStyle;
					
					PRGData.getDockJsonData()[prg].textFormat.fontStyle = globalStyle;
					this.ds.setOutputData();
					var txtVal = window.CD.module.data.Json.PRGData.PRGDockData[prg].sentence;
					var pjson = window.CD.module.data.Json.PRGData.PRGDockData[prg].textFormat;
					
					var textFormat = {
							'underline_value':pjson.underline_value,
							'fontSize':pjson.fontSize,
							'fontStyle':globalStyle,
							'align': pjson.align
						};
					this.deleteActiveDockText();
					this.deleteActiveDockTextObj(activeObj);
					var globalTextStyle = {};
					globalTextStyle.fontStyle = newFont;
					var txtGrpObj = this.createText(txtVal,activeGrpObj,textFormat,globalTextStyle);
					
					
					/** Text padding-top adjustment **/
					var count = txtGrpObj.children.length-1;
				 	var dockLastChild = this.findLastTextchild(txtGrpObj,count);
					var dockTextGrpHeight = txtGrpObj.children[dockLastChild].getY() + txtGrpObj.children[dockLastChild].getHeight();
					var dockTopPadding = (txtGrpObj.parent.children[0].getHeight()-dockTextGrpHeight)/2;
					if(dockTopPadding < 0)
						dockTopPadding = 0;
					txtGrpObj.setY(dockTopPadding);
					
					if(txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0]){
					 	//var textGrpHeight = txtGrpObj.children[txtGrpObj.children.length-1].getY() + txtGrpObj.children[txtGrpObj.children.length-1].getHeight();
						txtGrpObj.get('#dock_txtBox_'+txtGrpId)[0].setFill("transparent");
						txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0].hide();
						//txtGrpObj.setY((txtGrpObj.parent.children[0].getHeight()-textGrpHeight)/2);
					}
					
					 this.bindLabelTextEvent(txtGrpObj);
					 $('#boldTool').data('clicked',true);
					// this.textSetActive(txtGrpObj, 'docktext');
				
				}
			}
			txtConfg.drawLayer();
		}
		
			/*if($('#UnderlinetTool').hasClass('active')){
				 txtConfg.applyTextUnderline(activeGrpObj);			  
			 }*/
		if(!undoRedoTxtStyle){
			undoMng.register(this, this.boldActiveText,[activeObjs,newFont,activeObjType] , 'Text Formatting',this, this.boldActiveText,[activeObjs,textStyle,activeObjType] , 'Text Formatting');
			updateUndoRedoState(undoMng);
		}
		
	};
	
	this.setTextStyling=function(activeObj,textStyles){
		console.log('@setTextStyling :: dockText');
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		if(activeObj.children.length == 0)
			activeObj = txtConfg.cs.getLayer().get('#'+activeObj.attrs.id)[0];
		var activeGrpObj=activeObj;
		
		if(typeof activeObj==="object" && activeObj.nodeType==="Group")
		{			
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);			
			$.each(activeChildrenTxtObj,function(i,val){
			if(typeof val==="object" && val.nodeType==="Shape" && val.className==="Text" && (!(val.attrs.id.match(/dock_addTxt_[0-9]+/)))&& (val.attrs.name != "underline_txt"))
				{
					val.setFontStyle(textStyles);
				}				
			});
			var prg = PRGData.getDockIndex(activeObj.parent.attrs.id);
			if(prg){
			PRGData.getDockJsonData()[prg].textFormat.fontStyle = textStyles;
			}
			this.drawLayer();
		}
		this.ds.setOutputData();
		this.cleanSelectedOptionFromOldTxt();
		this.getSelectedTextOptions(activeGrpObj);
	};
	

	/**
	 * function name: italicActiveText()
	 * description:italic active text
	 
	 * 
	 */
	this.italicActiveText=function(activeGrpObj1,undoRedoTxtStyle,type){
		console.log('@italicActiveText :: dockText');
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var activeObjLength = window.CD.elements.active.element.length;
		var undoMng = window.CD.undoManager;
		if(activeGrpObj1){
			activeObjLength = activeGrpObj1.length;
		}
		var activeObjs = [];
		if(!undoRedoTxtStyle){
			for(var j=0;j<activeObjLength;j++){
				activeObjs.push(window.CD.elements.active.element[j]);
			}
		}else{
			for(var j=0;j<activeObjLength;j++){
				activeObjs.push(activeGrpObj1[j]);
			}
		}
		if(!type){
			var activeObjType = window.CD.elements.active.type;
		}else{
			var activeObjType = type;
		}
		for(var i=0;i<activeObjLength;i++){
			var activeObj = activeObjs[i];
			if(activeObjType == 'dock'){
				var dock = activeObj;
				var txtId = 'dock_txtGrp_' + dock.attrs.id.split('_')[2];
				activeObj = activeObj.get('#'+txtId)[0];
			}else{
				activeObj = activeObj;
			}
			var activeGrpObj=activeObj;
			if(typeof activeObj==="object" && activeObj.nodeType==="Group"){
				
				var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
				$.each(activeChildrenTxtObj,function(i,val){
					if(typeof val==="object" && val.nodeType==="Shape" && val.className==="Text" && (!(val.attrs.id.match(/dock_addTxt_[0-9]+/))) && (val.attrs.name != "underline_txt"))
					{
					   txtConfg.textToolStatus=true;
					   txtConfg.getSelectedTextOptions(activeGrpObj);
					   var cuuFont=val.getFontStyle();
					   if(cuuFont=="italic")fontst="normal";
					   else if(cuuFont=="bold")fontst="bold italic";
					   else if(cuuFont=="bold italic")fontst="bold normal";
					   else if(cuuFont=="bold normal")fontst="bold italic";
					   else fontst="italic";
					   val.setFontStyle(fontst);	
					   globalStyle = fontst;
					}
				});
				var prg = PRGData.getDockIndex(activeObj.parent.attrs.id);
				if(prg){
				var initStyle = PRGData.getDockJsonData()[prg].textFormat.fontStyle;
				
				PRGData.getDockJsonData()[prg].textFormat.fontStyle = globalStyle;
				}
			}
			if($('#UnderlinetTool').hasClass('active')){
				 txtConfg.applyTextUnderline(activeGrpObj);			  
			 }
			this.ds.setOutputData();
			txtConfg.drawLayer();
		}
		
		if(!undoRedoTxtStyle){
			undoMng.register(this, this.italicActiveText,[activeObjs,initStyle,activeObjType] , 'Text Formatting',this, this.italicActiveText,[activeObjs,globalStyle,activeObjType] , 'Text Formatting');
			updateUndoRedoState(undoMng);
			
		}
	};
	
	this.underlineActiveText=function(activeGrpObj1,undoredo,type){
		console.log('@underlineActiveText :: dockText');
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var activeObjLength = window.CD.elements.active.element.length;
		var undoMng = window.CD.undoManager;
		if(activeGrpObj1){
			activeObjLength = activeGrpObj1.length;
		}
		var activeObjs = [];
		if(!undoredo){
			for(var j=0;j<activeObjLength;j++){
				activeObjs.push(window.CD.elements.active.element[j]);
			}
		}else{
			for(var j=0;j<activeObjLength;j++){
				activeObjs.push(activeGrpObj1[j]);
			}
		}
		if(!type){
			var activeObjType = window.CD.elements.active.type;
		}else{
			var activeObjType = type;
		}
		for(var i=0;i<activeObjLength;i++){
			var activeObj = activeObjs[i];
			if(activeObjType == 'dock'){
				var dock = activeObj;
				var txtId = 'dock_txtGrp_' + dock.attrs.id.split('_')[2];
				activeObj = activeObj.get('#'+txtId)[0];
			}else{
				activeObj = activeObj;
			}
			var activeGrpObj=activeObj;
		
			if(typeof activeObj==="object" && activeObj.nodeType==="Group"){
				if(!undoredo){
					if($('#UnderlinetTool').hasClass('active')){
						this.removeUnderline(activeGrpObj,'removeUnderline');	
					}else{
						var undoMng = window.CD.undoManager;
						var activeChildren = txtConfg.getTextObjFromGroupObject(activeObj);
						
						$.each(activeChildren,function(cnt,val){
							if(val.getId().match(/^dockTxt_[0-9]+/)){
								val.setName('underlined_text');
							}					
						});				
						this.applyTextUnderline(activeObj,false,'global');
						var dockId = 'dock_label_'+activeObj.getId().split('_')[2];
						var dockIndex = PRGData.getDockIndex(dockId);
						window.CD.module.data.Json.PRGData.PRGDockData[dockIndex].textFormat.underline_value = 'T';
						txtConfg.drawLayer();
					}
				}else{
					if(undoredo == "T"){
						this.removeUnderline(activeGrpObj,'removeUnderline');
					}else{
						var undoMng = window.CD.undoManager;
						var activeChildren = txtConfg.getTextObjFromGroupObject(activeObj);
						
						$.each(activeChildren,function(cnt,val){
							if(val.getId().match(/^dockTxt_[0-9]+/)){
								val.setName('underlined_text');
							}					
						});				
						this.applyTextUnderline(activeObj,false,'global');
						var dockId = 'dock_label_'+activeObj.getId().split('_')[2];
						var dockIndex = PRGData.getDockIndex(dockId);
						window.CD.module.data.Json.PRGData.PRGDockData[dockIndex].textFormat.underline_value = 'T';
						txtConfg.drawLayer();
					}
				}
				
				$('#UnderlinetTool').data('clicked', true);
				ds.setOutputData();
			}
		}
		if(!undoredo){
			undoMng.register(this, this.underlineActiveText,[activeObjs,'T',activeObjType] , 'undo text underline',this, this.underlineActiveText,[activeObjs,'F',activeObjType], 'redo text underline');
			updateUndoRedoState(undoMng);
		}
		
	};
	this.applyTextUnderline = function(activeGrpObj,rerender,applyUnderline){
		console.log('@docktext::applyTextUnderline');
		try{
			this.removeUnderline(activeGrpObj);
			var txtToolCfg = this;
			var activeChildren = txtToolCfg.getTextObjFromGroupObject(activeGrpObj);
			var ds = window.CD.services.ds;
			
			if(activeGrpObj.parent.getId().match(/^dock_label_[0-9]+/) != null){
				var labelID = activeGrpObj.parent.getId().split('_')[2];
			}else{
				var labelID = activeGrpObj.parent.getId().split('_')[1];
			}
			var textChildId = '#txt_'+labelID;
			
			var boxWidth = activeGrpObj.parent.children[0].getWidth();
			$.each(activeChildren,function(i,val){
				if(typeof val==="object" && val.nodeType==="Shape" && val.className==="Text" && (!(val.attrs.id.match(/dock_addTxt_[0-9]+/))))
				{
				  var activeObj = val;
				  var textFormat = new TextFormat();
				  var textNam = activeObj.getName();
				  if(textNam.indexOf(',') != -1){
					  textNam  = textNam.split(',')[0];
				  }
				  if(textNam == 'underlined_text'){
					  for(var i=0; i<activeObj.textArr.length ;i++){
							if(activeGrpObj.get(textChildId+'_'+i).length > 0){
								var startpos = activeObj.getX();
							}else{
								  var activeWidth = activeObj.textArr[i].width;
								  if(activeObj.getAlign() == "center"){
									  var startpos = activeObj.getX();
									  startpos = startpos - 3;
									  
									  /** commenting as of now not understanding the purpose **/
									  /*if(rerender == true)
										  startpos = startpos -5;*/
								  }else  if(activeObj.getAlign() == "left" || activeObj.getAlign() == "justify"){
									  var startpos = activeObj.getX();
								  }else  if(activeObj.getAlign() == "right"){
									  var startpos = activeObj.getX();										  
								  }
							}
							
							var adjustment = 2;
							adjustment = adjustment*(-1);
							
							var activeWidth = activeObj.textArr[i].width;  
							var underLine = new Kinetic.Line({
								   points: [startpos+2, (1+activeObj.getY() + ((i+1)*activeObj.getTextHeight())), (startpos + activeWidth-adjustment),(1+activeObj.getY() + ((i+1)*activeObj.getTextHeight()))],
							       stroke: 'black',
							       strokeWidth: 1,	
							       name: 'underline_txt'
							 });
							 
							 activeGrpObj.add(underLine);
						}
				  }					 
				}
			});			
			
		}catch(err){
			console.info("Error in docktext :: applyTextUnderline : "+err.message);
		}
	};
	
	this.removeUnderline = function(activeGrpObj,removeline){
		console.log('@removeUnderline :: dockText');
		 var txtConfg = this;
		 var undoMng = window.CD.undoManager;
		 if(activeGrpObj.children.length == 0)
			   activeGrpObj = txtConfg.cs.getLayer().get('#'+activeGrpObj.attrs.id)[0];
		 var underlineObj = activeGrpObj.get('.underline_txt');
//		   underlineObj.each(function() {
//	         this.remove();
//	        });
      /*to handle undereline delete*/
      
		 if(underlineObj.length>0){
			 for(var k = 0;k < underlineObj.length; k++){
				 underlineObj[k].remove();
			 } 
		 }
		  
		   var prg = PRGData.getDockIndex(activeGrpObj.parent.attrs.id);
		   if(prg){
		   txtConfg.drawLayer();
		   if(removeline){
			   undoMng.register(this, this.applyTextUnderlineCall,[activeGrpObj] , 'Text Formatting',this, this.removeUnderlineCall,[activeGrpObj] , 'Text Formatting');
			   updateUndoRedoState(undoMng);
			   PRGData.getDockJsonData()[prg].textFormat.underline_value = 'F';
		   }
		   
		   this.ds.setOutputData();
		   }
	};
	this.removeUnderlineCall = function (activeGrpObj){
		console.log('@removeUnderlineCall :: dockText');
		this.removeUnderline(activeGrpObj);
		$('#UnderlinetTool').removeClass('active');
	};
	this.applyTextUnderlineCall = function (activeGrpObj){
		console.log('@applyTextUnderlineCall :: dockText');
		this.applyTextUnderline(activeGrpObj);
		$('#UnderlinetTool').addClass('active');
	};
	/**
	 * function name: applyTextToolChange()
	 * description:on click on text tool apply
	 
	 * 
	 */
	this.applyTextToolChange=function(){
		console.log('@applyTextToolChange :: dockText');
		$(this).data('clicked',true);
		var boxW=$("#boxWidth").val();
		var boxH=$("#boxHeight").val();
		//if(boxW.is)
		if($('#'+this.textToolBoxId).is(":visible"))
		{
			$('#'+this.textToolBoxId).css('width',boxW);
			$('#'+this.textToolBoxId).css('height',boxH);
		}
		var txtConfg= this;//new textToolConfig();
		var textStyle=txtConfg.getTextStyle();
		var activeGrpObj=window.CD.elements.active.element[0];
		if(typeof activeGrpObj==="object" && activeGrpObj.nodeType==="Group"){
			
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeGrpObj);
			if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
			{
				this.textToolStatus=true;				
				this.onchangeTxtobjChangeGrpObj(activeChildrenTxtObj,activeGrpObj,'',true);
				txtConfg.drawLayer();		
				this.getSelectedTextOptions(activeGrpObj);
			}
		}
	};

	/**
	 * function name: setActiveTextFontSize()
	 * description:on click font tool change font size
	 * text
	 
	 * 
	 */
	this.setActiveTextFontSize=function(elm, fontsize){
		console.log('@setActiveTextFontSize :: dockText');
		var font=parseInt($("#fontTool .font_size #fontTextbox").val());
		var txtConfg= this;//new textToolConfig();
		var textStyle=txtConfg.getTextStyle();
		var activeObj=window.CD.elements.active.element;
		var activeElm = [];
		var activeObjLength = window.CD.elements.active.element.length;
		if(elm){
			activeObjLength = elm.length;
		}
		if(!elm){
			for(var j=0;j<activeObjLength;j++){
				activeElm.push(window.CD.elements.active.element[j]);
			}
		}
		
		for(var i=0;i<activeObjLength;i++){
			var activeGrpObj=activeObj[i];
			if(elm)
				activeGrpObj =  elm[i];
			 if(activeGrpObj.children.length == 0)
				 activeGrpObj = txtConfg.cs.getLayer().get('#'+activeGrpObj.attrs.id)[0];
			 
			
			var flag = false;
			var dockObj = activeGrpObj.parent.attrs.id;
			if(activeGrpObj.attrs.id.match(/dock_label_[0-9]+/) != null){
				dockObj = activeGrpObj.attrs.id;
				var dockId = dockObj.split('_')[2];
				activeGrpObj = activeGrpObj.get('#dock_txtGrp_'+dockId)[0];
			}
			var dck = PRGData.getDockIndex(dockObj);
			var dockJson = PRGData.getDockJsonData()[dck];
			var undoMng = window.CD.undoManager;
			var initFont =dockJson.textFormat.fontSize;
			
			if(dockJson && dck){
				if(fontsize)
					dockJson.textFormat.fontSize = fontsize;
				else
					dockJson.textFormat.fontSize = font;
				this.ds.setOutputData();
			}
			
			if(!font)font=parseInt(window.CD.module.data.Json.adminData.GFS);
			if(fontsize)
				font = fontsize;
			
			var rectObj;
			
			
			
			var activeChildren=this.getTextObjFromGroupObject(activeGrpObj);
			$.each(activeChildren,function(i,val){
				if(typeof val==="object" && val.nodeType==="Shape" && val.className==="Text" && (!(val.attrs.id.match(/dock_addTxt_[0-9]+/))))
				{
				  var activeObj = val;
				  if(val.attrs.id == ('dock_txt_'+activeGrpObj.attrs.id.split('_')[2])){
					  activeObj.setFontSize(font);	
					  var originalTextHeight = activeObj.textArr.length * activeObj.getTextHeight();
					  var calcY = (activeGrpObj.parent.children[0].getHeight() - originalTextHeight)/2;
					  activeGrpObj.setY(calcY);
					  txtConfg.drawLayer();		
				  }else{
					  flag = true;
				  }	
				}		  
			});
			if(flag){
				var prg = PRGData.getDockIndex('dock_label_'+activeGrpObj.attrs.id.split('_')[2]);
				var txtVal = window.CD.module.data.Json.PRGData.PRGDockData[prg].sentence;
				var pjson = window.CD.module.data.Json.PRGData.PRGDockData[prg].textFormat;
				var ffont;
				
				if(fontsize)
					ffont = fontsize;
				else
					ffont = pjson.fontSize;
				
				var textFormat = {
						'underline_value':pjson.underline_value,
						'fontSize':ffont,
						'fontStyle':pjson.fontStyle,
						'align': pjson.align
				};
				
				/*passing object in handling font size during undo redo*/
				this.deleteActiveDockText('',activeGrpObj);
				
				var txtGrpObj = this.createText(txtVal,activeGrpObj,textFormat);
				 if(txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0]){
					 	var textGrpHeight = txtGrpObj.children[txtGrpObj.children.length-1].getY() + txtGrpObj.children[txtGrpObj.children.length-1].getHeight();
						txtGrpObj.get('#dock_txtBox_'+txtGrpId)[0].setFill("transparent");
						txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0].hide();
						txtGrpObj.setY((txtGrpObj.parent.children[0].getHeight()-textGrpHeight)/2);
				}
				 this.drawLayer();
				 this.bindLabelTextEvent(txtGrpObj);
				
				 /** Text padding-top adjustment **/
				var count = txtGrpObj.children.length-1;
			 	var dockLastChild = this.findLastTextchild(txtGrpObj,count);
				var dockTextGrpHeight = txtGrpObj.children[dockLastChild].getY() + txtGrpObj.children[dockLastChild].getHeight();
				var dockTopPadding = (txtGrpObj.parent.children[0].getHeight()-dockTextGrpHeight)/2;
				if(dockTopPadding < 0)
					dockTopPadding = 0;
				txtGrpObj.setY(dockTopPadding);
			}
			
			var prg = PRGData.getDockIndex(activeGrpObj.parent.attrs.id);
			PRGData.getDockJsonData()[prg].textFormat.fontSize = font ;
			//window.CD.module.data.Json.adminData.GFS = font;
			this.ds.setOutputData();
			
			this.applyIndentation(txtGrpObj,textStyle.align);//Parameters passed otherwise from the method its taking middle aligned if text align is undefined
			
		}
		
		if(fontsize == undefined && initFont != font){//So that undo dont get register for same font change
			undoMng.register(this, this.setActiveTextFontSize,[activeElm,initFont] , 'Text Formatting',this, this.setActiveTextFontSize,[activeElm,font] , 'Text Formatting');
			updateUndoRedoState(undoMng);
		}
		
		
	};
	/**
	 * function name: applyIndentation()
	 * description: to apply text indentation
	 
	 * 
	 */
	this.applyIndentation=function(txtGrp,textAlign,activeObjType){
		 $('#leftAlignTool').removeClass('active');
		 $('#justifyAlignTool').removeClass('active');
		 $('#rightAlignTool').removeClass('active');
		 $('#middleAlignTool').removeClass('active');
		 
		 /** Set left align as default alignment **/
		if(textAlign == "center"){
			this.alignActiveTextMiddle(txtGrp,'',activeObjType);
	        $('#middleAlignTool').addClass('active');
        }else if(textAlign == "justify"){
            this.alignActiveTextJustify(txtGrp,'',activeObjType);
            $('#justifyAlignTool').addClass('active');
        }else if(textAlign == "right"){
            this.alignActiveTextRight(txtGrp,'',activeObjType);
            $('#rightAlignTool').addClass('active');
        }else{
        	 this.alignActiveTextLeft(txtGrp,'',activeObjType);
             $('#leftAlignTool').addClass('active');           
        }
	},
	/**
	 * function name: deleteActiveText()
	 * description:on click delete tool delete active
	 * text
	 
	 * 
	 */
	

	this.deleteActiveDockText=function(deleteTxt,elm,statusFlag){
		var txtConfig = this;
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var cdLayer = window.CD.services.cs.getLayer();
		var active = window.CD.elements.active;
		var activeElm = active.element[0];
		var undoMng = window.CD.undoManager;
		if(elm){
			activeElm = elm;
		}
		
		var activeObjType = window.CD.elements.active.type;
		if(activeObjType == 'dock' && activeElm.getId().match(/^dock_txtGrp_[0-9]+/) == null){
			var dock = activeElm;
			var txtId = 'dock_txtGrp_' + dock.attrs.id.split('_')[2];
			activeElm = activeElm.get('#'+txtId)[0];
		}else{
			activeElm = activeElm;
		}
		
		var dockGroup = activeElm.parent;
		var txtGrpObjId = activeElm.attrs.id;
		var txtId = txtGrpObjId.split("_")[2];	
		if(activeElm.children.length == 0)
			activeElm = this.cs.getLayer().get('#'+activeElm.attrs.id)[0];
		var prgId = activeElm.parent.attrs.id;
		var prg = PRGData.getDockIndex(prgId);
		if(activeElm.get('.underline_txt')[0])
			this.removeUnderline(activeElm);
		var activeChildrenTxtObj=txtConfig.getTextObjFromGroupObject(activeElm);
		$.each(activeChildrenTxtObj,function(i,val){
			if(typeof val==="object" && val.nodeType==="Shape" && val.className==="Text" && (!(val.attrs.id.match(/dock_addTxt_[0-9]+/))))
			{
				val.destroy();
			}
		});
		if(activeElm.get('#dock_addTxt_'+txtId)[0]){
			var addtxt = activeElm.get('#dock_addTxt_'+txtId)[0];
			addtxt.show();
			addtxt.setFill('#555');
			if(activeElm.parent.get('.img')[0]){
				addtxt.parent.setY(activeElm.parent.children[0].getHeight()-20);				
			}else{
				activeElm.setY((activeElm.parent.children[0].getHeight() - addtxt.getTextHeight())/2);				
			}
			addtxt.setHeight(17);
			activeElm.setX(10);
			addtxt.setWidth(activeElm.parent.children[0].getWidth()-20);
			addtxt.setAlign("center");
		}
			
		if(activeElm.get('#dock_txtBox_'+txtId)[0]){
			activeElm.get('#dock_txtBox_'+txtId)[0].setFill('#fff');
			activeElm.get('#dock_txtBox_'+txtId)[0].setWidth(activeElm.parent.children[0].getWidth()- 20);
		}
		var groupId = activeElm.parent.attrs.id;	
		if(activeElm.parent.get('.lockicon_' + groupId)[0]){
			activeElm.parent.get('.lockicon_' + groupId)[0].moveToTop();
			activeElm.parent.get('.unlockicon_' + groupId)[0].moveToTop();
		}
		cdLayer.draw();
		if(activeChildrenTxtObj.length > 1){
			//txtConfig.cs.setActiveElement(cs.getGroup('frame_0'),'frame');
			if(deleteTxt && deleteTxt!=''){
				var initValue = window.CD.module.data.Json.PRGData.PRGDockData[prg].sentence;
					
				window.CD.module.data.Json.PRGData.PRGDockData[prg].sentence = '';
				ds.setOutputData();
				
				undoMng.register(this, this.textCreation,[prg,initValue,activeElm] , 'Undo Text Delete',this, this.deleteActiveDockText,['',activeElm,'calledFromRedo'] , 'Undo Text Delete');	
				updateUndoRedoState(undoMng);
				PRGView.deleteExtraLabels(dockGroup);
			}
			/** done for delete redo **/
			if(statusFlag){
				window.CD.module.data.Json.PRGData.PRGDockData[prg].sentence = '';
				ds.setOutputData();
				PRGView.deleteExtraLabels(dockGroup);
			}
		}
	};
	
	this.textCreation = function(prg,value,activeElm){
		var prgJson = window.CD.module.data.Json.PRGData.PRGDockData[prg];
		if(activeElm.children.length == 0)
			activeElm = this.cs.getLayer().get('#'+activeElm.attrs.id)[0];
		var underline = prgJson.textFormat.underline_value;
		var textFormat = {
                "underline_value": prgJson.textFormat.underline_value, 
                "fontSize":  prgJson.textFormat.fontSize, 
                "fontStyle": prgJson.textFormat.fontStyle, 
                "align": prgJson.textFormat.align
            }; 
		this.deleteActiveDockText('',activeElm);
		var txtGrpObj = this.createText(value,activeElm,textFormat);
		txtGrpObj.get('#dock_txtBox_'+txtGrpId)[0].setFill("transparent");	
		$('#maskTool').remove();
		 if($('#UnderlinetTool').hasClass('active') || underline == 'T'){
			 this.applyTextUnderline(txtGrpObj);	
			 $('#UnderlinetTool').addClass('active');
		 }
		 
		 if(txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0]){
			 	var textGrpHeight = txtGrpObj.children[txtGrpObj.children.length-1].getY() + txtGrpObj.children[txtGrpObj.children.length-1].getHeight();
				txtGrpObj.get('#dock_txtBox_'+txtGrpId)[0].setFill("transparent");
				txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0].hide();
				txtGrpObj.setY((txtGrpObj.parent.children[0].getHeight()-textGrpHeight)/2);
		}
		 
		 /** Text padding-top adjustment **/
		var count = txtGrpObj.children.length-1;
	 	var dockLastChild = this.findLastTextchild(txtGrpObj,count);
		var dockTextGrpHeight = txtGrpObj.children[dockLastChild].getY() + txtGrpObj.children[dockLastChild].getHeight();
		var dockTopPadding = (txtGrpObj.parent.children[0].getHeight()-dockTextGrpHeight)/2;
		if(dockTopPadding < 0)
			dockTopPadding = 0;
		txtGrpObj.setY(dockTopPadding);
		 
		 this.drawLayer();
		 this.textSetActive(txtGrpObj, 'docktext');
		 this.bindLabelTextEvent(txtGrpObj);
		 prgJson.sentence = value;
		 this.ds.setOutputData();
	}
	/**
	 * function name: checkSubOrSuperTagExist()
	 
	 */
	this.checkSubOrSuperTagExist=function(value){
		console.log("@dockText.checkSubOrSuperTagExist");
		if(value.match(/<sb>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sb>/g) || value.match(/<sp>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sp>/g)){
			return true;
		}
	};
	
	/**
	 * function name: checkSubTagExist()
	 
	 */
	this.checkSubTagExist=function(value){
		console.log("@dockText.checkSubTagExist");
		if(value.match(/<sb>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sb>/g)){
			return true;
		}
	};
	/**
	 * function name: checkSupTagExist()
	 
	 */
	this.checkSupTagExist=function(value){
	 if(value.match(/<sp>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sp>/g)){
			return true;
		}
	};
	/**
	 * function name: convertSbSpscript()
	 
	 */
	this.convertSbSpscript=function(value){
		console.log("@dockText.convertSbSpscript");
		var returnValue=value.replace(/<\/sb><sb>/g,'').replace(/<\/sp><sp>/g,'');
		var converTedArr=[];
		var frameObj=this;
		var returnFalse=true;
		
		//subscript
		if(this.checkSubTagExist(returnValue)){
			var matchArr=returnValue.match(/<sb>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sb>/g);
			$.each(matchArr,function(index,vals){
				var sbReplace=vals.replace(/<sb>/g,'').replace(/<\/sb>/g,'');
				var finalreplace='';
				for(var strt=0;strt<sbReplace.length;strt++){
					if(typeof sbReplace[strt]!=="undefined"){
						if(frameObj.getEachSubscriptChar(sbReplace[strt])===sbReplace[strt]){
							frameObj.showErrorModal(frameObj.SubErrorMesg);
							returnFalse=false;
							return false;
						}else{
							finalreplace=finalreplace+frameObj.getEachSubscriptChar(sbReplace[strt]);
						}
					}
				
				}
				//converTedArr[index]=finalreplace;
				returnValue=returnValue.replace(matchArr[index],finalreplace);	
			});
		}
		//superscript
		if(this.checkSupTagExist(returnValue)){
			var matchArr1=returnValue.match(/<sp>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sp>/g);
			$.each(matchArr1,function(index1,vals1){
				var sbReplace1=vals1.replace(/<sp>/g,'').replace(/<\/sp>/g,'');
				var finalreplace1='';
				for(var strt1=0;strt1<sbReplace1.length;strt1++){
					if(typeof sbReplace1[strt1]!=="undefined"){
						if(frameObj.getEachSuperscriptChar(sbReplace1[strt1])===sbReplace1[strt1]){
							frameObj.showErrorModal(frameObj.SubErrorMesg);
							returnFalse=false;
							return false;
						}else{
						finalreplace1=finalreplace1+frameObj.getEachSuperscriptChar(sbReplace1[strt1]);
						}
					}
				
				}
				//converTedArr[index]=finalreplace;
				returnValue=returnValue.replace(matchArr1[index1],finalreplace1);	
			});
		}
		if(returnFalse){
			return returnValue;
		}else{
			return returnFalse;
		}
		
	};
	/**
	 * function name: getEachSubscriptChar()
	 
	 */
	this.getEachSubscriptChar=function(char0){
		console.log("@dockText.getEachSubscriptChar");
		var subCharArr=this.textSbSpScript.getSubscriptCharecterList();
		char0=char0.toLowerCase();
		if(subCharArr[char0]){
			return subCharArr[char0];
		}else{
			return char0;
		}
	};
	/**
	 * function name: getEachSuperscriptChar()
	 
	 */
	this.getEachSuperscriptChar=function(char1){
		var subCharArr1=this.textSbSpScript.getSuperscriptCharecter();
		char1=char1.toLowerCase();
		if(subCharArr1[char1]){
			return subCharArr1[char1];
		}else{
			return char1;
		}
	};
	
	/**
	 * function name: checkAndUpdateCharFromPalete()
	 
	*/

	this.checkAndUpdateCharFromPalete=function(typedValue){
	 var updatedValue="";
	 var subscriptCharList=this.textSbSpScript.getCharecterFromSubscript();
	  var superscriptCharList=this.textSbSpScript.getCharecterFromSuperscript();
		 for(var sbsp=0;sbsp<typedValue.length;sbsp++){
			 if(typeof subscriptCharList[typedValue[sbsp]]!=="undefined"){
				 updatedValue+="<sb>"+subscriptCharList[typedValue[sbsp]]+"</sb>";
			 }else if(typeof superscriptCharList[typedValue[sbsp]]!=="undefined"){
				 updatedValue+="<sp>"+superscriptCharList[typedValue[sbsp]]+"</sp>";
			 }else{
				 updatedValue+=typedValue[sbsp];
			 }
			 
			 
		 }
		 return updatedValue.replace(/<\/sb><sb>/g,'').replace(/<\/sp><sp>/g,'');
	};
	/**
	 * function name: showErrorModal()
	 
	 */
	this.showErrorModal=function(message){
		var errorModal = this.Util.getTemplate({url: 'resources/themes/default/views/error_modal.html?{build.number}'});
		
		$('#toolPalette #errorModal').remove();
		$('#toolPalette').append(errorModal);
		
		$("#errorContainer span#errorOk").html("Ok");
		$("#errorContainer span#errorOk").off('click').on('click',function(){
			$('#errorModal').slideUp(200);
			$('#toolPalette #errorModal').remove();
		});
		
		$("#errorModal span#errorCancel").off('click').on('click',function(){
			$('#errorModal').slideUp(200);
			$('#toolPalette #errorModal').remove();
		});
		$('#alertText .frame_warning_text').show();
		$('#errAlertText').html(message);
		$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
		$('#alertMessage').slideDown(200);	
	};
	/**
	 * function name: closErrormodal()
	 
	 */
	this.closErrormodal=function(message){
		$('#errorModal').slideUp(200);
		$('#toolPalette #errorModal').remove();
	};
	
	this.createMaskOnCanvas=function(){
		console.log("@createMaskOnCanvas :: dockText");
		try{
			$('#maskOnFrame').remove();
			var canvasWidth = parseInt(window.CD.module.data.Json.adminData.AW) + 15;
			var canvasHeight = parseInt(window.CD.module.data.Json.adminData.AH) + 15;
			var canvasInactiveBar = $('<div id="maskOnFrame" style="position:absolute;opacity:0.05;z-index:99;"></div>');
			canvasInactiveBar.css({width:canvasWidth+'px', height:canvasHeight+'px'});
			$('body').append(canvasInactiveBar);
		}
		catch(err){
			console.info("Error in createMaskOnCanvas :: dockText "+err.message);
		}
	};
	
};
