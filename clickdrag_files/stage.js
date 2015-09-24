function Stage(options) { 
	console.log("@Stage");
	//Merge Shell default parametrs and user supplied parameters
	var cd = window.CD, that = this,ds = window.CD.services.ds,initState = window.CD.services.initialState;
	this.cnv = window.CD.services.cs;
	var Util = window.CD.util;	  
	this.stgConfig = new StageConfig();
	var allTextStyling = new AllTextStyling();
	var stageTextTool= new TextTool.frameText();
	var stageCanvasTextTool= new TextTool.canvasText();
	var stageLabelTextTool= new TextTool.labelText();
	var dockTextTool= new TextTool.dockText();
	var stage_id = "stage_" + cd.questionId;
	var cd_stage = $('<div id="'+stage_id+'" class="stage_wrapper"></div>');
	$(cd.html_elm).html(cd_stage);
	this.stgConfig.html_id = stage_id;
	
	/* ----- imagePreLoader is called for loading images ------ */
    imagePreLoader.init(ds.getImageList());
    
    
	initLayout(this);
	initCanvas(this);
	initTools(this);

	
	updateInspectorWH();
	var errorModal = Util.getTemplate({url: 'resources/themes/default/views/error_modal.html?{build.number}'});
	for(var key in exerciseNames){
		$('#exerciseSettings .select_options').append('<span class="select_option" name="'+key+'">'+ exerciseNames[key].exerciseText + '</span>');
	}
	enableSelectBoxes();
	loadData();
	
	
	$('input[class="input_text"]').off('keydown').on('keydown',function(e){
		 var inputVal = $(this).val();
		 var returnVal= checkVal(inputVal,e);
		 return returnVal;
        
	});
	
	/*-----------Populate Audio List---------------Start--*/
	var audioListContainer = $('#audioDiv .media_parent table');
	$("#addMediaToList").on('click',function(){
		var audioPath = $('#audioDiv #audioPath').val();
		var audioName = $('#audioDiv #audioNames').val();
		if(audioPath != '' && audioName != '' && (/^\/.+\/$/.test(audioPath))){
			$(audioListContainer).find("#emptyList").remove();
			if(audioName.indexOf(',') != -1){
				audioArr = audioName.split(',');
				var correctExt = true;
				for(var i=0 ; i < audioArr.length ; i++){
					if( audioArr[i].indexOf('.mp3') == -1){
						var errMsg = '';
						if((audioArr[i].indexOf('.mp3') == -1)){
							errMsg += "All the audio file extensions must be .mp3.<br/></br>";
						}
						$('#toolPalette #errorModal').remove();
						$('#toolPalette').append(errorModal);
						
						$("#errorModal span#errorCancel").hide();
						$('#alertMessage').slideDown(200);		
						$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
						$('#errorOk').html('close');
						$('#alertText .frame_warning_text').show();
						$('#errorModal #errAlertText').html(errMsg);
						$('#alertMessage').slideDown(200);		
						$("#errorContainer span#errorOk").off('click').on('click',function(){
							$('#errorModal').slideUp(200);
						});
						correctExt = false;
						break;
					}
				}
				if(correctExt){
					for(var i=0 ; i < audioArr.length ; i++){
						var audioUrl = audioPath + audioArr[i];
						var valueExists = $.inArray(audioUrl, window.CD.services.ds.getAudioUrlList());
						if(valueExists == -1){
							$('#audioDiv .media_parent td#noAudioText').parent().remove();
							$(audioListContainer).append('<tr><td class="media_list" title="'+audioPath+'">'+$.trim(audioArr[i])+'</td></tr>');
							window.CD.services.ds.updateAudioList(audioUrl,"insert");
						}
					}
					$('#audioDiv #audioNames').val('');
					$('#audioDiv .block #inspectorInsertAudio').removeClass('inactive').addClass("enabled");
					$('#audioDiv .block #removeAudio').removeClass('gray_disabled').addClass("gray_enabled");
				}
			}else{
				if(audioName.indexOf('.mp3') != -1){
					var audioUrl = audioPath + audioName;
					var valueExists = $.inArray(audioUrl, window.CD.services.ds.getAudioUrlList());
					if(valueExists == -1){
						$('#audioDiv .media_parent td#noAudioText').parent().remove();
						$(audioListContainer).append('<tr><td class="media_list" title="'+audioPath+'">'+$.trim(audioName)+'</td></tr>');
						window.CD.services.ds.updateAudioList(audioUrl,"insert");
						$('#audioDiv #audioNames').val('');
					}else{
						var errMsg = '';
						errMsg += '<b>'+ audioName+'</b> audio file is already present in audio list.<br/></br>';
						$('#toolPalette #errorModal').remove();
						$('#toolPalette').append(errorModal);
						
						$("#errorModal span#errorCancel").hide();
						$('#alertMessage').slideDown(200);		
						$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
						$('#errorOk').html('close');
						$('#alertText .frame_warning_text').show();
						$('#errorModal #errAlertText').html(errMsg);
						$('#alertMessage').slideDown(200);		
						$("#errorContainer span#errorOk").off('click').on('click',function(){
							$('#errorModal').slideUp(200);
						});
					}
				}else{
					var errMsg = '';
					if((audioName.indexOf('.mp3') == -1)){
						errMsg += "The audio file extension must be .mp3.<br/></br>";
					}
					$('#toolPalette #errorModal').remove();
					$('#toolPalette').append(errorModal);
					
					$("#errorModal span#errorCancel").hide();
					$('#alertMessage').slideDown(200);		
					$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
					$('#errorOk').html('close');
					$('#alertText .frame_warning_text').show();
					$('#errorModal #errAlertText').html(errMsg);
					$('#alertMessage').slideDown(200);		
					$("#errorContainer span#errorOk").off('click').on('click',function(){
						$('#errorModal').slideUp(200);
					});
				}
			}
			$("#audioDiv table tr").css("background-color", "#ffffff");			
			$("#audioDiv table tr:first").addClass('selectedBackground');
		}else{
			//show error messages.
			var errMsg = '';
			if(audioPath == ""){
				errMsg += "The Amazon relative path cannot be left blank.<br/></br>";
			}
			if(!(/^\/.+\/$/.test(audioPath))){
				errMsg += "The Amazon relative path should start and end with forward slash(/).<br/></br>";
			}
			
			if(audioName == ""){
				errMsg += "The file name cannot be left blank.<br/></br>";
			}
			
			$('#toolPalette #errorModal').remove();
			$('#toolPalette').append(errorModal);
			
			$("#errorModal span#errorCancel").hide();
			$('#alertMessage').slideDown(200);		
			$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
			$('#errorOk').html('ok');
			$('#alertText .frame_warning_text').show();
			$('#errorModal #errAlertText').html(errMsg);
			$('#alertMessage').slideDown(200);		
			$("#errorContainer span#errorOk").off('click').on('click',function(){
				$('#errorModal').slideUp(200);
			});
			
		}		
	});
	
	var audioList = window.CD.services.ds.getAudioList();
	var audioArray = new Array();
	if(audioList.length > 0){
		for(var i=0; i < audioList.length; i++){
			audioArray.push(audioList[i].url);
		}
	}
	audioArray.sort();
	if(audioArray.length > 0){
		for(var i=0; i < audioArray.length; i++){
			var audioUrl = audioArray[i];
			var audioPath = audioUrl.substring(0,audioUrl.lastIndexOf("/")+1);
			var audioName = audioUrl.substring(audioUrl.lastIndexOf("/")+1,audioUrl.length);
			if(audioList[i].used){
				$(audioListContainer).append('<tr><td class="media_list usedMedia" title="'+audioPath+'">'+$.trim(audioName)+'</td></tr>');
			}else{
				$(audioListContainer).append('<tr><td class="media_list" title="'+audioPath+'">'+$.trim(audioName)+'</td></tr>');
			}
			
			//$('#mediaDiv .block #inspectorInsertAudio').removeClass('inactive').addClass("enabled");
		}
	}else{
		var audioListContainer = $('#audioDiv .media_parent table');
		$(audioListContainer).append('<tr  id="emptyList"><td class="media_list normalText">No audio available</td></tr>');
		$('#mediaDiv .block #inspectorInsertAudio').addClass('inactive');
		$('#mediaDiv .block #removeAudio').removeClass('gray_enabled').addClass("gray_disabled");
	}
	
	$("#mediaDiv #audioDiv table").on('click','tr',function(){
		if(!($(this).children().hasClass('normalText'))){
			$('.selectedBackground').removeClass('selectedBackground');
			$(this).children().addClass('selectedBackground');
			var audioName= $(this).find('.media_list').attr("title") + $(this).find('.media_list').text();
			var extAudioUrl = window.CD.util.proccessMediaID(audioName);
			$('#mediaDiv .block #inspectorInsertAudio').removeClass('inactive').addClass('enabled');
			$('#mediaDiv .block #removeAudio').removeClass('gray_disabled').addClass("gray_enabled");
			var sound = new Audio();
			if(sound.canPlayType('audio/mpeg')){
				extAudioUrl = extAudioUrl;
			}
			else if(sound.canPlayType('audio/ogg')){
				extAudioUrl = extAudioUrl.replace('.mp3','.ogg');
			}
			openPlayerInspector(extAudioUrl);
		}
	});
	function openPlayerInspector(audioName){
		$('#audioControlsIns').remove();
		var audioControls = $('<audio preload="auto" id="audioControlsIns" controls="controls" src="'+audioName+'"></audio>');
		$('#audioControl').append(audioControls);
	}
	
		$("#inspectorInsertAudio").off('click').on('click',function(){
			if(!$("#inspectorInsertAudio").hasClass("inactive")){
				//$(this).find('.media_list').attr("title") + $(this).find('.media_list').text();
				var audioUrl = $('#audioDiv .selectedBackground').attr("title")  + $('#audioDiv .selectedBackground').text();
				if(audioUrl) window.CD.services.cs.addAudio(audioUrl);
			}
	});
	$("#removeAudio").off('click').on('click',function(){
		if(!($("#removeAudio").hasClass('gray_disabled'))){
		//$(this).find('.media_list').attr("title") + $(this).find('.media_list').text();
		if($('#audioDiv .selectedBackground').hasClass("usedMedia")){
			//show error messages.
			var errMsg = 'Unable to delete audio from list.<br/> This audio file is already in use. Please delete the audio component then remove from the list.';
			
			$('#toolPalette #errorModal').remove();
			$('#toolPalette').append(errorModal);
			
			$("#errorModal span#errorCancel").hide();
			$('#alertMessage').slideDown(200);		
			$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
			$('#errorOk').html('ok');
			$('#alertText .frame_warning_text').show();
			$('#errorModal #errAlertText').html(errMsg);
			$('#alertMessage').slideDown(200);		
			$("#errorContainer span#errorOk").off('click').on('click',function(){
				$('#errorModal').slideUp(200);
			});
		}else{
			var audioElm = $('#audioDiv .selectedBackground');
			var audioUrl = $('#audioDiv .selectedBackground').attr("title")  + $('#audioDiv .selectedBackground').text();
			window.CD.services.ds.updateAudioList(audioUrl,"remove");
			audioElm.remove();
			$("#audioControlsIns").remove();
			if($('#audioDiv .media_parent td').length == 0){
				$('#audioDiv .media_parent tr').html('<td id="noAudioText" class="media_list normalText">No audio available</td></tr>');
				$('#mediaDiv .block #inspectorInsertAudio').addClass('inactive');
				$('#mediaDiv .block #removeAudio').removeClass('gray_enabled').addClass("gray_disabled");
				$('#mediaDiv .block #removeAudio').attr("disabled","disabled");
			}
			
		}
	}
		
	});
	
	/*-----------Populate Audio List---------------End--*/
	
	/*-----------Populate Image List---------------Start--*/
	var mediaInput = cd.mediaValue;
	mediaInput.sort();
	var imageListContainer = $('#imageDiv .media_parent table');
	var medLen = mediaInput.length;
	if(medLen > 0){
		for(var i=0; i<medLen ; i++){
			if(mediaInput[i].indexOf('.png') != -1 || mediaInput[i].indexOf('.jpg') != -1 || mediaInput[i].indexOf('.jpeg') != -1 || mediaInput[i].indexOf('.gif') != -1){
				if(window.CD.services.ds.isImageUsed(mediaInput[i])){
					$(imageListContainer).append('<tr><td class="media_list usedMedia" title="'+mediaInput[i]+'">'+mediaInput[i]+'</td></tr>')
				}else{
					$(imageListContainer).append('<tr><td class="media_list" title="'+mediaInput[i]+'">'+mediaInput[i]+'</td></tr>')
				}
				
				
			}			
		}	

		$("#imageDiv table tr").css("background-color", "#ffffff");
		$("#audioDiv table tr").css("background-color", "#ffffff");
		var firstImage = $("#mediaDiv #imageDiv table tr:first");
		var firstAudio = $("#mediaDiv #audioDiv table tr:first");
		var imgName = [];
		var divName = [];
		imgName.push($(firstImage).find('.media_list').html());
		divName.push($('#mediaDiv #imageDiv .preview_media'));
		loadImageFromMediaList(imgName,divName);
		
		if(!($(firstImage).children().hasClass('normalText')))
			$(firstImage).children().addClass('selectedBackground');
		if(!($(firstAudio).children().hasClass('normalText')))
			$(firstAudio).children().addClass('selectedBackground');
		var ctrlMode = false;
		var imageName = [];
		var divName = [];
		$("#mediaDiv #imageDiv table").on('click','tr',function(){
			if(window.CD.elements.active.type == 'frame'){
				$(window).keyup(function(evt) {
				  if (evt.which == 16) { 
					  ctrlMode = false;
				  }
				}).keydown(function(evt) {
				  if (evt.which == 16) { 
					  ctrlMode = true;
				  }
				});
				if(ctrlMode == false){
					$('.selectedBackground').removeClass('selectedBackground');
					imageName = [];
					$(this).children().addClass('selectedBackground');
					imageName.push($(this).find('.media_list').html());
					divName.push($('#mediaDiv #imageDiv .preview_media'));

				}else{
					$(this).children().addClass('selectedBackground');
					imageName.push($(this).find('.media_list').html());
					divName.push($('#mediaDiv #imageDiv .preview_media'));

				}
				if(imageName.length>0){
					loadImageFromMediaList(imageName,divName);
					imageName = [];
				}
				
			}else{
				$('.selectedBackground').removeClass('selectedBackground');
				$(this).children().addClass('selectedBackground');
				imageName.push($(this).find('.media_list').html());
				divName.push($('#mediaDiv #imageDiv .preview_media'));
				loadImageFromMediaList(imageName,divName);
				imageName = [];
			}
			
		});
		$('#mediaDiv .block #inspectorInsertImage').removeClass('inactive').addClass('enabled');
	}else{
		var imageListContainer = $('#imageDiv .media_parent table');
		$(imageListContainer).append('<tr><td class="media_list normalText">No images available</td></tr>');
		$('#mediaDiv .block #inspectorInsertImage').addClass('inactive');
	}
	
	
	
	function loadImageFromMediaList(imgName,divName){
		var imgLength = imgName.length;
		if(imgName.length>1){
			for(i=0; i<imgName.length; i++){
				var divNameTemp = divName[i];
				divNameTemp.empty();
				var img = $('<img>');
				var tempDiv = $('<div style="display:table-cell;vertical-align:middle;"></div>');
				img.attr('src', window.CD.util.proccessMediaID(imgName[i]));
				
				$(img).load(function() {
				    var imgWidth = this.width;
				    var imgHeight = this.height;
				    $('#imgHeight').html(imgHeight+'px');
				    $('#imgWidth').html(imgWidth+'px');
				    var divWidth = divNameTemp.width();
				    var divHeight = divNameTemp.height();
					if(imgWidth > divWidth){
						var scaleRatio = divWidth / imgWidth;
						imgWidth = imgWidth * scaleRatio;
						imgHeight = imgHeight * scaleRatio;	
						img.attr({'width':imgWidth,'height':imgHeight});
					}
					
					tempDiv.append(img);
					$(img).css('border','1px solid #cccccc');
					divNameTemp.append(tempDiv);
				  });
			}
			
		}else{
			var divNameTemp = divName[0];
			divNameTemp.empty();
			var img = $('<img>');
			var tempDiv = $('<div style="display:table-cell;vertical-align:middle;"></div>');
			img.attr('src', window.CD.util.proccessMediaID(imgName[0]));
			
			$(img).load(function() {
			    var imgWidth = this.width;
			    var imgHeight = this.height;
			    $('#imgHeight').html(imgHeight+'px');
			    $('#imgWidth').html(imgWidth+'px');
			    var divWidth = divNameTemp.width();
			    var divHeight = divNameTemp.height();
				if(imgWidth > divWidth){
					var scaleRatio = divWidth / imgWidth;
					imgWidth = imgWidth * scaleRatio;
					imgHeight = imgHeight * scaleRatio;	
					img.attr({'width':imgWidth,'height':imgHeight});
				}
				
				tempDiv.append(img);
				$(img).css('border','1px solid #cccccc');
				/** This is done as image preview window sometime has more than one image in it , so we are removing one and adding then **/
				if(divNameTemp.children().length>0){
					divNameTemp.children().remove()
				}
				divNameTemp.append(tempDiv);
			  });
		}
		
		
	}
	$('.accorDiv #startOver').unbind().bind('click',function(){
		$('#toolPalette #errorModal').remove();
		$('#toolPalette').append(errorModal);
		
		$("#errorModal span#errorCancel").off('click').on('click',function(){
			$('.button #updateFromInspector').addClass('inactive');
			$('#errorModal').slideUp(200);
		});
		$('#alertMessage').slideDown(200);		
		$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
		$('#errAlertText .start_over').show();
		$('#errorOk').html('yes, start over');
		$('#alertMessage').slideDown(200);		
		$("#errorContainer span#errorOk").off('click').on('click',function(){
			window.CD.module.data.resetAll(stage_id);
			var activeObjId = '';
			window.CD.module.frame.fontSizeUpdateId = activeObjId;
			
		});
		
		
	});
	
	$("#inspectorInsertImage").bind('click',function(){
		var undoMng = window.CD.undoManager;
		var img = $('#imageDiv .selectedBackground');
		var activeElementId = window.CD.elements.active.element[0].attrs.id;
		var activeElementType = window.CD.elements.active.type;
		if(activeElementType == 'frame'){
			if(img){
				if(img.length>=1){
					for(var i=0; i<img.length; i++){
						window.CD.services.cs.addMedia($('#imageDiv .selectedBackground')[i].title,img);
						window.CD.services.cs.setActiveElement(window.CD.services.cs.findGroup(activeElementId),'frame');
					}
				}
			}
		}else{
			if(img){
				window.CD.services.cs.addMedia($('#imageDiv .selectedBackground')[0].title);
			}
		}
		
	});
	
	
	$("#applyTextTool").bind('click',function(){
		var errMsg="";
		 var regex = /^\s*\d*\s*$/;
		 var boxW = $('#boxWidth').val();
		 var boxH = $('#boxHeight').val();
		 if(regex.test(boxW) && regex.test(boxH)){
			 if(($.trim($('#boxWidth').val())== '') || ($.trim($('#boxHeight').val())== '')){
					if($.trim($('#boxWidth').val())== ''){
						errMsg="The textbox width cannot be left blank  ";
						//$('#boxWidth').addClass('warning_input');
					}else{
						//$('#boxWidth').removeClass('warning_input');
					}
					if($.trim($('#boxHeight').val())== ''){
						errMsg= errMsg + "The textbox height cannot be left blank  ";
						//$('#boxHeight').addClass('warning_input');
					}else{
						//$('#boxHeight').removeClass('warning_input');
					}
				}else{	
					//$('#boxHeight').removeClass('warning_input');
					//$('#boxWidth').removeClass('warning_input');
					var boxWidth=parseInt($('#boxWidth').val());
					var canvasWidth=parseInt($('#canvasWidth').val());
					var boxHeight=parseInt($('#boxHeight').val());
					var canvasHeight=parseInt($('#canvasHeight').val());
					var minWidth=25;
					var minHeight=20;
					if(boxWidth >= canvasWidth)
						errMsg += "The width of the textbox cannot be greater than the width of the canvas.<br/><br/>";
					if(boxHeight >= canvasHeight)
						errMsg += "The height of the textbox cannot be greater than the height of the canvas.";
					if(boxWidth < minWidth)
						errMsg += "The width of the textbox cannot be less then "+minWidth+".<br/><br/>";
					if(boxHeight < minHeight)
						errMsg += "The height of the textbox cannot be less then "+minHeight+".";
				}
						
					if(boxWidth <= canvasWidth && boxHeight <= canvasHeight && boxWidth>=minWidth && boxHeight>=minHeight){
						if(window.CD.elements.active.type == 'canvastext'){
							stageCanvasTextTool.applyTextToolChangeForHeightWidth();
						}else{
							stageTextTool.applyTextToolChange();
						}
						 
					}else{
						$('#toolPalette #errorModal').remove();
						$('#toolPalette').append(errorModal);
						$("#errorContainer span#errorOk").off('click').on('click',function(){				
							$('#errorModal').slideUp(200);
							$('#boxWidth').focus();
						});
						$("#errorModal span#errorCancel").hide();
						$("#errorModal span#errorOk").html("Ok");
						$('#alertText .frame_warning_text').show();
						$('#errorModal #errAlertText').html(errMsg);
						$('#errorModal').slideDown(200);		
						$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
					}
		 }else{
			 $('#boxWidth').val('');
			 $('#boxHeight').val('');
		 }
		
		
	});
	/* ----------- this is for media div tab action -------------- */
		/* ------------ By Nabonita Bhattacharyya ------------- */
	$('#mediaDiv .tab_view').on('click',function(){
		if($(this).hasClass('inactive')){
			$('#' + $(this).siblings('.tab_view.active').attr('name')).hide();
			$(this).siblings('.tab_view.active').removeClass('active').addClass('inactive');
			$(this).removeClass('inactive').addClass('active');
			$('#' + $(this).attr('name')).show();
			
		}
	});
	
	/* ----------- this is for media div expand/collapse -------------- */
		/* ------------- By Nabonita Bhattacharyya --------------- */
	$('#mediaDivContainer #mediaHead').off("click").on("click",function(){
 		if($('#mediaDiv').hasClass('display_none')){
 			$('#mediaDiv').css('display','block');
 			$('#mediaDiv').removeClass('display_none');
 			$(this).children('span.ui-icon-position-col').addClass('ui-icon-position-ex').removeClass('ui-icon-position-col');
 			$(window).scrollTop($('#mediaDiv').offset().top);
 		}else{
 			if($('#mediaDiv').css('display')=='block'){
 				$('#mediaDiv').css('display','none');
 				$('#mediaDiv').addClass('display_none');
 				$(this).children('span.ui-icon-position-ex').addClass('ui-icon-position-col').removeClass('ui-icon-position-ex');
	 		}
 		}
 	});
	
	/*
	 * New added for Cnacel event of Canvas inspector
	 * By Nabonita Bhattacharyya
	 */
	$('#canvasCancel').unbind('click').bind('click',function(){
		if(window.CD.elements.active.element[0] && window.CD.elements.active.element[0].attrs.id.match(/txt_[0-9]_[0-9]+/)){
			var activeElm = window.CD.elements.active.element[0];
			var inputframId=activeElm.attrs.id.split('_')[2];
			var textId=activeElm.attrs.id.split('_')[1];
			
			$('#boxWidth').val(window.CD.module.data.Json.FrameData[inputframId].frameTextList[textId].maxWidth);
			$('#boxHeight').val(window.CD.module.data.Json.FrameData[inputframId].frameTextList[textId].minHeight);
			
			if(window.CD.module.data.Json.FrameData[inputframId].frameTextList[textId].border == 'T'){
				$('#borderGuide').prop('checked',true);
			}else{
				$('#borderGuide').prop('checked',false);
			}
			if(window.CD.module.data.Json.FrameData[inputframId].frameTextList[textId].fill == 'T'){
				$('#fillGuide').prop('checked',true);
			}else{
				$('#fillGuide').prop('checked',false);
			}
		}
		$('#hideGuide').prop('checked',false);
		that.cnv.hideGuides($('#hideGuide').prop('checked'));
		
		$('#lockGuide').prop('checked',false);
		that.cnv.lockGuides($('#lockGuide').prop('checked'));
		
		$('#displayGrid').prop('checked',false);
		that.cnv.showHideGrid($('#displayGrid').prop('checked'));
	});
	
	$('#cdInspector span#updateFromInspector').unbind('click').bind('click',function() {
		$('#maskTool').remove();
		var alertStr = "";			
		var newExerciseOpt ="";
		var newExerciseOptSen ="";
		$('#toolPalette #errorModal').remove();
		var exerciseTypeText = ds.getEtText();
		var exerciseType = ds.getEt();
		var exerciseSubOptText = ds.getsubOptionLevelText();
		var exerciseTypeTemp = $('#exerciseName').html();
		if(exerciseTypeText != exerciseTypeTemp){
			alertStr = alertStr + "Are you sure you want to change the activity type?";
		}else{
			if(exerciseType == "SLE" || exerciseType == "CLS" ){
				if(ds.getOptionLabelText() != $('#sleOptions').html()){
					newExerciseOpt = $('#sleOptions').html();
					alertStr = alertStr + "Are you sure you want to change the Label Interaction?";
					
				}		
			}
			if(exerciseType == "COI" ){
				if(ds.getOptionLabelText() != $('#coiOptions').html()){
					newExerciseOpt = $('#coiOptions').html();
					alertStr = alertStr + "Are you sure you want to change the Label Interaction?";
				}		
			}
			if(exerciseType == "PRG" ){
				if(ds.getOptionLabelText() != $('#prgOptionsForLabel').html()){
					newExerciseOpt = $('#prgOptionsForLabel').html();
					alertStr = alertStr + "Are you sure you want to change Label to Dock Interaction?";
				}	
				if(ds.getOptionSentenceText() != $('#prgOptionsForSentence').html()){
					newExerciseOptSen = $('#prgOptionsForSentence').html();
					alertStr = alertStr + "Are you sure you want to change the Sentence Ordering?";
				}	
			}
			
			if(ds.getOptionLabelText() == $('#sleOptions').html() && exerciseSubOptText != "" && exerciseType != "PRG"){
				if(exerciseSubOptText != $('#subOptions').html()){
					alertStr = alertStr + "Are you sure you want to change the Label Occurrence?";
				}
			}
		}
		
		if(alertStr != ""){	
			alertStr += "<br>This may erase few of your content and can't be undone.";	//Commented for misleading warning issue (CTCD-78)
			$('#toolPalette').append(errorModal);
			$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
			
			
			$("#errorContainer span#errorOk").off('click').on('click',function(){
				var exerciseName = $('#exerciseName').html();
				console.log("Clicked button OK");
				/* ---- For Ok event ---- */
				var etTypeTemp = ds.getEt();
				var sleTypeText = ds.etOptionsText.subOptionLevelText;
				for(var key in exerciseNames){
					if(exerciseNames[key].exerciseText == exerciseName){
						ds.setEtText(exerciseNames[key].exerciseText);
						ds.setEt(key);						
					}
				}
				
				var exerciseTypeVal = ds.getEt();
				$('#propertiesLabel').empty();
				var propdiv = $('#propertiesLabel');
				propdiv.css('display','none');
				$('#propertiesDivLabel').remove();
				if(exerciseTypeVal == "SLE"){
					$('#canvas .header .title').html($('#exerciseName').html());
					ds.setOptionLabelText($('#sleOptions').html());
					var labeldivSLE = window.CD.util.getTemplate({url: 'resources/themes/default/views/layout_mode_design_SLE.html?{build.number}'});
					propdiv.append(labeldivSLE);
					$('#propertiesDivLabel').css('display','block');
					/* -- This method is used to make label local magnify text box and drop down non editable --- */
					SLEView.makeLabelLocalZoomDisable();
					$('#cdInspector .tab_view').on('click',function(){
						if($(this).hasClass('inactive')){
							$('#' + $(this).siblings('.tab_view.active').attr('name')).hide();
							$(this).siblings('.tab_view.active').removeClass('active').addClass('inactive');
							$(this).removeClass('inactive').addClass('active');
							$('#' + $(this).attr('name')).show();
							
							/* For Label Inspector div append*/
							if( $(this).attr('name') == 'localDiv' && $('#localDivInactive').length == 0 && (window.CD.elements.active.type != 'label' && window.CD.elements.active.type != 'dock')){
								window.CD.module.view.makeLabelLocalDisable();
							}
						}
					});
					SLEView.attachPublishEvents();
					SLEView.bindConnetorEvent();
					/** --- Modified for connector type change when label occurance is modified --- **/
					window.CD.module.data.globalConnectorType = 'none';
					
				}
				if(exerciseTypeVal == "CLS" ){
					$('#canvas .header .title').html($('#exerciseName').html());
					ds.setOptionLabelText($('#sleOptions').html());
					var labeldivCLS = window.CD.util.getTemplate({url: 'resources/themes/default/views/layout_mode_design_CLS.html?{build.number}'});
					propdiv.append(labeldivCLS);
					$('#propertiesDivLabel').css('display','block');
					$('#cdInspector .tab_view').on('click',function(){
						if($(this).hasClass('inactive')){
							$('#' + $(this).siblings('.tab_view.active').attr('name')).hide();
							$(this).siblings('.tab_view.active').removeClass('active').addClass('inactive');
							$(this).removeClass('inactive').addClass('active');
							$('#' + $(this).attr('name')).show();
							
							/* For Label Inspector div append*/
							if( $(this).attr('name') == 'localDiv' && $('#localDivInactive').length == 0 && (window.CD.elements.active.type != 'label' && window.CD.elements.active.type != 'dock')){
								window.CD.module.view.makeLabelLocalDisable();
							}
						}
					});
					CLSView.attachPublishEvents();
				}
				if(exerciseTypeVal == "COI" ){
					$('#canvas .header .title').html($('#exerciseName').html());
					ds.setOptionLabelText($('#coiOptions').html());
					var labeldivCOI = window.CD.util.getTemplate({url: 'resources/themes/default/views/layout_mode_design_COI.html?{build.number}'});
					propdiv.append(labeldivCOI);
					$('#propertiesDivLabel').css('display','block');
					$('#cdInspector .tab_view').on('click',function(){
						if($(this).hasClass('inactive')){
							$('#' + $(this).siblings('.tab_view.active').attr('name')).hide();
							$(this).siblings('.tab_view.active').removeClass('active').addClass('inactive');
							$(this).removeClass('inactive').addClass('active');
							$('#' + $(this).attr('name')).show();
							
							/* For Label Inspector div append*/
							if( $(this).attr('name') == 'localDiv' && $('#localDivInactive').length == 0 && (window.CD.elements.active.type != 'label' && window.CD.elements.active.type != 'dock')){
								COIView.makeLabelLocalDisable();
							}
						}
					});
					COIView.attachPublishEvents();
				}
				
				if(exerciseTypeVal == "PRG" ){
					$('#canvas .header .title').html($('#exerciseName').html());
					ds.setOptionLabelText($('#prgOptionsForLabel').html(),$('#prgOptionsForSentence').html());
					ds.etOptionsText.optionSentenceText = ($('#prgOptionsForSentence').html());
					var labeldivPRG = window.CD.util.getTemplate({url: 'resources/themes/default/views/layout_mode_design_PRG.html?{build.number}'});
					propdiv.append(labeldivPRG);
					$('#propertiesDivLabel').css('display','block');
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
				}
				
				/*$('#globalApply').off('click').on('click',function() {
					window.CD.module.view.globalApplyClick(errorModal);
					//window.CD.module.view.onClickShowHiddenTxtGlobal();
				});*/
				
				infoIconCLick();
					var type= exerciseNames[exerciseTypeVal].TYPE;
					for(var skey in type){
						if(type[skey] == $('#subOptions').html()){
							ds.setsubOptionLevel(skey);
						}
						if(type[skey] == ds.getOptionLabelText() && exerciseTypeVal == "COI"){
							ds.setOptionLabel(skey);
						}
					}
					var sOrder = "";
					for(var dkey in exerciseNames[exerciseTypeVal]){
						if(ds.getOptionSentenceText()!= "" && exerciseNames[exerciseTypeVal][dkey] == ds.getOptionSentenceText()){
							ds.etOptions.optionSentence = dkey;
						}
						if(exerciseNames[exerciseTypeVal][dkey] == ds.getOptionLabelText() && exerciseTypeVal != "COI" ){
							ds.setOptionLabel(dkey , "");
						}						
					}
			/* ------ Modified for activity setting issue on 19th June,2013 ------------ */
					if(ds.getOptionLabel() == "OTM"){
						ds.setsubOptionLevelText($('#subOptions').html());
					}else{
						ds.setsubOptionLevelText('');
					}
					if(etTypeTemp != ds.getEt()){
						window.CD.module.view.removeLabels();
						if(typeof window.CD.module.view.removeHint == "function"){
							window.CD.module.view.removeHint();
							window.CD.module.view.removeHintBox();
						}else{
							window.CD.module.view.removeHintFeedback();
						}
					}

					resetApp(etTypeTemp,sleTypeText);
					//Added to remove PRG instruction image from the canvas.
					if(etTypeTemp == 'PRG'){
						window.PRGView.hideIns();
					}
					if(exerciseTypeVal == "PRG" ){							
						$('#instructionText').css('display','block');
						$('#instructText').prop('checked',true);
						window.CD.module.view.setIns();
					}
						
					exerciseTypeSelect(exerciseTypeVal);
					subOptionView(ds.getOptionLabelText(),exerciseTypeVal);
					$('.button #updateFromInspector').addClass('inactive');
					$('#errorModal').slideUp(200);
					window.CD.module.view.bindInspectorEvents();
					if(etTypeTemp != ds.getEt()){
						window.CD.undoManager.clear();
						updateUndoRedoState(window.CD.undoManager);
					}

			});
			
			$("#errorModal span#errorCancel").off('click').on('click',function(){
				
				/* ------- For cancel event -------  */
				$('#exerciseName').html(ds.getEtText());
				
				var exerciseTypeVal;
				for(var key in exerciseNames){
					if(exerciseNames[key].exerciseText == $('#exerciseName').html()){
						exerciseTypeVal = key;
					}
				}
				if(exerciseTypeVal == "SLE" ||exerciseTypeVal == "CLS" ){
					$('#sleOptions').html(ds.getOptionLabelText());
				}
				
				if(exerciseTypeVal == "COI" ){
					$('#coiOptions').html(ds.getOptionLabelText());
					
				}
				
				if(exerciseTypeVal == "PRG" ){
					$('#prgOptionsForLabel').html(ds.getOptionLabelText());
					$('#prgOptionsForSentence').html(ds.getOptionSentenceText());
				}
				
				if(ds.getsubOptionLevelText())
					$('#subOptions').html(ds.getsubOptionLevelText());
				
				
				exerciseTypeSelect(exerciseTypeVal,true);
				subOptionView(ds.getOptionLabelText(),exerciseTypeVal);
				$('.button #updateFromInspector').addClass('inactive');
				$('#errorModal').slideUp(200);
			});
			$('#alertText .frame_warning_text').show();
			$('#errAlertText').html(alertStr);
			$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
			$('#alertMessage').slideDown(200);		
			
		}
	});
	$('#cdInspector span#cancelAllChanges').unbind().bind('click',function() {

		
		/* ------- For cancel event -------  */
		$('#exerciseName').html(initState.getEtText());
		
		var exerciseTypeVal;
		for(var key in exerciseNames){
			if(exerciseNames[key].exerciseText == $('#exerciseName').html()){
				exerciseTypeVal = key;
			}
		}
		if(exerciseTypeVal == "SLE" ||exerciseTypeVal == "CLS" ){
			$('#sleOptions').html(initState.getOptionLabelText());
		}
		
		if(exerciseTypeVal == "COI" ){
			$('#coiOptions').html(initState.getOptionLabelText());
		}
		
		if(exerciseTypeVal == "PRG" ){
			$('#prgOptionsForLabel').html(initState.getOptionLabelText());
			$('#prgOptionsForSentence').html(initState.getOptionSentenceText());
		}
		
		if(initState.getsubOptionLevelText())
			$('#subOptions').html(initState.getsubOptionLevelText());
		
		
		exerciseTypeSelect(exerciseTypeVal,true);
		subOptionView(initState.getOptionLabelText(),exerciseTypeVal);
		$('.button #updateFromInspector').addClass('inactive');
	
	});
	function loadData(){
		$('#canvas .header .title').html(ds.getEtText());
		
		$('#cdInspector #exerciseName').html(ds.getEtText());
		
		if(ds.getEt() == "COI"){
			$('#cdInspector #tableCOI').show();
			$('#cdInspector #coiOptions').html(ds.getOptionLabelText());
			$("#propertiesDivLabel").css("display", "block");
			$('.lblInspector').attr('id','lblInteractionCOI');
			
		} else if(ds.getEt() == "PRG") {
			$('#cdInspector #tablePRG').show();
			$('#cdInspector #prgOptionsForLabel').html(ds.getOptionLabelText());
			$('#cdInspector #prgOptionsForSentence').html(ds.getOptionSentenceText());
			$("#propertiesDivLabel").css("display", "block");
			$('.lblInspector').attr('id','lblInteractionPRG');
			$('#cdInspector #subOption').hide();
		} 
		else if(ds.getEt() == "CLS") {
			$('#cdInspector #tableSLE').show();	
			$('#cdInspector #sleOptions').html(ds.getOptionLabelText());
			$("#propertiesDivLabel").css("display", "block");
			$('.lblInspector').attr('id','lblInteractionSLE');
		} 
		else {
			$('#cdInspector #tableSLE').show();	
			$('#cdInspector #sleOptions').html(ds.getOptionLabelText());
			$("#propertiesDivLabel").css("display", "block");
			$('.lblInspector').attr('id','lblInteractionSLE');
			
		}
		if(ds.getOptionLabel() == "OTM" && ds.getEt() != "COI" && ds.getEt() != "PRG"){
			$('#cdInspector #subOption').show();
			if(ds.getsubOptionLevelText() != ""){
				$('#cdInspector #subOptions').html(ds.getsubOptionLevelText());
			}else{
				ds.setsubOptionLevelText($('#cdInspector #subOptions').html());
			}
		}else{
			$('#cdInspector #subOption').hide();	
		}
		subOptionView("", ds.getEt());
		
	}
	$('#cdInspector #displayGrid').on('click',function() {
		that.cnv.showHideGrid($(this).prop('checked'));
	});	
	
	$('#cdInspector #hideGuide').on('click',function() {
		that.cnv.hideGuides($(this).prop('checked'));
	});	
	$('#cdInspector #lockGuide').on('click',function() {
		that.cnv.lockGuides($(this).prop('checked'));
	});
	$('#cdInspector #snapToGuide').on('click',function() {
		if(!$(this).prop("checked")){
			window.CD.elements.active.element[0].off("dragmove.snap");
		}else{
			that.cnv.attachSnapEvent(window.CD.elements.active.element[0],"all");
		}
	});
	
	$('#cdInspector #deleteGuide').on('click',function() {
		if(!$(this).hasClass("inactive")){
			var alertStr = "";	
			$('#toolPalette #errorModal').remove();
			alertStr = "Are you sure? This will delete your guides and can't be undone.";
			if(alertStr != ""){	
				$('#toolPalette').append(errorModal);
				$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
				$("#errorContainer span#errorOk").off('click').on('click',function(){
					$('#errorModal').slideUp(200);
					$('#toolPalette #errorModal').remove();
					that.cnv.deleteAllGuides();
				});
				
				$("#errorModal span#errorCancel").off('click').on('click',function(){
					$('#errorModal').slideUp(200);
					$('#toolPalette #errorModal').remove();
				});
				$('#alertText .frame_warning_text').show();
				$('#errAlertText').html(alertStr);
				$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
				$('#alertMessage').slideDown(200);		
			}
		}
		
		
	});
	
	$("#cdInspector #stdGUIReset").on('click',function(){
		window.CD.module.frame.hideShowStdGUI('R',$(this).prop('checked'));	
	});
	$("#cdInspector #stdGUIZoom").on('click',function(){
		window.CD.module.frame.hideShowStdGUI('Z',$(this).prop('checked'));	
	});
	//var stageWidth = cd.width < 800? 800 : cd.width;
	//resizeMe((cd.height+100), (stageWidth+300));
	
	
	function initLayout(instanceObj)
	{
		getResources(instanceObj.stgConfig);
		render(instanceObj.stgConfig);
		accordionView();
		
	}
	
	function initCanvas(instanceObj){
		if($('canvas').length > 0){
			console.info("@Stage.initCanvas:: canvas already exist.");
		}else{
			new Canvas(instanceObj);
		}
	}
	
	function initTools(instanceObj){
		console.log("@initTools::Initiate Tools");
		var baseTool = new BaseTool(this);
		
		baseTool.initCreateToolSet();
		baseTool.initFormatToolSet();
		baseTool.initAlignToolSet();
		baseTool.initCAlignToolSet();
	}
	function getResources(stgConfig){
	    var Util = window.CD.util;	   
	    console.log('@Stage.getResources');
	    /* --------get the view html template---------*/
	    stgConfig.layout_template = Util.getTemplate({
	                                    url: 'resources/themes/' + stgConfig.theme_id + '/views/layout_mode_' + stgConfig.mode + '.html'
	                                });
	 }
	 function render(stgConfig) {
		 console.log('@Stage.render');
		    stgConfig.active_tool = 'select';
		    stgConfig.layout_template = stgConfig.layout_template.replace('$$INSTANCE_ID$$', stgConfig.id);
		    stgConfig.layout_template = stgConfig.layout_template.replace('$$INSTANCE_ID$$', stgConfig.id);
		    stgConfig.layout_template = stgConfig.layout_template.replace('$$INSTANCE_ID$$', stgConfig.id);
		    stgConfig.layout_template = stgConfig.layout_template.replace('$$THEME_ID$$', stgConfig.theme_id);
		    $('#' + stgConfig.html_id).html(stgConfig.layout_template);

		   }
	function accordionView(){
		$('#cdInspector').accordion({

	        collapsible:true,
	        active: 1 
		});
		
		$('.insert_media span').each(function(){
			$(this).click(function(){
			if($(this).hasClass('gray_enabled')){
				$('#' + $(this).siblings('.gray_disabled').attr('name')).hide();
				$(this).siblings('.gray_disabled').removeClass('gray_disabled').addClass('gray_enabled');
				$(this).removeClass('gray_enabled').addClass('gray_disabled');
				$('#' + $(this).attr('name')).show();
				
			}
			});
		});
		
	}
	//Create Canvas
	//this.edConfig.canvas_set.push(new Canvas(that));
	 
	 //--New for Accordion-----
	 
	
	 
	 function updateInspectorWH() {
		 $('#canvasWidth').val(cd.width);
		 $('#canvasHeight').val(cd.height);
	 }
	 function enableSelectBoxes(){
		
		$('div.select_box').each(function(){
				$(this).children('span.selected').html($(this).children('div.select_options').children('span.select_option:first').html());
				$(this).attr('value',$(this).children('div.select_options').children('span.select_option:first').attr('value'));
				
				$(this).children('span,span.select_box').click(function(){
					if($(this).parent().children('div.select_options').css('display') == 'none'){
						$(this).parent().children('div.select_options').css('display','block');
						if($(this).hasClass('indexCheck')){
							$(this).parent().children('div.select_options').css('z-index',999);
						}
					}
					else
					{
						$(this).parent().children('div.select_options').css('display','none');
						if($(this).hasClass('indexCheck')){
							$(this).parent().children('div.select_options').css('z-index',0);
						}
					}
				});
				
				
				$(this).find('span.select_option').click(function(){	
					var eValType="";
						$(this).parent().css('display','none');
						$(this).closest('div.select_box').attr('value',$(this).attr('value'));
						$(this).parent().siblings('span.selected').html($(this).html());
						
						if($(this).parents('#fontTool').length > 0){
							$("#fontTextbox").val($(this).html());
							window.CD.module.data.Json.adminData.GFS = parseInt($(this).html());
							$('#toolPalette #fontTextbox').on('blur',function(){
								var updatedFont=window.CD.module.data.Json.adminData.GFS;
								if(!(($(this).val()).match(/[0-9]+/))){
									$(this).val(updatedFont);
								}else{
									$(this).val(parseInt($(this).val()));
								}
							});
							if(window.CD.elements.active.type == 'text'|| window.CD.elements.active.type == 'canvastext'){
								allTextStyling.setActiveTextFontSize();
							}else if(window.CD.elements.active.type == 'labeltext'){
								stageLabelTextTool.setActiveTextFontSize();						
							}else if(window.CD.elements.active.type == 'docktext'||window.CD.elements.active.type == 'dock'){
								dockTextTool.setActiveTextFontSize();						
							}else if(window.CD.elements.active.type == 'commonLabelText'||window.CD.elements.active.type == 'label'){
								  var commonText =new TextTool.commonLabelText();
								  var labelStyle = new labelTextStyle();
								  commonText.clearAlignClicked();
								  labelStyle.setActiveTextFontSize();
							}else if(window.CD.elements.active.type == 'frame' && $.isNumeric(parseInt($(this).html()))){   //the condition can be deleted to change the font size, add by SS
								ds.updateGlobalFont($(this).html());  
							}
						}
						
						for(var key in exerciseNames){
							if(exerciseNames[key].exerciseText == $('#exerciseName').html()){
								eValType = key;								
							}
						}
						if($(this).parent().siblings('#exerciseName').length > 0){							
							exerciseTypeSelect(eValType);
						}
						
						
						var exerciseTypeTemp="";
						var tempNode ="";
						if($(this).parents('#subOption').length > 0 || $(this).parents('#tablePRG').length > 0 || $(this).parents('#tableCOI').length > 0 || $(this).parents('#tableSLE').length > 0){
							for(var key in exerciseNames){
								if(exerciseNames[key].exerciseText == $('#exerciseName').html()){
									exerciseTypeTemp= key;
								}
							}
							 
							var flag = false;
							
							if(exerciseTypeTemp != ds.getEt()){
								flag = true;
							}
							if(exerciseTypeTemp == "SLE" || exerciseTypeTemp == "CLS" ){
								if(ds.getOptionLabelText() != $('#sleOptions').html()){
									flag = true;
									
								}
							}
							if(exerciseTypeTemp == "COI" ){
								if(ds.getOptionLabelText() != $('#coiOptions').html()){
									flag = true;
								
								}
							}
							if(exerciseTypeTemp == "PRG" ){
								if(ds.getOptionLabelText() != $('#prgOptionsForLabel').html() && ds.getOptionLabelText()){
									flag = true;
									
								}
								if(ds.getOptionSentenceText() != $('#prgOptionsForSentence').html()){
									flag = true;
									
								}
							}
							if(ds.getsubOptionLevelText() != $('#subOptions').html() && ds.getsubOptionLevelText() != ""){
								flag = true;
								
							}
							if(flag){
								$('.button #updateFromInspector').removeClass('inactive');
							}else{
								$('.button #updateFromInspector').addClass('inactive');
							}

						}
						subOptionView($(this).html(),eValType);
				});	
				$('body').on('keydown',function(e) {
				    // ESCAPE key pressed
				    if (e.keyCode == 27) {
				    	$('div.select_options').each(function(){
				    		$(this).hide();
				    	});
				    }
				});				
			});	
			$(document).not("div.select_options").click(function(e) {
				if((!($(e.target).hasClass('select_box'))) && ($(e.target).parents('.select_box').length == 0)) {					
					$('div.select_options').hide();
				}
				if(typeof window.CD.module.view.handleConnectorTypeChange == "function"){
					window.CD.module.view.handleConnectorTypeChange($(e.target).parents('.select_box').find('span.selected'));
				}
		    });
			
			
		}
	 
	 	
		function exerciseTypeSelect(value, cancel){		
			cancel = cancel || "";
			if(value || cancel){
				if(ds.getEt() != value){
					$('.button #updateFromInspector').removeClass('inactive');
				}else{
					$('.button #updateFromInspector').addClass('inactive');
				}
				$('#cdInspector #tableSLE').hide();
				$('#cdInspector #tablePRG').hide();
				$('#cdInspector #tableCOI').hide();
				$('#cdInspector #subOption').hide();
				
				switch(value) {
				case "PRG" :
					$('#cdInspector #tablePRG').show();
					$('.lblInspector').attr('id','lblInteractionPRG');
					if(ds.getEt() != value){
						$('#cdInspector #prgOptionsForLabel').html(exerciseNames[value]["OTO"]);
						$('#cdInspector #subOptions').html(exerciseNames[value]["TYPE"]["DLO"]);
					}else{
						$('#cdInspector #prgOptionsForLabel').html(ds.getOptionLabelText());
						if(ds.getOptionLabel() == "OTM"){
							$('#cdInspector #subOption').hide();
							$('#cdInspector #subOptions').html(ds.getsubOptionLevelText());
						}	
					}	
					break;
				case "COI":
					$('#cdInspector #tableCOI').show();	
					$('.lblInspector').attr('id','lblInteractionCOI');
					if(ds.getEt() != value){
						$('#cdInspector #coiOptions').html(exerciseNames[value]["TYPE"]["SS"]);
					}else{
						$('#cdInspector #coiOptions').html(ds.getOptionLabelText());
					}
					break;
				case "SE":	
					break;
				case "CLS":
					$('#cdInspector #tableSLE').show();		
					$('.lblInspector').attr('id','lblInteractionSLE');
					if(ds.getEt() != value){
						$('#cdInspector #sleOptions').html(exerciseNames[value]["OTO"]);
						$('#cdInspector #subOptions').html(exerciseNames[value]["TYPE"]["DLO"]);
					}else{
						$('#cdInspector #sleOptions').html(ds.getOptionLabelText());
						if(ds.getOptionLabel() == "OTM"){
							$('#cdInspector #subOption').show();
							$('#cdInspector #subOptions').html(ds.getsubOptionLevelText());
						}							
					}
					break;
				case "SLE":					
					$('#cdInspector #tableSLE').show();	
					$('.lblInspector').attr('id','lblInteractionSLE');
					if(ds.getEt() != value){
						$('#cdInspector #sleOptions').html(exerciseNames[value]["OTO"]);
						$('#cdInspector #subOptions').html(exerciseNames[value]["TYPE"]["DLO"]);
					}else{
						$('#cdInspector #sleOptions').html(ds.getOptionLabelText());
						if(ds.getOptionLabel() == "OTM"){
							$('#cdInspector #subOption').show();
							$('#cdInspector #subOptions').html(ds.getsubOptionLevelText());
						}	
					}
					break;		
				}
			}			
		}
		
		function subOptionView(node, exType){
			
			var exVal = exerciseNames[exType];
			if(exType != "COI" && exType != "PRG"){
				if(node != ""){
					for(var key in exVal){					
						if(exVal[key] == node){
							if(key == "OTM"){
								$('#cdInspector #subOption').show();
							}							
							else{
								if(key == "OTO"){
									$('#cdInspector #subOption').hide();									
								}
							}							
						}						
					}
					if(exVal["TYPE"]["DLO"] == node){
						$('#cdInspector #subOption').show();
						$('#cdInspector #subOptions').html(exerciseNames[exType]["TYPE"]["DLO"]);
						if(exType == "SLE" || exType == "CLS"){
							$('#sleOptions').html(exerciseNames[exType]["OTM"]);
						}else{
							if(exType == "PRG"){
								$('#prgOptionsForLabel').html(exerciseNames[exType]["OTM"]);
							}
						}
					}
					if(exVal["TYPE"]["DLE"] == node){						
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
				}else{
					if(ds.getsubOptionLevel() == ""){
						$('#cdInspector #subOption').hide();
					}else if(ds.getsubOptionLevel() == "DLO"){
							
							$('#cdInspector #subOptions').html(exerciseNames[exType]["TYPE"]["DLO"]);
							if(exType == "SLE" || exType == "CLS"){
								$('#cdInspector #subOption').show();
								$('#sleOptions').html(exerciseNames[exType]["OTM"]);
							}else{
								if(exType == "PRG"){
									$('#cdInspector #subOption').hide();
									$('#prgOptionsForLabel').html(exerciseNames[exType]["OTM"]);
								}
							}
						}else{
							if(ds.getsubOptionLevel() == "DLE"){
								
								$('#cdInspector #subOptions').html(exerciseNames[exType]["TYPE"]["DLE"]);
								if(exType == "SLE" || exType == "CLS"){
									$('#cdInspector #subOption').show();
									$('#sleOptions').html(exerciseNames[exType]["OTM"]);
								}else{
									if(exType == "PRG"){
										$('#cdInspector #subOption').hide();
										$('#prgOptionsForLabel').html(exerciseNames[exType]["OTM"]);
									}
								}
							}
						}								
					}							
				}			
			}
		/*$("#cancelFrameChanges").on('click',function(){
			var frameSize = window.CD.module.frame.getActiveFrameSize();
			$('#activeFrameWidth').val(frameSize.width);
			$('#activeFrameHeight').val(frameSize.height);
		});*/
		$('#applyFrameChanges').on('click',function() {
			if(window.CD.elements.active.type == 'frame') {
				var minFrameWidth = parseInt(window.CD.module.frame.frameMinWidth);
				var minFrameHeight = parseInt(window.CD.module.frame.frameMinHeight);
				var maxFrameWidth = parseInt($('#canvasWidth').val());
				var maxFrameHeight = parseInt($('#canvasHeight').val());
				var activeWVal = parseInt($('#activeFrameWidth').val());
				var activeHVal = parseInt($('#activeFrameHeight').val());
				
				var alertMsg = "";	
				
				 var regex = /[0-9 -()+]+$/;
				 if(regex.test($('#activeFrameWidth').val()) && regex.test($('#activeFrameHeight').val())){
					 if(activeWVal < maxFrameWidth && activeHVal < maxFrameHeight && activeWVal >= minFrameWidth && activeHVal >= minFrameHeight){
							window.CD.module.frame.updateFrame({'width':$('#activeFrameWidth').val(), 'height':$('#activeFrameHeight').val(), 'fill':$("#fillFrame").is(':checked')});
					 }else{
						if($.trim($('#activeFrameWidth').val()) == "")
							alertMsg += "The width cannot be left blank. <br/><br/>";
						if($.trim($('#activeFrameHeight').val()) == "")
							alertMsg += "The height cannot be left blank. <br/><br/>";
						if(activeWVal >= maxFrameWidth)
							alertMsg += "The width of the frame cannot be greater than the width of the canvas.<br/><br/>";
						if(activeHVal >= maxFrameHeight)
							alertMsg += "The height of the frame cannot be greater than the height of the canvas.";
						if(activeWVal < minFrameWidth)
							alertMsg += "The width of the frame must be greater than or equal to "+minFrameWidth+". <br><br/>";
						if(activeHVal < minFrameHeight)
							alertMsg += "The height of the frame must be greater than or equal to "+minFrameHeight+".";
					}
					if(alertMsg != ""){
						$('#toolPalette #errorModal').remove();
						$('#toolPalette').append(errorModal);
						
						$("#errorModal span#errorCancel").hide();
						$("#errorModal span#errorOk").html("Ok");
						$('#warningText .frame_warning_text').show();
						$('#errorModal #errAlertText').html(alertMsg);
						$('#errorModal').slideDown(200);		
						$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
					}
					$("#errorContainer span#errorOk").off('click').on('click',function(){	
						//$('#activeFrameWidth').removeClass('warning_input');
						//$('#activeFrameHeight').removeClass('warning_input');
						$('#errorModal').slideUp(200);
						
						var frameSize = window.CD.module.frame.getActiveFrameSize();
						$('#activeFrameWidth').val(frameSize.width);
						$('#activeFrameHeight').val(frameSize.height);
						
					});
				 }else{
					var frameSize = window.CD.module.frame.getActiveFrameSize();
					$('#activeFrameWidth').val(frameSize.width);
					$('#activeFrameHeight').val(frameSize.height);
				 }
			}
		});
		
		/*
		 * For align labels to frame popup
		 * By nabonita bhattacharyya
		 */
		
		$('#alignLabelsToFrame').off('click').on('click',function(){
			if(!$('#alignLabelsToFrame').hasClass('inactive')){
				var frameModal = 
					 window.CD.util.getTemplate({url: 'resources/themes/default/views/frame_align_label_modal.html'});
				 $(frameModal).remove();
			      $('#frameAlignModal').remove();
				  $('body').append(frameModal);	
				  $('#frameAlignModal').css('left', (($('#toolPalette').width()/2) - ($('#frameAlignModal').width()/2))+'px');
				  $('#frameAlignModal').css('top', (($('#canvasHeight').val()/2) - ($('#frameAlignModal').height()/2))+'px');
				  $('#frameAlignModal').slideDown(200);
				  $('#frameAlignModal .input_text').off('keydown').on('keydown',function(e){
					  var inputVal = $(this).val();
					  var returnVal= checkVal(inputVal,e);
					  return returnVal;
				        
					});
				  /* ----------- Cancel Click ---------------- */
				  $("#frameAlignModal span#frameAlignCancel").off('click').on('click',function(){
					  $('#frameAlign').remove();
					  $('.button #updateFromInspector').addClass('inactive');
					  $('#frameAlignModal').slideUp(200);
					});
				  /* -------------- Ok Click ----------------- */
				  $("#frameAlignModal span#frameAlignOk").off('click').on('click',function(){
					  	$('#frameAlign').remove();
						$('.button #updateFromInspector').addClass('inactive');
						
						var activeElement = window.CD.elements.active.element[0];
						var frameGroupId = activeElement.attrs.id;
						var noOfCols = $('#noOfColumns').val();
						var calcCount = window.CD.module.frame.getTotalLabelCount();
						var frameBuffer = $('#userBuffer').val();
						var frameOrigHeight = activeElement.children[0].getHeight();
						var frameOrigWidth = activeElement.children[0].getWidth();
						var outputJSon = window.CD.module.data.getJsonData();
						var count = that.cnv.objLength(outputJSon);
						
						var frameWidth = (frameOrigWidth-(parseInt(frameBuffer)*(parseInt(noOfCols)+1)))/parseInt(noOfCols);
						var adminData = window.CD.module.data.getJsonAdminData();
						var oldAdminData = adminData;
						var oldOutputJson = outputJSon;
						var oldLabelWidth = adminData.SLELD.split(',')[0];
						var oldLabelHeight = adminData.SLELD.split(',')[1];
						
						var newLabelWidth = Math.round((frameOrigWidth-(parseInt(frameBuffer)*(parseInt(noOfCols)+1)))/parseInt(noOfCols));
						
						var labelCount = parseInt(noOfCols);
						
						if(window.CD.module.data.Json.adminData.OTM == true){
							var lblCnt = Math.ceil(calcCount/parseInt(labelCount));
						}else{
							var lblCnt = Math.ceil(count/parseInt(labelCount));
						}
						
						var newLabelHeight = Math.round((frameOrigHeight-(parseInt(frameBuffer)*(parseInt(lblCnt)+1)))/parseInt(lblCnt));
						
						/* ------------------------------------------- */
						if(parseInt(newLabelWidth)>=30 && parseInt(newLabelHeight)>=30){//For label height width greater than 50 validation
							/* ----------- For undo -------------- */
							var undoMng = window.CD.undoManager;
							var exerciseType = ds.getEt();
							var oldObject = {};
							if(exerciseType == 'PRG'){
								for(var eachLabel in outputJSon){
									oldObject[eachLabel]={'x' : outputJSon[eachLabel].term_pos_x,
															'y' : outputJSon[eachLabel].term_pos_y };
								}
							}else{
								for(var eachLabel in outputJSon){
									oldObject[eachLabel]={'x' : outputJSon[eachLabel].holder_x,
															'y' : outputJSon[eachLabel].holder_y };
								}
							}
							var alignLabelData = {};
							alignLabelData.noOfColumns = $('#noOfColumns').val();
							alignLabelData.frameBuffer = frameBuffer;
							alignLabelData.noOfRows = lblCnt;
							alignLabelData.frameOrigHeight = frameOrigHeight;
							alignLabelData.frameOrigWidth = frameOrigWidth;
							alignLabelData.frameGroupId = frameGroupId;
							undoMng.register(this, window.CD.module.frame.undoAlignLabelToFrames,[oldLabelWidth,oldLabelHeight,oldObject] , 'Undo align labels to frame',this,window.CD.module.frame.adjustLabelAsFrame,[alignLabelData],'Redo align labels to frame');
							updateUndoRedoState(undoMng);
							
							if(parseInt(noOfCols)<=10 && parseInt(noOfCols)>0 && parseInt(frameBuffer)<=30 &&  parseInt(frameBuffer)>=0){
								var lblCnt = Math.ceil(count/parseInt(noOfCols));
								var frameNewHeight = (frameOrigHeight-(parseInt(frameBuffer)*(parseInt(lblCnt)+1)))/parseInt(lblCnt);
								window.CD.module.frame.adjustLabelAsFrame({'noOfColumns':$('#noOfColumns').val(),'frameBuffer':frameBuffer,'noOfRows':lblCnt,'frameOrigHeight':frameOrigHeight,'frameOrigWidth':frameOrigWidth,'frameGroupId':frameGroupId});
								$('#frameAlignModal').slideUp(200);
							}else{
								if(parseInt(noOfCols)>10){
									validation.showLabelErrorPOPUP(15);
								}
								if(parseInt(noOfCols)<=0){
									validation.showLabelErrorPOPUP(15);
								}
								if(parseInt(frameBuffer)>30 || parseInt(frameBuffer)<0){
									validation.showLabelErrorPOPUP(18);
								}
								
								if((!(noOfCols.match(/[0-9]+/))||(noOfCols.match(/[!@#$%\^&*(){}[\]<>?/|\-]/)))||(!(frameBuffer.match(/[0-9]+/))||(frameBuffer.match(/[!@#$%\^&*(){}[\]<>?/|\-]/)))){
									validation.showLabelErrorPOPUP(16);
								}
							}
						}
						else if(noOfCols <= 0){//for zero column given as input
							validation.showLabelErrorPOPUP(28);
						}
						else{
							validation.showLabelErrorPOPUP(24);//Label height width greater than 50px validation
						}
						
						
							
					});
			}
		});
		
		$("#deleteElement").on('click',function(){
			if( window.CD.elements.active.type == 'guide'){
				that.cnv.deleteActiveElement();
			}else if(!$(this).hasClass("inactive_del")){
				var alertStr = "";
				$('#toolPalette #errorModal').remove();
				alertStr = "Are you sure you want to delete this?";
				errorOkTxt = "yes";
				if(alertStr != ""){	
					$('#toolPalette').append(errorModal);
					$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
					$("#errorContainer span#errorOk").off('click').on('click',function(){
						$('#errorModal').slideUp(200);
						$('#toolPalette #errorModal').remove();
						that.cnv.deleteActiveElement();
					});
					
					$("#errorModal span#errorCancel").off('click').on('click',function(){
						$('#errorModal').slideUp(200);
						$('#toolPalette #errorModal').remove();
					});
					$('#alertText .frame_warning_text').show();
					$('#errAlertText').html(alertStr);
					$('#errorOk').html(errorOkTxt);
					$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
					$('#alertMessage').slideDown(200);		
				}
			}
  });
		
		/*
		 * For Apply Click of Label Inspector
		 * Min height and width should be 50px
		 */
		
		$('#globalApply').off('click').on('click',function() {
			window.CD.module.view.globalApplyClick(errorModal);
			//window.CD.module.view.onClickShowHiddenTxtGlobal();
		});
		/*
		 * For cancel click event of label inspector
		 */
		$('#labelCancel').off('click').on('click',function(){
			window.CD.module.view.labelCancelEvent();
		});
			
		/*
		 * Cancel event for Frame
		 */
		$('#cancelFrameChanges').unbind('click').bind('click',function(){
			window.CD.module.frame.frameCancel();
		});
		/*
		 * On focus out from hint text area updateHintFeedbackVal() from SLEData 
		 * is called to update the value in JSON
		 */
	
		
		/*on click on local hide text in label inspector*/
		$('#globalDiv #showHiddenTxtGlobal').on('click',function(){
			//window.CD.module.view.onClickShowHiddenTxtGlobal();
			
		});
		
		/*
		 * This is used to show each info icon explanation
		 */
		infoIconCLick();
		$(".loader-overlay").hide();
}
/**
 * This is used for info-icon click event binding
 */
function infoIconCLick(){
	$('.info_icon').off('click').on('click',function(){
		if($(this).hasClass('labelInspectorIcon')){
			window.CD.module.view.onClickShowInfoIcon(this);
		}else{
			var nameVal=$(this).attr('id');
			var newId = nameVal+'Id';
			var activityInfoIconDetail = window.CD.util.getTemplate({url: 'resources/themes/default/views/inspector_info_icon.html?{build.number}'});
			$('body #activitySettingsIconModal').remove();
			$('body').append(activityInfoIconDetail);
			$('body #activitySettingsIconModal #'+newId).css('display','block');
			$('#activitySettingsIconModal').css('left', (($('#toolPalette').width()/2) - ($('#activitySettingsIconModal').width()/2))+'px');
			$('#activitySettingsIconModal').css('top', ((($('#canvasHeight').val()/2) - ($('#activitySettingsIconModal').height()/2))+100)+'px');
			$("#activitySettingsIconModal span.close_class").off('click').on('click',function(){
				$('#activitySettingsIconModal').css('display','none');
			});
		}
	});
}
function checkVal(inputVal,e){	
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
}


function openInspector(type) {
	
	/** --- Here case 'canvas' is having the value of HTML object hence need to handle it like this --- **/
	if(type == 'canvas'){
		if(window.CD.module.frame.canvasTextBoxW != undefined){
			$('#boxWidth').val(window.CD.module.frame.canvasTextBoxW);
			$('#boxHeight').val(window.CD.module.frame.canvasTextBoxH);
		}
	}
	
	switch(type) {
	case 'frame':
		$( "#cdInspector" ).accordion( "option", "active", 3 );
		//$(window).scrollTop($("#ui-accordion-cdInspector-header-3").offset().top);
		break;
	case 'text':
		$( "#cdInspector" ).accordion( "option", "active", 1 );
		//$(window).scrollTop($("#ui-accordion-cdInspector-header-1").offset().top);
		break;
	case 'label':
		$( "#cdInspector" ).accordion( "option", "active", 2 );		
		//$(window).scrollTop($("#ui-accordion-cdInspector-header-2").offset().top);
		/*$('#propertiesDivLabel #globalDiv').css('display','none');
		$('#propertiesDivLabel #localDiv').css('display','block');
		$('#propertiesDivLabel').find('div[name="globalDiv"]').addClass('inactive').removeClass('active');
		$('#propertiesDivLabel').find('div[name="localDiv"]').addClass('active').removeClass('inactive')*/
		break;
	case 'image':
		break;
	case 'canvas':
		$( "#cdInspector" ).accordion( "option", "active", 1 );
		if(window.CD.module.frame.canvasTextBoxW != undefined){
			$('#boxWidth').val(window.CD.module.frame.canvasTextBoxW);
			$('#boxHeight').val(window.CD.module.frame.canvasTextBoxH);
		}	
		//$(window).scrollTop($("#ui-accordion-cdInspector-header-1").offset().top);
		break;
	}
}
/**
 * Usage: Called from basetool.js to enable and disable undo&redo button
 * @param undoManager
 */
function updateUndoRedoState(undoManager){
	if(!undoManager.hasUndo()){
		$('.tool_undo').attr('disabled', !undoManager.hasUndo());
		$('.tool_undo').addClass("disable");
	}else{
		$('.tool_undo').attr('disabled', undoManager.hasUndo());
		$('.tool_undo').removeClass("disable");
	}
	
	if(!undoManager.hasRedo()){
		$('.tool_redo').attr('disabled', !undoManager.hasRedo());
		$('.tool_redo').addClass("disable");
	}else{
		$('.tool_redo').attr('disabled', undoManager.hasRedo());
		$('.tool_redo').removeClass("disable");
	}
}

