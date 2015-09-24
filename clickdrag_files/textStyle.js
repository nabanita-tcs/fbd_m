var AllTextStyling = AllTextStyling || {};
/**
 * @class name : AllTextStyling
 * description : All text styling is done here
 */
AllTextStyling = function (){
	this.frameTxtTool= new TextTool.frameText();	
	this.textFormat = new TextFormat();
	this.canvasTxtTool= new TextTool.canvasText();
	this.textStyle = this;
	
	/*highlight color initialization*/
	this.highlightFill="#1086D9";
	this.normalFill="#555";
		
	/*border */
	this.borderDfltClr="transparent";
	this.borderChgClr="black";
	this.borderWidth=1;
	this.highlightedBorder="#0D79C1";
	this.hightDashedBorderArr=[10,5];
	
	/*fill*/
	this.fillDflClr="transparent";
	this.fillChngClr="white";
			
	this.style={align:"center",border:"F",fontType:"normal",fill:"F"};
	
	
	
	/**
	 * @param activeGrpObj
	 * @description : This method is used for applying underline to each 
	 * text object
	 */
	this.applyEachTextUnderline = function(activeGrpObj,globalOrLocal){
		try{
			console.log('@allTextStyling::applyEachTextUnderline');
			this.textStyle.removeUnderline(activeGrpObj);
			var txtToolCfg = this.canvasTxtTool;
			var activeChildren = txtToolCfg.getTextObjFromGroupObject(activeGrpObj);
			var frameId = activeGrpObj.attrs.id.split('_')[2];
			var txtGrpId = activeGrpObj.attrs.id.split('_')[1];
			var boxWidth = activeGrpObj.children[0].getWidth();
			var rectObj = '';
			
			$.each(activeGrpObj.children, function(index,value) {				
				if(value.className==="Rect"){
					rectObj=value;					
				}
			});
			
			var textGrpComponents = CanvasData.textGrpComponents;
			var textGrpCompLen = textGrpComponents.length;
			
			$.each(activeChildren,function(i,val){
				if(typeof val==="object" && val.nodeType==="Shape" && val.className==="Text" && (!(val.attrs.id.match(/dock_addTxt_[0-9]+/))))
				{
				  var activeObj = val;
				  var textFormat = new TextFormat();
				  if(activeObj.getName() == 'underlined_text'){
					  for(var i=0; i<activeObj.textArr.length ;i++){
							/*if(activeGrpObj.get('#txt_'+txtGrpId+'_'+frameId+'_'+i).length > 0){
								var startpos = activeObj.getX();
							}else{*/
								  var activeWidth = activeObj.textArr[i].width;
								  if(activeObj.getAlign() == "center"){
									  if(textGrpCompLen > 0){
										  var startpos = activeObj.getX();
										  startpos = startpos - 2;
									  }else{
										  var rectWidth = rectObj.getWidth();
										  startpos = (rectWidth-parseInt(activeWidth))/2;
									  }
									  
									  /** commenting as of now not understanding the purpose **/
									  /*if(rerender == true)
										  startpos = startpos -5;*/
								  }else  if(activeObj.getAlign() == "left" || activeObj.getAlign() == "justify"){
									  var startpos = activeObj.getX();
								  }else  if(activeObj.getAlign() == "right"){
									  if(textGrpCompLen > 0){
										  var startpos = activeObj.getX();
										  startpos = startpos - 2;
									  }else{
										  var rectWidth = rectObj.getWidth();
										  startpos = (rectWidth-parseInt(activeWidth));
									  }
										  
								  }
							//}
							
							var adjustment = 2;
							//if(globalOrLocal == 'global'){
								adjustment = adjustment*(-1);
							//}
							var activeWidth = activeObj.textArr[i].width;  
							var underLine = new Kinetic.Line({
								   points: [startpos+2, (1+activeObj.getY() + ((i+1)*activeObj.getTextHeight())), (startpos + activeWidth-adjustment),(1+activeObj.getY() + ((i+1)*activeObj.getTextHeight()))],
							       stroke: 'black',
							       strokeWidth: 1,	
							       name: 'underline_txt'
							 });
							 
							 activeGrpObj.add(underLine);
						}
				  }					 
				}
			});			
			
		}catch(err){
			console.info("Error in allTextStyling :: applyEachTextUnderline : "+err.message);
		}
	};
	
	this.alignActiveCanvasText = function(elm,align){
		try{
			var txtConfg= new TextTool.canvasText();
			window.CD.globalStyle.alignment = align;
			var activeObj = [];
			var activeObjLength = window.CD.elements.active.element.length;
			for(var i=0;i<activeObjLength;i++){
				activeObj.push(elm[i]);
			}
			if(align == 'left'){
				this.textStyle.alignActiveTextLeft(activeObj);
			}
			if(align == 'right'){
				this.textStyle.alignActiveTextRight(activeObj);
			}
			if(align == 'center'){
				this.textStyle.alignActiveTextMiddle(activeObj);
			}
			if(align == 'justify'){
				this.textStyle.alignActiveTextJustify(activeObj);
			}
			var parentLayer = elm[0].getLayer();
			if(parentLayer && (parentLayer.attrs.id==="text_layer" || parentLayer.attrs.id==="cd_layer")){
				parentLayer.draw();
			}
		}catch(err){
			console.log("Error in allTextStyling :: alignActiveCanvasText : "+err.message);
		}
	};
	/**
	 * function name: alignActiveText()
	 * description:align active text
	 
	 * 
	 */
	this.alignActiveTextLeft=function(elm,undoAlign,UpadateJsonCheck){
		try{
			var txtConfg = new TextTool.canvasText();//new textToolConfig();
			textStyle=txtConfg.getTextStyle();
			activeAlign=textStyle.align;
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var activeObjLength = window.CD.elements.active.element.length;
			var undoMng = window.CD.undoManager;
			var txtConfg = new TextTool.commonLabelText();
			var activeObjs = [];
			var actvObjectsForUndo = [];
			
			if(elm){
				if(elm.length){
					activeObjLength = elm.length;
					for(var j=0;j<activeObjLength;j++){
						activeObjs.push(elm[j]);
						var actvObjForUndo = jQuery.extend(true, {}, elm[j]);
						var childrenObj = jQuery.extend(true, {}, elm[j].children);
						actvObjForUndo.children = childrenObj;
						actvObjectsForUndo.push(actvObjForUndo);
					}
				}else{
					activeObjs.push(elm);
					activeObjLength = 1;
				}					
			}
			for(var i=0;i<activeObjLength;i++){
				var activeObj = activeObjs[i];
				var textStyleObj = CanvasData.getTextStyleData(activeObj.getId());
				var underlineVal = textStyleObj.underlineVal;
				var prevAlign = textStyleObj.textAlign;
							
				var textType = window.CD.elements.active.type;
				var parentLayer = txtConfg.cs.getLayer();
				if(textType == 'canvastext'){
					var parentLayer = txtConfg.cs.getBgTextLayer();
				}else if(textType == 'text'){
					var parentLayer = txtConfg.cs.getLayer();
				}else{
					var parentLayer = activeObj.parent.getLayer();
				}
				
				activeObj = parentLayer.get('#'+activeObj.attrs.id)[0];	
					
				
				var activeGrpObj=activeObj;
				
				var totalWidth =0;
				var childrenTxtObj = txtConfg.getTextObjFromGroupObject(activeObj);
				$.each(childrenTxtObj,function(index,value){
					if((value.attrs.id.match(/txt_[0-9]+/))){
						totalWidth = totalWidth + value.getTextWidth();	
						value.setAlign('left');
					}
				});
				var lineObjCount = this.textStyle.getLineObjectCount(activeObj);
				var childrenCount = parseInt(activeObj.children.length) - parseInt(lineObjCount);
				
				var textGrpComponents = CanvasData.textGrpComponents;
				var textGrpCompLen = textGrpComponents.length;
				
				if(typeof activeObj==="object" && activeObj.nodeType==="Group" && (textGrpCompLen > 0))
				{
					this.textStyle.TextAlignMent(activeObj,"left");
						
				}
				this.textStyle.applyEachTextUnderline(activeObj);
				
				
				//txtConfg.applyTextUnderline(activeObj);
				if(underlineVal == 'T'){
					$('#UnderlinetTool').addClass('active');
					this.textStyle.applyEachTextUnderline(activeObj,'global');
				}
				
				txtConfg.drawLayer();
				activeGrpObj.parent.getLayer().draw()
				/*** pending : data update and undo redo will go here ****/
				 /** Data update **/
				var textId = activeObj.getId();
				var frameId = textId.split('_')[2];
				var frameTextId = textId.split('_')[1];
				
				var defaultParams = CanvasData.getDefaultParamsFromJson(textId);
				var params = {};
				params.textAlign = 'left';
				defaultParams = $.extend(defaultParams,params);
				if(!UpadateJsonCheck)
				CanvasData.updateCanvasTextData(defaultParams,frameTextId,frameId);
			}
			if(!UpadateJsonCheck){
				undoMng.register(this, this.undoRedoTextAlign,[actvObjectsForUndo,prevAlign] , 'undo text Formatting left',this, this.undoRedoTextAlign,[actvObjectsForUndo,'left'] , 'redo text Formatting left');
				updateUndoRedoState(undoMng);
			}			
			
		}catch(err){
			console.info("Error in allTextStyling :: alignActiveTextLeft : "+err.message);
		}
	};
        
	
	this.alignActiveTextJustify=function(elm,undoAlign,UpadateJsonCheck){
		try{
			var txtConfg = new TextTool.canvasText();//new textToolConfig();
			textStyle=txtConfg.getTextStyle();
			activeAlign=textStyle.align;
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var activeObjLength = window.CD.elements.active.element.length;
			var undoMng = window.CD.undoManager;
			var txtConfg = new TextTool.commonLabelText();
			var activeObjs = [];
			var actvObjectsForUndo = [];
			
			if(elm){
				if(elm.length){
					activeObjLength = elm.length;
					for(var j=0;j<activeObjLength;j++){
						activeObjs.push(elm[j]);
						var actvObjForUndo = jQuery.extend(true, {}, elm[j]);
						var childrenObj = jQuery.extend(true, {}, elm[j].children);
						actvObjForUndo.children = childrenObj;
						actvObjectsForUndo.push(actvObjForUndo);
					}
				}else{
					activeObjs.push(elm);
					activeObjLength = 1;
				}					
			}
			for(var i=0;i<activeObjLength;i++){
				var activeObj = activeObjs[i];
				var textStyleObj = CanvasData.getTextStyleData(activeObj.getId());
				var underlineVal = textStyleObj.underlineVal;
				var prevAlign = textStyleObj.textAlign;
				
				var textType = window.CD.elements.active.type;
				var parentLayer = txtConfg.cs.getLayer();
				if(textType == 'canvastext'){
					var parentLayer = txtConfg.cs.getBgTextLayer();
				}else if(textType == 'text'){
					var parentLayer = txtConfg.cs.getLayer();
				}else{
					var parentLayer = activeObj.parent.getLayer();
				}
				
				activeObj = parentLayer.get('#'+activeObj.attrs.id)[0];	
				
				var activeGrpObj=activeObj;
				var totalWidth =0;
				var childrenTxtObj = txtConfg.getTextObjFromGroupObject(activeObj);
				$.each(childrenTxtObj,function(index,value){
					if((value.attrs.id.match(/txt_[0-9]+/))){
						totalWidth = totalWidth + value.getTextWidth();	
						value.setAlign('justify');
					}
				});
				var lineObjCount = this.textStyle.getLineObjectCount(activeObj);
				var childrenCount = parseInt(activeObj.children.length) - parseInt(lineObjCount);
				
				var textGrpComponents = CanvasData.textGrpComponents;
				var textGrpCompLen = textGrpComponents.length;
				
				if(typeof activeObj==="object" && activeObj.nodeType==="Group" && (textGrpCompLen > 0))
				{
					this.textStyle.TextAlignMent(activeObj,"justify");
						
				}
				this.textStyle.applyEachTextUnderline(activeObj);
				if(underlineVal == 'T'){
					$('#UnderlinetTool').addClass('active');
					this.textStyle.applyEachTextUnderline(activeObj,'global');
				}
				txtConfg.drawLayer();
				activeGrpObj.parent.getLayer().draw()
				/*** pending : data update and undo redo will go here ****/
				 /** Data update **/
				var textId = activeObj.getId();
				var frameId = textId.split('_')[2];
				var frameTextId = textId.split('_')[1];
				
				var defaultParams = CanvasData.getDefaultParamsFromJson(textId);
				var params = {};
				params.textAlign = 'justify';
				defaultParams = $.extend(defaultParams,params);
				if(!UpadateJsonCheck)
				CanvasData.updateCanvasTextData(defaultParams,frameTextId,frameId);
			}
				
			if(!UpadateJsonCheck){
				undoMng.register(this, this.undoRedoTextAlign,[actvObjectsForUndo,prevAlign] , 'undo text Formatting justify',this, this.undoRedoTextAlign,[actvObjectsForUndo,'justify'] , 'redo text Formatting justify');
				updateUndoRedoState(undoMng);
			}
			
		}
		catch(err){
			console.info("Error in allTextStyling :: alignActiveTextJustify : "+err.message);
		}		
	};
	
	this.alignActiveTextRight=function(elm,undoAlign,UpadateJsonCheck){
		try{
			var txtConfg = new TextTool.canvasText();//new textToolConfig();
			textStyle=txtConfg.getTextStyle();
			activeAlign=textStyle.align;
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var activeObjLength = window.CD.elements.active.element.length;
			var undoMng = window.CD.undoManager;
			var txtConfg = new TextTool.commonLabelText();
			var activeObjs = [];
			var actvObjectsForUndo = [];
			
			if(elm){
				if(elm.length){
					activeObjLength = elm.length;
					for(var j=0;j<activeObjLength;j++){
						activeObjs.push(elm[j]);
						var actvObjForUndo = jQuery.extend(true, {}, elm[j]);
						var childrenObj = jQuery.extend(true, {}, elm[j].children);
						actvObjForUndo.children = childrenObj;
						actvObjectsForUndo.push(actvObjForUndo);
					}
				}else{
					activeObjs.push(elm);
					activeObjLength = 1;
				}					
			}
			for(var i=0;i<activeObjLength;i++){
				var activeObj = activeObjs[i];
				var textStyleObj = CanvasData.getTextStyleData(activeObj.getId());
				var underlineVal = textStyleObj.underlineVal;
				var prevAlign = textStyleObj.textAlign;
				
				var textType = window.CD.elements.active.type;
				var parentLayer = txtConfg.cs.getLayer();
				if(textType == 'canvastext'){
					var parentLayer = txtConfg.cs.getBgTextLayer();
				}else if(textType == 'text'){
					var parentLayer = txtConfg.cs.getLayer();
				}else{
					var parentLayer = activeObj.parent.getLayer();
				}
				
				activeObj = parentLayer.get('#'+activeObj.attrs.id)[0];	
				
				var activeGrpObj = activeObj;
				
				var totalWidth =0;
				var childrenTxtObj = txtConfg.getTextObjFromGroupObject(activeObj);
				$.each(childrenTxtObj,function(index,value){
					if((value.attrs.id.match(/txt_[0-9]+/))){
						totalWidth = totalWidth + value.getTextWidth();	
						value.setAlign('right');
					}
				});
				var lineObjCount = this.textStyle.getLineObjectCount(activeObj);
				var childrenCount = parseInt(activeObj.children.length) - parseInt(lineObjCount);
				
				var textGrpComponents = CanvasData.textGrpComponents;
				var textGrpCompLen = textGrpComponents.length;
				
				/** This methods will be called for text alignment with partial formatting **/
				if(typeof activeObj==="object" && activeObj.nodeType==="Group" && (textGrpCompLen > 0))
				{
					this.textStyle.TextAlignMent(activeObj,"left");
					this.textStyle.TextAlignMent(activeObj,"right");
				}
				
				if(underlineVal == 'T'){
					$('#UnderlinetTool').addClass('active');
					this.textStyle.applyEachTextUnderline(activeObj,'global');
				}else{
					this.textStyle.applyEachTextUnderline(activeObj);
				}
				txtConfg.drawLayer();
				activeGrpObj.parent.getLayer().draw()
				/*** pending : data update and undo redo will go here ****/
				 /** Data update **/
				var textId = activeObj.getId();
				var frameId = textId.split('_')[2];
				var frameTextId = textId.split('_')[1];
				
				var defaultParams = CanvasData.getDefaultParamsFromJson(textId);
				var params = {};
				params.textAlign = 'right';
				defaultParams = $.extend(defaultParams,params);
				if(!UpadateJsonCheck)
				CanvasData.updateCanvasTextData(defaultParams,frameTextId,frameId);
			}
			if(!UpadateJsonCheck){
				undoMng.register(this, this.undoRedoTextAlign,[actvObjectsForUndo,prevAlign] , 'undo text Formatting right',this, this.undoRedoTextAlign,[actvObjectsForUndo,'right'] , 'redo text Formatting right');
				updateUndoRedoState(undoMng);
			}
			
		}
		catch(err){
			console.info("Error in allTextStyling :: alignActiveTextRight : "+err.message);
		}		
	};
	
	this.alignActiveTextMiddle=function(elm,undoAlign,UpadateJsonCheck){
		try{
			var txtConfg = new TextTool.canvasText();//new textToolConfig();
			textStyle=txtConfg.getTextStyle();
			activeAlign=textStyle.align;
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var activeObjLength = window.CD.elements.active.element.length;
			var undoMng = window.CD.undoManager;
			var txtConfg = new TextTool.commonLabelText();
			var activeObjs = [];
			var actvObjectsForUndo = [];
			
			if(elm){
				if(elm.length){
					activeObjLength = elm.length;
					for(var j=0;j<activeObjLength;j++){
						activeObjs.push(elm[j]);
						var actvObjForUndo = jQuery.extend(true, {}, elm[j]);
						var childrenObj = jQuery.extend(true, {}, elm[j].children);
						actvObjForUndo.children = childrenObj;
						actvObjectsForUndo.push(actvObjForUndo);
					}
				}else{
					activeObjs.push(elm);
					activeObjLength = 1;
				}					
			}
			for(var i=0;i<activeObjLength;i++){
				var activeObj = activeObjs[i];
				var textStyleObj = CanvasData.getTextStyleData(activeObj.getId());
				var underlineVal = textStyleObj.underlineVal;
				var prevAlign = textStyleObj.textAlign;
				
				var textType = window.CD.elements.active.type;
				var parentLayer = txtConfg.cs.getLayer();
				
				if(textType == 'canvastext'){
					var parentLayer = txtConfg.cs.getBgTextLayer();
				}else if(textType == 'text'){
					var parentLayer = txtConfg.cs.getLayer();
				}else{
					var parentLayer = activeObj.parent.getLayer();
				}
				
				activeObj = parentLayer.get('#'+activeObj.attrs.id)[0];	
					
				
				var activeGrpObj=activeObj;
				var totalWidth =0;
				var childrenTxtObj = txtConfg.getTextObjFromGroupObject(activeObj);
				$.each(childrenTxtObj,function(index,value){
					if((value.attrs.id.match(/txt_[0-9]+/))){
						totalWidth = totalWidth + value.getTextWidth();	
						value.setAlign('center');
					}
				});
				var lineObjCount = this.textStyle.getLineObjectCount(activeObj);
				var childrenCount = parseInt(activeObj.children.length) - parseInt(lineObjCount);
				
				var textGrpComponents = CanvasData.textGrpComponents;
				var textGrpCompLen = textGrpComponents.length;
				
				if(typeof activeObj==="object" && activeObj.nodeType==="Group" && (textGrpCompLen > 0))
				{
					this.textStyle.TextAlignMent(activeObj,"left");
					this.textStyle.TextAlignMent(activeObj,"center");
				}
				this.textStyle.applyEachTextUnderline(activeObj);
				if(underlineVal == 'T'){
					$('#UnderlinetTool').addClass('active');
					this.textStyle.applyEachTextUnderline(activeObj,'global');
				}
				txtConfg.drawLayer();
				activeGrpObj.parent.getLayer().draw()
				/*** pending : data update and undo redo will go here ****/
				 /** Data update **/
				var textId = activeObj.getId();
				var frameId = textId.split('_')[2];
				var frameTextId = textId.split('_')[1];
				
				var defaultParams = CanvasData.getDefaultParamsFromJson(textId);
				var params = {};
				params.textAlign = 'center';
				defaultParams = $.extend(defaultParams,params);
				if(!UpadateJsonCheck)
				CanvasData.updateCanvasTextData(defaultParams,frameTextId,frameId);
			}
			if(!undoAlign){
				undoMng.register(this, this.undoRedoTextAlign,[actvObjectsForUndo,prevAlign] , 'undo text Formatting middle',this, this.undoRedoTextAlign,[actvObjectsForUndo,'center'] , 'redo text Formatting middle');
				updateUndoRedoState(undoMng);
			}		
			
		}catch(err){
			console.info("Error in allTextStyling :: alignActiveTextMiddle : "+err.message);
		}		
	};
	
	this.TextAlignMent= function(txtGrpObj,align){
		try{
			var txtConfg = new TextTool.canvasText();
			var childTxtObj = txtConfg.getTextObjFromGroupObject(txtGrpObj);
			if(childTxtObj.length > 0){
				 var initY =0;
				 var totWidth = 0;	
				 var totalTexts =0;
				 var txtArrayC = new Array();
				 var txtArrayP = new Array();
				 var buffer = 0;
				 var prevY = 0;
				 $.each(childTxtObj, function(index,val) {
					if(val.attrs.id.match(/txt_[0-9]+/)){
						if(val.attrs.id.match(/^txt_0_[0-9]+/)){
							initY = val.getY();
						}
						if(prevY == val.getY()){
							txtArrayC.push(val);
							prevY = initY;
						}
						else{
							txtArrayP.push(txtArrayC);
							txtArrayC = new Array();
							txtArrayC.push(val);
							initY = val.getY();		
							prevY = initY;
						}
						totalTexts++;
					}
				 });
				 txtArrayP.push(txtArrayC);
				 //txtGrpObj.setX(0);
				 for(j=0; j<txtArrayP.length;j++){
					 var tempArr = txtArrayP[j];
					for(i=0; i< tempArr.length; i++){
						if(i==0){
							totWidth = tempArr[i].getX();
						}
						totWidth  =  totWidth+ tempArr[i].getTextWidth();
					}
					
					for(i=0; i< tempArr.length; i++){
						if(i==0){
							if(align == 'left' || align == 'justify')
								tempArr[i].setX(buffer);
							else if(align == 'center'){
								tempArr[i].setX(((txtGrpObj.children[0].getWidth()- totWidth)/2));
							}else if(align == 'right')
								tempArr[i].setX((txtGrpObj.children[0].getWidth() - totWidth));
								
						}else{
							tempArr[i].setX(tempArr[i-1].getX() +  tempArr[i-1].getTextWidth());
						}
					}
				}
			}
		}
		catch(err){
			console.info("Error in allTextStyling :: TextAlignMent : "+err.message);
		}
	};
	
	
	this.removeUnderline = function(activeGrpObj,removeline){
		try{
			var txtConfg = new TextTool.canvasText();
			var undoMng = window.CD.undoManager;
			if(activeGrpObj.children.length == 0)
				  activeGrpObj = txtConfg.cs.getLayer().get('#'+activeGrpObj.attrs.id)[0];
			var underlineObj = activeGrpObj.get('.underline_txt');
			
			/*to handle undereline delete*/
	     
			 if(underlineObj.length>0){
				 for(var k = 0;k < underlineObj.length; k++){
					 underlineObj[k].remove();
				 } 
			 }
		}
		catch(err){
			console.info("Error in allTextStyling :: removeUnderline : "+err.message);
		}		
	};
	
	this.boldActiveText = function(activeGrpObj1,undoRedoTxtStyle){
		try{
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var activeObjLength = window.CD.elements.active.element.length;
			var undoMng = window.CD.undoManager;
			if(activeGrpObj1){
				activeObjLength = activeGrpObj1.length;
			}
			var txtConfg = new TextTool.canvasText();
			var activeObjs = [];
			if(!undoRedoTxtStyle){
				for(var j=0;j<activeObjLength;j++){
					activeObjs.push(window.CD.elements.active.element[j]);
				}
			}else{
				for(var j=0;j<activeObjLength;j++){
					activeObjs.push(activeGrpObj1[j]);
				}
			}
			var textHighLightArray = [];
			for(var i=0;i<activeObjLength;i++){
				var activeObj = activeObjs[i];
				var activeGrpObj = activeObj;
				var newFont = '';
				var activeChildren = txtConfg.getTextObjFromGroupObject(activeGrpObj);
				var textStyleObj = CanvasData.getTextStyleData(activeObj.getId());
				var textStyle = textStyleObj.fontType;
				var align = textStyleObj.textAlign;
				var underlineVal = textStyleObj.underlineVal;
				
				if(undoRedoTxtStyle){
					textStyle = undoRedoTxtStyle;
				}
				if(textStyle == "bold")
					newFont = "normal";
				else if(textStyle == "italic")
					newFont = "bold italic";
				else if(textStyle == "normal italic")
					newFont = "bold italic";
				else if(textStyle == "bold italic")
					newFont = "italic";
				else if(textStyle == "bold normal")
					newFont = "normal";
				else{
					newFont = "bold";
				}
				window.CD.globalStyle.fontStyle = newFont;		
				
				var globalTextStyle = {};
				globalTextStyle.fontType = newFont;
				
				var framJsonObj = window.CD.module.data.Json.FrameData;
				var frmID = activeObj.getId().split('_')[2];
				var frameTextId = activeObj.getId().split('_')[1];
				
				var frmObj = txtConfg.cs.findGroup('frame_'+frmID);
				
				for(var k=0;k<window.CD.module.data.Json.FrameData[frmID].frameTextList.length;k++){
					  if(window.CD.module.data.Json.FrameData[frmID].frameTextList[k].textGroupObjID == activeObj.getId())
						  var txtId = k;	  
				}
				
				var textX = framJsonObj[frmID].frameTextList[txtId].textX;
				var textY = framJsonObj[frmID].frameTextList[txtId].textY;
				
				var adjustmentX = 0;
				var adjustmentY = 0;
				
				var frameX = framJsonObj[frmID].frameX;
				var frameY = framJsonObj[frmID].frameY;
				
				if(frmID == 0){
					adjustmentX = 15;
					adjustmentY = 15;
				}else{
					adjustmentX = 0;
					adjustmentY = 0;
				}
				
				var event = {};
				event.x = textX - adjustmentX;
				event.y = textY - adjustmentY;
				
				
				var actvTextId = activeObj.getId();
				var textValue = CanvasData.getCanvasTextValue(actvTextId);
				
				var defaultParams = CanvasData.getDefaultParamsFromJson(actvTextId);
				
				this.textFormat.deleteActiveText(activeGrpObj);
				
				CanvasData.updateCanvasTextData(defaultParams,frameTextId,frmID);
				
				txtConfg.realTextValue = txtConfg.checkAndUpdateCharFromPalete(textValue);
				
				txtGrpObj = this.textFormat.createFrameText(frameTextId, frmObj, event, textValue, align, globalTextStyle);
				makeFrameTextResizable(txtGrpObj,txtGrpObj.children[0].getWidth(),txtGrpObj.children[0].getHeight());
				txtConfg.textEventBind(txtGrpObj);
				textHighLightArray.push(txtGrpObj);
				var activeChildren = txtConfg.getTextObjFromGroupObject(txtGrpObj);
				
				var globalUnderline = 'global';
				if(underlineVal == 'T'){
					$.each(activeChildren,function(cnt,val){
						val.setName('underlined_text');
					});
				}else{
					$.each(activeChildren,function(cnt,val){
						var underlineStatus = CanvasData.getUnderlineStatus(val.getId());
						if(underlineStatus == 'F')
							val.setName('normal_text');
					});	
					globalUnderline = undefined;
				}
				
				this.textStyle.applyEachTextUnderline(txtGrpObj,globalUnderline);
				if(underlineVal == 'T'){
					$('#UnderlinetTool').addClass('active');
				}
				var params = {};
				params.fontType = newFont;
				defaultParams = $.extend(defaultParams,params);
				CanvasData.updateCanvasTextData(defaultParams,frameTextId,frmID);
				
				var parentLayer = txtGrpObj.getLayer();
				if(parentLayer && (parentLayer.attrs.id==="text_layer" || parentLayer.attrs.id==="cd_layer")){
					parentLayer.draw();
				}
				txtConfg.drawLayer();
			}
			if(!undoRedoTxtStyle){
				undoMng.register(this, this.boldActiveText,[activeObjs,newFont] , 'Text Formatting',this, this.boldActiveText,[activeObjs,textStyle] , 'Text Formatting');
				updateUndoRedoState(undoMng);
			}
			this.makeMultiSelectActive(textHighLightArray);	//For multiselected element
			
			if(!undoRedoTxtStyle){
				if($('#boldTool').hasClass('active')){
					$('#boldTool').removeClass('active');
				}else{
					$('#boldTool').addClass('active');
				}
			}
			
		}
		catch(err){
			console.info("Error in allTextStyling :: boldActiveText : "+err.message);
		}
	};
	this.italicActiveText = function(activeGrpObj1,undoRedoTxtStyle){
		try{
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var activeObjLength = window.CD.elements.active.element.length;
			var undoMng = window.CD.undoManager;
			if(activeGrpObj1){
				activeObjLength = activeGrpObj1.length;
			}
			var txtConfg = new TextTool.canvasText();
			var activeObjs = [];
			if(!undoRedoTxtStyle){
				for(var j=0;j<activeObjLength;j++){
					activeObjs.push(window.CD.elements.active.element[j]);
				}
			}else{
				for(var j=0;j<activeObjLength;j++){
					activeObjs.push(activeGrpObj1[j]);
				}
			}
			var textHighLightArray = [];
			for(var i=0;i<activeObjLength;i++){
				var activeObj = activeObjs[i];
				var activeGrpObj = activeObj;
				var newFont = '';
				var undoMng = window.CD.undoManager;
				var activeChildren = txtConfg.getTextObjFromGroupObject(activeGrpObj);
				var textStyleObj = CanvasData.getTextStyleData(activeObj.getId());
				var textStyle = textStyleObj.fontType;
				var align = textStyleObj.textAlign;
				var underlineVal = textStyleObj.underlineVal;
				
				if(undoRedoTxtStyle){
					textStyle = undoRedoTxtStyle;
				}
				
				if(textStyle == "italic")
					newFont = "normal";
				else if(textStyle == "bold")
					newFont = "bold italic";
				else if(textStyle == "bold italic")
					newFont = "bold";
				else if(textStyle == "italic normal")
					newFont = "normal";
				else 
					newFont = "italic";	
				window.CD.globalStyle.fontStyle = newFont;
				var globalTextStyle = {};
				globalTextStyle.fontType = newFont;
				
				var framJsonObj = window.CD.module.data.Json.FrameData;
				var frmID = activeObj.getId().split('_')[2];
				var frameTextId = activeObj.getId().split('_')[1];
				
				var frmObj = txtConfg.cs.findGroup('frame_'+frmID);
				
				for(var p=0;p<window.CD.module.data.Json.FrameData[frmID].frameTextList.length;p++){
					  if(window.CD.module.data.Json.FrameData[frmID].frameTextList[p].textGroupObjID == activeObj.getId())
						  var txtId = p;	  
				}
				
				var textX = framJsonObj[frmID].frameTextList[txtId].textX;
				var textY = framJsonObj[frmID].frameTextList[txtId].textY;
				
				var adjustmentX = 0;
				var adjustmentY = 0;
				
				var frameX = framJsonObj[frmID].frameX;
				var frameY = framJsonObj[frmID].frameY;
				
				if(frmID == 0){
					adjustmentX = 15;
					adjustmentY = 15;
				}else{
					adjustmentX = 0;
					adjustmentY = 0;
				}
				
				var event = {};
				event.x = textX - adjustmentX;
				event.y = textY - adjustmentY;
				
				var actvTextId = activeObj.getId();
				var textValue = CanvasData.getCanvasTextValue(actvTextId);
				
				var defaultParams = CanvasData.getDefaultParamsFromJson(actvTextId);
				
				this.textFormat.deleteActiveText(activeGrpObj);
				
				txtConfg.realTextValue = txtConfg.checkAndUpdateCharFromPalete(textValue);
				
				CanvasData.updateCanvasTextData(defaultParams,frameTextId,frmID);
				txtGrpObj = this.textFormat.createFrameText(frameTextId, frmObj, event, textValue, align, globalTextStyle);
				makeFrameTextResizable(txtGrpObj,txtGrpObj.children[0].getWidth(),txtGrpObj.children[0].getHeight());
				txtConfg.textEventBind(txtGrpObj);
				
				textHighLightArray.push(txtGrpObj);
				
				var activeChildren = txtConfg.getTextObjFromGroupObject(txtGrpObj);
				var globalUnderline = 'global';
				if(underlineVal == 'T'){
					$.each(activeChildren,function(cnt,val){
						val.setName('underlined_text');
					});
					
				}else{
					$.each(activeChildren,function(cnt,val){
						var underlineStatus = CanvasData.getUnderlineStatus(val.getId());
						if(underlineStatus == 'F')
							val.setName('normal_text');
					});	
					globalUnderline = undefined;
				}
				if(underlineVal == 'T'){
					$('#UnderlinetTool').addClass('active');
				}
				this.textStyle.applyEachTextUnderline(txtGrpObj,globalUnderline);
				var params = {};
				params.fontType = newFont;
				defaultParams = $.extend(defaultParams,params);
				CanvasData.updateCanvasTextData(defaultParams,frameTextId,frmID);
				
				var parentLayer = txtGrpObj.getLayer();
				if(parentLayer && (parentLayer.attrs.id==="text_layer" || parentLayer.attrs.id==="cd_layer")){
					parentLayer.draw();
				}
				txtConfg.drawLayer();
			}
			
			
			if(!undoRedoTxtStyle){
				undoMng.register(this, this.italicActiveText,[activeObjs,newFont] , 'Text Formatting',this, this.italicActiveText,[activeObjs,textStyle] , 'Text Formatting');
				updateUndoRedoState(undoMng);
			}
			this.makeMultiSelectActive(textHighLightArray);	//For multiselected element
			if(!undoRedoTxtStyle){
				if($('#italicsTool').hasClass('active')){
					$('#italicsTool').removeClass('active');
				}else{
					$('#italicsTool').addClass('active');
				}
			}
		}
		catch(err){
			console.info("Error in allTextStyling :: italicActiveText : "+err.message);
		}		
	};
	
	/**
	 * This method is used for applying global underlining
	 */
	this.underlineActiveText=function(activeGrpObj1,underlineValUndoRedo){
		try{
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var globalUnderline = 'global';
			var activeObjLength = window.CD.elements.active.element.length;
			var undoMng = window.CD.undoManager;
			if(activeGrpObj1){
				activeObjLength = activeGrpObj1.length;
			}
			var txtConfg = new TextTool.canvasText();
			var activeObjs = [];
			if(!underlineValUndoRedo){
				for(var j=0;j<activeObjLength;j++){
					activeObjs.push(window.CD.elements.active.element[j]);
				}
			}else{
				for(var j=0;j<activeObjLength;j++){
					if(activeGrpObj1[j].children.length == 0){
						var textType = window.CD.elements.active.type;
						var parentObj = cs.getBgTextLayer();
						if(textType == 'text'){
							parentObj = cs.getLayer();
						}
						activeObjs.push(parentObj.get('#'+activeGrpObj1[j].getId())[0]);
					}else{
						activeObjs.push(activeGrpObj1[j]);
					}
				}
			}
			
			for(var i=0;i<activeObjLength;i++){
				var activeObj = activeObjs[i];
				var activeGrpObj = activeObj;		
				var textStyleObj = CanvasData.getTextStyleData(activeObj.getId());
				var underlineVal = textStyleObj.underlineVal;
				
				if(underlineValUndoRedo){
					underlineVal = underlineValUndoRedo;
				}
							
				var updatedUnderlineVal = 'T';
				
				var frmID = activeObj.getId().split('_')[2];
				var frameTextId = activeObj.getId().split('_')[1];
				
				var activeChildren = txtConfg.getTextObjFromGroupObject(activeGrpObj);
				
				if(underlineValUndoRedo){
					if(underlineVal == 'F'){
						$.each(activeChildren,function(cnt,val){
							val.setName('underlined_text');
						});
						updatedUnderlineVal = 'T';
						window.CD.globalStyle.underlineVal = 'T';
					}else{
						$.each(activeChildren,function(cnt,val){
							var underlineStatus = CanvasData.getUnderlineStatus(val.getId());
							if(underlineStatus == 'F')
								val.setName('normal_text');
						});	
						updatedUnderlineVal = 'F';
						window.CD.globalStyle.underlineVal = 'F';
						globalUnderline = undefined;
					}
				}else{
					if(underlineVal == 'F'){
						$.each(activeChildren,function(cnt,val){
							val.setName('underlined_text');
						});
						updatedUnderlineVal = 'T';
						window.CD.globalStyle.underlineVal = 'T';
					}else{
						$.each(activeChildren,function(cnt,val){
							val.setName('normal_text');
						});	
						updatedUnderlineVal = 'F';
						window.CD.globalStyle.underlineVal = 'F';
						globalUnderline = undefined;
					}
				}
				
				
				
				if(typeof activeObj == "object" && activeObj.nodeType == "Group"){
					this.textStyle.applyEachTextUnderline(activeObj,globalUnderline);
				}
				var defaultParams = CanvasData.getDefaultParamsFromJson(activeObj.getId());
				var params = {};
				params.underlineVal = updatedUnderlineVal;
				defaultParams = $.extend(defaultParams,params);
				CanvasData.updateCanvasTextData(defaultParams,frameTextId,frmID);
				
				var parentLayer = activeGrpObj.getLayer();
				if(parentLayer && (parentLayer.attrs.id==="text_layer" || parentLayer.attrs.id==="cd_layer")){
					parentLayer.draw();
				}
			}
			if(!underlineValUndoRedo){
				undoMng.register(this, this.underlineActiveText,[activeObjs,updatedUnderlineVal] , 'undo text underline',this, this.underlineActiveText,[activeObjs,underlineVal], 'redo text underline');
				updateUndoRedoState(undoMng);
			}	
			this.makeMultiSelectActive(activeObjs); //For multiselected element
			if(!underlineValUndoRedo){
				if($('#UnderlinetTool').hasClass('active')){
					$('#UnderlinetTool').removeClass('active');
				}else{
					$('#UnderlinetTool').addClass('active');
				}
			}
		}
		catch(err){
			console.info("Error in allTextStyling :: underlineActiveText : "+err.message);
		}
	};
	
	this.makeMultiSelectActive=function(activeObjs){
		console.log("@allTextStyling.makeMultiSelectActive");
		try{			
			var cs = window.CD.services.cs;
			var frameGroup = cs.findGroup('frame_0');
			var activeObjLength = activeObjs.length;
			cs.setActiveElement(frameGroup,'frame'); 
			
			shiftDown = true;
			for(var i=0;i<activeObjLength;i++){
				cs.setActiveElement(activeObjs[i],'canvastext');
			}
			shiftDown = false;
		}
		catch(err){
			console.info("Error in allTextStyling :: makeMultiSelectActive : "+err.message);
		}
	};
	
	this.getTextStyle=function(txtObj){
		try{
			console.log("@CanvasText.getTextStyle");
			/* for align*/
			if($("#leftAlignTool").data('clicked')) this.style.align="left";
			else if($("#middleAlignTool").data('clicked')) this.style.align="center";
			else if($("#rightAlignTool").data('clicked')) this.style.align="right";
			else if($("#justifyAlignTool").data('clicked')) this.style.align="justify";
			else if(txtObj) this.style.align=txtObj[0].getAlign();
			else this.style.align="center";
			/* align end*/
				
			/* for font type bold & italic */	
			var boldToolId=$('#toolPalette li#'+this.formatTools[1]);
			var italicToolId=$('#toolPalette li#'+this.formatTools[2]);
			if(boldToolId.hasClass('active') && italicToolId.hasClass('active') ){
				this.style.fontType="bold italic";
			}else if(boldToolId.hasClass('active')){//bold
				this.style.fontType="bold";
			}else if(italicToolId.hasClass('active')){//italic
				this.style.fontType="bold italic";
			}else{
				this.style.fontType="normal";
			}
			/* bold & italic font type end*/
			
		    /*border property*/
				if ($('#borderGuide').is(':checked'))this.style.border="T";
				else this.style.border="F";
			/*end border property*/
				
			/*fill property*/
				if ($('#fillGuide').is(':checked'))this.style.fill="T";
				else this.style.fill="F";
			/*end border property*/	
			return this.style;
		}
		catch(err){
			console.info("Error in allTextStyling :: getTextStyle : "+err.message);
		}
	};
	this.setActiveTextFontSize = function(actvGrpObj,undoRedoFont){
		try{
			var font=$("#fontTool .font_size #fontTextbox").val();
			var txtConfg = new TextTool.canvasText();
			var activeElement = [];
			for(var j=0;j<window.CD.elements.active.element.length;j++){
				activeElement.push(window.CD.elements.active.element[j]);
			}
			var activeElmLength = activeElement.length;
			if(actvGrpObj){
				var activeElmLength = actvGrpObj.length
			}
			for(var k=0;k<activeElmLength;k++){
				var activeObj = activeElement[k];
				var activeGrpObj = activeObj;
				
				if(actvGrpObj){
					activeGrpObj = actvGrpObj[k];
				}
				
				if(undoRedoFont){
					font = undoRedoFont;
				}
				var undoMng = window.CD.undoManager;
				var textStyleObj = CanvasData.getTextStyleData(activeGrpObj.getId());
				
				var align = textStyleObj.textAlign;
				var underlineVal = textStyleObj.underlineVal;
				var prevFontSize = textStyleObj.fontSize;
				
				var framJsonObj = window.CD.module.data.Json.FrameData;
				var frmID = activeGrpObj.getId().split('_')[2];
				var frameTextId = activeGrpObj.getId().split('_')[1];
				
				var frmObj = txtConfg.cs.findGroup('frame_'+frmID);
				
				for(var i=0;i<window.CD.module.data.Json.FrameData[frmID].frameTextList.length;i++){
					  if(window.CD.module.data.Json.FrameData[frmID].frameTextList[i].textGroupObjID == activeObj.getId())
						  var txtId = i;	  
				}
				
				var textX = framJsonObj[frmID].frameTextList[txtId].textX;
				var textY = framJsonObj[frmID].frameTextList[txtId].textY;
				
				var adjustmentX = 0;
				var adjustmentY = 0;
				
				var frameX = framJsonObj[frmID].frameX;
				var frameY = framJsonObj[frmID].frameY;
				
				if(frmID == 0){
					adjustmentX = 15;
					adjustmentY = 15;
				}else{
					adjustmentX = 0;
					adjustmentY = 0;
				}
				
				var event = {};
				event.x = textX - adjustmentX;
				event.y = textY - adjustmentY;
				
				var actvTextId = activeGrpObj.getId();
				var textValue = CanvasData.getCanvasTextValue(actvTextId);
				
				var defaultParams = CanvasData.getDefaultParamsFromJson(actvTextId);
				
				this.textFormat.deleteActiveText(activeGrpObj);
				
				txtConfg.realTextValue = txtConfg.checkAndUpdateCharFromPalete(textValue);
				
				var params = {};
				params.fontSize = font;
				defaultParams = $.extend(defaultParams,params);
				CanvasData.updateCanvasTextData(defaultParams,frameTextId,frmID);
				
				txtGrpObj = this.textFormat.createFrameText(frameTextId, frmObj, event, textValue, align);
				makeFrameTextResizable(txtGrpObj,txtGrpObj.children[0].getWidth(),txtGrpObj.children[0].getHeight());
				txtConfg.textEventBind(txtGrpObj);
				
				var activeChildren = txtConfg.getTextObjFromGroupObject(txtGrpObj);
				var globalUnderline = 'global';
				if(underlineVal == 'T'){
					$.each(activeChildren,function(cnt,val){
						val.setName('underlined_text');
					});
					
				}else{
					$.each(activeChildren,function(cnt,val){
						var underlineStatus = CanvasData.getUnderlineStatus(val.getId());
						if(underlineStatus == 'F')
							val.setName('normal_text');
					});	
					globalUnderline = undefined;
				}
				if(underlineVal == 'T'){
					$('#UnderlinetTool').addClass('active');
				}
				this.textStyle.applyEachTextUnderline(txtGrpObj,globalUnderline);
				
				var parentLayer = txtGrpObj.getLayer();
				if(parentLayer && (parentLayer.attrs.id==="text_layer" || parentLayer.attrs.id==="cd_layer")){
					parentLayer.draw();
				}
				txtConfg.drawLayer();
			}
			
			
			undoMng.register(this, this.setActiveTextFontSize,[activeElement,prevFontSize] , 'undo text font change',this, this.setActiveTextFontSize,[activeElement,font], 'redo text font change');
			updateUndoRedoState(undoMng);
			
		}catch(error){
			console.info("Error in allTextStyling :: setActiveTextFontSize : "+error.message);
		}
	};
	
	this.getLineObjectCount = function(groupObj){
		try{
			var count = 0;
			$.each(groupObj.getChildren(),function(cnt,val){
				if(val.className == 'Line'){
					count++;
				}
			});
			return count;
		}catch(error){
			console.info("Error in textStyle :: getLineObjectCount "+error.message);
		}
	};
	/**
	 * This method is used for text align undo-redo
	 */
	this.undoRedoTextAlign=function(txtGrp,textAlign){
		 try{
			 $('#leftAlignTool').removeClass('active');
			 $('#justifyAlignTool').removeClass('active');
			 $('#rightAlignTool').removeClass('active');
			 $('#middleAlignTool').removeClass('active');
			 
			if(textAlign == "left"){
	           this.alignActiveTextLeft(txtGrp);
	           $('#leftAlignTool').addClass('active');
	       }else if(textAlign == "justify"){
	           this.alignActiveTextJustify(txtGrp);
	           $('#justifyAlignTool').addClass('active');
	       }else if(textAlign == "right"){
	           this.alignActiveTextRight(txtGrp);
	           $('#rightAlignTool').addClass('active');
	       }else{
	          this.alignActiveTextMiddle(txtGrp);
	          $('#middleAlignTool').addClass('active');
	       }
		 }
		 catch(error){
			 console.info("Error in applyIndentation :: textStyle "+error.message);
		 }
	};
};