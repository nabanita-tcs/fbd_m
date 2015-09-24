/*tool text code*/
var TextTool=TextTool || {};
/**
 * class name: textToolConfig()
 * description:All config initialization done here
 * author:Piyali Saha
 */
TextTool.labelText = function (){
	this.textToolStatus=false;
	this.cs = window.CD.services.cs;
	this.ds = window.CD.services.ds;
	this.Util=window.CD.util;
	this.createTools=window.CD.tools.create;
	this.formatTools = window.CD.tools.format;
	this.boxWidthID="#boxWidth";
	this.boxHeightID="#boxHeight";
	this.textSbSpScript=new TextSuperSubScript();
	this.SupErrorMesg="Please enter valid subscript/superscript cahrecter from palete";
	this.SubErrorMesg="Please enter valid subscript/superscript cahrecter from palete";
	this.textToolBoxId="#textToolTextBox";
	this.textMaxChar=256;
	this.maxCharWarning=(this.textMaxChar)-5;
	
	
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
		if($("#leftAlignTool").data('clicked')) this.style.align="left";
		else if($("#middleAlignTool").data('clicked')) this.style.align="center";
		else if($("#rightAlignTool").data('clicked')) this.style.align="right";
		else if($("#justifyAlignTool").data('clicked')) this.style.align="justify";
		else if(txtObj) this.style.align=txtObj.attrs.align;
		else this.style.align="center";
		/* align end*/
			
		/* for font type bold & italic */	
			if($("#boldTool").data('clicked'))this.style.fontType="bold";
			else if($("#italicsTool").data('clicked'))this.style.fontType="italic";
			else this.style.fontType="normal";
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
		this.clearAlignClicked();
		
		var maskTop = $('#toolPalette').position().top;
		var maskLeft = $('#toolPalette').position().left;
		var maskWidth = $('#toolPalette').width();
		var maskHeight = $('#toolPalette').height();
		var maskToolBar = $('<div id="maskTool" style="position:absolute;opacity:0.05;z-index:99;"></div>');
		maskToolBar.css({ top: maskTop+'px', left: maskLeft+'px', width:maskWidth+'px', height:maskHeight+'px'});
		
		
		var textAreaContainer=$('<div id="'+options.containerId+'" '+options.ContainerExtAttr+' style="'+options.ContainerStyle+'"><div>'),
		textArea=$('<textarea id="'+options.textId+'" '+options.ContainerExtAttr+' style="'+options.textStyle+'">'+options.textVal+'</textarea>'),
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
	    var labelTextToolChar=this;
	    footerContainer.append(footerGuide);
	    footerContainer.append(footerContent);
	    textAreaContainer.append(textArea);
	    textAreaContainer.append(footerContainer);
	    $('body').append(textAreaContainer);
	    $('body').append(maskToolBar);
	    $("#"+options.textId).focus();

	    /*$("#"+options.textId).charCounter({
	    	    	maxChars: labelTextToolChar.textMaxChar,
	    	    	maxCharsWarning : labelTextToolChar.maxCharWarning
	    	    });*/
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
		console.log("@labelText.fetchEditedText");
		var sle = window.CD.module.data.getLabelIndex(labelObj);
		var textVal= window.CD.module.data.Json.SLEData[sle].label_value
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
	this.checkOldText(true);
		var txtConfg=this,
		   layerObj=txtConfg.layeObj;
		  
		var x = parseInt(event.x),
		    y = parseInt(event.y),
		    box=txtConfg.getBoxWidthHeight(),
			W=box.w,
			H=box.h;
		 var textGrpObjectId = event.selectorObj.attrs.id.split('_')[1];
		 var txtObj = event.selectorObj.get('#txt_'+textGrpObjectId);
		 var textVal ="";
		 
		 if(txtObj[0]){
			 textVal =txtObj[0].getText();//this.fetchEditedText('label_'+textGrpObjectId);
		 }
			 
		      
		 var options={
		  			containerId:'textToolContainer',
		  			ContainerExtAttr:'editedid="'+event.selectorObj.attrs.id+'"',
		  			ContainerStyle: 'position:absolute;left:'+x+'px;top:'+y+'px;',
		  			textId :  'textToolTextBox',
		  			textStyle: 'left:'+x+'px;top:'+y+'px;height:70px;width:283px;',
		  			footerContId:'textToolFooter',
		  			footerContClass: 'palette_div',
		  			footerConStyle : 'width:278px',//'width:'+(parseInt(W)-18)+'px;',
		  			textVal :textVal
	       };
		      
		      this.createHtmlElement(options);
		      
		      var el = $(this.textToolBoxId).get(0);
		      var elemLen = el.value.length;
		      el.selectionStart = elemLen;
		      el.selectionEnd = elemLen;
		      el.focus();
		      if(event.selectorObj){
		    	  event.selectorObj.hide();
		    	  this.drawLayer();
		    	  this.processSaveOrCancelLabel(this.textToolBoxId,'label_'+textGrpObjectId,false,"",event);

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
			var frameTextTool=this;
			console.log("@CanvasText.prepareDropdownListAndAction");	
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
						if($(this).parent().children('div.palette_options').css('display') == 'none'){
							var calTop =0;
							$(this).parent().children('div.palette_options').css('display','inline');
							var calY = parseInt($(this).parents('#textToolContainer').position().top);
							if((calY + 250) > parseInt($('canvas').first().height())){
								//calTop = calY - parseInt($(this).parent().children('div.palette_options').height());
								calTop = calY - parseInt($(this).parent().children('div.palette_options').height()) - window.scrollY; 
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
							$(frameTextTool.textToolBoxId).trigger("showPalette");
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
			console.log("@CanvasText.prepareDropdownListAndAction");	
			  var dropdownlist=$('<span class="palette_option" style="width:100%;">Insert special characters</span>'+
					  			 '<span class="palette_option" style="width:100%;">symbols</span>'+
					  			 '<span class="palette_option" style="width:100%;">math</span>'+
					  			 '<span class="palette_option" style="width:100%;">subscript</span>'+
					  			 '<span class="palette_option" style="width:100%;">superscript</span>'+
					  			 '<span class="palette_option" style="width:100%;">greek</span>'+
			  					 '<span class="palette_option" style="width:100%;">world languages</span>');
			  $("#"+appendConId+" .palette_options").html("").append(dropdownlist);
			 
			 $('div.select_box').each(function(){
				  
				 	$('.palette_div').children().find('.select_box').children('span.selected').html($(window.CD.module.data.customLanguageFlage).html());
					$(this).attr('value',$(window.CD.module.data.customLanguageFlage).attr('value'));
					$(this).children('span,span.select_box').click(function(){
						if($(this).parent().children('div.palette_options').css('display') == 'none'){
							var calTop =0;
							$(this).parent().children('div.palette_options').css('display','inline');
							var calY = parseInt($(this).parents('#textToolContainer').position().top);
							if((calY + 250) > parseInt($('canvas').first().height())){
								//calTop = calY - parseInt($(this).parent().children('div.palette_options').height());
								calTop = calY - parseInt($(this).parent().children('div.palette_options').height()) - window.scrollY; 
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
								$(frameTextTool.textToolBoxId).trigger("showPalette");
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
					$(frameTextTool.textToolBoxId).trigger("showPalette");
					if(lan==="Superscript" || lan==="Subscript"){
						$("#palette_set .palette_key").css('font-size','17px');
					}
				}
				
				$(frameTextTool.textToolBoxId).focus(); 
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
	this.processSaveOrCancelLabel=function(paleteboxSelector,labelObj,editBox,txtGrpObj,event){
		var txtTool=this;
		var txtObj=this.getTextObjFromGroupObject(txtGrpObj);
		
		this.prepareDropdownListAndAction("textToolFooter",paleteboxSelector);
		
		 /*close text tool box*/
			$('#textToolFooter .cancel_palette').on('click',function(){
				txtTool.closeTextToolBox('#textToolContainer',editBox,txtGrpObj,event);
				
			});
			/*save text tool*/
			$('#textToolFooter .save_palette').on('click',function(){ 
				var textBoxValue=$(txtTool.textToolBoxId).val();
				if(textBoxValue!=="" && textBoxValue!==null && $.trim(textBoxValue).length > 0){
			       var label_text_value=$(txtTool.textToolBoxId).val().replace(/<\/sb><sb>/g,'').replace(/<\/sp><sp>/g,'');
			       var ds = window.CD.services.ds;
			       var node = window.CD.module.data.getLabelIndex(event.selectorObj.parent.attrs.id);
			       if(window.CD.module.data.Json.SLEData){
			    	   window.CD.module.data.getJsonData()[node].label_value = txtTool.checkAndUpdateCharFromPalete(label_text_value);
			       }else{
			    	   window.CD.module.data.getJsonData()[node].term = txtTool.checkAndUpdateCharFromPalete(label_text_value);
			       }
			       ds.setOutputData();
			       txtTool.saveTextToolBoxLabel("#textToolContainer",event);
			       
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

	this.saveTextToolBoxLabel=function(selector,event){
		  var cdLayer = window.CD.services.cs.getLayer();
		  var cs = window.CD.services.cs;
		  var textConfg=this,
		  textStyle=textConfg.getTextStyle(),	  
		  fontsize=window.CD.module.data.Json.adminData.GFS,
		  maxwidth=200,
		  buffer= 20,
		  flag = false,
		  txtGrpObj= event.selectorObj,
		  labelCount = cs.objLength(window.CD.module.data.Json.SLEData);
		  txtGrpId = txtGrpObj.attrs.id.split('_')[1];		 
		  var ds = window.CD.services.ds; 	  
		  var textAlign=textStyle.align;
		  textFontType=textStyle.fontType;
		  
		  /*checking sb and sp tag in a text*/
			var textValue=$(this.textToolBoxId).val().replace(/<\/sb><sb>/g,'').replace(/<\/sp><sp>/g,'');
			if(this.checkSubOrSuperTagExist(textValue)){
				textValue=this.convertSbSpscript(textValue);	
			}
			if(textValue===false){
				return false;
			}
		  
		  
		 if(txtGrpObj.get('#txt_'+txtGrpId)[0]){
			 
			this.labelOptionsHandle(txtGrpObj,labelCount);
			txtGrpObj.get('#txt_'+txtGrpId)[0].setText(textValue);
			 txtGrpObj.get('#txtBox_'+txtGrpId)[0].setFill("transparent");
			 if($(this.textToolBoxId).val()== ""){
				 txtGrpObj.get('#addTxt_'+txtGrpId)[0].show(); 
				 txtGrpObj.get('#txtBox_'+txtGrpId)[0].setFill('#ffffff'); 
			 }
			 
		 }else{
			 var textAdd = new Kinetic.Text({	       
			        text: textValue,//$("#textToolTextBox").val(),
			        align:textAlign,
			        fontSize: fontsize,
			        fontFamily: 'sans-serif',
			        fill: '#555',
			        width: 'auto',
			        height: 'auto',
			        opacity: '1',
			        verticalAlign:'top',
			        fontStyle: textFontType,
			        id: 'txt_'+txtGrpId,
			        name : 'nametxt'
			      }); 
			
			 this.labelOptionsHandle(txtGrpObj,labelCount);
			 txtGrpObj.add(textAdd);
	      }
			 $(selector).remove();
			 event.selectorObj.show();
			  $('#maskTool').remove();
			 if(txtGrpObj.get('#addTxt_'+txtGrpId)[0]){
				txtGrpObj.get('#txtBox_'+txtGrpId)[0].setFill("transparent");
				txtGrpObj.get('#addTxt_'+txtGrpId)[0].hide();
			 }
		 
		 $('#toolPalette li#'+this.createTools[1]).removeClass('active');
		  $('#toolPalette li#'+this.createTools[1]).data('clicked',false);		
		  /* -- added to modify position of add text for show hidden text in authoring --- */
		  var lblGroup = window.CD.services.cs.findGroup(txtGrpObj.parent.attrs.id);
		  var infoTvisible= '';
		  if(ds.getEt() != 'PRG'){
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
			
		  infoTvisible=infoTextTObj.getVisible();
		  }
		  
		  this.textSetActive(txtGrpObj,true);
		  txtGrpObj.setY(0);
		  var totWidth = txtGrpObj.parent.children[0].getWidth();
		  var totHeight = txtGrpObj.parent.children[0].getHeight();
		  
		  txtGrpObj.get('#txt_'+txtGrpId)[0].setWidth(totWidth-buffer);
		  if(txtGrpObj.parent.get('#img_'+txtGrpObj.parent.attrs.id)[0]){
			  if(infoTvisible == ''){
				  var imgHeight = (txtGrpObj.parent.get('#img_'+txtGrpObj.parent.attrs.id)[0]).get('.img')[0].getHeight();
				  txtGrpObj.setY(imgHeight + 10);
			  }else{
				  txtGrpObj.setY(((lblGroup.children[0].getHeight())/2)-((txtGrpObj.get('#txt_'+txtGrpId)[0].getHeight())/2))
			  }
			  
		  }else{
			  var originalTextHeight = txtGrpObj.get('#txt_'+txtGrpId)[0].textArr.length * txtGrpObj.get('#txt_'+txtGrpId)[0].getTextHeight();
			  if(totHeight > originalTextHeight){
				  var calcY = (totHeight - originalTextHeight)/2;
				  txtGrpObj.setY(calcY);
			  }else{
				 // this.adjustFontSize(txtGrpObj,totHeight);
			  }
		  }
		  if($('#UnderlinetTool').hasClass('active')){
			  this.applyTextUnderline(txtGrpObj.get('#txt_'+txtGrpId)[0], txtGrpObj);			  
		  }else{
			  var node = window.CD.module.data.getLabelIndex(txtGrpObj.parent.attrs.id);
			  window.CD.module.data.getJsonData()[node].underline_value = "F";
		  }		  
		  ds.setOutputData();
		  cdLayer.draw();
		  this.bindLabelTextEvent(txtGrpObj,totHeight,txtGrpId,cdLayer);
		 
	},
	this.labelOptionsHandle = function(txtGrpObj,labelCount){
		 var cdLayer = window.CD.services.cs.getLayer();
		 var cs = window.CD.services.cs;
		 var ds = window.CD.services.ds;
		 var trimmedText = $.trim($("#textToolTextBox").val());
		 var currentLabel = txtGrpObj.parent;
		 var txtFlag = false;
		 var currentDock = cdLayer.get('#dock_'+currentLabel.attrs.id)[0];
		 var errorModal = window.CD.util.getTemplate({url: 'resources/themes/default/views/error_modal.html'});
		 for(var i=0; i<labelCount; i++){
			 var labelGrpId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;				
			 var label = cs.findGroup(labelGrpId);
			 var dock = cs.findGroup('dock_'+labelGrpId);
			 var lblId = window.CD.module.data.getLabelIndex(label.attrs.id);
			 if(label && (label.get('#txt_'+label.attrs.id.split('_')[1])[0]) && window.CD.module.data.Json.SLEData[lblId].visibility==true){
				 var text = label.get('#txt_'+label.attrs.id.split('_')[1])[0].getText();
				 if(text == trimmedText){
					 if(ds.getOptionLabel() == "OTO"){
						$('#toolPalette #errorModal').remove();
						$('#toolPalette').append(errorModal);
						//$('#toolPalette #errorModal').css('height','185px');
						$('#toolPalette #errorModal').css('width','327px');
						$('#errorModal #errAlertText').hide();
						$('#errorModal #warningText').hide();
						$('#errorModal #errorText').hide();
						$('#errorModal .clear').hide();
						$('#errorModal #normalButton').hide();						
						$('#alertMessage').slideDown(200);		
						$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
						$('#errorTextOTO').show();
						$('#errorTextOTO .error_warning_text').show();
						$('#OTOButton #errorOk').show();
						$('#OTOButton #errorCancel').show();
						$('#alertMessage').slideDown(200);	
						$("#errorModal span#errorOk").off('click').on('click',function(){
							$('#errorModal').slideUp(200);
							ds.setOptionLabel('OTM');
							ds.setOptionLabelText(exerciseNames[ds.getEt()]['OTM']);
							ds.setsubOptionLevel('DLE');
							ds.setsubOptionLevelText(exerciseNames[ds.getEt()]["TYPE"]['DLE']);				
							window.CD.module.data.Json.adminData["OTO"] = false;
							window.CD.module.data.Json.adminData["OTM"] = false;
							window.CD.module.data.Json.adminData["TYPE"] = true;
							ds.setOutputData();
							resetActivitySettings();
						});
						$("#errorModal span#errorCancel").off('click').on('click',function(){
							new TextTool.labelText().deleteActiveLabelText();
							$('.button #updateFromInspector').addClass('inactive');
							$('#errorModal').slideUp(200);
						});
						}else{
						 if(ds.getOptionLabel() == "OTM" && ds.getsubOptionLevel() == "DLO"){
							 var data = window.CD.module.data;
							 var node = data.getJsonData()[data.getLabelIndex(currentLabel.attrs.id)];
							 var labelNode = data.getJsonData()[data.getLabelIndex(label.attrs.id)];
//							 for(var i=0; i<labelCount; i++){
//								 var labelGrpId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;				
//								 var label = cs.findGroup(labelGrpId);
//								 var dock = cs.findGroup('dock_'+labelGrpId);
								 var lblId = window.CD.module.data.getLabelIndex(label.attrs.id);
								 if((label.get('#txt_'+label.attrs.id.split('_')[1])[0]) && window.CD.module.data.Json.SLEData[lblId].visibility==true){
										 currentLabel.hide();
										 cs.setActiveElement(label,'label');
										 currentDock.children[0].attrs.name = label.attrs.id;
										 node.visibility = false;
										 node.name = label.attrs.id;	
										 ds.setOutputData();
								 }
//							 }								 
							 
						 }
					 }
				 }
			 }
		 }
		 
		  function resetActivitySettings(){		 
				
				if(ds.getEt() == "COI"){
					$('#cdInspector #tableCOI').show();
					$('#cdInspector #coiOptions').html(ds.getOptionLabelText());
					$("#propertiesDivLabel").css("display", "block");
					
				} else if(ds.getEt() == "PRG") {
					$('#cdInspector #tablePRG').show();
					$('#cdInspector #prgOptionsForLabel').html(ds.getOptionLabelText());
					$('#cdInspector #prgOptionsForSentence').html(ds.getOptionSentenceText());
					$("#propertiesDivLabel").css("display", "block");
				} 
				else if(ds.getEt() == "CLS") {
					$("#propertiesDivLabel").css("display", "block");
				} 
				else {
					$('#cdInspector #tableSLE').show();	
					$('#cdInspector #sleOptions').html(ds.getOptionLabelText());
					$("#propertiesDivLabel").css("display", "block");
					
				}
				if(ds.getOptionLabel() == "OTM" && ds.getEt() != "COI"){
					$('#cdInspector #subOption').show();
					if(ds.getsubOptionLevelText() != ""){
						$('#cdInspector #subOptions').html(ds.getsubOptionLevelText());
					}else{
						ds.setsubOptionLevelText($('#cdInspector #subOptions').html());
					}
					
				}else{
					$('#cdInspector #subOption').hide();	
				}
				subOptionLoad("", ds.getEt());
		  }
		  
		  function subOptionLoad(node, exType){
				
				var exVal = exerciseNames[exType];
				if(exType != "COI"){				
						if(ds.getsubOptionLevel() == ""){
							$('#cdInspector #subOption').hide();
						}else if(ds.getsubOptionLevel() == "DLO"){
								$('#cdInspector #subOption').show();
								$('#cdInspector #subOptions').html(exerciseNames[exType]["TYPE"]["DLO"]);
								if(exType == "SLE" || exType == "CLS"){
									$('#sleOptions').html(exerciseNames[exType]["OTM"]);
								}else{
									if(exType == "PRG"){
										$('#prgOptionsForLabel').html(exerciseNames[exType]["OTM"]);
									}
								}
						}else{
							if(ds.getsubOptionLevel() == "DLE"){
								$('#cdInspector #subOption').show();
								$('#cdInspector #subOptions').html(exerciseNames[exType]["TYPE"]["DLE"]);
								if(exType == "SLE" || exType == "CLS"){
									$('#sleOptions').html(exerciseNames[exType]["OTM"]);
								}else{
									if(exType == "PRG"){
										$('#prgOptionsForLabel').html(exerciseNames[exType]["OTM"]);
									}
								}
							}
						}					
					}			
				}
	},
	this.bindLabelTextEvent=function(txtGrpObject){
		
		var childTxtObj=this.getTextObjFromGroupObject(txtGrpObject);
		var txtNameSpace= this;
		
		childTxtObj.on('click',function(evt){			
			txtNameSpace.textSetActive(this.parent, 'labelText');
		});
		childTxtObj.on("dblclick dbltap", function(evt) {
			var evtObj = {selectorObj:txtGrpObject,x:txtGrpObject.getAbsolutePosition().x,y:txtGrpObject.getAbsolutePosition().y+$('canvas').first().offset().top};
			txtNameSpace.createTextBoxForLabel(evtObj);
			evt.cancelBubble = true;
		});
		
	};
	this.adjustFontSize=function(txtGrpObject,totHeight,cdLayer){
		var textObj = txtGrpObject.get('#txt_'+txtGrpObject.attrs.id.split('_')[1])[0];
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
	 * function name: getlabelTextList()
	 * description:get total text list number
	 * plus one in a label 

	 * param: 
	 * labelJsonObj-label json object[object]
	 * 
	 */

	this.getlabelTextList=function(labelJsonObj,framId){
		  var textCount=0;
		  if(!labelJsonObj[framId])
		  {
			  labelJsonObjcount=0;
		  }else{
		     labelJsonObjcount=labelJsonObj[framId].labelTextList.length;
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
		var textToolCfg=this;//new textToolConfig();
		if(type){
			var textparam ="labeltext";		
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

	 * param: 
	 * txtGrpObj-text group object[object]
	 */
	this.getTextObjFromGroupObject=function(txtGrpObj){
	  if(typeof txtGrpObj==="object" && txtGrpObj.nodeType==="Group"){
		var txtObj;
		$.each(txtGrpObj.children, function(index,value) {
				if(value.className === "Text" && value.getText() != 'Reset' && value.getText() != 'Zoom')   //excluded Student GUI text elements
				{
					txtObj=value;
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
		var rectObj
		txtOpt={align:'',bold:'',italic:'',underline:''};//var txtOptArr=txtOpt.split(',');
		/*txt*/
		var txtObj=this.getTextObjFromGroupObject(txtGrpObj);
		var textAlign=txtObj.getAlign();
		var textFontSize=txtObj.getFontSize();
		var textFontStyle=txtObj.getFontStyle();
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
			txtOpt.bold='boldTool'
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
			$("#borderGuide").prop("checked",true)
			
		}
		else {
			 $("#borderGuide").prop("checked",false)
			 
			
		}
		/*fill*/
		if(rectFill===txtCfg.fillChngClr){
			//$("#borderGuide").attr('checked', true);
			$("#fillGuide").prop("checked",true)
			
		}
		else {
			 $("#fillGuide").prop("checked",false)
			
			
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
	 * function name: setTextHighlight()
	 * description:on setActiveElement method
	 * this method will call to highlight text 

	 */
	this.setlabelTextHighlight=function(newObject){
		
		var  oldObj=window.CD.elements.active.element[0];
		var textTool= this;//new textToolConfig();
		if(typeof newObject==="object" && newObject.nodeType==="Group" && (newObject.attrs.id.match(/txtGrp_[0-9]+/)))
		{
			var childrenTxtObj=this.getTextObjFromGroupObject(newObject);
				    
			if(typeof oldObj==="object")
			{
				this.removeTextHighlight(oldObj);
			}
			
			if(typeof childrenTxtObj==="object" && childrenTxtObj.nodeType==="Shape" && childrenTxtObj.className==="Text")
			{
				    
					childrenTxtObj.setFill(textTool.highlightFill);
					textTool.drawLayer();
					this.getSelectedTextOptions(newObject);
			}
		}else if(typeof oldObj==="object" && oldObj.nodeType==="Group" && (oldObj.attrs.id.match(/txtGrp_[0-9]+/)))
		{
			this.removeTextHighlight(oldObj);
		}
		
			
	};
	/**
	 * function name: removeTextHighlight()
	 * description:to remove highlight
	 * colour of 
	 * Highlight text 

	 */
	this.removeTextHighlight=function(oldObject){
		
		
		
		var nodeType=oldObject.nodeType;
		if(typeof oldObject==="object" && oldObject.nodeType==="Group" && (oldObject.attrs.id.match(/txt_[0-9]+/)||oldObject.attrs.id.match(/txtGrp_[0-9]+/)))
		{
		   var textTool= this,//new textToolConfig(),
		      oldChildrenTxtObj=this.getTextObjFromGroupObject(oldObject);
			if(typeof oldChildrenTxtObj==="object" && oldChildrenTxtObj.nodeType==="Shape" && oldChildrenTxtObj.className==="Text")
			{
					oldChildrenTxtObj.setFill(textTool.normalFill);
					textTool.drawLayer();
					this.removeSelectedTextOptions();
					
					
			
			}
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
	this.alignActiveText=function(){
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		activeAlign=textStyle.align;
		var activeObj=window.CD.elements.active.element[0];
		var activeGrpObj=activeObj;
		if(typeof activeObj==="object" && activeObj.nodeType==="Group")
		{
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			
			
			if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
			{
				if(activeChildrenTxtObj.attrs.id.match(/txt_[0-9]+/)){
					activeObj=activeChildrenTxtObj;
					activeObj.setWidth(activeGrpObj.parent.children[0].getWidth()-20);
					activeObj.setAlign(activeAlign);
				    txtConfg.drawLayer();
				    if($('#UnderlinetTool').hasClass('active')){
				    	 this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj);						  
					  }
				   	
				    this.textToolStatus=true;
					this.getSelectedTextOptions(activeGrpObj);
					 /*update data string*/
					   var labelIndex= window.CD.module.data.getLabelIndex(activeGrpObj.parent.attrs.id);
					   var textFormat=window.CD.module.data.getEachLabelOutputData(labelIndex,'textFormat');
					   var underLine=textFormat.underline_value;
						var chngArr={textFormat:{
									underline_value:underLine,
									fontSize:activeChildrenTxtObj.getFontSize(),
									fontStyle:activeChildrenTxtObj.getFontStyle(),
									align:activeChildrenTxtObj.getAlign()
									}};
						window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);
				}
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
		if(typeof activeObj==="object" && activeObj.nodeType==="Group")
		{
			
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			
			
			if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
			{
				if(activeChildrenTxtObj.attrs.id.match(/txt_[0-9]+/)){
					this.textToolStatus=true;
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
					txtConfg.drawLayer();
					if($('#UnderlinetTool').hasClass('active')){
						 this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj);						  
					 }
				}
				/*update data string*/
				var labelIndex= window.CD.module.data.getLabelIndex(activeGrpObj.parent.attrs.id);
				 var textFormat=window.CD.module.data.getEachLabelOutputData(labelIndex,'textFormat');
				 var underLine=textFormat.underline_value;
				var chngArr={textFormat:{
							underline_value:underLine,
							fontSize:activeChildrenTxtObj.getFontSize(),
							fontStyle:activeChildrenTxtObj.getFontStyle(),
							align:activeChildrenTxtObj.getAlign()
							}};
				window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);
				
			}
		}
	};

	/**
	 * function name: italicActiveText()
	 * description:italic active text

	 * 
	 */
	this.italicActiveText=function(){
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		var activeObj=window.CD.elements.active.element[0];
		var activeGrpObj=activeObj;
		if(typeof activeObj==="object" && activeObj.nodeType==="Group"){
			
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
			{
				if(activeChildrenTxtObj.attrs.id.match(/txt_[0-9]+/)){
				   this.textToolStatus=true;
				   this.getSelectedTextOptions(activeGrpObj);
				   activeObj=activeChildrenTxtObj;
				   var cuuFont=activeObj.getFontStyle();
				   if(cuuFont=="italic")fontst="normal";
				   else if(cuuFont=="bold")fontst="bold italic";
				   else if(cuuFont=="bold italic")fontst="bold normal";
				   else if(cuuFont=="bold normal")fontst="bold italic";
				   else fontst="italic";
				   activeObj.setFontStyle(fontst);				   
				   txtConfg.drawLayer();
				   if($('#UnderlinetTool').hasClass('active')){
					   this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj);			  
					}
				}
			}
		}
		/*update data string*/
		var labelIndex= window.CD.module.data.getLabelIndex(activeGrpObj.parent.attrs.id);
		 var textFormat=window.CD.module.data.getEachLabelOutputData(labelIndex,'textFormat');
		 var underLine=textFormat.underline_value;
		var chngArr={textFormat:{
					underline_value:underLine,
					fontSize:activeChildrenTxtObj.getFontSize(),
					fontStyle:activeChildrenTxtObj.getFontStyle(),
					align:activeChildrenTxtObj.getAlign()
					}};
		window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);
		
	};
	
	this.underlineActiveText=function(){
		 var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		var activeObj=window.CD.elements.active.element[0];
		var activeGrpObj=activeObj;
		
		if(typeof activeObj==="object" && activeObj.nodeType==="Group"){
			
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
			{
				if(activeChildrenTxtObj.attrs.id.match(/txt_[0-9]+/)){
				    this.textToolStatus=true;
					this.getSelectedTextOptions(activeGrpObj);
					var sle = window.CD.module.data.getLabelIndex(activeGrpObj.parent.attrs.id);	
					if($('#UnderlinetTool').hasClass('active')){
						this.removeUnderline(activeGrpObj);						   
					}else{
						this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj);
					}					
				}
			}
		}
		
	};
	this.applyTextUnderline=function(activeChildrenTxtObj,activeGrpObj,rerender){
		   rerender = rerender || false;
		   var txtConfg= this;//new textToolConfig();
		   var activeObj=activeChildrenTxtObj;	
		   var labelWidth = activeGrpObj.parent.children[0].getWidth();
		   var cuuFont=activeObj.getFontStyle();
		   var ds = window.CD.services.ds;
		   this.removeUnderline(activeGrpObj);
	
		  for(var i=0; i<activeObj.textArr.length ;i++){
			  var activeWidth = activeObj.textArr[i].width;
			  if(activeObj.getAlign() == "center"){
				  var startpos = (labelWidth - activeWidth)/2;
				  startpos = startpos -10;
				  if(rerender == true)
					  startpos = startpos -5;
				
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
		window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);
		this.ds.setOutputData();
			
	};
	
	this.removeUnderline = function(activeGrpObj){
		var ds = window.CD.services.ds;
		var txtConfg = this;
		 var underlineObj = activeGrpObj.get('.underline_txt');
		   underlineObj.each(function() {
	         this.remove();
	        });
		  
		   txtConfg.drawLayer();
		   /*update data string*/
		   var childTxtObj=this.getTextObjFromGroupObject(activeGrpObj);
			var labelIndex= window.CD.module.data.getLabelIndex(activeGrpObj.parent.attrs.id);
			var chngArr={textFormat:{
						underline_value:"F",
						fontSize:childTxtObj.getFontSize(),
						fontStyle:childTxtObj.getFontStyle(),
						align:childTxtObj.getAlign()
						}};
			window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);
		   
		   this.ds.setOutputData();
	};
	/**
	 * function name: applyTextToolChange()
	 * description:on click on text tool apply

	 * 
	 */

	this.applyTextToolChange=function(){
		$(this).data('clicked',true);
		var boxW=$("#boxWidth").val();
		var boxH=$("#boxHeight").val();
		//if(boxW.is)
		if($(this.textToolBoxId).is(":visible"))
		{
			$(this.textToolBoxId).css('width',boxW);
			$(this.textToolBoxId).css('height',boxH)
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
	this.setActiveTextFontSize=function(){
		
		var font=$("#fontTool .font_size #fontTextbox").val();
		if(!font)font=window.CD.module.data.Json.adminData.GFS;
		var rectObj
		
		var txtConfg= this;//new textToolConfig();
		textStyle=txtConfg.getTextStyle();
		var activeObj=window.CD.elements.active.element[0];
		var activeGrpObj=activeObj;
		
		if(typeof activeObj==="object" && activeObj.nodeType==="Group"){
			var activeChildrenTxtObj=this.getTextObjFromGroupObject(activeObj);
			if(activeChildrenTxtObj.attrs.id.match(/txt_[0-9]+/)){				
				if(typeof activeChildrenTxtObj==="object" && activeChildrenTxtObj.nodeType==="Shape" && activeChildrenTxtObj.className==="Text")
				{
					$.each(activeGrpObj.children, function(index,value) {
						
						if(value.className==="Rect")
						{
							rectObj=value;
							
						}
					});
					
					   activeObj=activeChildrenTxtObj;
					   activeObj.setFontSize(font);
					   rectObj.setHeight(activeObj.getHeight())
					   txtConfg.drawLayer();
					   var originalTextHeight = activeChildrenTxtObj.textArr.length * activeChildrenTxtObj.getTextHeight();
					   var calcY = (activeGrpObj.parent.children[0].getHeight() - originalTextHeight)/2;
					   activeGrpObj.setY(calcY);
					   txtConfg.drawLayer();
					   if($('#UnderlinetTool').hasClass('active')){
							 this.applyTextUnderline(activeChildrenTxtObj,activeGrpObj);						  
						 }
					   
						
					   w=rectObj.getWidth();
					   h=rectObj.getHeight();				   
					   //$("#boxWidth").val(w);
					   //$("#boxHeight").val(h);
					   this.textToolStatus=true;
					   this.getSelectedTextOptions(activeGrpObj);
					   if((activeGrpObj.parent.attrs.id.match(/label_[0-9]+/))){
						   var labelIndex= window.CD.module.data.getLabelIndex(activeGrpObj.parent.attrs.id);
						   var textFormat=window.CD.module.data.getEachLabelOutputData(labelIndex,'textFormat');
						   var underLine=textFormat.underline_value;
						   /*update data string*/
						   var chngArr={textFormat:{
								underline_value:underLine,
								fontSize:activeChildrenTxtObj.getFontSize(),
								fontStyle:activeChildrenTxtObj.getFontStyle(),
								align:activeChildrenTxtObj.getAlign()
								}};
						   window.CD.module.data.setEachLabelOutputData(labelIndex,chngArr);
			   
					   	}
					 
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

	this.deleteActiveLabelText=function(){
		var ds = window.CD.services.ds;
		var active = window.CD.elements.active;
		var activeElm = active.element[0];
		var txtGrpObjId = activeElm.attrs.id;
		var txtId = txtGrpObjId.split("_")[1];	
		var labelId = 'label_'+txtId;
		
		if(ds.getEt()== 'PRG'){
			var prg = window.CD.module.view.getPRGLabelIndex(labelId);
			var dis = window.CD.module.data.Json.PRGData.PRGLabelData[prg].distractor_label;
			if(dis == 'T'){
				this.deleteText();
			}
		}else{
			this.deleteText();
		}
		
	};
	
	this.deleteText = function(){
		var txtConfig = this;
		var cs = window.CD.services.cs;
		var cdLayer = window.CD.services.cs.getLayer();
		var active = window.CD.elements.active;
		var activeElm = active.element[0];
		var txtGrpObjId = activeElm.attrs.id;
		var txtId = txtGrpObjId.split("_")[1];		
		if(activeElm.get('#txt_'+txtId)[0]){
			activeElm.get('#txt_'+txtId)[0].remove();
			if(activeElm.get('.underline_txt')[0])
				this.removeUnderline(activeElm);
		}
		if(activeElm.get('#addTxt_'+txtId)[0]){
			var addtxt = activeElm.get('#addTxt_'+txtId)[0];
			addtxt.show();
			addtxt.setFill('#555');
			if(activeElm.parent.get('.img')[0]){
				addtxt.parent.setY(activeElm.parent.children[0].getHeight()-20);				
			}else{
				activeElm.setY((activeElm.parent.children[0].getHeight() - addtxt.getTextHeight())/2);				
			}
			addtxt.setHeight(17);
			addtxt.setWidth(activeElm.parent.children[0].getWidth()-20);
			addtxt.setAlign("center");
		}
			
		if(activeElm.get('#txtBox_'+txtId)[0]){
			activeElm.get('#txtBox_'+txtId)[0].setFill('#fff');
			activeElm.get('#txtBox_'+txtId)[0].setWidth(activeElm.parent.children[0].getWidth()- 20);
		}
		var groupId = activeElm.parent.attrs.id;	
		if(activeElm.parent.get('.lockicon_' + groupId)[0]){
		activeElm.parent.get('.lockicon_' + groupId)[0].moveToTop();
		activeElm.parent.get('.unlockicon_' + groupId)[0].moveToTop();
		}
		cdLayer.draw();
		txtConfig.cs.setActiveElement(cs.getGroup('frame_0'),'frame');	
	}
	/**
	 * function name: checkSubOrSuperTagExist()

	 */
	this.checkSubOrSuperTagExist=function(value){
		console.log("@labelText.checkSubOrSuperTagExist");
		if(value.match(/<sb>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sb>/g) || value.match(/<sp>[a-zA-Z0-9\+-=\(\)\<\>\.\^ ]+<\/sp>/g)){
			return true;
		}
	};
	
	/**
	 * function name: checkSubTagExist()

	 */
	this.checkSubTagExist=function(value){
		console.log("@labelText.checkSubTagExist");
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
		console.log("@labelText.convertSbSpscript");
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
		console.log("@labelText.getEachSubscriptChar");
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
		
		$("#errorContainer span#errorOk").html("Ok")
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
	
};
