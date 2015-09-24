/**
 * class name : CanvasData
 * description : All canvas data update is done here
 */
var CanvasData = {
		/**
		 * @params : params : canvas text parameter object
		 * textId : text id of that particular text in that particular frame
		 * frameId : id of the frame where the text is being added
		 * @description : This method is used to update json data with 
		 * frame text parameters
		 */
		textGrpComponents : [],
		updateCanvasTextData : function(params,textId,frameId) {
			try{
				if(params){
					var textCount = window.CD.module.data.Json.FrameData[frameId].frameTextList.length;
					if(textId > textCount){
						textId = textCount;
					}
					var origTextId = 'txt_'+textId+'_'+frameId;
					for(var i=0;i<window.CD.module.data.Json.FrameData[frameId].frameTextList.length;i++){
						  if(window.CD.module.data.Json.FrameData[frameId].frameTextList[i].textGroupObjID == origTextId)
							  var txtId = i;	  
					}
					if(txtId != undefined){
						window.CD.module.data.Json.FrameData[frameId].frameTextList[txtId] = {};
						var textID = txtId;
					}else{
						window.CD.module.data.Json.FrameData[frameId].frameTextList[textId] = {};
						var textID = textId;
					}
					
					var canvasJsonData = window.CD.module.data.Json.FrameData[frameId].frameTextList[textID];
					for(var eachKey in params){
						canvasJsonData[eachKey] = params[eachKey];
					}					
				}
				window.CD.services.ds.setOutputData();
			}
			catch(error){
				console.info("Error in CanvasData :: updateCanvasTextData : "+error.message);
			}
		},
		
		/**
		 * @params: id of a particular canvas text
		 * @description : this method is used for getting all style formats
		 * for the particular textId from Json
		 */
		getTextStyleData : function(textId){
			try{
				var frameId = textId.split('_')[2];
				for(var i=0;i<window.CD.module.data.Json.FrameData[frameId].frameTextList.length;i++){
					  if(window.CD.module.data.Json.FrameData[frameId].frameTextList[i].textGroupObjID == textId)
						  var txtId = i;	  
				}
				//var txtId = textId.split('_')[1];
				var textFormat = {};
				var textObj = window.CD.module.data.Json.FrameData[frameId].frameTextList[txtId];
				textFormat.textAlign = textObj.textAlign;
				textFormat.border = textObj.border;
				textFormat.fill = textObj.fill;
				textFormat.fontSize = textObj.fontSize;
				textFormat.fontType = textObj.fontType;
				textFormat.underlineVal = textObj.underlineVal;
				return textFormat;
			}catch(error){
				console.info("Error in CanvasData :: getTextStyleData : "+error.message);
			}
		},
		
		/**
		 * @params: id of a particular canvas text
		 * @description : this method is used for getting the canvas text value
		 * for the particular textId from Json
		 */
		getCanvasTextValue : function(textId){
			try{
				var frameId = textId.split('_')[2];
				var txtId = textId.split('_')[1];
				var textValue = '';
				
				var textList = window.CD.module.data.Json.FrameData[frameId].frameTextList;
				var textListLength = textList.length;
				for(var k=0;k<textListLength;k++){
					var textObj = textList[k];
					if(textObj.textGroupObjID == textId){
						textValue = textObj.textValue;
					}
				}				
				return textValue;
			}catch(error){
				console.info("Error in CanvasData :: getCanvasTextValue : "+error.message);
			}
		},
		
		/**
		 * @params: textId :: id of a particular canvas text
		 * @description : this method is used for getting all default parameters
		 * from jSon for the particular textId
		 */
		getDefaultParamsFromJson : function(textId,eventPosition){
			try{
				var canvasTxt = new TextTool.canvasText();
				var frameId = textId.split('_')[2];
				var frameTextId = textId.split('_')[1];
				/** Frame data populate in Json **/
				
				var textList = window.CD.module.data.Json.FrameData[frameId].frameTextList;
				var textListLength = textList.length;
				for(var k=0;k<textListLength;k++){
					var textObj = textList[k];
					if(textObj.textGroupObjID == textId){
						/* Json value */
						frameJsonData = textObj;
					}
				}
				
				/* Default values */
				var defaultParams = {};
				defaultParams = CanvasData.getTextStyleData(textId);  
				
				var box = canvasTxt.getBoxWidthHeight();
				var W = box.w;
				var H = frameJsonData.minHeight;
				
				defaultParams.maxWidth = parseInt(W);
				defaultParams.minHeight = parseInt(H);
				
				var X = frameJsonData.textX;
				var Y = frameJsonData.textY;
				
				if(eventPosition){					
					X = eventPosition.x;
					Y = eventPosition.y;
				}
				
				defaultParams.textX = parseInt(X);
				defaultParams.textY = parseInt(Y);
				
				var txtVal = CanvasData.getCanvasTextValue(textId);
				
				defaultParams.textValue = txtVal;
				defaultParams.absolutePosition = true;
				
				
				defaultParams.textGroupObjID = 'txt_'+frameTextId+"_"+frameId;
				
				return defaultParams;
			}
			catch(error){
				console.info("Error in CanvasData :: getDefaultParamsFromJson : "+error.message);
			}
		},
		/**
		 * @params: textId :: id of a particular canvas text
		 * @description : this method is used for getting underline value of 
		 * the particular text object
		 */
		getUnderlineStatus : function(textId){
			try{
				var underlineStatus = 'F';
				var frameId = textId.split('_')[2];
				var frameTextId = textId.split('_')[1];
				
				var frameJsonData = window.CD.module.data.Json.FrameData[frameId].frameTextList[frameTextId];
				
				/** This is the total text group components object **/
				var textGrpComponents = CanvasData.textGrpComponents;
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
				console.info("Error in CanvasData :: getUnderlineStatus : "+error.message);
			}
		},
		/**
		 * @params: textId :: id of a particular canvas text
		 * @description : This is used for getting the text position of a canvas text
		 */
		getTextPosition : function(textId){
			try{
				var frameId = textId.split('_')[2];
				var frameTextId = textId.split('_')[1];
				var position = {};
				
				var textList = window.CD.module.data.Json.FrameData[frameId].frameTextList;
				var textListLength = textList.length;
				for(var k=0;k<textListLength;k++){
					var textObj = textList[k];
					if(textObj.textGroupObjID == textId){
						position.x = textObj.textX;
						position.y = textObj.textY;
					}
				}
				return position;
			}
			catch(error){
				console.info("Error in CanvasData :: getTextPosition : "+error.message);
			}
		},
		
		/**
		 * @params: textId :: id of a particular canvas text
		 * @description : This is used to set the text position of a canvas text
		 * to Json data
		 */
		setTextPosition : function(textId,updatedXY){
			try{
				var frameId = textId.split('_')[2];
				var frameTextId = textId.split('_')[1];
				
				var textX = parseInt(updatedXY.x);
				var textY = parseInt(updatedXY.y);
				
				var adjustmentX = 0;
				var adjustmentY = 0;
				
				var framJsonObj = window.CD.module.data.Json.FrameData;
				
				var frameX = framJsonObj[frameId].frameX;
				var frameY = framJsonObj[frameId].frameY;
				
				if(frameId == 0){
					adjustmentY = 0;
				}else{
					adjustmentX = 0;
					adjustmentY = 0;
				}
				
				var x = textX + adjustmentX;
				var y = textY + adjustmentY;
				
				for(var i=0;i<window.CD.module.data.Json.FrameData[frameId].frameTextList.length;i++){
					  if(window.CD.module.data.Json.FrameData[frameId].frameTextList[i].textGroupObjID == textId)
						  var txtId = i;	  
				}
				window.CD.module.data.Json.FrameData[frameId].frameTextList[txtId].textX = x;
				window.CD.module.data.Json.FrameData[frameId].frameTextList[txtId].textY = y;
				window.CD.services.ds.setOutputData();
			}
			catch(error){
				console.info("Error in CanvasData :: setTextPosition : "+error.message);
			}
		},
};