var COIData = {
		Json : {},
		customLanguageFlage:'',
		tempImgName:[],
		tempImgId:[],
		textGroupComponent : [],
		init: function(inputJSON) {
			var cd = window.CD;
			var cs = window.CD.services.cs;
			if(cd.questionState == 'new'){
				console.log("@dataservices.initializeModuleData");
				this.Json = jQuery.extend(true, {}, coiDefaultData);//cs.cloneObject(coiDefaultData);  
			}else if(cd.questionState == 'edit'){
				this.Json = inputJSON;
				/*var jsonObj = $.parseJSON(rawDataString);
				if(typeof jsonObj == 'object'){
					this.Json = jsonObj;
				}else{
					this.processString(rawDataString);
				}*/
			}
			
		},
		processString: function(rawDataString) {
		var coiCount = 0; 
		var frameCount = 0; 
		var dataMap = new Array();
		rawDataStringParts = rawDataString.split(';');
		for(var counter in rawDataStringParts){		
			var key = rawDataStringParts[counter].substr(0, rawDataStringParts[counter].indexOf("="));
			var value = rawDataStringParts[counter].substr(rawDataStringParts[counter].indexOf("=") + 1);
			dataMap[key] = value;
			if(key.match(/COI[0-9]+/)){
				coiCount++;
			}	
			
			if(key.match(/CF[0-9]+/)){
				frameCount++;
			}	
		}
		
		var coidataString = {	
				'adminData': {
					'GFS': dataMap['GFS'],   
					'CSO': dataMap['CSO'],
					'OTM': dataMap['OTM'],
					'OTO': dataMap['OTO'],
					'AW': dataMap['AW'],
					'AH': dataMap['AH'],
					'TYPE': dataMap['TYPE'],
					'HRO': dataMap['HRO'],
					'RLO': dataMap['RLO'],
					'HGL': dataMap['HGL'],
					'VGL': dataMap['VGL'],
					'ET': dataMap['ET'],
					'SLELD': dataMap['SLELD'],
					'ZHP': dataMap['ZHP'],
					'audioList':[],
					'imageList':[],
					'feedbackWidth':dataMap['feedbackWidth'],
					'feedbackHeight': dataMap['feedbackHeight'],
					'hinFeedbackX': dataMap['hinFeedbackX'],
					'hinFeedbackY': dataMap['hinFeedbackY'],
					'showHintOrFeedbackInAuthoring':dataMap['showHintOrFeedbackInAuthoring'],
				},
				'FrameData': {},
				'COIData': {},
				'COIRN': dataMap['COIRN']!=undefined?dataMap['COIRN']:'', //COI Random set
				'COIPS': {
					'totalRandomLabels': dataMap['COIPS'].split(',')[0],
					'disableFeedback': dataMap['COIPS'].split(',')[1],
					'disableInstantFeedback': dataMap['COIPS'].split(',')[2],
					'disableHints': dataMap['COIPS'].split(',')[3],
					'studentGradeFormat': dataMap['COIPS'].split(',')[4]
				},
				'VST': dataMap['VST']!=undefined?dataMap['VST']:'',
				'COIST': dataMap['COIST']!=undefined?dataMap['COIST']:''
		}



		for(var i=0 ; i<coiCount ; i++){
			var skey = 'COI'+i;
			var coid = dataMap[skey].split(',');
			var newCoiStr = {
					'holder_x':coid[0],
					'holder_y':coid[1],
					'image_data':coid[2],
					'correct_ans':coid[3],
					'transparent_border':coid[4],
					'transparent':coid[5],
					'media_value':coid[6],
					'media_label_XY':{
						'x': coid[7]!='N'?coid[7].split('|')[0]:'N',
						'y': coid[7]!='N'?coid[7].split('|')[1]:'N',
					},
					'is_label_selected':coid[8],
					'media_local_x_pos':coid[9],
					'media_local_y_pos':coid[10],
					'hint_value':coid[11],
					'label_value':coid[12],
					'custom_hint':coid[13],
					
					
					'feedback_value':coid[14],
					'infoHideText':coid[15],
					'infoHintText':coid[16],
					'infoFText':coid[17],
					'labelGroupId':coid[18],
					'lockStatus':coid[19],
					'textFormat':{
						'underline_value':coid[20],
						'fontSize':coid[20],
						'fontStyle':coid[20],
						'align':coid[20]
					}
					
					
			};		
			coidataString.COIData[i]=newCoiStr;
		}
		
		for(var i=0 ; i<frameCount ; i++){
			var skey = 'CF'+i;
			var frameData = dataMap[skey].split(',');
			var newFrameStr = {
					'frameX' : frameData[0],
					'frameY' : frameData[1],
					'frameWidth' : frameData[2],
					'frameHeight' : frameData[3],
					'frameImageList' : {
						'imageName' : frameData[4].split('|')[0],
						'imageScaleFactor' : frameData[4].split('|')[1],
						'imageX' : frameData[4].split('|')[2],
						'imageY' : frameData[4].split('|')[3]
					},
					'frameTextList' : {
						'textValue': frameData[5].split('|')[0],
						'maxWidth': frameData[5].split('|')[1],
						'fontSize': frameData[5].split('|')[2],
						'border': frameData[5].split('|')[3],
						'textX': frameData[5].split('|')[4],
						'textY': frameData[5].split('|')[5]
					},
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
			
			var studGuiArray = frameData[6].split('%d%');
			for(var j=0; j<studGuiArray.length; j++){
				var tmp = studGuiArray[j].split('|');
				var tmp1 = {'Component':tmp[0]!=undefined?tmp[0]:'', 'X':tmp[1]!=undefined?tmp[1]:'','Y':tmp[2]!=undefined?tmp[2]:''};
				studGuiArray[j]=tmp1;
			}
			newFrameStr.frameStudentGUI= studGuiArray;
			coidataString.FrameData[i]=newFrameStr;
		}
		
		
		
		this.Json = coidataString;
	},
/* added data related code from view to data*/
		 /* get COIData for coiView
		 * By nabonita bhattacharyya
		 */
		getJsonData : function(){
			return window.CD.module.data.Json.COIData;
		},
		/*
		 * get adminData for coiView
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
			var labelCount = COIView.getDataIndex(labelGroupId)
			return labelCount;
		},
		reIndexLabels : function() {
			
		     console.log("@COIData::reIndexLabels");
		 	 try{
		 		var cs = window.CD.services.cs;
				var outputJson = window.CD.module.data.Json;
				var labelCount = cs.objLength(outputJson.COIData);
				var tmpCOIData = {};
				
				var c = 0;				
				for(key in outputJson.COIData) {
					tmpCOIData['COI' + c] = outputJson.COIData[key]; 
					c++;
				}
				outputJson.COIData = {};
				outputJson.COIData = tmpCOIData;
		     }catch(err){
					console.error("@COIData::Error on reIndexLabels::"+err.message);
				}
				
			},

			/*
			 * This is used for start over and reset function call
			 * By Nabonita Bhattacharyya
			 * modified on 03re July,2013
			 */
			resetAll : function(stage_id){
				console.log('@COIData: start_over')
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
					console.error("@COIData::Error for start_over::"+err.message);
				}
				
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
			 * function name: setEachLabelOutputData()
			 * author:Piyali Saha
			 */
			setEachLabelOutputData: function(indID,changefieldArr,changeLabelData){
				console.log("@COIData::setEachLabelOutputData");
				try{
					if(changefieldArr){
						var COIDJsonData1=window.CD.module.data.Json.COIData[indID];
						for(kky in changefieldArr){
							if(typeof kky==="object"){
								for(ky in kky){
									COIDJsonData1[kky][ky]=changefieldArr[kky][ky];
								}
							}else{
								COIDJsonData1[kky]=changefieldArr[kky];
							}
							
						}
						
						
					}
					if(changeLabelData){
						window.CD.module.data.Json.COIData[indID]=changeLabelData;
						window.CD.module.data.reIndexLabels();
					}
					window.CD.services.ds.setOutputData();

				}catch(err){
					console.error("@COIData::setEachLabelOutputData::"+err.message);
			    }
			},
			
			
			applyClickPublishOk :function(){
				console.log("@COIView.applyClickPublishOk");
				try{
					var ds = window.CD.services.ds;
					var jsonData=window.CD.module.data.Json;
					var CoiData=jsonData.COIData;
					var jsonCOIPS=jsonData.COIPS;
					var jsonCOIPS = jsonData.COIPS;
					var randomSet = new Array();
					var totalLabel=0;
					var totalDistractor=0;
					var coirn = "";
					
					var totalRandomLabels=parseInt($("#pub_standardLabels #labelsNo").val());
					var totalRandomDistractors=parseInt($("#pub_distractorLabels #distractorNo").val());
					
					if(CoiData){
						for(coi in CoiData){
							var coiObj=CoiData[coi];							
							if(coiObj.correct_ans==="T"){
								totalLabel++;
							}else if(coiObj.correct_ans==="F"){
								totalDistractor++;
							}
						}				
					}
				
					for(var i=0; i<(totalLabel+totalDistractor); i++){
						randomSet.push(i);
					}
					coirn = randomSet.join(',');
					jsonData.COIRN = coirn;
					
					if(totalRandomLabels > totalLabel)totalRandomLabels=totalLabel;
					if(totalRandomDistractors > totalDistractor)totalRandomDistractors=totalDistractor;
					
					jsonCOIPS['totalRandomLabels']=totalRandomLabels;
					jsonCOIPS['totalRandomDistractors']=totalRandomDistractors;
										
					ds.setOutputData();	
					console.log("@COIView.applyClickPublishOk");
					
				}catch(err){
					console.error("@COIView::Error on applyClickPublishOk::"+err.message);
				}
				
			},
			/**
			 * function name: getCoiDataElementNumberwise()
			 * author:Piyali Saha
			 */
			getCoiDataElementNumberwise: function(number){
				console.log("@COIData::getCoiDataElementNumberwise");
				try{
						var coidataVals=window.CD.module.data.Json.COIData;
						var returnCoiObj="";
						var coiNum='COI'+parseInt(number);
						$.each(coidataVals,function(kk,vv){
							if(kk==coiNum){
								returnCoiObj=vv
							}
						});
						return returnCoiObj;
				}catch(err){
					console.error("@COIData::getCoiDataElementNumberwise::"+err.message);
			    }
			},
			/**
			 * function name: getEachLabelOutputData()
			 * author:Piyali Saha
			 */
			getEachLabelOutputData: function(indID,fetchPropa){
				console.log("@COIData::getEachLabelOutputData");
				try{
					if(fetchPropa){
						var Coijsondata=window.CD.module.data.Json.COIData[indID];
						return Coijsondata[fetchPropa];
										
					}
					
				}catch(err){
					console.error("@COIData::getEachLabelOutputData::"+err.message);
			    }
			},
			/**
			 * function name: setLabelOutputData()
			 * author:Piyali Saha
			 */
			setLabelOutputData: function(setoutputDataParam){
				console.log("@COIData::setLabelOutputData");
				try{
					var stg = window.CD.services.cs.getCanvas();
					var labelData = COIView.cs.cloneObject(coiDataDefaults);
					var canvasWidth = stg.getWidth();//attrs.width;
					var canvasHeight = stg.getHeight();//attrs.height;
					
					
					
					labelData.correct_ans = setoutputDataParam.correct_ans;
					labelData.holder_x = setoutputDataParam.holder_x;
					labelData.holder_y = setoutputDataParam.holder_y;
					labelData.labelGroupId = setoutputDataParam.labelGroupId;
					labelData.lockStatus = setoutputDataParam.lockStatus;
					labelData.zIndex = setoutputDataParam.labelGroup.getZIndex();
					//labelData.name = setoutputDataParam.name;
					labelData.label_value = setoutputDataParam.labelVal;	
					var coiInedxx='COI'+setoutputDataParam.index;
					window.CD.module.data.setEachLabelOutputData(coiInedxx,"",labelData);
					window.CD.module.data.reIndexLabels();
					/*Set hint feedback position*/
					var hintparam=this.getHintParameterFromJson();
					var hint_x=hintparam.x;
					var hint_y=hintparam.y;
					if(hint_x==0){
						var xx=canvasWidth-50;
						this.setHintParameterInJson('','',xx,'');
						
					}
					if(hint_y==0){
						var yy=canvasHeight-100;
						this.setHintParameterInJson('','','',yy);
					}
					
					
					/*this method will handle hide text checkbox click on click part*/
					/*add info text in label*/
					var param={
							labelGrpID:setoutputDataParam.labelGroupId,
							labelGrpObj:setoutputDataParam.labelGroup,
							labelData:labelData,
							
					}
					COIView.createInfoTextObject(param);
					/*end here*/
					
					
					
					
					window.CD.services.ds.setOutputData();
				
				
				}catch(err){
					console.error("@COIData::setLabelOutputData::"+err.message);
			    }
			},/**
			 * function name: getHintParameterFromJson()
			 * author:Piyali Saha
			 */
			getHintParameterFromJson: function(){
				console.log("@COIData.getHintParameterFromJson");
				try{
					var adminJsondata=window.CD.module.data.getJsonAdminData();
					var ZHPSplit=adminJsondata.ZHP.split(',');
					var hint_width=ZHPSplit[5];
					var hint_height=ZHPSplit[6];
					var hint_x=ZHPSplit[7];
					var hint_y=ZHPSplit[8];
					var hint={
								w:parseInt(hint_width),
								h:parseInt(hint_height),
								x:parseInt(hint_x),
								y:parseInt(hint_y)						
							 }
					return hint;
				}catch(err){
					console.error("@COIData::Error on getHintParameterFromJson::"+err.message);
				}
				
			},
			/**
			 * function name: setHintParameterInJson()
			 * author:Piyali Saha
			 */
			setHintParameterInJson: function(w,h,x,y){
				console.log("@COIData.setHintParameterInJson");
				try{
					var adminJsondata=window.CD.module.data.getJsonAdminData();
					var ZHPSplit=adminJsondata.ZHP.split(',');
					if(w)ZHPSplit[5]=parseInt(w);
					if(h)ZHPSplit[6]=parseInt(h);
					if(x)ZHPSplit[7]=parseInt(x);
					if(y)ZHPSplit[8]=parseInt(y);
					var newUpdatedZHP=ZHPSplit.join();
					adminJsondata.ZHP=newUpdatedZHP;
					window.CD.services.ds.setOutputData();
				}catch(err){
					console.error("@COIData::Error on setHintParameterInJson::"+err.message);
				}
				
			},	
			updateLockStatus:function(group,status) {
				var id = group.attrs.id;
				if(id.match(/label_[0-9]+/)) {
					var coi = this.getLabelIndex(id);
					var coiData = this.getJsonData();
					coiData[coi].lockStatus = status;
				} 
				window.CD.services.ds.setOutputData();
			},
			/*
			 * For getting node for align label to frame
			 */
			getKeyIndex:function(){
				return 'COI';
			},
			/**
			 * This method is used to get hint/feedback parameters 
			 * from output json
			 * By Nabonita Bhattacharyya
			 */
			getHintFeedbackFromJson: function(){
				console.log("@COIData.getHintFeedbackFromJson");
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
					console.error("@COIData::Error on getHintFeedbackFromJson::"+err.message);
				}
				
			},
			coiResetData: function(){
				var ds = window.CD.services.ds;
				var cd = window.CD;
				if(ds.getOptionLabel() == "MS"){
					cd.module.data.Json["COIST"] = "T";
					var COIData1 =  cd.module.data.Json.COIData;
					for(var key in COIData1){
						cd.module.data.Json.COIData[key].correct_ans = "F";
					}
					cd.inputString = JSON.stringify(window.CD.module.data.Json);
					cd.questionState = 'edit';
					ds.initializeModuleData();
					new Stage();
				}
					
					
				if(ds.getOptionLabel() == "SS"){
					cd.module.data.Json["COIST"] = "F";
					var COIData1 =  cd.module.data.Json.COIData;
					for(var key in COIData1){
						cd.module.data.Json.COIData[key].correct_ans = "F";
					}
					cd.inputString = JSON.stringify(window.CD.module.data.Json);
					cd.questionState = 'edit';
					ds.initializeModuleData();
					new Stage();
				}
				
				var jsonData = window.CD.module.data.Json;
				var COIData1 = jsonData.COIData;
				var jsonCOIPS = jsonData.COIPS;
				var totalLabel = 0;
				var totalDistractor = 0;
				
				if (COIData1) {
					for (coi in COIData1) {
						var coiObj = COIData1[coi];
						if (coiObj.correct_ans === "T") {
							totalLabel++;
						} else if (coiObj.correct_ans === "F") {
							totalDistractor++;
						}
					}

				}
				
				jsonCOIPS.totalRandomLabels = totalLabel;
				jsonCOIPS.totalRandomDistractors = totalDistractor;	
				
			},
			setZindex : function(label){
				var coiData = window.CD.module.data.Json.COIData;
				for(key in coiData){
					for(var i=0; i<label.parent.children.length;i++){
						if(coiData[key].labelGroupId == label.parent.children[i].getId()){
							coiData[key].zIndex = label.parent.children[i].getZIndex();
						}
					}
				}	
			},
			/*********************************** Added for New Label text ***********************************/
			getTextStyleData : function(textId){
				try{
					var labelId = 'label_'+textId;
					var labelIndex = COIData.getLabelIndex(labelId);
					var textFormat = {};
					var textObj = window.CD.module.data.Json.COIData[labelIndex].textFormat;
					textFormat.align = textObj.align;
					textFormat.fontSize = textObj.fontSize;
					textFormat.fontStyle = textObj.fontStyle;
					textFormat.underline_value = textObj.underline_value;
					return textFormat;
				}catch(error){
					console.info("Error in COIData :: getTextStyleData : "+error.message);
				}
			},
			
			/**
			 * @params: id of a particular canvas text
			 * @description : this method is used for getting the canvas text value
			 * for the particular textId from Json
			 */
			getLabelTextValue : function(labelId){
				try{
					var coiIndex = COIData.getLabelIndex(labelId);
					
					var jsonData = COIData.getJsonData();
					var lblObj = jsonData[coiIndex];
					var textValue = lblObj.label_value;
					return textValue;
				}catch(error){
					console.info("Error in COIData :: getLabelTextValue : "+error.message);
				}
			},
			
			/**
			 * @params : params : label text format parameter object
			 * labelId : id of the label where the text is being added
			 * @description : This method is used to update text format json data with 
			 * label text format parameters
			 */
			updateLabelTextData : function(params,labelId) {
				console.log("@COIData :: updateLabelTextData");
				try{
					if(params){
						var labelIndex = COIData.getLabelIndex(labelId);
						window.CD.module.data.Json.COIData[labelIndex].textFormat = {};
						var coiJsonData = window.CD.module.data.Json.COIData[labelIndex].textFormat;
						for(var eachKey in params){
							coiJsonData[eachKey] = params[eachKey];
						}					
					}
					window.CD.services.ds.setOutputData();
				}
				catch(error){
					console.info("Error in COIData :: updateLabelTextData : "+error.message);
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
					var labelIndex = COIData.getLabelIndex(labelId);
					/** Label data populate in Json **/
					/* Json value */
					var coiJsonData = window.CD.module.data.Json.COIData[labelIndex];
					/* Default values */
					var defaultParams = {};
					defaultParams = COIData.getTextStyleData(textId);  
					
					
					var txtVal = COIData.getLabelTextValue(labelId);
					
					defaultParams.label_value = txtVal;
					defaultParams.textFormat = coiJsonData.textFormat;
					
					return defaultParams;
				}
				catch(error){
					console.info("Error in COIData :: getDefaultParamsFromJson : "+error.message);
				}
			},
			/**
			 * @param : textId :: id of a particular label text
			 * @description : this method is used for getting text format values from json
			 */
			getTextFormatParamsFromJson : function(textId){
				console.log("@getTextFormatParamsFromJson :: coiData");
				try{
					var labelId = 'label_'+textId;
					var labelIndex = COIData.getLabelIndex(labelId);
					/** Label data populate in Json **/
					/* Json value */
					var coiJsonData = window.CD.module.data.Json.COIData[labelIndex];
					/* Default text format values */
					var defaultParams = {};
					
					defaultParams = coiJsonData.textFormat;
					
					return defaultParams;
				}
				catch(error){
					console.info("Error in COIData :: getTextFormatParamsFromJson : "+error.message);
				}
			},
			
			/**
			 * @params: textId :: id of a particular label text
			 * @description : this method is used for getting underline value of 
			 * the particular text object
			 */
			getUnderlineStatus : function(textId){
				console.log("@COIData :: getUnderlineStatus");
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
					console.info("Error in COIData :: getUnderlineStatus : "+error.message);
				}
			},
			
			getHintFeedbackValue : function(labelId){
				console.log("@getHintFeedbackValue :: COIData");
				try{
					var coiIndex = COIData.getLabelIndex(labelId);
					
					var jsonData = COIData.getJsonData();
					var lblObj = jsonData[coiIndex];
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
					console.info("Error in COIData :: getHintFeedbackValue : "+error.message);
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
					var coiIndex = COIData.getLabelIndex(labelId);
					
					var jsonData = COIData.getJsonData();
					var lblObj = jsonData[coiIndex];
					lblObj.label_value = textValue;
					
					ds.setOutputData();
				}catch(error){
					console.info("Error in COIData :: getLabelTextValue : "+error.message);
				}
			},
			setLabelTextFormat : function(dataIndex){
				console.log('@setLabelTextFormat :: COIData');
				try{
					if(dataIndex){
						var COIJsonData=window.CD.module.data.Json.COIData[dataIndex];
						if(window.CD.globalStyle.alignment != ''){
							COIJsonData.textFormat.align = window.CD.globalStyle.alignment;
						}
						if(window.CD.globalStyle.fontStyle != ''){
							COIJsonData.textFormat.fontStyle = window.CD.globalStyle.fontStyle;
						}
						if(window.CD.globalStyle.underlineVal != ''){
							COIJsonData.textFormat.underline_value = window.CD.globalStyle.underlineVal;
						}
						
					}
					window.CD.services.ds.setOutputData();

				}catch(err){
					console.error("@COIData::setLabelTextFormat::"+err.message);
			    }
			},
			
			/* setting the first label index */
			getLabelStartId :function(){
				console.log("@getLabelStartId :: COIData");
				try{
					var cs = window.CD.services.cs;
					var COILabelJson = COIData.getJsonData();
					var labelCount = cs.objLength(COILabelJson);
					var tempArray = new Array();
					var finalLabelId = labelCount;
					for(var i=0; i<labelCount; i++){
						tempArray.push(parseInt(COILabelJson['COI'+i].labelGroupId.split('_')[1]));			
					}
					tempArray.sort(function(a, b){return b-a});
					
					finalLabelId = tempArray[0] + 1;
					return finalLabelId;
				}
				catch(err){
					console.log("Error in getLabelStartId :: COIData"+err.message);
				}
			},	
};