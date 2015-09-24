var SEQData = {
	Json : {},
	customLanguageFlage:'',
	tempImgName:[],
	tempImgId:[],
	init: function(rawDataString) {
		this.processString(rawDataString);
		//showSLELabel(this.Json.SEQData);
	},
	processString: function(rawDataString) {
		var seqCount = 0; 
		var frameCount = 0; 
		var dataMap = new Array();
		rawDataStringParts = rawDataString.split(';');
		for(var counter in rawDataStringParts){		
			var key = rawDataStringParts[counter].substr(0, rawDataStringParts[counter].indexOf("="));
			var value = rawDataStringParts[counter].substr(rawDataStringParts[counter].indexOf("=") + 1);
			dataMap[key] = value;
			if(key.match(/SLE[0-9]+/)){
				seqCount++;
			}		
			if(key.match(/CF[0-9]+/)){
				frameCount++;
			}	
		}
		
		var seqdataString = {		
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
					'AVP': dataMap['AVP'],
					'audioList':[],
					'imageList':[]		
				},
				'DCKLD': dataMap['DCKLD'],
				'FrameData': {},
				'SEQData': {},
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
		}


		if(dataMap['SLEDXY']!=undefined){
			var sledxy = dataMap['SLEDXY'].split(',');
			var sldxyArr = new Array();
			var sledxylen = sledxy.length;
			for(var i=0; i<sledxylen; i++) {
				var tmp = sledxy[i].split('%');
				var tmp1 = {'x':tmp[0]!=undefined?tmp[0]:'', 'y':tmp[1]!=undefined?tmp[1]:''};
				sldxyArr[i]=tmp1;
			}
			seqdataString.SLEDXY = sldxyArr;
		}

		var tmpps = dataMap['SLEPS'].split(',');
		seqdataString.SLEPS['totalRandomLabels'] = tmpps[0];
		seqdataString.SLEPS['disableFeedback'] = tmpps[1];
		seqdataString.SLEPS['disableInstantFeedback'] = tmpps[2];
		seqdataString.SLEPS['disableHints'] = tmpps[3];
		seqdataString.SLEPS['studentGradeFormat'] = tmpps[4];

		if(tmpps.length >= 6) {	
			seqdataString.SLEPS['discrete'] = tmpps[5];	
		} else {
			seqdataString.SLEPS['discrete'] = false;
		}

		for(var i=0 ; i<seqCount ; i++){
			var skey = 'SLE'+i;
			var seqd = dataMap[skey].split(',');
			//console.dir(sled);
			var newSeqStr = {'label_value':seqd[0],
					'hint_value':seqd[1],
					'holder_x':seqd[2],
					'holder_y':seqd[3],
					'image_data':seqd[4],
					'doc_x':seqd[5],
					'doc_y':seqd[6],
					'image_data_1':seqd[7],
					'feedback_value':seqd[8],						
					'zoom_parameter':seqd[9],
					'hint_parameter': {
						'hintWidth': seqd[10].split("|")[0],
						'hintHeight': seqd[10].split("|")[1],
						'hintX': seqd[10].split("|")[2],
						'hintY': seqd[10].split("|")[3],
					},
					'transparent_border':seqd[11],
					'transparent':seqd[12],
					'transparent_hint':seqd[13],
					'transparent_border_1':seqd[14],
					'transparent_1':seqd[15],
					'media_value':seqd[16],
					'media_dock_value':seqd[17],
					'media_label_XY':seqd[18],
					'media_dock_XY':seqd[19],
					'play_option_L0_X':seqd[20],
					'play_option_L0_Y':seqd[21],
					'play_option_D0_X':seqd[22],
					'play_option_D0_Y':seqd[23],
					'label_Audio_Value':seqd[24],
					'label_play_option_value':seqd[25],
					'distractor_label':seqd[26],
					'FIB_value':seqd[27],
					'class_array_SEQ':seqd[28],
					'edit_button_X':seqd[29],
					'edit_button_Y':seqd[30],
					'dock_hint_value':seqd[31],
					'FIB_Dock':seqd[32],
					'doc_transparent_value':seqd[33]!=undefined?seqd[33]:'',
					'visibility':seqd[34]!=undefined?seqd[34]:''
			};
			seqdataString.SEQData[i]=newSeqStr;
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
			seqdataString.FrameData[i]=newFrameStr;
		}
		this.Json = seqdataString;

	}
}

//var rawDataString = 'GFS=15;CSO=pi_connectstylev2.swf;OTM=false;OTO=true;AW=800;AH=600;TYPE=false;HRO=L;RLO=T;SLELD=120,70;DCKLD=120,120;ET=SEQ;ZHP=200,200,425,75,3,200,100,425,375;AVP=233,259;SLE0=My name is Rasmi,rasmixxxx,104,44,,360,27,N,dolly,NaN|NaN|NaN|NaN|NaN,250|150|425|375,T,F,F,F,F,N,N,N,N,233,259,233,259,N,N,F,N,3,5,0,rasmixxxx,N;SLE1=I am working in Tcs,work,109,176,,368,182,N,tcs,NaN|NaN|NaN|NaN|NaN,NaN|NaN|NaN|NaN,F,F,F,F,F,N,chromatic_lp.mp3,N,60|-2,233,259,233,259,N,N,F,N,2,5,0,work,N;SLE2=My project name is macgraw-hill,project,117,354,parrot.jpg,363,356,N,mhhe,NaN|NaN|NaN|NaN|NaN,NaN|NaN|NaN|NaN,T,F,F,F,T,chromatic_sp.mp3,chromatic_sp.mp3,69|-5,28.65|48.78,233,259,233,259,N,N,F,N,1,5,0,project,N;SLE3=I am seating in 7th flr lords building,7th,124,469,,3000,100,N,flr,NaN|NaN|NaN|NaN|NaN,NaN|NaN|NaN|NaN,T,F,F,F,F,N,N,N,N,233,259,233,259,N,N,T,N,0,5,0,7th,N;SLEGV=;SLERQ=;SLERN=0,1,2,3;SLEPS=4,N,N,0,P;SLEGP=T,T,N,N,N;SLEDXY=104%44,109%176,117%354,124%469;VST=1;SLEDS=3,2,1,0;SLESD=n,2,n,n;studentScore=0';





 
