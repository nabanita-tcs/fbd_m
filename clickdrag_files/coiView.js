var COIView = {

	ds : window.CD.services.ds,
	cs : window.CD.services.cs,
	stg : window.CD.services.cs.getCanvas(),
	cdLayer : window.CD.services.cs.getLayer(),
	defaultTextFontFamily:"sans-serif",
	defaultAddLabelText:"Add Label Text",
	defaultLabelStrokeCLR : '#999999',
	defaultLabelStrokeWdth : 1,
	defaultLabelCornerRadius : 5,
	defaultLabelFillColor : '#8ECCF8',
	defaultLabelHigLightColor : '#1086D9',
	defaultDistractorColor : '#faf8dd',
	defaultHintFillColor : '#ffffff',
	defaultHintText : 'hint/feedback location in student view',
	hoverHintFillColor : '#8ECCF8',
	labelContainerId : "#labelContainer",
	textBoxBuffer : 20,
	radioWbuffer : 38,
	radioHbuffer : 17,
	checkWbuffer : 37,
	checkHbuffer : 18,

	init : function(coiJson, cnvConfig) {
		console.log("@COIView.init:::");
		try {
			var propdiv = $('#propertiesLabel');
			var labeldivCOI = window.CD.util
					.getTemplate( {
						url : 'resources/themes/default/views/layout_mode_design_COI.html?{build.number}'
					});
			propdiv.append(labeldivCOI);
			$('#cdInspector .tab_view').on('click',function() {
								if ($(this).hasClass('inactive')) {
									$('#' + $(this).siblings(
													'.tab_view.active').attr(
													'name')).hide();
									$(this).siblings('.tab_view.active')
											.removeClass('active').addClass(
													'inactive');
									$(this).removeClass('inactive').addClass(
											'active');
									$('#' + $(this).attr('name')).show();

									/* For Label Inspector div append */
									if ($(this).attr('name') == 'localDiv'
											&& $('#localDivInactive').length == 0
											&& (window.CD.elements.active.type != 'label' && window.CD.elements.active.type != 'dock')) {
										COIView.makeLabelLocalDisable();
									}
								}
							});

			COIView.attachPublishEvents();

			/* ------------- Events bind for each view ----------- */
			COIView.bindInspectorEvents();
			// if(coiJson.FrameData.length > 0){
			window.CD.services.cs.drawGuides(coiJson.adminData.HGL,
					coiJson.adminData.VGL, cnvConfig);
			window.CD.module.frame.init(coiJson.FrameData);
			// console.dir(coiJson);
			var lblOptions = this.ds.getOptionLabel();
			if (lblOptions === "SS" || window.CD.module.data.Json.COIST == "F") {
				window.CD.module.data.Json.COIST = "F"
			} else {
				window.CD.module.data.Json.COIST = "T"
			}

			this.ds.setOutputData();
			// }
			this.showCOILabel(coiJson);
		} catch (err) {
			console.error("Error in COIView::" + err.message);
		}

	},
	attachPublishEvents: function(){
		/* for I am Done button */
		$('#toolPalette .right_tool span#done')
				.off('click')
				.on(
						'click',
						function() {
							var labelModal = window.CD.util
									.getTemplate( {
										url : 'resources/themes/default/views/publishing_COI_modal.html?{build.number}'
									});
							$('#labelModal').remove();
							$('body').append(labelModal);
							$('#labelModal')
									.css(
											'left',
											(($('#toolPalette').width() / 2) - ($(
													'#labelModal').width() / 2)) + 'px');
							$('#labelModal')
									.css(
											'top',
											(($('#canvasHeight').val() / 2) - ($(
													'#labelModal').height() / 2)) + 'px');

							COIView.onOpenShowData();

							$("#labelContainer input.input_text")
									.bind(
											'keydown',
											function(e) {
												var inputVal = $(this)
														.val();
												var key = e.charCode
														|| e.keyCode || 0;
												// allow backspace, tab,
												// delete, arrows, numbers
												// and keypad numbers ONLY
												if (!e.shiftKey) {
													return (key == 8
															|| key == 9
															|| key == 46
															|| (key >= 37 && key <= 40)
															|| (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
												} else {
													return false;
												}
											});

							$("#publishOk").off('click').on('click',
									function() {
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
													}
													validation.showLabelErrorPOPUP(21,option);
											 		validation.showLabelErrorPOPUPForCancel(29,option);
											 		
										 }
										 else if(stdVal == 0){
												var option={
													 textVal:parseInt($("#pub_standardLabels .pub_num").text()),
													distTextVal:parseInt($("#pub_distractorLabels .pub_num").text())
													}
													validation.showLabelErrorPOPUP(20,option);
											}	
										 else{
											 COIData.applyClickPublishOk();
											  $('#labelModal').slideUp(200);
											  $('.tool_select').trigger('click');
										 }	
										 if($('#scramble').prop('checked') == true){
											window.CD.module.data.getJsonAdminData()['RLO'] = 'T';
										 }else{
											window.CD.module.data.getJsonAdminData()['RLO'] = 'F';
										 }
											
										 window.CD.services.ds.setOutputData();
									});
							/*bind on keydown for error text box*/
							 $(".scram input.input_text").bind('keydown',function(e){
								 validation.onKeyDownClearTextBox(e,this)
								});
							$("#publishCancel").off('click').on('click',
									function() {
										$('#labelOverlay').remove();
										$('#labelModal').slideUp(200);
										// $('.tool_select').trigger('click');
								});
						});
	},
	/*
	 * function name: onOpenShowData() author:Piyali Saha
	 */
	onOpenShowData : function() {
		console.log("@COIView.onOpenpopulateData");
		try {
			var jsonData = window.CD.module.data.Json;
			var COIData = jsonData.COIData;
			var jsonCOIPS = jsonData.COIPS;

			var totalLabel = 0;
			var totalDistractor = 0;

			/* fetch standard labels */
			var totalRandomLabels = 0;
			var totalRandomDistractors = 0;
			if (jsonCOIPS && jsonCOIPS.totalRandomLabels
					&& jsonCOIPS.totalRandomLabels != '') {
				totalRandomLabels = jsonCOIPS.totalRandomLabels
			}

			if (jsonCOIPS && jsonCOIPS.totalRandomDistractors
					&& jsonCOIPS.totalRandomDistractors != '') {
				totalRandomDistractors = jsonCOIPS.totalRandomDistractors
			}

			if (COIData) {
				for (coi in COIData) {
					var coiObj = COIData[coi];
					if (coiObj.correct_ans === "T") {
						totalLabel++;
					} else if (coiObj.correct_ans === "F") {
						totalDistractor++;
					}
				}

			}
			if (totalRandomLabels == '' || totalRandomLabels > totalLabel) {
				totalRandomLabels = totalLabel;
			}
			if (totalRandomDistractors == ''
					|| totalRandomDistractors > totalDistractor) {
				totalRandomDistractors = totalDistractor;
			}
			/* update number in popup */
			$("#pub_standardLabels #labelsNo").val(totalRandomLabels);
			$("#pub_distractorLabels #distractorNo")
					.val(totalRandomDistractors);

			$("#pub_standardLabels .pub_num").text(totalLabel);
			$("#pub_distractorLabels .pub_num").text(totalDistractor);

			if(window.CD.module.data.getJsonAdminData()['RLO'] == 'T'){
				$('#scramble').prop('checked',true);
			}else{
				if(window.CD.module.data.getJsonAdminData()['RLO'] == 'F'){
					$('#scramble').prop('checked',false);
				}
			}
		} catch (err) {
			console.error("@COIView::Error on onOpenpopulateData::"
					+ err.message);
		}

	},
	

	showCOILabel : function(coiJson) {
		console.log('@COIView.showCOILabel');
		try {

			var lbConfig = new LabelConfig();
			var coiData = coiJson.COIData;
			var cdLayer = window.CD.services.cs.getLayer();

			var textboxBuffer = COIView.textBoxBuffer;

			var lblOptions = this.ds.getOptionLabel();
			if (lblOptions === "SS") {
				isSingleSelection = true;
			} else {
				isSingleSelection = false;
			}
			c = 0;
			$.each(coiData,function(key, val) {
								lbConfig.id = 'label_' + c;
								var ldwidth = parseInt(coiJson.adminData.SLELD
										.split(',')[0]);
								var ldheight = parseInt(coiJson.adminData.SLELD
										.split(',')[1]);
								var lblGrpOptions = {
									draggable : true,
									x : parseInt(val.holder_x),
									y : parseInt(val.holder_y)
								};
								var lbGroup = COIView.cs.createGroup('label_' + c,
										lblGrpOptions);
								var textBoxGroup = COIView.cs
										.createGroup(
												'txtGrp_' + c,
												{
													'x' : 10,
													'y' : (ldheight - textboxBuffer) / 2
												});
								
								var strokeWidth = 0;
								var strokeColor = 'transparent'
								var strokeEn = false;
								var fillColor = COIView.defaultLabelFillColor;
								var lfontSize = parseInt(coiJson.adminData.GFS);
								if (val.transparent_border === 'F') {
									strokeWidth = 1;
									strokeColor = '#999999';
									strokeEn = true;
								}

								if (val.correct_ans == 'F') {
									fillColor = COIView.defaultDistractorColor;
								}
								if (val.transparent === 'T') {
									fillColor = 'transparent';
								}

								var labelOption = {
									type : "Rect",
									kinteticOpt : {
										width : ldwidth,
										height : ldheight,
										stroke : strokeColor,
										strokeWidth : strokeWidth,
										cornerRadius : 5,
										fill : fillColor,
										opacity : 1,
										id : 'lbl_' + c
									}
								}
								var textRectOption = {
									type : "TextRect",
									kinteticOpt : {
										width : ldwidth - textboxBuffer,
										height : lfontSize,
										fill : '#ffffff',
										opacity : 1,
										id : 'txtBox_' + c
									}
								}

								var addTextObjectOption = {
									type : "Text",								
									kinteticOpt : {
										text : COIView.defaultAddLabelText,
										fontSize : 14,
										y:2,
										fontFamily : COIView.defaultTextFontFamily,
										fill : '#555',
										width : ldwidth - textboxBuffer,
										height : 'auto',
										opacity : '1',
										verticalAlign : 'middle',
										id : 'addTxt_' + c,
										name : 'nametxt',
										align : 'center'
									}
								}
								var label = COIView
										.createKineticObject(labelOption);
								var textBox = COIView
										.createKineticObject(textRectOption);
								var addTextObj = COIView
										.createKineticObject(addTextObjectOption);

								val.labelGroupId = lbConfig.id;
								lbGroup.add(label);
								textBoxGroup.add(textBox);
								textBoxGroup.add(addTextObj);
								lbGroup.add(textBoxGroup);
								var isDraggable = true;
								if (val.lockStatus)
									isDraggable = false;
								// isDraggable=val.lockStatus;
								var allOptions = {
									labelGroup : lbGroup,
									width : ldwidth,
									height : ldheight,
									ans : val.correct_ans,
									isDraggable : isDraggable
								}
								cdLayer.add(lbGroup);
								var commonTextTool= new TextTool.commonLabelText();
								if (val.label_value) {
									/* checking sb and sp tag in a text */
									var textValue = val.label_value;
									
									var textFormat = new TextFormat();
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
									
								
								} else {
									addTextObj.show();
									addTextObj.parent
											.setY((label.getHeight() - addTextObj
													.getTextHeight()) / 2);
								}
								
								/** For text middle align **/
								if(textBoxGroup.get('#addTxt_'+c)[0]){
									var count = textBoxGroup.children.length-1;
									var lastChild = commonTextTool.findLastTextchild(textBoxGroup,count);
									var textGrpHeight = textBoxGroup.children[lastChild].getY() + textBoxGroup.children[lastChild].getHeight();
									var topPadding = (textBoxGroup.parent.children[0].getHeight()-textGrpHeight)/2;
									if(topPadding < 0)
										topPadding = 0;
									textBoxGroup.setY(topPadding);			
								 }
								commonTextTool.bindLabelTextEvent(textBoxGroup);
								COIView.attachEventforLabel(lbGroup);

								if (val.hint_value != ""
										|| val.feedback_value != "") {
									COIView.attachHintFeedbackEvent(lbGroup);
								}
								
								textBoxGroup.moveToTop();

								if (val.textFormat.underline_value == "T") {
									var commonLabelText = new TextTool.commonLabelText();
									var textObj = lbGroup
											.get('#lbltxt_' + lbGroup.attrs.id
													.split('_')[1])[0];
									if (textObj)
										commonLabelText.applyTextUnderline(
												textObj, textObj.parent, true);
									$("#UnderlinetTool").data('clicked', true);
								}
								
								/* add info text in label */
								if (val.infoHideText === "T") {
									textBoxGroup.hide();
									cdLayer.draw();
								}
								var param = {
									labelGrpID : lbGroup.attrs.id,
									labelGrpObj : lbGroup,
									labelData : '',
									infoHideText : val.infoHideText,
									infoHintText : val.hint_value,
									infoFeedbackText : val.feedback_value,
									showLabel : true
								}
								COIView.createInfoTextObject(param);								
								/* end here */
								
								/* image and media insert */

								if (val.image_data != "N") {
									var imageGrpId = 'img_' + lbGroup.attrs.id;
									loadImageforLabel(lbGroup, imageGrpId,
											val.image_data,true);
								}
								if (val.media_value != "N") {
									var audioGrpId = 'audio_' + lbGroup.attrs.id;
									var x = (val.media_label_XY).split('|')[0];
									var y = (val.media_label_XY).split('|')[1];
									loadAudioImage(lbGroup, audioGrpId,
											val.media_value, x, y, true);
								}

								if (isSingleSelection) {
									COIView.callAllMethodForLabelCreate(
											allOptions, true);
								} else {
									COIView.callAllMethodForLabelCreate(
											allOptions, false);
								}

								/* add hint feedback for show label */
								if (window.CD.module.data.Json.adminData.showHintOrFeedbackInAuthoring != "none") {
									COIView.createUpdateHintFeedbackBox(true,
											lbGroup);
								}
								if(val.zIndex == undefined){
									var coi = COIData.getLabelIndex(lbGroup.attrs.id);
									window.CD.module.data.Json.COIData[coi].zIndex = lbGroup.getZIndex();
								}
								/* ends here */
								cdLayer.draw();
								c++;

							});
			for(var key in coiData){
				var label = cdLayer.get('#'+coiData[key].labelGroupId)[0];
				label.setZIndex(coiData[key].zIndex);
			}
			cdLayer.draw();
			var globalHideTextcheck = false;
			var labelCountForHideText = 0;
			for(key in window.CD.module.data.Json.COIData){
				if(window.CD.module.data.Json.COIData[key].infoHideText == 'F'){
					globalHideTextcheck = true;				
				}				
				labelCountForHideText++;
			}
			if(globalHideTextcheck == false && labelCountForHideText!=0){
				$('#hideTextGlobal').prop('checked',true);
			}
			

		} catch (err) {
			console.error("Error in COIView::" + err.message);
		}
	},

	/***************************************************************************
	 * 
	 * 
	 * 
	 * 
	 * /***********************started code for COI label
	 **************************************************************************/
	/** **************************************************** */

	/*
	 * This method is used to delete all labels present By Nabonita
	 * Bhattacharyya
	 */

	removeLabels : function() {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;
		var outputJson = window.CD.module.data.Json;
		var labelCount = cs.objLength(window.CD.module.data.Json.COIData);

		for ( var i = 0; i < labelCount; i++) {
			var labelGrpId = window.CD.module.data.Json.COIData['COI' + i].labelGroupId;
			var label = cs.findGroup(labelGrpId);
			var coiIndex = COIView.getDataIndex(labelGrpId);
			cs.deleteSubGroups(label);
			this.removeImageFromLabel(label);
			this.removeTextFromLabel(label);
			this.removeAudioFromLabel(label);

			label.remove();

			delete outputJson.COIData[coiIndex];

		}

		cdLayer.draw();
		window.CD.module.data.reIndexLabels();
		cs.setActiveElement(cs.findGroup('frame_0'), 'frame');
		cs.resetToolbar();
		ds.setOutputData();

	},

	/*
	 * This is used to bind all events for label inspector for this particular
	 * view by nabonita bhattacharyya
	 */
	bindInspectorEvents : function() {

		/*
		 * ---------- For making Local transparent type and border
		 * readonly--------------
		 */
		$(':radio[name=transparenTypeLoc],:checkbox[id=dockFillLoc],:checkbox[id=magnEnableLoc]').attr("disabled",true);
		$(':radio[name=transparenTypeLoc],:checkbox[id=dockFillLoc],:checkbox[id=magnEnableLoc]').click(function() {
			return false;
		});

		/*
		 * This is used to show each info icon explanation
		 */
		//$('#cdInspector .info_icon').off('click').on('click', function() {
		//	window.CD.module.view.onClickShowInfoIcon(this);
		//});

		/* on click on local hide text in label inspector */
		$('#localDiv #hideTextLoc').on('click', function() {
			var activeElmLength = window.CD.elements.active.element.length;
			var activeElmIds = [];
			for(var i=0;i<activeElmLength;i++){
				activeElmIds.push(window.CD.elements.active.element[i].attrs.id);
			}
			var coiTextTool= new TextTool.commonLabelText();
			coiTextTool.onClickHideLabelText(activeElmIds);

		});

		/* ------- on key - up store hint/feedback values ------------- */
		$('#localDiv textarea')
				.on(
						'keyup paste',
						function() {
							var txtarea = this;
							var hintType = $('input[name=hoverHint]:checked')
									.val();
							var feedbackType = $(
									'input[name=feedbackType]:checked').val();
							setTimeout(
									function() {
										var hintVal = $('#textareaHint').val();
										var feedbackVal = $('#textareaFeedback')
												.val();
										if (txtarea.textLength <= 1) {
											window.CD.module.view
													.bindFeedbackHintEvent(
															$(
																	'input[name=hintFeedback]:checked')
																	.val(),
															$(
																	'input[name=hoverHint]:checked')
																	.val(),
															feedbackType);
										}
										window.CD.module.view
												.updateHintFeedbackVal(hintVal,
														feedbackVal);
										window.CD.module.view
												.onTypeingHintAndFeedback(txtarea);
									}, 100);
						});

		/*
		 * For Label Inspector Expanded and collapsed view By Nabonita
		 * Bhattacharyya
		 */

		$('.ui-icon').off("click").on(
				"click",
				function() {
					if ($(this).parents('tr').siblings('.hinttr').hasClass(
							'display_none')) {
						$(this).parents('tr').siblings('.hinttr').css(
								'display', 'block');
						$(this).parents('tr').siblings('.hinttr').removeClass(
								'display_none');
						$(this).addClass('ui-icon-position-ex').removeClass(
								'ui-icon-position-col');
					} else {
						if ($(this).parents('tr').siblings('.hinttr').css(
								'display') == 'block') {
							$(this).parents('tr').siblings('.hinttr').css(
									'display', 'none');
							$(this).parents('tr').siblings('.hinttr').addClass(
									'display_none');
							$(this).addClass('ui-icon-position-col')
									.removeClass('ui-icon-position-ex');
						}
					}
				});

		$('#propertiesDivLabel div.select_box').each(
				function() {

					$(this).parent().children('div.select_box').click(
							function() {
								if ($(this).children('div.select_options').css(
										'display') == 'none') {
									$(this).children('div.select_options').css(
											'display', 'block');
								} else {
									$(this).children('div.select_options').css(
											'display', 'none');
								}
							});

					$(this).find('span.select_option').click(
							function() {

								$(this).css('display', 'none');
								$(this).closest('div.select_box').attr('value',
										$(this).attr('value'));
								$(this).parent().siblings('span.selected')
										.html($(this).html());

							});
				});

		$(document)
				.not("#propertiesDivLabel div.select_options")
				.click(
						function(e) {
							if ((!($(e.target).hasClass('select_box')))
									&& ($(e.target).parents('.select_box').length == 0)) {
								$('div.select_options').hide();
							}
							if (typeof window.CD.module.view.handleConnectorTypeChange == "function") {
								window.CD.module.view
										.handleConnectorTypeChange($(e.target)
												.parents('.select_box').find(
														'span.selected'));
							}
						});

	},

	/**
	 * function name: labelToolClickHandler() description:on click on label tool
	 * this method get called. author:Piyali Saha
	 */
	labelToolClickHandler : function(e) {
		console.log("@COIView.labelToolClickHandler");
		try {
			e.preventDefault();
			var lblOptions = this.ds.getOptionLabel();
			if (lblOptions === "SS") {
				this.createSingleLabelModal();
			} else {
				this.createMultipleLabelModal();
			}

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
		} catch (err) {
			console.error("@COIView::Error on labelToolClickHandler::"
					+ err.message);
		}

	},
	updateLabelGlobalHide : function(){
		var prop = $('#hideTextGlobal').prop('checked');
		return prop;
	},
	/**
	 * function name: updateLabelBorderFill() author:Piyali Saha
	 */
	updateLabelBorderFill : function(labelObj, labelCoiIndex,otherObj) {
		console.log("@COIView.updateLabelBorderFill");
		try {
			var activeElm = window.CD.elements.active.element[0];
			var activeType = window.CD.elements.active.type;
			if (activeType === 'label') {
				var selectedlabelGrpId = activeElm.attrs.id;
			}
			var labelGrpId = window.CD.module.data.getEachLabelOutputData(
					labelCoiIndex, "labelGroupId");
			if(otherObj){
				var fillGlob = otherObj.fillGlob;
				var borderGlob = otherObj.borderGlob;
			}else{
				var fillGlob = $('#labelFillGlob').prop('checked');
				var borderGlob = $('#labelBorderGlob').prop('checked');
			}
			
			
			$('#labelFillGlob').prop('checked',fillGlob);
			$('#labelBorderGlob').prop('checked',borderGlob);
			
			var correctAns = window.CD.module.data.getEachLabelOutputData(
					labelCoiIndex, "correct_ans");
			// var
			// distractorLabel=this.getEachLabelOutputData(labelCoiIndex,"distractor_label");
			var isSelectedLabel = false;
			if (!fillGlob) {
				labelObj.setFill('transparent');
				var changefieldArr = {
					transparent : 'T'
				};
				window.CD.module.data.setEachLabelOutputData(labelCoiIndex,
						changefieldArr);
			} else {
				if (correctAns === "T") {
					labelObj.setFill(this.defaultLabelFillColor);
				} else {
					labelObj.setFill(this.defaultDistractorColor);
				}
				var changefieldArr = {
					transparent : 'F'
				};
				window.CD.module.data.setEachLabelOutputData(labelCoiIndex,
						changefieldArr);
			}

			if (!borderGlob) {
				if (selectedlabelGrpId !== labelGrpId) {
					labelObj.setStroke('transparent');
				}
				var changefieldArr = {
					transparent_border : 'T'
				};
				window.CD.module.data.setEachLabelOutputData(labelCoiIndex,
						changefieldArr);
			} else {
				if (selectedlabelGrpId !== labelGrpId) {
					labelObj.setStroke(this.defaultLabelStrokeCLR);
				}
				var changefieldArr = {
					transparent_border : 'F'
				};
				window.CD.module.data.setEachLabelOutputData(labelCoiIndex,
						changefieldArr);
			}

		} catch (err) {
			console.error("@COIView::Error on updateLabelBorderFill::"
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
		var coi = window.CD.module.data.getLabelIndex(labelGroup.attrs.id);
		var jsonObj = window.CD.module.data.getJsonData();
		oldObject.x = jsonObj[coi].media_label_XY.split('|')[0];
		oldObject.y = jsonObj[coi].media_label_XY.split('|')[1];
		/*register undo redo*/
		undoMng.register(thisObj, cs.addAudiotoLabel, [media_value,oldObject,labelGroup], 'Undo audio delete',
				thisObj, cs.deleteAudio,[audioelem,'labelaudio'] , 'Redo audio');
		updateUndoRedoState(undoMng);
	},
	/**
	 * function name: checkActiveElm() author:Piyali Saha
	 */
	checkActiveElm : function(elmid) {
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var cdLayer = cs.getLayer();
		var group=cdLayer.get('#'+elmid)[0];
		/*if(group && group.childre)
		{
			var activetype="label";
			cs.setActiveElement(grpObj,activetype);
		}*/
		return group;
	},
	/**
	 * function name: updateLabelWidthHeightDetails() author:Piyali Saha
	 */
	updateLabelWidthHeightDetails : function(width, height,otherObj) {
		console.log("@COIView.updateLabelWidthHeightDetails");
		try {
			var totalCoiData = window.CD.module.data.Json.COIData;
			var cdLayer = window.CD.services.cs.getLayer();
			var cs = window.CD.services.cs;
			var selectLBLWidth = parseInt(width);
			var selectLBLHeight = parseInt(height);
			var textBuffer = this.textBoxBuffer;
			var oldLabelW = window.CD.module.data.Json.adminData.SLELD.split(',')[0];
			var oldLabelH = window.CD.module.data.Json.adminData.SLELD.split(',')[1];
			/* set height and width in label inspector */
			$("#globalDiv #labelWidth").val(selectLBLWidth);
			$("#globalDiv #labelHeight").val(selectLBLHeight);

			$("#localDiv #localLabelWidth").html(selectLBLWidth + "px");
			$("#localDiv #localLabelHeight").html(selectLBLHeight + "px");
			localLabelWidth
			for (kkey in totalCoiData) {
				if (kkey) {
					var LabelGrpId = totalCoiData[kkey].labelGroupId;
					var labelCoiIndex = COIView.getDataIndex(LabelGrpId);
					var labelObj = cdLayer
							.get('#lbl_' + LabelGrpId.split('_')[1])[0].parent;

					if (labelObj) {
						/* label width,height */
						labelObj.children[0].setWidth(selectLBLWidth);
						labelObj.children[0].setHeight(selectLBLHeight);
						/* label text width */
						if((parseInt(oldLabelW) != parseInt(selectLBLWidth)) || (parseInt(oldLabelH) != parseInt(selectLBLHeight))){
							COIView.setLabelTextImagePosition(labelObj,selectLBLWidth, selectLBLHeight);
						}
						
						COIView.setPosition(labelObj);
						COIView.updateLabelBorderFill(labelObj.children[0],
								labelCoiIndex,otherObj);
						//if(!check){
							var check = COIView.updateLabelGlobalHide();
						//}
						if(check == true){
							var hideLabels=[];
							for(key in window.CD.module.data.Json.COIData){
								hideLabels.push(window.CD.module.data.Json.COIData[key].labelGroupId);
							}
							var sleTextTool= new TextTool.commonLabelText();
							sleTextTool.onClickHideGlobalLabelText(hideLabels,'checked');
							//var ckeck = false;
						}
						if((check == false)){
							var coiTextTool= new TextTool.commonLabelText();
							var unHideLabels=[];
							for(key in window.CD.module.data.Json.COIData){
								unHideLabels.push(window.CD.module.data.Json.COIData[key].labelGroupId);
							}
							coiTextTool.onClickHideGlobalLabelText(unHideLabels,'unchecked');
						//	var ckeck = true;
						}
						window.CD.module.view.onClickShowHiddenTxtGlobal();

					}
				}
			}
			window.CD.module.data.Json.adminData.SLELD = selectLBLWidth + ','
					+ selectLBLHeight;
			window.CD.services.ds.setOutputData();
			cdLayer.draw();
		} catch (err) {
			console.error("@COIView::Error on updateLabelWidthHeightDetails::"
					+ err.message);
		}
	},

	/**
	 * function name: updateResizedLabelData() author:Piyali Saha
	 */
	updateResizedLabelData : function(width,height,grpId) {
		console.log("@COIView.updateResizedLabelData");
		try {
			var activeElm = window.CD.elements.active.element[0];
			var activeType = window.CD.elements.active.type;
			
			if(grpId && grpId!="" && (activeElm.children.length < 10  || !activeElm.getId().match(/label_[0-9]+/))) {
				var cdLayer =window.CD.services.cs.getLayer();
				var activeElm=cdLayer.get('#'+grpId)[0];
				activeType='label';
			}
			
			
			
			if (activeType === 'label' && activeElm) {
				var selectedlabelGrpId = activeElm.attrs.id;
				var selectedLabelObj = activeElm.children[0];
				var selectLBLWidth = selectedLabelObj.getWidth();
				var selectLBLHeight = selectedLabelObj.getHeight();
				if(width){
					var selectLBLWidth =width;
					
				}
				if(height){
					var selectLBLHeight = height;
				}
				var labelConfig = new LabelConfig();
				var minLabelWidth = labelConfig.minWidth;// 49;
				var minLabelHeight = labelConfig.minHeight;// 49;
				var maxLabelWidth = labelConfig.maxWidth;// 500;
				var maxLabelHeight = labelConfig.maxHeight;// 500;
				if (selectLBLWidth >= maxLabelWidth) {
					selectLBLWidth = window.CD.module.data.Json.adminData.SLELD
							.split(',')[0];
				}
				if (selectLBLHeight >= maxLabelHeight) {
					selectLBLHeight = window.CD.module.data.Json.adminData.SLELD
							.split(',')[1];
				}

				var cdLayer = window.CD.services.cs.getLayer();
				COIView.updateLabelWidthHeightDetails(selectLBLWidth,
						selectLBLHeight);
				COIView.setPosition(activeElm);
				var coiTextTool= new TextTool.commonLabelText();
				coiTextTool.finalAdjustmentLabelContent(activeElm);

				cdLayer.draw();
				window.CD.module.data.Json.adminData.SLELD = selectLBLWidth
						+ ',' + selectLBLHeight;
				window.CD.services.ds.setOutputData();
				var imgGrp;
				$.each(activeElm.children, function(index,value){
					if(value.nodeType==="Group" && value.attrs.id.match(/img_label_[0-9]+/)){
						imgGrp=value;
					}
				});
				if(imgGrp){
					COIView.labelImageAndTextAdjust(activeElm);
				}	
			}

		} catch (err) {
			console.error("@COIView::Error on updateResizedLabelData::"
					+ err.message);
		}

	},
	/**
	 * function name: setLabelImagePosition() author:Piyali Saha
	 */
	setLabelImagePosition : function(labelGrp, selectLBLWidth, selectLBLHeight,
			imgObject, textBoxGrpObj) {
		try {
			/* image resize */
			var cdLayer = window.CD.services.cs.getLayer();
			var lblWidth = labelGrp.children[0].getWidth();
			var lblHeight = labelGrp.children[0].getHeight();
			var imageBuffer = 30;
			var textH = textBoxGrpObj.getHeight();
			
			if (imgObject) {
				 var imgH = parseInt(imgObject.getHeight());
		         var imgW = parseInt(imgObject.getWidth());          
		        	
				var ratio = imgW / imgH;
				var avlblWidth = lblWidth - imageBuffer;
				var avlblHeight = lblHeight - imageBuffer;
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
					if (textH) {
						imgH = imgH + textH;
						imgW = Math.round(ratio * imgH);
					}
				}
				if (imgW > avlblWidth) {
					var exratio = avlblWidth / imgW;
					imgW = imgW * exratio;
					imgH = imgW / ratio;
				}

				imgObject.setSize(imgW, imgH);
				imageHeight = imgH;
				imgObject.parent.setX((lblWidth - imgW) / 2);
				cdLayer.draw();
			}

			/** *******For updating image dimension value in output json******* **/
			var labelId = labelGrp.getId();
			var coiIndex = COIData.getLabelIndex(labelId);
			var imageName = window.CD.module.data.Json.COIData[coiIndex].image_data.split('|')[0];
			window.CD.module.data.Json.COIData[coiIndex].image_data = imageName+'|'+parseInt(imgW)+'|'+parseInt(imgH);
			window.CD.services.ds.setOutputData();
		} catch (err) {
			console.error("@COIView::Error on setLabelImagePosition::"
					+ err.message);
		}
	},

	/**
	 * function name: setLabelTextImagePosition() author:Piyali Saha
	 */
	setLabelTextImagePosition : function(labelGrp, selectLBLWidth,
			selectLBLHeight) {
		console.log("@COIView.setLabelTextImagePosition");
		try {
			var textFormat = new TextFormat();
			var txtConfg = new TextTool.commonLabelText();
			var textStyleClass = new labelTextStyle();
			var otherLabelGrpId = labelGrp.attrs.id;
			var textBuffer = this.textBoxBuffer;
			var textBoxGrpObj = labelGrp.get('#txtGrp_' + otherLabelGrpId
					.split('_')[1])[0];
			textBoxGrpObj.setY((selectLBLHeight - textBuffer) / 2);
			var textBoxObj = labelGrp.get('#txtBox_' + otherLabelGrpId
					.split('_')[1])[0];
			if (textBoxObj)
				textBoxObj.setWidth(selectLBLWidth - textBuffer);
			var addTextObj = labelGrp.get('#addTxt_' + otherLabelGrpId
					.split('_')[1])[0];
			if (addTextObj) {
				addTextObj.setWidth(selectLBLWidth - textBuffer);

			}
			var editedTextObj = labelGrp.get('#lbltxt_' + otherLabelGrpId
					.split('_')[1])[0];
			if (textBoxGrpObj) {
				
				var textStyleObj = COIData.getTextStyleData(textBoxGrpObj.getId().split('_')[1]);
				var textStyle = textStyleObj.fontStyle;
				var align = textStyleObj.align;
				var underline_value = textStyleObj.underline_value;
				
				var textValue = COIData.getLabelTextValue(textBoxGrpObj.parent.getId());
				if(textValue != ""){
					textFormat.deleteEachLabelText(textBoxGrpObj);
					
					textBoxGrpObj = textFormat.createLabelText(textBoxGrpObj, textValue, align);
					txtConfg.bindLabelTextEvent(textBoxGrpObj);
					
					var activeChildren = txtConfg.getTextObjFromGroupObject(textBoxGrpObj);
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
					textStyleClass.applyEachTextUnderline(textBoxGrpObj,globalUnderline);
					
					var count = textBoxGrpObj.children.length-1;
					var lastChild = txtConfg.findLastTextchild(textBoxGrpObj,count);
					var textGrpHeight = textBoxGrpObj.children[lastChild].getY() + textBoxGrpObj.children[lastChild].getHeight();
					var topPadding = (textBoxGrpObj.parent.children[0].getHeight()-textGrpHeight)/2;
					if(topPadding < 0)
						topPadding = 0;
					textBoxGrpObj.setY(topPadding);
				}
			}
			var imgObject = labelGrp.get('.img')[0];
			if (imgObject) {
				this.setLabelImagePosition(labelGrp, selectLBLWidth,
						selectLBLHeight, imgObject, textBoxGrpObj)
			} else if (textBoxGrpObj) {
				/*
				 * var originalTextHeight = editedTextObj.textArr.length *
				 * editedTextObj.getTextHeight(); var totWidth = selectLBLWidth;
				 * var totHeight = selectLBLHeight; if(totHeight >
				 * originalTextHeight){ var calcY = (totHeight -
				 * originalTextHeight)/2; textBoxGrpObj.setY(calcY); }
				 * 
				 * if(totHeight<=originalTextHeight){ var calcY =
				 * textBoxGrpObj.parent.children[0].getY();
				 * textBoxGrpObj.setY(calcY); }
				 */
				var textRectOj = labelGrp.children[0];
				this.adjustTxtPosNoimagePreset(textBoxGrpObj, textRectOj,
						textBoxGrpObj, '')

			}
			var coiTextTool= new TextTool.commonLabelText();
			coiTextTool.finalAdjustmentLabelContent(labelGrp);

		} catch (err) {
			console.error("@COIView::Error on setLabelTextImagePosition::"
					+ err.message);
		}

	},

	checkAndSetLockStatus : function(group) {
		console.log("@COIView.checkAndSetLockStatus");
		try {
			var cdLayer = window.CD.services.cs.getLayer();
			var groupId = group.attrs.id;
			var unlockIconVisible = group.get('.unlockicon_' + groupId)[0]
					.getVisible();
			if (unlockIconVisible) {
				group.setDraggable(true);
				var changefieldArr = {
					"lockStatus" : false
				};

			} else {
				group.setDraggable(false);
				var changefieldArr = {
					"lockStatus" : true
				};
			}
			var selectedcoiIndex = COIView.getDataIndex(groupId);
			window.CD.module.data.setEachLabelOutputData(selectedcoiIndex,
					changefieldArr, "");
			cdLayer.draw();
		} catch (err) {
			console.error("@COIView::Error on checkAndSetLockStatus::"
					+ err.message);
		}
	},
	setPosition : function(group) {
		console.log("@COIView.setPosition");
		try {
			var groupId = group.attrs.id;
			var image = group.children[0];
			var grpX = group.getX();
			var grpY = group.getY();
			var imgX = image.getX();
			var imgY = image.getY();
			group.setX(grpX + imgX);
			group.setY(grpY + imgY);
			image.setX(0);
			image.setY(0);

			group.get('.topLeft_' + groupId)[0].setPosition(0, 0);
			group.get('.topRight_' + groupId)[0].setPosition(image.getWidth(),
					0);
			group.get('.bottomRight_' + groupId)[0].setPosition(image
					.getWidth(), image.getHeight());
			group.get('.bottomLeft_' + groupId)[0].setPosition(0, image
					.getHeight());

			if (group.attrs.id.match(/label_[0-9]+/)) {
				/* lock icon */
				var lockIcon = group.get('.lockicon_' + groupId)[0];
				var unlockIcon = group.get('.unlockicon_' + groupId)[0];
				lockIcon.setX(image.getWidth() - 20);
				lockIcon.setY(image.getHeight() - 20);
				unlockIcon.setX(image.getWidth() - 20);
				unlockIcon.setY(image.getHeight() - 20);
				// group.get('.unlockicon_' + groupId)[0].show();
				group.get('.lockicon_' + groupId)[0].setOpacity(1);
				group.get('.unlockicon_' + groupId)[0].setOpacity(1);
				var unlockIconVisible = group.get('.unlockicon_' + groupId)[0]
						.getVisible();
				if (unlockIconVisible) {
					group.setDraggable(true);
				} else {
					group.setDraggable(false);
				}

				/* radio botton */
				if (group.get('.checkRadio_' + groupId)[0]
						|| group.get('.uncheckRadio_' + groupId)[0]) {
					var checkRadio = group.get('.checkRadio_' + groupId)[0];
					var uncheckRadio = group.get('.uncheckRadio_' + groupId)[0];
					var checkRadioWbuffer = this.radioWbuffer;
					var checkRadioHbuffer = this.radioHbuffer;
					checkRadio.setX(image.getWidth() - checkRadioWbuffer);
					checkRadio.setY(image.getHeight() - checkRadioHbuffer);
					uncheckRadio.setX(image.getWidth() - checkRadioWbuffer);
					uncheckRadio.setY(image.getHeight() - checkRadioHbuffer);
					// group.get('.unlockicon_' + groupId)[0].show();
					group.get('.checkRadio_' + groupId)[0].setOpacity(1);
					group.get('.uncheckRadio_' + groupId)[0].setOpacity(1);

				}
				/* checkbox */
				if (group.get('.checkCheckBox_' + groupId)[0]
						|| group.get('.uncheckCheckBox_' + groupId)[0]) {
					var checkCheckBox = group.get('.checkCheckBox_' + groupId)[0];
					var uncheckCheckBox = group
							.get('.uncheckCheckBox_' + groupId)[0];
					var checkWbuffer = this.checkWbuffer;
					var checkHbuffer = this.checkHbuffer
					checkCheckBox.setX(image.getWidth() - checkWbuffer);
					checkCheckBox.setY(image.getHeight() - checkHbuffer);
					uncheckCheckBox.setX(image.getWidth() - checkWbuffer);
					uncheckCheckBox.setY(image.getHeight() - checkHbuffer);
					// group.get('.unlockicon_' + groupId)[0].show();
					group.get('.checkCheckBox_' + groupId)[0].setOpacity(1);
					group.get('.uncheckCheckBox_' + groupId)[0].setOpacity(1);
				}
			}
			COIView.checkAndSetLockStatus(group);
		} catch (err) {
			console.error("@COIView::Error on setPosition::" + err.message);
		}

	},
	/**
	 * function name: creatCOILabelPoPUp() author:Piyali Saha
	 */
	creatCOILabelPoPUp : function(CoiLabelMessage) {
		console.log("@COIView::creatCOILabelPoPUp");
		try {
			var labelModal = window.CD.util
					.getTemplate( {
						url : 'resources/themes/default/views/label_modal.html?{build.number}'
					});
			$(labelModal).remove();
			$('#labelModal').remove();
			$('body').append(labelModal);
			$('#labelModal').css(
					'left',
					(($('#toolPalette').width() / 2) - ($('#labelModal')
							.width() / 2)) + 'px');
			$('#labelModal').css(
					'top',
					(($('#canvasHeight').val() / 2) - ($('#labelModal')
							.height() / 2)) + 'px');
			$('#labelModal').slideDown(200);
			var CoilabelPopUplabel_options = '<span>How many labels would you like to create?</span><br><br>'
					+ '<span class="coiMsgBox">'
					+ CoiLabelMessage
					+ '</span><br>'
					+ '<div class="cen_align"><input type="text" class="label_count coiEnterLabelCount input_text border_txt" value="0" />'
					+ ' labels</div>';

			$("#labelModal .label_options").html(CoilabelPopUplabel_options);

			/* bind on keydown for error text box */
			$(this.labelContainerId + " input.input_text").bind('keydown',
					function(e) {
						validation.onKeyDownClearTextBox(e, this)
					});
			/* on click on cancel */
			$(this.labelContainerId + " span#labelCancel").off('click').on(
					'click', function() {
						$('#labelOverlay').remove();
						$('#labelModal').slideUp(200);
						$('.tool_select').trigger('click');
					});

		} catch (err) {
			console.error("@COIView::Error on creatCOILabelPoPUp::"
					+ err.message);
		}

	},

	/**
	 * function name: createMultipleLabelModal() author:Piyali Saha
	 */
	createMultipleLabelModal : function() {
		console.log("@COIView.createMultipleLabelModal");
		try {
			var labelToolContainerID = "#labelContainer";
			var isSingleSelection = false;
			var coiModalmsg = 'Identify the correct labels by selecting checkboxes within the activity';
			this.creatCOILabelPoPUp(coiModalmsg);
			$(labelToolContainerID + " span#labelOk").off('click').on(
					'click',
					function() {
						var countLabel = COIView.onClickOkOnPopup();
						if (countLabel && countLabel <= 15 && countLabel != 0) {
							window.CD.module.view.createLabel(countLabel,
									isSingleSelection);
						}
					});

		} catch (err) {
			console.error("@COIView::Error on createMultipleLabelModal::"
					+ err.message);
		}

	},
	/**
	 * function name: createSingleLabelModal() author:Piyali Saha
	 */
	createSingleLabelModal : function() {
		console.log("@COIView.createSingleLabelModal");
		try {
			var labelToolContainerID = "#labelContainer";
			var isSingleSelection = true;
			var coiModalmsg = 'The single correct label will be identified by radio button selection in the activity.';
			this.creatCOILabelPoPUp(coiModalmsg);
			$(labelToolContainerID + " span#labelOk").off('click').on(
					'click',
					function() {
						var countLabel = COIView.onClickOkOnPopup();
						if (countLabel && countLabel <= 15 && countLabel != 0) {
							window.CD.module.view.createLabel(countLabel,
									isSingleSelection);
						}
					});

		} catch (err) {
			console.error("@COIView::Error on createSingleLabelModal::"
					+ err.message);
		}

	},
	/**
	 * function name: checkAndGetLBLGroup() author:Piyali Saha
	 */
	checkAndGetLBLGroup : function(group,grpId) {
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var cdLayer = cs.getLayer();
		if((!group || group.children.length < 10) && grpId!="") {
			var group=cdLayer.get('#'+grpId)[0];
		}
		return group;
	},
	/**
	 * function name: undoRedoSelection() author:Piyali Saha
	 */
	undoRedoSelection : function(selectedLabel,labelId) {
		var cdLayer = window.CD.services.cs.getLayer();
		var selectedLabel=COIView.checkAndGetLBLGroup(selectedLabel,labelId);
		if(selectedLabel && selectedLabel.children.length!=0){
			var uncheckRadio=selectedLabel.get('.uncheckRadio_'+ selectedLabel.attrs.id)[0];
			if(uncheckRadio)uncheckRadio.fire('click');
		}else{
			console.log("@undoRedoSelection:either selectedLabel is undefined or empty")
		}
			
	},
	
	/**
	 * function name: setDistractorSingleSelection() author:Piyali Saha
	 */
	setDistractorSingleSelection : function(selectedLabel,isUndoRedo) {
		console.log("@COIView.setDistractorSingleSelection");
		try {
			var totalCoiData = window.CD.module.data.Json.COIData;
			var cdLayer = window.CD.services.cs.getLayer();
			var selectedlabelGrpId = selectedLabel.attrs.id;
			
			for (kkey in totalCoiData) {
				if (kkey) {
					var otherLabelGrpId = totalCoiData[kkey].labelGroupId;
					var othercoiIndex = COIView.getDataIndex(otherLabelGrpId);
					var otherLabelObj = cdLayer.get('#lbl_' + otherLabelGrpId.split('_')[1])[0].parent;
					var fillStatus = window.CD.module.data.getEachLabelOutputData(othercoiIndex,'transparent');
					// cdLayer.get("#"+otherLabelGrpId)[0];
					if (otherLabelGrpId != selectedlabelGrpId) {
						if (fillStatus == "F") {
							otherLabelObj.children[0].setFill(COIView.defaultDistractorColor);
						} else {
							otherLabelObj.children[0].setFill('transparent');
						}
						// window.CD.module.data.Json.COIData[othercoiIndex].distractor_label
						// = 'T';
						otherLabelObj.get('.uncheckRadio_' + otherLabelObj.attrs.id)[0].show();
						otherLabelObj.get('.checkRadio_' + otherLabelObj.attrs.id)[0].hide();
						window.CD.module.data.Json.COIData[othercoiIndex].correct_ans = 'F';

					} else if (otherLabelGrpId == selectedlabelGrpId) {
						if (fillStatus == "F") {
							otherLabelObj.children[0].setFill(COIView.defaultLabelFillColor);
						} else {
							otherLabelObj.children[0].setFill('transparent');
						}

						// window.CD.module.data.Json.COIData[othercoiIndex].distractor_label
						// = 'F';
						window.CD.module.data.Json.COIData[othercoiIndex].correct_ans = 'T';

					}
				}
			}

			cdLayer.draw();
			this.ds.setOutputData();

		} catch (err) {
			console.error("@COIView::Error on setDistractorSingleSelection::"
					+ err.message);
		}

	},
	/**
	 * function name: unsetDistractorSingleSelection() author:Piyali Saha
	 */
	unsetDistractorSingleSelection : function() {
		console.log("@COIView.unsetDistractorSingleSelection");
		try {
			var totalCoiData = window.CD.module.data.Json.COIData;
			var cdLayer = window.CD.services.cs.getLayer();

			for (kkey in totalCoiData) {
				if (kkey) {
					var allotherLabelGrpId = totalCoiData[kkey].labelGroupId;
					var allothercoiIndex = COIView
							.getDataIndex(allotherLabelGrpId);
					var allotherLabelObj = cdLayer
							.get('#lbl_' + otherLabelGrpId.split('_')[1])[0].parent;
					allotherLabelObj.children[0]
							.setFill(COIView.defaultLabelFillColor);
					// window.CD.module.data.Json.COIData[allothercoiIndex].distractor_label
					// = 'F';
					window.CD.module.data.Json.COIData[allothercoiIndex].correct_ans = 'T';

				}

			}
			cdLayer.draw();
			this.ds.setOutputData();

		} catch (err) {
			console.error("@COIView::Error on unsetDistractorSingleSelection::"
					+ err.message);
		}

	},

	/**
	 * function name: setSelectedLabelMultipleSelection() author:Piyali Saha
	 */
	setSelectedLabelMultipleSelection : function(selectedLabelGrpObj) {
		console.log("@COIView.setSelectedLabelMultipleSelection");
		try {
			var totalCoiData = window.CD.module.data.Json.COIData;
			var cdLayer = window.CD.services.cs.getLayer();
			var selectedLabelObj = this.getObjectFromLabelGroup("label",
					selectedLabelGrpObj);

			var selectedlabelGrpId = selectedLabelGrpObj.attrs.id;
			var selectedcoiIndex = COIView.getDataIndex(selectedlabelGrpId);
			var fillStatus = window.CD.module.data.getEachLabelOutputData(
					selectedcoiIndex, "transparent");

			if (fillStatus == "F") {
				selectedLabelObj.setFill(COIView.defaultLabelFillColor);
			} else {
				selectedLabelObj.setFill("transparent");
			}
			var changefieldArr = {
				"correct_ans" : "T"
			};
			window.CD.module.data.setEachLabelOutputData(selectedcoiIndex,
					changefieldArr, "");

			cdLayer.draw();
			this.ds.setOutputData();

		} catch (err) {
			console
					.error("@COIView::Error on setSelectedLabelMultipleSelection::"
							+ err.message);
		}

	},
	/**
	 * function name: unsetSelectedLabelMultipleSelection() author:Piyali Saha
	 */
	unsetSelectedLabelMultipleSelection : function(selectedLabelGrpObj) {
		console.log("@COIView.unsetSelectedLabelMultipleSelection");
		try {
			var totalCoiData = window.CD.module.data.Json.COIData;
			var cdLayer = window.CD.services.cs.getLayer();
			var selectedLabelObj = this.getObjectFromLabelGroup("label",
					selectedLabelGrpObj);

			var selectedlabelGrpId = selectedLabelGrpObj.attrs.id;
			var selectedcoiIndex = COIView.getDataIndex(selectedlabelGrpId);
			var fillStatus = window.CD.module.data.getEachLabelOutputData(
					selectedcoiIndex, "transparent");

			if (fillStatus == "F") {
				selectedLabelObj.setFill(COIView.defaultDistractorColor);
			} else {
				selectedLabelObj.setFill("transparent");
			}

			var changefieldArr = {
				"correct_ans" : "F"
			};
			window.CD.module.data.setEachLabelOutputData(selectedcoiIndex,
					changefieldArr, "");

			cdLayer.draw();
			this.ds.setOutputData();

		} catch (err) {
			console
					.error("@COIView::Error on unsetSelectedLabelMultipleSelection::"
							+ err.message);
		}

	},

	/**
	 * function name: onClickOkOnPopup() author:Piyali Saha
	 */
	onClickOkOnPopup : function() {
		console.log("@COIView.onClickOkOnPopup");
		try {
			$('#labelOverlay').remove();
			var labelCountVal = $('.label_options .coiEnterLabelCount').val();
			var returntype = false;
			
			 var regex = /[0-9 -()+]+$/;
			 if(regex.test(labelCountVal)){
				 if (parseInt(labelCountVal) == 0) {
						validation.showLabelErrorPOPUP(3);
						returntype = false;
					} else if (parseInt(labelCountVal) <= 15) {
						COIView.ds.totalElm = labelCountVal;
						$('#labelModal').hide()
						$('.tool_select').trigger('click');
						var countLabel = labelCountVal;
						returntype = countLabel;
					} else if (labelCountVal === "" || labelCountVal === null) {
						validation.showLabelErrorPOPUP(2);
						returntype = false;
					} else {
						validation.showLabelErrorPOPUP(27);
						returntype = false;
					}
			 }else{
				 validation.showLabelErrorPOPUP(25);
					returntype = false;
			 }
			
			return returntype;
		} catch (err) {
			console
					.error("@COIView::Error on onClickOkOnPopup::"
							+ err.message);
		}
	},
	/**
	 * function name: callAllMethodForLabelCreate() author:Piyali Saha
	 */
	callAllMethodForLabelCreate : function(allOptions, isSingleSelection) {
		console.log("@COIView::callAllMethodForLabelCreate");
		try {
			makeCOIResizable(allOptions.labelGroup, allOptions.width,
					allOptions.height);

			this.cs.dragLockUnlock(allOptions.labelGroup,
					parseInt(allOptions.width), parseInt(allOptions.height),
					allOptions.isDraggable);
			unchecked = true;
			if (allOptions.ans) {
				if (allOptions.ans === "T") {
					unchecked = false;
				} else {
					unchecked = true;
				}
			}
			var radioUnChecked = unchecked;
			if (allOptions.radioChecked && allOptions.radioChecked == "T") {
				var radioUnChecked = false;
			}
			if (isSingleSelection) {
				COIView.checkUncheckRadio(allOptions.labelGroup,
						parseInt(allOptions.width),
						parseInt(allOptions.height), radioUnChecked);
			} else {
				COIView.checkUncheckCheckBox(allOptions.labelGroup,
						parseInt(allOptions.width),
						parseInt(allOptions.height), unchecked);
			}
		} catch (err) {
			console.error("@COIView::callAllMethodForLabelCreate::"
					+ err.message);
		}

	},

	/**
	 * function name: attachEventforLabel() author:Piyali Saha
	 */
	attachEventforLabel : function(labelGroup, textObj) {
		console.log("@COIView::attachEventforLabel");
		try {
			if (labelGroup) {
				labelGroup.on('mousedown', function(evt) {
					COIView.cs.setActiveElement(this, 'label');
					COIView.displayHideHintFeedback(this, false);
					evt.cancelBubble = true;
					COIView.cs.updateDragBound(this);
					openInspector('label');
					window.CD.services.cs.updateMoveToTopBottomState(this);
					//this.moveToTop();
				});

				labelGroup.on('click', function(evt) {
					evt.cancelBubble = true;
				});

				labelGroup.on('dragend',function(evt) {
									evt.cancelBubble = true;
									/*var coiIndex = COIView
											.getDataIndex(this.attrs.id);
									var undoMng = window.CD.undoManager;
									var coiX = window.CD.module.data.Json.COIData[coiIndex].holder_x;
									var coiY = window.CD.module.data.Json.COIData[coiIndex].holder_y;
									var labelId=labelGroup.getId();
									undoMng.register(this, COIView.setLabelGroupPosition,[this,coiX,coiY,labelId] , 'Undo Label position',this, COIView.setLabelGroupPosition,[this,this.getX(),this.getY(),labelId] , 'Redo Label position');
									updateUndoRedoState(undoMng);
									var changefieldArr = {
										holder_x : this.getX(),
										holder_y : this.getY()
									};
									window.CD.module.data
											.setEachLabelOutputData(coiIndex,
													changefieldArr);*/
									COIView.setActiveLabelPosition(this);
								});

				/* image group event bind */
				var images = labelGroup.get('.img');
				if (images[0]) {
					var imgGrp = images[0].parent;

				}

			}
			if (textObj) {
				textObj.on("click tap", function(evt) {
					var coiTextTool = new TextTool.commonLabelText();					
					coiTextTool.createMaskOnCanvas();
					coiTextTool.addEditLabelText(this.parent);
					$('#textToolContainer').css('z-index',100);
				});
			}

		} catch (err) {
			console.error("@COIView::attachEventforLabel::" + err.message);
		}

	},

	setLabelGroupPosition : function(group1, x, y,grpID) {
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var cdLayer = cs.getLayer();
		for(var i=0;i<group1.length;i++){
			var group=COIView.checkAndGetLBLGroup(group1[i],grpID[i]);
			
			if(group){
				var coi = COIView.getDataIndex(group.attrs.id);
				var COIJsonData = window.CD.module.data.Json.COIData;
				var X = x[i];// COIJsonData[coi].holder_x;
				var Y = y[i];// COIJsonData[coi].holder_y
				group.setPosition(X, Y);
				cdLayer.draw();
		
				if (coi) {
					COIJsonData[coi].holder_x = x[i];
					COIJsonData[coi].holder_y = y[i];
					ds.setOutputData();
				}
			}
		}
		
	},

	removeHintFeedback : function() {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		if (cdLayer.get('.hint_grp')[0]) {
			cdLayer.get('.hint_grp')[0].hide();
		}
		cdLayer.draw();
	},

	destroyHintFeedback : function() {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		if (cdLayer.get('.hint_grp')[0]) {
			cdLayer.get('.hint_grp')[0].destroyChildren();
			cdLayer.get('.hint_grp')[0].destroy();
		}
		cdLayer.draw();
	},
	/**
	 * function name: hintTextAdjust() author:Piyali Saha
	 */
	hintTextAdjust : function(hintTextObj, hintRectObj) {
		console.log("@COIView.hintTextAdjust");
		try {
			var boxWidth = parseInt(hintRectObj.getWidth());
			var boxHeight = parseInt(hintRectObj.getHeight());
			/* change position */
			hintTextObj.setWidth(parseInt(hintRectObj.getWidth()));
			hintTextObj.setY(((hintRectObj.getHeight()) - (hintTextObj
					.getTextHeight())) / 2);

			// hoverHintText.setX(hoverHintRect.getWidth());//-(hoverHintText.getTextWidth()))/2);
			// hoverHintText.setY(((hoverHintRect.getHeight())-(hoverHintText.getTextHeight()))/2);

			if (hintTextObj.getTextWidth() > boxWidth
					|| hintTextObj.getTextHeight() > boxHeight) {
				hintTextObj.setX(hintRectObj.getX());
				hintTextObj.setY(hintRectObj.getY());
				hintTextObj.setWidth(boxWidth);
				hintTextObj.setHeight(boxHeight);
			}

		} catch (err) {
			console.error("@COIView::Error on hintTextAdjust::" + err.message);
		}
	},

	/**
	 * function name: adjustTxtPosNoimagePreset() author:Piyali Saha
	 */
	adjustTxtPosNoimagePreset : function(txtObj, textRectOj, txtGrpObj, type) {

		var lblGrp = txtObj.parent;
		var txtConfg = new TextTool.commonLabelText();
		var labelIndex = lblGrp.getId().split('_')[1];
		if(type !== "HintFeedback" && window.CD.module.data.textGroupComponent.length > 0){
			var count = txtObj.children.length-1;
			var lastChild = txtConfg.findLastTextchild(txtObj,count);
			var originalTextHeight = txtObj.children[lastChild].getY() + txtObj.children[lastChild].getHeight();
		}else{
			if(txtObj.textArr){
				var originalTextHeight = txtObj.textArr.length * txtObj.getTextHeight();
			}else{
				var originalTextHeight = txtObj.children[0].attrs.height;
			}
			
		}
		
		var totHeight = textRectOj.getHeight();

		if (type === "HintFeedback") {
			txtObj.setPadding(2);
			if (totHeight > originalTextHeight) {
				var calcY = (totHeight - originalTextHeight) / 2;
				txtObj.setY(calcY);
			}

			if (totHeight <= originalTextHeight) {
				var calcY = hoverHintRect.getY();
				txtObj.setY(calcY);
			}
		} else {
			if (totHeight > originalTextHeight) {
				var calcY = (totHeight - originalTextHeight) / 2;
				txtGrpObj.setY(calcY);
			}

			if (totHeight <= originalTextHeight) {
				var calcY = txtGrpObj.parent.children[0].getY();
				txtGrpObj.setY(calcY);
			}
		}

	},

	/**
	 * function name: displayHideHintFeedback() author:Piyali Saha
	 */
	displayHideHintFeedback : function(lblGrpObj, mouseOut) {
		console.log("@COIView.displayHideHintFeedback");
		//try {
			console.log(mouseOut);
			var cdLayer = window.CD.services.cs.getLayer();
			var hintFeedbackStatusArr = [ 'hint', 'feedback', 'none' ];
			/* fetch label group details */
			var coiIndex = this.getDataIndex(lblGrpObj.attrs.id);
			var hintGrp = cdLayer.get('.hint_grp')[0];
			if (hintGrp) {
				var hintFeedbackStatus = window.CD.module.data.Json.adminData.showHintOrFeedbackInAuthoring;
				var hintval = window.CD.module.data.getEachLabelOutputData(
						coiIndex, "hint_value");
				var feedBackval = window.CD.module.data.getEachLabelOutputData(
						coiIndex, "feedback_value");

				if (hintFeedbackStatus == hintFeedbackStatusArr[0]
						&& hintval != "") {					
					if (!mouseOut) {
						COIView.createUpdateHintFeedbackBox(true,lblGrpObj);
						var hintGrp = cdLayer.get('.hint_grp')[0];
						var defaultRectObj = hintGrp.get('.hintDefaultRect')[0];
						var defaultTextObj = hintGrp.get('.hintDefaultText')[0];
						var hintTextObj = cdLayer.get('#hintTxt')[0];
						var hintRectObj = hintGrp.get('#hintHoverRect')[0];
						
						hintRectObj.show();
						hintTextObj.show();
						defaultRectObj.hide();
						defaultTextObj.hide();
						
					} else {
						var hintGrp = cdLayer.get('.hint_grp')[0];
						var defaultRectObj = hintGrp.get('.hintDefaultRect')[0];
						var defaultTextObj = hintGrp.get('.hintDefaultText')[0];
						var hintTextObj = cdLayer.get('#hintTxt')[0];
						var hintRectObj = hintGrp.get('#hintHoverRect')[0];
						
						hintRectObj.hide();
						hintTextObj.hide();
						defaultRectObj.show();
						defaultTextObj.show();
					}

				} else if (hintFeedbackStatus == hintFeedbackStatusArr[1]
						&& feedBackval != "") {
					
					if (!mouseOut) {
						COIView.createUpdateHintFeedbackBox(true,lblGrpObj);
						var hintGrp = cdLayer.get('.hint_grp')[0];
						var defaultRectObj = hintGrp.get('.hintDefaultRect')[0];
						var defaultTextObj = hintGrp.get('.hintDefaultText')[0];
						var feedbackTextObj = cdLayer.get('#hintTxt')[0];
						var feedbackRectObj = hintGrp.get('#hintHoverRect')[0];
						
						defaultRectObj.hide();
						defaultTextObj.hide();	
						feedbackRectObj.show();
						feedbackTextObj.show();
					} else {
						var hintGrp = cdLayer.get('.hint_grp')[0];
						var defaultRectObj = hintGrp.get('.hintDefaultRect')[0];
						var defaultTextObj = hintGrp.get('.hintDefaultText')[0];
						var feedbackTextObj = cdLayer.get('#hintTxt')[0];
						var feedbackRectObj = hintGrp.get('#hintHoverRect')[0];
						
						feedbackRectObj.hide();
						feedbackTextObj.hide();
						defaultRectObj.show();
						defaultTextObj.show();
					}
				}
				cdLayer.draw();
			}
		//} catch (err) {
		//	console.error("@COIView::Error on displayHideHintFeedback::"
		//			+ err.message);
		//}
	},

	/**
	 * function name: createUpdateHintFeedbackBox() author:Piyali Saha
	 */
	createUpdateHintFeedbackBox : function(ShowLabel, lblgrp,undoRedoObj) {
		console.log("@COIView.createUpdateHintFeedbackBox");
		try {
			var textFormat = new TextFormat();
			var commonLabelTextToolChar = new TextTool.commonLabelText();
			
			var cdLayer = window.CD.services.cs.getLayer();
			var hintFeedbackStatusArr = [ 'hint', 'feedback', 'none' ];
			var frameGroup = this.cs.findGroup('frame_0');
			var lfontSize = parseInt(window.CD.module.data.Json.adminData.GFS);
			if (ShowLabel && lblgrp) {
				var activeElm = lblgrp;
				/* get hint details for show label */
				hintFeedbackStatus = window.CD.module.data.Json.adminData.showHintOrFeedbackInAuthoring;
				var ZHP = window.CD.module.data.getHintParameterFromJson();
				var hintW = ZHP.w, hintH = ZHP.h
				$("#hintWidth").val(hintW);
				$("#hintHeight").val(hintH);
				$("#feedbackWidth").val(
						window.CD.module.data.Json.adminData.feedbackWidth);
				$("#feedbackHeight").val(
						window.CD.module.data.Json.adminData.feedbackHeight);
				$('input:radio[name=hintFeedback]').filter(
						'[value="' + hintFeedbackStatus + '"]').attr('checked',
						true);
			} else {
				var activeElm = window.CD.elements.active.element[0];
			}
			/* fetch label group details */
			var coiIndex = this.getDataIndex(activeElm.attrs.id);
			/* get hint values from inspector? */
			var hintWidthIns = $("#hintWidth").val();
			var hintHeightIns = $("#hintHeight").val();
			var hintFeedbackStatus = $('input[name=hintFeedback]:checked').val();
			var feedbackWidthIns=$("#feedbackWidth").val();
			var feedbackHeightIns=$("#feedbackHeight").val();
			
			var hintFeedbackVal = COIData.getHintFeedbackValue(activeElm.attrs.id);
			var hintTextValue = hintFeedbackVal.hintValue;
			var feedbackTextValue = hintFeedbackVal.feedbackValue;

			/*if its undo redo*/
			if(typeof undoRedoObj==="object"){
				hintWidthIns=parseInt(undoRedoObj.hintW);
				hintHeightIns =parseInt(undoRedoObj.hintH);
				hintFeedbackStatus =undoRedoObj.staus;
				
				feedbackWidthIns=parseInt(undoRedoObj.feedbackW);
				feedbackHeightIns=parseInt(undoRedoObj.feedbackH);
							
				/*update inspector on undo and redo*/
				$("#hintWidth").val(hintWidthIns);
				$("#hintHeight").val(hintHeightIns);
				$("#feedbackWidth").val(feedbackWidthIns);
				$("#feedbackHeight").val(feedbackHeightIns);
				$('input:radio[name=hintFeedback]').filter(
						'[value="' + hintFeedbackStatus + '"]').attr('checked',
						true);
				
			
			}
			
			/* fetch hint param */
			if (hintFeedbackStatus == hintFeedbackStatusArr[0]) {
				var boxWidth = parseInt(hintWidthIns), 
				boxHeight = parseInt(hintHeightIns), 
				boxValue = hintTextValue;//$("#textareaHint").val();
				if (ShowLabel) {
					boxValue = window.CD.module.data.getEachLabelOutputData(
							coiIndex, "hint_value");
				}
				var changefieldArr = {
					hint_value : boxValue
				};
				window.CD.module.data.setEachLabelOutputData(coiIndex,
						changefieldArr);

			} else if (hintFeedbackStatus == hintFeedbackStatusArr[1]) {
				var boxWidth = parseInt(feedbackWidthIns);//$("#feedbackWidth").val(), 
				boxHeight = parseInt(feedbackHeightIns);//$("#feedbackHeight").val(), 
				boxValue = feedbackTextValue;//$("#textareaFeedback").val();
				if (ShowLabel) {
					boxValue = window.CD.module.data.getEachLabelOutputData(
							coiIndex, "feedback_value");
				}
				var changefieldArr = {
					feedback_value : boxValue
				};
				window.CD.module.data.setEachLabelOutputData(coiIndex,
						changefieldArr);

			} else {
				var boxWidth = 120;
				var boxHeight = 70;
				var boxValue = "";

			}
			var hintparam = window.CD.module.data.getHintParameterFromJson();
			var box_x = hintparam.x;
			var box_y = hintparam.y;
			this.destroyHintFeedback();
			if (!ShowLabel) {
				/* cehcking for canvas end x */
				var stg = window.CD.services.cs.getCanvas();
				var canvasEndX = stg.getX() + stg.getWidth() - 17;
				var boxEndX = box_x + parseInt(boxWidth);
				if (boxEndX > canvasEndX) {
					box_x = canvasEndX - parseInt(boxWidth) - 10;
				}

				/* cehecking for canvas end y */
				var canvasEndY = stg.getY() + stg.getHeight() - 15;
				var boxEndY = box_y + parseInt(boxHeight);
				if (boxEndY >= canvasEndY) {
					box_y = canvasEndY - parseInt(boxHeight) - 10;
				}

			}
			/* save output data */
			window.CD.module.data.setHintParameterInJson(
					parseInt(hintWidthIns), parseInt(hintHeightIns),
					parseInt(box_x), parseInt(box_y));
			window.CD.module.data.Json.adminData.feedbackWidth = $(
					"#feedbackWidth").val();
			window.CD.module.data.Json.adminData.feedbackHeight = $(
					"#feedbackHeight").val();
			window.CD.module.data.Json.adminData.showHintOrFeedbackInAuthoring = hintFeedbackStatus;
			this.ds.setOutputData();

			var boxGrp = this.cs.createGroup('hint_grp', {
				x : box_x,
				y : box_y,
				draggable : true,
				name : 'hint_grp'
			});

			/* default hint box */
			var hintDefaultRectOPT = {
				type : "Rect",
				kinteticOpt : {
					x : 0,
					y : 0,
					height : boxHeight,
					width : boxWidth,
					stroke : this.defaultLabelStrokeCLR,
					cornerRadius : 5,
					strokeWidth : 1,
					fill : this.defaultHintFillColor,
					opacity : 1,
					id : 'hintDefaultRect',
					name : 'hintDefaultRect'
				}
			}
			var hintDefaultRect = this.createKineticObject(hintDefaultRectOPT);
			var hintDefaultTextOPT = {
				type : "Text",
				kinteticOpt : {
					text : this.defaultHintText,
					fontSize : 14,//lfontSize,
					fontFamily : 'sans-serif',
					fill : '#cccccc',
					opacity : '1',
					width : 'auto',
					height : 'auto',
					align : 'center',
					id : 'hintDefaultText',
					name : 'hintDefaultText',
					padding : 7
				}
			}
			var hintDefaultText = this.createKineticObject(hintDefaultTextOPT);

			/* with text hint box */
			var hoverHintRectOPT = {
				type : "Rect",
				kinteticOpt : {
					x : 0,
					y : 0,
					height : boxHeight,
					width : boxWidth,
					stroke : this.defaultLabelStrokeCLR,
					cornerRadius : 5,
					strokeWidth : 1,
					fill : this.hoverHintFillColor,
					opacity : 1,
					id : 'hintHoverRect',
					name : 'hintHoverRect'
				}
			}
			var hoverHintRect = this.createKineticObject(hoverHintRectOPT);

			

			boxGrp.add(hintDefaultRect);
			boxGrp.add(hintDefaultText);

			boxGrp.add(hoverHintRect);
			//boxGrp.add(hoverHintText);
			var cs = window.CD.services.cs;
			var hintTextGroup = cs.createGroup('hintTxt');
			boxGrp.add(hintTextGroup);
			
			hintTextGroup = textFormat.createHintFeedbackText(hintTextGroup, boxValue);
			
			hoverHintRect.hide();
			hintTextGroup.hide();

			hintDefaultText.setWidth(hintDefaultRect.getWidth());
			hintDefaultText.setHeight(hintDefaultRect.getHeight());
			hintDefaultText
					.setY(((hintDefaultRect.getHeight()) - (hintDefaultText
							.getTextHeight())) / 2);
			this.adjustTxtPosNoimagePreset(hintDefaultText, hintDefaultRect, '',
			'HintFeedback');
			if ((hintFeedbackStatus == hintFeedbackStatusArr[0])
					|| (hintFeedbackStatus == hintFeedbackStatusArr[1])) {
				hintDefaultRect.show();
				hintDefaultText.show();
			} else {
				hintDefaultRect.hide();
				hintDefaultText.hide();
			}
			
			/* ----------- Modified for vertical alignment --------- */
			
			var count = hintTextGroup.children.length-1;
			if(count >= 0){
				var lastChild = commonLabelTextToolChar.findLastTextchild(hintTextGroup,count);
				var textGrpHeight = hintTextGroup.children[lastChild].getY() + hintTextGroup.children[lastChild].getHeight();
				var topPadding = (hintTextGroup.parent.children[0].getHeight()-textGrpHeight)/2;
				if(topPadding < 0)
					topPadding = 0;
				hintTextGroup.setY(topPadding);	
			}		
			
			cdLayer.add(boxGrp);
			cdLayer.draw();
			boxGrp.on('click', function(evt) {
				evt.cancelBubble = true;
				openInspector('label');

			});
			boxGrp.on('dragend', function(evt) {
				var ds = COIView.ds;
				evt.cancelBubble = true;
				var undoMng = window.CD.undoManager;
				var zhp = window.CD.module.data.getHintParameterFromJson();
				var boxId=boxGrp.getId();
				var redoZhp={
						w:this.getWidth(),
						h:this.getHeight(),
						x:this.getX(),
						y:this.getY()						
					 }
				undoMng.register(this, COIView.updatePlaceHolderPosition,[zhp,boxGrp,boxId] , 'undo hint dimension',this, COIView.updatePlaceHolderPosition,[redoZhp,boxGrp,boxId] , 'Redo hint dimension');
				updateUndoRedoState(undoMng);
				
				
				window.CD.module.data.setHintParameterInJson('', '', this.getX(), this.getY());

			});

		} catch (err) {
			console.error("@COIView::Error on createUpdateHintFeedbackBox::"
					+ err.message);
		}

	},
	/**
	 * This method is used for updating hint/feedback placeholder
	 * position on undo
	 * By Nabonita Bhattacharyya
	 */
	updatePlaceHolderPosition : function(zhp,hintGroup,grpID){
		try{
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var ds = window.CD.services.ds;
			var x = zhp.x;
			var y = zhp.y;
			var hintGroup=COIView.checkAndGetLBLGroup(hintGroup,grpID);
			hintGroup.setX(x);
			hintGroup.setY(y);
			window.CD.module.data.setHintParameterInJson('','',x,y);
			ds.setOutputData();
			cdLayer.draw();
		}
		catch(err){
			console.error("@COIView::Error on updatePlaceHolderPosition::"+err.message);
		}
	},
	/**
	 * function name: createLabel() author:Piyali Saha
	 */
	createLabel : function(countLabel, isSingleSelection,labelData) {
		console.log("@COI LabelTool.createLabel");
		try {
			var cs = window.CD.services.cs;
			var stg = cs.getCanvas();
			var ds = window.CD.services.ds;
			var cdLayer = COIView.cs.getLayer();
			var lbConfig = new LabelConfig();
			var labelCount = this.getCOIdataCout();
			var labelGroupStartId = labelCount;
			var textboxBuffer = this.textBoxBuffer;
			var undoMng = window.CD.undoManager;
			var lfontSize = parseInt(window.CD.module.data.Json.adminData.GFS);
			if (labelCount) {
				var coiObject = window.CD.module.data
						.getCoiDataElementNumberwise(0);
				var labelGroupId = coiObject.labelGroupId;
				var lblGroup = this.cs.findGroup(labelGroupId);
				labelGroupStartId = COIData.getLabelStartId();
				lbConfig.style.width = lblGroup.children[0].getWidth();
				lbConfig.style.height = lblGroup.children[0].getHeight();
				lbConfig.style.fill = lblGroup.children[0].getFill();
			}
			

			totalLabelToCreate = parseInt(countLabel);
			var totlblCount = labelGroupStartId + totalLabelToCreate;
			
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

			/* for loop */
			for ( var i = labelGroupStartId; i < totlblCount; i++) {
				var itaration=i;
				lbConfig.id = 'lbl_' +itaration;
				var holder_x = 100, holder_y = 50 + (itaration*parseInt(overLapVal));//100 + (itaration * 30);
				/*config values*/
				var lblConfigHeight=lbConfig.style.height;
				var lblConfigWidth=lbConfig.style.width;
				var lblConfigFill=lbConfig.style.fill;
				var lblConfigId=lbConfig.id;
				
				
				var fillColor = this.defaultDistractorColor;
				var radioChecked = "F";
				var correct_ans = "F";
				var disLbl = "T";
				var ans="F";
				
				/* set as 1st label as selected at 1st time creation */
				if (labelCount == 0 &&  itaration == 0) {
					fillColor = lblConfigFill;
					radioChecked = "T";
					correct_ans = "T";
					disLbl = "F";
					ans="T";
				}
				
				if (labelCount > 0 && lblConfigFill === "transparent") {
					fillColor = lblConfigFill;
				}
				isDraggable=true;
				/**************for undo redo operation*****************/
				if(labelData){
					if (labelData.lockStatus)isDraggable = false;
					if(labelData.holder_x)holder_x=labelData.holder_x;
					if(labelData.holder_y)holder_y=labelData.holder_y;
					if(labelData.correct_ans)correct_ans=labelData.correct_ans;
					if(labelData.transparent && labelData.transparent=="T"){
						fillColor="transparent";
					}
					if(labelData.labelGroupId){
						var itaration=labelData.labelGroupId.split("_")[1];
						lblConfigId= 'lbl_' +itaration;
						if(correct_ans=="T"){
							fillColor = this.defaultLabelFillColor;
							radioChecked = "T";
							correct_ans = "T";
							disLbl = "F";
							ans="T";

						}
					}
				}
				
				/**************End undo redo operation*****************/
				var lblGrpOptions = {
					draggable : true,
					x : holder_x,
					y : holder_y
				};
				var labelGroup = this.cs.createGroup('label_' + itaration, lblGrpOptions);
				var textBoxGroup = this.cs.createGroup('txtGrp_' + itaration, {
					'x' : 10,
					'y' : (lblConfigHeight - textboxBuffer) / 2
				});
			
				

				var labelOption = {
					type : "Rect",
					kinteticOpt : {
						width : lblConfigWidth,
						height : lblConfigHeight,
						fill : fillColor,
						opacity : 1,
						id : lblConfigId,
						dragable : true
					}
				}
				var textRectOption = {
					type : "TextRect",
					kinteticOpt : {
						width : parseInt(lblConfigWidth - textboxBuffer),
						height : 15,
						fill : '#ffffff',
						opacity : 1,
						id : 'txtBox_' + itaration
					}
				}

				var addTextObjectOption = {
					type : "Text",
					kinteticOpt : {
						text : COIView.defaultAddLabelText,
						fontSize : lfontSize,
						y:2,
						fontFamily : COIView.defaultTextFontFamily,
						fill : '#555',
						width : lblConfigWidth - textboxBuffer,
						height : 'auto',
						opacity : '1',
						id : 'addTxt_' + itaration,
						name : 'nametxt',
						align : 'center',
						verticalAlign : 'middle'
					}
				}
				var label = COIView.createKineticObject(labelOption);
				var textBox = COIView.createKineticObject(textRectOption);
				var addTextObj = COIView.createKineticObject(addTextObjectOption);
							
				labelGroup.add(label);
				textBoxGroup.add(textBox);
				textBoxGroup.add(addTextObj);
				labelGroup.add(textBoxGroup);
				cdLayer.add(labelGroup);
				var labelValue="";
				textBoxGroup.moveToTop();
				textBoxGroup.setY((label.getHeight() - textboxBuffer) / 2);
				var allOptions = {
					labelGroup : labelGroup,
					width : lblConfigWidth,
					height : lblConfigHeight,
					radioChecked : radioChecked,
					isDraggable : isDraggable,
					ans:ans
				}
				
				
				if (isSingleSelection) {

					COIView.callAllMethodForLabelCreate(allOptions, true);
				} else {

					COIView.callAllMethodForLabelCreate(allOptions, false);
				}
				
				if(isDraggable)var lockStatus=false;
				else lockStatus=true;
				var setoutputDataParam = {
					holder_x : holder_x,
					holder_y : holder_y,
					labelGroupId : labelGroup.attrs.id,
					lockStatus : lockStatus,
					name : labelGroup.attrs.id,
					index : i,
					SLELD : lblConfigWidth + ',' + lblConfigHeight,
					correct_ans : correct_ans,
					labelGroup : labelGroup,
					labelVal:labelValue,
					

				}
				
				window.CD.module.data.setLabelOutputData(setoutputDataParam);
				
				if(labelData){
					if (labelData.label_value) {
						/* checking sb and sp tag in a text */
						var textValue = labelData.label_value;
						var commonTextTool= new TextTool.commonLabelText();
						
						var textFormat = new TextFormat();
						if(commonTextTool.checkSubOrSuperTagExist(textValue)){
							//textValue=commonTextTool.convertSbSpscript(textValue);	
						}
					 
						
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
						
						if(labelData.textFormat.underline_value == "T"){
							var textObj = textBoxGroup;
							if(textObj){
								$("#UnderlinetTool").data('clicked', true);
							}
						}
						
						var count = textBoxGroup.children.length-1;
						var lastChild = commonTextTool.findLastTextchild(textBoxGroup,count);
						var textGrpHeight = textBoxGroup.children[lastChild].getY() + textBoxGroup.children[lastChild].getHeight();
						var topPadding = (textBoxGroup.parent.children[0].getHeight()-textGrpHeight)/2;
						if(topPadding < 0)
							topPadding = 0;
						textBoxGroup.setY(topPadding);		
						
					}//end label value checking
					
					/**************for undo redo operation*****************/
					if(textBoxGroup){
						textBox.setFill("transparent");
						addTextObj.hide();
						labelValue = labelData.label_value;
					}
				}
				
				
				
				/*******************end undo redo functionality**********************/
							
				cdLayer.draw();
				COIView.attachEventforLabel(labelGroup, addTextObj);
				
				
				
				/*********************undo redo***************************/
				if (labelData){
					if(labelData.hint_value != "" || labelData.feedback_value != "") {
						COIView.attachHintFeedbackEvent(labelGroup);
					}
					/* image and media insert */
					if (labelData.image_data != "N") {
						var imageGrpId = 'img_' + labelGroup.attrs.id;
						var iscallfromUdnoRedoDeleteLabel=true;
						loadImageforLabel(labelGroup, imageGrpId, labelData.image_data, iscallfromUdnoRedoDeleteLabel);
					}
					if(labelData.media_value != "N" && labelData.media_value){
						var audioGrpId = 'audio_' + labelGroup.attrs.id;
						var x = (labelData.media_label_XY).split('|')[0];
						var y = (labelData.media_label_XY).split('|')[1];
						loadAudioImage(labelGroup,audioGrpId,labelData.media_value ,x,y);			
					}
					
					/* add info text in label */
					if (labelData.infoHideText === "T") {
						textBoxGroup.hide();

					}
				}
				ds.setOutputData();
				/*************************ends here************************/
				
				
				

			}
			/*if this method not get call from undo redo then register below undo redo*/
			if(!labelData){
				var active = {};
				active.element = labelGroup;
				undoMng.register(this, COIView.deleteAllLabels,[labelGroupStartId,totalLabelToCreate] , 'Undo create all Label',this, COIView.createLabel,[totalLabelToCreate,isSingleSelection] , 'Redo create all Label');
				updateUndoRedoState(undoMng);
			}

		} catch (err) {
			console
					.error("@COIView::createLabel::Error while creating COI Label::"
							+ err.message);
		}
		
	},
	
	/**
	 * description::
	 * This method is used for undo creation of all labels
	 * All labels will be deleted together on undo
	 * Called from createLabelObject() 
	 */
	deleteAllLabels : function(labelStartId,totalLabelToCreate){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var labelData  = window.CD.module.data.Json.COIData;
		var ds = window.CD.services.ds;
		var outputJson = window.CD.module.data.Json;
		var undoMng = window.CD.undoManager;
		var counter = labelStartId;
		var finalCounter = counter+parseInt(totalLabelToCreate);
		var oldObject = {};
		cs.setActiveElement(cs.findGroup('frame_0'),'frame');
		for(var count = counter;count < parseInt(finalCounter);count++){
			var newLabelGrpId = 'label_'+count;
			var newIndex = COIData.getLabelIndex(newLabelGrpId);
			var labelGroup = cs.findGroup(newLabelGrpId);
			cs.deleteSubGroups(labelGroup);
			labelGroup.remove();
			oldObject[newIndex]={'labelData' : outputJson.COIData[newIndex]};
		}
		
		for(var cnt = counter;cnt < parseInt(finalCounter);cnt++){
			var newIndx = 'COI'+cnt;
			delete outputJson.COIData[newIndx];
		}
		
		COIData.reIndexLabels();
		
		cdLayer.draw();
		cs.resetToolbar();
		ds.setOutputData();	
	},

	/**
	 * function name: getCOIdataCout() author:Piyali Saha
	 */
	getCOIdataCout : function() {
		console.log("@COIView::getCOIdataCout");
		try {
			var COIdataCount = this.cs
					.objLength(window.CD.module.data.Json.COIData);
			return COIdataCount;

		} catch (err) {
			console.error("@COIView::Error on getCOIdataCout::" + err.message);
		}
	},
	/**
	 * function name: createKineticObject() author:Piyali Saha
	 */
	createKineticObject : function(options) {
		console.log("@COIView::createKineticObject");
		try {
			var kineticOPT = options.kinteticOpt;
			var lfontSize = parseInt(window.CD.module.data.Json.adminData.GFS);
			if (options.type === "Rect" || options.type === "TextRect") {
				if (options.type !== "TextRect") {
					var defaultLabelOPT = {
						fontSize : lfontSize,
						strokeWidth : this.defaultTextFontFamily,
						cornerRadius : this.defaultLabelCornerRadius,
						Stroke : this.defaultLabelStrokeCLR
					}
					kineticOPT = $.extend(defaultLabelOPT, kineticOPT);
				}
				var kineticObject = new Kinetic.Rect(kineticOPT);

			} else if (options.type === "Text") {
				var kineticObject = new Kinetic.Text(kineticOPT);
			}
			// console.log(kineticObject);
			return kineticObject
		} catch (err) {
			console.error("@COIView::Error on createKineticObject::"
					+ err.message);
		}
	},

	/**
	 * function name: getDataIndex() author:Piyali Saha
	 */
	getDataIndex : function(labelGroupId) {
		console.log("@COIView::getDataIndex");
		try {
			var outputJson = window.CD.module.data.Json;
			for (key in outputJson.COIData) {
				if (outputJson.COIData[key].labelGroupId == labelGroupId)
					return key;
			}
		} catch (err) {
			console.error("@COIView::Error on getDataIndex::" + err.message);
		}
	},
	/**
	 * function name: getDataIndex() author:Piyali Saha
	 */
	getObjectCount : function() {
		console.log("@COIView::getObjectCount");
		try {
			return this.cs.objLength(window.CD.module.data.Json.COIData);
		} catch (err) {
			console.error("@COIView::Error on getObjectCount::" + err.message);
		}
	},

	/**
	 * function name: getObjectFromLabelGroup() author:Piyali Saha
	 */
	getObjectFromLabelGroup : function(objectType, objectdata) {
		console.log("@COIView.getObjectFromLabelGroup");
		try {
			var returnObject = "";
			$.each(objectdata.children, function(kk, valls) {
				if (valls.attrs.id) {
					if (objectType == "label"
							&& valls.attrs.id.match(/lbl_[0-9]+/)) {
						returnObject = valls;
					}
				}
			})

			return returnObject;
		} catch (err) {
			console.error("@COIView::Error on getObjectFromLabelGroup::"
					+ err.message);
		}
	},

	/**
	 * function name: highLightActiveLabel() author:Piyali Saha
	 */
	highLightActiveLabel : function(activeElm) {
		console.log("@COIView.highLightActiveLabel");
		try {
			var labelObj = this.getObjectFromLabelGroup("label", activeElm);
			var cdLayer = window.CD.services.cs.getLayer();
			labelObj.setStrokeWidth(2);
			labelObj.setStroke(this.defaultLabelHigLightColor);
			cdLayer.draw();
		} catch (err) {
			console.error("@COIView::Error on highLightActiveLabel::"
					+ err.message);
		}
	},
	/**
	 * function name: removeHighLightActiveLabel() author:Piyali Saha
	 */
	removeHighLightActiveLabel : function(activeElm) {
		console.log("@COIView.removeHighLightActiveLabel");
		try {
			if(activeElm && activeElm.children.length>0){
				var cs = window.CD.services.cs;
				var cdLayer = cs.getLayer();
				var parentNode = activeElm.parent;
				var foundObj = cs.findObject(parentNode,activeElm.attrs.id);
				if(foundObj.children.length>0){
				//if (cs.groupExists(activeElm.attrs.id)) {

					if (activeElm && activeElm.attrs.id.match(/^label_[0-9]+/)) {
						var labelObj = this.getObjectFromLabelGroup("label",
								activeElm);
						var cdLayer = window.CD.services.cs.getLayer();
						var datIndex = this.getDataIndex(activeElm.attrs.id);
						var transparentBorder = window.CD.module.data
						.getEachLabelOutputData(datIndex,
								"transparent_border");
						if (transparentBorder == "F") {
							labelObj.setStrokeWidth(this.defaultLabelStrokeWdth);
							labelObj.setStroke(this.defaultLabelStrokeCLR);
						} else {
							labelObj.setStroke('transparent');
						}

					} else if (activeElm
							&& activeElm.attrs.id.match(/^img_label_[0-9]+/)) {
						activeElm.children[0]
						                   .setStrokeWidth(this.defaultLabelStrokeWdth);
						activeElm.children[0].setStroke(this.defaultLabelStrokeCLR);
					} else if (activeElm
							&& activeElm.attrs.id.match(/^audio_label_[0-9]+/)) {
						activeElm.children[0].setStrokeWidth(0);
						activeElm.children[0].setStroke('transparent');
					}else if(activeElm && activeElm.attrs.id.match(/^audio_frame_[0-9]+/)) {			
						activeElm.children[0].setStrokeWidth(0);		
						activeElm.children[0].setStroke('transparent');	
					}else if(activeElm && activeElm.attrs.id.match(/^audio_[0-9]+/)) {
						activeElm.children[0].setStrokeWidth(0);		
						activeElm.children[0].setStroke('transparent');
					}
					cdLayer.draw();
				}
			}
		} catch (err) {
			console.error("@COIView::Error on removeHighLightActiveLabel::"
					+ err.message);
		}
	},

	/**
	 * function name: makeActive() author:Piyali Saha
	 */
	makeActive : function(oldActiveElm, newActiveElm) {
		console.log("@COIView.makeActive");
		try {
			var inactiveDiv = $('#deleteElement_inactive');
			if (newActiveElm && newActiveElm.attrs.id == 'frame_0') {
				$("#deleteElement").removeClass('active').addClass(
						'inactive_del');
				$('#deleteElement').append(inactiveDiv);
			} else {
				$("#deleteElement").removeClass('inactive_del').addClass(
						'active');
			}
			this.resetLocGlobalproperties();
			if (newActiveElm && newActiveElm.attrs.id.match(/^label_[0-9]+/)) {
				this.highLightActiveLabel(newActiveElm);
				/* check hide text check box */
				var coiIndex = this.getDataIndex(newActiveElm.attrs.id);
				this
						.setLocGlobalproperties(window.CD.module.data.Json.COIData[coiIndex]);

			} else if (newActiveElm
					&& newActiveElm.attrs.id.match(/^img_label_[0-9]+/)) {
				newActiveElm.children[0].setStrokeWidth(2);
				newActiveElm.children[0]
						.setStroke(this.defaultLabelHigLightColor);
			} else if (newActiveElm
					&& newActiveElm.attrs.id.match(/^audio_label_[0-9]+/)) {
				newActiveElm.children[0].setStrokeWidth(2);
				newActiveElm.children[0]
						.setStroke(this.defaultLabelHigLightColor);
			} else if(newActiveElm && newActiveElm.attrs.id.match(/^audio_frame_[0-9]+/)) {					
				newActiveElm.children[0].setStrokeWidth(2);
				newActiveElm.children[0].setStroke('#1086D9');
			}else if(newActiveElm && newActiveElm.attrs.id.match(/^audio_[0-9]+/)) {				
				newActiveElm.children[0].setStrokeWidth(2);
				newActiveElm.children[0].setStroke('#1086D9');
			}else if ($('#localDivInactive').length == 0
					&& ($('#localDiv').width() != 0 || $('#localDiv').height() != 0)) {
				COIView.makeLabelLocalDisable();
			}
			
			var oldElementConditon = (oldActiveElm
					&& (oldActiveElm.attrs.id.match(/^label_[0-9]+/)
							|| oldActiveElm.attrs.id.match(/^audio_frame_[0-9]+/)
							|| oldActiveElm.attrs.id.match(/^audio_[0-9]+/)
							|| oldActiveElm.attrs.id.match(/^img_label_[0-9]+/) || oldActiveElm.attrs.id
							.match(/^audio_label_[0-9]+/)) /*&& oldActiveElm.attrs.id !== newActiveElm.attrs.id*/

			);

			if (oldElementConditon) {
				if(COIView.getDataIndex(oldActiveElm.attrs.id))
				this.removeHighLightActiveLabel(oldActiveElm);

			}
		} catch (err) {
			console.error("@COIView::Error on makeActive::" + err.message);
		}

	},
	/**
	 * function name: getCurrentSelectedLabel4SS() description:get current selected
	 * label group in single selection. author:Piyali Saha
	 */
	getSelectedLabel: function() {

		console.log("@COIView.checkUncheckRadio");
		try {
			
			var coiJson=window.CD.module.data.Json.COIData;
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var labelGrp="";
			
			for(coi in coiJson){
				if(coiJson[coi].correct_ans==="T"){
					var labelGrId=coiJson[coi].labelGroupId;
					 labelGrp=cdLayer.get('#'+labelGrId)[0];
				}
				
			}
		return labelGrp;
			
		} catch (err) {
			console.error("@COIView::Error on checkUncheckRadio::"
					+ err.message);
		}

	},

	
	/**
	 * function name: checkUncheckRadio() description:on click on label tool
	 * this method get called. author:Piyali Saha
	 */
	checkUncheckRadio : function(group, w, h, isCheck) {

		console.log("@COIView.checkUncheckRadio");
		try {

			var cdLayer = COIView.cs.getLayer();
			var groupId = group.attrs.id;
			var checkRadioWbuffer = this.radioWbuffer;
			var checkRadioHbuffer = this.radioHbuffer;
			var iconX = parseInt(w - checkRadioWbuffer);
			var iconY = parseInt(h - checkRadioHbuffer);
			var undoMng = window.CD.undoManager;

			var uncheckRadio = new Image();
			uncheckRadio.src = window.CD.util.getImageUrl() + 'uncheck_radio.png';

			if (uncheckRadio.complete) {
				var uncheckImg = new Kinetic.Image( {
					x : iconX,
					y : iconY,
					image : uncheckRadio,
					width : 12,
					height : 13,
					name : 'uncheckRadio_' + groupId
				});

				group.add(uncheckImg);
				if (!isCheck) {
					uncheckImg.hide();
				}
				uncheckImg.on('click', function() {
					this.hide();
					this.parent.get('.checkRadio_' + this.parent.attrs.id)[0]
							.show();
					this.moveUp();
					cdLayer.draw();
					/*undo redo opertaion*/
					var selectedLblGrp=COIView.getSelectedLabel();
					if(typeof selectedLblGrp==="object"){
				      var slId=selectedLblGrp.getId();
				      var slId2=uncheckImg.parent.getId();
					undoMng.register(this, COIView.undoRedoSelection,[selectedLblGrp,slId] , 'Undo Label Selection in SS',this, COIView.undoRedoSelection,[uncheckImg.parent,slId2] , 'Redo Label Selection in SS');
					updateUndoRedoState(undoMng);
					}
					
					
					/* update remaining label as distractor */
					COIView.setDistractorSingleSelection(this.parent);
					
				});
			} else {
				uncheckRadio.onload = function() {
					var uncheckImg = new Kinetic.Image( {
						x : iconX,
						y : iconY,
						image : uncheckRadio,
						width : 12,
						height : 13,
						name : 'uncheckRadio_' + groupId
					});
					group.add(uncheckImg);
					uncheckRadio.onload = function() {
					};
					uncheckImg
							.on(
									'click',
									function() {
										this.hide();
										this.parent
												.get('.checkRadio_' + this.parent.attrs.id)[0]
												.show();
										this.moveUp();
										cdLayer.draw();
										/* update remaining label as distractor */
										COIView.setDistractorSingleSelection(this.parent);
									});
				}
			}
			var checkRadio = new Image();
			checkRadio.src = window.CD.util.getImageUrl() + 'check_radio.png';
			if (checkRadio.complete) {
				var checkImg = new Kinetic.Image( {
					x : iconX,
					y : iconY,
					image : checkRadio,
					width : 12,
					height : 13,
					name : 'checkRadio_' + groupId
				});
				group.add(checkImg);
				if (isCheck)
					checkImg.hide();
				cdLayer.draw();
				checkImg.on('click', function() {
					// this.hide();
						// this.parent.get('.uncheckRadio_' +
						// this.parent.attrs.id)[0].show();
						// this.moveUp();
						// cdLayer.draw();
						/* remove all distractor */
						// COIView.unsetDistractorSingleSelection();
					});
			} else {
				checkRadio.onload = function() {
					var checkImg = new Kinetic.Image( {
						x : iconX,
						y : iconY,
						image : checkRadio,
						width : 12,
						height : 13,
						name : 'checkRadio_' + groupId
					});
					group.add(checkImg);
					if (isCheck)
						checkImg.hide();
					cdLayer.draw();
					checkRadio.onload = function() {
					};
					checkImg.on('click', function() {
						// this.hide();
							// this.parent.get('.uncheckRadio_' +
							// this.parent.attrs.id)[0].show();
							// this.moveUp();
							// cdLayer.draw();
							/* remove all distractor */
							// COIView.unsetDistractorSingleSelection();
						});
				}
			}

		} catch (err) {
			console.error("@COIView::Error on checkUncheckRadio::"
					+ err.message);
		}

	},
	
	/**
	 * function name: checkUncheckCheckBox() description:on click on label tool
	 * this method get called. author:Piyali Saha
	 */
	undoRedoMultiSelection : function(lablGrp,lblId,action,type) {

		console.log("@COIView.undoRedoMultiSelection");
		try {
			var cdLayer = window.CD.services.cs.getLayer();
			var lablGrp=COIView.checkAndGetLBLGroup(lablGrp,lblId);
		
			if(lablGrp && lablGrp.children.length!=0){
				if(type=="check"){
					if(action=="redo"){
						var ChkCheckBox=lablGrp.get('.checkCheckBox_'+ lablGrp.attrs.id)[0];
						if(ChkCheckBox)ChkCheckBox.fire('click');
						else console.log("@undoRedoMultiSelection:ChkCheckBox is empty");
						
					}else if(action=="undo"){
						var unChkCheckBox=lablGrp.get('.uncheckCheckBox_'+ lablGrp.attrs.id)[0];
						if(unChkCheckBox)unChkCheckBox.fire('click');
						else console.log("@undoRedoMultiSelection:unChkCheckBox is empty");
					}
				}else if(type=="uncheck"){
					if(action=="undo"){
						var ChkCheckBox=lablGrp.get('.checkCheckBox_'+ lablGrp.attrs.id)[0];
						if(ChkCheckBox)ChkCheckBox.fire('click');
						else console.log("@undoRedoMultiSelection:ChkCheckBox is empty");
					}else if(action=="redo"){
						var unChkCheckBox=lablGrp.get('.uncheckCheckBox_'+ lablGrp.attrs.id)[0];
						if(unChkCheckBox)unChkCheckBox.fire('click');
						else console.log("@undoRedoMultiSelection:unChkCheckBox is empty");
					}
				}
			}
			
			
		} catch (err) {
			console.error("@COIView::Error on undoRedoMultiSelection::"
					+ err.message);
		}

	},
	
	/**
	 * function name: checkUncheckCheckBox() description:on click on label tool
	 * this method get called. author:Piyali Saha
	 */
	checkUncheckCheckBox : function(group, w, h, isCheck) {

		console.log("@COIView.checkUncheckCheckBox");
		try {

			var cdLayer = COIView.cs.getLayer();
			var groupId = group.attrs.id;
			var checkWbuffer = this.checkWbuffer;
			var checkHbuffer = this.checkHbuffer
			var iconX = parseInt(w - checkWbuffer);
			var iconY = parseInt(h - checkHbuffer);
			var undoMng = window.CD.undoManager;

			var uncheckRadio = new Image();
			uncheckRadio.src = window.CD.util.getImageUrl() + 'checkbox_unchecked.png';

			if (uncheckRadio.complete) {
				var uncheckImg = new Kinetic.Image( {
					x : iconX,
					y : iconY,
					image : uncheckRadio,
					width : 13,
					height : 15,
					name : 'uncheckCheckBox_' + groupId
				});

				group.add(uncheckImg);
				if (!isCheck) {
					uncheckImg.hide();
				}
				uncheckImg.on('click',
								function() {
									this.hide();
									this.parent.get('.checkCheckBox_' + this.parent.attrs.id)[0].show();
									this.moveUp();
									cdLayer.draw();
									
									var selectedLblGrp=this.parent;
									var slId=selectedLblGrp.getId();
									undoMng.register(this, COIView.undoRedoMultiSelection,[selectedLblGrp,slId,"undo","uncheck"] ,
											'Undo Label Selection in MS',this, 
											COIView.undoRedoMultiSelection,[selectedLblGrp,slId,"redo","uncheck"] ,
											'Redo Label Selection in SS');
									updateUndoRedoState(undoMng);
									
									/* update remaining label as distractor */
									COIView.setSelectedLabelMultipleSelection(this.parent);
								});
			} else {
				uncheckRadio.onload = function() {
					var uncheckImg = new Kinetic.Image( {
						x : iconX,
						y : iconY,
						image : uncheckRadio,
						width : 13,
						height : 15,
						name : 'uncheckCheckBox_' + groupId
					});
					group.add(uncheckImg);
					uncheckRadio.onload = function() {
					};
					uncheckImg
							.on(
									'click',
									function() {
										this.hide();
										this.parent
												.get('.checkCheckBox_' + this.parent.attrs.id)[0]
												.show();
										this.moveUp();
										cdLayer.draw();
										
										var selectedLblGrp=this.parent;
										var slId=selectedLblGrp.getId();
										undoMng.register(this, COIView.undoRedoMultiSelection,[selectedLblGrp,slId,"undo","uncheck"] ,
												'Undo Label Selection in MS',this, 
												COIView.undoRedoMultiSelection,[selectedLblGrp,slId,"redo","uncheck"] ,
												'Redo Label Selection in SS');
										updateUndoRedoState(undoMng);
										
										/* update remaining label as distractor */
										COIView.setSelectedLabelMultipleSelection(this.parent);
									});
				}
			}
			var checkRadio = new Image();
			checkRadio.src = window.CD.util.getImageUrl() + 'checkbox_checked.png';
			if (checkRadio.complete) {
				var checkImg = new Kinetic.Image( {
					x : iconX,
					y : iconY,
					image : checkRadio,
					width : 13,
					height : 15,
					name : 'checkCheckBox_' + groupId
				});
				group.add(checkImg);
				if (isCheck)
					checkImg.hide();
				cdLayer.draw();
				checkImg
						.on(
								'click',
								function() {
									this.hide();
									this.parent
											.get('.uncheckCheckBox_' + this.parent.attrs.id)[0]
											.show();
									this.moveUp();
									cdLayer.draw();
									
									var selectedLblGrp=this.parent;
									var slId=selectedLblGrp.getId();
									undoMng.register(this, COIView.undoRedoMultiSelection,[selectedLblGrp,slId,"undo","check"] ,
											'Undo Label Selection in MS',this, 
											COIView.undoRedoMultiSelection,[selectedLblGrp,slId,"redo","check"] ,
											'Redo Label Selection in SS');
									updateUndoRedoState(undoMng);
									
									/* remove all distractor */
									COIView.unsetSelectedLabelMultipleSelection(this.parent);
								});
			} else {
				checkRadio.onload = function() {
					var checkImg = new Kinetic.Image( {
						x : iconX,
						y : iconY,
						image : checkRadio,
						width : 13,
						height : 15,
						name : 'checkCheckBox_' + groupId
					});
					group.add(checkImg);
					if (isCheck)
						checkImg.hide();
					cdLayer.draw();
					checkRadio.onload = function() {
					};
					checkImg
							.on(
									'click',
									function() {
										this.hide();
										this.parent
												.get('.uncheckCheckBox_' + this.parent.attrs.id)[0]
												.show();
										this.moveUp();
										cdLayer.draw();
										
										var selectedLblGrp=this.parent;
										var slId=selectedLblGrp.getId();
										undoMng.register(this, COIView.undoRedoMultiSelection,[selectedLblGrp,slId,"undo","check"] ,
												'Undo Label Selection in MS',this, 
												COIView.undoRedoMultiSelection,[selectedLblGrp,slId,"redo","check"] ,
												'Redo Label Selection in SS');
										updateUndoRedoState(undoMng);
										
										/* remove all distractor */
										COIView.unsetSelectedLabelMultipleSelection(this.parent);
									});
				}
			}

		} catch (err) {
			console.error("@COIView::Error on checkUncheckCheckBox::"
					+ err.message);
		}

	},
	fixTextEntities : function(input) {
		console.log("@COIView.fixTextEntities");
		try {
			var result = (new String(input)).replace(/&(amp;)/g, "&");
			return result.replace(/&#(\d+);/g, function(match, number) {
				return String.fromCharCode(number);
			});
		} catch (err) {
			console.error("@COIView::Error on fixTextEntities::" + err.message);
		}
	},
	/**
	 * function name: createInfoTextObject() description:create info text object
	 * author:Piyali Saha
	 */
	createInfoTextObject : function(param) {
		console.log("@COIView.createInfoTextObject");
		try {
			var infoTextObjectArr = [ 'T', 'H', 'F' ];
			var infoTextX = -8;
			var slash = '';
			var hideTextValue = $('#hideTextLoc').is(':checked');
			var labelGroupId = param.labelGrpID;
			var labelGrpObj = param.labelGrpObj;
			var labelData = param.labelData;

			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			var showTVal = false, showHVal = false, showFVal = false;
			var infotObj;
			var undoMng = window.CD.undoManager;

			/* info text creation */
			var infoGroupText = this.cs.createGroup('infoText_' + labelGroupId, {
				x : 0,
				y : 0,
				draggable : false
			});
			$.each(infoTextObjectArr, function(index, value) {

				var infoTextObjOption = {
					type : "Text",
					kinteticOpt : {
						x : infoTextX + 10,
						y : 0,
						text : slash + value,
						align : 'left',
						fontSize : 10,
						fontFamily :COIView.defaultTextFontFamily,
						fill : '#555',
						opacity : '1',
						verticalAlign : 'middle',
						fontStyle : 'normal',
						id : value + '_infoText_' + labelGroupId,
						padding : 2
					}
				}
				var infoTextObj = COIView
						.createKineticObject(infoTextObjOption);
				infoTextObj.hide();

				/* bind hidtext for T infoObj */
				if (value === "T") {
					/** clicking on the "T" icon in the label, hidden text sould not be un-hiding. **/
					/*infoTextObj.on('dblclick', function() {
						var coiTextTool= new TextTool.commonLabelText();
						var undoCallStatus = 'redo';
						var redoCallStatus = 'undo';
						undoMng.register(this, coiTextTool.onClickHideLabelText,[labelGrpObj.getId(),undoCallStatus] , 'Undo Label Info text',this, coiTextTool.onClickHideLabelText,[labelGrpObj.getId(),redoCallStatus] , 'Redo Label Info text');
						updateUndoRedoState(undoMng);
						//$('#hideTextLoc').trigger('click');
						coiTextTool.onClickHideLabelText(labelGrpObj.getId(),'undo');
						infoTextObj.setFill('#1086D9');
					})*/					
				}

				// for showing infoTextT while rendering label
					if (param.showLabel) {

						if (param.infoHideText === "T" && value === "T") {
							showTVal = true;
							infotObj = infoTextObj;
							infoTextObj.show();
							$('#hideTextLoc').prop('checked', true);
						}
						if (param.infoHintText !== '' && value === "H") {
							showHVal = true;
							infoTextObj.show();
							$("#textareaHint").val(param.infoHintText);
						}
						if (param.infoFeedbackText !== "" && value === "F") {
							showFVal = true;
							infoTextObj.show();
							$("#textareaHint").val(param.infoFeedbackText);

							/* adjust position for T and F */
							if (showTVal && !showHVal) {
								var infoTX = infotObj.getX();
								infoTextObj.setX(infoTX + 10);
							}
						}
					} else {
						$('#hideTextLoc').prop('checked', false);
						$("#textareaHint").val('');
						$("#textareaHint").val('');
					}
					infoTextX = infoTextX + parseInt(infoTextObj.getWidth());
					infoGroupText.add(infoTextObj);

				})

			/* add info text objects */
			labelGrpObj.add(infoGroupText);
			if (!param.showLabel) {
				labelData.infoHideText = 'F'
			}
			cdLayer.draw();
			ds.setOutputData();
		} catch (err) {
			console.error("@COIView::Error on createInfoTextObject::"
					+ err.message);
		}
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
	 * function name: onClickHideLabelText() description:on click on hide text
	 * check box this method get called. author:Piyali Saha
	 */
	onClickHideLabelText : function() {

		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		var cdLayer = cs.getLayer();
		var infoTextTObj;
		var txtGrp;
		var imgGrp;
		var forCOIImageBuffer = 30
		if (activeType === 'label') {
			/* fetch label group details */
			var coi = this.getDataIndex(activeElm.attrs.id);
			var lblGroup = cs.findGroup(activeElm.attrs.id);

			/* for image adjust calculation in a label */
			var label = lblGroup.children[0];
			var oldData = {
				'height' : label.getHeight(),
				'width' : label.getWidth()
			};
			var calcY = label.getHeight() - forCOIImageBuffer;

			/* fetch all info text objects */
			var labelGroupId = window.CD.module.data.Json.COIData[coi].labelGroupId;
			$.each(lblGroup.children, function(index, value) {
				if (value.nodeType === "Group"
						&& value.attrs.id.match(/infoText_label_[0-9]+/)) {
					/* fetching T F H infotext object */
					$.each(value.children, function(i, v) {
						if (v.attrs.id.match(/T_infoText_label_[0-9]+/)) {
							infoTextTObj = v;
							infoText = infoTextTObj.parent;
						}
						if (v.attrs.id.match(/H_infoText_label_[0-9]+/)) {
							infoTextHObj = v;
						}
						if (v.attrs.id.match(/F_infoText_label_[0-9]+/)) {
							infoTextFObj = v;
						}
					});

				} else if (value.nodeType === "Group"
						&& value.attrs.id.match(/txtGrp_[0-9]+/)) {
					txtGrp = value;
				} else if (value.nodeType === "Group"
						&& value.attrs.id.match(/img_label_[0-9]+/)) {
					imgGrp = value;
				}

			});

			var infoTvisible = infoTextTObj.getVisible();
			var infoHvisible = infoTextHObj.getVisible();
			var infoFvisible = infoTextFObj.getVisible();

			if (imgGrp)
				var imageObj = imgGrp.children[0];
			if ($('#hideTextLoc').is(':checked')) {
				infoTextTObj.show();
				var textH = txtGrp.children[0].getHeight();
				if (!$('#showHiddenTxtGlobal').is(':checked')) {
					txtGrp.hide();
				}
				if (imgGrp && imgGrp.attrs.id.match(/img_label_[0-9]+/)) {
					this.updateLabelContent(lblGroup, oldData, calcY, textH);

					if (txtGrp.get('#lbltxt_' + txtGrp.attrs.id.split('_')[1])[0])
						txtGrp.setY(((label.getHeight()) / 2)
								- (((txtGrp.get('#lbltxt_' + txtGrp.attrs.id
										.split('_')[1])[0]).getHeight()) / 2));
					else
						txtGrp.setY(((label.getHeight()) / 2)
								- (((txtGrp.get('#addTxt_' + txtGrp.attrs.id
										.split('_')[1])[0]).getHeight()) / 2));
					// txtGrp.setX(((label.getWidth())/2)-((txtGrp.children[2].getTextWidth())/2));
				}
				/* adjust position for T and F */
				if (!infoHvisible && infoFvisible) {
					var infoTX = infoTextTObj.getX();
					infoTextFObj.setX(infoTX + 10);
				}

				window.CD.module.data.Json.COIData[coi].infoHideText = 'T';
			} else {
				infoTextTObj.hide();
				txtGrp.show();
				this.updateLabelContent(lblGroup, oldData, calcY);
				
				window.CD.module.data.Json.COIData[coi].infoHideText = 'F'
			}
			var undoMng = window.CD.undoManager;
			undoMng.register(this, COIView.undoHideText,[lblGroup.getId()] , 'Undo Label Info text',this, COIView.undoHideText,[lblGroup.getId()] , 'Redo Label Info text');
			updateUndoRedoState(undoMng);
			
			cdLayer.draw();
			ds.setOutputData();

			// ends here
		}
	},
	/**
	 * function name: onClickShowHiddenTxtGlobal() author:Piyali Saha
	 */
	onClickShowHiddenTxtGlobal : function(status) {
		var coiTextTool= new TextTool.commonLabelText();
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		var cdLayer = cs.getLayer();
		var infoTextTObj;
		var infoText;
		var txtGrp;
		var imgGrp;
		var outputJSon = window.CD.module.data.Json.COIData;
		var updateJSon = window.CD.module.data.Json;
		var previousState = 'unchecked';
		var presentState = 'unchecked';
		var undoMng = window.CD.undoManager;
		var imageBuffer = 30;
		for ( var coi in outputJSon) {
			var labelGroupID = window.CD.module.data.Json.COIData[coi].labelGroupId;
			var lblGroup = cs.findGroup(labelGroupID);
			var label = lblGroup.children[0];
			var oldData = {
				'height' : label.getHeight(),
				'width' : label.getWidth()
			};
			var calcY = label.getHeight() - imageBuffer;
			$.each(lblGroup.children, function(index, value) {
				if (value.nodeType === "Group"
						&& value.attrs.id.match(/infoText_label_[0-9]+/)) {
					/* fetching T F H infotext object */
					// infoText = value;
					$.each(value.children, function(i, v) {
						if (v.attrs.id.match(/T_infoText_label_[0-9]+/)) {
							infoTextTObj = v;
							infoText = infoTextTObj.parent;

						}
					});

				} else if (value.nodeType === "Group"
						&& value.attrs.id.match(/txtGrp_[0-9]+/)) {
					txtGrp = value;
				} else if (value.nodeType === "Group"
						&& value.attrs.id.match(/img_label_[0-9]+/)) {
					imgGrp = value;
				}

			});

			var infoTvisible = infoTextTObj.getVisible();
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
			if (outputJSon[coi].infoHideText == 'T') {
				if($('#showHiddenTxtGlobal').is(':checked')){
					txtGrp.show();
					this.updateLabelContent(lblGroup, oldData, calcY, infoTextTObj
							.getHeight());
					if (imgGrp) {
						if (window.CD.module.data.textGroupComponent.length > 0){
							var count = txtGrp.children.length-1;
							var lastChild = coiTextTool.findLastTextchild(txtGrp,count);
							var textGrpHeight = txtGrp.children[lastChild].getY() + txtGrp.children[lastChild].getHeight();
							var topPadding = ((label.getHeight()) / 2)- ((textGrpHeight) / 2);
							if(topPadding < 0)
								topPadding = 0;
							txtGrp.setY(topPadding);
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
					txtGrp.hide();
					var coiTextTool= new TextTool.commonLabelText();
					coiTextTool.finalAdjustmentLabelContent(activeElm);
					previousState = 'checked';
				}
			} else {
				txtGrp.show();
				if (infoTvisible) {
					infoTextTObj.hide();
				}else{
					//this.updateLabelContent(lblGroup, oldData, calcY, infoTextTObj.getHeight());
					
				}
				/*var coiTextTool= new TextTool.commonLabelText();
				coiTextTool.finalAdjustmentLabelContent(lblGroup);*/
			}
			
			cdLayer.draw();
		}
		/* Don't register during undo redo execution */
		if(!status){
			undoMng.register(this, COIView.onClickShowHiddenTxtGlobal,[previousState] , 'Undo show hide text in authoring',this, COIView.onClickShowHiddenTxtGlobal,[presentState], 'Redo show hide text in authoring');
		}
	},
	/**
	 * function name: resetLocGlobalproperties() author:Piyali Saha
	 */
	resetLocGlobalproperties : function() {
		console.log("@COIView.resetLocGlobalproperties");
		try {
			$('#hideTextLoc').prop('checked', false);
			//$("#showHiddenTxtGlobal").prop('checked', false);
			$("#textareaHint").val('');
			$("#textareaFeedback").val('');
			/* make global apply active */
			$("#globalApply").addClass('inactive');
			/* remove inactive div from local */
			$('#localDivInactive').remove();
		} catch (err) {
			console.error("@COIView::Error on resetLocGlobalproperties::"
					+ err.message);
		}

	},
	/**
	 * function name: setLocGlobalproperties() author:Piyali Saha
	 */
	setLocGlobalproperties : function(jsonObj) {
		console.log("@COIView.setLocGlobalproperties");
		try {
			if(jsonObj){
				var infoTtext = jsonObj.infoHideText;
				var infoHintText = jsonObj.hint_value;
				var infoFeedbackText = jsonObj.feedback_value
				if (infoTtext === "T") {
					$('#hideTextLoc').prop('checked', true);
				} else {
					$('#hideTextLoc').prop('checked', false);
				}
				if (infoHintText !== "") {
					$("#textareaHint").val(infoHintText);
				} else {
					$("#textareaHint").val('');
				}
	
				if (infoFeedbackText !== "") {
					$("#textareaFeedback").val(infoFeedbackText);
				} else {
					$("#textareaFeedback").val('');
				}
				/* make global apply active */
				$("#globalApply").removeClass('inactive');
	
				/* fill and border property */
				if (jsonObj.transparent == "T") {
					$("#labelFillGlob").prop('checked', false);
				} else {
					$("#labelFillGlob").prop('checked', true);
				}
	
				if (jsonObj.transparent_border == "T") {
					$("#labelBorderGlob").prop('checked', false);
				} else {
					$("#labelBorderGlob").prop('checked', true);
				}
				var adminData = window.CD.module.data.Json.adminData;
				var width = parseInt(adminData.SLELD.split(',')[0]);
				var height = parseInt(adminData.SLELD.split(',')[1]);
				$("#globalDiv #labelWidth").val(width);
				$("#globalDiv #labelHeight").val(height);
				$("#localDiv #localLabelWidth").html(width + "px");
				$("#localDiv #localLabelHeight").html(height + "px");
				
				if(adminData.showHintOrFeedbackInAuthoring == 'none'){
					$('input[name=hintFeedback][value=none]').prop('checked',true);
				}else if(adminData.showHintOrFeedbackInAuthoring == 'hint'){
						$('input[name=hintFeedback][value=hint]').prop('checked',true);
				}else{
					if(adminData.showHintOrFeedbackInAuthoring == 'feedback'){
						$('input[name=hintFeedback][value=feedback]').prop('checked',true);
					}
				}
			}

		} catch (err) {
			console.error("@COIView::Error on setLocGlobalproperties::"
					+ err.message);
		}
	},
	/**
	 * function name: onTypeingHintAndFeedback() author:Piyali Saha
	 */
	onTypeingHintAndFeedback : function(textAreaObjVal,type) {
		console.log("@COIView.onTypeingHintAndFeedback");
		try {

			var activeElm = window.CD.elements.active.element[0];
			var activeType = window.CD.elements.active.type;
			var cdLayer = this.cs.getLayer(), infoTextTObj, infoTextHObj, infoTextFObj;
			if (activeType === 'label') {
				/* fetch label group details */
				var coiIndex = this.getDataIndex(activeElm.attrs.id);
				var lblGroup = activeElm;
				/* fetch all info text objects */
				var labelGroupId = activeElm.attrs.id;

				$.each(lblGroup.children, function(index, value) {
					if (value.nodeType === "Group"
							&& value.attrs.id.match(/infoText_label_[0-9]+/)) {
						/* fetching T,H,F infotext object */
						$.each(value.children, function(i, v) {
							if (v.attrs.id.match(/T_infoText_label_[0-9]+/)) {
								infoTextTObj = v;

							}
							if (v.attrs.id.match(/H_infoText_label_[0-9]+/)) {
								infoTextHObj = v;
							}
							if (v.attrs.id.match(/F_infoText_label_[0-9]+/)) {
								infoTextFObj = v;
							}
						});

					}

				});
				var infoTvisible = infoTextTObj.getVisible();
				var infoHvisible = infoTextHObj.getVisible();
				var infoFvisible = infoTextFObj.getVisible();
				/* for hint type */
				if (type === "textareaHint") {
					var hintValue = textAreaObjVal;
					if (hintValue != null && hintValue != "") {
						infoTextHObj.show();
						var changefieldArr = {
							infoHintText : 'T'
						};
						window.CD.module.data.setEachLabelOutputData(coiIndex,
								changefieldArr);
						/* adjust position for T and F */
						if (infoFvisible) {
							var infoHX = infoTextHObj.getX();
							infoTextFObj.setX(infoHX + 10);
						}
						if (lblGroup) {
							/* attach all event */
							lblGroup.on('mouseover touchstart', function(evt) {
								evt.cancelBubble = true;
								COIView.displayHideHintFeedback(this, false);

							});

							lblGroup.on(
									'mouseout touchend',
									function(evt) {
										// evt.cancelBubble = true;
										COIView.displayHideHintFeedback(this,
												true);

									});

						}

					} else {
						infoTextHObj.hide();
						var changefieldArr = {
							infoHintText : 'F'
						};
						window.CD.module.data.setEachLabelOutputData(coiIndex,
								changefieldArr);
						/* adjust position for T and F */
						if (infoTvisible && infoFvisible) {
							var infoTX = infoTextTObj.getX();
							infoTextFObj.setX(infoTX + 10);
						}
					}

				}
				/* for feedback type */
				if (type === "textareaFeedback") {
					var feedbackValue = textAreaObjVal;
					if (feedbackValue != null && feedbackValue != "") {
						infoTextFObj.show();
						var changefieldArr = {
							infoFText : 'T'
						};
						window.CD.module.data.setEachLabelOutputData(coiIndex,
								changefieldArr);
						/* adjust position for T and F */
						if (infoHvisible) {
							var infoHX = infoTextHObj.getX();
							infoTextFObj.setX(infoHX + 10);
						}
						if (!infoHvisible && infoTvisible) {
							var infoTX = infoTextTObj.getX();
							infoTextFObj.setX(infoTX + 10);
						}

						if (lblGroup) {
							/* attach all event */

							/*
							 * lblGroup.on('mouseover touchstart', function(evt) {
							 * evt.cancelBubble = true;
							 * COIView.displayHideHintFeedback(this,false); });
							 * 
							 * lblGroup.on('mouseout touchend', function(evt) {
							 * //evt.cancelBubble = true;
							 * COIView.displayHideHintFeedback(this,true); });
							 */
							COIView.attachHintFeedbackEvent(lblGroup);

						}

					} else {
						infoTextFObj.hide();
						var changefieldArr = {
							infoFText : 'F'
						};
						window.CD.module.data.setEachLabelOutputData(coiIndex,
								changefieldArr);

					}

				}
				cdLayer.draw();
			}
		} catch (err) {
			console.error("@COIView::Error on onTypeingHintAndFeedback::"
					+ err.message);
		}
	},

	/**
	 * function name: attachHintFeedbackEvent() author:Piyali Saha
	 */
	attachHintFeedbackEvent : function(lblGroup) {
		// console.log("@COIView.attachHintFeedbackEvent");
		try {

			/* attach all event */

			lblGroup.on('mouseover touchstart', function(evt) {
				evt.cancelBubble = true;
				COIView.displayHideHintFeedback(this, false);
			});

			lblGroup.on('mouseout touchend', function(evt) {
				// evt.cancelBubble = true;
					COIView.displayHideHintFeedback(this, true);
				});

		} catch (err) {
			console.error("@COIView::Error on attachHintFeedbackEvent::"
					+ err.message);
		}
	},

	/*
	 * this method is used to update data for hint and feedback textarea on focus
	 * out It is being called from stage.js By Nabonita Bhattacharyya on 07th
	 * May, 2013
	 */
	updateHintFeedbackVal : function(hintValue, feedbackValue) {
		console.log("@COIView.updateHintFeedbackVal");
		try {

			var activeElm = window.CD.elements.active.element[0];
			var activeType = window.CD.elements.active.type;
			if (activeType === 'label') {
				/* fetch label group details */
				var coiIndex = this.getDataIndex(activeElm.attrs.id);
				var lblGroup = this.cs.findGroup(activeElm.attrs.id);
				/* fetch all info text objects */
				var labelGroupId = window.CD.module.data.Json.COIData[coiIndex].labelGroupId;
				var changelabelData = {
					hint_value : '',
					feedback_value : ''
				};
				if (hintValue != null && hintValue != "") {
					changelabelData['hint_value'] = hintValue;
				} else {
					changelabelData['hint_value'] = '';
				}
				if (feedbackValue != null && feedbackValue != "") {
					changelabelData['feedback_value'] = feedbackValue;
				} else {
					changelabelData['feedback_value'] = '';
				}
				window.CD.module.data.setEachLabelOutputData(coiIndex,
						changelabelData);
			}
		} catch (err) {
			console.error("@COIView::Error on updateHintFeedbackVal::"
					+ err.message);
		}

	},
	/*
	 * For selectiing binding method for either hint or feedback for hint, call
	 * bindHintEvent() for feedback bindFeedbackEvent()
	 */
	bindFeedbackHintEvent : function(hintOrFeedback, labelOrDock,
			labelOrDockFdbk) {
		/*
		 * if(hintOrFeedback=='hint'){ SLEView.removeHint(this);
		 * SLEView.bindHintEvent(labelOrDock); }else{ if(hintOrFeedback ==
		 * 'feedback'){ SLEView.removeHint(this);
		 * SLEView.bindFeedbackEvent(labelOrDockFdbk); } }
		 */
	},

	
	/**
	 * function name: registerUndoRedo() author:Piyali Saha
	 */
	registerUndoRedo : function(labelGrp,imageName,isCallfrmDeleteActive,prevImg) {
		console.log("@COIView.registerUndoRedo");
		try {
			var ds = window.CD.services.ds;
			if(labelGrp){
				var undoMng = window.CD.undoManager;
				var labelId=labelGrp.getId();
				var imageGrpId = 'img_' + labelId;
				if(isCallfrmDeleteActive){
					undoMng.register(this, COIView.undoredoloadImageforLabel,
							[2,labelGrp,labelId,imageGrpId,imageName,prevImg] ,
							'Undo Label image delete',this,  
							COIView.undoredoloadImageforLabel,[1,labelGrp,labelId,undefined,undefined,prevImg] , 'Redo Label image delete');
					        updateUndoRedoState(undoMng);	
				     /*fix for js error in image add*/
					  if(window.CD.module.data.Json.adminData.imageList == undefined || window.CD.module.data.Json.adminData.imageList==0){
								window.CD.module.data.Json.adminData.imageList = [];
					   }
					ds.setOutputData();	
					 
				}else if(labelGrp.get('.img')[0] && !isCallfrmDeleteActive){
							undoMng.register(this, COIView.undoredoloadImageforLabel,
							[1,labelGrp,labelId,undefined,undefined,prevImg] , 'Undo Label image add',
							this,  COIView.undoredoloadImageforLabel,
							[2,labelGrp,labelId,imageGrpId,imageName,prevImg] , 'Redo Label image add');
							 updateUndoRedoState(undoMng);	
					
				}
				
				
			}
		 } catch (err) {
				console.error("@COIView::Error on registerUndoRedo::"
					+ err.message);
			}
		},
	
	/**
	 * function name: deleteImageFromLabel() author:Piyali Saha
	 */
	deleteImageFromLabel : function(lbGroup) {
		console.log("@COIView.deleteImageFromLabel");
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
		console.log("@COIView.undoredoloadImageforLabel");
		try {
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			var lbGroup=COIView.checkAndGetLBLGroup(lbGroup,labelId);
			if(lbGroup){
				if(action==1){
					//COIView.deleteImageFromLabel(lbGroup);
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
			console.error("@COIView::Error on undoredoloadImageforLabel::"
					+ err.message);
		}
	},
	/**
	 * function name: globalApplyClickAllValidation() author:Piyali Saha
	 */
	globalApplyClickAllValidation : function(errorModal) {
		console.log("@COIView.globalApplyClickAllValidation");
		try {
			var regex = /^\s*([0-9]*\.[0-9]+|[0-9]+)\s*$/;
			var labelConfig = new LabelConfig();
			var minLabelWidth = labelConfig.minWidth;// 49;
			var minLabelHeight = labelConfig.minHeight;// 49;
			var maxLabelWidth = labelConfig.maxWidth;// 500;
			var maxLabelHeight = labelConfig.maxHeight;// 500;
			var globalLabelWidth = parseInt($("#globalDiv #labelWidth").val());
			var globalLabelHeight = parseInt($("#globalDiv #labelHeight").val());
			var errorCode = "", options = "", modalId = "errorModal", containerId = "errorContainer", cancelId = "errorCancel", overlayId = "errorOverlay", errorAlertId = "errAlertText";
			if((regex.test($.trim($('#labelWidth').val()))==false) || (regex.test($.trim($('#labelHeight').val()))==false)){
				$('#labelWidth').val(window.CD.module.data.Json.adminData.SLELD.split(',')[0]);
				$('#labelHeight').val(window.CD.module.data.Json.adminData.SLELD.split(',')[1]);
				return false;
			}
			if ($.trim(globalLabelWidth) == "" || !$.isNumeric($.trim(globalLabelWidth)))
				errorCode = '8';
			else if ($.trim(globalLabelHeight) == "" || !$.isNumeric($.trim(globalLabelHeight)))
				errorCode = '9';
			else if (globalLabelWidth >= maxLabelWidth) {
				errorCode = '10';
				options = {
					maxLabelWidth : maxLabelWidth
				};
			} else if (globalLabelHeight >= maxLabelHeight) {
				errorCode = '11';
				options = {
					maxLabelHeight : maxLabelHeight
				};
			} else if (globalLabelWidth <= minLabelWidth)
				errorCode = '12';
			else if (globalLabelHeight <= minLabelHeight)
				errorCode = '13';
			else if($.trim($('#hintWidth').val()) == "" || $.trim($('#feedbackWidth').val()) == "")
				errorCode = '22';
			else if($.trim($('#hintHeight').val()) == "" || $.trim($('#feedbackHeight').val())== "")
				errorCode = '23';
			
			if (errorCode && errorCode != "") {
				validation.creatCommonErrorPopUp(errorModal, modalId,
						containerId, cancelId, overlayId);
				validation.showCommonErrorMessage(errorCode, options,
						containerId, errorAlertId);
				/* for changing details of error mdal */
				$("#errorModal span#errorCancel").hide();
				$("#errorModal span#errorOk").html("Ok");

				/* on click on ok in error popup */
				$("#errorContainer span#errorOk")
						.off('click')
						.on('click',
								function() {
									$('#errorModal').slideUp(200);
									var width = parseInt(window.CD.module.data.Json.adminData.SLELD
											.split(',')[0]);
									var height = parseInt(window.CD.module.data.Json.adminData.SLELD
											.split(',')[1]);
									$("#globalDiv #labelWidth").val(width);
									$("#globalDiv #labelHeight").val(height);
									
									var hintparam = window.CD.module.data.getHintFeedbackFromJson();
									var hintWd = hintparam.hintW;
									var hintHt = hintparam.hintH;
									var feedbackWd = hintparam.feedbackW;
									var feedbackHt = hintparam.feedbackH;
									
									$('#hintWidth').val(hintWd);
									$('#hintHeight').val(hintHt);
									$('#feedbackWidth').val(feedbackWd);
									$('#feedbackHeight').val(feedbackHt);

								});
				return false
			}
//			else if((regex.test($.trim($('#labelWidth').val()))==false) || (regex.test($.trim($('#labelHeight').val()))==false))
//			{
//			$('#labelWidth').val('');
//			$('#labelHeight').val('');
//			errorCode = '2100';
//			}
			else {
				return true;
			}
			
			
		} catch (err) {
			console.error("@COIView::Error on globalApplyClickAllValidation::"
					+ err.message);
		}
	},

	/**
	 * function name: globalApplyClick() author:Piyali Saha
	 */
	globalApplyClick : function(errorModal) {
		console.log("@COIView.globalApplyClick");
		try {

			var width = $("#globalDiv #labelWidth").val();
			var height = $("#globalDiv #labelHeight").val();
			var fillNew = $('#labelFillGlob').prop('checked');
			var borderNew = $('#labelBorderGlob').prop('checked');
			
			
			if (this.globalApplyClickAllValidation(errorModal)) {
				var undoMng = window.CD.undoManager;
				
				/*for undo operation*/
				var labelWH = window.CD.module.data.Json.adminData.SLELD.split(",");
				var ldwidth = parseInt(labelWH[0]);
				var ldheight = parseInt(labelWH[1]);
				var COIFirst=COIData.getCoiDataElementNumberwise(0);
				var fill=true;
				var border=true;
				if(COIFirst && COIFirst.transparent=="T"){
					 fill=false;
				}
				if(COIFirst && COIFirst.transparent_border=="T"){
					 border=false;
				}
				var oldObj={
							fillGlob:fill,
						      borderGlob:border
						     }
				var newObj={
						fillGlob:fillNew,
					      borderGlob:borderNew
					     }
			
				undoMng.register(this, COIView.updateLabelWidthHeightDetails,[ldwidth,ldheight,oldObj] , 'Undo Label',this, COIView.updateLabelWidthHeightDetails,[width,height,newObj] , 'Redo Label');
				updateUndoRedoState(undoMng);
				
				this.updateLabelWidthHeightDetails(width, height);
				/* create hintFeedback */
				var adminData=window.CD.module.data.getJsonAdminData();
				var zhp = window.CD.module.data.getHintParameterFromJson();
				var showInAuthoring=adminData.showHintOrFeedbackInAuthoring;
				var feedbackW=adminData.feedbackWidth;
				var feedbackH=adminData.feedbackHeight;
				
				var undoObj={
						hintW:zhp.w,
						hintH :zhp.h,
						staus:showInAuthoring,
						feedbackW:feedbackW,
						feedbackH:feedbackH,
						
				};
				var redoObj={
						hintW:parseInt($("#hintWidth").val()),
						hintH: parseInt($("#hintHeight").val()),
						staus:$('input[name=hintFeedback]:checked').val(),
						feedbackW:parseInt($("#feedbackWidth").val()),
						feedbackH:parseInt($("#feedbackHeight").val()),
				};
				undoMng.register(this, COIView.createUpdateHintFeedbackBox,['','',undoObj] , 'Undo hint dimension ',this, COIView.createUpdateHintFeedbackBox,['','',redoObj] , 'Redo hint dimension');
				updateUndoRedoState(undoMng);
				this.createUpdateHintFeedbackBox();
			}
		} catch (err) {
			console
					.error("@COIView::Error on globalApplyClick::"
							+ err.message);
		}

	},
	/*
	 * This is used for making label local disable when active element is not
	 * label or dock
	 */
	makeLabelLocalDisable : function() {
		console.log("@COIView.makeLabelLocalDisable");
		try {

			var localDivWidth = $('#localDiv').width();
			var localDivHeight = $('#localDiv').height();
			var localDivInactiveBar = $('<div id="localDivInactive" class="overlayInactive"></div>');
			localDivInactiveBar.css( {
				width : localDivWidth + 'px',
				height : localDivHeight + 'px'
			});
			$('#localDiv .block').before(localDivInactiveBar);
		} catch (err) {
			console.error("@COIView::Error on makeLabelLocalDisable::"
					+ err.message);
		}

	},
	
	createLabelObject : function(labelData,counter,lbConfig,isSingleSelection) {
		  try{
			  	var cs = window.CD.services.cs;
			  	var stg = cs.getCanvas();
			  	var cdLayer = cs.getLayer();
			  	var ds = window.CD.services.ds;
				var labelWH = window.CD.module.data.Json.adminData.SLELD.split(",");
				var ldwidth = parseInt(labelWH[0]);
				var ldheight = parseInt(labelWH[1]);
				var textBoxBuffer = 20;
				var undoMng = window.CD.undoManager;
				var coiJson=window.CD.module.data.Json;
				var lfontSize = parseInt(window.CD.module.data.Json.adminData.GFS);			
				labelData.labelGroupId = 'label_'+counter;
				labelData.name = labelData.labelGroupId;
				var textboxBuffer=20;

				lbConfig.id = 'label_' + counter;
				var lblGrpOptions = {
					draggable : true,
					x : parseInt(labelData.holder_x),
					y : parseInt(labelData.holder_y)
				};
				var lbGroup = COIView.cs.createGroup('label_' + counter,
						lblGrpOptions);
				var textBoxGroup = COIView.cs
						.createGroup(
								'txtGrp_' + counter,
								{
									'x' : 10,
									'y' : (ldheight - textboxBuffer) / 2
								});
				var ldwidth = parseInt(coiJson.adminData.SLELD
						.split(',')[0]);
				var ldheight = parseInt(coiJson.adminData.SLELD
						.split(',')[1]);
				var strokeWidth = 0;
				var strokeColor = 'transparent'
				var strokeEn = false;
				var fillColor = COIView.defaultLabelFillColor;
				var lfontSize = parseInt(coiJson.adminData.GFS);
				if (labelData.transparent_border === 'F') {
					strokeWidth = 1;
					strokeColor = '#999999';
					strokeEn = true;
				}

				if (labelData.correct_ans == 'F') {
					fillColor = COIView.defaultDistractorColor;
				}
				if (labelData.transparent === 'T') {
					fillColor = 'transparent';
				}

				var labelOption = {
					type : "Rect",
					kinteticOpt : {
						width : ldwidth,
						height : ldheight,
						stroke : strokeColor,
						strokeWidth : strokeWidth,
						cornerRadius : 5,
						fill : fillColor,
						opacity : 1,
						id : 'lbl_' + counter
					}
				}
				var textRectOption = {
					type : "TextRect",
					kinteticOpt : {
						width : ldwidth - textboxBuffer,
						height : lfontSize,
						fill : '#ffffff',
						opacity : 1,
						id : 'txtBox_' + counter
					}
				}

				var addTextObjectOption = {
					type : "Text",
					kinteticOpt : {
						text : COIView.defaultAddLabelText,
						fontSize : lfontSize,
						y:2,
						fontFamily : 'sans-serif',
						fill : '#555',
						width : ldwidth - textboxBuffer,
						height : 'auto',
						opacity : '1',
						verticalAlign : 'middle',
						id : 'addTxt_' + counter,
						name : 'nametxt',
						align : 'center'
					}
				}
				var label = COIView
						.createKineticObject(labelOption);
				var textBox = COIView
						.createKineticObject(textRectOption);
				var addTextObj = COIView
						.createKineticObject(addTextObjectOption);

				labelData.labelGroupId = lbConfig.id;
				lbGroup.add(label);
				textBoxGroup.add(textBox);
				textBoxGroup.add(addTextObj);
				var isDraggable = true;
				if (labelData.lockStatus)
					isDraggable = false;
				// isDraggable=labelData.lockStatus;
				var allOptions = {
					labelGroup : lbGroup,
					width : ldwidth,
					height : ldheight,
					ans : labelData.correct_ans,
					isDraggable : isDraggable
				}
				if (isSingleSelection) {
					COIView.callAllMethodForLabelCreate(
							allOptions, true);
				} else {
					COIView.callAllMethodForLabelCreate(
							allOptions, false);
				}
				if (labelData.label_value) {
					/* checking sb and sp tag in a text */
					var textValue = labelData.label_value;
					var commonTextTool = new TextTool.commonLabelText();
					if (commonTextTool
							.checkSubOrSuperTagExist(textValue)) {
						//textValue = commonTextTool.convertSbSpscript(textValue);
					}

					/* get text formatinf details */
					if (labelData.textFormat) {
						var fontStyle = labelData.textFormat.fontStyle;
						var underline_value = labelData.textFormat.underline_value;
						var fontS = parseInt(labelData.textFormat.fontSize);
						var align = labelData.textFormat.align;
					} else {
						var fontStyle = 'normal';
						var underline_value = 'F';
						var fontS = lfontSize;
						var align = 'center';
					}

					var editedTextObjectOption = {
						type : "Text",
						kinteticOpt : {
							text : COIView
									.fixTextEntities(textValue),
							fontSize : fontS,
							fontFamily : COIView.defaultTextFontFamily,
							fontStyle : fontStyle,
							fill : '#555',
							width : ldwidth - textboxBuffer,
							height : 'auto',
							opacity : '1',
							verticalAlign : 'middle',
							id : 'lbltxt_' + counter,
							name : 'nametxt',
							align : align
						}
					}
					var editedTextObj = COIView
							.createKineticObject(editedTextObjectOption);
					textBox.setFill("transparent");
					addTextObj.hide();
					textBoxGroup.add(editedTextObj);
					textBoxGroup.setY(0);
					var totWidth = label.getWidth();
					var totHeight = label.getHeight();
					if (editedTextObj.getTextWidth() > totWidth) {
						editedTextObj.setWidth(totWidth
								- textboxBuffer);
					}
					var originalTextHeight = editedTextObj.textArr.length
							* editedTextObj.getTextHeight();
					if (totHeight > originalTextHeight) {
						var calcY = (totHeight - originalTextHeight) / 2;
						textBoxGroup.setY(calcY);
					}
					COIView.attachEventforLabel("",
							editedTextObj);

				} else {
					addTextObj.show();
					addTextObj.parent
							.setY((label.getHeight() - addTextObj
									.getTextHeight()) / 2);
				}

				COIView
						.attachEventforLabel(lbGroup,
								addTextObj);
				if (labelData.hint_value != ""
						|| labelData.feedback_value != "") {
					COIView.attachHintFeedbackEvent(lbGroup);
				}
				lbGroup.add(textBoxGroup);
				//textBoxGroup.moveToTop();

				if (labelData.textFormat.underline_value == "T") {
					var commonLabelText = new TextTool.commonLabelText();
					var textObj = lbGroup
							.get('#lbltxt_' + lbGroup.attrs.id
									.split('_')[1])[0];
					if (textObj)
						commonLabelText.applyTextUnderline(
								textObj, textObj.parent, true);
					$("#UnderlinetTool").data('clicked', true);
				}
				/* image and media insert */

				if (labelData.image_data != "N") {
					var imageGrpId = 'img_' + lbGroup.attrs.id;
					loadImageforLabel(lbGroup, imageGrpId,
							labelData.image_data);
				}
				if (labelData.media_value != "N") {
					var audioGrpId = 'audio_' + lbGroup.attrs.id;
					var x = (labelData.media_label_XY).split('|')[0];
					var y = (labelData.media_label_XY).split('|')[1];
					loadAudioImage(lbGroup, audioGrpId,
							labelData.media_value, x, y);
				}

				/* add info text in label */
				if (labelData.infoHideText === "T") {
					textBoxGroup.hide();

				}
				var param = {
					labelGrpID : lbGroup.attrs.id,
					labelGrpObj : lbGroup,
					labelData : '',
					infoHideText : labelData.infoHideText,
					infoHintText : labelData.hint_value,
					infoFeedbackText : labelData.feedback_value,
					showLabel : true
				}
				COIView.createInfoTextObject(param);
				/* end here */

				/* add hint feedback for show label */
				if (window.CD.module.data.Json.adminData.showHintOrFeedbackInAuthoring != "none") {
					COIView.createUpdateHintFeedbackBox(true,
							lbGroup);
				}
				/* ends here */
				cdLayer.draw();
				

		  } catch(e){
			  console.log(e);
		  }
	  },
	
	
	undoLabelDelete : function(labelData) {
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var lbConfig = new LabelConfig();			
		var labelCount = cs.objLength(COIData.getJsonData());
		var labelGroupStartId = labelCount;
		
		for(var i=0;i<labelData.length;i++){
			var lblOptions = this.ds.getOptionLabel();
			if (lblOptions === "SS")var isSingleSelection=true;
			else var isSingleSelection=false;
			ds.setOutputData();
			COIView.createLabel(1, isSingleSelection,labelData[i]) 
			
		}
		cdLayer.draw();
		ds.setOutputData();
	},
	deleteLabel : function(active,activId) {

		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;
		var deletedLabel = [];
		var deletedLabelIds = [];
		var undoMng = window.CD.undoManager;
		if(!activId){
			var activeElmLenght = active.element.length;
			for(var i=0;i<activeElmLenght;i++){
				var activeElm = active.element[i];
				var outputJson = window.CD.module.data.Json;
				
				var images = activeElm.get('.img')[0];
				deletedLabelIds.push(activeElm.getId());
				if(images){
					var imageSrc = images.getImage().src.split('/');
					imageName = imageSrc[imageSrc.length-1];
				}
				cs.deleteSubGroups(activeElm);
				COIView.removeImageFromLabel(activeElm);
				COIView.removeTextFromLabel(activeElm);
				COIView.removeAudioFromLabel(activeElm);
				var laid = activeElm.attrs.id;
				var txtGrp = cs.findGroup("txtGrp_" + laid.split('_')[1]);
				if (txtGrp) {
					txtGrp.remove();
				}

				activeElm.remove()
				var coiIndex = COIView.getDataIndex(laid);
				deletedLabel.push(outputJson.COIData[coiIndex]);
				delete outputJson.COIData[coiIndex];
				if(images)
				window.CD.services.ds.updateImageList(imageName,'remove');
			}
		}else{

			var activeElmLenght = activId.length;
			for(var i=0;i<activeElmLenght;i++){
				var activeElm=cdLayer.get('#'+activId[i])[0];
				var outputJson = window.CD.module.data.Json;
				
				var images = activeElm.get('.img')[0];
				deletedLabelIds.push(activeElm.getId());
				if(images){
					var imageSrc = images.getImage().src.split('/');
					imageName = imageSrc[imageSrc.length-1];
				}
				cs.deleteSubGroups(activeElm);
				COIView.removeImageFromLabel(activeElm);
				COIView.removeTextFromLabel(activeElm);
				COIView.removeAudioFromLabel(activeElm);
				var laid = activeElm.attrs.id;
				var txtGrp = cs.findGroup("txtGrp_" + laid.split('_')[1]);
				if (txtGrp) {
					txtGrp.remove();
				}

				activeElm.remove()
				var coiIndex = COIView.getDataIndex(laid);
				deletedLabel.push(outputJson.COIData[coiIndex]);
				delete outputJson.COIData[coiIndex];
				if(images)
				window.CD.services.ds.updateImageList(imageName,'remove');
			}
		
		}
		

		undoMng.register(this, COIView.undoLabelDelete,[deletedLabel] ,
				'undo Delete Label',this, COIView.deleteLabel,["",deletedLabelIds] , 'Redo Delete Label');
		cs.setActiveElement(cs.findGroup('frame_0'), 'frame');
		updateUndoRedoState(undoMng);
		window.CD.module.data.reIndexLabels();
		cs.resetToolbar();
		ds.setOutputData();
		cdLayer.draw();
	},
	removeImageFromLabel : function(activeElm) {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var images = activeElm.get('.img');
		if (images[0]) {
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
		if (audio[0]) {
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
		if (texts[0]) {
			var txtwGrp = texts[0].parent;
			txtwGrp.removeChildren();
			txtwGrp.remove();
			cdLayer.draw();
		}
	},
	updateLabelContent : function(group, oldData, calcY, textH) {
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
        var buffer =10;

       		if(imgObject){
	        	var imageNameArr = imgObject.attrs.image.src.split('/');
				var imageName = imageNameArr[imageNameArr.length-1];
				
				
				if(imageName.indexOf('=SHOWmedia&media=') > -1){
					imageName = imageName.substring(imageName.lastIndexOf('=SHOWmedia&media=')+17 , imageName.length);
				}
	        	var imgH = imgObject.getHeight();//parseInt($('#imgHeight').html());
				var imgW = imgObject.getWidth();//parseInt($('#imgWidth').html());
				
				var imgBckupH = imgObject.getHeight();//parseInt($('#imgHeight').html());
				var imgBckupW = imgObject.getWidth();//parseInt($('#imgWidth').html());
				
				if (imageName) {
					/* image name is there */
					var src = imageName;
					var imageObject = new Image();
					 //If src has ('|')
					 if(src.indexOf('|')>-1){
						 src = src.split('|')[0];
					 }
					 imageObject.src = window.CD.util.proccessMediaID(src);
					var imgH = imageObject.height;
					var imgW = imageObject.width;
					/** For chrome and even for ff with clear cache, image was not getting loaded **/
					if(imgH == 0 || imgW == 0){
						imgH = imgBckupH;
						imgW = imgBckupW;
					}
				}
				var ratio = imgW / imgH;
                   var avlblWidth = lblWidth - 30;
                   var avlblHeight = lblHeight - 30;
                  
                   /*if(imgW < avlblWidth){
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
    		        }*/
                   
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
	                   var coi = COIData.getLabelIndex(group.attrs.id);
	                   var imageName = window.CD.module.data.Json.COIData[coi].image_data.split('|')[0];
	                   window.CD.module.data.Json.COIData[coi].image_data = imageName+'|'+Math.ceil(imgW)+'|'+Math.ceil(imgH);
	                   ds.setOutputData();
	                   /**************************************************************************************/
	                   
	                   imageHeight = imgH;
	                   imgObject.parent.setX((lblWidth - imgW)/2); 		                 
	                   var labelGroupInd = group.attrs.id.split('_')[1];
	                   var txtGrpObj = group.get('#txtGrp_'+labelGroupInd)[0];
	                   var txtGrpId=txtGrpObj.getId().split('_')[1];
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
	                	   
	                	   var coiData = window.CD.module.data.Json.COIData;
	                	   var val = coiData[coi];
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
	               				else{
	               					if(txtGrpId){
	               						textHeight = txtGrpObj.get('#addTxt_'+txtGrpId)[0].getHeight();
	               					}else{
	               						textHeight = txtObj.children[0].attrs.height;
	               					}
	               				}
	               					
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
			if(txtObj){				
				txtObj.setWidth(lblWidth-20);
				
				var textStyleObj = COIData.getTextStyleData(txtObj.getId().split('_')[1]);
				var textStyle = textStyleObj.fontStyle;
				var align = textStyleObj.align;
				var underline_value = textStyleObj.underline_value;
				
				var textValue = COIData.getLabelTextValue(txtObj.parent.getId());
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
					var textStyleObj = COIData.getTextStyleData(txtObj.getId().split('_')[1]);
					var textStyle = textStyleObj.fontStyle;
					var align = textStyleObj.align;
					var underline_value = textStyleObj.underline_value;
					
					var textValue = COIData.getLabelTextValue(txtObj.parent.getId());
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
	},
	/*
	 * This is used to populate popup for each info icon By Nabonita
	 * Bhattacharyya
	 */
	onClickShowInfoIcon : function(iconObj) {
		var nameVal=$(iconObj).attr('id');
		var newId = nameVal+'Id';
		var labelInfoIconDetail = window.CD.util
				.getTemplate( {
					url : 'resources/themes/default/views/label_Inspector_info_icon.html?{build.number}'
				});
		$('body #labelInfoIconModal').remove();
		$('body').append(labelInfoIconDetail);

		$('body #labelInfoIconModal #' + newId).css('display', 'block');

		$('#infoIconOverlay').css('height', $('.container').height());
		$('#infoIconOverlay').css('width', $('#canvasWidth').val());
		$('#labelInfoIconModal').css(
				'left',
				(($('#toolPalette').width() / 2) - ($('#labelInfoIconModal')
						.width() / 2)) + 'px');
		$('#labelInfoIconModal').css(
				'top',
				((($('#canvasHeight').val() / 2) - ($('#labelInfoIconModal')
						.height() / 2)) + 100) + 'px');
		$("#labelInfoIconModal span#closeBtn").off('click').on('click',
				function() {
					$('#labelInfoIconModal').css('display', 'none');
				});
	},
	
	/**
	 * This method is used for checking the availability of image in any label
	 * By Nabonita Bhattacharyya
	 * called from checkImageAvailableStatus() :: canvasservices.js
	 */
	imageAvailableStatusInLabel : function(imageName){
		try{
			var labelData  = window.CD.module.data.Json.COIData;
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
			console.error("@COIView::Error on imageAvailableStatusInLabel for image availability status::"+err.message);
		}
	},
	audioAvailableStatusInLabel : function(audioName){
		try{
			var labelData  = window.CD.module.data.Json.COIData;
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
			console.log('@CoiView :: Error in imageAvailableStatusInLabel for image availability status'+err.message);
		}
	},
	
	/*
	 * Cancel event for label By Nabonita Bhattacharyya
	 */
	labelCancelEvent : function() {
		if (window.CD.elements.active.type == 'label') {
			var outputJSon = COIData.getJsonData();
			// var outputJSon = updateJSon[SLEData];
			var adminData = COIData.getJsonAdminData();
			for ( var coi in outputJSon) {
			/* ----------- Label height & Width ------------ */
				$('#labelWidth').val(parseInt(adminData.SLELD.split(',')[0]));
				$('#labelHeight').val(parseInt(adminData.SLELD.split(',')[1]));
		
				/* --------------- Fill ----------------------- */
				if (outputJSon[coi].transparent == 'F') {
					$('#labelFillGlob').prop('checked', true);
				} else {
					$('#labelFillGlob').prop('checked', false);
				}
				/*----------------- Label Border ------------------ */
				if (outputJSon[coi].transparent_border == 'F') {
					$('#labelBorderGlob').prop('checked', true);
				} else {
					$('#labelBorderGlob').prop('checked', false);
				}
		
				/* ------------- hint / feedback ------------------ */
				if (adminData.showHintOrFeedbackInAuthoring == 'hint') {
					$('input[name=hintFeedback][value=hint]').prop('checked', true);
				} else if (adminData.showHintOrFeedbackInAuthoring == 'feedback') {
					$('input[name=hintFeedback][value=feedback]').prop('checked', true);
				} else {
					$('input[name=hintFeedback][value=none]').prop('checked', true);
				}
				var ZHP = window.CD.module.data.getHintParameterFromJson();
				var hintW = ZHP.w, hintH = ZHP.h
				if (hintW != '')
					$('#hintWidth').val(hintW);
				if (hintH != '')
					$('#hintHeight').val(hintH);
				if (adminData.feedbackWidth != '')
					$('#feedbackWidth').val(adminData.feedbackWidth);
				if (adminData.feedbackHeight != '')
					$('#feedbackHeight').val(adminData.feedbackHeight);
			}
		}
	},
	deleteAudio:function(node){
		var ds = window.CD.services.ds;
		var labelData  = window.CD.module.data.Json.COIData;
		labelData[node].media_value = "N";
		labelData[node].media_label_XY = "N";
		ds.setOutputData();
	},
	labelTextOTM : function(txtGrpId,textValue,txtGrpObj){
		try{
			txtGrpObj.get('#lbltxt_'+txtGrpId)[0].setText(textValue);
			return txtGrpObj;
		}
		catch(err){
			console.log('@COIView :: Error in labelTextOTM() coiView::'+err.message);
		}
	},
	
	/**
	 * This method is used for hint,feedback flag removal 
	 * when hint/feedback value is blank
	 */
	removeHintFeedbackFlag : function(lblGroup,hint,feedback){
		console.log("@removeHintFeedbackFlag :: COIView");
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
			console.error("Error @removeHintFeedbackFlag :: COIView "+err.message);
		}
	},
	
	/**
	 * For a label with height > width, if an image is added width width > height
	 * and long text is added to the label, then the position (top padding) of the image and text
	 * is modified using this method
	 */
	labelImageAndTextAdjust : function(lblGroup){
		console.log('@labelImageAndTextAdjust :: COIView');
		try{
			var coiTextTool= new TextTool.commonLabelText();
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			
			var txtGrpParentId = lblGroup.getId();
			var txtGrpObj = lblGroup.get('#txtGrp_'+txtGrpParentId.split('_')[1])[0];
			
			
			var txtGrpId = txtGrpObj.attrs.id.split('_')[1];
			var textBoxGrpObj=txtGrpObj.get('#txtBox_'+txtGrpId)[0];
			
			var imgObj=lblGroup.get('#img_'+txtGrpParentId)[0];
			
			var textHeight = 0;
			var hideStatus = txtGrpObj.getVisible();
			if(hideStatus == true){
				if(!($('#hideTextLoc').is(':checked'))){
					if(window.CD.module.data.textGroupComponent.length > 0){
						var count = txtGrpObj.children.length-1;
						var lastChild = coiTextTool.findLastTextchild(txtGrpObj,count);
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
			var spaceRemain = (parseInt(lblGroup.children[0].getHeight())-parseInt(imgHeight)-textHeight)/2;
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
					var lastChild = coiTextTool.findLastTextchild(txtGrpObj,count);
					var textHeight = txtGrpObj.children[lastChild].getY() + txtGrpObj.children[lastChild].getHeight();
				}
				else
					textHeight = txtGrpObj.get('#addTxt_'+txtGrpId)[0].getHeight();
				changeY=parseInt((lblGroup.children[0].getHeight()-textHeight)/2);
     	    }
			
			//Added image Height check to set text to vertical align to label bottom when image loading is slow and system not able to get image height
     	    var labelGrpHeight = parseInt(lblGroup.children[0].getHeight());
     	    if(parseInt(imgHeight) > 0){
     	    	txtGrpObj.setY(parseInt(imgHeight)+parseInt(imageBuffer)+parseInt(spaceRemain));	
     	    }else{
     	    	txtGrpObj.setY((parseInt(labelGrpHeight) - parseInt(textHeight))/2);
     	    }
     	    
	 		cdLayer.draw();
		}catch(err){
			console.error("@COIView::Error on labelImageAndTextAdjust::"+err.message);
		}
	},
	setActiveLabelPosition : function(labelGrp){
		console.log('@setActiveLabelPosition :: coiView');
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
		var labelGrpJsonId = COIView.getDataIndex(labelId);
		var changedX = labelGrp.getX() - window.CD.module.data.Json.COIData[labelGrpJsonId].holder_x;
		var changedY = labelGrp.getY() - window.CD.module.data.Json.COIData[labelGrpJsonId].holder_y;
		for(var i=0;i<activeElmLength;i++){
			var coi = COIView.getDataIndex(window.CD.elements.active.element[i].attrs.id);
			if(coi == labelGrpJsonId){
				var oldX = window.CD.module.data.Json.COIData[coi].holder_x;
				var oldY = window.CD.module.data.Json.COIData[coi].holder_y;
				window.CD.module.data.Json.COIData[coi].holder_x = labelGrp.getX();
				window.CD.module.data.Json.COIData[coi].holder_y = labelGrp.getY();
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
				
				var oldX = window.CD.module.data.Json.COIData[coi].holder_x;
				var oldY = window.CD.module.data.Json.COIData[coi].holder_y;
				window.CD.module.data.Json.COIData[coi].holder_x = newX;
				window.CD.module.data.Json.COIData[coi].holder_y = newY;	
			}
			
		activeElmNewX.push(newX);
		activeElmNewY.push(newY);
		activeElmOldX.push(oldX);
		activeElmOldY.push(oldY);
		ds.setOutputData();
		}
		labelGrp.parent.getLayer().draw();
		cdLayer.draw();
		undoMng.register(this, COIView.setLabelGroupPosition,[activeElmArray,activeElmOldX,activeElmOldY,groupIdArr] , 'Undo Label position',this, COIView.setLabelGroupPosition,[activeElmArray,activeElmNewX,activeElmNewY,groupIdArr] , 'Redo Label position');
		updateUndoRedoState(undoMng);
	}
};