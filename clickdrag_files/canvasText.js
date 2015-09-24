/*tool text code*/ 
var TextTool=TextTool || {};
/**
 * class name: textToolConfig()
 * description:All config initialization done here
 * author:Piyali Saha
 */
TextTool.canvasText = function (){
	console.log("@CanvasText.CanvasText");
	this.cs = window.CD.services.cs;
	this.ds = window.CD.services.ds;
	this.Util=window.CD.util;
	this.createTools=window.CD.tools.create;
	this.formatTools = window.CD.tools.format;
	this.boxWidthID="#boxWidth";
	this.boxHeightID="#boxHeight";
	this.realTextValue='';	//this is to store real text with sp and sb tag
	this.SupErrorMesg="Please enter valid subscript/superscript character from palette";
	this.SubErrorMesg="Please enter valid subscript/superscript character from palette";
	this.textToolBoxId="#textToolTextBox";
	this.textMaxChar=256;
	this.textFormat = new TextFormat();
	this.textEditor = new TextEditor();
	this.maxCharWarning=(this.textMaxChar)-5;
	
    this.textSbSpScript=new TextSuperSubScript();
		
	/*active element default type*/
	this.activeElementDefault='rect';//'text';//'rect' 
	
	/*box default*/
	this.defaultBoxWidth='250';
	this.defaultBoxHeight='70';
	this.BoxHeight='20';
	/*canvas object initialization*/
	this.stg = this.cs.getCanvas();
	this.layeObj= this.cs.getLayer();
	
	/*highlight color initialization*/
	this.highlightFill="#1086D9";
	this.normalFill="#555";
		
	/*border */
	this.borderDfltClr="transparent";
	this.borderChgClr="black";
	this.borderWidth=1;
	this.highlightedBorder="#0D79C1";
	this.hightDashedBorderArr=[10,5];
	
	/*fill*/
	this.fillDflClr="transparent";
	this.fillChngClr="white";
			
	this.style={align:"center",border:"F",fontType:"normal",fill:"F"};
	
	this.getBoxWidthHeight=function(){
		var W=$("#propertiesDiv #boxWidth").val() != "" ? $("#propertiesDiv #boxWidth").val()+"px" : this.defaultBoxWidth+"px",
	        H=$("#propertiesDiv #boxHeight").val() != ""? $("#propertiesDiv #boxHeight").val()+"px" : this.BoxHeight +"px";
//	        if(window.CD.module.frame.canvasTextBoxH != '' && window.CD.module.frame.canvasTextBoxW != ''){
//	    		W = window.CD.module.frame.canvasTextBoxW;
//	    		H = window.CD.module.frame.canvasTextBoxH;
//	    	}
	       
	     return {w:W,h:H};
		
	};
	this.drawLayer=function(){
		this.cs.getLayer().draw();
	};
	this.getTextStyle=function(txtObj){
		console.log("@CanvasText.getTextStyle");
		/* for align*/
		if($("#leftAlignTool").data('clicked')) this.style.align="left";
		else if($("#middleAlignTool").data('clicked')) this.style.align="center";
		else if($("#rightAlignTool").data('clicked')) this.style.align="right";
		else if($("#justifyAlignTool").data('clicked')) this.style.align="justify";
		else if(txtObj) this.style.align=txtObj[0].getAlign();
		else this.style.align="center";
		/* align end*/
			
		/* for font type bold & italic */	
		var boldToolId=$('#toolPalette li#'+this.formatTools[1]);
		var italicToolId=$('#toolPalette li#'+this.formatTools[2]);
		if(boldToolId.hasClass('active') && italicToolId.hasClass('active') ){
			this.style.fontType="bold italic";
		}else if(boldToolId.hasClass('active')){//bold
			this.style.fontType="bold";
		}else if(italicToolId.hasClass('active')){//italic
			this.style.fontType="bold italic";
		}else{
			this.style.fontType="normal";
		}
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
	 * author:Piyali Saha
	 * param: 
	 * txtObj:object of text
	 * grpObj:text group object
	 *  
	 */
	this.onchangeTxtobjChangeGrpObj=function(txtObj,grpObj,otherParam){
		console.log("@CanvasText.onChangeTxtobjChangeGrpObj");
		var rectObj,txtStyle=this.getTextStyle();
		//get rect object
		$.each(grpObj.children, function(index,value){
			if(value.className==="Rect")rectObj=value;
		});
		
		var rectStrok=rectObj.getStroke(),rectFill=rectObj.getFill();
		/*change border*/
		if(txtStyle.border==="T"){
			/*on apply click save rect fill*/
			if(this.activeElementDefault==='rect' && otherParam.applyClick){
				this.saveRectBorderColor(grpObj,txtStyle.border);
			}else{
				rectObj.setStroke(this.borderChgClr);
			}
		}else{
			/*on apply click save rect border*/
			if(this.activeElementDefault==='rect' && otherParam.applyClick){
				this.saveRectBorderColor(grpObj,"F");
			}else{
				rectObj.setStroke(this.borderDfltClr);
			}
		}
	    /*change fill*/
		if(txtStyle.fill==="T"){
			 rectObj.setFill(this.fillChngClr);
		}else{
			rectObj.setFill(this.fillDflClr);
		}
		/*for editted text*/
		if(otherParam.editBox){
			rectObj.setStroke(rectStrok);
			rectObj.setFill(rectFill);
			var editedTextHeight=$(this.textToolBoxId).prop('scrollHeight');
		}
		var box=this.getBoxWidthHeight(),W=box.w,Ht=box.h;
		/*width*/
		
		var totalTxtWidth = 0;
		for(var k = 0;k<txtObj.length;k++){
			totalTxtWidth = totalTxtWidth+txtObj[k].getTextWidth();
		}
		if(parseInt(totalTxtWidth) > parseInt(W)){
			rectObj.setWidth(parseInt(W));
		}else{
			rectObj.setWidth(parseInt(W));
		}
		
		/*height*/
		
		var count = grpObj.children.length-1;
		var lastChild = this.findLastTextchild(grpObj,count);
		var textHeight = grpObj.children[lastChild].getY() /*+ grpObj.children[lastChild].getHeight()*/; //After adding resizable in text, when text was edited anchor was not coming in right place
			
		//var textHeight = parseInt(txtObj.getTextHeight())*parseInt(txtObj.textArr.length) + 6;
		if(otherParam.applyClick && textHeight < parseInt(Ht)){
				//txtObj.setHeight('auto');
				rectObj.setHeight(parseInt(Ht));
		}else if(otherParam.editBox){
			if(textHeight > parseInt(Ht)){
				//txtObj.setHeight('auto');
				rectObj.setHeight(textHeight);
			}else{
				//txtObj.setHeight('auto');
				rectObj.setHeight(parseInt(Ht));
			}
		}else{
			//txtObj.setHeight('auto');
			rectObj.setHeight(textHeight);
		}
				
	};
	
	/**
	 * function name: createKineticGroupTextObj()
	 * description:this method create a kinetic
	 * text object with additional object
	 * author:Piyali Saha
	 * param: 
	 * txtObj:object of text
	 * extraObj:additional object
	 *  
	 */
	this.createKineticGroupTextObj=function(txtObj,params,textId){
		console.log("@CanvasText.createKineticGroupTextObj");
		if(typeof txtObj==="object"){
			  var txtToolCfg=this;
			  var txtStyle=txtToolCfg.getTextStyle();
			  /*border*/
			  var brdr=txtToolCfg.borderDfltClr;
			  if(txtStyle.border==="T"){
				  brdr=txtToolCfg.borderChgClr;
			  }
			  if(typeof params.frmtxtList==="object" && params.frmtxtList.border==="T"){
					 brdr=txtToolCfg.borderChgClr;
				 }
			  /*fill*/
			  var fill=txtToolCfg.fillDflClr;
			  if(txtStyle.fill==="T"){
				  fill=txtToolCfg.fillChngClr;
			  } 
			  if(typeof params.frmtxtList==="object" && params.frmtxtList.fill==="T"){
				    fill=txtToolCfg.fillChngClr;
				 }
			  var framJsonObj=window.CD.module.data.Json.FrameData,
			  frmID=this.getFrameID();
			  if(params.inputFrameId)frmID=params.inputFrameId;
			  if(params.ft!=="" && typeof params.ft!=="undefined"){
				  frmTextId=parseInt(params.ft);
			  }else{
				  frmTextId=this.getFrameTextID(frmID);	
			  }
			  /*commenting below code to fix cls text issue----piyali*/
			  //if(textId)
				//  frmTextId = textId;
			  if(!frmTextId)frmTextId=0;
			  var groupId='txt_'+frmTextId+"_"+frmID;
			  var w=parseInt(txtObj.getWidth());
			   var group =this.cs.createGroup(groupId,{x: params.x,y: params.y,draggable:true}); 
			   var rect = new Kinetic.Rect({
		            x: 0,
		            y: 0,
		            height:params.textHeight, //txtObj.getHeight(),		
		            fill: fill,
		            stroke: brdr,
		            strokeWidth: txtToolCfg.borderWidth
		          });
								
				var box=this.getBoxWidthHeight(),W=box.w,H=box.h;
				if(txtObj.getWidth()>parseInt(W))txtObj.setWidth(parseInt(W));
				rect.setWidth(txtObj.getWidth());
								
				/*on create box set width as canvas property*/
				if(params.addedText ){
					var addedTextheight=$(this.textToolBoxId).prop('scrollHeight');
					var box=this.getBoxWidthHeight(),W=box.w,Ht=box.h;
					var textHeight = parseInt(parseInt(txtObj.getTextHeight())*parseInt(txtObj.textArr.length) + 6);
					if(parseInt(textHeight) < 20){
						rect.setHeight(20);
					}else{
						rect.setHeight(textHeight);
					}
					txtObj.setWidth(parseInt(W));
					rect.setWidth(parseInt(W));
					
				}else if(params.showFrame){
					txtObj.setWidth(params.frmtxtList.maxWidth);
					rect.setWidth(params.frmtxtList.maxWidth);
					if(params.frmtxtList.minHeight){
						rect.setHeight(params.frmtxtList.minHeight);
					}
					/*checking sb and sp tag in a text*/
					var textValue=txtObj.getText();
					this.realTextValue=textValue;//this.checkAndUpdateCharFromPalete(textValue);//txtObj.getText();
					//if(this.checkSubOrSuperTagExist(textValue)){
						//textValue=this.changeSubscriptSuperScript(textValue);	
					//}
					if(textValue===false){
						return false;
					}
					txtObj.setText(textValue);
					
					
				}
				window.CD.module.frame.canvasTextBoxW = parseInt(W);
				window.CD.module.frame.canvasTextBoxH = parseInt(H);
				group.add(rect);
				group.add(txtObj);
				if(typeof params.extraObj==="object")
				{
					group.add(params.extraObj);
				}
				return group;
		}
		
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
	this.createHtmlElement=function(options){
		console.log("@CanvasText.createHtmlElement");
		this.clearAlignClicked();
		
		var maskTop = $('#toolPalette').position().top;
		var maskLeft = $('#toolPalette').position().left;
		var maskWidth = $('#toolPalette').width();
		var maskHeight = $('#toolPalette').height();
		var maskToolBar = $('<div id="maskTool" style="position:absolute;opacity:0.05;z-index:99;"></div>');
		maskToolBar.css({ top: maskTop+'px', left: maskLeft+'px', width:maskWidth+'px', height:maskHeight+'px'});
		
		var textVal = this.textFormat.removeLastBR(options.textVal).replace(/ /g,'&nbsp;');
		
		var textAreaContainer=$('<div id="'+options.containerId+'" '+options.ContainerExtAttr+' style="'+options.ContainerStyle+'"><div>'),
		textArea=$('<textarea id="'+options.textId+'" '+options.ContainerExtAttr+'  style="'+options.textStyle+'">'+textVal+'</textarea>'),
		footerContainer=$('<div id="'+options.footerContId+'" class="'+options.footerContClass+'" style="'+options.footerConStyle+'"></div>'),
		footerGuide = $('<div class="footerGuide"><span>Create fill-in-the-blank using double underscores. Separate </span><span>alternate answers with a pipe:__FIB answer|alternate answer__</span></div>');
	    
		
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
	    	}
	    	
	    });
	    var frameTextToolChar=this;
	    footerContainer.append(footerGuide);
	    footerContainer.append(footerContent);
	    textAreaContainer.append(textArea);
	    
	    textAreaContainer.append(footerContainer);
	    $('body').append(textAreaContainer);
	    $('body').append(maskToolBar);
	    
	    this.textEditor.createTextEditor(textAreaContainer);
	    
	   // $(textArea).jqte();
	    /*var top = parseInt(textAreaContainer.position().top);
	    var modifiedTop = top+$('.jqte').height();
	    $(footerContainer).css('position','fixed');
	    $(footerContainer).css('top',modifiedTop);
	    $('.jqte').css('left', $(footerContainer).css('left'));
	    
	    $(".jqte_editor").focus();*/
	    $("#"+options.textId).focus();
	    /*$("#"+options.textId).charCounter({
	    	maxChars: frameTextToolChar.textMaxChar,
	    	maxCharsWarning : frameTextToolChar.maxCharWarning
	    });*/
		
	};
	/**
	 * function name: createTextBox()
	 * description: when click on text 
	 * tool icon to create a text tool box
	 * this method get called
	 * author:Piyali Saha
	 * param: 
	 * layerObj=kinetic layer object
	 * event =click event
	 * 
	 */
	this.createTextBox= function(eventObj,eventObjPalette){
		console.log("@CanvasText.createTextBox");
		openInspector('text');
		var txtConfg = this, layerObj = txtConfg.layeObj;
		txtConfg.checkOldText();
		var x = parseInt(eventObjPalette.x),
		    y = parseInt(eventObjPalette.y) - parseInt($(window).scrollTop()),
		    box = txtConfg.getBoxWidthHeight(),
			W=box.w,
			H=box.h;
		if((y+100) > $('canvas').first().height()){
			y = y -140; 
		}
		var textBoxEditorWidth='283px';
		var textBoxEditorHeight=this.defaultBoxHeight+'px';      
		var options={
			containerId:'textToolContainer',
			ContainerExtAttr:'editedid=""',
			ContainerStyle:'position:fixed;left:'+x+'px;top:'+y+'px;',
			textId :'textToolTextBox',
			textStyle:'left:'+x+'px;top:'+y+'px;height:'+textBoxEditorHeight+';width:'+textBoxEditorWidth+';',
			footerContId:'textToolFooter',
			footerContClass:'palette_div',
			footerConStyle :'width:278px',//'width:'+(parseInt(W)-18)+'px;',
			textVal:""
	    };
		this.createHtmlElement(options);
		var paramProcess={
				paleteboxSelector:this.textToolBoxId,
				editBox:false,
				txtGrpObj:"",
				eventObj:eventObj
		};
		this.processSaveOrCancel(paramProcess);//('#textToolTextBox',x,y,layerObj,false,"",eventObj);
	};
	
	/**
	 * function name: fetchEditedText()
	 * description: fetch text value
	 * author:Piyali Saha
	 * param: 
	 * txtObj=text object[object]
	 * evt =click event
	 * 
	 */

	this.fetchEditedText=function(txtGrpObj){
		console.log("@CanvasText.fetchEditedText");
		var txtObjId = txtGrpObj.attrs.id;
		var splittedid = txtObjId.split("_");
	    var framID = parseInt(splittedid[2]);
		var framTextListId =parseInt(this.getFrameTextListNum(txtObjId));
		var textVal=window.CD.module.data.Json.FrameData[framID].frameTextList[framTextListId].textValue;
		return textVal;
	 	
	};	
	
	/**
	 * function name: editTextToolText()
	 * description: when clicked on any 
	 * text on a frame to edit this method
	 * get called
	 * author:Piyali Saha
	 * param: 
	 * txtObj=text object[object]
	 * evt =click event
	 * 
	 */

	this.editTextToolText=function(txtGrpObj,evt){
		console.log("@CanvasText.editTextToolText");
		var textToolCfg=this,
			layerObj=textToolCfg.layeObj,
			txtObj=this.getTextObjFromGroupObject(txtGrpObj),
			textVal = this.realTextValue/*txtObj.getText()*/,//this.fetchEditedText(txtGrpObj);
			box=textToolCfg.getBoxWidthHeight(),
			W=box.w,
			H=box.h,
			y = txtGrpObj.getAbsolutePosition().y + ($('.header').height()),
			x = txtGrpObj.getAbsolutePosition().x ;
		
		textVal = CanvasData.getCanvasTextValue(txtGrpObj.getId());
		
		if((y+100) > $('canvas').first().height()){
			y = y -140; 
		}
		
		this.checkOldText();
		var textBoxEditorWidth='283px';
		var textBoxEditorHeight=this.defaultBoxHeight+'px';                 
	    var options={
	  			containerId:'textToolContainer',
	  			ContainerExtAttr:'editedid="'+txtGrpObj.attrs.id+'"',
	  			ContainerStyle: 'position:fixed;left:'+x+'px;top:'+y+'px;',
	  			textId :  'textToolTextBox',
	  			textStyle: 'left:'+x+'px;top:'+y+'px;height:'+textBoxEditorHeight+';width:'+textBoxEditorWidth+';',
	  			footerContId:'textToolFooter',
	  			footerContClass: 'palette_div',
	  			footerConStyle : 'width:278px',
	  			textVal :textVal
	      };
	    this.createHtmlElement(options);
	     
	    var txtData=$(this.textToolBoxId).val();
	    $(this.textToolBoxId).val('');
	    $(this.textToolBoxId).focus();$(this.textToolBoxId).val(txtData);
	    
	      txtGrpObj.hide();
	      var parentLayer=txtGrpObj.getLayer();
	      if(parentLayer && parentLayer.attrs.id==="text_layer"){
		    	   parentLayer.draw();
		   }
		   this.drawLayer();
		       
	      
		    
	      
		  var evtObj={x:txtGrpObj.getAbsolutePosition().x,y:txtGrpObj.getAbsolutePosition().y};
		  var paramProcess={
					paleteboxSelector:this.textToolBoxId,
					editBox:true,
					txtGrpObj:txtGrpObj,
					eventObj:evtObj
				};
		  this.processSaveOrCancel(paramProcess);
		  
	   
	};

	/**
	 * function name: initPalete()
	 * description:initialize palete
	 * author:Piyali Saha
	 * param:  
	 * paleteboxSelector=textarea/input id
	 *  
	 */
	this.initPalete = function(paleteboxSelector,language){
		console.log("@CanvasText.initPalete");
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
	 * author:Piyali Saha
	 * param: 
	 * appendConId=append container id
	 * paleteboxSelector=palete input/textarea element id
	 *  
	 */
	this.prepareDropdownListAndAction=function(appendConId,paleteboxSelector){
		if(window.CD.module.data.customLanguageFlage == ''){
			var frameTextTool=this;
			console.log("@CanvasText.prepareDropdownListAndAction--11");	
			  var dropdownlist=$('<span class="palette_option" style="width:100%;">Insert special characters</span>'+
					  			 '<span class="palette_option" style="width:100%;">symbols</span>'+
					  			 '<span class="palette_option" style="width:100%;">math</span>'+
					  			 '<span class="palette_option" style="width:100%;">subscript</span>'+
					  			 '<span class="palette_option" style="width:100%;">superscript</span>'+
					  			 '<span class="palette_option" style="width:100%;">greek</span>'+
			  					 '<span class="palette_option" style="width:100%;">world languages</span>');
			  $("#"+appendConId+" .palette_options").html("").append(dropdownlist);
			 
			  $('.palette_div div.select_box').each(function(){
				  
					$(this).children('span.selected').html($(this).children('div.palette_options').children('span.palette_option:first').html());
					$(this).attr('value',$(this).children('div.palette_options').children('span.palette_option:first').attr('value'));
					
					$(this).children('span,span.select_box').click(function(){
						$.closeAuthPalette();
						if($(this).parent().children('div.palette_options').css('display') == 'none'){
							var calTop =0;
							$(this).parent().children('div.palette_options').css('display','inline');
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
						var lan=$("#paletteDropdown").text().replace(/\s/g, "");
						
						if(lan!=="Insertspecialcharacters")
						{
							window.CD.module.data.customLanguageFlage = $(this);
							frameTextTool.initPalete(paleteboxSelector,lan);
							
							$(frameTextTool.textToolBoxId).css('display','block');
							$(frameTextTool.textToolBoxId+'_html').css('display','none');
							
							$(frameTextTool.textToolBoxId).trigger("showPalette");
							
							$(frameTextTool.textToolBoxId).css('display','none');
							$(frameTextTool.textToolBoxId+'_html').css('display','block');
							
							if(lan==="Superscript" || lan==="Subscript"){
								$("#palette_set .palette_key").css('font-size','17px');
							}
						}
						
						$(frameTextTool.textToolBoxId).focus();
					});
				});
				$('body').on('keydown',function(e) {
				    // ESCAPE key pressed
				    if (e.keyCode == 27) {
				    	$('div.palette_options').each(function(){
				    		$(this).hide();
				    	});
				    }
				});
		}else{
			var frameTextTool=this;
			console.log("@CanvasText.prepareDropdownListAndAction--22");	
			  var dropdownlist=$('<span class="palette_option" style="width:100%;">Insert special characters</span>'+
					  			 '<span class="palette_option" style="width:100%;">symbols</span>'+
					  			 '<span class="palette_option" style="width:100%;">math</span>'+
					  			 '<span class="palette_option" style="width:100%;">subscript</span>'+
					  			 '<span class="palette_option" style="width:100%;">superscript</span>'+
					  			 '<span class="palette_option" style="width:100%;">greek</span>'+
			  					 '<span class="palette_option" style="width:100%;">world languages</span>');
			  $("#"+appendConId+" .palette_options").html("").append(dropdownlist);
			 
			  $('.palette_div div.select_box').each(function(){
				  
				 	$('.palette_div').children().find('.select_box').children('span.selected').html($(window.CD.module.data.customLanguageFlage).html());
					$(this).attr('value',$(window.CD.module.data.customLanguageFlage).attr('value'));
					$(this).children('span,span.select_box').click(function(){
						$.closeAuthPalette();
						if($(this).parent().children('div.palette_options').css('display') == 'none'){
							var calTop =0;
							$(this).parent().children('div.palette_options').css('display','inline');
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
							lan=$("#paletteDropdown").text().replace(/\s/g, "");
							window.CD.module.data.customLanguageFlage = $(this);
							if(lan!=="Insertspecialcharacters")
							{
								frameTextTool.initPalete(paleteboxSelector,lan);
								
								$(frameTextTool.textToolBoxId).css('display','block');
								$(frameTextTool.textToolBoxId+'_html').css('display','none');
								
								$(frameTextTool.textToolBoxId).trigger("showPalette");
								
								$(frameTextTool.textToolBoxId).css('display','none');
								$(frameTextTool.textToolBoxId+'_html').css('display','block');
								
								if(lan==="Superscript" || lan==="Subscript"){
									$("#palette_set .palette_key").css('font-size','17px');
								}
							}
							
							$(frameTextTool.textToolBoxId).focus();
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
				if(lan!=="Insertspecialcharacters")
				{
					frameTextTool.initPalete(paleteboxSelector,lan);
					$(frameTextTool.textToolBoxId).css('display','block');
					$(frameTextTool.textToolBoxId+'_html').css('display','none');
					
					$(frameTextTool.textToolBoxId).trigger("showPalette");
					
					$(frameTextTool.textToolBoxId).css('display','none');
					$(frameTextTool.textToolBoxId+'_html').css('display','block');
					if(lan==="Superscript" || lan==="Subscript"){
						$("#palette_set .palette_key").css('font-size','17px');
					}
				}
				
				$(frameTextTool.textToolBoxId).focus(); 
		}
		
	};
	
	/**
	 * function name: changeToDefaultBoxVal()
	 * author:Piyali Saha
	 */

	this.changeToDefaultBoxVal=function(){
		console.log("@CanvasText.changeToDefaultBoxVal");
		$(this.boxWidthID).val("");
		$(this.boxHeightID).val("");
		
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
	
	this.processSaveOrCancel=function(paramProcess){
		console.log("@CanvasText.processSaveOrCancel");
		var txtTool=this;
		var txtObj = txtTool.getTextObjFromGroupObject(paramProcess.txtGrpObj);
		this.prepareDropdownListAndAction("textToolFooter",paramProcess.paleteboxSelector);
				
		/*close text tool box*/
		$('#textToolFooter .cancel_palette').on('click',function(){
			txtTool.closeTextToolBox('#textToolContainer',paramProcess.editBox,paramProcess.txtGrpObj);
			$("canvas").css('cursor','default');
			$.closeAuthPalette();
		});
		/*save text tool*/
		$('#textToolFooter .save_palette').on('click',function(){
			$.closeAuthPalette();
			var textBoxValue = $(txtTool.textToolBoxId).val();
			if(textBoxValue!=="" && textBoxValue!==null && $.trim(textBoxValue).length > 0){
				if(paramProcess.editBox){
					txtTool.updateEditedText("#textToolContainer",paramProcess.txtGrpObj);
					$("canvas").css('cursor','default');
					
				}else{
					txtTool.saveTextToolBox("#textToolContainer",paramProcess.eventObj);
					$("canvas").css('cursor','default');
				}
			}else{
				$('#textToolFooter .cancel_palette').trigger('click');
			}
			
		});
		  
	};

	this.createText = function(text,x,y,w,textId,clsDock) {
		console.log("@CanvasText.createText");
		var textConfg = this,
		textStyle=textConfg.getTextStyle(),	  
		fontsize = window.CD.module.data.Json.adminData.GFS,
		//frmObj = textConfg.cs.getActiveFrame();
		
		//if(typeof frmObj !== "object"){
			frmObj = textConfg.cs.getGroup('frame_0');
		//}
		
		var framJsonObj = window.CD.module.data.Json.FrameData,
		frmID = 'frame_0',
		frameTextId = this.getFrameTextID(frmID),
		textAlign = textStyle.align,
		textFontType = textStyle.fontType;
		if(textId)
			frameTextId = textId;
		/*checking sb and sp tag in a text*/
		var textValue = text.replace(/<\/sb><sb>/g,'').replace(/<\/sp><sp>/g,'');
		this.realTextValue = textValue;//this.checkAndUpdateCharFromPalete(textValue);
		//if(this.checkSubOrSuperTagExist(textValue)){
			//textValue = this.changeSubscriptSuperScript(textValue);	
		//}
		if(textValue === false){
			return false;
		}
	    var textAdd = new Kinetic.Text({
		        x: 0,//left,
		        y: 0,//top,
		        text: textValue,
		        align:textAlign,
		        fontSize: fontsize,
		        fontFamily: 'sans-serif',
		        fill: '#555',
		        opacity: '1',
		        verticalAlign:'center',
		        fontStyle: textFontType,
		        id: 'txt_'+frameTextId+'_'+frmID,
		        padding: 3
		      });
	    if(clsDock == 'clsDock'){
	    	var textAdd = new Kinetic.Text({
		        x: 0,//left,
		        y: 0,//top,
		        text: textValue,
		        align:textAlign,
		        fontSize: fontsize,
		        fontFamily: 'sans-serif',
		        fill: '#555',
		        opacity: '1',
		        fontStyle:'bold',
		        verticalAlign:'center',
		        id: 'txt_'+frameTextId+'_'+frmID,
		        padding: 3
		      });
	    }
	    var para={extraObj:"",showFrame:false,frmId:"",frmtxtList:"",ft:"",addedText:true,x:parseInt(x),y:parseInt(y),textHeight:textAdd.getHeight()};
		 var groupObj = this.createKineticGroupTextObj(textAdd,para,textId);
		 groupObj.children[0].setWidth(w);
		 groupObj.children[1].setWidth(w);

		if(frmID == 'frame_0'){
				var textBgLayer = textConfg.cs.getBgTextLayer();
				textBgLayer.add(groupObj);
				textBgLayer.moveToTop();
				textBgLayer.draw();
				 
		 }else{
			 frmObj.add(groupObj);
			 groupObj.moveToTop();
		 }
		 
		 window.CD.services.cs.updateDragBound(groupObj);
		 textConfg.drawLayer();
		
			
		
		 var param={creatBox:true};
		 this.setFramTextListData(groupObj,param);
		 this.textSetActive(groupObj);
		 this.textEventBind(groupObj);
		   
		 makeFrameTextResizable(groupObj,groupObj.children[0].getWidth(),groupObj.children[0].getHeight());
		 return groupObj.attrs.id;
	};
	
	this.deleteText=function(txtGroup,clsDockText){
		console.log("@CanvasText.deleteText");
		var txtConfg= this;//new textToolConfig();
		var frameId=this.getFrameID();	
		var undoMng = window.CD.undoManager;
		var txtGrpObjId = txtGroup.attrs.id;
		var frId = txtGroup.attrs.id.split('_')[2];
		if(txtGroup.children.length == 0 && frId!=0)
			txtGroup = this.cs.findGroup('frame_'+frId).get('#'+txtGroup.attrs.id)[0];	
		if(txtGroup.children.length == 0 && frId ==0)
			txtGroup = this.cs.getBgTextLayer().get('#'+txtGroup.attrs.id)[0];	
		var splittedid = txtGrpObjId.split("_");
		var frameTextId=parseInt(this.getFrameTextListNum(txtGrpObjId));
		var frameID=parseInt(splittedid[2]);
		var parentLayer=txtGroup.getLayer();
		var activeElmParent=txtGroup.parent;
		var frameJson = txtConfg.getFrameData(txtGroup);
		var initVal = frameJson.textValue;
		var event ={};
		event.x = frameJson.textX;
		event.y = frameJson.textY;
		//txtGroup.removeChildren();
		//txtGroup.remove();
		txtConfg.cs.deleteSubGroups(txtGroup);
		txtGroup.destroy();
		//window.CD.globalTextCreated[frameID]--;
		 if(parentLayer && parentLayer.attrs.id==="text_layer"){
		    	   parentLayer.draw();
		  }
			  txtConfg.drawLayer();
		
		
		if(!clsDockText){
			txtConfg.cs.setActiveElement(txtConfg.cs.getGroup('frame_0'),'frame');
		}									
		var framDataObj=window.CD.module.data.Json.FrameData[frameID];
		delete framDataObj.frameTextList[frameTextId];
		txtConfg.changeToDefaultBoxVal();
		txtConfg.ds.setOutputData();
		txtConfg.arrayClean(framDataObj.frameTextList,undefined);
		//txtConfg.reindexTextArray(framDataObj.frameTextList,activeElmParent);
		txtConfg.ds.setOutputData();
		//undoMng.register(this,this.saveTextToolBox,['',event,initVal], 'Undo Text Delete',this,this.deleteText,[txtGroup], 'Redo Text Delete');
		//updateUndoRedoState(undoMng);
		
	};
	this.getFrameData=function(activeGrpObj){
		var txtObjId = activeGrpObj.attrs.id,
		splittedid = txtObjId.split("_"),
	    framID = parseInt(splittedid[2]);
		framTextListId =this.getFrameTextListNum(txtObjId);//parseInt(splittedid[1]);
		var frameJson = window.CD.module.data.Json.FrameData[framID].frameTextList[framTextListId];
		return frameJson;
	};
	/**
	 * function name: getFrameTextListNum()
	 * description:bold active text
	 * author:Piyali Saha
	 * 
	 */
	this.getFrameTextListNum=function(txtGrpId){
		var splittedid = txtGrpId.split("_");
	    var framID = parseInt(splittedid[2]);
		var framTextListId;
		var flagExecuted=false;
		var totalFrameJsonFrametxt=window.CD.module.data.Json.FrameData[framID].frameTextList;
		
		if(totalFrameJsonFrametxt.length==0){
			framTextListId=txtGrpId.split("_")[1];
		}else{
			for(var i=0; i<=totalFrameJsonFrametxt.length; i++){
				if(totalFrameJsonFrametxt[i] && totalFrameJsonFrametxt[i].textGroupObjID==txtGrpId){
					framTextListId=i;
					flagExecuted=true;
				}else if(typeof totalFrameJsonFrametxt[i]==="undefined" && i==txtGrpId.split("_")[1] &!flagExecuted){
					framTextListId=i;
				}
			}
		}
		if(typeof framTextListId ==="undefined"){
			framTextListId=txtGrpId.split("_")[1];
		}
		return framTextListId;
	};
	/**
	 * function name: checkOldText()
	 * description:For edit box click on 
	 * each text check old text if text click
	 * happen without cancel previous box
	 * author:Piyali Saha
	 */

	this.checkOldText= function(){
		console.log("@CanvasText.checkOldText");
		var OldTextVal=$("#textToolContainer").attr('editedid');
		if($("#textToolContainer").is(":visible") && OldTextVal!==""){
			var oldId=$("#textToolContainer").attr('editedid');
			var oldTxtObj=this.stg.get('#'+oldId);
			oldTxtObj[0].show();
			var parentLayer=oldTxtObj[0].getLayer();
			 if(parentLayer && parentLayer.attrs.id==="text_layer"){
		    	   parentLayer.draw();
			 }
		    	   this.drawLayer();
		     
			
		}
	};
	/**
	 * function name: saveTextToolBox()
	 * description:on click of save in create box
	 * and draw that text to canvas
	 * author:Piyali Saha
	 * param: 
	 * selector:container div id
	 * layerObj:layer object[object]
	 * event : event object
	 *  
	 */
	this.saveTextToolBox = function(inlineEditor,event,tVal,oldTextId){
		console.log("@CanvasText.saveTextToolBox");
		/*var fontSizeUpdateId = window.CD.module.frame.fontSizeUpdateId;
		var frameTxtList = window.CD.module.data.Json.FrameData[0].frameTextList;
		if(fontSizeUpdateId != '' && !$.isEmptyObject(frameTxtList)){
			var lastUpdatedText = frameTxtList[fontSizeUpdateId.split('_')[1]];
			var lastFontSize = lastUpdatedText.fontSize;
		}*/
		
		var textConfg = this,
		textStyle=textConfg.getTextStyle(),	  
		fontsize =window.CD.module.data.Json.adminData.GFS,
		//frmObj = textConfg.cs.getActiveFrame();
		
		//if(typeof frmObj !== "object"){
			frmObj = textConfg.cs.findGroup('frame_0');
		//}
		/*if(lastFontSize){
			fontsize = lastFontSize;
		}*/
		
		var undoMng = window.CD.undoManager;
		var framJsonObj = window.CD.module.data.Json.FrameData;
		var frmID = frmObj.getId().split('_')[1];
		//if(window.CD.globalTextCreated[frmID] == undefined){	//Commented as dock header text and canvastext ID get massedup by SS
			var frameTextId = this.getFrameTextID(frmID);
		//}
		//else{		  		
			//var frameTextId = this.getFrameTextID(frmID); //window.CD.globalTextCreated[frmID];
		//}
		
		if(oldTextId && oldTextId != ''){
			frameTextId = oldTextId.split('_')[1];
		}
		
		var frameTextIndex = this.getFrameTextID(frmID);
		if(window.CD.globalStyle.alignment != ''){
			var align = window.CD.globalStyle.alignment;
		}else{
			var align = 'left';
		}
		
		textFontType = textStyle.fontType,
		textvalue='';
		if(framJsonObj[frmID].frameTextList[frameTextIndex])
			initVal = framJsonObj[frmID].frameTextList[frameTextIndex].textValue;
		/*checking sb and sp tag in a text*/
		if(tVal)
			textValue = tVal;
		else
			textValue=$(this.textToolBoxId).val().replace(/<\/sb><sb>/g,'').replace(/<\/sp><sp>/g,'');
		textValue = textValue.replace(/&nbsp;/g,' ');
		textValue = textValue.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
		textValue = this.textFormat.removeLastBR(textValue);
		
		this.realTextValue=textValue;//this.checkAndUpdateCharFromPalete(textValue);
		//if(this.checkSubOrSuperTagExist(textValue)){
			//textValue=this.changeSubscriptSuperScript(textValue);	
		//}
		if(textValue===false){
			return false;
		}
		/** Frame data populate in Json **/
		/* Json value */
		var frameJsonData = window.CD.module.data.Json.FrameData[frmID].frameTextList[frameTextId];
		/* Default values */
		var defaultParams = {};
		defaultParams = this.cs.cloneObject(frameTextlistDefaults);
		defaultParams.fontSize = fontsize;
		
		var box = textConfg.getBoxWidthHeight();
		var W=box.w;
		var H=box.h;
		defaultParams.maxWidth = parseInt(W);
		defaultParams.minHeight = parseInt(H);
		
		var X = event.x;
		var Y = event.y;
		defaultParams.textX = parseInt(X);
		defaultParams.textY = parseInt(Y)-65;
		defaultParams.textValue = textValue;
		//defaultParams.textAlign = 'center';
		//defaultParams.underlineVal = 'F';
		defaultParams.absolutePosition = true;
		defaultParams.textGroupObjID='txt_'+frameTextId+"_"+frmID;
		if(window.CD.globalStyle.underlineVal != ''){
			defaultParams.underlineVal = window.CD.globalStyle.underlineVal;
		}
		/* Done to merge with jSon value */
		if(frameJsonData){
			defaultParams = $.extend(defaultParams,frameJsonData);
		}
		if(window.CD.globalStyle.fontStyle != ''){
			defaultParams.fontType = window.CD.globalStyle.fontStyle;
		}
		if(window.CD.globalStyle.alignment != ''){
			defaultParams.textAlign = window.CD.globalStyle.alignment;
		}	
		//CanvasData.updateCanvasTextData(defaultParams,frameTextIndex,frmID);
		window.CD.module.data.Json.FrameData[frmID].frameTextList.push(defaultParams);
		/***** For Frame text new *****/
		if(window.CD.globalStyle.alignment != ''){
			align = window.CD.globalStyle.alignment;
		}else{
			align = defaultParams.textAlign;
		}
		
		
		var pos = {};
		pos.x = event.x - 15;
		pos.y = event.y - 80;
		txtGrpObj = this.textFormat.createFrameText(frameTextId,frmObj,pos,textValue,align);	
		makeFrameTextResizable(txtGrpObj,txtGrpObj.children[0].getWidth(),txtGrpObj.children[0].getHeight());
		defaultParams.zIndex = txtGrpObj.getZIndex();
		//CanvasData.updateCanvasTextData(defaultParams,frameTextIndex,frmID);
		this.textEventBind(txtGrpObj);
		$(inlineEditor).remove();
		var parentLayer=txtGrpObj.getLayer();
		if(parentLayer && parentLayer.attrs.id==="text_layer"){
			parentLayer.draw();
		}
		this.drawLayer();
		
		var oldTextId = 'txt_'+frameTextId+"_"+frmID;
		this.drawLayer();
		textConfg.ds.setOutputData();
		undoMng.register(this,this.deleteText,[txtGrpObj], 'undo Text Delete',this,this.saveTextToolBox,['',event,textValue,oldTextId], 'redo Text Delete');
		updateUndoRedoState(undoMng);
	};

	/*****************************************************************************/
	/**
	 * new added methods
	 */
	
	/*****************************************************************************/
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
	};
	/**
	 * function name: closeTextToolBox()
	 * description:on click on close link 
	 * called this method
	 * author:Piyali Saha
	 * param: 
	 * selector:container div id
	 * editBox:true/false[boolean]
	 * txtObj:added/edited text object[object]
	 * layerObj:layer object[object]
	 * 
	 */

	this.closeTextToolBox=function(selector,editBox,txtGrpObj){
		console.log("@CanvasText.closeTextToolBox");
		var textToolCfg=this,
		layerObj=textToolCfg.layeObj,
		txtObj=this.getTextObjFromGroupObject(txtGrpObj);
		
		  if(editBox)
		  {
			  txtGrpObj.show();
			  var parentLayer=txtGrpObj.getLayer();
			  if(parentLayer && parentLayer.attrs.id==="text_layer"){
			    	   parentLayer.draw();
			  }
			    	   this.drawLayer();
			 
		  }
		 $('#toolPalette li#'+this.createTools[0]).addClass('active');
		 $('#toolPalette li#'+this.createTools[1]).removeClass('active');
		  $(selector).remove();
		  $('#maskTool').remove();
		  this.closErrormodal();
		  
	};

	/**
	 * function name: getFrameTextID()
	 * description:get total text list number
	 * plus one in a frame 
	 * author:Piyali Saha
	 * param: 
	 * frameJsonObj-frame json object[object]
	 * 
	 */

	this.getFrameTextID=function(framId){
		 console.log("@canvasText.getFrameTextID");
		 var frameJsonObj=window.CD.module.data.Json.FrameData;
		 var frameJsonObjcount;
		  var textIdNumber=0;
		  if(!frameJsonObj[framId])
		  {
			  frameJsonObjcount=0;
		  }else{
			  var fr=frameJsonObj[framId].frameTextList;
			  if(typeof fr=="undefined" || typeof fr.length=="undefined")
			  { 
				  frameJsonObj[framId].frameTextList=[];
				  frameJsonObjcount=0;
			  }else{
				  var countNum=parseInt(frameJsonObj[framId].frameTextList.length)-1;
				  if(countNum > 0){
					  frameJsonObjcount=countNum+1;
				  }
			  }
			 if(!frameJsonObjcount){
			     frameJsonObjcount=frameJsonObj[framId].frameTextList.length;
			 }
		  }
		  if(parseInt(frameJsonObjcount)<0 || parseInt(frameJsonObjcount)===0)textIdNumber=0;
		  else textIdNumber=parseInt(frameJsonObjcount);
		  if(!$.isNumeric(textIdNumber))textIdNumber=0;
		  return textIdNumber;
	};


	/**
	 * function name: setFramTextListData()
	 * description:set all frame text data 
	 * to json object 
	 * author:Piyali Saha
	 * param: 
	 * txtObj-frame json object[object]
	 * framID- frame id to store text object
	 */
	this.setFramTextListData=function(txtGrpObj,otherParam){
		console.log("@CanvasText.setFramTextListData");
		var undoFrameDelete = ((otherParam && otherParam.undoFrameDelete!=undefined)?otherParam.undoFrameDelete:false);
		var textToolCfg = this,textId=((otherParam && otherParam.textId)?otherParam.textId:''),
		inputframId=((otherParam && otherParam.inputframId)?otherParam.inputframId:''),
		creatBox=((otherParam && otherParam.creatBox)?otherParam.creatBox:''),
		applyclick=((otherParam && otherParam.applyClick)?otherParam.applyClick:''),
		layerObj = textToolCfg.layeObj,
		txtObj = this.getTextObjFromGroupObject(txtGrpObj);
		var txtStyle = textToolCfg.getTextStyle();
		var val = "F";
		if(txtGrpObj.get('.underline_txt')[0]){
			val = "T";
		}
		var isCallfromShowFrame=((otherParam && otherParam.showFrame!=undefined)?otherParam.showFrame:false);
		var txtObjId = txtGrpObj.attrs.id,
			splittedid = txtObjId.split("_"),
		    framID = parseInt(splittedid[2]);
			framTextListId =parseInt(this.getFrameTextListNum(txtObjId));//this.getFrameTextID(framID);// parseInt(splittedid[1]);
			if(framID==0)
			{
				fullFrmObj=window.CD.module.data.Json.FrameData[framID],
				/*calulatedX=parseInt(txtGrpObj.attrs.x)-parseInt(fullFrmObj.frameOriginalX);
				calulatedY=parseInt(txtGrpObj.attrs.y)-parseInt(fullFrmObj.frameOriginalY);*/
				calulatedX = txtGrpObj.getX();
				calulatedY = txtGrpObj.getY();
			}else
			{
				calulatedX=txtGrpObj.attrs.x;
				calulatedY=txtGrpObj.attrs.y;
			}
			var rectObj;
			$.each(txtGrpObj.children, function(index,value) {
				
				if(value.className==="Rect")
				{
					rectObj=value;
					
				}
			});
			if(rectObj)
			{
				var bd=rectObj.getStroke();
				var fillColr=rectObj.getFill();
			}
			
			var border=txtStyle.border;
			if(bd==="black")border="T";
			if(this.activeElementDefault=='rect' && !creatBox){
				border=this.getRectBorderColor(txtGrpObj);
			}
			
			
			
			if(fillColr==="white")fill="T";
			else fill="F";
			
			var box=this.getBoxWidthHeight();
			if(creatBox || applyclick){
				 var minHeight=parseInt(box.h);
			}else{
				var minHeight= parseInt(box.h); //this.getTextMinHeight(txtGrpObj);//this.defaultBoxHeight;
				if(!minHeight || minHeight=='')minHeight=this.defaultBoxHeight;
			}
			
			var textValue=this.realTextValue;
			if(this.realTextValue!=''){
				//textValue=this.checkAndUpdateCharFromPalete(this.realTextValue);
			}
			/*checking textId and json id*/
			if(inputframId!=="" && typeof inputframId!=="undefined")var framejsonId=inputframId;
			else var framejsonId=framID;
			if(textId!=="" && typeof textId!=="undefined")var textJsonId=textId;
			else var textJsonId=framTextListId;
			var textUpdatedId=textJsonId;
			var totalFrameJsonFrametxt=window.CD.module.data.Json.FrameData[framejsonId].frameTextList;
			if(creatBox && totalFrameJsonFrametxt){	 
				if(totalFrameJsonFrametxt.length > 0){
					var lastTxtGrpid=totalFrameJsonFrametxt[totalFrameJsonFrametxt.length-1].textGroupObjID;
					var addedId=parseInt(parseInt(lastTxtGrpid.split("_")[1])+1);
					var currTxtId=txtObjId.split("_")[1];
					if(addedId!=currTxtId){
						txtObjId="txt_"+addedId+"_"+framID;
						txtGrpObj.setId(txtObjId);
						var parentLayer=txtGrpObj.getLayer();
						 if(parentLayer && parentLayer.attrs.id==="text_layer"){
						    	   parentLayer.draw();
						  }
						  this.drawLayer();
					}
				}
				
			}
			var addedTextObj={
				             border:border,
				             fill:fill,
				             fontSize:txtGrpObj.children[1].getFontSize(),
				             maxWidth:txtGrpObj.children[0].getWidth(),
				             minHeight:rectObj.getHeight(), //minHeight,
				             textValue:textValue,
				             textX:calulatedX,
				             textY:calulatedY,
				             textAlign:txtGrpObj.children[1].getAlign(),
				             textFillColor:fill,
				             textBorderColor:fillColr,
				             fontType: txtStyle.fontType,
				             textGroupObjID:txtObjId,
				             /*underlineVal :val,*/
				             absolutePosition:true
	                   };
			if(undoFrameDelete && typeof textList == 'object' && $.isEmptyObject(textList)){
				 window.CD.module.data.Json.FrameData[framejsonId].frameTextList = [];
			 }
			 window.CD.module.data.Json.FrameData[framejsonId].frameTextList[textUpdatedId]=addedTextObj;
			 /*clean null from array*/
			 var frmTextListData=window.CD.module.data.Json.FrameData[framejsonId].frameTextList;
			 textToolCfg.arrayClean(frmTextListData,undefined);
			 textToolCfg.ds.setOutputData();
	};
	
	/**
	 * function name: checkAndUpdateCharFromPalete()
	 * author:Piyali Saha
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
	 * function name: updateEditedText()
	 * description: after edited text 
	 * on saving this method get called
	 * author:Piyali Saha
	 * param: 
	 * selector-updated box container id
	 * txtObj- text object[object]
	 * layerObj- layer object[object]
	 */

	this.updateEditedText=function(textEditContainer,txtGrpObj,val){
		console.log("@CanvasText.updateEditedText");
		var txtGrpId=txtGrpObj.getId();
		if(txtGrpObj.children.length == 0)
			txtGrpObj = this.cs.getBgTextLayer().get('#'+txtGrpObj.attrs.id)[0];
		var textTool=this,//new textToolConfig(),
		layerObj = this.cs.getLayer(),
		rectObj,
		txtObj = this.getTextObjFromGroupObject(txtGrpObj),
		textStyle = textTool.getTextStyle(txtObj),
		textAlign=textStyle.align,
		textFontType=txtObj[0].getFontStyle(),//textStyle.fontType,
		framId=this.getFrameID(txtGrpId),
		fontsize=txtObj[0].getFontSize(),
		textValue='';//window.CD.module.data.Json.adminData.GFS;
		var undoMng = window.CD.undoManager;
		var initVal = this.getFrameData(txtGrpObj).textValue;
		/*checking sb and sp tag in a text*/
		if(val)
			textValue = val;
		else
			textValue=$(this.textToolBoxId).val().replace(/<\/sb><sb>/g,'').replace(/<\/sp><sp>/g,'');
		textValue = textValue.replace(/&nbsp;/g,' ');
		
		textValue = this.textFormat.removeLastBR(textValue);
		textValue = textValue.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
		this.realTextValue=textValue;//this.checkAndUpdateCharFromPalete(textValue);//textValue;
		//if(this.checkSubOrSuperTagExist(textValue)){
			//textValue=this.changeSubscriptSuperScript(textValue);	
		//}
		if(textValue===false){
			return false;
		}
		var frameTextId = txtGrpId.split('_')[1];
		var frmObj = textTool.cs.findGroup('frame_'+framId);
		
		var eventPosition = CanvasData.getTextPosition(txtGrpId);
		var event = {};
		event.x = eventPosition.x - 15;
		event.y = eventPosition.y - 15;
		
		//var textValue = CanvasData.getCanvasTextValue(txtGrpId);
		
		var defaultParams = CanvasData.getDefaultParamsFromJson(txtGrpId,eventPosition);
		
		var params = {};
		params.textValue = textValue;
		defaultParams = $.extend(defaultParams,params);
		
		this.textFormat.deleteActiveText(txtGrpObj);
		/***** For Frame text new *****/
		
		CanvasData.updateCanvasTextData(defaultParams,frameTextId,framId);
		
		txtGrpObj = this.textFormat.createFrameText(frameTextId, frmObj, event, textValue, textAlign);
		makeFrameTextResizable(txtGrpObj,txtGrpObj.children[0].getWidth(),txtGrpObj.children[0].getHeight());
		$.each(txtGrpObj.children, function(index,value) {
				
				if(value.className==="Rect")
				{
					rectObj=value;
					
				}
			});
			
		var parm={editBox:true,
				applyClick:false
				  };
		
		this.onchangeTxtobjChangeGrpObj(txtObj,txtGrpObj,parm);//change rect height
		//txtObj.setHeight(parseInt(txtObj.getHeight())+10)
		//rectObj.setHeight(txtObj.getHeight());
		txtGrpObj.show();
		var parentLayer=txtGrpObj.getLayer();
		 if(parentLayer && parentLayer.attrs.id==="text_layer"){
		    	   parentLayer.draw();
		  }
			  layerObj.draw();
				
		/*if($('#UnderlinetTool').hasClass('active')){
			this.applyTextUnderline(txtObj,txtGrpObj);
		}*/
		
		$(textEditContainer).remove();
		$('#maskTool').remove();
		//$('.tool_select').trigger('click');
		
	    //this.setFramTextListData(txtGrpObj);
	    var finalVal = this.getFrameData(txtGrpObj).textValue;
	    //this.textSetActive(txtGrpObj);
		this.textEventBind(txtGrpObj);
		undoMng.register(this,this.updateEditedText,['',txtGrpObj,initVal], 'undo Text Delete',this,this.updateEditedText,['',txtGrpObj,finalVal], 'redo Text Delete');
		updateUndoRedoState(undoMng);
	};
	/**
	 * function name: getFrameObject()
	 * description:this method return 
	 * frame id of a input object
	 * if input object is invalid 
	 * then retrun frame 0
	 * author:Piyali Saha
	 * param: 
	 * inputObject: input text object [object]
	 */
	this.getFrameID=function(txtGrpId){
		console.log("@CanvasText.getFrameID");
		var txtConfg= this;//new textToolConfig();
		var activeFrmObj=txtConfg.cs.getGroup('frame_0');
		if(typeof activeFrmObj!=="object")
		  {
			activeFrmObj= txtConfg.cs.getGroup('frame_0');
		  }
		
		var splitinput=activeFrmObj.attrs.id.split('_');
		if(splitinput[0]==="frame")
		{
			var frameId=splitinput[1];
		}
		if(txtGrpId && txtGrpId.split("_")[2]!=frameId){
			var frameId=txtGrpId.split("_")[2];
		}
		
	 return frameId;	
	};

	/**
	 * function name: textSetActive()
	 * description:this method bind all the
	 * required event for the text object 
	 * author:Piyali Saha
	 */
	this.textSetActiveForNewCanvasText=function(newObject){
		console.log("@canvasText.setdockTextHighlight");
		var nameSpace = this;
		var  oldObj=window.CD.elements.active.element[0];
		var textTool= this;//new textToolConfig();
		if(typeof newObject==="object" && newObject.nodeType==="Group" && (newObject.attrs.id.match(/txt_[0-9]_[0-9]+/)))
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
		}else if(typeof oldObj==="object" && oldObj.nodeType==="Group" && (oldObj.attrs.id.match(/txt_[0-9]_[0-9]+/)))
		{
			nameSpace.removeTextHighlight(oldObj);
		}
		
		textTool.drawLayer();	
	};

	this.textSetActive=function(txtGrpObject){
		console.log("@CanvasText.textSetActive");
		var textToolCfg=this;//new textToolConfig();
		var textparam ="canvastext";		
		
		textToolCfg.cs.setActiveElement(txtGrpObject,textparam);
		
		 var parentLayer=txtGrpObject.getLayer();
		 if(parentLayer && parentLayer.attrs.id==="text_layer"){
		    parentLayer.draw();
		 }
		 this.drawLayer();
			
	};


	/**
	 * function name: textEventBind()
	 * description:this method bind all the
	 * required event for the text object 
	 * author:Piyali Saha
	 */
	this.textEventBind=function(txtGrpObject){
		console.log("@CanvasText.textEventBind");
		var childTxtObj=this.getTextObjFromGroupObject(txtGrpObject);
		var txtNameSpace= this;
		var undoMng = window.CD.undoManager;
		
		/*txtGrpObject.on("click", function(evt) {
			evt.cancelBubble = true;	
			txtNameSpace.textSetActive(this);
			evt.cancelBubble = true;
		});*/
		
		/*txtGrpObject.children[0].on("dblclick dbltap", function(evt) {
			evt.cancelBubble = true;	
			txtNameSpace.textSetActive(txtGrpObject);
			txtNameSpace.editTextToolText(txtGrpObject,evt);
			evt.cancelBubble = true;
			
			});*/
		
		var childTxtObj=this.getTextObjFromGroupObject(txtGrpObject);
		var txtNameSpace= this;

		$.each(childTxtObj, function(index,value) {
			value.on('click',function(evt){		
				txtNameSpace.textSetActive(this.parent, 'canvastext');
				evt.cancelBubble = true;
			});
			value.on("dblclick dbltap", function(evt) {
				var evtObj = {selectorObj:txtGrpObject,x:txtGrpObject.getAbsolutePosition().x,y:txtGrpObject.getAbsolutePosition().y+$('canvas').first().offset().top};
				txtNameSpace.editTextToolText(txtGrpObject);
				evt.cancelBubble = true;
			});
	     });
		txtGrpObject.on('mousedown',function(evt){
			evt.cancelBubble = true;
			window.CD.services.cs.updateMoveToTopBottomState(this);
		});
		
		txtGrpObject.off('dragend');
		txtGrpObject.on('dragend', function(evt) {	
			evt.cancelBubble = true;
			txtNameSpace.setActiveTextPosition(txtGrpObject);
			
		});
	
	};
	/**
	 * function name: setTextPos()
	 * description:setting position of text on undo redo call
	 */
    this.setTextPos = function(group1, x ,y){
    	for(var i=0;i<group1.length;i++){
    		var grId = group1[i].attrs.id;
        	if(group1[i].children.length == 0){
        		var group = this.cs.getBgTextLayer().get('#'+grId)[0];
        	}else{
        		var group = this.cs.getBgTextLayer().get('#'+grId)[0];
        	}
        		
        			
        	var textX = parseInt(x[i]);
    		var textY = parseInt(y[i]);
    		
    		var adjustmentX = 0;
    		var adjustmentY = 0;
    		
    		var frmID = grId.split('_')[2];
    		var framJsonObj = window.CD.module.data.Json.FrameData;
    		
    		var frameX = framJsonObj[frmID].frameX;
    		var frameY = framJsonObj[frmID].frameY;
    		
    		if(frmID == 0){
    			adjustmentY = 15;
    			adjustmentX = 15;
    		}else{
    			adjustmentX = parseInt(frameX) + 15;
    			adjustmentY = parseInt(frameY) - 15;
    		}
    		
    		var X = textX - adjustmentX;
    		var Y = textY - adjustmentY;
    		    	
    		var position = {};
    		position.x = textX;
    		position.y = textY;
    		
    		CanvasData.setTextPosition(group.attrs.id,position);
        	
        	group.setPosition(parseInt(X),parseInt(Y));
    	}
    	
    	var parentLayer = group.getLayer();
    	if(parentLayer && parentLayer.attrs.id==="text_layer"){
    		parentLayer.draw();
	    }else{
	    	this.drawLayer();
	    }
    	//this.setFramTextListData(group);	
    };
    /**
	 * function name: clearAlignClicked()
	 * description:this method clear all the
	 * old clicked align data 
	 * author:Piyali Saha
	 */
	this.clearAlignClicked=function(){
		console.log("@CanvasText.clearAlignClicked");
		$("#leftAlignTool").data('clicked',false);
		$("#middleAlignTool").data('clicked',false);
		$("#rightAlignTool").data('clicked',false);
		$("#justifyAlignTool").data('clicked',false);
		$("#boldTool").data('clicked',false);
		$("#italicsTool").data('clicked',false);
		$("#UnderlineTool").data('clicked',false);
	};

	/**
	 * function name: getTextObjFromGroupObject()
	 * description:get text object from a group 
	 * object
	 * author:Piyali Saha
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
	 * function name: saveRectBorderColor()
	 * description:save rect fill T or F in json
	 * author:Piyali Saha
	 */
	this.saveRectBorderColor=function(txtGrpObj,fillTrueFalse){
		console.log("@CanvasText.saveRectBorderColor");
		var txtObj = this.getTextObjFromGroupObject(txtGrpObj);
		var txtObjId = txtGrpObj.attrs.id,
		    splittedid = txtObjId.split("_"),
		    framID = parseInt(splittedid[2]);
			framTextListId =parseInt(this.getFrameTextListNum(txtObjId));
			
	   var frameTextObj=window.CD.module.data.Json.FrameData[framID].frameTextList[framTextListId];
	   //frameTextObj.fill=fillTrueFalse;
	   frameTextObj.border=fillTrueFalse;
	   this.ds.setOutputData();
	};
	/**
	 * function name: getRectBorderColor()
	 * description:get rect fill T or F in json
	 * author:Piyali Saha
	 */
	this.getRectBorderColor=function(txtGrpObj){
		console.log("@CanvasText.getRectBorderColor");
		var txtObj = this.getTextObjFromGroupObject(txtGrpObj);
		var txtObjId = txtGrpObj.attrs.id,
		    splittedid = txtObjId.split("_"),
		    framID = parseInt(splittedid[2]);
			framTextListId =parseInt(this.getFrameTextListNum(txtObjId));
	   var frameTextObj=window.CD.module.data.Json.FrameData[framID].frameTextList[framTextListId];
	  // return frameTextObj.fill 
	   if(frameTextObj)
	   return frameTextObj.border;
	   
	};
	/**
	 * function name: getTextMinHeight()
	 * description:get rect min height
	 * author:Piyali Saha
	 */
	this.getTextMinHeight=function(txtGrpObj){
		console.log("@CanvasText.getTextMinHeight");
		var txtObj = this.getTextObjFromGroupObject(txtGrpObj);
		var txtObjId = txtGrpObj.attrs.id,
		    splittedid = txtObjId.split("_"),
		    framID = parseInt(splittedid[2]);
			framTextListId =parseInt(this.getFrameTextListNum(txtObjId));
	   return txtObj.getHeight();
	   
	  /*var frameTextObj = window.CD.module.data.Json.FrameData[framID].frameTextList[framTextListId];
	   * if(!frameTextObj.minHeight || frameTextObj.minHeight==='') return txtObj.getHeight();
	  else return txtObj.getHeight();*/
	   
	};
	
	/**
	 * function name: removeSelectedTextOptions()
	 * description:on remove selected text options 
	 * author:Piyali Saha
	 */
	this.removeSelectedTextOptions=function(txtGrpObj){
		if(txtGrpObj.attrs.id.match(/txt_[0-9]+/)){		
			this.changeToDefaultBoxVal();
			var rectObj,txtObj=this.getTextObjFromGroupObject(txtGrpObj);
			
			if(txtGrpObj.children.length == 0){
				txtGrpObj = this.cs.getBgTextLayer().get('#'+txtGrpObj.getId())[0];
			}
			
			$.each(txtGrpObj.children, function(index,value) {
				
				if(value.className==="Rect")
				{
					rectObj=value;
					
				}
			});
		
			if(this.activeElementDefault=='rect'){
				var getRectBorder=this.getRectBorderColor(txtGrpObj);
				if(getRectBorder==="T"){
					rectObj.setStroke(this.borderChgClr);
					rectObj.setDashArrayEnabled(false);
				}else{
					rectObj.setStroke(this.borderDfltClr);
					rectObj.setDashArrayEnabled(false);
				}
				var textId = txtGrpObj.attrs.id;
				for(var i=0;i<txtGrpObj.children.length;i++){
					if(txtGrpObj.children[i].attrs.name){
						if(txtGrpObj.children[i].attrs.name == 'bottomRight_'+textId){
							txtGrpObj.children[i].hide();
						}
						if(txtGrpObj.children[i].attrs.name == 'topRight_'+textId){
							txtGrpObj.children[i].hide();
						}
						if(txtGrpObj.children[i].attrs.name == 'bottomLeft_'+textId){
							txtGrpObj.children[i].hide();
						}
						if(txtGrpObj.children[i].attrs.name == 'topLeft_'+textId){
							txtGrpObj.children[i].hide();
						}
					}
				}
		    }else{
		    	txtObj.setFill(this.normalFill);
		    }
	     }	
		
		$("#fontTextbox").val(window.CD.module.data.Json.adminData.GFS);
		$("#borderGuide").prop("checked",false);
		$("#fillGuide").prop("checked",false);
		//$("#boxWidth").val("300");
		//$("#boxHeight").val("70");
		this.cleanSelectedOptionFromOldTxt();
		this.cs.getBgTextLayer().draw();
	};

	/**
	 * function name: getSelectedTextOptions()
	 * description:on setActiveElement method
	 * this method will call to highlight text 
	 * author:Piyali Saha
	 */
	this.getSelectedTextOptions1=function(txtGrpObj){
		this.cleanSelectedOptionFromOldTxt(true);
		var txtCfg=this;//new textToolConfig();
		var rectObj;
		txtOpt={align:'',bold:'',italic:'',underline:''};//var txtOptArr=txtOpt.split(',');
		/*txt*/
		var txtObj=this.getTextObjFromGroupObject(txtGrpObj);
		var textAlign=txtObj.getAlign();
		var textFontSize=txtObj.getFontSize();
		var textFontStyle=txtObj.getFontStyle();
		/*rect*/
		if(this.activeElementDefault==='rect'){
			var getRectBorder=this.getRectBorderColor(txtGrpObj);
			if(getRectBorder==="T"){
				var rectStrok=this.borderChgClr;
			}else{
				var rectStrok=this.borderDfltClr;
			}
		}else{
			var rectStrok=txtGrpObj.children[0].getStroke();
		}
		
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
		/*underline*/
		if(txtGrpObj.get('.underline_txt')[0]){
			
			$("#UnderlinetTool").addClass('active');
			//;if($.inArray('italicsTool',txtOptArr)=="-1")txtOpt+=',italicsTool';
			txtOpt.underline='underlineTool';
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
		$("#toolPalette").data('textSelectedOpt',txtOpt);
	};

	
	this.getSelectedTextOptions = function(txtGrpObj,fontStyle){
		try{
			//this.cleanSelectedOptionFromOldTxt();
			var txtCfg=this;//new textToolConfig();
			var rectObj;
			var textAlign;
			var textFontSize;
			var textFontStyle ='normal';
			
			var moduleData = window.CD.module.data;
			//var jsonData = moduleData.getDockJsonData()[moduleData.getDockIndex(txtGrpObj.parent.attrs.id)];
			txtOpt={align:'',bold:'',italic:'',underline:''};//var txtOptArr=txtOpt.split(',');
			/*txt*/
			var txtObj=this.getTextObjFromGroupObject(txtGrpObj);
			$.each(txtObj,function(i,val){
				if((val.attrs.id.match(/^txt_[0-9]+/)) && val.nodeType == 'Shape' && val.className == 'Text') {
					textAlign=val.getAlign();
					textFontSize=val.getFontSize();
					textFontStyle=val.getFontStyle();
				}
			});
			
			var textFormatFromJson = CanvasData.getTextStyleData(txtGrpObj.getId());
			
			if(textFormatFromJson.fontType){		//Check as for 1st time the fontType is coming undefined by SS
				textFontStyle = textFormatFromJson.fontType;	
			}
			textAlign = textFormatFromJson.textAlign;
			textFontSize = textFormatFromJson.fontSize;
			var underlineVal = textFormatFromJson.underlineVal;
			
			/*rect*/
			if(this.activeElementDefault==='rect'){
				var getRectBorder=this.getRectBorderColor(txtGrpObj);
				if(getRectBorder==="T"){
						var rectStrok=this.borderChgClr;
				}else{
						var rectStrok=this.borderDfltClr;
				}
			}else{
					var rectStrok=txtGrpObj.children[0].getStroke();
			} 
			
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
			/*underline*/
			if(underlineVal == 'T'){
				$('#UnderlinetTool').addClass('active');
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
			/*if(jsonData.textFormat.underline_value  == 'T'){
				$('#UnderlinetTool').addClass('active');
			}else{
				$('#UnderlinetTool').removeClass('active');
			}*/
			$("#toolPalette").data('textSelectedOpt',txtOpt);
		}
		catch(err){
			console.log("Error in canvasText :: getSelectedTextOptions "+err.message);
		}
	};
	
	/**
	 * function name: cleanSelectedOption()
	 * description:on clean all selected options 
	 * author:Piyali Saha
	 */
	this.cleanSelectedOptionFromOldTxt=function(calledFromGetSelected){
		console.log("@CanvasText.cleanSelectedOptionFromOldTxt");
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
	  if(!calledFromGetSelected){
		  var textId = window.CD.elements.active.element[0].attrs.id;
		  var activeElm = window.CD.elements.active.element[0];
			var textGrpLength = window.CD.elements.active.element[0].children.length;
			for (var i= 0; i<textGrpLength; i++){
				if(activeElm.children[i].getName() == ('topLeft_'+textId)){
					activeElm.children[i].hide();
				}
				if(activeElm.children[i].getName() == ('topRight_'+textId)){
					activeElm.children[i].hide();
				}
				if(activeElm.children[i].getName() == ('bottomRight_'+textId)){
					activeElm.children[i].hide();
				}
				if(activeElm.children[i].getName() == ('bottomLeft_'+textId)){
					activeElm.children[i].hide();
				}
			} 
	  }
  	  var textToolClicked=$('#toolPalette li#'+this.createTools[1]).data('clicked');
	  if(!textToolClicked || calledFromGetSelected){
		  $.each(this.createTools,function(index,toolId){
			  $('#toolPalette li#'+toolId).removeClass('active');
				
			});
	  	     	
	  }
	  
	    
	};
	
	/**
	 * function name: showSelectedTextDetails()
	 * description:on select show selected text
	 * width and height in canvas property.
	 * author:Piyali Saha
	 */
	
	this.showSelectedTextDetails=function(txtGrpObj){
		console.log("@CanvasText.showSelectedTextDetails");
		var rectObj,txtObj=this.getTextObjFromGroupObject(txtGrpObj);
		$.each(txtGrpObj.children, function(index,value) {
			
			if(value.className==="Rect")
			{
				rectObj=value;
				
			}
		});
		if(this.activeElementDefault=='rect'){
			rectObj.setStroke(this.highlightedBorder);
			rectObj.setDashArrayEnabled(true);
			rectObj.setDashArray(this.hightDashedBorderArr);
			  
			var textId = txtGrpObj.attrs.id;
			var textGrpLength = txtGrpObj.children.length;
			for (var i= 0; i<textGrpLength; i++){
				if(txtGrpObj.children[i].getName() == ('topLeft_'+textId)){
					txtGrpObj.children[i].show();
				}
				if(txtGrpObj.children[i].getName() == ('topRight_'+textId)){
					txtGrpObj.children[i].show();
				}
				if(txtGrpObj.children[i].getName() == ('bottomRight_'+textId)){
					txtGrpObj.children[i].show();
				}
				if(txtGrpObj.children[i].getName() == ('bottomLeft_'+textId)){
					txtGrpObj.children[i].show();
				}
			} 
			  
	    }else{
	    	txtObj.setFill(this.highlightFill);
	    }
		var maxWidth=rectObj.getWidth();
		
		/*gettig minimum height*/
		 //var minheight=this.getTextMinHeight(txtGrpObj);
		  var maxHeight=rectObj.getHeight();
		 // if(maxHeight<this.defaultBoxHeight)maxHeight=this.defaultBoxHeight;
	  	$(this.boxWidthID).val(maxWidth);
		$(this.boxHeightID).val(maxHeight);
		var parentLayer=txtGrpObj.getLayer();
		 if(parentLayer && parentLayer.attrs.id==="text_layer"){
	    	   parentLayer.draw();
	       }
	    	   this.drawLayer();
	       
		
		
	};
	
	
	/**
	 * function name: setTextHighlight()
	 * description:on setActiveElement method
	 * this method will call to highlight text 
	 * author:Piyali Saha
	 */
	this.setTextHighlight=function(newObject){
		console.log("@CanvasText.setTextHighlight");
		
		var  oldObj=window.CD.elements.active.element[0];
		var textTool= this;//new textToolConfig();
		if(typeof newObject==="object" && newObject.nodeType==="Group" && (newObject.attrs.id.match(/txt_[0-9]+/)))
		{
			openInspector('text');
			var childrenTxtObj=this.getTextObjFromGroupObject(newObject);
				    
			if(typeof oldObj==="object")
			{
				//this.removeTextHighlight(oldObj);
			}
			
			if(typeof newObject==="object" && newObject.nodeType==="Group")
			{
				    /*all changes on seleced text*/
					  this.showSelectedTextDetails(newObject);
					  this.getSelectedTextOptions(newObject);
			}
		}else if(typeof oldObj==="object" && oldObj.nodeType==="Group" && (oldObj.attrs.id.match(/txt_[0-9]+/)))
		{
			this.removeTextHighlight(oldObj);
		}
		
			
	};
	/**
	 * function name: removeTextHighlight()
	 * description:to remove highlight
	 * colour of 
	 * Highlight text 
	 * author:Piyali Saha
	 */
	this.removeTextHighlight=function(oldObject){
		var nodeType=oldObject.nodeType;
		if(typeof oldObject==="object" && oldObject.nodeType==="Group" && (oldObject.attrs.id.match(/txt_[0-9]_[0-9]+/)||oldObject.attrs.id.match(/txt_[0-9]_[0-9]+/)))
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
	};
	/**
	 * function name: setTextToolEvent()
	 * description:on click of each group
	 * it will call this method to check 
	 * texttool clicked or not and open 
	 * text box accordingly 
	 * author:Piyali Saha
	 * param:
	 *   evt-event
	 */
	this.setTextToolEvent = function(evt){
		console.log("@CanvasText.setTextToolEvent");
		if($('#toolPalette li#'+this.createTools[1]).hasClass('active')){
			 eventObj = {x:evt.pageX,y:evt.pageY};
			 eventObjForText = {x:evt.clientX,y:evt.clientY};
			 this.createTextBox(eventObjForText,eventObj);
			 evt.cancelBubble = true;
		}
	};
	/**
	 * function name: alignActiveText()
	 * description:align active text
	 * author:Piyali Saha
	 * 
	 */
	this.alignActiveText=function(elm,alignText){
		console.log("@CanvasText.alignActiveText");
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		activeAlign=textStyle.align;
		var activeObj=window.CD.elements.active.element[0];
		var activeGrpObj=activeObj;
		var undoMng = window.CD.undoManager;
		
		if(alignText)
			activeAlign = alignText;
		if(elm){
			activeGrpObj=elm;
		var frId = activeGrpObj.attrs.id.split('_')[2];
		if(activeGrpObj.children.length == 0 && frId!=0)
			activeGrpObj = this.cs.findGroup('frame_'+frId).get('#'+activeGrpObj.attrs.id)[0];	
		if(activeGrpObj.children.length == 0 && frId ==0)
			activeGrpObj = this.cs.getBgTextLayer().get('#'+activeGrpObj.attrs.id)[0];	
		}
		var frameJson = txtConfg.getFrameData(activeGrpObj);
		var initTextAlign = frameJson.textAlign;
		if(typeof activeObj==="object" && activeObj.nodeType==="Group")
		{
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			
			
			if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
			{
				
				activeObj=activeChildrenTxtObj;
				activeObj.setAlign(activeAlign);
				var parentLayer=activeGrpObj.getLayer();
				 if(parentLayer && parentLayer.attrs.id==="text_layer"){
				    	   parentLayer.draw();
				  }
					  txtConfg.drawLayer();
				  
			  
			    if($('#UnderlinetTool').hasClass('active')){
					 this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj);						  
				 }
			   
			    if(!(activeGrpObj.parent.attrs.id.match(/label_[0-9]+/)))
			    	this.setFramTextListData(activeGrpObj);
			    	
			   
				this.getSelectedTextOptions(activeGrpObj);
			    undoMng.register(this, this.alignActiveText,[activeGrpObj,initTextAlign] , 'Text Formatting',this, this.alignActiveText,[activeGrpObj,activeAlign] , 'Text Formatting');
			    updateUndoRedoState(undoMng);
			}
		}
		
	};

	/**
	 * function name: boldActiveText()
	 * description:bold active text
	 * author:Piyali Saha
	 * 
	 */
	this.boldActiveText1=function(){
		console.log("@CanvasText.boldActiveText");
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		var activeObj=window.CD.elements.active.element[0];
		var activeGrpObj=activeObj;
		var undoMng = window.CD.undoManager;
		var frameJson = txtConfg.getFrameData(activeGrpObj);
		var initTextStyle = frameJson.fontStyle;
		if(typeof activeObj==="object" && activeObj.nodeType==="Group")
		{
			
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			
			
			if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
			{
				
				this.getSelectedTextOptions(activeGrpObj);
				activeObj=activeChildrenTxtObj;
				var cuuFont=activeObj.getFontStyle();
				if(cuuFont=="bold")fontst="normal";
				else if(cuuFont=="italic")fontst="bold italic";
				else if(cuuFont=="normal italic")fontst="bold italic";
				else if(cuuFont=="bold italic")fontst="italic";
				else if(cuuFont=="bold normal")fontst="normal";
				else fontst="bold";
					
					
					activeObj.setFontStyle(fontst);
					var parentLayer=activeGrpObj.getLayer();
					 if(parentLayer && parentLayer.attrs.id==="text_layer"){
					    	   parentLayer.draw();
					  }
						  txtConfg.drawLayer();
					  
					
					 if($('#UnderlinetTool').hasClass('active')){
						 this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj);						  
					 }
				   
					if(!(activeGrpObj.parent.attrs.id.match(/label_[0-9]+/)))
						this.setFramTextListData(activeGrpObj);
					undoMng.register(this, this.setTextStylingCanvas,[activeGrpObj,initTextStyle] , 'Text Formatting',this, this.setTextStylingCanvas,[activeGrpObj,fontst] , 'Text Formatting');
					updateUndoRedoState(undoMng);
				
			}
		}
	};
	
	/**
	 * function name: boldActiveText()
	 * description:bold active text
	 
	 * 
	 */
	this.boldActiveText=function(){
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		var activeObj=window.CD.elements.active.element[0];
		var activeGrpObj=activeObj;
		var globalStyle='';
		var undoMng = window.CD.undoManager;
		
		if(typeof activeObj==="object" && activeObj.nodeType==="Group")
		{			
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);			
			$.each(activeChildrenTxtObj,function(i,val){
			if(typeof val==="object" && val.nodeType==="Shape" && val.className==="Text" && ((val.attrs.id.match(/txt_[0-9]+/)))&& (val.attrs.name != "underline_txt"))
				{
					txtConfg.textToolStatus=true;
					txtConfg.getSelectedTextOptions(activeGrpObj,'bold');					
					var cuuFont=val.getFontStyle();
					if(cuuFont=="bold")fontst="normal";
					else if(cuuFont=="italic")fontst="bold italic";
					else if(cuuFont=="normal italic")fontst="bold italic";
					else if(cuuFont=="bold italic")fontst="italic";
					else if(cuuFont=="bold normal")fontst="normal";
					else fontst="bold";
					val.setFontStyle('bold');
					globalStyle = fontst;
				}				
			});
		}
		if($('#UnderlinetTool').hasClass('active')){
			 txtConfg.applyTextUnderline(activeGrpObj);			  
		 }
		
		txtConfg.drawLayer();
	};
	this.setTextStylingCanvas=function(activeGrpObj,textStyles){
		var txtConfg= this;//new textToolConfig();
		if(activeGrpObj.children.length == 0)
			activeGrpObj = this.cs.getBgTextLayer().get('#'+activeGrpObj.attrs.id)[0];
		textStyle=txtConfg.getTextStyle();
		var activeObject=txtConfg.getTextObjFromGroupObject(activeGrpObj);
		activeObject.setFontStyle(textStyles);	
		if(!(activeGrpObj.parent.attrs.id.match(/label_[0-9]+/)))
			this.setFramTextListData(activeGrpObj);
		 var parentLayer=activeGrpObj.getLayer();
		   if(parentLayer && parentLayer.attrs.id==="text_layer"){
			    	   parentLayer.draw();
			  }
		this.drawLayer();
		this.ds.setOutputData();
		this.cleanSelectedOptionFromOldTxt();
		this.getSelectedTextOptions(activeGrpObj);
	};

	/**
	 * function name: italicActiveText()
	 * description:italic active text
	 * author:Piyali Saha
	 * 
	 */
	this.italicActiveText=function(){
		console.log("@CanvasText.italicActiveText");
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		var activeObj=window.CD.elements.active.element[0];
		var activeGrpObj=activeObj;
		var undoMng = window.CD.undoManager;
		var frameJson = txtConfg.getFrameData(activeGrpObj);
		var initTextStyle = frameJson.fontStyle;
		if(typeof activeObj==="object" && activeObj.nodeType==="Group"){
			
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
			{
				   
				   this.getSelectedTextOptions(activeGrpObj);
				   activeObj=activeChildrenTxtObj;
				   var cuuFont=activeObj.getFontStyle();
				   if(cuuFont=="italic")fontst="normal";
				   else if(cuuFont=="bold")fontst="bold italic";
				   else if(cuuFont=="bold italic")fontst="bold normal";
				   else if(cuuFont=="bold normal")fontst="bold italic";
				   else fontst="italic";
				   activeObj.setFontStyle(fontst);
				   var parentLayer=activeGrpObj.getLayer();
				   if(parentLayer && parentLayer.attrs.id==="text_layer"){
					    	   parentLayer.draw();
					  }
						  txtConfg.drawLayer();
					  
				  
				   if($('#UnderlinetTool').hasClass('active')){
						 this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj);						  
					 }
				   
				   if(!(activeGrpObj.parent.attrs.id.match(/label_[0-9]+/)))
					   this.setFramTextListData(activeGrpObj);
				   undoMng.register(this, this.setTextStyling,[activeGrpObj,initTextStyle] , 'Text Formatting',this, this.setTextStyling,[activeGrpObj,fontst] , 'Text Formatting');
				   updateUndoRedoState(undoMng);
						
					
			}
		}
		
	};
	this.underlineActiveText=function(){
		console.log("@CanvasText.underlineActiveText");
		 var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		var activeObj=window.CD.elements.active.element[0];
		var activeGrpObj=activeObj;
		
		if(typeof activeObj==="object" && activeObj.nodeType==="Group"){
			
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
			{
				
				
				this.getSelectedTextOptions(activeGrpObj);
				//var sle = SLEData.getSLEIndex(activeGrpObj.parent.attrs.id);	
				if($('#UnderlinetTool').hasClass('active')){
					this.removeUnderline(activeGrpObj,'remove Underline');							   
				}else{
					this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj,false,'apply underline');
				}
			}
		}
		
	};
	
	
	this.applyTextUnderline=function(activeChildrenTxtObj,activeGrpObj,rerender,applyUnderline){
		console.log("@CanvasText.applyTextUnderline");
		   rerender = rerender || false;
		   var txtConfg= this;//new textToolConfig();
		   var activeObj=activeChildrenTxtObj;	
		   var labelWidth = activeGrpObj.children[0].getWidth();
		   var rectHeight = activeGrpObj.children[0].getHeight();
		   var cuuFont=activeObj.getFontStyle();
		   var calcHeight = 0;
		 //  var sle = SLEData.getSLEIndex(activeGrpObj.parent.attrs.id);
		   var undoMng = window.CD.undoManager;
		   
		  
		  this.removeUnderline(activeGrpObj);
	
		  for(var i=0; i<activeObj.textArr.length ;i++){
			  var activeWidth = activeObj.textArr[i].width;
			  if(activeObj.getAlign() == "center"){
				  var startpos = (labelWidth - activeWidth)/2;				 
				  if(rerender == true)
					  startpos = startpos -5;
				
			  }else  if(activeObj.getAlign() == "left" || activeObj.getAlign() == "justify"){
				  var startpos = 10;
			  }else  if(activeObj.getAlign() == "right"){
				  var startpos = (labelWidth - activeWidth - 10);
				  
			  }
			  if(i==0){
				  calcHeight = ((rectHeight - (activeObj.getTextHeight() * activeObj.textArr.length))/2) + activeObj.getTextHeight();
			  }else{
				  calcHeight = calcHeight + activeObj.getTextHeight();
			  }
			  
			   var underLine = new Kinetic.Line({
			        points: [startpos, calcHeight, (startpos + activeWidth ),calcHeight],
			        stroke: 'black',
			        strokeWidth: 1,	
			        name: 'underline_txt'
			      });
			 
			   activeGrpObj.add(underLine);
			}
		  var parentLayer=activeGrpObj.getLayer();
		  if(parentLayer && parentLayer.attrs.id==="text_layer"){
		    	   parentLayer.draw();
		  }
			  txtConfg.drawLayer();
		 
		
		if(!(activeGrpObj.parent.attrs.id.match(/label_[0-9]+/)))
		this.setFramTextListData(activeGrpObj);
		if(applyUnderline){
			undoMng.register(this, this.removeUnderlineCall,[activeGrpObj] , 'Text Formatting',this, this.applyTextUnderlineCall,[activeChildrenTxtObj,activeGrpObj] , 'Text Formatting');
			updateUndoRedoState(undoMng);
		}
			
			
	};
	
	this.removeUnderline = function(activeGrpObj,removeUnderline){
		console.log("@CanvasText.removeUnderline");
		var txtConfg = this;
		 var undoMng = window.CD.undoManager;
		 var underlineObj = activeGrpObj.get('.underline_txt');
		   underlineObj.each(function() {
	         this.remove();
	        });
		   //var sle = SLEData.getSLEIndex(activeGrpObj.parent.attrs.id);
		   var parentLayer=activeGrpObj.getLayer();
		   if(parentLayer && parentLayer.attrs.id==="text_layer"){
			    	   parentLayer.draw();
			  }
				  txtConfg.drawLayer();
		if(removeUnderline){
			undoMng.register(this, this.applyTextUnderlineCall,[childTxtObj,activeGrpObj] , 'Text Formatting',this, this.removeUnderlineCall,[activeGrpObj] , 'Text Formatting');
			updateUndoRedoState(undoMng);
		}
				  
		   
		  // window.CD.module.data.Json.SLEData[sle].underline_value = "F";
		  // this.ds.setOutputData();
	};
	this.removeUnderlineCall=function(activeGrpObj){
		this.removeUnderline(activeGrpObj);
		$('#UnderlinetTool').removeClass('active');
	};
	this.applyTextUnderlineCall=function(childTxtObj,activeGrpObj){
		this.applyTextUnderline(childTxtObj,activeGrpObj);
		$('#UnderlinetTool').addClass('active');
	};
	/**
	 * function name: applyTextToolChange()
	 * description:on click on text tool apply
	 * author:Piyali Saha
	 * 
	 */
	this.applyTextToolChange=function(){
		console.log("@CanvasText.applyTextToolChange");
		$(this).data('clicked',true);
		var boxW=$(this.boxWidthID).val();
		var boxH=$(this.boxHeightID).val();
		//if(boxW.is)
		/*this below code comment as per requirment 
		 * text box editor need to open alway in 
		 * 300-70
		 */
		/*if($('#textToolTextBox').is(":visible"))
		{
			$('#textToolTextBox').css('width',boxW);
			$('#textToolTextBox').css('height',boxH)
		}*/
		var txtConfg= this;//new textToolConfig();
		var textStyle=txtConfg.getTextStyle();
		var activeGrpObj=window.CD.elements.active.element[0];
		if(typeof activeGrpObj==="object" && activeGrpObj.nodeType==="Group"){
			
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeGrpObj);
			if(typeof activeChildrenTxtObj==="object" /*&& activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text"*/)
			{
				
				var parm={editBox:false,
						  applyClick:true
						  };
				this.onchangeTxtobjChangeGrpObj(activeChildrenTxtObj,activeGrpObj,parm);
				 var parentLayer=activeGrpObj.getLayer();
				 if(parentLayer && parentLayer.attrs.id==="text_layer"){
				    	   parentLayer.draw();
				  }
					  txtConfg.drawLayer();	
				  
			   
				
				if($('#UnderlinetTool').hasClass('active')){
					 this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj,false);						  
				 }
			   
				this.getSelectedTextOptions(activeGrpObj);	
				var para={applyClick:true};
				this.setFramTextListData(activeGrpObj,para);
			}
		}
	};

	this.applyTextToolChangeForHeightWidth=function(){
		console.log("@canvasText.applyTextToolChangeForHeightWidth");
		$(this).data('clicked',true);
		var boxW=$(this.boxWidthID).val();
		var boxH=$(this.boxHeightID).val();
			
		//if(boxW.is)
		/*this below code comment as per requirment 
		 * text box editor need to open alway in 
		 * 300-70
		 */
		/*if($('#textToolTextBox').is(":visible"))
		{
			$('#textToolTextBox').css('width',boxW);
			$('#textToolTextBox').css('height',boxH)
		}*/
		var txtConfg= this;//new textToolConfig();
		var textStyle=txtConfg.getTextStyle();
		var activeElm = [];
		
		for(var i=0;i<window.CD.elements.active.element.length;i++){
			var activeGrpObj=window.CD.elements.active.element[i];
			if(typeof activeGrpObj==="object" && activeGrpObj.nodeType==="Group"){
				
				var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeGrpObj);
				activeElm.push(activeChildrenTxtObj);
				if(typeof activeChildrenTxtObj==="object"/* && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text"*/)
				{
					
					var parm={editBox:false,
							  applyClick:true
							  };
					
				}
			}
		}
		this.onchangeTxtobjChangeGrpObjFromApplyClick(activeElm,window.CD.elements.active.element,parm);		
	};
	this.saveRectFill=function(txtGrpObj,fillTrueFalse){
		console.log("@canvasText.saveRectBorderColor");
		var txtObj = this.getTextObjFromGroupObject(txtGrpObj);
		var txtObjId = txtGrpObj.attrs.id,
		    splittedid = txtObjId.split("_"),
		    framID = parseInt(splittedid[2]);
			framTextListId =this.getFrameTextListNum(txtObjId);//parseInt(splittedid[1]);
			
	   var frameTextObj=window.CD.module.data.Json.FrameData[framID].frameTextList[framTextListId];
	   //frameTextObj.fill=fillTrueFalse;
	   frameTextObj.fill=fillTrueFalse;
	   window.CD.module.data.Json.FrameData[framID].frameTextList[framTextListId].fill = fillTrueFalse;
	   this.ds.setOutputData();
	};
	this.onchangeTxtobjChangeGrpObjFromApplyClick = function(txtObj1,grpObj1,otherParam,undoObject,callFromResizable){
		console.log("@canvasText.onchangeTxtobjChangeGrpObjFromApplyClick");
		var undoMng = window.CD.undoManager;
		var newGrpObj = [];
		for(var i=0;i<grpObj1.length;i++){
			var allTextStyle = new AllTextStyling();
			var frId = grpObj1[i].attrs.id.split('_')[2];
			
			for(var k=0;k<window.CD.module.data.Json.FrameData[frId].frameTextList.length;k++){
				  if(window.CD.module.data.Json.FrameData[frId].frameTextList[k].textGroupObjID == grpObj1[i].getId())
					  var frameTextId = k;	  
			}
			
			var frTxtId = frameTextId;
			if(grpObj1[i].children.length == 0 && frId!=0)
				grpObj1[i] = this.cs.findGroup('frame_'+frId).get('#'+grpObj1[i].attrs.id)[0];	
			if(grpObj1[i].children.length == 0 && frId ==0){
				var text_layer = this.cs.getBgTextLayer();
				grpObj1[i] = text_layer.get('#'+grpObj1[i].attrs.id)[0];
			}
					
			var frameJson = this.getFrameData(grpObj1[i]);
			var oldObj={};
			oldObj.fill = frameJson.fill;
			oldObj.border = frameJson.border;
			oldObj.maxWidth = frameJson.maxWidth;
			oldObj.minHeight = frameJson.minHeight;
			
			var rectObj,txtStyle = this.getTextStyle();
			//get rect object
			$.each(grpObj1[i].children, function(index,value){
				if(value.className==="Rect")rectObj=value;
			});
			
			var rectStrok=rectObj.getStroke(),rectFill=rectObj.getFill();
			/*change border*/
			
			
			if(undoObject){
			if(undoObject.border==="T"){
				/*on apply click save rect fill*/
				if(otherParam.applyClick){
					this.saveRectBorderColor(grpObj1[i],'T');
				}else{
					rectObj.setStroke(this.borderChgClr);
				}
			}else{
				/*on apply click save rect border*/
				if(this.activeElementDefault==='rect' && otherParam.applyClick){
					this.saveRectBorderColor(grpObj1[i],"F");
				}else{
					rectObj.setStroke(this.borderDfltClr);
				}
			}
			}else{
				if(txtStyle.border==="T"){
					/*on apply click save rect fill*/
					if(this.activeElementDefault==='rect' && otherParam.applyClick){
						this.saveRectBorderColor(grpObj1[i],txtStyle.border);
					}else{
						rectObj.setStroke(this.borderChgClr);
					}
				}else{
					/*on apply click save rect border*/
					if(this.activeElementDefault==='rect' && otherParam.applyClick){
						this.saveRectBorderColor(grpObj1[i],"F");
					}else{
						rectObj.setStroke(this.borderDfltClr);
					}
				}
			}
			
			
		    /*change fill*/
			if(undoObject){
				if(undoObject.fill==="T"){
					 rectObj.setFill(this.fillChngClr);
					 this.saveRectFill(grpObj1[i],undoObject.fill);
				}else{
					rectObj.setFill(this.fillDflClr);
					this.saveRectFill(grpObj1[i],undoObject.fill);
				}
			}else{			
				if(txtStyle.fill==="T"){
					 rectObj.setFill(this.fillChngClr);
					 this.saveRectFill(grpObj1[i],txtStyle.fill);
				}else{
					rectObj.setFill(this.fillDflClr);
					this.saveRectFill(grpObj1[i],txtStyle.fill);
				}
			}
			grpObj1[i].getLayer().draw();		
			/*for editted text*/
			if(otherParam.editBox){
				rectObj.setStroke(rectStrok);
				rectObj.setFill(rectFill);
				var editedTextHeight=$(this.textToolBoxId).prop('scrollHeight');
			}
			var box=this.getBoxWidthHeight(),W=box.w,Ht=box.h;
			if(undoObject)
			{
				W = undoObject.maxWidth;
				Ht = undoObject.minHeight;
				$('#boxWidth').val(W);
				$('#boxHeight').val(Ht);
				window.CD.module.frame.canvasTextBoxH = Ht;
				window.CD.module.frame.canvasTextBoxW = W;
			}

			var textStyleObj = CanvasData.getTextStyleData(grpObj1[i].getId());
			var underlineVal = textStyleObj.underlineVal;
			var align = textStyleObj.textAlign;
			var framJsonObj = window.CD.module.data.Json.FrameData;
			var frmID = grpObj1[i].getId().split('_')[2];
			
			for(var k=0;k<window.CD.module.data.Json.FrameData[frmID].frameTextList.length;k++){
				  if(window.CD.module.data.Json.FrameData[frmID].frameTextList[k].textGroupObjID == grpObj1[i].getId())
					  var frameTextId = k;	  
			}
			
			var frmObj = this.cs.findGroup('frame_'+frmID);
			
			var textX = framJsonObj[frmID].frameTextList[frameTextId].textX;
			var textY = framJsonObj[frmID].frameTextList[frameTextId].textY;
			
			var adjustmentX = 0;
			var adjustmentY = 0;
			
			var frameX = framJsonObj[frmID].frameX;
			var frameY = framJsonObj[frmID].frameY;
			
			if(frmID == 0){
				adjustmentX = 15;
				adjustmentY = 15;
			}else{
				adjustmentX = 0;
				adjustmentY = 0;
			}
			
			var event = {};
			event.x = textX - adjustmentX;
			event.y = textY - adjustmentY;
			
			var actvTextId = grpObj1[i].getId();
			var textValue = CanvasData.getCanvasTextValue(actvTextId);
			
			var defaultParams = CanvasData.getDefaultParamsFromJson(actvTextId);
			
			this.textFormat.deleteActiveText(grpObj1[i]);
			
			this.realTextValue = textValue;//this.checkAndUpdateCharFromPalete(textValue);
			
			var frmTextId = grpObj1[i].getId().split('_')[1];
			
			CanvasData.updateCanvasTextData(defaultParams,frmTextId,frmID);
			$('#boxWidth').val(parseInt(W));
			$('#boxHeight').val(parseInt(Ht));
			if(callFromResizable){
				txtGrpObj = this.textFormat.createFrameText(frmTextId, frmObj, event, textValue, align,'','','callFromResizable');
			}else{
				txtGrpObj = this.textFormat.createFrameText(frmTextId, frmObj, event, textValue, align);
			}
			makeFrameTextResizable(txtGrpObj,txtGrpObj.children[0].getWidth(),txtGrpObj.children[0].getHeight());
			this.textEventBind(txtGrpObj);
			
			//newGrpObj.push(txtGrpObj);
			var oldObj = txtGrpObj;
			var actvObjForRedo = jQuery.extend(true, {}, oldObj);
			var childrenObj = jQuery.extend(true, {}, oldObj.children);
			actvObjForRedo.children = childrenObj;
			newGrpObj.push(actvObjForRedo);
			
			var activeChildren = this.getTextObjFromGroupObject(txtGrpObj);
			var globalUnderline = 'global';
			if(underlineVal == 'T'){
				$.each(activeChildren,function(cnt,val){
					val.setName('underlined_text');
				});
				
			}else{
				$.each(activeChildren,function(cnt,val){
					var underlineStatus = CanvasData.getUnderlineStatus(val.getId());
					if(underlineStatus == 'F')
						val.setName('normal_text');
				});	
				globalUnderline = undefined;
			}
			if(underlineVal == 'T'){
				$('#UnderlinetTool').addClass('active');
			}
			allTextStyle.applyEachTextUnderline(txtGrpObj,globalUnderline);

			var parentLayer = txtGrpObj.getLayer();
			if(parentLayer && parentLayer.attrs.id==="text_layer"){
			  	   parentLayer.draw();
			}
			this.drawLayer();
			 
			var defaultParams = CanvasData.getDefaultParamsFromJson(txtGrpObj.getId());
			var params = {};
			//params.border = txtStyle.border;
			defaultParams = $.extend(defaultParams,params);
			CanvasData.updateCanvasTextData(defaultParams,frmTextId,frId);
			
			this.getSelectedTextOptions(txtGrpObj);
			
			var frameJson = this.getFrameData(txtGrpObj);
			var newObj={};
			newObj.fill = frameJson.fill;
			newObj.border = frameJson.border;
			newObj.maxWidth = frameJson.maxWidth;
			newObj.minHeight = frameJson.minHeight;
			window.CD.module.frame.canvasTextBoxH = frameJson.minHeight;
			window.CD.module.frame.canvasTextBoxW = frameJson.maxWidth;
		}
		if(!callFromResizable && !undoObject){
			undoMng.register(this,this.onchangeTxtobjChangeGrpObjFromApplyClick,[txtObj1,newGrpObj,otherParam,oldObj], 'undo Text Change',this,this.onchangeTxtobjChangeGrpObjFromApplyClick,[txtObj1,newGrpObj,otherParam,newObj], 'redo Text Change');
			updateUndoRedoState(undoMng);
		}
	};
	/**
	 * function name: setActiveTextFontSize()
	 * description:on click font tool change font size
	 * text
	 * author:Piyali Saha
	 * 
	 */
	this.setActiveTextFontSize=function(){
		console.log("@CanvasText.setActiveTextFontSize");
		var font=$("#fontTool .font_size #fontTextbox").val();
		//if(!font) font = window.CD.module.data.Json.adminData.GFS;
		var rectObj;
		
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		var activeObj=window.CD.elements.active.element[0];
		var activeGrpObj=activeObj;
		var undoMng = window.CD.undoManager;
		
		if(elm){
		activeGrpObj =elm;
		var frId = elm.attrs.id.split('_')[2];
		if(elm.children.length == 0 && frId!=0)
			activeGrpObj = this.cs.findGroup('frame_'+frId).get('#'+elm.attrs.id)[0];	
		if(elm.children.length == 0 && frId ==0)
			activeGrpObj = this.cs.getBgTextLayer().get('#'+elm.attrs.id)[0];	
		}
		
		var frameJson = txtConfg.getFrameData(activeGrpObj);
		var initFontSize = frameJson.fontSize;
		if(typeof activeObj==="object" && activeObj.nodeType==="Group"){
			
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
			{
				$.each(activeGrpObj.children, function(index,value) {
					
					if(value.className==="Rect")
					{
						rectObj=value;
						
					}
				});
				
				   activeObj=activeChildrenTxtObj;
				   activeObj.setHeight('auto');
				   activeObj.setFontSize(font);
				   var minHeight=this.getTextMinHeight(activeGrpObj);
				   if(parseInt(minHeight)> activeObj.getHeight()){
					   rectObj.setHeight(parseInt(minHeight));
				   }else{
					   var textHeight = parseInt(parseInt(activeObj.getTextHeight())*parseInt(activeObj.textArr.length) + 6);
					   rectObj.setHeight(textHeight);
				   }
				   var parentLayer=activeGrpObj.getLayer();
				   if(parentLayer && parentLayer.attrs.id==="text_layer"){
					    	   parentLayer.draw();
					  }
						  txtConfg.drawLayer();
					  
				   
				   
				   w=rectObj.getWidth();
				   h=rectObj.getHeight();
				   this.getSelectedTextOptions(activeGrpObj);				   
				   if(!(activeGrpObj.parent.attrs.id.match(/label_[0-9]+/)))
					   this.setFramTextListData(activeGrpObj);
					   if($('#UnderlinetTool').hasClass('active')){
							 this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj);						  
						 }
					   	
				   if(initfont == undefined){
						undoMng.register(this, this.setActiveTextFontSize,[activeGrpObj,initFontSize] , 'Text Formatting',this, this.setActiveTextFontSize,[activeGrpObj,font] , 'Text Formatting');
						updateUndoRedoState(undoMng);
				   }
						
			}
		}
	};
	/**
	 * function name: deleteActiveText()
	 * description:on click delete tool delete active
	 * text
	 * author:Piyali Saha
	 * 
	 */
	this.deleteActiveText=function(textObj,redo){
		console.log("@CanvasText.deleteActiveText");
		var txtConfg= this;//new textToolConfig();
		var undoMng = window.CD.undoManager;
		var active = window.CD.elements.active;
		var eventsArr = [];
		var initValsArr = []; 
		var frameJsonsArr = [];
		var txtGrpObjIdsArr = [];
		var frameId = active.element[0].attrs.id.split('_')[2];
		var framDataObj=window.CD.module.data.Json.FrameData[frameId];
		var activeElmArr = [];
		var a=[];
		if(!redo){
			for(var j=0;j<active.element.length;j++){
				activeElmArr.push(active.element[j]);
			}
			for(var j=0;j<active.element.length;j++){
				var oldObj = active.element[j];
				var actvObjForRedo = jQuery.extend(true, {}, oldObj);
				var childrenObj = jQuery.extend(true, {}, oldObj.children);
				actvObjForRedo.children = childrenObj;
				a.push(actvObjForRedo);
			}
		}else{
			for(var k=0;k<textObj.length;k++){
				activeElmArr.push(textObj[k]);
			}
		}
		for(var i=0;i<activeElmArr.length;i++){
			var activeElm = activeElmArr[i];
			var activeElmParent=activeElm.parent;
			var txtGrpObjId = activeElm.attrs.id;
			var splittedid = txtGrpObjId.split("_");
			var frameTextId=parseInt(this.getFrameTextListNum(txtGrpObjId));
			var frameID=parseInt(splittedid[2]);
			var parentLayer=activeElm.getLayer();
			var frameJson = txtConfg.getFrameData(activeElm);
			var initVal = frameJson.textValue;
			var event ={};
			event.x = parseInt(frameJson.textX);
			event.y = parseInt(frameJson.textY);
			if(!redo){
				eventsArr.push(event);
				initValsArr.push(initVal);
				frameJsonsArr.push(frameJson);
				txtGrpObjIdsArr.push(txtGrpObjId);
			}
			
			txtConfg.cs.setActiveElement(txtConfg.cs.getGroup('frame_0'),'frame');
			//txtConfg.cs.deleteSubGroups(activeElm);
			if(redo){
				if(parentLayer.get('#'+activeElm.attrs.id)[0]){
					parentLayer.get('#'+activeElm.attrs.id)[0].destroy();
				}
				 
			}else{
				activeElm.destroy();
			}
			if(parentLayer && parentLayer.attrs.id==="text_layer"){
			  	   parentLayer.draw();
			}
			
			txtConfg.drawLayer();
			delete framDataObj.frameTextList[frameTextId];
		}
		txtConfg.changeToDefaultBoxVal();
		txtConfg.ds.setOutputData();
		txtConfg.arrayClean(framDataObj.frameTextList,undefined);
		txtConfg.ds.setOutputData();
		if(!redo){
			undoMng.register(this,this.setUndoCall,[frameId,eventsArr,initValsArr,frameJsonsArr,framDataObj,txtGrpObjIdsArr], 'Undo Text Delete',this,this.deleteActiveText,[a,'redo'], 'Redo Text Delete');
			updateUndoRedoState(undoMng);
		}
		
	};
	this.setUndoCall = function(frameId,event,initVal,frameJson,val,txtGrpObjId){
		var cs = window.CD.services.cs;
		//cs.setActiveElement(cs.getGroup('frame_'+frameId),'frame');	
		if(frameJson.length){
			for(var i=0;i<frameJson.length;i++){
				this.createTextForUndoRedo(frameJson[i], frameId, txtGrpObjId[i],val,i);
			}
		}
		else{
			this.createTextForUndoRedo(frameJson, frameId, txtGrpObjId,val);
		}
		
	};
	
	/**
	 * function name: arrayClean()--clean a element in array
	 * author:Piyali Saha
	 */
	this.createTextForUndoRedo = function(framTextListData,frameId,txtId,val,textLength) {
		var frameTxtTool=  new TextTool.frameText();
		var canvasTextTool = this;		
		var cnv = window.CD.services.cs;
		var textBgLayer = cnv.getBgTextLayer();
		var c = frameId;
		var ft = this.getFrameTextListNum(txtId);
		var frameGroup = cnv.getGroup('frame_'+c);
		var finalTextValue = (new String(framTextListData.textValue)).replace(/&(amp;)/g, "&");
		finalTextValue=finalTextValue.replace(/&#(\d+);/g, function(match, number){ return String.fromCharCode(number); });
		
		if(framTextListData){
			
			var textToolCfg = this;
			var underlineVal = framTextListData.underlineVal;
			var align = framTextListData.textAlign;
			var framJsonObj = window.CD.module.data.Json.FrameData;
			var frmID = txtId.split('_')[2];
			var frameTextId = txtId.split('_')[1];
			var jsonTxtId = window.CD.module.data.Json.FrameData[frmID].frameTextList.length
			var frmObj = this.cs.findGroup('frame_'+frmID);
			
			var textX = framTextListData.textX;
			var textY = framTextListData.textY;
			
			var adjustmentX = 0;
			var adjustmentY = 0;
			
			var frameX = framJsonObj[frmID].frameX;
			var frameY = framJsonObj[frmID].frameY;
			
			if(frmID == 0){
				adjustmentX = 15;
				adjustmentY = 15
			}else{
				adjustmentX = 0;
				adjustmentY = 0;
			}
			
			var event = {};
			event.x = textX - adjustmentX;
			event.y = textY - adjustmentY;
			
			var actvTextId = txtId;
			var textValue = framTextListData.textValue;
						
			this.realTextValue = textValue;//this.checkAndUpdateCharFromPalete(textValue);
			
			//CanvasData.updateCanvasTextData(framTextListData,jsonTxtId,frmID);
			window.CD.module.data.Json.FrameData[frmID].frameTextList.push(framTextListData);
			
			var box = textToolCfg.getBoxWidthHeight();
			var W = box.w;
			var H = box.h;
			
			$('#boxWidth').val(parseInt(W));
			$('#boxHeight').val(parseInt(H));
			txtGrpObj = this.textFormat.createFrameText(frameTextId, frmObj, event, textValue, align,'','UpadateJsonCheck');
			makeFrameTextResizable(txtGrpObj,txtGrpObj.children[0].getWidth(),txtGrpObj.children[0].getHeight());
			this.textEventBind(txtGrpObj);
			/*
			if(c==0){
				canvasTextTool.textEventBind(txtGrpObj);
			}else{
				frameTxtTool.textEventBind(txtGrpObj);
			}*/
			canvasTextTool.ds.setOutputData();
		}
				
	};
	/**
	 * function name: arrayClean()--clean a element in array
	 * author:Piyali Saha
	 */
	this.arrayClean = function(arr,deleteValue) {
		if(arr && arr.length>0){
		  for (var i = 0; i < arr.length; i++) {
		    if (arr[i] == deleteValue) {         
		    	arr.splice(i, 1);
		      i--;
		    }
		  }
		}
		  return arr;
		};
		/**
		 * function name: reindexTextArray()--reindex text array and text objects
		 * author:Piyali Saha
		 */
	this.reindexTextArray=function(arr,activeElmParent){
		if(arr && arr.length>0){
			 var cs = window.CD.services.cs;
			 var txtConfg=this;
			 for (var i = 0; i < arr.length; i++) {
				 var textId=arr[i].textGroupObjID;
				 var textIndex=parseInt(this.getFrameTextListNum(textId));
				 var frameIndex=textId.split('_')[2];
				 if(i!=textIndex){
				    var textGrp=activeElmParent.get("#"+textId)[0];
				    if(textGrp){
					   arr[i].textGroupObjID='txt_'+i+'_'+frameIndex;
				  	   textGrp.setId(arr[i].textGroupObjID);
					   var parentLayer=textGrp.getLayer();
					   if(parentLayer && parentLayer.attrs.id==="text_layer"){
					    parentLayer.draw();
					   }
					   txtConfg.drawLayer();
					   txtConfg.ds.setOutputData();
				      }
				 }
		      }
		}
	};
	/**
	 * function name: checkSubOrSuperTagExist()
	 * author:Piyali Saha
	 */
	this.checkSubOrSuperTagExist=function(value){
		console.log("@CanvasText.checkSubOrSuperTagExist");
		if(value.match(/<sb>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sb>/g) || value.match(/<sp>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sp>/g)){
			return true;
		}
	};
	
	/**
	 * function name: checkSubTagExist()
	 * author:Piyali Saha
	 */
	this.checkSubTagExist=function(value){
		console.log("@CanvasText.checkSubTagExist");
		if(value.match(/<sb>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sb>/g)){
			return true;
		}
	};
	/**
	 * function name: checkSupTagExist()
	 * author:Piyali Saha
	 */
	this.checkSupTagExist=function(value){
	 if(value.match(/<sp>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sp>/g)){
			return true;
		}
	};
	/**
	 * function name: convertSbSpscript()
	 * author:Piyali Saha
	 */
	this.convertSbSpscript=function(value){
		console.log("@CanvasText.convertSbSpscript");
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
	 * author:Piyali Saha
	 */
	this.getEachSubscriptChar=function(char0){
		console.log("@CanvasText.getEachSubscriptChar");
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
	 * author:Piyali Saha
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
	 * function name: showErrorModal()
	 * author:Piyali Saha
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
	 * author:Piyali Saha
	 */
	this.closErrormodal=function(message){
		$('#errorModal').slideUp(200);
		$('#toolPalette #errorModal').remove();
	};
	
	 /**
     * @param : whole text group and last child count
     * @description : For a canvas/frame text with partial format (with underline), the text children count 
     * also includes underline object count. This method is used for getting actual label text 
     * children count
     */
    this.findLastTextchild = function(textGroup,count){
   	 console.log("@findLastTextchild :: canvasText");
   	 try{
   		 var childTextObj = textGroup.children[count];
   		 if(childTextObj.className == "Line"){
   			 count--;
   			 return this.findLastTextchild(textGroup,count);
   		 }else{
   			 return count;
   		 }    		 
   	 }catch(error){
   		 console.info("Error @findLastTextchild :: canvasText: "+error.message);
   	 }
    };
    this.setClsTextListData = function(textGroup){
      	 console.log("@setClsTextListData :: canvasText");
      	 var textId = textGroup.attrs.id;
      	 var frmJson = window.CD.module.data.Json.FrameData[0];
      	 var txtJsonId = this.getFrameTextListNum(textId);
      	window.CD.module.data.Json.FrameData[0].frameTextList[txtJsonId].textX = textGroup.attrs.x+15;
      	window.CD.module.data.Json.FrameData[0].frameTextList[txtJsonId].textY = textGroup.attrs.y+15;
    };
    this.setActiveTextPosition = function(textGrp){
		console.log('@setActiveTextPosition :: canvastext');
		var activeElm = window.CD.elements.active.element;
		var activeElmArray = [];
		var activeElmNewX = [];
		var activeElmNewY = [];
		var activeElmOldX = [];
		var activeElmOldY = [];
		var groupIdArr = [];
		var activeElmLength = window.CD.elements.active.element.length;
		var activeDockArray = [];
		//activeElmArray.push(textGrp);
		for(var j=0;j<activeElmLength;j++){
			activeElmArray.push(window.CD.elements.active.element[j]);
			groupIdArr.push(window.CD.elements.active.element[j].attrs.id)
		}
		this.textSetActive(textGrp);	
		var undoMng = window.CD.undoManager;
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var frameId = textGrp.attrs.id.split('_')[2];
		var txtGrpJsonId = cs.getFrameTextIndex(frameId,textGrp.attrs.id);
		var updatedXY = {};
		updatedXY.x = textGrp.getX() + 15;
		updatedXY.y = textGrp.getY() + 15;
		var oldX1 = window.CD.module.data.Json.FrameData[frameId].frameTextList[txtGrpJsonId].textX;
		var oldY1 = window.CD.module.data.Json.FrameData[frameId].frameTextList[txtGrpJsonId].textY;
		CanvasData.setTextPosition(textGrp.attrs.id,updatedXY);
		var newX1 = textGrp.getX();
		var newY1 = textGrp.getY();
		
		var changedX = textGrp.getX() - oldX1;
		var changedY = textGrp.getY() - oldY1;
		if(window.CD.elements.active.type == 'text'||window.CD.elements.active.type == 'canvastext'){
			for(var i=0;i<window.CD.elements.active.element.length;i++){
				var frmId = window.CD.elements.active.element[i].attrs.id.split('_')[2];
				var txt = cs.getFrameTextIndex(frmId,window.CD.elements.active.element[i].attrs.id);
				if(txtGrpJsonId != txt){
					var newX = window.CD.elements.active.element[i].getX() + changedX;
					var newY = window.CD.elements.active.element[i].getY() + changedY;
					if(newY>(parseInt(window.CD.module.data.Json.FrameData[0].frameHeight))-window.CD.elements.active.element[i].children[0].attrs.height){
						newY = (parseInt(window.CD.module.data.Json.FrameData[0].frameHeight)-window.CD.elements.active.element[i].children[0].attrs.height);
					}
					if(newX>(parseInt(window.CD.module.data.Json.FrameData[0].frameWidth))-window.CD.elements.active.element[i].children[0].attrs.width){
						newX = (parseInt(window.CD.module.data.Json.FrameData[0].frameWidth)-window.CD.elements.active.element[i].children[0].attrs.width);
					}
					if(newY<0){
						newY = 0;
					}
					if(newX<0){
						newX = 0;
					}
					window.CD.elements.active.element[i].setX(newX+15);
					window.CD.elements.active.element[i].setY(newY+15);
					
					var oldX = window.CD.module.data.Json.FrameData[frmId].frameTextList[txt].textX;
					var oldY = window.CD.module.data.Json.FrameData[frmId].frameTextList[txt].textY;
					window.CD.module.data.Json.FrameData[frmId].frameTextList[txt].textX = newX+30;
					window.CD.module.data.Json.FrameData[frmId].frameTextList[txt].textY = newY+30;	
					
					
					activeElmNewX.push(newX+30);
					activeElmNewY.push(newY+30);
					activeElmOldX.push(oldX);
					activeElmOldY.push(oldY);
					ds.setOutputData();
				}
				
			}
			activeElmNewX.push(newX1+15);
			activeElmNewY.push(newY1+15);
			activeElmOldX.push(oldX1);
			activeElmOldY.push(oldY1);
		}
		
		textGrp.parent.getLayer().draw();
		cdLayer.draw();
		undoMng.register(this,this.setTextPos,[activeElmArray,activeElmOldX,activeElmOldY] , 'Undo Label position',this, this.setTextPos,[activeElmArray,activeElmNewX,activeElmNewY] , 'Redo Label position');
		updateUndoRedoState(undoMng);
	};
};