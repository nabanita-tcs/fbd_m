var SLEView = {
	init: function(sleJson,cnvConfig) {
		console.log("@SLEView.init::");
		try{
			var propdiv = $('#propertiesLabel');
			var labeldivSLE = window.CD.util.getTemplate({url: 'resources/themes/default/views/layout_mode_design_SLE.html?{build.number}'});
			propdiv.append(labeldivSLE);
			/* -- This method is used to make label local magnify text box and drop down non editable --- */
			//SLEView.makeLabelLocalZoomDisable();
			$('#cdInspector .tab_view').on('click',function(){
				if($(this).hasClass('inactive')){
					$('#' + $(this).siblings('.tab_view.active').attr('name')).hide();
					$(this).siblings('.tab_view.active').removeClass('active').addClass('inactive');
					$(this).removeClass('inactive').addClass('active');
					$('#' + $(this).attr('name')).show();
					
					/* For Label Inspector div append*/
					if( $(this).attr('name') == 'localDiv' && $('#localDivInactive').length == 0 && (window.CD.elements.active.type != 'label' && window.CD.elements.active.type != 'dock')){
						SLEView.makeLabelLocalDisable();
					}
				}
			});
			
			SLEView.attachPublishEvents();
			
			/*SLEView. ------------- Events bind for each view ----------- */
			SLEView.bindInspectorEvents();
			
			//if(sleJson.FrameData.length > 0){
			window.CD.services.cs.drawGuides();
			window.CD.module.frame.init(sleJson.FrameData);
			//}
			this.showSLELabel(sleJson);
		}catch(err){
			console.error("Error in SLEView::"+err.message);
		}
		
	},
	/**
	 * Function name: attachPublishEvents()
	 * 
	 */
	attachPublishEvents: function(){
		$('#toolPalette .right_tool span#done').off('click').on('click',function(){				
			var labelModal = window.CD.util.getTemplate({url: 'resources/themes/default/views/publishing_SLE_modal.html?{build.number}'});
			$('#labelModal').remove();
		    $('body').append(labelModal);
				$('#labelModal').css('left', (($('#toolPalette').width()/2) - ($('#labelModal').width()/2))+'px');
			$('#labelModal').css('top', (($('#canvasHeight').val()/2) - ($('#labelModal').height()/2))+90+'px');
			var totalLabel = SLEView.onOpenShowData();
			
			$("#labelContainer input.input_text").bind('keydown',function(e){
				var inputVal = $(this).val();
				var key = e.charCode || e.keyCode || 0;
				 // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
		       if(!e.shiftKey){
		    	   return (
			            key == 8 || 
			            key == 9 ||
			            key == 46 ||
			            (key >= 37 && key <= 40) ||
			            (key >= 48 && key <= 57) ||
			            (key >= 96 && key <= 105));
		       }else{
		    	   return false;
		       }
			});
			$("#publishOk").off('click').on('click',function(){
				var stdVal=parseInt($("#pub_standardLabels #labelsNo").val());
				var textVal=parseInt($("#pub_standardLabels .pub_num").text());
				var distVal=parseInt($("#pub_distractorLabels #distractorNo").val());
				var distTextVal=parseInt($("#pub_distractorLabels .pub_num").text());
				var reqdVal=parseInt($("#pub_required .pub_num").text());
				$('#labelOverlay').remove();
				 var ds = window.CD.services.ds;			 
				 if(stdVal > textVal || distVal > distTextVal){
					 var option={
							 textVal:parseInt($("#pub_standardLabels .pub_num").text()),
							distTextVal:parseInt($("#pub_distractorLabels .pub_num").text())
						};
							validation.showLabelErrorPOPUP(21,option);
					 		validation.showLabelErrorPOPUPForCancel(29,option);
				 }else if(((reqdVal<1 || isNaN(reqdVal)) && stdVal <1) && (textVal != 0 || distTextVal != 0 || !isNaN(reqdVal) || !isNaN(parseInt($("#pub_distractorWithDock .pub_num").text())) || !isNaN(parseInt($("#pub_given .pub_num").text())))){
					 var option={
							 textVal:parseInt($("#pub_standardLabels .pub_num").text()),
							distTextVal:parseInt($("#pub_distractorLabels .pub_num").text())
							};
					 		validation.showLabelErrorPOPUPForCancel(30,option);
				}
				 else if(reqdVal != 0 && stdVal <= textVal){
					 SLEData.customPublishFlag = true;
					 SLEData.applyClickPublishOk();
					$('#maskTool').remove();
					  $('#labelModal').slideUp(200);
					  $('.tool_select').trigger('click');
				}
				else if(reqdVal == 0 && stdVal >= 1 && stdVal <= textVal){
					 SLEData.customPublishFlag = true;
					SLEData.applyClickPublishOk();
					$('#maskTool').remove();
					  $('#labelModal').slideUp(200);
					  $('.tool_select').trigger('click');
				}
				else if(totalLabel != 0 && reqdVal == 0 && stdVal == 0){
					var option={
						 textVal:parseInt($("#pub_standardLabels .pub_num").text()),
						distTextVal:parseInt($("#pub_distractorLabels .pub_num").text())
					};
						validation.showLabelErrorPOPUP(20,option);
				}	
				else if(totalLabel == 0){
					 $('#labelOverlay').remove();
					 $('#labelModal').slideUp(200);
				}
				if($('#scramble').prop('checked') == true){
					window.CD.module.data.getJsonAdminData()['RLO'] = 'T';
				}else{
					window.CD.module.data.getJsonAdminData()['RLO'] = 'F';
				}
				window.CD.services.ds.correctOutputData();
				window.CD.services.ds.setOutputData();	
			  });
			  
			/*bind on keydown for error text box*/
			 $(".scram input.input_text").bind('keydown',function(e){
				 validation.onKeyDownClearTextBox(e,this)
			 });
			 
			 $("#publishCancel").off('click').on('click',function(){
				 $('#maskTool').remove();
				  $('#labelOverlay').remove();
				  $('#labelModal').slideUp(200);
				 // $('.tool_select').trigger('click');
			  });
			 
		});
		
	},
	
	localZoomMagnification : function(localMagData,labelId){
		console.log("@localZoomMagnification :: SLEView");
		try{
			var ds = window.CD.services.ds;
			var zoomObj = {};
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			zoomObj.localMagnificationWidth = localMagData.width;
			zoomObj.localMagnificationHeight = localMagData.height;
			zoomObj.localMagnificationFactor = parseInt(localMagData.scaleFactor)/100;
			
			SLEData.setLocalMagnificationVal(labelId,zoomObj);
			SLEData.getJsonAdminData().magnificationData = 'local';
			ds.setOutputData();
			
			var zoomBox = cs.findGroup('zoomPlaceHolder');
			/*if(zoomBox){
				var zoomBoxRect = zoomBox.children[0];
				var zoomBoxText = zoomBox.children[1];
				zoomBoxText.setWidth(localMagData.width);
				zoomBoxRect.setWidth(localMagData.width);
				zoomBoxRect.setHeight(localMagData.height);
				cdLayer.draw();
			}*/
		}catch(err){
			console.log("Error @localZoomMagnification :: SLEView "+err.message);
		}
	},
	
	/**
	 * function name: onOpenShowData()
	 * author:Piyali Saha
	 */
	onOpenShowData :function(){
		console.log("@SLEView.onOpenpopulateData");
		try{
			var jsonData=window.CD.module.data.Json;
			var SleData=jsonData.SLEData;
			var jsonSLEPS=jsonData.SLEPS;
			var standardNum=0;
			var givennum=0;
			var requnum=0;
			var diswithDocnum=0;
			var totalLabel=0;
			var totalDistractor=0;
			/*fetch standard labels*/
			var totalRandomLabels;
			var totalRandomDistractors;
			
			totalRandomLabels=jsonData.SLEPS.totalRandomLabels
			totalRandomDistractors=jsonData.SLEPS.totalRandomDistractors
		     
			/** -- for no labels totalRandomLabels and totalRandomDistractors are "" hence making them 0 -- **/
			if(totalRandomLabels == "")
				totalRandomLabels = 0;
			
			if(totalRandomDistractors == "")
				totalRandomDistractors = 0;
			/*** --------------------------------------------------------------------- ***/
			if(SleData){
			  for(sle in SleData){
				  var sleObj=SleData[sle];
				  if(sleObj.publishingOption && sleObj.publishingOption==="S" && sleObj.visibility == true && sleObj.distractor_label==="F"){
					  standardNum++;
				  }
				  if(sleObj.publishingOption && sleObj.publishingOption==="G" && sleObj.visibility == true){
					  givennum++;
				  }
				  else if(sleObj.publishingOption && sleObj.publishingOption==="R" && sleObj.visibility == true){
					  requnum++;
				  }
				  else if(sleObj.publishingOption && sleObj.publishingOption==="DC" && sleObj.visibility == true){
					  diswithDocnum++;
				  }
				  
				  if(sleObj.distractor_label==="T"){
					  totalDistractor++;
				  }else if(sleObj.distractor_label==="F" && sleObj.visibility == true){
					  totalLabel++;
				  }
			  }
			 			
			}
			 /*if(totalRandomLabels=='' || parseInt(totalRandomLabels) > totalLabel){
				  totalRandomLabels=totalLabel;
			  }
			  if(totalRandomDistractors=='' || parseInt(totalRandomDistractors) > totalDistractor){
				  totalRandomDistractors=totalDistractor;
			  }*/
		/* update number in popup*/
			  if(parseInt(givennum)>0){
				  $("#pub_given .pub_num").text(givennum);
			  }else{
				  $("#pub_given").css('display','none');
			  }
			  
			  if(parseInt(requnum)>0){
				  $("#pub_required .pub_num").text(requnum);
			  }else{
				  $("#pub_required").css('display','none');
			  }
			  
			  if(parseInt(diswithDocnum)>0){
				  $("#pub_distractorWithDock .pub_num").text(diswithDocnum);
			  }else{
				  $("#pub_distractorWithDock").css('display','none');
			  }
			
			  if(totalRandomLabels == undefined){
				  $("#pub_standardLabels #labelsNo").val(parseInt(standardNum));  
			  }else if(totalRandomLabels > standardNum){
				  $("#pub_standardLabels #labelsNo").val(parseInt(standardNum));  
			  }else{
				  $("#pub_standardLabels #labelsNo").val(parseInt(totalRandomLabels));
			  }
				
			if(totalRandomDistractors == undefined){
				$("#pub_distractorLabels #distractorNo").val(totalDistractor);
			}else if(totalRandomDistractors > totalDistractor){
				$("#pub_distractorLabels #distractorNo").val(totalDistractor);
			}else{
				$("#pub_distractorLabels #distractorNo").val(totalRandomDistractors);
			}
			  
			//$("#pub_standardLabels #labelsNo").val(parseInt(totalRandomLabels));
			//$("#pub_distractorLabels #distractorNo").val(totalRandomDistractors);
			
			$("#pub_standardLabels .pub_num").text(parseInt(standardNum));
			$("#pub_distractorLabels .pub_num").text(totalDistractor);
			if(window.CD.module.data.getJsonAdminData()['RLO'] == 'T'){
				$('#scramble').prop('checked',true);
			}else{
				if(window.CD.module.data.getJsonAdminData()['RLO'] == 'F'){
					$('#scramble').prop('checked',false);
				}
			}
			return totalLabel;
			
		}catch(err){
			console.error("@SLEView::Error on onOpenpopulateData::"+err.message);
		}
		
	},

	showSLELabel: function(sleJson) {
		try{
			console.log('@SLEView.showSLELabel');
			//var lbGroup = cs.findGroup(lbConfig.p_id);
			var sleData = sleJson.SLEData;
			var sleDataArray = $.map(sleData, function(el) { return el; });
			//console.log(sleDataArray);
			if(sleDataArray.length > 0){
			c = 0;	
			//$.each(currentSLEObj, function(key, val){
			//Implementing Yielding Process with Array Chunking technique by SS
			setTimeout(function(){
						var util = window.CD.util;	
						var cs = window.CD.services.cs;
						var ds = window.CD.services.ds;
						var stg = cs.getCanvas();
						var cdLayer = cs.getLayer();
						var lbConfig = new LabelConfig();
						var undoMng = window.CD.undoManager;
						var val = sleDataArray.shift();
						
						lbConfig.id = 'label_' + c;
						var lblGrpOptions = {draggable:true,x:parseInt(val.holder_x),y: parseInt(val.holder_y),name:val.name};
						var lbGroup = cs.createGroup('label_'+c,lblGrpOptions);
						var dockGrpOptions = {draggable:true,x:parseInt(val.doc_x),y: parseInt(val.doc_y),name : val.name};
						var dockGroup = cs.createGroup('dock_label_'+c,dockGrpOptions);
						var ldwidth = parseInt(sleJson.adminData.SLELD.split(',')[0]);
						var ldheight = parseInt(sleJson.adminData.SLELD.split(',')[1]);
						var docwidth = parseInt(sleJson.DCKLD.split(',')[0]);
						var docheight = parseInt(sleJson.DCKLD.split(',')[1]);
						var textBoxBuffer = 20;
						
						var strokeWidth = 0;
						var strokeColor = 'transparent';
						var strokeEn = false;
						var fillColor = 'transparent';
							
						if(val.transparent_border === 'F'){
							strokeWidth = 1;
							strokeColor = '#999999';
							strokeEn = true;
						}
						/*if(val.distractor_label == 'T') {
							fillColor = '#faf8dd';
						}
						
						if(val.transparent === 'F'){
							fillColor = lbConfig.style.fill;
						}*/
			
						/* for distractor label color is yellow */
						if(val.transparent === 'F'){
							if(val.distractor_label == 'T') {
								fillColor = '#faf8dd';
							}else{
								fillColor = lbConfig.style.fill;
							}
						}else{//for fill unchecked distractor will not be transparent defect #4033
							if(val.distractor_label == 'T') {
								fillColor = '#faf8dd';
							}
						}
					
							var label = new Kinetic.Rect({
				                width: ldwidth,
				                height: ldheight,
				                stroke: strokeColor,
				                strokeWidth: strokeWidth,
				                cornerRadius: 5,
				                strokeEnabled: strokeEn,
				                fill: fillColor,
				                opacity:1,
				                id:'lbl_' + c                
							});
						
						lbGroup.add(label);
						var isDraggable = true;
						if(val.lockStatus)
							isDraggable = false;
						
						makeSLEResizable(lbGroup, ldwidth, ldheight);
						cs.dragLockUnlock(lbGroup,ldwidth,ldheight,isDraggable);
						
						var strokeWidth = 1;
						var strokeColor = '#999999'
						var strokeEn = false;
						var fillColor = 'transparent'
						var transOpacity = 0;
						var dashArrayValue = [10, 5];
						var dashArrayEnabled = true;
						var buffer = 20;
						
						if(val.transparent_border_1 === 'F'){
							strokeEn = true;
							dashArrayEnabled =false;
							
						}
						
						if(val.doc_transparent_value ==='solid'){
							transOpacity = 1;
							fillColor = '#fff';
						}else if(val.doc_transparent_value ==='semitransparent'){
							transOpacity = 0.5;
							fillColor = '#fff';
						}else{
							transOpacity = 1;
						}
						
						var dock = new Kinetic.Rect({					
						                width: docwidth,
						                height: docheight,				                
						                stroke: strokeColor,
						                strokeWidth: 1,
						                cornerRadius: 5,
						                strokeEnabled: true,
						                fill: fillColor,
						                dashArray: dashArrayValue,
						                dashArrayEnabled: dashArrayEnabled,
						                opacity:transOpacity,
						                id:'dock_' + 'lbl_' + c,
						                name : val.name
					       			});
						
						dockGroup.add(dock);
						
						cdLayer.add(dockGroup);
						
						makeSLEResizable(dockGroup,docwidth, docheight);
						
						var isDockDraggable = true;
						if(val.dockLockStatus)
							isDockDraggable = false;
						
						cs.dragLockUnlock(dockGroup,docwidth,docheight,isDockDraggable);
						
						if(val.connector_options.connectorPresent == 'T'){
							var connOption = {
									'connector_facing':val.connector_facing,
									'connector_mx':val.connector_mx_authoring,
									'connector_my':val.connector_my_authoring,
									'connector_lx':val.connector_lx_authoring,
									'connector_ly':val.connector_ly_authoring,
									'connector_options':{
											'connectorPresent':val.connector_options.connectorPresent,
											'connectorType':val.connector_options.connectorTypeAuthoring,
											'zoomingPresent':val.connector_options.zoomingPresent
										}
							};
							//Connector.renderConnector(dockGroup,connOption);
							Connector.renderConnector(dockGroup,connOption);
						}
						
						if(val.distractor_label == 'T') {
							dockGroup.hide();
						}		
						
						cdLayer.draw();
				
						val.labelGroupId = lbConfig.id;
						var textBoxGroup = cs.createGroup('txtGrp_'+c,{'x':10,'y':(ldheight-20)/2});
						var dockTextGrp = cs.createGroup('docktxtGrp_'+c,{'x':10,'y':(docheight-20)/2});
						var textBox = new Kinetic.Rect({
			                width: ldwidth-20,
			                height: 15,
			                fill: '#ffffff',
			                opacity:1,
			                id:'txtBox_'+c
			   			});
						var addTextObj = new Kinetic.Text({		        	
							text: 'Add Label Text',
					        fontSize: 14,
					        y:2,
					        fontFamily: 'sans-serif',
					        fill: '#555',  
					        width: ldwidth-20,
					        height: 'auto' ,
					        opacity: '1',
					        verticalAlign:'top',
				            id: 'addTxt_'+c,
				            name: 'nametxt',
				            align : 'center'
				          });		
						textBoxGroup.add(textBox);
						textBoxGroup.add(addTextObj);
						dockGroup.add(dockTextGrp);
						lbGroup.add(textBoxGroup);
						cdLayer.add(lbGroup);
						textBoxGroup.moveToTop();
						textBoxGroup.setY((label.getHeight() -20)/2);
						
						if(val.distractor_label == 'T'){
							addTextObj.setText("Add Distractor Text");
						}
						
						var sleTextTool= new TextTool.commonLabelText();
						
						if(val.label_value) {						
							 /*checking sb and sp tag in a text*/
							var textValue=val.label_value;
							var commonTextTool= new TextTool.commonLabelText();
							var textFormat = new TextFormat();
							if(commonTextTool.checkSubOrSuperTagExist(textValue)){
								//textValue=commonTextTool.convertSbSpscript(textValue);	
							}
						 
							/** ---- For dock text creation ---- **/
							//var textValue = val.label_value;
							//var dockTextGrp = SLEView.createDockTextObject('',c,dockGroup);
							
							/*get text formatinf details*/
							if(val.textFormat){
							 	var fontStyle=val.textFormat.fontStyle;
							 	var underline_value=val.textFormat.underline_value;
							 	var fontSize=val.textFormat.fontSize;
							 	var align=val.textFormat.align;
							}else{
								var fontStyle='normal';
							 	var underline_value='F';
							 	var fontSize=14;
							 	var align='center';
							}
								
							textBoxGroup = textFormat.createLabelText(textBoxGroup,textValue,align); 
							
							dockTextGrp = textFormat.createLabelText(dockTextGrp,textValue,align); 
							
							var dockCount = dockTextGrp.children.length-1;
							if(dockCount>0){
								var dockLastChild = commonTextTool.findLastTextchild(dockTextGrp,dockCount);
				  				var dockTextGrpHeight = dockTextGrp.children[dockLastChild].getY() + dockTextGrp.children[dockLastChild].getHeight();
				  				var dockTopPadding = (dockTextGrp.parent.children[0].getHeight()-dockTextGrpHeight)/2;
				  				
				  				if(dockTopPadding < 0)
				  					dockTopPadding = 0;
				  				dockTextGrp.setY(dockTopPadding);
							}
			  				
			  				
							textBox.setFill("transparent");
							addTextObj.hide();
							//textBoxGroup.add(editedTextObj);
							textBoxGroup.setY(0);
							
							var totWidth = label.getWidth();
							var totHeight = label.getHeight();
							
							if(SLEData.getJsonAdminData().DOCSAMEASLABEL == false){
								totWidth = parseInt(sleJson.DCKLD.split(',')[0]);
								totHeight = parseInt(sleJson.DCKLD.split(',')[1]);
							}
							
							if(val.textFormat && val.textFormat.underline_value == "T"){
								var textObj = textBoxGroup;
								var dockTxtObj = dockTextGrp;
								if(textObj){
									$("#UnderlinetTool").data('clicked', true);
								}
							}
						}
						/** For text middle align **/
						if(textBoxGroup.get('#addTxt_'+c)[0]){
							var count = textBoxGroup.children.length-1;
							var lastChild = sleTextTool.findLastTextchild(textBoxGroup,count);
							var textGrpHeight = textBoxGroup.children[lastChild].getY() + textBoxGroup.children[lastChild].getHeight();
							var topPadding = (textBoxGroup.parent.children[0].getHeight()-textGrpHeight)/2;
							if(topPadding < 0)
								topPadding = 0;
							textBoxGroup.setY(topPadding);			
						 }
						sleTextTool.bindLabelTextEvent(textBoxGroup);
						
						/*		
						addText.on("dblclick dbltap",function(evt){	
							var textGrp = this.parent;
							var evtObj = {selectorObj:textGrp,x:textGrp.getAbsolutePosition().x,y:textGrp.getAbsolutePosition().y+$('canvas').first().offset().top};
							var sleTextTool= new TextTool.labelText();
							sleTextTool.createTextBoxForLabel(evtObj);
							evt.cancelBubble = true;
						});
						*/
						
						lbGroup.on('mousedown',function(evt){
							cs.setActiveElement(this,'label');
							SLEView.showSavedHint(this);
							evt.cancelBubble = true;
							cs.updateDragBound(this);
							openInspector('label');
							var index = SLEData.getLabelIndex(lbGroup.getId());
							var showHide = $('#magnEnable').prop('checked');
							SLEView.showHideMagnificationBox(showHide,'local',index);
							window.CD.services.cs.updateMoveToTopBottomState(this);
							//this.moveToTop();
						});
						
						lbGroup.on('click',function(evt){
							evt.cancelBubble = true;
						});
						lbGroup.on('dragend',function(evt){
							evt.cancelBubble = true;
							SLEView.setActiveLabelPosition(this);
							ds.setOutputData();	
							cdLayer.draw();
						});
						
						dockGroup.on('mousedown',function(evt){
							cs.setActiveElement(this,'dock');
							SLEView.showSavedHint(this);
							evt.cancelBubble = true;
							cs.updateDragBound(this);
							openInspector('label');
							
							var index = SLEData.getLabelIndex(lbGroup.getId().split('dock_')[1]);
							var showHide = $('#magnEnable').prop('checked');
							SLEView.showHideMagnificationBox(showHide,'local',index);
							window.CD.services.cs.updateMoveToTopBottomState(this);
							//this.moveToTop();
						});
						
						dockGroup.on('click',function(evt){
							evt.cancelBubble = true;
						});
						
						dockGroup.on('dragend',function(evt){
							evt.cancelBubble = true;
							SLEView.setActiveLabelPosition(this,'dock');
							ds.setOutputData();	
							cdLayer.draw();
						});
						
						dock.on('mouseover',function(){
							SLEView.bindZoomEvent(this.parent);
						});
						if(val.zIndex == undefined){
							var sle = SLEData.getSLEIndex(lbGroup.attrs.id);
							window.CD.module.data.Json.SLEData[sle].zIndex = lbGroup.getZIndex();
						}
						
						/*
						if(val.textFormat.underline_value == "T"){
							 var baseLabelTxtTool= new TextTool.labelText(); 
							 var textObj = lbGroup.get('#lbltxt_'+lbGroup.attrs.id.split('_')[1])[0];
							 if(textObj)
							 baseLabelTxtTool.applyTextUnderline(textObj,textObj.parent,true);
							 $("#UnderlinetTool").data('clicked', true);
						}*/			
						
						if(val.media_value != "N"){
							var audioGrpId = 'audio_' + lbGroup.attrs.id;
							var x = (val.media_label_XY).split('|')[0];
							var y = (val.media_label_XY).split('|')[1];
							loadAudioImage(lbGroup,audioGrpId,val.media_value,x,y,true);			
						}
						/*if(val.media_dock_value != "N"){
							var audioGrpId = 'audio_' + dockGroup.attrs.id;
							var x = (val.media_dock_XY).split('|')[0];
							var y = (val.media_dock_XY).split('|')[1];
							loadAudioImage(dockGroup,audioGrpId,val.media_dock_value,x,y);			
						}*/
						
			           if(!val.visibility){
			             lbGroup.hide();
			             cdLayer.draw();
			          }
				       /*add info text in label*/
					       if(val.infoHideText==="T"){
					       	textBoxGroup.hide();
					       	
					       }
					       var param={
								labelGrpID:lbGroup.attrs.id,
								labelGrpObj:lbGroup,
								labelData:'',
								infoHideText:val.infoHideText,
								infoHintText:val.hint_value,
								infoFeedbackText:val.feedback_value,
								showLabel:true
							};
					     SLEView.createInfoTextObject(param);
					       if(val.image_data && val.image_data != "N"){
								var imageGrpId = 'img_' + lbGroup.attrs.id;				
								loadImageforLabel(lbGroup,imageGrpId,val.image_data,true);			
							}
					/*end here*/		       
						c++;
						if(sleDataArray.length > 0){
							//setTimeout(arguments.callee, 100);
							setTimeout(arguments.callee, 10); //For CTCD-216
						}
						if(sleDataArray.length == 0){
							ds.setOutputData();	
							/* ---- for hint / feedback ----- */
							if(window.CD.module.data.Json.SLEData.SLE0){
								
								var labelData = SLEData.getInspectorLabelData();
								var labelGrp = SLEData.getLabelGroup();
								
								SLEView.activelabelData(labelData,labelGrp);
								SLEView.populateLabelData(false,labelData);
								var adminData = SLEData.getJsonAdminData();
								var hintFeedbackType = adminData.showHintOrFeedbackInAuthoring;
								
								var feedbackType = adminData.FRO;
								if(feedbackType == 'L')
									feedbackType = 'label';
								if(feedbackType == 'D')
									feedbackType = 'dock';
								
								var hintType = adminData.HRO;
								if(hintType == 'L')
									hintType = 'label';
								if(hintType == 'D')
									hintType = 'dock';
								var hintFdbckVal = SLEData.getHintFeedbackFromJson();
								window.CD.module.view.bindFeedbackHintEventAllLabel(hintFeedbackType,hintType,feedbackType);
								if(hintFeedbackType == 'hint'){
									SLEView.createHintGroupAuth(hintFdbckVal.hintW,hintFdbckVal.hintH,hintFdbckVal.x,hintFdbckVal.y);
								}else{
									if(hintFeedbackType == 'feedback'){
										SLEView.createHintGroupAuth(hintFdbckVal.feedbackW,hintFdbckVal.feedbackH,hintFdbckVal.x,hintFdbckVal.y);
									}
								}
								var showZoomInAuth = adminData.showZoomInAuth;
								var zoomParam = SLEData.getZoomParametersFromJson();
								var w = zoomParam.zoomW;
								var h = zoomParam.zoomH;
								var scale = zoomParam.scale;
								if(showZoomInAuth == 'T'){
									SLEView.labelingMagnification({'width':w,'height':h,'showInAuth':showZoomInAuth,'scaleFactor':scale});
								}
								
								var status = SLEData.getMagnificationEnableLocGlob();
								if(status == 'T'){
									$('#magnEnable').prop('checked',true);
									if($('#magTableGlobal').length!=0){
										$('#magTableGlobal').remove();
									}
								}else if(status == 'F'){
									$('#magnEnable').prop('checked',false);
									SLEView.makeLabelGlobZoomDisable();
								}
								window.CD.module.data.globalConnectorType = $('#conEndPointGlob').html();
								
								var outputJson = SLEData.getJsonData();
								for(var dockCnt in outputJson){
									var labelGrpId = outputJson[dockCnt].labelGroupId;
									var dockGroup = cs.findGroup('dock_'+labelGrpId);
									var connector = outputJson[dockCnt].connector_options.connectorPresent;
									
									if(connector === 'T' && showZoomInAuth === 'T'){
										var dock = dockGroup.children[0];
										dock.on('mouseover',function(){
											
											SLEView.bindZoomEvent(dockGroup);
										});
										
									}
								}
							}
							var globalHideTextcheck = false;
							var labelCountForHideText = 0;
							for(key in window.CD.module.data.Json.SLEData){
								if(window.CD.module.data.Json.SLEData[key].infoHideText == 'F'){
									globalHideTextcheck = true;				
								}				
								labelCountForHideText++;
							}
							if(globalHideTextcheck == false && labelCountForHideText!=0){
								$('#hideTextGlobal').prop('checked',true);
							}
							SLEView.resetConnectorPos();	
							for(var key in sleData){
								var label = cdLayer.get('#'+sleData[key].labelGroupId)[0];
								var dockId = 'dock_'+label.attrs.id;
								label.setZIndex(sleData[key].zIndex);
								cdLayer.get('#'+dockId)[0].setZIndex((sleData[key].zIndex+1));
							}
						}	
						cdLayer.draw();
						
					},100);
							
					//});
				}
			
			function fixTextEntities( input ){
			    var result = (new String(input)).replace(/&(amp;)/g, "&");
			    return result.replace(/&#(\d+);/g, function(match, number){ return String.fromCharCode(number); });
			}
			
			
			
		}catch(err){
			console.log("Error @sleView.showSLELabel::"+err.message);
		}
				
	},

	/*******************************************************/
	
	/**
	 * function name: labelToolClickHandler()
	 * description:on click on label tool
	 * this method get called.
	 * author:Piyali Saha
	 */
	labelToolClickHandler :function(e){
		  //var lt = window.CD.services.ts.labeltool;
		  e.preventDefault();
		  var labelModal = window.CD.util.getTemplate({url: 'resources/themes/default/views/label_modal.html?{build.number}'});
		  this.labelToolOptions(labelModal);
		  
		  $("#labelContainer input.input_text").bind('keydown',function(e){
				var inputVal = $(this).val();
				var key = e.charCode || e.keyCode || 0;
				$("#labelContainer .warning_text").hide();
				$('.label_options .input_text').removeClass("warning_input");
		        // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
		       if(!e.shiftKey){
		    	   return (
			            key == 8 || 
			            key == 9 ||
			            key == 46 ||
			            (key >= 37 && key <= 40) ||
			            (key >= 48 && key <= 57) ||
			            (key >= 96 && key <= 105));
		       }else{
		    	   return false;
		       }
			});
		  
		  $("#labelContainer span#labelOk").off('click').on('click',function(){
			  
			 $('#labelOverlay').remove();
			 var ds = window.CD.services.ds;
			 var regex = /[0-9 -()+]+$/;
			 var labelCnt = $('.label_options .label_count').val();
			 var distractorCnt = $('.label_options .distractor_count').val();
			 if(regex.test(labelCnt) && regex.test(distractorCnt)){
				 if($('.label_options .label_count').val() != "" && $('.label_options .distractor_count').val() != "" && parseInt($('.label_options .label_count').val()) <= 15 && parseInt($('.label_options .distractor_count').val()) <= 15){				 
					 if($('.label_options .label_count').val() != 0 || $('.label_options .distractor_count').val()!= 0 ){
			    	ds.totalElm = $('.label_options .label_count').val();
					 //createLabelCommand.execute();						 
					 $('#labelModal').slideUp(200);
					 $('.tool_select').trigger('click');
					 window.CD.module.view.createNewLabel($('.label_options .label_count').val(),$('.label_options .distractor_count').val());
					 $('#maskTool').remove();
					 }
					 else
						 validation.showLabelErrorPOPUP(6);
				}else{
					
					 if($('.label_options .label_count').val() > 15 || $('.label_options .distractor_count').val() > 15){
						 validation.showLabelErrorPOPUP(1);			
		                  }
					 if((parseInt($('.label_options .label_count').val()) != "" && parseInt($('.label_options .distractor_count').val()) == "")){
						 validation.showLabelErrorPOPUP(1);			
		             }
					 if(($('.label_options .label_count').val() == "" && $('.label_options .distractor_count').val() != "")||($('.label_options .label_count').val() != "" && $('.label_options .distractor_count').val() == "")){
						 validation.showLabelErrorPOPUP(5);			
		                  }
					 
					 if($('.label_options .label_count').val() == 0 && $('.label_options .distractor_count').val()== 0){
						  validation.showLabelErrorPOPUP(5);
		                  }
	                    /* if($('.label_options .dock_count').val() == "" && ds.getOptionLabel() == "OTM"){
		                            $("#labelContainer #dock_warning_blank").show();
		                            $('.label_options .dock_count').addClass("warning_input");
		                         }*/
		               if($('.label_options .distractor_count').val() == ""){
		            	   validation.showLabelErrorPOPUP(5);
		                  // $('.label_options .distractor_count').addClass("warning_input");
		                  }
					}
			 }else{
				 validation.showLabelErrorPOPUP(25);
			 }
			                          
		  });
		  $("#labelContainer span#labelCancel").off('click').on('click',function(){
			  $('#maskTool').remove();
			  $('#labelOverlay').remove();
			  $('#labelModal').slideUp(200);
			  $('.tool_select').trigger('click');
		  });
		  
		 // createLabelCommand.execute();
		  //activateLabelCommand.execute();
		  //lt.execute("create_label", lt.createLabel());
		  //handle the command 
		  //lt.handle("create_label", lt.activate());
	  },	
		
	labelToolOptions: function(labelModal){
      var ds =window.CD.services.ds;
      var lblOptions = ds.getOptionLabel();
      var otmCheck = window.CD.module.data.Json.adminData;
      $(labelModal).remove();
      $('#labelModal').remove();
      $('body').append(labelModal);
	  if(otmCheck.OTM == true){
		  $('#labelCount').text("How many docks would you like to create?");
		  var noteSpan = $('</br><span><b>Note:</b> you will have fewer labels than docks when some labels are duplicates</span>');
		  $('#labelCount').append(noteSpan);
	  }
	  if(otmCheck.OTM == true){
		  $('#labelOrBlock').html('<span>docks</span>');
	  }else{
		  $('#labelOrBlock').html('<span>labels</span>');
	  }
     
	  //$('#labelAlertText').html('<span class="heading_text">'+ds.getOptionLabelText()+'</span>');
	  $('#labelModal').css('left', (($('#toolPalette').width()/2) - ($('#labelModal').width()/2))+'px');
	  $('#labelModal').css('top', (($('#canvasHeight').val()/2) - ($('#labelModal').height()/2))+'px');
	  $('#labelModal').slideDown(200);
},
	createNewLabel : function(totalLabelToCreate,totalDistractorsToCreate,totalDockstoCreate) {
		console.log("@LabelTool.createLable.execute::");console.log("@window.CD.services.labeltool.createLabel");
		try{
			var cs = window.CD.services.cs;
			var stg = cs.getCanvas();
			var cdLayer = cs.getLayer();
			var lbConfig = new LabelConfig();
			var ds = window.CD.services.ds;
			//var totalLabelToCreate = ds.totalElm;
			console.info("lbConfig.p_id::"+lbConfig.p_id);
			var labelCount = cs.objLength(window.CD.module.data.Json.SLEData);			
			var labelGroupStartId = labelCount;
			var dockWidth = lbConfig.style.width;
			var dockHeight = lbConfig.style.height;
            var totdockLbl = 0,isDistractor = false,c=0,d=0,x=0;
			var textBoxBuffer = 20;
                
			var undoMng = window.CD.undoManager;
			
			if(labelCount) {
				var labelGroupId = SLEData.getJsonData()['SLE0'].labelGroupId;
				var lblGroup = cs.findGroup(labelGroupId);
				var dockGroup = cs.findGroup('dock_' + labelGroupId);
				labelGroupStartId = SLEData.getLabelStartId();
				lbConfig.style.width = lblGroup.children[0].getWidth();
				lbConfig.style.height = lblGroup.children[0].getHeight();
				dockWidth = dockGroup.children[0].getWidth();
				dockHeight = dockGroup.children[0].getHeight();
			}
           
            totalLabelToCreate = parseInt(totalLabelToCreate);
            totalDistractorsToCreate = parseInt(totalDistractorsToCreate);
            var newLabels = totalLabelToCreate+totalDistractorsToCreate;
			var totlblCount = labelGroupStartId + totalLabelToCreate + totalDistractorsToCreate;
            var distractorCount = totlblCount - totalDistractorsToCreate;
            
            /* ------- Modified for label overlap ---------- */
            var overLapVal = 0;
            var canvasHeight = parseInt(stg.getHeight());
            var labelHeight = parseInt(lbConfig.style.height);
            var newCanvasHeight = (canvasHeight-70)-labelHeight;
            var approxAllLabelSpace = parseInt(totlblCount)*lbConfig.style.height;
            if(approxAllLabelSpace>newCanvasHeight){
            	overLapVal = newCanvasHeight/parseInt(totlblCount);
            }else{
            	newCanvasHeight = approxAllLabelSpace;
            	overLapVal = newCanvasHeight/parseInt(totlblCount);
            }
            
           
            window.CD.module.data.Json.adminData.SLELD = lbConfig.style.width + ',' + lbConfig.style.height;
			window.CD.module.data.Json.DCKLD = lbConfig.style.width + ',' + lbConfig.style.height;
			
			if(labelCount && window.CD.module.data.Json.adminData.DOCSAMEASLABEL == false){
	           	window.CD.module.data.Json.DCKLD = dockWidth + ',' +dockHeight;
	        }
            ds.setOutputData();
            
			for(var i = labelGroupStartId; i<totlblCount; i++) {
				var labelData = cs.cloneObject(sleDataDefaults);
				var holder_x = 100;
				var holder_y = 50 + (i*parseInt(overLapVal));
				var doc_x = 100+lbConfig.style.width+10;
				var doc_y = 50 + (i*parseInt(overLapVal));
				var canvasWidth = stg.attrs.width;
				var canvasHeight = stg.attrs.height;
				
				labelData.doc_x = doc_x;
				labelData.doc_y = doc_y;
				labelData.holder_x = holder_x;
				labelData.holder_y = holder_y;
				labelData.labelGroupId = 'label_'+i;
				labelData.lockStatus = false;
				labelData.name = 'label_'+i;
				labelData.transparent_border = "F";
				labelData.transparent_border_1= "F";
				labelData.transparent = "F";
				labelData.doc_transparent_value = "semitransparent";
				
				
				if(labelCount) {
					labelData = SLEView.setLabelDockProperties(labelData);
				}else{//Setting values for hint/feedback needed for X,Y
					
					/* --- updating value for x,y of hint/feedback placeholder for 0,0 --- */
					var hintFeedbackParam = SLEData.getHintFeedbackFromJson();
					if(hintFeedbackParam.x == 0){
						var hintFeedbackX = canvasWidth-50;
					}
					if(hintFeedbackParam.y == 0){
						var hintFeedbackY = canvasHeight-100;
					}
					SLEData.setHintFdbckToJson('','',hintFeedbackX,hintFeedbackY);
					
					/* --- for zoom position --- */
					
					var x = parseInt($('#canvasWidth').val())-50;
					var y = parseInt($('#canvasHeight').val())-50;
					
					SLEData.setZoomParametersToJson('','',x,y,'');
				}
				
				/*Creation of label
				 * */
				var labelDockObject = this.createLabelObject(i,overLapVal,labelData);
				labelData.zIndex = labelDockObject.labelobject.getZIndex();
				/*this method will handle hide text checkbox click on click part*/
				/*add info text in label*/
				var param={
						labelGrpID:labelDockObject.labelobject.attrs.id,
						labelGrpObj:labelDockObject.labelobject,
						labelData:labelData,
						
				};
				this.createInfoTextObject(param);
				/*end here*/
				
				 if(i == distractorCount){
			            this.createDistractor(labelDockObject.labelobject,labelDockObject.dockobject);                                   
			            d++;
			            if(d != totalDistractorsToCreate)
			            distractorCount++;
			        }         
				
			}
			undoMng.register(this,SLEView.deleteNewLabels,[newLabels,labelGroupStartId],'undo all label create',this,SLEView.createNewLabel,[totalLabelToCreate,totalDistractorsToCreate,totalDockstoCreate],'undo all label create');
			updateUndoRedoState(undoMng);
			//window.CD.module.data.Json.SLEPS['totalRandomLabels'] = "";
			//window.CD.module.data.Json.SLEPS['totalRandomDistractors'] = "";
			SLEData.customPublishFlag = false;
			//SLEData.applyClickPublishOk();
						
		}catch(err){
			console.error("@sleView.createLabel::Error while creating Label::"+err.message);
		}	
	},       
	
	setLabelDockProperties : function(labelData){
		try{
			if(window.CD.module.data.Json.SLEData.SLE0.transparent_border_1 == "F"){
				labelData.transparent_border_1 = "F";
			}
			else{
				labelData.transparent_border_1 = "T";
			}
			
			if(window.CD.module.data.Json.SLEData.SLE0.transparent_border == "F"){
				labelData.transparent_border = "F";
			}
			else{
				labelData.transparent_border = "T";
			}
			
			if(window.CD.module.data.Json.SLEData.SLE0.transparent == "F"){
				labelData.transparent = "F";
			}
			else{
				labelData.transparent = "T";
			}

			if(window.CD.module.data.Json.SLEData.SLE0.doc_transparent_value == "transparent"){
				labelData.doc_transparent_value = "transparent";
			}
			else if(window.CD.module.data.Json.SLEData.SLE0.doc_transparent_value == "semitransparent"){
				labelData.doc_transparent_value = "semitransparent";
			}
			else if(window.CD.module.data.Json.SLEData.SLE0.doc_transparent_value == "solid"){
				labelData.doc_transparent_value = "solid";
			}
			return labelData;
		}
		catch(error){
			console.info("Error inside sleView::setLabelDockProperties()"+ error.message);
		}
	},
		createLabelObject :function(i,overLapVal,labelData){
			var cs = window.CD.services.cs;
			var stg = cs.getCanvas();
			var cdLayer = cs.getLayer();
			var ds = window.CD.services.ds;
			var labelCount = cs.objLength(window.CD.module.data.Json.SLEData);
			var labelWidth = parseInt(window.CD.module.data.Json.adminData.SLELD.split(',')[0]);
			var labelHeight = parseInt(window.CD.module.data.Json.adminData.SLELD.split(',')[1]);
			var dockWidth = parseInt(window.CD.module.data.Json.DCKLD.split(',')[0]);
			var dockHeight = parseInt(window.CD.module.data.Json.DCKLD.split(',')[1]);
			var undoMng = window.CD.undoManager;
			var lbConfig = new LabelConfig();
			var lblGrpOptions = {draggable:true,x:labelData.holder_x,y: labelData.holder_y};			
			var dockGrpOptions = {draggable:true,x:labelData.doc_x,y:labelData.doc_y };
			var labelGroup = cs.createGroup('label_'+i,lblGrpOptions);
			var dockGroup = cs.createGroup('dock_label_'+i,dockGrpOptions);
			var val = labelData;
			lbConfig.id = 'lbl_' + i;
			var textBoxBuffer = 20;
			
			if(val.transparent_border === 'F'){
				strokeWidth = 1;
				strokeColor = '#999999';
				strokeEn = true;
			}
			
			if(val.transparent === 'F'){
				fillColor = lbConfig.style.fill;
			}
			if(val.distractor_label == 'T') {
				fillColor = '#faf8dd';
			}
		
			
			
			var label = new Kinetic.Rect({
			                width: labelWidth,
			                height: labelHeight,						                
			                stroke: strokeColor,
			                strokeWidth: strokeWidth,
			                cornerRadius: 5,
			                strokeEnabled: strokeEn,
			                fill: fillColor,
			                opacity:1,
			                id: lbConfig.id
	           			});
			var textBoxGroup = cs.createGroup('txtGrp_'+i,{'x':10,'y':(labelHeight-20)/2});
			var docktextBoxGroup = cs.createGroup('docktxtGrp_'+i,{'x':10,'y':(labelHeight-20)/2});
			var textBox = new Kinetic.Rect({
	            width: labelWidth-20,
	            height: 15,
	            fill: '#ffffff',
	            opacity:1,
	            id:'txtBox_'+i
				});
			var addTextObj = new Kinetic.Text({		        	
				text: 'Add Label Text',
		        fontSize: 14,
		        y:2,
		        fontFamily: 'sans-serif',
		        fill: '#555',  
		        width: labelWidth-20,
		        height: 'auto',
		        opacity: '1',
		        verticalAlign:'top',
	            id: 'addTxt_'+i,
	            name: 'nametxt',
	            align : 'center'
	          });
	
			labelGroup.add(label);
			textBoxGroup.add(textBox);
			textBoxGroup.add(addTextObj);
			labelGroup.add(textBoxGroup);			
			cdLayer.add(labelGroup);
			cdLayer.add(dockGroup);
			//textBoxGroup.show();
			textBoxGroup.moveToTop();
			textBoxGroup.setY((label.getHeight() - addTextObj.getHeight())/2);
	
			var active = {};
			active.element = labelGroup;
			
			//undoMng.register(this,SLEView.deleteLabel,[active],'Undo label create');
			
			var sleTextTool= new TextTool.commonLabelText();
			sleTextTool.bindLabelTextEvent(textBoxGroup);
			
			cdLayer.draw();
			makeSLEResizable(labelGroup, labelWidth, labelHeight);	
			cs.dragLockUnlock(labelGroup,parseInt(labelWidth),parseInt(labelHeight),true);
			//ds.setActiveElement(labelGroup,'label');	
			
			var strokeWidth = 1;
			var strokeColor = '#999999'
			var strokeEn = false;
			var fillColor = '#fff'
			var transOpacity = 0;
			var dashArrayValue = [10, 5];
			var dashArrayEnabled = true;
			var buffer = 20;
			
			if(val.transparent_border_1 === 'F'){
				strokeEn = true;
				dashArrayEnabled =false;
				
			}
			if(val.transparent === 'F'){
				fillColor = '#ffffff';
			}
			if(val.doc_transparent_value ==='solid'){
				fillColor = '#ffffff'
				transOpacity = 1;
			}else if(val.doc_transparent_value ==='semitransparent'){
				fillColor = '#ffffff'
				transOpacity = 0.5;
			}else{
				fillColor = 'transparent'
				transOpacity = 1;
			}
			
			
			
			var dock = new Kinetic.Rect({					
		                width: dockWidth,
		                height: dockHeight,						                
		                stroke: strokeColor,
		                strokeWidth: 1,
		                cornerRadius: 5,
		                strokeEnabled: true,
		                fill: fillColor,
		                dashArray: dashArrayValue,
		                dashArrayEnabled: dashArrayEnabled,
		                opacity:transOpacity,
		                id:'dock_'+lbConfig.id,
		                name : 'label_'+i
	       			});
			dockGroup.add(dock);
			dockGroup.add(docktextBoxGroup);
			makeSLEResizable(dockGroup, dockWidth, dockHeight);	
			var isDockDraggable = true;
			if(labelData.dockLockStatus)
				isDockDraggable = false;
			
			cs.dragLockUnlock(dockGroup,dockWidth, dockHeight,isDockDraggable);
			var connectorOptions = 'Default';//$('#connectorOptionLocal').html();				
			cdLayer.draw();
			
			window.CD.module.data.Json.SLEData['SLE'+labelCount] = labelData;			
			SLEData.reIndexLabels();
			ds.setOutputData();
			
			if(val.connector_options.connectorPresent == 'T'){
				var connOption = {
						'connector_facing':val.connector_facing,
						'connector_mx':val.connector_mx,
						'connector_my':val.connector_my,
						'connector_lx':val.connector_lx,
						'connector_ly':val.connector_ly,
						'connector_options':{
								'connectorPresent':val.connector_options.connectorPresent,
								'connectorType':val.connector_options.connectorType,
								'zoomingPresent':val.connector_options.zoomingPresent
							}
				};
				
				//Connector.renderConnector(dockGroup,connOption);
				//setTimeout(Connector.renderConnector(dockGroup,connOption),100);
				setTimeout(Connector.renderConnector(dockGroup,connOption),10);//For CTCD-216
			}
			
			if(val.distractor_label == 'T') {
				dockGroup.hide();
			}		
			if(val.distractor_label == 'T'){
				addTextObj.setText("Add Distractor Text");
			}
			if(val.visibility == false){
				dock.attrs.name = val.name;
				labelGroup.hide();
			}
			if(val.label_value/* && val.visibility == true*/) {	//Commented otherwise dock text was not appearing for label OTM				
				 /*checking sb and sp tag in a text*/
				var textValue=val.label_value;
				var textFormat = new TextFormat();
				var commonTextTool = new TextTool.commonLabelText();
				if(commonTextTool.checkSubOrSuperTagExist(textValue)){
					//textValue = commonTextTool.convertSbSpscript(textValue);	
				}
			 
				/*get text formatinf details*/
				if(val.textFormat){
				 	var fontStyle=val.textFormat.fontStyle;
				 	var underline_value=val.textFormat.underline_value;
				 	var fontSize=val.textFormat.fontSize;
				 	var align=val.textFormat.align;
				}else{
					var fontStyle='normal';
				 	var underline_value='F';
				 	var fontSize=14;
				 	var align='center';
				}
				if(val.visibility == true){//For OTM labels label text will not be created
					textBoxGroup = textFormat.createLabelText(textBoxGroup,textValue,align); 
					var ltextCount = textBoxGroup.children.length-1;
					if(ltextCount>0){
						var lLastChild = commonTextTool.findLastTextchild(textBoxGroup,ltextCount);
		  				var lTextGrpHeight = textBoxGroup.children[lLastChild].getY() + textBoxGroup.children[lLastChild].getHeight();
		  				var lTopPadding = (textBoxGroup.parent.children[0].getHeight()-lTextGrpHeight)/2;
		  				
		  				if(lTopPadding < 0)
		  					lTopPadding = 0;
		  				textBoxGroup.setY(lTopPadding);
					}
				}
				dockTextGrp = textFormat.createLabelText(docktextBoxGroup,textValue,align); 
				
				var dockCount = dockTextGrp.children.length-1;
				if(dockCount>0){
					var dockLastChild = commonTextTool.findLastTextchild(dockTextGrp,dockCount);
	  				var dockTextGrpHeight = dockTextGrp.children[dockLastChild].getY() + dockTextGrp.children[dockLastChild].getHeight();
	  				var dockTopPadding = (dockTextGrp.parent.children[0].getHeight()-dockTextGrpHeight)/2;
	  				
	  				if(dockTopPadding < 0)
	  					dockTopPadding = 0;
	  				dockTextGrp.setY(dockTopPadding);
				}
  				
  				
				textBox.setFill("transparent");
				addTextObj.hide();
				//textBoxGroup.add(editedTextObj);
				//textBoxGroup.setY(0);
				
				var totWidth = label.getWidth();
				var totHeight = label.getHeight();
							
				/** For text middle align **/
				if(textBoxGroup.get('#addTxt_'+c)[0]){	
					var count = textBoxGroup.children.length-1;
					var lastChild = sleTextTool.findLastTextchild(textBoxGroup,count);
					var textGrpHeight = textBoxGroup.children[lastChild].getY() + textBoxGroup.children[lastChild].getHeight();
					var topPadding = (textBoxGroup.parent.children[0].getHeight()-textGrpHeight)/2;
					if(topPadding < 0)
						topPadding = 0;
					textBoxGroup.setY(topPadding);			
				 }
				
				
				if(SLEData.getJsonAdminData().DOCSAMEASLABEL == false){
					totWidth = parseInt(sleJson.DCKLD.split(',')[0]);
					totHeight = parseInt(sleJson.DCKLD.split(',')[1]);
				}
				
				if(val.textFormat && val.textFormat.underline_value == "T"){
					var textObj = textBoxGroup;
					var dockTxtObj = dockTextGrp;
					if(textObj){
						$("#UnderlinetTool").data('clicked', true);
					}
				}
			}
			sleTextTool.bindLabelTextEvent(textBoxGroup);
						
			
			
			labelGroup.on('mousedown',function(evt){
				cs.setActiveElement(this,'label');
				SLEView.showSavedHint(this);
				evt.cancelBubble = true;
				cs.updateDragBound(this);
				openInspector('label');
				window.CD.services.cs.updateMoveToTopBottomState(this);
				//this.moveToTop();
				//SLEData.setZindex(this);
			});
			
			labelGroup.on('click',function(evt){
				evt.cancelBubble = true;
			});
			
			labelGroup.on('dragend',function(evt){
				evt.cancelBubble = true;
				SLEView.setActiveLabelPosition(this);
				ds.setOutputData();	
			});
			dockGroup.on('mousedown',function(evt){
				cs.setActiveElement(this,'dock');
				SLEView.showSavedHint(this);
				evt.cancelBubble = true;
				cs.updateDragBound(this);
				openInspector('label');
				window.CD.services.cs.updateMoveToTopBottomState(this);
				//this.moveToTop();
			});
			
			dockGroup.on('click',function(evt){
				evt.cancelBubble = true;
			});
					
			dockGroup.on('dragend',function(evt){
				evt.cancelBubble = true;
				SLEView.setActiveLabelPosition(this,'dock');
				ds.setOutputData();	
				cdLayer.draw()
			});
			
			dock.on('mouseover',function(){
				SLEView.bindZoomEvent(this.parent);
			});
			
			
			var labelDock ={};
			labelDock.labelobject = labelGroup;
			labelDock.dockobject = dockGroup;
			if(val.media_value != 'N'){
				var audioGrpId = 'audio_' + labelGroup.attrs.id;	
				var audioName = val.media_value
				var audioX = parseInt(val.media_label_XY.split('|')[0]);
				var audioY = parseInt(val.media_label_XY.split('|')[1]);
				loadAudioImage(labelGroup,audioGrpId,audioName,audioX,audioY);
			}
			/*if(val.media_dock_value != 'N'){
				var audioGrpId = 'audio_' + dockGroup.attrs.id;	
				var audioName = val.media_dock_value;
				var audioX = parseInt(val.media_dock_XY.split('|')[0]);
				var audioY = parseInt(val.media_dock_XY.split('|')[1]);
				loadAudioImage(dockGroup,audioGrpId,audioName,audioX,audioY);
			}*/
			if(val.image_data && val.image_data != "N"){
				var imageGrpId = 'img_' + labelGroup.attrs.id;				
				loadImageforLabel(labelGroup,imageGrpId,val.image_data);			
			}
	        return labelDock;
		
		},
        createDistractor: function(labelGroup,dockGroup){
            var cs = window.CD.services.cs;
            var ds = window.CD.services.ds;
            var cdLayer = cs.getLayer();
            var sle = SLEData.getSLEIndex(labelGroup.attrs.id);
            dockGroup.hide();
            labelGroup.children[0].setFill('#faf8dd');
            var addTxtObj = labelGroup.get('#addTxt_'+labelGroup.attrs.id.split('_')[1])[0]; 
            addTxtObj.setText("Add Distractor Text");
            cdLayer.draw();
            window.CD.module.data.Json.SLEData[sle].distractor_label = 'T';
            ds.setOutputData();
        },
	
	removeLabels : function() {
		try{
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var ds = window.CD.services.ds;
			var  outputJson = window.CD.module.data.Json;
			var labelCount = cs.objLength(window.CD.module.data.Json.SLEData);
			
			for(var i=0; i<labelCount; i++){
				var labelGrpId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
				var label = cs.findGroup(labelGrpId);
				var sleIndex = SLEData.getSLEIndex(labelGrpId);
				var dock = cs.findGroup('dock_'+labelGrpId);
				this.removeImageFromLabel(label);
				this.removeTextFromLabel(label);
				this.removeAudioFromLabel(label);
				cs.deleteSubGroups(label);
				//label.removeChildren();
				label.remove();
				//label.destroy();
				dock.removeChildren();
				dock.remove();
				dock.destroy();
				cdLayer.draw();	
				delete outputJson.SLEData[sleIndex];
			}		
			
			SLEData.reIndexLabels();
			SLEView.removeZoomPlaceHolder();		
			cs.setActiveElement(cs.findGroup('frame_0'),'frame');
			cs.resetToolbar();
			ds.setOutputData();	
		}catch(err){
			console.log("Error @sleView.removeLabels::"+err.message);
		}
				
	
	},
	deleteLabel : function(active) {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;
		var jsonArray = new Array();
		var activeLabelId = new Array();
		var undoMng = window.CD.undoManager;
		var textFormat = new TextFormat();
		var obj ={};
		obj.element = [];
		var dckCount = cs.objLength(window.CD.module.data.Json.SLEData);
		for(var j=0;j<active.element.length; j++){
			var activeElm = active.element[j];
			var totRndmLbl = window.CD.module.data.Json.SLEPS['totalRandomLabels'];
			var totRndmDist = window.CD.module.data.Json.SLEPS['totalRandomDistractors'];
			
			if(active.element[j])
				activeElm = cs.findGroup(active.element[j].attrs.id);
			
			var  outputJson = window.CD.module.data.Json;
			lblId = activeElm.attrs.id;		
			obj.element.push(activeElm);
			var labelIndex = SLEData.getLabelIndex(lblId);
			var sleData = window.CD.module.data.Json.SLEData;
			var distractorVal = sleData[labelIndex].distractor_label;
			var activelblGrpName = sleData[labelIndex].name;
			/*if(distractorVal == 'T'){
				totRndmDist--;
			}else{
				if(distractorVal == 'F'){
					totRndmLbl--;
				}
			}			
			window.CD.module.data.Json.SLEPS['totalRandomLabels'] = totRndmLbl;
			window.CD.module.data.Json.SLEPS['totalRandomDistractors'] = totRndmDist;*/
			var images = activeElm.get('.img')[0];
			if(images){
				var imageSrc = images.getImage().src.split('/');
				var imageName = imageSrc[imageSrc.length-1];
			}
			for(var i=0; i<dckCount;i++){	
				if(window.CD.module.data.Json.SLEData['SLE'+i] != undefined){
					var labelGrpId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
					var dck = cs.findGroup('dock_'+labelGrpId);
					var labelGrpName = window.CD.module.data.Json.SLEData['SLE'+i].name;
					
					if(activelblGrpName == labelGrpName){
						var dockIndex = SLEData.getSLEIndex(labelGrpId);
						
						var dckTxtGrp = dck.get('#docktxtGrp_'+labelGrpId.split('_')[1])[0];
						textFormat.deleteEachLabelText(dckTxtGrp);
						cdLayer.draw();
						window.CD.services.cs.deleteSubGroups(dck);
						dck.destroy();
						var lbl = cs.findGroup(labelGrpId);
						if(lbl){
							activeLabelId.push(lbl.attrs.id);	
							var lblTxtGrp = lbl.get('#txtGrp_'+labelGrpId.split('_')[1])[0];
							textFormat.deleteEachLabelText(lblTxtGrp);
							lbl.destroy();	
							window.CD.services.cs.deleteSubGroups(lbl);
						}
						jsonArray.push(outputJson.SLEData[dockIndex]);
						cdLayer.draw();				
						delete outputJson.SLEData[dockIndex];
						//cs.setActiveElement(cs.findGroup('frame_0'),'frame');
					}
				}
				
			}
			if(imageName){
				window.CD.services.ds.updateImageList(imageName,'remove');
			}
		}
		undoMng.register(this, SLEView.undoLabelDelete,[jsonArray,activeLabelId] , 'Delete Dock',this, SLEView.deleteLabel,[obj] , 'Redo Delete Dock');
		updateUndoRedoState(undoMng);
		SLEData.reIndexLabels();
		cs.setActiveElement(cs.findGroup('frame_0'),'frame');
		cs.resetToolbar();
		ds.setOutputData();			
	},
	undoLabelDelete : function(labelData,labelIndex) {
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();		
		var undoMng = window.CD.undoManager;
		
		for(var i=0; i<labelData.length;i++){
			var labelJson = SLEData.getJsonData();
			var labelCount = cs.objLength(labelJson);
			if(labelIndex[i].match(/^dock_label_[0-9]+/)){
				labelIndex = labelIndex[i].split('dock_')[1];
			}
			var counter = labelIndex[i].split('_')[1];
			
			var labeldockobj = SLEView.createLabelObject(counter,30,labelData[i]);
			var dockGroup = labeldockobj.dockobject;
			/* For dock text */
			//SLEView.addDockTextOnUndoDelete(dockGroup,labelData[i],counter);
			labelJson['SLE'+labelCount] = labelData[i];	
			labelJson['SLE'+labelCount].labelGroupId = labelIndex[i];	
			labelJson['SLE'+labelCount].name = labelData[i].name;
			//var totRndmLbl = window.CD.module.data.Json.SLEPS['totalRandomLabels'];
			//var totRndmDist = window.CD.module.data.Json.SLEPS['totalRandomDistractors'];
			var lblId = labelData[i].name;		
			var sleData = window.CD.module.data.Json.SLEData;
			var distractorVal = sleData['SLE'+labelCount].distractor_label;
			/*if(distractorVal == 'T'){
				totRndmDist++;
			}else{
				if(distractorVal == 'F'){
					totRndmLbl++;
				}
			}			
			window.CD.module.data.Json.SLEPS['totalRandomLabels'] = totRndmLbl;
			window.CD.module.data.Json.SLEPS['totalRandomDistractors'] = totRndmDist;*/
			SLEData.reIndexLabels();
			/*add info text in label*/
			var param={
					labelGrpID  : labeldockobj.labelobject.getId(),
					labelGrpObj : labeldockobj.labelobject,
					labelData : '',
					infoHideText : labelData[i].infoHideText,
					infoHintText : labelData[i].hint_value,
					infoFeedbackText : labelData[i].feedback_value,
					showLabel : true
			};
			SLEView.createInfoTextObject(param);
			/*end here*/
			cdLayer.draw();
			ds.setOutputData();
		}

	},
	/***
	 * This method is used for adding dock text on undo label delete with
	 * text in it
	 */
	addDockTextOnUndoDelete : function(dockGroup,val,c){
		try{
			var textValue=val.label_value;
			var sleJson = window.CD.module.data.Json;
			var cs = window.CD.services.cs;
			var dock = dockGroup.getChildren(0)[0];
			var totWidth = dock.getWidth();
			var totHeight = dock.getHeight();
			
			/* get text formating details */
			if(val.textFormat){
			 	var fontStyle=val.textFormat.fontStyle;
			 	var underline_value=val.textFormat.underline_value;
			 	var fontSize=val.textFormat.fontSize;
			 	var align=val.textFormat.align;
			}else{
				var fontStyle='normal';
			 	var underline_value='F';
			 	var fontSize=14;
			 	var align='center';
			}

			/* get dock height width */
			var docwidth = parseInt(sleJson.DCKLD.split(',')[0]);
			var docheight = parseInt(sleJson.DCKLD.split(',')[1]);
			var textBoxBuffer = 20;

			/* create dock text group */
			var dockTextGrp = cs.createGroup('docktxtGrp_'+c,{'x':10,'y':(docheight-20)/2});
			dockGroup.add(dockTextGrp);
			
			/* Create dock text object */
			var editedTextObjectDockOption={type:"Text",
									kinteticOpt:{text: SLEView.fixTextEntities(textValue),
							 					fontSize: fontSize,fontFamily: 'sans-serif',fontStyle:fontStyle,
							 					 fill: '#888',width: (docwidth - textBoxBuffer),height: 'auto' ,opacity: '1',
							 					 verticalAlign:'middle',id:'dock_txt_'+c,align : align}
							}	
			var editedDockTextObj = SLEView.createKineticObject(editedTextObjectDockOption); 
			
			dockTextGrp.add(editedDockTextObj);
			dockTextGrp.setY(0);

			/* dock text adjustment and alignment */
			if(editedDockTextObj.getTextWidth() > docwidth){
				editedDockTextObj.setWidth(docwidth - textBoxBuffer);
			}

			if(editedDockTextObj.getTextWidth() > docwidth){
				editedDockTextObj.setWidth(docwidth - textBoxBuffer);
			}
			
			var originalTextHeight = editedDockTextObj.textArr.length * editedDockTextObj.getTextHeight();
			if(totHeight > originalTextHeight){
				 var calcY = (totHeight - originalTextHeight)/2;
				 dockTextGrp.setY(calcY);
			}
			if(val.textFormat && val.textFormat.underline_value == "T"){
				var dockTxtObj = editedDockTextObj;
				if(dockTxtObj){
					var commonTextTool= new TextTool.commonLabelText();
					commonTextTool.applyTextUnderline(dockTxtObj,dockTxtObj.parent,true);
					$("#UnderlinetTool").data('clicked', true);
				}
			}
		}catch(err){
			console.log("Error on @sleView :: addDockTextOnUndoDelete::"+err.message);
		}
	},
	removeImageFromLabel : function(activeElm) {
		try{
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			var jsonData = SLEData.getJsonData();
			if(activeElm != undefined){
				var images = activeElm.get('.img');		
				if(images[0]){
					var imgGrp = images[0].parent;
					imgGrp.removeChildren();
					imgGrp.remove();
					cdLayer.draw();
				}
			}
		}catch(err){
			console.log("Error @sleView.removeImageFromLabel::"+err.message);
		}
		
	},
	removeAudioFromLabel : function(activeElm) {
		try{
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var audio = activeElm.get('#audio_'+activeElm.attrs.id)[0];		
			if(audio){
				//var audioGrp = audio[0].parent;
				audio.removeChildren();
				audio.remove();
				audio.destroy();
				cdLayer.draw();
			}
		}catch(err){
			console.log("Error @sleView.removeAudioFromLabel::"+err.message);
		}
		
	},
	removeTextFromLabel : function(activeElm) {
		try{
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();		
			var texts = activeElm.get('.nametxt');		
			if(texts[0]){
				var txtwGrp = texts[0].parent;
				txtwGrp.removeChildren();
				txtwGrp.remove();
				cdLayer.draw();
			}	
		}catch(err){
			console.log("Error @sleView.removeTextFromLabel::"+err.message);
		}
			
	},
	deleteDock : function(active) {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;
		var obj ={};
		obj.element = [];
		var dckCount = cs.objLength(window.CD.module.data.Json.SLEData);
		var activeLabelId = new Array();
		var jsonArray = new Array();
		var undoMng = window.CD.undoManager;
		
		for(var j=0;j<active.element.length;j++){
			var activeElm = active.element[j];
			if(active.element[j])
				activeElm = cs.findGroup(active.element[j].attrs.id);
			var  outputJson = window.CD.module.data.Json;
			var dockName = activeElm.children[0].attrs.name;
			obj.element.push(activeElm);
			for(var i=0; i<dckCount;i++){	
				if(window.CD.module.data.Json.SLEData['SLE'+i] != undefined){
					var labelGrpId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
					var dck = cs.findGroup('dock_'+labelGrpId);
					if(dck && dck.children[0].attrs.name == dockName){
						var dockIndex = SLEData.getSLEIndex(labelGrpId);
						this.removeImageFromLabel(dck);
						this.removeTextFromLabel(dck);
						this.removeAudioFromLabel(dck);
						dck.remove();
						var lbl = cs.findGroup(labelGrpId);
						if(lbl){
							activeLabelId.push(lbl.attrs.id);
							this.removeImageFromLabel(lbl);
							this.removeTextFromLabel(lbl);
							this.removeAudioFromLabel(lbl);
							lbl.remove();	
						}
						jsonArray.push(outputJson.SLEData[dockIndex]);
						cdLayer.draw();				
						delete outputJson.SLEData[dockIndex];
						
					}
				}
				
			}
		}

		undoMng.register(this, SLEView.undoLabelDelete,[jsonArray,activeLabelId] , 'Delete Dock',this, SLEView.deleteDock,[obj] , 'Redo Delete Dock');
		updateUndoRedoState(undoMng);
		SLEData.reIndexLabels();
		cs.setActiveElement(cs.findGroup('frame_0'),'frame');
		cs.resetToolbar();
		ds.setOutputData();	
	},
	/**
	 * This is used to change dimension of label on undo click
	 */
	updateLabelDimension : function(groupId,width,height) {
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var cdLayer = cs.getLayer();
		var outputJSon = SLEData.getJsonData();
		var adminData = SLEData.getJsonAdminData();
		if(groupId.match(/^label_[0-9]+^/)){
			for(var sleCount in outputJSon){
				var labelGroupID = outputJSon[sleCount].labelGroupId;
				var labelGroupLbl = cs.findGroup(labelGroupID);
				SLEView.labelDockDimensionChange(labelGroupLbl,height,width);
				SLEView.updateLabelContent(labelGroupLbl);
			}
			adminData.SLELD = width+','+height;
		}else{
			for(var sleCount in outputJSon){
				var labelGroupID = outputJSon[sleCount].labelGroupId;
				var dockGroupLbl = cs.findGroup('dock_'+labelGroupID);
				SLEView.labelDockDimensionChange(dockGroupLbl,height,width);
				SLEView.updateLabelContent(dockGroupLbl);
			}
			window.CD.module.data.Json.DCKLD = width+','+height;
		}
		
		cdLayer.draw();
		ds.setOutputData();
	},
	
	/*
	 * This is used to set height and width of label/dock
	 * By Nabonita Bhattacharyya
	 */
	labelDockDimensionChange : function(group,height,width){
		
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var child = group.children[0];
		var groupId = group.attrs.id;
		var dockId = groupId;
		
		
		var dock = cs.findGroup(dockId);
		var dockChild = dock.children[0];
		var calcX = width-20;
		var calcY = height-20;
		var unlockIconLbl = group.get('.unlockicon_'+groupId)[0];
		var lockIconLbl = group.get('.lockicon_'+groupId)[0];
		
		var unlockIconDock = dock.get('.unlockicon_'+groupId)[0];
		var lockIconDock = dock.get('.lockicon_'+groupId)[0];
		
		var topLeft = group.get('.topLeft_'+groupId)[0];
		var topRight = group.get('.topRight_'+groupId)[0];
		var bottomLeft = group.get('.bottomLeft_'+groupId)[0];
		var bottomRight = group.get('.bottomRight_'+groupId)[0];
		
		if(unlockIconLbl && lockIconLbl){
			unlockIconLbl.setX(calcX);
			lockIconLbl.setX(calcX);
			unlockIconLbl.setY(calcY);
			lockIconLbl.setY(calcY);
		}
		
		if(unlockIconDock && lockIconDock){
			unlockIconDock.setX(calcX);
			lockIconDock.setX(calcX);
			unlockIconDock.setY(calcY);
			lockIconDock.setY(calcY);
		}
		topLeft.setX(0);
		topLeft.setY(0);
		topRight.setX(width);
		topRight.setY(0);
		bottomLeft.setX(0);
		bottomLeft.setY(height);
		bottomRight.setX(width);
		bottomRight.setY(height);
		
		child.setSize(parseInt(width), parseInt(height));
		dockChild.setSize(parseInt(width), parseInt(height));
		cdLayer.draw();
	},
	makeActive : function(oldActiveElm,newActiveElm) {		
		var inactiveDiv = $('#deleteElement_inactive');
		if(newActiveElm){
			if(newActiveElm.attrs.id=='frame_0'){
				$("#deleteElement").removeClass('active').addClass('inactive_del');
				$('#deleteElement').append(inactiveDiv);
			}
			else{
				$("#deleteElement").removeClass('inactive_del').addClass('active');
			}
		}
		
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var inspectorApplyStatus = false;
		var dckCount = cs.objLength(window.CD.module.data.Json.SLEData);
		/*if(oldActiveElm && cs.groupExists(oldActiveElm.attrs.id))
		oldActiveElm = cdLayer.get('#'+ oldActiveElm.attrs.id)[0];
		if(newActiveElm && cs.groupExists(newActiveElm.attrs.id))
		newActiveElm = cdLayer.get('#'+ newActiveElm.attrs.id)[0];*/
		var inspectorLabelData = SLEData.getInspectorLabelData();
		
		if(oldActiveElm && cs.groupExists(oldActiveElm.attrs.id) && oldActiveElm.attrs.id.match(/^label_[0-9]+/)&& cs.objLength(cs.findGroup(oldActiveElm.attrs.id).children) > 0) {
			var sle = SLEData.getSLEIndex(oldActiveElm.attrs.id);
			var dock = cdLayer.get('#dock_' + oldActiveElm.children[0].attrs.id)[0];
			if(window.CD.module.data.Json.SLEData[sle] && window.CD.module.data.Json.SLEData[sle].transparent_border === 'F'){
				oldActiveElm.children[0].setStrokeWidth(1);
				oldActiveElm.children[0].setStroke('#999999');
			}else{
				oldActiveElm.children[0].setStrokeWidth(0);
				oldActiveElm.children[0].setStroke('transparent');
			}
			
			if(dock) {
				if(window.CD.module.data.Json.SLEData[sle] && window.CD.module.data.Json.SLEData[sle].transparent_border_1 === 'F'){
					dock.setStrokeWidth(1);
					dock.setStroke('#999999');
					dock.disableDashArray();
				}else{
					dock.setStroke('#999999');
					dock.enableDashArray();
					dock.setStrokeWidth(1);
					dock.setDashArray([10,5]);
				}
			}		
			for(var i=0; i<dckCount;i++){
				var labelGrpId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
				if(cs.findGroup('dock_'+labelGrpId)){
				var dck = cs.findGroup('dock_'+labelGrpId).children[0];
				if(dck.attrs.name == oldActiveElm.attrs.id){
					if(window.CD.module.data.Json.SLEData[sle] && window.CD.module.data.Json.SLEData[sle].transparent_border_1 === 'F'){
						dck.setStrokeWidth(1);
						dck.setStroke('#999999');
						dck.disableDashArray();
					}else{
						dock.setStrokeWidth(1);
						dck.setStroke('#999999');
						dck.enableDashArray();
						dck.setDashArray([10,5]);
						}
					}
				}
			}
			
		} else if(oldActiveElm && cs.groupExists(oldActiveElm.attrs.id) && oldActiveElm.attrs.id.match(/^dock_label_[0-9]+/) && cs.objLength(cs.findGroup(oldActiveElm.attrs.id).children) > 0) {
			/** ******** Modified for OTM dock border ************ **/
			var tempId = oldActiveElm.attrs.id.split('dock_')[1];
			var sle = SLEData.getSLEIndex(tempId);
			var lblId = oldActiveElm.attrs.id.substr(5,oldActiveElm.attrs.id.length);
			var label = cs.findGroup(lblId);
			if(!label.children.length && cdLayer.get('#lbl_'+lblId.split('_')[1])[0])
				label = cdLayer.get('#lbl_'+lblId.split('_')[1])[0].parent;
			if(window.CD.module.data.Json.SLEData[sle] && window.CD.module.data.Json.SLEData[sle].transparent_border_1 === 'F'){
				oldActiveElm.children[0].setStrokeWidth(1);
				oldActiveElm.children[0].setStroke('#999999');	
				oldActiveElm.children[0].disableDashArray();
			}else{
				oldActiveElm.children[0].setStrokeWidth(1);
				oldActiveElm.children[0].setStroke('#999999');
				oldActiveElm.children[0].enableDashArray();
				oldActiveElm.children[0].setDashArray([10,5]);
			}
			if(window.CD.module.data.Json.SLEData[sle] && window.CD.module.data.Json.SLEData[sle].transparent_border === 'F'){
				label.children[0].setStrokeWidth(1);
				label.children[0].setStroke('#999999');				
			}else{
				label.children[0].setStrokeWidth(0);
				label.children[0].setStroke('transparent');
	
			}
			for(var i=0; i<dckCount;i++){
				var labelGrpId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
				if(cs.findGroup('dock_'+labelGrpId)){
					var dck = cs.findGroup('dock_'+labelGrpId).children[0];
					if(dck.attrs.name && oldActiveElm.children[0].attrs.name && dck.attrs.name == oldActiveElm.children[0].attrs.name){
						var lbl = cs.findGroup(dck.attrs.name).children[0];
						if(window.CD.module.data.Json.SLEData[sle] && window.CD.module.data.Json.SLEData[sle].transparent_border_1 === 'F'){
							dck.setStrokeWidth(1);
							dck.setStroke('#999999');
							dck.disableDashArray();							
								
						}else{
							dck.setStroke('#999999');
							dck.enableDashArray();
							dck.setDashArray([10,5]);							
						}
						if(window.CD.module.data.Json.SLEData[sle] && window.CD.module.data.Json.SLEData[sle].transparent_border === 'F'){
							lbl.setStrokeWidth(1);
							lbl.setStroke('#999999');	
						}else{
							lbl.setStrokeWidth(0);
							lbl.setStroke('transparent');
						}
					}
				}
			}
		}else if(oldActiveElm && oldActiveElm.attrs.id.match(/^img_label_[0-9]+/)) {			
			var parentNode = oldActiveElm.parent;
			if(parentNode){//This is done as oldActiveElm could have been deleted then parentNode is undefined
				var foundObj = cs.findObject(parentNode,oldActiveElm.attrs.id);
				if(foundObj.children.length>0){
					oldActiveElm.children[0].setStrokeWidth(1);
					oldActiveElm.children[0].setStroke('#999999');	
				}
			}
		}else if(oldActiveElm && oldActiveElm.attrs.id.match(/^audio_label_[0-9]+/)) {	
			var parentNode = oldActiveElm.parent;
			var foundObj = cs.findObject(parentNode,oldActiveElm.attrs.id);
			if(foundObj.children.length>0){
				oldActiveElm.children[0].setStrokeWidth(0);		
				oldActiveElm.children[0].setStroke('transparent');
			}
		}else if(oldActiveElm && oldActiveElm.attrs.id.match(/^audio_dock_label_[0-9]+/)) {	
			var parentNode = oldActiveElm.parent;
			var foundObj = cs.findObject(parentNode,oldActiveElm.attrs.id);
			if(foundObj.children.length>0){
				oldActiveElm.children[0].setStrokeWidth(0);		
				oldActiveElm.children[0].setStroke('transparent');	
			}
		}else if(oldActiveElm && oldActiveElm.attrs.id.match(/^audio_frame_[0-9]+/)) {	
			var parentNode = oldActiveElm.parent;
			var foundObj = cs.findObject(parentNode,oldActiveElm.attrs.id);
			if(foundObj.children.length>0){
				oldActiveElm.children[0].setStrokeWidth(0);		
				oldActiveElm.children[0].setStroke('transparent');	
			}
		}else if(oldActiveElm && oldActiveElm.attrs.id.match(/^audio_[0-9]+/)) {	
			var parentNode = oldActiveElm.parent;
			var foundObj = cs.findObject(parentNode,oldActiveElm.attrs.id);
			if(foundObj.children.length>0){
				oldActiveElm.children[0].setStrokeWidth(0);		
				oldActiveElm.children[0].setStroke('transparent');
			}
		}else if(oldActiveElm && cs.groupExists(oldActiveElm.attrs.id) && oldActiveElm.attrs.id.match(/^txtGrp_[0-9]+/)) {
			if(oldActiveElm.get('#lbltxt_'+oldActiveElm.attrs.id.split('_')[1])[0])
				oldActiveElm.get('#lbltxt_'+oldActiveElm.attrs.id.split('_')[1])[0].setFill('#555');
			if(oldActiveElm.get('#addTxt_'+oldActiveElm.attrs.id.split('_')[1])[0])
				oldActiveElm.get('#addTxt_'+oldActiveElm.attrs.id.split('_')[1])[0].setFill('#555');
			
		}
		this.resetTFHproperties()
		if(newActiveElm && newActiveElm.attrs.id.match(/^label_[0-9]+/)) {
			inspectorApplyStatus = true;
			var sle = SLEData.getSLEIndex(newActiveElm.attrs.id);		
			inspectorLabelData.distractor_label = window.CD.module.data.Json.SLEData[sle].distractor_label;
			this.activelabelData(inspectorLabelData,newActiveElm);
			SLEView.populateLabelData(inspectorApplyStatus,inspectorLabelData);
			var dock = cdLayer.get('#dock_' + newActiveElm.children[0].attrs.id)[0];
			newActiveElm.children[0].attrs.strokeEnabled=true;
			newActiveElm.children[0].setStrokeWidth(2);
			newActiveElm.children[0].setStroke('#1086D9');
			$('#localDivInactive').remove();
			if(dock) {
				dock.setStrokeWidth(2);
				dock.setStroke('#1086D9');
				//dock.parent.moveToTop();
			}
			for(var i=0; i<dckCount;i++){
				var labelGrpId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
				if(cs.findGroup('dock_'+labelGrpId)){
				var dck = cs.findGroup('dock_'+labelGrpId).children[0];
				if(newActiveElm.attrs.name){
					if(dck.attrs.name == newActiveElm.attrs.name){
						dck.setStrokeWidth(2);
						dck.setStroke('#1086D9');
						//dck.parent.moveToTop();
						}
				}else{
					if(dck.attrs.name == newActiveElm.attrs.id){
						dck.setStrokeWidth(2);
						dck.setStroke('#1086D9');
						//dck.parent.moveToTop();
						}
				}
				
				}
			}
			/*check hide text check box*/
			this.setTFHproperties(window.CD.module.data.Json.SLEData[sle]);
			
			
		} else if(newActiveElm && newActiveElm.attrs.id.match(/^dock_label_[0-9]+/)) {
		
			inspectorApplyStatus = true;
			var dockSameAsLabel = window.CD.module.data.Json.adminData.DOCSAMEASLABEL; 
			var lblId = newActiveElm.attrs.id.substr(5,newActiveElm.attrs.id.length);
			var label = cs.findGroup(lblId);		
			
			if(dockSameAsLabel){
				var newActiveElmId = newActiveElm.attrs.id;
				if(newActiveElm.get('.topLeft_' + newActiveElmId)[0])
					newActiveElm.get('.topLeft_' + newActiveElmId)[0].hide();
				if(newActiveElm.get('.topRight_' + newActiveElmId)[0])
					newActiveElm.get('.topRight_' + newActiveElmId)[0].hide();
				if(newActiveElm.get('.bottomLeft_' + newActiveElmId)[0])
					newActiveElm.get('.bottomLeft_' + newActiveElmId)[0].hide();
				if(newActiveElm.get('.bottomRight_' + newActiveElmId)[0])
					newActiveElm.get('.bottomRight_' + newActiveElmId)[0].hide();	
				cdLayer.draw();
			}
			
			
			if(!label || !label.children.length)
				label = cdLayer.get('#lbl_'+lblId.split('_')[1])[0].parent;
			newActiveElm.children[0].setStrokeWidth(2);
			newActiveElm.children[0].setStroke('#1086D9');
			label.children[0].attrs.strokeEnabled=true;
			label.children[0].setStrokeWidth(2);
			label.children[0].setStroke('#1086D9');
			//label.moveToTop();
			this.activelabelData(inspectorLabelData,label);
			SLEView.populateLabelData(inspectorApplyStatus,inspectorLabelData);
			$('#localDivInactive').remove();
			for(var i=0; i<dckCount;i++){
				var labelGrpId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
				var dck = cs.findGroup('dock_'+labelGrpId);
				if(dck && dck.children[0].attrs.name && newActiveElm.children[0].attrs.name && dck.children[0].attrs.name == newActiveElm.children[0].attrs.name){
					dck = dck.children[0];
					var lbl = cs.findGroup(dck.attrs.name).children[0];
					dck.setStrokeWidth(2);
					dck.setStroke('#1086D9');
					//dck.parent.moveToTop();
					lbl.setStrokeWidth(2);
					lbl.setStroke('#1086D9');
					//lbl.parent.moveToTop();
				}
			}
		}	else if(newActiveElm && newActiveElm.attrs.id.match(/^img_label_[0-9]+/)) {	
			inspectorApplyStatus = true;
			this.activelabelData(inspectorLabelData,newActiveElm.parent);
			SLEView.populateLabelData(inspectorApplyStatus,inspectorLabelData);
			newActiveElm.children[0].setStrokeWidth(2);
			newActiveElm.children[0].setStroke('#1086D9');
		}else if(newActiveElm && newActiveElm.attrs.id.match(/^audio_label_[0-9]+/)) {	
			inspectorApplyStatus = true;
			this.activelabelData(inspectorLabelData,newActiveElm.parent);
			SLEView.populateLabelData(inspectorApplyStatus,inspectorLabelData);
			newActiveElm.children[0].setStrokeWidth(2);
			newActiveElm.children[0].setStroke('#1086D9');
		}else if(newActiveElm && newActiveElm.attrs.id.match(/^audio_dock_label_[0-9]+/)) {	
			inspectorApplyStatus = true;
			var parentGrp = cs.findGroup(newActiveElm.parent.attrs.id.split('dock_')[1]);
			this.activelabelData(inspectorLabelData,parentGrp);
			SLEView.populateLabelData(inspectorApplyStatus,inspectorLabelData);
			newActiveElm.children[0].setStrokeWidth(2);
			newActiveElm.children[0].setStroke('#1086D9');
		}else if(newActiveElm && newActiveElm.attrs.id.match(/^audio_frame_[0-9]+/)) {	
			inspectorApplyStatus = true;
			newActiveElm.children[0].setStrokeWidth(2);
			newActiveElm.children[0].setStroke('#1086D9');
		}else if(newActiveElm && newActiveElm.attrs.id.match(/^audio_[0-9]+/)) {	
			inspectorApplyStatus = true;
			newActiveElm.children[0].setStrokeWidth(2);
			newActiveElm.children[0].setStroke('#1086D9');
		}else{
			if($('#localDivInactive').length == 0 && ($('#localDiv').width()!=0 || $('#localDiv').height()!=0)){
				SLEView.makeLabelLocalDisable();
				
			}
			inspectorApplyStatus = false;
		}
		/** ---- For audio button inactive ---- **/
		/*if(newActiveElm && newActiveElm.attrs.id.match(/^dock_label_[0-9]+/)) {			
			$('#inspectorInsertAudio').addClass('inactive');//.removeClass("enabled");
			$('#removeAudio').addClass('gray_disabled').removeClass("gray_enabled");
			
			var media_parent_div = $('.media_parent');
			var mediaDivHeight = media_parent_div.height();
			var mediaDivWidth = 179;
			
			var mediaDivInactiveBar = $('<div id="mediaDivInactive" style="position:absolute;opacity:0.05;z-index:99;"></div>');
			mediaDivInactiveBar.css({width:mediaDivWidth+'px', height:mediaDivHeight+'px'});
			$('.media_parent').prepend(mediaDivInactiveBar);
		}else{
			$('#inspectorInsertAudio').removeClass('inactive');//.removeClass("enabled");
			$('#removeAudio').removeClass("gray_disabled").addClass('gray_enabled');
			$('#mediaDivInactive').remove();
		}*/
		cdLayer.draw();
		
		SLEView.populateLabelData(inspectorApplyStatus);
	},
	
	/*
	 * This is used for making label local disable when
	 * active element is not label or dock
	 */
	makeLabelLocalDisable : function(){
		console.log("@SLEView.makeLabelLocalDisable");
		try{
		
			var localDivWidth = $('#localDiv').width();
			var localDivHeight = $('#localDiv').height();
			var localDivInactiveBar = $('<div id="localDivInactive" class="overlayInactive"></div>');
			localDivInactiveBar.css({width:localDivWidth+'px', height:localDivHeight+'px'});
			$('#localDiv .block').before(localDivInactiveBar);
		}catch(err){
			console.error("@SLEView::Error on makeLabelLocalDisable::"+err.message);
		}
		
	},
	/*
	 * For making magnification part of Leader Line of local
	 * label inspector inactive
	 */
	makeLabelLocalZoomDisable : function(){
		var magWidth = 207;
		var magHeight = 70;
		var magDivInactiveBar = $('<div id="magnificationTableInc" style="position:absolute;opacity:0.05;z-index:99;"></div>');
		magDivInactiveBar.css({width:magWidth+'px', height:magHeight+'px'});
		$('#magnificationTable').before(magDivInactiveBar);
	},
	
	/*
	 * For making magnification part of Leader Line of global
	 * label inspector inactive
	 */
	makeLabelGlobZoomDisable : function(){
		/** Delete already existng mask **/
		if($('#magTableGlobal').length != 0){
			$('#magTableGlobal').remove();
		}
		var magWidth = $('#magTableGlob').width();
		var magHeight = $('#magTableGlob').height();
		var magDivInactiveBar = $('<div id="magTableGlobal" style="position:absolute;opacity:0.05;z-index:99;"></div>');
		magDivInactiveBar.css({width:magWidth+'px', height:magHeight+'px'});
		$('#magTableGlob').before(magDivInactiveBar);
	},
	activelabelData : function(inspectorLabelData,group) {
		var adminData = SLEData.getJsonAdminData();
		var sle = SLEData.getSLEIndex(group.attrs.id);
		if(!sle){
			var lblId = group.attrs.id.substr(5,group.attrs.id.length);
			sle = SLEData.getSLEIndex(lblId);
		}
		var jsonData = window.CD.module.data.Json;
		var ZHP = SLEData.getZoomParametersFromJson();
		var ZHPHintFdbck = SLEData.getHintFeedbackFromJson();
		var width = adminData.SLELD.split(',')[0];
		var height = adminData.SLELD.split(',')[1];
		inspectorLabelData.labelHeight = height;
		inspectorLabelData.labelWidth = width;		
		inspectorLabelData.fillEnabled = SLEData.fillAndBorderEnable(window.CD.module.data.Json.SLEData[sle].transparent);
		inspectorLabelData.strokeEnabled = SLEData.fillAndBorderEnable(window.CD.module.data.Json.SLEData[sle].transparent_border);
		inspectorLabelData.transparency = window.CD.module.data.Json.SLEData[sle].doc_transparent_value;
		inspectorLabelData.strokeDock = SLEData.fillAndBorderEnable(window.CD.module.data.Json.SLEData[sle].transparent_border_1);
		inspectorLabelData.dockSameSize = adminData.DOCSAMEASLABEL;
		if(jsonData.SLEGP.borderGlobal == 'F' && jsonData.SLEGP.backGroundGlobal == 'F'){
			inspectorLabelData.fillBorderDrop = true;
		}else{
			if(jsonData.SLEGP.borderGlobal == 'T' && jsonData.SLEGP.backGroundGlobal == 'T'){
				inspectorLabelData.fillBorderDrop = false;
			}
		}
		if(!inspectorLabelData.dockSameSize){
			var dockWidth = window.CD.module.data.Json.DCKLD.split(',')[0];
			var dockHeight = window.CD.module.data.Json.DCKLD.split(',')[1];
			
			inspectorLabelData.dockHeight = dockHeight;
			inspectorLabelData.dockWidth = dockWidth;	
		}else{
			inspectorLabelData.dockHeight = height;
			inspectorLabelData.dockWidth = width;
		}
		
		inspectorLabelData.connectorPoint = window.CD.module.data.Json.SLEData[sle].connector_options.connectorType.split('%d%')[0];
		inspectorLabelData.connector = window.CD.module.data.Json.SLEData[sle].connector_options.connectorPresent;
		inspectorLabelData.zoomEnable = window.CD.module.data.Json.SLEData[sle].connector_options.zoomingPresent;
		
		inspectorLabelData.hintWidth = ZHPHintFdbck.hintW;
		inspectorLabelData.hintHeight= ZHPHintFdbck.hintH;
		
		inspectorLabelData.feedbackWidth = ZHPHintFdbck.feedbackW;
		inspectorLabelData.feedbackHeight= ZHPHintFdbck.feedbackH;
		
		inspectorLabelData.hintLabelOrDock = adminData.HRO;
		inspectorLabelData.feedbackLabelOrDock = adminData.FRO;
		inspectorLabelData.showHintOrFeedbackInAuthoring = adminData.showHintOrFeedbackInAuthoring;
		inspectorLabelData.infoHideText = window.CD.module.data.Json.SLEData[sle].infoHideText;
		inspectorLabelData.distractor = window.CD.module.data.Json.SLEData[sle].distractor_label;
		inspectorLabelData.showZoomInAuth = adminData.showZoomInAuth;
		inspectorLabelData.zoomWidth = ZHP.zoomW;
		inspectorLabelData.zoomHeight = ZHP.zoomH;
		inspectorLabelData.scaleFactor = ZHP.scale;
		
		var labelID = window.CD.module.data.Json.SLEData[sle].labelGroupId;
		localMagData = SLEData.getLocalMagnificationVal(labelID);
		
		inspectorLabelData.localZoomWidth = localMagData.localMagnificationWidth;
		inspectorLabelData.localZoomHeight = localMagData.localMagnificationHeight;
		inspectorLabelData.localScaleFactor = localMagData.localMagnificationFactor;
		
		if(group.attrs.id.match(/^label_[0-9]+/) || group.attrs.id.match(/^dock_label_[0-9]+/)){
			var isCallToBind=false;
			this.updateBindPublishingOption(group,inspectorLabelData.distractor,false);
		}

		var showHide = true;
		if(inspectorLabelData.zoomEnable == 'F'){
			showHide = false;
		}
		
		SLEView.showHideMagnificationBox(showHide,'local',sle);
	},
	updateLabelContent : function(group,oldData,calcY,textH) {
		var textFormat = new TextFormat();
		var txtConfg = new TextTool.commonLabelText();
		var textStyleClass = new labelTextStyle();
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var cdLayer = cs.getLayer();
		var imageHeight = 0;
		var lblWidth = group.children[0].getWidth();
		var lblHeight = group.children[0].getHeight();
		var dockGrpId = group.getId();
        var imgObject = group.get('.img')[0];
        var buffer = 10;

            if(imgObject){
	            var imgH = parseInt(imgObject.getHeight());
	            var imgW = parseInt(imgObject.getWidth());          
	            var ratio = imgW/imgH; 
	            var avlblWidth = lblWidth - 30;
	            var avlblHeight = lblHeight - 30;
	            if(imgH > avlblHeight) {
				var exratio = avlblHeight/imgH;
	
				imgH = imgH*exratio;
				imgW = Math.round(ratio*imgH);
	//			if(textH){
	//				imgH = imgH+textH;
	//				imgW = Math.round(ratio*imgH);
	//			}
	                    }
	            if(imgW < avlblWidth){
	            	imgW = avlblWidth+50;
					var exratio =avlblWidth/imgW;
					imgW = imgW*exratio;
					imgH = imgW/ratio;
	            }
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

                   imgObject.setSize(imgW,imgH);
                   
                   /** ---- Done to update image dimension when label is resized on 21st Nov, 2013 ---- **/
                   var sle = SLEData.getLabelIndex(group.attrs.id);
                   var imageName = window.CD.module.data.Json.SLEData[sle].image_data.split('|')[0];
                   window.CD.module.data.Json.SLEData[sle].image_data = imageName+'|'+Math.ceil(imgW)+'|'+Math.ceil(imgH);
                   ds.setOutputData();
                   /**************************************************************************************/
                   
                   imageHeight = imgH;
                   imgObject.parent.setX((lblWidth - imgW)/2); 

                   var labelGroupInd = group.attrs.id.split('_')[1];
                   var txtGrpObj = group.get('#txtGrp_'+labelGroupInd)[0];
                 
                   if(!txtGrpObj.getVisible()){ 
                	   imgObject.setY(0);
                	   imgObject.parent.setY((lblHeight-imgH)/2);
                		   //imgObject.parent.setY(5); 
                   } 
                   else if(txtGrpObj.getVisible()){ 
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
              					textHeight = txtGrpObj.get('#addTxt_'+labelGroupInd)[0].getHeight();
               			var imgHeight = imgObject.getHeight();
               			var imgBuffer = 3;
               			
               			var spaceRemain = (parseInt(lblHeight)-parseInt(imgHeight)-textHeight)/2;
               			if(spaceRemain<10)
               				spaceRemain = 10;
               			
               			imgObject.parent.setY(spaceRemain);
                	   }
                		   //imgObject.parent.setY(5); 
                   } else {
                	   var originalTextHeight = txtGrpObj.get('#addTxt_'+labelGroupInd)[0].getTextHeight();
                	   
                	   if(txtGrpObj.get('#lbltxt_'+labelGroupInd).length > 0){
                		   originalTextHeight = txtGrpObj.get('#lbltxt_'+labelGroupInd)[0].textArr.length * txtGrpObj.get('#lbltxt_'+labelGroupInd)[0].getTextHeight();
                	   }
                	      
                	   if ($('#showHiddenTxtGlobal').is(':checked')) {
                		   originalTextHeight = 0;
                	   }
                	   var calcTop = (lblHeight - imgH-originalTextHeight)/2;
                  	   if(calcTop < buffer){
                 		   calcTop = buffer;
                  	   }                  	  
                  	 imgObject.parent.setY(0);
                  	 imgObject.setY(calcTop);
                   }
                   cdLayer.draw();	
                }            

                if(dockGrpId.match(/^dock_label_[0-9]+/)){
                	var txtObj = group.get('#docktxtGrp_'+group.attrs.id.split('dock_label_')[1])[0];
            		var addTxtObj = group.get('#dock_txtBox_'+group.attrs.id.split('_')[1])[0];
                }else{
                	var txtObj = group.get('#txtGrp_'+group.attrs.id.split('_')[1])[0];
            		var addTxtObj = group.get('#addTxt_'+group.attrs.id.split('_')[1])[0];
            		var dockGroup = cdLayer.get('#dock_'+group.attrs.id)[0];
            		if(dockGroup == undefined)
            			dockGroup = cs.findGroup('dock_'+group.attrs.id);
            		var txtObjDock = dockGroup.get('#docktxtGrp_'+dockGroup.attrs.id.split('dock_label_')[1])[0];
            		
                }
		
		
		var grpid = group.attrs.id.split('_')[1];
		if(imgObject){
			if(txtObj){				
				txtObj.setWidth(lblWidth-20);
				
				
				var textStyleObj = SLEData.getTextStyleData(txtObj.getId().split('_')[1]);
				var textStyle = textStyleObj.fontStyle;
				var align = textStyleObj.align;
				var underline_value = textStyleObj.underline_value;
				
				var textValue = SLEData.getLabelTextValue(txtObj.parent.getId());
				if(textValue != ""){
					textFormat.deleteEachLabelText(txtObj);
					
					txtObj = textFormat.createLabelText(txtObj, textValue, align);
					txtConfg.bindLabelTextEvent(txtObj);					
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
				 //}
			}
			else if(addTxtObj){
				addTxtObj.parent.setY(imgObject.parent.getY() + imageHeight + imgObject.getY() + 3);
				group.get('#txtBox_'+grpid)[0].setWidth(lblWidth-20);
				group.get('#txtBox_'+grpid)[0].setX((lblWidth-20-group.get('#txtBox_'+grpid)[0].getWidth())/2)
				group.get('#addTxt_'+grpid)[0].setWidth(lblWidth-20);
				group.get('#addTxt_'+grpid)[0].setAlign("center");				
			}
		}else{
			if(txtObj){
				
				if(txtObj.getId().match(/txtGrp_[0-9]/) != null){
					var textStyleObj = SLEData.getTextStyleData(txtObj.getId().split('_')[1]);
					var textStyle = textStyleObj.fontStyle;
					var align = textStyleObj.align;
					var underline_value = textStyleObj.underline_value;
					
					var labelId = txtObj.parent.getId();
					if(txtObj.parent.getId().match(/^dock_label_[0-9]+/)!=null){
						labelId = txtObj.parent.getId().split('dock_')[1];
					}
					var textValue = SLEData.getLabelTextValue(labelId);
					if(textValue != ""){
						textFormat.deleteEachLabelText(txtObj);
						
						txtObj = textFormat.createLabelText(txtObj, textValue, align);
						if(txtObj.getId().match(/^txtGrp_[0-9]/) != null){
							txtConfg.bindLabelTextEvent(txtObj);
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
						
						var count = txtObj.children.length-1;
						var lastChild = txtConfg.findLastTextchild(txtObj,count);
						var textGrpHeight = txtObj.children[lastChild].getY() + txtObj.children[lastChild].getHeight();
						var topPadding = (txtObj.parent.children[0].getHeight()-textGrpHeight)/2;
						if(topPadding < 0)
							topPadding = 0;
						txtObj.setY(topPadding);	
					}else{
						if(txtObj.getId().match(/^txtGrp_[0-9]+/) != null){
							var txtBox = txtObj.get('#txtBox_'+txtObj.getId().split('_')[1])[0];
							var addTxt = txtObj.get('#addTxt_'+txtObj.getId().split('_')[1])[0];
							addTxt.setWidth(lblWidth-20);
							txtBox.setWidth(lblWidth-20);
							var originalTextHeight = addTxt.textArr.length * addTxt.getTextHeight();
							if(lblHeight > originalTextHeight){
								 var calcY = (lblHeight - originalTextHeight)/2;
								 addTxt.parent.setY(0);
								 addTxt.parent.setY(calcY);
							}else{
								addTxt.parent.setY(0);
								 // this.adjustFontSize(txtGrpObj,totHeight);
							}
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
				 
				 if(txtObjDock){
					 var dockob = dockGroup.children[0];
					// txtObjDock.setWidth(dockob.getWidth()-20);
					
					 if(txtObjDock.children.length > 0){
						 var dCount = txtObjDock.children.length-1;
						 var dLastChild = txtConfg.findLastTextchild(txtObjDock,dCount);
						 var dTextGrpHeight = txtObjDock.children[dLastChild].getY() + txtObjDock.children[dLastChild].getHeight();
						 var dTopPadding = (txtObjDock.parent.children[0].getHeight()-dTextGrpHeight)/2;
						 if(dTopPadding < 0)
							 dTopPadding = 0;
						 txtObjDock.setY(dTopPadding);
					 }
				}
				 //applyUnderline(txtObj);
			}
			else if(addTxtObj){
				addTxtObj.parent.setY((lblHeight - addTxtObj.getTextHeight())/2);
				group.get('#txtBox_'+grpid)[0].setWidth(lblWidth-20);
				group.get('#txtBox_'+grpid)[0].setX(((lblWidth-20)-group.get('#txtBox_'+grpid)[0].getWidth())/2);
				group.get('#addTxt_'+grpid)[0].setWidth(lblWidth-20);
				group.get('#addTxt_'+grpid)[0].setAlign("center");
			}
		}

		function applyUnderline(txtObj){
			if($('#UnderlinetTool').hasClass('active') || (txtObj.parent.get('.underline_txt')[0])){
				 var baseLabelTxtTool= new TextTool.labelText(); 
				 baseLabelTxtTool.applyTextUnderline(txtObj, txtObj.parent);			  
			 }
		}
	},
	/*
	 * On apply click from label inspector, view gets populated
	 * in this method
	 */
	updateDimension : function(data,updateDimension,fromResiZable,dataJson){
		if(updateDimension || window.CD.elements.active.type == 'label' || window.CD.elements.active.type == 'dock') {		
			var oldLabelDockData = SLEData.getOldLabelDockData();
			var undoMng = window.CD.undoManager;
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var frameGroup = cs.findGroup('frame_0');
			var stg = cs.getCanvas();
			
			var outputJSon = SLEData.getJsonData();
			var adminData = SLEData.getJsonAdminData();
			oldLabelDockData.dockSameSize = adminData.DOCSAMEASLABEL;
			oldLabelDockData.connectorEndpointType = window.CD.module.data.globalConnectorType;
			
			if(!dataJson)
				dataJson = data;
			
			//oldLabelDockData.leaderLine = $('#conEndPointGlob').html();
			//SLEView.checkConnectorPresence(data.connectorEndpointType);
			var onClickShowHiddenTxtGlobalData = window.CD.module.view.onClickShowHiddenTxtGlobal();
			if(onClickShowHiddenTxtGlobalData){
				var showHiddenTxtDataPrevious = onClickShowHiddenTxtGlobalData[0];
				var showHiddenTxtDataPresent = onClickShowHiddenTxtGlobalData[1];
			}
			for(var sleCount in outputJSon){
				var labelGroupID = outputJSon[sleCount].labelGroupId;
				var labelGroupLbl = cs.findGroup(labelGroupID);
				if(labelGroupLbl.children.length <=0) {
					labelGroupLbl = cdLayer.get('#lbl_'+labelGroupID.split('_')[1])[0].parent;
				}
				
				var label = labelGroupLbl.children[0];
				var labelGroupDock = cs.findGroup('dock_'+labelGroupID);
				var dock = labelGroupDock.children[0];
				var calcX = data.width-20;
				var calcY = data.height-20;
				
				/* -- Data populate for undo label -- */
				oldLabelDockData.width = adminData.SLELD.split(',')[0];
				oldLabelDockData.height = adminData.SLELD.split(',')[1];
				
				oldLabelDockData.fill = SLEData.fillAndBorderEnable(outputJSon[sleCount].transparent);
				oldLabelDockData.stroke = SLEData.fillAndBorderEnable(outputJSon[sleCount].transparent_border);
				
				oldLabelDockData.distractor = outputJSon[sleCount].distractor_label;
				
				/* -- Data populate for undo hint/feedback -- */
				oldLabelDockData.hintOrFeedback = adminData.showHintOrFeedbackInAuthoring;
				
				var zhp = SLEData.getHintFeedbackFromJson();
				oldLabelDockData.hintWidth = zhp.hintW;
				oldLabelDockData.hintHeight = zhp.hintH;
				oldLabelDockData.feedbackWidth = zhp.feedbackW;
				oldLabelDockData.feedbackHeight = zhp.feedbackH;
				oldLabelDockData.placeHolderX = zhp.x;
				oldLabelDockData.placeHolderY = zhp.y;
				oldLabelDockData.showZoomInAuth = adminData.showZoomInAuth;
				oldLabelDockData.labelOrDockHint = SLEData.labelOrDockStatus(adminData.HRO);
				oldLabelDockData.labelOrDockFdbk = SLEData.labelOrDockStatus(adminData.FRO);
				
				/* -- Data populate for undo dock -- */
				
				oldLabelDockData.transpType = outputJSon[sleCount].transparent_1;
				oldLabelDockData.strokeDock = SLEData.fillAndBorderEnable(outputJSon[sleCount].transparent_border_1);
				
				if(dataJson.width != undefined || dataJson.height != undefined || (dataJson.dockSameSize == true || dataJson.dockSameSize == false)){
					var unlockIconLbl = labelGroupLbl.get('.unlockicon_'+labelGroupID)[0];
					var lockIconLbl = labelGroupLbl.get('.lockicon_'+labelGroupID)[0];				
					var oldData = {'height':label.getHeight(),'width':label.getWidth()};				
					var topLeft = labelGroupLbl.get('.topLeft_'+labelGroupID)[0];
					var topRight = labelGroupLbl.get('.topRight_'+labelGroupID)[0];
					var bottomLeft = labelGroupLbl.get('.bottomLeft_'+labelGroupID)[0];
					var bottomRight = labelGroupLbl.get('.bottomRight_'+labelGroupID)[0];
					
					unlockIconLbl.setX(calcX);
					lockIconLbl.setX(calcX);
					unlockIconLbl.setY(calcY);
					lockIconLbl.setY(calcY);
					
					topLeft.setX(0);
					topLeft.setY(0);
					topRight.setX(data.width);
					topRight.setY(0);
					bottomLeft.setX(0);
					bottomLeft.setY(data.height);
					bottomRight.setX(data.width);
					bottomRight.setY(data.height);
					
					label.setSize(parseInt(data.width), parseInt(data.height));
					$.each(labelGroupLbl.children, function(index,value){
							if(value.nodeType==="Group" && value.attrs.id.match(/infoText_label_[0-9]+/)){
								/*fetching T F H infotext object*/
								$.each(value.children, function(i,v){
									if(v.attrs.id.match(/T_infoText_label_[0-9]+/)){
										infoTextTObj=v.getHeight();
										
									}
								});
							}
					    });
					var resizeFlag = true;
					var hiddenTextBox = outputJSon[sleCount].infoHideText;
					if(hiddenTextBox == 'T' && infoTextTObj){
						SLEView.updateLabelContent(labelGroupLbl,oldData,calcY,infoTextTObj,fromResiZable);
					}else{
						SLEView.updateLabelContent(labelGroupLbl,oldData,calcY,undefined,fromResiZable);
					}
					/*------------- check if same size as label is checked or not----------*/
					if(data.dockSameSize == true){
						adminData.DOCSAMEASLABEL = true;
						var labelGroupDockId = labelGroupDock.attrs.id;
						if(labelGroupDock.get('.topLeft_' + labelGroupDockId)[0])
							labelGroupDock.get('.topLeft_' + labelGroupDockId)[0].hide();
						if(labelGroupDock.get('.topRight_' + labelGroupDockId)[0])
							labelGroupDock.get('.topRight_' + labelGroupDockId)[0].hide();
						if(labelGroupDock.get('.bottomLeft_' + labelGroupDockId)[0])
							labelGroupDock.get('.bottomLeft_' + labelGroupDockId)[0].hide();
						if(labelGroupDock.get('.bottomRight_' + labelGroupDockId)[0])
							labelGroupDock.get('.bottomRight_' + labelGroupDockId)[0].hide();
						window.CD.module.data.Json.DCKLD = label.getWidth()+','+label.getHeight();
						/* -- Data populate for undo dock -- */
						
						ds.setOutputData();
					}else{
						oldLabelDockData.dockWidth = window.CD.module.data.Json.DCKLD.split(',')[0];
						oldLabelDockData.dockHeight = window.CD.module.data.Json.DCKLD.split(',')[1];
						adminData.DOCSAMEASLABEL = false;
					}
					if(adminData.DOCSAMEASLABEL){
						var unlockIconDock = labelGroupDock.get('.unlockicon_dock_'+labelGroupID)[0];
						var lockIconDock = labelGroupDock.get('.lockicon_dock_'+labelGroupID)[0];
						unlockIconDock.setX(calcX);
						lockIconDock.setX(calcX);
						unlockIconDock.setY(calcY);
						lockIconDock.setY(calcY);
						dock.setSize(parseInt(data.width), parseInt(data.height));	
						window.CD.module.data.Json.DCKLD = data.width+','+data.height;
						
						/* ----- Modified for resize icons for same size as label checked------- */
						var topLeft = labelGroupDock.get('.topLeft_dock_'+labelGroupID)[0];
						var topRight = labelGroupDock.get('.topRight_dock_'+labelGroupID)[0];
						var bottomLeft = labelGroupDock.get('.bottomLeft_dock_'+labelGroupID)[0];
						var bottomRight = labelGroupDock.get('.bottomRight_dock_'+labelGroupID)[0];
						
						topLeft.setX(0);
						topLeft.setY(0);
						topRight.setX(data.width);
						topRight.setY(0);
						bottomLeft.setX(0);
						bottomLeft.setY(data.height);
						bottomRight.setX(data.width);
						bottomRight.setY(data.height);				
						/*-------------------------------------------------------------------------*/
						
					} else {
						if(!SLEView.idDockSameAsLabel() && data.dockWidth && data.dockHeight) {
							SLEView.resizeDock(data);
						}
					}
					SLEView.updateLabelContent(labelGroupDock,oldData,calcY,undefined,fromResiZable);
				}
				
				
				
				
				SLEView.resetConnectorPos();
				
				var activeElement = window.CD.elements.active.element[0];
				
				var lbConfig = new LabelConfig();
				var fillColor = lbConfig.style.fill;
				
				/* --- for check box fill checked or not for label-----*/
				if(dataJson.fill != undefined){
					if(data.fill && outputJSon[sleCount].distractor_label=="F") {
						label.setFill(fillColor);
					//	dock.setFill('#ffffff');
						outputJSon[sleCount].transparent = 'F';
						
					}else{
						if(outputJSon[sleCount].distractor_label=="F"){
							label.setFill('transparent');
					//		dock.setFill('transparent');					
							outputJSon[sleCount].transparent = 'T';
						}
					}
					/* --- for check box fill checked or not for distractor-----*/
					if(data.fill && outputJSon[sleCount].distractor_label=="T") {
						label.setFill('#faf8dd');
				//		dock.setFill('#ffffff');
						outputJSon[sleCount].transparent = 'F';
						
					}else{
						if(outputJSon[sleCount].distractor_label=="T"){
							//QC#4033 distractor should not be transparent in authoring so next line is commented
							//label.setFill('transparent');
							
					//		dock.setFill('transparent');					
							outputJSon[sleCount].transparent = 'T';
						}
					}
				}
							
				
				/* --- for check box border checked or not of label -----*/
				
				if(dataJson.stroke != undefined){
					if(data.stroke) {
						label.attrs.strokeEnabled=true;
						label.setStroke('#999999');
						label.setStrokeWidth(1);
						outputJSon[sleCount].transparent_border = 'F';
					} else {
						label.setStroke('transparent');
						outputJSon[sleCount].transparent_border = 'T';
					}
				}
				
				
				/* --- for check box border checked or not of dock -----*/
				if(dataJson.strokeDock != undefined){
					if(data.strokeDock) {
						dock.setStroke('#999999');
						dock.disableDashArray();
						outputJSon[sleCount].transparent_border_1 = 'F';						
					}else{
						dock.setStroke('#999999');
						dock.enableDashArray();
						dock.setDashArray([10,5]);
						outputJSon[sleCount].transparent_border_1 = 'T';
						
					}
				}
				
				/* --- for dock only, radio button for transparancy -----*/
				if(dataJson.transpType != undefined){
					if(data.transpType ==='solid'){
						dock.setFill('#fff');
						dock.setOpacity(1);
						outputJSon[sleCount].doc_transparent_value = 'solid';
						outputJSon[sleCount].transparent_1 = 'solid';
					}else if(data.transpType ==='semitransparent'){
						dock.setFill('#fff');
						dock.setOpacity(0.5);
						outputJSon[sleCount].doc_transparent_value = 'semitransparent';
						outputJSon[sleCount].transparent_1 = 'semitransparent';
					}else{
						dock.setFill('transparent');
						dock.setStroke('#999999');
						outputJSon[sleCount].doc_transparent_value = 'transparent';
						outputJSon[sleCount].transparent_1 = 'transparent';
					}
				}
				
				/*---------- For Magnification ------------------*/
				
				if(data.magnifyShowInAuth != undefined){
					
				}
				/*if(data.zoomWidth && data.zoomHeight && data.magnificationFactor){
					var scaleFactor = (data.magnificationFactor.split('%')[0])/100;
					SLEData.setZoomParametersToJson(data.zoomWidth,data.zoomHeight,'','',scaleFactor);
				}*/
				var connectorType = window.CD.module.data.globalConnectorType;
				
				if(data.connectorEndpointType && data.connectorEndpointType != connectorType){
					Connector.init(labelGroupDock,data.connectorEndpointType);
				}
				
				/* --------- For Hint / Feedback ----------------*/
			
				if(data.hintOrFeedback == 'hint' || data.hintOrFeedback == 'feedback'){
					
					SLEView.destroyHint();
					if(data.hintOrFeedback == 'hint' || data.hintOrFeedback == 'feedback'){
						SLEView.makeHintFeedbackPlaceHolder(data.hintOrFeedback,data.hintWidth,data.hintHeight,data.feedbackWidth,data.feedbackHeight,sleCount);
						
					}else{
						if(data.hintOrFeedback == 'none'){
							labelGroupLbl.off('mouseover');
							labelGroupLbl.off('mouseout');
							
							labelGroupDock.off('mouseover');
							labelGroupDock.off('mouseout');
							
						}
						SLEView.removeAuthHinBox();						
					}
					
					adminData.showHintOrFeedbackInAuthoring = data.hintOrFeedback;
					
				}
				/** Global "display on Hover" option reset issue fix**/
				if(dataJson.labelOrDockHint != undefined || dataJson.labelOrDockFdbk != undefined){
					if(dataJson.labelOrDockHint != undefined){
						if(data.labelOrDockHint && data.labelOrDockHint =='label'){
							adminData.HRO = 'L';
						}else{
							if(data.labelOrDockHint && data.labelOrDockHint == 'dock'){
								adminData.HRO = 'D';
							}
						}
					}
					
					if(dataJson.labelOrDockFdbk != undefined){
						if(data.labelOrDockFdbk && data.labelOrDockFdbk =='label'){
							adminData.FRO = 'L';
						}else{
							if(data.labelOrDockFdbk && data.labelOrDockFdbk =='dock'){
								adminData.FRO = 'D';
							}
						}
					}					
				}
				
			if(labelGroupID == activeElement.attrs.id || 'dock_'+labelGroupID == activeElement.attrs.id){
					label.setStrokeWidth(2);
					label.setStroke('#1086D9');
					dock.setStrokeWidth(2);
					dock.setStroke('#1086D9');
			}
				
			}
			if(dataJson.connectorEndpointType != undefined){
				var connectorType = window.CD.module.data.globalConnectorType;
				if(data.connectorEndpointType && data.connectorEndpointType != connectorType){
					window.CD.module.data.globalConnectorType = data.connectorEndpointType;
				}
			}
			
			if(dataJson.fillBorderDrop != undefined){
				if(data.fillBorderDrop){
					window.CD.module.data.Json.SLEGP.borderGlobal = 'F';
					window.CD.module.data.Json.SLEGP.backGroundGlobal = 'F';
				}else{
					window.CD.module.data.Json.SLEGP.borderGlobal = 'T';
					window.CD.module.data.Json.SLEGP.backGroundGlobal = 'T';
				}
			}
			
			window.CD.module.data.Json.adminData.SLELD = data.width+','+data.height;
			if(dataJson.hideTextGlobal != undefined){
				SLEData.globalHideText = data.hideTextGlobal;
				if(data.hideTextGlobal == true){
					var hideLabels=[];
					for(key in window.CD.module.data.Json.SLEData){
						hideLabels.push(window.CD.module.data.Json.SLEData[key].labelGroupId);
					}
					var sleTextTool= new TextTool.commonLabelText();
					sleTextTool.onClickHideGlobalLabelText(hideLabels,'checked');
					oldLabelDockData.hideTextGlobal = false;
				}
				if((data.hideTextGlobal == false)){
					var sleTextTool= new TextTool.commonLabelText();
					var unHideLabels=[];
					for(key in window.CD.module.data.Json.SLEData){
						unHideLabels.push(window.CD.module.data.Json.SLEData[key].labelGroupId);
					}
					sleTextTool.onClickHideGlobalLabelText(unHideLabels,'unchecked');
					oldLabelDockData.hideTextGlobal = true;
				}
			}else{
				oldLabelDockData.hideTextGlobal = SLEData.globalHideText;
			}
			
			var labelGroup = cs.findGroup(labelGroupID);
			//if(data.showHiddenTxtGlobal == true){
			
			var labelGroup = cs.findGroup(labelGroupID);
			if(onClickShowHiddenTxtGlobalData.length>1){
				undoMng.register(this, SLEView.undoUpdateDimension,[oldLabelDockData,labelGroup,showHiddenTxtDataPrevious] , 'undo update dimension',this, SLEView.undoUpdateDimension,[data,labelGroup,showHiddenTxtDataPresent] , 'redo update dimension');

			}
			else{
				undoMng.register(this, SLEView.undoUpdateDimension,[oldLabelDockData,labelGroup] , 'undo update dimension',this, SLEView.undoUpdateDimension,[data,labelGroup] , 'redo update dimension');

			}
			updateUndoRedoState(undoMng);
			oldLabelDockData.hideTextGlobal = '';
			ds.setOutputData();
			cdLayer.draw();
			SLEView.applyPopulate();
		}
	},

	/***
	 * This method is used for checking if any connetor is present 
	 * in any label or not
	 * @param: connector type from global tab
	 */
/*	checkConnectorPresence : function(globalConnType){
		try{
			var connectorType = window.CD.module.data.globalConnectorType;
			if(globalConnType == connectorType){
				var outputJSon = SLEData.getJsonData();
				var baseSLE = 'SLE0';
				var val = outputJSon[baseSLE];
				if(val.connector_options.connectorPresent == 'T'){
					window.CD.module.data.globalConnectorType = 'none';
				}
			}
		}catch(error){
			console.info('Error in SLEView :: checkConnectorPresence():'+error.message);
		}
	},*/
	/**
	 * This is used for undo update dimension and also to bind 
	 * hint and feedback events on undo/redo
	 * By Nabonita Bhattacharyya
	 */
	undoUpdateDimension : function(oldData,labelGroup,onClickShowHiddenTxtGlobalData){
		labelGroup = window.CD.services.cs.findGroup(labelGroup.attrs.id);
		var adminData = SLEData.getJsonAdminData();
		if(oldData.hintOrFeedback == 'none'){
			if(oldData.labelOrDockHint =='label'){
				adminData.HRO = 'L';
			}else{
				if(oldData.labelOrDockHint =='dock'){
					adminData.HRO = 'D';
				}
			}
			if(oldData.labelOrDockFdbk =='label'){
				adminData.FRO = 'L';
			}else{
				if(oldData.labelOrDockFdbk =='dock'){
					adminData.FRO = 'D';
				}
			}
		}
		if(onClickShowHiddenTxtGlobalData){
			SLEView.onClickShowHiddenTxtGlobal(onClickShowHiddenTxtGlobalData);
		}
		var undoData = {};
		var undoData = SLEData.populateLabelDockData(undoData);
		var dataJson = {};
		dataJson = SLEData.getChangedJson(undoData,oldData,dataJson);
		
		SLEView.updateDimension(oldData,'update dimension Call',undefined,dataJson);
		window.CD.module.data.globalConnectorType = oldData.connectorEndpointType;
		var labelData = SLEData.getInspectorLabelData();
		SLEView.activelabelData(labelData,labelGroup);
		SLEView.populateLabelData(true,labelData);
		window.CD.module.view.bindFeedbackHintEventAllLabel($('input[name=hintFeedback]:checked').val(),$('input[name=hoverHint]:checked').val(),$('input[name=feedbackType]:checked').val());
		window.CD.module.view.bindFeedbackHintEvent($('input[name=hintFeedback]:checked').val(),$('input[name=hoverHint]:checked').val(),$('input[name=feedbackType]:checked').val());
		window.CD.services.ds.setOutputData();
	},
	removeAuthHinBox : function(){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		if(cdLayer.get('#authHintGrp')[0]){
			var hintGroup = cdLayer.get('#authHintGrp')[0];
			hintGroup.remove();
		}
	},

	/*
	 * This is used for making hint/feedback placeholder
	 * By Nabonita Bhattacharyya
	 */

	makeHintFeedbackPlaceHolder : function(hintOrFeedback,hintWidth,hintHeight,feedbackWidth,feedbackHeight,sleCount){
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var cdLayer = cs.getLayer();
		var frameGroup = cs.findGroup('frame_0');
		var outputJSon = SLEData.getJsonData();
		var adminData = SLEData.getJsonAdminData();
		var hintGroup = cs.findObject(frameGroup,'authHintGrp')
		
		var hintFeedbackParam = SLEData.getHintFeedbackFromJson();
		var plcHoldrX = hintFeedbackParam.x;
		var plcHoldrY = hintFeedbackParam.y;
		
		SLEData.setHintFdbckToJson(hintWidth,hintHeight,plcHoldrX,plcHoldrY);
		SLEData.setFeedbackValuesToJson(feedbackWidth,feedbackHeight);

		var stg=window.CD.services.cs.getCanvas();
		if(hintOrFeedback == 'hint'){
			
			SLEView.removeAuthHinBox();
			
			
			var canvasEndX=stg.getX()+stg.getWidth()-17;
			var boxEndX=plcHoldrX+parseInt(hintWidth);
			
			if(boxEndX >canvasEndX){
				
				plcHoldrX=canvasEndX-parseInt(hintWidth)-10;	
			}
			var canvasEndY=stg.getY()+stg.getHeight()-15;
			var boxEndY=plcHoldrY+parseInt(hintHeight);
			if(boxEndY >=canvasEndY){
				plcHoldrY=canvasEndY-parseInt(hintHeight)-10;	
			}
			SLEView.createHintGroupAuth(hintWidth,hintHeight,plcHoldrX,plcHoldrY);
			SLEData.setHintFdbckToJson(hintWidth,hintHeight,plcHoldrX,plcHoldrY);
			
		}else if(hintOrFeedback == 'feedback'){
			SLEView.removeAuthHinBox();
			
			var canvasEndX=stg.getX()+stg.getWidth()-17;
			var boxEndX=plcHoldrX+parseInt(feedbackWidth);
			if(boxEndX >=canvasEndX){
				plcHoldrX=canvasEndX-parseInt(feedbackWidth)-10;	
			}
			var canvasEndY=stg.getY()+stg.getHeight()-15;
			var boxEndY=plcHoldrY+parseInt(feedbackHeight);
			if(boxEndY >=canvasEndY){
				plcHoldrY=canvasEndY-parseInt(feedbackHeight)-10;	
			}
			
			SLEView.createHintGroupAuth(feedbackWidth,feedbackHeight,plcHoldrX,plcHoldrY);
			SLEData.setHintFdbckToJson('','',plcHoldrX,plcHoldrY);
		}	
		ds.setOutputData();
	},
	/**
	 * This method is used to resize dock when same size as label 
	 * is unchecked.
	 * Called from updateDimension()
	 */
	
	resizeDock:function(data){
		if(!SLEView.idDockSameAsLabel()) {			
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var undoMng = window.CD.undoManager;
			var frameGroup = cs.findGroup('frame_0');
			var outputJSon = window.CD.module.data.Json.SLEData;
			var updateJSon = window.CD.module.data.Json;
			data.dockWidth = parseInt(data.dockWidth);
			data.dockHeight = parseInt(data.dockHeight);
			var oldDockData = {};
			oldDockData.dockWidth = window.CD.module.data.Json.DCKLD.split(',')[0];
			oldDockData.dockHeight = window.CD.module.data.Json.DCKLD.split(',')[1];
			for(var sleCount in outputJSon){
				var labelGroupID = window.CD.module.data.Json.SLEData[sleCount].labelGroupId;
				var labelGroupLbl = cs.findGroup(labelGroupID);
				if(labelGroupLbl.children.length <=0) {
					labelGroupLbl = cdLayer.get('#lbl_'+labelGroupID.split('_')[1])[0].parent
				}
				
				var label = labelGroupLbl.children[0];
				var labelGroupDock = cs.findGroup('dock_'+labelGroupID);
				var dock = labelGroupDock.children[0];
				var calcX = data.dockWidth-20;
				var calcY = data.dockHeight-20;
				var unlockIconDock = labelGroupDock.get('.unlockicon_dock_'+labelGroupID)[0];
				var lockIconDock = labelGroupDock.get('.lockicon_dock_'+labelGroupID)[0];			
				var oldData = {'height':dock.getHeight(),'width':dock.getWidth()};				
				var topLeft = labelGroupDock.get('.topLeft_dock_'+labelGroupID)[0];
				var topRight = labelGroupDock.get('.topRight_dock_'+labelGroupID)[0];
				var bottomLeft = labelGroupDock.get('.bottomLeft_dock_'+labelGroupID)[0];
				var bottomRight = labelGroupDock.get('.bottomRight_dock_'+labelGroupID)[0];
				
				unlockIconDock.setX(calcX);
				lockIconDock.setX(calcX);
				unlockIconDock.setY(calcY);
				lockIconDock.setY(calcY);			
				topLeft.setX(0);
				topLeft.setY(0);
				topRight.setX(data.dockWidth);
				topRight.setY(0);
				bottomLeft.setX(0);
				bottomLeft.setY(data.dockHeight);
				bottomRight.setX(data.dockWidth);
				bottomRight.setY(data.dockHeight);
				
				dock.setSize(parseInt(data.dockWidth), parseInt(data.dockHeight));
				//SLEView.updateLabelContent(labelGroupLbl,oldData,calcY);

				var activeElement = window.CD.elements.active.element[0];

				if('dock_'+labelGroupID == activeElement.attrs.id){
						label.setStrokeWidth(2);
						label.setStroke('#1086D9');
						dock.setStrokeWidth(2);
						dock.setStroke('#1086D9');
				}				
			
				var textId = labelGroupDock.attrs.id.split('dock_label_')[1];
	    		var txtObjDock = labelGroupDock.get('#docktxtGrp_'+textId)[0];
	    		
	    		var commonTextTool= new TextTool.commonLabelText();
	    		var textValue = SLEData.getLabelTextValue(labelGroupDock.getId().split('dock_')[1]);
	    		var textFormat = new TextFormat();
				if(commonTextTool.checkSubOrSuperTagExist(textValue)){
					//textValue = commonTextTool.convertSbSpscript(textValue);	
				}
				
				var textStyleObj = SLEData.getTextFormatParamsFromJson(textId);
				
				var align = textStyleObj.align;
				var underline_value = textStyleObj.underline_value;
				
				var dockactiveGrpObj = labelGroupDock.get('#docktxtGrp_'+textId)[0];
  				if(dockactiveGrpObj){
  					textFormat.deleteEachLabelText(dockactiveGrpObj);
  				}
					
				txtObjDock = textFormat.createLabelText(txtObjDock,textValue,align); 
				
				var count = txtObjDock.children.length-1;
				if(count>0){
					var dockLastChild = commonTextTool.findLastTextchild(txtObjDock,count);
	  				var dockTextGrpHeight = txtObjDock.children[dockLastChild].getY() + txtObjDock.children[dockLastChild].getHeight();
	  				var dockTopPadding = (txtObjDock.parent.children[0].getHeight()-dockTextGrpHeight)/2;
	  				
	  				if(dockTopPadding < 0)
	  					dockTopPadding = 0;
	  				txtObjDock.setY(dockTopPadding);
				}
  				
  				
				if(underline_value == "T"){
					var textObj = txtObjDock;
					if(textObj){
						$("#UnderlinetTool").data('clicked', true);
					}
				}
			}
			undoMng.register(this,SLEView.resizeDock,[oldDockData],'Undo dock resize',this,SLEView.resizeDock,[data],'Redo dock resize')
			updateUndoRedoState(undoMng);
			window.CD.module.data.Json.DCKLD = data.dockWidth+','+data.dockHeight;
			ds.setOutputData();
			cdLayer.draw();
		}
	},
	resetConnectorPos:function() {
	//if(window.CD.elements.active.type == 'label' || window.CD.elements.active.type == 'dock') {			
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var frameGroup = cs.findGroup('frame_0');
			var stg = cs.getCanvas();
			var outputJSon = window.CD.module.data.Json.SLEData;
			var updateJSon = window.CD.module.data.Json;
			for(var sleCount in outputJSon){
				var labelGroupID = window.CD.module.data.Json.SLEData[sleCount].labelGroupId;
				var labelGroupLbl = cs.findGroup(labelGroupID);
				if(labelGroupLbl.children.length <=0) {
					labelGroupLbl = cdLayer.get('#lbl_'+labelGroupID.split('_')[1])[0].parent
				}
				
				var label = labelGroupLbl.children[0];
				var labelGroupDock = cs.findGroup('dock_'+labelGroupID);
				var dock = labelGroupDock.children[0];
				var dockWidth = dock.getWidth();
				var dockHeight = dock.getHeight();
				var connGroup = labelGroupDock.children[Connector.findObj(labelGroupDock,'conn_' + labelGroupDock.attrs.id)];
				
				if(connGroup){
					var connContentGrp = connGroup.children[Connector.findObj(connGroup,'conncont_' + labelGroupDock.attrs.id)];
					
					connGroup.setPosition(dockWidth/2,dockHeight/2);				
					var connPos = connGroup.attrs.connectorPosition;
					
					switch(connPos) {
					case "R":
						connContentGrp.setOffset(dockWidth/2,0);
					case "L":
						connContentGrp.setOffset(-(dockWidth/2),0);
						break;
					case "B":
						connContentGrp.setOffset(-(dockHeight/2),0);
						break;
					case "T":
						connContentGrp.setOffset(-(dockHeight/2),0);
						break;
					}
				}
			}
			cdLayer.draw();
		//}
	},
	/*
	 * This method is used to bind the hint event with label
	 * On mouseover hint value will be shown
	 */
	bindHintEvent:function(labelOrDock){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var outputJSon = window.CD.module.data.Json.SLEData;
		var type = 'hint';
		//for(var sle in outputJSon){
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		
		if(labelOrDock == 'label' && activeType == 'dock'){/*Event bind on label */
				var sle = SLEData.getSLEIndex('label_'+activeElm.attrs.id.split('_')[2]);
				var lblGroup = cs.findGroup('label_'+activeElm.attrs.id.split('_')[2]);
				//var docGroup = activeElm;
				for(var sleCount in outputJSon){
					var labelGroupId = outputJSon[sleCount].labelGroupId;
					var dockGroup = cs.findGroup('dock_'+labelGroupId);
					dockGroup.off('mouseover');
					dockGroup.off('mouseout');
				}
				lblGroup.on('mouseover',function(evt){
					var sle = SLEData.getSLEIndex(this.attrs.id);
					if(window.CD.module.data.Json.SLEData[sle].dock_hint_value && window.CD.module.data.Json.SLEData[sle].hint_value!='%n%' && this.attrs.id.match(/^label_[0-9]+/)){
						
						SLEView.createHintObject(sle, window.CD.module.data.Json.SLEData[sle].hint_value,type);
					}
				});
				lblGroup.on('mouseout',function(evt){
					SLEView.removeHint();
				});
				
		}else if(labelOrDock == 'label' && activeType == 'label'){
					var sle = SLEData.getSLEIndex(activeElm.attrs.id);
					var docGroup =  cs.findGroup('dock_'+activeElm.attrs.id);
					
					for(var sleCount in outputJSon){
						var labelGroupId = outputJSon[sleCount].labelGroupId;
						var dockGroup = cs.findGroup('dock_'+labelGroupId);
						dockGroup.off('mouseover');
						dockGroup.off('mouseout');
					}
					
					/*docGroup.off('mouseover');
					docGroup.off('mouseout');*/
					
					activeElm.on('mouseover',function(evt){
						var sle = SLEData.getSLEIndex(this.attrs.id);
						if(window.CD.module.data.Json.SLEData[sle].dock_hint_value && window.CD.module.data.Json.SLEData[sle].hint_value!='%n%'&& this.attrs.id.match(/^label_[0-9]+/)){
							
							SLEView.createHintObject(sle, window.CD.module.data.Json.SLEData[sle].hint_value,type);
						}
					});
					
					activeElm.on('mouseout',function(evt){
						SLEView.removeHint();
					});
							
		} else if(labelOrDock == 'dock' && activeType == 'dock'){/*Event bind on dock */

				var sle = SLEData.getSLEIndex('label_'+activeElm.attrs.id.split('_')[2]);
				var lblGroup = cs.findGroup('label_'+activeElm.attrs.id.split('_')[2]);
				
				for(var sleCount in outputJSon){
					var labelGroupId = outputJSon[sleCount].labelGroupId;
					var lblGrp = cs.findGroup(labelGroupId);
					lblGrp.off('mouseover');
					lblGrp.off('mouseout');
				}
				
				activeElm.on('mouseover',function(evt){
					var sle = SLEData.getSLEIndex(this.attrs.id.substr(5,this.attrs.id.length));
					if(window.CD.module.data.Json.SLEData[sle].dock_hint_value && window.CD.module.data.Json.SLEData[sle].dock_hint_value!='%n%' && this.attrs.id.match(/^dock_label_[0-9]+/)){
						
						SLEView.createHintObject(sle, window.CD.module.data.Json.SLEData[sle].dock_hint_value,type);
					}
				});
				activeElm.on('mouseout',function(evt){
					SLEView.removeHint();
				});
			} else if(labelOrDock == 'dock' && activeType == 'label'){
				var sle = SLEData.getSLEIndex(activeElm.attrs.id);
				var docGroup = cs.findGroup('dock_'+activeElm.attrs.id);				
				var lblGroup = cs.findGroup('label_'+activeElm.attrs.id.split('_')[2]);
				for(var sleCount in outputJSon){
					var labelGroupId = outputJSon[sleCount].labelGroupId;
					var lblGrp = cs.findGroup(labelGroupId);
					lblGrp.off('mouseover');
					lblGrp.off('mouseout');
					
				}
				docGroup.on('mouseover',function(evt){
					var sle = SLEData.getSLEIndex(this.attrs.id.substr(5,this.attrs.id.length));
					if(window.CD.module.data.Json.SLEData[sle].dock_hint_value && window.CD.module.data.Json.SLEData[sle].dock_hint_value!='%n%' && this.attrs.id.match(/^dock_label_[0-9]+/)){
						
						SLEView.createHintObject(sle, window.CD.module.data.Json.SLEData[sle].dock_hint_value,type);
					}
				});
				
				docGroup.on('mouseout',function(evt){
					SLEView.removeHint();
				});
			}
	},

	/*
	 * For Feedback event bind for active element
	 */
	bindFeedbackEvent:function(labelOrDock){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var outputJSon = window.CD.module.data.Json.SLEData;
		var type = 'feedback';
		//for(var sle in outputJSon){
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		
		if(labelOrDock == 'label'){/*Event bind on label */
			if(activeType == 'dock'){
				var sle = SLEData.getSLEIndex('label_'+activeElm.attrs.id.split('_')[2]);
				var lblGroup = cs.findGroup('label_'+activeElm.attrs.id.split('_')[2]);
				//var docGroup = activeElm;
				for(var sleCount in outputJSon){
					var labelGroupId = outputJSon[sleCount].labelGroupId;
					var dockGroup = cs.findGroup('dock_'+labelGroupId);
					dockGroup.off('mouseover');
					dockGroup.off('mouseout');
				}
				lblGroup.on('mouseover',function(evt){
					var sle = SLEData.getSLEIndex(this.attrs.id);
					if(window.CD.module.data.Json.SLEData[sle].feedback_value && window.CD.module.data.Json.SLEData[sle].feedback_value!='' && this.attrs.id.match(/^label_[0-9]+/)){
						
						SLEView.createHintObject(sle, window.CD.module.data.Json.SLEData[sle].feedback_value,type);
					}
				});
				lblGroup.on('mouseout',function(evt){
					SLEView.removeHint();
				});
				
			} else {
				var sle = SLEData.getSLEIndex(activeElm.attrs.id);
				var docGroup =  cs.findGroup('dock_'+activeElm.attrs.id);
				
				for(var sleCount in outputJSon){
					var labelGroupId = outputJSon[sleCount].labelGroupId;
					var dockGroup = cs.findGroup('dock_'+labelGroupId);
					dockGroup.off('mouseover');
					dockGroup.off('mouseout');
				}
				
				activeElm.on('mouseover',function(evt){
					var sle = SLEData.getSLEIndex(this.attrs.id);
					if(window.CD.module.data.Json.SLEData[sle].feedback_value && window.CD.module.data.Json.SLEData[sle].feedback_value!=''  && this.attrs.id.match(/^label_[0-9]+/)){
						
						SLEView.createHintObject(sle, window.CD.module.data.Json.SLEData[sle].feedback_value,type);
					}
				});
				
				activeElm.on('mouseout',function(evt){
					SLEView.removeHint();
				});
			}			
		} else if(labelOrDock == 'dock'){/*Event bind on dock */
			if(activeType == 'dock'){
				var sle = SLEData.getSLEIndex('label_'+activeElm.attrs.id.split('_')[2]);
				var lblGroup = cs.findGroup('label_'+activeElm.attrs.id.split('_')[2]);
				
				for(var sleCount in outputJSon){
					var labelGroupId = outputJSon[sleCount].labelGroupId;
					var lblGrp = cs.findGroup(labelGroupId);
					lblGrp.off('mouseover');
					lblGrp.off('mouseout');
				}
				
				activeElm.on('mouseover',function(evt){
					var sle = SLEData.getSLEIndex(this.attrs.id.substr(5,this.attrs.id.length));
					if(window.CD.module.data.Json.SLEData[sle].feedback_value && window.CD.module.data.Json.SLEData[sle].feedback_value!='' && this.attrs.id.match(/^dock_label_[0-9]+/)){
						
						SLEView.createHintObject(sle, window.CD.module.data.Json.SLEData[sle].feedback_value,type);
					}
				});
				activeElm.on('mouseout',function(evt){
					SLEView.removeHint();
				});
			} else {
				var sle = SLEData.getSLEIndex(activeElm.attrs.id);
				var docGroup = cs.findGroup('dock_'+activeElm.attrs.id);				
				var lblGroup = cs.findGroup('label_'+activeElm.attrs.id.split('_')[2]);
				for(var sleCount in outputJSon){
					var labelGroupId = outputJSon[sleCount].labelGroupId;
					var lblGrp = cs.findGroup(labelGroupId);
					lblGrp.off('mouseover');
					lblGrp.off('mouseout');
					
				}
				docGroup.on('mouseover',function(evt){
					var sle = SLEData.getSLEIndex(this.attrs.id.substr(5,this.attrs.id.length));
					if(window.CD.module.data.Json.SLEData[sle].feedback_value && window.CD.module.data.Json.SLEData[sle].feedback_value!='' && this.attrs.id.match(/^dock_label_[0-9]+/)){
						
						SLEView.createHintObject(sle, window.CD.module.data.Json.SLEData[sle].feedback_value,type);
					}
				});
				
				docGroup.on('mouseout',function(evt){
					SLEView.removeHint();
				});
			}		
		}
	},
	/*
	 * For selectiing binding method for either hint or feedback
	 * for hint, call bindHintEvent()
	 * for feedback bindFeedbackEvent()
	 */
	bindFeedbackHintEvent:function(hintOrFeedback,labelOrDock,labelOrDockFdbk){
		if(hintOrFeedback=='hint'){
			SLEView.removeHint();
			SLEView.bindHintEvent(labelOrDock);
		}else{
			if(hintOrFeedback == 'feedback'){
				SLEView.removeHint();
				SLEView.bindFeedbackEvent(labelOrDockFdbk);
			}
		}
	},
	/*
	 * This method is called on apply click
	 * For selectiing binding method for either hint or feedback
	 * for hint, call bindHintEventAllLabel()
	 * for feedback bindFeedbackEventAllLabel()
	 */
	bindFeedbackHintEventAllLabel : function(hintOrFeedback,labelOrDock,labelOrDockFdbk){
		if(hintOrFeedback=='hint'){
			SLEView.bindHintEventAllLabel(labelOrDock);
		}else {
			if(hintOrFeedback=='feedback'){
				SLEView.bindFeedbackEventAllLabel(labelOrDockFdbk);
			}
		}
		
	},
	/*
	 * For event binfing of hint for all labels on apply click
	 */
	bindHintEventAllLabel : function(labelOrDock){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var outputJSon = window.CD.module.data.Json.SLEData;
		var type = 'hint';
		//for(var sle in outputJSon){
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		
		for(var sle in outputJSon){
			var labelGroupId = outputJSon[sle].labelGroupId;
			var labelGroup = cs.findGroup(labelGroupId);
			var docGroup = cs.findGroup('dock_'+labelGroupId);
			
			if(labelOrDock == 'label'){/*Event bind on label */
				docGroup.off('mouseover');
				docGroup.off('mouseout');
				labelGroup.off('mouseover');
				labelGroup.off('mouseout');
						
				labelGroup.on('mouseover',function(evt){
					var sleId = SLEData.getSLEIndex(this.attrs.id);
					if(window.CD.module.data.Json.SLEData[sleId].hint_value && window.CD.module.data.Json.SLEData[sleId].hint_value!='%n%' && this.attrs.id.match(/^label_[0-9]+/)){
						
						SLEView.createHintObject(sleId, window.CD.module.data.Json.SLEData[sleId].hint_value,type);
					}
				});
				labelGroup.on('mouseout',function(evt){
					SLEView.removeHint();
				});
				
			} else {/*Event bind on dock */
				labelGroup.off('mouseover');
				labelGroup.off('mouseout');
				docGroup.off('mouseover');
				docGroup.off('mouseout');
				
				docGroup.on('mouseover',function(evt){
					var sleId = SLEData.getSLEIndex('label_'+this.attrs.id.split('_')[2]);
					if(window.CD.module.data.Json.SLEData[sleId].dock_hint_value && window.CD.module.data.Json.SLEData[sleId].dock_hint_value!='%n%' && this.attrs.id.match(/^dock_label_[0-9]+/)){
						
						SLEView.createHintObject(sleId, window.CD.module.data.Json.SLEData[sleId].dock_hint_value,type);
					}
				});
				docGroup.on('mouseout',function(evt){
					SLEView.removeHint();
				});
			}
		}
		cdLayer.draw();
	},
	/*
	 * For event binfing of feedback for all labels on apply click
	 */
	bindFeedbackEventAllLabel : function(labelOrDock){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var outputJSon = window.CD.module.data.Json.SLEData;
		var type = 'feedback';
		//for(var sle in outputJSon){
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		
		for(var sle in outputJSon){
			var labelGroupId = outputJSon[sle].labelGroupId;
			var labelGroup = cs.findGroup(labelGroupId);
			var docGroup = cs.findGroup('dock_'+labelGroupId);
			
			if(labelOrDock == 'label'){/*Event bind on label */
				docGroup.off('mouseover');
				docGroup.off('mouseout');
				labelGroup.off('mouseover');
				labelGroup.off('mouseout');
				
				labelGroup.on('mouseover',function(evt){
					var sleId = SLEData.getSLEIndex(this.attrs.id);
					if(window.CD.module.data.Json.SLEData[sleId].feedback_value && window.CD.module.data.Json.SLEData[sleId].feedback_value!='' && this.attrs.id.match(/^label_[0-9]+/)){
						
						SLEView.createHintObject(sleId, window.CD.module.data.Json.SLEData[sleId].feedback_value,type);
					}
				});
				labelGroup.on('mouseout',function(evt){
					SLEView.removeHint();
				});
				
			} else {/*Event bind on dock */
				labelGroup.off('mouseover');
				labelGroup.off('mouseout');
				docGroup.off('mouseover');
				docGroup.off('mouseout');
				docGroup.on('mouseover',function(evt){
					var sleId = SLEData.getSLEIndex('label_'+this.attrs.id.split('_')[2]);
					if(window.CD.module.data.Json.SLEData[sleId].feedback_value && window.CD.module.data.Json.SLEData[sleId].feedback_value!='%n%' && this.attrs.id.match(/^dock_label_[0-9]+/)){
						
						SLEView.createHintObject(sleId, window.CD.module.data.Json.SLEData[sleId].feedback_value,type);
					}
				});
				docGroup.on('mouseout',function(evt){
					SLEView.removeHint();
				});
			}
		}
		cdLayer.draw();
	
	},
	/*
	 * This is used to make text object for hint group
	 * the text will be added to the hintGrp object
	 */
	createHintObject : function(sleCount,val,type){
		var activeElement = window.CD.elements.active.element[0];
		var lbConfig = new LabelConfig();
		var textFormat = new TextFormat();
		var commonLabelTextToolChar = new TextTool.commonLabelText();
		var cs = window.CD.services.cs;
		
		if(activeElement){
			var sleJson = SLEData.getJsonData();
			var hoveredLabelId = sleJson[sleCount].labelGroupId;
			
			if(activeElement.getId().match(/label_[0-9]/) == null){
				activeElement = cs.findGroup(hoveredLabelId);
			}
						
			var cdLayer = cs.getLayer();
			var frameGroup = cs.findGroup('frame_0');
			var hintFdbackVal = SLEData.getHintFeedbackFromJson();
			var adminData = window.CD.module.data.Json.adminData;
			var GFS = parseInt(adminData.GFS);
			
			var labelId = activeElement.attrs.id.split('_')[1];
			if(activeElement.getId().match(/^dock_label_[0-9]+/) != null){
				labelId = activeElement.attrs.id.split('_')[2];
			}
			
			//var hfValue = SLEData.getHintFeedbackValue('label_'+labelId);
			var hfValue = SLEData.getHintFeedbackValue(hoveredLabelId);
			if(type == 'hint'){
				var height = hintFdbackVal.hintH;
				var width = hintFdbackVal.hintW;
				var hfValue = hfValue.hintValue;
			}else{
				if(type == 'feedback'){
					var height = hintFdbackVal.feedbackH;
					var width = hintFdbackVal.feedbackW;
					var hfValue = hfValue.feedbackValue;
				}
			}
			
			var authhintGroup = cdLayer.get('#authHintGrp')[0];
			var hintX = authhintGroup.getX(); 
			var hintY = authhintGroup.getY();
			
			var hintGroup = cs.findGroup('hintGrp');
			if(!hintGroup){
				hintGroup = cs.createGroup('hintGrp',{x: hintX , y : hintY , name: 'hint_grp'});
				SLEView.createHintFeedbackText(activeElement,hintGroup,val,labelId,type);
			}else{
				var actvId = hoveredLabelId;
				if(actvId.match(/^dock_label_[0-9]+/) != null){
					actvId = actvId.split('dock_')[1];
				}
				if(hintGroup.get('#hintFullTxt_'+actvId.split('_')[1])[0]){
					var prevTxt = hintGroup.get('#hintFullTxt_'+actvId.split('_')[1])[0].getText();
					var jsonText = hfValue;
					if(prevTxt != jsonText){
						
						cdLayer.get('.hint_grp')[0].destroyChildren();
						cdLayer.get('.hint_grp')[0].destroy();
						
						hintGroup = cs.createGroup('hintGrp',{x: hintX , y : hintY , name: 'hint_grp'});
						SLEView.createHintFeedbackText(activeElement,hintGroup,val,labelId,type);
					}else{
						var hintFdbckGrp = cdLayer.get('.hint_grp')[0];
						hintFdbckGrp.setX(hintX);
						hintFdbckGrp.setY(hintY);
						hintGroup.show();
					}
					cdLayer.draw();
				}else{
					SLEView.destroyHint();
					hintGroup = cs.createGroup('hintGrp',{x: hintX , y : hintY , name: 'hint_grp'});
					SLEView.createHintFeedbackText(activeElement,hintGroup,val,labelId,type);
				}
				
			}
		}
	},
	
	createHintFeedbackText : function(activeElement,hintGroup,val,labelId,type){
		console.log("@createHintFeedbackText :: SLEView");
		try{
			var commonLabelTextToolChar = new TextTool.commonLabelText();
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var textFormat = new TextFormat();
			var lbConfig = new LabelConfig();
			
			var hintFdbackVal = SLEData.getHintFeedbackFromJson();
			var adminData = window.CD.module.data.Json.adminData;
			var GFS = parseInt(adminData.GFS);
			
			if(type == 'hint'){
				var height = hintFdbackVal.hintH;
				var width = hintFdbackVal.hintW;
			}else{
				if(type == 'feedback'){
					var height = hintFdbackVal.feedbackH;
					var width = hintFdbackVal.feedbackW;
				}
			}
				
			var hint = new Kinetic.Rect({
				x: 0,
				y: 0,
				width: width,
	            height: height,						                
	            stroke: '#999999',
	            cornerRadius: 5,
	            strokeWidth: 1,
	            strokeEnabled: true,
                fill: lbConfig.style.fill,
	            opacity:1,
	            id:'hint_'+activeElement.attrs.id.split('_')[1]           
			});
			
			var hintFullText = new Kinetic.Text({			
				text : val,
				fontSize: 14,//GFS,
		        fontFamily: 'sans-serif',
		        fill: '#555',
		        id: 'hintFullTxt_'+activeElement.attrs.id.split('_')[1],
	            name: 'hinttxt',
	            visible : false
	        });			
			
			var hintTextGroup = cs.createGroup('hintTxt_'+labelId);
			
			hintGroup.add(hint);
			hintGroup.add(hintFullText);
			hintGroup.add(hintTextGroup);
			
			hintTextGroup = textFormat.createHintFeedbackText(hintTextGroup, val);
			
			cdLayer.add(hintGroup);
			/* ----------- Modified for vertical alignment --------- */
			
			var count = hintTextGroup.children.length-1;
			
			if(count < 0){
				count = 0;
			}
			var lastChild = commonLabelTextToolChar.findLastTextchild(hintTextGroup,count);
			var textGrpHeight = hintTextGroup.children[lastChild].getY() + hintTextGroup.children[lastChild].getHeight();
			var topPadding = (hintTextGroup.parent.children[0].getHeight()-textGrpHeight)/2;
			if(topPadding < 0)
				topPadding = 0;
			hintTextGroup.setY(topPadding);	
			
			cdLayer.draw();
		}
		catch(error){
			console.log("Error in createHintFeedbackText :: SLEView "+error.message);
		}
	},

	/*
	 * This method is used for making new hint group
	 * without hint text
	 */
	createHintGroupAuth : function(width,height,x,y){
		var activeElement = window.CD.elements.active.element[0];
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var frameGroup = cs.findGroup('frame_0');
		var adminData = window.CD.module.data.Json.adminData;
		var undoMng = window.CD.undoManager;
		var GFS = parseInt(adminData.GFS);
		var hintGroupAuth = cs.findGroup('authHintGrp');
		if(!hintGroupAuth){
			hintGroupAuth = cs.createGroup('authHintGrp',{x: x, y : y,draggable: true,name: 'auth_hint_grp'})
		}
		
		var hint = new Kinetic.Rect({
			x: 0,
			y: 0,	
			height:height,
			width:width,
            stroke: '#999999',
            cornerRadius: 5,
            strokeWidth: 1,
            strokeEnabled: true,
            fill: '#ffffff',
            opacity:1,
            id:'authHint'           
			});
		var hintTextAuth = new Kinetic.Text({			
			text : 'hint/feedback location in student view',
			fontSize: 14,//GFS,
	        fontFamily: 'sans-serif',
	        fill: '#888',
	        opacity: '1',
	        width: 'auto',
	        height: 'auto',
	        align:'center',
            id: 'hintTxtAuth',
            name: 'hinttxtAuth'
          });
	
		hintGroupAuth.add(hint);
		hintGroupAuth.add(hintTextAuth);
		
		hintTextAuth.setX(((hint.getWidth())-(hintTextAuth.getTextWidth()))/2);
		hintTextAuth.setY(((hint.getHeight())-(hintTextAuth.getTextHeight()))/2);
		
		//frameGroup.add(hintGroupAuth);
		cdLayer.add(hintGroupAuth);
		/* ----------- Modified for vertical alignment --------- */
		if(hintTextAuth.getTextWidth()>parseInt(width)){
			hintTextAuth.setX(hint.getX()+7);
			hintTextAuth.setWidth(parseInt(width)-7);
			var textH = parseInt(hintTextAuth.textArr.length*hintTextAuth.getTextHeight());
			var spaceLeft = parseInt(hint.getHeight())-parseInt(textH);
			if(spaceLeft>0){
				var modifiedY = spaceLeft/2;
			}else{
				var modifiedY = 7;
			}
			hintTextAuth.setY(modifiedY);
			hintTextAuth.setHeight(parseInt(height)-7);
		}
		
		cdLayer.draw();
		
		hintGroupAuth.on('mousedown',function(evt){	
			openInspector('label');
			this.moveToTop();
		});
		hintGroupAuth.on('click',function(evt){
			evt.cancelBubble = true;
		});
		hintGroupAuth.on('dragend',function(evt){
			evt.cancelBubble = true;
			var ds = window.CD.services.ds;
			var activeElement = window.CD.elements.active.element[0];
			var oldZhp = SLEData.getHintFeedbackFromJson();
			undoMng.register(this,SLEView.undoRedoHintBoxPosition,[this,oldZhp.x,oldZhp.y],'Undo hint box position change',this,SLEView.undoRedoHintBoxPosition,[this,this.getX(),this.getY()],'Redo hint box position change');
			updateUndoRedoState(undoMng);
			var outputJSon = window.CD.module.data.Json.SLEData;
			SLEData.setHintFdbckToJson('','',this.getX(),this.getY());
			ds.setOutputData();	
		});
	},
	
	/**
	 * this is used for undo/redo of hint/feedback placeholder
	 * position change
	 */
	undoRedoHintBoxPosition : function(group,x,y){
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var x = parseInt(x);
		var y = parseInt(y);
		var cdLayer = cs.getLayer();
		group = cs.findGroup(group.getId());
		group.setPosition(x,y);
		cdLayer.draw();
		SLEData.setHintFdbckToJson('','',x,y);
		ds.setOutputData();
	},
	/*
	 * This is used to clear hint text fron hint group if no 
	 * value is there in either of the hint_values
	 */
	removeHint : function(){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		if(cdLayer.get('.hint_grp')[0]){
			/*cdLayer.get('.hint_grp')[0].destroyChildren();
			cdLayer.get('.hint_grp')[0].destroy();*/
			cdLayer.get('.hint_grp')[0].hide();
		}
		cdLayer.draw();
	},
	/*
	 * This is used to remove hint/feedback box 
	 * when 'none' is clicked from inspector
	 */
	
	destroyHint : function(){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		if(cdLayer.get('.hint_grp')[0]){
			cdLayer.get('.hint_grp')[0].destroyChildren();
			cdLayer.get('.hint_grp')[0].destroy();			
		}
		cdLayer.draw();
	},
	removeHintBox : function(){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		if(cdLayer.get('.auth_hint_grp')[0]){
			cdLayer.get('.auth_hint_grp')[0].removeChildren();
			cdLayer.get('.auth_hint_grp')[0].remove();
		}
		cdLayer.draw();
	},
	
	/*
	 * this method is used to update sleData for hint and feedback
	 * textarea on focus out
	 * It is being called from stage.js
	 * By Nabonita Bhattacharyya on 07th May, 2013
	 */
	updateHintFeedbackVal : function(hintValue,feedbackValue){
		var cs = window.CD.services.cs;
		var activeElm = window.CD.elements.active.element[0];
		if(activeElm.attrs.id.match(/^dock_label_[0-9]+/)){
			var sle = SLEData.getSLEIndex('label_'+activeElm.attrs.id.split('_')[2]);
			var labelGrpId = activeElm.attrs.id;
			var dockName = activeElm.children[0].attrs.name;
		}else{
			if(activeElm.attrs.id.match(/^label_[0-9]+/)){
				var sle = SLEData.getSLEIndex(activeElm.attrs.id);
				var labelGrpId = 'dock_'+activeElm.attrs.id;
				var activeDock = cs.findGroup(labelGrpId);
				var dockName = activeDock.children[0].attrs.name;
			}
		}
		var ds = window.CD.services.ds;
		try{
			if(sle && hintValue!=null && hintValue!=""){
				var dckCount = cs.objLength(window.CD.module.data.Json.SLEData);
				for(var i=0; i<dckCount;i++){
					var dck = cs.findGroup('dock_label_'+i);
					if(dck && dck.children[0].attrs.name == dockName){
						var sleId = 'SLE'+i;
						window.CD.module.data.Json.SLEData[sleId].hint_value = hintValue;
						window.CD.module.data.Json.SLEData[sleId].dock_hint_value = hintValue;
					}
				}
				
				ds.setOutputData();
			}else{
				var dckCount = cs.objLength(window.CD.module.data.Json.SLEData);
				for(var i=0; i<dckCount;i++){
					var dck = cs.findGroup('dock_label_'+i);
					if(dck && dck.children[0].attrs.name == dockName){
						var sleId = 'SLE'+i;
						window.CD.module.data.Json.SLEData[sleId].hint_value = '%n%';
						window.CD.module.data.Json.SLEData[sleId].dock_hint_value = '%n%';
					}
				}
				ds.setOutputData();
			}
			ds.setOutputData();
			if(sle && feedbackValue!=null && feedbackValue!=""){
				var dckCount = cs.objLength(window.CD.module.data.Json.SLEData);
				for(var i=0; i<dckCount;i++){
					var dck = cs.findGroup('dock_label_'+i);
					if(dck && dck.children[0].attrs.name == dockName){
						var sleId = 'SLE'+i;
						window.CD.module.data.Json.SLEData[sleId].feedback_value = feedbackValue;
					}
				}
				ds.setOutputData();
			}else{
				var dckCount = cs.objLength(window.CD.module.data.Json.SLEData);
				for(var i=0; i<dckCount;i++){
					var dck = cs.findGroup('dock_label_'+i);
					if(dck && dck.children[0].attrs.name == dockName){
						var sleId = 'SLE'+i;
						window.CD.module.data.Json.SLEData[sleId].feedback_value = '';
					}
				}
				ds.setOutputData();
			}
		}catch(e){
			console.log('Error in update hint'+e);
		}
		
		
	},
	/*
	 * This is used to show the hint value as per active element
	 * if no hint_value or dock_hint_value is there for the active element
	 * 'start typing' is shown
	 */
	showSavedHint : function(group){
		
		if(group.attrs.id.match(/^dock_label_[0-9]+/)){
			var sle = SLEData.getLabelIndex('label_'+group.attrs.id.split('_')[2]);
		}else{
			if(group.attrs.id.match(/^label_[0-9]+/)){
				var sle = SLEData.getLabelIndex(group.attrs.id);
			}
		}
		if(group.attrs.id.match(/^label_[0-9]+/) && window.CD.module.data.Json.SLEData[sle].hint_value && window.CD.module.data.Json.SLEData[sle].hint_value!='%n%'){
			var hintText = window.CD.module.data.Json.SLEData[sle].hint_value;
		}else{
			if(group.attrs.id.match(/^dock_label_[0-9]+/) && window.CD.module.data.Json.SLEData[sle].dock_hint_value && window.CD.module.data.Json.SLEData[sle].dock_hint_value!='%n%'){
				var hintText = window.CD.module.data.Json.SLEData[sle].dock_hint_value;
			}else{
				var hintText = null;
			}
		}
		
		if(group.attrs.id.match(/^label_[0-9]+/) && window.CD.module.data.Json.SLEData[sle].feedback_value && window.CD.module.data.Json.SLEData[sle].feedback_value!=''){
			var feedbackText = window.CD.module.data.Json.SLEData[sle].feedback_value;
		}else{
			if(group.attrs.id.match(/^dock_label_[0-9]+/) && window.CD.module.data.Json.SLEData[sle].feedback_value && window.CD.module.data.Json.SLEData[sle].feedback_value!=''){
				var feedbackText = window.CD.module.data.Json.SLEData[sle].feedback_value;
			}else{
				var feedbackText = null;
			}
		}
		
		SLEView.populateHintArea(hintText,feedbackText);
	},
	
	toggleDistractor : function(makeDistracttor,activeElm,undoRedo) {
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var dckCount = cs.objLength(window.CD.module.data.Json.SLEData);
		var cdLayer = cs.getLayer();
		var undoMng = window.CD.undoManager;
		var activeElmLength = activeElm.length;
		var activeOldElement = [];
		for(var j=0;j<activeElmLength;j++){
			if(window.CD.elements.active.type == 'label') {
				var activelabel = activeElm[j];
				var activeDock = cs.findGroup('dock_'+activelabel.attrs.id);
			}else if(window.CD.elements.active.type == 'dock') {
				var activeDock = activeElm[j];
				var activelabel = cs.findGroup(activeDock.attrs.id.substr(5,activeDock.attrs.id.length));
			}else{
				var id = activeElm[j].attrs.id;
				var activeElement = cs.findGroup(id);
				if(id.match(/^label_[0-9]+/)){
					var activelabel = activeElement;
					var activeDock = cs.findGroup('dock_'+activelabel.attrs.id);
				}else{
					if(id.match(/^dock_label_[0-9]+/)){
						var activeDock = activeElement;
						var activelabel = cs.findGroup(activeDock.attrs.id.substr(5,activeDock.attrs.id.length));
					}
				}
			}
			var sle = SLEData.getSLEIndex(activelabel.attrs.id);
			/*update for plishOptions*/
			$('input[name=labelPresentation][value=standard]').trigger('click');
			var distractorStatus = false;
			activeOldElement.push(activeElm[j]);
			if(makeDistracttor) {
				activeDock.hide();
				var atName = activeDock.children[0].attrs.name;
				activeDock.children[0].attrs.name = activelabel.attrs.id;
				window.CD.module.data.Json.SLEData[sle].name = activelabel.attrs.id;
	            activelabel.show();
	          
	    		for(var i=0; i<dckCount;i++){
	    			var labelGrpId = window.CD.module.data.Json.SLEData['SLE'+i].labelGroupId;
	    			var dck = cs.findGroup('dock_'+labelGrpId);
	    			var lblIndex = SLEData.getSLEIndex(labelGrpId);
	    			if(dck && (dck.children[0].attrs.name == atName) && (dck.attrs.id != activeDock.attrs.id)){
	    				//dck.removeChildren();
	    				//dck.remove();    				
	    				var lbl = cs.findGroup(labelGrpId);
	    				if(lbl){
	    					var elm = lbl.get('#txtGrp_'+ (lbl.attrs.id.split('_')[1]))[0];
	    					if(elm)
	    					new TextTool.commonLabelText().deleteText(elm);
	    					lbl.show();
	    					dck.children[0].attrs.name = lbl.attrs.id;	
	    					window.CD.module.data.Json.SLEData[lblIndex].distractor_label = 'F';
	    					window.CD.module.data.Json.SLEData[lblIndex].visibility = true;
	    					window.CD.module.data.Json.SLEData[lblIndex].name = lbl.attrs.id;
	    				}
	    			}			
	    		}
	    		
	    		if(window.CD.module.data.Json.SLEData[sle].transparent == 'F'){
	    			activelabel.children[0].setFill('#faf8dd');
				}else{
					if(window.CD.module.data.Json.SLEData[sle].transparent == 'T'){
						activelabel.children[0].setFill('transparent');
					}
				}
				
				window.CD.module.data.Json.SLEData[sle].distractor_label = 'T';
				window.CD.module.data.Json.SLEData[sle].visibility = true;
				SLEData.reIndexLabels();
				$('#distractorLoc').prop('checked',true);
				
			} else {
				var distractorStatus = true;
				activeDock.children[0].attrs.name = activelabel.attrs.id;
				window.CD.module.data.Json.SLEData[sle].name = activelabel.attrs.id;
				var lbConfig = new LabelConfig();
				activeDock.show();
				if(window.CD.module.data.Json.SLEData[sle].transparent == 'F'){
	    			activelabel.children[0].setFill(lbConfig.style.fill);
				}else{
					if(window.CD.module.data.Json.SLEData[sle].transparent == 'T'){
						activelabel.children[0].setFill('transparent');
					}
				}
				
				window.CD.module.data.Json.SLEData[sle].distractor_label = 'F';
				window.CD.module.data.Json.SLEData[sle].visibility = true;
				$('#distractorLoc').prop('checked',false);
			}
		}
		if(!undoRedo){
			undoMng.register(this,SLEView.toggleDistractor,[distractorStatus,activeOldElement,'undoRedo'],'Undo make distractor',this,SLEView.toggleDistractor,[makeDistracttor,activeOldElement,'undoRedo'],'Redo make distractor')
			updateUndoRedoState(undoMng);
		}
		cdLayer.draw();
		ds.setOutputData();	
		SLEData.customPublishFlag = false;
		SLEData.applyClickPublishOk();
	},
	/**
	 * function name: setTFHproperties()
	 * author:Piyali Saha
	 */
	setTFHproperties :function(slejsonObj){
		var infoTtext=slejsonObj.infoHideText;
		var infoHintText=slejsonObj.hint_value;
		var infoFeedbackText=slejsonObj.feedback_value
		if(infoTtext==="T"){
			$('#hideTextLoc').prop('checked',true);
		}else{
			$('#hideTextLoc').prop('checked',false);
		}
		if(infoHintText!=="%n%"){
			$("#textareaHint").val(infoHintText);
		}else{
			$("#textareaHint").val('');
		}
		
		if(infoFeedbackText!==""){
			$("#textareaFeedback").val(infoFeedbackText);
		}else{
			$("#textareaFeedback").val('');
		}
		
	},
	/**
	 * function name: resetTFHproperties()
	 * author:Piyali Saha
	 */
	resetTFHproperties :function(){
		$('#hideTextLoc').prop('checked',false);
		$("#textareaHint").val('');
		 $("#textareaFeedback").val('');
	},
	/**
	 * function name: createInfoTextObject()
	 * description:create info text object
	 * author:Piyali Saha
	 */
	createInfoTextObject :function(param){
		
		var infoTextObjectArr=['T','H','F'];
		var infoTextX= -8;
		var slash='';
		var hideTextValue=$('#hideTextLoc').is(':checked');
		var labelGroupId=param.labelGrpID;
		var labelGrpObj=param.labelGrpObj;
		var labelData =param.labelData;
		
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var cdLayer = cs.getLayer();
		var showTVal=false,showHVal=false,showFVal=false;
		var infotObj;
		var undoMng = window.CD.undoManager;
		
		/*info text creation*/
		  var infoGroupText = new Kinetic.Group({
		       	x: 0,
				y: 0,
		        id:'infoText_'+labelGroupId,
		        draggable:false
		        });
		 $.each(infoTextObjectArr,function(index,value){
			 var infoTextObj=new Kinetic.Text({
			        x: infoTextX+10,//left,
			        y: 0,//top,
			        text: slash+value,
			        align:'left',
			        fontSize: 8,
			        fontFamily: 'sans-serif',
			        fill: '#555',
			        opacity: '1',
			        verticalAlign:'middle',
			        fontStyle: 'normal',
			        id: value+'_infoText_'+labelGroupId,
			        padding:2
			       
			      });
		    infoTextObj.hide();
		    /*bind hidtext for T infoObj*/
		    if(value==="T"){
		    	/** clicking on the "T" icon in the label, hidden text sould not be un-hiding. **/
		    	/*infoTextObj.on('dblclick',function(){
		    		undoMng.register(this, SLEView.undoHideText,[labelGrpObj.getId()] , 'Undo Label Info text',this, SLEView.undoHideText,[labelGrpObj.getId()] , 'Redo Label Info text');
		    		updateUndoRedoState(undoMng);
		    		$('#hideTextLoc').trigger('click');
		    		
		    		var sleTextTool= new TextTool.commonLabelText();
					var undoCallStatus = 'redo';
					var redoCallStatus = 'undo';
					undoMng.register(this, sleTextTool.onClickHideLabelText,[labelGrpObj.getId(),undoCallStatus] , 'Undo Label Info text',this, sleTextTool.onClickHideLabelText,[labelGrpObj.getId(),redoCallStatus] , 'Redo Label Info text');
					updateUndoRedoState(undoMng);
					//$('#hideTextLoc').trigger('click');
					sleTextTool.onClickHideLabelText(labelGrpObj.getId(),'undo');
					infoTextObj.setFill('#1086D9');
		    	})*/
		    	
		    	
		    }
		    //for showing infoTextT while rendering label
			 if(param.showLabel){
				
				 
				 if(param.infoHideText==="T" && value==="T"){
					 showTVal=true;
					 infotObj=infoTextObj;
					 infoTextObj.show();
					 $('#hideTextLoc').prop('checked',true);
				 }
				 if(param.infoHintText!=='%n%' && value==="H"){
					 showHVal=true;
					 infoTextObj.show();
					 $("#textareaHint").val(param.infoHintText);
				 }
				 if(param.infoFeedbackText!=="" && value==="F"){
					 showFVal=true;
					 infoTextObj.show();
					 $("#textareaHint").val(param.infoFeedbackText);
					 
					 /*adjust position for T and F*/
					if(showTVal && !showHVal){
							var infoTX=infotObj.getX();
							infoTextObj.setX(infoTX+10);
					}
				 }
			 }else{
				 $('#hideTextLoc').prop('checked',false);
				 $("#textareaHint").val('');
				 $("#textareaHint").val('');
			 }
		    infoTextX=infoTextX+parseInt(infoTextObj.getWidth());
		    infoGroupText.add(infoTextObj);
			 
		 })
		 
		/*add info text objects*/
		 labelGrpObj.add(infoGroupText);
		 if(!param.showLabel){
			 labelData.infoHideText='F'
		 }			
		 cdLayer.draw();
		 ds.setOutputData();	
	    
	},
	undoHideText : function(labelId) {
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var cdLayer = cs.getLayer();
		if(labelId!="") {
			var lbGroup=cdLayer.get('#'+labelId)[0];
			cs.setActiveElement(lbGroup,'label');
		}
    	$('#hideTextLoc').trigger('click');
    },
	/**
	 * function name: onTypeingHintAndFeedback()
	 * author:Piyali Saha
	 */
	onTypeingHintAndFeedback :function(textAreaObjVal,type){
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		var cdLayer = cs.getLayer();
		var infoTextTObj,infoTextHObj,infoTextFObj;
		if(activeType==='dock' || activeType === 'label'){
			if(activeType == 'dock'){
				var sle = SLEData.getSLEIndex('label_'+activeElm.attrs.id.split('_')[2]);
				var lblGroup = cs.findGroup('label_'+activeElm.attrs.id.split('_')[2]);
			} else if(activeType == 'label'){
				var sle = SLEData.getSLEIndex(activeElm.attrs.id);
				var lblGroup = cs.findGroup(activeElm.attrs.id);
			}	
			var labelGroupId = window.CD.module.data.Json.SLEData[sle].labelGroupId;
			$.each(lblGroup.children, function(index,value){
				if(value.nodeType==="Group" && value.attrs.id.match(/infoText_label_[0-9]+/)){
					/*fetching T,H,F infotext object*/
					$.each(value.children, function(i,v){
						if(v.attrs.id.match(/T_infoText_label_[0-9]+/)){
							infoTextTObj=v;
							
						}if(v.attrs.id.match(/H_infoText_label_[0-9]+/)){
							infoTextHObj=v;
						}
						if(v.attrs.id.match(/F_infoText_label_[0-9]+/)){
							infoTextFObj=v;
						}
					});
					
				}
					
			});
			var infoTvisible=infoTextTObj.getVisible();
			var infoHvisible=infoTextHObj.getVisible();
			var infoFvisible=infoTextFObj.getVisible();
			/*for hint type*/
			if(type === "textareaHint"){
				
				var hintValue = textAreaObjVal;
				if(hintValue!=null && hintValue!=""){
					infoTextHObj.show();
					window.CD.module.data.Json.SLEData[sle].infoHintText='T';
					/*adjust position for T and F*/
					if(infoFvisible){
						var infoHX=infoTextHObj.getX();
						infoTextFObj.setX(infoHX+10);
					}
				}else{
					infoTextHObj.hide();
					window.CD.module.data.Json.SLEData[sle].infoHintText='F';
					/*adjust position for T and F*/
					if(infoTvisible && infoFvisible){
						var infoTX=infoTextTObj.getX();
						infoTextFObj.setX(infoTX+10);
					}
				}
				
			}
			/*for feedback type*/
			if(type == "textareaFeedback"){
				var feedbackValue = textAreaObjVal;
				if(feedbackValue!=null && feedbackValue!=""){
					infoTextFObj.show();
					window.CD.module.data.Json.SLEData[sle].infoFText='T';
					/*adjust position for T and F*/
					if(infoHvisible){
						var infoHX=infoTextHObj.getX();
						infoTextFObj.setX(infoHX+10);
					}
					if(!infoHvisible && infoTvisible){
						var infoTX=infoTextTObj.getX();
						infoTextFObj.setX(infoTX+10);
					}
				}else{
					infoTextFObj.hide();
					window.CD.module.data.Json.SLEData[sle].infoFText='F';
				}
				
				
			}
			 cdLayer.draw();
			 ds.setOutputData();	
		}
	},
	/**
	 * This method is used for hint,feedback flag removal 
	 * when hint/feedback value is blank
	 */
	removeHintFeedbackFlag : function(lblGroup,hint,feedback){
		console.log("@removeHintFeedbackFlag :: SLEView");
		try{
			if(lblGroup){
				$.each(lblGroup.children, function(index,value){
				if(value.nodeType==="Group" && value.attrs.id.match(/infoText_label_[0-9]+/)){
					/*fetching T,H,F infotext object*/
					$.each(value.children, function(i,v){
						if(v.attrs.id.match(/H_infoText_label_[0-9]+/)){
							infoTextHObj=v;
						}
						if(v.attrs.id.match(/F_infoText_label_[0-9]+/)){
							infoTextFObj=v;
						}
					});					
				}					
			});
			if(infoTextHObj.getVisible() && hint == ''){
				infoTextHObj.hide();
			}
			if(infoTextFObj.getVisible() && feedback == ''){
				infoTextFObj.hide();
			}
			}
			
		}catch(err){
			console.error("Error @removeHintFeedbackFlag :: SLEView "+err.message);
		}
	},
	
	/**
	 * function name: onClickShowHiddenTxtGlobal()
	 * author:Piyali Saha
	 */
	onClickShowHiddenTxtGlobal :function(status){//'status' is passed only when it is being called for undo-redo
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		var sleTextTool= new TextTool.commonLabelText();
		var cdLayer = cs.getLayer();
		var infoTextTObj;
		var infoText;
		var txtGrp;
		var imgGrp;
		var previousState = 'unchecked';
		var presentState = 'unchecked';
		var undoMng = window.CD.undoManager;
		var outputJSon = window.CD.module.data.Json.SLEData;
		var updateJSon = window.CD.module.data.Json;
		for(var sleCount in outputJSon){
			var labelGroupID = window.CD.module.data.Json.SLEData[sleCount].labelGroupId;
			var lblGroup = cs.findGroup(labelGroupID);
			var label = lblGroup.children[0];
			var oldData = {'height':label.getHeight(),'width':label.getWidth()};
			var calcY = label.getHeight()-20;
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
					
				}else if(value.nodeType==="Group" && value.attrs.id.match(/txtGrp_[0-9]+/)){
					txtGrp=value;
				}else if(value.nodeType==="Group" && value.attrs.id.match(/img_label_[0-9]+/)){
					imgGrp=value;
				}
					
			});
			
			var infoTvisible=infoTextTObj.getVisible();
			/* this is used while executing undo - redo */
			if(status){
				if(status == 'checked'){
					$('#showHiddenTxtGlobal').prop('checked',true);
				}else{
					if(status == 'unchecked'){
						$('#showHiddenTxtGlobal').prop('checked',false);
					}
				}
			}
			if (outputJSon[sleCount].infoHideText == 'T') {
				if($('#showHiddenTxtGlobal').is(':checked')){
					SLEData.showHiddenTextInAuthoring = true;
					txtGrp.show();
					
					if (imgGrp) {
						if (window.CD.module.data.textGroupComponent.length > 0){
							var count = txtGrp.children.length-1;
							var lastChild = sleTextTool.findLastTextchild(txtGrp,count);
							var textGrpHeight = txtGrp.children[lastChild].getY() + txtGrp.children[lastChild].getHeight();
							var topPadding = ((label.getHeight()) / 2)- ((textGrpHeight) / 2);
							if(topPadding < 0)
								topPadding = 0;
							txtGrp.setY(topPadding);
							txtGrp.moveToTop();
						}	
						else{
							txtGrp.setY(((label.getHeight()) / 2)
									- (((txtGrp.get('#addTxt_' + txtGrp.attrs.id
											.split('_')[1])[0]).getHeight()) / 2));
						}							
						// txtGrp.setX(((label.getWidth())/2)-((txtGrp.children[2].getTextWidth())/2));
						var tempTxtGrp = txtGrp;
						var tempInfo = infoText;
						var tempInfoT = infoTextTObj;
						txtGrp.remove();
						infoTextTObj.remove();

						lblGroup.add(tempTxtGrp);

						infoText.add(tempInfoT);
						lblGroup.add(infoText);
						cdLayer.draw();
						presentState = 'checked';
						/*this.updateLabelContent(lblGroup, oldData, calcY, infoTextTObj
								.getHeight());
*/					}
				}else{
					SLEData.showHiddenTextInAuthoring = false;
					txtGrp.hide();
					cdLayer.draw();
					var sleTextTool= new TextTool.commonLabelText();
					sleTextTool.finalAdjustmentLabelContent(lblGroup);
					previousState = 'checked';
				}
			} else {
				txtGrp.show();
				if (infoTvisible) {
					infoTextTObj.hide();
				}else{
					//this.updateLabelContent(lblGroup, oldData, calcY, infoTextTObj.getHeight());
				}
				//this.finalAdjustmentLabelContent(lblGroup);
			}
			
			cdLayer.draw();
		}
		var state=[];
		state.push(previousState);
		state.push(presentState);
		/* Don't register during undo redo execution */
		if(!status){
			return state;
			//undoMng.register(this, SLEView.onClickShowHiddenTxtGlobal,[previousState] , 'Undo show hide text in authoring',this, SLEView.onClickShowHiddenTxtGlobal,[presentState], 'Redo show hide text in authoring');
		}
		else{
			return null;
		}
	},
	
  idDockSameAsLabel:function() {
	  return $('#dockSameSize').prop('checked');
  },
  
  getConnectorType:function(type) {
	  var type = $('#conEndPointLoc').html();
	  switch(type){
	  case 'single endpoint':
		  return 0;
		  break;
	  case 'single endpoint':
		  return 1;
		  break;
	  case 'two endpoint':
		  return 2;
		  break;
	  case 'three endpoint':
		  return 3;
		  break;
	  case 'four endpoint':
		  return 4;
		  break;
	  case 'five endpoint':
		  return 5;
		  break;
	  case 'bracket':
		  return 'bracket';
		  break;
	  case 'H bracket':
		  return 'hbracket';
		  break;
	  }
  },
	handleConnectorTypeChange:function(dd){
		if(dd.prop('id') == "conEndPointLoc"){

			var cs = window.CD.services.cs;
			var undoMng = window.CD.undoManager;
			var cdLayer = cs.getLayer();
			var elms = [];
			var activeElmLength = window.CD.elements.active.element.length;
			if(window.CD.elements.active.type == 'label'){
				for(var j=0;j<activeElmLength;j++){
					elms.push(cdLayer.get('#dock_'+window.CD.elements.active.element[j].attrs.id)[0]);
				}
			}else{
				for(var k=0;k<activeElmLength;k++){
					elms.push(window.CD.elements.active.element[k]);
				}
			}

			for(var i=0;i<activeElmLength;i++){
				var elm = elms[i];
				var outputJSon = SLEData.getJsonData();
				var sleCount = SLEData.getLabelIndex(elm.attrs.id.substr(5));
				var zoomScaleFactor = parseInt(($('#magnifyLocal').html()).split('%')[0])/100;
				SLEData.setZoomParametersToJson('','','','',zoomScaleFactor);
				
				if(SLEData.Json.SLEData[sleCount].connector_options.connectorPresent == 'F'){
					connType = 'none';
				} else {
					var existingConnType = SLEData.Json.SLEData[sleCount].connector_options.connectorType.split('%')[0];
					var connType = 'none';
					switch(existingConnType) {
					case 'D':
						connType = 'one endpoint';
						break;
					case '2':
						connType = 'two endpoint';
						break;
					case '3':
						connType = 'three endpoint';
						break;
					case '4':
						connType = 'four endpoint';
						break;
					case '5':
						connType = 'five endpoint';
						break;
					case 'b':
						connType = 'bracket';
						break;
					case 'h':
						connType = 'H bracket';
						break;
					}
				}
				Connector.init(elm,$('#conEndPointLoc').html());
			}
			

			/*if(connType != $('#conEndPointLoc').html()){
				undoMng.register(Connector, Connector.init,[elm,connType] , 'Undo connector',
								 Connector, Connector.init,[elm,$('#conEndPointLoc').html()] , 'Redo connector');
				updateUndoRedoState(undoMng); 
			}*/
			
		}
		if(dd.prop('id') == "magnifyLocal"){

			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var elm = window.CD.elements.active.element[0];
			if(window.CD.elements.active.type == 'label'){
				var sleCount = SLEData.getLabelIndex(elm.attrs.id);
			}
			else{
				var sleCount = SLEData.getLabelIndex(elm.attrs.id.substr(5));
			}
			var outputJSon = SLEData.getJsonData();
			var zoomScaleFactor = parseInt(($('#magnifyLocal').html()).split('%')[0])/100;
			//SLEData.setZoomParametersToJson('','','','',zoomScaleFactor);
		}
	},
	
	/*
	 * Cancel event for label
	 * By Nabonita Bhattacharyya
	 */
	labelCancelEvent : function(){
		if(window.CD.elements.active.type == 'label' || window.CD.elements.active.type == 'dock') {
			var outputJSon = SLEData.getJsonData();
			//var outputJSon = updateJSon[SLEData];
			var adminData = SLEData.getJsonAdminData();
			var hintFeedbackParam = SLEData.getHintFeedbackFromJson();
			var zoomParameter = SLEData.getZoomParametersFromJson();
			for(var sle in outputJSon){
				/* ----------- Label height & Width ------------ */
				$('#labelWidth').val(adminData.SLELD.split(',')[0]);
				$('#labelHeight').val(adminData.SLELD.split(',')[1]);
				
				/* --------------- Fill ----------------------- */
				if(outputJSon[sle].transparent == 'F'){
					$('#labelFillGlob').prop('checked',true);
				}else{
					$('#labelFillGlob').prop('checked',false);
				}
				/*----------------- Label Border ------------------ */
				if(outputJSon[sle].transparent_border == 'F'){
					$('#labelBorderGlob').prop('checked',true);
				}else{
					$('#labelBorderGlob').prop('checked',false);
				}
				
				/* --------- Dock same size as label ------------ */
				if(adminData.DOCSAMEASLABEL){
					$('#dockSameSize').prop('checked',true);
					SLEView.sameSizeAsLabel(adminData.DOCSAMEASLABEL);
					$('#dockWidth').html(adminData.SLELD.split(',')[0]);
					$('#dockHeight').html(adminData.SLELD.split(',')[1]);
				}else{
					$('#dockSameSize').prop('checked',false);
					SLEView.sameSizeAsLabel(adminData.DOCSAMEASLABEL);
					$('#dockWidth').val(window.CD.module.data.Json.DCKLD.split(',')[0]);
					$('#dockHeight').val(window.CD.module.data.Json.DCKLD.split(',')[1]);
				}
				
				
				/* ---------------- for transparent type ------------- */
				
				if(outputJSon[sle].doc_transparent_value === 'solid'){
					$('input[name=transparenTypeLoc][value=solid]').prop('checked',true);
					$('input[name=transparenType][value=solid]').prop('checked',true);
				}else if(outputJSon[sle].doc_transparent_value === 'semitransparent'){
					$('input[name=transparenTypeLoc][value=semitransparent]').prop('checked',true);
					$('input[name=transparenType][value=semitransparent]').prop('checked',true);
				}else{
					$('input[name=transparenTypeLoc][value=transparent]').prop('checked',true);
					$('input[name=transparenType][value=transparent]').prop('checked',true);
				}	
				
				/* --------------- Border for label Dock ------------- */
				if(outputJSon[sle].transparent_border_1 == 'F'){
					$('#dockBorderGlob').prop('checked',true);
				}else{
					$('#dockBorderGlob').prop('checked',false);
				}
				
				/* ------------- leader lines --------------------- */
				$('#conEndPointLoc').html('');
				if(outputJSon[sle].connector_options.connectorPresent == "T"){
					var connectorPt = outputJSon[sle].connector_options.connectorType.split('%d%')[0];
					
					var connectorArray = {
							'0':'none',
							'D':'single endpoint',
							'2':'two endpoint',
							'3':'three endpoint',
							'4':'four endpoint',
							'5':'five endpoint',
							'B':'bracket',
							'H':'H bracket'
					};
					$.each(connectorArray,function(connKey,connValue){
						if(connKey===connectorPt){
							$('#conEndPointGlob').html(connValue);
						}
					});
				}else{
					if(outputJSon[sle].connector_options.connectorPresent == "F")
						$('#conEndPointGlob').html('none');
				}
				
				if(outputJSon[sle].connector_options.zoomingPresent=='T'){
					$('#magnEnable').prop('checked',true);
					if($('#magTableGlobal').length!=0){
						$('#magTableGlobal').remove();
					}
				}else{
					if(outputJSon[sle].connector_options.zoomingPresent=='F'){
						$('#magnEnable').prop('checked',false);
						SLEView.makeLabelGlobZoomDisable();
					}
				}
				if(adminData.showZoomInAuth == "T"){
					$('#magnifySettings').prop('checked',true);
				}else{
					if(adminData.showZoomInAuth == "F"){
						$('#magnifySettings').prop('checked',false);
					}
				}
				
				$('#connectorWidthGlob').val(zoomParameter.zoomW);
				$('#connectorHeightGlob').val(zoomParameter.zoomH);
				
				var zoomScaleFctr = parseInt(zoomParameter.scale)*100;
				$('#magnifyGlobal').html(zoomScaleFctr+"%");
				
				/* ------------- hint / feedback ------------------ */
				if(adminData.showHintOrFeedbackInAuthoring == 'hint'){
					$('input[name=hintFeedback][value=hint]').prop('checked',true);
				}else if(adminData.showHintOrFeedbackInAuthoring == 'feedback'){
					$('input[name=hintFeedback][value=feedback]').prop('checked',true);
				}else{
					$('input[name=hintFeedback][value=none]').prop('checked',true);
				}
				
				if(adminData.HRO = 'L'){
					$('input[name=hoverHint][value=label]').prop('checked',true);
				}else{
					if(adminData.HRO = 'D'){
						$('input[name=hoverHint][value=dock]').prop('checked',true);
					}
				}
				
				if(adminData.FRO = 'L'){
					$('input[name=feedbackType][value=label]').prop('checked',true);
				}else{
					if(adminData.FRO = 'D'){
						$('input[name=feedbackType][value=dock]').prop('checked',true);
					}
				}
				
				if(hintFeedbackParam.hintW!='')
					$('#hintWidth').val(hintFeedbackParam.hintW);
				if(hintFeedbackParam.hintH != '')
					$('#hintHeight').val(hintFeedbackParam.hintH);
				if(hintFeedbackParam.feedbackW != '')
					$('#feedbackWidth').val(hintFeedbackParam.feedbackW);
				if(hintFeedbackParam.feedbackH != '')
					$('#feedbackHeight').val(hintFeedbackParam.feedbackH);
			}
		}
	},
	/*---------------------------------------------For Zoom ------------------------------------------------*/
	
	createZoomObject : function(pointingImage,zoomFactor){	
		var dockId = pointingImage.dock.attrs.id;
		var labelId = dockId.split('dock_')[1];
		var sle = SLEData.getSLEIndex(dockId.substr(5,dockId.length));
		var ZHP = SLEData.getZoomParametersFromJson();
		var zoomWindowX = parseInt(ZHP.x);
		var zoomWindowY = parseInt(ZHP.y);
		
		var cs = window.CD.services.cs;

		var width = parseInt(ZHP.zoomW);
		var height = parseInt(ZHP.zoomH);
		
		if(!width) {
			width = parseInt(zoomGlobalParam[0]);
		}
		
		if(!height) {
			height = parseInt(zoomGlobalParam[1]);
		}
		
		var localOrGlobal = SLEData.getJsonAdminData().magnificationData;
		
		if(localOrGlobal == 'local'){
			var magnificationObj = SLEData.getLocalMagnificationVal(labelId);
			width = magnificationObj.localMagnificationWidth;
			height = magnificationObj.localMagnificationHeight;
		}
		
		var zoomDiv = $('#zoom_image_div');
		var frameGroup = cs.findGroup('frame_'+pointingImage.frame);
		var zoomPlaceHolder = cs.findObject(frameGroup,'zoomPlaceHolder');
		var adjustmentY = 0;
		var adjustmentX = 0;
		if(frameGroup.attrs.id != 'frame_0'){
			adjustmentY = parseInt(frameGroup.getY())+parseInt(pointingImage.imageY);
			if(adjustmentY < 0)
				adjustmentY = adjustmentY * (-1);
			/* X adjustment added for zoom for image in any frame except 'frame_0' */
			adjustmentX = parseInt(frameGroup.getX())+parseInt(pointingImage.imageX);
			if(adjustmentX < 0)
				adjustmentX = adjustmentX * (-1);
		}
		if(zoomDiv.length <= 0){
			zoomDiv = $('<div id="zoom_image_div" style="height:'+height+'px;width:'+width+'px;border-radius:5px;box-shadow:0 0 5px 2px rgba(0,0,0, .7) inset;overflow:hidden;border:1px solid #999999;z-index:3000;position:fixed;"></div>');
			$('body').append(zoomDiv);
		}
		var zhp = window.CD.module.data.Json.adminData.ZHP;
		var zhpArr = zhp.split(',');
		
		var zoomX =zhpArr[2];
		var zoomY = zhpArr[3];
		zoomDiv.css('background','url("'+window.CD.util.proccessMediaID(pointingImage.src)+'")');
		zoomDiv.css('background-repeat','no-repeat');
		zoomDiv.css('background-size',pointingImage.width * zoomFactor + 'px ' + pointingImage.height * zoomFactor+'px');
		zoomDiv.css('background-position',((pointingImage.zoomX - adjustmentX) * zoomFactor - width/2)*(-1)+'px '+((pointingImage.zoomY - adjustmentY) * zoomFactor - height/2)*(-1)+'px');//For image position adjustment
		zoomDiv.css('left',(parseInt(zoomX)+15) + 'px');
		
		var connTailDiv = $('<div id="conntail" style="display:none"></div>');
		$('body').append(connTailDiv);
		
		//Output 15px + Padding 5px + (Title bar + Tool bar) 65px + Ruler 15px == 100 px
		/** --- Modified for zoom img position correction --- **/
		zoomDiv.css('top',(parseInt(zoomY)+100-20) + 'px');
		zoomDiv.css('background-color','#fff');	
		
		/** Draw connector tail **/
		var connectortailParam = SLEData.getConnectorTailParams(sle);
		SLEView.drawConnectortail(connectortailParam);
	},
	
	/**
	 * This method is used to draw connector tail
	 */
	drawConnectortail : function(connData){
		console.log('inside drawConnectortail');
		try{
			var tWidth = parseInt(connData.tWidth);
			var tHeight = parseInt(connData.tHeight);
			var facing = connData.facing;
			switch(facing){
				case 'R':
				{
					tHeight = tHeight/2;
					break;
				}
				case 'L':
				{
					tWidth = 0;
					tHeight = tHeight/2;
					break;
				}
				case 'B':
				{
					tWidth = (tWidth)/2;
					break;
				}
				case 'T':
				{
					tHeight = 0;
					tWidth = (tWidth*1)/2;
					break;
				}
			}
			//calculate connector start and end X,Y
			var targetX = parseInt(connData.dockX); //$(targetDivObj).position().left;
			var targetY = parseInt(connData.dockY);//$(targetDivObj).position().top;
			startX = tWidth + parseInt(targetX);
			startY = tHeight + parseInt(targetY);
			x1 = Number(tWidth) + Number(connData.mx) + targetX;
			y1 = Number(tHeight) + Number(connData.my) + targetY;
			x2 = Number(startX) + Number(connData.lx);
			y2 = Number(startY) + Number(connData.ly);
			var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
			var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
			var scrollTop = parseInt($(window).scrollTop());
			var left = parseInt(connData.zoom_window_x) + (parseInt(connData.zoom_window_width)/2)+15;
			var top = parseInt(connData.zoom_window_y) + (parseInt(connData.zoom_window_height)/2) +100-20;
			//Changed the position to fixed to avoid scrolling issue
			if($('#conntail').length > 0){
				$('#conntail').attr('style',"background-color: #000; box-shadow:0 1px 1px #FFFFFF; height : 2px; line-height : 1px; margin: 0 ; padding: 0; position: fixed; transform-origin: 0 0 0; z-index: 4000");
				
				$('#conntail').css("-webkit-transform-origin","0 0 0");
				$('#conntail').css("-webkit-transform","rotate("+ angle +"deg)");
				$('#conntail').css("transform","rotate("+ angle +"deg)");
				$('#conntail').css("-moz-transform","rotate("+ angle +"deg)");
				$('#conntail').css("-o-transform","rotate("+ angle +"deg)");
				$('#conntail').css("-ms-transform","rotate("+ angle +"deg)");
				
				$('#conntail').css('clip', 'rect(0, '+parseInt(connData.zoom_window_width)/2+'px, '+parseInt(connData.zoom_window_height)/2+'px, 0)');
				$('#conntail').css('left', left + 'px');
				$('#conntail').css('top', top + 'px');
				$('#conntail').css('width',length + 'px');
				$('#conntail').show();
			}
		}catch(err){
			console.log("Error while drawing connector tail @drawConnectortail::sleView "+err.message);
		}
	},
	removeZoom : function(){		
		var zoomDiv = $('#zoom_image_div');
		var tailDiv = $('#conntail');
		if(zoomDiv.length > 0)
			zoomDiv.remove();
		if(tailDiv.length > 0)
			tailDiv.remove();
	},
	/*
	 * For zoom
	 */
	bindZoomEvent : function(dockGroup){
		var cs = window.CD.services.cs;
		var dock = dockGroup;
		var dockRect = dock.children[0];
		var pointingImage = Connector.getPointingImageData(dock);
		if(pointingImage){
			if(cs.objLength(pointingImage)>0){
				var cdLayer = cs.getLayer();
				var outputJSon = window.CD.module.data.Json.SLEData;
				var showInAuth = $('#magnifySettings').prop('checked');
				
				var dockId = dockGroup.attrs.id;
				var labelId = dockId.substr(5,dockId.length);
				var sle = SLEData.getSLEIndex(labelId);
				
				var ZHP = SLEData.getZoomParametersFromJson();
				var zoomFactor = ZHP.scale;
				dock.off('mouseover.zoom');
				dock.off('mouseout.zoom');
				dock.on('mouseover.zoom',function(evt){
					var cs = window.CD.services.cs;
					var showInAuth = SLEData.showInAuthStatus(window.CD.module.data.Json.adminData.showZoomInAuth);//$('#magnifySettings').prop('checked');
					var dockId = this.attrs.id;
					var adminData = SLEData.getJsonAdminData();
					var labelId = dockId.split('dock_')[1];
					var sle = SLEData.getSLEIndex(labelId);
					var ZHP = SLEData.getZoomParametersFromJson();
					var zoomFactor = ZHP.scale;
					var zoomEnabled = outputJSon[sle].connector_options.zoomingPresent
					if(showInAuth && zoomEnabled == 'T'){
						var imageOnPoint = Connector.getPointingImageData(this);
						SLEView.removeZoom();
						if(imageOnPoint){
							imageOnPoint.dock = this;
							var localOrGlobal = adminData.magnificationData;
							
							var zoomBox = cs.findGroup('zoomPlaceHolder');
							var zoomRectObject = zoomBox.children[0];
							var zoomBoxText = zoomBox.children[1];
							if(localOrGlobal == 'local'){
								var magnificationObj = SLEData.getLocalMagnificationVal(labelId);
								var localW = magnificationObj.localMagnificationWidth;
								var localH = magnificationObj.localMagnificationHeight;
								
								zoomBoxText.setWidth(localW);
								zoomRectObject.setWidth(localW);
								zoomRectObject.setHeight(localH);								
								zoomFactor = magnificationObj.localMagnificationFactor;
							}else{
								if(localOrGlobal == 'global'){
									var globalW = ZHP.zoomW;
									var globalH = ZHP.zoomH;
									zoomBoxText.setWidth(globalW);
									zoomRectObject.setWidth(globalW);
									zoomRectObject.setHeight(globalH);
								}
							}
							var zoomY = ((zoomRectObject.getHeight())-(zoomBoxText.getTextHeight()))/2;
							zoomBoxText.setY(parseInt(zoomY));
							window.CD.services.cs.getLayer().draw();
							SLEView.createZoomObject(imageOnPoint,zoomFactor);
						}
					}else{
						SLEView.removeZoom();
					}
				});
				dock.on('mouseout.zoom',function(evt){
					SLEView.removeZoom();
				});
			}else{
				var activeElm = window.CD.elements.active.element[0];
				var activeType = window.CD.elements.active.type;
				if(activeType == 'dock'){
					var sle = SLEData.getSLEIndex('label_'+activeElm.attrs.id.split('_')[2]);
					var dockGroup = cs.findGroup('dock_label_'+activeElm.attrs.id.split('_')[2]);
				}else{
					if(activeType == 'label'){
						var sle = SLEData.getSLEIndex(activeElm.attrs.id);
						var dockGroup = cs.findGroup('dock_'+activeElm.attrs.id);
					}
				}
				dockRect.off('mouseover.zoom');
				dockRect.off('mouseout.zoom');
			}
		}
	},
	
	/*
	 * This is used to make labeling magnification placeholder
	 */
	labelingMagnification : function(magnifyData){
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		
		var zhp = SLEData.getZoomParametersFromJson();
		var x = zhp.x;
		var y = zhp.y;
		var stg = window.CD.services.cs.getCanvas();
		var canvasEndY = parseInt(stg.getY()+ stg.getHeight());
		var boxEndY = parseInt(y)+parseInt(magnifyData.height);
		if(boxEndY >= canvasEndY){
			y = parseInt(canvasEndY - parseInt(magnifyData.height) - 50);	
		}
		var canvasEndX = parseInt(stg.getX()+stg.getWidth());
		var boxEndX = parseInt(x)+parseInt(magnifyData.width);
		if(boxEndX >= canvasEndX){
			x = parseInt(canvasEndX - parseInt(magnifyData.width)-50);	
		}
		
		var w = parseInt(magnifyData.width);
		var h = parseInt(magnifyData.height);
		if(!$.isNumeric(magnifyData.scaleFactor)){
			var scale = parseInt(magnifyData.scaleFactor.split('%')[0]/100);
		}
		SLEData.setZoomParametersToJson(w,h,x,y,scale);
		
		var zoomObj = {};
		zoomObj.localMagnificationWidth = w;
		zoomObj.localMagnificationHeight = h;
		zoomObj.localMagnificationFactor = scale;
		
		var localOrGlobal = SLEData.getJsonAdminData().magnificationData;
		
		if(localOrGlobal == 'global'){
			SLEData.setGlobalZoomValueToLocal(zoomObj);
		}
		
		ds.setOutputData();	
		
		if(magnifyData.showInAuth){
			
			var stg = cs.getCanvas();
			var cdLayer = cs.getLayer();
			var frameGroup = cs.findGroup('frame_0');
			var oldData = SLEData.getOldLabelDockData();
			
			var undoMng = window.CD.undoManager;
			var adminData = window.CD.module.data.Json.adminData;
			var GFS = parseInt(adminData.GFS);
			
			oldMagData = {};
			oldMagData.width = zhp.zoomW;
			oldMagData.height = zhp.zoomH;
			if(window.CD.module.data.Json.adminData.showZoomInAuth == 'F'){
				oldMagData.showInAuth = false;
			}else{
				if(window.CD.module.data.Json.adminData.showZoomInAuth == 'T'){
					oldMagData.showInAuth = true;
				}
			}
			
			oldMagData.scaleFactor = parseInt(zhp.scale)*100+'%';
			undoMng.register(this,SLEView.labelingMagnification,[oldMagData],'undo label magnification',this,SLEView.labelingMagnification,[magnifyData],'Redo label magnification')
			updateUndoRedoState(undoMng);
			var outputJSon = window.CD.module.data.Json.SLEData;

			window.CD.module.data.Json.adminData.showZoomInAuth = 'T';
			
			var zoomPlaceHolder = cs.findObject(frameGroup,'zoomPlaceHolder');
			
			if(zoomPlaceHolder){
				var height = zoomPlaceHolder.children[0].getHeight();
				var width = zoomPlaceHolder.children[0].getWidth();
				cdLayer.get('.zoom_place_holder')[0].removeChildren();
				cdLayer.get('.zoom_place_holder')[0].remove();
			}else{
				var height = zhp.zoomH;
				var width = zhp.zoomW;
			}
			var x = zhp.x;
			var y = zhp.y;
			var stg=window.CD.services.cs.getCanvas();
			var canvasEndY=parseInt(stg.getY()+stg.getHeight());
			var boxEndY = parseInt(y)+parseInt(magnifyData.height);
			if(boxEndY >=canvasEndY){
				y=parseInt(canvasEndY-parseInt(magnifyData.height)-50);	
			}
			var canvasEndX=parseInt(stg.getX()+stg.getWidth());
			var boxEndX = parseInt(x)+parseInt(magnifyData.width);
			if(boxEndX >=canvasEndX){
				x=parseInt(canvasEndX-parseInt(magnifyData.width)-50);	
			}
			SLEView.removeZoomPlaceHolder();
			zoomPlaceHolder = cs.createGroup('zoomPlaceHolder',{x : parseInt(x) , y : parseInt(y), draggable: true,name: 'zoom_place_holder'})
			var zoomPlc = new Kinetic.Rect({
				x: 0,
				y: 0,	
				height:parseInt(magnifyData.height),
				width:parseInt(magnifyData.width),
	            stroke: '#999999',
	            cornerRadius: 5,
	            strokeWidth: 1,
	            strokeEnabled: true,
	            fill: '#ffffff',
	            opacity:1,
	            id:'zoomPlcHolder'           
				});
			var zoomPlcText = new Kinetic.Text({			
				text : 'image preview',
				fontSize: GFS,
		        fontFamily: 'sans-serif',
		        fill: '#888',
		        opacity: '1',
		        width: 'auto',
		        height: 'auto',
		        align:'center',
	            id: 'zoomPlcText',
	            name: 'zoomPlcText'
	          });
		
			zoomPlaceHolder.add(zoomPlc);
			zoomPlaceHolder.add(zoomPlcText);
			zoomPlcText.setWidth(parseInt(zoomPlc.getWidth()));
			var zoomY = ((zoomPlc.getHeight())-(zoomPlcText.getTextHeight()))/2;
			zoomPlcText.setY(parseInt(zoomY));
			cdLayer.add(zoomPlaceHolder);
			
			var w = parseInt(magnifyData.width);
			var h = parseInt(magnifyData.height);
			var zoomPosX = parseInt(zoomPlaceHolder.getX());
			var zoomPosY = parseInt(zoomPlaceHolder.getY());
			if(!$.isNumeric(magnifyData.scaleFactor)){
				var scale = parseInt(magnifyData.scaleFactor.split('%')[0]/100);
			}
			SLEData.setZoomParametersToJson(w,h,zoomPosX,zoomPosY,scale);
			
			var outputJSon = window.CD.module.data.Json.SLEData;
			cdLayer.draw();
			/*zoomPlaceHolder.on('mousedown',function(evt){	
				openInspector('label');
				this.moveToTop();
			});*/
			zoomPlaceHolder.on('click',function(evt){
				openInspector('label');
				evt.cancelBubble = true;
			});
			zoomPlaceHolder.on('dragend',function(evt){
				evt.cancelBubble = true;
				var ds = window.CD.services.ds;
				var activeElement = window.CD.elements.active.element[0];
				var zhp = SLEData.getZoomParametersFromJson();
				var oldX = zhp.x;
				var oldY = zhp.y;
				undoMng.register(this,SLEView.undoRedoZoomBoxPosition,[zoomPlaceHolder,oldX,oldY],'Undo zoom box position',this,SLEView.undoRedoZoomBoxPosition,[zoomPlaceHolder,this.getX(),this.getY()],'Redo zoom box position');
				updateUndoRedoState(undoMng);
				SLEData.setZoomParametersToJson('','',this.getX(),this.getY(),'');
				ds.setOutputData();	
			});
			
		}else{
			window.CD.module.data.Json.adminData.showZoomInAuth = 'F';
			SLEView.removeZoomPlaceHolder();
		}
		if(window.CD.elements.active.element[0].attrs.id.match(/^label_[0-9]+/)||window.CD.elements.active.element[0].attrs.id.match(/^dock_label_[0-9]+/)){
			var labelGroup = cs.findGroup(window.CD.elements.active.element[0].attrs.id);
			var labelData = SLEData.getInspectorLabelData();
			SLEView.activelabelData(labelData,labelGroup);
			SLEView.populateLabelData(true,labelData);
		}
		
	},
	/**
	 * this is used for undo/redo of zoom position change
	 */
	undoRedoZoomBoxPosition : function(group,x,y){
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var x = parseInt(x);
		var y = parseInt(y);
		var cdLayer = cs.getLayer();
		group.setPosition(x,y);
		cdLayer.draw();
		SLEData.setZoomParametersToJson('','',x,y,'');
		ds.setOutputData();
	},
	removeZoomPlaceHolder : function(){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		if(cdLayer.get('.zoom_place_holder')[0]){
			cdLayer.get('.zoom_place_holder')[0].removeChildren();
			cdLayer.get('.zoom_place_holder')[0].remove();
		}
		cdLayer.draw();
	},
	updateZoomLocal : function(localData){
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		if(activeType == 'dock'){
			var sle = SLEData.getSLEIndex('label_'+activeElm.attrs.id.split('_')[2]);
			var dockGroup = cs.findGroup('dock_label_'+activeElm.attrs.id.split('_')[2]);
		}else{
			if(activeType == 'label'){
				var sle = SLEData.getSLEIndex(activeElm.attrs.id);
				var dockGroup = cs.findGroup('dock_'+activeElm.attrs.id);
			}
		}
		var scaleFactor = localData.scaleFactor.split('%')[0]/100;		
		//SLEData.setZoomParametersToJson(localData.width,localData.height,'','',scaleFactor);
		
		 ds.setOutputData();
	},
	
	bindInspectorEvents : function(){
		
		
			
		$('input[name=labelPresentation]').on('click',function(){
			var isCallToBind=true;
			SLEView.updateBindPublishingOption('','',isCallToBind,this);
		});
		
		/*
		 * For enable check/uncheck of global label inspector
		 */
		/*
		$('.magnifyTR #magnEnable').bind('change',function(){
			if(!$('#magnEnable').prop('checked')){
				SLEView.makeLabelGlobZoomDisable();
			}else{
				if($('#magTableGlobal').length!=0){
					$('#magTableGlobal').remove();
				}
			}
		});*/
			
		if(!$('input[name=dockSettings]:checked').val()){
	 		$('#nonEditableTr').css('display','none');
	 		$('#editableTr').css('display','block');
	 	}else{
	 		$('#editableTr').css('display','none');
	 		$('#nonEditableTr').css('display','block');
			$('#nonEditableTr #dockWidth').html($('#labelWidth').val()+'px');
			$('#nonEditableTr #dockHeight').html($('#labelHeight').val()+'px');
	 	}
		
		$('#dockSameSize').bind('change',function(){
			//window.CD.module.data.updateDimension({'width':$('#labelWidth').val(), 'height':$('#labelHeight').val(),'dockWidth':$('#dockWidth').val(), 'dockHeight':$('#dockHeight').val(), 'fill':$('#labelFillGlob').prop('checked'),'stroke':$('#labelBorderGlob').prop('checked'),'strokeDock':$('#dockBorderGlob').prop('checked'),'transpType':$('input[name=transparenType]:checked').val(),'hintOrFeedback':$('input[name=hintFeedback]:checked').val(),'labelOrDockHint':$('input[name=hoverHint]:checked').val(),'hintWidth':$('#hintWidth').val(), 'hintHeight':$('#hintHeight').val(),'labelOrDockFdbk':$('input[name=feedbackType]:checked').val(),'dockSameSize':$('#dockSameSize').prop('checked')});
			SLEView.sameSizeAsLabel($('#dockSameSize').prop('checked'));
		});


		$('#connectorWidthLoc').off('click').on('focusout',function(){
			SLEView.updateZoomLocal({'width':$('#connectorWidthLoc').val(),'height':$('#connectorHeightLoc').val(),'scaleFactor':$('#magnifyLocal').html(),'connectorEPoint':$('#conEndPointLoc').html()});
		});

		$('#connectorHeightLoc').on('focusout',function(){
			SLEView.updateZoomLocal({'width':$('#connectorWidthLoc').val(),'height':$('#connectorHeightLoc').val(),'scaleFactor':$('#magnifyLocal').html(),'connectorEPoint':$('#conEndPointLoc').html()});
		});
		


		/* ---------- For making Local transparent type and border readonly--------------*/
		//$(':radio[name=transparenTypeLoc],:checkbox[id=dockFillLoc],:checkbox[id=magnEnableLoc]').attr("disabled",true);
		$(':radio[name=transparenTypeLoc],:checkbox[id=dockFillLoc],:checkbox[id=magnEnableLoc]').click(function(){
			var showHide = this.checked;
			try{
				var ds = window.CD.services.ds;
				
				var activeElm = window.CD.elements.active.element;
				var windowData=window.CD.module.data;
				for(var i=0;i<window.CD.elements.active.element.length;i++){
					
					var labelId = activeElm[i].attrs.id;
					if(labelId.split('_')[0] == 'dock'){
						labelId = 'label_'+labelId.split('_')[2];
					}
					
					var sle =windowData.getLabelIndex(labelId);
					
					if(showHide == true){
						windowData.Json.SLEData[sle].connector_options.zoomingPresent = 'T';
					}else{
						if(showHide == false){
							windowData.Json.SLEData[sle].connector_options.zoomingPresent = 'F';
						}
					}
					SLEView.bindZoomEvent(activeElm[i]);
				}

					
				
				ds.setOutputData();	
			}
			catch(error){
				console.error("Error in sleView :: showHideLocalMagnificationBox::"+error.message);
			}
		});
		/* ------- on key - up store hint/feedback values ------------- */
		$('#localDiv textarea').on('paste keyup mouseenter',function(){
			var txtarea = this;
			var hintType = $('input[name=hoverHint]:checked').val();
			var feedbackType = $('input[name=feedbackType]:checked').val();
			setTimeout(function (){
				var hintVal = $('#textareaHint').val();
				var feedbackVal = $('#textareaFeedback').val();
				if(txtarea.textLength<=1){
					window.CD.module.view.bindFeedbackHintEvent($('input[name=hintFeedback]:checked').val(),$('input[name=hoverHint]:checked').val(),feedbackType);
				}
				window.CD.module.view.updateHintFeedbackVal(hintVal,feedbackVal);
				window.CD.module.view.onTypeingHintAndFeedback(txtarea);
			}, 100);
			
			
		});
		/*
	 	 * For Label Inspector Expanded and collapsed view
	 	 * By Nabonita Bhattacharyya
	 	 */
	 	
	 	$('.ui-icon').off("click").on("click",function(){
	 		if($(this).parents('tr').siblings('.hinttr').hasClass('display_none')){
	 			$(this).parents('tr').siblings('.hinttr').css('display','block');
	 			$(this).parents('tr').siblings('.hinttr').removeClass('display_none');
	 			$(this).addClass('ui-icon-position-ex').removeClass('ui-icon-position-col');
	 		}else{
	 			if($(this).parents('tr').siblings('.hinttr').css('display')=='block'){
	 				$(this).parents('tr').siblings('.hinttr').css('display','none');
	 				$(this).parents('tr').siblings('.hinttr').addClass('display_none');
	 				$(this).addClass('ui-icon-position-col').removeClass('ui-icon-position-ex');
		 		}
	 		}
	 	});
	 	
		$(document).not("#propertiesDivLabel div.select_options").click(function(e) {
			if((!($(e.target).hasClass('select_box'))) && ($(e.target).parents('.select_box').length == 0)) {					
				$('div.select_options').hide();
			}
			if(typeof window.CD.module.view.handleConnectorTypeChange == "function"){
				window.CD.module.view.handleConnectorTypeChange($(e.target).parents('.select_box').find('span.selected'));
			}
	    });
		/*on click on apply button on canvas property for Text Tool*/
		$("#distractorLoc").bind('change',function(){
			var activeElm = window.CD.elements.active.element; 
			window.CD.module.view.toggleDistractor($("#distractorLoc").prop('checked'),activeElm);
		});
		/*on click on local hide text in label inspector*/
		$('#localDiv #hideTextLoc').on('click',function(){
			var activeElmLength = window.CD.elements.active.element.length;
			var activeElmIds = [];
			for(var i=0;i<activeElmLength;i++){
				activeElmIds.push(window.CD.elements.active.element[i].attrs.id);
			}
			
			var sleTextTool= new TextTool.commonLabelText();
			sleTextTool.onClickHideLabelText(activeElmIds);//for hide text this method is used. Now it is shifted to commonLabelText
			
		});
		
		$('#magnificationTable').children().find('td input').each(function(){
			console.log('**** Local magnification change bind ****');
			$(this).on('change blur',function(){
				var errorModal = window.CD.util.getTemplate({url: 'resources/themes/default/views/error_modal.html?{build.number}'});
				var alertMsg = "";
				alertMsg = SLEView.populateErrorMessage(alertMsg,'local');
				
				if(alertMsg != ""){
					$('#toolPalette #errorModal').remove();
					$('#toolPalette').append(errorModal);
					
					$("#errorModal span#errorCancel").hide();
					$("#errorModal span#errorOk").html("Ok");
					$('#alertText .frame_warning_text').show();
					$('#errorModal #errAlertText').html(alertMsg);
					$('#errorModal').slideDown(200);		
					$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
				}
				$("#errorContainer span#errorOk").off('click').on('click',function(){						
					$('#errorModal').slideUp(200);
					
					var active = window.CD.elements.active;
					var activeElm = active.element[0];
					var type = window.CD.elements.active.type;
					
					var labelId = '';
					if(type == 'label'){
						labelId = activeElm.getId();
					}else{
						if(type == 'dock'){
							labelId = activeElm.getId().split('dock_')[1];
						}
					}					
					var localZoomObj = SLEData.getLocalMagnificationVal(labelId);
					var placeholderWidth = localZoomObj.localMagnificationWidth;
					var placeholderHeight = localZoomObj.localMagnificationHeight;
										
					$('#connectorWidthLoc').val(placeholderWidth);
					$('#connectorHeightLoc').val(placeholderHeight);
				});
		
				if(alertMsg == ""){
					var active = window.CD.elements.active;
					var activeElm = active.element;
					var type = window.CD.elements.active.type;
					var activeElmLength = active.element.length;
					var labelId = [];
					if(type == 'label'){
						for(var i=0;i<activeElmLength;i++){
							labelId.push(activeElm[i].getId());
						}
					}else{
						if(type == 'dock'){
							for(var i=0;i<activeElmLength;i++){
								labelId.push(activeElm[i].getId().split('dock_')[1]);
							}
						}
					}		
					SLEView.localZoomMagnification({'width':$('#connectorWidthLoc').val(),'height':$('#connectorHeightLoc').val(),'scaleFactor':$('#magnifyLocal').html()},labelId);
				}
			});
		});
		
		$('#magLocalDiv .magnifyTR #magnifyLoc').children('.select_options').click(function(){
			var ds = window.CD.services.ds;
			SLEData.getJsonAdminData().magnificationData = 'local';
			
			var active = window.CD.elements.active;
			var activeElm = active.element;
			var type = window.CD.elements.active.type;
			var activeElmLength = active.element.length;
			var labelId = [];
			if(type == 'label'){
				for(var i=0;i<activeElmLength;i++){
					labelId.push(activeElm[i].getId());
				}
			}else{
				if(type == 'dock'){
					for(var i=0;i<activeElmLength;i++){
						labelId.push(activeElm[i].getId().split('dock_')[1]);
					}
				}
			}
			
			var zoomObj = {};
			var scaleFactor = $('#magnifyLoc .selected').html();
			zoomObj.localMagnificationFactor = parseInt(scaleFactor)/100;
			SLEData.setLocalMagnificationVal(labelId,zoomObj);
		});
 	
	},
	//////////// COMMON ///////////////////////
	createKineticObject: function(options){ 
   	 console.log("@SLEView::createKineticObject");
		 try{
			 var kineticOPT=options.kinteticOpt;
			 if(options.type==="Rect" || options.type==="TextRect" ){
				if(options.type!=="TextRect"){
	 				var defaultLabelOPT={
	 									fontSize:this.defaultLabelStrokeCLR,
								 		strokeWidth:this.defaultTextFontFamily,
								 		cornerRadius:this.defaultLabelCornerRadius,
								 		Stroke:this.defaultLabelStrokeCLR
						 		 };
	 				kineticOPT=$.extend(defaultLabelOPT,kineticOPT);
				}
				var kineticObject = new Kinetic.Rect(kineticOPT);
				 
			 }else if(options.type==="Text"){
				  var kineticObject = new Kinetic.Text(kineticOPT);
			 }
			//console.log(kineticObject);
			 return 	kineticObject
		}catch(err){
			console.error("@SLEView::Error on createKineticObject::"+err.message);
		}
    },
	fixTextEntities:function(input){
 		console.log("@SLEView.fixTextEntities");
 		try{
 		    var result = (new String(input)).replace(/&(amp;)/g, "&");
 		    return result.replace(/&#(\d+);/g, function(match, number){ return String.fromCharCode(number); });
 		}catch(err){
 			console.error("@SLEView::Error on fixTextEntities::"+err.message);
 		}
 	},
 	//	//////////COMMON ///////////////////////
	bindConnetorEvent : function(){
		 $('#propertiesDivLabel div.select_box').each(function(){
		
		$(this).parent().children('div.select_box').click(function(){
			if($(this).children('div.select_options').css('display') == 'none'){
				$(this).children('div.select_options').css('display','block');
				if($(this).find('.selected').hasClass('indexCheck')){
					$(this).children('div.select_options').css('z-index',999);
				}
			}
			else
			{
				$(this).children('div.select_options').css('display','none');
				if($(this).find('.selected').hasClass('indexCheck')){
					$(this).children('div.select_options').css('z-index',0);
				}
			}
		});
		
		$(this).find('span.select_option').click(function(){	
		
			//$(this).parent().css('display','none');
			$(this).closest('div.select_box').attr('value',$(this).attr('value'));
			$(this).parent().siblings('span.selected').html($(this).html());
			
		});
	});
	},
   globalApplyClick: function(errorModal){
		var regex = /^\s*([0-9]*\.[0-9]+|[0-9]+)\s*$/;
	   
		if(window.CD.elements.active.type == 'label' || window.CD.elements.active.type == 'dock') {
			var minLabelWidth = 30;
			var minLabelHeight = 30;
			var maxLabelWidth = window.CD.width;
			var maxLabelHeight = window.CD.height;
			var maxConHeight=400;
			var maxConWidth=400;
			var activeLabelWidth = parseInt($('#labelWidth').val());
			var activeLabelHeight = parseInt($('#labelHeight').val());
			var passFlag = false;
			
			var activeDockWidth = parseInt($('#dockWidth').val());
			var activeDockHeight = parseInt($('#dockHeight').val());
			
			var activeConWidth = parseInt($('#connectorWidthGlob').val());
			var activeConHeight = parseInt($('#connectorHeightGlob').val());
			
			var activeHintWidth = parseInt($('#hintWidth').val());
			var activeHintHeight = parseInt($('#hintHeight').val());
			
			var activeFeedbackWidth = parseInt($('#feedbackWidth').val());
			var activeFeedbackHeight = parseInt($('#feedbackHeight').val());
		
			var showHide = $('#magnEnable').prop('checked');
			
			if($('#labelBorderGlob').prop('checked') == true){
				$('#dockBorder').prop('checked',true);
			}else{
				$('#dockBorder').prop('checked',false);
			}
			var alertMsg = "";
			var data = {
				'width':$('#labelWidth').val(),
				'height':$('#labelHeight').val(),
				'dockWidth':$('#dockWidth').val(),
				'dockHeight':$('#dockHeight').val(),
				'fill':$('#labelFillGlob').prop('checked'),
				'stroke':$('#labelBorderGlob').prop('checked'),
				'fillBorderDrop':$('#fillBorderDrop').prop('checked'),
				'strokeDock':$('#dockBorderGlob').prop('checked'),
				'transpType':$('input[name=transparenType]:checked').val(),
				'hintOrFeedback':$('input[name=hintFeedback]:checked').val(),
				'labelOrDockHint':$('input[name=hoverHint]:checked').val(),
				'hintWidth':$('#hintWidth').val(),
				'hintHeight':$('#hintHeight').val(),
				'labelOrDockFdbk':$('input[name=feedbackType]:checked').val(),
				'feedbackWidth':$('#feedbackWidth').val(), 
				'feedbackHeight':$('#feedbackHeight').val(),
				'dockSameSize':$('#dockSameSize').prop('checked'),
				'connectorEndpointType':$('#conEndPointGlob').html(),
				'hideTextGlobal':$('#hideTextGlobal').prop('checked'),
				'showHiddenTxtGlobal':$('#showHiddenTxtGlobal').prop('checked')
			};
			var oldData = {};
			var oldData = SLEData.populateLabelDockData(oldData);
			var dataJson = {};
			dataJson = SLEData.getChangedJson(oldData,data,dataJson);
			
			if(window.CD.services.cs.objLength(dataJson) > 0){
				console.log("For all inspector data except magnification");
				if($.trim($('#hintWidth').val()) == "" || $.trim($('#feedbackWidth').val()) == "")
					alertMsg += "The width of the hint or feedback box cannot be left blank. <br/><br/>";
				if($.trim($('#hintHeight').val()) == "" || $.trim($('#feedbackHeight').val())== "")
					alertMsg += "The height of the hint or feedback box cannot be left blank. <br/><br/>";
				if(activeHintWidth > maxLabelWidth || activeFeedbackWidth > maxLabelWidth)
					alertMsg += "The width of the hint or feedback box cannot be greater than "+maxLabelWidth+"px.<br/><br/>";
				if(activeHintHeight > maxLabelHeight || activeFeedbackHeight > maxLabelWidth)
					alertMsg += "The height of the hint or feedback box cannot be greater than "+maxLabelHeight+"px.<br/><br/>";
				if(activeHintWidth < minLabelWidth || activeFeedbackWidth < minLabelWidth)
					alertMsg += "The width of the hint or feedback box must be greater than or equal to 30px. <br><br/>";
				if(activeHintHeight < minLabelHeight || activeFeedbackHeight < minLabelWidth)
					alertMsg += "The height of the hint or feedback box must be greater than or equal to 30px.";
				if(($.trim($('#labelWidth').val()) != "") && ($.trim($('#labelHeight').val() !="")) && activeLabelWidth <= maxLabelWidth && activeLabelHeight <= maxLabelHeight && activeLabelWidth >= minLabelWidth && activeLabelHeight >= minLabelHeight && alertMsg==''){
					passFlag = true;
				
					//window.CD.module.view.updateDimension(data);
					/* ----- for label magnification box ------- */
					
				}
				else{
					passFlag = false;	
						if($.trim($('#labelWidth').val()) == "")
							alertMsg += "The width of the label cannot be left blank. <br/><br/>";
						if($.trim($('#labelHeight').val()) == "")
							alertMsg += "The height of the label cannot be left blank. <br/><br/>";
						if(activeLabelWidth > maxLabelWidth)
							alertMsg += "The width of the label cannot be greater than "+maxLabelWidth+" px.<br/><br/>";
						if(activeLabelHeight > maxLabelHeight)
							alertMsg += "The height of the label cannot be greater than "+maxLabelHeight+" px.<br/><br/>";
						if(activeLabelWidth < minLabelWidth)
							alertMsg += "The width of the label must be greater than or equal to 30px. <br><br/>";
						if(activeLabelHeight < minLabelHeight)
							alertMsg += "The height of the label must be greater than or equal to 30px.";

						
				}
				if((regex.test($.trim($('#labelWidth').val()))==false) || (regex.test($.trim($('#labelHeight').val()))==false)){
					$('#labelWidth').val('');
					$('#labelHeight').val('');
					 regexFlag = false;
				}
				else
					 regexFlag = true;
				if(($.trim($('#dockWidth').val()) != "") && ($.trim($('#dockHeight').val() !="")) && activeDockWidth <= maxLabelWidth && activeDockHeight <= maxLabelHeight && activeDockWidth >= minLabelWidth && activeDockHeight >= minLabelHeight && alertMsg==''){
					passFlag = true;
					//window.CD.module.view.updateDimension(data);
					/* ----- for label magnification box ------- */
					
				}
				else{
					passFlag = false;
						if($.trim($('#dockWidth').val()) == "")
							alertMsg += "The width of the dock cannot be left blank. <br/><br/>";
						if($.trim($('#dockHeight').val()) == "")
							alertMsg += "The height of the dock cannot be left blank. <br/><br/>";
						if(activeDockWidth > maxLabelWidth)
							alertMsg += "The width of the dock cannot be greater than "+maxLabelWidth+"<br/><br/>";
						if(activeDockHeight > maxLabelHeight)
							alertMsg += "The height of the dock cannot be greater than "+maxLabelHeight+"<br/><br/>";
						if(activeDockWidth < minLabelWidth)
							alertMsg += "The width of the dock must be greater than or equal to 30px. <br><br/>";
						if(activeDockHeight < minLabelHeight)
							alertMsg += "The height of the dock must be greater than or equal to 30px.";
						
				}
				if(alertMsg != ""){
					$('#toolPalette #errorModal').remove();
					$('#toolPalette').append(errorModal);
					
					$("#errorModal span#errorCancel").hide();
					$("#errorModal span#errorOk").html("Ok");
					$('#alertText .frame_warning_text').show();
					$('#errorModal #errAlertText').html(alertMsg);
					$('#errorModal').slideDown(200);		
					$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
				}
				$("#errorContainer span#errorOk").off('click').on('click',function(){						
					$('#errorModal').slideUp(200);
					var width = window.CD.module.data.Json.adminData.SLELD.split(',')[0];
					var height = window.CD.module.data.Json.adminData.SLELD.split(',')[1];
					var zhp = window.CD.module.data.getZoomParametersFromJson();
					var hintparam = window.CD.module.data.getHintFeedbackFromJson();
					
					var hintWd = hintparam.hintW;
					var hintHt = hintparam.hintH;
					var feedbackWd = hintparam.feedbackW;
					var feedbackHt = hintparam.feedbackH;
					
					$('#labelWidth').val(width);
					$('#labelHeight').val(height);
					
					$('#hintWidth').val(hintWd);
					$('#hintHeight').val(hintHt);
					$('#feedbackWidth').val(feedbackWd);
					$('#feedbackHeight').val(feedbackHt);
					
				});
				if(passFlag && regexFlag)
					window.CD.module.view.updateDimension(data,undefined,undefined,dataJson);
			}
				
			var magnificationData = {
					'magnifyShowInAuth':$('#magnifySettings').prop('checked'),
					'magnificationFactor' : $('#magnifyGlobal').html(),
					'zoomWidth' : $('#connectorWidthGlob').val(),
					'zoomHeight' : $('#connectorHeightGlob').val()
			};
			
			var oldMagData = {};
			var oldMagData = SLEData.populateMagnificationData(oldMagData);
			var magDataJson = {};
			magDataJson = SLEData.getChangedJson(oldMagData,magnificationData,magDataJson);
			
			if(window.CD.services.cs.objLength(magDataJson) > 0){
				console.log("For global magnification data");
				/** populate Error message **/
				alertMsg = SLEView.populateErrorMessage(alertMsg,'global');
				if(alertMsg != ""){
					$('#toolPalette #errorModal').remove();
					$('#toolPalette').append(errorModal);
					
					$("#errorModal span#errorCancel").hide();
					$("#errorModal span#errorOk").html("Ok");
					$('#alertText .frame_warning_text').show();
					$('#errorModal #errAlertText').html(alertMsg);
					$('#errorModal').slideDown(200);		
					$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
				}
				$("#errorContainer span#errorOk").off('click').on('click',function(){						
					$('#errorModal').slideUp(200);
					var zhp = window.CD.module.data.getZoomParametersFromJson();
					var hintparam = window.CD.module.data.getHintFeedbackFromJson();
					var placeholderWidth = zhp.zoomW;
					var placeholderHeight = zhp.zoomH;
					
					$('#connectorWidthGlob').val(placeholderWidth);
					$('#connectorHeightGlob').val(placeholderHeight);
				});
		
				if(alertMsg == "" && ($.trim($('#connectorWidthGlob').val()) != "") && ($.trim($('#labelHeight').val() !="")) && activeConWidth <= maxConWidth && activeConHeight <= maxConHeight && activeConWidth >= minLabelWidth && activeConHeight >= minLabelHeight){
					if((magDataJson.zoomWidth != undefined) || (magDataJson.zoomHeight != undefined)){
						SLEData.getJsonAdminData().magnificationData = 'global';
					}
					SLEView.labelingMagnification({'width':$('#connectorWidthGlob').val(),'height':$('#connectorHeightGlob').val(),'showInAuth':$('#magnifySettings').prop('checked'),'scaleFactor':$('#magnifyLocal').html()});
					var outputJSon = SLEData.getJsonData();
					for(var sleCount in outputJSon){
						var dockGroupID = 'dock_'+outputJSon[sleCount].labelGroupId;
						var dockGroup = window.CD.services.cs.findGroup(dockGroupID);
						SLEView.bindZoomEvent(dockGroup);
					}
				}				
			}
			
			if(!passFlag){
				var labelData = SLEData.getInspectorLabelData();
				var labelGrp = SLEData.getLabelGroup();
				
				SLEView.activelabelData(labelData,labelGrp);
				SLEView.populateLabelData(true,labelData);
			}
			//window.CD.module.view.bindFeedbackHintEvent($('input[name=hintFeedback]:checked').val(),$('input[name=hoverHint]:checked').val());
			window.CD.module.view.bindFeedbackHintEventAllLabel($('input[name=hintFeedback]:checked').val(),$('input[name=hoverHint]:checked').val(),$('input[name=feedbackType]:checked').val());
			
			/*var hintVal = $('#textareaHint').val();
			var feedbackVal = $('#textareaFeedback').val();
			window.CD.module.view.updateHintFeedbackVal(hintVal,feedbackVal);*/
			
			SLEView.showHideMagnificationBox(showHide,'global');
			
			//SLEView.bindZoomEvent($('#magnifySettings').prop('checked'),$('#magnifyGlobal').html());
			
		}
		
	},
	populateErrorMessage : function(alertMsg,globOrLoc){
		console.log("@populateErrorMessage::SLEView");
		try{
			var regex = /^\s*([0-9]*\.[0-9]+|[0-9]+)\s*$/;
			
			var maxConHeight=400;
			var maxConWidth=400;
			var minLabelWidth = 30;
			var minLabelHeight = 30;
			
			var widthId = 'connectorWidthGlob';
			var heightId = 'connectorHeightGlob';			
			if(globOrLoc == 'local'){
				widthId = 'connectorWidthLoc';
				heightId = 'connectorHeightLoc';
			}
			var activeConWidth = parseInt($('#'+widthId).val());
			var activeConHeight = parseInt($('#'+heightId).val());
			
			if($.trim($('#'+widthId).val()) == "")
				alertMsg += "The width of the image preview box cannot be left blank. <br/><br/>";
			if($.trim($('#'+heightId).val()) == "")
				alertMsg += "The height of the image preview box cannot be left blank. <br/><br/>";
			if(activeConWidth > maxConWidth)
				alertMsg += "The width of the image preview box cannot be greater than "+maxConWidth+"px.<br/><br/>";
			if(activeConHeight > maxConHeight)
				alertMsg += "The height of the image preview box cannot be greater than "+maxConHeight+"px.<br/><br/>";
			if(activeConWidth < minLabelWidth)
				alertMsg += "The width of the image preview box must be greater than or equal to 30px. <br><br/>";
			if(activeConHeight < minLabelHeight)
				alertMsg += "The height of the image preview box must be greater than or equal to 30px.";
			if((regex.test($.trim($('#'+widthId).val()))==false) || (regex.test($.trim($('#'+heightId).val()))==false)){
				$('#'+widthId).val('');
				$('#'+heightId).val('');
			}
			return alertMsg;
		}catch(err){
			console.log("Error in populateErrorMessage :: SLEView "+err.message);
		}
	},
	
	resetMagnifyValue : function(){
		console.log("@resetMagnifyValue :: SLEView");
		try{
			var zhp = window.CD.module.data.getZoomParametersFromJson();
			var placeholderWidth = zhp.zoomW;
			var placeholderHeight = zhp.zoomH;
			
			$('#connectorWidthGlob').val(placeholderWidth);
			$('#connectorHeightGlob').val(placeholderHeight);
		}catch(error){
			console.log("Error in resetMagnifyValue :: SLEView "+error.message);
		}
	},
	showHideMagnificationBox : function(showHide,globalOrLocal,index){
		try{
			var ds = window.CD.services.ds;
			var outputJSon = SLEData.getJsonData();
			
			if(globalOrLocal == 'global'){
				for(var sle in outputJSon){
					if(showHide == true){
						outputJSon[sle].connector_options.zoomingPresent = 'T';
						
					}else{
						if(showHide == false){
							outputJSon[sle].connector_options.zoomingPresent = 'F';							
						}
					}
				}
				if(showHide == false){
					SLEView.makeLabelGlobZoomDisable();
					$('#magnEnable').prop('checked',false);
					$('#magnEnableLoc').prop('checked',false);
				}else{
					if($('#magTableGlobal').length!=0){
						$('#magTableGlobal').remove();
					}
					$('#magnEnable').prop('checked',true);
					$('#magnEnableLoc').prop('checked',true);
				}				
			}else{
				if(index){
					if(showHide == true){
						outputJSon[index].connector_options.zoomingPresent = 'T';
						$('#magnEnableLoc').prop('checked',true);
					}else{
						if(showHide == false){
							outputJSon[index].connector_options.zoomingPresent = 'F';
							$('#magnEnableLoc').prop('checked',false);
						}
					}
				}				
			}
			
			ds.setOutputData();	
		}
		catch(error){
			console.error("Error in sleView :: showHideMagnificationBox::"+error.message);
		}
	},
	/*
	 * This method is used for resizing dock for adjust label to frame
	 * By Nabonita Bhattacharyya
	 */
	adjustLabelResizeDock : function(labelGroupDock,labelGroupID,frameWidth,frameHeight,calcX,calcY){
		if($('#dockSameSize').prop('checked')){
			labelGroupDock.children[0].setHeight(frameHeight);
			labelGroupDock.children[0].setWidth(frameWidth);
			
			var unlockIconDock = labelGroupDock.get('.unlockicon_dock_'+labelGroupID)[0];
			var lockIconDock = labelGroupDock.get('.lockicon_dock_'+labelGroupID)[0];
			unlockIconDock.setX(calcX);
			lockIconDock.setX(calcX);
			unlockIconDock.setY(calcY);
			lockIconDock.setY(calcY);
			
			SLEData.Json.DCKLD = frameWidth+','+frameHeight;
			
			var topLeft = labelGroupDock.get('.topLeft_dock_'+labelGroupID)[0];
			var topRight = labelGroupDock.get('.topRight_dock_'+labelGroupID)[0];
			var bottomLeft = labelGroupDock.get('.bottomLeft_dock_'+labelGroupID)[0];
			var bottomRight = labelGroupDock.get('.bottomRight_dock_'+labelGroupID)[0];
			
			topLeft.setX(0);
			topLeft.setY(0);
			topRight.setX(frameWidth);
			topRight.setY(0);
			bottomLeft.setX(0);
			bottomLeft.setY(frameHeight);
			bottomRight.setX(frameWidth);
			bottomRight.setY(frameHeight);
			SLEView.resetConnectorPos();
		}
	},
	
	/*
	 * This method is for populating Global and Local tab for
	 * Label Inspector
	 * On apply click view will be populated with user chosen values
	 * By Nabonita Bhattacharyya
	 */
	applyPopulate : function(){
		
		if(!window.CD.module.data.Json.adminData.DOCSAMEASLABEL){
	 		$('#nonEditableTr').css('display','none');
	 		$('#editableTr').css('display','block');
	 		var dockWidth = window.CD.module.data.Json.DCKLD.split(',')[0];
			var dockHeight = window.CD.module.data.Json.DCKLD.split(',')[1];
			$('#dockWidth').val(dockWidth);
			$('#dockHeight').val(dockHeight);
			
			$('#localDockWidth').html(dockWidth+'px');
			$('#localDockHeight').html(dockHeight+'px');
	 	}else{
	 		$('#editableTr').css('display','none');
	 		$('#nonEditableTr').css('display','block');
	 		
	 		var dockWidth = window.CD.module.data.Json.DCKLD.split(',')[0];
			var dockHeight = window.CD.module.data.Json.DCKLD.split(',')[1];
			
	 		$('#nonEditableTr #dockWidth').html(dockWidth+'px');
			$('#nonEditableTr #dockHeight').html(dockHeight+'px');
			
			$('#nonEditableTr #dockWidth').val(dockWidth+'px');
			$('#nonEditableTr #dockHeight').val(dockHeight+'px');
			
			$('#localDockWidth').html(dockWidth+'px');
			$('#localDockHeight').html(dockHeight+'px');
	 	}
		$('#localLabelWidth').html($('#labelWidth').val());
		$('#localLabelHeight').html($('#labelHeight').val());
		
		
		
		if($('input[name=transparenType]:checked').val() === 'solid'){
			$('input[name=transparenTypeLoc][value=solid]').prop('checked',true);
		}else if($('input[name=transparenType]:checked').val() === 'semitransparent'){
			$('input[name=transparenTypeLoc][value=semitransparent]').prop('checked',true);
		}else{
			$('input[name=transparenTypeLoc][value=transparent]').prop('checked',true);
		}
		if($('#dockBorderGlob').prop('checked')){
			$('#dockFillLoc').prop('checked',true);
		}else{
			$('#dockFillLoc').prop('checked',false);
		}
		if($('#magnEnable').prop('checked')){
			$('#magnEnableLoc').prop('checked',true);
		}else{
			$('#magnEnableLoc').prop('checked',false);	
		}
		
		$('#conEndPointLoc').html($('#conEndPointGlob').html());
		
		$('#magnifyLocal').html($('#magnifyGlobal').html());
		
		$('#connectorWidthLoc').val($('#connectorWidthGlob').val());
		$('#connectorHeightLoc').val($('#connectorHeightGlob').val());

	},
	
	/*
	 * This method is for populating Global and Local tab for
	 * Label Inspector
	 * On apply click view will be populated with user chosen values
	 * By Nabonita Bhattacharyya
	 */
	populateLabelData : function(applyEnable,labelData,hintArea){
		if(labelData){
			$('#labelWidth').val(labelData.labelWidth);
			$('#labelHeight').val(labelData.labelHeight);
			
			if(!labelData.dockSameSize){
		 		$('#nonEditableTr').css('display','none');
		 		$('#editableTr').css('display','block');

				$('#dockWidth').val(labelData.dockWidth);
				$('#dockHeight').val(labelData.dockHeight);
				
				$('#dockSameSize').prop('checked',false);
		 	}else{
		 		$('#editableTr').css('display','none');
		 		$('#nonEditableTr').css('display','block');
		 		
		 		$('#nonEditableTr #dockWidth').html(labelData.dockWidth+'px');
				$('#nonEditableTr #dockHeight').html(labelData.dockHeight+'px');
				
				$('#nonEditableTr #dockWidth').val(labelData.dockWidth+'px');
				$('#nonEditableTr #dockHeight').val(labelData.dockHeight+'px');
				
				$('#dockSameSize').prop('checked',true);
		 		
		 	}
			$('#localLabelWidth').html(labelData.labelWidth+'px');
			$('#localLabelHeight').html(labelData.labelHeight+'px');
			
			$('#localDockWidth').html(labelData.labelWidth+'px');
			$('#localDockHeight').html(labelData.labelHeight+'px');
			
			if(labelData.transparency === 'solid'){
				$('input[name=transparenType][value=solid]').prop('checked',true);
				$('input[name=transparenTypeLoc][value=solid]').prop('checked',true);
			}else if(labelData.transparency === 'semitransparent'){
				$('input[name=transparenType][value=semitransparent]').prop('checked',true);
				$('input[name=transparenTypeLoc][value=semitransparent]').prop('checked',true);
			}else{
				$('input[name=transparenType][value=transparent]').prop('checked',true);
				$('input[name=transparenTypeLoc][value=transparent]').prop('checked',true);
			}
			
			if(labelData.strokeDock){
				$('#dockBorderGlob').prop('checked',true);
				$('#dockFillLoc').prop('checked',true);
			}else{
				$('#dockBorderGlob').prop('checked',false);
				$('#dockFillLoc').prop('checked',false);
			}
			
			if(labelData.fillEnabled) {
				$('#labelFillGlob').prop('checked',true);
			}else{
				$('#labelFillGlob').prop('checked',false);
			}
			if(labelData.strokeEnabled) {
				$('#labelBorderGlob').prop('checked',true);
			}else{
				$('#labelBorderGlob').prop('checked',false);
			}
			
			/* ------------- For Hint / Feedback ---------------- */
			$('#hintWidth').val(labelData.hintWidth);
			$('#hintHeight').val(labelData.hintHeight);
			
			
			$('#feedbackWidth').val(labelData.feedbackWidth);
			$('#feedbackHeight').val(labelData.feedbackHeight);
			
			if(labelData.hintLabelOrDock == 'D'){
				$('input[name=hoverHint][value=dock]').prop('checked',true);
			}else{
				if(labelData.hintLabelOrDock == 'L'){
					$('input[name=hoverHint][value=label]').prop('checked',true);
				}
			}
			if(labelData.feedbackLabelOrDock == 'D'){
				$('input[name=feedbackType][value=dock]').prop('checked',true);
			}else{
				if(labelData.feedbackLabelOrDock == 'L'){
					$('input[name=feedbackType][value=label]').prop('checked',true);
				}
			}
			
			if(labelData.showHintOrFeedbackInAuthoring == 'none'){
				$('input[name=hintFeedback][value=none]').prop('checked',true);
			}else if(labelData.showHintOrFeedbackInAuthoring == 'hint'){
					$('input[name=hintFeedback][value=hint]').prop('checked',true);
			}else{
				if(labelData.showHintOrFeedbackInAuthoring == 'feedback'){
					$('input[name=hintFeedback][value=feedback]').prop('checked',true);
				}
			}
			if(labelData.infoHideText=='T'){
				$('#hideTextLoc').prop('checked',true);
			}else{
				if(labelData.infoHideText=='F'){
					$('#hideTextLoc').prop('checked',false);
				}
			}
			
			/*----------- For Make distractor in label ------------ */
			if(labelData.distractor == 'F'){
				$('#distractorLoc').prop('checked',false);
			}else{
				if(labelData.distractor == 'T'){
					$('#distractorLoc').prop('checked',true);
				}
			}
			if(labelData.fillBorderDrop){
				$('#fillBorderDrop').prop('checked',true);
			}else{
				$('#fillBorderDrop').prop('checked',false);
			}
			/* ---------- For magnification --------- */	
			if(labelData.showZoomInAuth == 'T'){
				$('#magnifySettings').prop('checked',true);
			}else{
				if(labelData.showZoomInAuth == 'F'){
					$('#magnifySettings').prop('checked',false);
				}
			}
			
			/** ------------- For zoom enabled ------------- **/
			/*if(labelData.zoomEnable == 'T'){
				$('#magnEnable').prop('checked',true);
			}else{
				if(labelData.zoomEnable == 'F'){
					$('#magnEnable').prop('checked',false);
				}
			}*/
			
			if(SLEData.globalConnectorType != 'none'){
				if(labelData.connector == "T"){
					var connectorPt = labelData.connectorPoint;
					
					var connectorArray = {
							'D':'single endpoint',
							'2':'two endpoint',
							'3':'three endpoint',
							'4':'four endpoint',
							'5':'five endpoint',
							'B':'bracket',
							'H':'H bracket'
					};
					$.each(connectorArray,function(connKey,connValue){
						if(connKey===connectorPt){
							$('#conEndPointLoc').html(connValue);
						}
					});
					
					var showHide = $('#magnEnable').prop('checked');
					SLEView.showHideMagnificationBox(showHide,'local');
					
					/** ----- For updating connector type global on render ----- **/
					var outputJSon = SLEData.getJsonData();
					var flag = '';
					var connPoint = '';
					var nextConnPnt = ''
					for(var sle in outputJSon){
						if(connPoint && connPoint != ''){
							nextConnPnt = window.CD.module.data.Json.SLEData[sle].connector_options.connectorType.split('%d%')[0];
							if(connPoint == nextConnPnt){
								flag = true;
								connPoint = nextConnPnt;
							}else{
								flag = false;
								break;
							}
						}else{
							connPoint = window.CD.module.data.Json.SLEData[sle].connector_options.connectorType.split('%d%')[0];;
						}
					}
					if(flag && flag == true){
						$('#conEndPointGlob').html($('#conEndPointLoc').html());
					}					
				}
			}else{
				$('#conEndPointLoc').html('none');
			}
			
			if(labelData.zoomWidth && labelData.zoomHeight){
				$('#connectorWidthGlob').val(labelData.zoomWidth);
				$('#connectorHeightGlob').val(labelData.zoomHeight);				
			}
			
			if(labelData.localZoomWidth && labelData.localZoomHeight){
				$('#connectorWidthLoc').val(labelData.localZoomWidth);
				$('#connectorHeightLoc').val(labelData.localZoomHeight);
			}
			
			var scaleFctr = labelData.scaleFactor;
			var localScaleFactor = labelData.localScaleFactor;
			var scaleFactorArray = {
					'2':'200%',
					'4':'400%',
					'6':'600%'
			};
			$.each(scaleFactorArray,function(scaleKey,scaleValue){
				if(parseInt(scaleKey)===scaleFctr){
					$('#magnifyGlobal').html(scaleValue);
				}
			});
			$.each(scaleFactorArray,function(scaleKey,scaleValue){
				if(parseInt(scaleKey)===localScaleFactor){
					$('#magnifyLocal').html(scaleValue);
				}
			});
		}
		
		if(applyEnable){
			$('#globalApply').removeClass('inactive');
		}else{
			$('#globalApply').addClass('inactive');
		}
	},
	
	/**
	 * function name: updateBindPublishingOption()
	 * author:Piyali Saha
	 */
	updateBindPublishingOption : function(groups,distractorLbl,isCallToBind,radioButtObj){
		console.log("@SLEView.updateBindPublishingOption");
		try{
			var activeElmLength = window.CD.elements.active.element.length;
			for(var j=0;j<activeElmLength;j++){
				var activeElm = window.CD.elements.active.element[j];
				var activeType=window.CD.elements.active.type;
				var group = groups;
				if(!group)group=activeElm;
				
				if(typeof group==="object" && (group.attrs.id.match(/^label_[0-9]+/)|| group.attrs.id.match(/^dock_label_[0-9]+/))){
					if(group.attrs.id.match(/^label_[0-9]+/)){ 
						var grpId=group.attrs.id;
					}else if(group.attrs.id.match(/^dock_label_[0-9]+/)){ 
						var grpId=group.attrs.id.substr(5,group.attrs.id.length);
					}				
					var pubVal="standard";
					var windowData=window.CD.module.data;
					var dataIndex =windowData.getLabelIndex(grpId);
					if(distractorLbl){
						var distractor=distractorLbl;
					}else {
						var distractor=windowData.getEachLabelOutputData(dataIndex,"distractor_label");
					}
		    	    	
				if(isCallToBind && group){
					
					var pubValue='S';
					if(distractor==="F"){
						if($(radioButtObj).val()==="required")pubValue='R';
						else if($(radioButtObj).val()==="standard")pubValue='S';
						else if($(radioButtObj).val()==="given")pubValue='G';
						else if($(radioButtObj).val()==="distractorWithDock")pubValue='DC';
					}else if(distractor==="T"){
							$(radioButtObj).prop('checked',false);
							$('input[name=labelPresentation][value=standard]').prop('checked',true);
					}
					
					var changefieldArr={publishingOption:pubValue};
					windowData.setEachLabelOutputData(dataIndex,changefieldArr);
					var sledata = SLEData.getJsonData();
					var paramName = sledata[dataIndex].name;
					for(var key in sledata){
						if(sledata[key].name == paramName){
							var changefieldArr={publishingOption:pubValue};
							windowData.setEachLabelOutputData(key,changefieldArr);
						}
					}
						
					
				}else{
					/*populate data in local inspector*/
					var publishingOption=windowData.getEachLabelOutputData(dataIndex,"publishingOption");
					if(publishingOption){
						if(publishingOption==='R')pubVal="required";
						else if(publishingOption==='S')pubVal="standard";
						else if(publishingOption==='G')pubVal="given";
						else if(publishingOption==='DC')pubVal="distractorWithDock";
						
						if(distractor==="F"){
							
							$('input[name=labelPresentation][value='+pubVal+']').prop('checked',true);
						}else if(distractor==="T"){
							$('input[name=labelPresentation][value=standard]').prop('checked',true);
						}
			       }
			  }
				
			}
			SLEData.customPublishFlag = false;	
			
		}
		SLEData.customPublishFlag = true;//this value is changed to 'true' because of the issue --> populating data on 'I'm Done' click after rendering a data string.	
		SLEData.applyClickPublishOk();

		}catch(err){
			console.error("@SLEView::Error on updateBindPublishingOption::"+err.message);
		} 
	},	
	
	handleDisplayLabelOnce : function() {
		try{
			console.log("@sleView.handleDisplayLabelOnce");
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			var outputJSon = SLEData.getJsonData();
			var adminData = SLEData.getJsonAdminData();
			var textArr = new Array();
			var labelCount = cs.objLength(outputJSon);
			
			for(var i=0; i<labelCount; i++){
				 var labelGrpId = outputJSon['SLE'+i].labelGroupId;				
				 var label = cs.findGroup(labelGrpId);
				 var dock = cs.findGroup('dock_'+labelGrpId);
				 var lblId = window.CD.module.data.getLabelIndex(label.attrs.id);
				 var currentLabel = window.CD.elements.active.element[0].parent;
				 var lblIndex = currentLabel.attrs.id.split('_')[1];
				 var currentTxtGrp = currentLabel.get('#txtGrp_'+lblIndex)[0];
				 if(currentTxtGrp)
					 var currentTxtGrpText = SLEData.getLabelTextValue(currentLabel.attrs.id);
				 var currentDock = cs.findGroup('dock_'+currentLabel.attrs.id);
				 if((labelGrpId != currentLabel.attrs.id)&& label && (label.get('#txtGrp_'+label.attrs.id.split('_')[1])[0]) && outputJSon[lblId].visibility==true){
					 var text = SLEData.getLabelTextValue(labelGrpId);//label.get('#lbltxt_'+label.attrs.id.split('_')[1])[0].getText();
					 if(currentTxtGrp){
						 if(text == currentTxtGrpText && currentTxtGrpText != ""){				
							 if(ds.getOptionLabel() == "OTM" && ds.getsubOptionLevel() == "DLO"){
								 var data = window.CD.module.data;
								 var nodeId = data.getLabelIndex(currentLabel.attrs.id);
								 var node = data.getJsonData()[nodeId];
								 var matchedLabelId = data.getLabelIndex(label.attrs.id);
								 var labelNode = data.getJsonData()[matchedLabelId];
								 var matchedlabelDisVal = labelNode.distractor_label
								 var distractorVal = node.distractor_label;
								 if(distractorVal == 'T' || matchedlabelDisVal == 'T'){
									 var flag = false;
									 if(distractorVal == 'T'){
										 flag = true;
									 }
									  SLEView.callOTOWarningMessage(currentLabel,lblIndex,flag);
								  }else{
									  if((label.get('#txtGrp_'+label.attrs.id.split('_')[1])[0]) && labelNode.visibility==true){
												 currentLabel.hide();
												 
												 var selectedDockName = currentDock.children[0].attrs.name;
												 var dckCount=window.CD.services.cs.objLength(window.CD.module.data.Json.SLEData);
												 for(var p=0; p<dckCount;p++){		
											  			var labelGrpName = window.CD.module.data.Json.SLEData['SLE'+p].name;
											  			if(labelGrpName == selectedDockName){
											  				var toHideLabelId = window.CD.module.data.Json.SLEData['SLE'+p].labelGroupId;
											  				var toHideDock = cs.findGroup('dock_'+toHideLabelId);
											  				toHideDock.children[0].attrs.name = label.attrs.id;
											  				var toHideNode = data.getJsonData()['SLE'+p];
											  				toHideNode.name = label.getId();
											  			}
												 }
												 node.visibility = false;
												 //node.name = label.attrs.id;
												 window.CD.module.data.Json.SLEData[nodeId].hint_value = labelNode.hint_value;
												 window.CD.module.data.Json.SLEData[nodeId].dock_hint_value = labelNode.hint_value;
												 ds.setOutputData();
												 cs.setActiveElement(label,'label');									 
								     }
								  }
							 }else if(window.CD.module.data.Json.adminData.OTO == true){
								  var lblIndx = window.CD.elements.active.element[0].parent.attrs.id.split('_')[1];
								  SLEView.callOTOWarningMessage(window.CD.elements.active.element[0].parent,lblIndx);
							  }else if(ds.getOptionLabel() == "OTM" && ds.getsubOptionLevel() == "DLE"){
								  var matchedLabelId = window.CD.module.data.getLabelIndex(label.attrs.id);
								  var matchedlabelDisVal = window.CD.module.data.Json.SLEData[matchedLabelId].distractor_label
								  var sleData = window.CD.elements.active.element[0].parent;
								  var sleCount = window.CD.module.data.getLabelIndex(sleData.attrs.id);
								  var lblIndx = window.CD.elements.active.element[0].parent.attrs.id.split('_')[1];
								  var distractorVal = window.CD.module.data.Json.SLEData[sleCount].distractor_label;
								  if(distractorVal == 'T' || matchedlabelDisVal == 'T'){
									 var flag = false;
									 if(distractorVal == 'T'){
										 flag = true;
									 }
									 SLEView.callOTOWarningMessage(window.CD.elements.active.element[0].parent,lblIndx,flag);
								  }
								
							  }
						 }
					 }
				 }
			 }
		 }catch(err){
		 	console.info("Error @sleView.handleDisplayLabelOnce::"+err.message);
		 }	
	},
	
	
  	/*
	 * Warning message call for OTO
	 * By Nabonita Bhattacharyya
	 */
	callOTOWarningMessage : function(labelGroupLbl,lblIndex,flag){
		try{
			var Util = window.CD.util;
			var textFormat = new TextFormat();
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var ds = window.CD.services.ds;
			var errorModal = Util.getTemplate({url: 'resources/themes/default/views/error_modal.html?{build.number}'});
			$('.errorOverLay').remove();
			var errorOverLay = $('<div class="errorOverLay"></div>')
			$('#toolPalette').append(errorOverLay);
			$('#toolPalette #errorModal').remove();
			$('#toolPalette').append(errorModal);
			//$('#toolPalette #errorModal').css('height','185px');
			$('#toolPalette #errorModal').css('width','327px');
			$('#errorModal #errAlertText').hide();
			$('#errorModal #warningText').hide();
			$('#errorModal #errorText').hide();
			$('#errorModal .clear').hide();
			$('#errorModal #normalButton').hide();
			
			$("#errorModal span#errorCancel").off('click').on('click',function(){
				$('.button #updateFromInspector').addClass('inactive');
				$('#errorModal').slideUp(200);
			});
			$('#alertMessage').slideDown(200);		
			$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
			$('#errorTextOTO').show();
			$('#errorTextOTO .error_warning_text').show();
			if(flag && flag == true){
				$('#errorTextOTO .error_warning_text').html('You cannot have a distractor with the same text as a label.');
			}
			$('#OTOButton #errorOk').show();
			$('#errorOk').html('Ok');
			$('#alertMessage').slideDown(200);	
			var txtBox = labelGroupLbl.get('#txtBox_'+lblIndex)[0];
				var txtObj = labelGroupLbl.get('#txtGrp_'+lblIndex)[0];
				var addTxt = labelGroupLbl.get('#addTxt_'+lblIndex)[0];
				
				var labelId = labelGroupLbl.getId();
				var dockGroup = cs.findGroup('dock_'+labelId);
				
				var textGrp = dockGroup.get('#docktxtGrp_'+lblIndex)[0];
				if(textGrp){
					SLEView.removeDockTextObject(dockGroup,lblIndex);
				}
				
				var sle = SLEData.getSLEIndex(labelGroupLbl.attrs.id);
				var labelData = SLEData.getJsonData();				
				textFormat.deleteEachLabelText(txtObj);
				
				/** --- changed for label text alignment when text is long --- **/
				var jsonData = window.CD.module.data.getJsonAdminData();
				var labelWidth = jsonData.SLELD.split(',')[0];
				var labelHeight = jsonData.SLELD.split(',')[1];
				
				var leftPadding = ((labelWidth- txtBox.getWidth())/2);
				var calcY = ((parseInt(labelHeight)-txtBox.getHeight())/2)/*-txtBox.parent.getY()*/;
				
				if(leftPadding<0)
					leftPadding = 0;
				
				txtBox.show();
				txtBox.setFill('#fff');				
				//txtBox.parent.setY(0);
				txtObj.setY(calcY);	
				txtObj.setX(leftPadding);
				addTxt.show();				
				//addTxt.setY(calcY);
				var sleTextTool= new TextTool.commonLabelText();
				sleTextTool.bindLabelTextEvent(addTxt.parent);
				cdLayer.draw();
				labelData[sle].label_value = '';
				ds.setOutputData();	
			$("#errorModal span#errorOk").off('click').on('click',function(){
				$('#errorModal').slideUp(200);
				$('.errorOverLay').remove();
				
			});
		}catch(err){
			console.error("@SLEView::Error on warning message for OTO::"+err.message);
		}
	},
	
	/*
	 * This is used to populate popup for each info icon
	 * By Nabonita Bhattacharyya
	 */
	onClickShowInfoIcon : function(iconObj){
		var nameVal=$(iconObj).attr('id');
		var newId = nameVal+'Id';
		var labelInfoIconDetail = window.CD.util.getTemplate({url: 'resources/themes/default/views/label_Inspector_info_icon.html?{build.number}'});
		$('body #labelInfoIconModal').remove();
		$('#localDivInactive').remove();
		$('body').append(labelInfoIconDetail);
		
		$('body #labelInfoIconModal #'+newId).css('display','block');
		
		/* condition added to show info for 'Same size as label' */
		$('body #labelInfoIconModal #'+newId).find('.dont_show').each(function(){
			if($(this).hasClass('same_size_as_label')){
				$(this).removeClass('dont_show');
			}
		});
		
		$('#infoIconOverlay').css('height',$('.container').height());
		$('#infoIconOverlay').css('width',$('#canvasWidth').val());
		$('#labelInfoIconModal').css('left', (($('#toolPalette').width()/2) - ($('#labelInfoIconModal').width()/2))+'px');
		$('#labelInfoIconModal').css('top', ((($('#canvasHeight').val()/2) - ($('#labelInfoIconModal').height()/2))+100)+'px');
		$("#labelInfoIconModal span#closeBtn").off('click').on('click',function(){
			$('#labelInfoIconModal').css('display','none');
		});
	},
	
	/*
	 * This is used to populate hint text area with values for 
	 * each label/dock. If they thave values in label or dock respected 
	 * values are shown. Otherwise textarea remains blank
	 */
	populateHintArea : function(hintArea,feedbackArea){
		
		if(hintArea && hintArea!=null && hintArea!=''){
			if(hintArea.indexOf('<br>') != -1){
				var lastIndexHine = hintArea.lastIndexOf('<br>');
				hintArea = hintArea.substr(0,lastIndexHine);
			}
			$('#textareaHint').val(hintArea);
		}else{
			$('#textareaHint').val('').blur();
		}
		
		if(feedbackArea && feedbackArea!=null && feedbackArea!=''){
			
			if(feedbackArea.indexOf('<br>') != -1){
				var lastIndexFdbk = feedbackArea.lastIndexOf('<br>');
				feedbackArea = feedbackArea.substr(0,lastIndexFdbk);
			}
			
			$('#textareaFeedback').val(feedbackArea);
		}else{
			$('#textareaFeedback').val('').blur();
		}
	},
	
	setLabelGroupPosition : function(group1,x,y){
		  var cs = window.CD.services.cs;
		  var ds = window.CD.services.ds;	
		  var cdLayer = cs.getLayer();
		  var groupLength = group1.length;
		  for(var i=0;i<groupLength;i++){
			  group = cs.findGroup(group1[i].attrs.id);
			  if(group)
				  group.setPosition(x[i],y[i]);
			  cdLayer.draw();
			
			  var sle = SLEData.getLabelIndex(group.attrs.id);	
			  if(sle){
				  window.CD.module.data.Json.SLEData[sle].holder_x = x[i];
				  window.CD.module.data.Json.SLEData[sle].holder_y = y[i];
				  ds.setOutputData();
			  }
		  }
		 
	  },
	  setDockGroupPosition : function(group1,x,y){
		  var cs = window.CD.services.cs;
		  var ds = window.CD.services.ds;	
		  var cdLayer = cs.getLayer();
		  var groupLength = group1.length;
		  for(var i=0;i<groupLength;i++){
			  group = cs.findGroup(group1[i].attrs.id);
			  if(group)
				  group.setPosition(x[i],y[i]);
			  cdLayer.draw();
			 var setId = group.attrs.id.split('dock_')[1];
			  var sle = SLEData.getLabelIndex(setId);	
			  if(sle){
				  window.CD.module.data.Json.SLEData[sle].doc_x = x[i];
				  window.CD.module.data.Json.SLEData[sle].doc_y = y[i];
				  ds.setOutputData();
			  }
		  }
		  
	  },
	
	/*
	 * For same size as label
	 * On check/uncheck this method is called 
	 */

	sameSizeAsLabel : function(val){
		if(!val){
	 		$('#nonEditableTr').css('display','none');
	 		$('#editableTr').css('display','block');
	 		var dockWidth = window.CD.module.data.Json.DCKLD.split(',')[0];
			var dockHeight = window.CD.module.data.Json.DCKLD.split(',')[1];
			$('#dockWidth').val(dockWidth);
			$('#dockHeight').val(dockHeight);
	 	}else{
	 		$('#editableTr').css('display','none');
	 		$('#nonEditableTr').css('display','block');
	 		
	 		var dockWidth = window.CD.module.data.Json.DCKLD.split(',')[0];
			var dockHeight = window.CD.module.data.Json.DCKLD.split(',')[1];
			
	 		$('#nonEditableTr #dockWidth').html(dockWidth+'px');
			$('#nonEditableTr #dockHeight').html(dockHeight+'px');
	 		
	 	}
	},
	/*********************************START--IMAGE undo redo related method*************************/
	/** 'prevImg' has the last inserted image name **/
	registerUndoRedo : function(labelGrp,imageName,isCallfrmDeleteActive,prevImg) {
		try {
			var ds = window.CD.services.ds;
			if(labelGrp){
				var undoMng = window.CD.undoManager;
				var labelId=labelGrp.getId();
				var imageGrpId = 'img_' + labelId;
				if(isCallfrmDeleteActive){
					undoMng.register(this,  window.CD.module.view.undoredoloadImageforLabel,
							[2,labelGrp,labelId,imageGrpId,imageName,prevImg] ,
							'Undo Label image delete',this,  
							 window.CD.module.view.undoredoloadImageforLabel,[1,labelGrp,labelId,undefined,undefined,prevImg] , 'Redo Label image delete');
					        updateUndoRedoState(undoMng);	
				     /*fix for js error in image add*/
					  if(window.CD.module.data.Json.adminData.imageList == undefined || window.CD.module.data.Json.adminData.imageList==0){
								window.CD.module.data.Json.adminData.imageList = [];
					   }
					ds.setOutputData();	
					 
				}else if(labelGrp.get('.img')[0] && !isCallfrmDeleteActive){
							undoMng.register(this,  window.CD.module.view.undoredoloadImageforLabel,
							[1,labelGrp,labelId,undefined,undefined,prevImg] , 'Undo Label image add',
							this,   window.CD.module.view.undoredoloadImageforLabel,
							[2,labelGrp,labelId,imageGrpId,imageName,prevImg] , 'Redo Label image add');
							 updateUndoRedoState(undoMng);	
					
				}
				
				
			}
		 } catch (err) {
				console.error("@Error on registerUndoRedo::"
					+ err.message);
			}
		},
	
	deleteImageFromLabel : function(lbGroup) {
		//try {
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var stg = cs.getCanvas();
			var cdLayer = cs.getLayer();
			
			var jsonObj = window.CD.module.data.getJsonData();
			$("#deleteElement").removeClass('inactive_del').addClass('active');
			if(lbGroup.get('.img')[0]){
				var imgGrp=lbGroup.get('.img')[0].parent;
				var lablId=lbGroup.getId();
				var dataindex = window.CD.module.data.getLabelIndex(lablId);
				var imageObject = imgGrp.getChildren()[0];
				var imageName = 'unknown';
				if(imageObject.className == 'Image'){
							imageSrc = $(imageObject.attrs.image).attr('src');
							imageName = imageSrc.substring(imageSrc.lastIndexOf('/')+1,imageSrc.length);
				}
				cs.setActiveElement(lbGroup,'label');		
				imgGrp.removeChildren();
				imgGrp.destroy();	
				
				var txtGrpObj=lbGroup.get('.nametxt')[0].parent;
				var txtGrpId=txtGrpObj.getId().split('_')[1];
				if(txtGrpObj){
				   var totWidth = txtGrpObj.parent.children[0].getWidth();
				   var totHeight = txtGrpObj.parent.children[0].getHeight();
				   txtGrpObj.setY((lbGroup.children[0].getHeight()/2)-10);
				   if(txtGrpObj.get('#lbltxt_'+txtGrpId)[0]){
					   var originalTextHeight = txtGrpObj.get('#lbltxt_'+txtGrpId)[0].textArr.length * txtGrpObj.get('#lbltxt_'+txtGrpId)[0].getTextHeight();
					   if(totHeight > originalTextHeight){
						  var calcY = (totHeight - originalTextHeight)/2;
						  txtGrpObj.setY(calcY);
					   }
					   if(totHeight<=originalTextHeight){
						  var calcY = txtGrpObj.parent.children[0].getY();
						  txtGrpObj.setY(calcY);
						}
				    }
				  }
				cdLayer.draw();
				jsonObj[dataindex].image_data = "N";
				window.CD.services.ds.updateImageList(imageName,'remove');
				/*if(window.CD.module.data.Json.adminData.imageList == undefined || window.CD.module.data.Json.adminData.imageList==0){
					window.CD.module.data.Json.adminData.imageList = [];
				}*/
				//window.CD.services.ds.updateImageList(imageName,'remove');
				ds.setOutputData();		
			}
			
							
	 // } catch (err) {
		//	console.error("@COIView::Error on deleteImageFromLabel::"
			//	+ err.message);
		//}
	},
	/**
	 * function name: undoredoloadImageforLabel() author:Piyali Saha
	 */
	undoredoloadImageforLabel : function(action,lbGroup,labelId,imageGrpId,imageName,prevImg) {
		try {
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			//if((!lbGroup || lbGroup.children.length==0) && labelId!="") {
				var lbGroup=cdLayer.get('#'+labelId)[0];
			//}
			if(lbGroup){
				if(action==1){
					 //window.CD.module.view.deleteImageFromLabel(lbGroup);
					
					/** 'if prevImg' is blank, that means the present image is the first image 
					 * inserted in that label, so undo will delete the image 
					 * 'if prevImg' has image name, that means previously there was an image 
					 * in that label, so undo will delete that image and insert previous image **/
					
					if(prevImg == ''){
						window.CD.module.view.deleteImageFromLabel(lbGroup);
					}else{
						var imageGrpId = 'img_' + lbGroup.getId();
						loadImageforLabel(lbGroup,imageGrpId,prevImg);
					}
				}else if(action==2){
						var imageGrpId = 'img_' + lbGroup.getId();
						loadImageforLabel(lbGroup,imageGrpId,imageName);
				}
		    }
			
		} catch (err) {
			console.error("@Error on undoredoloadImageforLabel::"
					+ err.message);
		}
	},
	/**
	 * function name: registerAudioUndoRedo() author:Piyali Saha
	 */
	registerAudioUndoRedo : function(thisObj,media_value,audioelem,labelGroup) {
		var undoMng = window.CD.undoManager;
		var cs = window.CD.services.cs;
		var oldObject = {};					
		var sle = window.CD.module.data.getLabelIndex(labelGroup.attrs.id);
		var jsonObj = window.CD.module.data.getJsonData();
		oldObject.x = jsonObj[sle].media_label_XY.split('|')[0];
		oldObject.y = jsonObj[sle].media_label_XY.split('|')[1];
		/*register undo redo*/
		undoMng.register(thisObj, cs.addAudiotoLabel, [media_value,oldObject,labelGroup], 'Undo audio delete',
				thisObj, cs.deleteAudio,[audioelem,'labelaudio'] , 'Redo audio');
		updateUndoRedoState(undoMng);
	},
	registerAudioUndoRedoDock : function(thisObj,node,audioelem,labelGroup) {
		var undoMng = window.CD.undoManager;
		var cs = window.CD.services.cs;
		var oldObject = {};	
		var jsonObj = window.CD.module.data.getJsonData();
		oldObject.x = jsonObj[node].media_dock_XY.split('|')[0];
		oldObject.y = jsonObj[node].media_dock_XY.split('|')[1];
		var mediaVal = jsonObj[node].media_dock_value;
		/*register undo redo*/
		undoMng.register(thisObj, cs.addAudiotoLabel, [mediaVal,oldObject,labelGroup], 'Undo audio delete',
				thisObj, cs.deleteAudio,[audioelem,'labelaudio'] , 'Redo audio');
		updateUndoRedoState(undoMng);
	},
	deleteAudio:function(node){
		var ds = window.CD.services.ds;
		var labelData  = window.CD.module.data.Json.SLEData;
		labelData[node].media_value = "N";
		labelData[node].media_label_XY = "N";
		ds.setOutputData();
	},
	
	/*********************************END--IMAGE undo redo related method*************************/
	
	
	
	/**
	 * This is used for deleting all labels on undo label creation
	 * Called from createNewLabel()
	 * By Nabonita Bhattacharyya
	 */
	deleteNewLabels : function(labelCount,startId){
		try{
			var cs = window.CD.services.cs;
			var labelData  = window.CD.module.data.Json.SLEData;
			var ds = window.CD.services.ds;
			var outputJson = window.CD.module.data.Json;
			var undoMng = window.CD.undoManager;
			var counter = startId;
			var finalCounter = counter+parseInt(labelCount);
			var oldObject = {};
			for(var count = counter;count < parseInt(finalCounter);count++){
				var newLabelGrpId = 'label_'+count;
				var newIndex = SLEData.getLabelIndex(newLabelGrpId);
				var dck = cs.findGroup('dock_'+newLabelGrpId);
				this.removeImageFromLabel(dck);
				this.removeTextFromLabel(dck);
				this.removeAudioFromLabel(dck);
				dck.remove();
				
				var labelGroup = cs.findGroup(newLabelGrpId);
				cs.deleteSubGroups(labelGroup);
				/*this.removeImageFromLabel(labelGroup);
				this.removeTextFromLabel(labelGroup);
				this.removeAudioFromLabel(labelGroup);*/
				labelGroup.remove();
				oldObject[newIndex]={'labelData' : outputJson.SLEData[newIndex]};
				delete outputJson.SLEData[newIndex];
			}
//			for(var cnt = counter;cnt < parseInt(finalCounter);cnt++){
//				var newIndx = 'SLE'+cnt;
//				
//			}
			
			SLEData.reIndexLabels();
			cs.setActiveElement(cs.findGroup('frame_0'),'frame');
			cs.resetToolbar();
			ds.setOutputData();	
		}
		catch(err){
			console.log('@SLEView :: Error in deleteNewLabels for undo label creation'+err.message);
		}
	},
	/*change the publishing option to standard*/
	changetoStandard :function(node){
		var labelCount = window.CD.services.cs.objLength(window.CD.module.data.Json.SLEData);
		var sledata = window.CD.module.data.Json.SLEData;
		var nameAttr = sledata[node].name;
		for(var i=0; i<labelCount; i++){
			if(sledata['SLE'+i].name == nameAttr){
				var changefieldArr={publishingOption:'S'};
				window.CD.module.data.setEachLabelOutputData('SLE'+i,changefieldArr);
			}
		}
		SLEData.customPublishFlag = false;
		SLEData.applyClickPublishOk();
		
	},
	/**
	 * This method is used for checking the availability of image in any label
	 * By Nabonita Bhattacharyya
	 * called from checkImageAvailableStatus() :: canvasservices.js
	 */
	imageAvailableStatusInLabel : function(imageName){
		try{
			var labelData  = window.CD.module.data.Json.SLEData;
			var imgCounter = 0;
			for(var eachLabel in labelData){
				var img = labelData[eachLabel].image_data;
				if(img == imageName){
					imgCounter++;
				}
			}
			if(imgCounter>0){
				return true;
			}else{
				return false;
			}
		}
		catch(err){
			console.log('@SLEView :: Error in imageAvailableStatusInLabel for image availability status'+err.message);
		}
	},
	audioAvailableStatusInLabel : function(audioName){
		try{
			var labelData  = window.CD.module.data.Json.SLEData;
			var audCounter = 0;
			for(var eachLabel in labelData){
				var audio = labelData[eachLabel].media_value;
				if(audio == audioName){
					audCounter++;
				}
			}
			if(audCounter>0){
				return true;
			}else{
				return false;
			}
		}
		catch(err){
			console.log('@SLEView :: Error in imageAvailableStatusInLabel for image availability status'+err.message);
		}
	},
	/**
	 * This method is used for changing label_value for OTM while editing 
	 */
	labelTextOTM : function(txtGrpId,textValue,txtGrpObj){
		try{
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var labelCount = cs.objLength(window.CD.module.data.Json.SLEData);
			var sledata = window.CD.module.data.Json.SLEData;
			var labelId = txtGrpObj.parent.getId();
			var labelIndex = SLEData.getLabelIndex(labelId);
			var nameAttr = sledata[labelIndex].name;
			for(var i=0; i<labelCount; i++){
				if(sledata['SLE'+i].name == nameAttr){
					 txtGrpObj.get('#lbltxt_'+txtGrpId)[0].setText(textValue);
					 sledata['SLE'+i].label_value = textValue;
					 ds.setOutputData();
				}
			}
			return txtGrpObj;	
		}
		catch(err){
			console.log('@SLEView :: Error in labelTextOTM() sleView::'+err.message);
		}
	},
	
	createDockTextAsLabel : function(labelGropId,textValue){
		try{
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var labelGrpId = labelGropId;
			var dockGroup = cs.findGroup('dock_'+labelGrpId);
			var count = labelGrpId.split('_')[1];
			var textGrp = dockGroup.get('#docktxtGrp_'+count)[0];
			if(textGrp){
				SLEView.removeDockTextObject(dockGroup,count);
				textGrp = SLEView.createDockTextObject(textValue,count,dockGroup);
			}else{
				textGrp = SLEView.createDockTextObject(textValue,count,dockGroup);
			}
			var txtBox = textGrp.get('#dock_txtBox_'+count)[0];
			var txtBoxText = textGrp.get('#dock_txt_'+count)[0];
			textGrp.get('#dock_txt_'+count)[0].setText('');
			textGrp.get('#dock_txt_'+count)[0].setText(textValue);
			textGrp.setY(0);
			var dockHeight = dockGroup.children[0].getHeight();
			var calcY = (parseInt(dockHeight)-parseInt(txtBoxText.getHeight()))/2;
			if(parseInt(txtBoxText.getHeight()) <= parseInt(dockHeight)){
				textGrp.setY(calcY);
			}
			dockGroup.add(textGrp);
			cdLayer.draw();
		}catch(err){
			console.error("@SLEView::Error on createDockTextAsLabel::"+err.message);
		}
	},
	removeDockTextObject : function(dockGroup,count){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		if(dockGroup.get('#docktxtGrp_'+count)[0]){
			dockGroup.get('#docktxtGrp_'+count)[0].removeChildren();
			//dockGroup.get('#docktxtGrp_'+count)[0].remove();
		}
		cdLayer.draw();
	},
	createDockTextObject : function(textValue,count,dockGroup){
		try{
			var cs = window.CD.services.cs;
			var dockHeight = dockGroup.children[0].getHeight();
			var dockWidth = dockGroup.children[0].getWidth();
			var sleData = window.CD.module.data.Json.SLEData;
			var sleIndex = 'SLE'+count;
			var textFormat = sleData[sleIndex].textFormat;
			var textBoxGroup = cs.createGroup('docktxtGrp_'+count,{'x':10,'y':(dockHeight)/2});
			var textBox = new Kinetic.Rect({
	            width: dockWidth-20,
	            height: 15,
	            fill: 'transparent',
	            opacity:1,
	            id:'dock_txtBox_'+count
				});
			var addTextObj = new Kinetic.Text({		        	
				text: textValue,
		        fontSize: parseInt(textFormat.fontSize),
		        y:2,
		        fontFamily: 'sans-serif',
		        fill: '#888',  
		        width: dockWidth-20,
		        height: 'auto',
		        opacity: '1',
		        verticalAlign:'top',
	            id: 'dock_txt_'+count,
	            align : textFormat.align
	          });
			textBoxGroup.add(textBox);
			textBoxGroup.add(addTextObj);
			return textBoxGroup;
		}catch(err){
			console.error("@SLEView::Error on createDockTextObject::"+err.message);
		}
	},
	/**
	 * This method is used to change the font size of the text on 
	 * dock
	 * @author 552756(Nabonita Bhattacharyya)
	 */
	changeFontForDockTextAsLabel : function(node,labelId,fontsize){
		try{
			var cs = window.CD.services.cs;
			var font=$("#fontTool .font_size #fontTextbox").val();
			var stageLabelTextTool= new TextTool.commonLabelText();
			var initFont = window.CD.module.data.getJsonData()[node].textFormat.fontSize;
			var dockGroup = cs.findGroup('dock_'+labelId);
			var count = labelId.split('_')[1];
			var activeObj = dockGroup.get('#docktxtGrp_'+count)[0];
			var activeGrpObj=activeObj;
			
			stageLabelTextTool.setActiveTextFontSize('',fontsize,activeGrpObj);
		}
		catch(err){
			console.error("@SLEView::Error on changeFontForDockTextAsLabel::"+err.message);
		}
	},
	changeAlignmentForDockTextAsLabel : function(node,labelId,alignment){
		try{
			var cs = window.CD.services.cs;
			var stageLabelTextTool= new TextTool.commonLabelText();
			var dockGroup = cs.findGroup('dock_'+labelId);
			var count = labelId.split('_')[1];
			var activeObj = dockGroup.get('#docktxtGrp_'+count)[0];
			var activeGrpObj=activeObj;
			
			stageLabelTextTool.alignActiveText('',alignment,activeGrpObj);
		}
		catch(err){
			console.error("@SLEView::Error on changeAlignmentForDockTextAsLabel::"+err.message);
		}
	},
	
	/**
	 * This method is used to make the text on dock bold
	 * @author 552756(Nabonita Bhattacharyya)
	 */
	boldActiveDockText : function(labelId){
		try{
			var cs = window.CD.services.cs;			
			var stageLabelTextTool= new TextTool.commonLabelText();
			var dockGroup = cs.findGroup('dock_'+labelId);
			var count = labelId.split('_')[1];
			var activeObj = dockGroup.get('#docktxtGrp_'+count)[0];
			var activeGrpObj=activeObj;
			stageLabelTextTool.boldActiveText(activeGrpObj);		
		}catch(err){
			console.error("@SLEView::Error on boldActiveDockText::"+err.message);
		}
	},
	/**
	 * This method is used to make the text on dock italic
	 * @author 552756(Nabonita Bhattacharyya)
	 */
	italicActiveDockText : function(labelId){
		try{
			var cs = window.CD.services.cs;
			var font=$("#fontTool .font_size #fontTextbox").val();
			var stageLabelTextTool= new TextTool.commonLabelText();
			var dockGroup = cs.findGroup('dock_'+labelId);
			var count = labelId.split('_')[1];
			var activeObj = dockGroup.get('#docktxtGrp_'+count)[0];
			var activeGrpObj=activeObj;
			
			stageLabelTextTool.italicActiveText(activeGrpObj);
		}catch(err){
			console.error("@SLEView::Error on italicActiveDockText::"+err.message);
		}
	},
	
	/**
	 * This method is used to make the text on dock underlined
	 * @author 552756(Nabonita Bhattacharyya)
	 */
	underlineActiveDockText : function(labelId,cnt){
		try{
			var cs = window.CD.services.cs;
			var font=$("#fontTool .font_size #fontTextbox").val();
			var stageLabelTextTool= new TextTool.commonLabelText();
			var dockGroup = cs.findGroup('dock_'+labelId);
			var count = labelId.split('_')[1];
			var activeObj = dockGroup.get('#docktxtGrp_'+count)[0];
			var activeGrpObj=activeObj;
			
			stageLabelTextTool.underlineActiveText(activeGrpObj,cnt);
		}catch(err){
			console.error("@SLEView::Error on underlineActiveDockText::"+err.message);
		}
	},
	
	alignActiveDockText : function(labelId){
		try{
			var cs = window.CD.services.cs;
			var font=$("#fontTool .font_size #fontTextbox").val();
			var stageLabelTextTool= new TextTool.commonLabelText();
			var dockGroup = cs.findGroup('dock_'+labelId);
			var count = labelId.split('_')[1];
			var activeObj = dockGroup.get('#docktxtGrp_'+count)[0];
			var activeGrpObj=activeObj;
			
			stageLabelTextTool.alignActiveText(activeGrpObj);
		}catch(err){
			console.error("@SLEView::Error on alignActiveDockText::"+err.message);
		}
	},
	/**
	 * For a label with height > width, if an image is added width width > height
	 * and long text is added to the label, then the position (top padding) of the image and text
	 * is modified using this method
	 */
	labelImageAndTextAdjust : function(lblGroup,callForGlobalTextHide){
		console.log('@labelImageAndTextAdjust :: SLEView');
		try{
			var sleTextTool= new TextTool.commonLabelText();
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			
			var txtGrpParentId = lblGroup.getId();
			var txtGrpObj = lblGroup.get('#txtGrp_'+txtGrpParentId.split('_')[1])[0];
			
			
			var txtGrpId = txtGrpObj.attrs.id.split('_')[1];
			var textBoxGrpObj=txtGrpObj.get('#txtBox_'+txtGrpId)[0];
			
			var textHeight = 0;
			var imgObj=lblGroup.get('#img_'+txtGrpParentId)[0];

			var hideStatus = txtGrpObj.getVisible();
			if(hideStatus == true){
				if(!($('#hideTextLoc').is(':checked'))){
					if(window.CD.module.data.textGroupComponent.length > 0){
						var count = txtGrpObj.children.length-1;
						var lastChild = sleTextTool.findLastTextchild(txtGrpObj,count);
						textHeight = txtGrpObj.children[lastChild].getY() + txtGrpObj.children[lastChild].getHeight();
					}
					else
						textHeight = txtGrpObj.get('#addTxt_'+txtGrpId)[0].getHeight();
				}
			}			
			
			var imgHeight = 0;
			var imgBuffer = 0;
			if(imgObj){
				imgHeight = imgObj.getChildren(0)[0].getHeight();
				imgBuffer = 3;
			}
				
			
			var spaceRemain = (parseInt(lblGroup.children[0].getHeight())-parseInt(imgHeight)-textHeight)/2;
			if(spaceRemain<10)
				spaceRemain = 10;
			if(imgObj)
				imgObj.setY(spaceRemain);
			
			var changeY=parseInt(spaceRemain+imgHeight+imgBuffer);
			if ($('#showHiddenTxtGlobal').is(':checked')) {
				if(window.CD.module.data.textGroupComponent.length > 0){
					var count = txtGrpObj.children.length-1;
					var lastChild = sleTextTool.findLastTextchild(txtGrpObj,count);
					var textHeight = txtGrpObj.children[lastChild].getY() + txtGrpObj.children[lastChild].getHeight();
				}
				else
					textHeight = txtGrpObj.get('#addTxt_'+txtGrpId)[0].getHeight();
				changeY=parseInt((lblGroup.children[0].getHeight()-textHeight)/2);
     	    }
			//Added image Height check to set text to vertical align to label bottom when image loading is slow and system not able to get image height
     	    var labelGrpHeight = parseInt(lblGroup.children[0].getHeight());
     	   txtGrpObj.setY(0);
     	    if(parseInt(imgHeight) > 0){
     	    	txtGrpObj.setY(parseInt(imgHeight)+parseInt(imgBuffer)+parseInt(spaceRemain));	
     	    }else{
     	    	txtGrpObj.setY((parseInt(labelGrpHeight) - parseInt(textHeight))/2);
     	    }
     	    
	 		cdLayer.draw();
		}catch(err){
			console.error("@SLEView::Error on labelImageAndTextAdjust::"+err.message);
		}
	},
	setActiveLabelPosition : function(labelGrp,dock){
		console.log('@setActiveLabelPosition :: SLEView');
		var activeElm = window.CD.elements.active.element;
		var activeElmArray = [];
		var activeElmNewX = [];
		var activeElmNewY = [];
		var activeElmOldX = [];
		var activeElmOldY = [];
		var activeElmLength = window.CD.elements.active.element.length;
		var activeDockArray = [];
		for(var j=0;j<activeElmLength;j++){
			activeElmArray.push(window.CD.elements.active.element[j])
		}
		var undoMng = window.CD.undoManager;
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var dckCount = cs.objLength(window.CD.module.data.Json.SLEData);
		if(!dock){
			var labelId = labelGrp.attrs.id;
		}else{
			var labelId = labelGrp.attrs.id.substr(5,labelGrp.attrs.id.length);
		}
		
		var labelGrpJsonId = SLEData.getSLEIndex(labelId);
		var changedX = labelGrp.getX() - window.CD.module.data.Json.SLEData[labelGrpJsonId].holder_x;
		var changedY = labelGrp.getY() - window.CD.module.data.Json.SLEData[labelGrpJsonId].holder_y;
		if(dock){
			var changedX = labelGrp.getX() - window.CD.module.data.Json.SLEData[labelGrpJsonId].doc_x;
			var changedY = labelGrp.getY() - window.CD.module.data.Json.SLEData[labelGrpJsonId].doc_y;
		}
		for(var i=0;i<activeElmLength;i++){
			var sle = SLEData.getSLEIndex(window.CD.elements.active.element[i].attrs.id);
			if(dock){
				var sle = SLEData.getSLEIndex(window.CD.elements.active.element[i].attrs.id.substr(5,window.CD.elements.active.element[i].attrs.id.length));
			}
			if(sle == labelGrpJsonId){
				if(!dock){
					var oldX = window.CD.module.data.Json.SLEData[sle].holder_x;
					var oldY = window.CD.module.data.Json.SLEData[sle].holder_y;
					window.CD.module.data.Json.SLEData[sle].holder_x = labelGrp.getX();
					window.CD.module.data.Json.SLEData[sle].holder_y = labelGrp.getY();
					var newX = labelGrp.getX();
					var newY = labelGrp.getY();
				}else{
					activeElmOldX.push(window.CD.module.data.Json.SLEData[sle].doc_x);
					activeElmOldY.push(window.CD.module.data.Json.SLEData[sle].doc_y);
					var oldX = window.CD.module.data.Json.SLEData[sle].doc_x;
					var oldY = window.CD.module.data.Json.SLEData[sle].doc_y;
					var dockId = labelGrp.attrs.id;
					window.CD.module.data.Json.SLEData[sle].doc_x = labelGrp.getX();
					window.CD.module.data.Json.SLEData[sle].doc_y = labelGrp.getY();
					activeDockArray.push(labelGrp);
					activeElmNewX.push(window.CD.module.data.Json.SLEData[sle].doc_x);
					activeElmNewY.push(window.CD.module.data.Json.SLEData[sle].doc_y);
					for(var k=0; k<dckCount;k++){/*
						var labelGrpId = window.CD.module.data.Json.SLEData['SLE'+k].labelGroupId;
						if(dockId != 'dock_'+labelGrpId){
							if(cs.findGroup('dock_'+labelGrpId)){
								var dck = cs.findGroup('dock_'+labelGrpId).children[0];
								var dockName = dck.attrs.name;
								if(labelGrp.attrs.name){
									if(dck.attrs.name == labelGrp.attrs.name){
										var sleId = SLEData.getSLEIndex('label_'+dck.attrs.id.split('_')[2]);
										var newX = dck.parent.getX() + changedX;
										var newY = dck.parent.getY() + changedY;
										if(newY>(parseInt(window.CD.module.data.Json.FrameData[0].frameHeight))-dck.attrs.height){
											newY = (parseInt(window.CD.module.data.Json.FrameData[0].frameHeight)-dck.attrs.height);
										}
										if(newX>(parseInt(window.CD.module.data.Json.FrameData[0].frameWidth))-dck.attrs.width){
											newX = (parseInt(window.CD.module.data.Json.FrameData[0].frameWidth)-dck.attrs.width);
										}
										if(newY<0){
											newY = 0;
										}
										if(newX<0){
											newX = 0;
										}
										dck.parent.setX(newX);
										dck.parent.setY(newY);
										activeElmOldX.push(window.CD.module.data.Json.SLEData[sleId].doc_x);
										activeElmOldY.push(window.CD.module.data.Json.SLEData[sleId].doc_y);
										window.CD.module.data.Json.SLEData[sleId].doc_x = dck.parent.getX();
										window.CD.module.data.Json.SLEData[sleId].doc_y = dck.parent.getY();
										activeElmNewX.push(window.CD.module.data.Json.SLEData[sleId].doc_x);
										activeElmNewY.push(window.CD.module.data.Json.SLEData[sleId].doc_y);
										activeDockArray.push(dck.parent);
										
										}
								}else{
									var labelGroupId = labelGrp.children[0].attrs.name;
									var dockName = dck.attrs.name;
									if(dck.attrs.name == labelGroupId){
										var newX = dck.parent.getX() + changedX;
										var newY = dck.parent.getY() + changedY;
										var sleId =  SLEData.getSLEIndex('label_'+dck.attrs.id.split('_')[2]);
										var newX = dck.parent.getX() + changedX;
										var newY = dck.parent.getY() + changedY;
										if(newY>(parseInt(window.CD.module.data.Json.FrameData[0].frameHeight))-dck.attrs.height){
											newY = (parseInt(window.CD.module.data.Json.FrameData[0].frameHeight)-dck.attrs.height);
										}
										if(newX>(parseInt(window.CD.module.data.Json.FrameData[0].frameWidth))-dck.attrs.width){
											newX = (parseInt(window.CD.module.data.Json.FrameData[0].frameWidth)-dck.attrs.width);
										}
										if(newY<0){
											newY = 0;
										}
										if(newX<0){
											newX = 0;
										}
										dck.parent.setX(newX);
										dck.parent.setY(newY);
										activeElmOldX.push(window.CD.module.data.Json.SLEData[sleId].doc_x);
										activeElmOldY.push(window.CD.module.data.Json.SLEData[sleId].doc_y);
										window.CD.module.data.Json.SLEData[sleId].doc_x = dck.parent.getX();
										window.CD.module.data.Json.SLEData[sleId].doc_y = dck.parent.getY();
										activeElmNewX.push(window.CD.module.data.Json.SLEData[sleId].doc_x);
										activeElmNewY.push(window.CD.module.data.Json.SLEData[sleId].doc_y);
										activeDockArray.push(dck.parent);
										}
								}
								
								}
							var newX = labelGrp.getX();
							var newY = labelGrp.getY();
						}
						var newX = labelGrp.getX();
						var newY = labelGrp.getY();
					*/}
					
				}	
			}else{
				if(!dock){
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
					window.CD.elements.active.element[i].setX(newX);
					window.CD.elements.active.element[i].setY(newY);
					
					var oldX = window.CD.module.data.Json.SLEData[sle].holder_x;
					var oldY = window.CD.module.data.Json.SLEData[sle].holder_y;
					window.CD.module.data.Json.SLEData[sle].holder_x = newX;
					window.CD.module.data.Json.SLEData[sle].holder_y = newY;
				}else{				
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
					window.CD.elements.active.element[i].setX(newX);
					window.CD.elements.active.element[i].setY(newY);
					activeElmOldX.push(window.CD.module.data.Json.SLEData[sle].doc_x);
					activeElmOldY.push(window.CD.module.data.Json.SLEData[sle].doc_y);
					activeDockArray.push(window.CD.elements.active.element[i]);
					window.CD.module.data.Json.SLEData[sle].doc_x = window.CD.elements.active.element[i].getX();
					window.CD.module.data.Json.SLEData[sle].doc_y = window.CD.elements.active.element[i].getY();
					activeElmNewX.push(window.CD.module.data.Json.SLEData[sle].doc_x);
					activeElmNewY.push(window.CD.module.data.Json.SLEData[sle].doc_y);
					var dockId = window.CD.elements.active.element[i].attrs.id;
					for(var k=0; k<dckCount;k++){/*
						var labelGrpId = window.CD.module.data.Json.SLEData['SLE'+k].labelGroupId;
						if(dockId != 'dock_'+labelGrpId){
							if(cs.findGroup('dock_'+labelGrpId)){
								var dck = cs.findGroup('dock_'+labelGrpId).children[0];
								if(dockName != dck.attrs.name){
									if(window.CD.elements.active.element[i].attrs.name){
										if(dck.attrs.name == window.CD.elements.active.element[i].attrs.name){
											var sleId = SLEData.getSLEIndex('label_'+dck.attrs.id.split('_')[2]);
											var newX = dck.parent.getX() + changedX;
											var newY = dck.parent.getY() + changedY;
											if(newY>(parseInt(window.CD.module.data.Json.FrameData[0].frameHeight))-dck.attrs.height){
												newY = (parseInt(window.CD.module.data.Json.FrameData[0].frameHeight)-dck.attrs.height);
											}
											if(newX>(parseInt(window.CD.module.data.Json.FrameData[0].frameWidth))-dck.attrs.width){
												newX = (parseInt(window.CD.module.data.Json.FrameData[0].frameWidth)-dck.attrs.width);
											}
											if(newY<0){
												newY = 0;
											}
											if(newX<0){
												newX = 0;
											}
											dck.parent.setX(newX);
											dck.parent.setY(newY);
											activeElmOldX.push(window.CD.module.data.Json.SLEData[sleId].doc_x);
											activeElmOldY.push(window.CD.module.data.Json.SLEData[sleId].doc_y);
											window.CD.module.data.Json.SLEData[sleId].doc_x = dck.parent.getX();
											window.CD.module.data.Json.SLEData[sleId].doc_y = dck.parent.getY();
											activeElmNewX.push(window.CD.module.data.Json.SLEData[sleId].doc_x);
											activeElmNewY.push(window.CD.module.data.Json.SLEData[sleId].doc_y);
											activeDockArray.push(dck.parent);
											}
									}else{
										var labelGroupId = window.CD.elements.active.element[i].children[0].attrs.name;
										if(dck.attrs.name == labelGroupId){
											var newX = dck.parent.getX() + changedX;
											var newY = dck.parent.getY() + changedY;
											var sleId =  SLEData.getSLEIndex('label_'+dck.attrs.id.split('_')[2]);
											var newX = dck.parent.getX() + changedX;
											var newY = dck.parent.getY() + changedY;
											if(newY>(parseInt(window.CD.module.data.Json.FrameData[0].frameHeight))-dck.attrs.height){
												newY = (parseInt(window.CD.module.data.Json.FrameData[0].frameHeight)-dck.attrs.height);
											}
											if(newX>(parseInt(window.CD.module.data.Json.FrameData[0].frameWidth))-dck.attrs.width){
												newX = (parseInt(window.CD.module.data.Json.FrameData[0].frameWidth)-dck.attrs.width);
											}
											if(newY<0){
												newY = 0;
											}
											if(newX<0){
												newX = 0;
											}
											dck.parent.setX(newX);
											dck.parent.setY(newY);
											activeElmOldX.push(window.CD.module.data.Json.SLEData[sleId].doc_x);
											activeElmOldY.push(window.CD.module.data.Json.SLEData[sleId].doc_y);
											window.CD.module.data.Json.SLEData[sleId].doc_x = dck.parent.getX();
											window.CD.module.data.Json.SLEData[sleId].doc_y = dck.parent.getY();
											activeElmNewX.push(window.CD.module.data.Json.SLEData[sleId].doc_x);
											activeElmNewY.push(window.CD.module.data.Json.SLEData[sleId].doc_y);
											activeDockArray.push(dck.parent);
											}
									}
								}
								}
						}
					*/}
				}
				
				
			}
			if(!dock){
				activeElmNewX.push(newX);
				activeElmNewY.push(newY);
				activeElmOldX.push(oldX);
				activeElmOldY.push(oldY);
			}

			ds.setOutputData();
		}
		labelGrp.parent.getLayer().draw();
		cdLayer.draw();
		if(!dock){
			undoMng.register(this, SLEView.setLabelGroupPosition,[activeElmArray,activeElmOldX,activeElmOldY] , 'Undo Label position',this, SLEView.setLabelGroupPosition,[activeElmArray,activeElmNewX,activeElmNewY] , 'Redo Label position');
		}else{
			undoMng.register(this, SLEView.setLabelGroupPosition,[activeDockArray,activeElmOldX,activeElmOldY] , 'Undo Label position',this, SLEView.setLabelGroupPosition,[activeDockArray,activeElmNewX,activeElmNewY] , 'Redo Label position');
		}
		updateUndoRedoState(undoMng);
	}
};
