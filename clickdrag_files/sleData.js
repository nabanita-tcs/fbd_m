var SLEData = {
	Json : {},
	customLanguageFlage:'',
	tempImgName:[],
	tempImgId:[],
	customPublishFlag:false,
	globalConnectorType : 'none',
	textGroupComponent : [],
	globalHideText : false,
	showHiddenTextInAuthoring : false,
	init: function(inputJSON) {
		var cd = window.CD;
		var cs = window.CD.services.cs;
		if(cd.questionState == 'new'){
			console.log("@dataservices.initializeModuleData");
			this.Json = jQuery.extend(true, {}, sleDefaultData);//cs.cloneObject(sleDefaultData);  
		}else if(cd.questionState == 'edit'){
			this.Json = inputJSON;
			/*var jsonObj = $.parseJSON(rawDataString);
			if(typeof jsonObj == 'object'){
				this.Json = jsonObj;
			}else{
				this.processString(rawDataString);
			}*/
		}
		//this.showSLELabel(this.Json);
	},
	processString: function(rawDataString) {
		var sleCount = 0; 
		var frameCount = 0; 
		var dataMap = new Array();
		rawDataStringParts = rawDataString.split(';');
		for(var counter in rawDataStringParts){		
			var key = rawDataStringParts[counter].substr(0, rawDataStringParts[counter].indexOf("="));
			var value = rawDataStringParts[counter].substr(rawDataStringParts[counter].indexOf("=") + 1);
			dataMap[key] = value;
			if(key.match(/SLE[0-9]+/)){
				sleCount++;
			}	
			if(key.match(/CF[0-9]+/)){
				frameCount++;
			}	
		}
		var sledataString = {
				'adminData': {
					'GFS': dataMap['GFS'],   
					'CSO': dataMap['CSO'],
					'OTM': dataMap['OTM'],
					'OTO': dataMap['OTO'],
					'AW': dataMap['AW'],
					'AH': dataMap['AH'],
					'TYPE': dataMap['TYPE'],
					'HRO': dataMap['HRO'],
					'FRO': dataMap['FRO'],
					'RLO': dataMap['RLO'],
					'ICS': dataMap['ICS'],
					'HGL': dataMap['HGL'] != ''? dataMap['HGL'].split(',') : [],
					'VGL': dataMap['VGL'] != ''? dataMap['VGL'].split(',') : [],
					'ET': dataMap['ET'],
					'SLELD': {
						'width': dataMap['SLELD'].split(',')[0],
						'height': dataMap['SLELD'].split(',')[1]
						},
					'ZHP': dataMap['ZHP'],
					'feedbackHeight':'70',
					'feedbackWidth':'120',
					'AVP': dataMap['AVP'],
					'DOCSAMEASLABEL': true,
					'showZoomInAuth':'F',
					'audioList':[],
					'imageList':[],
					'showHintOrFeedbackInAuthoring':'none'
				},
				'DCKLD': dataMap['DCKLD'],
				'FrameData': [],
				'SLEData': {},
				'SLEGV': dataMap['SLEGV']!=undefined?dataMap['SLEGV']:'',
				'SLERQ': dataMap['SLERQ']!=undefined?dataMap['SLERQ']:'',
				'SLERN': dataMap['SLERN']!=undefined?dataMap['SLERN']:'',
				'SLEPS': {},
				'SLEGP': {
					'borderGlobal': dataMap['SLEGP'].split(',')[0],
					'backGroundGlobal': dataMap['SLEGP'].split(',')[1],
					'labelBorderGlobal': dataMap['SLEGP'].split(',')[2],
					'labelBGGlobal': dataMap['SLEGP'].split(',')[3],
					'dockBGGlobal': dataMap['SLEGP'].split(',')[4]
				},
				'SLEDXY': dataMap['SLEDXY']!=undefined?{}:'',
				'VST': dataMap['VST']!=undefined?dataMap['VST']:'',
				'SLEDS': dataMap['SLEDS']!=undefined?dataMap['SLEDS']:'',
				'SLESD': dataMap['SLESD']!=undefined?dataMap['SLESD']:'',
				'SLEDC': dataMap['SLEDC']!=undefined?dataMap['SLEDC']:''
		};
		
		if(dataMap['SLEDXY']!=undefined){
			var sledxy = dataMap['SLEDXY'].split(',');
			var sldxyArr = new Array();
			var sledxylen = sledxy.length;
			for(var i=0; i<sledxylen; i++) {
				var tmp = sledxy[i].split('%');
				var tmp1 = {'x':tmp[0]!=undefined?tmp[0]:'', 'y':tmp[1]!=undefined?tmp[1]:''};
				sldxyArr[i]=tmp1;
			}
			sledataString.SLEDXY = sldxyArr;
		}
		
		var tmpps = dataMap['SLEPS'].split(',');
		sledataString.SLEPS['totalRandomLabels'] = tmpps[0];
		sledataString.SLEPS['disableFeedback'] = tmpps[1];
		sledataString.SLEPS['disableInstantFeedback'] = tmpps[2];
		sledataString.SLEPS['disableHints'] = tmpps[3];
		sledataString.SLEPS['studentGradeFormat'] = tmpps[4];

		if(tmpps.length >= 6) {	
			sledataString.SLEPS['discrete'] = tmpps[5];	
		} else {
			sledataString.SLEPS['discrete'] = false;
		}
		
		for(var i=0 ; i<sleCount ; i++){
			var skey = 'SLE'+i;
			var sled = dataMap[skey].split(',');
			//console.dir(sled);
			var newSleStr = {'label_value':sled[0],
					'hint_value':sled[1],
					'holder_x':sled[2],
					'holder_y':sled[3],
					'image_data':sled[4],
					'doc_x':sled[5],
					'doc_y':sled[6],
					'image_data_1':sled[7],
					'connector_facing':sled[8],
					'connector_mx':sled[9],
					'connector_my':sled[10],
					'connector_lx':sled[11],
					'connector_ly':sled[12],
					'connector_options':{
						'connectorPresent':sled[13].split('|')[0],
						'connectorType':sled[13].split('|')[1],
						'zoomingPresent':sled[13].split('|')[2],
						'showInAuthoring':sled[13].split('|')[3]
					},
					
					'transparent_border':sled[16],
					'transparent':sled[17],
					'transparent_hint':sled[18],
					'transparent_border_1':sled[19],
					'transparent_1':sled[20],
					'media_value':sled[21],
					'media_dock_value':sled[22],
					'media_label_XY':sled[23],
					'media_dock_XY':sled[24],
					'play_option_L0_X':sled[25],
					'play_option_L0_Y':sled[26],
					'play_option_D0_X':sled[27],
					'play_option_D0_Y':sled[28],
					'label_Audio_Value':sled[29],
					'label_play_option_value':sled[30],
					'distractor_label':sled[31],
					'FIB_value':sled[32],
					'class_array_SLE':sled[33],
					'edit_button_X':sled[34],
					'edit_button_Y':sled[35],
					'dock_hint_value':sled[36],
					'FIB_Dock':sled[37],
					'doc_transparent_value':sled[38]!=undefined?sled[38]:false,
					'visibility':sled[39]!=undefined?sled[39]:false,
					'feedback_value':sled[40],
					'showHintOrFeedbackInAuthoring':sled[41],
					
					'textFormat': {
						'underline_value': sled[43],
						'fontSize': sled[43],
						'fontStyle': sled[43],
						'align': sled[43]
					},
			};
			sledataString.SLEData[i]=newSleStr;
		}	
		
		for(var i=0 ; i<frameCount ; i++){
			var skey = 'CF'+i;
			var frameData = dataMap[skey].split(',');
			var newFrameStr = {
					'frameX' : i==0?0:frameData[0],
					'frameY' : i==0?0:frameData[1],
					'frameOriginalX' : frameData[0],
					'frameOriginalY' : frameData[1],
					'frameWidth' : frameData[2],
					'frameHeight' : frameData[3],
					'lockStatus' : false,
					'frameImageList' : {},
					'frameTextList' : {},
					'frameStudentGUI' : {},
					'frameBGVisible' : frameData[7],
					'frameFlag' : frameData[8],
					'frameMediaList' : frameData[9],
					'frameMediaXY' : {
						'x': frameData[10].split('|')[0],
						'y': frameData[10].split('|')[1]
					},
					'frameOptionX' : frameData[11],
					'frameOptionY' : frameData[12],
					'frameLabelObj' : frameData[13],
					'frameFIBOutput' : frameData[14],
					'frameFIBButtonX' : frameData[15],
					'frameFIBButtonY' : frameData[16]
			};

			if(frameData[5]){
				var frameText = frameData[5].split('%d%');
				var tmpFrmtextList = new Array();
				for(var tc=0;tc<frameText.length;tc++) {
					var tmp = {};
					tmp.textValue = frameText[tc].split('|')[0];
					tmp.maxWidth = frameText[tc].split('|')[1];
					tmp.fontSize = frameText[tc].split('|')[2];
					tmp.border = frameText[tc].split('|')[3];
					tmp.textX = frameText[tc].split('|')[4];
					tmp.textY = frameText[tc].split('|')[5];
					
					tmpFrmtextList.push(tmp);
				}
				newFrameStr.frameTextList = tmpFrmtextList;
			}
			
			if(frameData[4]) { 
				var frameImage = frameData[4].split('%d%');
				var tmpFrmImageList = {};
				for(var tc=0;tc<frameImage.length;tc++) {
					var tmp = {};
					tmp.imageName = frameImage[tc].split('|')[0];
					tmp.imageScaleFactor = frameImage[tc].split('|')[1];
					tmp.imageX = frameImage[tc].split('|')[2];
					tmp.imageY = frameImage[tc].split('|')[3];		
					tmp.height = '';
					tmp.width  = '';

					tmpFrmImageList['img_' + i + '_' + (tc)] = tmp
				}
				newFrameStr.frameImageList = tmpFrmImageList;
			}
			
			var studGuiArray = frameData[6].split('%d%');
			for(var j=0; j<studGuiArray.length; j++){
				var tmp = studGuiArray[j].split('|');
				var tmp1 = {'Component':tmp[0]!=undefined?tmp[0]:'', 'X':tmp[1]!=undefined?tmp[1]:'','Y':tmp[2]!=undefined?tmp[2]:''};
				studGuiArray[j]=tmp1;
			}
			newFrameStr.frameStudentGUI= studGuiArray;
			sledataString.FrameData[i]=newFrameStr;
		}
		
		this.Json = sledataString;
	},
	
	/*
	 * get sleData for sleView
	 * By nabonita bhattacharyya
	 */
	getJsonData : function(){
		return window.CD.module.data.Json.SLEData;
	},
	
	getTextStyleData : function(textId){
		try{
			var labelId = 'label_'+textId;
			var labelIndex = SLEData.getLabelIndex(labelId);
			var textFormat = {};
			var textObj = window.CD.module.data.Json.SLEData[labelIndex].textFormat;
			textFormat.align = textObj.align;
			textFormat.fontSize = textObj.fontSize;
			textFormat.fontStyle = textObj.fontStyle;
			textFormat.underline_value = textObj.underline_value;
			return textFormat;
		}catch(error){
			console.info("Error in sleData :: getTextStyleData : "+error.message);
		}
	},
 	/*
	 * get adminData for sleView
	 * By nabonita bhattacharyya
	 */
	getJsonAdminData : function(){
		return window.CD.module.data.Json.adminData;
	},
	
	/*
	 * this is used to get label index for each view
	 * By nabonita bhattacharyya
	 */
	
	getLabelIndex : function(labelGroupId){
		var labelCount = this.getSLEIndex(labelGroupId)
		return labelCount;
	},
	
	/*
	 * this is used to get json
	 * By nabonita bhattacharyya
	 */
	
	getJson : function(){
		return window.CD.module.data.Json;
	},
	
	getSLEIndex : function(labelGroupId) {
		var  outputJson = window.CD.module.data.Json;
		for(key in outputJson.SLEData) {
			if(outputJson.SLEData[key].labelGroupId == labelGroupId)
				return key;
		}
	},
	reIndexLabels : function() {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;
		var outputJson = window.CD.module.data.Json;
		var labelCount = cs.objLength(outputJson.SLEData);
		var tmpSLEData = {};
		
		var c = 0;				
		for(key in outputJson.SLEData) {
			tmpSLEData['SLE' + c] = outputJson.SLEData[key]; 
			c++;
		}
		outputJson.SLEData = {};
		outputJson.SLEData = tmpSLEData;
		
	},
	/**
	 * For fill and stroke status
	 */
	fillAndBorderEnable : function(data){
		
		if(data ==='T'){
			return false;
		}else{
			return true;
		}
	},
	/**
	 * This is used for checking show in authoring status 
	 * in SLE
	 */
	showInAuthStatus : function(data){
		try{
			if(data == 'T'){
				return true;
			}else{
				if(data == 'F'){
					return false;
				}
			}
		}catch(err){
			console.error("@SLEData::Error for showInAuthStatus()::"+err.message);
		}
	},
	
	/*
	 * This is used for start over and reset function call
	 * By Nabonita Bhattacharyya
	 * modified on 03rd July,2013
	 */
	resetAll : function(stage_id){
		console.log('@SLEData: start_over')
		try{
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cd = window.CD;
			cd.questionState = 'new';
			cd.inputString = '';
			$('#'+stage_id).remove();
			var frameGroup = cs.findGroup('frame_0');
			cs.setActiveElement(frameGroup,'frame');
			ds.initializeModuleData();
			new Stage();
			
		}catch(err){
			console.error("@SLEData::Error for start_over::"+err.message);
		}
		
	},
	
	updateLockStatus:function(group,status) {
		var id = group.attrs.id;
		if(id.match(/^label_[0-9]+/)) {
			var sle = this.getSLEIndex(id);
			var sleData = this.getJsonData();
			sleData[sle].lockStatus = status;
		} 
		if(id.match(/^dock_label_[0-9]+/)) {
			var sle = this.getSLEIndex(id.substr(5,id.length));
			var sleData = this.getJsonData();
			sleData[sle].dockLockStatus = status;
		}
		window.CD.services.ds.setOutputData();
	},
	/* setting the first label index */
	getLabelStartId :function(){
		var cs = window.CD.services.cs;
		var SLELabelJson = SLEData.getJsonData();
		var labelCount = cs.objLength(SLELabelJson);
		var tempArray = new Array();
		var finalLabelId = labelCount;
		for(var i=0; i<labelCount; i++){
			tempArray.push(parseInt(SLELabelJson['SLE'+i].labelGroupId.split('_')[1]));			
		}
		tempArray.sort(descending);
		function descending( a, b ) {
			return b - a;
			}
		finalLabelId = tempArray[0] + 1;
		return finalLabelId;
	},	
	/**
	 * function name: getEachLabelOutputData()
	 * 
	 */
	getEachLabelOutputData: function(indID,fetchPropa){
	//	console.log("@COIData::getEachLabelOutputData");
		try{
			if(fetchPropa && indID){
				var SLEJsonData=window.CD.module.data.Json.SLEData[indID];
				return SLEJsonData[fetchPropa];
								
			}
			
		}catch(err){
			console.error("@SLEData::getEachLabelOutputData::"+err.message);
	    }
	},
	 /**
	 * function name: setEachLabelOutputData()
	 * author:Piyali Saha
	 */
	setEachLabelOutputData: function(indID,changefieldArr){
		//console.log("@COIData::setEachLabelOutputData");
		try{
			if(changefieldArr && indID){
				var SLEJsonData=window.CD.module.data.Json.SLEData[indID];
				for(kky in changefieldArr){
					if(typeof kky==="object"){
						for(ky in kky){
							SLEJsonData[kky][ky]=changefieldArr[kky][ky];
						}
					}else{
						SLEJsonData[kky]=changefieldArr[kky];
					}
					
				}				
				
			}
			window.CD.services.ds.setOutputData();

		}catch(err){
			console.error("@SLEData::setEachLabelOutputData::"+err.message);
	    }
	},
	
	/**
	 * function name: applyClickPublishOk()
	 * author:Piyali Saha
	 */
	applyClickPublishOk :function(){
		console.log("@SLEView.applyClickPublishOk");
		try{
			/*In this method SLEData.customPublishFlag is coming as true from updateBindPublishingOption()
			 *method, because after rendering a data string in authoring side the SLEPS data was not populating 
			 *correctly. And for that reason on clicking 'I'm done' wrong data was populating on the popup.
			 * */
			var ds = window.CD.services.ds;
			var jsonData=window.CD.module.data.Json;
			var SleData=jsonData.SLEData;
			var jsonSLEPS=jsonData.SLEPS;
			
			var totalLabel=0;
			var totalDistractor=0;
			var standardNum=0;
			var givennum=0;
			var requnum=0;
			var diswithDocnum=0;
			var requiredSet = new Array();
			var givenSet = new Array();
			var discreteSet = new Array();
			var standardSet = new Array();
			var SLEDC = new Array();
			
			jsonData.SLEGV="";
			jsonData.SLERQ="";
			jsonData.SLERN="";
			jsonData.SLEDC="";
			jsonSLEPS['discrete'] = '';
			//jsonSLEPS['totalRandomLabels']='';
			//jsonSLEPS['totalRandomDistractors']='';
			var totalRandomLabels;
			var totalRandomDistractors;
			var totalRandomLabelsInput;
			var totalRandomDistractorsInput;
			
			/*fetch standard labels*/
			if(jsonSLEPS && jsonSLEPS.totalRandomLabels && jsonSLEPS.totalRandomLabels !==''){
				totalRandomLabels = jsonData.SLEPS.totalRandomLabels;
			}
			
			if(jsonSLEPS && jsonSLEPS.totalRandomDistractors && jsonSLEPS.totalRandomDistractors!==''){
				totalRandomDistractors = jsonData.SLEPS.totalRandomDistractors;
			}
			
		    if($("#pub_standardLabels #labelsNo").val() != undefined && $("#pub_standardLabels #labelsNo").val()){
		    	totalRandomLabelsInput = $("#pub_standardLabels #labelsNo").val();
		    	
		    }
		    if($("#pub_distractorLabels #distractorNo").val() != undefined && $("#pub_distractorLabels #distractorNo").val()){
		    	totalRandomDistractorsInput = $("#pub_distractorLabels #distractorNo").val();
		    }
			if(SLEData.customPublishFlag){
				if(totalRandomLabelsInput != undefined && totalRandomLabels != totalRandomLabelsInput){
			    	totalRandomLabels =totalRandomLabelsInput;
			    }
			    if(totalRandomDistractorsInput != undefined && totalRandomDistractors != totalRandomDistractorsInput){
			    	totalRandomDistractors =totalRandomDistractorsInput;
			    }
			}
		    
		    
			if(SleData){
				
			  for(sle in SleData){
				  var sleObj=SleData[sle];
				  if(sleObj.publishingOption && sleObj.publishingOption==="S" && sleObj.visibility == true && sleObj.distractor_label==="F"){
					  standardNum++;
					 
				  }
				  if(sleObj.publishingOption && sleObj.publishingOption==="S" && sleObj.visibility == true){
					  standardSet.push(parseInt(sle.split('SLE')[1]));
				  }
				  
				  if(sleObj.publishingOption && sleObj.publishingOption==="G" && sleObj.visibility == true){
					  givennum++;
					  givenSet.push(parseInt(sle.split('SLE')[1]));
				  }
				  else if(sleObj.publishingOption && sleObj.publishingOption==="R" && sleObj.visibility == true){
					  requnum++;
					  requiredSet.push(parseInt(sle.split('SLE')[1]));
				  }
				  else if(sleObj.publishingOption && sleObj.publishingOption==="DC" && sleObj.visibility == true){
					  diswithDocnum++;
					  discreteSet.push(parseInt(sle.split('SLE')[1]));
				  }
				  
				  if(sleObj.distractor_label==="T"){
					  totalDistractor++;
				  }else if(sleObj.distractor_label==="F" && sleObj.visibility == true){
					  totalLabel++;
				  }
				  SLEDC.push('N');
				  
			  }
			 			
			}
			
			
			if(ds.getOptionLabel() == "OTM" && totalRandomLabels > totalLabel){
				totalRandomLabels = totalLabel;
			}
			
			//if(totalRandomLabels == undefined && !SLEData.customPublishFlag){
			if(!SLEData.customPublishFlag){	
				jsonSLEPS['totalRandomLabels']=totalLabel;
			}else{
				jsonSLEPS['totalRandomLabels']=totalRandomLabels;
			}
			
			//if(totalRandomDistractors == undefined && !SLEData.customPublishFlag){
			if(!SLEData.customPublishFlag){	
				jsonSLEPS['totalRandomDistractors']=totalDistractor;
			}else{
				jsonSLEPS['totalRandomDistractors']=totalRandomDistractors;
			}

			
			
			if(givenSet.length > 0){
				jsonData.SLEGV = givenSet.join();
			}
			
			if(requiredSet.length > 0){
				jsonData.SLERQ = requiredSet.join();
			}
			
			if(standardSet.length > 0){
				jsonData.SLERN = standardSet.join();
			}
			
			for(var i=0; i<SLEDC.length; i++){
				if($.inArray(i,discreteSet) != -1){
					//SLEDC[i] = i;
				}	else{
					SLEDC[i] = i
				}
			}
			
			if(discreteSet.length > 0){
				jsonSLEPS.discrete = 'DC';
				jsonData.SLEDC = SLEDC.join();
			}
			
			
			ds.setOutputData();				
		}catch(err){
			console.error("@SLEView::Error on applyClickPublishOk::"+err.message);
		}
		
	},
	/*
	 * For getting node for align label to frame
	 */
	getKeyIndex:function(){
		return 'SLE';
	},
	
	/**
	 * This method is used to get hint/feedback parameters 
	 * from output json
	 * By Nabonita Bhattacharyya
	 */
	getHintFeedbackFromJson: function(){
		console.log("@SLEData.getHintFeedbackFromJson");
		try{
			var admindata=window.CD.module.data.getJsonAdminData();
			var ZHP=admindata.ZHP.split(',');
			var hintWidth=ZHP[5];
			var hintHeight=ZHP[6];
			var hintFeedbackX=ZHP[7];
			var hintFeedbackY=ZHP[8];
			var feedbackW = admindata.feedbackWidth;
			var feedbackH = admindata.feedbackHeight;
			var hint={
						hintW:parseInt(hintWidth),
						hintH:parseInt(hintHeight),
						x:parseInt(hintFeedbackX),
						y:parseInt(hintFeedbackY),
						feedbackW:parseInt(feedbackW),
						feedbackH:parseInt(feedbackH)
					 }
			return hint;
		}catch(err){
			console.error("@SLEData::Error on getHintFeedbackFromJson::"+err.message);
		}
		
	},
	/**
	 * This method is used to set values to 
	 * hint/feedback parameters
	 * By Nabonita Bhattacharyya 
	 */
	setHintFdbckToJson: function(width,height,x,y){
		console.log("@SLEData.setHintFdbckToJson");
		try{
			var ds = window.CD.services.ds;
			var adminData=window.CD.module.data.getJsonAdminData();
			var ZHPSplit=adminData.ZHP.split(',');
			if(width)
				ZHPSplit[5]=parseInt(width);
			if(height)
				ZHPSplit[6]=parseInt(height);
			if(x)
				ZHPSplit[7]=parseInt(x);
			if(y)
				ZHPSplit[8]=parseInt(y);
			var modifiedZHP=ZHPSplit.join();
			adminData.ZHP=modifiedZHP;
			ds.setOutputData();
		}catch(err){
			console.error("@SLEData::Error on setHintFdbckToJson::"+err.message);
		}
		
	},	
	/**
	 * This method is used to set values to 
	 * feedback height/width 
	 * By Nabonita Bhattacharyya
	 */
	setFeedbackValuesToJson: function(width,height){
		console.log("@SLEData.setFeedbackValuesToJson");
		try{
			var ds = window.CD.services.ds;
			var adminData=window.CD.module.data.getJsonAdminData();
			if(width)
				adminData.feedbackWidth=parseInt(width);
			if(height)
				adminData.feedbackHeight=parseInt(height);
			
			ds.setOutputData();
		}catch(err){
			console.error("@SLEData::Error on setFeedbackValuesToJson::"+err.message);
		}
		
	},
	/**
	 * This method is used to get zoom parameters 
	 * from output json
	 * By Nabonita Bhattacharyya
	 */
	getZoomParametersFromJson: function(){
		console.log("@SLEData.getZoomParametersFromJson");
		try{
			var admindata=window.CD.module.data.getJsonAdminData();
			var ZHP=admindata.ZHP.split(',');
			var zoomWidth=ZHP[0];
			var zoomHeight=ZHP[1];
			var zoomX=ZHP[2];
			var zoomY=ZHP[3];
			var zoomScale = ZHP[4];
			
			var zoom={
						zoomW:parseInt(zoomWidth),
						zoomH:parseInt(zoomHeight),
						x:parseInt(zoomX),
						y:parseInt(zoomY),
						scale:parseInt(zoomScale),
					 }
			return zoom;
		}catch(err){
			console.error("@SLEData::Error on getZoomParametersFromJson::"+err.message);
		}
		
	},
	/**
	 * This method is used to set values to 
	 * hint/feedback parameters 
	 * By Nabonita Bhattacharyya
	 */
	setZoomParametersToJson: function(width,height,x,y,scale){
		console.log("@SLEData.setZoomParametersToJson");
		try{
			var ds = window.CD.services.ds;
			var adminData=window.CD.module.data.getJsonAdminData();
			var ZHPSplit=adminData.ZHP.split(',');
			if(width)
				ZHPSplit[0]=parseInt(width);
			if(height)
				ZHPSplit[1]=parseInt(height);
			if(x)
				ZHPSplit[2]=parseInt(x);
			if(y)
				ZHPSplit[3]=parseInt(y);
			if(scale)
				ZHPSplit[4]=parseInt(scale);
			var modifiedZHP=ZHPSplit.join();
			adminData.ZHP=modifiedZHP;
			ds.setOutputData();
		}catch(err){
			console.error("@SLEData::Error on setZoomParametersToJson::"+err.message);
		}
		
	},
	/*
	 * This is used in makeActivity,for inspector data population
	 * By Nabonita Bhattacharyya
	 */
	getInspectorLabelData : function(){
		try{
			var inspectorLabelData = {
					'labelHeight' : '70',
					'labelWidth' : '120',
					'fillEnabled' : true,
					'strokeEnabled': true,
					'elmType':'label',
					'strokeDock':true,
					'transparency':'semitransparent',
					'dockSameSize':true,
					'dockHeight' : '70',
					'dockWidth' : '120',
					'distractor_label': false,
					'connector':"F",
					'connectorPoint': '0',
					'hintWidth':'120',
					'hintHeight':'70',
					'hintLabelOrDock':'D',
					'feedbackLabelOrDock':'D',
					'infoHideText':'T',
					'showZoomInAuth':'F',
					'zoomWidth':'200',
					'zoomHeight':'100',
					'scaleFactor':'200%',
					'fillBorderDrop':false
			}
			return inspectorLabelData;
		}
		catch(e){
			console.error("@SLEData::Error on getInspectorLabelData::"+e.message);
		}
		
	},
	/*
	 * This is used to get label group of SLE0
	 */
	getLabelGroup : function(){
		var cs = window.CD.services.cs;
		var labelGrp = cs.findGroup('label_0');
		return labelGrp;
	},
	
	/*
	 * This is used in undo for oldData
	 * By Nabonita Bhattacharyya
	 */
	getOldLabelDockData : function(){
		try{
			var oldData = {
					'width' : '',
					'height' : '',
					'fill' : '',
					'stroke': '',
					'strokeDock':'',
					'transpType':'',					
					'distractor': '',
					'dockWidth':'',
					'dockHeight':'',
					'hintOrFeedback':'',
					'hintWidth':'',
					'hintHeight':'',
					'feedbackWidth':'',
					'feedbackHeight':'',
					'placeHolderX':'',
					'placeHolderY':'',
					'hideTextLoc':'F',
					'zoomWidth':'',
					'zoomHeight':'',
					'dockSameSize':'',
					'showZoomInAuth':'',
					'undo':true,
					'labelOrDockHint':'',
					'connectorEndpointType':'none'
			}
			return oldData;
		}
		catch(e){
			console.error("@SLEData::Error on getOldLabelDockData::"+e.message);
		}
	},
	
	/***
	 * This method is used to populate params for drawing connector tail
	 * 
	 */
	getConnectorTailParams : function(sleCount){
		try{
			var zoomParam = SLEData.getZoomParametersFromJson();
			var sleData = SLEData.getJsonData();
			sleData = sleData[sleCount];
			var jSonData = SLEData.getJson();
			
			var localOrGlobal = SLEData.getJsonAdminData().magnificationData;
			
			if(localOrGlobal == 'local'){
				var labelId = sleData.labelGroupId;
				var magnificationObj = SLEData.getLocalMagnificationVal(labelId);
				width = magnificationObj.localMagnificationWidth;
				height = magnificationObj.localMagnificationHeight;
			}else{
				if(localOrGlobal == 'global'){
					width = zoomParam.zoomW;
					height = zoomParam.zoomH;
				}
			}
			
			var connectortailParam = {
				'facing' : sleData.connector_facing,
				'tWidth' : jSonData.DCKLD.split(',')[0],
				'tHeight': jSonData.DCKLD.split(',')[1],
				'dockX': sleData.doc_x,
				'dockY': sleData.doc_y,
				'mx': sleData.connector_mx,
				'my': sleData.connector_my,
				'lx': sleData.connector_lx,
				'ly': sleData.connector_ly,
				'zoom_window_x' : zoomParam.x,
				'zoom_window_y' : zoomParam.y,
				'zoom_window_height' : height,
				'zoom_window_width' : width
			}
			return connectortailParam;
		}
		catch(error){
			console.log("Error in @SLEData :: getConnectorTailParams : "+error.message);
		}
	},
	setZindex : function(label){
		var sleData = window.CD.module.data.Json.SLEData;
		for(key in sleData){
			for(var i=0; i<label.parent.children.length;i++){
				if(sleData[key].labelGroupId == label.parent.children[i].getId()){
					sleData[key].zIndex = label.parent.children[i].getZIndex();
				}
			}
		}	
	},
	labelOrDockStatus : function(labelOrDock){
		var output = '';
		if(labelOrDock == 'L'){
			output = 'label';
		}else if(labelOrDock == 'D'){
			output = 'dock';
		}
		return output;
	},
	sleResetData : function(sleTypeText){
		var ds = window.CD.services.ds;
		var cd = window.CD;
		if(ds.getOptionLabel() == 'OTO'){
			cd.module.data.Json.adminData["OTO"] = true;
			cd.module.data.Json.adminData["OTM"] = false;
			cd.module.data.Json.adminData["TYPE"] = false;
			var dckCount=window.CD.services.cs.objLength(window.CD.module.data.Json.SLEData);
			if(sleTypeText == "Display Label Once"){
				for(var j=0; j<dckCount;j++){
					if(window.CD.module.data.Json.SLEData['SLE'+j].visibility == false){
						delete window.CD.module.data.Json.SLEData['SLE'+j];
					}
				}
				SLEData.reIndexLabels();
				
				for(var key in SLEData.Json.SLEData){
					var index = key.split('SLE')[1];
					SLEData.Json.SLEData[key].name = 'label_'+index;
					SLEData.Json.SLEData[key].labelGroupId = 'label_'+index;
				}
			}else if(sleTypeText == "Display Each Label Instance"){
				var matchedValueArray = [];
				/*By this following loop all the labels which has duplicate
				 *lavel value is being pushed in the matchedValueArray */
				for(var j=0; j<dckCount;j++){
					for(var i=j+1; i<dckCount;i++){
						if(window.CD.module.data.Json.SLEData['SLE'+j].label_value != ''){
							if((window.CD.module.data.Json.SLEData['SLE'+j].label_value == window.CD.module.data.Json.SLEData['SLE'+i].label_value)&&(window.CD.module.data.Json.SLEData['SLE'+i].visibility == true)){
								var matchedValueArrayLength = matchedValueArray.length;
								var flag = false;
								if(matchedValueArrayLength>0){
									for(var k=0;k<matchedValueArrayLength;k++){
										if(matchedValueArray[k] == 'SLE'+i){
											flag = true;
										}
									}
									if(flag == false){
										matchedValueArray.push('SLE'+i);
									}
								}else{
									matchedValueArray.push('SLE'+i);
								}
							}
						}
					}
				}
				if(matchedValueArray.length>0){
					for(var i=0;i<matchedValueArray.length;i++){
						delete window.CD.module.data.Json.SLEData[matchedValueArray[i]];
					}
				}
				
				SLEData.reIndexLabels();
				
				for(var key in SLEData.Json.SLEData){
					var index = key.split('SLE')[1];
					SLEData.Json.SLEData[key].name = 'label_'+index;
					SLEData.Json.SLEData[key].labelGroupId = 'label_'+index;
				}
				
			}
			
			cd.inputString = JSON.stringify(window.CD.module.data.Json);
			cd.questionState = 'edit';
			ds.initializeModuleData();
			new Stage();
		
		}
		if(ds.getOptionLabel() == 'OTM'){
			cd.module.data.Json.adminData["OTO"] = false;
			cd.module.data.Json.adminData["OTM"] = true;
			cd.module.data.Json.adminData["TYPE"] = false;
			if(ds.getsubOptionLevel() == 'DLO'){
				cd.module.data.Json.adminData["OTO"] = false;
				cd.module.data.Json.adminData["OTM"] = true;
				cd.module.data.Json.adminData["TYPE"] = false;
				if(sleTypeText == 'Display Each Label Instance'){
					var SLEData2 =  cd.module.data.Json.SLEData;
					var dckCount=window.CD.services.cs.objLength(window.CD.module.data.Json.SLEData);
					for(var j=0; j<dckCount;j++){
						for(var i=j+1; i<dckCount;i++){
							if(window.CD.module.data.Json.SLEData['SLE'+j].label_value != ''){
								if((window.CD.module.data.Json.SLEData['SLE'+j].label_value == window.CD.module.data.Json.SLEData['SLE'+i].label_value)&&(window.CD.module.data.Json.SLEData['SLE'+i].visibility == true)){
									window.CD.module.data.Json.SLEData['SLE'+i].name = window.CD.module.data.Json.SLEData['SLE'+j].name;
									window.CD.module.data.Json.SLEData['SLE'+i].visibility = false;
								}
							}
						}
					}
					cd.inputString = JSON.stringify(window.CD.module.data.Json);
					cd.questionState = 'edit';
					ds.initializeModuleData();
					new Stage();
				}
			}
			if(ds.getsubOptionLevel() == 'DLE'){
				cd.module.data.Json.adminData["OTO"] = false;
				cd.module.data.Json.adminData["OTM"] = false;
				cd.module.data.Json.adminData["TYPE"] = true;
				if(sleTypeText == 'Display Label Once'){
					var SLEData2 =  cd.module.data.Json.SLEData;
					for(var key in SLEData2){
						cd.module.data.Json.SLEData[key].visibility = true;
						cd.module.data.Json.SLEData[key].name = cd.module.data.Json.SLEData[key].labelGroupId;
					}
					cd.inputString = JSON.stringify(window.CD.module.data.Json);
					cd.questionState = 'edit';
					ds.initializeModuleData();
					new Stage();
				}
				
			}
		}
	},
	/**
	 * @params: id of a particular canvas text
	 * @description : this method is used for getting the canvas text value
	 * for the particular textId from Json
	 */
	getLabelTextValue : function(labelId){
		try{
			var sleIndex = SLEData.getLabelIndex(labelId);
			
			var jsonData = SLEData.getJsonData();
			var lblObj = jsonData[sleIndex];
			var textValue = lblObj.label_value;
			return textValue;
		}catch(error){
			console.info("Error in SLEData :: getLabelTextValue : "+error.message);
		}
	},
	
	/**
	 * @params : params : label text format parameter object
	 * labelId : id of the label where the text is being added
	 * @description : This method is used to update text format json data with 
	 * label text format parameters
	 */
	updateLabelTextData : function(params,labelId) {
		try{
			if(params){
				var labelIndex = SLEData.getLabelIndex(labelId);
				window.CD.module.data.Json.SLEData[labelIndex].textFormat = {};
				var sleJsonData = window.CD.module.data.Json.SLEData[labelIndex].textFormat;
				for(var eachKey in params){
					sleJsonData[eachKey] = params[eachKey];
				}					
			}
			window.CD.services.ds.setOutputData();
		}
		catch(error){
			console.info("Error in sleData :: updateLabelTextData : "+error.message);
		}
	},
	
	/**
	 * @params: textId :: id of a particular label text
	 * @description : this method is used for getting all default parameters
	 * from jSon for the particular textId
	 */
	getDefaultParamsFromJson : function(textId){
		try{
			var labelId = 'label_'+textId;
			var labelIndex = SLEData.getLabelIndex(labelId);
			/** Label data populate in Json **/
			/* Json value */
			var sleJsonData = window.CD.module.data.Json.SLEData[labelIndex];
			/* Default values */
			var defaultParams = {};
			defaultParams = SLEData.getTextStyleData(textId);  
			
			
			var txtVal = SLEData.getLabelTextValue(labelId);
			
			defaultParams.label_value = txtVal;
			defaultParams.textFormat = sleJsonData.textFormat;
			
			return defaultParams;
		}
		catch(error){
			console.info("Error in SLEData :: getDefaultParamsFromJson : "+error.message);
		}
	},
	/**
	 * @param : textId :: id of a particular label text
	 * @description : this method is used for getting text format values from json
	 */
	getTextFormatParamsFromJson : function(textId){
		console.log("@getTextFormatParamsFromJson :: sleData");
		try{
			var labelId = 'label_'+textId;
			var labelIndex = SLEData.getLabelIndex(labelId);
			/** Label data populate in Json **/
			/* Json value */
			var sleJsonData = window.CD.module.data.Json.SLEData[labelIndex];
			/* Default text format values */
			var defaultParams = {};
			
			defaultParams = sleJsonData.textFormat;
			
			return defaultParams;
		}
		catch(error){
			console.info("Error in SLEData :: getTextFormatParamsFromJson : "+error.message);
		}
	},
	
	/**
	 * @params: textId :: id of a particular label text
	 * @description : this method is used for getting underline value of 
	 * the particular text object
	 */
	getUnderlineStatus : function(textId){
		console.log("@SLEData :: getUnderlineStatus");
		try{
			var underlineStatus = 'F';
					
			/** This is the total text group components object **/
			var textGrpComponents = window.CD.module.data.textGroupComponent;
			var textGrpCompLen = textGrpComponents.length;
			for(var count = 0;count <textGrpCompLen;count++){
				var txtId = textGrpComponents[count].textComponentID;
				if(txtId == textId){
					underlineStatus = textGrpComponents[count].underline_value;
				}
			}
			return underlineStatus;
		}
		catch(error){
			console.info("Error in SLEData :: getUnderlineStatus : "+error.message);
		}
	},
	
	getHintFeedbackValue : function(labelId){
		console.log("@getHintFeedbackValue :: SLEData");
		try{
			var sleIndex = SLEData.getLabelIndex(labelId);
			
			var jsonData = SLEData.getJsonData();
			var lblObj = jsonData[sleIndex];
			var hintValue = lblObj.hint_value;
			if(lblObj.hint_value == '%n%'){
				hintValue = '';
			}
			
			var feedbackValue = lblObj.feedback_value;
			
			var hintFeedbackVal = {};
			
			hintFeedbackVal.hintValue = hintValue;
			hintFeedbackVal.feedbackValue = feedbackValue;
			
			return hintFeedbackVal;
			
		}catch(error){
			console.info("Error in SLEData :: getHintFeedbackValue : "+error.message);
		}
	},
	/**
	 * @params: id of a particular canvas text
	 * @description : this method is used for setting the label text value
	 * for the particular textId from Json
	 */
	setLabelTextValue : function(labelId,textValue){
		try{
			var ds = window.CD.services.ds;
			var sleIndex = SLEData.getLabelIndex(labelId);
			
			var jsonData = SLEData.getJsonData();
			var lblObj = jsonData[sleIndex];
			lblObj.label_value = textValue;
			
			ds.setOutputData();
		}catch(error){
			console.info("Error in SLEData :: getLabelTextValue : "+error.message);
		}
	},
	
	setLabelTextFormat : function(dataIndex){
		console.log('@setLabelTextFormat :: SLEData');
		try{
			if(dataIndex){
				var SLEJsonData=window.CD.module.data.Json.SLEData[dataIndex];
				if(window.CD.globalStyle.alignment != ''){
					SLEJsonData.textFormat.align = window.CD.globalStyle.alignment;
				}
				if(window.CD.globalStyle.fontStyle != ''){
					SLEJsonData.textFormat.fontStyle = window.CD.globalStyle.fontStyle;
				}
				if(window.CD.globalStyle.underlineVal != ''){
					SLEJsonData.textFormat.underline_value = window.CD.globalStyle.underlineVal;
				}
				if(window.CD.globalStyle.font != ''){
					SLEJsonData.textFormat.fontSize = window.CD.globalStyle.font;
				}
				
			}
			window.CD.services.ds.setOutputData();

		}catch(err){
			console.error("@SLEData::setLabelTextFormat::"+err.message);
	    }
	},
	
	populateLabelDockData : function(data){
		try{
			var slejson = this.getJsonData();
			var adminData = this.getJsonAdminData();
			var hintFdbk = SLEData.getHintFeedbackFromJson();
			var ZHP = SLEData.getZoomParametersFromJson();
			var sleCount = 'SLE0';
			
			data.width = adminData.SLELD.split(',')[0];
			data.height = adminData.SLELD.split(',')[1];
			data.dockWidth = SLEData.getJson().DCKLD.split(',')[0];
			data.dockHeight = SLEData.getJson().DCKLD.split(',')[1];
			data.fill = SLEData.fillAndBorderEnable(slejson [sleCount].transparent);
			data.stroke = SLEData.fillAndBorderEnable(slejson[sleCount].transparent_border);
			
			if(SLEData.getJson().SLEGP.borderGlobal == 'F' && SLEData.getJson().SLEGP.backGroundGlobal == 'F'){
				data.fillBorderDrop = true;
			}else{
				if(SLEData.getJson().SLEGP.borderGlobal == 'T' && SLEData.getJson().SLEGP.backGroundGlobal == 'T'){
					data.fillBorderDrop = false;
				}
			}
			
			data.strokeDock = SLEData.fillAndBorderEnable(slejson[sleCount].transparent_border_1);
			
			data.dockSameSize = adminData.DOCSAMEASLABEL;
			data.transpType = slejson[sleCount].transparent_1;
			
			data.hintOrFeedback = adminData.showHintOrFeedbackInAuthoring;
			data.labelOrDockHint = SLEData.labelOrDockStatus(adminData.HRO);
			data.hintWidth = hintFdbk.hintW;
			data.hintHeight = hintFdbk.hintH;
			data.labelOrDockFdbk = SLEData.labelOrDockStatus(adminData.FRO);
			data.feedbackWidth = hintFdbk.feedbackW; 
			data.feedbackHeight = hintFdbk.feedbackH;
			
			data.connectorEndpointType = window.CD.module.data.globalConnectorType;
			data.hideTextGlobal = SLEData.getGlobalHideTextStatus();
			data.showHiddenTxtGlobal = SLEData.showHiddenTextInAuthoring;
		
			return data;
		}catch(err){
			console.error("@SLEData::populateLabelDockData::"+err.message);
		}
	},
	
	/**
	 * This method is used to get the global hide text status
	 */
	
	getGlobalHideTextStatus : function(){
		try{
			var globalHideTextcheck = true;
			var labelCountForHideText = 0;
			var sleData = window.CD.module.data.Json.SLEData;
			for(var key in sleData){
				if(sleData[key].infoHideText == 'F'){//If text hidden
					globalHideTextcheck = false;				
				}				
				labelCountForHideText++;
			}
			if(labelCountForHideText != 0){
				return globalHideTextcheck;
			}else{
				return true;
			}
			
			
		}catch(err){
			console.error("@SLEData::getGlobalHideTextStatus ::"+err.message);
		}
	},
	
	populateMagnificationData : function(data){
		console.log("@populateMagnifiationData :: SLDEData");
		try{
			var ZHP = SLEData.getZoomParametersFromJson();
			var adminData = this.getJsonAdminData();
			data.magnificationFactor = parseInt(ZHP.scale)*100+'%';
			
			if(adminData.showZoomInAuth == 'T'){
				data.magnifyShowInAuth = true;
			}else{
				if(adminData.showZoomInAuth == 'F'){
					data.magnifyShowInAuth = false;
				}
			}	
			
			data.zoomWidth = ZHP.zoomW;
			data.zoomHeight = ZHP.zoomH;
			return data;
		}catch(err){
			console.info("Error @populateMagnification :: SLEData "+err.message);
		}
	},
	
	getChangedJson : function(first, second, result){
		try{
			var i = 0;
	        for (i in first) {
	            if (first[i] != second[i]) {
	                result[i] = second[i];
	            }
	        }
	        return result;
		}catch (err) {
			console.error("@SLEData::getchangedJson::"+err.message);
		}
	},
	getLocalMagnificationVal : function(labelId){
		console.log("@getLocalMagnificationVal :: SLEData");
		try{
			var sleIndex = SLEData.getLabelIndex(labelId);
			
			var jsonData = SLEData.getJsonData();
			var lblMagObj = jsonData[sleIndex].local_magnification;
			
			var zoomObj = {};
			
			zoomObj.localMagnificationWidth = lblMagObj.localMagnificationWidth;
			zoomObj.localMagnificationHeight = lblMagObj.localMagnificationHeight;
			zoomObj.localMagnificationFactor = lblMagObj.localMagnificationFactor;
			
			return zoomObj;
		}catch(error){
			console.log("Error in getLocalMagnificationVal :: SLEData "+error.message);
		}
	},
	
	setLocalMagnificationVal : function(labelId,zoomObj){
		console.log("@setLocalMagnificationVal :: SLEData");
		try{
			var activeElmLength = labelId.length;
			for(var i=0;i<activeElmLength;i++){
				var sleIndex = SLEData.getLabelIndex(labelId[i]);
				
				var jsonData = SLEData.getJsonData();
				var lblMagObj = jsonData[sleIndex].local_magnification;
				if(zoomObj.localMagnificationWidth){
					lblMagObj.localMagnificationWidth = zoomObj.localMagnificationWidth;
				}			
				if(zoomObj.localMagnificationHeight){
					lblMagObj.localMagnificationHeight = zoomObj.localMagnificationHeight;
				}			
				if(zoomObj.localMagnificationFactor){
					lblMagObj.localMagnificationFactor = zoomObj.localMagnificationFactor;
				}		
				
				window.CD.services.ds.setOutputData();
			}
			
		}catch(error){
			console.log("Error in setLocalMagnificationVal :: SLEData "+error.message);
		}
	},
	/**
	 * @description : This method is used to update local values of magnification
	 * when magnification values are being updated locally 
	 */
	setGlobalZoomValueToLocal : function(zoomObj){
		console.log("@setGlobalZoomValueToLocal :: SLEData");
		try{
			var jsonData = SLEData.getJsonData();
			for(var eachLbl in jsonData){
				var labelId = jsonData[eachLbl].labelGroupId;
				SLEData.setLocalMagnificationVal(labelId, zoomObj);
			}			
		}catch(err){
			console.log("Error in setGlobalZoomValueToLocal :: SLEData "+error.message);
		}
	},
	/***
	 * This is used to get magnification status on render that whether it is 
	 * local or global
	 */
	getMagnificationEnableLocGlob : function(){
		console.log("@getMagnificationEnableLocGlob :: SLEData");
		try{
			var jsonData = SLEData.getJsonData();
			var flag = '';
			for(var eachLbl in jsonData){
				var zoomingPresent = jsonData[eachLbl].connector_options.zoomingPresent;
				if(zoomingPresent == 'T'){
					flag = 'T';
				}else if(zoomingPresent == 'F'){
					flag = 'F';
					break;
				}
			}
			return flag;
			
		}catch(err){
			console.log("Error in getMagnificationEnableLocGlob :: SLEData "+error.message);
		}
	}
};