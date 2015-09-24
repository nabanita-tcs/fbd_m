/*this class is common class for all module label text**/
//var TextTool=TextTool || {};
/**
 * class name: commonLabelText
 * description:common class for all module label text
 * author:Piyali Saha
 */
TextTool.commonLabelText = function (){
	
	this.textToolBoxId="textToolTextBox";
	this.hintBoxId="hintToolTextBox";
	this.feedbackBoxId="feedbackToolTextBox";
	this.textToolBoxId="textToolTextBox";
	this.textToolContainerId="textToolContainer";
	this.createTools=window.CD.tools.create;
	this.formatTools = window.CD.tools.format;
	this.textSbSpScript=new TextSuperSubScript();
	this.fontsize = window.CD.module.data.Json.adminData.GFS;
	this.textMaxChar=256;
	this.maxCharWarning=(this.textMaxChar)-5;
	this.style={align:"center",border:"F",fontStyle:"normal",fill:"F"};
	this.textFormat = new TextFormat();
	this.textEditor = new TextEditor();
	/*main service initialization*/
	 this.cs = window.CD.services.cs;
	 this.ds = window.CD.services.ds;
	 this.cdLayer=this.cs.getLayer();
	
	/*highlight color initialization*/
	 this.highlightFill="#1086D9";
	 this.normalFill="#555";
	
	/*draw layer method*/
	 this.drawLayer=function(){
			this.cs.getLayer().draw();
	  };
	/*fetch style object for a text*/
	  this.getTextStyle=function(txtObj){
			/* for align*/
			if($("#leftAlignTool").data('clicked'))
				this.style.align="left";
			else if($("#middleAlignTool").data('clicked'))
				this.style.align="center";
			else if($("#rightAlignTool").data('clicked'))
				this.style.align="right";
			else if($("#justifyAlignTool").data('clicked'))
				this.style.align="justify";
			else if(txtObj) 
				this.style.align=txtObj.attrs.align;
			else 
				this.style.align="center";
			/* align end*/
			if((!$("#leftAlignTool").hasClass('active')) && (!$("#middleAlignTool").hasClass('active')) && (!$("#rightAlignTool").hasClass('active')) && (!$("#justifyAlignTool").hasClass('active'))){
				this.style.align="center";
			}
			
				/* for font type bold & italic */	
				if($("#boldTool").data('clicked') || ($("#boldTool").hasClass('active')))
					this.style.fontStyle="bold";
				else if($("#italicsTool").data('clicked') || ($("#italicsTool").hasClass('active')))
					this.style.fontStyle="italic";
				else 
					this.style.fontStyle="normal";
				/* For both bold & italic font type */	
				if(($("#boldTool").hasClass('active')) && ($("#italicsTool").hasClass('active'))) {
					this.style.fontStyle="bold italic";
				}
				
				/* bold & italic font type end*/		
				if((!$("#boldTool").hasClass('active')) && (!$("#italicsTool").hasClass('active'))) {
					this.style.fontStyle="normal";
				}
				
		    /*border property*/
				if ($('#borderGuide').is(':checked'))
					this.style.border="T";
				else 
					this.style.border="F";
				
			/*end border property*/
				
			/*fill property*/
				if ($('#fillGuide').is(':checked'))
					this.style.fill="T";
				else 
					this.style.fill="F";
				
			/*end border property*/	
				
			/** ---- For font size ---- **/
			this.style.fontsize = window.CD.module.data.Json.adminData.GFS;//$("#fontTool .font_size #fontTextbox").val();
			return this.style;
		};
		
	/**
	 * function name: setTextActive()
	 * author:Piyali Saha
	 */
	this.setTextActive=function(textGropObject){
		console.log("@COIView.setTextActive");
		try{
				var textparam ="commonLabelText";		
				this.cs.setActiveElement(textGropObject,textparam);
		}catch(err){
				console.error("@COIView::Error on setTextActive::"+err.message);
		}
		
	};
	/**
	 * function name: getTextObjFromGroupObject()
	 * author:Piyali Saha
	 */
	this.getTextObjFromGroupObject=function(txtGrpObj){
		console.log("@commonLabelText.getTextObjFromGroupObject");
		try{
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
		  }
		catch(err){
			console.error("@commonLabelText::Error on getTextObjFromGroupObject::"+err.message);
		}
	   
	};
	/**
	 * function name: setCommonLabelTextHighlight()
	 * Modified by Nabonita Bhattacharyya
	 */
	this.setCommonLabelTextHighlight=function(oldActiveElm,activeElm,type){
		console.log("@commonLabelText.setCommonLabelTextHighlight");
		try{
			var  oldObj = oldActiveElm;
			var textTool= this;//new textToolConfig();
			if(typeof activeElm==="object" && activeElm.nodeType==="Group" && (activeElm.attrs.id.match(/txtGrp_[0-9]+/)))
			{
				openInspector('text');
				var childrenTxtObj=this.getTextObjFromGroupObject(activeElm);
					    
				if(typeof oldObj === "object")
				{
					this.removeTextHighlight(oldObj);
				}
				
				if(typeof activeElm==="object" && activeElm.nodeType==="Group")
				{
					    /*all changes on seleced text*/
						  this.showSelectedTextDetails(activeElm);
						  this.getSelectedTextOptions(activeElm);
				}
			}else if(typeof oldActiveElm==="object" && oldActiveElm.nodeType==="Group" && (oldActiveElm.attrs.id.match(/txtGrp_[0-9]+/)))
			{
				this.removeTextHighlight(oldActiveElm);
			}
			
		}catch(err){
			console.error("@commonLabelText::Error on setCommonLabelTextHighlight::"+err.message);
		}
	};
	
	/**
	 * function name: showSelectedTextDetails()
	 * description:on select show selected text
	 * width and height in canvas property.
	 * author:Piyali Saha
	 */
	
	this.showSelectedTextDetails=function(txtGrpObj){
		console.log("@commonLabelText.showSelectedTextDetails");
		try{
			var selecteColor = this.highlightFill;
			var rectObj,txtObj=this.getTextObjFromGroupObject(txtGrpObj);
			
			$.each(txtGrpObj.children, function(index,value) {
				if(value.className != 'Rect'){
					value.setFill(selecteColor);
				}			
			});			
			this.cs.getLayer().draw();
		}catch(error){
			console.info("Error in showSelectedTextDetails :: @commonLabelText "+error.message);
		}
	};
	
	/**
	 * function name: removeTextHighlight()
	 * description:to remove highlight
	 * colour of 
	 * Highlight text 
	 * Modified by Nabonita Bhattacharyya
	 */
	this.removeTextHighlight=function(oldObject){
		console.log("@commonLabelText:removeTextHighlight");
		try{
			var nodeType=oldObject.nodeType;
			if(typeof oldObject==="object" && oldObject.nodeType==="Group" && (oldObject.attrs.id.match(/^txtGrp_[0-9]+/)||oldObject.attrs.id.match(/txt_[0-9]_[0-9]+/)))
			{
				
			  /*check for text layer (canvas text or frame text)*/
				var parentLayer=oldObject.getLayer();
				
			   var textTool= this,//new textToolConfig(),
			      oldChildrenTxtObj=this.getTextObjFromGroupObject(oldObject);
				if(typeof oldChildrenTxtObj==="object" /*&& oldChildrenTxtObj.nodeType==="Shape" && oldChildrenTxtObj.className==="Text"*/)
				{
			       this.removeSelectedTextOptions(oldObject);
			       if(parentLayer && parentLayer.attrs.id==="text_layer"){
			    	   parentLayer.draw();
			       }
			       textTool.drawLayer();
				}
			}
		}catch(error){
			console.info("Error in commonLabelText :: removeTextHighlight "+error.message);
		}
	};
	/**
	 * function name: addEditLabelText()
	 * description:to remove highlight
	 * colour of 
	 * Highlight text 
	 * author:Piyali Saha
	 */
	this.addEditLabelText=function(txtGrpObj){
		console.log("@COIView.addEditLabelText");
		try{
			this.checkOldText();
			var getX=txtGrpObj.getAbsolutePosition().x;
			var getY=txtGrpObj.getAbsolutePosition().y + $('.header').height();//+$('canvas').first().offset().top;
			if((getY+100) > $('canvas').first().height()){
				getY = getY -140; 
			}
			
			var textGrpObjectId = txtGrpObj.attrs.id.split('_')[1];
			/*for edit text fetch value*/
			var txtObjLen = txtGrpObj.children.length;
			var textVal ="";
			var parentId = txtGrpObj.parent.getId();
			if(txtObjLen > 2){
				 textVal = window.CD.module.data.getLabelTextValue(parentId);
			 }
		      
			var et = this.ds.getEt();
			var hVal = '';
			var fVal = '';
			if(et != 'PRG'){
				var hintFeedbackObj = window.CD.module.data.getHintFeedbackValue(parentId);
				hVal = hintFeedbackObj.hintValue;
				fVal = hintFeedbackObj.feedbackValue;
			}			
			 var options={
			  			containerId:this.textToolContainerId,
			  			ContainerExtAttr:'editedid="'+txtGrpObj.attrs.id+'"',
			  			ContainerStyle: 'position:fixed;left:'+getX+'px;top:'+getY+'px;',
			  			textStyle: 'left:'+getX+'px;top:'+getY+'px;height:70px;width:283px;',
			  			footerContId:'textToolFooter',
			  			footerContClass: 'palette_div',
			  			footerConStyle : 'width:278px',
			  			textVal :textVal,
			  			hintVal : hVal,
			  			feedbackVal : fVal,
		       };
			    
			   this.createHtmlElement(options);
			   
			   var textToolId="#"+this.textToolBoxId;
			   var txtData=$(textToolId).val();
			   $(textToolId).val('');
			   $(textToolId).focus();$(textToolId).val(txtData);
			    
			   txtGrpObj.hide();
			   this.drawLayer();
			   this.processSaveOrCancelLabel(txtGrpObj);
			
		}catch(err){
			console.error("@COIView::Error on addEditLabelText::"+err.message);
		}
	};
	
	
	/**
	 * function name: checkOldText()
	 * description:For edit box click on 
	 * each text check old text if text click
	 * happen without cancel previous box
	 * author:Piyali Saha
	 * param: creatBox
	 * {boolean}
	 * 
	 */

	this.checkOldText= function()
	{
		var OldTextVal=$("#"+this.textToolContainerId).attr('editedid');
		if($("#"+this.textToolContainerId).is(":visible") && OldTextVal!==""){
			var oldId=$("#"+this.textToolContainerId).attr('editedid');
			var oldTxtObj=this.cdLayer.get('#'+oldId);
			oldTxtObj[0].show();
			this.drawLayer();
		}
	};
	/**
	 * function name: clearAlignClicked()
	 * description:this method clear all the
	 * old clicked align data 
	 * author:Piyali Saha
	 */
	this.clearAlignClicked=function(){
		console.log("@commonLabelText.clearAlignClicked");
		$("#leftAlignTool").data('clicked',false);
		$("#middleAlignTool").data('clicked',false);
		$("#rightAlignTool").data('clicked',false);
		$("#justifyAlignTool").data('clicked',false);
		$("#boldTool").data('clicked',false);
		$("#italicsTool").data('clicked',false);
		$("#UnderlineTool").data('clicked',false);
	};
	
	/**
	 * function name: createHtmlElement()
	 * description:create html element for 
	 * text tool box
	 * author:Piyali Saha
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
		console.log("@commonLabelText.createHtmlElement");
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

	    this.textEditor.createTextEditor(textAreaContainer,'text',options.textStyle);
	    
	    //$("#"+options.textId).focus();
	    /*$("#"+this.feedbackBoxId).charCounter({
	    	maxChars: commonLabelTextToolChar.textMaxChar,
	    	maxCharsWarning : commonLabelTextToolChar.maxCharWarning
	    });*/
		
	};
	/**
	 * function name: prepareDropdownListAndAction()
	 * description:prepare list of drop down and 
	 * on change functionality for that drop down
	 * author:Piyali Saha
	 * param: 
	 * appendConId=append container id
	 * paleteboxSelector=palete input/textarea element id
	 *  
	 */
	this.prepareDropdownListAndAction=function(){
		console.log("@commonLabelText.prepareDropdownListAndAction");
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
							labelTextObj.initPalete(lan);
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
							var calY = parseInt($(this).parents('#textToolContainer').position().top)  - window.scrollY;
							if((calY + 250) > parseInt($('canvas').first().height())){
								//calTop = calY - parseInt($(this).parent().children('div.palette_options').height());
								calTop = calY - parseInt($(this).parent().children('div.palette_options').height()); 
							}
							$(this).parent().children('div.palette_options').css('top', parseInt(calTop*(-1)) + 'px');
					
						}else{
							//$(this).parent().children('div.palette_options').css('display','none');
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
							labelTextObj.initPalete(lan);
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
					labelTextObj.initPalete(lan);
					selectedTextArea.css('display','block');
					$('#'+selectedAreaId+'_html').css('display','none');
					selectedTextArea.trigger("showPalette");
					var textToolContainerTop = $("#textToolContainer").position().top;
					var palette_containerTop = $("#palette_container").position().top;
					var palette_containerHeight = $("#palette_container").width();
					var palette_diff = textToolContainerTop - palette_containerTop + palette_containerHeight;
					if(palette_diff < 380 && textToolContainerTop > palette_containerTop){
						$("#palette_container").css('top', (palette_containerTop - (textToolContainerTop - palette_containerTop) - 21));
					}
					 
					
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
	 * function name: processSaveOrCancel()
	 * description: on click of save or cancel
	 * link called this method
	 * author:Piyali Saha
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
	this.processSaveOrCancelLabel=function(txtGrpObj){
		var commonLabelTxt=this;
		var txtObj=this.getTextObjFromGroupObject(txtGrpObj);
		this.prepareDropdownListAndAction();
		var labelGropId=txtGrpObj.parent.attrs.id;
		var textobjId=txtObj[0].attrs.id;
		var editBox=false;
		if(!textobjId.match(/addTxt_[0-9]+/)){
			editBox=true;
		}
		/*close text tool box*/
		$('#textToolFooter .cancel_palette').on('click',function(){
			$('#maskOnFrame').remove();
			commonLabelTxt.closeTextToolBox(txtGrpObj);
				
		});
		/*save text tool*/
		$('#textToolFooter .save_palette').on('click',function(){ 
			
			/** For palette window close **/
			$('#maskOnFrame').remove();
			if($('#palette_container').css('display') == 'block'){
				  $('#palette_container').css('display','none');
				  $("#paletteDropdown").text('Insert special characters');
			}
			var cs = window.CD.services.cs; 
			var ds = window.CD.services.ds;
			var activeElm = window.CD.elements.active.element[0];
			
			
			
			if(activeElm.getId().match(/^txtGrp_[0-9]+/) != null){
				var lbGroup = activeElm.parent;
				var txtGrpObj = activeElm;
				var labelGropId = activeElm.parent.getId();
			}else{
				var lbGroup = activeElm;
				if(activeElm.getId().match(/^label_[0-9]+/) != null){
					var txtGrpId = 'txtGrp_'+activeElm.getId().split('_')[1];
					var txtGrpObj = activeElm.get('#'+txtGrpId)[0];
					var labelGropId = activeElm.getId();
				}else{
					if(activeElm.getId().match(/^dock_label_[0-9]+/) != null){
						var txtGrpId = 'txtGrp_'+activeElm.getId().split('_')[2];
						var txtGrpObj = activeElm.get('#'+txtGrpId)[0];
						var labelGropId = activeElm.getId();
					}
				}
			}			
			
			var activeBar = $(this).parents('div#textToolContainer').children('ul').children('.active');
			var activeId = activeBar.attr('id').split('Bar')[0];
			
			var hValue = commonLabelTxt.removeLastBR($("#hintToolTextBox").val());
			var fValue = commonLabelTxt.removeLastBR($("#feedbackToolTextBox").val());
			
			if(hValue !== '' || fValue !== ''){
				var selectedTab = activeId+'ToolTextBox';
				
				if(ds.getEt() != 'COI'){
					var hintType = $('input[name=hoverHint]:checked').val();
					var feedbackType = $('input[name=feedbackType]:checked').val();
				}else{
					var hintType = 'label';
					var feedbackType = 'label';
				}				
				
				cs.setActiveElement(lbGroup,'label');
				
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
			commonLabelTxt.setTextActive(txtGrpObj);
			var textBoxValue = $("#"+commonLabelTxt.textToolBoxId).val();
			textBoxValue = commonLabelTxt.removeLastBR(textBoxValue);
			if(textBoxValue!=="" && textBoxValue!==null && $.trim(textBoxValue).length > 0){
				var saveTextParam={
									labelGropId:labelGropId,
									txtGrpObj:txtGrpObj,
									
									};
				commonLabelTxt.saveTextToolBoxLabel(saveTextParam);
		       
			}else{
				/*this delete code added because on edit after remove
				 * all text if user save then it should show add text 
				 */ 
				commonLabelTxt.deleteActiveLabelText();
				
				/** alignment correction for add text **/
				var txtBox = txtGrpObj.get('#txtBox_'+txtGrpObj.getId().split('_')[1])[0];
				var jsonData = window.CD.module.data.getJsonAdminData();
				var totWidth = jsonData.SLELD.split(',')[0];
				var leftPadding = ((totWidth- txtBox.getWidth())/2);
				if(leftPadding<0)
					leftPadding = 0;
				txtGrpObj.setX(leftPadding);
				
				$('#textToolFooter .cancel_palette').trigger('click');
			}
		});
		/*cancel text tool*/
		$('#textToolFooter .cancel_palette').on('click',function(){
			/** For palette window close **/
			if($('#palette_container').css('display') == 'block'){
				  $('#palette_container').css('display','none');
				  $("#paletteDropdown").text('Insert special characters');
			}
		});
	};
	 /**
 	 * function name: createKineticObject()
 	 * author:Piyali Saha
 	 */
     this.createAllKineticObject=function(options){ 
    	 console.log("@COIView::createKineticObject");
 		 try{
 			 var kineticOPT=options.kinteticOpt;
 			 if(options.type==="Rect"){
 				 var kineticObject = new Kinetic.Rect(kineticOPT);
 				 
 			 }else if(options.type==="Text"){
 				  var kineticObject = new Kinetic.Text(kineticOPT);
			 }
 			console.log(kineticObject);
 			 return 	kineticObject
 		}catch(err){
			console.error("@COIView::Error on createKineticObject::"+err.message);
 		}
     },
	/**
	 * function name: showHideLabelText()
	 * Modified by Nabonita Bhattacharyya
	 */
 	this.addValuefromPreviousObj = function(txtPartVal,prevtxtObj,textObj, textGrpObjWidth,buffer,lineBreak,textFontSize){		
 		var prevTextX = prevtxtObj.getX() + prevtxtObj.getTextWidth() + textObj.getTextWidth();
 		textGrpObjWidth = textGrpObjWidth;
 		var txtGrpObj = prevtxtObj.parent;
 		txtGrpObj.show();
 		var totWid = 0;
 		var count = 0;
 		
 		var txtGrpId = txtGrpObj.attrs.id.split('_')[2];
 		if(prevTextX > textGrpObjWidth){
 			textObj.setY(prevtxtObj.getY()+textFontSize);
 			textObj.setX(0);
 			lineBreak++;
 		}else{	
 			if(txtPartVal.indexOf('^^') != -1){	
 				textObj.setY(prevtxtObj.getY()+ textFontSize);
 				textObj.setX(0);
 				lineBreak++;
 			}else{
 				textObj.setY(prevtxtObj.getY());
 				textObj.setX(prevtxtObj.getX() + prevtxtObj.getTextWidth());
 			}
 		}
 		var param = {};
 		param.textObj = textObj;
 		param.lineBreak = lineBreak;
 		return param;
 	},
	this.showHideLabelText=function(txtGrpObj,textValue,dataIndex,oldText,iscallFromundoRedo,tFormat){

 		textValue = this.removeLastBR(textValue);
    	 var cs = window.CD.services.cs;
    	 var buffer= 20;
    	 if(iscallFromundoRedo){
     		var thisObj= new TextTool.commonLabelText();
     	 }else{
     		 var thisObj=this; 
     	 }
    	 if(txtGrpObj.children.length ==0){
    		 txtGrpObj = cs.getLayer().get('#'+txtGrpObj.attrs.id)[0];
    	 }
    	 var txtGrpId = txtGrpObj.attrs.id.split('_')[1];
    	
    	 if(tFormat && tFormat!=''){    		 
        	 var align=tFormat.align;
        	 var textFontType=tFormat.fontStyle;
        	 var fontsize =  tFormat.fontSize;
    	 }else{
	    	 var textStyle = window.CD.module.data.getTextStyleData(txtGrpId);
	    	 if(window.CD.module.data.Json.adminData.ET == 'PRG'){
	    		 if( txtGrpObj.parent.attrs.id.split('_')[1] != 'dock'){
	    			 var textStyle = window.CD.module.data.getLabelTextStyleData(txtGrpId);
	    		 }
	    	 }
	    	 if(window.CD.globalStyle.alignment != ''){
	    		 var align = window.CD.globalStyle.alignment;
	    	 }else{
	    		 var align=textStyle.align;
	    	 }
	    	 
	    	 if(window.CD.globalStyle.fontStyle != ''){
	    		 var textFontType = window.CD.globalStyle.fontStyle;
	    	 }else{
	    		 var textFontType = textStyle.fontStyle;
	    	 }
	    	    	 
	    	 
	    	//Modified for Undo issue. Previously the text with proper text size was not coming when user changed the label font size and doing undo-redo.
	    	 var fontsize = textStyle.fontSize;
	    	 var textUnderlineValue = textStyle.underline_value;  	 
    	 }
    	 var undoMng = window.CD.undoManager;
    	 
		if(txtGrpObj.get('#lbltxt_'+txtGrpId)[0]){
			txtGrpObj = window.CD.module.view.labelTextOTM(txtGrpId,textValue,txtGrpObj);
			
			if(txtGrpObj.get('#txtBox_'+txtGrpId)[0]){
				 txtGrpObj.get('#txtBox_'+txtGrpId)[0].setFill("transparent");
			 }
			 if($(thisObj.textToolBoxId).val()== ""){
				 txtGrpObj.get('#addTxt_'+txtGrpId)[0].show();
				 if(txtGrpObj.get('#txtBox_'+txtGrpId)[0]){
					txtGrpObj.get('#txtBox_'+txtGrpId)[0].setFill('#ffffff'); 
				 }
			 }
		 }else{
			 if(!txtGrpObj.parent.attrs.id.match(/^dock_label_[0-9]+/)){
				 if(oldText != ""){
					 if(typeof window.CD.module.data.getTextFormatParamsFromJson == "function"){
							var oldTextStyle = window.CD.module.data.getTextFormatParamsFromJson(txtGrpId);
					 }
					 this.textFormat.deleteActiveLabelText(txtGrpObj);
					 thisObj.setTextActive(txtGrpObj);
					 if(oldTextStyle){
						 fontsize = oldTextStyle.fontSize;
						 textFontType = oldTextStyle.fontStyle;
					 }
					 align = textStyle.align;
					 textUnderlineValue = textStyle.underline_value;
				 }else{
					 if(window.CD.globalStyle.underlineVal != ''){
						 textUnderlineValue = window.CD.globalStyle.underlineVal;
					 }
				 }
				 var globalTextStyle = {};
		    	 globalTextStyle.fontSize = fontsize;
		    	 globalTextStyle.fontStyle = textFontType;
		    	 
		    	 if(oldText != ""){
		    		 globalTextStyle.oldTextPresent = true;
		    	 }
				 if(textValue !== ""){
					 txtGrpObj = thisObj.textFormat.createLabelText(txtGrpObj,textValue,align,globalTextStyle); 
				 }
				 window.CD.module.data.setLabelTextValue(txtGrpObj.parent.attrs.id,textValue);	 
			 }
		 }
		
		if(window.CD.services.ds.getEt() != 'PRG'){
			var textFontStyle = window.CD.module.data.getTextStyleData(txtGrpId);
		}else{
			var textFontStyle = window.CD.module.data.getLabelTextStyleData(txtGrpId);
		}
		
		 var chngArr={textFormat:{
				underline_value : textUnderlineValue,
				fontSize : fontsize,
				fontStyle : textFontType,
				align : align
		 }};
		var et = thisObj.ds.getEt();
		var cnt = [];
		 if(et == 'SLE'){
			 var dckCount=window.CD.services.cs.objLength(window.CD.module.data.Json.SLEData);
			 for(var i=0; i<dckCount;i++){		
		  			var labelGrpName = window.CD.module.data.Json.SLEData['SLE'+i].name;

	   				var activeGroup = txtGrpObj.parent.attrs.id;
		  			if(activeGroup == labelGrpName){
			  			var labelGroupId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
			  			var id = labelGroupId.split("_")[1];
		   				var textId = 'lbltxt_'+id;
		  				var dockGrp = thisObj.cs.getLayer().get('#dock_label_'+id)[0];	
		  				 if(dockGrp == undefined)
		  					 dockGrp = this.cs.findGroup('dock_label_'+id);
		  				 
		  				 var dockTextGrp = dockGrp.get('#docktxtGrp_'+id)[0];	
		  				 
		  				 if(oldText != ""){
							 this.textFormat.deleteEachLabelText(dockTextGrp);
						 }
						 if(textValue !== ""){
							 dockTextGrp = thisObj.textFormat.createLabelText(dockTextGrp,textValue,align,globalTextStyle); 
						 }
						// window.CD.module.data.setLabelTextValue(labelGroupId,textValue); //Commented due to misplacing the label_value for edit question by SS
		  				 dockTextObj = dockTextGrp;

		  				var count = dockTextObj.children.length-1;
		  				if(count > 0){
		  					var dockLastChild = thisObj.findLastTextchild(dockTextObj,count);
			  				var dockTextGrpHeight = dockTextObj.children[dockLastChild].getY() + dockTextObj.children[dockLastChild].getHeight();
			  				var dockTopPadding = (dockTextObj.parent.children[0].getHeight()-dockTextGrpHeight)/2;
			  				if(dockTopPadding < 0)
			  					dockTopPadding = 0;
			  				dockTextObj.setY(dockTopPadding);
		  				}
		  				
		          		/*if(($('#UnderlinetTool').hasClass('active')) || (tFormat && tFormat.underline_value == "T")){
	      				  if(dockTextGrp && dockTextObj){
	      					  thisObj.applyTextUnderline(dockTextGrp.get('#dock_txt_'+id)[0], dockTextGrp);
	      				  }
		      		  }*/
		          	var dataIndex =window.CD.module.data.getLabelIndex('label_'+id);
		          	var lblId = dataIndex.split("SLE")[1];
		          	cnt.push(lblId);
		          	window.CD.module.data.setEachLabelOutputData(dataIndex,chngArr);
//		          	var sleCnt = 'SLE'+id;
		          //	window.CD.module.data.Json.SLEData[dataIndex].label_value = editedTextObjectDockOption.kinteticOpt.text;
		  			}
			  }
		 }
		 else{
			 var lblGrp = txtGrpObj.parent;
			 var editedTextObject={type:"Text",kinteticOpt:{text: textValue,align:align,fontSize: fontsize,
	                fontFamily: 'sans-serif',fill: '#888',width: lblGrp.children[0].getWidth()-20,height: 'auto',opacity: '1',
	                verticalAlign:'top',fontStyle: textFontType,id: 'dock_txt_'+id}
		         };
			 var etData = et+'Data';
			 window.CD.module.data.setEachLabelOutputData(dataIndex,chngArr);
			 if(et == 'PRG'){
				 window.CD.module.data.Json.PRGData.PRGLabelData[dataIndex].term = editedTextObject.kinteticOpt.text;
			 }else
				 window.CD.module.data.Json[etData][dataIndex].label_value = editedTextObject.kinteticOpt.text;
		 }
		 
		 $("#"+thisObj.textToolContainerId).remove();
		 txtGrpObj.show();
		 $('#maskTool').remove();
		 if(textValue !== "" && txtGrpObj.get('#addTxt_'+txtGrpId)[0]){
			txtGrpObj.get('#txtBox_'+txtGrpId)[0].setFill("transparent");
			txtGrpObj.get('#addTxt_'+txtGrpId)[0].hide();
			var textYposition=txtGrpObj.get('#addTxt_'+txtGrpId)[0].getY();
			var textXPosition=txtGrpObj.get('#addTxt_'+txtGrpId)[0].getX();
			
			var count = txtGrpObj.children.length-1;
			var lastChild = thisObj.findLastTextchild(txtGrpObj,count);
			var textGrpHeight = txtGrpObj.children[lastChild].getY() + txtGrpObj.children[lastChild].getHeight();
			var topPadding = (txtGrpObj.parent.children[0].getHeight()-textGrpHeight)/2;
			if(topPadding < 0)
				topPadding = 0;
			txtGrpObj.setY(topPadding);			
		 }
		 
		 
		 if(txtGrpObj.get('#lbltxt_'+txtGrpId)[0]){
			 
			 var textYposition=txtGrpObj.get('#lbltxt_'+txtGrpId)[0].getY();
			 var textXPosition=txtGrpObj.get('#lbltxt_'+txtGrpId)[0].getX();
		 }
		 
		 /*tool bar click handle*/
	      $('#toolPalette li#'+thisObj.createTools[1]).removeClass('active');
		  $('#toolPalette li#'+thisObj.createTools[1]).data('clicked',false);		 
		  
		  
		  /* -- added to modify position of add text for show hidden text in authoring --- */
		  var txtGrpParentId = ''; 
		  var lblGroup;
		  if(txtGrpObj.parent != undefined){
			  lblGroup = window.CD.services.cs.findGroup(txtGrpObj.parent.attrs.id);
			  txtGrpParentId = txtGrpObj.parent.attrs.id;
		  }else{
			  var labelId = 'label_'+txtGrpId;
			  txtGrpParentId = labelId;
			  lblGroup = window.CD.services.cs.findGroup(labelId);
		  }
		  var infoTextTObj;
		  $.each(lblGroup.children, function(index,value){
				if(value.nodeType==="Group" && value.attrs.id.match(/infoText_label_[0-9]+/)){
					/*fetching T F H infotext object*/
					//infoText = value;
					$.each(value.children, function(i,v){
						if(v.attrs.id.match(/T_infoText_label_[0-9]+/)){
							infoTextTObj=v;
							infoText = infoTextTObj.parent;
							
						}
					});
				}
					
			});
		
		  if(infoTextTObj)
			  var infoTvisible=infoTextTObj.getVisible();
		  
//		  if(!txtGrpObj.parent.attrs.id.match(/^dock_label_[0-9]+/)){
//			  thisObj.setTextActive(txtGrpObj);
//			  lblGroup = thisObj.cdLayer.get('#'+lblGroup.attrs.id)[0]; 
//			  var totWidth = lblGroup.children[0].getWidth();
//			  var totHeight = lblGroup.children[0].getHeight();
//			  txtGrpObj.get('#lbltxt_'+txtGrpId)[0].setWidth(totWidth-buffer);
//		  }
		 if(lblGroup.get('#img_'+txtGrpParentId)[0]){
			 var imgObj=lblGroup.get('#img_'+txtGrpParentId)[0];
			  if(infoTvisible){
				  var count = txtGrpObj.children.length-1;
				  var lastChild = thisObj.findLastTextchild(txtGrpObj,count);
				  var textGrpHeight = txtGrpObj.children[lastChild].getY() + txtGrpObj.children[lastChild].getHeight();
				  var topPadding = ((lblGroup.children[0].getHeight()) / 2)- ((textGrpHeight) / 2);
				  if(topPadding < 0)
					  topPadding = 0;
				  txtGrpObj.setY(topPadding);
			  }else{
		 			var imageEndY=imgObj.getY()+imgObj.getHeight();
		 			textBoxGrpObj=txtGrpObj.get('#txtBox_'+txtGrpId)[0];
		 		    var currY=textBoxGrpObj.getY();
		 		    if(txtGrpObj.get('#lbltxt_'+txtGrpId)[0]){
		 		    	var txtobY=txtGrpObj.get('#lbltxt_'+txtGrpId)[0].getY();
		 		    }else if(txtGrpObj.get('#addTxt_'+txtGrpId)[0]){
		 		    	var txtobY=txtGrpObj.get('#addTxt_'+txtGrpId)[0].getY();
		 		    }
	            	//var changeY=parseInt(currY)+(parseInt(imageHeight)/2)+5;
		 		   var changeY=parseInt(txtobY);//imageEndY+8;
		 		  textBoxGrpObj.setY(changeY);
		 		  /* for image text adjustment */
		 		  if(typeof window.CD.module.view.labelImageAndTextAdjust == "function"){
						window.CD.module.view.labelImageAndTextAdjust(lblGroup);
		 		  }
	            }
		  }else if(txtGrpObj.get('#lbltxt_'+txtGrpId)[0]){
			  var originalTextHeight = txtGrpObj.get('#lbltxt_'+txtGrpId)[0].textArr.length * txtGrpObj.get('#lbltxt_'+txtGrpId)[0].getTextHeight();
			  if(totHeight > originalTextHeight){
				  var calcY = (totHeight - originalTextHeight)/2;
				  txtGrpObj.setY(calcY);
			  }
			  
			  if(totHeight<=originalTextHeight){
				  var calcY = lblGroup.children[0].getY();
				  txtGrpObj.setY(calcY);
			  }
//			  if(dockTextGrp){
//				  var dockTextHeight = dockTextGrp.get('#dock_txt_'+txtGrpId)[0].textArr.length * dockTextGrp.get('#dock_txt_'+txtGrpId)[0].getTextHeight();
//				  var dockCalcY = (dockGrp.children[0].getHeight()-dockTextHeight)/2;
//          		  dockTextGrp.setY(dockCalcY);
//			  }
		  }
		 
		  
//		  if(($('#UnderlinetTool').hasClass('active')) || (tFormat && tFormat.underline_value == "T")){
//			  if(!txtGrpObj.parent.attrs.id.match(/^dock_label_[0-9]+/)){
//				  thisObj.applyTextUnderline(txtGrpObj.get('#lbltxt_'+txtGrpId)[0], txtGrpObj);
////				  if(dockTextGrp && dockTextObj){
////					  thisObj.applyTextUnderline(dockTextGrp.get('#dock_txt_'+txtGrpId)[0], dockTextGrp);
////				  }
//			  }
//		  }else{
//			  var changefieldArr={underline_value:"F"};
//			  window.CD.module.data.setEachLabelOutputData(dataIndex,changefieldArr);
//		  }
		 
		  if(!txtGrpObj.parent.attrs.id.match(/^dock_label_[0-9]+/)){
			  thisObj.bindLabelTextEvent(txtGrpObj);//,totHeight,txtGrpId,cdLayer);
		  }
		  if(!iscallFromundoRedo){
			  if(!txtGrpObj.parent.attrs.id.match(/^dock_label_[0-9]+/)){
				  undoMng.register(this,thisObj.undoRedoText,[txtGrpObj,textValue,dataIndex,oldText],'Undo Create',this,thisObj.undoRedoText,[txtGrpObj,textValue,dataIndex,textValue],'Redo Create');
				  updateUndoRedoState(undoMng);
			  }
		  }
		  thisObj.drawLayer();
     };
     
     /**
      * @param : whole text group and last child count
      * @description : For a label text with partial format (with underline), the text children count 
      * also includes underline object count. This method is used for getting actual label text 
      * children count
      */
     this.findLastTextchild = function(textGroup,count){
    	 console.log("@findLastTextchild :: commonLabelText");
    	 try{
    		 var childTextObj = textGroup.children[count];
    		 if(childTextObj.className == "Line"){
    			 count--;
    			 return this.findLastTextchild(textGroup,count);
    		 }else{
    			 return count;
    		 }    		 
    	 }catch(error){
    		 console.info("Error @findLastTextchild :: commonLabelText: "+error.message);
    	 }
     };
     this.undoRedoText=function(txtGrpObj,textValue,dataIndex,oldText){ 
    	 var cdLayer = window.CD.services.cs.getLayer();
    	 var ds = window.CD.services.ds;
    	 var cs = window.CD.services.cs;
    	 txtGrpObj = cdLayer.get('#'+txtGrpObj.attrs.id)[0];
    	 var txtGrpId = txtGrpObj.attrs.id.split('_')[1];
    	 var txtGrpParentId = ''; 
		  var lblGroup;
		  if(txtGrpObj.parent != undefined){
			  lblGroup = window.CD.services.cs.findGroup(txtGrpObj.parent.attrs.id);
			  txtGrpParentId = txtGrpObj.parent.attrs.id;
		  }else{
			  var labelId = 'label_'+txtGrpId;
			  txtGrpParentId = labelId;
			  lblGroup = window.CD.services.cs.findGroup(labelId);
		  }
		  
    	 if(oldText == ''){
    		 this.deleteText(txtGrpObj);
    		 var labelOption = ds.getOptionLabel();
    		 if(labelOption === "OTM"){
    			 lblGroup.show();
    			 cdLayer.draw();
    			 var labelIndex = window.CD.module.data.getLabelIndex(txtGrpObj.parent.attrs.id);
    			 var labelJson = window.CD.module.data.getJsonData()[labelIndex];
    			 labelJson.visibility = true;
    			 var dck = cs.findGroup('dock_'+labelJson.labelGroupId).children[0];
    			 labelJson.name = txtGrpParentId; //txtGrpObj.parent.attrs.id;
    			 dck.attrs.name = txtGrpParentId; //txtGrpObj.parent.attrs.id;
    			 ds.setOutputData();
    		}
    	 }else{
	    	 this.showHideLabelText(txtGrpObj,oldText,dataIndex);
	    	 var dataIndex =window.CD.module.data.getLabelIndex(txtGrpParentId);
			 var changefieldArr={label_value:oldText};
			 window.CD.module.data.setEachLabelOutputData(dataIndex,changefieldArr);
			 if(typeof window.CD.module.view.handleDisplayLabelOnce == "function"){
					window.CD.module.view.handleDisplayLabelOnce();
				}
    	 }
    	 
     };
	
	

	this.saveTextToolBoxLabel=function(saveTextParam){
		console.log("@commonLabelText.saveTextToolBoxLabel");
		var labelGropId=saveTextParam.labelGropId,commonLabelTxt=this,
			maxwidth=200,txtGrpObj= saveTextParam.txtGrpObj;
		/* saving text values*/
			var dataIndex =window.CD.module.data.getLabelIndex(labelGropId);
			var label_text_value = $("#"+this.textToolBoxId).val().replace(/<\/sb><sb>/g,'').replace(/<\/sp><sp>/g,'');
						
			var savedText=commonLabelTxt.checkAndUpdateCharFromPalete(label_text_value);
			var oldText = window.CD.module.data.getEachLabelOutputData(dataIndex,'label_value')
			var changefieldArr={label_value:savedText};
			window.CD.module.data.setEachLabelOutputData(dataIndex,changefieldArr);
			//window.CD.module.data.setLabelTextFormat(dataIndex);
		/*ends here*/
		 
		  //labelCount = window.CD.module.view.getObjectCount();
		  txtGrpId = txtGrpObj.attrs.id.split('_')[1];
		   
		  /*checking sb and sp tag in a text*/
		   var textValue=label_text_value;
			//if(this.checkSubOrSuperTagExist(textValue)){
				//textValue=this.changeSubscriptSuperScript(textValue);	
			//}
			if(textValue===false){
				return false;
			}
		 /*show/hide label text or addtext*/
		  this.showHideLabelText(txtGrpObj,textValue,dataIndex,oldText);
//		  var et = this.ds.getEt();
//		  if(et == 'SLE'){
//			  window.CD.module.view.createDockTextAsLabel(labelGropId,textValue);
//			  var dockGrp = this.cs.findGroup('dock_'+labelGropId);
//			  var count = labelGropId.split('_')[1];
//			  var dockTextObj = dockGrp.get('#docktxtGrp_'+count)[0];
//			  /*show/hide label text or addtext*/
//			  this.showHideLabelText(dockTextObj,textValue,dataIndex,oldText);
//		  }
		  
		//For Display label Once
		if(typeof window.CD.module.view.handleDisplayLabelOnce == "function"){
			window.CD.module.view.handleDisplayLabelOnce();
		}
		if(typeof window.CD.module.view.changetoStandard == "function"){
			window.CD.module.view.changetoStandard(dataIndex);
		}
},
	

	this.closeTextToolBox=function(txtGrpObj){
		txtObj=this.getTextObjFromGroupObject(txtGrpObj);
		txtGrpObj.show();
		this.drawLayer();
		  $('#toolPalette li#'+this.createTools[0]).addClass('active');
		  $('#toolPalette li#'+this.createTools[1]).removeClass('active');
		  $("#"+this.textToolContainerId).remove();
		  $('#maskTool').remove();
		  		  
	};
	
	this.initPalete=function(language)
	{
		if(!language)language='spanish';
		 /*adding palelte to textare*/
		  $("#"+this.textToolBoxId).authpalette('destroy');
		  $("#"+this.textToolBoxId).authpalette({
			  align : 'horizontal',
			  auto : false,	  
			  language : language, 
			  resize : false,
			  containment : 'document' 
			});
	};
	

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
	
	this.checkSubOrSuperTagExist=function(value){
		console.log("@commonLabelText.checkSubOrSuperTagExist");
		if(value.match(/<sb>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sb>/g) || value.match(/<sp>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sp>/g)){
			return true;
		}
	};
	

	this.checkSubTagExist=function(value){
		console.log("@commonLabelText.checkSubTagExist");
		if(value.match(/<sb>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sb>/g)){
			return true;
		}
	};
	
	this.checkSupTagExist=function(value){
	 if(value.match(/<sp>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sp>/g)){
			return true;
		}
	};
	
	
	this.convertSbSpscript=function(value){
		console.log("@commonLabelText.convertSbSpscript");
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
							frameObj.showErrorModal();
							returnFalse=false;
							return false;
						}else{
							finalreplace=finalreplace+frameObj.getEachSubscriptChar(sbReplace[strt]);
						}
					}
				
				}
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
							frameObj.showErrorModal();
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
	this.showErrorModal=function(){
		var Util = window.CD.util;	 
		var errorModal = Util.getTemplate({url: 'resources/themes/default/views/error_modal.html?{build.number}'});
		var modalId="errorModal",containerId="errorContainer",cancelId="errorCancel",
		overlayId="errorOverlay",errorAlertId="errAlertText";
		validation.creatCommonErrorPopUp(errorModal,modalId,containerId,cancelId,overlayId);
		$("#errorContainer span#errorCancel").hide();
		$("#errorContainer span#errorOk").html("Ok");
		$("#errorContainer span#errorOk").off('click').on('click',function(){
			$('#errorModal').slideUp(200);
			$('#toolPalette #errorModal').remove();
		});
		validation.showCommonErrorMessage('4','',containerId,errorAlertId);
	};
	
	this.getEachSubscriptChar=function(char0){
		console.log("@commonLabelText.getEachSubscriptChar");
		var subCharArr=this.textSbSpScript.getSubscriptCharecterList();
		char0=char0.toLowerCase();
		if(subCharArr[char0]){
			return subCharArr[char0];
		}else{
			return char0;
		}
	};
	
	this.getEachSuperscriptChar=function(char1){
		var subCharArr1=this.textSbSpScript.getSuperscriptCharecter();
		char1=char1.toLowerCase();
		if(subCharArr1[char1]){
			return subCharArr1[char1];
		}else{
			return char1;
		}
	};
	this.applyTextUnderline=function(activeChildrenTxtObj,activeGrpObj,rerender,applyUnderline,cnt){
		   rerender = rerender || false;
		   var txtConfg= this;//new textToolConfig();
		   var cdLayer = txtConfg.cs.getLayer();
		   if(activeGrpObj.children.length == 0){
			   activeGrpObj = cdLayer.get('#'+activeGrpObj.attrs.id)[0];
			}
		   if(!activeChildrenTxtObj){
			   activeChildrenTxtObj = cdLayer.get('#'+activeChildrenTxtObj.attrs.id)[0];
		   }
		   var activeObj=activeChildrenTxtObj;	
		   var labelWidth = activeGrpObj.parent.children[0].getWidth();
		   var cuuFont=activeObj.getFontStyle();
		   var sle = window.CD.module.data.getLabelIndex(activeGrpObj.parent.attrs.id);
		   var undoMng = window.CD.undoManager;
		   this.removeUnderline(activeGrpObj);
	
		  for(var i=0; i<activeObj.textArr.length ;i++){
			  var activeWidth = activeObj.textArr[i].width;
			  if(activeObj.getAlign() == "center"){
				  var startpos = (labelWidth - activeWidth)/2;
				  startpos = startpos -10;
				 //if(rerender == true)
					//  startpos = startpos -5;
				
			  }else  if(activeObj.getAlign() == "left" || activeObj.getAlign() == "justify"){
				  var startpos = activeObj.getX();
			  }else  if(activeObj.getAlign() == "right"){
				  var startpos = (labelWidth - activeWidth - 20);
				  
			  }
			  
			   var underLine = new Kinetic.Line({
			        points: [startpos, (activeObj.getTextHeight() * (i+1)), (startpos + activeWidth ),(activeObj.getTextHeight() * (i+1))],
			        stroke: 'black',
			        strokeWidth: 1,	
			        name: 'underline_txt'
			      });
			 
			   activeGrpObj.add(underLine);
			}
		txtConfg.drawLayer();
		/*update data string*/
		var labelIndex= window.CD.module.data.getLabelIndex(activeGrpObj.parent.attrs.id);
		var chngArr={textFormat:{
			underline_value:"T",
			fontSize:activeObj.getFontSize(),
			fontStyle:activeObj.getFontStyle(),
			align:activeObj.getAlign()
			}};
		 if((activeGrpObj.parent.attrs.id.match(/^label_[0-9]+/))){
			if(applyUnderline)
			undoMng.register(this, this.removeUnderlineCall,[activeGrpObj] , 'Text Formatting',this, this.applyTextUnderlineCall,[activeChildrenTxtObj,activeGrpObj] , 'Text Formatting');
			updateUndoRedoState(undoMng);
		 }
		 if(cnt){
				if(cnt.length>0){
					for(j=0;j<(cnt.length);j++){
						window.CD.module.data.setEachLabelOutputData('SLE'+cnt[j],chngArr);
					}
				}
				else
					window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);
		}else
		window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);
			
	};
	
	this.removeUnderline = function(activeGrpObj,removeUnderline,cnt){
		var txtConfg = this;
		var undoMng = window.CD.undoManager;
		var cdLayer = txtConfg.cs.getLayer();
		   if(activeGrpObj.children.length == 0){
			   activeGrpObj = cdLayer.get('#'+activeGrpObj.attrs.id)[0];
			}
		 var underlineObj = activeGrpObj.get('.underline_txt');
		 /** --- for kinetic upgradations --- **/
		 /*underlineObj.each(function() {
	         this.removeChildren();//updated for kinetic upgradation
	         //this.attrs.id = "";
	        });*/
		 
			 if(underlineObj.length>0){
				 for(var k = 0;k < underlineObj.length; k++){
					 underlineObj[k].remove();
				 } 
			 }
		   
		   var childTxtObj=this.getTextObjFromGroupObject(activeGrpObj);
		   var sle = window.CD.module.data.getLabelIndex(activeGrpObj.parent.attrs.id);
		   txtConfg.drawLayer();
		   /*update data string*/
		   var labelIndex= window.CD.module.data.getLabelIndex(activeGrpObj.parent.attrs.id);
		   var chngArr={textFormat:{
				underline_value:"F",
				fontSize:childTxtObj.getFontSize(),
				fontStyle:childTxtObj.getFontStyle(),
				align:childTxtObj.getAlign()
				}};
		   if((activeGrpObj.parent.attrs.id.match(/^label_[0-9]+/))){
				
				if(removeUnderline)
					undoMng.register(this, this.applyTextUnderlineCall,[childTxtObj,activeGrpObj] , 'Text Formatting',this, this.removeUnderlineCall,[activeGrpObj] , 'Text Formatting');
				updateUndoRedoState(undoMng);
		   }
		   if(cnt){
				if(cnt.length>0){
					for(j=0;j<(cnt.length);j++){
						window.CD.module.data.setEachLabelOutputData('SLE'+cnt[j],chngArr);
					}
				}
				else{
					window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);
				}
			}
			else{
				window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);
			}
		};
	this.removeUnderlineCall=function(activeGrpObj){
		this.removeUnderline(activeGrpObj);
//		  if(et == 'SLE'){
//			  var count = activeGrpObj.attrs.id.split('_')[1];
//			   var dockGrp = this.cs.getLayer().get('#dock_label_'+count)[0];
//			   var dockTextObj = dockGrp.get('#docktxtGrp_'+count)[0];
//			  this.removeUnderline(dockTextObj);
//		  }
		 var dckCount=window.CD.services.cs.objLength(window.CD.module.data.Json.SLEData);
			if(this.ds.getEt()== 'SLE'){
				var cnt = [];
				 for(var i=0; i<dckCount;i++){		
			  			var labelGrpName = window.CD.module.data.Json.SLEData['SLE'+i].name;
			  			var labelGroupId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
			  			var id = labelGroupId.split("_")[1];
		   				var txtId = 'txtGrp_'+id;
		   				var activeGroup = activeGrpObj.parent.attrs.id;
			  			if(activeGroup == labelGrpName){
			  				var dockactiveGrpObj = this.cs.getLayer().get('#dock'+txtId)[0];
			  				var dataIndex =window.CD.module.data.getLabelIndex('label_'+id);
				          	var lblId = dataIndex.split("SLE")[1];
				          	cnt.push(lblId);
			  				this.removeUnderline(dockactiveGrpObj,'',cnt);
			  				
			  			}
				  }
				
			}
		$('#UnderlinetTool').removeClass('active');
	};
	this.applyTextUnderlineCall=function(childTxtObj,activeGrpObj){
		this.applyTextUnderline(childTxtObj,activeGrpObj);
//		 var et = this.ds.getEt();
//		  if(et == 'SLE'){
//			  var count = activeGrpObj.attrs.id.split('_')[1];
//			   var dockGrp = this.cs.getLayer().get('#dock_label_'+count)[0];
//			   var dockTextObj = dockGrp.get('#docktxtGrp_'+count)[0];
//			   var dockChildTextObj = dockTextObj.get('#dock_txt_'+count)[0];
//			  this.applyTextUnderline(dockChildTextObj,dockTextObj);
//		  }
		 var dckCount=window.CD.services.cs.objLength(window.CD.module.data.Json.SLEData);
			if(this.ds.getEt()== 'SLE'){
				var cnt = [];
				 for(var i=0; i<dckCount;i++){		
			  			var labelGrpName = window.CD.module.data.Json.SLEData['SLE'+i].name;
			  			var labelGroupId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
			  			var id = labelGroupId.split("_")[1];
		   				var txtId = 'txtGrp_'+id;
		   				var activeGroup = activeGrpObj.parent.attrs.id;
			  			if(activeGroup == labelGrpName){
			  				var dockactiveGrpObj = this.cs.getLayer().get('#dock'+txtId)[0];		
			  				var dockChildTextObj = dockactiveGrpObj.get('#dock_txt_'+id)[0];
			  				var dataIndex =window.CD.module.data.getLabelIndex('label_'+id);
				          	var lblId = dataIndex.split("SLE")[1];
				          	cnt.push(lblId);
			  			    this.applyTextUnderline(dockChildTextObj,dockactiveGrpObj,'','',cnt);
			  				
			  			}
				  }
				
			}
		$('#UnderlinetTool').addClass('active');
	};
	this.createMaskOnCanvas=function(){
		$('#maskOnFrame').remove();
		var canvasWidth = parseInt(window.CD.module.data.Json.adminData.AW) + 15;
		var canvasHeight = parseInt(window.CD.module.data.Json.adminData.AH) + 15;
		var canvasInactiveBar = $('<div id="maskOnFrame" style="position:absolute;opacity:0.05;z-index:99;"></div>');
		canvasInactiveBar.css({width:canvasWidth+'px', height:canvasHeight+'px'});
		$('body').append(canvasInactiveBar);
	};
	this.bindLabelTextEvent=function(txtGrpObject,param){
		
		var childTxtObj=this.getTextObjFromGroupObject(txtGrpObject);
		var txtNameSpace= this;
		
		/*childTxtObj.on('click',function(evt){		
			
			txtNameSpace.setTextActive(txtGrpObject);
			evt.cancelBubble = true;
		});
		childTxtObj.on("dblclick dbltap", function(evt) {			
			if(param){
				var data = window.CD.module.data;
				var txtId = txtGrpObject.attrs.id.split("_")[1];	
				var labelId = 'label_'+txtId;
				var node = data.getLabelIndex(labelId);
				var dis = data.getJsonData()[node].distractor_label;
				if(dis == 'T'){
					txtNameSpace.addEditLabelText(txtGrpObject);
				}
			}else{
				txtNameSpace.addEditLabelText(txtGrpObject);
			}
			evt.cancelBubble = true;
		});*/
		
		var childTxtObj=this.getTextObjFromGroupObject(txtGrpObject);
		var txtNameSpace= this;

		if($.isArray(childTxtObj) && childTxtObj.length > 0){
			$.each(childTxtObj, function(index,value) {
				//value.on('mousedown',function(evt){		
				//	txtNameSpace.setTextActive(this.parent);
				//	evt.cancelBubble = true;
				//});
				//value.on("dblclick dbltap", function(evt) {
				value.on("click tap", function(evt) {
					if(window.CD.elements.active.element.length == 1 && shiftDown == false){ // For issue --label text editor was getting open after multiselection also
						if(txtGrpObject.parent.attrs.id == window.CD.elements.active.element[0].attrs.id){
							var txtConfg = new TextTool.commonLabelText();
							txtConfg.createMaskOnCanvas();
							var txtGrpObjectLength = txtGrpObject.children.length;
							if(txtGrpObjectLength <=2){
								var txtId = txtGrpObject.attrs.id.split("_")[1];	
								var labelId = 'label_'+txtId;
								var node = window.CD.module.data.getLabelIndex(labelId);
								window.CD.module.data.setLabelTextFormat(node);
							}
							if(param){
								var data = window.CD.module.data;
								var txtId = txtGrpObject.attrs.id.split("_")[1];	
								var labelId = 'label_'+txtId;
								var node = data.getLabelIndex(labelId);
								var dis = data.getJsonData()[node].distractor_label;
								if(dis == 'T'){
									txtNameSpace.addEditLabelText(txtGrpObject);
								}
							}else{
								txtNameSpace.addEditLabelText(txtGrpObject);
							}
							
							evt.cancelBubble = true;
							$('#textToolContainer').css('z-index',500);
						}
					}
				});
		     });
		}else{
			//childTxtObj.on('click',function(evt){		
			//	txtNameSpace.setTextActive(txtGrpObject);
			//	evt.cancelBubble = true;
			//});
			//childTxtObj.on("dblclick dbltap", function(evt) {
			childTxtObj.on("click tap", function(evt) {	
				if(window.CD.elements.active.element.length == 1 && shiftDown == false){
					var txtConfg = new TextTool.commonLabelText();
					txtConfg.createMaskOnCanvas();
					if(param){
					var data = window.CD.module.data;
					var txtId = txtGrpObject.attrs.id.split("_")[1];	
					var labelId = 'label_'+txtId;
					var node = data.getLabelIndex(labelId);
					var dis = data.getJsonData()[node].distractor_label;
					if(dis == 'T'){
						txtNameSpace.addEditLabelText(txtGrpObject);
					}
					}else{
						txtNameSpace.addEditLabelText(txtGrpObject);
					}
					evt.cancelBubble = true;
					$('#textToolContainer').css('z-index',500);
				}
				
			});
		}	
		
	};
	
	this.setTextStyling=function(activeGrpObj,textStyles){
		var txtConfg= this;//new textToolConfig();
		var cdLayer = txtConfg.cs.getLayer();
		textStyle=txtConfg.getTextStyle();
		if(activeGrpObj.children.length == 0){
		activeGrpObj = cdLayer.get('#'+activeGrpObj.attrs.id)[0];
		}
		var activeObject=txtConfg.getTextObjFromGroupObject(activeGrpObj);
		activeObject.setFontStyle(textStyles);
		var dckCount=window.CD.services.cs.objLength(window.CD.module.data.Json.SLEData);
		if(this.ds.getEt()== 'SLE'){
			 for(var i=0; i<dckCount;i++){		
		  			var labelGrpName = window.CD.module.data.Json.SLEData['SLE'+i].name;
		  			var labelGroupId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
		  			var id = labelGroupId.split("_")[1];
	   				var txtId = 'txtGrp_'+id;
	   				var activeGroup = activeGrpObj.parent.attrs.id;
		  			if(activeGroup == labelGrpName){
		  				var dockactiveGrpObj = cdLayer.get('#dock'+txtId)[0];		
		  				var activedockObject=txtConfg.getTextObjFromGroupObject(dockactiveGrpObj);
		  				activedockObject.setFontStyle(textStyles);
		  			}
			  }
			
		}
		 if((activeGrpObj.parent.attrs.id.match(/^label_[0-9]+/))){
			var node = window.CD.module.data.getLabelIndex(activeGrpObj.parent.attrs.id);
			if(node){
				window.CD.module.data.getJsonData()[node].textFormat.fontStyle = textStyles;
			}
		 }
		this.drawLayer();
		this.ds.setOutputData();
		this.cleanSelectedOptionFromOldTxt();
		this.getSelectedTextOptions(activeGrpObj);
	};
	
	this.getSelectedTextOptions=function(txtGrpObj){
		this.cleanSelectedOptionFromOldTxt(true);
		txtOpt={align:'',bold:'',italic:'',underline:''};
		
		/*txt*/
		var txtObj = window.CD.module.data.getTextFormatParamsFromJson(txtGrpObj.getId().split('_')[1]);

		var align = txtObj.align;
		var textFontSize = txtObj.fontSize;
		var textFontStyle = txtObj.fontStyle;
		var underline_value = txtObj.underline_value;
		
		/*align part*/
		if(align==="center"){
			$("#middleAlignTool").addClass('active');
			 txtOpt.align='middleAlignTool';
			}
		else if(align==="left"){
			$("#leftAlignTool").addClass('active');
			
			txtOpt.align='leftAlignTool';
		}
		else if(align==="right"){
			$("#rightAlignTool").addClass('active');
			txtOpt.align='rightAlignTool';
		}
		else if(align==="justify"){
			$("#justifyAlignTool").addClass('active');
			txtOpt.align='justifyAlignTool';
		}
		
		/*font part*/
		if(textFontSize!==""){
			$("#fontTextbox").val(textFontSize);
					
		}
		
		/*bold part*/
		if(textFontStyle.match(/bold+/)){
			$("#boldTool").addClass('active');
			txtOpt.bold='boldTool'
		}
		/*italic*/
		if(textFontStyle.match(/italic+/)){
			
			$("#italicsTool").addClass('active');
			txtOpt.italic='italicsTool';
		}
		/*underline*/
		if(underline_value == 'T'){
			
			$("#UnderlinetTool").addClass('active');
			txtOpt.underline='underlineTool';
		}
		$("#toolPalette").data('textSelectedOpt',txtOpt);
		
	};
	
	this.cleanSelectedOptionFromOldTxt=function(calledFromGetSelected){
	  var alignTools = window.CD.tools.align;
	  /*underline*/
	   $("#UnderlinetTool").removeClass('active');
	   
	  $.each(alignTools,function(index,toolId){
		  $('#toolPalette li#'+toolId).removeClass('active');
			
		}); 
	  var formatTools = window.CD.tools.format;
	  $.each(formatTools,function(index,toolId){
		  $('#toolPalette li#'+toolId).removeClass('active');
			
		}); 
  	  
  	  var textToolClicked=$('#toolPalette li#'+this.createTools[1]).data('clicked');
	  if(!textToolClicked || calledFromGetSelected){
		  $.each(this.createTools,function(index,toolId){
			  $('#toolPalette li#'+toolId).removeClass('active');
				
			});
	  }
	};
	
	this.italicActiveText=function(activeGrpObject){
		textStyle=this.getTextStyle();
		if(activeGrpObject){
			var activeObj = activeGrpObject;
			var activeGrpObj = activeObj;
			var labelDockId = activeGrpObj.parent.attrs.id.split('dock_')[1];
		}else{
			var activeObj = window.CD.elements.active.element[0];
			var activeGrpObj = activeObj;
			var labelDockId = activeGrpObj.parent.attrs.id;
			
			var txtGrpObjId = activeGrpObj.attrs.id;
			var txtId = txtGrpObjId.split("_")[1];	
			var labelId = activeGrpObj.parent.getId();
			var et = this.ds.getEt();
			var dckCount=window.CD.services.cs.objLength(window.CD.module.data.Json.SLEData);
			var cnt = [];
			if(et == 'SLE'){
				  for(var i=0; i<dckCount;i++){		
			  			var labelGrpName = window.CD.module.data.Json.SLEData['SLE'+i].name;
			  			var labelGroupId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
			  			var id = labelGroupId.split("_")[1];
			  			if(labelId == labelGrpName){
			  				window.CD.module.view.italicActiveDockText(labelGroupId);
			  				var dataIndex =window.CD.module.data.getLabelIndex('label_'+id);
				          	var lblId = dataIndex.split("SLE")[1];
				          	cnt.push(lblId);
			  			}
				  }
			  }
		}
		
		var undoMng = window.CD.undoManager;
		if(typeof activeObj==="object" && activeObj.nodeType==="Group"){
			
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
			{
				if(activeChildrenTxtObj.attrs.id.match(/lbltxt_[0-9]+/)){
				   this.getSelectedTextOptions(activeGrpObj);
				   activeObj=activeChildrenTxtObj;
				   var cuuFont=activeObj.getFontStyle();
				   if(cuuFont=="italic")fontst="normal";
				   else if(cuuFont=="bold")fontst="bold italic";
				   else if(cuuFont=="bold italic")fontst="bold normal";
				   else if(cuuFont=="bold normal")fontst="bold italic";
				   else fontst="italic";
				   activeObj.setFontStyle(fontst);
				   this.drawLayer();
				   
				 
				   
				   if(et == 'SLE'){
						 var dockGrp = this.cs.getLayer().get('#dock_label_'+txtId)[0];	
						 var dockTextGrp = dockGrp.get('#docktxtGrp_'+txtId)[0];	
						 var dockTextObj = dockTextGrp.get('#dock_txt_'+txtId)[0];						
					 }
					if($('#UnderlinetTool').hasClass('active')){						
						 this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj);
						 if(dockTextGrp && dockTextObj){
							  this.applyTextUnderline(dockTextObj, dockTextGrp);
						  }
					 }
				   /*update data string*/
				   if(activeGrpObj.parent.attrs.id.match(/^label_[0-9]+/)){
						var labelIndex= window.CD.module.data.getLabelIndex(labelDockId);
					   var textFormat=window.CD.module.data.getEachLabelOutputData(labelIndex,'textFormat');
					   var underLine=textFormat.underline_value;
					   var initStyle = window.CD.module.data.getJsonData()[labelIndex].textFormat.fontStyle;
						var chngArr={textFormat:{
									underline_value:underLine,
									fontSize:activeChildrenTxtObj.getFontSize(),
									fontStyle:activeChildrenTxtObj.getFontStyle(),
									align:activeChildrenTxtObj.getAlign()
									}};
						if (cnt){
							if(cnt.length>0){
								 for(j=0;j<(cnt.length);j++){
									window.CD.module.data.setEachLabelOutputData('SLE'+cnt[j],chngArr);
								 }
							 }
							else{
								window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);

							}
						}else{
							window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);

						}
						//window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);
						undoMng.register(this, this.setTextStyling,[activeGrpObj,initStyle] , 'Text Formatting',this, this.setTextStyling,[activeGrpObj,fontst] , 'Text Formatting');
						updateUndoRedoState(undoMng);
						
				   }
				}
			}
		}
		
	};
	this.underlineActiveText=function(activeGrpObject,cnt){
		textStyle=this.getTextStyle();
		if(activeGrpObject){
			var activeObj = activeGrpObject;
			var activeGrpObj = activeObj;
			var labelDockId = activeGrpObj.parent.attrs.id.split('dock_')[1];
		}else{
			var activeObj = window.CD.elements.active.element[0];
			var activeGrpObj = activeObj;
			
			var labelDockId = activeGrpObj.parent.attrs.id;
			
			var txtGrpObjId = activeGrpObj.attrs.id;
			var txtId = txtGrpObjId.split("_")[1];	
			var labelId = activeGrpObj.parent.getId();
			var et = this.ds.getEt();
			var cnt1 = [];
			if(et == 'SLE'){
				  var dckCount=window.CD.services.cs.objLength(window.CD.module.data.Json.SLEData);
				  for(var i=0; i<dckCount;i++){		
			  			var labelGrpName = window.CD.module.data.Json.SLEData['SLE'+i].name;
			  			var labelGroupId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
			  			var id = labelGroupId.split("_")[1];
			  			if(labelId == labelGrpName){
			  				var dataIndex =window.CD.module.data.getLabelIndex('label_'+id);
				          	var lblId = dataIndex.split("SLE")[1];
				          	cnt1.push(lblId);
			  				window.CD.module.view.underlineActiveDockText(labelGroupId,cnt1);
			  			}
				  }
			  }
		}
		
		if(typeof activeObj==="object" && activeObj.nodeType==="Group"){
			
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
			{
				if(activeChildrenTxtObj.attrs.id.match(/lbltxt_[0-9]+/)){
				    this.getSelectedTextOptions(activeGrpObj);
					var sle = window.CD.module.data.getLabelIndex(labelDockId);	
					if($('#UnderlinetTool').hasClass('active')){
						this.removeUnderline(activeGrpObj,'remove Underline',cnt1);						   
					}else{
						this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj,false,'apply Underline',cnt1);
					}	
				}
			}
		}
		
	};
	/***
	 * Modified by Nabonita Bhattacharyya
	 */
	this.removeSelectedTextOptions=function(txtGrpObj){
		console.log("@commonLabelText:removeSelectedTextOptions");
		try{
			if(txtGrpObj.attrs.id.match(/txtGrp_[0-9]+/)){	
				var normalClr = this.normalFill;
				$.each(txtGrpObj.children, function(index,value) {
					if(value.className !== "Rect"){
						value.setFill(normalClr);		
					}
				});		    
		     }	
			
			$("#fontTextbox").val(window.CD.module.data.Json.adminData.GFS);
			this.cleanSelectedOptionFromOldTxt();
		}
		catch(error){
			console.info("Error in commonLabelText : removeSelectedTextOptions "+error.message);
		}	
	};
	this.setActiveTextFontSize=function(elm, fontsize,activeGrpObjRet){
		var font=$("#fontTool .font_size #fontTextbox").val();
		textStyle=this.getTextStyle();
		
		var undoMng = window.CD.undoManager;		
		
		
		if(activeGrpObjRet){
			var activeObj=activeGrpObjRet;
			var activeGrpObj=activeObj;
			
			if(elm == undefined || elm == ''){
				elm = activeGrpObj;
			}
			var txtGrpObjId = elm.attrs.id;
			var txtId = txtGrpObjId.split("_")[1];
			var labelDockId = activeGrpObj.parent.attrs.id.split('dock_')[1];
			
		}else{
			var activeObj=window.CD.elements.active.element[0];
			var activeGrpObj=activeObj;
			
			if(elm == undefined || elm == ''){
				elm = activeGrpObj;
			}
			var txtGrpObjId = elm.attrs.id;
			var txtId = txtGrpObjId.split("_")[1];	
			var labelDockId = activeGrpObj.parent.attrs.id;
		}
		
		var labelId = 'label_'+txtId;
		var node = window.CD.module.data.getLabelIndex(labelId);
		var cnt=[];
		if(!activeGrpObjRet){
			var et = this.ds.getEt();
			if(et == 'SLE'){
				  var dckCount=window.CD.services.cs.objLength(window.CD.module.data.Json.SLEData);
				  for(var i=0; i<dckCount;i++){		
			  			var labelGrpName = window.CD.module.data.Json.SLEData['SLE'+i].name;
			  			var labelGroupId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
			  			var id = labelGroupId.split("_")[1];
			  			if(labelId == labelGrpName){
			  				node = 'SLE'+id;
			  				var dataIndex =window.CD.module.data.getLabelIndex('label_'+id);
				          	var lblId = dataIndex.split("SLE")[1];
				          	cnt.push(lblId);
				  			window.CD.module.view.changeFontForDockTextAsLabel(node,labelGroupId,fontsize);
			  			}
				  }
			  }
		}
		var initFont = window.CD.module.data.getJsonData()[node].textFormat.fontSize;
		if(typeof activeObj==="object" && activeObj.nodeType==="Group"){
			
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
			{
				
				if(activeChildrenTxtObj.attrs.id.match(/lbltxt_[0-9]+/)){
						  
				   activeObj=activeChildrenTxtObj;
				   activeObj.setHeight('auto');
				   if(fontsize)
						font = fontsize;
				   activeObj.setFontSize(font);
				   var labelGrpObj=activeGrpObj.parent;
				   var labelObj='';
				   if(labelGrpObj.attrs.id.match(/^label_[0-9]+/)){
					   $.each(labelGrpObj.children,function(kk,valls){
							if(valls.attrs.id){
								if(valls.attrs.id.match(/lbl_[0-9]+/)){
									labelObj=valls;
								}
							}
						});
				   }else{//for dock text, text position update on font size change
					   if(labelGrpObj.attrs.id.match(/^dock_label_[0-9]+/)){
						   $.each(labelGrpObj.children,function(dkk,dvalls){
								if(dvalls.attrs.id){
									if(dvalls.attrs.id.match(/dock_lbl_[0-9]+/)){
										labelObj=dvalls;
									}
								}
							});
					   }
				   }
				   
				   if(labelObj){
					   var totWidth = labelObj.getWidth();
					   var totHeight = labelObj.getHeight();
					   var imgGrp = labelGrpObj.get('.img')[0];
					   if(imgGrp){
						   var imgH = parseInt(imgGrp.getHeight());
					   }
					  
					   
					   if(activeChildrenTxtObj.getTextWidth() > totWidth){
						   activeChildrenTxtObj.setWidth(totWidth-20);
					   }
					   
					   if(!imgGrp){
						  var originalTextHeight = activeChildrenTxtObj.textArr.length * activeChildrenTxtObj.getTextHeight();
						   if(totHeight > originalTextHeight){
							 var calcY = (totHeight - originalTextHeight)/2;
							 activeGrpObj.setY(calcY);
						   } 
					   }else{
						   var originalTextHeight = activeChildrenTxtObj.textArr.length * activeChildrenTxtObj.getTextHeight();
						   if(totHeight > originalTextHeight){
							 var calcY = imgH + ((totHeight - imgH - originalTextHeight)/2) + 5;
							 activeGrpObj.setY(calcY);
						   } 
					   }
					   
				   }
				   
				   
				   
				   this.drawLayer();
				   if(et == 'SLE'){
						 var dockGrp = this.cs.getLayer().get('#dock_label_'+txtId)[0];	
						 var dockTextGrp = dockGrp.get('#docktxtGrp_'+txtId)[0];	
						 var dockTextObj = dockTextGrp.get('#dock_txt_'+txtId)[0];						
					 }
					if($('#UnderlinetTool').hasClass('active')){						
						 this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj);
						 if(dockTextGrp && dockTextObj){
							  this.applyTextUnderline(dockTextObj, dockTextGrp);
						  }
					 }
				   this.getSelectedTextOptions(activeGrpObj);
				   if(fontsize == undefined){
					   if(activeGrpObj.parent.attrs.id.match(/^label_[0-9]+/)){
						   undoMng.register(this, this.setActiveTextFontSize,[activeGrpObj,initFont] , 'Text Formatting',this, this.setActiveTextFontSize,[activeGrpObj,font] , 'Text Formatting');
						   updateUndoRedoState(undoMng);
					   }
				   }
				   if((activeGrpObj.parent.attrs.id.match(/^label_[0-9]+/))){
					   var labelIndex= window.CD.module.data.getLabelIndex(labelDockId);
					   var textFormat=window.CD.module.data.getEachLabelOutputData(labelIndex,'textFormat');
					   var underLine=textFormat.underline_value;
					   /*update data string*/
					   var chngArr={textFormat:{
							underline_value:underLine,
							fontSize:activeChildrenTxtObj.getFontSize(),
							fontStyle:activeChildrenTxtObj.getFontStyle(),
							align:activeChildrenTxtObj.getAlign()
							}};
					   if(cnt){
						   if(cnt.length>0){
								 for(j=0;j<(cnt.length);j++){
										window.CD.module.data.setEachLabelOutputData('SLE'+cnt[j],chngArr);
								 }
							 }
						   else{
								window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);

						   }
					   }
					   else{
							window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);

					   }		   
				   	}	   
				}	
			}
		};
		
	};
	this.alignActiveText=function(elm,alignText,activeGrpObjRet){
		textStyle=this.getTextStyle();
		activeAlign=textStyle.align;
		 var undoMng = window.CD.undoManager;
		 var et = this.ds.getEt();
		 var cnt=[];
		 if(activeGrpObjRet){
			 if(elm == undefined || elm == ''){
					elm = activeGrpObj;
			 }
			var activeObj = activeGrpObjRet;
			var activeGrpObj = activeObj;	
			
			var txtGrpObjId = activeObj.attrs.id;
			var txtId = txtGrpObjId.split("_")[1];
			
		 }else{
			var activeObj = window.CD.elements.active.element[0];
			var activeGrpObj = activeObj;
			
			if(elm == undefined || elm == ''){
				elm = activeGrpObj;
			}
			
			var txtGrpObjId = activeObj.attrs.id;
			var txtId = txtGrpObjId.split("_")[1];
			var labelId = 'label_'+txtId;
			if(et == 'SLE'){
				  var dckCount=window.CD.services.cs.objLength(window.CD.module.data.Json.SLEData);
				  for(var i=0; i<dckCount;i++){		
			  			var labelGrpName = window.CD.module.data.Json.SLEData['SLE'+i].name;
			  			var labelGroupId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
			  			var id = labelGroupId.split("_")[1];
			  			if(labelId == labelGrpName){
			  				node = 'SLE'+id;
			  				var dataIndex =window.CD.module.data.getLabelIndex('label_'+id);
				          	var lblId = dataIndex.split("SLE")[1];
				          	cnt.push(lblId);
				  			window.CD.module.view.changeAlignmentForDockTextAsLabel(node,labelGroupId,alignText);
			  			}
				  }
			  }
		 }
		 
		 
		 if(et == 'SLE' && alignText){
			 var labelId = activeObj.parent.attrs.id;
			 if(activeObj.parent.attrs.id.match(/^label_[0-9]/)){
				 labelId = 'dock_'+activeObj.parent.attrs.id;
			 }
			 var dockActiveObj = this.cs.getLayer().get('#'+labelId)[0];
			 var dockTextObj = dockActiveObj.get('#docktxtGrp_'+txtId)[0];
		 }
		 if(alignText)
				activeAlign = alignText;
		
		if(typeof activeObj==="object" && activeObj.nodeType==="Group")
		{
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			if(dockActiveObj){
				var dockChildrenTxtObj = dockTextObj.get('#dock_txt_'+txtId)[0];
			}
			
			if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
			{
				if(activeChildrenTxtObj.attrs.id.match(/lbltxt_[0-9]+/)){
					activeObj=activeChildrenTxtObj;
					activeObj.setWidth(activeGrpObj.parent.children[0].getWidth()-20);
					activeObj.setAlign(activeAlign);
					if(dockChildrenTxtObj){
						var dockTextObj = dockChildrenTxtObj;
						dockTextObj.setWidth(activeGrpObj.parent.children[0].getWidth()-20);
						dockTextObj.setAlign(activeAlign);
					}
				    this.drawLayer();
				    if(et == 'SLE'){
						 var dockGrp = this.cs.getLayer().get('#dock_label_'+txtId)[0];	
						 if(!dockGrp){
							 dockGrp = this.cs.findGroup('dock_label_'+txtId);
						 }
						 var dockTextGrp = dockGrp.get('#docktxtGrp_'+txtId)[0];	
						 var dockTextObj = dockTextGrp.get('#dock_txt_'+txtId)[0];						
					 }
					
				   
					   
					 if((activeGrpObj.parent.attrs.id.match(/^label_[0-9]+/))){
						var labelIndex= window.CD.module.data.getLabelIndex(activeGrpObj.parent.attrs.id);
						var textFormat=window.CD.module.data.getEachLabelOutputData(labelIndex,'textFormat');
						var initAlign = window.CD.module.data.getJsonData()[labelIndex].textFormat.align;
						var underLine=textFormat.underline_value;
							/*update data string*/
						 var chngArr={textFormat:{
								underline_value:underLine,
								fontSize:activeChildrenTxtObj.getFontSize(),
								fontStyle:activeChildrenTxtObj.getFontStyle(),
								align:activeChildrenTxtObj.getAlign()
								}};
						 if(cnt){
							   if(cnt.length>0){
									 for(j=0;j<(cnt.length);j++){
											window.CD.module.data.setEachLabelOutputData('SLE'+cnt[j],chngArr);
									 }
								 }
							   else{
									window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);

							   }
						   }
						   else{
								window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);

						   }
						   undoMng.register(this, this.alignActiveText,[activeGrpObj,initAlign] , 'Text Formatting',this, this.alignActiveText,[activeGrpObj,window.CD.module.data.getJsonData()[labelIndex].textFormat.align] , 'Text Formatting');
						   updateUndoRedoState(undoMng);
					 }
					 
					 if($('#UnderlinetTool').hasClass('active')){						
						 this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj);
						 if(dockTextGrp && dockTextObj){
							  this.applyTextUnderline(dockTextObj, dockTextGrp);
						  }
					 }
				   	this.getSelectedTextOptions(activeGrpObj);
				}
			}
		}
		
	};
	/**
	 * function name: deleteActiveText()
	 * description:on click delete tool delete active
	 * text

	 * 
	 */

	this.deleteActiveLabelText=function(param){
		var active = window.CD.elements.active;
		var activeElm = active.element[0];
		var txtGrpObjId = activeElm.attrs.id;
		var txtId = txtGrpObjId.split("_")[1];	
		var labelId = 'label_'+txtId;		
		var data = window.CD.module.data;
		
		if(param== 'stopEvent'){
			var node = data.getLabelIndex(labelId);
			var dis = data.getJsonData()[node].distractor_label;
			if(dis == 'T'){
				this.deleteText('','undoRedo');
			}
		}else{
			this.deleteText('','undoRedo');
		}
		/*for COI image issue*/
		if(this.ds.getEt()!== 'PRG'){
			if(activeElm.parent.attrs.id.match(/^label_[0-9]+/)){
				this.finalAdjustmentLabelContent(activeElm.parent);
			}
		}		
	};
	this.deleteText = function(elm,undoRedo){
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var active = window.CD.elements.active;
		var activeElm = active.element[0];
		var undoMng = window.CD.undoManager;
		var cdLayer = cs.getLayer();
		var textValue ="";
		if(elm != undefined && elm != ''){
			activeElm = cdLayer.get('#'+elm.attrs.id)[0];
		}
		var activeDockElm = cdLayer.get('#dock'+activeElm.attrs.id)[0];	
		
		var txtGrpObjId = activeElm.attrs.id;
		var txtId = txtGrpObjId.split("_")[1];	
		var labelId = 'label_'+txtId;
		var dataIndex = window.CD.module.data.getLabelIndex(labelId);
    	var cs = window.CD.services.cs;
		var cdLayer = window.CD.services.cs.getLayer();
		var tFormat = window.CD.module.data.getJsonData()[dataIndex].textFormat;
		var textFormat = { 
				"underline_value": tFormat.underline_value, 
				"fontSize": tFormat.fontSize, 
				"fontStyle": tFormat.fontStyle,
				"align": tFormat.align
		};
		
		if(activeElm.getId().match(/^txtGrp_[0-9]+/)!= null){
			textValue = window.CD.module.data.getLabelTextValue(activeElm.parent.getId());
			this.textFormat.deleteEachLabelText(activeElm);			
			if(activeElm.get('.underline_txt')[0])
				this.removeUnderline(activeElm);
		}
		
		
		if(activeDockElm){
			if(this.ds.getEt()== 'SLE'){
				var cnt=[];
				 var dckCount=window.CD.services.cs.objLength(window.CD.module.data.Json.SLEData);
				 
				 if(activeDockElm.get('#dock_txt_'+txtId)[0]){
					 textValue = activeDockElm.get('#dock_txt_'+txtId)[0].getText();
				 } 
				 for(var i=0; i<dckCount;i++){		
			  			var labelGrpName = window.CD.module.data.Json.SLEData['SLE'+i].name;
			  			var id = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId.split('_')[1];
		   				var textId = 'lbltxt_'+id;
		   				var activeGroup = activeElm.parent.attrs.id;
			  			if(activeGroup == labelGrpName){
			  				var actvDockGrp = cs.findGroup('dock_'+labelGrpName);
			  				var dockactiveGrpObj = actvDockGrp.get('#docktxtGrp_'+textId.split('_')[1])[0];
			  				if(dockactiveGrpObj){
			  					this.textFormat.deleteEachLabelText(dockactiveGrpObj);
			  				}
			  				var actDckGrp = cs.findGroup('dock_label_'+id);
							if(actDckGrp.get('.underline_txt')[0])
								this.removeUnderline(actDckGrp);
							var dataIndex =window.CD.module.data.getLabelIndex('label_'+id);
				          	var lblId = dataIndex.split("SLE")[1];
				          	cnt.push(lblId);
			  			}
				  }
			}else{
				if(activeDockElm.get('#dock_txt_'+txtId)[0]){
					textValue = activeDockElm.get('#dock_txt_'+txtId)[0].getText();
					activeDockElm.get('#dock_txt_'+txtId)[0].remove();			
					if(activeDockElm.get('.underline_txt')[0])
						this.removeUnderline(activeDockElm);
				}
			}
		}
		var totWidth = activeElm.parent.children[0].getWidth();
		if(activeElm.get('#addTxt_'+txtId)[0]){
			
			var addtxt = activeElm.get('#addTxt_'+txtId)[0];
			addtxt.show();
			this.bindLabelTextEvent(activeElm);
			addtxt.setFill('#555');
			addtxt.setWidth(totWidth - 20);
			if(activeElm.parent.get('.img')[0]){
				addtxt.parent.setY(activeElm.parent.children[0].getHeight()-20);				
			}else{
				//activeElm.setY((activeElm.parent.children[0].getHeight() - addtxt.getTextHeight())/2);				
			}
		//	addtxt.setHeight(17);
			//addtxt.setWidth(activeElm.parent.children[0].getWidth()-20);
			addtxt.setAlign("center");
		}
			
		if(activeElm.get('#txtBox_'+txtId)[0]){
			activeElm.get('#txtBox_'+txtId)[0].show();
			activeElm.get('#txtBox_'+txtId)[0].setFill('#fff');
			activeElm.get('#txtBox_'+txtId)[0].setWidth(totWidth - 20);
			var padding = parseInt(activeElm.parent.children[0].getWidth()-activeElm.get('#txtBox_'+txtId)[0].getWidth());
			activeElm.setX(padding/2);
			//activeElm.get('#txtBox_'+txtId)[0].setWidth(activeElm.parent.children[0].getWidth()- 20);
			var totHeight = activeElm.parent.children[0].getHeight();
			var textBoxHeight = activeElm.get('#addTxt_'+txtId)[0].getHeight();
			var topPadding = (totHeight-textBoxHeight)/2;
			activeElm.setY(topPadding);
			
		}
		var groupId = activeElm.parent.attrs.id;	
		if(activeElm.parent.get('.lockicon_' + groupId)[0]){
		activeElm.parent.get('.lockicon_' + groupId)[0].moveToTop();
		activeElm.parent.get('.unlockicon_' + groupId)[0].moveToTop();
		}
		var labelElm = activeElm.parent;
		if(cnt){
			var changefieldArr={label_value:""};
			if(cnt.length>0){
				 for(j=0;j<(cnt.length);j++){
						window.CD.module.data.setEachLabelOutputData('SLE'+cnt[j],changefieldArr);
				 }
			 }
			else{
				var dataIndex =window.CD.module.data.getLabelIndex(groupId);
				window.CD.module.data.setEachLabelOutputData(dataIndex,changefieldArr);
			}
		}
		else{
			var dataIndex =window.CD.module.data.getLabelIndex(groupId);
			var changefieldArr={label_value:""};
			window.CD.module.data.setEachLabelOutputData(dataIndex,changefieldArr);
		}
//		if((activeElm.parent.attrs.id.match(/label_[0-9]+/))){
//		var dataIndex =window.CD.module.data.getLabelIndex(groupId);
//		 var changefieldArr={label_value:""};
//		 window.CD.module.data.setEachLabelOutputData(dataIndex,changefieldArr);
//		}
		cdLayer.draw();
		this.cs.setActiveElement(cs.findGroup('frame_0'),'frame');	
		var iscallFromundoRedo=true;
		/* for image text adjustment */
		if(typeof window.CD.module.view.labelImageAndTextAdjust == "function"){
			window.CD.module.view.labelImageAndTextAdjust(labelElm);
		}
		if(undoRedo)
			undoMng.register('',this.showHideLabelText,[activeElm,textValue,dataIndex,"",iscallFromundoRedo,textFormat], 'Undo Text Delete',this,this.deleteText,[activeElm], 'Redo Text Delete');
		updateUndoRedoState(undoMng);
	};

	/********************************************************************************************************************/
	/* for hide text */
	this.onClickHideLabelText = function(activeElmId,undoRedoCall){
		var activeType = window.CD.elements.active.type;
		if(activeType==='dock' || activeType === 'label'){
			if(undoRedoCall && undoRedoCall == 'undo'){
				$('#hideTextLoc').prop('checked',false);
			}else{
				if(undoRedoCall && undoRedoCall == 'redo'){
					$('#hideTextLoc').prop('checked',true);
				}
			}
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			var activeElmLength = activeElmId.length;
			for(var j=0;j<activeElmLength;j++){
				var activeElm = cs.findGroup(activeElmId[j]);
				var infoTextTObj;
				var txtGrp;
				var imgGrp;
				var data = window.CD.module.data;
				var moduleView = window.CD.module.view;
				var moduleData = data.getJsonData();
				
				if(activeType !=='dock' && activeType !== 'label'){
					if(activeElmId[j].match(/^label_[0-9]+/)){
						activeType = 'label';
					}else{
						if(activeElmId[j].match(/^dock_label_[0-9]+/)){
							activeType = 'dock';
						}
					}
				}
				
				/*fetch label group details*/
				if(activeType == 'dock'){
					var labelId = data.getLabelIndex('label_'+activeElm.attrs.id.split('_')[2]);
					var lblGroup = cs.findGroup('label_'+activeElm.attrs.id.split('_')[2]);
				} else if(activeType == 'label'){
					var labelId = data.getLabelIndex(activeElm.attrs.id);
					var lblGroup = cs.findGroup(activeElm.attrs.id);
				}
				/*for image adjust calculation in a label*/
				var label = lblGroup.children[0];
				var oldData = {'height':label.getHeight(),'width':label.getWidth()};
				var calcY = label.getHeight()-20;
				
				/*fetch all info text objects*/
				var labelGroupId = moduleData[labelId].labelGroupId;
				$.each(lblGroup.children, function(index,value){
					if(value.nodeType==="Group" && value.attrs.id.match(/infoText_label_[0-9]+/)){
						/*fetching T F H infotext object*/
						$.each(value.children, function(i,v){
							if(v.attrs.id.match(/T_infoText_label_[0-9]+/)){
								infoTextTObj=v;
								infoText = infoTextTObj.parent;
							}if(v.attrs.id.match(/H_infoText_label_[0-9]+/)){
								infoTextHObj=v;
							}
							if(v.attrs.id.match(/F_infoText_label_[0-9]+/)){
								infoTextFObj=v;
							}
						});
						
					}else if(value.nodeType==="Group" && value.attrs.id.match(/txtGrp_[0-9]+/)){
						txtGrp=value;
					}else if(value.nodeType==="Group" && value.attrs.id.match(/img_label_[0-9]+/)){
						imgGrp=value;
					}
						
				});
				
				var infoTvisible=infoTextTObj.getVisible();
				var infoHvisible=infoTextHObj.getVisible();
				var infoFvisible=infoTextFObj.getVisible();
				
				if(imgGrp)var imageObj=imgGrp.children[0];
				if($('#hideTextLoc').is(':checked')){
					infoTextTObj.show();
					var textH = txtGrp.children[0].getHeight();
					if (!$('#showHiddenTxtGlobal').is(':checked')) {
						txtGrp.hide();
					}
					if (imgGrp && imgGrp.attrs.id.match(/img_label_[0-9]+/)) {
						moduleView.updateLabelContent(lblGroup, oldData, calcY, textH);

					if (txtGrp.get('#lbltxt_' + txtGrp.attrs.id.split('_')[1])[0])
						txtGrp.setY(((label.getHeight()) / 2)
								- (((txtGrp.get('#lbltxt_' + txtGrp.attrs.id
										.split('_')[1])[0]).getHeight()) / 2));
					else
						txtGrp.setY(((label.getHeight()) / 2)
								- (((txtGrp.get('#addTxt_' + txtGrp.attrs.id
										.split('_')[1])[0]).getHeight()) / 2));
					// txtGrp.setX(((label.getWidth())/2)-((txtGrp.children[2].getTextWidth())/2));
					var tempTxtGrp = txtGrp;
					var tempInfo = infoText;
					var tempInfoT = infoTextTObj;
					txtGrp.remove();
					infoTextTObj.remove();

						lblGroup.add(tempTxtGrp);

						infoText.add(tempInfoT);
						lblGroup.add(infoText);
						txtGrp.hide();
					}
					/* adjust position for T and F */
					if (!infoHvisible && infoFvisible) {
						var infoTX = infoTextTObj.getX();
						infoTextFObj.setX(infoTX + 10);
					}
					moduleData[labelId].infoHideText='T';
				}else{
					infoTextTObj.hide();
					txtGrp.show();
					moduleView.updateLabelContent(lblGroup, oldData, calcY);
					
					moduleData[labelId].infoHideText='F'
				    /* for image text adjustment */
		 		    if(typeof window.CD.module.view.labelImageAndTextAdjust == "function"){
					  	window.CD.module.view.labelImageAndTextAdjust(lblGroup);
		 		    }
				}
				var undoMng = window.CD.undoManager;
				
				if(undoRedoCall != undefined){
					if(activeElmId[j]!="") {
						var lbGroup=cdLayer.get('#'+activeElmId[j])[0];
						cs.setActiveElement(lbGroup,'label');
					}
				}
			}

			if(!undoRedoCall){
				var undoCallStatus = 'undo';
				var redoCallStatus = 'redo';
				undoMng.register(this, /*window.CD.module.view.undoHideText*/this.onClickHideLabelText,[activeElmId,undoCallStatus] , 'Undo Label Info text',this, /*window.CD.module.view.undoHideText*/this.onClickHideLabelText,[activeElmId,redoCallStatus] , 'Redo Label Info text');
			}
				
			
			updateUndoRedoState(undoMng);
			cdLayer.draw();
			ds.setOutputData();
		}
  };
  this.onClickHideGlobalLabelText = function(activeElmIds,check){
  	try{
  		var activeLabelLength = activeElmIds.length;
		if(check == 'unchecked'){
			$('#hideTextGlobal').prop('checked',false);
			$('#hideTextLoc').prop('checked',false);
		}else{
			if(check == 'checked'){
				$('#hideTextGlobal').prop('checked',true);
				$('#hideTextLoc').prop('checked',true);
				check='checked';
			}
		}
		for(var i=0;i<activeLabelLength;i++){
			if(activeElmIds[i]){
				var activeElmId = activeElmIds[i];
				var cs = window.CD.services.cs;
				var ds = window.CD.services.ds;
				var cdLayer = cs.getLayer();
				
				var activeElm = cs.findGroup(activeElmId);
				var activeType = 'label';
				
				var infoTextTObj;
				var txtGrp;
				var imgGrp;
				var data = window.CD.module.data;
				var moduleView = window.CD.module.view;
				var moduleData = data.getJsonData();
				
				if(activeType == 'label'){
					var labelId = data.getLabelIndex(activeElm.attrs.id);
					var lblGroup = cs.findGroup(activeElm.attrs.id);
				}
				/*for image adjust calculation in a label*/
				var label = lblGroup.children[0];
				var oldData = {'height':label.getHeight(),'width':label.getWidth()};
				var calcY = label.getHeight()-20;
				
				/*fetch all info text objects*/
				var labelGroupId = moduleData[labelId].labelGroupId;
				$.each(lblGroup.children, function(index,value){
					if(value.nodeType==="Group" && value.attrs.id.match(/infoText_label_[0-9]+/)){
						/*fetching T F H infotext object*/
						$.each(value.children, function(i,v){
							if(v.attrs.id.match(/T_infoText_label_[0-9]+/)){
								infoTextTObj=v;
								infoText = infoTextTObj.parent;
							}if(v.attrs.id.match(/H_infoText_label_[0-9]+/)){
								infoTextHObj=v;
							}
							if(v.attrs.id.match(/F_infoText_label_[0-9]+/)){
								infoTextFObj=v;
							}
						});
						
					}else if(value.nodeType==="Group" && value.attrs.id.match(/txtGrp_[0-9]+/)){
						txtGrp=value;
					}else if(value.nodeType==="Group" && value.attrs.id.match(/img_label_[0-9]+/)){
						imgGrp=value;
					}
						
				});
				
				var infoTvisible=infoTextTObj.getVisible();
				var infoHvisible=infoTextHObj.getVisible();
				var infoFvisible=infoTextFObj.getVisible();
				
				if(imgGrp)var imageObj=imgGrp.children[0];
//					$('#globalDiv #hideTextGlobal').on(
				if(check=='checked'){
					infoTextTObj.show();
					var textH = txtGrp.children[0].getHeight();
					if (!$('#showHiddenTxtGlobal').is(':checked')) {
						txtGrp.hide();
					}
					if (imgGrp && imgGrp.attrs.id.match(/img_label_[0-9]+/)) {
						moduleView.updateLabelContent(lblGroup, oldData, calcY, textH);

						if (txtGrp.get('#lbltxt_' + txtGrp.attrs.id.split('_')[1])[0])
							txtGrp.setY(((label.getHeight()) / 2)
									- (((txtGrp.get('#lbltxt_' + txtGrp.attrs.id
											.split('_')[1])[0]).getHeight()) / 2));
						else
							txtGrp.setY(((label.getHeight()) / 2)
									- (((txtGrp.get('#addTxt_' + txtGrp.attrs.id
											.split('_')[1])[0]).getHeight()) / 2));
						// txtGrp.setX(((label.getWidth())/2)-((txtGrp.children[2].getTextWidth())/2));
						var tempTxtGrp = txtGrp;
						var tempInfo = infoText;
						var tempInfoT = infoTextTObj;
						txtGrp.remove();
						infoTextTObj.remove();

						lblGroup.add(tempTxtGrp);

						infoText.add(tempInfoT);
						lblGroup.add(infoText);
					}
					/* adjust position for T and F */
					if (!infoHvisible && infoFvisible) {
						var infoTX = infoTextTObj.getX();
						infoTextFObj.setX(infoTX + 10);
					}
					moduleData[labelId].infoHideText='T';
				}else{
					infoTextTObj.hide();
					txtGrp.show();
					moduleView.updateLabelContent(lblGroup, oldData, calcY);
					
					moduleData[labelId].infoHideText='F';
				    /* for image text adjustment */
					if(imgGrp){
						if(typeof window.CD.module.view.labelImageAndTextAdjust == "function"){
			 		    	if($('#hideTextGlobaltHide').is(':checked')){
							  	window.CD.module.view.labelImageAndTextAdjust(lblGroup,'callForGlobalTextHide');
			 		    	}else{
							  	window.CD.module.view.labelImageAndTextAdjust(lblGroup);
			 		    	}
			 		    }
					}
		 		    
				}
			}
			ds.setOutputData();
		}
  	}catch(err){
  		console.log("Error in @commonLabelTexta.onClickHideGlobalLabelText"+err.message);
  	}
			
};
	/**
	 * This method is used to get the selected textarea and its id
	 * 
	 */
	this.getSelectedTextArea = function(labelTextObj){
		console.log("@getSelectedTextArea :: commonLabelText");
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
			console.log("Error in getSelectedTextArea :: commonLabelText "+error.message);
		}
	};
	
	this.finalAdjustmentLabelContent = function(labelGrp,imageName) {

		var textFormat = new TextFormat();
		var txtConfg = new TextTool.commonLabelText();
		var textStyleClass = new labelTextStyle();
		
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;

		var labelGroupId = labelGrp.attrs.id;
		var labelObj = labelGrp.children[0];
		var lblWidth = parseInt(labelObj.getWidth());
		var lblHeight = parseInt(labelObj.getHeight());
		var textGrpObj = cdLayer.get("#txtGrp_" + labelGroupId.split('_')[1])[0];
		var imageObj = labelGrp.get('.img')[0];
		var imgObject = imageObj;
		var txtGrpObj = textGrpObj;
		var buffer = 10;
		var textVisible = false;
		
		if(textGrpObj)
			textVisible = textGrpObj.getVisible();
		
		if (imageObj) {
			var imgH = imageObj.getHeight();//parseInt($('#imgHeight').html());
			var imgW = imageObj.getWidth();//parseInt($('#imgWidth').html());
			
			/*if (imageName) {
				// image name is there 
				var src = imageName;
				var imageObj = new Image();
				 //If src has ('|')
				 if(src.indexOf('|')>-1){
					 src = src.split('|')[0];
				 }
				imageObj.src = window.CD.util.proccessMediaID(src.toString());
				var imgH = imageObj.height > 0 ? imageObj.height:imgH;
				var imgW = imageObj.width > 0 ? imageObj.width : imgW;
			}*/

			var ratio = imgW / imgH;
			var avlblWidth = lblWidth - 30;
			var avlblHeight = lblHeight - 30;
			if (imgH > avlblHeight) {
				var exratio = avlblHeight / imgH;
				imgH = imgH * exratio;
				imgW = Math.round(ratio * imgH);
			}
			if (imgW > avlblWidth) {
				var exratio = avlblWidth / imgW;
				imgW = imgW * exratio;
				imgH = imgW / ratio;
			}
			imgObject.setSize(imgW, imgH);
			imageHeight = imgH;
			imgObject.parent.setX((lblWidth - imgW) / 2);

			var labelGroupInd = labelGrp.attrs.id.split('_')[1];
			if (!textVisible) {
				imgObject.setY(0);
				if($('#hideTextLoc').is(':checked')){//done to middle align image for hide text
					buffer = 0;
				}
				imgObject.parent.setY((lblHeight - imgH - buffer) / 2);
			}
			else if (textVisible) { 
         	   imgObject.setY(0);
        	   if($('#hideTextLoc').is(':checked')){
        		   imgObject.parent.setY((lblHeight-imgH)/2);
        	   }else{
        		   if(window.CD.module.data.textGroupComponent.length > 0){
      					var count = txtGrpObj.children.length-1;
      					var lastChild = txtConfg.findLastTextchild(txtGrpObj,count);
      					var textHeight = txtGrpObj.children[lastChild].getY() + txtGrpObj.children[lastChild].getHeight();
      				}
      				else
      					textHeight = txtGrpObj.get('#addTxt_'+labelGrp.attrs.id.split('_')[1])[0].getHeight();
       			var imgHeight = imgObject.getHeight();
       			var imgBuffer = 3;
       			
       			var spaceRemain = (parseInt(lblHeight)-parseInt(imgHeight)-textHeight)/2;
       			if(spaceRemain<10)
       				spaceRemain = 10;
       			
       			imgObject.parent.setY(spaceRemain);
        	   }
           } else {
				var originalTextHeight = txtGrpObj
						.get('#addTxt_' + labelGroupInd)[0].getTextHeight();
				if (txtGrpObj.get('#txtGrp_' + labelGroupInd).length > 0) {
					var count = txtGrpObj.children.length-1;
					var lastChild = thisObj.findLastTextchild(txtGrpObj,count);
					var originalTextHeight = txtGrpObj.children[lastChild].getY() + txtGrpObj.children[lastChild].getHeight();
				}

				var calcTop = (lblHeight - imgH - originalTextHeight) / 2;
         	   if(calcTop < buffer){
         		   calcTop = buffer;
         	   }
         	 imgObject.parent.setY(0);
           	 imgObject.setY(calcTop);
			}
			cdLayer.draw();

		}

		var txtObj = labelGrp.get('#txtGrp_' + labelGrp.attrs.id.split('_')[1])[0];
		var addTxtObj = labelGrp
				.get('#addTxt_' + labelGrp.attrs.id.split('_')[1])[0];
		var imgObj = labelGrp
				.get('#img_label_' + labelGrp.attrs.id.split('_')[1])[0];
		var grpid = labelGrp.attrs.id.split('_')[1];
		if (imgObj) {
			if (txtObj && textVisible) {
				txtObj.setWidth(lblWidth - 20);
				
				var textStyleObj = window.CD.module.data.getTextStyleData(txtObj.getId().split('_')[1]);
				var textStyle = textStyleObj.fontStyle;
				var align = textStyleObj.align;
				var underline_value = textStyleObj.underline_value;
				
				var textValue = window.CD.module.data.getLabelTextValue(txtObj.parent.getId());
				if(textValue != ""){
					/*textFormat.deleteEachLabelText(txtObj);
					
					txtObj = textFormat.createLabelText(txtObj, textValue, align);
					txtConfg.bindLabelTextEvent(txtObj);*/					
				}else{
					var txtBox = txtObj.get('#txtBox_'+txtObj.getId().split('_')[1])[0];
					var addTxt = txtObj.get('#addTxt_'+txtObj.getId().split('_')[1])[0];
					addTxt.setWidth(lblWidth-20);
					txtBox.setWidth(lblWidth-20);
					var originalTextHeight = addTxt.textArr.length * addTxt.getTextHeight();
					if(lblHeight > originalTextHeight){
						 var calcY = (lblHeight - originalTextHeight)/2;
						 addTxt.parent.setY(calcY);
					}else{
						addTxt.parent.setY(0);
						 // this.adjustFontSize(txtGrpObj,totHeight);
					}
				}
				
				var count = txtObj.children.length-1;
				var lastChild = txtConfg.findLastTextchild(txtObj,count);
				var originalTextHeight = txtObj.children[lastChild].getY() + txtObj.children[lastChild].getHeight();
				txtObj.setY(0);
				txtObj.setY(imgObject.parent.getY() + imageHeight + imgObject.getY() + 3);
				
				if($('#hideTextLoc').is(':checked')){
					txtObj.setY((lblHeight-originalTextHeight)/2);
					/* For placing text above image */
					imgObject.moveToBottom();
					imgObject.moveUp();
				}
				
				var activeChildren = txtConfg.getTextObjFromGroupObject(txtObj);
				if(underline_value == 'T'){
					$.each(activeChildren,function(cnt,val){
						if(!val.getId().match(/^addTxt_[0-9]+/)){
							val.setName('underlined_text');
						}					
					});
					globalUnderline = 'global';
				}else{
					$.each(activeChildren,function(cnt,val){
						if(!val.getId().match(/^addTxt_[0-9]+/)){
							var underlineStatus = window.CD.module.data.getUnderlineStatus(val.getId());
							if(underlineStatus == 'F')
								val.setName('normal_text');
						}					
					});	
					globalUnderline = undefined;
				}
				if(underline_value == 'T'){
					$('#UnderlinetTool').addClass('active');
				}
				textStyleClass.applyEachTextUnderline(txtObj,globalUnderline);

			} else if (addTxtObj && textVisible) {
				addTxtObj.parent.setY(imgObject.parent.getY() + imgObject.getY() + imageHeight +3);
				labelGrp.get('#txtBox_' + grpid)[0].setWidth(lblWidth - 20);
				labelGrp.get('#txtBox_' + grpid)[0]
						.setX((lblWidth - 20 - labelGrp.get('#txtBox_' + grpid)[0]
								.getWidth()) / 2)
				labelGrp.get('#addTxt_' + grpid)[0].setWidth(lblWidth - 20);
				labelGrp.get('#addTxt_' + grpid)[0].setAlign("center");
			}
		} else {
			if (txtObj) {
				if(txtObj.getId().match(/^txtGrp_[0-9]/) != null){
					var textStyleObj = window.CD.module.data.getTextStyleData(txtObj.getId().split('_')[1]);
					var textStyle = textStyleObj.fontStyle;
					var align = textStyleObj.align;
					var underline_value = textStyleObj.underline_value;
					
					var textValue = window.CD.module.data.getLabelTextValue(txtObj.parent.getId());
					if(textValue != ""){
						/*textFormat.deleteEachLabelText(txtObj);
						
						txtObj = textFormat.createLabelText(txtObj, textValue, align);*/
						txtConfg.bindLabelTextEvent(txtObj);
						
						var activeChildren = txtConfg.getTextObjFromGroupObject(txtObj);
						if(underline_value == 'T'){
							$.each(activeChildren,function(cnt,val){
								if(!val.getId().match(/^addTxt_[0-9]+/)){
									val.setName('underlined_text');
								}					
							});
							globalUnderline = 'global';
						}else{
							$.each(activeChildren,function(cnt,val){
								if(!val.getId().match(/^addTxt_[0-9]+/)){
									var underlineStatus = window.CD.module.data.getUnderlineStatus(val.getId());
									if(underlineStatus == 'F')
										val.setName('normal_text');
								}					
							});	
							globalUnderline = undefined;
						}
						if(underline_value == 'T'){
							$('#UnderlinetTool').addClass('active');
						}
						textStyleClass.applyEachTextUnderline(txtObj,globalUnderline);
						
						var count = txtObj.children.length-1;
						var lastChild = txtConfg.findLastTextchild(txtObj,count);
						var textGrpHeight = txtObj.children[lastChild].getY() + txtObj.children[lastChild].getHeight();
						var topPadding = (txtObj.parent.children[0].getHeight()-textGrpHeight)/2;
						if(topPadding < 0)
							topPadding = 0;
						txtObj.setY(topPadding);	
					}else{
						var txtBox = txtObj.get('#txtBox_'+txtObj.getId().split('_')[1])[0];
						var addTxt = txtObj.get('#addTxt_'+txtObj.getId().split('_')[1])[0];
						addTxt.setWidth(lblWidth-20);
						txtBox.setWidth(lblWidth-20);
						var originalTextHeight = addTxt.textArr.length * addTxt.getTextHeight();
						if(lblHeight > originalTextHeight){
							 var calcY = (lblHeight - originalTextHeight)/2;
							 addTxt.parent.setY(calcY);
						}else{
							addTxt.parent.setY(0);
							 // this.adjustFontSize(txtGrpObj,totHeight);
						}
					}
				}
				else{
					txtObj.setWidth(lblWidth-20);
					var originalTextHeight = txtObj.textArr.length * txtObj.getTextHeight();
					 if(lblHeight > originalTextHeight){
						 var calcY = (lblHeight - originalTextHeight)/2;
						 txtObj.parent.setY(calcY);
					 }else{
						 txtObj.parent.setY(0);
						 // this.adjustFontSize(txtGrpObj,totHeight);
					 }
				}
			} else if (addTxtObj) {
				addTxtObj.parent
						.setY((lblHeight - addTxtObj.getTextHeight()) / 2);
				labelGrp.get('#txtBox_' + grpid)[0].setWidth(lblWidth - 20);
				labelGrp.get('#txtBox_' + grpid)[0]
						.setX(((lblWidth - 20) - labelGrp
								.get('#txtBox_' + grpid)[0].getWidth()) / 2);
				labelGrp.get('#addTxt_' + grpid)[0].setWidth(lblWidth - 20);
				labelGrp.get('#addTxt_' + grpid)[0].setAlign("center");
			}
		}

		cdLayer.draw();
	};
	
	this.removeLastBR = function(textValue){
    	console.log("@removeLastBR :: commonLabelText");
    	try{
    		if(textValue.indexOf('<br>') != -1){
    			textValue = textValue.replace(/(<br>|\s|&nbsp;)*$/,'');
    		}
    		return textValue;
    	}catch(error){
      		 console.info("Error @removeLastBR :: commonLabelText: "+error.message);
      	 }
    };
};
