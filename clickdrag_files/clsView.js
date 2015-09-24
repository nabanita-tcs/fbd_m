var CLSView = {
	init: function(clsJson,cnvConfig) {
		console.log("@CLSView.init::");
		try{
			var propdiv = $('#propertiesLabel');
			var labeldivCLS = window.CD.util.getTemplate({url: 'resources/themes/default/views/layout_mode_design_CLS.html?{build.number}'});
			propdiv.append(labeldivCLS);
			$('#cdInspector .tab_view').on('click',function(){
				if($(this).hasClass('inactive')){
					$('#' + $(this).siblings('.tab_view.active').attr('name')).hide();
					$(this).siblings('.tab_view.active').removeClass('active').addClass('inactive');
					$(this).removeClass('inactive').addClass('active');
					$('#' + $(this).attr('name')).show();
					
					/* For Label Inspector div append*/
					if( $(this).attr('name') == 'localDiv' && $('#localDivInactive').length == 0 && (window.CD.elements.active.type != 'label' && window.CD.elements.active.type != 'dock')){
						CLSView.makeLabelLocalDisable();
					}
				}
			});
			
			CLSView.attachPublishEvents();
			CLSData.dockOrigWidth = $('#dockWidth').val();
			CLSData.dockOrigHeight = $('#dockHeight').val();
			
			/* ------------- Events bind for each view ----------- */
			CLSView.bindInspectorEvents();
			//if(clsJson.FrameData.length > 0){
			window.CD.services.cs.drawGuides(clsJson.adminData.HGL,clsJson.adminData.VGL,cnvConfig);
			window.CD.module.frame.init(clsJson.FrameData);
			//console.dir(clsJson);
				
			//}
			this.renderCLS();
			
		}catch(err){
			console.error("Error in CLSView::"+err.message);
		}
		
	},
	attachPublishEvents:function(){
		/* for I am Done button*/
		$('#toolPalette .right_tool span#done').off('click').on('click',function(){	
			var labelModal = window.CD.util.getTemplate({url: 'resources/themes/default/views/publishing_CLS_modal.html?{build.number}'});
			$('#labelModal').remove();
		    $('body').append(labelModal);
			$('#labelModal').css('left', (($('#toolPalette').width()/2) - ($('#labelModal').width()/2))+'px');
			$('#labelModal').css('top', (($('#canvasHeight').val()/2) - ($('#labelModal').height()/2))+'px');
			
			var labelDistractorCount = CLSData.populatePublishData();
			
			var totLabelCount = labelDistractorCount.labelCount;
			var totDistractorCount = labelDistractorCount.distractorCount;
			
			var jsonData=window.CD.module.data.Json;
			var jsonCLSPS=jsonData.CLSPS;
			if(jsonCLSPS && jsonCLSPS.totalRandomLabels && jsonCLSPS.totalRandomLabels!==''){
				var labelCount = jsonData.CLSPS.totalRandomLabels;
			}else{
				var labelCount = labelDistractorCount.labelCount;
			}
			
			if(jsonCLSPS && jsonCLSPS.totalRandomLabels && jsonCLSPS.totalRandomDistractors!==''){
				var distractorCount = jsonData.CLSPS.totalRandomDistractors;
			}else{
				var distractorCount = labelDistractorCount.distractorCount;
			}
			$('#labelContainer #labelsNo').val(labelCount);
			$('#labelContainer #distractorNo').val(distractorCount);
			
			$("#pub_standardLabels .pub_num").text(totLabelCount);
			$("#pub_distractorLabels .pub_num").text(totDistractorCount);
			
			if(window.CD.module.data.getJsonAdminData()['RLO'] == 'T'){
				$('#scramble').prop('checked',true);
			}else{
				if(window.CD.module.data.getJsonAdminData()['RLO'] == 'F'){
					$('#scramble').prop('checked',false);
				}
			}
			 $('#labelContainer .input_text').off('keydown').on('keydown',function(e){
				  var inputVal = $(this).val();
				  var returnVal= checkVal(inputVal,e);
				  return returnVal;
			        
				});
			
			 $("#publishCancel").off('click').on('click',function(){
				  $('#labelOverlay').remove();
				  $('#labelModal').slideUp(200);
			  });
			 
			 $('#blankGroupSelection').css('display','none');
			 var outputJSon = CLSData.getJsonData();
			 $.each(outputJSon, function(lblIndex, currentLabelData) {				
				if(currentLabelData.class_set == "" && currentLabelData.distractor == 'F') {
					$('#blankGroupSelection').css('display','block');
					$('#foot_text').css('display','none');
				}
			});
			 
			 
			 $('#publishOk').off('click').on('click',function(){
				 
				var labelDistractorCount = CLSData.populatePublishData();
					
				var labelCount = labelDistractorCount.labelCount;
				var distractorCount = labelDistractorCount.distractorCount;
				
				var labelCntFromUser = $('#labelsNo').val();
				var distractrCntFromUser = $('#distractorNo').val();
				
				if($('#scramble').prop('checked') == true){
					window.CD.module.data.getJsonAdminData()['RLO'] = 'T';
				}else{
					window.CD.module.data.getJsonAdminData()['RLO'] = 'F';
				}
				if((!(labelCntFromUser.match(/[0-9]+/))||(labelCntFromUser.match(/[!@#$%\^&*(){}[\]<>?/|\-]/)))||(!(distractrCntFromUser.match(/[0-9]+/))||(distractrCntFromUser.match(/[!@#$%\^&*(){}[\]<>?/|\-]/)))){
						validation.showLabelErrorPOPUP(16);
				}else if(parseInt(labelCntFromUser)>labelCount || parseInt(distractrCntFromUser)>distractorCount){
					validation.showLabelErrorPOPUP(17);
			 		validation.showLabelErrorPOPUPForCancel(29);
				}else{
					labelCount = labelCntFromUser;
					distractorCount = distractrCntFromUser;
					CLSData.setValuesToCLSPS(labelCount,distractorCount);
					CLSData.setValuesToCLSRN();
					$('#labelOverlay').remove();
					$('#labelModal').slideUp(200);
				}
				
				/* Check if no group is selected for any label*/
				var cs = window.CD.services.cs;
				var ds = window.CD.services.ds;
				var cdLayer = cs.getLayer();
				var outputJSon = CLSData.getJsonData();
				ds.setOutputData();
				/*
				$.each(outputJSon, function(lblIndex, currentLabelData) {
					if(currentLabelData.class_set == "" && currentLabelData.distractor == 'F') {
						CLSView.blankGroupWarningMessage(currentLabelData,lblIndex);
					}
				});*/
				
			 });
			 
			 
		});
		
	},
	
	blankGroupWarningMessage : function(currentLabel,lblIndex) {
		try{
			var Util = window.CD.util;
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			var errorModal = Util.getTemplate({url: 'resources/themes/default/views/error_modal.html?{build.number}'});
			$('#toolPalette #errorModal').remove();
			$('#toolPalette').append(errorModal);
			//$('#toolPalette #errorModal').css('height','185px');
			$('#toolPalette #errorModal').css('width','327px');
			$('#errorModal #errAlertText').hide();
			$('#errorModal #warningText').hide();
			$('#errorModal #errorText').hide();
			$('#errorTextOTO').hide();
			$('#errorModal .clear').hide();
			$('#errorModal #normalButton').hide();
			$("#errorModal span#errorCancel").off('click').on('click',function(){
				$('.button #updateFromInspector').addClass('inactive');
				$('#errorModal').slideUp(200);
			});
			$('#alertMessage').slideDown(200);		
			$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');			
			$('#errorTextBlankSelection').show();
			$('#errorTextBlankSelection .error_warning_text').show();
			$('#BlankSelButton #errorOk').show();
			$('#errorOk').html('Ok');
			$('#alertMessage').slideDown(200);	
			
			$("#errorModal span#errorOk").off('click').on('click',function(){
				$('#errorModal').slideUp(200);
				$('#errorTextBlankSelection').hide();
			});
		}catch(err){
			console.error("@CLSView::Error on warning message for OTO::"+err.message);
		}
	},
	
	/*
	 * This is used for making label local disable when
	 * active element is not label or dock
	 */
	makeLabelLocalDisable : function(){
		console.log("@CLSView.makeLabelLocalDisable");
		try{
		
			var localDivWidth = $('#localDiv').width();
			var localDivHeight = $('#localDiv').height();
			var localDivInactiveBar = $('<div id="localDivInactive" class="overlayInactive"></div>');
			localDivInactiveBar.css({width:localDivWidth+'px', height:localDivHeight+'px'});
			$('#localDiv .block').before(localDivInactiveBar);
		}catch(err){
			console.error("@CLSView::Error on makeLabelLocalDisable::"+err.message);
		}
		
	},
	
	
	renderCLS:function(){		
		
		this.showCLSLabel(window.CD.module.data.Json);
		this.showCLSDock(window.CD.module.data.Json);
		
		
		/* ---- for hint / feedback ----- */
		if(window.CD.module.data.Json.CLSData.CLS0){
			var clsVal = window.CD.module.data.Json.CLSData.CLS0;
			var adminData = CLSData.getJsonAdminData();
			var hintFeedbackType = adminData.showHintOrFeedbackInAuthoring;
			
			var feedbackType = 'label';
			var hintFdbckVal = CLSData.getHintFeedbackFromJson();
			if(hintFeedbackType == 'hint'){
				window.CD.module.view.bindFeedbackHintEventAllLabel(hintFeedbackType,feedbackType,feedbackType);
				CLSView.createHintGroupAuth(hintFdbckVal.hintW,hintFdbckVal.hintH,hintFdbckVal.x,hintFdbckVal.y);
			}else{
				if(hintFeedbackType == 'feedback'){
					window.CD.module.view.bindFeedbackHintEventAllLabel(hintFeedbackType,feedbackType,feedbackType);
					CLSView.createHintGroupAuth(hintFdbckVal.feedbackW,hintFdbckVal.feedbackH,hintFdbckVal.x,hintFdbckVal.y);
				}
			}
		}
	},
	showCLSLabel: function(clsJson) {
		console.log('@CLSView.showCLSLabel');
		var util = window.CD.util;	
		var cs = window.CD.services.cs;
		var stg = cs.getCanvas();
		var cdLayer = cs.getLayer();
		var lbConfig = new LabelConfig();		
		var clsData = clsJson.CLSData;
		var ds = window.CD.services.ds;
		
		cls_counter = 0;
		$.each(clsData, function(key, val){
			var labelId = clsData[key].labelGroupId.split('_')[1];
			val.labelGroupId = 'label_'+labelId;
			var labelGroup = CLSView.createLabelObject(val,labelId,lbConfig);
			var labelData = CLSData.getInspectorLabelData();
			CLSView.activelabelData(labelData,labelGroup);
			CLSView.populateLabelData(false,labelData);
			
			var txtGrp = labelGroup.get('#txtGrp_'+labelGroup.attrs.id.split('_')[1])[0];
			if(val.infoHideText==="T"){
				txtGrp.hide();
		       	
			}
			/*add info text in label*/
			var param={
					labelGrpID:labelGroup.attrs.id,
					labelGrpObj:labelGroup,
					labelData:'',
					infoHideText:val.infoHideText,
					infoHintText:val.hint_value,
					infoFeedbackText:val.feedback_value,
					showLabel:true
			};
			CLSView.createInfoTextObject(param);
			/*end here*/
			
			
			
			
			/*image and media insert*/
			if(val.image_data != "N"){
					var imageGrpId = 'img_' + labelGroup.attrs.id;				
					loadImageforLabel(labelGroup,imageGrpId,val.image_data,true);			
			}
			if(val.media_value != "N"){
				var audioGrpId = 'audio_' + labelGroup.attrs.id;
				var x = parseInt((val.play_option_value).split('|')[0]);
				var y = parseInt((val.play_option_value).split('|')[1]);
				loadAudioImage(labelGroup,audioGrpId,val.media_value,x,y,true);			
			}

			var classSet = val.class_set.split('|');

			if(val.distractor == 'F') {
				CLSView.labelGroupAssignControl(labelGroup,classSet);
			}
			
        	cls_counter++;
		});
		for(var key in clsData){
			var label = cdLayer.get('#'+clsData[key].labelGroupId)[0];
			label.setZIndex(clsData[key].zIndex);
		}

		
		CLSData.setValuesToCLSRN();
		ds.setOutputData();
		//this.handleDisplayLabelOnce();
		var globalHideTextcheck = false;
		var labelCountForHideText = 0;
		for(key in window.CD.module.data.Json.CLSData){
			if(window.CD.module.data.Json.CLSData[key].infoHideText == 'F'){
				globalHideTextcheck = true;
			}
			labelCountForHideText++;
		}
		if(globalHideTextcheck == false && labelCountForHideText!=0){
			$('#hideTextGlobal').prop('checked',true);
		}
	},

	
	showCLSDock: function(clscJson) {
		console.log('@CLSView.showCLSDock');
		var util = window.CD.util;	
		var cs = window.CD.services.cs;
		var stg = cs.getCanvas();
		var cdLayer = cs.getLayer();	
		var clscData = clscJson.CLSCData;
		
		i = 0;
		$.each(clscData, function(key, val){
			var dockGroup = CLSView.createDockObject(val,i);
			if(i==0){
				//CLSData.dockOrigHeight = val.height;
				//CLSData.dockOrigWidth = val.width;
				var labelData = CLSData.getInspectorLabelData();
				CLSView.activeDockData(labelData,dockGroup);
				CLSView.populateLabelData(false,labelData);
			}
			
			i++;
		});
		for(var key in clscData){
			var dock = cdLayer.get('#'+clscData[key].dockGroupId)[0];
			dock.setZIndex(clscData[key].zIndex);
		}
		cdLayer.draw();
	},
	labelToolClickHandler :function(e){
		  //var lt = window.CD.services.ts.labeltool;
		  e.preventDefault();
		  var labelModal = window.CD.util.getTemplate({url: 'resources/themes/default/views/cls_label_modal.html?{build.number}'});
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
				 var dockCnt = $('.label_options .dock_count').val();
				 
				 if(regex.test(labelCnt) && regex.test(distractorCnt) && regex.test(dockCnt)){
					 if($('.label_options .label_count').val() != "" && $('.label_options .distractor_count').val() != ""){				 
						 if(parseInt($('.label_options .label_count').val()) > 15 || parseInt($('.label_options .dock_count').val()) > 5 || parseInt($('.label_options .distractor_count').val()) > 15){
							 if(parseInt($('.label_options .label_count').val()) > 15 || parseInt($('.label_options .distractor_count').val()) > 15){
					    		validation.showLabelErrorPOPUP(26);	
					    	 }else if(parseInt($('.label_options .dock_count').val()) > 5){
					    		validation.showLabelErrorPOPUP(14);
					    	 }
						 }else{
							 ds.totalElm = $('.label_options .label_count').val();
							 //createLabelCommand.execute();						 
							 $('#labelModal').slideUp(200);
							 $('.tool_select').trigger('click');
							 window.CD.module.view.createDock(parseInt($('.dock_count').val()));
							 window.CD.module.view.createNewLabel($('.label_options .label_count').val(),$('.label_options .distractor_count').val());								 
							 CLSView.createAssignControl();
						 }
					}else{
						if($('.label_options .label_count').val() == ""){
	                   	   validation.showLabelErrorPOPUP(2);
	                      }
	                    if($('.label_options .distractor_count').val() == ""){
	                       $("#labelContainer #distractor_warning_blank").show();
	                       // $('.label_options .distractor_count').addClass("warning_input");
	                    }
					}
				 }else{
					 validation.showLabelErrorPOPUP(25);
				 }
				 
	                         
			  });
		  $("#labelContainer span#labelCancel").off('click').on('click',function(){
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
	      $(labelModal).remove();
	      $('#labelModal').remove();
		  $('body').append(labelModal);	
		  //$('#labelAlertText').html('<span class="heading_text">'+ds.getOptionLabelText()+'</span>');
		  $('#labelModal').css('left', (($('#toolPalette').width()/2) - ($('#labelModal').width()/2))+'px');
		  $('#labelModal').css('top', (($('#canvasHeight').val()/2) - ($('#labelModal').height()/2))+'px');
		  $('#labelModal').slideDown(200);
	  },
	  createLabelObject : function(labelData,counter,lbConfig) {
		  try{
			  	var cs = window.CD.services.cs;
			  	var stg = cs.getCanvas();
			  	var cdLayer = cs.getLayer();
			  	var ds = window.CD.services.ds;
				var lblGrpOptions = {draggable:true,x:labelData.holder_x,y: labelData.holder_y};
				
				var labelGroup = cs.createGroup('label_'+counter,lblGrpOptions);
				var labelWH = window.CD.module.data.Json.adminData.SLELD.split(",");
				var ldwidth = parseInt(labelWH[0]);
				var ldheight = parseInt(labelWH[1]);
				var textBoxBuffer = 20;
				var undoMng = window.CD.undoManager;
				var labelAttrs = CLSData.getLabelAttributes();
				/*var labelData = cs.cloneObject(clsDataDefaults);
				
				
				
				labelData.lockStatus = options.lockStatus;
				labelData.holder_x = options.holder_x;
				labelData.holder_y = options.holder_y;*/
				
				
				
				labelData.name = labelData.labelGroupId;
				
				lbConfig.id = 'lbl_' + counter;				
				
				var strokeWidth = 0;
				var strokeColor = 'transparent'
				var strokeEn = false;
				var fillColor = '#ffffff';
					
				if(labelAttrs.border === 'F'){
					strokeWidth = 1;
					strokeColor = '#999999';
					strokeEn = true;
				}
				
				if(labelData.transparent == 'F'){
					fillColor = lbConfig.style.fill;
				}
				
				if(labelData.distractor == 'T') {
					fillColor = '#faf8dd';
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
				                id:lbConfig.id
				   			});
				
				
				
				var textBoxGroup = cs.createGroup('txtGrp_'+counter,{'x':10,'y':(lbConfig.style.height-20)/2});
				var textBox = new Kinetic.Rect({
				    width: ldwidth-20,
				    height: 15,
				    fill: '#ffffff',
				    opacity:1,
				    id:'txtBox_'+counter
				});
				var addTextObj = new Kinetic.Text({		        	
					text: 'Add Label Text',
				    fontSize: 14,
				    y:2,
				    fontFamily: 'sans-serif',
				    fill: '#555',  
				    width: ldwidth-20,
				    height: 'auto',
				    opacity: '1',
				    verticalAlign:'top',
				    id: 'addTxt_'+counter,
				    name: 'nametxt',
				    align : 'center'
				  });
				
				if(labelData.visibility == false) {
					labelGroup.hide();
				}
				
				labelGroup.add(label);
				textBoxGroup.add(textBox);
				textBoxGroup.add(addTextObj);
				labelGroup.add(textBoxGroup);
				textBoxGroup.moveToTop();
				textBoxGroup.setY(0);
				if(labelData.distractor == 'T'){
					addTextObj.setText("Add Distractor Text");
				}
				var commonTextTool= new TextTool.commonLabelText();
				if(labelData.label_value) {						
					/*checking sb and sp tag in a text*/
					var textValue=labelData.label_value;
					
					var textFormat = new TextFormat();
					if(commonTextTool.checkSubOrSuperTagExist(textValue)){
						//textValue=commonTextTool.convertSbSpscript(textValue);	
					}
				 
					/** ---- For dock text creation ---- **/
					//var textValue = val.label_value;
					//var dockTextGrp = SLEView.createDockTextObject('',c,dockGroup);
					
					/*get text formatinf details*/
					if(labelData.textFormat){
					 	var fontStyle=labelData.textFormat.fontStyle;
					 	var underline_value=labelData.textFormat.underline_value;
					 	var fontSize=labelData.textFormat.fontSize;
					 	var align=labelData.textFormat.align;
					}else{
						var fontStyle='normal';
					 	var underline_value='F';
					 	var fontSize=14;
					 	var align='center';
					}
						
					var textBoxGroup = textFormat.createLabelText(textBoxGroup,textValue,align); 
				 //CLSData.attachEventforLabel("",editedTextObj);
					
					if(labelData.textFormat.underline_value == "T"){
						var textObj = textBoxGroup;
						if(textObj){
							$("#UnderlinetTool").data('clicked', true);
						}
					}
				 
					textBox.setFill("transparent");
					addTextObj.hide();
				}
				

				/** For text middle align **/
				if(textBoxGroup.get('#addTxt_'+counter)[0]){
					var count = textBoxGroup.children.length-1;
					var lastChild = commonTextTool.findLastTextchild(textBoxGroup,count);
					var textGrpHeight = textBoxGroup.children[lastChild].getY() + textBoxGroup.children[lastChild].getHeight();
					var topPadding = (textBoxGroup.parent.children[0].getHeight()-textGrpHeight)/2;
					if(topPadding < 0)
						topPadding = 0;
					textBoxGroup.setY(topPadding);			
				 }
				
				cdLayer.add(labelGroup);
	
				
				var active = {};
				active.element = labelGroup;
				
				//undoMng.register(this, CLSView.deleteAllLabels,[] , 'Delete all Label');
				makeCLSResizable(labelGroup, ldwidth, ldheight);	
				cs.dragLockUnlock(labelGroup,parseInt(ldwidth),parseInt(ldheight),!labelData.lockStatus);
				//cdLayer.add(labelGroup);
				labelGroup.on('mousedown',function(evt){
					cs.setActiveElement(this,'label');
					CLSView.showSavedHint(this);
					evt.cancelBubble = true;
					cs.updateDragBound(this);
					openInspector('label');
					window.CD.services.cs.updateMoveToTopBottomState(this);
					//this.moveToTop();
				});
				
				labelGroup.on('click',function(evt){
					evt.cancelBubble = true;
				});
				
				labelGroup.on('dragend',function(evt){
					evt.cancelBubble = true;
					/*var cls = CLSData.getCLSIndex(this.attrs.id);
					var hX=window.CD.module.data.Json.CLSData[cls].holder_x;
					var hY=window.CD.module.data.Json.CLSData[cls].holder_y;
					var labelId=labelGroup.getId();
					undoMng.register(this, CLSView.setLabelGroupPosition,[this,hX,hY,labelId] , 'Undo Label position',this, CLSView.setLabelGroupPosition,[this,this.getX(),this.getY(),labelId] , 'Redo Label position');
					updateUndoRedoState(undoMng);
					window.CD.module.data.Json.CLSData[cls].holder_x = this.getX();
					window.CD.module.data.Json.CLSData[cls].holder_y = this.getY();
					ds.setOutputData();*/	
					CLSView.setActiveLabelPosition(this);
				});
				var cls = CLSData.getCLSIndex(labelGroup.attrs.id);
				if(cls){
					if(labelData.zIndex == undefined){
						window.CD.module.data.Json.CLSData[cls].zIndex = labelGroup.getZIndex();
					}
				}

				var clsTextTool= new TextTool.commonLabelText();
				clsTextTool.bindLabelTextEvent(textBoxGroup);
				/*
				simpleText1.on("click",function(evt){
					var clsTextTool= new TextTool.commonLabelText();
					clsTextTool.textSetActive(this.parent, 'labelText');
				});
				simpleText1.on("dblclick dbltap",function(evt){
					var clsTextTool= new TextTool.commonLabelText();
					var textGrp = this.parent;					
					var evtObj = {selectorObj:textGrp,x:textGrp.getAbsolutePosition().x,y:textGrp.getAbsolutePosition().y+$('canvas').first().offset().top};
					clsTextTool.createTextBoxForLabel(evtObj);
				});
				*/
				
				/*this method will handle hide text checkbox click on click part*/
				
				
				/*add info text in label
				var param={
						labelGrpID:labelGroup.attrs.id,
						labelGrpObj:labelGroup,
						labelData:labelData
				}
				this.createInfoTextObject(param);
				end here*/
				
				
				
				var canvasWidth = stg.attrs.width;
				var canvasHeight = stg.attrs.height;
				
				/*var labelDistractorCount = CLSData.populatePublishData();
				var labelCount = labelDistractorCount.labelCount;
				var distractorCount = labelDistractorCount.distractorCount;
				CLSData.setValuesToCLSPS(labelCount,distractorCount);*/
				return labelGroup;
		  } catch(e){
			  console.log(e);
		  }
	  },
	  setLabelGroupPosition : function(group1,x,y,grpID){
		  var cs = window.CD.services.cs;
		  var ds = window.CD.services.ds;	
		  var cdLayer = cs.getLayer();
		  var cdLayer = cs.getLayer();
		  var objLength=group1.length;
		  for(var i=0;i<objLength;i++){
			  var group=cs.findGroup(grpID[i]);	
			  if(group)
			  group.setPosition(x[i],y[i]);
			  cdLayer.draw();
			  var cls = CLSData.getCLSIndex(group.attrs.id);	
			  if(cls){
				  window.CD.module.data.Json.CLSData[cls].holder_x = x[i];
				  window.CD.module.data.Json.CLSData[cls].holder_y = y[i];
				  ds.setOutputData();
			  }
		  }

	  },
	  setDockGroupPosition : function(group1,x,y,grpID){
		  var cs = window.CD.services.cs;
		  var ds = window.CD.services.ds;	
		  var cdLayer = cs.getLayer();
		  for(var i=0;i<group1.length;i++){
			  var group=cs.findGroup(grpID[i]);	
			  if(group)
			  group.setPosition(x[i],y[i]);
			  cdLayer.draw();
			  var clsc = CLSData.getCLSCIndex(group.attrs.id);	
			  if(clsc){
				  window.CD.module.data.Json.CLSCData[clsc].xpos = x[i];
				  window.CD.module.data.Json.CLSCData[clsc].ypos = y[i];
				  var dockId=group1[i].getId();
				  var cls = CLSData.getCLSCIndex(group1[i].attrs.id);
				  var dockHeadingId = window.CD.module.data.Json.CLSCData[cls].dockHeadingId;
				  var dockTxtGrp = group1[i].parent.parent.get('#'+dockHeadingId)[0];
				  var dockWith = group1[i].children[0].getWidth();
				  var docktextWidth = dockTxtGrp.children[0].getWidth();
				  dockTxtGrp.setX(group1[i].getX() - ((docktextWidth - dockWith)/2));
				  dockTxtGrp.setY(group1[i].getY()-parseInt(dockTxtGrp.children[0].getHeight()));
				  var canvasTextTool=new TextTool.canvasText();
				  canvasTextTool.setClsTextListData(dockTxtGrp);
					
				  var parentLayer=dockTxtGrp.getLayer();
				  if(parentLayer && parentLayer.attrs.id==="text_layer"){
					  parentLayer.draw();
				  }
				  ds.setOutputData();
			  }
			  
		  }
		  
	  },
	  createDockObject : function(dockData,counter,dockDataCounter) {
		dockDataCounter = dockDataCounter || counter;		
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;		
		var dockGrpOptions = {draggable:true,x:dockData.xpos,y:dockData.ypos };
		var dockGroup = cs.createGroup('dock_'+counter,dockGrpOptions);
		var undoMng = window.CD.undoManager;
		var dockAttr = CLSData.getDockAttributes();
		
		var strokeWidth = 1;
		var strokeColor = '#999999'
		var strokeEn = false;
		var dockFill = '#ffffff';
		
		var dashArrayValue = [10, 5];
		var dashArrayEnabled = true;
		
		var dockOpacity = 0.5;
		
		if(dockAttr.transparency == 'solid'){
			dockFill = '#ffffff';
			dockOpacity = 1;
		}else if(dockAttr.transparency == 'transparent'){
			dockFill = 'transparent';
		}else{
			if(dockAttr.transparency == 'semitransparent'){
				dockFill = '#ffffff';
				dockOpacity = 0.5;
			}
		}
		
		if(dockAttr.border === 'F'){
			strokeEn = true;
			dashArrayEnabled =false;
		}
		var dock = new Kinetic.Rect({	
			x:0,
			y:0,//dockName.getHeight() + 2,
		  width: dockData.width,
		  height: dockData.height,						                
		  stroke: strokeColor,
		  strokeWidth: strokeWidth,
		  cornerRadius: 5,
		  strokeEnabled: true,
		  dashArray: dashArrayValue,
          dashArrayEnabled: dashArrayEnabled,
		  fill: dockFill,
		  opacity:dockOpacity,
		  id:'dck_'+counter
		  //name : 'label_'+i
		});
		cdLayer.add(dockGroup);
		dockGroup.add(dock);
		
		var dockText = new Kinetic.Text({
			x:10,
			y:dock.getHeight()-20,
			text: (dockDataCounter + 1),
		    fontSize: 16,
		    fontStyle: 'bold',
		    fontFamily: 'sans-serif',
		    fill: '#444',  
		    width: 'auto',
		    height: 'auto',
		    opacity: '1',
		    verticalAlign:'top',
		    id: 'dockName_dock_'+ counter,
		    name: 'nametxt',
		    align : 'center',
		    shadowColor: '#fff',
	        shadowBlur: 1,
	        shadowOffset: 1,
	        shadowOpacity: 1
		  });
		dockGroup.add(dockText);
		
		makeCLSResizable(dockGroup, dockData.width, dockData.height, dock.getX(), dock.getY());	
		cs.dragLockUnlock(dockGroup,dockData.width, (dockData.height),!dockData.lockStatus);
		
		dockData.dockGroupId = 'dock_'+counter;
		//dockData.name = 'group'+(counter+1);
		dockData.dockGroupNo = (counter+1);
		/*
		var canvasTextTool=new TextTool.canvasText();
		var dockHeadingId = canvasTextTool.createText('Add Name (Group '+ (counter+1) +')',dockData.xpos,(dockData.ypos-20),dockData.width);
		dockData.dockHeadingId = dockHeadingId;*/
		
		
		
		// Dock events 

		dockGroup.on('mousedown',function(evt){
			cs.setActiveElement(this,'dock');
			//CLSView.showSavedHint(this);
			evt.cancelBubble = true;
			cs.updateDragBound(this);
			openInspector('label');
			window.CD.services.cs.updateMoveToTopBottomState(this);
			$('#localDivInactive').remove();
			//this.moveToTop();
		});
		
		dockGroup.on('click',function(evt){
			evt.cancelBubble = true;
			$('#localDivInactive').remove();
		});
				
		dockGroup.on('dragend',function(evt){
			evt.cancelBubble = true;
			/*var clsc = CLSData.getCLSCIndex(this.attrs.id);
			var hX=window.CD.module.data.Json.CLSCData[clsc].xpos;
			var hY=window.CD.module.data.Json.CLSCData[clsc].ypos;
			var dockId=dockGroup.getId();
			var dockHeadingId = window.CD.module.data.Json.CLSCData[clsc].dockHeadingId;
			var dockTxtGrp = this.parent.parent.get('#'+dockHeadingId)[0];
			var dockWith = this.children[0].getWidth();
			var docktextWidth = dockTxtGrp.children[0].getWidth();
			dockTxtGrp.setX(this.getX() - ((docktextWidth - dockWith)/2));
			dockTxtGrp.setY(this.getY()-parseInt(dockTxtGrp.children[0].getHeight()));
			var canvasTextTool=new TextTool.canvasText();
			canvasTextTool.setClsTextListData(dockTxtGrp);
			
			var parentLayer=dockTxtGrp.getLayer();
			if(parentLayer && parentLayer.attrs.id==="text_layer"){
			  	   parentLayer.draw();
			}
			
			undoMng.register(this, CLSView.setDockGroupPosition,[this,hX,hY,dockId] , 'Undo Dock position',this, CLSView.setDockGroupPosition,[this,this.getX(),this.getY(),dockId] , 'Redo dock position');
			updateUndoRedoState(undoMng);
			window.CD.module.data.Json.CLSCData[clsc].xpos = this.getX();
			window.CD.module.data.Json.CLSCData[clsc].ypos = this.getY();*/
			CLSView.setActiveDockPosition(this);
			ds.setOutputData();	
		});
		
		dock.on('mouseover',function(){
			
		});
		var clsc = CLSData.getCLSCIndex(dockGroup.attrs.id);
		if(clsc){
			if(dockData.zIndex == undefined ){
				window.CD.module.data.Json.CLSCData[clsc].zIndex = dockGroup.getZIndex();
			}
		}
		return dockGroup;
	  },
	  createDock : function(totalDockToCreate){
      		var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var ds = window.CD.services.ds;			
			var dockCount = cs.objLength(window.CD.module.data.Json.CLSCData);
			var undoMng = window.CD.undoManager;
			var dockGroupStartId = dockCount;
			if(dockCount > 0){
				dockGroupStartId = CLSData.getDockStartId();
				//dockGroupStartId--;
			}
				
			
			var columnCount = dockGroupStartId;
			var rowCount = 0;
			
			var dockDefaultHeight = parseInt(CLSData.dockOrigHeight);
			var dockDefaultWidth = parseInt(CLSData.dockOrigWidth);
			
			if(dockCount > 0){
				var clscJson = CLSData.getCLSCData();
				
				dockDefaultHeight = parseInt(clscJson['CLSC0'].height);
				dockDefaultWidth = parseInt(clscJson['CLSC0'].width);
				
				for(var each in clscJson){
					var eachObj = {};
					var dockW =clscJson[each].width;
					var dockH = clscJson[each].height;
					if(dockDefaultHeight != dockH || dockDefaultWidth != dockW){
						dockDefaultHeight = parseInt(CLSData.dockOrigHeight);
						dockDefaultWidth = parseInt(CLSData.dockOrigWidth);
						break;
					}else{
						dockDefaultHeight = parseInt(clscJson[each].height);
						dockDefaultWidth = parseInt(clscJson[each].width);
					}
				}
			}
			
			var dockDefaultXpos = 250;
			var dockDefaultYpos = 100;
			var dockHeightBuffer = 40;
			var dockWidthBuffer = 10;
			var maxColumnPerRow = Math.ceil((parseInt($('#canvasWidth').val()) - dockDefaultXpos) / (dockDefaultWidth + dockWidthBuffer));
			
			if(dockCount > 0){
				if((dockCount + totalDockToCreate) >= maxColumnPerRow) {
					rowCount = Math.ceil((dockCount + 1) / maxColumnPerRow) - 1;
					columnCount = dockCount % maxColumnPerRow;
				}
			}
			
			
			for(var i = dockGroupStartId; i<(dockGroupStartId+totalDockToCreate); i++) {
				var dockData = cs.cloneObject(clscDataDefaults);	
				var dockXpos  = dockDefaultXpos + ((columnCount) * (dockDefaultWidth + dockWidthBuffer));
				var dockDataYpos = dockDefaultYpos + (rowCount * dockHeightBuffer);
				//if((dockXpos + dockDefaultWidth) > parseInt($('#canvasWidth').val())){
				if(columnCount >= maxColumnPerRow){
					columnCount = 0;
					rowCount++;
					dockDataYpos = dockDefaultYpos + (rowCount * dockHeightBuffer);
					dockXpos  = dockDefaultXpos + ((columnCount) * (dockDefaultWidth + dockWidthBuffer));
				}
				columnCount++;
				
				dockData.width = dockDefaultWidth;
				dockData.height = dockDefaultHeight;
				dockData.xpos = dockXpos;
				dockData.ypos = dockDataYpos;
				dockData.name = 'group'+(i+1);
				
				if(dockCount > 0){
					dockData = CLSView.setDockProperties(dockData);
				}
				var dockGroup = CLSView.createDockObject(dockData,i);	
				dockData.zIndex = dockGroup.getZIndex();
				var canvasTextTool=new TextTool.canvasText();
				var dockHeadingId = canvasTextTool.createText('Add Name (Group '+ (i+1) +')',(dockData.xpos-8),(dockData.ypos-20),dockData.width+20,i,'clsDock');
				/* for dock heading Json update */
				var frameTxtId = dockHeadingId.split('_')[1];		
				var frmID = dockHeadingId.split('_')[2];
				//window.CD.module.data.Json.FrameData[0].frameTextList[frameTxtId].fontStyle = 'bold';
				cs.getBgTextLayer().get('#'+dockHeadingId)[0].children[1].setFontStyle('bold'); // QC#4093
				
				
				var defaultParams = CanvasData.getDefaultParamsFromJson(dockHeadingId);
				
				var params = {};
				params.fontType = 'bold';
				params.textValue = 'Add Name (Group '+ (i+1) +')';
				params.textX = dockData.xpos + 7;
				params.textY = (dockData.ypos - 4);
				defaultParams = $.extend(defaultParams,params);
				CanvasData.updateCanvasTextData(defaultParams,frameTxtId,frmID);
				
				cs.getBgTextLayer().draw();
				dockData.dockHeadingId = dockHeadingId;
				window.CD.module.data.Json.CLSCData['CLSC'+i] = dockData;
			}
			CLSData.reIndexDocks();
			if(totalDockToCreate > 0)
				undoMng.register(this, CLSView.deleteAllDocks,[dockGroupStartId,totalDockToCreate] , 'Undo create all Label',this, CLSView.createDock,[totalDockToCreate] , 'Redo create all Label');
			updateUndoRedoState(undoMng);
			ds.setOutputData();
			cdLayer.draw();
      },
      
      setDockProperties : function(dockData){
			try{
				if(window.CD.module.data.Json.CLSCData.CLSC0.transparent_border == "F"){
					dockData.transparent_border = "F";
				}
				else{
					dockData.transparent_border = "T";
				}
				
				if(window.CD.module.data.Json.CLSCData.CLSC0.transparent == "semitransparent"){
					dockData.transparent = "semitransparent";
				}
				else{
					if(window.CD.module.data.Json.CLSCData.CLSC0.transparent == "transparent"){
						dockData.transparent = "transparent";
					}else{
						dockData.transparent = "solid";
					}
					
				}
				return dockData;
			}
			catch(error){
				console.info("Error inside clsView::setDockProperties()"+ error.message);
			}
		},
		
	  createNewLabel : function(totalLabelToCreate,totalDistractorsToCreate) {
			console.log("@LabelTool.createLable.execute::");console.log("@window.CD.services.labeltool.createLabel");
			try{
				var cs = window.CD.services.cs;
				var stg = cs.getCanvas();
				var cdLayer = cs.getLayer();
				var lbConfig = new LabelConfig();
				var ds = window.CD.services.ds;

				var undoMng = window.CD.undoManager;
				console.info("lbConfig.p_id::"+lbConfig.p_id);
				var labelCount = cs.objLength(window.CD.module.data.Json.CLSData);
				var labelGroupStartId = labelCount;
				var totdockLbl = 0,isDistractor = false,c=0,d=0,x=0;

				var canvasWidth = stg.attrs.width;
				var canvasHeight = stg.attrs.height;
				
				/* --- updating value for x,y of hint/feedback placeholder for 0,0 --- */
				var hintFeedbackParam = CLSData.getHintFeedbackFromJson();
				if(hintFeedbackParam.x == 0){
					var hintFeedbackX = canvasWidth-50;
				}
				if(hintFeedbackParam.y == 0){
					var hintFeedbackY = canvasHeight-100;
				}
				CLSData.setHintFdbckToJson('','',hintFeedbackX,hintFeedbackY);
				
				if(labelCount) {
					var labelGroupId = window.CD.module.data.Json.CLSData.CLS0.labelGroupId;
					var lblGroup = cs.findGroup(labelGroupId);
					
					labelGroupStartId = CLSData.getLabelStartId();
					lbConfig.style.width = lblGroup.children[0].getWidth();
					lbConfig.style.height = lblGroup.children[0].getHeight();
				}else{
					window.CD.module.data.Json.adminData.SLELD = lbConfig.style.width + ',' + lbConfig.style.height;
				}
	           
	            totalLabelToCreate = parseInt(totalLabelToCreate);
	            var labelDistractorCount = totalLabelToCreate+parseInt(totalDistractorsToCreate);
	            totalDistractorsToCreate = parseInt(totalDistractorsToCreate);
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
	            
	            for(var i = labelGroupStartId; i<totlblCount; i++) {
	            	var labelData = cs.cloneObject(clsDataDefaults);
	            	labelData.holder_x = 100;
	            	labelData.holder_y = 50 + (i*parseInt(overLapVal));
	            	counter = i;
	            	lbConfig = lbConfig;
	            	labelData.lockStatus = false;
	            	
	            	if(labelCount) {
						labelData = CLSView.setLabelProperties(labelData);
					}
	            	labelData.labelGroupId = 'label_'+counter;
	            	//labelData.zIndex = labelGroup.getZIndex();
	            	window.CD.module.data.Json.CLSData['CLS'+i] = labelData;
	            	var labelGroup = this.createLabelObject(labelData,counter,lbConfig);
	            	window.CD.module.data.Json.CLSData['CLS'+i].zIndex = labelGroup.getZIndex();
	            	
	            	//this.labelGroupAssignControl(labelGroup,['group1']);
	            	
					window.CD.module.data.Json.adminData.SLELD = lbConfig.style.width + ',' + lbConfig.style.height;
										
					if(i == distractorCount){
					    this.createDistractor(labelGroup);        
					    d++;
					    if(d != totalDistractorsToCreate)
					    distractorCount++;
					}
					var labelDistractorCount = CLSData.populatePublishData();
					var labelCnt = labelDistractorCount.labelCount;
					var distractorCnt = labelDistractorCount.distractorCount;
					CLSData.setValuesToCLSPS(labelCnt,distractorCnt);
					/*add info text in label*/
					var param={
							labelGrpID:labelGroup.attrs.id,
							labelGrpObj:labelGroup,
							labelData:labelData
							
					}
					CLSView.createInfoTextObject(param);
					/*end here*/
					
					CLSData.reIndexLabels();
					ds.setOutputData();
	            }
	            if(totalLabelToCreate>0 || totalDistractorsToCreate>0)
	            undoMng.register(this, CLSView.deleteAllLabels,[labelGroupStartId,labelDistractorCount] , 'Undo create all Label',this, CLSView.redoAllLabel,[totalLabelToCreate,totalDistractorsToCreate] , 'Redo create all Label');
	            updateUndoRedoState(undoMng);
				cdLayer.draw();
				CLSData.setValuesToCLSRN();
				ds.setOutputData();
			}catch(err){
				console.error("@window.CD.services.labeltool.createLabel::Error while creating Label::"+err.message);
			}	
		},
		setLabelProperties : function(labelData){
			try{
				if(window.CD.module.data.Json.CLSData.CLS0.transparent_border == "F"){
					labelData.transparent_border = "F";
				}
				else{
					labelData.transparent_border = "T";
				}
				
				if(window.CD.module.data.Json.CLSData.CLS0.transparent == "F"){
					labelData.transparent = "F";
				}
				else{
					labelData.transparent = "T";
				}
				return labelData;
			}
			catch(error){
				console.info("Error inside clsView::setLabelProperties()"+ error.message);
			}
		},
		
		
		
		redoAllLabel : function(totalLabelToCreate,totalDistractorsToCreate) {
			CLSView.createNewLabel(totalLabelToCreate,totalDistractorsToCreate);
			CLSView.createAssignControl();
		},
		appendItem : function(group,obj,padding){
			padding = padding || 0;
			var cs = window.CD.services.cs;
			var childrenLen = group.children.length;
			if(childrenLen > 0){
				childrenLen = childrenLen - 1;
				var lstItemX = group.children[childrenLen].getX();
				var lstItemY = group.children[childrenLen].getY();
				var lstItemWidth = group.children[childrenLen].children[0].getWidth();
				var lstItemHeight = group.children[childrenLen].children[0].getHeight();				
				obj.setX(lstItemX + lstItemWidth + padding);
			} 
			group.add(obj);
			return group;
		},
		createAssignControl : function(){
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var CLSData = window.CD.module.data.Json.CLSData;
			var labelCount = cs.objLength(CLSData);
			for(var j = 0; j<labelCount; j++){
				if(CLSData['CLS' + j].distractor === 'F'){
					var labelGroupId = CLSData['CLS' + j].labelGroupId;
					var classSet = CLSData['CLS' + j].class_set.split('|');				
					var label = cs.findGroup(labelGroupId);
					CLSView.labelGroupAssignControl(label,classSet);
				}
			}
			cdLayer.draw();
		},
		dockGroupReArrange : function(){
			console.log("@clsView.dockGroupReArange");
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			var dockCount = cs.objLength(window.CD.module.data.Json.CLSCData);
			var CLSCData = window.CD.module.data.Json.CLSCData;
			if(dockCount>0) {				
				for(var i = 0; i<dockCount; i++){					
					var DockGroupId = CLSCData['CLSC'+i].dockGroupId;
					var dockGroup = cs.findGroup(DockGroupId);
					var dockText = dockGroup.get('#dockName_'+DockGroupId)[0];
					dockText.setText(i+1);
				}
			}
		},
		deleteAudio:function(node){
			var ds = window.CD.services.ds;
			var labelData  = window.CD.module.data.Json.CLSData;
			labelData[node].media_value = "N";
			labelData[node].play_option_value = 'N';
			ds.setOutputData();
		},
		labelGroupAssignControl : function(label,classSet){
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			var dockCount = cs.objLength(window.CD.module.data.Json.CLSCData);
			var labelCount = cs.objLength(window.CD.module.data.Json.CLSData);			
			var CLSCData = window.CD.module.data.Json.CLSCData;
			var CLSLabelData = window.CD.module.data.Json.CLSData;
			var clsIndx = CLSData.getCLSIndex(label.attrs.id);
			var undoMng = window.CD.undoManager;
			if(CLSLabelData[clsIndx].distractor == 'F') {				
				if(cs.findObject(label,'selObjGrp_'+label.attrs.id)) {
					cs.findObject(label,'selObjGrp_'+label.attrs.id).remove();
				}
				
				var selObjGrp = cs.createGroup('selObjGrp_'+label.attrs.id,{x:5,y:label.children[0].getHeight() - 12});
				for(var i = 0; i<dockCount; i++){					
					var DockGroupId = CLSCData['CLSC'+i].dockGroupId;
					var dockSelGroup = cs.createGroup('dockSel_'+i);
					var selected = false;
					if(this.isInClassSet(classSet,CLSCData['CLSC'+i].name)) {
						selected = true;
					}
					var selBox = new Kinetic.Rect({	
						x:0,
						y:0,
		                width: 10,
		                height: 10,						                
		                stroke: '#999999',
		                strokeWidth: 0.2,
		                cornerRadius: 2,
		                strokeEnabled: true,
		                fill: selected?'#1086D9':'transparent',
		                opacity:0.5,
		                id:'dock_selBox_'+i
		                //name : 'label_'+i
		   			});
					dockSelGroup.add(selBox);
					
					var selName = new Kinetic.Text({
						y:1,
						text: (i + 1),
				        fontSize: 9,
				        style:'bold',
				        fontFamily: 'sans-serif',
				        fill: selected?'#ffffff':'#1086D9',  
				        width: selBox.getWidth(),
				        height: selBox.getHeight(),
				        opacity: 1,
			            id: 'grpSel_'+DockGroupId,
			            align : 'center'
			          });
					dockSelGroup.add(selName);
					selName.moveToTop();
					selBox.on('mousedown',function(){
						CLSView.toggleSelectionOTM(this.parent)
					});
					selName.on('mousedown',function(){
						if(window.CD.module.data.Json.adminData.OTO)
							CLSView.toggleSelectionOTO(this.parent)
						else
							CLSView.toggleSelectionOTM(this.parent);
					});
					
					this.appendItem(selObjGrp,dockSelGroup,3);				
				}
				label.add(selObjGrp);
			}
		},
		toggleSelectionOTO:function(obj){
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var ds = window.CD.services.ds;
			var CLSCData = window.CD.module.data.Json.CLSCData;
			var CLSLabelData = window.CD.module.data.Json.CLSData;
			
			if(obj.parent) {
				var labelGroup = obj.parent.parent;
				var cls = CLSData.getCLSIndex(labelGroup.attrs.id);
				var classSet = "";
				var dockGroupNo = obj.children[1].getText();
				var dockData = CLSView.dockfromGroupNo(dockGroupNo);
				var dockName = dockData.name;			
				var undoMng = window.CD.undoManager;
				var isSelected = false;
				undoMng.register(this, CLSView.toggleSelectionOTO,[obj] , 'Toggle selection undo',this, CLSView.toggleSelectionOTO,[obj] , 'Toggle selection redo');
				updateUndoRedoState(undoMng);
				for(var i=0; i<obj.parent.children.length; i++){
					if(obj.children[0].getFill() == '#1086D9' && obj.children[1].getFill() == '#ffffff') {
						isSelected = true;
					}
					obj.parent.children[i].children[0].setFill('transparent');
					obj.parent.children[i].children[1].setFill('#1086D9');	
				}
				
				if(!isSelected){
					obj.children[0].setFill('#1086D9');
					obj.children[1].setFill('#ffffff');
					classSet = dockName;
				}
				
				CLSLabelData[cls].class_set = classSet
				ds.setOutputData();
				cdLayer.draw();
			}
		},
		toggleSelectionOTM:function(obj){
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var ds = window.CD.services.ds;
			var CLSCData = window.CD.module.data.Json.CLSCData;
			var CLSLabelData = window.CD.module.data.Json.CLSData;
			var labelGroup = obj.parent.parent;
			
			if(!labelGroup) {
				var labelGroupId = obj.parent.attrs.id.substr(10,obj.parent.attrs.id.length);
				labelGroup = cdLayer.get('#'+labelGroupId)[0];
			}
			
			
			var cls = CLSData.getCLSIndex(labelGroup.attrs.id);
			var classSet = new Array();
			var dockGroupNo = obj.children[1].getText();
			var dockData = CLSView.dockfromGroupNo(dockGroupNo);
			var dockName = '';			
			var newClassSet = new Array();
			var undoMng = window.CD.undoManager;
			var isSelected = false;
			undoMng.register(this, CLSView.toggleSelectionOTM,[obj] , 'Toggle selection undo',this, CLSView.toggleSelectionOTM,[obj] , 'Toggle selection redo');
			updateUndoRedoState(undoMng);
			if(dockData){
				dockName = dockData.name;
			}
			
			if(CLSLabelData[cls].class_set){
				classSet = CLSLabelData[cls].class_set.split("|");
			}
			
			if(obj.children[0].getFill() == '#1086D9'){
				isSelected = true;
				obj.children[0].setFill('transparent');
				obj.children[1].setFill('#1086D9');				
				classSet = CLSView.removeArrayElement(classSet,dockName);
			} else {
				if(!isSelected){
					obj.children[0].setFill('#1086D9');
					obj.children[1].setFill('#ffffff');
					classSet.push(dockName);
				}
			}
			
			
			
			
			CLSLabelData[cls].class_set = classSet.join("|");
			ds.setOutputData();
			//this.handleSameLabelClassSet();
			if(window.CD.module.data.Json.adminData.TYPE == true){
				var txtGrp = labelGroup.get('#txtGrp_'+labelGroup.attrs.id.split('_')[1])[0];
				var childrenCount = txtGrp.children.length;
				if(childrenCount > 2) { //If text added
					var labelTxtVal = CLSData.getLabelTextValue(labelGroup.getId());
					this.invertSelectionSameLabelTwice(labelTxtVal,classSet);
				}
			}
			cdLayer.draw();
		},
		
		/** Modified for CLS label interaction issue **/
		invertSelectionSameLabelTwice:function(textVal,classSetArr) {
			  var cs = window.CD.services.cs;
			  var ds = window.CD.services.ds;
			  var cdLayer = cs.getLayer();
			  var outputJSon = CLSData.getJsonData();
			  var adminData = CLSData.getJsonAdminData();
			  var textArr = {};
			  
			  for(var clsCount in outputJSon){
				  var labelGroupID = outputJSon[clsCount].labelGroupId;
				  var labelGroupLbl = cs.findGroup(labelGroupID);
				  var label = labelGroupLbl.children[0];
				  var lblIndex = labelGroupID.split('_')[1];
				  var txtGrp = labelGroupLbl.get('#txtGrp_'+lblIndex)[0];
				  var textValue = CLSData.getLabelTextValue(labelGroupID);
				  var cls = CLSData.getCLSIndex(labelGroupID);				 
				  //var obj = cdLayer.get('#dockSel_'+labelGroupID.split('_')[1])[0];
				  var labelGroup = labelGroupLbl;
				  var CLSCData = window.CD.module.data.Json.CLSCData;
				  var CLSLabelData = window.CD.module.data.Json.CLSData;		
				  var undoMng = window.CD.undoManager;
				  
				  var childrenCount = txtGrp.children.length;
				  if(childrenCount > 2 && textValue == textVal) {	
					  var selObjGrp = cdLayer.get('#selObjGrp_'+labelGroup.attrs.id)[0];
					  for(var i=0; i<selObjGrp.children.length; i++){	
						  var obj = cs.findObject(selObjGrp,'dockSel_'+i);
						  if($.inArray('group' + (i+1),classSetArr) != -1) {
							  obj.children[0].setFill('#1086D9');
							  obj.children[1].setFill('#ffffff');
						  } else {
							  obj.parent.children[i].children[0].setFill('transparent');
							  obj.parent.children[i].children[1].setFill('#1086D9');							  
						  }
					  }

					  CLSLabelData[cls].class_set = classSetArr.join("|");;
					  ds.setOutputData();
					  cdLayer.draw();
				  }			  
			  }
			  ds.setOutputData();
		  },
		
		
		
		
		
		
		
		
		
		
		
		
		
		dockfromGroupNo:function(dockGroupNo){
			var cs = window.CD.services.cs;
			var CLSCData = window.CD.module.data.Json.CLSCData;
			var dockCount = cs.objLength(CLSCData);
			for(var i=0; i<dockCount; i++){
				if(CLSCData['CLSC'+i].dockGroupNo === parseInt(dockGroupNo)){
					return CLSCData['CLSC'+i];
				}
			}
		},
		removeArrayElement: function(array,elm) {
			var newArr = new Array();
			for(var i=0; i<array.length; i++){
				if(array[i] === elm){
					
				} else {
					newArr.push(array[i]);
				}
			}
			return newArr;
		},
		createDistractor: function(labelGroup){
            var cs = window.CD.services.cs;
            var ds = window.CD.services.ds;
            var cdLayer = cs.getLayer();
            var cls = CLSData.getCLSIndex(labelGroup.attrs.id);
            labelGroup.get('#addTxt_'+labelGroup.attrs.id.split('_')[1])[0].setText('Add Distractor Text');               
            labelGroup.children[0].setFill('#faf8dd');
            cdLayer.draw();
            window.CD.module.data.Json.CLSData[cls].distractor = 'T';
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
				        fontSize: 10,
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
			    		undoMng.register(this, CLSView.undoHideText,[labelGrpObj.getId()] , 'Undo Label Info text',this, CLSView.undoHideText,[labelGrpObj.getId()] , 'Redo Label Info text');
			    		updateUndoRedoState(undoMng);
			    		$('#hideTextLoc').trigger('click');
			    		
			    		var clsTextTool= new TextTool.commonLabelText();
						var undoCallStatus = 'redo';
						var redoCallStatus = 'undo';
						undoMng.register(this, clsTextTool.onClickHideLabelText,[labelGrpObj.getId(),undoCallStatus] , 'Undo Label Info text',this, clsTextTool.onClickHideLabelText,[labelGrpObj.getId(),redoCallStatus] , 'Redo Label Info text');
						updateUndoRedoState(undoMng);
						clsTextTool.onClickHideLabelText(labelGrpObj.getId(),'undo');
						infoTextObj.setFill('#1086D9');
			    	})*/
			    	
			    }
			    //for showing infoTextT while rendering label
				 if(param.showLabel){
					
					 
					 if( (param.infoHideText==="T") && value==="T"){
						 showTVal=true;
						 infotObj=infoTextObj;
						 infoTextObj.show();
						 $('#hideTextLoc').prop('checked',true);
					 }
					 if(param.infoHintText!=='' && value==="H"){
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
				 
			 });
			 
			/*add info text objects*/
			 labelGrpObj.add(infoGroupText);
			 if(!param.showLabel){
				 labelData.infoHideText='F'
			 }
			 cdLayer.draw();
			 ds.setOutputData();	
		    
		},
		
		deleteLabel : function(active,obj) {
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var ds = window.CD.services.ds;
			var undoMng = window.CD.undoManager;
			var lbData = [];
			var labelCount = cs.objLength(window.CD.module.data.Json.CLSData);
			var activeElmIds = [];
			var activeElmArray = [];
			if(!obj){
				for(var i=0;i<active.element.length;i++){
					var activeElm = active.element[i];
					activeElmIds.push(active.element[i].attrs.id)
					var outputJson = window.CD.module.data.Json;
					var labelName = activeElm.children[0].attrs.name;
					var images = activeElm.get('.img')[0];
					if(images){
						var imageSrc = images.getImage().src.split('/');
						var imageName = imageSrc[imageSrc.length-1];
					}
					
					var lblIndex = CLSData.getCLSIndex(activeElm.attrs.id,labelCount);
					this.setCLSPS(lblIndex);
					lbData.push(jQuery.extend(true, {}, window.CD.module.data.Json.CLSData[lblIndex]));
					delete outputJson.CLSData[lblIndex];
					if(imageName){
						window.CD.services.ds.updateImageList(imageName,'remove');
					}
					activeElm.remove();
					cs.deleteSubGroups(activeElm);
					activeElmArray.push(activeElm);
				}
				
			}else{
				for(var j=0;j<obj.length;j++){
					activeElm = cdLayer.get('#'+obj[j].attrs.id)[0];
					//activeElmIds.push(obj[j].attrs.id)
					var outputJson = window.CD.module.data.Json;
					var labelName = activeElm.children[0].attrs.name;
					var images = activeElm.get('.img')[0];
					if(images){
						var imageSrc = images.getImage().src.split('/');
						var imageName = imageSrc[imageSrc.length-1];
					}
					
					var lblIndex = CLSData.getCLSIndex(activeElm.attrs.id,labelCount);
					this.setCLSPS(lblIndex);
					lbData.push(jQuery.extend(true, {}, window.CD.module.data.Json.CLSData[lblIndex]));
					delete outputJson.CLSData[lblIndex];
					if(imageName){
						window.CD.services.ds.updateImageList(imageName,'remove');
					}
					activeElm.remove();
					cs.deleteSubGroups(activeElm);
				}
				cdLayer.draw();
			
			}
			if(!obj){
				undoMng.register(this, CLSView.undoLabelDelete,[lbData,activeElmIds] , 'Delete Label',this, CLSView.deleteLabel,['',activeElmArray] , 'Redo Delete Label');
				updateUndoRedoState(undoMng);
			}
			
			CLSData.reIndexLabels();
			if(!obj){
				cs.setActiveElement(cs.findGroup('frame_0'),'frame');
			}
			cs.resetToolbar();
			CLSData.setValuesToCLSRN();//on delete update CLSRN else getting error in test mode
			ds.setOutputData();
		},
		setCLSPS : function(lblIndex){
			var totRndmLbl = window.CD.module.data.Json.CLSPS['totalRandomLabels'];
			var totRndmDist = window.CD.module.data.Json.CLSPS['totalRandomDistractors'];
			var distractorVal = window.CD.module.data.Json.CLSData[lblIndex].distractor;
			var clsData = window.CD.module.data.Json.CLSData;
			var labelCnt = 0;
			var disCnt = 0;
			for(key in clsData){
				if(clsData[key].distractor == 'F'){
					labelCnt++;
				}
				if(clsData[key].distractor == 'T'){
					disCnt++;
				}
			}
			if(disCnt<=totRndmDist){
				if(distractorVal == 'T'){
					totRndmDist--;
				}
			}
			if(labelCnt<=totRndmLbl){
				if(distractorVal == 'F'){
					totRndmLbl--;
				}
			}
				
			window.CD.module.data.Json.CLSPS['totalRandomLabels'] = totRndmLbl;
			window.CD.module.data.Json.CLSPS['totalRandomDistractors'] = totRndmDist;
		},
		/**
		 * description::
		 * This method is used for undo creation of all labels
		 * All labels will be deleted together on undo
		 * Called from createLabelObject() 
		 */
		deleteAllLabels : function(labelStartId,totalLabelToCreate){
			var cs = window.CD.services.cs;
			var labelData  = window.CD.module.data.Json.CLSData;
			var ds = window.CD.services.ds;
			var outputJson = window.CD.module.data.Json;
			var undoMng = window.CD.undoManager;
			var counter = labelStartId;
			var finalCounter = counter+parseInt(totalLabelToCreate);
			var oldObject = {};
			for(var count = counter;count < parseInt(finalCounter);count++){
				var newLabelGrpId = 'label_'+count;
				var newIndex = CLSData.getLabelIndex(newLabelGrpId);
				var labelGroup = cs.findGroup(newLabelGrpId);
				cs.deleteSubGroups(labelGroup);
				labelGroup.remove();
				oldObject[newIndex]={'labelData' : outputJson.CLSData[newIndex]};
				delete outputJson.CLSData[newIndex];
			}
			//undoMng.register(this, CLSView.undoAllLabelDelete,[counter,oldObject] , 'Undo delete all labels');
//			for(var cnt = counter;cnt < parseInt(finalCounter);cnt++){
//				var newIndx = 'CLS'+cnt;
//				
//			}
			
			CLSData.reIndexLabels();
			cs.setActiveElement(cs.findGroup('frame_0'),'frame');
			cs.resetToolbar();
			ds.setOutputData();	
		},
		
		undoAllLabelDelete : function(counter,oldObject){
			var ds = window.CD.services.ds;
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var lbConfig = new LabelConfig();			
			var startId = counter;
			var newCounter = cs.onjLength(oldObject);
			var finalCount = parseInt(startId)+parseInt(newCounter);
			for(var counter = startId;counter < finalCount;counter++){
				var cls = 'CLS'+counter;
				var labelGroup = CLSView.createLabelObject(oldObject[cls].labelData,counter,lbConfig);
				window.CD.module.data.Json.CLSData[cls] = oldObject[cls].labelData;	
				CLSView.labelGroupAssignControl(labelGroup,oldObject[cls].labelData.class_set.split('|'));
			}
			
			CLSData.reIndexLabels();
			cdLayer.draw();
			ds.setOutputData();
		},
		deleteAllDocks : function(labelStartId,totalLabelToCreate){
			var cs = window.CD.services.cs;
			var labelData  = window.CD.module.data.Json.CLSCData;
			var ds = window.CD.services.ds;
			var outputJson = window.CD.module.data.Json;
			var undoMng = window.CD.undoManager;
			var counter = labelStartId;
			var finalCounter = counter+parseInt(totalLabelToCreate);
			var oldObject = {};
			var txtLayer = cs.getBgTextLayer();
			for(var count = counter;count < parseInt(finalCounter);count++){
				var newLabelGrpId = 'dock_'+count;
				var newIndex = CLSData.getCLSCIndex(newLabelGrpId);
				var labelGroup = cs.findGroup(newLabelGrpId);
				var canvasTextTool=new TextTool.canvasText();
				var dockHeadingText = txtLayer.get('#'+outputJson.CLSCData[newIndex].dockHeadingId);
				if(dockHeadingText.length > 0)
					canvasTextTool.deleteText(dockHeadingText[0]);
				cs.deleteSubGroups(labelGroup);
				labelGroup.remove();
				oldObject[newIndex]={'dockData' : outputJson.CLSCData[newIndex]};
				delete outputJson.CLSCData[newIndex];
				
				
			}
			//undoMng.register(this, CLSView.undoAllLabelDelete,[counter,oldObject] , 'Undo delete all labels');
//			for(var cnt = counter;cnt < parseInt(finalCounter);cnt++){
//				var newIndx = 'CLSC'+cnt;
//				
//			}
			
			
			cs.setActiveElement(cs.findGroup('frame_0'),'frame');
			cs.resetToolbar();
			ds.setOutputData();	
		},
		
		undoLabelDelete : function(labelData,labelId) {
			var ds = window.CD.services.ds;
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var lbConfig = new LabelConfig();			
			var labelCount = cs.objLength(CLSData.getJsonData());
			var labelGroupStartId = labelCount;
			for(var i=0;i<labelData.length;i++){
				var labelGrpId = labelData[i].labelGroupId;
				var counter = labelId[i].split('_')[1];
				
				window.CD.module.data.Json.CLSData['CLS'+labelGroupStartId] = labelData[i];	
				window.CD.module.data.Json.CLSData['CLS'+labelGroupStartId].labelGroupId = labelGrpId;
				var labelGroup = CLSView.createLabelObject(labelData[i],counter,lbConfig);
					
				CLSView.labelGroupAssignControl(labelGroup,labelData[i].class_set.split('|'));
				CLSData.reIndexLabels();
				cdLayer.draw();
				ds.setOutputData();
				
				/*add info text in label*/
				var param={
						labelGrpID  :labelGroup.attrs.id,
						labelGrpObj : labelGroup,
						labelData : '',
						infoHideText : labelData[i].infoHideText,
						infoHintText : labelData[i].hint_value,
						infoFeedbackText : labelData[i].feedback_value,
						showLabel : true
				}
				CLSView.createInfoTextObject(param);
				/*end here*/
				
				if(labelData[i].media_value != "N"){
					var audioGrpId = 'audio_' + labelGroup.attrs.id;
					var x = parseInt((labelData[i].play_option_value).split('|')[0]);
					var y = parseInt((labelData[i].play_option_value).split('|')[1]);
					loadAudioImage(labelGroup,audioGrpId,labelData[i].media_value,x,y);			
				}
				if(labelData[i].image_data != "N"){
					var imageGrpId = 'img_' + labelGroup.attrs.id;	
					if(labelData[i].image_data.split('|')[1] != undefined){
						loadImageforLabel(labelGroup,imageGrpId,labelData[i].image_data.split('|')[0]);
					}else{
						loadImageforLabel(labelGroup,imageGrpId,labelData[i].image_data);
					}
								
				}
				labelGroupStartId++;
			}
			CLSData.setValuesToCLSRN();//on delete update CLSRN else getting error in test mode
			ds.setOutputData();
		},
		
		deleteDock : function(active,obj) {
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var ds = window.CD.services.ds;
			var undoMng = window.CD.undoManager;
			var dckCount = cs.objLength(window.CD.module.data.Json.CLSCData);
			var redoDock = [];
			if(!obj){
				for(var k=0;k<active.element.length;k++){
					redoDock.push(active.element[k]);
				}
			}
			
			var activeElm1 = active;
			var activeElmIds = [];
			var activeElmArray = [];
			if(!obj){
				var activeElmLenght = active.element.length;
				for(var i=0; i<activeElmLenght;i++){
					var activeElm = activeElm1.element[i];
					var outputJson = window.CD.module.data.Json;
					var dockName = activeElm.children[0].attrs.name;
					cs.deleteSubGroups(activeElm);
					activeElm.remove();
					
					var dockIndex = CLSData.getCLSCIndex(activeElm.attrs.id);
					activeElmArray.push(outputJson.CLSCData[dockIndex]);
					activeElmIds.push(activeElm.attrs.id);
					var canvasTextTool=new TextTool.canvasText();
					var txtLayer = cs.getBgTextLayer();
					var dockHeadingText = txtLayer.get('#'+outputJson.CLSCData[dockIndex].dockHeadingId);
					if(dockHeadingText.length > 0)
						canvasTextTool.deleteText(dockHeadingText[0],'clsDockText');
					delete outputJson.CLSCData[dockIndex];
				}
			}else{
				for(var j=0; j<obj.length;j++){
					var activeElm = activeElm = cdLayer.get('#'+obj[j].attrs.id)[0];					
					var outputJson = window.CD.module.data.Json;
					var dockName = activeElm.children[0].attrs.name;
					cs.deleteSubGroups(activeElm);
					activeElm.remove();
					var dockIndex = CLSData.getCLSCIndex(activeElm.attrs.id);
					var canvasTextTool=new TextTool.canvasText();
					var txtLayer = cs.getBgTextLayer();
					var dockHeadingText = txtLayer.get('#'+outputJson.CLSCData[dockIndex].dockHeadingId);
					if(dockHeadingText.length > 0)
						canvasTextTool.deleteText(dockHeadingText[0],'clsDockText');
					delete outputJson.CLSCData[dockIndex];
				}
			}
			if(!obj){
				undoMng.register(this, CLSView.undoDockDelete,[activeElmArray,activeElmIds] , 'Undo Delete Dock',this, CLSView.deleteDock,['',redoDock] , 'Redo Delete Dock');	
				updateUndoRedoState(undoMng);
			}

			CLSData.reIndexDocks();
			CLSView.createAssignControl();
			CLSView.dockGroupReArrange();
			cs.setActiveElement(cs.findGroup('frame_0'),'frame');
			cs.resetToolbar();
			ds.setOutputData();	
		},
		undoDockDelete : function(dockData,dockIds) {
			var ds = window.CD.services.ds;
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();			
			var dockCount = cs.objLength(CLSData.getCLSCData());
			var dockGroupStartId = dockCount;
			for(var i=0;i<dockData.length;i++){
				
				dockId = parseInt(dockIds[i].split('_')[1]);
				var prevDockCounter = dockId;
				var dockGroup = CLSView.createDockObject(dockData[i],dockId);
				window.CD.module.data.Json.CLSCData['CLSC'+dockGroupStartId] = dockData[i];						
				CLSData.reIndexDocks();
				CLSView.createAssignControl();
				
				var canvasTextTool=new TextTool.canvasText();
				var dockHeadingId = canvasTextTool.createText('Add Name (Group '+ (prevDockCounter + 1) +')',dockData[i].xpos,(dockData[i].ypos-20),dockData[i].width+5,dockId);
				dockData[i].dockHeadingId = dockHeadingId;
				window.CD.module.data.Json.CLSCData['CLSC'+dockGroupStartId].dockHeadingId = dockHeadingId;
				
				
				cdLayer.draw();
				ds.setOutputData();
				if(dockData[i].media_value != "N"){
					var audioGrpId = 'audio_' + dockGroup.attrs.id;
					var x = parseInt((dockData[i].play_option_value).split('|')[0]);
					var y = parseInt((dockData[i].play_option_value).split('|')[1]);
					loadAudioImage(dockGroup,audioGrpId,dockData[i].media_value,x,y);			
				}
				dockGroupStartId++;
			}

			
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
			var dckCount = cs.objLength(window.CD.module.data.Json.CLSCData);
			var lblCount = cs.objLength(window.CD.module.data.Json.CLSData);
			/*if(oldActiveElm && cs.groupExists(oldActiveElm.attrs.id))
			oldActiveElm = cdLayer.get('#'+ oldActiveElm.attrs.id)[0];
			if(newActiveElm && cs.groupExists(newActiveElm.attrs.id))
			newActiveElm = cdLayer.get('#'+ newActiveElm.attrs.id)[0];*/
			var inspectorLabelData = CLSData.getInspectorLabelData();
			
			if(oldActiveElm && cs.groupExists(oldActiveElm.attrs.id) && oldActiveElm.attrs.id.match(/^label_[0-9]+/)&& cs.objLength(cs.findGroup(oldActiveElm.attrs.id).children) > 0) {
				var cls = CLSData.getCLSIndex(oldActiveElm.attrs.id);
				if(window.CD.module.data.Json.CLSData[cls] && window.CD.module.data.Json.CLSData[cls].transparent_border === 'F'){
					oldActiveElm.children[0].setStrokeWidth(1);
					oldActiveElm.children[0].setStroke('#999999');
				}else{
					oldActiveElm.children[0].setStrokeWidth(0);
					oldActiveElm.children[0].setStroke('transparent');
				}
			}else if(oldActiveElm && cs.groupExists(oldActiveElm.attrs.id) && oldActiveElm.attrs.id.match(/^dock_[0-9]+/) && cs.objLength(cs.findGroup(oldActiveElm.attrs.id).children) > 0) {		
				var cls = CLSData.getCLSCIndex(oldActiveElm.attrs.id);
				if(window.CD.module.data.Json.CLSCData[cls] && window.CD.module.data.Json.CLSCData[cls].transparent_border === 'F'){
					oldActiveElm.children[0].setStrokeWidth(1);
					oldActiveElm.children[0].setStroke('#999999');	
					oldActiveElm.children[0].disableDashArray();
				}else{
					oldActiveElm.children[0].setStrokeWidth(1);
					oldActiveElm.children[0].setStroke('#999999');
					oldActiveElm.children[0].enableDashArray();
					oldActiveElm.children[0].setDashArray([10,5]);
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
			}else if(oldActiveElm && cs.groupExists(oldActiveElm.attrs.id) && oldActiveElm.attrs.id.match(/^img_label_[0-9]+/)) {			
				oldActiveElm.children[0].setStrokeWidth(1);
				oldActiveElm.children[0].setStroke('#999999');			
			}
			
			
			if(newActiveElm && newActiveElm.attrs.id.match(/^label_[0-9]+/)) {
				inspectorApplyStatus = true;
				var cls = CLSData.getCLSIndex(newActiveElm.attrs.id);		
				inspectorLabelData.distractor = window.CD.module.data.Json.CLSData[cls].distractor;
				CLSView.activelabelData(inspectorLabelData,newActiveElm);
				CLSView.populateLabelData(inspectorApplyStatus,inspectorLabelData);				
				newActiveElm.children[0].attrs.strokeEnabled=true;
				newActiveElm.children[0].setStrokeWidth(2);
				newActiveElm.children[0].setStroke('#1086D9');
				$('#localDivInactive').remove();
			}else if(newActiveElm && newActiveElm.attrs.id.match(/^dock_[0-9]+/)) {
				inspectorApplyStatus = true;
				CLSView.activeDockData(inspectorLabelData,newActiveElm);
				var clsNewId = CLSData.getCLSCIndex(newActiveElm.attrs.id);
				if(window.CD.module.data.Json.CLSCData[clsNewId] && window.CD.module.data.Json.CLSCData[clsNewId].transparent_border === 'F'){
					newActiveElm.children[0].setStrokeWidth(2);
					newActiveElm.children[0].setStroke('#1086D9');	
					newActiveElm.children[0].disableDashArray();
				}else{
					if(window.CD.module.data.Json.CLSCData[clsNewId] && window.CD.module.data.Json.CLSCData[clsNewId].transparent_border === 'T'){
						newActiveElm.children[0].setStrokeWidth(2);
						newActiveElm.children[0].setStroke('#1086D9');
						newActiveElm.children[0].enableDashArray();
						newActiveElm.children[0].setDashArray([10,5]);
					}
				}
				/*newActiveElm.children[0].setStrokeWidth(2);
				newActiveElm.children[0].setStroke('#1086D9');*/
				CLSView.populateLabelData(inspectorApplyStatus,inspectorLabelData);
				$('#localDivInactive').remove();
				
			}else if(newActiveElm && newActiveElm.attrs.id.match(/^audio_label_[0-9]+/)) {
				$("#deleteElement").removeClass('inactive_del').addClass('active');
				inspectorApplyStatus = true;
				this.activelabelData(inspectorLabelData,newActiveElm.parent);
				PRGView.populateLabelData(inspectorApplyStatus,inspectorLabelData);
				newActiveElm.children[0].setStrokeWidth(2);
				newActiveElm.children[0].setStroke('#1086D9');
			}else if(newActiveElm && newActiveElm.attrs.id.match(/^audio_dock_label_[0-9]+/)) {	
				$("#deleteElement").removeClass('inactive_del').addClass('active');
				inspectorApplyStatus = true;
				var parentGrp = cs.findGroup(newActiveElm.parent.attrs.id.split('dock_')[1]);
				if(parentGrp){
					this.activelabelData(inspectorLabelData,parentGrp);
					PRGView.populateLabelData(inspectorApplyStatus,inspectorLabelData);
				}
				newActiveElm.children[0].setStrokeWidth(2);
				newActiveElm.children[0].setStroke('#1086D9');
			}else if(newActiveElm && newActiveElm.attrs.id.match(/^audio_frame_[0-9]+/)) {	
				$("#deleteElement").removeClass('inactive_del').addClass('active');
				inspectorApplyStatus = true;
				newActiveElm.children[0].setStrokeWidth(2);
				newActiveElm.children[0].setStroke('#1086D9');
			}else if(newActiveElm && newActiveElm.attrs.id.match(/^audio_[0-9]+/)) {
				$("#deleteElement").removeClass('inactive_del').addClass('active');
				inspectorApplyStatus = true;
				newActiveElm.children[0].setStrokeWidth(2);
				newActiveElm.children[0].setStroke('#1086D9');
			}else if(newActiveElm && newActiveElm.attrs.id.match(/^img_label_[0-9]+/)) {	
				inspectorApplyStatus = true;
				newActiveElm.children[0].setStrokeWidth(2);
				newActiveElm.children[0].setStroke('#1086D9');
			}else{
				if($('#localDivInactive').length == 0 && ($('#localDiv').width()!=0 || $('#localDiv').height()!=0)){
					CLSView.makeLabelLocalDisable();
				}
				inspectorApplyStatus = false;
			}
			
			cdLayer.draw();
			
			CLSView.populateLabelData(inspectorApplyStatus);
			
		},
		removeLabels : function() {
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var canvasTxtLayer = cs.getBgTextLayer();
			var ds = window.CD.services.ds;
			var  outputJson = window.CD.module.data.Json;
			
			var labelData  = window.CD.module.data.Json.CLSData;
			var dockData = window.CD.module.data.Json.CLSCData;
			var labelCount = cs.objLength(labelData);
			var canvasTextTool=new TextTool.canvasText();
			var txtLayer = cs.getBgTextLayer();
			
			$.each(dockData, function(key, dock){	
				var dockGroup = cs.findGroup(dock.dockGroupId);
				/*var obj = {};
				obj.element = dockGroup;
				CLSView.deleteDock(obj);
				*/
				var dockIndex = CLSData.getCLSCIndex(dockGroup.attrs.id);				
				var dockHeadingText = txtLayer.get('#'+outputJson.CLSCData[dockIndex].dockHeadingId);
				if(dockHeadingText.length > 0)
					canvasTextTool.deleteText(dockHeadingText[0]);

				cs.deleteSubGroups(dockGroup);
				dockGroup.remove();
			});
			
			$.each(labelData, function(key, label){		
				var labelGroup = cs.findGroup(label.labelGroupId);
				cs.deleteSubGroups(labelGroup);
				labelGroup.remove();
			});
			//canvasTxtLayer.removeChildren()
			//canvasTxtLayer.draw();
			outputJson.CLSData = {};
			outputJson.CLSCData = {};

			cs.setActiveElement(cs.findGroup('frame_0'),'frame');
			cs.resetToolbar();
			ds.setOutputData();	
		},
		
		activelabelData : function(inspectorLabelData,group) {
			var adminData = CLSData.getJsonAdminData();
			var cls = CLSData.getLabelIndex(group.attrs.id);
			var clsData = CLSData.getJsonData();
			var clsDockData = CLSData.getCLSCData();
			var width = adminData.SLELD.split(',')[0];
			var height = adminData.SLELD.split(',')[1];
			var ZHPHintFdbck = CLSData.getHintFeedbackFromJson();
			var jsonData = window.CD.module.data.Json;
			if(jsonData.CLSGP.borderGlobal == 'F' && jsonData.CLSGP.backGroundGlobal == 'F'){
				inspectorLabelData.fillBorderDrop = true;
			}else{
				if(jsonData.CLSGP.borderGlobal == 'T' && jsonData.CLSGP.backGroundGlobal == 'T'){
					inspectorLabelData.fillBorderDrop = false;
				}
			}
			
			if(jsonData.CLSGP.toggleSPGlobal == 'F'){
				inspectorLabelData.snapToDock = true;
			}else{
				if(jsonData.CLSGP.toggleSPGlobal == 'T'){
					inspectorLabelData.snapToDock = false;
				}
			}
			
			inspectorLabelData.labelHeight = height;
			inspectorLabelData.labelWidth = width;	
			inspectorLabelData.fillEnabled = clsData[cls].transparent;
			inspectorLabelData.strokeEnabled = clsData[cls].transparent_border;
			
			inspectorLabelData.hintWidth = ZHPHintFdbck.hintW;
			inspectorLabelData.hintHeight= ZHPHintFdbck.hintH;
			
			inspectorLabelData.feedbackWidth = ZHPHintFdbck.feedbackW;
			inspectorLabelData.feedbackHeight= ZHPHintFdbck.feedbackH;
			
			inspectorLabelData.infoHideText = clsData[cls].infoHideText;
			inspectorLabelData.hintLabelOrDock = adminData.HRO;
			inspectorLabelData.feedbackLabelOrDock = adminData.FRO;
			inspectorLabelData.showHintOrFeedbackInAuthoring = adminData.showHintOrFeedbackInAuthoring;
			inspectorLabelData.distractor = clsData[cls].distractor;
			inspectorLabelData.hideTextLoc = clsData[cls].infoHideText;
			
		},
		activeDockData : function(inspectorLabelData,group){
			var clsCount = CLSData.getCLSCIndex(group.attrs.id);
			var adminData = CLSData.getJsonAdminData();
			var clsData = CLSData.getJsonData();
			var clsDockData = CLSData.getCLSCData();
			var ZHPHintFdbck = CLSData.getHintFeedbackFromJson();
			var clsBasicData =  CLSData.getGlobalDockValue();
			if(clsBasicData){
				var dockOrigHeight = parseInt(CLSData.dockOrigHeight);
				var dockOrigWidth = parseInt(CLSData.dockOrigWidth);
				//inspectorLabelData.dockHeightGlob =dockOrigHeight;
				//inspectorLabelData.dockWidthGlob = dockOrigWidth;
			}
			var jsonData = window.CD.module.data.Json;
			if(jsonData.CLSGP.borderGlobal == 'T' && jsonData.CLSGP.backGroundGlobal == 'T'){
				inspectorLabelData.fillBorderDrop = false;
			}else{
				if(jsonData.CLSGP.borderGlobal == 'F' && jsonData.CLSGP.backGroundGlobal == 'F'){
					inspectorLabelData.fillBorderDrop = true;
				}
			}
			
			if(jsonData.CLSGP.toggleSPGlobal == 'F'){
				inspectorLabelData.snapToDock = true;
			}else{
				if(jsonData.CLSGP.toggleSPGlobal == 'T'){
					inspectorLabelData.snapToDock = false;
				}
			}
			inspectorLabelData.dockHeight = clsDockData[clsCount].height;
			inspectorLabelData.dockWidth = clsDockData[clsCount].width;	
			
			inspectorLabelData.transparency = clsDockData['CLSC0'].transparent;
			inspectorLabelData.strokeDock = clsDockData['CLSC0'].transparent_border;
			
			inspectorLabelData.hintWidth = ZHPHintFdbck.hintW;
			inspectorLabelData.hintHeight= ZHPHintFdbck.hintH;
			
			inspectorLabelData.feedbackWidth = ZHPHintFdbck.feedbackW;
			inspectorLabelData.feedbackHeight= ZHPHintFdbck.feedbackH;
			
			inspectorLabelData.hintLabelOrDock = adminData.HRO;
			inspectorLabelData.feedbackLabelOrDock = adminData.FRO;
			inspectorLabelData.showHintOrFeedbackInAuthoring = adminData.showHintOrFeedbackInAuthoring;
		},	
		
		isInClassSet : function(classSet,name){
			var classSetLen = classSet.length;
			for(var i=0; i<classSetLen; i++){
				if(classSet[i] === name)
					return true;
			}
			return false;
		},
		updateDockDimension : function(group,width,height) {
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			var dockdata = CLSData.getCLSCData();
			var adminData = CLSData.getJsonAdminData();
			var clscIndex = CLSData.getCLSCIndex(group.attrs.id);			
			var dockGroupID = group.attrs.id;
			var dock = group.children[0];
			
			CLSView.labelDockDimensionChange(group,height,width);
			
			dockdata[clscIndex].width = width;
			dockdata[clscIndex].height = height;
			cdLayer.draw();
			ds.setOutputData();
		},
		/**
		 * This is used to change dimension of label on undo click
		 */
		updateLabelDimension : function(width,height) {
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			var outputJSon = CLSData.getJsonData();
			var adminData = CLSData.getJsonAdminData();
			
			for(var clsCount in outputJSon){
				var labelGroupID = outputJSon[clsCount].labelGroupId;
				var labelGroupLbl = cs.findGroup(labelGroupID);
				CLSView.labelDockDimensionChange(labelGroupLbl,height,width);
				CLSView.updateLabelContent(labelGroupLbl);
			}
			adminData.SLELD = width+','+height;
			cdLayer.draw();
			ds.setOutputData();
		},
		
		updateAllLabelDimension : function(clsModifiedData) {
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			var outputJSon = CLSData.getJsonData();
			var adminData = CLSData.getJsonAdminData();
			
			for(var clsCount in outputJSon){
				var labelGroupID = outputJSon[clsCount].labelGroupId;
				var labelGroupLbl = cs.findGroup(labelGroupID);
				var label = labelGroupLbl.children[0];
				
				var calcY = clsModifiedData.height-20;
				/* for height/width change of label or dock */
				CLSView.labelDockDimensionChange(labelGroupLbl, clsModifiedData.height, clsModifiedData.width)
				adminData.SLELD = clsModifiedData.width+','+clsModifiedData.height;
				
				//For label assign control
				if(outputJSon[clsCount].distractor=="F"){
					var assignControlGroup = labelGroupLbl.get('#selObjGrp_'+labelGroupID)[0];
					if(assignControlGroup) {
						assignControlGroup.setX(label.getX() + 5);
						assignControlGroup.setY(label.getHeight() - 12);
					}
				}
				
			
				/* ---------- for label fill ----------- */
				
				/* --- for check box fill checked or not for label-----*/
				if(clsModifiedData.fill && outputJSon[clsCount].distractor=="F") {
					var lbConfig = new LabelConfig();
					var fillColor = lbConfig.style.fill;
					label.setFill(fillColor);
					//dock.setFill('#ffffff');
					outputJSon[clsCount].transparent = 'F';
					
				}else{
					if(outputJSon[clsCount].distractor=="F"){
						label.setFill('transparent');
						outputJSon[clsCount].transparent = 'T';
					}
				}
				/* --- for check box fill checked or not for distractor-----*/
				if(clsModifiedData.fill && outputJSon[clsCount].distractor=="T") {
					label.setFill('#faf8dd');
					outputJSon[clsCount].transparent = 'F';
					
				}else{
					if(outputJSon[clsCount].distractor=="T"){
						label.setFill('transparent');
						outputJSon[clsCount].transparent = 'T';
					}
				}
				
				/* --- for check box border checked or not of label -----*/
				
				if(clsModifiedData.stroke) {
					label.setStrokeEnabled(true);
					label.setStroke('#999999');
					label.setStrokeWidth(1);
					outputJSon[clsCount].transparent_border = 'F';
					
				} else {
					label.setStroke('transparent');
					outputJSon[clsCount].transparent_border = 'T';
				}
				
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
					
				var hiddenTextBox = outputJSon[clsCount].infoHideText;
				if(hiddenTextBox == 'T' && infoTextTObj){
					CLSView.updateLabelContent(labelGroupLbl,calcY,infoTextTObj);
				}else{
					CLSView.updateLabelContent(labelGroupLbl,calcY);
				}
			}
			var activeElement = window.CD.elements.active.element[0];
			//activeElement.children[0].setStrokeWidth(2);
			//activeElement.children[0].setStroke('#1086D9');
			cdLayer.draw();
			
			
		},
		resizeObject : function(labelGroup,sleld) {
			
		},
		
		updateDimention : function(clsModifiedData,callFromUndoRedo,dataJson){
			console.log("@updateDimention :: CLSView");
			var undoMng = window.CD.undoManager;
			var oldData = CLSData.getOldLabelDockData();
			
			if(!dataJson){
				dataJson = clsModifiedData;
			}
			if(window.CD.elements.active.type == 'label' || window.CD.elements.active.type == 'dock') {			
				var cs = window.CD.services.cs;
				var ds = window.CD.services.ds;
				
				var activeElement = window.CD.elements.active.element[0];
				
				
				var cdLayer = cs.getLayer();
				var frameGroup = cs.findGroup('frame_0');
				var stg = cs.getCanvas();
				var outputJSon = CLSData.getJsonData();
				var adminData = CLSData.getJsonAdminData();
				
				var dockJson = CLSData.getCLSCData();
				var dockCount = cs.objLength(dockJson);
				
				/** -------- For sloppy -------- **/
				window.CD.module.view.toggleSloppy(clsModifiedData.sloppy);
				if(clsModifiedData.fillBorderDrop){
					window.CD.module.data.Json.CLSGP.borderGlobal = 'F';
					window.CD.module.data.Json.CLSGP.backGroundGlobal = 'F';
				}else{
					window.CD.module.data.Json.CLSGP.borderGlobal = 'T';
					window.CD.module.data.Json.CLSGP.backGroundGlobal = 'T';
				}
				/* ----------- for label update ---------- */
				if(window.CD.elements.active.type == 'label') {	
					for(var clsCount in outputJSon){
						var labelGroupID = outputJSon[clsCount].labelGroupId;
						var labelGroupLbl = cs.findGroup(labelGroupID);
						var label = labelGroupLbl.children[0];
						
						var calcY = clsModifiedData.height-20;
						
						/* -- Data populate for undo label -- */
						oldData.width = adminData.SLELD.split(',')[0];
						oldData.height = adminData.SLELD.split(',')[1];
						
						oldData.fill = CLSData.fillAndBorderEnable(outputJSon[clsCount].transparent);
						oldData.stroke = CLSData.fillAndBorderEnable(outputJSon[clsCount].transparent_border);
						
						oldData.distractor = outputJSon[clsCount].distractor;
						
						/* -- Data populate for undo hint/feedback -- */
						oldData.hintOrFeedback = adminData.showHintOrFeedbackInAuthoring;
						var zhp = CLSData.getHintFeedbackFromJson();
						oldData.hintWidth = zhp.hintW;
						oldData.hintHeight = zhp.hintH;
						oldData.feedbackWidth = zhp.feedbackW;
						oldData.feedbackHeight = zhp.feedbackH;
						oldData.placeHolderX = zhp.x;
						oldData.placeHolderY = zhp.y;
						
						if(dataJson.width != undefined || dataJson.height != undefined){
							/* for height/width change of label or dock */
							CLSView.labelDockDimensionChange(labelGroupLbl, clsModifiedData.height, clsModifiedData.width)
							
							//For label assign control
							if(outputJSon[clsCount].distractor=="F"){
								var assignControlGroup = labelGroupLbl.get('#selObjGrp_'+labelGroupID)[0];
								if(assignControlGroup) {
									assignControlGroup.setX(label.getX() + 5);
									assignControlGroup.setY(label.getHeight() - 12);
								}
							}
							CLSView.updateLabelContent(labelGroupLbl,calcY);
						}			
											
						
						/* ---------- for label fill ----------- */
						if(dataJson.fill != undefined){
							/* --- for check box fill checked or not for label-----*/
							/** --- Updated for version 2000 BECB conversion --- **/
							var lbConfig = new LabelConfig();
							var fillColor = lbConfig.style.fill;
							if(clsModifiedData.fill && outputJSon[clsCount].distractor=="F") {
								label.setFill(fillColor);
								outputJSon[clsCount].transparent = 'F';
							}else{
								if(outputJSon[clsCount].distractor=="F"){
									label.setFill('transparent');
									outputJSon[clsCount].transparent = 'T';
								}
							}
							/* --- for check box fill checked or not for distractor-----*/
							if(clsModifiedData.fill && outputJSon[clsCount].distractor=="T") {
								label.setFill('#faf8dd');
								outputJSon[clsCount].transparent = 'F';
								
							}else{
								if(outputJSon[clsCount].distractor=="T"){
									//QC#4033 distractor should not be transparent in authoring so next line is commented
									//label.setFill('transparent');
									outputJSon[clsCount].transparent = 'T';
								}
							}
						}
						
					
					/* --- for check box border checked or not of label -----*/
					if(dataJson.stroke != undefined){
						if(clsModifiedData.stroke) {
							label.setStrokeEnabled(true);
							label.setStroke('#999999');
							label.setStrokeWidth(1);
							outputJSon[clsCount].transparent_border = 'F';
							
						} else {
							label.setStroke('transparent');
							outputJSon[clsCount].transparent_border = 'T';
						}
					}
					
					
					/* -------------  for hint/feedback ----------------- */
					if(dataJson.hintOrFeedback == 'hint' || dataJson.hintOrFeedback == 'feedback' || (dataJson.hintWidth != undefined || dataJson.hintHeight != undefined)){
						if(clsModifiedData.hintOrFeedback == 'hint' || clsModifiedData.hintOrFeedback == 'feedback'){
							CLSView.destroyHint();
							CLSView.makeHintFeedbackPlaceHolder(clsModifiedData.hintOrFeedback,clsModifiedData.hintWidth,clsModifiedData.hintHeight,clsModifiedData.feedbackWidth,clsModifiedData.feedbackHeight,clsCount);
						}else{
							if(clsModifiedData.hintOrFeedback == 'none'){
								labelGroupLbl.off('mouseover');
								labelGroupLbl.off('mouseout');
								CLSView.removeAuthHinBox();
							}
						}
						
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
							
						var hiddenTextBox = outputJSon[clsCount].infoHideText;
						if(hiddenTextBox == 'T' && infoTextTObj){
							CLSView.updateLabelContent(labelGroupLbl,calcY,infoTextTObj);
						}else{
							CLSView.updateLabelContent(labelGroupLbl,calcY);
						}
					}
					
				}
				adminData.SLELD = clsModifiedData.width+','+clsModifiedData.height;
				adminData.showHintOrFeedbackInAuthoring = clsModifiedData.hintOrFeedback;
				if(dataJson.hintOrFeedback == 'hint' || dataJson.hintOrFeedback == 'feedback'){
					CLSData.setHintFdbckToJson(clsModifiedData.hintWidth,clsModifiedData.hintHeight);
					CLSData.setFeedbackValuesToJson(clsModifiedData.feedbackWidth,clsModifiedData.feedbackHeight);
				}				
				
				var labelGroup = cs.findGroup(activeElement.attrs.id);
				var labelData = CLSData.getInspectorLabelData();
				CLSView.activelabelData(labelData,labelGroup);
				CLSView.populateLabelData(true,labelData);
			}
				
				var onClickShowHiddenTxtGlobalData = window.CD.module.view.onClickShowHiddenTxtGlobal();
				if(onClickShowHiddenTxtGlobalData){
					var showHiddenTxtDataPrevious = onClickShowHiddenTxtGlobalData[0];
					var showHiddenTxtDataPresent = onClickShowHiddenTxtGlobalData[1];
				}
			
			
			if(window.CD.elements.active.type == 'dock') {	
				
				var dockOrigHeight = parseInt(CLSData.dockOrigHeight);
				var dockOrigWidth = parseInt(CLSData.dockOrigWidth);
				/* ----------- For dock update --------- */
				for(var count = 0;count<dockCount;count++){
					var dockCnt = 'CLSC'+count;
					
					/** This is done as dockGroupId and dockCnt are not same when any dock 
					 * is being deleted randomly and another dock is added **/
					
					var dockName = CLSData.Json.CLSCData[dockCnt].dockGroupId;
					var dockGroup = cs.findGroup(dockName);
					var dock = dockGroup.children[0];
					var grpId = dockGroup.attrs.id;
					
					/* -- Data populate for undo dock -- */
					oldData.dockWidth = dockJson[dockCnt].width;
					oldData.dockHeight = dockJson[dockCnt].height;
					
					oldData.transpType = dockJson[dockCnt].transparent;
					oldData.strokeDock = CLSData.fillAndBorderEnable(dockJson[dockCnt].transparent_border);
					
					if(dataJson.dockHeight != undefined || dataJson.dockWidth != undefined){
						if((dockOrigHeight != parseInt(dataJson.dockHeight))||(dockOrigWidth != parseInt(dataJson.dockWidth))){
							CLSView.labelDockDimensionChange(dockGroup,clsModifiedData.dockHeight,clsModifiedData.dockWidth);
							dockJson[dockCnt].height = clsModifiedData.dockHeight;
							dockJson[dockCnt].width = clsModifiedData.dockWidth;
						}
					}
					
					//CLSView.labelDockDimensionChange(dockGroup,clsModifiedData.dockHeight,clsModifiedData.dockWidth);
					
					/* --- for dock only, radio button for transparancy -----*/
					if(dataJson.transpType != undefined){
						if(clsModifiedData.transpType ==='solid'){
							dock.setFill('#ffffff');
							dock.setOpacity(1);
							dockJson[dockCnt].transparent = 'solid';
							
						}else if(clsModifiedData.transpType ==='semitransparent'){
							dock.setFill('#ffffff');
							dock.setOpacity(0.5);
							dockJson[dockCnt].transparent = 'semitransparent';
						}else{
							dock.setFill('transparent');
							dock.setStroke('#999999');
							dockJson[dockCnt].transparent = 'transparent';
						}
					}
					
					
					/* --- for check box border checked or not of dock -----*/
					if(dataJson.strokeDock != undefined){
						if(clsModifiedData.strokeDock) {
							dock.setStroke('#999999');
							dock.disableDashArray();
							dockJson[dockCnt].transparent_border = 'F';
							
						}else{
							dock.setStroke('#999999');
							dock.enableDashArray();
							dock.setDashArray([10,5]);
							dockJson[dockCnt].transparent_border = 'T';
							
						}
					}
					
				}
				
				CLSData.dockOrigWidth = clsModifiedData.dockWidth;
				CLSData.dockOrigHeight = clsModifiedData.dockHeight;
				
				var dockGroup = cs.findGroup(activeElement.attrs.id);
				var labelData = CLSData.getInspectorLabelData();
				CLSView.activeDockData(labelData,dockGroup);
				CLSView.populateLabelData(true,labelData);
			}
			
			if(window.CD.elements.active.type == 'label'){
				var group = labelGroupLbl;
			}
			else if(window.CD.elements.active.type == 'dock'){
				var group = dockGroup;
			}
			if(clsModifiedData.hideTextGlobal != undefined){
				CLSData.globalHideText = clsModifiedData.hideTextGlobal;
				if(clsModifiedData.hideTextGlobal == true){
					var hideLabels=[];
					for(key in window.CD.module.data.Json.CLSData){
						hideLabels.push(window.CD.module.data.Json.CLSData[key].labelGroupId);
					}
					var sleTextTool= new TextTool.commonLabelText();
					sleTextTool.onClickHideGlobalLabelText(hideLabels,'checked');
					oldData.hideTextGlobal = false;
				}else if((clsModifiedData.hideTextGlobal == false)){
					var sleTextTool= new TextTool.commonLabelText();
					var unHideLabels=[];
					for(key in window.CD.module.data.Json.CLSData){
						unHideLabels.push(window.CD.module.data.Json.CLSData[key].labelGroupId);
					}
					sleTextTool.onClickHideGlobalLabelText(unHideLabels,'unchecked');
					oldData.hideTextGlobal = true;
				}
			}
			
			if(onClickShowHiddenTxtGlobalData && onClickShowHiddenTxtGlobalData.length>1){
				if(!callFromUndoRedo){
					undoMng.register(this, CLSView.undoUpdateDimension,[oldData,group,window.CD.elements.active.type,showHiddenTxtDataPrevious] , 'undo update dimension',this, CLSView.undoUpdateDimension,[clsModifiedData,group,window.CD.elements.active.type,showHiddenTxtDataPrevious] , 'redo update dimension');
					updateUndoRedoState(undoMng);
				}
			}else{
				if(!callFromUndoRedo){
					undoMng.register(this, CLSView.undoUpdateDimension,[oldData,group,window.CD.elements.active.type] , 'undo update dimension',this, CLSView.undoUpdateDimension,[clsModifiedData,group,window.CD.elements.active.type] , 'redo update dimension');
					updateUndoRedoState(undoMng);
				}
			}
						
			ds.setOutputData();
			activeElement.children[0].setStrokeWidth(2);
			activeElement.children[0].setStroke('#1086D9');
			oldData.hideTextGlobal = '';	
			cdLayer.draw();
			
			CLSView.applyPopulate();
		}
	},
	/**
	 * This is used for undo update dimension and also to bind 
	 * hint and feedback events on undo/redo
	 * By Nabonita Bhattacharyya
	 */
	undoUpdateDimension : function(oldData,group,labelOrDock,onClickShowHiddenTxtGlobalData){
		console.log("@undoUpdateDimension :: CLSView");
		var cs = window.CD.services.cs;
		var group = cs.findGroup(group.getId());
		if(labelOrDock == 'label'){
			cs.setActiveElement(group,'label');
		}
		if(labelOrDock == 'dock'){
			cs.setActiveElement(group,'dock');
		}
		if(onClickShowHiddenTxtGlobalData){
			CLSView.onClickShowHiddenTxtGlobal(onClickShowHiddenTxtGlobalData);
		}
		
		var undoData = {};
		var undoData = CLSData.populateLabelDockData(undoData);
		var dataJson = {};
		dataJson = CLSData.getChangedJson(undoData,oldData,dataJson);
		
		CLSView.updateDimention(oldData,true,dataJson);
		window.CD.module.view.bindFeedbackHintEventAllLabel($('input[name=hintFeedback]:checked').val(),$('input[name=hoverHint]:checked').val(),$('input[name=feedbackType]:checked').val());
		window.CD.module.view.bindFeedbackHintEvent($('input[name=hintFeedback]:checked').val(),$('input[name=hoverHint]:checked').val(),$('input[name=feedbackType]:checked').val());
		
	},
		/*
		 * This is used for making hint/feedback placeholder
		 * By Nabonita Bhattacharyya
		 */
	

		makeHintFeedbackPlaceHolder : function(hintOrFeedback, hintWidth,
			hintHeight, feedbackWidth, feedbackHeight, clsCount) {
			console.log("@makeHintFeedbackPlaceHolder :: CLSView");
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			var frameGroup = cs.findGroup('frame_0');
			var outputJSon = CLSData.getJsonData();
			var adminData = CLSData.getJsonAdminData();
			var hintGroup = cs.findObject(frameGroup,'authHintGrp')
			
			var hintFeedbackParam = CLSData.getHintFeedbackFromJson();
			var plcHoldrX = hintFeedbackParam.x;
			var plcHoldrY = hintFeedbackParam.y;
			
			CLSData.setHintFdbckToJson('','',plcHoldrX,plcHoldrY);

			var stg=window.CD.services.cs.getCanvas();
			if(hintOrFeedback == 'hint'){
				
				CLSView.removeAuthHinBox();
				
				
				var canvasEndX=stg.getX()+stg.getWidth()-17;
				var boxEndX=plcHoldrX+parseInt(hintWidth);
				if(boxEndX >=canvasEndX){
					plcHoldrX=canvasEndX-parseInt(hintWidth)-10;	
				}
				var canvasEndY=stg.getY()+stg.getHeight()-15;
				var boxEndY=plcHoldrY+parseInt(hintHeight);
				if(boxEndY >=canvasEndY){
					plcHoldrY=canvasEndY-parseInt(hintHeight)-10;	
				}
				CLSView.createHintGroupAuth(hintWidth,hintHeight,plcHoldrX,plcHoldrY);
				CLSData.setHintFdbckToJson(hintWidth,hintHeight,plcHoldrX,plcHoldrY);
				
			}else if(hintOrFeedback == 'feedback'){
				CLSView.removeAuthHinBox();
				
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
				
				CLSView.createHintGroupAuth(feedbackWidth,feedbackHeight,plcHoldrX,plcHoldrY);
				CLSData.setHintFdbckToJson('','',plcHoldrX,plcHoldrY);
			}
		if (hintOrFeedback == 'hint') {
			adminData.HRO = 'L';
		}
		if (hintOrFeedback == 'feedback') {
			adminData.FRO = 'L';
		}
		ds.setOutputData();
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
		 * This method is used for making new hint group
		 * without hint text
		 */
		createHintGroupAuth : function(width,height,x,y){
			var activeElement = window.CD.elements.active.element[0];
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var frameGroup = cs.findGroup('frame_0');
			
			var adminData = window.CD.module.data.Json.adminData;
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
		        fill: '#cccccc',
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
			cdLayer.add(hintGroupAuth);
			//frameGroup.add(hintGroupAuth);
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
			var outputJSon = window.CD.module.data.Json.CLSData;
			cdLayer.draw();
			hintGroupAuth.on('mousedown',function(evt){	
				openInspector('label');
			});
			hintGroupAuth.on('click',function(evt){
				evt.cancelBubble = true;
			});
			hintGroupAuth.on('dragend',function(evt){
				var undoMng = window.CD.undoManager;
				
				var zhp = CLSData.getHintFeedbackFromJson();
				var newVal = {};
				newVal.x = this.getX();
				newVal.y = this.getY();
				undoMng.register(this, CLSView.updatePlaceHolderPosition,[zhp,hintGroupAuth] , 'undo hint group position update',this, CLSView.updatePlaceHolderPosition,[newVal,hintGroupAuth] , 'redo hint group position update');
				updateUndoRedoState(undoMng);
				evt.cancelBubble = true;
				var ds = window.CD.services.ds;
				var activeElement = window.CD.elements.active.element[0];
				
				var outputJSon = window.CD.module.data.Json.CLSData;
				
				CLSData.setHintFdbckToJson('','',this.getX(),this.getY());
				
				ds.setOutputData();	
			});
		},
		/*
		 * This is used to set height and width of label/dock
		 * By Nabonita Bhattacharyya
		 */
		labelDockDimensionChange : function(group,height,width){
			var ds = window.CD.services.ds;
			var child = group.children[0];
			var groupId = group.attrs.id;
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var calcX = width-20;
			var calcY = height-20;
			var unlockIconLbl = group.get('.unlockicon_'+groupId)[0];
			var lockIconLbl = group.get('.lockicon_'+groupId)[0];				
			var dockName = group.get('#dockName_'+groupId)[0];
			var topLeft = group.get('.topLeft_'+groupId)[0];
			var topRight = group.get('.topRight_'+groupId)[0];
			var bottomLeft = group.get('.bottomLeft_'+groupId)[0];
			var bottomRight = group.get('.bottomRight_'+groupId)[0];
			var selectGrpObj = group.get('#selObjGrp_'+groupId)[0];
			if(selectGrpObj){
				selectGrpObj.setX(5);
				selectGrpObj.setY(height-12);
			}
			unlockIconLbl.setX(calcX);
			lockIconLbl.setX(calcX);
			unlockIconLbl.setY(calcY);
			lockIconLbl.setY(calcY);
			
			topLeft.setX(0);
			topLeft.setY(0);
			topRight.setX(width);
			topRight.setY(0);
			bottomLeft.setX(0);
			bottomLeft.setY(height);
			bottomRight.setX(width);
			bottomRight.setY(height);
			if(dockName){
				dockName.setX(10);
				dockName.setY(calcY);
			}
			child.setSize(parseInt(width), parseInt(height));
			if(dockName){
				var clsc = CLSData.getCLSCIndex(group.attrs.id);
				var hX=window.CD.module.data.Json.CLSCData[clsc].xpos;
				var hY=window.CD.module.data.Json.CLSCData[clsc].ypos;
				var dockId=group.getId();
				var dockHeadingId = window.CD.module.data.Json.CLSCData[clsc].dockHeadingId;
				var dockTxtGrp = group.parent.parent.get('#'+dockHeadingId)[0];
				var dockWith = group.children[0].getWidth();
				if(dockTxtGrp){
					var docktextWidth = dockTxtGrp.children[0].getWidth();
					dockTxtGrp.setX(group.getX() - ((docktextWidth - dockWith)/2));
					dockTxtGrp.setY(group.getY()-parseInt(dockTxtGrp.children[0].getHeight()));
					var canvasTextTool=new TextTool.canvasText();
					canvasTextTool.setClsTextListData(dockTxtGrp);
					
					var parentLayer=dockTxtGrp.getLayer();
					if(parentLayer && parentLayer.attrs.id==="text_layer"){
					  	   parentLayer.draw();
					}
				}
				window.CD.module.data.Json.CLSCData[clsc].xpos = group.getX();
				window.CD.module.data.Json.CLSCData[clsc].ypos = group.getY();
				cdLayer.draw();
			}
				
			ds.setOutputData();	
		},
		
		/*
		 * this method is used to update CLSData for hint and feedback
		 * textarea on focus out
		 * It is being called from stage.js
		 * By Nabonita Bhattacharyya on 07th May, 2013
		 */
		updateHintFeedbackVal : function(hintValue,feedbackValue){
			var activeElm = window.CD.elements.active.element[0];
			if(activeElm.attrs.id.match(/^label_[0-9]+/)){
				var cls = CLSData.getLabelIndex(activeElm.attrs.id);
			}
			var ds = window.CD.services.ds;
			try{
				if(cls){
					if(hintValue!=null && hintValue!=""){
						window.CD.module.data.Json.CLSData[cls].hint_value = hintValue;
					}else{
						window.CD.module.data.Json.CLSData[cls].hint_value='';
					}
					
					if(feedbackValue!=null && feedbackValue!=""){
						window.CD.module.data.Json.CLSData[cls].feedback_value = feedbackValue;
					}else{
						window.CD.module.data.Json.CLSData[cls].feedback_value = '';
					}
				}
				ds.setOutputData();
			}catch(e){
				console.log('Error in update hint'+e.message);
			}
			
			
		},
		/*
		 * This is used to show the hint value as per active element
		 * if no hint_value or dock_hint_value is there for the active element
		 * 'start typing' is shown
		 */
		showSavedHint : function(labelGrp){
			
			if(labelGrp.attrs.id.match(/^label_[0-9]+/)){
				var cls = CLSData.getLabelIndex(labelGrp.attrs.id);
			}
			if(labelGrp.attrs.id.match(/^label_[0-9]+/) && window.CD.module.data.Json.CLSData[cls].hint_value && window.CD.module.data.Json.CLSData[cls].hint_value!=''){
				var hintText = window.CD.module.data.Json.CLSData[cls].hint_value;
			}else{
				var hintText = null;
			}
			
			if(labelGrp.attrs.id.match(/^label_[0-9]+/) && window.CD.module.data.Json.CLSData[cls].feedback_value && window.CD.module.data.Json.CLSData[cls].feedback_value!=''){
				var feedbackText = window.CD.module.data.Json.CLSData[cls].feedback_value;
			}else{
				var feedbackText = null;
			}
			
			CLSView.populateHintArea(hintText,feedbackText);
		},
		
		
		/*
		 * This method is used to bind the hint event with label
		 * On mouseover hint value will be shown
		 * By Nabonita Bhattacharyya
		 */
		bindHintEvent:function(labelOrDock){
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var outputJSon = window.CD.module.data.Json.CLSData;
			var type = 'hint';
			var activeElm = window.CD.elements.active.element[0];
			var activeType = window.CD.elements.active.type;
			if(cs.objLength(outputJSon)>0){
				if(labelOrDock == 'label' && activeType == 'dock'){/*Event bind on label */
					var cls = CLSData.getLabelIndex('label_'+activeElm.attrs.id.split('_')[1]);
					var lblGroup = cs.findGroup('label_'+activeElm.attrs.id.split('_')[1]);
					for(var clsCount in outputJSon){
						var labelGroupId = outputJSon[clsCount].labelGroupId;
						var dockGroup = cs.findGroup('dock_'+labelGroupId);
						if(dockGroup){
							dockGroup.off('mouseover');
							dockGroup.off('mouseout');
						}
					}
					lblGroup.on('mouseover',function(evt){
						var cls = clsData.getLabelIndex(this.attrs.id);
						if(window.CD.module.data.Json.CLSData[cls].hint_value && window.CD.module.data.Json.CLSData[cls].hint_value!=''){
							
							CLSView.createHintObject(cls, window.CD.module.data.Json.CLSData[cls].hint_value,type);
						}
					});
					lblGroup.on('mouseout',function(evt){
						CLSView.removeHint(this);
					});
					
				}else if(labelOrDock == 'label' && activeType == 'label'){
					var cls = CLSData.getLabelIndex(activeElm.attrs.id);
					var docGroup =  cs.findGroup('dock_'+activeElm.attrs.id.split('_')[1]);
					
					for(var clsCount in outputJSon){
						var labelGroupId = outputJSon[clsCount].labelGroupId;
						var dockGroup = cs.findGroup('dock_'+labelGroupId.split('_')[1]);
						if(dockGroup){
							dockGroup.off('mouseover');
							dockGroup.off('mouseout');
						}
						
					}
					activeElm.on('mouseover',function(evt){
						var cls = CLSData.getLabelIndex(this.attrs.id);
						if(window.CD.module.data.Json.CLSData[cls].hint_value && window.CD.module.data.Json.CLSData[cls].hint_value!=''){
							
							CLSView.createHintObject(cls, window.CD.module.data.Json.CLSData[cls].hint_value,type);
						}
					});
					
					activeElm.on('mouseout',function(evt){
						CLSView.removeHint(this);
					});			
				} 
			}
		},

		/*
		 * For Feedback event bind for active element
		 * By Nabonita Bhattacharyya
		 */
		bindFeedbackEvent:function(labelOrDock){
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var outputJSon = window.CD.module.data.Json.CLSData;
			var type = 'feedback';
			var activeElm = window.CD.elements.active.element[0];
			var activeType = window.CD.elements.active.type;
			if(outputJSon.length>0){
				if(labelOrDock == 'label'){/*Event bind on label */
					if(activeType == 'dock'){
						var cls = CLSData.getLabelIndex('label_'+activeElm.attrs.id.split('_')[1]);
						var lblGroup = cs.findGroup('label_'+activeElm.attrs.id.split('_')[1]);
				
						for(var clsCount in outputJSon){
							var labelGroupId = outputJSon[clsCount].labelGroupId;
							var dockGroup = cs.findGroup('dock_'+labelGroupId.split('_')[1]);
							if(dockGroup){
								dockGroup.off('mouseover');
								dockGroup.off('mouseout');
							}
							
						}
						lblGroup.on('mouseover',function(evt){
							var cls = CLSData.getLabelIndex(this.attrs.id);
							if(window.CD.module.data.Json.CLSData[cls].feedback_value && window.CD.module.data.Json.CLSData[cls].feedback_value!=''){
								
								CLSView.createHintObject(cls, window.CD.module.data.Json.CLSData[cls].feedback_value,type);
							}
						});
						lblGroup.on('mouseout',function(evt){
							CLSView.removeHint(this);
						});
						
					} else {
						var cls = CLSData.getLabelIndex(activeElm.attrs.id);
						var docGroup =  cs.findGroup('dock_'+activeElm.attrs.id.split('_')[1]);
						
						for(var clsCount in outputJSon){
							var labelGroupId = outputJSon[clsCount].labelGroupId;
							var dockGroup = cs.findGroup('dock_'+labelGroupId.split('_')[1]);
							if(dockGroup){
								dockGroup.off('mouseover');
								dockGroup.off('mouseout');
							}
							
						}
						
						activeElm.on('mouseover',function(evt){
							var cls = CLSData.getLabelIndex(this.attrs.id);
							if(window.CD.module.data.Json.CLSData[cls].feedback_value && window.CD.module.data.Json.CLSData[cls].feedback_value!=''){
								
								CLSView.createHintObject(cls, window.CD.module.data.Json.CLSData[cls].feedback_value,type);
							}
						});
						
						activeElm.on('mouseout',function(evt){
							CLSView.removeHint(this);
						});
					}			
				}
			}
		},
		/*
		 * For selectiing binding method for either hint or feedback
		 * for hint, call bindHintEvent()
		 * for feedback bindFeedbackEvent()
		 * By Nabonita Bhattacharyya
		 */
		bindFeedbackHintEvent:function(hintOrFeedback,labelOrDock,labelOrDockFdbk){
			if(hintOrFeedback=='hint'){
				CLSView.removeHint(this);
				CLSView.bindHintEvent(labelOrDock);
			}else{
				if(hintOrFeedback == 'feedback'){
					CLSView.removeHint(this);
					CLSView.bindFeedbackEvent(labelOrDockFdbk);
				}
			}
		},
		/*
		 * This method is called on apply click
		 * For selectiing binding method for either hint or feedback
		 * for hint, call bindHintEventAllLabel()
		 * for feedback bindFeedbackEventAllLabel()
		 * By Nabonita Bhattacharyya
		 */
		bindFeedbackHintEventAllLabel : function(hintOrFeedback,labelOrDock,labelOrDockFdbk){
			if(hintOrFeedback=='hint'){
				CLSView.bindHintEventAllLabel(labelOrDock);
			}else {
				if(hintOrFeedback=='feedback'){
					CLSView.bindFeedbackEventAllLabel(labelOrDockFdbk);
				}
			}
			
		},
		/*
		 * For event binfing of hint for all labels on apply click
		 * By Nabonita Bhattacharyya
		 */
		bindHintEventAllLabel : function(labelOrDock){
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var outputJSon = window.CD.module.data.Json.CLSData;
			var type = 'hint';
			var activeElm = window.CD.elements.active.element[0];
			var activeType = window.CD.elements.active.type;
			
			for(var cls in outputJSon){
				var labelGroupId = outputJSon[cls].labelGroupId;
				var labelGroup = cs.findGroup(labelGroupId);
				var docGroup = cs.findGroup('dock_'+labelGroupId.split('_')[1]);
				
				if(labelOrDock == 'label'){/*Event bind on label */
					
					if(docGroup){
						docGroup.off('mouseover');
						docGroup.off('mouseout');
					}
					labelGroup.off('mouseover');
					labelGroup.off('mouseout');
					labelGroup.on('mouseover',function(evt){
						var clsId = CLSData.getLabelIndex(this.attrs.id);
						if(window.CD.module.data.Json.CLSData[clsId].hint_value && window.CD.module.data.Json.CLSData[clsId].hint_value!=''){
							
							CLSView.createHintObject(clsId, window.CD.module.data.Json.CLSData[clsId].hint_value,type);
						}
					});
					labelGroup.on('mouseout',function(evt){
						CLSView.removeHint(this);
					});
					
				}
			}
			cdLayer.draw();
		},
		/*
		 * For event binfing of feedback for all labels on apply click
		 * By Nabonita Bhattacharyya
		 */
		bindFeedbackEventAllLabel : function(labelOrDock){
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var outputJSon = window.CD.module.data.Json.CLSData;
			var type = 'feedback';
			
			var activeElm = window.CD.elements.active.element[0];
			var activeType = window.CD.elements.active.type;
			
			for(var cls in outputJSon){
				var labelGroupId = outputJSon[cls].labelGroupId;
				var labelGroup = cs.findGroup(labelGroupId);
				var docGroup = cs.findGroup('dock_'+labelGroupId.split('_')[1]);
				
				if(labelOrDock == 'label'){/*Event bind on label */
					if(docGroup){
						docGroup.off('mouseover');
						docGroup.off('mouseout');
					}
					
					labelGroup.off('mouseover');
					labelGroup.off('mouseout');
					
					labelGroup.on('mouseover',function(evt){
						var clsId = CLSData.getLabelIndex(this.attrs.id);
						if(window.CD.module.data.Json.CLSData[clsId].feedback_value && window.CD.module.data.Json.CLSData[clsId].feedback_value!=''){
							
							CLSView.createHintObject(clsId, window.CD.module.data.Json.CLSData[clsId].feedback_value,type);
						}
					});
					labelGroup.on('mouseout',function(evt){
						CLSView.removeHint(this);
					});
					
				}
			}
			cdLayer.draw();
		
		},
		/*
		 * This is used to make text object for hint group
		 * the text will be added to the hintGrp object
		 * By Nabonita Bhattacharyya
		 */
		createHintObject : function(clsCount,val,type){
			var activeElement = window.CD.elements.active.element[0];
			var lbConfig = new LabelConfig();
			var textFormat = new TextFormat();
			var commonLabelTextToolChar = new TextTool.commonLabelText();
			var cs = window.CD.services.cs;
			
			if(activeElement){
				var clsJson = CLSData.getJsonData();
				var hoveredLabelId = clsJson[clsCount].labelGroupId;
				
				if(activeElement.getId().match(/label_[0-9]/) == null){
					activeElement = cs.findGroup(hoveredLabelId);
				}
							
				var cdLayer = cs.getLayer();
				var frameGroup = cs.findGroup('frame_0');
				var hintFdbackVal = CLSData.getHintFeedbackFromJson();
				var adminData = window.CD.module.data.Json.adminData;
				var GFS = parseInt(adminData.GFS);
				

				var labelId = activeElement.attrs.id.split('_')[1];
				if(activeElement.getId().match(/^dock_label_[0-9]+/) != null){
					labelId = activeElement.attrs.id.split('_')[2];
				}
				
				var hfValue = CLSData.getHintFeedbackValue('label_'+labelId);
				
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
					CLSView.createHintFeedbackText(activeElement,hintGroup,val,labelId,type);
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
							CLSView.createHintFeedbackText(activeElement,hintGroup,val,labelId,type);
						}else{
							var hintFdbckGrp = cdLayer.get('.hint_grp')[0];
							hintFdbckGrp.setX(hintX);
							hintFdbckGrp.setY(hintY);
							hintGroup.show();
						}
						cdLayer.draw();
					}else{
						CLSView.destroyHint();
						hintGroup = cs.createGroup('hintGrp',{x: hintX , y : hintY , name: 'hint_grp'});
						CLSView.createHintFeedbackText(activeElement,hintGroup,val,labelId,type);
					}					
				}
			}
		},
		
		createHintFeedbackText : function(activeElement,hintGroup,val,labelId,type){
			console.log("@createHintFeedbackText :: CLSView");
			try{
				var commonLabelTextToolChar = new TextTool.commonLabelText();
				var cs = window.CD.services.cs;
				var cdLayer = cs.getLayer();
				var textFormat = new TextFormat();
				var lbConfig = new LabelConfig();
				
				var hintFdbackVal = CLSData.getHintFeedbackFromJson();
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
				var lastChild = commonLabelTextToolChar.findLastTextchild(hintTextGroup,count);
				var textGrpHeight = hintTextGroup.children[lastChild].getY() + hintTextGroup.children[lastChild].getHeight();
				var topPadding = (hintTextGroup.parent.children[0].getHeight()-textGrpHeight)/2;
				if(topPadding < 0)
					topPadding = 0;
				hintTextGroup.setY(topPadding);	
				
				cdLayer.draw();
			}
			catch(error){
				console.log("Error in createHintFeedbackText :: CLSView "+error.message);
			}
		},
		
		/*
		 * This is used to clear hint text fron hint group if no 
		 * value is there in either of the hint_values
		 * By Nabonita Bhattacharyya
		 */
		removeHint : function(labelGrp){
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
		/*
		 * This is used to remove hint/feedback box 
		 * when 'none' is clicked from inspector
		 * By Nabonita Bhattacharyya
		 */
		removeHintBox : function(){
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			if(cdLayer.get('.auth_hint_grp')[0]){
				cdLayer.get('.auth_hint_grp')[0].removeChildren();
				cdLayer.get('.auth_hint_grp')[0].remove();
			}
			cdLayer.draw();
		},
		onClickShowHiddenTxtGlobal : function(status){
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var activeElm = window.CD.elements.active.element[0];
			var activeType = window.CD.elements.active.type;
			var cdLayer = cs.getLayer();
			var infoTextTObj;
			var infoText;
			var txtGrp;
			var imgGrp;
			var previousState = 'unchecked';
			var presentState = 'unchecked';
			var undoMng = window.CD.undoManager;
			var outputJSon = window.CD.module.data.Json.CLSData;
			var updateJSon = window.CD.module.data.Json;
			for(var clsCount in outputJSon){
				var labelGroupID = window.CD.module.data.Json.CLSData[clsCount].labelGroupId;
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
				if (outputJSon[clsCount].infoHideText == 'T') {
					if($('#showHiddenTxtGlobal').is(':checked')){
						CLSData.showHiddenTextInAuthoring = true;
						txtGrp.show();
						
						if (imgGrp) {
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
							cdLayer.draw();
							presentState = 'checked';
							/*this.updateLabelContent(lblGroup, oldData, calcY, infoTextTObj
									.getHeight());
	*/					}
					}else{
						CLSData.showHiddenTextInAuthoring = false;
						txtGrp.hide();
						var clsTextTool= new TextTool.commonLabelText();
						clsTextTool.finalAdjustmentLabelContent(activeElm);
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
		/*
		 * This is used when apply button of 
		 * label inspector is clicked
		 */
		   globalApplyClick: function(errorModal){
			var regex = /^\s*([0-9]*\.[0-9]+|[0-9]+)\s*$/;
				if(window.CD.elements.active.type == 'label' || window.CD.elements.active.type == 'dock') {
					var minLabelWidth = 29;
					var minLabelHeight = 29;
					var maxLabelWidth = window.CD.width;
					var maxLabelHeight = window.CD.height;
					var activeLabelWidth = parseInt($('#labelWidth').val());
					var activeLabelHeight = parseInt($('#labelHeight').val());
					var passFlag = false;
					var activeHintWidth = parseInt($('#hintWidth').val());
					var activeHintHeight = parseInt($('#hintHeight').val());
					var activeDockWidth = parseInt($('#dockWidth').val());
					var activeDockHeight = parseInt($('#dockHeight').val());
					
					var activeFeedbackWidth = parseInt($('#feedbackWidth').val());
					var activeFeedbackHeight = parseInt($('#feedbackHeight').val());
				
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
						'sloppy':$('#snapToDockGlob').prop('checked'),
						'hideTextGlobal':$('#hideTextGlobal').prop('checked')
					};
					
					var oldData = {};
					var oldData = CLSData.populateLabelDockData(oldData);
					var dataJson = {};
					dataJson = CLSData.getChangedJson(oldData,data,dataJson);
					
					if(window.CD.services.cs.objLength(dataJson) > 0){
						if($.trim($('#hintWidth').val()) == "" || $.trim($('#feedbackWidth').val()) == "")
							alertMsg += "The width of the hint or feedback box cannot be left blank. <br/><br/>";
						if($.trim($('#hintHeight').val()) == "" || $.trim($('#feedbackHeight').val())== "")
							alertMsg += "The height of the hint or feedback box cannot be left blank. <br/><br/>";
						if(activeHintWidth >= maxLabelWidth || activeFeedbackWidth >= maxLabelWidth)
							alertMsg += "The width of the hint or feedback box cannot be greater than "+maxLabelWidth+"px.<br/><br/>";
						if(activeHintHeight >= maxLabelHeight || activeFeedbackHeight >= maxLabelWidth)
							alertMsg += "The height of the hint or feedback box cannot be greater than "+maxLabelHeight+"px.<br/><br/>";
						if(activeHintWidth <= minLabelWidth || activeFeedbackWidth <= minLabelWidth)
							alertMsg += "The width of the hint or feedback box must be greater than or equal to 30px. <br><br/>";
						if(activeHintHeight <= minLabelHeight || activeFeedbackHeight <= minLabelWidth)
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
						
						if((regex.test($.trim($('#labelWidth').val()))==false) || (regex.test($.trim($('#labelHeight').val()))==false)){
							$('#labelWidth').val(window.CD.module.data.Json.adminData.SLELD.split(',')[0]);
							$('#labelHeight').val(window.CD.module.data.Json.adminData.SLELD.split(',')[1]);
							
							 regexFlag = false;
						}
						else
							 regexFlag = true;
						if ((regex.test($.trim($('#dockWidth').val()))==false) || (regex.test($.trim($('#dockHeight').val()))==false))
							{
							$('#dockWidth').val(window.CD.module.data.Json.CLSCData.CLSC0.width);
							$('#dockHeight').val(window.CD.module.data.Json.CLSCData.CLSC0.height);
							regexFlagDock = false;
							}
						else
							 regexFlagDock = true;
						if(passFlag && regexFlag && regexFlagDock){
							window.CD.module.view.updateDimention(data,undefined,dataJson);
						}
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
						window.CD.module.view.bindFeedbackHintEventAllLabel($('input[name=hintFeedback]:checked').val(),$('input[name=hoverHint]:checked').val(),$('input[name=feedbackType]:checked').val());
						window.CD.module.view.bindFeedbackHintEvent($('input[name=hintFeedback]:checked').val(),$('input[name=hoverHint]:checked').val(),$('input[name=feedbackType]:checked').val());
						/*var hintVal = $('#textareaHint').val();
						var feedbackVal = $('#textareaFeedback').val();
						window.CD.module.view.updateHintFeedbackVal(hintVal,feedbackVal);*/
				}
				
			},
		
		/*
		 * For updating size & position of text and
		 * image of label while resizing
		 */
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
		        var imgObject = group.get('.img')[0];
		        var buffer = 10;
		        
				
		        if(imgObject){
		        	var imageNameArr = imgObject.attrs.image.src.split('/');
					var imageName = imageNameArr[imageNameArr.length-1];
					
					if(imageName.indexOf('=SHOWmedia&media=') > -1){
						imageName = imageName.substring(imageName.lastIndexOf('=SHOWmedia&media=')+17 , imageName.length);
					}
					
		        	var imgH = imgObject.getHeight();//parseInt($('#imgHeight').html());
					var imgW = imgObject.getWidth();//parseInt($('#imgWidth').html());
					
					/*var imgBckupH = imgObject.getHeight();//parseInt($('#imgHeight').html());
					var imgBckupW = imgObject.getWidth();//parseInt($('#imgWidth').html());
					if (imageName) {
						// image name is there 
						var src = imageName;
						var imageObject = new Image();
						 //If src has ('|')
						 if(src.indexOf('=')>-1){
							 src = src.split('=')[src.split('=').length-1];
						 }
						imageObject.src = window.CD.util.proccessMediaID(src);
						var imgH = imageObject.height;
						var imgW = imageObject.width;
						// For chrome and even for ff with clear cache, image was not getting loaded 
						if(imgH == 0 || imgW == 0){
							imgH = imgBckupH;
							imgW = imgBckupW;
						}
					}*/
					var ratio = imgW / imgH;
	                   var avlblWidth = lblWidth - 30;
	                   var avlblHeight = lblHeight - 30;
	                  
	                   if(imgW < avlblWidth){
	                	   	imgW = avlblWidth+50;
		   					var exratio =avlblWidth/imgW;
		   					imgW = imgW*exratio;
		   					imgH = imgW/ratio;
	   		            }
	                    if(imgW > avlblWidth){
							var exratio =avlblWidth/imgW;
							imgW = imgW*exratio;
							imgH = imgW/ratio;
	                    }
	                    if(imgH > avlblHeight){
	    					var exratio =avlblHeight/imgH;
	    					imgH = imgH*exratio;
	    					imgW = imgH * ratio;
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
		                   
		                   /** ---- Done to update image dimension when label is resized on 20th Nov, 2013 ---- **/
		                   var cls = CLSData.getCLSIndex(group.attrs.id);
		                   var imageName = window.CD.module.data.Json.CLSData[cls].image_data.split('|')[0];
		                   window.CD.module.data.Json.CLSData[cls].image_data = imageName+'|'+Math.ceil(imgW)+'|'+Math.ceil(imgH);
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
		                   } else {
		                	   /** --- This is done so that class set comes on top of label text
		                	    * otherwise class set was becoming inaccesible ---- **/
		                	   if(cs.findObject(group,'selObjGrp_'+group.attrs.id)) {
		       						cs.findObject(group,'selObjGrp_'+group.attrs.id).remove();
		       					}
		                	   
		                	   var clsData = window.CD.module.data.Json.CLSData;
		                	   var val = clsData[cls];
		                	   var classSet = val.class_set.split('|');

		           				if(val.distractor == 'F') {
		           					CLSView.labelGroupAssignControl(group,classSet);
		           				}
		           			  /** ----------------------------------------------------------- **/
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
		                	
		                   }
		                   cdLayer.draw();	
		                }            

				var txtObj = group.get('#txtGrp_'+group.attrs.id.split('_')[1])[0];
				var addTxtObj = group.get('#addTxt_'+group.attrs.id.split('_')[1])[0];
				var imgObj = group.get('#img_label_'+group.attrs.id.split('_')[1])[0];
				var grpid = group.attrs.id.split('_')[1];
				if(imgObj){
					if(txtObj && txtGrpObj.getVisible() == true){				
						txtObj.setWidth(lblWidth-20);
						
						var textStyleObj = CLSData.getTextStyleData(txtObj.getId().split('_')[1]);
						var textStyle = textStyleObj.fontStyle;
						var align = textStyleObj.align;
						var underline_value = textStyleObj.underline_value;
						
						var textValue = CLSData.getLabelTextValue(txtObj.parent.getId());
						if(textValue != ""){
							textFormat.deleteEachLabelText(txtObj);
							
							txtObj = textFormat.createLabelText(txtObj, textValue, align);
							txtConfg.bindLabelTextEvent(txtObj);			
							var txtBox = txtObj.get('#txtBox_'+txtObj.getId().split('_')[1])[0];
							var addTxt = txtObj.get('#addTxt_'+txtObj.getId().split('_')[1])[0];
							addTxt.setWidth(lblWidth-20);
							txtBox.setWidth(lblWidth-20);
							txtBox.hide();
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
						if(txtObj.getId().match(/^txtGrp_[0-9]/) != null){
							var textStyleObj = CLSData.getTextStyleData(txtObj.getId().split('_')[1]);
							var textStyle = textStyleObj.fontStyle;
							var align = textStyleObj.align;
							var underline_value = textStyleObj.underline_value;
							
							var textValue = CLSData.getLabelTextValue(txtObj.parent.getId());
							if(textValue != ""){
								textFormat.deleteEachLabelText(txtObj);
								
								txtObj = textFormat.createLabelText(txtObj, textValue, align);
								txtConfg.bindLabelTextEvent(txtObj);
								
								var txtBox = txtObj.get('#txtBox_'+txtObj.getId().split('_')[1])[0];
								var addTxt = txtObj.get('#addTxt_'+txtObj.getId().split('_')[1])[0];
								addTxt.setWidth(lblWidth-20);
								txtBox.setWidth(lblWidth-20);
								txtBox.hide();
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
					}
					else if(addTxtObj){
						addTxtObj.parent.setY((lblHeight - addTxtObj.getTextHeight())/2);
						group.get('#txtBox_'+grpid)[0].setWidth(lblWidth-20);
						group.get('#txtBox_'+grpid)[0].setX(((lblWidth-20)-group.get('#txtBox_'+grpid)[0].getWidth())/2)
						group.get('#addTxt_'+grpid)[0].setWidth(lblWidth-20);
						group.get('#addTxt_'+grpid)[0].setAlign("center");
					}
				}

				function applyUnderline(txtObj){
					if($('#UnderlinetTool').hasClass('active') || (txtObj.parent.get('.underline_txt')[0])){
						 var baseLabelTxtTool= new TextTool.commonLabelText();
						 baseLabelTxtTool.applyTextUnderline(txtObj, txtObj.parent);			  
					 }
				}
				if(txtObj){
					if($('#hideTextLoc').is(':checked')){
						if(!$('#showHiddenTxtGlobal').is(':checked')){
							txtObj.hide();
						}
					}
				}
				
			},
			
		getImageDimension : function(imageName){
				var img = $('<img>');			
				img.attr('src', window.CD.util.proccessMediaID(imageName));
				
				$(img).load(function() {
				    var imgWidth = this.width;
				    var imgHeight = this.height;
				    var imageDimension = {};				   
				    imageDimension.imgWidth = imgWidth;
				    imageDimension.imgHeight = imgHeight;
				    return imageDimension;
				  });
		},
		bindInspectorEvents : function(){
			/* ---------- For making Local transparent type and border readonly--------------*/
			$(':radio[name=transparenTypeLoc],:checkbox[id=dockFillLoc],:checkbox[id=magnEnableLoc]').attr("disabled",true);
			$(':radio[name=transparenTypeLoc],:checkbox[id=dockFillLoc],:checkbox[id=magnEnableLoc]').click(function(){
			    return false;
			});
			/*on click on apply button on canvas property for Text Tool*/
			$("#distractorLoc").bind('change',function(){
				window.CD.module.view.toggleDistractor($("#distractorLoc").prop('checked'))	
			});
			

			/*on click on local hide text in label inspector*/
			$('#localDiv #hideTextLoc').on('click',function(){
				//window.CD.module.view.onClickHideLabelText();
				var activeElmLength = window.CD.elements.active.element.length;
				var activeElmIds = [];
				for(var i=0;i<activeElmLength;i++){
					activeElmIds.push(window.CD.elements.active.element[i].attrs.id);
				}
				var clsTextTool= new TextTool.commonLabelText();
				clsTextTool.onClickHideLabelText(activeElmIds);//for hide text this method is used. Now it is shifted to commonLabelText
			});
			$('#localDiv #localApply').on('click',function(){
				var activeElmLength = window.CD.elements.active.element.length;
				if(window.CD.elements.active.type == 'dock'){
					for(var i=0;i<activeElmLength;i++){
						var activeElm = window.CD.elements.active.element[i];
						var dockdata = CLSData.getCLSCData();
						var clscIndex = CLSData.getCLSCIndex(activeElm.attrs.id);
						var newWidth = $('#localDiv #localDockWidth').val();
						var newHeight = $('#localDiv #localDockHeight').val();
						var width = dockdata[clscIndex].width;
						var height = dockdata[clscIndex].height;
						if((newWidth != width) || (newHeight != height)){
							var cs = window.CD.services.cs;
							var ds = window.CD.services.ds;
							var minLabelWidth = 30;
							var maxLabelWidth = 500;
							var minLabelHeight = 30;
							var maxLabelHeight = 500;
							var alertMsg = "";
							var Util = window.CD.util;
							var errorModal = Util.getTemplate({url: 'resources/themes/default/views/error_modal.html?{build.number}'});
							var flag = false;
							if(($.trim($('#localDiv #localDockWidth').val()) != "") && newWidth <= maxLabelWidth && newWidth >= minLabelWidth && newHeight <= maxLabelHeight && newHeight >= minLabelHeight){
								flag = true;
							}
							if(flag == true){
								dockdata[clscIndex].width = newWidth;
								dockdata[clscIndex].height = newHeight;
								CLSView.labelDockDimensionChange(activeElm,newHeight,newWidth);
								ds.setOutputData();
							}else{
								passFlag = false;
								if($.trim($('#localDiv #localDockWidth').val()) == "")
									alertMsg += "The width of the dock cannot be left blank. <br/><br/>";
								if($.trim($('#localDiv #localDockHeight').val()) == "")
									alertMsg += "The height of the dock cannot be left blank. <br/><br/>";
								if(newWidth > maxLabelWidth)
									alertMsg += "The width of the dock cannot be greater than "+maxLabelWidth+"<br/><br/>";
								if(newHeight > maxLabelHeight)
									alertMsg += "The height of the dock cannot be greater than "+maxLabelHeight+"<br/><br/>";
								if(newWidth < minLabelWidth)
									alertMsg += "The width of the dock must be greater than or equal to 30px. <br><br/>";
								if(newHeight < minLabelHeight)
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
								$('#localDiv #localDockWidth').val(width);
								$('#localDiv #localDockHeight').val(height);
							});
						}
					}
					
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
		},
		
		attachClassEvent : function(){
			console.log("@attachClassEvent :: CLSView");
			try{
				var clsData = CLSData.getCLSData();
				$.each(clsData, function(key, val){
					var labelId = clsData[key].labelGroupId.split('_')[1];
					var labelGroupId = 'label_'+labelId;
					var labelGroup = window.CD.services.cs.findGroup(labelGroupId);
					if(labelGroup){
						var classSet = val.class_set.split('|');

						if(val.distractor == 'F') {
							CLSView.labelGroupAssignControl(labelGroup,classSet);
						}
					}				
				});
			}catch(err){
				console.info("Error @attachClassEvent :: CLSView "+err.message);
			}
		},
		
		/*
		 * This method is for populating Global and Local tab for
		 * Label Inspector
		 * On apply click view will be populated with user chosen values
		 * By Nabonita Bhattacharyya
		 */
		applyPopulate : function(){
			
			$('#localDockWidth').val($('#dockWidth').val());
			$('#localDockHeight').val($('#dockHeight').val());
		 	
			$('#localLabelWidth').html($('#labelWidth').val()+'px');
			$('#localLabelHeight').html($('#labelHeight').val()+'px');
			
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
		},
		
		/*
		 * This method is for populating Global and Local tab for
		 * Label Inspector
		 * On apply click view will be populated with user chosen values
		 * By Nabonita Bhattacharyya
		 */
		populateLabelData : function(applyEnable,labelData,hintArea){
			if(labelData){
				if(labelData.labelWidth && labelData.labelHeight){
					$('#labelWidth').val(labelData.labelWidth);
					$('#labelHeight').val(labelData.labelHeight);
					
					$('#localLabelWidth').html(labelData.labelWidth+'px');
					$('#localLabelHeight').html(labelData.labelHeight+'px');
				}
				
				if(labelData.dockWidth && labelData.dockHeight){
					$('#localDockWidth').val(labelData.dockWidth);
					$('#localDockHeight').val(labelData.dockHeight);
				}
				
				
				if(labelData.dockWidthGlob && labelData.dockHeightGlob){
					$('#dockWidth').val(labelData.dockWidthGlob);
					$('#dockHeight').val(labelData.dockHeightGlob);
				}
				
				$('#distractorLoc').prop('checked',false);
				if(labelData.distractor_label == 'T')
					$('#distractorLoc').prop('checked',true);
				
				if(labelData.transparency && labelData.transparency === 'solid'){
					$('input[name=transparenType][value=solid]').prop('checked',true);
					$('input[name=transparenTypeLoc][value=solid]').prop('checked',true);
				}else if(labelData.transparency && labelData.transparency === 'semitransparent'){
					$('input[name=transparenType][value=semitransparent]').prop('checked',true);
					$('input[name=transparenTypeLoc][value=semitransparent]').prop('checked',true);
				}else{
					if(labelData.transparency){
						$('input[name=transparenType][value=transparent]').prop('checked',true);
						$('input[name=transparenTypeLoc][value=transparent]').prop('checked',true);
					}
				}
				if(labelData.strokeDock == 'F'){
					$('#dockBorderGlob').prop('checked',true);
					$('#dockFillLoc').prop('checked',true);
				}else{
					if(labelData.strokeDock == 'T'){
						$('#dockBorderGlob').prop('checked',false);
						$('#dockFillLoc').prop('checked',false);
					}
				}
				
				
				if(labelData.fillEnabled == 'F') {
					$('#labelFillGlob').prop('checked',true);
				}else{
					if(labelData.fillEnabled == 'T') {
						$('#labelFillGlob').prop('checked',false);
					}
				}

				
				if(labelData.strokeEnabled == 'F') {
					$('#labelBorderGlob').prop('checked',true);
				}else{
					if(labelData.strokeEnabled == 'T') {
						$('#labelBorderGlob').prop('checked',false);
					}
				}
				
				/* ------------- For Hint / Feedback ---------------- */
				$('#hintWidth').val(labelData.hintWidth);
				$('#hintHeight').val(labelData.hintHeight);
				
				
				$('#feedbackWidth').val(labelData.feedbackWidth);
				$('#feedbackHeight').val(labelData.feedbackHeight);
				
				if(labelData.hintLabelOrDock == 'L'){
						$('input[name=hoverHint][value=label]').prop('checked',true);
				}
				if(labelData.feedbackLabelOrDock == 'L'){
						$('input[name=feedbackType][value=label]').prop('checked',true);
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
				
				/* -------- for hidetext ------------- */
				if(labelData.hideTextLoc == 'T'){
					$('#hideTextLoc').prop('checked',true);
				}else{
					if(labelData.hideTextLoc == 'F'){
						$('#hideTextLoc').prop('checked',false);
					}
				}
				
				/** ---------- For Hide fill/drop after drop --------- **/
				if(labelData.fillBorderDrop){
					$('#fillBorderDrop').prop('checked',true);
				}else{
					$('#fillBorderDrop').prop('checked',false);
				}
				
				
				/** ---------- For snap to dock(sloppy) ------------ **/
				
				if(labelData.snapToDock){
					$('#snapToDockGlob').prop('checked',true);
				}else{
					$('#snapToDockGlob').prop('checked',false);
				}
				
			}
			
			if(applyEnable){
				$('#globalApply').removeClass('inactive');
			}else{
				$('#globalApply').addClass('inactive');
			}
		},
		onClickHideLabelText :function(){

			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var activeElm = window.CD.elements.active.element[0];
			var activeType = window.CD.elements.active.type;
			var cdLayer = cs.getLayer();
			var infoTextTObj;
			var txtGrp;
			var imgGrp;
			
			if(/*activeType==='dock' || */activeType === 'label'){
				/*fetch label group details*/
				/*if(activeType == 'dock'){
					var cls = CLSData.getCLSIndex('label_'+activeElm.attrs.id.split('_')[2]);
					var lblGroup = cs.findGroup('label_'+activeElm.attrs.id.split('_')[2]);
				} else */if(activeType == 'label'){
					var cls = CLSData.getCLSIndex(activeElm.attrs.id);
					var lblGroup = cs.findGroup(activeElm.attrs.id);
				}
				/*for image adjust calculation in a label*/
				var label = lblGroup.children[0];
				var oldData = {'height':label.getHeight(),'width':label.getWidth()};
				var calcY = label.getHeight()-20;
				
				/*fetch all info text objects*/
				var labelGroupId = window.CD.module.data.Json.CLSData[cls].labelGroupId;
				$.each(lblGroup.children, function(index,value){
					if(value.nodeType==="Group" && value.attrs.id.match(/infoText_label_[0-9]+/)){
						/*fetching T F H infotext object*/
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
					if(!$('#showHiddenTxtGlobal').is(':checked')){
						txtGrp.hide();
					}
					if(imgGrp && imgGrp.attrs.id.match(/img_label_[0-9]+/)){
						this.updateLabelContent(lblGroup,oldData,calcY,textH);
						
					}
					/*adjust position for T and F*/
					if(!infoHvisible && infoFvisible){
						var infoTX=infoTextTObj.getX();
						infoTextFObj.setX(infoTX+10);
					}
					
					
					window.CD.module.data.Json.CLSData[cls].infoHideText='T';
				}else{
					infoTextTObj.hide();
					//txtGrp.show();
					if(imgGrp && imgGrp.attrs.id.match(/img_label_[0-9]+/)){
						//calcY=calcY-20;
						var oldData = {'height':(label.getHeight()/2.5),'width':(label.getWidth()/2.5)};
						this.updateLabelContent(lblGroup,oldData,calcY);
						
					}
					txtGrp.show();
					window.CD.module.data.Json.CLSData[cls].infoHideText='F'
				}
				var undoMng = window.CD.undoManager;
				undoMng.register(this, CLSView.undoHideText,[lblGroup.getId()] , 'Undo Label Info text',this, CLSView.undoHideText,[lblGroup.getId()] , 'Redo Label Info text');
				updateUndoRedoState(undoMng);
				var moduleTextTool= new TextTool.commonLabelText();
				moduleTextTool.finalAdjustmentLabelContent(lblGroup);
				cdLayer.draw();
				ds.setOutputData();
				
			    //ends here
		}
	  },
	  
	  
	  handleDisplayLabelOnce : function() {
		  var cs = window.CD.services.cs;
		  var ds = window.CD.services.ds;
		  var cdLayer = cs.getLayer();
		  var outputJSon = CLSData.getJsonData();
		  var adminData = CLSData.getJsonAdminData();
		  var textArr = new Array();
		  for(var clsCount in outputJSon){
			  var labelGroupID = outputJSon[clsCount].labelGroupId;
			  var labelGroupLbl = cs.findGroup(labelGroupID);
			  var label = labelGroupLbl.children[0];
			  var lblIndex = labelGroupID.split('_')[1];
			  var txtGrp = labelGroupLbl.get('#txtGrp_'+lblIndex)[0];
			  
			  if(txtGrp)
					 var currentTxtGrpText = CLSData.getLabelTextValue(labelGroupLbl.attrs.id);
			  
			  if(txtGrp && currentTxtGrpText != "") {
				  if( $.inArray(currentTxtGrpText, textArr) !== -1 ) {
					  if(window.CD.module.data.Json.adminData.OTM == true && window.CD.module.data.Json.adminData.TYPE == false) {
						  //labelGroupLbl.hide();
						  var cls = CLSData.getCLSIndex(window.CD.elements.active.element[0].parent.attrs.id);
						  var activeElm = window.CD.elements.active.element[0];
						  var activeElmIdIndx = activeElm.attrs.id.split('_')[1];
						  var actvTxt = CLSData.getLabelTextValue(activeElm.parent.attrs.id);
						  if(currentTxtGrpText == actvTxt) {
							  //window.CD.elements.active.element.parent.hide();							  
							  //outputJSon[cls].visibility = false;			
							  CLSView.callOTMWarningMessage(window.CD.elements.active.element[0].parent,activeElmIdIndx);
						  }
					  } else if(window.CD.module.data.Json.adminData.OTM == false && window.CD.module.data.Json.adminData.TYPE == true) {
						  var cls = CLSData.getCLSIndex(window.CD.elements.active.element[0].parent.attrs.id);
						  var ncls = CLSData.getCLSIndex(labelGroupLbl.attrs.id);
						  var activeElm = window.CD.elements.active.element[0];
						  var activeElmIdIndx = activeElm.attrs.id.split('_')[1];	
						  var actvTxt = CLSData.getLabelTextValue(activeElm.parent.attrs.id);
						  if(currentTxtGrpText == actvTxt && (outputJSon[cls].distractor == 'T' || outputJSon[ncls].distractor == 'T') ) {
							  //window.CD.elements.active.element.parent.hide();							  
							  //outputJSon[cls].visibility = false;		
							  var flag = true;
							  CLSView.callOTMWarningMessage(window.CD.elements.active.element[0].parent,activeElmIdIndx,flag);
						  }
					  } else if(window.CD.module.data.Json.adminData.OTO == true){
						  //var lblIndx = labelGroupLbl.attrs.id.split('_')[1];
						  var lblIndx = window.CD.elements.active.element[0].parent.attrs.id.split('_')[1];
						  //CLSView.callOTOWarningMessage(labelGroupLbl,lblIndx);
						  CLSView.callOTOWarningMessage(window.CD.elements.active.element[0].parent,lblIndx);
					  }					  
				  } else {
					  textArr.push(currentTxtGrpText);
				  }
				  
				  /* handling same text class sets */
				  if(window.CD.module.data.Json.adminData.TYPE == true) {
					  this.handleSameLabelClassSet();
				  }
			  }			  
		  }
		  cdLayer.draw();
		  ds.setOutputData();
	  },
	    
	  handleSameLabelClassSet : function() {
		  var cs = window.CD.services.cs;
		  var ds = window.CD.services.ds;
		  var cdLayer = cs.getLayer();
		  var outputJSon = CLSData.getJsonData();
		  var adminData = CLSData.getJsonAdminData();
		  var textArr = {};
		  
		  for(var clsCount in outputJSon){
			  var labelGroupID = outputJSon[clsCount].labelGroupId;
			  var labelGroupLbl = cs.findGroup(labelGroupID);
			  var label = labelGroupLbl.children[0];
			  var lblIndex = labelGroupID.split('_')[1];
			  var txtGrp = labelGroupLbl.get('#lbltxt_'+lblIndex)[0];
			  var cls = CLSData.getCLSIndex(labelGroupID);
			  var classSet = outputJSon[cls].class_set;
			  if(txtGrp && txtGrp.attrs.text != "") {
				  if(textArr[txtGrp.attrs.text]) {
					  var classSetArr = new Array();
					  if(classSet) {
						  classSetArr = classSet.split('|');
					  }
					  var labelSet = textArr[txtGrp.attrs.text];
					  //var oldClassSet = labelSet.classSet;
					  
					  for(prevLabel in labelSet) {
						  var margedClassSet = $.unique($.merge($.unique(labelSet[prevLabel]), $.unique(classSetArr)));
						  var margedClassSetStr = margedClassSet.join('|');
						  
						  textArr[txtGrp.attrs.text][prevLabel] = margedClassSet;
						  textArr[txtGrp.attrs.text][labelGroupID] = margedClassSet;
						  var oldLabel = CLSData.getCLSIndex(prevLabel);
						  var prevlabel = cs.findGroup(outputJSon[oldLabel].labelGroupId);
						  outputJSon[cls].class_set = margedClassSetStr;
						  outputJSon[oldLabel].class_set = margedClassSetStr;
						  CLSView.labelGroupAssignControl(labelGroupLbl,margedClassSet);
						  CLSView.labelGroupAssignControl(prevlabel,margedClassSet);
					  }
						  
					  
				  } else {
					  textArr[txtGrp.attrs.text] = {};
					  textArr[txtGrp.attrs.text][labelGroupID] = classSet.split('|');
				  }
			  }			  
		  }
		  ds.setOutputData();
	  },

	  
  	/*
	 * Warning message call for OTO
	 * By Nabonita Bhattacharyya
	 */
	callOTOWarningMessage : function(labelGroupLbl,lblIndex){
		try{
			var Util = window.CD.util;
			var textFormat = new TextFormat();
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			
			/** --- applying mask ---**/
			$('.errorOverLay').remove();
			var errorOverLay = $('<div class="errorOverLay"></div>');
			$('#toolPalette').append(errorOverLay);
			
			var errorModal = Util.getTemplate({url: 'resources/themes/default/views/error_modal.html?{build.number}'});
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
				$('.errorOverLay').remove();//removing mask
			});
			$('#alertMessage').slideDown(200);		
			$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
			$('#errorTextOTO').show();
			$('#errorTextOTO .error_warning_text').show();
			
			$('#OTOButton #errorOk').show();
			$('#errorOk').html('Ok');
			$('#alertMessage').slideDown(200);	
			var txtBox = labelGroupLbl.get('#txtBox_'+lblIndex)[0];
				var txtObj = labelGroupLbl.get('#txtGrp_'+lblIndex)[0];
				var addTxt = labelGroupLbl.get('#addTxt_'+lblIndex)[0];
				var cls = CLSData.getCLSIndex(labelGroupLbl.attrs.id);
				var labelData = CLSData.getJsonData();
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
				txtBox.parent.setY(0);
				txtObj.setX(leftPadding);
				txtBox.setY(calcY);
				addTxt.show();
				addTxt.setY(calcY);

				var clsTextTool= new TextTool.commonLabelText();
				clsTextTool.bindLabelTextEvent(addTxt.parent);
				cdLayer.draw();
				labelData[cls].label_value = '';
				labelData[cls].class_set = '';
				ds.setOutputData();
			$("#errorModal span#errorOk").off('click').on('click',function(){
				$('.errorOverLay').remove();//removing mask
				$('#errorModal').slideUp(200);
			});
		}catch(err){
			console.error("@CLSView::Error on warning message for OTO::"+err.message);
		}
	},
	
	callOTMWarningMessage : function(labelGroupLbl,lblIndex,flag){
		try{
			var Util = window.CD.util;
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			var textFormat = new TextFormat();
			var errorModal = Util.getTemplate({url: 'resources/themes/default/views/error_modal.html?{build.number}'});
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
			$('#errorTextOTM').show();
			$('#errorTextOTM .error_warning_text').show();
			if(flag && flag == true){
				$('#errorTextOTM .error_warning_text').html('You cannot have a distractor with the same text as a label.');
			}
			$('#OTMButton #errorOk').show();
			$('#errorOk').html('Ok');
			$('#alertMessage').slideDown(200);	
			
			$("#errorModal span#errorOk").off('click').on('click',function(){
				$('#errorModal').slideUp(200);
				var txtBox = labelGroupLbl.get('#txtBox_'+lblIndex)[0];
				var txtObj = labelGroupLbl.get('#txtGrp_'+lblIndex)[0];
				var addTxt = labelGroupLbl.get('#addTxt_'+lblIndex)[0];
				var cls = CLSData.getCLSIndex(labelGroupLbl.attrs.id);
				var labelData = CLSData.getJsonData();
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
				txtBox.parent.setY(0);
				txtObj.setX(leftPadding);
				txtBox.setY(calcY);
				addTxt.show();
				addTxt.setY(calcY);
				
				cdLayer.draw();
				labelData[cls].label_value = '';
				labelData[cls].class_set = '';
				ds.setOutputData();
				
			});
		}catch(err){
			console.error("@CLSView::Error on warning message for OTO::"+err.message);
		}
	},
	  createKineticObject: function(options){ 
	    	 console.log("@CLSView::createKineticObject");
	 		 try{
	 			 var kineticOPT=options.kinteticOpt;
	 			 if(options.type==="Rect" || options.type==="TextRect" ){
	 				if(options.type!=="TextRect"){
		 				var defaultLabelOPT={
		 									fontSize:this.defaultLabelStrokeCLR,
									 		strokeWidth:this.defaultTextFontFamily,
									 		cornerRadius:this.defaultLabelCornerRadius,
									 		Stroke:this.defaultLabelStrokeCLR
							 		 	}
		 				kineticOPT=$.extend(defaultLabelOPT,kineticOPT);
	 				}
	 				var kineticObject = new Kinetic.Rect(kineticOPT);
	 				 
	 			 }else if(options.type==="Text"){
	 				  var kineticObject = new Kinetic.Text(kineticOPT);
				 }
	 			//console.log(kineticObject);
	 			 return 	kineticObject
	 		}catch(err){
				console.error("@CLSView::Error on createKineticObject::"+err.message);
	 		}
	     },
	     fixTextEntities:function(input){
	 		console.log("@CLSView.fixTextEntities");
	 		try{
	 		    var result = (new String(input)).replace(/&(amp;)/g, "&");
	 		    return result.replace(/&#(\d+);/g, function(match, number){ return String.fromCharCode(number); });
	 		}catch(err){
	 			console.error("@CLSView::Error on fixTextEntities::"+err.message);
	 		}
	 	},

	 	onTypeingHintAndFeedback :function(textAreaObjVal,type){
	 		var activeElm = window.CD.elements.active.element[0];
			var activeType = window.CD.elements.active.type;
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			
			var cdLayer = cs.getLayer();
			var infoTextTObj,infoTextHObj,infoTextFObj;
			if(activeType === 'label'){
				
				var cls = CLSData.getCLSIndex(activeElm.attrs.id);
				var lblGroup = cs.findGroup(activeElm.attrs.id);
				
				var labelGroupId = window.CD.module.data.Json.CLSData[cls].labelGroupId;
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
				if(type == "textareaHint"){
					
					var hintValue = textAreaObjVal;
					if(hintValue!=null && hintValue!=""){
						infoTextHObj.show();
						window.CD.module.data.Json.CLSData[cls].infoHintText='T';
						/*adjust position for T and F*/
						if(infoFvisible){
							var infoHX=infoTextHObj.getX();
							infoTextFObj.setX(infoHX+10);
						}
					}else{
						infoTextHObj.hide();
						window.CD.module.data.Json.CLSData[cls].infoHintText='F';
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
						window.CD.module.data.Json.CLSData[cls].infoFText='T';
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
						window.CD.module.data.Json.CLSData[cls].infoFText='F';
					}
					
					
				}
				 cdLayer.draw();
				 ds.setOutputData();	
			}
		},

		labelCancelEvent : function(){
			if(window.CD.elements.active.type == 'label' || window.CD.elements.active.type == 'dock') {
				var outputJSon = CLSData.getJsonData();
				//var outputJSon = updateJSon[CLSData];
				var adminData = CLSData.getJsonAdminData();
				var hintFeedbackParam = CLSData.getHintFeedbackFromJson();
				for(var cls in outputJSon){
					/* ----------- Label height & Width ------------ */
					$('#labelWidth').val(adminData.SLELD.split(',')[0]);
					$('#labelHeight').val(adminData.SLELD.split(',')[1]);
					
					/* --------------- Fill ----------------------- */
					if(outputJSon[cls].transparent == 'F'){
						$('#labelFillGlob').prop('checked',true);
					}else{
						$('#labelFillGlob').prop('checked',false);
					}
					/*----------------- Label Border ------------------ */
					if(outputJSon[cls].transparent_border == 'F'){
						$('#labelBorderGlob').prop('checked',true);
					}else{
						$('#labelBorderGlob').prop('checked',false);
					}

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
				
				var CLSCdata = window.CD.module.data.Json.CLSCData;
				
				for(var clsc in CLSCdata){
					/* --------------- Border for label Dock ------------- */
					if(CLSCdata[clsc].transparent_border == 'F'){
						$('#dockBorderGlob').prop('checked',true);
					}else{
						$('#dockBorderGlob').prop('checked',false);
					}
				}
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
			$('body').append(labelInfoIconDetail);
			
			$('body #labelInfoIconModal #'+newId).css('display','block');
			
			/* condition added to show info for 'Snap to Dock' */
			$('body #labelInfoIconModal #'+newId).find('.dont_show').each(function(){
				if($(this).hasClass('snap_to_dock')){
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
		
		toggleDistractor : function(makeDistracttor,activeElm) {	
			activeElm = activeElm || window.CD.elements.active.element
			var undoMng = window.CD.undoManager;
			var activeElmLength = activeElm.length;
			var activeOldElement = [];
			var cs = window.CD.services.cs;
		    var ds = window.CD.services.ds;
		    var cdLayer = cs.getLayer();
			for(var j=0;j<activeElmLength;j++){
	            var labelGroup = activeElm[j];
	            var distractorStatus = false;
	    		activeOldElement.push(activeElm[j]);
	    		
	            if(labelGroup.attrs.id.match(/^label_[0-9]+/)){
		            
		            var cls = CLSData.getCLSIndex(labelGroup.attrs.id);
		            var labelIndex = labelGroup.attrs.id.split('_')[1];
		            if(window.CD.module.data.Json.CLSData[cls].distractor == 'T') {
		            	distractorStatus = true;
		            	var lbConfig = new LabelConfig();
		            	labelGroup.children[0].setFill(lbConfig.style.fill);	            	
		            	window.CD.module.data.Json.CLSData[cls].distractor = 'F';
		            	this.labelGroupAssignControl(labelGroup,'');
		            	labelGroup.get('#addTxt_'+labelIndex)[0].setText('Add Label Text');
		            	$('#distractorLoc').prop('checked',false);
		            	
		            	if(window.CD.module.data.Json.CLSData[cls].transparent == 'F'){
		            		var lbConfig = new LabelConfig();
		            		var fillColor = lbConfig.style.fill;
							labelGroup.children[0].setFill(fillColor);
						}else{
							if(window.CD.module.data.Json.CLSData[cls].transparent == 'T'){
								labelGroup.children[0].setFill('transparent');
							}
						}
	            	
	            } else {
	    			var CLSLabelData = window.CD.module.data.Json.CLSData;
	    			var clsIndx = CLSData.getCLSIndex(labelGroup.attrs.id);
	    			CLSLabelData[clsIndx].class_set = "";
	    			var labelId = labelGroup.attrs.id;
	    			var lblIndex = labelId.split('_')[1];
	    			var txtBox = labelGroup.get('#txtBox_'+lblIndex)[0];
					var txtObj = labelGroup.get('#lbltxt_'+lblIndex)[0];
					var addTxt = labelGroup.get('#addTxt_'+lblIndex)[0];
					var textBoxGroup = labelGroup.get('#txtGrp_'+lblIndex)[0];
					var clsTextTool= new TextTool.commonLabelText();
					if(txtObj) {
						var flag = CLSView.checkForDuplicateText(txtObj,clsIndx);
						txtBox.show();
						if(flag == false){
							txtObj.remove();
							txtBox.setFill('#fff');
							addTxt.show();		
							addTxt.setFill('#000');
							CLSLabelData[clsIndx].label_value = '';
							}
						}
						if(window.CD.module.data.Json.CLSData[cls].transparent == 'F'){
							labelGroup.children[0].setFill('#faf8dd');
						}else{
							if(window.CD.module.data.Json.CLSData[cls].transparent == 'T'){
								labelGroup.children[0].setFill('transparent');
							}
						}
		            	
		            	cs.findObject(labelGroup,'selObjGrp_'+labelGroup.attrs.id).remove();
		            	window.CD.module.data.Json.CLSData[cls].distractor = 'T';
		            	window.CD.module.data.Json.CLSData[cls].visibility = true;
		            	if(flag == false){
		            		labelGroup.get('#addTxt_'+labelIndex)[0].setText('Add Distractor Text');
		            	}
		            	clsTextTool.bindLabelTextEvent(textBoxGroup);
		            	$('#distractorLoc').prop('checked',true);
		            }
		            
	            }
			}

            undoMng.register(this,CLSView.toggleDistractor,[distractorStatus,activeOldElement],'Undo cls make distractor',this,CLSView.toggleDistractor,[makeDistracttor,activeOldElement],'Redo cls make distractor')
            updateUndoRedoState(undoMng);
            cdLayer.draw();            
            ds.setOutputData();
		},
		/**
		 * This method is used for check if distractor text has duplicate
		 * value or not
		 * called from :: toggleDistractor()
		 */
		checkForDuplicateText : function(txtObj,clsIndx){
			try{
				var labelText = txtObj.getText();
				var flag = true;
				
				var CLSdata = window.CD.module.data.Json.CLSData;
				for(var clsc in CLSdata){
					var otherLblText = CLSdata[clsc].label_value;
					if(labelText == otherLblText && clsc != clsIndx){
						flag = false;
						break;
					}
				}
				return flag;
			}catch(err){
	 			console.error("@CLSView::Error on checkForDuplicateText::"+err.message);
	 		}
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
					imgGrp.remove();	
					
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
		
		/*********************************END--IMAGE undo redo related method*************************/
		
		
		/**
		 * function name: registerAudioUndoRedo() author:Piyali Saha
		 */
		registerAudioUndoRedo : function(thisObj,media_value,audioelem,labelGroup) {
			var undoMng = window.CD.undoManager;
			var cs = window.CD.services.cs;
			var oldObject = {};					
			var sle = window.CD.module.data.getLabelIndex(labelGroup.attrs.id);
			var jsonObj = window.CD.module.data.getJsonData();
			oldObject.x = jsonObj[sle].play_option_value.split('|')[0];
			oldObject.y = jsonObj[sle].play_option_value.split('|')[1];
			/*register undo redo*/
			undoMng.register(thisObj, cs.addAudiotoLabel, [media_value,oldObject,labelGroup], 'Undo audio delete',
					thisObj, cs.deleteAudio,[audioelem,'labelaudio'] , 'Redo audio');
			updateUndoRedoState(undoMng);
		},
		
		registerAudioUndoRedoDock : function(thisObj,node,audioelem,labelGroup) {
			var undoMng = window.CD.undoManager;
			var cs = window.CD.services.cs;
			var oldObject = {};	
			var jsonObj = window.CD.module.data.Json.CLSCData;
			oldObject.x = jsonObj[node].play_option_value.split('|')[0];
			oldObject.y = jsonObj[node].play_option_value.split('|')[1];
			var mediaVal = jsonObj[node].media_value;
			/*register undo redo*/
			undoMng.register(thisObj, cs.addAudiotoLabel, [mediaVal,oldObject,labelGroup], 'Undo audio delete',
					thisObj, cs.deleteAudio,[audioelem,'labelaudio'] , 'Redo audio');
			updateUndoRedoState(undoMng);
		},
		
		
		
		/**
		 * This method is used for updating hint/feedback placeholder
		 * position on undo
		 * By Nabonita Bhattacharyya
		 */
		updatePlaceHolderPosition : function(zhp,hintGroup){
			try{
				var cs = window.CD.services.cs;
				var cdLayer = cs.getLayer();
				var ds = window.CD.services.ds;
				var x = zhp.x;
				var y = zhp.y;
				var hintId = hintGroup.getId();
				hintGroup = cdLayer.get('#'+hintId)[0];
				hintGroup.setX(x);
				hintGroup.setY(y);
				CLSData.setHintFdbckToJson('','',x,y);
				ds.setOutputData();
				cdLayer.draw();
			}
			catch(err){
				console.error("@CLSView::Error on updatePlaceHolderPosition::"+err.message);
			}
		},
		
		/**
		 * This method is used for checking the availability of image in any label
		 * By Nabonita Bhattacharyya
		 * called from checkImageAvailableStatus() :: canvasservices.js
		 */
		imageAvailableStatusInLabel : function(imageName){
			try{
				var labelData  = window.CD.module.data.Json.CLSData;
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
				console.error("@CLSView::Error on imageAvailableStatusInLabel for image availability status::"+err.message);
			}
		},
		audioAvailableStatusInLabel : function(audioName){
			try{
				var labelData  = window.CD.module.data.Json.CLSData;
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
				console.log('@CLSView :: Error in imageAvailableStatusInLabel for image availability status'+err.message);
			}
		},
		
		/**
		 * For a label with height > width, if an image is added width width > height
		 * and long text is added to the label, then the position (top padding) of the image and text
		 * is modified using this method
		 */
		labelImageAndTextAdjust : function(lblGroup,callForGlobalTextHide){
			console.log('@labelImageAndTextAdjust :: CLSView');
			try{
				var clsTextTool= new TextTool.commonLabelText();
				var cs = window.CD.services.cs;
				var cdLayer = cs.getLayer();
				
				var txtGrpParentId = lblGroup.getId();
				var txtGrpObj = lblGroup.get('#txtGrp_'+txtGrpParentId.split('_')[1])[0];
				
				
				var txtGrpId = txtGrpObj.attrs.id.split('_')[1];
				var textBoxGrpObj=txtGrpObj.get('#txtBox_'+txtGrpId)[0];
				
				var imgObj=lblGroup.get('#img_'+txtGrpParentId)[0];
				if(txtGrpObj.get('#lbltxt_'+txtGrpId)[0])
					var textHeight = txtGrpObj.get('#lbltxt_'+txtGrpId)[0].getHeight();
				else
					var textHeight = txtGrpObj.get('#addTxt_'+txtGrpId)[0].getHeight();
				if($('#hideTextLoc').is(':checked') && !(callForGlobalTextHide)){
					textHeight = 0;
				}
				
				var textHeight = 0;
				var hideStatus = txtGrpObj.getVisible();
				if(hideStatus == true){
					if(!($('#hideTextLoc').is(':checked'))){
						if(window.CD.module.data.textGroupComponent.length > 0){
							var count = txtGrpObj.children.length-1;
							var lastChild = clsTextTool.findLastTextchild(txtGrpObj,count);
							textHeight = txtGrpObj.children[lastChild].getY() + txtGrpObj.children[lastChild].getHeight();
						}
						else
							textHeight = txtGrpObj.get('#addTxt_'+txtGrpId)[0].getHeight();
					}
				}			
				
				
				var imgHeight = 0;
				var imageBuffer = 0;
				
				if(imgObj){
					imgHeight = imgObj.getChildren(0)[0].getHeight();
					imageBuffer = 3;
				}
				var labelGrpHeight = parseInt(lblGroup.children[0].getHeight());
				var spaceRemain = (labelGrpHeight-parseInt(imgHeight)-textHeight)/2;
				if(spaceRemain<10)
					spaceRemain = 10;
				if(imgObj){
					imgObj.children[0].setY(0);
					imgObj.setY(spaceRemain);
				}
				var changeY=parseInt(spaceRemain+imgHeight+imageBuffer);
				if ($('#showHiddenTxtGlobal').is(':checked')) {
					if(window.CD.module.data.textGroupComponent.length > 0){
						var count = txtGrpObj.children.length-1;
						var lastChild = clsTextTool.findLastTextchild(txtGrpObj,count);
						var textHeight = txtGrpObj.children[lastChild].getY() + txtGrpObj.children[lastChild].getHeight();
					}
					else
						textHeight = txtGrpObj.get('#addTxt_'+txtGrpId)[0].getHeight();
					changeY=parseInt((lblGroup.children[0].getHeight()-textHeight)/2);
	     	    }
	     	    
	     	    //Added image Height check to set text to vertical align to label bottom when image loading is slow and system not able to get image height
	     	    if(parseInt(imgHeight) > 0){
	     	    	txtGrpObj.setY(parseInt(imgHeight)+parseInt(imageBuffer)+parseInt(spaceRemain));	
	     	    }else{
	     	    	txtGrpObj.setY((parseInt(labelGrpHeight) - parseInt(textHeight))/2);
	     	    }
				
		 		cdLayer.draw();
			}catch(err){
				console.error("@CLSView::Error on labelImageAndTextAdjust::"+err.message);
			}
		},
		toggleSloppy : function(sloppy){
			try{
				var ds = window.CD.services.ds;
				var cs = window.CD.services.cs;
				var activeElement = window.CD.elements.active.element[0];
				if(sloppy == true){
					window.CD.module.data.Json.CLSGP.toggleSPGlobal = 'F';
				}else{
					window.CD.module.data.Json.CLSGP.toggleSPGlobal = 'T';
				}
			}
			catch(err){
				console.error("@CLSView::Error on toggleSloppy::"+err.message);
			}
		},
		labelTextOTM : function(txtGrpId,textValue,txtGrpObj){
			try{
				txtGrpObj.get('#lbltxt_'+txtGrpId)[0].setText(textValue);
				return txtGrpObj;
			}
			catch(err){
				console.log('@CLSView :: Error in labelTextOTM() clsView::'+err.message);
			}
		},
		setActiveLabelPosition : function(labelGrp){
			console.log('@setActiveLabelPosition :: CLSView');
			var activeElm = window.CD.elements.active.element;
			var activeElmArray = [];
			var activeElmNewX = [];
			var activeElmNewY = [];
			var activeElmOldX = [];
			var activeElmOldY = [];
			var groupIdArr = [];
			var activeElmLength = window.CD.elements.active.element.length;
			var activeDockArray = [];
			for(var j=0;j<activeElmLength;j++){
				activeElmArray.push(window.CD.elements.active.element[j]);
				groupIdArr.push(window.CD.elements.active.element[j].attrs.id)
			}
			var undoMng = window.CD.undoManager;
			var ds = window.CD.services.ds;
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var labelId = labelGrp.attrs.id;
			var labelGrpJsonId = CLSData.getCLSIndex(labelId);
			var changedX = labelGrp.getX() - window.CD.module.data.Json.CLSData[labelGrpJsonId].holder_x;
			var changedY = labelGrp.getY() - window.CD.module.data.Json.CLSData[labelGrpJsonId].holder_y;
			for(var i=0;i<activeElmLength;i++){
				var cls = CLSData.getCLSIndex(window.CD.elements.active.element[i].attrs.id);
				if(cls == labelGrpJsonId){
					var oldX = window.CD.module.data.Json.CLSData[cls].holder_x;
					var oldY = window.CD.module.data.Json.CLSData[cls].holder_y;
					window.CD.module.data.Json.CLSData[cls].holder_x = labelGrp.getX();
					window.CD.module.data.Json.CLSData[cls].holder_y = labelGrp.getY();
					var newX = labelGrp.getX();
					var newY = labelGrp.getY();
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
					
					var oldX = window.CD.module.data.Json.CLSData[cls].holder_x;
					var oldY = window.CD.module.data.Json.CLSData[cls].holder_y;
					window.CD.module.data.Json.CLSData[cls].holder_x = newX;
					window.CD.module.data.Json.CLSData[cls].holder_y = newY;	
				}
				
			activeElmNewX.push(newX);
			activeElmNewY.push(newY);
			activeElmOldX.push(oldX);
			activeElmOldY.push(oldY);
			ds.setOutputData();
			}
			labelGrp.parent.getLayer().draw();
			cdLayer.draw();
			undoMng.register(this, CLSView.setLabelGroupPosition,[activeElmArray,activeElmOldX,activeElmOldY,groupIdArr] , 'Undo Label position',this, CLSView.setLabelGroupPosition,[activeElmArray,activeElmNewX,activeElmNewY,groupIdArr] , 'Redo Label position');
			updateUndoRedoState(undoMng);
		},
		
		/**
		 * This method is used for hint,feedback flag removal 
		 * when hint/feedback value is blank
		 */
		removeHintFeedbackFlag : function(lblGroup,hint,feedback){
			console.log("@removeHintFeedbackFlag :: CLSView");
			try{
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
			}catch(err){
				console.error("Error @removeHintFeedbackFlag :: CLSView "+err.message);
			}
		},
		
		setActiveDockPosition : function(labelGrp){
			console.log('@setActiveDockPosition :: CLSView');
			var activeElm = window.CD.elements.active.element;
			var activeElmArray = [];
			var activeElmNewX = [];
			var activeElmNewY = [];
			var activeElmOldX = [];
			var activeElmOldY = [];
			var groupIdArr = [];
			var activeElmLength = window.CD.elements.active.element.length;
			var activeDockArray = [];
			for(var j=0;j<activeElmLength;j++){
				activeElmArray.push(window.CD.elements.active.element[j]);
				groupIdArr.push(window.CD.elements.active.element[j].attrs.id)
			}
			var undoMng = window.CD.undoManager;
			var ds = window.CD.services.ds;
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var labelId = labelGrp.attrs.id;
			var labelGrpJsonId = CLSData.getCLSCIndex(labelId);
			var changedX = 0;
			var changedY = 0;
			if(labelGrpJsonId){
				changedX = labelGrp.getX() - window.CD.module.data.Json.CLSCData[labelGrpJsonId].xpos;
				changedY = labelGrp.getY() - window.CD.module.data.Json.CLSCData[labelGrpJsonId].ypos;	
			}
			
			for(var i=0;i<activeElmLength;i++){
				var cls = CLSData.getCLSCIndex(window.CD.elements.active.element[i].attrs.id);
				if(cls == labelGrpJsonId){
					var oldX = window.CD.module.data.Json.CLSCData[cls].xpos;
					var oldY = window.CD.module.data.Json.CLSCData[cls].ypos;
					window.CD.module.data.Json.CLSCData[cls].xpos = labelGrp.getX();
					window.CD.module.data.Json.CLSCData[cls].ypos = labelGrp.getY();
					var dockId=labelGrp.getId();
					var dockHeadingId = window.CD.module.data.Json.CLSCData[cls].dockHeadingId;
					var dockTxtGrp = labelGrp.parent.parent.get('#'+dockHeadingId)[0];
					/** If dock heading text is not present on drag it was getting error **/
					if(dockTxtGrp){
						var dockWith = labelGrp.children[0].getWidth();
						var docktextWidth = dockTxtGrp.children[0].getWidth();
						dockTxtGrp.setX(labelGrp.getX() - ((docktextWidth - dockWith)/2));
						dockTxtGrp.setY(labelGrp.getY()-parseInt(dockTxtGrp.children[0].getHeight()));
						var canvasTextTool=new TextTool.canvasText();
						canvasTextTool.setClsTextListData(dockTxtGrp);
						
						var parentLayer=dockTxtGrp.getLayer();
						if(parentLayer && parentLayer.attrs.id==="text_layer"){
						  	   parentLayer.draw();
						}
					}
					
					var newX = labelGrp.getX();
					var newY = labelGrp.getY();
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
					
					var oldX = window.CD.module.data.Json.CLSCData[cls].xpos;
					var oldY = window.CD.module.data.Json.CLSCData[cls].ypos;
					var dockId=window.CD.elements.active.element[i].getId();
					var dockHeadingId = window.CD.module.data.Json.CLSCData[cls].dockHeadingId;
					var dockTxtGrp = window.CD.elements.active.element[i].parent.parent.get('#'+dockHeadingId)[0];
					var dockWith = window.CD.elements.active.element[i].children[0].getWidth();
					var docktextWidth = dockTxtGrp.children[0].getWidth();
					dockTxtGrp.setX(window.CD.elements.active.element[i].getX() - ((docktextWidth - dockWith)/2));
					dockTxtGrp.setY(window.CD.elements.active.element[i].getY()-parseInt(dockTxtGrp.children[0].getHeight()));
					var canvasTextTool=new TextTool.canvasText();
					canvasTextTool.setClsTextListData(dockTxtGrp);
					var parentLayer=dockTxtGrp.getLayer();
					if(parentLayer && parentLayer.attrs.id==="text_layer"){
					  	   parentLayer.draw();
					}
					window.CD.module.data.Json.CLSCData[cls].xpos = newX;
					window.CD.module.data.Json.CLSCData[cls].ypos = newY;	
				}
				
			activeElmNewX.push(newX);
			activeElmNewY.push(newY);
			activeElmOldX.push(oldX);
			activeElmOldY.push(oldY);
			ds.setOutputData();
			}
			labelGrp.parent.getLayer().draw();
			cdLayer.draw();
			undoMng.register(this, CLSView.setDockGroupPosition,[activeElmArray,activeElmOldX,activeElmOldY,groupIdArr] , 'Undo Label position',this, CLSView.setDockGroupPosition,[activeElmArray,activeElmNewX,activeElmNewY,groupIdArr] , 'Redo Label position');
			updateUndoRedoState(undoMng);
		}
};

