var TextFormat = TextFormat || {};
/**
 * @class name : textFormat
 * description : All text formatting and text creation is done here
 */
TextFormat= function (){
	
	this.formatText = function(textValue){
		try{
			this.status = "";
			this.finalArray = [];
			this.prepareStyleTextArray(textValue);
			return this.finalArray;
		}
		catch(err){
			console.log("Error @textFormat :: createText::"+err.message);
		}
	};
	this.prepareStyleTextArray = function(textValue){
		try{
			textValue = textValue.replace(/ /g,'#$#')
			var t = document.createElement("div");
			t.innerHTML = textValue;
			var textArr = t.childNodes;
			var textArrLen = textArr.length;
			for(var cnt = 0;cnt<textArrLen;cnt++){
				
				if(textArr[cnt].localName != null){
					if(textArr[cnt].localName == 'sb' || textArr[cnt].localName == 'sub' || textArr[cnt].localName == 'sp' || textArr[cnt].localName == 'sup'){
						var data = '<'+textArr[cnt].localName+'>'+textArr[cnt].textContent+'</'+textArr[cnt].localName+'>'
						var replcdText = data.replace(/\$#/g,' '); // $ should be escaped
						var splittedTextArr = replcdText.split(' ');
						for(var eachTxt in splittedTextArr){
							this.finalArray.push(splittedTextArr[eachTxt]);
						}
					}else{
						var textLocalName = '['+textArr[cnt].localName+']';
						this.status = "";
						this.status = textLocalName;
						
						var textArrChildNodeArr = textArr[cnt].childNodes;
						
						this.prepareChildTextArray(textArrChildNodeArr);
					}					
					
				}else{
					var data = textArr[cnt].data;
					var replcdText = data.replace(/\$#/g,' '); // $ should be escaped
					var splittedTextArr = replcdText.split(' ');
					for(var eachTxt in splittedTextArr){
						this.finalArray.push(splittedTextArr[eachTxt]);
					}
				}
			}
		}
		catch(err){
			console.log("Error @textFormat :: prepareStyleTextArray::"+err.message);
		}
	};
	
	this.prepareChildTextArray = function(textArrChildNodeArr,statusFlag){
		try{
			var textArrChildNodeLen = textArrChildNodeArr.length;
			for(var cnt = 0;cnt<textArrChildNodeLen;cnt++){
				if(textArrChildNodeArr[cnt].localName != null){
					var textLocalName = '['+textArrChildNodeArr[cnt].localName+']';
					var status = this.status+textLocalName;
					this.status = status;
					
					var textArrChildNodeArr1 = textArrChildNodeArr[cnt].childNodes;
					
					this.prepareChildTextArray(textArrChildNodeArr1,textLocalName);
					
				}else{
					var data = textArrChildNodeArr[cnt].data;
					var replcdText = data.replace(/\$#/g,' '); // $ should be escaped
					var splittedTextArr = replcdText.split(' ');
					for(var eachTxt in splittedTextArr){
						var status = this.status;
						var modText = status+splittedTextArr[eachTxt];
						this.finalArray.push(modText);
					}
					var modStatusArr = this.status.split(statusFlag);
					var modStatus = "";
					for(var eachSt in modStatusArr){
						modStatus = modStatus+modStatusArr[eachSt];
					}
					this.status = modStatus;
				}
			}
		}
		catch(err){
			console.log("Error @textFormat :: prepareChildTextArray::"+err.message);
		}
	}
	
	this.createFrameText = function(frameTextId,parentObj,event,textValue,align,globalFontStyle,UpadateJsonCheck){
		try{
			/***** For Frame text new *****/
			var allTextStyling = new AllTextStyling();
			var frmID = parentObj.getId().split('_')[1];
			var buffer= 20;
			var txtToolCfg = new TextTool.canvasText();
			var frameTxtToolCfg = new TextTool.frameText();
			
			var txtStyle = txtToolCfg.getTextStyle();
			  /*border*/
			  var brdr = txtToolCfg.borderChgClr;
			  if(txtStyle.border == "T"){
				  brdr=txtToolCfg.borderChgClr;
			  }
			  /*fill*/
			  var fill=txtToolCfg.fillDflClr;
			  if(txtStyle.fill == "T"){
				  fill=txtToolCfg.fillChngClr;
			  } 
			  
			//var para={extraObj:"",showFrame:false,frmId:frmID,frmtxtList:"",ft:"",addedText:true,x:parseInt(event.x),y:parseInt(event.y)-50};
			  
			
			var groupId = 'txt_'+frameTextId+"_"+frmID;
			for(var i=0;i<window.CD.module.data.Json.FrameData[frmID].frameTextList.length;i++){
				if(window.CD.module.data.Json.FrameData[frmID].frameTextList[i]){
					if(window.CD.module.data.Json.FrameData[frmID].frameTextList[i].textGroupObjID == groupId)
						  var txtId = i;
				}
				  	  
			}
			  
			var textStyleObj = CanvasData.getTextStyleData(groupId);
			var textFontSize = textStyleObj.fontSize;
			if(textStyleObj.fill == 'T'){
				fill=txtToolCfg.fillChngClr;
			}
			var initX = window.CD.module.data.Json.FrameData[frmID].frameTextList[txtId].textX;
			var initY = window.CD.module.data.Json.FrameData[frmID].frameTextList[txtId].textY;
			//var w=parseInt(txtObj.getWidth());
			var groupObj = txtToolCfg.cs.createGroup(groupId,{x: event.x,y: event.y,draggable:true});
			var rect = new Kinetic.Rect({
				x: 0,
				y: 0,
				fill: fill,
				stroke: brdr,
				strokeWidth: txtToolCfg.borderWidth,
				height:'auto'
			});
			var W = window.CD.module.data.Json.FrameData[frmID].frameTextList[txtId].maxWidth;
			var H = window.CD.module.data.Json.FrameData[frmID].frameTextList[txtId].minHeight;
			rect.setWidth(parseInt(W)); 
			
			CanvasData.textGrpComponents = [];
			
			var textFontStyle = CanvasData.getTextStyleData(groupId);
			var boldItalicStatus = textFontStyle.fontType;
			var frameID = parentObj.attrs.id.split('_')[1];
			/*if(window.CD.globalStyle.underlineVal != ''){
				var underlineValStatus = window.CD.globalStyle.underlineVal;
			}else{*/
				var underlineValStatus = textFontStyle.underlineVal;
			//}
			
			window.CD.module.data.Json.FrameData[frameID].frameTextList[txtId].underlineVal = underlineValStatus;
			
			groupObj.add(rect);
			var textH = 15;
			var lineBreak = 1;
			var textFormat = new TextFormat();
			var adjustment = 0;
						
			textValue = this.removeLastBR(textValue);
			
			/** ---- For new line ---- **/
			if(textValue.indexOf('<br>') != -1){
				textValue = textValue.replace(/<br>/g, ' ^^');
			} 
			var txtSeq = 0;
			if((textValue.indexOf('^^') !== -1) || (textValue.indexOf('<b>') !== -1)||(textValue.indexOf('<i>') !== -1)||(textValue.indexOf('<u>') !== -1)){
				var txtSeq = 0;
				var formattedTextArr = textFormat.formatText(textValue);
				//if(formattedTextArr.length>1){
					for(var i=0; i<formattedTextArr.length; i++){
						var spaceSplitted = formattedTextArr[i].split(' ');
						var formatTxtLen = spaceSplitted.length;
						for(var j=0; j < formatTxtLen; j++){
							if(spaceSplitted[j] != "" && spaceSplitted[j] != "#"){
								var tempValuesArr = spaceSplitted[j].split(']');
								var tempValues = tempValuesArr[parseInt(tempValuesArr.length)-1];
								
								if(tempValues != '^^'){
									/** for space issue of underline text **/
									if(tempValues.indexOf('#') == -1){
										if(formattedTextArr[i+1] == '#'){
											tempValues = tempValues+'#';
										}										
									}
									tempValues = tempValues.replace(/#/g,' ');
									tempValues = tempValues.replace(/\^/g,'');
									/** ---- Search for styles ---- **/
									var style = '';
									if(formattedTextArr[i].toString().indexOf('[b]') != -1)
										style = 'bold';
									if(formattedTextArr[i].toString().indexOf('[i]') != -1)
										style = style+' italic';
									
									var fontStyle = 'normal';
									if((formattedTextArr[i].indexOf('[i]')!= -1) || (formattedTextArr[i].indexOf('[b]')!= -1))
										fontStyle = style;
									
									var underlinedTextStyle = 'normal_text';
									var underline_val = 'F';
									if(formattedTextArr[i].toString().indexOf('[u]') != -1){
										underlinedTextStyle = 'underlined_text';
										underline_val = 'T';
									}
									/** For global underline text **/
									if(underlineValStatus == 'T'){
										underlinedTextStyle = 'underlined_text';
									}
									if(globalFontStyle){
										if(style!= ''){
											var globalFontType = globalFontStyle.fontType;
											var textStyleArr = globalFontType.split(' ');
											var eachStyleArr = style.split(' ');
											for(var eachStyle in textStyleArr){
												if(eachStyleArr.indexOf(textStyleArr[eachStyle]) == -1){
													fontStyle = $.trim(fontStyle)+' '+textStyleArr[eachStyle];
												}
											}
										}else{
											fontStyle = globalFontStyle.fontType;
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
									
									var textAdd = new Kinetic.Text({	       
								        text: tempValues,//$("#textToolTextBox").val(),						        
								        fontSize: textFontSize,
								        fill: '#555',
								        fontFamily: 'sans-serif',
								        fill: '#555',
								        opacity: '1',
								        verticalAlign:'center',
								        fontStyle: fontStyle,
								        id: 'txt_'+frameTextId+'_'+frmID+'_'+txtSeq,
								        name : underlinedTextStyle,
								        padding:2
								      }); 
									//var para={extraObj:"",showFrame:false,frmId:"",frmtxtList:"",ft:"",addedText:true,x:parseInt(event.x),y:parseInt(event.y)-50,textHeight:'auto'};
									
									if(txtSeq == 0){
										groupObj.add(textAdd);
										textAdd.setX(0);
										textAdd.setY(2);
									 }
									 else{
										 var prevtxtObj = groupObj.get('#txt_'+frameTextId+'_'+frmID+'_'+(txtSeq-1))[0];
										 var param = txtToolCfg.addValuefromPreviousObj(spaceSplitted[j],prevtxtObj,textAdd,groupObj.children[0].getWidth(),buffer,lineBreak,parseInt(textFontSize));
										 var textObj = param.textObj;
										 groupObj.add(textObj);
										 lineBreak = param.lineBreak;
									 }
									var updatedTextFormat = {
											fontStyle : fontStyle,
											textComponentID : 'txt_'+frameTextId+'_'+frmID+'_'+txtSeq,
											underline_value : underline_val,
											componentValue : tempValues,
											textCompX : textAdd.getX(),
											textCompY : textAdd.getY()
									};
									
									updatedTextFormat = jQuery.extend(true, {}, updatedTextFormat);
									
									txtSeq++;
									CanvasData.textGrpComponents.push(updatedTextFormat);
								}								
							}
						 }			
					}
					/** ---- Formatted text is always having one <div></div>. So there is sometimes an extra ^^ and hence extra line break ---- **/
					var txtBoxH = (lineBreak/*-adjustment*/)*(parseInt(textFontSize)+2)+4;
					/*if(txtBoxH < H){
						txtBoxH= H;
					}*/
					rect.setHeight(txtBoxH);
				//}
			}else{
				var style = '';
				var fontStyle = 'normal';
				if(globalFontStyle){
					fontStyle = globalFontStyle.fontType;
				}else if(boldItalicStatus && boldItalicStatus != 'normal'){
						fontStyle = boldItalicStatus;
				}/*else{
					if(window.CD.globalStyle.fontStyle != '')
					fontStyle = window.CD.globalStyle.fontStyle;
				}*/
				var textStyle = "";
				var underline_val = 'F';
				if(underlineValStatus == 'T'){
					textStyle = "underlined_text";
					underline_val = 'T';
				}else{
					if(underlineValStatus == 'F'){
						textStyle = "normal_text";
						underline_val = 'F';
					}
				}
				
				textValue = textValue.replace(/\r/g,'\n');
				var textAdd = new Kinetic.Text({	       
			        text: textValue,//$("#textToolTextBox").val(),
			        fontSize: textFontSize,
			        fill: '#555',
			        fontFamily: 'sans-serif',
			        fill: '#555',
			        opacity: '1',
			        verticalAlign:'center',
			        fontStyle: fontStyle,
			        id: 'txt_'+frameTextId+'_'+frmID+'_'+txtSeq,
			        name : textStyle,
			        padding:2
			      }); 
				groupObj.add(textAdd);

				var totWidth = groupObj.children[0].getWidth();
				var textW = totWidth;
				textAdd.setWidth(textW);
				if(textAdd.getHeight() < 20){
					rect.setHeight(20);
				}
				else{
					rect.setHeight(textAdd.getHeight());
				}
				
				var xPos = (totWidth-textW)/2;
				textAdd.setX(xPos);				
			}
			
			window.CD.module.data.Json.FrameData[frmID].frameTextList[txtId].txtGroupComponentNo = txtSeq;
			
			if(parentObj.getId() == 'frame_0'){
				var textBgLayer = txtToolCfg.cs.getBgTextLayer();
				textBgLayer.add(groupObj);
				textBgLayer.moveToTop();
				textBgLayer.draw();
				 
			}else{
				parentObj.add(groupObj);
				groupObj.moveToTop();
			}
			
			if(align == 'left' || align == 'justify'){
				allTextStyling.alignActiveTextLeft(groupObj,'','UpadateJsonCheck');      
			 }else if(align == 'right'){
				 allTextStyling.alignActiveTextRight(groupObj,'','UpadateJsonCheck');      
			 }else if(align == 'center'){
				 allTextStyling.alignActiveTextMiddle(groupObj,'middle','UpadateJsonCheck');      
			 }
			var undStatus = 'global';
			if(underlineValStatus == 'F'){
				undStatus = undefined;
			}
			allTextStyling.applyEachTextUnderline(groupObj,undStatus);
			
						
			$('#maskTool').remove();
			$('#toolPalette li#'+txtToolCfg.createTools[1]).removeClass('active');
			$('#toolPalette li#'+txtToolCfg.createTools[1]).data('clicked',false);
			window.CD.services.cs.updateDragBound(groupObj);
			
			var param={creatBox:true}
			//txtToolCfg.setFramTextListData(groupObj,param);
			if(frmID == '0'){
				txtToolCfg.textSetActive(groupObj);
			}else{
				frameTxtToolCfg.textSetActive(groupObj);
			}
			
			txtToolCfg.drawLayer();
			//if(!globalFontStyle){
				if(window.CD.globalTextCreated[frmID] != undefined){
					window.CD.globalTextCreated[frmID] = (window.CD.globalTextCreated[frmID]+1);
				}else{
					window.CD.globalTextCreated[frmID] = 1;
				}
			//}		
			var rectH = rect.getHeight();
			var jsonRectHeight = window.CD.module.data.Json.FrameData[frmID].frameTextList[txtId].minHeight;
			if(rectH<=jsonRectHeight){
				rect.setHeight(jsonRectHeight);
				var txtTool = new TextTool.canvasText();
				var count = groupObj.children.length;
				var height=0;
				for(var i=1;i<count;i++){
					var textHeight = groupObj.children[i].getY() + groupObj.children[i].getHeight();
					if(textHeight>height){
						height = textHeight;
					}
				}
				var textY = (groupObj.children[0].getHeight() - height)/2;
				for(var j=1;j<count;j++){
					var Y = groupObj.children[j].getY();
					groupObj.children[j].setY(textY + Y);
				}
			}
			return groupObj;
		}
		catch(err){
			console.log("Error in textFormat :: createFrameText : "+err.message);
		}
	};
	
	this.createLabelText = function(labelTxtGrp,textValue,align,globalFontStyle){
		try{
			/***** For Frame text new *****/
			var labelTextStyling = new labelTextStyle();
			var labelID = labelTxtGrp.getId().split('_')[1];
			var buffer= 20;
			var txtToolCfg = new TextTool.commonLabelText();
			var txtStyle = window.CD.module.data.getTextFormatParamsFromJson(labelID);
			var textFormat = new TextFormat();
			var ds = window.CD.services.ds;
			
			if(align){
				var align = align;
			}else{
				var align = txtStyle.align;
			}
			
			/*if(window.CD.globalStyle.alignment != ''){
				align = window.CD.globalStyle.alignment;
			}*/
			  /*border*/
			  var brdr = txtToolCfg.borderChgClr;
			  if(txtStyle.border == "T"){
				  brdr=txtToolCfg.borderChgClr;
			  }
			  /*fill*/
			  var fill=txtToolCfg.fillDflClr;
			  if(txtStyle.fill == "T"){
				  fill=txtToolCfg.fillChngClr;
			  } 
			  
			/*
			var textStyleObj = CanvasData.getTextStyleData(groupId);
			var textFontSize = textStyleObj.fontSize;*/
			
			//var w=parseInt(txtObj.getWidth());
			
			if(ds.getEt() != 'PRG'){
				var textFontStyle = window.CD.module.data.getTextStyleData(labelID);
			}else{
				var textFontStyle = window.CD.module.data.getLabelTextStyleData(labelID);
			}
			
			/*if(window.CD.globalStyle.fontStyle != ''){
				textFontStyle.fontStyle = window.CD.globalStyle.fontStyle;
			}
			if(window.CD.globalStyle.underlineVal != ''){
				textFontStyle.underline_value = window.CD.globalStyle.underlineVal;
			}*/
			var textFontSize = textFontStyle.fontSize;
			
			var boldItalicStatus = textFontStyle.fontStyle;
			var underlineValStatus = textFontStyle.underline_value;
			/** It is defined that available text area for text is 90% of the total width (similar to student side) **/
			var availableTextArea = parseInt(labelTxtGrp.parent.children[0].getWidth())*0.9;
			var textH = 0;
			var lineBreak = 1;
			var textFormat = new TextFormat();
			
			/** ---- For new line ---- **/
			if(textValue.match(/\r|\n/) != null){
				textValue = textValue.replace(/\n|\r/g, ' ^^');
			}
			/** ---- For [] ---- **/
			/**Questions containing '[' & ']' were not coming in correct format, so this code replacing them with different formation**/
			if(textValue.match(/\[|\]/) != null){
				textValue = textValue.replace(/\[/g, '%!%');
				textValue = textValue.replace(/\]/g, '!%!');
			} 
			var formattedTextArr = textFormat.formatText(textValue);
			var txtSeq = 0;
			for(var i=0; i<formattedTextArr.length; i++){
				var spaceSplitted = formattedTextArr[i].split(' ');
				var formatTxtLen = spaceSplitted.length;
				for(var j=0; j < formatTxtLen; j++){
					if(spaceSplitted[j]!=""){
						var tempValuesArr = spaceSplitted[j].split(']');
						var tempValues = tempValuesArr[parseInt(tempValuesArr.length)-1];
						tempValues = tempValues.replace(/#/g,' ');
						var style = '';
						if(formattedTextArr[i].toString().indexOf('[b]') != -1)
							style = 'bold';
						if(formattedTextArr[i].toString().indexOf('[i]') != -1)
							style = style+' italic';
						
						var fontStyle = 'normal';
						if((formattedTextArr[i].indexOf('[i]')!= -1) || (formattedTextArr[i].indexOf('[b]')!= -1))
							fontStyle = style;
						
						var underlinedTextStyle = 'normal_text';
						var underline_val = 'F';
						if(formattedTextArr[i].toString().indexOf('[u]') != -1){
							underlinedTextStyle = 'underlined_text';
							underline_val = 'T';
						}
						
						if(globalFontStyle && !globalFontStyle.oldTextPresent){
							if(window.CD.globalStyle.underlineVal != ''){
								underlineValStatus = window.CD.globalStyle.underlineVal;
							}
						}
						
						/** For global underline text **/
						if(underlineValStatus == 'T'){
							underlinedTextStyle = 'underlined_text';
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
						tempValues = tempValues.replace(/\^/g,'');
						/**---Questions containing '[' & ']' were not coming in correct format, so this code replacing them with different formation---**/
						tempValues = tempValues.replace(/%!%/g, '[');
						tempValues = tempValues.replace(/!%!/g, ']');
						
						var textAdd = new Kinetic.Text({	       
					        text: tempValues,//$("#textToolTextBox").val(),						        
					        fontSize: textFontSize,
					        fill: '#555',
					        fontFamily: 'sans-serif',
					        fill: '#555',
					        opacity: '1',
					        verticalAlign:'center',
					        fontStyle: fontStyle,
					        id: 'lbltxt_'+labelID+'_'+txtSeq,
					        name : underlinedTextStyle,
					        padding:2
					      }); 
						//var para={extraObj:"",showFrame:false,frmId:"",frmtxtList:"",ft:"",addedText:true,x:parseInt(event.x),y:parseInt(event.y)-50,textHeight:'auto'};
						
						if(txtSeq == 0){
							labelTxtGrp.add(textAdd);
							textAdd.setX(0);
							textAdd.setY(0);
						 }
						 else{
							 var txtToolCfg = new TextTool.commonLabelText();
							 
							 var count = txtSeq-1;
							 var textSeq = textFormat.getLastTextObj(labelTxtGrp,count,labelID);
							 var prevtxtObj = labelTxtGrp.get('#lbltxt_'+labelID+'_'+(textSeq))[0];
							 
							 var param = txtToolCfg.addValuefromPreviousObj(spaceSplitted[j],prevtxtObj,textAdd,availableTextArea,buffer,lineBreak,parseInt(textFontSize));
							 var textObj = param.textObj;
							 labelTxtGrp.add(textObj);
							 lineBreak = param.lineBreak;
						 }
						var updatedTextFormat = {
								fontStyle : fontStyle,
								textComponentID : 'lbltxt_'+labelID+'_'+txtSeq,
								underline_value : underline_val,
								componentValue : tempValues
						};
						
						updatedTextFormat = jQuery.extend(true, {}, updatedTextFormat);
						
						txtSeq++;
						window.CD.module.data.textGroupComponent.push(updatedTextFormat);
					}
				 }			
			}			
			
			if(align == 'left' || align == 'justify'){
				labelTextStyling.alignActiveTextLeft(labelTxtGrp,align);      
			 }else if(align == 'right'){
				 labelTextStyling.alignActiveTextRight(labelTxtGrp,align);      
			 }else if(align == 'center'){
				 labelTextStyling.alignActiveTextMiddle(labelTxtGrp,align);      
			 }
			var undStatus = 'global';
			if(underlineValStatus == 'F'){
				undStatus = undefined;
			}
			//for underline
			labelTextStyling.applyEachTextUnderline(labelTxtGrp,undStatus);
			
						
			$('#maskTool').remove();
			$('#toolPalette li#'+txtToolCfg.createTools[1]).removeClass('active');
			$('#toolPalette li#'+txtToolCfg.createTools[1]).data('clicked',false);
			//window.CD.services.cs.updateDragBound(labelTxtGrp.parent);
			
			var param={creatBox:true}
			//txtToolCfg.setFramTextListData(groupObj,param);
			/** For SLE dock text, text will not be highlighted **/
			if(labelTxtGrp.getId().match(/^docktxtGrp_[0-9]+/) == null){
				//txtToolCfg.setTextActive(labelTxtGrp);
			}			
			txtToolCfg.drawLayer();
			return labelTxtGrp;
		}
		catch(error){
			console.info("Error in @createLabelText :: textFormat "+error.message);
		}
	};
	
	/**
     * @param : whole label text group, last child count and the label id
     * @description : For a label text with the text children 
     * also includes blank ("") object. This method is used for getting actual label text 
     * children count
     */
	this.getLastTextObj = function(labelTxtGrp,count,labelID,txtId){
		console.log("@getLastTextObj :: commonLabelText");
		if(txtId){
			var txtId = txtId;
		}else{
			var txtId = 'lbltxt_';
		}
		try{
			var prevObj = labelTxtGrp.get('#'+txtId+labelID+'_'+(count))[0];
			if(prevObj.getAttrs().text == ''){
				count--;
				return this.getLastTextObj(labelTxtGrp,count,labelID);
			}else{
				return count;
			}
		}
		catch(error){
			console.info("Error @getLastTextObj :: commonLabelText: "+error.message);
		}
	};
	
	/**
     * @param : whole label text group, last child count and the label id
     * @description : For a label text with the text children 
     * also includes blank ("") object. This method is used for getting actual label text 
     * children count
     */
	this.getLastHintObj = function(hintTxtGrp,count,labelID){
		console.log("@getLastHintObj :: commonLabelText");
		try{
			var prevObj = hintTxtGrp.get('#hintTxt_'+labelID+'_'+(count))[0];
			if(prevObj.getAttrs().text == ''){
				count--;
				return this.getLastHintObj(hintTxtGrp,count,labelID);
			}else{
				return count;
			}
		}
		catch(error){
			console.info("Error @getLastHintObj :: commonLabelText: "+error.message);
		}
	};
	
	this.deleteActiveText = function(canvastextObj,editOrDelete){
		console.log("@textFormat.deleteActiveText");
		try{
			var txtToolCfg = new TextTool.canvasText();
			
			var active = window.CD.elements.active;
			var activeElm = active.element[0];
			
			var txtGrpObjId = activeElm.attrs.id;
			var splittedid = txtGrpObjId.split("_");
			var frameTextId = parseInt(txtToolCfg.getFrameTextListNum(txtGrpObjId));
			var frameID = parseInt(splittedid[2]);
			
			if(canvastextObj)
				activeElm = canvastextObj;
			var activeElmParent = activeElm.parent;
			if(frameID == '0'){//i.e canvas text
				activeElmParent = window.CD.services.cs.getBgTextLayer();
			}else{//i.e frame text
				activeElmParent = window.CD.services.cs.getLayer();
			}
			
			
			var frameJson = txtToolCfg.getFrameData(activeElm);
			var initVal = frameJson.textValue;
			
			var event ={};
			event.x = parseInt(frameJson.textX);
			event.y = parseInt(frameJson.textY);
			
			txtToolCfg.cs.setActiveElement(txtToolCfg.cs.getGroup('frame_0'),'frame');
			var childrenLen = activeElm.getChildren().length;
			//if(childrenLen == 0){
				activeElm = activeElmParent.get('#'+activeElm.getId())[0];
			//}
			txtToolCfg.cs.deleteSubGroups(activeElm);
			
			if(activeElmParent && activeElmParent.attrs.id==="text_layer"){
				activeElmParent.draw();
			}
			txtToolCfg.drawLayer();
			
			window.CD.globalTextCreated[frameID] = window.CD.globalTextCreated[frameID]-1;
			var framDataObj=window.CD.module.data.Json.FrameData[frameID];
			/*if(editOrDelete != 'edit'){
				window.CD.module.data.Json.FrameData[frameID].frameTextList.splice(frameTextId,1);
			}*/
			txtToolCfg.ds.setOutputData();
		}
		catch(error){
			console.info("Error @deleteActiveText :: textFormat "+error.message);
		}
	};
	
	this.deleteActiveLabelText = function(labelTextObj){
		console.log("@textFormat.deleteActiveLabelText");
		try{
			var txtToolCfg = new TextTool.commonLabelText();
			var active = window.CD.elements.active;
			var activeElm = active.element[0];
			if(labelTextObj)
				activeElm = labelTextObj;
			
			var activeElmParent = activeElm.parent;
			var labelId = activeElmParent.getId();
			var etIndex = window.CD.module.data.getLabelIndex(labelId);
			var txtGrpObjId = activeElm.attrs.id;
			var splittedid = txtGrpObjId.split("_");
			var parentLayer = activeElm.getLayer();
			var etJson = window.CD.module.data.getJsonData();
			var initVal = etJson[etIndex].label_value;
			
			/*var event ={};
			event.x = parseInt(frameJson.textX);
			event.y = parseInt(frameJson.textY);*/
			
			txtToolCfg.cs.setActiveElement(txtToolCfg.cs.getGroup('frame_0'),'frame');
			var childrenLen = activeElm.getChildren().length;
			if(childrenLen == 0){
				activeElm = activeElmParent.get('#'+activeElm.getId())[0];
			}
			this.deleteEachLabelText(activeElm);
			
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
			console.info("Error @deleteActiveLabelText :: textFormat "+error.message);
		}
	};
	
	this.deleteEachLabelText = function(object){
		console.log("@textFormat : deleteEachLabelText");
		try{
			var childrenLengt = object.children.length;
			var k = 0;
			if(object.getId().match(/^docktxtGrp_[0-9]+/) == null){
				k = 2;
			}
			for(var i=k; i<childrenLengt; i++){
				if(!object.children[i]){
					this.deleteEachLabelText(object);
				}
				if(object.children[i]) {
					if(object.children[i].nodeType == "Group"){
						this.deleteEachLabelText(object.children[i]);
					} else {
						object.children[i].remove();
					}
				}
			}
		}catch(error){
			console.info("Error in textFormat :: deleteEachLabelText "+error.message);
		}
	};
	this.createHintFeedbackText = function(hintFdbkGrp,textValue){
		console.log("@createHintFeedbackText : textFormat");
		try{
			var txtToolCfg = new TextTool.commonLabelText();
			var align = 'center';
			var textFormat = new TextFormat();
			var labelTextStyling = new labelTextStyle();
			var textFontSize = window.CD.module.data.Json.adminData.GFS;
			var lineBreak = 0;
			var availableTextArea = parseInt(hintFdbkGrp.parent.children[0].getWidth())*0.9;
			var textH = 0;
			var buffer = 20; 
			var labelID = hintFdbkGrp.getId().split('hintTxt_')[1];
			
			/** Done to remove last <br> **/
			textValue = this.removeLastBR(textValue);
			
			/** ---- For new line ---- **/
			if(textValue.indexOf('<br>') != -1){
				textValue = textValue.replace(/<br>/g, ' ^^');
			} 
			var formattedTextArr = textFormat.formatText(textValue);
			var txtSeq = 0;
			for(var i=0; i<formattedTextArr.length; i++){
				var spaceSplitted = formattedTextArr[i].split(' ');
				var formatTxtLen = spaceSplitted.length;
				for(var j=0; j < formatTxtLen; j++){
					if(spaceSplitted[j]!=""){
						var style = '';
						var tempValuesArr = spaceSplitted[j].split(']');
						var tempValues = tempValuesArr[parseInt(tempValuesArr.length)-1];
						tempValues = tempValues.replace(/#/g,' ');
						
						if(formattedTextArr[i].toString().indexOf('[b]') != -1)
							style = 'bold';
						if(formattedTextArr[i].toString().indexOf('[i]') != -1)
							style = style+' italic';
						
						var fontStyle = 'normal';
						if((formattedTextArr[i].indexOf('[i]')!= -1) || (formattedTextArr[i].indexOf('[b]')!= -1))
							fontStyle = style;
						
						var underlinedTextStyle = 'normal_text';
						var underline_val = 'F';
						if(formattedTextArr[i].toString().indexOf('[u]') != -1){
							underlinedTextStyle = 'underlined_text';
							underline_val = 'T';
						}
												
						tempValues = tempValues.replace(/\^/g,'');
						var textAdd = new Kinetic.Text({	       
					        text: tempValues,//$("#textToolTextBox").val(),						        
					        fontSize: textFontSize,
					        fill: '#555',
					        fontFamily: 'sans-serif',
					        fill: '#555',
					        opacity: '1',
					        verticalAlign:'center',
					        fontStyle: fontStyle,
					        id: 'hintTxt_'+labelID+'_'+txtSeq,
					        name : underlinedTextStyle,
					        padding:2
					      }); 
						
						if(txtSeq == 0){
							hintFdbkGrp.add(textAdd);
							textAdd.setX(0);
							textAdd.setY(0);
						 }
						 else{
							 var count = txtSeq-1;
							 var textSeq = textFormat.getLastHintObj(hintFdbkGrp,count,labelID);
							 var prevtxtObj = hintFdbkGrp.get('#hintTxt_'+labelID+'_'+(textSeq))[0];
							 
							 var param = txtToolCfg.addValuefromPreviousObj(spaceSplitted[j],prevtxtObj,textAdd,availableTextArea,buffer,lineBreak,parseInt(textFontSize));
							 var textObj = param.textObj;
							 hintFdbkGrp.add(textObj);
							 lineBreak = param.lineBreak;
						 }
						txtSeq++;
					}
				 }			
			}			
			
			if(textValue != ""){
				labelTextStyling.alignActiveTextMiddle(hintFdbkGrp,align); 
				//for underline
				labelTextStyling.applyEachTextUnderline(hintFdbkGrp,'global');
			}		
			$('#maskTool').remove();
						
			txtToolCfg.drawLayer();
			return hintFdbkGrp;
		}
		catch(error){
			console.info("Error in @createHintFeedbackText :: textFormat "+error.message);
		}
	};
	
	this.createPRGText = function(labelTxtGrp,textValue,align,globalFontStyle,textSeq,dock){
		try{
			var dockTextTool= new TextTool.dockText();
			var labelTextStyling = new labelTextStyle();
			var labelID = labelTxtGrp.getId().split('_')[1];
			if(dock){
				labelID = labelTxtGrp.getId().split('_')[2];
			}
			var buffer= 20;
			var txtToolCfg = new TextTool.commonLabelText();
			//var txtStyle = window.CD.module.data.getTextFormatParamsFromJson(labelID);
			var textFormat = new TextFormat();
			
			/*var align = txtStyle.align;
			if(window.CD.globalStyle.alignment != ''){
				align = window.CD.globalStyle.alignment;
			}
			  border
			  var brdr = txtToolCfg.borderChgClr;
			  if(txtStyle.border == "T"){
				  brdr=txtToolCfg.borderChgClr;
			  }
			  fill
			  var fill=txtToolCfg.fillDflClr;
			  if(txtStyle.fill == "T"){
				  fill=txtToolCfg.fillChngClr;
			  }*/ 
			
			if(dock){
				var textFontStyle = window.CD.module.data.getTextStyleData(labelID);
			}else{
				var textFontStyle = window.CD.module.data.getLabelTextStyleData(labelID);
			}
			/*if(window.CD.globalStyle.fontStyle != ''){
				textFontStyle.fontStyle = window.CD.globalStyle.fontStyle;
			}
			if(window.CD.globalStyle.underlineVal != ''){
				textFontStyle.underline_value = window.CD.globalStyle.underlineVal;
			}*/
			var textFontSize = textFontStyle.fontSize;
			
			var boldItalicStatus = textFontStyle.fontStyle;
			var underlineValStatus = textFontStyle.underline_value;
			/** It is defined that available text area for text is 90% of the total width (similar to student side) **/
			var availableTextArea = parseInt(labelTxtGrp.parent.children[0].getWidth())*0.9;
			var textH = 0;
			var lineBreak = 1;
			var textFormat = new TextFormat();
			var formattedTextArr = textValue;
			if(textSeq)
				var txtSeq = textSeq;
			else
				txtSeq = 0;
			
			if(dock)
				var txtId = 'dockTxt_';
			else
				var txtId = 'lblTxt_';
			for(var i=0; i<formattedTextArr.length; i++){
				var spaceSplitted = formattedTextArr[i].split(' ');
				var formatTxtLen = spaceSplitted.length;
				for(var j=0; j < formatTxtLen; j++){
					if(spaceSplitted[j]!="" && spaceSplitted[j]!='~~'){
						var tempValuesArr = spaceSplitted[j].split(']');
						needSpaceAftr = false;
						needSpaceBfor = false;
						var tempValues = tempValuesArr[parseInt(tempValuesArr.length)-1];
						tempValues = tempValues.replace(/#/g,' ');
						tempValues = tempValues.replace(/~~/g,'');
						if(tempValues != ''){							
							var style = '';
							if(dock){
								if(formattedTextArr[i+1] == '~~' || formattedTextArr[i].indexOf('~~')!=-1){
									var needSpaceAftr = true;
								}
								if(formattedTextArr[i-1] == '~~'){
									var needSpaceBfor = true;
								}
							}
							if(formattedTextArr[i].toString().indexOf('[b]') != -1)
								style = 'bold';
							if(formattedTextArr[i].toString().indexOf('[i]') != -1)
								style = style+' italic';
							
							var fontStyle = 'normal';
							if((formattedTextArr[i].indexOf('[i]')!= -1) || (formattedTextArr[i].indexOf('[b]')!= -1))
								fontStyle = style;
							
							var underlinedTextStyle = 'normal_text,fillIn';
							var underline_val = 'F';
							if(formattedTextArr[i].toString().indexOf('[u]') != -1){
								underlinedTextStyle = 'underlined_text,fillIn';
								underline_val = 'T';
							}
							/** For global underline text **/
							if(underlineValStatus == 'T'){
								underlinedTextStyle = 'underlined_text,fillIn';
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
							tempValues = tempValues.replace(/\^/g,'');
							/*if(needSpaceAftr){
								tempValues = tempValues+' ';
							}
							if(needSpaceBfor){
								tempValues = ' '+tempValues;
							}*/
							var fillColor = '#555';
							if(dock){
								fillColor = 'red';
							}
							var textAdd = new Kinetic.Text({	       
						        text: tempValues,//$("#textToolTextBox").val(),						        
						        fontSize: textFontSize,
						        fill: fillColor,
						        fontFamily: 'sans-serif',
						        opacity: '1',
						        verticalAlign:'center',
						        fontStyle: fontStyle,
						        id: txtId+labelID+'_'+txtSeq,
						        name : underlinedTextStyle,
						        padding:2
						      }); 
							//var para={extraObj:"",showFrame:false,frmId:"",frmtxtList:"",ft:"",addedText:true,x:parseInt(event.x),y:parseInt(event.y)-50,textHeight:'auto'};
							
							if(txtSeq == 0){
								labelTxtGrp.add(textAdd);
								textAdd.setX(0);
								textAdd.setY(0);
							 }
							 else{
								 var txtToolCfg = new TextTool.commonLabelText();
								 
								 var count = txtSeq-1;
								 var textSeq = textFormat.getLastTextObj(labelTxtGrp,count,labelID,txtId);
								 var prevtxtObj = labelTxtGrp.get('#'+txtId+labelID+'_'+(textSeq))[0];
								 
								 var param = txtToolCfg.addValuefromPreviousObj(spaceSplitted[j],prevtxtObj,textAdd,availableTextArea,buffer,lineBreak,parseInt(textFontSize));
								 var textObj = param.textObj;
								 labelTxtGrp.add(textObj);
								 lineBreak = param.lineBreak;
							 }
							
							txtSeq++;
							//window.CD.module.data.textGroupComponent.push(updatedTextFormat);
						}
					}
				 }			
			}			
			if(!dock){
				var txtObjArray = [];
				txtObjArray.push(labelTxtGrp);
				if(align == 'left' || align == 'justify'){
					labelTextStyling.alignActiveTextLeft(txtObjArray,align);      
				 }else if(align == 'right'){
					 labelTextStyling.alignActiveTextRight(txtObjArray,align);      
				 }else if(align == 'center'){
					 labelTextStyling.alignActiveTextMiddle(txtObjArray,align);      
				 }
			}
			
			/*var undStatus = 'global';
			if(underlineValStatus == 'F'){
				undStatus = undefined;
			}*/
			//for underline
			dockTextTool.applyTextUnderline(labelTxtGrp);
			
			var param={creatBox:true}
						
			txtToolCfg.drawLayer();
			var textObject = {};
			textObject.labelTxtGrp = labelTxtGrp;
			textObject.txtSeq = txtSeq;
			return textObject;
		}
		catch(error){
			console.info("Error in @createPRGText :: textFormat "+error.message);
		}
	};	
	
	this.removeLastBR = function(textValue){
    	console.log("@removeLastBR :: textFormat");
    	try{
    		if(textValue.indexOf('<br>') != -1){
    			textValue = textValue.replace(/(<br>|\s|&nbsp;)*$/,'');
    			textValue = textValue.replace('<u><br></u>','');
    			textValue = textValue.replace('<i><br></i>','');
    			textValue = textValue.replace('<b><br></b>','');
    		}
    		return textValue;
    	}catch(error){
      		 console.info("Error @removeLastBR :: textFormat: "+error.message);
      	 }
    };
	
};