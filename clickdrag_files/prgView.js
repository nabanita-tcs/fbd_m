var PRGView = {
	init: function(prgJson,cnvConfig) {
		console.log("@PRGView.init::");
		try{
	
			var propdiv = $('#propertiesLabel');
			var labeldivPRG = window.CD.util.getTemplate({url: 'resources/themes/default/views/layout_mode_design_PRG.html?{build.number}'});
			propdiv.append(labeldivPRG);
			if(prgJson.PRGPS.sentenceReorder == "T"){
				$('#instructionText').css('display','block');
			}
			$('#cdInspector .tab_view').on('click',function(){
				if($(this).hasClass('inactive')){
					$('#' + $(this).siblings('.tab_view.active').attr('name')).hide();
					$(this).siblings('.tab_view.active').removeClass('active').addClass('inactive');
					$(this).removeClass('inactive').addClass('active');
					$('#' + $(this).attr('name')).show();
	
					/* For Label Inspector div append*/
					if( $(this).attr('name') == 'localDiv' && $('#localDivInactive').length == 0 && (window.CD.elements.active.type != 'label' && window.CD.elements.active.type != 'dock')){
						PRGView.makeLabelLocalDisable();
					}
				}
			});			
			
			PRGView.attachPublishEvents();
			
			/* ------------- Events bind for each view ----------- */
			PRGView.bindInspectorEvents();
			$('#inspectorInsertImage').addClass('inactive');
			//if(prgJson.FrameData.length > 0){
			window.CD.services.cs.drawGuides(prgJson.adminData.HGL,prgJson.adminData.VGL,cnvConfig);
			window.CD.module.frame.init(prgJson.FrameData);
			console.dir(prgJson);
	
			//}
			this.showPRGLabel(prgJson);
		}catch(err){
			console.error("Error in PRGView::"+err.message);
		}
	},
	attachPublishEvents: function(){
		/* for I am Done button*/
		$('#toolPalette .right_tool span#done').off('click').on('click',function(){				
			var labelModal = window.CD.util.getTemplate({url: 'resources/themes/default/views/publishing_PRG_modal.html?{build.number}'});
			$('#labelModal').remove();
		    $('body').append(labelModal);
			$('#labelModal').css('left', (($('#toolPalette').width()/2) - ($('#labelModal').width()/2))+'px');
			$('#labelModal').css('top', (($('#canvasHeight').val()/2) - ($('#labelModal').height()/2))+'px');
			if(window.CD.module.data.getJsonAdminData()['RLO'] == 'T'){
				$('#scramble').prop('checked',true);
			}else{
				if(window.CD.module.data.getJsonAdminData()['RLO'] == 'F'){
					$('#scramble').prop('checked',false);
				}
			}
			 $("#publishCancel").off('click').on('click',function(){
				  $('#labelOverlay').remove();
				  $('#labelModal').slideUp(200);
				 // $('.tool_select').trigger('click');
			  });
			 $("#publishOk").off('click').on('click',function(){
				 if($('#scramble').prop('checked') == true){
						window.CD.module.data.getJsonAdminData()['RLO'] = 'T';
					}else{
						window.CD.module.data.getJsonAdminData()['RLO'] = 'F';
					}
				 window.CD.services.ds.setOutputData();
				  $('#labelOverlay').remove();
				  $('#labelModal').slideUp(200);
				 // $('.tool_select').trigger('click');
			 });
		});
	},
	showPRGLabel: function(prgJson) {
		console.log('@PRGView.showPRGLabel');
		var util = window.CD.util;	
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var stg = cs.getCanvas();
		var cdLayer = cs.getLayer();
		var lbConfig = new LabelConfig();
		var dockConfig = new DockConfig();
		//var lbGroup = cs.findGroup(lbConfig.p_id);
		var undoMng = window.CD.undoManager;
		var prgDockData = prgJson.PRGData.PRGDockData;
		c = 0;
		var prgLabelData = prgJson.PRGData.PRGLabelData;
		d = 0;
		for(var key in prgLabelData){
			var val = prgLabelData[key];
			lbConfig.id = 'label_' + d;			
			var lblGrpOptions = {draggable:true,x:parseInt(val.term_pos_x),y: parseInt(val.term_pos_y)};
			var lbGroup = cs.createGroup('label_'+d,lblGrpOptions);
			var ldwidth = parseInt(prgJson.adminData.SLELD.split(',')[0]);
			var ldheight = parseInt(prgJson.adminData.SLELD.split(',')[1]);
			var labelfill = '',strokeWidth=1,strokeEn=false;
			var textBoxBuffer = 20;
			var undoMng = window.CD.undoManager;
			
			if(val.current_item_transparency_border === 'F'){
				strokeWidth = 1;
				strokeEn = true;
			}else{
				strokeWidth = 0;
				strokeEn = false;
			}
			
			if(val.current_item_transparency === 'T'){
				labelfill = 'transparent';
			}else{
				labelfill = lbConfig.style.fill;
			}
			
			
			var label = new Kinetic.Rect({
                width: ldwidth,
                height: ldheight,
                stroke: '#999999',
                strokeWidth: strokeWidth,
                cornerRadius: 5,
                strokeEnabled: strokeEn,
                fill: labelfill,
                opacity : 1,
                id:'lbl_' + d			                
			});
			cdLayer.add(lbGroup);
			lbGroup.add(label);
			
			val.labelGroupId = lbConfig.id;
			
			if(val.distractor_label == 'T'){
				var distractorFillColor = '#faf8dd';
				label.setFill(distractorFillColor);
			}
			if(val.current_item_transparency == 'T' && val.distractor_label == 'F'){
				label.setFill('transparent');
			}
			var textBoxGroup = cs.createGroup('txtGrp_'+d,{'x':10,'y':(ldheight-20)/2});
			var textBox = new Kinetic.Rect({
                width: ldwidth-20,
                height: 15,
                fill: '#ffffff',
                opacity:1,
                id:'txtBox_'+d
   			});
			var addTextObj = new Kinetic.Text({		        	
				text: 'Add Distractor Text',
		        fontSize: 14,
		        y:2,
		        fontFamily: 'sans-serif',
		        fill: '#555',  
		        width: ldwidth-20,
		        height: 'auto' ,
		        opacity: '1',
		        verticalAlign:'top',
	            id: 'addTxt_'+d,
	            name: 'nametxt',
	            align : 'center'
	          });		
			textBoxGroup.add(textBox);
			textBoxGroup.add(addTextObj);
			lbGroup.add(textBoxGroup);
			textBoxGroup.moveToTop();
			textBoxGroup.setY((label.getHeight() - addTextObj.getHeight())/2);	
			
			if(val.term != '') {						
				 /*checking sb and sp tag in a text*/
				var textValue=val.term;
				
				var textFormat = new TextFormat();
				var commonTextTool= new TextTool.commonLabelText();
				if(commonTextTool.checkSubOrSuperTagExist(textValue)){
					//textValue=commonTextTool.convertSbSpscript(textValue);	
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
				
				var textBoxGroup = textFormat.createLabelText(textBoxGroup,textValue,align); 
				if(val.textFormat.underline_value == "T"){
					var textObj = textBoxGroup;
					if(textObj){
						$("#UnderlinetTool").data('clicked', true);
					}
				}
				
				textBox.setFill("transparent");
				addTextObj.hide();
				
				/** -- for text align middle -- **/
				var count = textBoxGroup.children.length-1;
				var lastChild = commonTextTool.findLastTextchild(textBoxGroup,count);
				var textGrpHeight = textBoxGroup.children[lastChild].getY() + textBoxGroup.children[lastChild].getHeight();
				var topPadding = (textBoxGroup.parent.children[0].getHeight()-textGrpHeight)/2;
				if(topPadding < 0)
					topPadding = 0;		
				textBoxGroup.setY(topPadding);
				
			}/*else{
				 textHeight = textBoxGroup.get('#addTxt_'+d)[0].getHeight();
				 var topPadding = parseInt((textBoxGroup.parent.children[0].getHeight()-textHeight)/2);
				 textBoxGroup.setY(topPadding);
			 }*/
			
			
			
			
			var prgTextTool= new TextTool.commonLabelText();
			prgTextTool.bindLabelTextEvent(textBoxGroup,'prg');
			
			var isDraggable = true;
			if(val.lockStatus)
				isDraggable = false;
			
			makePRGResizable(lbGroup, ldwidth, ldheight);
			cs.dragLockUnlock(lbGroup,ldwidth,ldheight,isDraggable);
			
			if(val.textFormat.underline_value == "T"){
				 var baseLabelTxtTool= new TextTool.commonLabelText(); 
				 var textObj = lbGroup.get('#txt_'+lbGroup.attrs.id.split('_')[1])[0];
				 if(textObj)
				 baseLabelTxtTool.applyTextUnderline(textObj,textObj.parent,true);
				 $("#UnderlinetTool").data('clicked', true);
			}
			if(val.media_PRGT_value != "N" && val.media_PRGT_value){
				var audioGrpId = 'audio_' + lbGroup.attrs.id;
				var x = parseInt(val.coor_PRGT_value.x);
				var y = parseInt(val.coor_PRGT_value.y);
				loadAudioImage(lbGroup,audioGrpId,val.media_PRGT_value,x,y ,true);			
			}
			
			
			lbGroup.on('mousedown',function(evt){
				cs.setActiveElement(this,'label');
				evt.cancelBubble = true;
				cs.updateDragBound(this);
				openInspector('label');
				window.CD.services.cs.updateMoveToTopBottomState(this);
				//this.moveToTop();
			});
			
			lbGroup.on('click',function(evt){
				evt.cancelBubble = true;
			});
			
			lbGroup.on('dragend',function(evt){
				evt.cancelBubble = true;
				/*var prg = PRGData.getLabelIndex(this.attrs.id);
				undoMng.register(this, PRGView.setLabelGroupPosition,[this,PRGData.Json.PRGData.PRGLabelData[prg].term_pos_x,PRGData.Json.PRGData.PRGLabelData[prg].term_pos_y] , 'Undo Dock drag drop Label',this, PRGView.setLabelGroupPosition,[this,this.getX(),this.getY()] , 'Redo Dock drag drop Label');
				updateUndoRedoState(undoMng);
				PRGData.Json.PRGData.PRGLabelData[prg].term_pos_x = this.getX();
				PRGData.Json.PRGData.PRGLabelData[prg].term_pos_y = this.getY();*/
				PRGView.setActiveLabelPosition(this);
				ds.setOutputData();	
			});
			if(val.zIndex == undefined){
				var prg = PRGData.getLabelIndex(lbGroup.attrs.id);
				PRGData.Json.PRGData.PRGLabelData[prg].zIndex = lbGroup.getZIndex();
			}

			if(d==0){
				var labelData = PRGData.getInspectorLabelData();
				PRGView.activelabelData(labelData,lbGroup);
				PRGView.populateLabelData(false,labelData);
			}
			d++;
		
		}
		for(var key in prgLabelData){
			var label = cdLayer.get('#'+prgLabelData[key].labelGroupId)[0];
			label.setZIndex(prgLabelData[key].zIndex);
		}
		for(key in prgDockData){
			var val = prgDockData[key];
			c = prgDockData[key].dockGroupId.split('dock_label_')[1];
			var dockGrpOptions = {draggable:true,x:parseInt(val.PRG_sentence_list_x),y: parseInt(val.PRG_sentence_list_y)};
			var dockGroup = cs.createGroup('dock_label_'+c,dockGrpOptions);			
			var docwidth = parseInt(prgJson.DCKLD.split(',')[0]);
			var docheight = parseInt(prgJson.DCKLD.split(',')[1]);
			var strokeWidth = 0;
			var strokeEn = false;			
			var isDraggable = true;
			if(val.lockStatus)
				isDraggable = false;
		
			var strokeWidth = 1;
			var strokeColor = '#999999'
			var strokeEn = false;
			var fillColor = 'transparent'
			var transOpacity = 0;
			var dashArrayValue = [10, 5];
			var dashArrayEnabled = true;
			var buffer = 20;
			
			var dock = new Kinetic.Rect({					
                width: docwidth,
                height: docheight,						                
                stroke: '#999999',
                strokeWidth: 1,
                cornerRadius: 5,
                strokeEnabled: true,
                fill: '#ffffff',
                id:'dock_label'+c	               
   			});
			cdLayer.add(dockGroup);
			dockGroup.add(dock);
			makePRGResizable(dockGroup, docwidth, docheight);	
			cs.dragLockUnlock(dockGroup,docwidth,docheight,!val.lockStatus);			
			
			cdLayer.draw();	
			val.dockGroupId = 'dock_label_'+c;
			
			var textBoxGroup = cs.createGroup('dock_txtGrp_'+c,{'x':10,'y':(docheight-20)/2});
			var textBox = new Kinetic.Rect({
                width: docwidth-20,
                height: 15,
                fill: '#ffffff',
                opacity:1,
                id:'dock_txtBox_'+c
   			});
			var addText = new Kinetic.Text({		        	
				text: 'Add Dock Text',
		        fontSize: 14,
		        fontFamily: 'sans-serif',
		        fill: '#555',  
		        width: docwidth-20,
		        height: 'auto',
		        opacity: '1',
		        verticalAlign:'top',
	            id: 'dock_addTxt_'+c,
	            name: 'nametxt',
	            align : 'center'
	          });		
			textBoxGroup.add(textBox);
			textBoxGroup.add(addText);
			dockGroup.add(textBoxGroup);
			textBoxGroup.moveToTop();
			/* TEXT */
			if(val.sentence) {			
				
				/*checking sb and sp tag in a text*/
				var textValue=val.sentence;
				var dockTextTool= new TextTool.dockText();
				//if(dockTextTool.checkSubOrSuperTagExist(textValue)){
					//textValue=dockTextTool.changeSubscriptSuperScript(textValue);	
				//}
				if(window.CD.module.data.Json.adminData.OTO == true){
					var txtGrpObj = dockTextTool.createText(textValue,textBoxGroup,val.textFormat,'','showPRGLabelForOTO');
				}else{
					var txtGrpObj = dockTextTool.createText(textValue,textBoxGroup,val.textFormat,'','showPRGLabelForOTM');
				}
				
				 if(val.textFormat.underline_value == "T"){
					 dockTextTool.applyTextUnderline(txtGrpObj);			  
				 }
				 var textGroupArr = dockTextTool.getTextObjFromGroupObject(txtGrpObj);
				 if(txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0] && PRGData.prgOtoDuplicateElm != true){
					    var textGrpHeight = textGroupArr[textGroupArr.length-1].getY() + textGroupArr[textGroupArr.length-1].getHeight()- txtGrpObj.getY();//For CTCD-221
						txtGrpObj.get('#dock_txtBox_'+txtGrpId)[0].setFill("transparent");
						txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0].hide();
						txtGrpObj.setY((txtGrpObj.parent.children[0].getHeight()-textGrpHeight)/2);
				}
				 dockTextTool.bindLabelTextEvent(txtGrpObj);
				
			} else {
				addText.show();	
				addText.parent.setY((dock.getHeight() - addText.getTextHeight())/2);
			}	
			 if(val.current_SLED_item_transparency == "T"){
				 dock.setFill('transparent');
				 //dock.setStrokeWidth(0);
				 dock.setStroke('rgba(0,0,0,0)');
			 }
			 if(val.media_PRG_value != "N"){
					var audioGrpId = 'audio_' + dockGroup.attrs.id;
					var x = parseInt(val.coor_PRG_value.x);
					var y = parseInt(val.coor_PRG_value.y);
					loadAudioImage(dockGroup,audioGrpId,val.media_PRG_value,x,y, true);			
				}
			
			addText.on("click tap",function(evt){
				var prgTextTool= new TextTool.dockText();
				prgTextTool.textSetActive(this.parent, 'docktext');
				
				var textGrp = this.parent;				
				var evtObj = {selectorObj:textGrp,x:textGrp.getAbsolutePosition().x,y:textGrp.getAbsolutePosition().y+$('canvas').first().offset().top};
				var prgTextTool= new TextTool.dockText();
				prgTextTool.createTextBoxForLabel(evtObj);	
				prgTextTool.createMaskOnCanvas();
				$('#textToolContainer').css('z-index',100);
				evt.cancelBubble = true;
			});
			
			addText.on("dblclick dbltap",function(evt){	
				var textGrp = this.parent;				
				var evtObj = {selectorObj:textGrp,x:textGrp.getAbsolutePosition().x,y:textGrp.getAbsolutePosition().y+$('canvas').first().offset().top};
				var prgTextTool= new TextTool.dockText();
				prgTextTool.createTextBoxForLabel(evtObj);			
				evt.cancelBubble = true;
			});		
			
			dockGroup.on('mousedown',function(evt){			
				cs.setActiveElement(this,'dock');
				PRGView.showSavedHint(this);
				evt.cancelBubble = true;
				cs.updateDragBound(this);
				openInspector('label');
				this.moveToTop();
			});
			
			dockGroup.on('click',function(evt){
				evt.cancelBubble = true;
			});
			
			dockGroup.on('dragstart',function(evt){
				evt.cancelBubble = true;
				PRGView.hideIns();
			});
			
			dockGroup.on('dragend',function(evt){
				
				if(window.CD.module.data.Json.PRGPS.sentenceReorder == 'T'){
					if(window.CD.elements.active.element.length == 1){
						evt.cancelBubble = true;
						var dockElm = [];
						var yIndexArr = [];
						dockElm.push(window.CD.elements.active.element[0]);
						var noLayerElm = window.CD.elements.active.element[0].parent.children.length;
						for(var e=0; e<noLayerElm; e++){
							if(window.CD.elements.active.element[0].parent.children[e].attrs.id){
								if(window.CD.elements.active.element[0].parent.children[e].attrs.id.match(/^dock_label_[0-9]+/) && (window.CD.elements.active.element[0].parent.children[e].attrs.id != window.CD.elements.active.element[0].attrs.id)){
									dockElm.push(window.CD.elements.active.element[0].parent.children[e]);
								}
							}
						}
						var noOfDock = dockElm.length;
						for(var key in window.CD.module.data.Json.PRGData.PRGDockData){
							yIndexArr.push(window.CD.module.data.Json.PRGData.PRGDockData[key].PRG_sentence_list_y);
						}
						var temp;
						for(var i=0;i<yIndexArr.length;i++){
							for(var j=i+1;j<yIndexArr.length;j++){
								if(yIndexArr[i]>yIndexArr[j]){
									temp=yIndexArr[i];
									yIndexArr[i]=yIndexArr[j];
									yIndexArr[j]=temp;
								}
							}
						}
						var flag = false;
						var prg = PRGData.getDockIndex(this.attrs.id);
						var firstElmY = window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_y;
						for(var j=1;j<noOfDock;j++){
							if(firstElmY >= yIndexArr[j]){
								flag = true;
							}
						}
						if(flag == false && noOfDock>1){
							PRGView.setActiveDockPositionForOTM(this,dockElm,yIndexArr);
						}else{
							PRGView.setActiveDockPosition(this)	
						}
						
						ds.setOutputData();	
						PRGView.hideIns();
					}else{
						evt.cancelBubble = true;
						PRGView.setActiveDockPosition(this);
						ds.setOutputData();	
						PRGView.hideIns();
					}
				}else{
					evt.cancelBubble = true;
					PRGView.setActiveDockPosition(this);
					ds.setOutputData();	
					PRGView.hideIns();
				}
				cdLayer.draw();
			});
			cdLayer.draw();
			var param={
					dockGrpID:dockGroup.attrs.id,
					dockGrpObj:dockGroup,
					dockData:'',
					infoHideText:val.infoHideText,
					infoHintText:val.sentence_hint,
					infoFeedbackText:val.feedback,
					showLabel:true
		   }
		    PRGView.createInfoTextObject(param);
			if(c==0){
				var dockData = PRGData.getInspectorLabelData();
				PRGView.activelabelData(dockData,dockGroup);
				PRGView.populateLabelData(false,dockData);
			}
			//c++;
		}
		this.setIns();
		
		if(cs.objLength(prgJson.PRGData.PRGDockData) > 0){
			var prgVal = prgJson.PRGData.PRGDockData.PRGS0;
			var adminData = PRGData.getJsonAdminData();
			var hintFeedbackType = adminData.showHintOrFeedbackInAuthoring;
			var hintJson = PRGData.getHintParameterFromJson();
			
			var feedbackType = adminData.FRO;
			if(feedbackType == 'D')feedbackType == 'dock';
			
			var hintType = adminData.HRO;
			if(hintType == 'D')feedbackType == 'dock';
			
			if(hintFeedbackType == 'hint' || hintFeedbackType == 'feedback'){
				PRGView.bindFeedbackHintEventAllLabel(hintFeedbackType,hintType,feedbackType);
				if(hintFeedbackType == 'hint')
					PRGView.createHintGroupAuth(parseInt(hintJson.w),parseInt(hintJson.h),parseInt(hintJson.x),parseInt(hintJson.y));
				if(hintFeedbackType == 'feedback')
					PRGView.createHintGroupAuth(parseInt(adminData.feedbackWidth),parseInt(adminData.feedbackHeight),parseInt(hintJson.x),parseInt(hintJson.y));
			}
		}
		
		
		cdLayer.draw();
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
								 window.CD.module.view.createNewSentence($('.label_options .label_count').val(),$('.label_options .distractor_count').val());
						    }else
						    	//$("#labelContainer #lable_warning").show();
						    	validation.showLabelErrorPOPUP(6);				   
					}else{
						
						 if($('.label_options .label_count').val() > 15 || $('.label_options .distractor_count').val() > 15){
							 validation.showLabelErrorPOPUP(1);			
			                  }
						 if(($('.label_options .label_count').val() == "" && $('.label_options .distractor_count').val() != "")||($('.label_options .label_count').val() != "" && $('.label_options .distractor_count').val() == "")){
							 validation.showLabelErrorPOPUP(5);			
			                  }
						 
						 if($('.label_options .label_count').val() == 0 && $('.label_options .distractor_count').val()== 0){
							  validation.showLabelErrorPOPUP(5);
			                  }	     
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
      $('#labelOrBlock').html('<span>text block(s)</span>');
      
      /* alignment issue */
      $('#labelOrBlock').css('width','50%');//textblock 'td'
      $('.distractor_count').parent('td').css('width','50%');//distractor 'td'
      /* -------------- */
	  
      //$('#labelAlertText').html('<span class="heading_text">'+ds.getOptionLabelText()+'</span>');
      /* Create label text change as per requirement in prod issue */
      $('#labelModal #labelCount').text('How many text blocks would you like to create? (Labels are created automatically.)');
      $('#labelModal').css('left', (($('#toolPalette').width()/2) - ($('#labelModal').width()/2))+'px');
	  $('#labelModal').css('top', (($('#canvasHeight').val()/2) - ($('#labelModal').height()/2))+'px');
	  $('#labelModal').slideDown(200);
	  },
	createNewSentence : function(totalLabelToCreate,totalDistractorsToCreate) {
		console.log("@LabelTool.createLable.execute::");console.log("@window.CD.services.labeltool.createLabel");
		try{
			var cs = window.CD.services.cs;
			var stg = cs.getCanvas();
			var cdLayer = cs.getLayer();
			var lbConfig = new LabelConfig();
			var dockConfig = new DockConfig();
			var ds = window.CD.services.ds;	
			var undoMng = window.CD.undoManager;
			//var totalLabelToCreate = ds.totalElm;
			//console.info("lbConfig.p_id::"+lbConfig.p_id);
			var dockCount = cs.objLength(PRGData.Json.PRGData.PRGDockData);
			var dockGroupStartId = dockCount;
			var dockWidth = dockConfig.style.width;
			var dockHeight = dockConfig.style.height;
            var totdockLbl = 0,isDistractor = false,c=0,d=0,x=0;
            
                       
            if(dockCount) {
				var dockGroupId = PRGData.Json.PRGData.PRGDockData.PRGS0.dockGroupId;
				var dockGroup = cs.findGroup(dockGroupId);
				dockGroupStartId = PRGData.getDockStartId();			
				dockWidth = dockGroup.children[0].getWidth();
				dockHeight = dockGroup.children[0].getHeight();
			}
           
            totalLabelToCreate = parseInt(totalLabelToCreate);
            totalDistractorsToCreate = parseInt(totalDistractorsToCreate);
            if(totalDistractorsToCreate> 0){  
            	this.createDistractor(totalDistractorsToCreate);
            }
            
			var totlblCount = dockGroupStartId + totalLabelToCreate;
           
			var overLapVal = 0;
            var canvasHeight = parseInt(stg.getHeight());
            var dockHeight = parseInt(dockConfig.style.height);
            var newCanvasHeight = (canvasHeight-70)-dockHeight;
            /** ******** Modified for label overlap ******** **/
            var approxAllLabelSpace = parseInt(totlblCount)*parseInt(dockHeight);
            if(approxAllLabelSpace>newCanvasHeight){
            	overLapVal = newCanvasHeight/parseInt(totlblCount);
            }else{
            	newCanvasHeight = approxAllLabelSpace;
            	overLapVal = newCanvasHeight/parseInt(totlblCount);
            }
			for(var i = dockGroupStartId; i<totlblCount; i++) {	
				var dockData = cs.cloneObject(prgDockDefaults);	
				var holder_x = 100;
				var holder_y = 50 + (i*parseInt(overLapVal));
				//var doc_x = 300;
				var doc_x = 50+dockConfig.style.width;
				var doc_y = 50 + (i*parseInt(overLapVal));
				var dockGrpOptions = {draggable:true,x:doc_x,y:doc_y };
				var lblGrpOptions = {draggable:true,x:holder_x,y: holder_y};
				
				dockData.PRG_sentence_list_x = doc_x;
				dockData.PRG_sentence_list_y = doc_y;
				dockData.dockGroupId = 'dock_label_'+i;	
				var canvasWidth = stg.attrs.width;
				var canvasHeight = stg.attrs.height;
				var hintJson= PRGData.getHintParameterFromJson();
				var adminData= PRGData.getJsonAdminData();
			
				adminData.feedbackWidth = 120;
				adminData.feedbackHeight = 70;
				/* --- updating value for x,y of hint/feedback placeholder for 0,0 --- */
				if(hintJson.x == 0){
					var calx = parseInt(canvasWidth)-50;
				}
				if(hintJson.y == 0){
					var caly = parseInt(canvasHeight)-100;
				}
				PRGData.setHintParameterInJson('','',parseInt(calx),parseInt(caly));		
				
				window.CD.module.data.Json.PRGData.PRGDockData['PRGS'+i] = dockData;
				//PRGData.Json.DCKLD = dockConfig.style.width + ',' + dockConfig.style.height;
				ds.setOutputData();
				if(window.CD.module.data.Json.PRGData.PRGDockData.PRGS0){
					if(window.CD.module.data.Json.PRGData.PRGDockData.PRGS0.current_SLED_item_transparency == "T")
					 {
					 dockData.current_SLED_item_transparency="T";
					 }
				}
				var dockGroup =PRGView.createDockObject(dockData,i);	
				var param={
						dockGrpID: dockGroup.attrs.id,
						dockGrpObj: dockGroup,
						dockData: dockData
						
				}
				PRGView.createInfoTextObject(param);
			}
			if(totalLabelToCreate>0)
			undoMng.register(this, PRGView.deleteAllDocks,[dockGroupStartId,totalLabelToCreate] , 'Undo create all Label',this, PRGView.createNewSentence,[totalLabelToCreate,0] , 'Redo create all Label');
			updateUndoRedoState(undoMng);
			cdLayer.draw();
			
			this.setIns();
			
		}catch(err){
			console.error("Error while creating Dock::"+err.message);
		}	
	}, 
	
	createDockObject : function(prgdockdata,i){
		var cs = window.CD.services.cs;
		var stg = cs.getCanvas();
		var cdLayer = cs.getLayer();
		var lbConfig = new LabelConfig();
		var dockConfig = new DockConfig();
		var ds = window.CD.services.ds;	
		var doc_x  = prgdockdata.PRG_sentence_list_x;
		var doc_y  = prgdockdata.PRG_sentence_list_y;
		var val = prgdockdata;
		var dockWidth = parseInt(window.CD.module.data.Json.DCKLD.split(',')[0]);
		var dockHeight = parseInt(window.CD.module.data.Json.DCKLD.split(',')[1]);
		dockConfig.style.width = dockWidth;
		dockConfig.style.height = dockHeight;
		var strokeWidth = 0;
		var strokeEn = false;			
		var isDraggable = true;
		if(val.lockStatus)
			isDraggable = false;
	
		var strokeWidth = 1;
		var strokeColor = '#999999'
		var strokeEn = false;
		var fillColor = 'transparent'
		var transOpacity = 0;
		var dashArrayValue = [10, 5];
		var dashArrayEnabled = true;
		var buffer = 20;
		
		var undoMng = window.CD.undoManager;
		var dockGrpOptions = {draggable:true,x:doc_x,y:doc_y };
		var dockGroup = cs.createGroup('dock_label_'+i,dockGrpOptions);
		var dock = new Kinetic.Rect({					
            width: dockWidth,
            height: dockHeight,						                
            stroke: '#999999',
            strokeWidth: 1,
            cornerRadius: 5,
            strokeEnabled: true,
            fill: '#ffffff',
            opacity:1,
            id:'dock_label'+i	               
			});
		
		var textBoxGroup = cs.createGroup('dock_txtGrp_'+i,{'x':10,'y':(dockConfig.style.height-20)/2});
		var textBox = new Kinetic.Rect({
            width: dockConfig.style.width-20,
            height: 15,
            fill: '#ffffff',
            opacity:1,
            id:'dock_txtBox_'+i
			});
		var simpleText1 = new Kinetic.Text({		        	
			text: 'Add Dock Text',
	        fontSize: 14,
	        fontFamily: 'sans-serif',
	        fill: '#555',  
	        width: dockConfig.style.width-20,
	        height: 'auto',
	        opacity: '1',
	        verticalAlign:'top',
            id: 'dock_addTxt_'+i,
            name: 'nametxt',
            align : 'center'
          });
		
		dockGroup.add(dock);
		textBoxGroup.add(textBox);
		textBoxGroup.add(simpleText1);
		dockGroup.add(textBoxGroup);
		textBoxGroup.moveToTop();
		textBoxGroup.setY((dock.getHeight()-simpleText1.getTextHeight())/2);
		cdLayer.add(dockGroup);
		makePRGResizable(dockGroup, dockWidth, dockHeight);	
		cs.dragLockUnlock(dockGroup,dockWidth, dockHeight,true);
		
		simpleText1.on("click tap",function(evt){
			var prgTextTool= new TextTool.dockText();
			prgTextTool.textSetActive(this.parent, 'docktext');
			
			var textGrp = this.parent;					
			var evtObj = {selectorObj:textGrp,x:textGrp.getAbsolutePosition().x,y:textGrp.getAbsolutePosition().y+$('canvas').first().offset().top};			
			prgTextTool.createTextBoxForLabel(evtObj);		
			prgTextTool.createMaskOnCanvas();
			$('#textToolContainer').css('z-index',100);
		});
		simpleText1.on("dblclick dbltap",function(evt){			
			var prgTextTool= new TextTool.dockText();
			var textGrp = this.parent;					
			var evtObj = {selectorObj:textGrp,x:textGrp.getAbsolutePosition().x,y:textGrp.getAbsolutePosition().y+$('canvas').first().offset().top};			
			prgTextTool.createTextBoxForLabel(evtObj);			
			
		});
		
		dockGroup.on('mousedown',function(evt){
			cs.setActiveElement(this,'dock');
			PRGView.showSavedHint(this);
			evt.cancelBubble = true;
			cs.updateDragBound(this);
			openInspector('label');
			this.moveToTop();
		});
		
		dockGroup.on('click',function(evt){
			evt.cancelBubble = true;
		});
		
		dockGroup.on('dragstart',function(evt){
			evt.cancelBubble = true;
			PRGView.hideIns();
		});
		dockGroup.on('dragend',function(evt){
			if(window.CD.module.data.Json.PRGPS.sentenceReorder == 'T'){
				if(window.CD.elements.active.element.length == 1){
					evt.cancelBubble = true;
					var dockElm = [];
					var yIndexArr = [];
					dockElm.push(window.CD.elements.active.element[0]);
					var noLayerElm = window.CD.elements.active.element[0].parent.children.length;
					for(var e=0; e<noLayerElm; e++){
						if(window.CD.elements.active.element[0].parent.children[e].attrs.id){
							if(window.CD.elements.active.element[0].parent.children[e].attrs.id.match(/^dock_label_[0-9]+/) && (window.CD.elements.active.element[0].parent.children[e].attrs.id != window.CD.elements.active.element[0].attrs.id)){
								dockElm.push(window.CD.elements.active.element[0].parent.children[e]);
							}
						}
					}
					var noOfDock = dockElm.length;
					for(var key in window.CD.module.data.Json.PRGData.PRGDockData){
						yIndexArr.push(window.CD.module.data.Json.PRGData.PRGDockData[key].PRG_sentence_list_y);
					}
					var temp;
					for(var i=0;i<yIndexArr.length;i++){
						for(var j=i+1;j<yIndexArr.length;j++){
							if(yIndexArr[i]>yIndexArr[j]){
								temp=yIndexArr[i];
								yIndexArr[i]=yIndexArr[j];
								yIndexArr[j]=temp;
							}
						}
					}
					var flag = false;
					var prg = PRGData.getDockIndex(this.attrs.id);
					var firstElmY = window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_y;
					for(var j=1;j<noOfDock;j++){
						if(firstElmY >= yIndexArr[j]){
							flag = true;
						}
					}
					if(flag == false && noOfDock>1){
						PRGView.setActiveDockPositionForOTM(this,dockElm,yIndexArr);
					}else{
						PRGView.setActiveDockPosition(this)	
					}
					
					ds.setOutputData();	
					PRGView.hideIns();
				}else{
					evt.cancelBubble = true;
					PRGView.setActiveDockPosition(this);
					ds.setOutputData();	
					PRGView.hideIns();
				}
			}else{
				evt.cancelBubble = true;
				PRGView.setActiveDockPosition(this);
				ds.setOutputData();	
				PRGView.hideIns();
			}
			cdLayer.draw();
		});
	
		if(val.sentence) {			
			
			/*checking sb and sp tag in a text*/
			var textValue=val.sentence;
			var dockTextTool= new TextTool.dockText();
			if(dockTextTool.checkSubOrSuperTagExist(textValue)){
				textValue=dockTextTool.convertSbSpscript(textValue);	
			}
			var txtGrpObj = dockTextTool.createText(textValue,textBoxGroup,val.textFormat);
			
			 if(val.textFormat.underline_value == "T"){
				 dockTextTool.applyTextUnderline(txtGrpObj);			  
			 }
			
			 if(txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0]){
				 	var textGrpHeight = txtGrpObj.children[txtGrpObj.children.length-1].getY() + txtGrpObj.children[txtGrpObj.children.length-1].getHeight();
					txtGrpObj.get('#dock_txtBox_'+txtGrpId)[0].setFill("transparent");
					txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0].hide();
					txtGrpObj.setY((txtGrpObj.parent.children[0].getHeight()-textGrpHeight)/2);
			}
			 dockTextTool.bindLabelTextEvent(txtGrpObj);
			
		} else {
			simpleText1.show();	
			simpleText1.parent.setY((dock.getHeight() - simpleText1.getTextHeight())/2);
		}	
		 if(val.current_SLED_item_transparency == "T"){
			 dock.setFill('transparent');
			// dock.setStrokeWidth(0);
			 dock.setStroke('rgba(0,0,0,0)');
		 }
		 
		 
		 if(val.media_PRG_value != "N"){
				var audioGrpId = 'audio_' + dockGroup.attrs.id;
				var x = parseInt(val.coor_PRG_value.x);
				var y = parseInt(val.coor_PRG_value.y);
				loadAudioImage(dockGroup,audioGrpId,val.media_PRG_value,x,y);			
			}	
		 cdLayer.draw();
		return dockGroup;
	},
	removeInsImage:function(){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();	
		var insImageGroup = cdLayer.get('#insImg_group')[0];
		if(insImageGroup){
			insImageGroup.removeChildren();
			insImageGroup.remove();
		}
		cdLayer.draw();
	},
	loadInsImage:function(imagex,imagey){
		$('#instructText').prop('checked',true);
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();		
		var util = window.CD.util;
		var imageObj = new Image();
		try{
				imageObj.src = util.getImageUrl() + 'top_image.png';
				var tempUrl = imageObj.src;
				this.removeInsImage();
				if(tempUrl.indexOf('undefined') != -1){
					//TODO: Show error modal for missing media file
					return;
				}
				var x = parseInt(imagex);
				var y = parseInt(imagey) - 70;
					
				if(y<0)
					y = 0;
				
				if (imageObj.complete) {
					var imgH = imageObj.height;
					var imgW = imageObj.width;		
					var insImg = new Kinetic.Image({
						x: 0,
						y: 0,
						image: imageObj,
						width: imgW,
						height: imgH,
						name: 'insImg'
					});
					var imageGroup = cs.createGroup('insImg_group',{'draggable':false,'x':x,'y':y,'dragOnTop':false});					
					imageGroup.add(insImg);
					insImg.moveToTop();
					cdLayer.add(imageGroup);
					cdLayer.draw();
				} else {
					imageObj.onload = function() {
						var imgH = imageObj.height;
						var imgW = imageObj.width;		
					
						var frameImg = new Kinetic.Image({
							x: 0,
							y: 0,
							image: imageObj,
							width: imgW ,
							height: imgH,
							name: 'insImg'
						});
					imageObj.onload=function(){};
				};
				var imageGroup = cs.createGroup('insImg_group',{'draggable':false,'x':x,'y':y,'dragOnTop':false});					
				imageGroup.add(insImg);
				cdLayer.add(imageGroup);
				cdLayer.draw();
				}
					
				imageObj.onerror = function(err) {
					console.info("Could not load image."+ err.message );
			    };
		}catch(e){
			console.log("Could not load image."+ e );
		}
	},
    createDistractor: function(totalDistractorsToCreate){
        var cs = window.CD.services.cs;
        var ds = window.CD.services.ds;
        var cdLayer = cs.getLayer();
        var labelConfig = new LabelConfig();
        var stg = cs.getCanvas();
        var lblCount = cs.objLength(PRGData.Json.PRGData.PRGLabelData);
    	var overLapVal = 0;
        var canvasHeight = parseInt(stg.getHeight());
        var distractorHeight = parseInt(labelConfig.style.height);
        var newCanvasHeight = (canvasHeight-70)-distractorHeight;
        var totDistractorCount = parseInt(totalDistractorsToCreate)+parseInt(lblCount);
        var undoMng = window.CD.undoManager;
        var totCount = parseInt(totalDistractorsToCreate +  lblCount);
        if(totDistractorCount>10){
        	overLapVal = newCanvasHeight/parseInt(totDistractorCount);
        }else{
        	overLapVal = 30;
        }
        
        for(var i=lblCount; i<totCount; i++){
        	var holder_x = 100;
    		var holder_y = 50 + (i*parseInt(overLapVal));    
    		var prgLblData = cs.cloneObject(prgLabelDefaults); 
    		prgLblData.term_pos_x = holder_x;
     		prgLblData.term_pos_y = holder_y;
    		var count =0;
        	if(i==0){   
         		prgLblData.current_item_transparency_border =  "F"; 
         		prgLblData.current_item_transparency =  "F";
         		prgLblData.textFormat.underline_value =  "F"; 
        	}else{
        		var prgLblJson = PRGData.getJsonData()['PRGT'+(i-1)];
        		count = PRGData.getLabelStartId();
         		prgLblData.current_item_transparency_border =  prgLblJson.current_item_transparency_border;
         		prgLblData.current_item_transparency =  prgLblJson.current_item_transparency;         		
         		
        	}
        	
        	prgLblData.labelGroupId = 'label_'+count;
        	
        	this.createPrgLabel('', count,false,true,overLapVal,prgLblData);
        }
        undoMng.register(this, PRGView.deleteAllLabels,[lblCount,totalDistractorsToCreate] , 'Undo create all Label',this, PRGView.createNewSentence,[0,totalDistractorsToCreate] , 'Redo create all Label');
        updateUndoRedoState(undoMng);
        
    },
    createPrgLabel :function(labelValue,i,txtGrpObj,distractor,overLapVal,val,textToUpdate){ 
    	var labelTextStyling = new labelTextStyle();
    	var textFormat = new TextFormat();
    	var txtConfg = new TextTool.commonLabelText();
    	
    	var ds = window.CD.services.ds;
    	var cs = window.CD.services.cs;
    	var cdLayer = cs.getLayer();
    	var lbConfig = new LabelConfig();  
    	var strokeWidth = 0;
		var strokeEn = false;			
		var isDraggable = true;
		var strokeWidth = 1;
		var strokeColor = '#999999'
		var strokeEn = false;
		var fillColor = 'transparent'
		var transOpacity = 0;
		var dashArrayValue = [10, 5];
		var dashArrayEnabled = true;
		var buffer = 20;
		var textBoxBuffer = 20;
		
    	if(val.current_item_transparency_border === 'F'){
			strokeWidth = 1;
			strokeEn = true;
		}else{
			strokeWidth = 0;
			strokeEn = false;
		}
		
		if(val.current_item_transparency === 'T'){
			labelfill = 'transparent';
		}else{
			labelfill = lbConfig.style.fill;
		}
		var holder_x = val.term_pos_x;
		var holder_y = val.term_pos_y;
    			
		var prglblGrpOptions = {draggable:true,x:holder_x,y: holder_y};
		var labelGroup = cs.createGroup('label_'+i,prglblGrpOptions);
		lbConfig.id = 'lbl_' + i;	
		lbConfig.style.width = parseInt($('#labelWidth').val());
		lbConfig.style.height = parseInt($('#labelHeight').val());
		var undoMng = window.CD.undoManager;
		var prgJson = PRGData.getJsonAdminData();
		
		var ldwidth = parseInt(prgJson.SLELD.split(',')[0]);
		var ldheight = parseInt(prgJson.SLELD.split(',')[1]);
		
		var style = '';
		if(labelValue.indexOf('[b]') != -1)
			style = 'bold';
		if(labelValue.indexOf('[i]') != -1)
			style = style+' italic';
		
		var fontStyle = 'normal';
		if((labelValue.indexOf('[i]')!= -1) || (labelValue.indexOf('[b]')!= -1))
			fontStyle = style;
		
		var underlinedTextStyle = 'normal_text,labeltext';
		var underline_val = 'F';
		if(labelValue.toString().indexOf('[u]') != -1){
			underlinedTextStyle = 'underlined_text,labeltext';
			underline_val = 'T';
		}
		
		var label = new Kinetic.Rect({
            width: lbConfig.style.width,
            height: lbConfig.style.height,						                
            stroke: '#999999',
            strokeWidth: strokeWidth,
            cornerRadius: 5,
            strokeEnabled: strokeEn,
            fill: labelfill,
            opacity:1,
            id:lbConfig.id
        });
		cdLayer.add(labelGroup);
		labelGroup.add(label);		
		
		var text = labelValue;
		
		PRGData.getJsonData()['PRGT'+cs.objLength(PRGData.getJsonData())] = val;
		var textBoxGroup = cs.createGroup('txtGrp_'+i,{'x':10,'y':(lbConfig.style.height-20)/2});
		var textBox = new Kinetic.Rect({
            width: lbConfig.style.width-20,
            height: 15,
            fill: '#ffffff',
            opacity:1,
            id:'txtBox_'+i
		});
		var addTextObj = new Kinetic.Text({		        	
			text: 'Add Distractor Text',
			y:2,
	        fontSize: 14,
	        fontFamily: 'sans-serif',
	        fill: '#555',  
	        width: lbConfig.style.width-20,
	        height: 'auto',
	        opacity: '1',
	        verticalAlign:'top',
            id: 'addTxt_'+i,
            name: 'nametxt',
            align : 'center'
          });
		
		textBoxGroup.add(textBox);
		textBoxGroup.add(addTextObj);			
		
		labelGroup.add(textBoxGroup);
		var textBoxGroupObj = textFormat.createPRGText(textBoxGroup, labelValue, 'center');
		textBoxGroup = textBoxGroupObj.labelTxtGrp;
		
		var count = textBoxGroup.children.length-1;
		var lastChild = txtConfg.findLastTextchild(textBoxGroup,count);
		var textGrpHeight = textBoxGroup.children[lastChild].getY() + textBoxGroup.children[lastChild].getHeight();
		var topPadding = (textBoxGroup.parent.children[0].getHeight()-textGrpHeight)/2;
		if(topPadding < 0)
			topPadding = 0;
		textBoxGroup.setY(topPadding);
		
		if(!distractor){
			textBox.hide();
			addTextObj.hide();
		}else{
			textBoxGroup.setY((label.getHeight() -20)/2);
		}
		if(val.current_item_transparency == 'T'){
			label.setFill('transparent');
		}
		/* setting color of distractor on creating new distractors*/
		
		if(distractor || val.distractor_label == 'T'){
			var distractorFillColor = '#faf8dd';
			label.setFill(distractorFillColor);
		}
		

		
		textBoxGroup.moveToTop();
		
		labelGroup.setDraggable(true);
		labelGroup.setX(holder_x);
		labelGroup.setY(holder_y);
		cdLayer.draw();
		makePRGResizable(labelGroup, lbConfig.style.width, lbConfig.style.height);	
		cs.dragLockUnlock(labelGroup,parseInt(lbConfig.style.width),parseInt(lbConfig.style.height),true);
	
		if(val.term && val.term != '' && val) {						
			 /*checking sb and sp tag in a text*/
			var textValue = textToUpdate;
			var commonTextTool= new TextTool.commonLabelText();
			if(commonTextTool.checkSubOrSuperTagExist(textValue)){
				textValue=commonTextTool.convertSbSpscript(textValue);	
			}
		 
			/*get text formatinf details*/
			if(val.textFormat){
			 	var fontStyle = fontStyle;
			 	var underline_value = underline_val;
			 	var fontSize=val.textFormat.fontSize;
			 	var align=val.textFormat.align;
			}else{
				var fontStyle='normal';
			 	var underline_value='F';
			 	var fontSize=14;
			 	var align='center';
			}
			if((textValue.indexOf('[b]') != -1) || (textValue.indexOf('[i]') != -1) || (textValue.indexOf('[u]') != -1)){
				textValue = textValue.split(']')[1];
			}
			
			var editedTextObjectOption={type:"Text",
					kinteticOpt:{text: PRGView.fixTextEntities(textValue),
			 					fontSize: fontSize,fontFamily: 'sans-serif',fontStyle:fontStyle,
			 					 fill: '#555',width: (ldwidth - textBoxBuffer),height: 'auto' ,opacity: '1',
			 					 verticalAlign:'middle',id: 'txt_'+d,name: 'nametxt',align : align}
			}	
			var editedTextObj =PRGView.createKineticObject(editedTextObjectOption); 
			textBox.setFill("transparent");
			addTextObj.hide();
			textBoxGroup.add(editedTextObj);
			textBoxGroup.setY(0);
			var totWidth = label.getWidth();
			var totHeight = label.getHeight();
			if(editedTextObj.getTextWidth() > totWidth){
				 editedTextObj.setWidth(totWidth - textBoxBuffer);
			}
			var originalTextHeight = editedTextObj.textArr.length * editedTextObj.getTextHeight();
			//if(totHeight > originalTextHeight){
				 var calcY = (totHeight - originalTextHeight)/2;
				 textBoxGroup.setY(calcY);
			//}

			if(val.textFormat.underline_value == "T"){
				var textObj = editedTextObj;
				if(textObj){
					commonTextTool.applyTextUnderline(textObj,textObj.parent,true);
					$("#UnderlinetTool").data('clicked', true);
				}
				prgLblData.textFormat.underline_value =  prgLblJson.textFormat.underline_value;
			}
			labelValue = val.term;
		}
		
	var prgTextTool= new TextTool.commonLabelText();
	prgTextTool.bindLabelTextEvent(textBoxGroup,'prg');
	
	val.term = $.trim(textToUpdate);
	
	var isDraggable = true;
	if(val.lockStatus)
		isDraggable = false;
	if(txtGrpObj){
			val.name = txtGrpObj.parent.attrs.id;
			val.distractor_label = 'F';
		}else{
			val.distractor_label = 'T';
		}
						
		PRGData.Json.SLELD = lbConfig.style.width + ',' + lbConfig.style.height;			
		PRGData.reIndexLabels();
		ds.setOutputData();
		if(val.media_PRGT_value != "N" && val.media_PRGT_value){
			var audioGrpId = 'audio_' + labelGroup.attrs.id;
			var x = parseInt(val.coor_PRGT_value.x);
			var y = parseInt(val.coor_PRGT_value.y);
			loadAudioImage(labelGroup,audioGrpId,val.media_PRGT_value,x,y);			
		}

		var textId = labelGroup.getId().split('_')[1];
		var labelId = labelGroup.getId();
		
		var defaultParams = window.CD.module.data.getTextFormatParamsFromJson(textId);
		var params = {};
		params.fontStyle = fontStyle;
		params.underline_value = underline_val;
		
		defaultParams = $.extend(defaultParams,params);
		
		window.CD.module.data.updateLabelTextData(defaultParams,labelId);
		
		labelGroup.on('mousedown',function(evt){
			cs.setActiveElement(this,'label');
			//PRGView.showSavedHint(this);
			evt.cancelBubble = true;
			cs.updateDragBound(this);
			openInspector('label');
			window.CD.services.cs.updateMoveToTopBottomState(this);
			//this.moveToTop();
		});
		
		labelGroup.on('click',function(evt){
			evt.cancelBubble = true;
		});
		if(!val.zIndex || val.zIndex != ''){
			var prg = PRGData.getLabelIndex(labelGroup.attrs.id);
			PRGData.Json.PRGData.PRGLabelData[prg].zIndex = labelGroup.getZIndex();
		}
		labelGroup.on('dragend',function(evt){
			evt.cancelBubble = true;
			/*var prg = PRGData.getLabelIndex(this.attrs.id);
			undoMng.register(this, PRGView.setLabelGroupPosition,[this,PRGData.Json.PRGData.PRGLabelData[prg].term_pos_x,PRGData.Json.PRGData.PRGLabelData[prg].term_pos_y] , 'Undo Dock drag drop Label',this, PRGView.setLabelGroupPosition,[this,this.getX(),this.getY()] , 'Redo Dock drag drop Label');
			updateUndoRedoState(undoMng);
			PRGData.Json.PRGData.PRGLabelData[prg].term_pos_x = this.getX();
			PRGData.Json.PRGData.PRGLabelData[prg].term_pos_y = this.getY();*/
			PRGView.setActiveLabelPosition(this);
			ds.setOutputData();	
		});

		
    	
    },	
     /**
 	 * function name: setTFHproperties()
 	 * author:Piyali Saha
 	 */
 	setTFHproperties :function(slejsonObj){
 		var infoTtext=slejsonObj.infoHideText;
 		var infoHintText=slejsonObj.hint_value;
 		var infoFeedbackText=slejsonObj.feedback_value
 		
 		if(infoHintText!==""){
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
 		$("#textareaHint").val('');
 		 $("#textareaFeedback").val('');
 	},
 	/**
 	 * function name: createInfoTextObject()
 	 * description:create info text object
 	 * author:Piyali Saha
 	 */
     /**
 	 * function name: createInfoTextObject()
 	 * description:create info text object
 	 * author:Piyali Saha
 	 */
 	createInfoTextObject : function(param){
 		console.log("@PRGView.createInfoTextObject");
 		try{
 			var infoTextObjectArr=['H','F'];
 			var infoTextX= -8;
 			var slash='';
 			var labelGroupId=param.dockGrpID;
 			var labelGrpObj=param.dockGrpObj;
 			var labelData =param.dockData;
 			
 			var cs = window.CD.services.cs;
 			var ds = window.CD.services.ds;
 			var cdLayer = cs.getLayer();
 			var showTVal=false,showHVal=false,showFVal=false;
 			var infotObj;
 			
 			/*info text creation*/
 			/*info text creation*/
 			  var infoGroupText = new Kinetic.Group({
 			       	x: 0,
 					y: 0,
 			        id:'infoText_'+labelGroupId,
 			        draggable:false
 			   });  
 			$.each(infoTextObjectArr,function(index,value){
 				
 				 var infoTextObjOption={type:"Text",
 							kinteticOpt:{x: infoTextX+10,y: 0,text: slash+value,align:'left',
 					 					 fontSize: 10,fontFamily: 'sans-serif',fill: '#555',opacity: '1',
 					 					 verticalAlign:'middle',fontStyle: 'normal',id: value+'_infoText_'+labelGroupId,
 					 					 padding:2
 					 					 }
 				 }	
 				var infoTextObj =PRGView.createKineticObject(infoTextObjOption);
 				infoTextObj.hide();
 			 
 				 if(param.showLabel){
 					
 					
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
 				 
 			 })
 			 
 			/*add info text objects*/
 			 labelGrpObj.add(infoGroupText);
 			 if(!param.showLabel){
 				 labelData.infoHideText='F'
 			 }
 			 cdLayer.draw();
 			 ds.setOutputData();	
 		}catch(err){
 			console.error("@PRGView::Error on createInfoTextObject::"+err.message);
 		}
 	},
 	/**
	 * description::
	 * This method is used for undo creation of all labels
	 * All labels will be deleted together on undo
	 * Called from createLabelObject() 
	 */
	deleteAllDocks : function(labelStartId,totalLabelToCreate){
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var outputJson = window.CD.module.data.Json;
		var undoMng = window.CD.undoManager;
		var counter = labelStartId;
		var finalCounter = counter+parseInt(totalLabelToCreate);
		var oldObject = {};
		for(var count = counter;count < parseInt(finalCounter);count++){
			var newDockGrpId = 'dock_label_'+count;
			var newIndex = PRGData.getDockIndex(newDockGrpId);
			var dockGroup = cs.findGroup(newDockGrpId);
			cs.deleteSubGroups(dockGroup);
			this.removeImageFromLabel(dockGroup);
			this.removeTextFromLabel(dockGroup);
			this.removeAudioFromLabel(dockGroup);
			dockGroup.remove();
			oldObject[newIndex]={'dockData' : outputJson.PRGData.PRGDockData[newIndex]};
			delete outputJson.PRGData.PRGDockData[newIndex];
		}
		
		PRGData.reIndexLabels();
		cs.setActiveElement(cs.findGroup('frame_0'),'frame');
		cs.resetToolbar();
		ds.setOutputData();	
	},
	deleteAllLabels : function(labelStartId,totalLabelToCreate){
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var outputJson = window.CD.module.data.Json;
		var undoMng = window.CD.undoManager;
		var counter = labelStartId;
		var finalCounter = counter+parseInt(totalLabelToCreate);
		var oldObject = {};
		for(var count = counter;count < parseInt(finalCounter);count++){
			var newDockGrpId = 'label_'+count;
			var newIndex = PRGData.getLabelIndex(newDockGrpId);
			//if(outputJson.PRGData.PRGLabelData[newIndex].distractor_label == 'T'){
			var dockGroup = cs.findGroup(newDockGrpId);
			//cs.deleteSubGroups(dockGroup);
//			this.removeImageFromLabel(dockGroup);
			this.removeTextFromLabel(dockGroup);
			this.removeAudioFromLabel(dockGroup);
			dockGroup.remove();
			oldObject[newIndex]={'labelData' : outputJson.PRGData.PRGLabelData[newIndex]};
			delete outputJson.PRGData.PRGLabelData[newIndex];
			//}
		}
		cs.getLayer().draw();
		PRGData.reIndexLabels();
		cs.setActiveElement(cs.findGroup('frame_0'),'frame');
		cs.resetToolbar();
		ds.setOutputData();	
	},
	
	deleteLabel : function(active) {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;
		var activeElm = active.element[0];
		if(!activeElm)activeElm = active.element;
		var obj ={};		
		if(activeElm.children.length < 8)
			activeElm  = cs.findGroup(activeElm.attrs.id);
		obj.element = activeElm;
		
		var  outputJson = PRGData.Json;
		var undoMng = window.CD.undoManager;
		var labelIndex = PRGData.getLabelIndex(activeElm.attrs.id);
		if(outputJson.PRGData.PRGLabelData[labelIndex].distractor_label == 'T'){
			this.removeImageFromLabel(activeElm);
			this.removeTextFromLabel(activeElm);
			this.removeAudioFromLabel(activeElm);
			undoMng.register(this, PRGView.undoLabelDelete,[outputJson.PRGData.PRGLabelData[labelIndex],activeElm.attrs.id] , 'Delete Dock',this, PRGView.deleteLabel,[obj] , 'Redo Delete Dock');
			updateUndoRedoState(undoMng);
			activeElm.remove();					
			cs.setActiveElement(cs.findGroup('frame_0'),'frame');			
			delete outputJson.PRGData.PRGLabelData[labelIndex];				
			PRGData.reIndexLabels();	
			ds.setOutputData();	
			cs.resetToolbar();		
		}
	},
	undoLabelDelete : function(labelData,labelIndex) {
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var labelJson = PRGData.getJsonData();
		var labelCount = cs.objLength(labelJson);
		var undoMng = window.CD.undoManager;
		var counter = labelIndex.split('_')[1];
		PRGView.createPrgLabel('', parseInt(counter),false,true,30,labelData);			
		labelJson['PRGT'+labelCount] = labelData;	
		labelJson['PRGT'+labelCount].labelGroupId = labelIndex;	
		PRGData.reIndexLabels();
		cdLayer.draw();
		ds.setOutputData();

	},
	deleteDock : function(active,redo) {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;
		var activeElmForUndo = [];
		var activeElmIds = [];
		if(!redo){
			var obj={};	
			obj.element=[];
		}
		var  outputJson = PRGData.Json;
		var undoMng = window.CD.undoManager;
		var activeElmLength = active.element.length;
		var dockCount = cs.objLength(window.CD.module.data.Json.PRGData.PRGDockData);
		for(var i=0;i<activeElmLength;i++){
			var activeElm = active.element[i];
			
			if(activeElm.children.length == 0)
				activeElm  = cs.findGroup(activeElm.attrs.id);	
			if(!redo){
				obj.element.push(activeElm);
			}
			var dockIndex = PRGData.getDockIndex(activeElm.attrs.id);
			activeElmForUndo.push(outputJson.PRGData.PRGDockData[dockIndex]);
			activeElmIds.push(activeElm.attrs.id);
			cs.deleteSubGroups(activeElm);
			this.removeImageFromLabel(activeElm);
			this.removeTextFromLabel(activeElm);
			this.removeAudioFromLabel(activeElm);
			activeElm.destroy();	
			delete outputJson.PRGData.PRGDockData[dockIndex];
			this.deleteExtraLabels(activeElm,dockCount);
			
		}
		if(!redo){
			undoMng.register(this, PRGView.undoDockDelete,[activeElmForUndo,activeElmIds] , 'Delete Dock',this, PRGView.deleteDock,[obj,'redo'] , 'Redo Delete Dock');
			updateUndoRedoState(undoMng);	
		}

		PRGData.reIndexDocks();
		cs.setActiveElement(cs.findGroup('frame_0'),'frame');
		cs.resetToolbar();
		ds.setOutputData();	
		cdLayer.draw();
		
	},
	undoDockDelete : function(dockData,dockIndex) {
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var dockJson = PRGData.getDockJsonData();
		var dockCount = cs.objLength(dockJson);
		var undoMng = window.CD.undoManager;
		for(var i=0;i<dockIndex.length;i++){
			var counter = dockIndex[i].split('_')[2];
			dockJson['PRGS'+dockCount] = dockData[i];	
			dockJson['PRGS'+dockCount].dockGroupId = dockIndex[i];	
			ds.setOutputData();
			var dockGroup = PRGView.createDockObject(dockData[i],counter);	
			dockCount++;
		}
		PRGData.reIndexDocks();
		cdLayer.draw();
		
	},
	removeImageFromLabel : function(activeElm) {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var images = activeElm.get('.img');		
		if(images[0]){
			var imgGrp = images[0].parent;
			imgGrp.removeChildren();
			imgGrp.remove();
			cdLayer.draw();
		}
	},
	removeAudioFromLabel : function(activeElm) {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var audio = activeElm.get('.audio_img');		
		if(audio[0]){
			var audioGrp = audio[0].parent;
			audioGrp.removeChildren();
			audioGrp.remove();
			cdLayer.draw();
		}
	},
	removeTextFromLabel : function(activeElm) {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();		
		var texts = activeElm.get('.nametxt');		
		if(texts[0]){
			var txtwGrp = texts[0].parent;
			txtwGrp.removeChildren();
			txtwGrp.remove();
			cdLayer.draw();
		}		
	},
	deleteExtraLabels : function(dockGroup,dckCnt){
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var dockTextTool= new TextTool.dockText();
		var textFormat = new TextFormat();
		
		var textVal = '';
		var labelData = PRGData.getJsonData();
		var dockCount = cs.objLength(window.CD.module.data.Json.PRGData.PRGDockData);
		if(dckCnt){
			dockCount = dckCnt;
		}
		var prgJsonData = PRGData.getDockJsonData();
		for(var key in prgJsonData){
			var dock = prgJsonData[key];
			if(dock)
				textVal = textVal + dock.sentence;
		}
		
		textVal = dockTextTool.removeLastBR(textVal);
		if(textVal.match(/\r|\n/) != null){	
			textVal = textVal.replace(/\n|\r/g, ' ^^');
		}
		 
		textVal = dockTextTool.parseFormattedText(textVal);
		var c = textVal.replace((/__([a-z0-9A-Z\W\s]+)__/g), '__~~$1~~__');
		var splittedWords = c.split(/__([a-z0-9A-Z\W\s]+)__/g);
		
		var labelCount = cs.objLength(labelData);
		for(i=0; i<labelCount;i++){
			if(labelData['PRGT'+i].distractor_label == 'F'){
				if(($.inArray(('~~'+labelData['PRGT'+i].term+'~~'), splittedWords)) == -1){
					var lblGrp = cs.findGroup(labelData['PRGT'+i].labelGroupId);
					PRGView.removeImageFromLabel(lblGrp);
					PRGView.removeTextFromLabel(lblGrp);
					PRGView.removeAudioFromLabel(lblGrp);
					lblGrp.remove();	
					window.CD.services.cs.getLayer().draw();
					delete labelData['PRGT'+i];	
				}
			}
		}
		PRGData.reIndexLabels();	
		ds.setOutputData();	
	},
	
	formatText : function(text,indexArr){
		console.log("@formatText :: PRGView");
		try{
			var lastIndex = 0;
			for(var i = (indexArr.length-1);i>0;i--){
				var keyId = indexArr[i];
				if(keyId !== -1){
					var match = text.substr((keyId+1+lastIndex),1);
					lastIndex = keyId;
					var index = text.indexOf('['+match+']');
					
					var text1 = text.substr(0, index) + $.trim(text.substr((index+3),text.length));
					text = '<'+match+'>'+text1+'</'+match+'>';
				}
			}
			return text;
		}catch(err){
			console.info('Error @formatText :: PRGView '+err.message);
		}
	},
	
	removeAllLabels : function(activeElm){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;
		var labelCount = cs.objLength(PRGData.Json.PRGData.PRGLabelData);
		var outputJson = PRGData.Json;
		
		for(var i=0; i<labelCount;i++){		
			var labelGrpName = outputJson.PRGData.PRGLabelData['PRGT'+i].name;		
			if(activeElm.attrs.id == labelGrpName){
				var labelId = outputJson.PRGData.PRGLabelData['PRGT'+i].labelGroupId;
				var lblIndex = PRGData.getLabelIndex(labelId);
				var label = cs.findGroup(labelId);
				if(label){
				this.removeImageFromLabel(label);
				this.removeTextFromLabel(label);
				this.removeAudioFromLabel(label);
				label.remove();
				delete outputJson.PRGData.PRGLabelData[lblIndex];
				}
			}
		}			
		PRGData.reIndexLabels();
		cdLayer.draw();
	},
	removeLabels : function(exerciseType){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;
		if(exerciseType != ds.getEt()){
			var dockCount = cs.objLength(PRGData.Json.PRGData.PRGDockData);
			
			var  outputJson = PRGData.Json;
			
			for(var i=0; i<dockCount;i++){
				var dockId = outputJson.PRGData.PRGDockData['PRGS'+i].dockGroupId;
				var dockIndex = PRGData.getDockIndex(dockId);
				var dock = cs.findGroup(dockId);
				if(dock){
					cs.deleteSubGroups(dock);
					this.removeImageFromLabel(dock);
					this.removeTextFromLabel(dock);
					this.removeAudioFromLabel(dock);
					this.removeAllLabels(dock);				
					dock.remove();
					delete outputJson.PRGData.PRGDockData[dockIndex];
				}
			}
			PRGData.reIndexLabels();
			var labelCount = cs.objLength(PRGData.Json.PRGData.PRGLabelData);
			for(var i=0; i<labelCount;i++){
				var labelId = outputJson.PRGData.PRGLabelData['PRGT'+i].labelGroupId;
				var labelIndex = PRGData.getLabelIndex(labelId);
				var label = cs.findGroup(labelId);
				if(label){
					this.removeImageFromLabel(label);
					this.removeTextFromLabel(label);
					this.removeAudioFromLabel(label);	
					label.remove();
					delete outputJson.PRGData.PRGLabelData[labelIndex];
				}
			}
			cdLayer.draw();
		}
	},
	setLabelGroupPosition : function(group1,x,y){
		 var cs = window.CD.services.cs;
		  var ds = window.CD.services.ds;	
		  var cdLayer = cs.getLayer();
		  for(var i=0;i<group1.length;i++){
			 var group = cs.findGroup(group1[i].attrs.id);
			  /*group exists checking to handle undo redo*/
			  if(group){
				  group.setPosition(x[i],y[i]);
				  cdLayer.draw();
				  var prg = PRGData.getLabelIndex(group.attrs.id);	
				  if(prg){
					  PRGData.Json.PRGData.PRGLabelData[prg].term_pos_x = x[i];
					  PRGData.Json.PRGData.PRGLabelData[prg].term_pos_y = y[i];
					  ds.setOutputData();
				  }
			  }
		  }
		 
	  },
	  setDockGroupPosition : function(group1,x,y){
		  var cs = window.CD.services.cs;
		  var ds = window.CD.services.ds;	
		  var cdLayer = cs.getLayer();
		  for(var i=0;i<group1.length;i++){
			  if(group1)
				  var group = cs.findGroup(group1[i].attrs.id);
				  group.setPosition(x[i],y[i]);
				  cdLayer.draw();
				  var prgd = PRGData.getDockIndex(group.attrs.id);	
				  if(prgd){
					  PRGData.Json.PRGData.PRGDockData[prgd].PRG_sentence_list_x = x[i];
					  PRGData.Json.PRGData.PRGDockData[prgd].PRG_sentence_list_y = y[i];
					  ds.setOutputData();
				  }
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
		var dckCount = cs.objLength(PRGData.Json.PRGData);
		
		var inspectorLabelData = {
				'labelHeight' : '70',
				'labelWidth' : '120',
				'fillEnabled' : true,
				'strokeEnabled': true,
				'transparency':'F',				
				'dockHeight' : '70',
				'dockWidth' : '120',
				'hintWidth':'120',
				'hintHeight':'70',
				'feedbackWidth':'120',
				'feedbackHeight':'70',
				'hintLabelOrDock':'D',
				'feedbackLabelOrDock':'D',
				'showHintOrFeedbackInAuthoring':'none',
				'instructionText': false
		}
		
		if(oldActiveElm && cs.groupExists(oldActiveElm.attrs.id) && oldActiveElm.attrs.id.match(/^label_[0-9]+/)&& cs.objLength(cs.findGroup(oldActiveElm.attrs.id).children) > 0) {
			
			if(PRGData.Json.PRGData.PRGLabelData.PRGT0 && PRGData.Json.PRGData.PRGLabelData.PRGT0.current_item_transparency_border === 'F'){
				oldActiveElm.children[0].setStrokeWidth(1);
				oldActiveElm.children[0].setStroke('#999999');
			}else{
				oldActiveElm.children[0].setStrokeWidth(0);
				oldActiveElm.children[0].setStroke('transparent');
			}
			
		} else if(oldActiveElm && cs.groupExists(oldActiveElm.attrs.id) && oldActiveElm.attrs.id.match(/^dock_label_[0-9]+/) && cs.objLength(cs.findGroup(oldActiveElm.attrs.id).children) > 0) {
			
			oldActiveElm.children[0].setStrokeWidth(1);
			oldActiveElm.children[0].setStroke('#999999');	
			oldActiveElm.children[0].disableDashArray();
			for(key in window.CD.module.data.Json.PRGData.PRGDockData){
				if(window.CD.module.data.Json.PRGData.PRGDockData[key].dockGroupId == oldActiveElm.attrs.id){
					if(window.CD.module.data.Json.PRGData.PRGDockData[key].current_SLED_item_transparency == 'T'){
						//oldActiveElm.children[0].setStrokeWidth(0);
						oldActiveElm.children[0].setStroke('rgba(0,0,0,0)');
					}else{
						oldActiveElm.children[0].setStroke('#999999');
					}
				}
			}

		}else if(oldActiveElm && cs.groupExists(oldActiveElm.attrs.id) && oldActiveElm.attrs.id.match(/^img_label_[0-9]+/)) {			
			oldActiveElm.children[0].setStrokeWidth(1);
			oldActiveElm.children[0].setStroke('#999999');			
		}
		
		/*removed cs.groupExists() , added cs.findObject() for node existence checking*/
		
		else if(oldActiveElm && oldActiveElm.attrs.id.match(/^audio_label_[0-9]+/)) {			
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
		}else if(oldActiveElm /*&& cs.groupExists(oldActiveElm.attrs.id)*/ && oldActiveElm.attrs.id.match(/^dock_txtGrp_[0-9]+/)) {
                if(oldActiveElm.get('#dockTxt_'+oldActiveElm.attrs.id.split('_')[1])[0]){
                	oldActiveElm.get('#dockTxt_'+oldActiveElm.attrs.id.split('_')[1])[0].setFill('#555');
                }else{
                        var dockText = new TextTool.dockText();
                          //  new TextTool.dockText().removeTextHighlight(oldActiveElm);
                        var oldChildrenTxtObj=dockText.getTextObjFromGroupObject(oldActiveElm);
                       $.each(oldChildrenTxtObj, function(index,value) {    
                    	   if(typeof value==="object" && value.nodeType==="Shape" && value.className==="Text" && (!(value.attrs.id.match(/addTxt_[0-9]+/)))){
                                if(value.attrs.name.split(',')[1] !== 'fillIn')        
                                	value.setFill(dockText.normalFill);	
                                else
                                	value.setFill('red');	
                            }
                       });
                       dockText.cleanSelectedOptionFromOldTxt();
                 }
			if(oldActiveElm.get('#addTxt_dock_'+oldActiveElm.attrs.id.split('_')[1])[0])
				oldActiveElm.get('#addTxt_dock_'+oldActiveElm.attrs.id.split('_')[1])[0].setFill('#555');
                             
			
		}
		this.resetTFHproperties()
		if(newActiveElm && newActiveElm.attrs.id.match(/^label_[0-9]+/)) {
			inspectorApplyStatus = true;
			var prg = PRGData.getLabelIndex(newActiveElm.attrs.id);
			if(PRGData.getJsonData()[prg].distractor_label == "F")
				$("#deleteElement").removeClass('active').addClass('inactive_del');
			this.activelabelData(inspectorLabelData,newActiveElm);
			PRGView.populateLabelData(inspectorApplyStatus,inspectorLabelData);
			var dock = cdLayer.get('#dock_' + newActiveElm.children[0].attrs.id)[0];
			newActiveElm.children[0].attrs.strokeEnabled=true;
			newActiveElm.children[0].setStrokeWidth(2);
			newActiveElm.children[0].setStroke('#1086D9');
			$('#localDivInactive').remove();
			if(dock) {
				dock.setStrokeWidth(2);
				dock.setStroke('#1086D9');
				dock.parent.moveToTop();
			}	
			//PRGView.makeLabelLocalDisable();
			
		} else if(newActiveElm && newActiveElm.attrs.id.match(/^dock_label_[0-9]+/)) {
			$("#deleteElement").removeClass('inactive_del').addClass('active');
			inspectorApplyStatus = true;
			var prg = PRGData.getDockIndex(newActiveElm.attrs.id);
			newActiveElm.children[0].setStrokeWidth(2);
			newActiveElm.children[0].setStroke('#1086D9');
			this.activelabelData(inspectorLabelData,newActiveElm);
			PRGView.populateLabelData(inspectorApplyStatus,inspectorLabelData);
			$('#localDivInactive').remove();
			/*check hide text check box*/
			this.setTFHproperties(PRGData.getDockJsonData()[prg]);			

		}	else if(newActiveElm && newActiveElm.attrs.id.match(/^img_label_[0-9]+/)) {	
			$("#deleteElement").removeClass('inactive_del').addClass('active');
			inspectorApplyStatus = true;
			this.activelabelData(inspectorLabelData,newActiveElm.parent);
			PRGView.populateLabelData(inspectorApplyStatus,inspectorLabelData);
			newActiveElm.children[0].setStrokeWidth(2);
			newActiveElm.children[0].setStroke('#1086D9');
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
		}else{
			$("#deleteElement").removeClass('inactive_del').addClass('active');
			if($('#localDivInactive').length == 0 && ($('#localDiv').width()!=0 || $('#localDiv').height()!=0)){
				PRGView.makeLabelLocalDisable();
			}
		}
		cdLayer.draw();
		
		PRGView.populateLabelData(inspectorApplyStatus);
	},
	
	/*
	 * This is used for making label local disable when
	 * active element is not label or dock
	 */
	makeLabelLocalDisable : function(){
		console.log("@PRGView.makeLabelLocalDisable");
		try{
		
			var localDivWidth = '220px'; //$('#localDiv').width();
			var localDivHeight = $('#globalDiv').height();
			var localDivInactiveBar = $('<div id="localDivInactive" class="overlayInactive"></div>');
			localDivInactiveBar.css({width:localDivWidth, height:localDivHeight+'px'});
			$('#localDiv .block').before(localDivInactiveBar);
		}catch(err){
			console.error("@PRGView::Error on makeLabelLocalDisable::"+err.message);
		}
		
	},
	/*
	 * For making magnification part of Leader Line of local
	 * label inspector inactive
	 */
	makeLabelLocalZoomDisable : function(){},
	
	/*
	 * For making magnification part of Leader Line of global
	 * label inspector inactive
	 */
	makeLabelGlobZoomDisable : function(){},
	
	/*active Label Data*/
	activelabelData : function(inspectorLabelData,group) {	
		var adminData = PRGData.getJsonAdminData();
		var width = PRGData.Json.adminData.SLELD.split(',')[0];
		var height = PRGData.Json.adminData.SLELD.split(',')[1];
		var dockWidth = PRGData.Json.DCKLD.split(',')[0];
		var dockHeight = PRGData.Json.DCKLD.split(',')[1];
		inspectorLabelData.labelHeight = height;
		inspectorLabelData.labelWidth = width;	
		inspectorLabelData.dockHeight = dockHeight;
		inspectorLabelData.dockWidth = dockWidth;
		if(window.CD.services.cs.objLength(PRGData.Json.PRGData.PRGLabelData) > 0){
			var prg = PRGData.getLabelIndex(group.attrs.id);
			if(prg){
			inspectorLabelData.fillEnabled = PRGData.fillAndBorderEnable(PRGData.Json.PRGData.PRGLabelData[prg].current_item_transparency);
			inspectorLabelData.strokeEnabled = PRGData.fillAndBorderEnable(PRGData.Json.PRGData.PRGLabelData[prg].current_item_transparency_border);
			}
		}
		var prgId = PRGData.getDockIndex(group.attrs.id);
		if(prgId){
		var hintJson = PRGData.getHintParameterFromJson();
		inspectorLabelData.transparency = PRGData.getDockJsonData()[prgId].current_SLED_item_transparency;
		inspectorLabelData.hintWidth = hintJson.w;
		inspectorLabelData.hintHeight= hintJson.h;
		inspectorLabelData.feedbackWidth = adminData.feedbackWidth;
		inspectorLabelData.feedbackHeight= adminData.feedbackHeight;
		inspectorLabelData.instructionText = PRGData.Json.PRGPS.sentenceReorder;
		inspectorLabelData.hintLabelOrDock = PRGData.Json.adminData.HRO;
		inspectorLabelData.feedbackLabelOrDock = PRGData.Json.adminData.FRO;
		inspectorLabelData.showHintOrFeedbackInAuthoring = adminData.showHintOrFeedbackInAuthoring;
		}
	},
	
	 globalApplyClick: function(errorModal){
		 var regex = /^\s*([0-9]*\.[0-9]+|[0-9]+)\s*$/;
		if(window.CD.elements.active.type == 'label' || window.CD.elements.active.type == 'dock') {
			var minLabelWidth = 30;
			var minLabelHeight = 30;
			var maxLabelWidth = PRGData.Json.adminData.AW ;
			var maxLabelHeight = PRGData.Json.adminData.AH;
			var transparency ="";
			var passFlag = false;
			var activeLabelWidth = parseInt($('#labelWidth').val());
			var activeLabelHeight = parseInt($('#labelHeight').val());
			var activeDockWidth = parseInt($('#dockWidth').val());
			var activeDockHeight = parseInt($('#dockHeight').val());
			if($('input[name=transparenType]:checked').val() == 'solid')
				transparency = 'F';
			else
				transparency = 'T';
			var updatePrgObj = {
					'width':$('#labelWidth').val(), 
					'height':$('#labelHeight').val(),
					'dockWidth':$('#dockWidth').val(), 
					'dockHeight':$('#dockHeight').val(), 
					'fill':$('#labelFillGlob').prop('checked'),
					'stroke':$('#labelBorderGlob').prop('checked'),
					'transpType':transparency,
					'hintOrFeedback':$('input[name=hintFeedback]:checked').val(),
					'labelOrDockHint':$('input[name=hoverHint]:checked').val(),
					'hintWidth':$('#hintWidth').val(), 
					'hintHeight':$('#hintHeight').val(),
					'labelOrDockFdbk':$('input[name=feedbackType]:checked').val(),
					'feedbackWidth':$('#feedbackWidth').val(), 
					'feedbackHeight':$('#feedbackHeight').val(),
					'instructionText':$("#instructText").prop('checked')
					};
		
			if($('#labelBorderGlob').prop('checked') == true){
				$('#dockBorder').prop('checked',true);
			}else{
				$('#dockBorder').prop('checked',false);
			}
			
			var alertMsg = "";
			if($.trim($('#hintWidth').val()) == "" || $.trim($('#feedbackWidth').val()) == "")
				alertMsg += "The width of the hint or feedback box cannot be left blank. <br/><br/>";
			if($.trim($('#hintHeight').val()) == "" || $.trim($('#feedbackHeight').val())== "")
				alertMsg += "The height of the hint or feedback box cannot be left blank. <br/><br/>";
			if(($.trim($('#labelWidth').val()) != "") && ($.trim($('#labelHeight').val() !="")) && activeLabelWidth <= maxLabelWidth && activeLabelHeight <= maxLabelHeight && activeLabelWidth >= minLabelWidth && activeLabelHeight >= minLabelHeight && alertMsg==''){
				passFlag = true;
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
				//window.CD.module.view.updateDimension(updatePrgObj);
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
				$('#labelWidth').val(PRGData.Json.adminData.SLELD.split(',')[0]);
				$('#labelHeight').val(PRGData.Json.adminData.SLELD.split(',')[1]);
				
				 regexFlag = false;
			}
			else
				 regexFlag = true;
			if ((regex.test($.trim($('#dockWidth').val()))==false) || (regex.test($.trim($('#dockHeight').val()))==false))
				{
				$('#dockWidth').val(PRGData.Json.DCKLD.split(',')[0]);
				$('#dockHeight').val(PRGData.Json.DCKLD.split(',')[1]);
				regexFlagDock = false;
				}
			else
				 regexFlagDock = true;
			if(passFlag && regexFlag && regexFlagDock)
				window.CD.module.view.updateDimension(updatePrgObj);	
			
			
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
					var width = PRGData.Json.adminData.SLELD.split(',')[0];
					var height = PRGData.Json.adminData.SLELD.split(',')[1];
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
		
			//window.CD.module.view.bindFeedbackHintEvent($('input[name=hintFeedback]:checked').val(),$('input[name=hoverHint]:checked').val());
			PRGView.removeHint();
			PRGView.bindFeedbackHintEventAllLabel($('input[name=hintFeedback]:checked').val(),$('input[name=hoverHint]:checked').val(),$('input[name=feedbackType]:checked').val());
			/*var hintVal = $('#textareaHint').val();
			var feedbackVal = $('#textareaFeedback').val();
			window.CD.module.view.updateHintFeedbackVal(hintVal,feedbackVal);*/
			
		}
		
	},
	
	updateLabelContent : function(group,oldData,calcY) {
		var textFormat = new TextFormat();
		var txtConfg = new TextTool.commonLabelText();
		var textStyleClass = new labelTextStyle();
		
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var cdLayer = cs.getLayer();
		var lblWidth = group.children[0].getWidth();
		var lblHeight = group.children[0].getHeight();
                var imgObject = group.get('.img')[0];
                
                if(imgObject){
                   var imgH = parseInt($('#imgHeight').html());
                   var imgW = parseInt($('#imgWidth').html());                  
                   var ratio = imgW/imgH; 
                   var avlblWidth = lblWidth - 30;
                   var avlblHeight = lblHeight - 30;
                   if(imgH > avlblHeight) {
			var exratio = avlblHeight/imgH;
			imgH = imgH*exratio;
			imgW = Math.round(ratio*imgH);
                    }
                    if(imgW > avlblWidth){
			var exratio =avlblWidth/imgW;
			imgW = imgW*exratio;
			imgH = imgW/ratio;
                    }
                                 
                   imgObject.setSize(imgW,imgH);
                   imgObject.parent.setX((lblWidth - imgW)/2);                  
                   cdLayer.draw();	
                }            
		
		var txtObj = group.get('#txtGrp_'+group.attrs.id.split('_')[1])[0];
		var addTxtObj = group.get('#addTxt_'+group.attrs.id.split('_')[1])[0];
		var imgObj = group.get('#img_label_'+group.attrs.id.split('_')[1])[0];
		var grpid = group.attrs.id.split('_')[1];
		if(imgObj){
			if(txtObj){				
				txtObj.setWidth(lblWidth-20);
				
				
				var textStyleObj = PRGData.getTextStyleData(txtObj.getId().split('_')[1]);
				var textStyle = textStyleObj.fontStyle;
				var align = textStyleObj.align;
				var underline_value = textStyleObj.underline_value;
				
				var textValue = PRGData.getLabelTextValue(txtObj.parent.getId());
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
				addTxtObj.parent.setY(lblHeight-20);
				group.get('#txtBox_'+grpid)[0].setWidth(lblWidth-20);
				group.get('#txtBox_'+grpid)[0].setX((lblWidth-20-group.get('#txtBox_'+grpid)[0].getWidth())/2)
				group.get('#addTxt_'+grpid)[0].setWidth(lblWidth-20);
				group.get('#addTxt_'+grpid)[0].setAlign("center");
			}
		}else{
			if(txtObj){
				
				if(txtObj.getId().match(/^txtGrp_[0-9]/) != null){
					var textStyleObj = PRGData.getLabelTextStyleData(txtObj.getId().split('_')[1]);
					var textStyle = textStyleObj.fontStyle;
					var align = textStyleObj.align;
					var underline_value = textStyleObj.underline_value;
					
					var textValue = PRGData.getLabelTextValue(txtObj.parent.getId());
					if(textValue != ""){
						textFormat.deleteEachLabelText(txtObj);
						
						txtObj = textFormat.createLabelText(txtObj, textValue, align);
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
				cs.setActiveElement(txtObj.parent,'label');
				 //applyUnderline(txtObj);
			}else{
				if(addTxtObj){
					addTxtObj.parent.setY((lblHeight- addTxtObj.getTextHeight())/2);
					group.get('#txtBox_'+grpid)[0].setWidth(lblWidth-20);
					group.get('#txtBox_'+grpid)[0].setX(((lblWidth-20)-group.get('#txtBox_'+grpid)[0].getWidth())/2)
					group.get('#addTxt_'+grpid)[0].setWidth(lblWidth-20);
					group.get('#addTxt_'+grpid)[0].setAlign("center");
				}
				if(window.CD.elements.active.type == 'dock'){
					var prg = PRGData.getDockIndex(group.attrs.id);
					var txtGrpId = group.attrs.id.split('_')[2];
					var dockText = new TextTool.dockText();
					var txtVal = PRGData.Json.PRGData.PRGDockData[prg].sentence;
					var pjson = PRGData.Json.PRGData.PRGDockData[prg].textFormat;
					var txtGrpObj = group.get('#dock_txtGrp_'+txtGrpId)[0];	
					var initUnderline = pjson.underline_value;
					if(txtVal && txtVal!=""){
						//dockText.deleteActiveDockText('',txtGrpObj);
						dockText.deleteEachDockText(txtGrpObj);			//added by SS due to JS error when deleting activeDockText
						var textFormat = {
								'underline_value':pjson.underline_value,
								'fontSize':pjson.fontSize,
								'fontStyle':pjson.fontStyle,
								'align': pjson.align
							};
						txtGrpObj = dockText.createText(txtVal,txtGrpObj,textFormat);	
						dockText.bindLabelTextEvent(txtGrpObj);
						if(txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0]){					 	
							txtGrpObj.get('#dock_txtBox_'+txtGrpId)[0].setFill("transparent");
							txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0].hide();						
						}
					}
					
					if(initUnderline == "T"){
						PRGData.getDockJsonData()[prg].textFormat.underline_value = "T";
						ds.setOutputData();
					}
					if(PRGData.getDockJsonData()[prg].textFormat.align == "left")
						dockText.alignActiveTextLeft(txtGrpObj); 
					if(PRGData.getDockJsonData()[prg].textFormat.align == "center")
						dockText.alignActiveTextMiddle(txtGrpObj); 
					if(PRGData.getDockJsonData()[prg].textFormat.align == "justify")
						dockText.alignActiveTextJustify(txtGrpObj); 
					if(PRGData.getDockJsonData()[prg].textFormat.align == "right")
						dockText.alignActiveTextRight(txtGrpObj); 
					
					var textGroupArr = dockText.getTextObjFromGroupObject(txtGrpObj);
					var textGrpHeight = textGroupArr[textGroupArr.length-1].getY() + textGroupArr[textGroupArr.length-1].getHeight();
					txtGrpObj.setY((lblHeight-textGrpHeight)/2);
					var addTxtGrp = txtGrpObj.get('#dock_addTxt_'+txtGrpId)[0];
					if(addTxtGrp && txtGrpObj.get('#dock_txtBox_'+txtGrpId)[0]){
						txtGrpObj.get('#dock_txtBox_'+txtGrpId)[0].setWidth(lblWidth-20);					
						addTxtGrp.setWidth(lblWidth-20);
						//addTxtGrp.parent.setY((lblHeight-(addTxtGrp.getTextHeight()))/2);
						addTxtGrp.setAlign("center");
						if(txtGrpObj.get('#dock_txt_'+group.attrs.id.split('_')[2])[0]){
							txtGrpObj.get('#dock_txt_'+group.attrs.id.split('_')[2])[0].setWidth(lblWidth-20);
							
						}
					}
			}
		}
	}
		
		function applyUnderline(txtObj){
			if($('#UnderlinetTool').hasClass('active') || (txtObj.parent.get('.underline_txt')[0])){
				 var baseLabelTxtTool= new TextTool.commonLabelText(); 
				 baseLabelTxtTool.applyTextUnderline(txtObj, txtObj.parent);			  
			 }
		}
		
		
	},
	/*
	 * On apply click from label inspector, view gets populated
	 * in this method
	 */
	updateDimension : function(data){
		var lbConfig = new LabelConfig();
		var oldPrgData = PRGData.getOldLabelDockData();
		var zhp = PRGData.getHintParameterFromJson();
		var outputPRGJSon = PRGData.getJsonData();
		var outputPRGDockJSon = PRGData.getDockJsonData();
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var undoMng = window.CD.undoManager;
		var prgAdminData = PRGData.getJsonAdminData();
		oldPrgData.width = prgAdminData.SLELD.split(',')[0];
		oldPrgData.height = prgAdminData.SLELD.split(',')[1];
		if(outputPRGJSon['PRGT0']){
		oldPrgData.fill = PRGData.fillAndBorderEnable(outputPRGJSon['PRGT0'].current_item_transparency);
		oldPrgData.stroke= PRGData.fillAndBorderEnable(outputPRGJSon['PRGT0'].current_item_transparency_border);
		}
		if(outputPRGDockJSon['PRGS0']){
		oldPrgData.transpType= PRGData.getDockJsonData()['PRGS0'].current_SLED_item_transparency;
		}
		oldPrgData.dockHeight=PRGData.Json.DCKLD.split(',')[1];
		oldPrgData.dockWidth= PRGData.Json.DCKLD.split(',')[0];
		oldPrgData.hintWidth = zhp.w;
		oldPrgData.hintHeight= zhp.h;
		oldPrgData.feedbackWidth= prgAdminData.feedbackWidth;
		oldPrgData.feedbackHeight= prgAdminData.feedbackHeight;
		oldPrgData.labelOrDockHint= 'D';
		oldPrgData.labelOrDockFdbk= 'D';
		oldPrgData.hintOrFeedback = prgAdminData.showHintOrFeedbackInAuthoring;
		var activeElement = window.CD.elements.active.element[0];
		if(window.CD.elements.active.type == 'label') {			
			var frameGroup = cs.findGroup('frame_0');
			var stg = cs.getCanvas();
			var prgDock= "";
			var outputJSon = PRGData.getJsonData();
			var updateJSon = PRGData.Json;
			for(var prgCount in outputJSon){
				var labelGroupID = PRGData.Json.PRGData.PRGLabelData[prgCount].labelGroupId;
				var labelGroupID = PRGData.Json.PRGData.PRGLabelData[prgCount].labelGroupId;
				var labelGroupLbl = cs.findGroup(labelGroupID);
				if(labelGroupLbl.children.length <=0) {
					labelGroupLbl = cdLayer.get('#lbl_'+labelGroupID.split('_')[1])[0].parent;
				}
				if(PRGData.Json.PRGData.PRGLabelData[prgCount].distractor_label == 'F'){
					var assdockId = PRGData.Json.PRGData.PRGLabelData[prgCount].name;
					prgDock = PRGData.getDockIndex(assdockId);
				}
				
				var label = labelGroupLbl.children[0];
//				var labelGroupDock = cs.findGroup('dock_'+labelGroupID);
//				var dock = labelGroupDock.children[0];
				var calcX = data.width-20;
				var calcY = data.height-20;
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
				PRGView.updateLabelContent(labelGroupLbl,oldData,calcY);
				/*------------- check if same size as label is checked or not----------*/				
				
				var activeElement = window.CD.elements.active.element[0];
				
				/* --- for check box fill checked or not for label-----*/
				/** --- Updated for version 2000 --- **/
				var fillColor = lbConfig.style.fill;
				if(data.fill && PRGData.Json.PRGData.PRGLabelData[prgCount].distractor_label=="F") {
					label.setFill(fillColor);
					PRGData.Json.PRGData.PRGLabelData[prgCount].current_item_transparency = 'F';
					
				}else{
					if(PRGData.Json.PRGData.PRGLabelData[prgCount].distractor_label=="F"){
						label.setFill('transparent');				
						PRGData.Json.PRGData.PRGLabelData[prgCount].current_item_transparency = 'T';
					}
				}
				/* --- for check box fill checked or not for distractor-----*/
				if(data.fill && PRGData.Json.PRGData.PRGLabelData[prgCount].distractor_label=="T") {
					var distractorFillColor = '#faf8dd';
					label.setFill(distractorFillColor);
					PRGData.Json.PRGData.PRGLabelData[prgCount].current_item_transparency = 'F';
					
				}else{
					if(PRGData.Json.PRGData.PRGLabelData[prgCount].distractor_label=="T"){
						//QC#4033 distractor should not be transparent in authoring so next line is commented
						//label.setFill('transparent');				
						PRGData.Json.PRGData.PRGLabelData[prgCount].current_item_transparency = 'T';
					}
				}
				
				/* --- for check box border checked or not of label -----*/
				
				if(data.stroke) {
					label.attrs.strokeEnabled=true;
					label.setStroke('#999999');
					label.setStrokeWidth(1);
					PRGData.Json.PRGData.PRGLabelData[prgCount].current_item_transparency_border = 'F';
					
				} else {
					label.setStroke('transparent');
					PRGData.Json.PRGData.PRGLabelData[prgCount].current_item_transparency_border = 'T';
				}
			if(labelGroupID == activeElement.attrs.id || 'dock_'+labelGroupID == activeElement.attrs.id){
					label.setStrokeWidth(2);
					label.setStroke('#1086D9');
				}	
			
			}					
			PRGData.Json.adminData.SLELD = data.width+','+data.height;
			var labelGroup = cs.findGroup(activeElement.attrs.id);
			var labelData = PRGData.getInspectorLabelData();
			PRGView.activelabelData(labelData,labelGroup);
			PRGView.populateLabelData(true,labelData);
			var group = labelGroup;
			
		}
		if(window.CD.elements.active.type == 'dock'){
				this.resizeDock(data);
				var dockData = PRGData.getInspectorLabelData();
				var dockgrp = cs.findGroup(activeElement.attrs.id);
				PRGView.activelabelData(dockData,dockgrp);
				PRGView.populateLabelData(true,dockData);
				var group = dockgrp;
		}
		
		ds.setOutputData();
		cdLayer.draw();
		PRGView.applyPopulate();
		undoMng.register(this, PRGView.undoUpdateDimension,[oldPrgData,group,window.CD.elements.active.type] , 'undo update dimension',this, PRGView.undoUpdateDimension,[data,group,window.CD.elements.active.type] , 'redo update dimension');
		updateUndoRedoState(undoMng);
	},
	
	undoUpdateDimension : function(oldPrgData,group,labelOrDock){
		
		/** ***** Modified for redo hint box creation ***** **/
		var cs = window.CD.services.cs;
		var group = cs.findGroup(group.getId());
		if(labelOrDock == 'label'){
			cs.setActiveElement(group,'label');
		}
		if(labelOrDock == 'dock'){
			cs.setActiveElement(group,'dock');
		}	
		PRGView.updateDimension(oldPrgData);
		PRGView.removeHint();
		PRGView.bindFeedbackHintEventAllLabel($('input[name=hintFeedback]:checked').val(),$('input[name=hoverHint]:checked').val(),$('input[name=feedbackType]:checked').val());
	},
	resizeDock:function(data){		
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var frameGroup = cs.findGroup('frame_0');
		var stg = cs.getCanvas();
		var outputJSon = PRGData.Json.PRGData;
		var updateJSon = PRGData.Json;
		for(var prgCount in outputJSon.PRGDockData){
			var dockGroupId = PRGData.Json.PRGData.PRGDockData[prgCount].dockGroupId;
			var dockGroup = cs.findGroup(dockGroupId);
			var dock = dockGroup.children[0];
			var calcX = data.dockWidth-20;
			var calcY = data.dockHeight-20;
			var unlockIconLbl = dockGroup.get('.unlockicon_'+dockGroupId)[0];
			var lockIconLbl = dockGroup.get('.lockicon_'+dockGroupId)[0];				
			var oldData = {'height':dock.getHeight(),'width':dock.getWidth()};				
			var topLeft = dockGroup.get('.topLeft_'+dockGroupId)[0];
			var topRight = dockGroup.get('.topRight_'+dockGroupId)[0];
			var bottomLeft = dockGroup.get('.bottomLeft_'+dockGroupId)[0];
			var bottomRight = dockGroup.get('.bottomRight_'+dockGroupId)[0];
			
			unlockIconLbl.setX(calcX);
			lockIconLbl.setX(calcX);
			unlockIconLbl.setY(calcY);
			lockIconLbl.setY(calcY);
			
			topLeft.setX(0);
			topLeft.setY(0);
			topRight.setX(data.dockWidth);
			topRight.setY(0);
			bottomLeft.setX(0);
			bottomLeft.setY(data.dockHeight);
			bottomRight.setX(data.dockWidth);
			bottomRight.setY(data.dockHeight);
			
			dock.setSize(parseInt(data.dockWidth), parseInt(data.dockHeight));
			PRGView.updateLabelContent(dockGroup,oldData,calcY);

				var activeElement = window.CD.elements.active.element[0];
				/* --- for dock only, radio button for transparancy -----*/
				if(data.transpType ==='F'){
					dock.setFill('white');
					dock.setStroke('#999999');
					PRGData.Json.PRGData.PRGDockData[prgCount].current_SLED_item_transparency = 'F';					
				}else{
					if(data.transpType ==='T'){
					dock.setFill('transparent');
					//dock.setStroke('#999999');
					//dock.setStrokeWidth(0);
					dock.setStroke('rgba(0,0,0,0)');  
					PRGData.Json.PRGData.PRGDockData[prgCount].current_SLED_item_transparency = 'T';	
					}
				}
				if(dockGroupId == activeElement.attrs.id){					
						dock.setStrokeWidth(2);
						dock.setStroke('#1086D9');
					}
				/* --------- For Hint / Feedback ----------------*/
				
				var adminData = PRGData.getJsonAdminData();
				var outputJSonDock = PRGData.getDockJsonData();
				adminData.showHintOrFeedbackInAuthoring = data.hintOrFeedback;
				if(data.hintOrFeedback == 'hint' || data.hintOrFeedback == 'feedback'){
					PRGView.makeHintFeedbackPlaceHolder(data.hintOrFeedback,data.hintWidth,data.hintHeight,data.feedbackWidth,data.feedbackHeight);
					if(data.hintOrFeedback == 'hint'){
						if(data.labelOrDockHint =='label'){
							adminData.HRO = 'L';
						}else{
							adminData.HRO = 'D';
						}
					}
					if(data.hintOrFeedback == 'feedback'){
						if(data.labelOrDockFdbk =='label'){
							adminData.FRO = 'L';
						}else{
							if(data.labelOrDockFdbk =='dock'){
								adminData.FRO = 'D';
							}
						}
					}
				}else{
					if(data.hintOrFeedback == 'none'){
						dockGroup.off('mouseover');
						dockGroup.off('mouseout');
						if(cdLayer.get('#authHintGrp')[0]){
							var hintGroup = cdLayer.get('#authHintGrp')[0];
							hintGroup.remove();
						}
					}
				}
			}
		
		//if(data.instructionText == true){
			PRGView.toggleInstruction(data.instructionText);	
		//}
		PRGData.Json.DCKLD = data.dockWidth+','+data.dockHeight;
	},
	handleDisplayLabelOnce : function() {
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var cdLayer = cs.getLayer();
		var outputJSon = PRGData.getJsonData();
		var adminData = PRGData.getJsonAdminData();
		var textArr = new Array();
		var labelCount = cs.objLength(outputJSon);
		
		for(var i=0; i<labelCount; i++){
			 var labelGrpId = outputJSon['PRGT'+i].labelGroupId;				
			 var label = cs.findGroup(labelGrpId);
			 var currentLabel = window.CD.elements.active.element[0].parent;
			 var lblIndex = currentLabel.attrs.id.split('_')[1];
			 var currentTxtGrp = currentLabel.get('#txtGrp_'+lblIndex)[0];
			 if(currentTxtGrp)
				 var currentTxtGrpText = PRGData.getLabelTextValue(currentLabel.attrs.id);
			// var crrntLblId = 'PRGT'+currentLabel.attrs.id.split('_')[1];
			 /*changed to handle json value*/
			 var crrntLblId = PRGData.getLabelIndex(currentLabel.attrs.id);
			 var distractorVal = window.CD.module.data.Json.PRGData.PRGLabelData[crrntLblId].distractor_label;
			 if((labelGrpId != currentLabel.attrs.id)&& label && (label.get('#txtGrp_'+label.attrs.id.split('_')[1])[0])){
				 var text = PRGData.getLabelTextValue(label.getId());
				 if(text == currentTxtGrpText){
					 var flag = false;
					 if(distractorVal == 'T'){
						 flag = true;
					 }
					PRGView.callOTOWarningMessage(currentLabel,lblIndex,flag);
				 }
			 }
		 }
	},

  	/*
	 * Warning message call for OTO
	 * By Nabonita Bhattacharyya
	 */
	callOTOWarningMessage : function(labelGroupLbl,lblIndex,flag){
		try{
			var Util = window.CD.util;
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var ds = window.CD.services.ds;
			var textFormat = new TextFormat();
			
			/** --- applying mask ---**/
			$('.errorOverLay').remove();
			var errorOverLay = $('<div class="errorOverLay"></div>')
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
			if(flag && flag == true){
				$('#errorTextOTO .error_warning_text').html('You cannot have a distractor with the same text as a label.');
			}
			$('#OTOButton #errorOk').show();
			$('#errorOk').html('Ok');
			$('#alertMessage').slideDown(200);	
			
			$("#errorModal span#errorOk").off('click').on('click',function(){
				$('#errorModal').slideUp(200);
				$('.errorOverLay').remove();//removing mask
				var txtBox = labelGroupLbl.get('#txtBox_'+lblIndex)[0];
				var txtObj = labelGroupLbl.get('#txtGrp_'+lblIndex)[0];
				var addTxt = labelGroupLbl.get('#addTxt_'+lblIndex)[0];
				var prg = PRGData.getLabelIndex(labelGroupLbl.attrs.id);
				var labelData = PRGData.getJsonData();
				
				textFormat.deleteEachLabelText(txtObj);
				
				/** --- changed for label text alignment when text is long --- **/
				var jsonData = window.CD.module.data.getJsonAdminData();
				var labelWidth = jsonData.SLELD.split(',')[0];
				var labelHeight = jsonData.SLELD.split(',')[1];
				
				var leftPadding = ((labelWidth- txtBox.getWidth())/2);
				var calcY = ((parseInt(labelHeight) - addTxt.getHeight())/2);/*-txtBox.parent.getY()*/
				
				if(leftPadding<0)
					leftPadding = 0;
				
				txtBox.show();
				txtBox.setFill('#fff');				
				//txtBox.parent.setY(0);
				txtObj.setY(calcY);	
				txtObj.setX(leftPadding);
				/*changed to align text in label*/
				
				addTxt.show();
				addTxt.parent.setY(calcY);
				
				var prgTextTool= new TextTool.commonLabelText();
				prgTextTool.bindLabelTextEvent(addTxt.parent);
				cdLayer.draw();
				labelData[prg].term = '';
				ds.setOutputData();	
			});
		}catch(err){
			console.error("@PRGView::Error on warning message for OTO::"+err.message);
		}
	},
	makeHintFeedbackPlaceHolder:function(hintOrFeedback,hintWidth,hintHeight,feedbackWidth,feedbackHeight){
		
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var cdLayer = cs.getLayer();
		var frameGroup = cs.findGroup('frame_0');
		var outputJSon = PRGData.getJsonData();
		var adminData = PRGData.getJsonAdminData();
		var hintGroup = cs.findObject(frameGroup,'authHintGrp')
		
		var hintFeedbackParam = PRGData.getHintParameterFromJson();
		var plcHoldrX = hintFeedbackParam.x;
		var plcHoldrY = hintFeedbackParam.y;
		
		PRGData.setHintParameterInJson(hintWidth,hintHeight,plcHoldrX,plcHoldrY);
		adminData.feedbackWidth = feedbackWidth;
		adminData.feedbackHeight = feedbackHeight;

		var stg=window.CD.services.cs.getCanvas();
		if(hintOrFeedback == 'hint'){
			
			PRGView.removeAuthHinBox();
			
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
			PRGView.createHintGroupAuth(hintWidth,hintHeight,plcHoldrX,plcHoldrY);
			PRGData.setHintParameterInJson(hintWidth,hintHeight,plcHoldrX,plcHoldrY);
			
		}else if(hintOrFeedback == 'feedback'){
			PRGView.removeAuthHinBox();
			
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
			
			PRGView.createHintGroupAuth(feedbackWidth,feedbackHeight,plcHoldrX,plcHoldrY);
			PRGData.setHintParameterInJson('','',plcHoldrX,plcHoldrY);
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
	 * This method is used to bind the hint event with label
	 * On mouseover hint value will be shown
	 */
	bindHintEvent:function(labelOrDock){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var outputJSon = PRGData.getDockJsonData();
		var type = 'hint';
		//for(var prg in outputJSon){
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		if(activeType == 'dock' && labelOrDock == 'dock'){/*Event bind on dock */
			/*commented for binding hint events*/
			//for(var dckCont in outputJSon){
				//var dockGrpId = outputJSon[dckCont].dockGroupId;
				//var dockGrp = cs.findGroup(dockGrpId);
				//dockGrp.off('mouseover');
				//dockGrp.off('mouseout');
			//}
				activeElm.on('mouseover',function(evt){
					console.log('bindhint---');
					if(PRGData.getJsonAdminData().showHintOrFeedbackInAuthoring != 'none'){
					var outputJSon = PRGData.getDockJsonData();
					var prg = PRGData.getDockIndex(this.attrs.id);
						if(outputJSon[prg].sentence_hint && outputJSon[prg].sentence_hint!='%n%'){
							PRGView.removeHint();
							PRGView.createHintObject(prg, outputJSon[prg].sentence_hint,"hint");
						}
					}
				});	
				
			} 
		activeElm.on('mouseout',function(evt){
			PRGView.removeHint();
		});
	},

	/*
	 * For Feedback event bind for active element
	 */
	bindFeedbackEvent:function(labelOrDock){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var outputJSon = PRGData.getDockJsonData();
		var type = 'feedback';
		//for(var prg in outputJSon){
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		
		if(activeType == 'dock' && labelOrDock == 'dock'){/*Event bind on dock */
			
				
				activeElm.on('mouseover',function(evt){
					if(PRGData.getJsonAdminData().showHintOrFeedbackInAuthoring != 'none'){
					var outputJSon = PRGData.getDockJsonData();
					var prg = PRGData.getDockIndex(this.attrs.id);
						if(outputJSon[prg].feedback && outputJSon[prg].feedback!=''){
							PRGView.removeHint();
							PRGView.createHintObject(prg, outputJSon[prg].feedback,"feedback");
						}
					}
				});
				activeElm.on('mouseout',function(evt){
					PRGView.removeHint();
				});
			
		}
	},
	/*
	 * For selectiing binding method for either hint or feedback
	 * for hint, call bindHintEvent()
	 * for feedback bindFeedbackEvent()
	 */
	bindFeedbackHintEvent:function(hintOrFeedback,labelOrDock,labelOrDockFdbk){
		if(hintOrFeedback=='hint'){
			PRGView.removeHint();
			PRGView.bindHintEvent(labelOrDock);
		}else{
			if(hintOrFeedback == 'feedback'){
				PRGView.removeHint();
				PRGView.bindFeedbackEvent(labelOrDock);
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
		PRGView.removeHint();
		if(hintOrFeedback=='hint'){
			PRGView.bindHintEventAllLabel(labelOrDock);
		}else {
			if(hintOrFeedback=='feedback'){
				PRGView.bindFeedbackEventAllLabel(labelOrDock);
			}
		}
		
	},
	/*
	 * For event binfing of hint for all labels on apply click
	 */
	bindHintEventAllLabel : function(labelOrDock){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var outputJSon = PRGData.getDockJsonData();
		var type = 'hint';
		//for(var prg in outputJSon){
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		
		for(var prg in outputJSon){
			var dockGroupId = outputJSon[prg].dockGroupId;
			var docGroup = cs.findGroup(dockGroupId);
			if(docGroup){
				/*commented for binding hint events*/
				
		//	docGroup.off('mouseover');
		//	docGroup.off('mouseout');
				docGroup.on('mouseover',function(evt){
				if(PRGData.getJsonAdminData().showHintOrFeedbackInAuthoring != 'none'){
					var prgId = PRGData.getDockIndex(this.attrs.id);
					//var outputJSon = PRGData.getDockJsonData();
					PRGView.removeHint();
					if(outputJSon[prgId].sentence_hint && outputJSon[prgId].sentence_hint!=''){						
						PRGView.createHintObject(prgId, outputJSon[prgId].sentence_hint,"hint");
					}
				}
				});
				docGroup.on('mouseout',function(evt){
					PRGView.removeHint();
				});
			}
		}
	},
	/*
	 * For event binfing of feedback for all labels on apply click
	 */
	bindFeedbackEventAllLabel : function(labelOrDock){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var outputJSon = PRGData.getDockJsonData();
		var type = 'feedback';
		//for(var prg in outputJSon){
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		
		for(var prg in outputJSon){
			var dockGroupId = outputJSon[prg].dockGroupId;
			var docGroup = cs.findGroup(dockGroupId);
				docGroup.on('mouseover',function(evt){
				if(PRGData.getJsonAdminData().showHintOrFeedbackInAuthoring != 'none'){
					var outputJSon = PRGData.getDockJsonData();
					var prgId = PRGData.getDockIndex(this.attrs.id);
					PRGView.removeHint();
					if(outputJSon[prgId].feedback && outputJSon[prgId].feedback!=''){						
						PRGView.createHintObject(prgId, outputJSon[prgId].feedback,"feedback");
					}
				}
				});
				docGroup.on('mouseout',function(evt){
					PRGView.removeHint();
				});	
		}
		
	
	},
	/*
	 * This is used to make text object for hint group
	 * the text will be added to the hintGrp object
	 */
	createHintObject : function(prgCount,val,type){
		var activeElement = window.CD.elements.active.element[0];
		var hintJson = PRGData.getHintParameterFromJson();
		var adminData = PRGData.getJsonAdminData();
		var GFS = parseInt(adminData.GFS);
			
		var lbConfig = new LabelConfig();
		if(activeElement){
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var frameGroup = cs.findGroup('frame_0');
			if(type == 'hint'){
				var height = hintJson.h;
				var width = hintJson.w;
			}else{
				if(type == 'feedback'){
					var height = parseInt(adminData.feedbackHeight);
					var width = parseInt(adminData.feedbackWidth);
				}
			}
			
			
			var authhintGroup = cdLayer.get('#authHintGrp')[0];
			if(authhintGroup){
				var hintX = authhintGroup.getX(); 
				var hintY = authhintGroup.getY();
			}else{
				var hintX = 0; 
				var hintY = 0;
			}
			
			var hintGroup = cs.findGroup('hintGrp');
			if(!hintGroup){
				hintGroup = cs.createGroup('hintGrp',{x: hintX , y : hintY , name: 'hint_grp'})
			}else{
				hintGroup.setX(hintX);
				hintGroup.setY(hintY);
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
			var hintTexts = new Kinetic.Text({			
				text : val,
				fontSize: 14,//GFS,
		        fontFamily: 'sans-serif',
		        fill: '#555',
		        opacity: '1',	
	            id: 'hintTxt_'+activeElement.attrs.id.split('_')[1],
	            name: 'hinttxt'
	          });
			hintGroup.add(hint);
			hintGroup.add(hintTexts);
			
			hintTexts.setX(((hint.getWidth())-(hintTexts.getTextWidth()))/2);
			hintTexts.setY(((hint.getHeight())-(hintTexts.getTextHeight()))/2);
			
			cdLayer.add(hintGroup);
			/* ----------- Modified for vertical alignment --------- */
			if(hintTexts.getTextWidth()>width){
				hintTexts.setX(hint.getX()+7);
				hintTexts.setWidth(parseInt(width)-7);
				var textH = parseInt(hintTexts.textArr.length*hintTexts.getTextHeight());
				var spaceLeft = parseInt(hint.getHeight())-parseInt(textH);
				if(spaceLeft>0){
					var modifiedY = spaceLeft/2;
				}else{
					var modifiedY = 7;
				}
				hintTexts.setY(modifiedY);
				hintTexts.setHeight(parseInt(height)-7);
			}
			cdLayer.draw();
		}
	},
	
	/*
	 * This method is used for making new hint group
	 * without hint text
	 */
	createHintGroupAuth : function(width,height,x,y){
		var width = parseInt(width);
		var height = parseInt(height);
		var x = parseInt(x);
		var y = parseInt(y);
		var activeElement = window.CD.elements.active.element[0];
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var frameGroup = cs.findGroup('frame_0');
		var adminData = PRGData.getJsonAdminData();
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
			evt.cancelBubble = true;
			this.moveToTop();
		});
		hintGroupAuth.on('click',function(evt){
			evt.cancelBubble = true;
		}); 
		
		hintGroupAuth.on('dragend',function(evt){
			var undoMng = window.CD.undoManager;
			var hintJson = PRGData.getHintParameterFromJson();
			var newXY = {};
			newXY.x = this.getX();
			newXY.y = this.getY();
			undoMng.register(this, PRGView.updatePlaceHolderPosition,[hintJson,hintGroupAuth] , 'undo update dimension',this, PRGView.updatePlaceHolderPosition,[newXY,hintGroupAuth] , 'redo update dimension');
			updateUndoRedoState(undoMng);
			evt.cancelBubble = true;
			var ds = window.CD.services.ds;
			PRGData.setHintParameterInJson('','',parseInt(this.getX()),parseInt(this.getY()));
			ds.setOutputData();	
		});
	},
	
	updatePlaceHolderPosition : function(zhp,hintGroup){
		try{
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var ds = window.CD.services.ds;
			var x = parseInt(zhp.x);
			var y = parseInt(zhp.y);
			hintGroup = cs.findGroup(hintGroup.getId());
			hintGroup.setX(x);
			hintGroup.setY(y);
			PRGData.setHintParameterInJson('','',x,y);
			ds.setOutputData();
			cdLayer.draw();
		}
		catch(err){
			console.error("@PRGView::Error on updatePlaceHolderPosition::"+err.message);
		}
	},
	/*
	 * This is used to clear hint text fron hint group if no 
	 * value is there in either of the sentence_hints
	 */
	removeHint : function(){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		if(cdLayer.get('.hint_grp')[0]){
			cdLayer.get('.hint_grp')[0].removeChildren();
			cdLayer.get('.hint_grp')[0].remove();
		}
		cdLayer.draw();
	},
	/*
	 * This is used to remove hint/feedback box 
	 * when 'none' is clicked from inspector
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
	
	/*
	 * this method is used to update prgData for hint and feedback
	 * textarea on focus out
	 * It is being called from stage.js
	 * By Nabonita Bhattacharyya on 07th May, 2013
	 */
	updateHintFeedbackVal : function(hintValue,feedbackValue){
		var activeElm = window.CD.elements.active.element[0];
		if(activeElm.attrs.id.match(/^dock_label_[0-9]+/)){
			var prg = PRGData.getDockIndex(activeElm.attrs.id);
			var prgJson = PRGData.getDockJsonData();
		}else{
			if(activeElm.attrs.id.match(/^dock_txtGrp_[0-9]+/)){
				var prg = PRGData.getDockIndex(activeElm.parent.getId());
				var prgJson = PRGData.getDockJsonData();
			}
		}
		var ds = window.CD.services.ds;
		try{
			if(prg && hintValue!=null && hintValue!=""){
				prgJson[prg].sentence_hint = hintValue;
				ds.setOutputData();
			}else{
				prgJson[prg].sentence_hint='';
				ds.setOutputData();
			}
			ds.setOutputData();
			if(prg && feedbackValue!=null && feedbackValue!=""){
				prgJson[prg].feedback = feedbackValue;
				ds.setOutputData();
			}else{
				prgJson[prg].feedback = '';
				ds.setOutputData();
			}
		}catch(e){
			console.log('Error in update hint'+e);
		}
		
		
	},
	/*
	 * This is used to show the hint value as per active element
	 * if no sentence_hint or dock_sentence_hint is there for the active element
	 * 'start typing' is shown
	 */
	showSavedHint : function(labelGrp){
		var dockJson = PRGData.getDockJsonData();
		if(labelGrp.attrs.id.match(/^dock_label_[0-9]+/)){
			var prg = PRGData.getDockIndex(labelGrp.attrs.id);
		}
		
		if(labelGrp.attrs.id.match(/^dock_label_[0-9]+/) && dockJson[prg].sentence_hint && dockJson[prg].sentence_hint!=''){
			var hintText = dockJson[prg].sentence_hint;
		}else{
			var hintText = null;
		}
		
		if(labelGrp.attrs.id.match(/^dock_label_[0-9]+/) && dockJson[prg].feedback && dockJson[prg].feedback!=''){
			var feedbackText = dockJson[prg].feedback;
		}else{
			var feedbackText = null;
		}
		
		PRGView.populateHintArea(hintText,feedbackText);
	},
	audioAvailableStatusInLabel : function(audioName){
		try{
			var labelData  = window.CD.module.data.Json.PRGData.PRGLabelData;
			var audCounter = 0;
			for(var eachLabel in labelData){
				var audio = labelData[eachLabel].media_PRGT_value;
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
			console.log('@prgView :: Error in imageAvailableStatusInLabel for image availability status'+err.message);
		}
	},
	/*
	 * This is used to populate hint text area with values for 
	 * each label/dock. If they thave values in label or dock respected 
	 * values are shown. Otherwise textarea remains blank
	 */
	populateHintArea : function(hintArea,feedbackArea){
		if(hintArea && hintArea!=null && hintArea!=''){
			$('#textareaHint').val(hintArea);
		}else{
			$('#textareaHint').val('').blur();
		}
		
		if(feedbackArea && feedbackArea!=null && feedbackArea!=''){
			$('#textareaFeedback').val(feedbackArea);
		}else{
			$('#textareaFeedback').val('').blur();
		}
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
		if(activeType == 'dock'){
			var cdLayer = cs.getLayer();
			var infoTextTObj,infoTextHObj;
			var prg = PRGData.getDockIndex(activeElm.attrs.id);
			var dockGroup = cs.findGroup(activeElm.attrs.id);
			var dockGroupId = PRGData.getDockJsonData()[prg].dockGroupId;
			
			$.each(dockGroup.children, function(index,value){
				if(value.nodeType==="Group" && value.attrs.id.match(/infoText_dock_label_[0-9]+/)){
					/*fetching T,H,F infotext object*/
					$.each(value.children, function(i,v){
						if(v.attrs.id.match(/H_infoText_dock_label_[0-9]+/)){
							infoTextHObj=v;
						}
						if(v.attrs.id.match(/F_infoText_dock_label_[0-9]+/)){
							infoTextFObj=v;
						}
					});
					
				}
					
			});
			
				var infoHvisible=infoTextHObj.getVisible();
				var infoFvisible=infoTextFObj.getVisible();
				/*for hint type*/
				if(type == "textareaHint"){
					
					var hintValue = textAreaObjVal;
					if(hintValue!=null && hintValue!=""){
						infoTextHObj.show();
						PRGData.getDockJsonData()[prg].infoHintText='T';
						/*adjust position for T and F*/
						if(infoFvisible){
							var infoHX=infoTextHObj.getX();
							infoTextFObj.setX(infoHX+10);
						}
					}else{
						infoTextHObj.hide();
						PRGData.getDockJsonData()[prg].infoHintText='T';
					}
					
				}
				/*for feedback type*/
				if(type == "textareaFeedback"){
					var feedbackValue = textAreaObjVal;
					if(feedbackValue!=null && feedbackValue!=""){
						infoTextFObj.show();
						PRGData.getDockJsonData()[prg].infoFText='T';
						/*adjust position for T and F*/
						if(infoHvisible){
							var infoHX=infoTextHObj.getX();
							infoTextFObj.setX(infoHX+10);
						}					
					}else{
						infoTextFObj.hide();
						PRGData.getDockJsonData()[prg].infoFText='F';
					}
				}
				 cdLayer.draw();
				 ds.setOutputData();
		}
			
		
	},
	
	/**
	 * function name: onClickHideLabelText()
	 * description:on click on hide text check box
	 * this method get called.
	 * author:Piyali Saha
	 */
	onClickHideLabelText :function(){},
	
  idDockSameAsLabel:function() {},
  
  getConnectorType:function(type) {},
	handleConnectorTypeChange:function(dd){},
	
	/*
	 * Cancel event for label
	 * By Nabonita Bhattacharyya
	 */
	labelCancelEvent : function(){
		if(window.CD.elements.active.type == 'label' || window.CD.elements.active.type == 'dock') {
			var outputLabelData = PRGData.getJsonData();
			var outputDockData = PRGData.getDockJsonData();
			var adminData = PRGData.getJsonAdminData();
			
			/* ----------- Label height & Width ------------ */
			$('#labelWidth').val(adminData.SLELD.split(',')[0]);
			$('#labelHeight').val(adminData.SLELD.split(',')[1]);
			
			/* ----------- Dock height & Width ------------ */
			$('#dockWidth').val(window.CD.module.data.Json.DCKLD.split(',')[0]);
			$('#dockHeight').val(window.CD.module.data.Json.DCKLD.split(',')[1]);
			
			/* ------------- hint / feedback ------------------ */
			if(adminData.showHintOrFeedbackInAuthoring == 'hint'){
				$('input[name=hintFeedback][value=hint]').prop('checked',true);
			}else if(adminData.showHintOrFeedbackInAuthoring == 'feedback'){
				$('input[name=hintFeedback][value=feedback]').prop('checked',true);
			}else{
				$('input[name=hintFeedback][value=none]').prop('checked',true);
			}
			if(adminData.HRO = 'D'){
				$('input[name=hoverHint][value=dock]').prop('checked',true);
			}
			
			if(adminData.FRO = 'D'){
				$('input[name=feedbackType][value=dock]').prop('checked',true);
			}
			/*------------------ For all Labels --------------- */
			for(var prg in outputLabelData){
				/* --------------- Fill ----------------------- */
				if(outputLabelData[prg].current_item_transparency == 'F'){
					$('#labelFillGlob').prop('checked',true);
				}else{
					$('#labelFillGlob').prop('checked',false);
				}
				/*----------------- Label Border ------------------ */
				if(outputLabelData[prg].current_item_transparency_border == 'F'){
					$('#labelBorderGlob').prop('checked',true);
				}else{
					$('#labelBorderGlob').prop('checked',false);
				}
				
			}
			/*------------------ For all Docks --------------- */
			for(var prgDock in outputDockData){
				/* ---------------- for transparent type ------------- */
				
				if(outputDockData[prgDock].current_SLED_item_transparency === 'F'){
					$('input[name=transparenTypeLoc][value=solid]').prop('checked',true);
					$('input[name=transparenType][value=solid]').prop('checked',true);
				}else if(outputDockData[prgDock].current_SLED_item_transparency === 'T'){
					$('input[name=transparenTypeLoc][value=transparent]').prop('checked',true);
					$('input[name=transparenType][value=transparent]').prop('checked',true);
				}	
				
				
			}
			var hintJson = PRGData.getHintParameterFromJson();
			var adminData = PRGData.getJsonAdminData();
			
			if(hintJson.w !='')
				$('#hintWidth').val(hintJson.w);
			if(hintJson.h != '')
				$('#hintHeight').val(hintJson);
			if(adminData.feedbackWidth != '')
				$('#feedbackWidth').val(adminData.feedbackWidth);
			if(adminData.feedbackHeight != '')
				$('#feedbackHeight').val(adminData.feedbackHeight);
		}
	},
	/*---------------------------------------------For Zoom ------------------------------------------------*/
	
	createZoomObject : function(pointingImage,zoomFactor){},
	removeZoom : function(){},
	/*
	 * For zoom
	 */
	bindZoomEvent : function(dockGroup){},

	/*
	 * This is used to make labeling magnification placeholder
	 */
	labelingMagnification : function(magnifyData){},
	
	removeZoomPlaceHolder : function(){},
	updateZoomLocal : function(localData){},
	bindInspectorEvents : function(){

		/* ---------- For making Local transparent type and border readonly--------------*/
		$(':radio[name=transparenTypeLoc],:checkbox[id=dockFillLoc],:checkbox[id=magnEnableLoc]').attr("disabled",true);
		$(':radio[name=transparenTypeLoc],:checkbox[id=dockFillLoc],:checkbox[id=magnEnableLoc]').click(function(){
		    return false;
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
	 	
	 	$('#propertiesDivLabel div.select_box').each(function(){
			
			$(this).parent().children('div.select_box').click(function(){
				if($(this).children('div.select_options').css('display') == 'none'){
					$(this).children('div.select_options').css('display','block');
				}
				else
				{
					$(this).children('div.select_options').css('display','none');
				}
			});
			
			$(this).find('span.select_option').click(function(){	
			
				$(this).css('display','none');
				$(this).closest('div.select_box').attr('value',$(this).attr('value'));
				$(this).parent().siblings('span.selected').html($(this).html());
				
			});
		});
		
		$(document).not("#propertiesDivLabel div.select_options").click(function(e) {
			if((!($(e.target).hasClass('select_box'))) && ($(e.target).parents('.select_box').length == 0)) {					
				$('div.select_options').hide();
			}
			if(typeof window.CD.module.view.handleConnectorTypeChange == "function"){
				window.CD.module.view.handleConnectorTypeChange($(e.target).parents('.select_box').find('span.selected'));
			}
	    });
		
		/*$('#instructText').bind('change',function(){
			PRGView.toggleInstruction($("#instructText").prop('checked'));	
		});*/
	 	
 	},
	/*
	 * This is used for making toggle instruction when
	 * Ordering of dock is On
	 */
	toggleInstruction : function(toggleIns){
		console.log("@PRGView.toggleInstruction");
		try{
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();	
			var dockOutputJson = PRGData.getDockJsonData();
			var insImageGroup = cdLayer.get('#insImg_group')[0];
			if(insImageGroup){
			var temp =dockOutputJson['PRGS0'].PRG_sentence_list_y;
			var keyTemp = 'PRGS0';
			
				if(toggleIns){	
					for(key in dockOutputJson){
						if(parseInt(temp) > parseInt(dockOutputJson[key].PRG_sentence_list_y)){
							temp = dockOutputJson[key].PRG_sentence_list_y;
							keyTemp = key;
						}
					}
					var imageY = temp - 70;
					if(imageY<0)
						imageY = 0;
					insImageGroup.setY(imageY);
					insImageGroup.moveToTop();
					insImageGroup.setX(dockOutputJson[keyTemp].PRG_sentence_list_x);
					insImageGroup.show();
					PRGData.Json.adminData.showInstructiontextAuthoring = true;
				}else{
					insImageGroup.hide();
					PRGData.Json.adminData.showInstructiontextAuthoring = false;
				}
			cdLayer.draw();
			}
			
		}catch(err){
			console.error("@PRGView::Error on toggleInstruction::"+err.message);
		}
		
	},
	onClickShowHiddenTxtGlobal : function(){
		
	},
	
	/*
	 * This method is for populating Global and Local tab for
	 * Label Inspector
	 * On apply click view will be populated with user chosen values
	 * By Nabonita Bhattacharyya
	 */
	applyPopulate : function(){
	
	
 		var dockWidth = PRGData.Json.DCKLD.split(',')[0];
		var dockHeight = PRGData.Json.DCKLD.split(',')[1];
		var labelWidth = PRGData.Json.adminData.SLELD.split(',')[0];
		var labelHeight = PRGData.Json.adminData.SLELD.split(',')[1];
	
		$('#localDockWidth').html($('#dockWidth').val());
		$('#localDockHeight').html($('#dockHeight').val());
 	
		$('#localLabelWidth').html($('#labelWidth').val());
		$('#localLabelHeight').html($('#labelHeight').val());
	
	
	
	if($('input[name=transparenType]:checked').val() === 'solid'){
		$('input[name=transparenTypeLoc][value=solid]').prop('checked',true);
	}
	else{
		$('input[name=transparenTypeLoc][value=transparent]').prop('checked',true);
	}
	
	if($('#labelBorderGlob').prop('checked') ==  true)
		$('#labelBorderLoc').prop('checked',true);
	else
		$('#labelBorderLoc').prop('checked',false);
	
	if($('#labelFillGlob').prop('checked') ==  true)
		$('#labelFillLoc').prop('checked',true);
	else
		$('#labelFillLoc').prop('checked',false);
	
},
createKineticObject: function(options){ 
  	 console.log("@PRGView::createKineticObject");
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
			 return kineticObject;
		}catch(err){
			console.error("@PRGView::Error on createKineticObject::"+err.message);
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
		
		/* condition added to show info for 'Show instruction text in authoring' */
		$('body #labelInfoIconModal #'+newId).find('.dont_show').each(function(){
			if($(this).hasClass('show_instruction_text')){
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
	fixTextEntities:function(input){
		console.log("@PRGView.fixTextEntities");
		try{
		    var result = (new String(input)).replace(/&(amp;)/g, "&");
		    return result.replace(/&#(\d+);/g, function(match, number){ return String.fromCharCode(number); });
		}catch(err){
			console.error("@PRGView::Error on fixTextEntities::"+err.message);
		}
	},
	/*added for instruction text*/
	hideIns:function(){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var insImg = cdLayer.get('#insImg_group')[0];
		if(insImg){
		insImg.hide();
		cdLayer.draw();
		$('#instructText').prop('checked',false);
		}
	},
	setIns:function(){
		
		if(window.CD.module.data.Json.PRGPS.sentenceReorder == "T"){
			var firstDock = PRGData.getDockJsonData()['PRGS0'];
			if(firstDock){
			PRGView.loadInsImage(firstDock.PRG_sentence_list_x,firstDock.PRG_sentence_list_y);
			if(PRGData.Json.adminData.showInstructiontextAuthoring == true){
				PRGView.toggleInstruction(true);
			}else{
				PRGView.toggleInstruction(false);
				$('#instructText').prop('checked',false);
			}
			
			}
		}else if(window.CD.module.data.Json.PRGPS.sentenceReorder == "F"){
			$('#instructionText').css('display','none');
			$('#instructText').prop('checked',false);
			this.removeInsImage();
		}
	},
	deleteAudio:function(node){
		var ds = window.CD.services.ds;
		var labelData  = window.CD.module.data.Json.PRGData.PRGLabelData;
		labelData[node].media_PRGT_value = "N";
		labelData[node].coor_PRGT_value.x = 0;
		labelData[node].coor_PRGT_value.y = 0;
		ds.setOutputData();
	},
	registerAudioUndoRedo : function(thisObj,media_value,audioelem,labelGroup) {
		var undoMng = window.CD.undoManager;
		var cs = window.CD.services.cs;
		var oldObject = {};					
		var prg = window.CD.module.data.getLabelIndex(labelGroup.attrs.id);
		var jsonObj = window.CD.module.data.getJsonData();
		oldObject.x = jsonObj[prg].coor_PRGT_value.x;
		oldObject.y = jsonObj[prg].coor_PRGT_value.y;
		/*register undo redo*/
		undoMng.register(thisObj, cs.addAudiotoLabel, [media_value,oldObject,labelGroup], 'Undo audio delete',
				thisObj, cs.deleteAudio,[audioelem,'labelaudio'] , 'Redo audio');
		updateUndoRedoState(undoMng);
	},
	registerAudioUndoRedoDock: function(thisObj,node,audioelem,labelGroup) {
		var undoMng = window.CD.undoManager;
		var cs = window.CD.services.cs;
		var oldObject = {};					
		var jsonObj = window.CD.module.data.getDockJsonData();
		oldObject.x = jsonObj[node].coor_PRG_value.x;
		oldObject.y = jsonObj[node].coor_PRG_value.y;
		var mediaVal = jsonObj[node].media_PRG_value;
		/*register undo redo*/
		undoMng.register(thisObj, cs.addAudiotoLabel, [mediaVal,oldObject,labelGroup], 'Undo audio delete',
				thisObj, cs.deleteAudio,[audioelem,'labelaudio'] , 'Redo audio');
		updateUndoRedoState(undoMng);
		window.CD.services.ds.updateAudioUsage(jsonObj[node].media_PRG_value,false);
	},
	/*
	 * This method is for populating Global and Local tab for
	 * Label Inspector
	 * On apply click view will be populated with user chosen values
	 * By Nabonita Bhattacharyya
	 */
	populateLabelData:function(applyEnable,labelData,hintArea){
		if(labelData){
			$('#labelWidth').val(labelData.labelWidth);
			$('#labelHeight').val(labelData.labelHeight);
			$('#dockWidth').val(labelData.dockWidth);
			$('#dockHeight').val(labelData.dockHeight);
			
			$('#localLabelWidth').val(labelData.labelWidth);
			$('#localLabelHeight').val(labelData.labelHeight);
			
			$('#localDockWidth').val(labelData.dockWidth);
			$('#localDockHeight').val(labelData.dockHeight);
			
			if(labelData.transparency === 'F'){
				$('input[name=transparenType][value=solid]').prop('checked',true);
				$('input[name=transparenTypeLoc][value=solid]').prop('checked',true);
			}else{
				if(labelData.transparency === 'T'){
				$('input[name=transparenType][value=transparent]').prop('checked',true);
				$('input[name=transparenTypeLoc][value=transparent]').prop('checked',true);
				}
			}
//			if(labelData.instructionText === 'T'){
//				$('#instructText').prop('checked',true);
//			}else if(labelData.instructionText === 'F'){
//				$('#instructText').prop('checked',false);
//			}
			
			if(labelData.fillEnabled) {
				$('#labelFillGlob').prop('checked',true);
				$('#labelFillLoc').prop('checked',true);
			}else{
				$('#labelFillGlob').prop('checked',false);
				$('#labelFillLoc').prop('checked',false);
			}
			if(labelData.strokeEnabled) {
				$('#labelBorderGlob').prop('checked',true);
				$('#labelBorderLoc').prop('checked',true);
			}else{
				$('#labelBorderGlob').prop('checked',false);
				$('#labelBorderLoc').prop('checked',false);
			}
			
			
			/* ------------- For Hint / Feedback ---------------- */
			$('#hintWidth').val(labelData.hintWidth);
			$('#hintHeight').val(labelData.hintHeight);
			$('#feedbackWidth').val(labelData.feedbackWidth);
			$('#feedbackHeight').val(labelData.feedbackHeight);
			
			
			if(labelData.hintLabelOrDock == 'D'){
				$('input[name=hoverHint][value=dock]').prop('checked',true);
			}
			if(labelData.feedbackLabelOrDock == 'D'){
				$('input[name=feedbackType][value=dock]').prop('checked',true);
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
		}
		
		if(applyEnable){
			$('#globalApply').removeClass('inactive');
		}else{
			$('#globalApply').addClass('inactive');
		}
	},
	
	labelTextOTM : function(txtGrpId,textValue,txtGrpObj){
		try{
			txtGrpObj.get('#txt_'+txtGrpId)[0].setText(textValue);
			return txtGrpObj;
		}
		catch(err){
			console.log('@PRGView :: Error in labelTextOTM() prgView::'+err.message);
		}
	},
	
	/**
	 * This method is used for hint,feedback flag removal 
	 * when hint/feedback value is blank
	 */
	removeHintFeedbackFlag : function(lblGroup,hint,feedback){
		console.log("@removeHintFeedbackFlag :: PRGView");
		try{
			$.each(lblGroup.children, function(index,value){
				if(value.nodeType==="Group" && value.attrs.id.match(/infoText_dock_label_[0-9]+/)){
					/*fetching T,H,F infotext object*/
					$.each(value.children, function(i,v){
						if(v.attrs.id.match(/H_infoText_dock_label_[0-9]+/)){
							infoTextHObj=v;
						}
						if(v.attrs.id.match(/F_infoText_dock_label_[0-9]+/)){
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
			console.error("Error @removeHintFeedbackFlag :: PRGView "+err.message);
		}
	},
	
	setActiveLabelPosition : function(labelGrp){
		console.log('@setActiveLabelPosition :: PRGView');
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
		var labelGrpJsonId = PRGData.getLabelIndex(labelId);
		var changedX = labelGrp.getX() - window.CD.module.data.Json.PRGData.PRGLabelData[labelGrpJsonId].term_pos_x;
		var changedY = labelGrp.getY() - window.CD.module.data.Json.PRGData.PRGLabelData[labelGrpJsonId].term_pos_y;
		for(var i=0;i<activeElmLength;i++){
			var prg = PRGData.getLabelIndex(window.CD.elements.active.element[i].attrs.id);
			if(prg == labelGrpJsonId){
				var oldX = window.CD.module.data.Json.PRGData.PRGLabelData[prg].term_pos_x;
				var oldY = window.CD.module.data.Json.PRGData.PRGLabelData[prg].term_pos_y;
				window.CD.module.data.Json.PRGData.PRGLabelData[prg].term_pos_x = labelGrp.getX();
				window.CD.module.data.Json.PRGData.PRGLabelData[prg].term_pos_y = labelGrp.getY();
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
				
				var oldX = window.CD.module.data.Json.PRGData.PRGLabelData[prg].term_pos_x;
				var oldY = window.CD.module.data.Json.PRGData.PRGLabelData[prg].term_pos_y;
				window.CD.module.data.Json.PRGData.PRGLabelData[prg].term_pos_x = newX;
				window.CD.module.data.Json.PRGData.PRGLabelData[prg].term_pos_y = newY;	
			}
			
		activeElmNewX.push(newX);
		activeElmNewY.push(newY);
		activeElmOldX.push(oldX);
		activeElmOldY.push(oldY);
		ds.setOutputData();
		}
		labelGrp.parent.getLayer().draw();
		cdLayer.draw();
		undoMng.register(this, PRGView.setLabelGroupPosition,[activeElmArray,activeElmOldX,activeElmOldY,groupIdArr] , 'Undo Label position',this, PRGView.setLabelGroupPosition,[activeElmArray,activeElmNewX,activeElmNewY,groupIdArr] , 'Redo Label position');
		updateUndoRedoState(undoMng);
	},
	setActiveDockPosition : function(labelGrp){
		console.log('@setActiveDockPosition :: PRGView');
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
		var labelGrpJsonId = PRGData.getDockIndex(labelId);
		var changedX = labelGrp.getX() - window.CD.module.data.Json.PRGData.PRGDockData[labelGrpJsonId].PRG_sentence_list_x;
		var changedY = labelGrp.getY() - window.CD.module.data.Json.PRGData.PRGDockData[labelGrpJsonId].PRG_sentence_list_y;
		for(var i=0;i<activeElmLength;i++){
			var prg = PRGData.getDockIndex(window.CD.elements.active.element[i].attrs.id);
			if(prg == labelGrpJsonId){
				var oldX = window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_x;
				var oldY = window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_y;
				window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_x = labelGrp.getX();
				window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_y = labelGrp.getY();
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
				
				var oldX = window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_x;
				var oldY = window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_y;
				window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_x = newX;
				window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_y = newY;	
			}
			
		activeElmNewX.push(newX);
		activeElmNewY.push(newY);
		activeElmOldX.push(oldX);
		activeElmOldY.push(oldY);
		ds.setOutputData();
		}
		labelGrp.parent.getLayer().draw();
		cdLayer.draw();
		undoMng.register(this, PRGView.setDockGroupPosition,[activeElmArray,activeElmOldX,activeElmOldY,groupIdArr] , 'Undo Label position',this, PRGView.setDockGroupPosition,[activeElmArray,activeElmNewX,activeElmNewY,groupIdArr] , 'Redo Label position');
		updateUndoRedoState(undoMng);
	},
	setActiveDockPositionForOTM : function(labelGrp,dock,yIndexArr){
		console.log('@setActiveDockPositionForOTM :: PRGView');
		var temp;
		var dockElm = [];
		for(var i=0;i<yIndexArr.length;i++){
			for(var key in window.CD.module.data.Json.PRGData.PRGDockData){
				if(yIndexArr[i] == window.CD.module.data.Json.PRGData.PRGDockData[key].PRG_sentence_list_y){
					var dockObj = window.CD.elements.active.element[0].parent.get('#'+window.CD.module.data.Json.PRGData.PRGDockData[key].dockGroupId)[0];
					dockElm.push(dockObj);
				}
			}
		}
		var activeElmArray = [];
		var activeElmNewX = [];
		var activeElmNewY = [];
		var activeElmOldX = [];
		var activeElmOldY = [];
		var groupIdArr = [];
		var activeElmLength = dockElm.length;
		var activeDockArray = [];
		var dockheight = dockElm[0].children[0].getHeight();
		for(var j=0;j<activeElmLength;j++){
			activeElmArray.push(dockElm[j]);
			groupIdArr.push(dockElm[j].attrs.id)
		}
		var undoMng = window.CD.undoManager;
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var labelId = labelGrp.attrs.id;
		var flag = false;
		var labelGrpYIndex;
		var labelGrpJsonId = PRGData.getDockIndex(labelId);
		var changedX = labelGrp.getX() - window.CD.module.data.Json.PRGData.PRGDockData[labelGrpJsonId].PRG_sentence_list_x;
		var changedY = labelGrp.getY() - window.CD.module.data.Json.PRGData.PRGDockData[labelGrpJsonId].PRG_sentence_list_y;
		for(var i=0;i<activeElmLength;i++){
			var prg = PRGData.getDockIndex(dockElm[i].attrs.id);
			if(prg == labelGrpJsonId){
				var oldX = window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_x;
				var oldY = window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_y;
				window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_x = labelGrp.getX();
				window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_y = labelGrp.getY();
				var newX = labelGrp.getX();
				var newY = labelGrp.getY();
				ds.setOutputData();
			}else{
				var newX = labelGrp.getX();
				var newY = dockheight + dockElm[i-1].getY() + 5;
				
				if(newY>(parseInt(window.CD.module.data.Json.FrameData[0].frameHeight))-dockElm[i].children[0].attrs.height){
					newY = (parseInt(window.CD.module.data.Json.FrameData[0].frameHeight)-dockElm[i].children[0].attrs.height);
				}
				if(newX>(parseInt(window.CD.module.data.Json.FrameData[0].frameWidth))-dockElm[i].children[0].attrs.width){
					newX = (parseInt(window.CD.module.data.Json.FrameData[0].frameWidth)-dockElm[i].children[0].attrs.width);
				}
				if(newY<0){
					newY = 0;
				}
				if(newX<0){
					newX = 0;
				}
				dockElm[i].setX(newX);
				dockElm[i].setY(newY);
				
				var oldX = window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_x;
				var oldY = window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_y;
				window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_x = newX;
				window.CD.module.data.Json.PRGData.PRGDockData[prg].PRG_sentence_list_y = newY;	
				ds.setOutputData();
			}
		activeElmNewX.push(newX);
		activeElmNewY.push(newY);
		activeElmOldX.push(oldX);
		activeElmOldY.push(oldY);
		ds.setOutputData();
		}
		cdLayer.draw();
		undoMng.register(this, PRGView.setDockGroupPosition,[activeElmArray,activeElmOldX,activeElmOldY,groupIdArr] , 'Undo Label position',this, PRGView.setDockGroupPosition,[activeElmArray,activeElmNewX,activeElmNewY,groupIdArr] , 'Redo Label position');
		updateUndoRedoState(undoMng);
	},
	
};

