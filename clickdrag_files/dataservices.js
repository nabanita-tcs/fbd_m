function dataModelServices() {
	console.log("@dataservices.dataModelServices");

	this.et = '';			//Exercise type (sle, seq, cls, coi, prg, se)
	this.etText = '';       //Full text (Standard Label Exercise, Click On Image e.t.c)
	this.etOptions= {
		optionLabel: '',      //Exercise type option (One To Many, One To One, Same Label Twice e.t.c) 
		optionSentence: '',	  //Only for PRG (Lock Sentence Order, Require Sentence Order)
		subOptionLevel: ''	  //Sub-options (Display label once, Display each label instance)
	};
	this.etOptionsText = {
		optionLabelText: '',
		optionSentenceText: '',
		subOptionLevelText: ''
	};
	this.totalElm = 0;
	this.json = '';
	
	this.loadData = function() {
		
	};
	this.setEt = function(val) {
		this.et = val;
	};
	
	this.getEt = function() {
		return this.et;
	};
	
	this.getJson = function() {
		
	};
	
	this.setEtText = function(val) {
		this.etText = val;		
	};
	
	this.getEtText = function() {
		return this.etText;
	};
	
	this.setOptionLabel = function(labelOption, sentenceOption) {
		sentenceOption = sentenceOption || "";
		this.etOptions.optionLabel = labelOption;
		this.etOptions.optionSentence = sentenceOption;
	};
	/* ---- added on 16.04.2013 for new sub-option start ----- */
	this.setsubOptionLevel = function(subOptionLevel) {
		this.etOptions.subOptionLevel = subOptionLevel;
	};
	
	this.getsubOptionLevelText = function() {
		return this.etOptionsText.subOptionLevelText;
	};
	this.setsubOptionLevelText = function(subOptionLevelText) {
		this.etOptionsText.subOptionLevelText = subOptionLevelText;
	};
	
	this.getsubOptionLevel = function() {
		return this.etOptions.subOptionLevel;
	};
	/* ----  end ----*/
	
	this.setPrgOptionLabel = function(sentenceOption) {
		sentenceOption = sentenceOption || "";
		this.etOptions.optionSentence = sentenceOption;
	};
	this.getOptionLabel = function() {
		return this.etOptions.optionLabel;
	};
	this.getOptionSentence = function() {
		return this.etOptions.optionSentence;
	};
	
	this.setOptionLabelText = function(labelOptionText, sentenceOptionText) {
		sentenceOptionText = sentenceOptionText || "";
		this.etOptionsText.optionLabelText = labelOptionText;
		this.etOptionsText.optionSentenceText = sentenceOptionText;
		
	};
	
	this.getOptionLabelText = function() {
		return this.etOptionsText.optionLabelText;
	};
	
	this.getOptionSentenceText = function() {
		return this.etOptionsText.optionSentenceText;
	};
	
	this.saveActivitySettings = function(){
		try{
			var cd = window.CD;
			console.log("@dataservices.saveACtivitySettings");
			if(cd.module.data.Json.adminData["AH"] == undefined || cd.module.data.Json.adminData["AH"] == ''){
				cd.module.data.Json.adminData["AH"] = cd.height;
			}
			if(cd.module.data.Json.adminData["AW"] == undefined || cd.module.data.Json.adminData["AW"] == ''){
				cd.module.data.Json.adminData["AW"] = cd.width;
			}
			cd.module.data.Json.adminData["ET"] = this.getEt();
			if(this.getOptionLabel() == 'OTO'){
				cd.module.data.Json.adminData["OTO"] = true;
				cd.module.data.Json.adminData["OTM"] = false;
				cd.module.data.Json.adminData["TYPE"] = false;
			}
			if(this.getOptionLabel() == 'OTM'){
				cd.module.data.Json.adminData["OTO"] = false;
				cd.module.data.Json.adminData["OTM"] = true;
				cd.module.data.Json.adminData["TYPE"] = false;
				if(this.getsubOptionLevel() == 'DLO'){
					cd.module.data.Json.adminData["OTO"] = false;
					cd.module.data.Json.adminData["OTM"] = true;
					cd.module.data.Json.adminData["TYPE"] = false;
				}
				if(this.getsubOptionLevel() == 'DLE'){
					cd.module.data.Json.adminData["OTO"] = false;
					cd.module.data.Json.adminData["OTM"] = false;
					cd.module.data.Json.adminData["TYPE"] = true;
				}
			}
			if(this.getOptionSentence() == 'senOrder'){
				cd.module.data.Json.PRGPS["sentenceReorder"] = 'T';
			}else if(this.getOptionSentence() == 'lockOrder'){
				cd.module.data.Json.PRGPS["sentenceReorder"] = 'F';
			}
			this.setOutputData();
		}catch(err){
			console.error("unable to save activity settings::"+err.message);
		}
	};
	this.saveGuide = function(){
		try{
			var cd = window.CD;
			var rlLayer = window.CD.elements.rllayer;
			//var guideGroup = rlLayer.get("#guides_group")[0];
			var guideGroup = rlLayer.getChildren()[0];
			var guides = guideGroup.getChildren();
			cd.module.data.Json.adminData["HGL"] = [];
			cd.module.data.Json.adminData["VGL"] = [];
			for(var i = 0; i< guides.length; i++){
				if(guides[i].getId().indexOf("hGuide") != -1){
					cd.module.data.Json.adminData["HGL"].push(guides[i].getY());
				}else if(guides[i].getId().indexOf("vGuide") != -1){
					cd.module.data.Json.adminData["VGL"].push(guides[i].getX());
				}
			}
			this.setOutputData();
		}catch(err){
			console.error("Error in ds.saveGuide::"+err.message);
		}
		
	};
	this.getGuidesData = function(){
		var cd = window.CD;
		return {hGuides:cd.module.data.Json.adminData["HGL"], vGuides:cd.module.data.Json.adminData["VGL"]};
	};
	this.getStringType = function(str) {
		if(str.match(/ET%3D/)) {
			return 1; //old encoded
		} else if(str.match(/ET=/)) {
			return 2; //old not encoded
		} else if(str.match(/%22adminData%22%3A%/)) {
			return 3; //new encoded
		} else if(str.match(/"adminData":/)) {
			return 4; //new not encoded
		} 
	};
	this.initializeModuleData = function() {
		try{			
			var dockOpt = "";
			var sameLabelTwice = "";
			var senOrder = "";
			var selType ="";
			var cd = window.CD;
			if(cd.questionState == 'new'){
				console.log("@dataservices.initializeModuleData::new");
				switch(this.et) {
				case "SLE":
					cd.module.data = SLEData;
					cd.module.view = SLEView;
					cd.module.data.init(inputJSON);					
					this.saveActivitySettings();
					//console.dir(window.CD.module.data.Json);
					break;				
				case "COI":
					cd.module.data = COIData;
					cd.module.view = COIView;
					cd.module.data.init(inputJSON);					
					this.saveActivitySettings();
					//cd.module.data.processString(unescapedString);
					//console.dir(window.CD.module.data.Json);
					break;
				case "PRG":
					cd.module.data = PRGData;
					cd.module.view = PRGView;
					cd.module.data.init(inputJSON);					
					this.saveActivitySettings();
					//cd.module.data.processString(unescapedString);
					console.dir(window.CD.module.data.Json);
					break;
				case "CLS":
					cd.module.data = CLSData;
					cd.module.view = CLSView;
					cd.module.data.init(inputJSON);					
					this.saveActivitySettings();
					//cd.module.data.processString(unescapedString);
					//console.dir(window.CD.module.data.Json);
					break;
				}
			}else if(cd.questionState == 'edit'){
				var inputStr = cd.inputString;				
				var strType = this.getStringType(inputStr);
				
				switch(strType) {
				
				case 1: //old encoded
					/*
					 * The following line is commented to send encoded string
					 * because on olddata_validator it is checked that if the 
					 * string is encoded then the status is true.		
					 */
					//inputStr =  unescape(inputStr); 
					inputStr =  inputStr.validate_olddata(); // For old data string;
					break;
				case 2: //old not encoded
					inputStr =  inputStr.validate_olddata();
					break;
				case 3: //new encoded
					inputStr =  unescape(inputStr);
					inputStr = inputStr.validate_newAuth();// For new data string;
					break;
				case 4: //new not encoded
					inputStr = inputStr.validate_newAuth();// For new data string;
					break;
				}
				/*
				if(cd.util.isEncoded(inputStr)) {
					var inputStr =  unescape(inputStr);
					inputStr =  inputStr.validate_olddata(); // For old data string;
				} else {
					inputStr = inputStr.validate_newAuth();// For new data string;
				}*/
				//if(cd.util.isJSON(inputStr)){
				if(typeof inputStr == 'object'){
					//var inputJSON = $.parseJSON(inputStr);
					var inputJSON = inputStr;
					var exType = inputJSON.adminData["ET"];
					var oneToOne = inputJSON.adminData["OTO"];
					var oneToMany = inputJSON.adminData["OTM"];
					var type = inputJSON.adminData["TYPE"];
					if(oneToOne == true) dockOpt = 'OTO';
					if(oneToMany == true) dockOpt = 'OTM';
					
					
					if(type == true && oneToMany == false && oneToOne == false) 
					{
						sameLabelTwice = 'DLE';
						dockOpt = 'OTM';
					}
					if(type == false && oneToMany == true && oneToOne == false) sameLabelTwice = 'DLO';
					
					if(exType == "PRG"){
						var sentenceOrder = inputJSON["PRGPS"]["sentenceReorder"];
						if(sentenceOrder == 'F') senOrder = 'lockOrder';
						if(sentenceOrder == 'T') senOrder = 'senOrder';
					}
					if(exType == "COI"){
						var selectionType = inputJSON["COIST"];
						if(selectionType == 'F') selType = 'SS';
						if(selectionType == 'T') selType = 'MS';						
					}
					this.setEt(exType);
                    this.populateRespectiveData(exType,dockOpt,senOrder,selType,sameLabelTwice);
					switch(this.et) {
						case "SLE":
							cd.module.data = SLEData;
							cd.module.view = SLEView;
							cd.module.data.init(inputJSON);
							this.saveActivitySettings();
							//console.dir(window.CD.module.data.Json);
							break;
						case "SEQ":
							cd.module.data = SEQData;
							//cd.module.view.init(unescapedString);
							//console.dir(window.CD.module.activeModule.Json);
							break;
						case "COI":
							cd.module.data = COIData;
							cd.module.view = COIView;
							cd.module.data.init(inputJSON);
							this.saveActivitySettings();
							break;
						case "PRG":
							cd.module.data = PRGData;
							cd.module.view = PRGView;
							cd.module.data.init(inputJSON);
							this.saveActivitySettings();
							//cd.module.data.processString(unescapedString);
							console.dir(window.CD.module.data.Json);
							break;
						case "CLS":
							cd.module.data = CLSData;
							cd.module.view = CLSView;
							cd.module.data.init(inputJSON);
							this.saveActivitySettings();
							break;
					}
				}else{
					if($.type(inputStr) !== 'object'){
						if(cd.util.isEncoded(inputStr)) {
							var inputStr =  unescape(inputStr);
							inputStr =  inputStr.validate_olddata(); // For old data string;
						} else {
							var inputStr =  inputStr;
						}
					}
					
					var exType = inputStr.adminData["ET"];
					var oneToOne = inputStr.adminData["OTO"];
					var oneToMany = inputStr.adminData["OTM"];
					var type = inputStr.adminData["TYPE"];
					if(oneToOne == "true") dockOpt = 'OTO';
					if(oneToMany == "true") dockOpt = 'OTM';
					
					if(type == "true" && oneToMany == "false" && oneToOne == "false") sameLabelTwice = 'DLE';
					if(type == "false" && oneToMany == "true" && oneToOne == "false") sameLabelTwice = 'DLO';
					
					if(exType == "PRG"){
						var sentenceOrder = inputStr.PRGPS;//inputStr.match(/PRGPS=[A-Za-z0-9,]+/)[0].split('=')[1];
						sentenceOrder = sentenceOrder.sentenceReorder;
						if(sentenceOrder == 'F') senOrder = 'lockOrder';
						if(sentenceOrder == 'T') senOrder = 'senOrder';
					}
					if(exType == "COI"){
						var selectionType = inputStr.COIST;//inputStr.match(/COIST=[A-Za-z]+/)[0].split('=')[1];
						if(selectionType == 'F') selType = 'SS';
						if(selectionType == 'T') selType = 'MS';
					}
					this.setEt(exType);
                    this.populateRespectiveData(exType,dockOpt,senOrder,selType,sameLabelTwice);
					switch(this.et) {
						case "SLE":
							cd.module.data = SLEData;
							cd.module.view = SLEView;
							cd.module.data.init(inputStr);
							this.saveActivitySettings();
							//cd.module.data.init(inputStr);
							this.saveActivitySettings();
							//console.dir(window.CD.module.data.Json);
							break;
						case "COI":
							cd.module.data = COIData;
							cd.module.view = COIView;
							cd.module.data.init(inputStr);
							this.saveActivitySettings();
							//cd.module.data.processString(unescapedString);
							//console.dir(window.CD.module.data.Json);
							break;
						case "PRG":
							cd.module.data = PRGData;
							cd.module.view = PRGView;
							cd.module.data.init(inputStr);
							this.saveActivitySettings();
							//cd.module.data.processString(unescapedString);
							//console.dir(window.CD.module.data.Json);
							break;
						case "CLS":
							cd.module.data = CLSData;
							cd.module.view = CLSView;
							cd.module.data.init(inputStr);
							this.saveActivitySettings();
							//cd.module.data.processString(unescapedString);
							//console.dir(window.CD.module.data.Json);
							break;
					}
                  }							
				}
			

		}catch(err){
			console.error("@dataservices.initializeModuleData::"+err.message);
		}
		
		
	};
         
        this.populateRespectiveData = function(exType,dockOpt,senOrder,selType,sameLabelTwice){
            var initState = window.CD.services.initialState;
            this.setEtText(exerciseNames[exType].exerciseText);
            initState.setEt(exType);				
            initState.setEtText(exerciseNames[exType].exerciseText);
            if(this.getEt() == "COI"){
                this.setOptionLabel(selType);
				this.setOptionLabelText(exerciseNames[exType]["TYPE"][selType]);	
				initState.setOptionLabel(selType);
				initState.setOptionLabelText(exerciseNames[exType]["TYPE"][selType]);	
            }else{
				this.setOptionLabel(dockOpt,senOrder);
				this.setOptionLabelText(exerciseNames[exType][dockOpt],exerciseNames["PRG"][senOrder] == undefined ? "" : exerciseNames["PRG"][senOrder]);
				this.setsubOptionLevel(sameLabelTwice);
				this.setsubOptionLevelText(exerciseNames[exType]["TYPE"][sameLabelTwice]);
				initState.setOptionLabel(dockOpt,senOrder);
		                initState.setOptionLabelText(exerciseNames[exType][dockOpt],exerciseNames["PRG"][senOrder] == undefined ? "" : exerciseNames["PRG"][senOrder]);
				initState.setsubOptionLevel(sameLabelTwice);
				initState.setsubOptionLevelText(exerciseNames[exType]["TYPE"][sameLabelTwice]);
            }
        };
	this.updateStudentGUI = function(guiElm){
		console.log("@dataservices.updateStudentGUI");
		var cd = window.CD;
		if(guiElm.getId().indexOf('R') != -1){
			cd.module.data.Json.FrameData[0].frameStudentGUI[0].x = guiElm.getX();
			cd.module.data.Json.FrameData[0].frameStudentGUI[0].y = guiElm.getY();
		}else if(guiElm.getId().indexOf('Z') != -1){
			cd.module.data.Json.FrameData[0].frameStudentGUI[1].x = guiElm.getX();
			cd.module.data.Json.FrameData[0].frameStudentGUI[1].y = guiElm.getY();
		}
	};
	//Method to correct any data inconsistency due to user actions before saving the data in EzTest server.
	//Triggers inside "done" button.
	//Actions: Match Label and Dock ID in 
	this.correctOutputData = function(){
		console.info("@dataservices.correctOutputData");
		console.log(window.CD.module.data.Json);
		
	}; 
	
	//IMPORTANT:
	//TODO: need to delete this method and return a encrypted json string direct to Ezto getState method.
	this.setOutputData = function(){ 
		/** If I'm done is not clicked this will be called to populate clsrn **/
		if(typeof window.CD.module.data.setValuesToCLSRN == "function"){
			window.CD.module.data.setValuesToCLSRN();
		}
		$('#cndOut').val(escape(JSON.stringify(window.CD.module.data.Json)));
	};
	
	this.updateAudioList = function(audioUrl,action){
		console.log("@dataservicecs.updateAudioList");
		if(action == "insert"){
			if(window.CD.module.data.Json.adminData.audioList == undefined){
				window.CD.module.data.Json.adminData.audioList = [];
			}
			window.CD.module.data.Json.adminData.audioList.push({'url':audioUrl,'used':false});
		}else if (action == "remove"){
			var audioList = window.CD.module.data.Json.adminData.audioList;
			if(audioList != undefined && audioList.length > 0){
				var audioIndex;
				$.each(audioList,function(index,value){
					if(value.url == audioUrl){
						delete audioList[index];
						return;
					}
				});
				
				var updatedAudioList = [];
				$.each(audioList,function(index,value){
					if(value != undefined){
						updatedAudioList.push(value);
					}
				});
				window.CD.module.data.Json.adminData.audioList = updatedAudioList;
			}
		}
		
		window.CD.services.ds.setOutputData();
	};
	this.getAudioUrlList = function(){
		console.log("@dataservicecs.getAudioUrlList");
		if(window.CD.module.data.Json.adminData.audioList == undefined){
			window.CD.module.data.Json.adminData.audioList = [];
		}
		var tempList = window.CD.module.data.Json.adminData.audioList;
		var audioList = [];
		for(var i = 0; i < tempList.length; i++){
			audioList.push(tempList[i].url);
		}
		return audioList;
	};
	this.getAudioList = function(){
		console.log("@dataservicecs.getAudioList");
		if(window.CD.module.data.Json.adminData.audioList == undefined){
			window.CD.module.data.Json.adminData.audioList = [];
		}
		return window.CD.module.data.Json.adminData.audioList;
	};
	this.updateAudioUsage = function(audioUrl,flag){
		var audioIndex = $.inArray(audioUrl, this.getAudioUrlList());
		var audioName = audioUrl.substring(audioUrl.lastIndexOf('/')+1,audioUrl.length);
		if(audioIndex >= 0){
			window.CD.module.data.Json.adminData.audioList[audioIndex].used = flag;
			if(flag){
				$('#audioDiv .media_parent').find('td.selectedBackground:contains('+audioName+')').addClass("selectedBackground");
				$('#audioDiv .selectedBackground').addClass("usedMedia");
			}else{
				var storedAudioList = window.CD.module.data.Json.adminData.audioList;
				var audioAvailability = window.CD.services.cs.checkAudioAvailableStatus(audioUrl);
				//window.CD.util.removeArrayElm(storedAudioList,audioIndex,'',audioAvailability);
				if(audioAvailability){
					$('#audioDiv .media_parent').find('td.usedMedia:contains('+audioName+')').removeClass("usedMedia");
					$('#audioDiv .media_parent').find('td.selectedBackground:contains('+audioName+')').removeClass("selectedBackground");				
				}
				
			}
			window.CD.services.ds.setOutputData();
		}
	};
	this.getImageList = function(){
		console.log("@sleData.getImageList");
		if(window.CD.module.data.Json.adminData.imageList == undefined){
			window.CD.module.data.Json.adminData.imageList = [];
		}
		return window.CD.module.data.Json.adminData.imageList;
	};
	this.updateImageList = function(imageUrl,action){
		console.log("@dataservicecs.updateImageList");
		if(window.CD.module.data.Json.adminData.imageList == undefined || typeof window.CD.module.data.Json.adminData.imageList != "object" ){
			window.CD.module.data.Json.adminData.imageList = [];
		}
		/** Image list update when delete images from label **/
		if(imageUrl.indexOf('=SHOWmedia&media=') > -1){
			imageUrl = imageUrl.substring(imageUrl.lastIndexOf('=SHOWmedia&media=')+17 , imageUrl.length);
		}
		
		var imageIndex = $.inArray(imageUrl,window.CD.module.data.Json.adminData.imageList);
		if(action == 'add'){
			if(imageIndex == -1){
				window.CD.module.data.Json.adminData.imageList.push(imageUrl);
				 $('#imageDiv .media_parent').find('td.media_list:contains('+imageUrl+')').addClass("usedMedia");
			}
		}else if(action == 'remove'){
			var storedImageList = window.CD.module.data.Json.adminData.imageList;
			/** --- checks if the image is available anywhere else or not --- **/
			var imgAvailability = window.CD.services.cs.checkImageAvailableStatus(imageUrl);
			window.CD.util.removeArrayElm(storedImageList,imageIndex,'',imgAvailability);
			if(imgAvailability){
				$('#imageDiv .media_parent').find('td.usedMedia:contains('+imageUrl+')').removeClass("usedMedia");
				$('#imageDiv .media_parent').find('td.selectedBackground:contains('+imageUrl+')').removeClass("selectedBackground");				
			}
		}
		window.CD.services.ds.setOutputData();
	};
	this.isImageUsed = function(imageUrl){
		var imageIndex = $.inArray(imageUrl,window.CD.module.data.Json.adminData.imageList);
		if(imageIndex == -1)
			return false;
		else
			return true;
	};
	this.updateGlobalFont = function(newFontSize){
		window.CD.module.data.Json.adminData["GFS"] = newFontSize;
		this.setOutputData();
	};
	this.getCanvasSize = function(){
		return {width:window.CD.width,height:window.CD.height};
	}
	
}