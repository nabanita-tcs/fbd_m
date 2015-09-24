var PRGData= {
		Json : {},
		customLanguageFlage:'',
		tempImgName:[],
		tempImgId:[],
		textGroupComponent : [],
		prgOtoDuplicateElm : false,
		init: function(inputJSON) {
			var cd = window.CD;
			if(cd.questionState == 'new'){
				console.log("@PRGData.init");
				this.Json = jQuery.extend(true, {}, prgDefaultData);//prgDefaultData;  
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
			var prgDockCount = 0;
			var prgLabelCount = 0; 
			var frameCount = 0; 
			var dataMap = new Array();
			rawDataStringParts = rawDataString.split(';');
			for(var counter in rawDataStringParts){		
				var key = rawDataStringParts[counter].substr(0, rawDataStringParts[counter].indexOf("="));
				var value = rawDataStringParts[counter].substr(rawDataStringParts[counter].indexOf("=") + 1);
				dataMap[key] = value;
				if(key.match(/PRGS[0-9]+/)){
					prgDockCount++;
				}
				if(key.match(/PRGT[0-9]+/)){
					prgLabelCount++;
				}
				if(key.match(/CF[0-9]+/)){
					frameCount++;
				}	
			}


			var prgdataString = {	
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
						//'ICS': dataMap['ICS'],
						'HGL': dataMap['HGL'],
						'VGL': dataMap['VGL'],
						'ET': dataMap['ET'],
						'SLELD': dataMap['SLELD'],
						'ZHP': dataMap['ZHP'],
						'AVP': dataMap['AVP'],
						'audioList':[],
						'imageList':[],
						'feedbackWidth': '120',
						'feedbackHeight': '70',
						'showHintOrFeedbackInAuthoring':'none'
					},
					'DCKLD': dataMap['DCKLD'],
					'FrameData': {},
					'PRGData': {
						'PRGLabelData':{},
						'PRGDockData':{}
					},
					'PRGGV': dataMap['PRGGV']!=undefined?dataMap['PRGGV']:'',
					'PRGRQ': dataMap['PRGRQ']!=undefined?dataMap['PRGRQ']:'',
					'PRGRN': dataMap['PRGRN']!=undefined?dataMap['PRGRN']:'',
					'PRGPS': {
						'totalRandomLabels': dataMap['PRGPS'].split(',')[0],
						'disableFeedback' : dataMap['PRGPS'].split(',')[1],
						'disableInstantFeedback' : dataMap['PRGPS'].split(',')[2],
						'disableHints' : dataMap['PRGPS'].split(',')[3],
						'studentGradeFormat' : dataMap['PRGPS'].split(',')[4],
						'sentenceReorder' : dataMap['PRGPS'].split(',')[5]
					},
					'PRGGP': {
						'borderGlobal': dataMap['PRGGP'].split(',')[0],
						'backGroundGlobal': dataMap['PRGGP'].split(',')[1],
						'labelBorderGlobal': dataMap['PRGGP'].split(',')[2],
						'labelBGGlobal': dataMap['PRGGP'].split(',')[3],
						'dockBGGlobal': dataMap['PRGGP'].split(',')[4],
						'textAlign': dataMap['PRGGP'].split(',')[5]
					},
					'VST': dataMap['VST']!=undefined?dataMap['VST']:'',
					'PRGDS': dataMap['PRGDS']!=undefined?dataMap['PRGDS']:'',
					'PRGSD': dataMap['PRGSD']!=undefined?dataMap['PRGSD']:''
			}


			for(var i=0 ; i<prgLabelCount ; i++){
				var skey = 'PRGT'+i;
				var prgt = dataMap[skey].split(',');
				var prgLabelStr = {'term':prgt[0],
						'term_pos_x':prgt[1],
						'term_pos_y':prgt[2],
						'current_item_transparency_border':prgt[3],
						'current_item_transparency':prgt[4],
						'media_PRGT_value':prgt[5],
						'coor_PRGT_value':{
							'x' : prgt[6].split('|')[0],
							'y' : prgt[6].split('|')[1]
						},
						'media_dock_x':prgt[7],
						'media_dock_y':prgt[8],
						'textFormat':{
							'underline_value':prgt[9],
							'fontSize':prgt[10],
							'fontStyle':prgt[11],
							'align':prgt[12]
						},
						'zIndex':''
				};
				prgdataString.PRGData.PRGLabelData[i]=prgLabelStr;
			}

		


			for(var i=0 ; i<prgDockCount ; i++){
				var skey = 'PRGS'+i;
				var PRGcd = dataMap[skey].split(',');
				var prgDockStr = {'sentence':PRGcd[0],
						'feedback':PRGcd[1],
						'PRG_sentence_list_x':PRGcd[2],
						'PRG_sentence_list_y':PRGcd[3],
						'current_SLED_item_transparency':PRGcd[4],
						'media_PRG_value':PRGcd[5],
						'coor_PRG_value':{
							'x' : PRGcd[6].split('|')[0],
							'y' : PRGcd[6].split('|')[1]
						},
						'media_label_x':PRGcd[7],
						'media_label_y':PRGcd[8],
						'caption':PRGcd[9],
						'sentence_feedback':PRGcd[10]!= undefined ? PRGcd[10]:'',
						'custom_hint':PRGcd[11]!= undefined ? PRGcd[11]:'',
						'sentence_hint':PRGcd[12]!= undefined ? PRGcd[12]:'',
						'textFormat':{
							'underline_value':PRGcd[15],
							'fontSize':PRGcd[15],
							'fontStyle':PRGcd[15],
							'align':PRGcd[15]
						}		
								
								
								
								
				};
				prgdataString.PRGData.PRGDockData[i]=prgDockStr;
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
			prgdataString.FrameData[i]=newFrameStr;
		}

		this.Json = prgdataString;
	},
	/*
	 * get prgData for prgView
	 * By nabonita bhattacharyya
	 */
	getJsonData : function(){
		return window.CD.module.data.Json.PRGData.PRGLabelData;
	},
	getDockJsonData : function(){
		return window.CD.module.data.Json.PRGData.PRGDockData;
	},
	/*
	 * get adminData for prgView
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
		var labelCount = this.getPRGLabelIndex(labelGroupId);
		return labelCount;
	},
	getPRGLabelIndex : function(labelGroupId) {
		var  outputJson = window.CD.module.data.Json.PRGData.PRGLabelData;
		for(key in outputJson) {
			if(outputJson[key].labelGroupId == labelGroupId)
				return key;
		}
	},
	getDockIndex : function (dockGroupId){
		var dockCount = this.getPRGDockIndex(dockGroupId);
		return dockCount;
	},
	getPRGDockIndex : function(dockGroupId) {
		var  outputJson = window.CD.module.data.Json.PRGData.PRGDockData;
		for(key in outputJson) {
			if(outputJson[key].dockGroupId == dockGroupId)
				return key;
		}
	},
	reIndexLabels : function() {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;
		var outputJson = window.CD.module.data.Json;
		var tmpPRGLabelData = {};
		
		var c = 0;				
		for(key in outputJson.PRGData.PRGLabelData) {
			tmpPRGLabelData['PRGT' + c] = outputJson.PRGData.PRGLabelData[key]; 
			c++;
		}
		outputJson.PRGData.PRGLabelData = {};
		outputJson.PRGData.PRGLabelData = tmpPRGLabelData;
		
	},/**
	 * function name: getHintParameterFromJson()
	 * author:Piyali Saha
	 */
	getHintParameterFromJson: function(){
		console.log("@PRGData.getHintParameterFromJson");
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
					};
			return hint;
		}catch(err){
			console.error("@PRGData::Error on getHintParameterFromJson::"+err.message);
		}
		
	},
	/**
	 * function name: setHintParameterInJson()
	 * author:Piyali Saha
	 */
	setHintParameterInJson: function(w,h,x,y){
		console.log("@PRGData.setHintParameterInJson");
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
			console.error("@PRGData::Error on setHintParameterInJson::"+err.message);
		}
		
	},
	getLabelStartId :function(){
		var cs = window.CD.services.cs;
		var PRGLabelJson = PRGData.getJsonData();
		var labelCount = cs.objLength(PRGLabelJson);
		var tempArray = new Array();
		var finalLabelId = labelCount;
		for(var i=0; i<labelCount; i++){
			tempArray.push(parseInt(PRGLabelJson['PRGT'+i].labelGroupId.split('_')[1]));			
		}
		tempArray.sort(descending);
		function descending( a, b ) {
			return b - a;
			}
		finalLabelId = tempArray[0] + 1;
		return finalLabelId;
	},	
	getDockStartId :function(){
		var cs = window.CD.services.cs;
		var PRGDockJson = PRGData.getDockJsonData();
		var dockCount = cs.objLength(PRGDockJson);
		var tempArray = new Array();
		var finalDockId = dockCount;
		for(var i=0; i<dockCount; i++){
			tempArray.push(parseInt(PRGDockJson['PRGS'+i].dockGroupId.split('_')[2]));			
		}
		tempArray.sort(descending);
		function descending( a, b ) {
			return b - a;
			}
		finalDockId = tempArray[0] + 1;
		return finalDockId;
	
	},	
	setEachLabelOutputData: function(indID,changefieldArr){
		console.log("@PRGData::setEachLabelOutputData");
		try{
			if(changefieldArr){
				var PRGJsonData=window.CD.module.data.Json.PRGData.PRGLabelData[indID];
				for(kky in changefieldArr){
					if(typeof kky==="object"){
						for(ky in kky){
							PRGJsonData[kky][ky]=changefieldArr[kky][ky];
						}
					}else{
						var val = changefieldArr[kky];
						if(kky == 'label_value'){							
							kky = 'term';
						}
						PRGJsonData[kky]= val;
					}
					
				}
			}			
			window.CD.services.ds.setOutputData();

		}catch(err){
			console.error("@PRGData::setEachLabelOutputData::"+err.message);
	    }
	},
	
	/**
	 * function name: getEachLabelOutputData()
	 * author:Piyali Saha
	 */
	getEachLabelOutputData: function(indID,fetchPropa){
		console.log("@PRGData::getEachLabelOutputData");
		try{
			if(fetchPropa){
				var Prgjsondata=window.CD.module.data.Json.PRGData.PRGLabelData[indID];
				if(fetchPropa == 'label_value')
					fetchPropa = 'term';
				return Prgjsondata[fetchPropa];
								
			}
			
		}catch(err){
			console.error("@PRGData::getEachLabelOutputData::"+err.message);
	    }
	},
	reIndexDocks : function() {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;
		var outputJson = window.CD.module.data.Json;
		var tmpPRGDockData = {};
		
		var c = 0;				
		for(key in outputJson.PRGData.PRGDockData) {
			tmpPRGDockData['PRGS' + c] = outputJson.PRGData.PRGDockData[key]; 
			c++;
		}
		outputJson.PRGData.PRGDockData = {};
		outputJson.PRGData.PRGDockData = tmpPRGDockData;
		
	},

	/*
	 * This is used for start over and reset function call
	 * By Nabonita Bhattacharyya
	 * modified on 03re July,2013
	 */
	resetAll : function(stage_id){
		console.log('@PRGData: start_over')
		try{
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cd = window.CD;
			cd.questionState = 'new';
			cd.inputString = '';
			$('#'+stage_id).remove();
			var frameGroup = cs.findGroup('frame_0');
			ds.initializeModuleData();
			new Stage();
			cs.setActiveElement(frameGroup,'frame');
		}catch(err){
			console.error("@PRGData::Error for start_over::"+err.message);
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
	 * For fill and stroke status
	 */
	fillAndBorderStatus : function(data){
		
		if(data ==='F'){
			return false;
		}else{
			return true;
		}
	},
	updateLockStatus:function(group,status) {
		var id = group.attrs.id;
		if(id.match(/^label_[0-9]+/)) {
			var label = this.getLabelIndex(id);
			var labelData = this.getJsonData();
			labelData[label].lockStatus = status;
		} else if(id.match(/^dock_label_[0-9]+/)) {
			var dock = this.getDockIndex(id);
			var dockData = this.getDockJsonData();
			dockData[dock].lockStatus = status;
		}
		window.CD.services.ds.setOutputData();
	},
	/*
	 * For getting node for align label to frame
	 */
	getKeyIndex:function(){
		return 'PRGT';
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
					'instructionText': 'F'
			}
			return inspectorLabelData;
		}
		catch(e){
			console.error("@PRGData::Error on getInspectorLabelData::"+e.message);
		}
		
	},
	/*
	 * This is used to get label group0
	 */
	getLabelGroup : function(){
		var cs = window.CD.services.cs;
		var labelGrp = cs.findGroup('label_0');
		return labelGrp;
	},
	/*
	 * This is used to get dock group
	 */
	getDockGroup : function(){
		var cs = window.CD.services.cs;
		var dockGrp = cs.findGroup('dock_label_0');
		return dockGrp;
	},
	getOldLabelDockData : function(){
		try{
			var oldData = {
					'height' : '',
					'width' : '',
					'fill' : '',
					'stroke': '',
					'transpType':'',				
					'dockHeight' : '',
					'dockWidth' : '',
					'hintWidth':'',
					'hintHeight':'',
					'feedbackWidth':'',
					'feedbackHeight':'',
					'labelOrDockHint':'',
					'labelOrDockFdbk':'',
					'hintOrFeedback':''
			}
			return oldData;
		}
		catch(e){
			console.error("@PRGData::Error on getInspectorLabelData::"+e.message);
		}
		
	},
	/**
	 * This method is used to get hint/feedback parameters 
	 * from output json
	 * By Nabonita Bhattacharyya
	 */
	getHintFeedbackFromJson: function(){
		console.log("@PRGData.getHintFeedbackFromJson");
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
			console.error("@PRGData::Error on getHintFeedbackFromJson::"+err.message);
		}
		
	},
	prgResetData: function(){
		var ds = window.CD.services.ds;
		var cd = window.CD;
		if(ds.getOptionSentence() == "senOrder")
			cd.module.data.Json["PRGPS"]["sentenceReorder"] = "T";
		if(ds.getOptionSentence() == "lockOrder")
			cd.module.data.Json["PRGPS"]["sentenceReorder"] = "F";
		if(ds.getOptionLabel() == 'OTM'){
			cd.module.data.Json.adminData.OTM = true;
			cd.module.data.Json.adminData.OTO = false;
		}
		if(ds.getOptionLabel() == 'OTO'){
			cd.module.data.Json.adminData.OTM = false;
			cd.module.data.Json.adminData.OTO = true;
		}
		cd.inputString = JSON.stringify(window.CD.module.data.Json);
		cd.questionState = 'edit';
		ds.initializeModuleData();
		new Stage();
	},
	setZindex : function(label){
		var prgData = window.CD.module.data.Json.PRGData.PRGLabelData;
		for(key in prgData){
			for(var i=0; i<label.parent.children.length;i++){
				if(prgData[key].labelGroupId == label.parent.children[i].getId()){
					prgData[key].zIndex = label.parent.children[i].getZIndex();
				}
			}
		}	
	},
	
	
	/*********************************** Added for New Label text ***********************************/
	getTextStyleData : function(textId){
		try{
			var labelId = 'dock_label_'+textId;
			var labelIndex = PRGData.getDockIndex(labelId);
			
			var textFormat = {};
			var textObj = window.CD.module.data.Json.PRGData.PRGDockData[labelIndex].textFormat;
			textFormat.align = textObj.align;
			textFormat.fontSize = textObj.fontSize;
			textFormat.fontStyle = textObj.fontStyle;
			textFormat.underline_value = textObj.underline_value;
			return textFormat;
		}catch(error){
			console.info("Error in PRGData :: getTextStyleData : "+error.message);
		}
	},
	getLabelTextStyleData : function(textId){
		try{
			var labelId = 'label_'+textId;
			var labelIndex = PRGData.getLabelIndex(labelId);
			
			var textFormat = {};
			var textObj = window.CD.module.data.Json.PRGData.PRGLabelData[labelIndex].textFormat;
			textFormat.align = textObj.align;
			textFormat.fontSize = textObj.fontSize;
			textFormat.fontStyle = textObj.fontStyle;
			textFormat.underline_value = textObj.underline_value;
			return textFormat;
		}catch(error){
			console.info("Error in PRGData :: getLabelTextStyleData : "+error.message);
		}
	},
	/**
	 * @params: id of a particular canvas text
	 * @description : this method is used for getting the canvas text value
	 * for the particular textId from Json
	 */
	getLabelTextValue : function(labelId){
		try{
			var prgIndex = PRGData.getLabelIndex(labelId);
			
			var jsonData = PRGData.getJsonData();
			var lblObj = jsonData[prgIndex];
			var textValue = lblObj.term;
			return textValue;
		}catch(error){
			console.info("Error in PRGData :: getLabelTextValue : "+error.message);
		}
	},
	
	/**
	 * @params : params : label text format parameter object
	 * labelId : id of the label where the text is being added
	 * @description : This method is used to update text format json data with 
	 * label text format parameters
	 */
	updateLabelTextData : function(params,labelId) {
		console.log("@PRGData :: updateLabelTextData");
		try{
			if(params){
				var labelIndex = PRGData.getLabelIndex(labelId);
				window.CD.module.data.Json.PRGData.PRGLabelData[labelIndex].textFormat = {};
				var prgJsonData = window.CD.module.data.Json.PRGData.PRGLabelData[labelIndex].textFormat;
				for(var eachKey in params){
					prgJsonData[eachKey] = params[eachKey];
				}					
			}
			window.CD.services.ds.setOutputData();
		}
		catch(error){
			console.info("Error in PRGData :: updateLabelTextData : "+error.message);
		}
	},
	
	/**
	 * @params : params : label text format parameter object
	 * labelId : id of the label where the text is being added
	 * @description : This method is used to update text format json data with 
	 * label text format parameters
	 */
	updateDockTextData : function(params,dockId) {
		console.log("@PRGData :: updateDockTextData");
		try{
			if(params){
				var dockIndex = PRGData.getDockIndex(dockId);
				window.CD.module.data.Json.PRGData.PRGDockData[dockIndex].textFormat = {};
				var prgJsonData = window.CD.module.data.Json.PRGData.PRGDockData[dockIndex].textFormat;
				for(var eachKey in params){
					prgJsonData[eachKey] = params[eachKey];
				}					
			}
			window.CD.services.ds.setOutputData();
		}
		catch(error){
			console.info("Error in PRGData :: updateDockTextData : "+error.message);
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
			var labelIndex = PRGData.getLabelIndex(labelId);
			/** Label data populate in Json **/
			/* Json value */
			var prgJsonData = window.CD.module.data.Json.PRGData.PRGLabelData[labelIndex];
			/* Default values */
			var defaultParams = {};
			defaultParams = PRGData.getTextStyleData(textId);  
			
			
			var txtVal = PRGData.getLabelTextValue(labelId);
			
			defaultParams.label_value = txtVal;
			defaultParams.textFormat = prgJsonData.textFormat;
			
			return defaultParams;
		}
		catch(error){
			console.info("Error in PRGData :: getDefaultParamsFromJson : "+error.message);
		}
	},
	/**
	 * @param : textId :: id of a particular label text
	 * @description : this method is used for getting text format values from json
	 */
	getTextFormatParamsFromJson : function(textId){
		console.log("@getTextFormatParamsFromJson :: prgData");
		try{
			var labelId = 'label_'+textId;
			var labelIndex = PRGData.getLabelIndex(labelId);
			/** Label data populate in Json **/
			/* Json value */
			var prgJsonData = window.CD.module.data.Json.PRGData.PRGLabelData[labelIndex];
			/* Default text format values */
			var defaultParams = {};
			
			defaultParams = prgJsonData.textFormat;
			
			return defaultParams;
		}
		catch(error){
			console.info("Error in PRGData :: getTextFormatParamsFromJson : "+error.message);
		}
	},
	
	/**
	 * @params: textId :: id of a particular label text
	 * @description : this method is used for getting underline value of 
	 * the particular text object
	 */
	getUnderlineStatus : function(textId){
		console.log("@PRGData :: getUnderlineStatus");
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
			console.info("Error in PRGData :: getUnderlineStatus : "+error.message);
		}
	},
	
	getHintFeedbackValue : function(labelId){
		console.log("@getHintFeedbackValue :: PRGData");
		try{
			var prgIndex = PRGData.getDockIndex(labelId);
			
			var jsonData = PRGData.getDockJsonData();
			var lblObj = jsonData[prgIndex];
			
			var hintValue = lblObj.sentence_hint;
			
			var feedbackValue = lblObj.feedback;
			
			var hintFeedbackVal = {};
			
			hintFeedbackVal.hintValue = hintValue;
			hintFeedbackVal.feedbackValue = feedbackValue;
			
			return hintFeedbackVal;
			
		}catch(error){
			console.info("Error in PRGData :: getHintFeedbackValue : "+error.message);
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
			var prgIndex = PRGData.getLabelIndex(labelId);
			
			var jsonData = PRGData.getJsonData();
			var lblObj = jsonData[prgIndex];
			lblObj.term = textValue;
			
			ds.setOutputData();
		}catch(error){
			console.info("Error in PRGData :: getLabelTextValue : "+error.message);
		}
	},
	setLabelTextFormat : function(dataIndex){
		console.log('@setLabelTextFormat :: PRGData');
		try{
			if(dataIndex){
				var PRGJsonData=window.CD.module.data.Json.PRGData.PRGLabelData[dataIndex];
				if(window.CD.globalStyle.alignment != ''){
					PRGJsonData.textFormat.align = window.CD.globalStyle.alignment;
				}
				if(window.CD.globalStyle.fontStyle != ''){
					PRGJsonData.textFormat.fontStyle = window.CD.globalStyle.fontStyle;
				}
				if(window.CD.globalStyle.underlineVal != ''){
					PRGJsonData.textFormat.underline_value = window.CD.globalStyle.underlineVal;
				}
				
			}
			window.CD.services.ds.setOutputData();

		}catch(err){
			console.error("@PRGData::setLabelTextFormat::"+err.message);
	    }
	},
	
};