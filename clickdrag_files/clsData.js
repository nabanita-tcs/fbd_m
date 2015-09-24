var CLSData = {
		Json : {},
		customLanguageFlage:'',
		tempImgName:[],
		tempImgId:[],
		dockOrigHeight : '200',
		dockOrigWidth : '130',
		textGroupComponent : [],
		globalHideText : false,
		showHiddenTextInAuthoring : false,
		init: function(inputJSON) {
			var cd = window.CD;
			var cd = window.CD;
			var cs = window.CD.services.cs;
			if(cd.questionState == 'new'){
				console.log("@dataservices.initializeModuleData");
				this.Json = jQuery.extend(true, {}, clsDefaultData);//cs.cloneObject(clsDefaultData);  
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
		var clsCount = 0; 
		var frameCount = 0; 
		var dataMap = new Array();
		rawDataStringParts = rawDataString.split(';');
		for(var counter in rawDataStringParts){		
			var key = rawDataStringParts[counter].substr(0, rawDataStringParts[counter].indexOf("="));
			var value = rawDataStringParts[counter].substr(rawDataStringParts[counter].indexOf("=") + 1);
			dataMap[key] = value;
			if(key.match(/CLS[0-9]+/)){
				clsCount++;
			}	
			if(key.match(/CLSC[0-9]+/)){
				clscCount++;
			}	
			if(key.match(/CF[0-9]+/)){
				frameCount++;
			}
		}
		
		var clsdataString = {	
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
					'ICS': dataMap['ICS'],
					'HGL': dataMap['HGL'],
					'VGL': dataMap['VGL'],
					'ET': dataMap['ET'],
					'SLELD': dataMap['SLELD'],
					'ZHP': dataMap['ZHP'],
					'feedbackHeight':'70',
					'feedbackWidth':'120',
					'AVP': dataMap['AVP'],
					'audioList':[],
					'imageList':[]	
				},
				'FrameData': [],
				'CLSData': {},
				'CLSGV': dataMap['CLSGV']!=undefined?dataMap['CLSGV']:'', //CLS Given set
				'CLSRQ': dataMap['CLSRQ']!=undefined?dataMap['CLSRQ']:'', //CLS Required set
				'CLSRN': dataMap['CLSRN']!=undefined?dataMap['CLSRN']:'', //CLS Random set
				'CLSPS': {},
				'CLSGP': {
					'borderGlobal': dataMap['CLSGP'].split(',')[0],
					'backGroundGlobal': dataMap['CLSGP'].split(',')[1],
					'toggleSPGlobal': dataMap['CLSGP'].split(',')[2],
					'labelBorderGlobal': dataMap['CLSGP'].split(',')[3],
					'labelBGGlobal': dataMap['CLSGP'].split(',')[4],
					'dockBGGlobal': dataMap['CLSGP'].split(',')[5]
				},
				'CLSPOS': dataMap['CLSPOS']!=undefined?dataMap['CLSPOS']:'',
				'VST': dataMap['VST']!=undefined?dataMap['VST']:'',
				'CLSDS': dataMap['CLSDS']!=undefined?dataMap['CLSDS']:'',
				'CLSSD': dataMap['CLSSD']!=undefined?dataMap['CLSSD']:''
		}

		var tmpps = dataMap['CLSPS'].split(',');
		clsdataString.CLSPS['totalRandomLabels'] = tmpps[0];
		clsdataString.CLSPS['disableFeedback'] = tmpps[1];
		clsdataString.CLSPS['disableInstantFeedback'] = tmpps[2];
		clsdataString.CLSPS['disableHints'] = tmpps[3];
		clsdataString.CLSPS['studentGradeFormat'] = tmpps[4];

		if(tmpps.length >= 6) {	
			clsdataString.CLSPS['discrete'] = tmpps[5];	
		} else {
			clsdataString.CLSPS['discrete'] = false;
		}

		for(var i=0 ; i<clsCount ; i++){
			var skey = 'CLS'+i;
			var clsd = dataMap[skey].split(',');
			var newClsStr = {'label_value':clsd[0],
					'class_name':clsd[1],
					'image_data':clsd[2],
					'holder_x':clsd[3],
					'holder_y':clsd[4],
					'hint_value':clsd[5],
					'transparent':clsd[6],
					'transparent_hint':clsd[7],
					'transparent_border':clsd[8],
					'media_value':clsd[9],
					'play_option_value':clsd[10],
					'media_X':clsd[11],
					'media_Y':clsd[12],
					'distractor':clsd[13],
					'student_answer_string':clsd[14],
					'class_set':clsd[15],
					'edit_button_X':clsd[16],
					'edit_button_Y':clsd[17],
					'custom_hint':clsd[18],
					'visibility':clsd[19]!=undefined?clsd[19]:false
			};
			clsdataString.CLSData[i]=newClsStr;
		}
		
		for(var i=0 ; i<clscCount ; i++){
			var skey = 'CLSC'+i;
			//var clsd = dataMap[skey].split(',');
			var clscd = value.split("%d%");
			var newClscStr = {
					'name':clscd[0],
					'xpos':clscd[1],
					'ypos':clscd[2],
					'width':clscd[3],
					'height':clscd[4],
					'transparent':clscd[5],
					'media_value':clscd[6],
					'play_option_value':clscd[7],
					'media_X':clsd[8],
					'media_Y':clsd[9]
			};
			clsdataString.CLSCData[i]=newClscStr;
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
			clsdataString.FrameData[i]=newFrameStr;
		}
		
		this.Json = clsdataString;
	},
	getCLSData : function(){
		return window.CD.module.data.Json.CLSData;
	},
	getCLSCData : function(){
		return window.CD.module.data.Json.CLSCData;
	},
	
	getJson : function(){
		return window.CD.module.data.Json;
	},
	/*
	 * get CLSData for clsView
	 * By nabonita bhattacharyya
	 */
	getJsonData : function(){
		return CLSData.getCLSData();
	},
	
	/*
	 * get adminData for clsView
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
		var labelCount = CLSData.getCLSIndex(labelGroupId)
		return labelCount;
	},
	/**
	 * For fill and stroke status
	 * By Nabonita Bhattacharyya
	 */
	fillAndBorderEnable : function(data){
		
		if(data ==='T'){
			return false;
		}else{
			return true;
		}
	},
	/*
	 * This is used for start over and reset function call
	 * By Nabonita Bhattacharyya
	 * modified on 03re July,2013
	 */
	resetAll : function(stage_id){
		console.log('@CLSData: start_over')
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
			console.error("@CLSData::Error for start_over::"+err.message);
		}
		
	},
	getCLSIndex : function(labelGroupId,labelCount) {
		var  outputJson = window.CD.module.data.Json;
		var clsLength = Object.keys(outputJson.CLSData).length;
		var cls = "";
		if(labelCount){
			clsLength = labelCount;
		}
		for(var k=0;k<clsLength;k++) {
			var key = 'CLS'+k;
			if(outputJson.CLSData[key] != undefined){
				if(outputJson.CLSData[key].labelGroupId == labelGroupId){
					cls = key;
				}
			}
			
		}
		return cls;
	},
	getCLSCIndex : function(dockGroupId) {
		var  outputJson = window.CD.module.data.Json;
		for(key in outputJson.CLSCData) {
			if(outputJson.CLSCData[key].dockGroupId == dockGroupId)
				return key;
		}
	},
	reIndexLabels : function() {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;
		var outputJson = window.CD.module.data.Json;
		var labelCount = cs.objLength(outputJson.CLSData);
		var tmpCLSData = {};
		
		var c = 0;				
		for(key in outputJson.CLSData) {
			tmpCLSData['CLS' + c] = outputJson.CLSData[key]; 
			c++;
		}
		outputJson.CLSData = {};
		outputJson.CLSData = tmpCLSData;		
	},
	reIndexDocks : function() {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;
		var outputJson = window.CD.module.data.Json;
		var tmpCLSCData = {};
		
		var c = 0;				
		for(key in outputJson.CLSCData) {
			tmpCLSCData['CLSC' + c] = outputJson.CLSCData[key]; 
			tmpCLSCData['CLSC' + c].name = 'group'+(c+1);
			//tmpCLSCData['CLSC' + c].dockGroupId = "dock_"+c;
			tmpCLSCData['CLSC' + c].dockGroupNo = (c+1);
			var dockGroup = cdLayer.get('#'+outputJson.CLSCData[key].dockGroupId)[0];
			if(dockGroup && cdLayer.get('#dockName_dock_'+key.replace('CLSC',''))[0]){
				cdLayer.get('#dockName_dock_'+outputJson.CLSCData[key].dockGroupId.split('_')[1])[0].setText(c+1);
			}
			c++;
		}
		outputJson.CLSCData = {};
		outputJson.CLSCData = tmpCLSCData;	
		cdLayer.draw();
	},
	setEachLabelOutputData: function(indID,changefieldArr){
		console.log("@CLSData::setEachLabelOutputData");
		try{
			if(changefieldArr){
				var CLSJsonData1=window.CD.module.data.Json.CLSData[indID];
				for(kky in changefieldArr){
					if(typeof kky==="object"){
						for(ky in kky){
							CLSJsonData1[kky][ky]=changefieldArr[kky][ky];
						}
					}else{
						CLSJsonData1[kky]=changefieldArr[kky];
					}
				}
			}
			
			window.CD.services.ds.setOutputData();

		}catch(err){
			console.error("@CLSData::setEachLabelOutputData::"+err.message);
	    }
	},
	getEachLabelOutputData: function(indID,fetchPropa){
		console.log("@CLSData::getEachLabelOutputData");
		try{
			if(fetchPropa){
				var Clsjsondata=window.CD.module.data.Json.CLSData[indID];
				return Clsjsondata[fetchPropa];
								
			}
			
		}catch(err){
			console.error("@CLSData::getEachLabelOutputData::"+err.message);
	    }
	},
	updateDockData:function(dockGroupId,dockDimension) {
		var clsc = this.getCLSCIndex(dockGroupId);
		var clscData = this.getCLSCData();
		clscData[clsc].width = dockDimension.dockWidth;
		clscData[clsc].height = dockDimension.dockHeight;
		window.CD.services.ds.setOutputData();
	},
	updateLockStatus:function(group,status) {
		var id = group.attrs.id;
		if(id.match(/label_[0-9]+/)) {
			var cls = this.getCLSIndex(id);
			var clsData = this.getCLSData();
			clsData[cls].lockStatus = status;
		} else if(id.match(/dock_[0-9]+/)) {
			var clsc = this.getCLSCIndex(id);
			var clscData = this.getCLSCData();
			clscData[clsc].lockStatus = status;
		}
		window.CD.services.ds.setOutputData();
	},
	/*
	 * For getting node for align label to frame
	 */
	getKeyIndex:function(){
		return 'CLS';
	},
	
	/**
	 * This method is used to get hint/feedback parameters 
	 * from output json
	 */
	getHintFeedbackFromJson: function(){
		console.log("@CLSData.getHintFeedbackFromJson");
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
			console.error("@CLSData::Error on getHintFeedbackFromJson::"+err.message);
		}
		
	},
	/**
	 * This method is used to set values to 
	 * hint/feedback parameters 
	 */
	setHintFdbckToJson: function(width,height,x,y){
		console.log("@CLSData.setHintFdbckToJson");
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
			console.error("@CLSData::Error on setHintFdbckToJson::"+err.message);
		}
		
	},	
	/**
	 * This method is used to set values to 
	 * feedback height/width 
	 */
	setFeedbackValuesToJson: function(width,height){
		console.log("@CLSData.setFeedbackValuesToJson");
		try{
			var ds = window.CD.services.ds;
			var adminData=window.CD.module.data.getJsonAdminData();
			if(width)
				adminData.feedbackWidth=parseInt(width);
			if(height)
				adminData.feedbackHeight=parseInt(height);
			
			ds.setOutputData();
		}catch(err){
			console.error("@CLSData::Error on setFeedbackValuesToJson::"+err.message);
		}
		
	},
	getDockAttributes : function(){
		try{
			var dockData = CLSData.getCLSCData();
			var singleDockAttributes = dockData.CLSC0;
			var transparency = '';
			if(singleDockAttributes){
				transparency = singleDockAttributes.transparent;
				border = singleDockAttributes.transparent_border;
			}else{
				transparency = 'semitransparent';
				border = 'F'
			}
			var attributes = {
					'transparency':transparency,
					'border':border
			}
			return attributes;
		}catch(err){
			console.error("@CLSData::Error on getDockAttributes::"+err.message);
		}
		
	},
	
	getLabelAttributes : function(){
		try{
			var labelData = CLSData.getCLSData();
			var singleLabelAttributes = labelData.CLS0;
			var fill = 'T';
			var distractor_label = 'F';
			if(singleLabelAttributes){
				fill = singleLabelAttributes.transparent;
				border = singleLabelAttributes.transparent_border;
				distractor_label = singleLabelAttributes.distractor;
			}else{
				fill = 'F';
				border = 'F';
				distractor_label = 'F';
			}
			var attributes = {
					'transparency':fill,
					'border':border,
					'distractor_label':distractor_label
			}
			return attributes;
		}catch(err){
			console.error("@CLSData::Error on getLabelAttributes::"+err.message);
		}
		
	},
	/* setting the first label index */
	getLabelStartId :function(){
		var cs = window.CD.services.cs;
		var CLSLabelJson = CLSData.getCLSData();
		var labelCount = cs.objLength(CLSLabelJson);
		var tempArray = new Array();
		var finalLabelId = labelCount;
		for(var i=0; i<labelCount; i++){
			tempArray.push(parseInt(CLSLabelJson['CLS'+i].labelGroupId.split('_')[1]));			
		}
		tempArray.sort(descending);
		function descending( a, b ) {
			return b - a;
			}
		finalLabelId = tempArray[0] + 1;
		return finalLabelId;
	},	
	/* setting the first label index */
	getDockStartId :function(){
		var cs = window.CD.services.cs;
		var CLSDockJson = CLSData.getCLSCData();
		CLSData.reIndexDocks();
		var dockCount = cs.objLength(CLSDockJson);
		var tempArray = new Array();
		var finalDockId = dockCount;
		//return (CLSDockJson['CLSC'+(dockCount-1)].dockGroupNo + 1);
		return parseInt(CLSDockJson['CLSC'+(dockCount-1)].dockGroupId.split('_')[1])+1;
		/*
		for(var i=0; i<dockCount; i++){
			tempArray.push(parseInt(CLSDockJson['CLSC'+i].dockGroupId.split('_')[1]));			
		}
		tempArray.sort(descending);
		function descending( a, b ) {
			return b - a;
			}
		finalDockId = tempArray[0] + 1;
		return finalDockId;*/
	},	
	
	/**
	 * This method is used to get data for CLS0
	 */
	getGlobalDockValue : function(){
		var clsDockData = CLSData.getCLSCData();
		var clsc0 = clsDockData['CLSC0'];
		return clsc0;
	},
	
	/*
	 * This is used in makeActivity,for inspector data population
	 * By Nabonita Bhattacharyya
	 */
	getInspectorLabelData : function(){
		try{
			var inspectorLabelData = {
					'labelHeight' : '',
					'labelWidth' : '',
					'fillEnabled' : '',
					'strokeEnabled': '',
					'elmType':'label',
					'strokeDock':'',
					'transparency':'',					
					'distractor': '',
					'hintWidth':'',
					'hintHeight':'',
					'hintLabelOrDock':'',
					'feedbackLabelOrDock':'',
					'showHintOrFeedbackInAuthoring':'',
					'hideTextLoc':'F',
					'fillBorderDrop':false
			}
			return inspectorLabelData;
		}
		catch(e){
			console.error("@CLSData::Error on getInspectorLabelData::"+e.message);
		}
		
	},
	
	/**
	 * This method is used to get label and distractor count
	 * By Nabonita Bhattacharyya
	 */
	populatePublishData : function(){
		try{
			var labelCount = 0;
			var distractorCount = 0;
			var clsData = CLSData.getCLSData();
			for(clsCount in clsData){
				var distractorVal = clsData[clsCount].distractor;
				if(distractorVal == 'F'){
					labelCount++;
				}
				if(distractorVal == 'T'){
					distractorCount++;
				}
			}
			
			var labelDistractorVal = {
					'labelCount':labelCount,
					'distractorCount':distractorCount
			};
			return labelDistractorVal;
		}
		catch(err){
			console.error("@CLSData::Error on populatePublishData::"+err.message);
		}
	},
	/**
	 * This is used to set publishing data to CLSPS
	 * By Nabonita Bhattacharyya
	 */
	setValuesToCLSPS : function(labelCount,distractorCount){
		try{
			var ds = window.CD.services.ds;
			var CLSPSData=window.CD.module.data.Json.CLSPS;
			if(labelCount)
				CLSPSData.totalRandomLabels=parseInt(labelCount);
			if(distractorCount)
				CLSPSData.totalRandomDistractors=parseInt(distractorCount);
			
			ds.setOutputData();
		}catch(err){
			console.error("@CLSData::Error on setValuesToCLSPS::"+err.message);
		}
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
					'hideTextLoc':'F'
			}
			return oldData;
		}
		catch(e){
			console.error("@CLSData::Error on getOldLabelDockData::"+e.message);
		}
		
	},
	setValuesToCLSRN : function(){
		try{
			var ds = window.CD.services.ds;
			var jsonData=window.CD.module.data.Json;
			var CLSData = this.getCLSData();
			var randomArray = new Array();
			for(var eachCLS in CLSData){
				randomArray.push(parseInt(eachCLS.split('CLS')[1]));
			}
			if(randomArray.length > 0){
				jsonData.CLSRN = randomArray.join();
			}
			/*ds.setOutputData();	*/
		}catch(e){
			console.error("@CLSData::Error on setValuesToCLSRN::"+e.message);
		}
	},
	clsResetData : function(){
		var ds = window.CD.services.ds;
		var cd = window.CD;
		var cnv = cd.services.cs;
		if(ds.getOptionLabel() == 'OTO'){
			cd.module.data.Json.adminData["OTO"] = true;
			cd.module.data.Json.adminData["OTM"] = false;
			cd.module.data.Json.adminData["TYPE"] = false;
		}
		if(ds.getOptionLabel() == 'OTM'){
			cd.module.data.Json.adminData["OTO"] = false;
			cd.module.data.Json.adminData["OTM"] = true;
			cd.module.data.Json.adminData["TYPE"] = false;
			if(ds.getsubOptionLevel() == 'DLO'){
				cd.module.data.Json.adminData["OTO"] = false;
				cd.module.data.Json.adminData["OTM"] = true;
				cd.module.data.Json.adminData["TYPE"] = false;
			}
			if(ds.getsubOptionLevel() == 'DLE'){
				cd.module.data.Json.adminData["OTO"] = false;
				cd.module.data.Json.adminData["OTM"] = false;
				cd.module.data.Json.adminData["TYPE"] = true;
			}
		}
		var CLSData1 =  cd.module.data.Json.CLSData;
		for(var key in CLSData1){
			cd.module.data.Json.CLSData[key].class_set = "";
		}
		
		var frameGroup = cnv.findGroup('frame_0');
		cnv.setActiveElement(frameGroup,'frame');
		cd.inputString = JSON.stringify(window.CD.module.data.Json);
		cd.questionState = 'edit';
		ds.initializeModuleData();
		new Stage();
		
	},
	setZindex : function(label){
		var labelId = label.getId();
		var labelType = labelId.split('_')[0];
		if(labelType == 'label'){
			var clsData = window.CD.module.data.Json.CLSData;
			for(key in clsData){
				for(var i=0; i<label.parent.children.length;i++){
					if(clsData[key].labelGroupId == label.parent.children[i].getId()){
						clsData[key].zIndex = label.parent.children[i].getZIndex();
					}
				}
			}
		}else{
			var clscData = window.CD.module.data.Json.CLSCData;
			for(key in clscData){
				for(var i=0; i<label.parent.children.length;i++){
					if(clscData[key].dockGroupId == label.parent.children[i].getId()){
						clscData[key].zIndex = label.parent.children[i].getZIndex();
					}
				}
			}
		
		}
			
	},
	
	/*********************************** Added for New Label text ***********************************/
	getTextStyleData : function(textId){
		try{
			var labelId = 'label_'+textId;
			var labelIndex = CLSData.getLabelIndex(labelId);
			var textFormat = {};
			var textObj = window.CD.module.data.Json.CLSData[labelIndex].textFormat;
			textFormat.align = textObj.align;
			textFormat.fontSize = textObj.fontSize;
			textFormat.fontStyle = textObj.fontStyle;
			textFormat.underline_value = textObj.underline_value;
			return textFormat;
		}catch(error){
			console.info("Error in CLSData :: getTextStyleData : "+error.message);
		}
	},
	
	/**
	 * @params: id of a particular canvas text
	 * @description : this method is used for getting the canvas text value
	 * for the particular textId from Json
	 */
	getLabelTextValue : function(labelId){
		try{
			var clsIndex = CLSData.getLabelIndex(labelId);
			
			var jsonData = CLSData.getJsonData();
			var lblObj = jsonData[clsIndex];
			var textValue = lblObj.label_value;
			return textValue;
		}catch(error){
			console.info("Error in CLSData :: getLabelTextValue : "+error.message);
		}
	},
	
	/**
	 * @params : params : label text format parameter object
	 * labelId : id of the label where the text is being added
	 * @description : This method is used to update text format json data with 
	 * label text format parameters
	 */
	updateLabelTextData : function(params,labelId) {
		console.log("@CLSData :: updateLabelTextData");
		try{
			if(params){
				var labelIndex = CLSData.getLabelIndex(labelId);
				window.CD.module.data.Json.CLSData[labelIndex].textFormat = {};
				var clsJsonData = window.CD.module.data.Json.CLSData[labelIndex].textFormat;
				for(var eachKey in params){
					clsJsonData[eachKey] = params[eachKey];
				}					
			}
			window.CD.services.ds.setOutputData();
		}
		catch(error){
			console.info("Error in CLSData :: updateLabelTextData : "+error.message);
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
			var labelIndex = CLSData.getLabelIndex(labelId);
			/** Label data populate in Json **/
			/* Json value */
			var clsJsonData = window.CD.module.data.Json.CLSData[labelIndex];
			/* Default values */
			var defaultParams = {};
			defaultParams = CLSData.getTextStyleData(textId);  
			
			
			var txtVal = CLSData.getLabelTextValue(labelId);
			
			defaultParams.label_value = txtVal;
			defaultParams.textFormat = clsJsonData.textFormat;
			
			return defaultParams;
		}
		catch(error){
			console.info("Error in CLSData :: getDefaultParamsFromJson : "+error.message);
		}
	},
	/**
	 * @param : textId :: id of a particular label text
	 * @description : this method is used for getting text format values from json
	 */
	getTextFormatParamsFromJson : function(textId){
		console.log("@getTextFormatParamsFromJson :: clsData");
		try{
			var labelId = 'label_'+textId;
			var labelIndex = CLSData.getLabelIndex(labelId);
			/** Label data populate in Json **/
			/* Json value */
			var clsJsonData = window.CD.module.data.Json.CLSData[labelIndex];
			/* Default text format values */
			var defaultParams = {};
			
			defaultParams = clsJsonData.textFormat;
			
			return defaultParams;
		}
		catch(error){
			console.info("Error in CLSData :: getTextFormatParamsFromJson : "+error.message);
		}
	},
	
	/**
	 * @params: textId :: id of a particular label text
	 * @description : this method is used for getting underline value of 
	 * the particular text object
	 */
	getUnderlineStatus : function(textId){
		console.log("@CLSData :: getUnderlineStatus");
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
			console.info("Error in CLSData :: getUnderlineStatus : "+error.message);
		}
	},
	getHintFeedbackValue : function(labelId){
		console.log("@getHintFeedbackValue :: CLSData");
		try{
			var clsIndex = CLSData.getLabelIndex(labelId);
			
			var jsonData = CLSData.getJsonData();
			var lblObj = jsonData[clsIndex];
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
			console.info("Error in CLSData :: getHintFeedbackValue : "+error.message);
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
			var clsIndex = CLSData.getLabelIndex(labelId);
			
			var jsonData = CLSData.getJsonData();
			var lblObj = jsonData[clsIndex];
			lblObj.label_value = textValue;
			
			ds.setOutputData();
		}catch(error){
			console.info("Error in CLSData :: getLabelTextValue : "+error.message);
		}
	},
	setLabelTextFormat : function(dataIndex){
		console.log('@setLabelTextFormat :: COIData');
		try{
			if(dataIndex){
				var CLSJsonData=window.CD.module.data.Json.CLSData[dataIndex];
				if(window.CD.globalStyle.alignment != ''){
					CLSJsonData.textFormat.align = window.CD.globalStyle.alignment;
				}
				if(window.CD.globalStyle.fontStyle != ''){
					CLSJsonData.textFormat.fontStyle = window.CD.globalStyle.fontStyle;
				}
				if(window.CD.globalStyle.underlineVal != ''){
					CLSJsonData.textFormat.underline_value = window.CD.globalStyle.underlineVal;
				}
				
			}
			window.CD.services.ds.setOutputData();

		}catch(err){
			console.error("@COIData::setLabelTextFormat::"+err.message);
	    }
	},
	populateLabelDockData : function(data){
		console.log("@populateLabelDockData :: CLSData");
		try{
			var cs = window.CD.services.cs;
			var clsjson = this.getJsonData();
			var clscJson = this.getCLSCData();
			var adminData = this.getJsonAdminData();
			var hintFdbk = CLSData.getHintFeedbackFromJson();
			
			var clsCount = 'CLS0';
			var clscCount = 'CLSC0';
			
			data.width = adminData.SLELD.split(',')[0];
			data.height = adminData.SLELD.split(',')[1];
			
			var dockDimension = this.getChangedDockDimension();
			
			if(dockDimension){
				data.dockWidth = parseInt(dockDimension.dockW);
				data.dockHeight = parseInt(dockDimension.dockH);
			}else{
				data.dockWidth = parseInt(CLSData.dockOrigWidth);
				data.dockHeight = parseInt(CLSData.dockOrigHeight);
			}
			var clsjsonLength = $.map(clsjson, function(n, i) { return i; }).length;//to find out the object(clsjson) length
			if(clsjsonLength > 0){
				data.fill = CLSData.fillAndBorderEnable(clsjson[clsCount].transparent);
				data.stroke = CLSData.fillAndBorderEnable(clsjson[clsCount].transparent_border);
			}
			
			if(CLSData.getJson().CLSGP.borderGlobal == 'F' && CLSData.getJson().CLSGP.backGroundGlobal == 'F'){
				data.fillBorderDrop = true;
			}else{
				if(CLSData.getJson().CLSGP.borderGlobal == 'T' && CLSData.getJson().CLSGP.backGroundGlobal == 'T'){
					data.fillBorderDrop = false;
				}
			}
			if(cs.objLength(clscJson) > 0){
				data.strokeDock = CLSData.fillAndBorderEnable(clscJson[clscCount].transparent_border);
				data.transpType = clscJson[clscCount].transparent;
			}else{
				data.strokeDock = 'F';
				data.transpType = 'F';
			}
			
			data.hintOrFeedback = adminData.showHintOrFeedbackInAuthoring;
			data.labelOrDockHint = 'label';
			data.hintWidth = hintFdbk.hintW;
			data.hintHeight = hintFdbk.hintH;
			data.labelOrDockFdbk = 'label';
			data.feedbackWidth = hintFdbk.feedbackW; 
			data.feedbackHeight = hintFdbk.feedbackH;
			
			if(CLSData.getJson().CLSGP.toggleSPGlobal == 'F'){
				data.sloppy = true;
			}else{
				if(CLSData.getJson().CLSGP.toggleSPGlobal == 'T'){
					data.sloppy = false;
				}
			}
			
			data.hideTextGlobal = CLSData.getGlobalHideTextStatus();		
			data.showHiddenTxtGlobal = CLSData.showHiddenTextInAuthoring;
			return data;
		}catch(err){
			console.error("@CLSData::populateLabelDockData::"+err.message);
		}
	},
	
	/**
	 * This method is used to get the global hide text status
	 */
	
	getGlobalHideTextStatus : function(){
		try{
			var globalHideTextcheck = false;
			var labelCountForHideText = 0;
			var clsData = window.CD.module.data.Json.CLSData;
			for(var key in clsData){
				if(clsData[key].infoHideText == 'T'){//If text hidden
					globalHideTextcheck = true;				
				}				
				labelCountForHideText++;
			}
			if(labelCountForHideText != 0){
				return globalHideTextcheck;
			}else{
				return false;
			}
		}catch(err){
			console.error("@CLSData::getGlobalHideTextStatus ::"+err.message);
		}
	},
	
	getChangedJson : function(first, second, result){
		console.log("@getChangedJson :: CLSData");
		try{
			var i = 0;
	        for (i in first) {
	            if (first[i] != second[i]) {
	                result[i] = second[i];
	            }
	        }
	        return result;
		}catch (err) {
			console.error("@CLSData::getchangedJson::"+err.message);
		}
	},
	
	getChangedDockDimension : function(){
		console.log("@getChangedDockDimension :: CLSData");
		try{
			var modDimension = {};
			var origHW = {};
			origHW.dockW = CLSData.dockOrigWidth;
			origHW.dockH = CLSData.dockOrigHeight;
			
			var clscJson = this.getCLSCData();
			for(var each in clscJson){
				var eachObj = {};
				eachObj.dockW =clscJson[each].width;
				eachObj.dockH = clscJson[each].height;
				var diffObj = {};
				diffObj = CLSData.getChangedJson(origHW,eachObj,diffObj);
				if(window.CD.services.cs.objLength(diffObj) > 0){
					return eachObj;
					break;
				}
			}
			
		}catch(err){
			console.info("Error @getChangedDockDimension :: CLSData: "+err.message);
		}
	}
};