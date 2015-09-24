var labelTextStyle = labelTextStyle || {};
/**
 * @class name : labelTextStyling
 * description : All text styling is done here
 */
labelTextStyle = function (){
	this.textFormat = new TextFormat();
	this.cmmnlablTxtTool = new TextTool.commonLabelText();
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
			
	this.style={align:"center",border:"F",fontStyle:"normal",fill:"F"};
	
	
	
	/**
	 * @param activeGrpObj
	 * @description : This method is used for applying underline to each 
	 * text object
	 */
	this.applyEachTextUnderline = function(activeGrpObj,globalOrLocal){
		console.log('@labelTextStyling::applyEachTextUnderline');
		try{
			this.textStyle.removeUnderline(activeGrpObj);
			var txtToolCfg = this.cmmnlablTxtTool;
			var activeChildren = txtToolCfg.getTextObjFromGroupObject(activeGrpObj);
			var ds = window.CD.services.ds;
			
			if(activeGrpObj.getId().match(/^hintTxt_[0-9]+/) != null){
				var labelID = activeGrpObj.getId().split('_')[1];
				var textChildId = '#hintTxt_'+labelID;
			}else{
				if(activeGrpObj.parent.getId().match(/^dock_label_[0-9]+/) != null){
					var labelID = activeGrpObj.parent.getId().split('_')[2];
				}else{
					var labelID = activeGrpObj.parent.getId().split('_')[1];
				}
				var textChildId = '#lbltxt_'+labelID;
			}
			
			
			var boxWidth = activeGrpObj.parent.children[0].getWidth();
			$.each(activeChildren,function(i,val){
				if(typeof val==="object" && val.nodeType==="Shape" && val.className==="Text" && (!(val.attrs.id.match(/dock_addTxt_[0-9]+/))))
				{
				  var activeObj = val;
				  var textFormat = new TextFormat();
				  var textNam = activeObj.getName();
				  if(textNam.indexOf(',') != -1){
					  textNam  = textNam.split(',')[0];
				  }
				  if(textNam == 'underlined_text'){
					  for(var i=0; i<activeObj.textArr.length ;i++){
							if(activeGrpObj.get(textChildId+'_'+i).length > 0){
								var startpos = activeObj.getX();
							}else{
								  var activeWidth = activeObj.textArr[i].width;
								  if(activeObj.getAlign() == "center"){
									  var startpos = activeObj.getX();
									  startpos = startpos - 2;
									  /*if(ds.getEt() == 'PRG'){
										  startpos = startpos - 8;
									  }*/
									  /** commenting as of now not understanding the purpose **/
									  /*if(rerender == true)
										  startpos = startpos -5;*/
								  }else  if(activeObj.getAlign() == "left" || activeObj.getAlign() == "justify"){
									  var startpos = activeObj.getX();
								  }else  if(activeObj.getAlign() == "right"){
									  var startpos = activeObj.getX();
										  
								  }
							}
							
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
			console.info("Error in labelTextStyling :: applyEachTextUnderline : "+err.message);
		}
	};
	
	this.alignActiveCanvasText = function(elm,align){
		try{
			var txtConfg = this.cmmnlablTxtTool;
			var activeObjLength = window.CD.elements.active.element.length;
			var txtConfg = new TextTool.commonLabelText();
			var activeObjType = window.CD.elements.active.type;
			var activeObj = [];
			window.CD.globalStyle.alignment = align;
			for(var i=0;i<activeObjLength;i++){
				if(activeObjType == 'label'){
					var label = elm[i];
					var txtId = 'txtGrp_' + label.attrs.id.split('_')[1];
					activeObj.push(elm[i].get('#'+txtId)[0]);
				}else{
					activeObj.push(elm[i]);
				}
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
			var cdLayer = window.CD.services.cs.getLayer();
			cdLayer.draw();
		}catch(err){
			console.log("Error in labelTextStyling :: alignActiveCanvasText : "+err.message);
		}
	};
	/**
	 * function name: alignActiveText()
	 * description:align active text
	 
	 * 
	 */
	this.alignActiveTextLeft = function(elm,undoAlign){
		try{
				
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var activeObjLength = window.CD.elements.active.element.length;
			var undoMng = window.CD.undoManager;
			var txtConfg = new TextTool.commonLabelText();
			var activeObjs = [];
			
			if(elm){
				if(elm.length){
					activeObjLength = elm.length;
					for(var j=0;j<activeObjLength;j++){
						activeObjs.push(elm[j]);
					}
				}else{
					activeObjs.push(elm);
					activeObjLength = 1;
				}					
			}
//			for(var j=0;j<activeObjLength;j++){
//				activeObjs.push(elm[j]);
//			}
			for(var i=0;i<activeObjLength;i++){
			
				var activeObj = activeObjs[i];
				var childrenLen = 0;
				if(activeObj.getId().match(/^label_[0-9]+/) != null){
					childrenLen = 2;
				}
				if(activeObj.children.length > childrenLen){
					if(ds.getEt() != 'PRG'){
						var textStyleObj = window.CD.module.data.getTextStyleData(activeObj.getId().split('_')[1]);
					}else{
						var textStyleObj = window.CD.module.data.getLabelTextStyleData(activeObj.getId().split('_')[1]);
					}
					
					
					var underline_value = textStyleObj.underline_value;
					var prevAlign = textStyleObj.align;
								
					if(activeObj.children.length == 0)
						activeObj = txtConfg.cs.getLayer().get('#'+activeObj.attrs.id)[0];
					
					var activeGrpObj=activeObj;
					
					var ds = window.CD.services.ds;
					if(ds.getEt() == 'SLE'){
						var activelabelId = activeGrpObj.parent.getId();
						var activeDock = cs.findGroup('dock_'+activelabelId);
						if(activeDock){
							var activeDockTextGrp = activeDock.get('#docktxtGrp_'+activelabelId.split('_')[1])[0];
							this.setActiveTextAlignment(activeDockTextGrp, 'left',underline_value);
						}
					}
					
					
					this.setActiveTextAlignment(activeObj, 'left',underline_value);			
					
					txtConfg.drawLayer();	
					/*** pending : undo redo will go here ****/
					 /** Data update **/
					var textId = activeObj.getId().split('_')[1];
					var labelId = activeObj.parent.getId();
					
					var defaultParams = window.CD.module.data.getTextFormatParamsFromJson(textId);
					var params = {};
					params.align = 'left';
					defaultParams = $.extend(defaultParams,params);
					if(activeObj.getId().match(/^txtGrp_[0-9]+/) !== null){
						window.CD.module.data.updateLabelTextData(defaultParams,labelId);
					}	
				}
			}
				
			if(!undoAlign){
				undoMng.register(this, this.undoRedoTextAlign,[activeObjs,prevAlign] , 'undo text Formatting left',this, this.undoRedoTextAlign,[activeObjs,'left'] , 'redo text Formatting left');
				updateUndoRedoState(undoMng);
			}
						
			
		}catch(err){
			console.info("Error in labelTextStyling :: alignActiveTextLeft : "+err.message);
		}
	};
        
	
	this.alignActiveTextJustify=function(elm,undoAlign){
		try{
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var activeObjLength = window.CD.elements.active.element.length;
			var undoMng = window.CD.undoManager;
			var txtConfg = new TextTool.commonLabelText();
			var activeObjs = [];
			
			if(elm){
				if(elm.length){
					activeObjLength = elm.length;
					for(var j=0;j<activeObjLength;j++){
						activeObjs.push(elm[j]);
					}
				}else{
					activeObjs.push(elm);
					activeObjLength = 1;
				}					
			}
//			for(var j=0;j<activeObjLength;j++){
//				activeObjs.push(elm[j]);
//			}
			for(var i=0;i<activeObjLength;i++){
			
				var activeObj = activeObjs[i];
				var childrenLen = 0;
				if(activeObj.getId().match(/^label_[0-9]+/) != null){
					childrenLen = 2;
				}
				if(activeObj.children.length > childrenLen){
					if(ds.getEt() != 'PRG'){
						var textStyleObj = window.CD.module.data.getTextStyleData(activeObj.getId().split('_')[1]);
					}else{
						var textStyleObj = window.CD.module.data.getLabelTextStyleData(activeObj.getId().split('_')[1]);
					}
					
					var underline_value = textStyleObj.underline_value;
					var prevAlign = textStyleObj.align;
					
					if(activeObj.children.length == 0)
						activeObj = txtConfg.cs.getLayer().get('#'+activeObj.attrs.id)[0];
					
					var activeGrpObj=activeObj;
					
					var ds = window.CD.services.ds;
					if(ds.getEt() == 'SLE'){
						var activelabelId = activeGrpObj.parent.getId();
						var activeDock = cs.findGroup('dock_'+activelabelId);
						if(activeDock){
							var activeDockTextGrp = activeDock.get('#docktxtGrp_'+activelabelId.split('_')[1])[0];
							this.setActiveTextAlignment(activeDockTextGrp, 'justify',underline_value);
						}
					}
					
					
					this.setActiveTextAlignment(activeObj,'justify',underline_value);
								
					txtConfg.drawLayer();
					/*** pending : data update and undo redo will go here ****/
					 /** Data update **/
					/** Data update **/
					var textId = activeObj.getId().split('_')[1];
					var labelId = activeObj.parent.getId();
					
					var defaultParams = window.CD.module.data.getTextFormatParamsFromJson(textId);
					var params = {};
					params.align = 'justify';
					defaultParams = $.extend(defaultParams,params);
					
					if(activeObj.getId().match(/^txtGrp_[0-9]+/) !== null){
						window.CD.module.data.updateLabelTextData(defaultParams,labelId);
					}
				}
				
			}
			
			if(!undoAlign){
				undoMng.register(this, this.undoRedoTextAlign,[activeObjs,prevAlign] , 'undo text Formatting justify',this, this.undoRedoTextAlign,[activeObjs,'justify'] , 'redo text Formatting justify');
				updateUndoRedoState(undoMng);
			}
		}
		catch(err){
			console.info("Error in labelTextStyling :: alignActiveTextJustify : "+err.message);
		}		
	};
	
	this.alignActiveTextRight=function(elm,undoAlign){
		try{
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var activeObjLength = window.CD.elements.active.element.length;
			var undoMng = window.CD.undoManager;
			var txtConfg = new TextTool.commonLabelText();
			var activeObjs = [];
			
			if(elm){
				if(elm.length){
					activeObjLength = elm.length;
					for(var j=0;j<activeObjLength;j++){
						activeObjs.push(elm[j]);
					}
				}else{
					activeObjs.push(elm);
					activeObjLength = 1;
				}					
			}
//			for(var j=0;j<activeObjLength;j++){
//				activeObjs.push(elm[j]);
//			}
			for(var i=0;i<activeObjLength;i++){
			
				var activeObj = activeObjs[i];
				var childrenLen = 0;
				if(activeObj.getId().match(/^label_[0-9]+/) != null){
					childrenLen = 2;
				}
				if(activeObj.children.length > childrenLen){
					if(ds.getEt() != 'PRG'){
						var textStyleObj = window.CD.module.data.getTextStyleData(activeObj.getId().split('_')[1]);
					}else{
						var textStyleObj = window.CD.module.data.getLabelTextStyleData(activeObj.getId().split('_')[1]);
					}
					
					var underline_value = textStyleObj.underline_value;
					var prevAlign = textStyleObj.align;
					
					if(activeObj.children.length == 0)
						activeObj = txtConfg.cs.getLayer().get('#'+activeObj.attrs.id)[0];
					var activeGrpObj = activeObj;
					
					var ds = window.CD.services.ds;
					if(ds.getEt() == 'SLE'){
						var activelabelId = activeGrpObj.parent.getId();
						var activeDock = cs.findGroup('dock_'+activelabelId);
						if(activeDock){
							var activeDockTextGrp = activeDock.get('#docktxtGrp_'+activelabelId.split('_')[1])[0];
							this.setActiveTextAlignment(activeDockTextGrp, 'right',underline_value);
						}
					}
					
					this.setActiveTextAlignment(activeObj, 'right',underline_value);
								
					txtConfg.drawLayer();
					/*** pending : data update and undo redo will go here ****/
					 /** Data update **/
					/** Data update **/
					var textId = activeObj.getId().split('_')[1];
					var labelId = activeObj.parent.getId();
					
					var defaultParams = window.CD.module.data.getTextFormatParamsFromJson(textId);
					var params = {};
					params.align = 'right';
					defaultParams = $.extend(defaultParams,params);
					
					if(activeObj.getId().match(/^txtGrp_[0-9]+/) !== null){
						window.CD.module.data.updateLabelTextData(defaultParams,labelId);
					}
				}
				
			}
			if(!undoAlign){
				undoMng.register(this, this.undoRedoTextAlign,[activeObjs,prevAlign] , 'undo text Formatting right',this, this.undoRedoTextAlign,[activeObjs,'right'] , 'redo text Formatting right');
				updateUndoRedoState(undoMng);
			}
		}
		catch(err){
			console.info("Error in labelTextStyling :: alignActiveTextRight : "+err.message);
		}		
	};
	
	this.alignActiveTextMiddle=function(elm,undoAlign){
		try{
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var activeObjLength = window.CD.elements.active.element.length;
			var undoMng = window.CD.undoManager;
			var txtConfg = new TextTool.commonLabelText();
			var activeObjs = [];
			
			if(elm){
				if(elm.length){
					activeObjLength = elm.length;
					for(var j=0;j<activeObjLength;j++){
						activeObjs.push(elm[j]);
					}
				}else{
					activeObjs.push(elm);
					activeObjLength = 1;
				}					
			}
						
			for(var i=0;i<activeObjLength;i++){
			
				var activeObj = activeObjs[i];
				var childrenLen = 0;
				if(activeObj.getId().match(/^label_[0-9]+/) != null){
					childrenLen = 2;
				}
				if(activeObj.children.length > childrenLen){
					if(activeObj.getId().match(/label_[0-9]+/) != null){
						
						if(ds.getEt() != 'PRG'){
							var textStyleObj = window.CD.module.data.getTextStyleData(activeObj.getId().split('_')[1]);
						}else{
							var textStyleObj = window.CD.module.data.getLabelTextStyleData(activeObj.getId().split('_')[1]);
						}
						
						var underline_value = textStyleObj.underline_value;
						var prevAlign = textStyleObj.align;
					}else{
						var underline_value = 'F';
						var prevAlign = 'center';
					}
									
					if(activeObj.children.length == 0)
						activeObj = txtConfg.cs.getLayer().get('#'+activeObj.attrs.id)[0];
					
					var activeGrpObj=activeObj;
		
		
					var ds = window.CD.services.ds;
					if(ds.getEt() == 'SLE'){
						var activelabelId = activeGrpObj.parent.getId();
						var activeDock = cs.findGroup('dock_'+activelabelId);
						if(activeDock){
							var activeDockTextGrp = activeDock.get('#docktxtGrp_'+activelabelId.split('_')[1])[0];
							this.setActiveTextAlignment(activeDockTextGrp, 'center',underline_value);
						}
					}
					
					
					this.setActiveTextAlignment(activeObj, 'center',underline_value);
								
					txtConfg.drawLayer();
					/*** pending : data update and undo redo will go here ****/
					 /** Data update **/
					/** Data update **/
					var textId = activeObj.getId().split('_')[1];
					var labelId = activeObj.parent.getId();
					
					
					if(activeObj.getId().match(/^txtGrp_[0-9]+/) !== null){
						var defaultParams = window.CD.module.data.getTextFormatParamsFromJson(textId);
						var params = {};
						params.align = 'center';
						defaultParams = $.extend(defaultParams,params);
						window.CD.module.data.updateLabelTextData(defaultParams,labelId);
					}
				}
					
			}
			
			if(!undoAlign){
				undoMng.register(this, this.undoRedoTextAlign,[activeObjs,prevAlign] , 'undo text Formatting middle',this, this.undoRedoTextAlign,[activeObjs,'center'] , 'redo text Formatting middle');
				updateUndoRedoState(undoMng);
			}	
			
		}catch(err){
			console.info("Error in labelTextStyling :: alignActiveTextMiddle : "+err.message);
		}		
	};
	
	this.setActiveTextAlignment = function(activeObj,align,underline_value){
		try{
			var txtConfg = new TextTool.commonLabelText();
			var totalWidth =0;
			var childrenTxtObj = txtConfg.getTextObjFromGroupObject(activeObj);
			$.each(childrenTxtObj,function(index,value){
				//if((value.attrs.id.match(/lbltxt_[0-9]+/))){
					totalWidth = totalWidth + value.getTextWidth();	
					value.setAlign(align);
				//}
			});
			var lineObjCount = this.textStyle.getLineObjectCount(activeObj);
			var childrenCount = parseInt(activeObj.children.length) - parseInt(lineObjCount);
			
			var childrenCnt = 2;
			if(activeObj.getId().match(/^txtGrp_[0-9]+/) == null){
				childrenCnt = 0;
			}
			
			if(typeof activeObj==="object" && activeObj.nodeType==="Group" && (childrenCount>childrenCnt))
			{
				if(align != 'left' || align != 'justify'){
					this.textStyle.TextAlignMent(activeObj,'left');
				}				
				this.textStyle.TextAlignMent(activeObj,align);
					
			}
			this.textStyle.applyEachTextUnderline(activeObj);
			
			
			if(underline_value == 'T'){
				$('#UnderlinetTool').addClass('active');
				this.textStyle.applyEachTextUnderline(activeObj,'global');
			}
		}catch(error){
			console.log("Error in setActiveTextAlignment :: labelTextStyle "+error.message);
		}
	};
	
	this.TextAlignMent= function(txtGrpObj,align){
		console.log("@TextAlignMent :: labelTextStyle");
		try{
			var txtConfg = this.cmmnlablTxtTool;
			/** 0.1 padding as we have defined available text area for text is 90% of the total width (similar to student side) **/
			var padding = parseInt(txtGrpObj.parent.children[0].getWidth())*0.1;
			txtGrpObj.setX(padding/2);
			var childTxtObj = txtConfg.getTextObjFromGroupObject(txtGrpObj);
			if(childTxtObj.length > 0){
				 var initY =0;
				 var totWidth = 0;	
				 var totalTexts =0;
				 var txtArrayC = new Array();
				 var txtArrayP = new Array();
				 var buffer = 10;
				 var prevY = 0;
				 $.each(childTxtObj, function(index,val) {
					 if(val.attrs.id.match(/txt_[0-9]+/) || val.attrs.id.match(/lblTxt_[0-9]+/) || val.attrs.id.match(/hintTxt/)){
						if(val.attrs.id.match(/txt_0_[0-9]+/) || val.attrs.id.match(/lblTxt_[0-9]+/)){
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
								tempArr[i].setX(0);
							else if(align == 'center'){
								/** It is defined that available text area for text is 90% of the total width (similar to student side) **/
								var availableTextArea = parseInt(txtGrpObj.parent.children[0].getWidth())*0.9;
								var leftPadding = ((availableTextArea- totWidth)/2);
								if(leftPadding<0)
									leftPadding = 0;
								tempArr[i].setX(leftPadding);
							}else if(align == 'right'){
								var availableArea = parseInt(txtGrpObj.parent.children[0].getWidth())*0.9;
								tempArr[i].setX((availableArea - totWidth));
							}	
						}else{
							tempArr[i].setX(tempArr[i-1].getX() +  tempArr[i-1].getTextWidth());
						}
					}
				}
			}
		}
		catch(err){
			console.info("Error in labelTextStyling :: TextAlignMent : "+err.message);
		}
	};
	
	
	this.removeUnderline = function(activeGrpObj,removeline){
		try{
			var txtConfg = this.cmmnlablTxtTool;
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
			console.info("Error in labelTextStyling :: removeUnderline : "+err.message);
		}		
	};
	
	this.boldActiveText = function(activeGrpObj1,undoRedoTxtStyle,activeObjType1){
		try{
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var activeObjLength = window.CD.elements.active.element.length;
			var undoMng = window.CD.undoManager;
			if(activeGrpObj1){
				activeObjLength = activeGrpObj1.length;
			}
			var txtConfg = new TextTool.commonLabelText();
			var activeObjs = [];
			var activeObjType = window.CD.elements.active.type;
			if(activeObjType1){
				activeObjType = activeObjType1;
			}
			if(!undoRedoTxtStyle){
				for(var j=0;j<activeObjLength;j++){
					activeObjs.push(window.CD.elements.active.element[j]);
				}
			}else{
				for(var j=0;j<activeObjLength;j++){
					activeObjs.push(activeGrpObj1[j]);
				}
			}
			
			for(var i=0;i<activeObjLength;i++){
				if(activeObjType == 'label'){
					var label = activeObjs[i];
					var txtId = 'txtGrp_' + label.attrs.id.split('_')[1];
					var activeObj = activeObjs[i].get('#'+txtId)[0];
				}else{
					var activeObj = activeObjs[i];
				}

				var activeGrpObj = activeObj;
				var childrenLen = 0;
				if(activeObj.getId().match(/^label_[0-9]+/) != null){
					childrenLen = 2;
				}
				if(activeObj.children.length > childrenLen){
					var newFont = '';
					var activeChildren = txtConfg.getTextObjFromGroupObject(activeGrpObj);
					
					if(ds.getEt() != 'PRG'){
						var textStyleObj = window.CD.module.data.getTextStyleData(activeObj.getId().split('_')[1]);
					}else{
						var textStyleObj = window.CD.module.data.getLabelTextStyleData(activeObj.getId().split('_')[1]);
					}
					
					var textStyle = textStyleObj.fontStyle;
					var align = textStyleObj.align;
					var underline_value = textStyleObj.underline_value;
					
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
					else 
						newFont = "bold";	
					window.CD.globalStyle.fontStyle = newFont;	
					var globalTextStyle = {};
					globalTextStyle.fontStyle = newFont;
					
					
					var textValue = window.CD.module.data.getLabelTextValue(activeObj.parent.getId());
					
					this.textFormat.deleteEachLabelText(activeGrpObj);
					
					txtGrpObj = this.textFormat.createLabelText(activeObj, textValue, align, globalTextStyle);
					if(window.CD.module.data.Json.adminData.ET != 'PRG'){
						txtConfg.bindLabelTextEvent(txtGrpObj);
					}
					
					/** For SLE dock text **/
					if(ds.getEt() == 'SLE'){
						this.dockTextStyling(activeGrpObj,textValue, align, globalTextStyle,underline_value);
						//txtConfg.finalAdjustmentLabelContent(activeGrpObj.parent);
					}			
					
					/** This is done as for bold, label text value is getting stretched, hence need to adjust the top padding **/
					var count = txtGrpObj.children.length-1;
					var lastChild = txtConfg.findLastTextchild(txtGrpObj,count);
					var textGrpHeight = txtGrpObj.children[lastChild].getY() + txtGrpObj.children[lastChild].getHeight();
					var topPadding = (txtGrpObj.parent.children[0].getHeight()-textGrpHeight)/2;
					if(topPadding < 0)
						topPadding = 0;
					txtGrpObj.setY(topPadding);
					
					var activeChildren = txtConfg.getTextObjFromGroupObject(txtGrpObj);
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
					this.textStyle.applyEachTextUnderline(txtGrpObj,globalUnderline);
					
					var textId = activeObj.getId().split('_')[1];
					var labelId = activeObj.parent.getId();
					
					var defaultParams = window.CD.module.data.getTextFormatParamsFromJson(textId);
					var params = {};
					params.fontStyle = newFont;
					defaultParams = $.extend(defaultParams,params);
					
					if(activeObj.getId().match(/^txtGrp_[0-9]+/) !== null){
						window.CD.module.data.updateLabelTextData(defaultParams,labelId);
						
					}
								
					var cdLayer = window.CD.services.cs.getLayer();
					var imageObj = txtGrpObj.parent.get('.img')[0];
					if(imageObj){
						txtConfg.finalAdjustmentLabelContent(txtGrpObj.parent);
					}
					
					cdLayer.draw();
					/** Condition added for tool bar bold selection issue **/
					if(newFont.indexOf('bold') != -1){
						$('#boldTool').removeClass('active');
					}else{
						$('#boldTool').addClass('active');
					}
				}
			}
			if(undoRedoTxtStyle){
				if($('#boldTool').hasClass('active')){
					$('#boldTool').removeClass('active');
				}else{
					$('#boldTool').addClass('active');
				}
			}
			if(!undoRedoTxtStyle){
				undoMng.register(this, this.boldActiveText,[activeObjs,newFont,activeObjType] , 'Text Formatting',this, this.boldActiveText,[activeObjs,textStyle,activeObjType] , 'Text Formatting');
				updateUndoRedoState(undoMng);
			}
			
		}
		catch(err){
			console.info("Error in labelTextStyling :: boldActiveText : "+err.message);
		}
	};
	this.italicActiveText = function(activeGrpObj1,undoRedoTxtStyle,activeObjType1){
		try{
			
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var activeObjLength = window.CD.elements.active.element.length;
			var undoMng = window.CD.undoManager;
			if(activeGrpObj1){
				activeObjLength = activeGrpObj1.length;
			}
			var txtConfg = new TextTool.commonLabelText();
			var activeObjs = [];
			var activeObjType = window.CD.elements.active.type;
			if(activeObjType1){
				activeObjType = activeObjType1;
			}
			if(!undoRedoTxtStyle){
				for(var j=0;j<activeObjLength;j++){
					activeObjs.push(window.CD.elements.active.element[j]);
				}
			}else{
				for(var j=0;j<activeObjLength;j++){
					activeObjs.push(activeGrpObj1[j]);
				}
			}
			
			for(var i=0;i<activeObjLength;i++){
				if(activeObjType == 'label'){
					var label = activeObjs[i];
					var txtId = 'txtGrp_' + label.attrs.id.split('_')[1];
					var activeObj = activeObjs[i].get('#'+txtId)[0];
				}else{
					var activeObj = activeObjs[i];
				}
				var childrenLen = 0;
				if(activeObj.getId().match(/^label_[0-9]+/) != null){
					childrenLen = 2;
				}
				if(activeObj.children.length > childrenLen){
					var activeGrpObj = activeObj;
					var newFont = '';
					var undoMng = window.CD.undoManager;
					var activeChildren = txtConfg.getTextObjFromGroupObject(activeGrpObj);

					if(ds.getEt() != 'PRG'){
						var textStyleObj = window.CD.module.data.getTextStyleData(activeObj.getId().split('_')[1]);
					}else{
						var textStyleObj = window.CD.module.data.getLabelTextStyleData(activeObj.getId().split('_')[1]);
					}
					
					var textStyle = textStyleObj.fontStyle;
					var align = textStyleObj.align;
					var underline_value = textStyleObj.underline_value;
					
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
					globalTextStyle.fontStyle = newFont;
					
					var textValue = window.CD.module.data.getLabelTextValue(activeObj.parent.getId());
					
					//this.textFormat.deleteActiveLabelText(activeGrpObj);
					this.textFormat.deleteEachLabelText(activeGrpObj);
					
					txtGrpObj = this.textFormat.createLabelText(activeGrpObj, textValue, align, globalTextStyle);
					if(window.CD.module.data.Json.adminData.ET != 'PRG'){
						txtConfg.bindLabelTextEvent(txtGrpObj);
					}

					
					/** For SLE dock text **/
					var ds = window.CD.services.ds;
					if(ds.getEt() == 'SLE'){
						this.dockTextStyling(activeGrpObj,textValue, align, globalTextStyle,underline_value);
					}
					
					var activeChildren = txtConfg.getTextObjFromGroupObject(txtGrpObj);
					var globalUnderline = 'global';
					
					if(underline_value == 'T'){
						$.each(activeChildren,function(cnt,val){
							if(!val.getId().match(/^addTxt_[0-9]+/)){
								val.setName('underlined_text');
							}					
						});
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
					this.textStyle.applyEachTextUnderline(txtGrpObj,globalUnderline);
					
					var textId = activeObj.getId().split('_')[1];
					var labelId = activeObj.parent.getId();
					
					var defaultParams = window.CD.module.data.getTextFormatParamsFromJson(textId);
					var params = {};
					params.fontStyle = newFont;
					defaultParams = $.extend(defaultParams,params);
					
					if(activeObj.getId().match(/^txtGrp_[0-9]+/) !== null){
						window.CD.module.data.updateLabelTextData(defaultParams,labelId);
						
					}
					var cdLayer = window.CD.services.cs.getLayer();
					cdLayer.draw();
				}
				
			}	
			if(undoRedoTxtStyle){
				if($('#italicsTool').hasClass('active')){
					$('#italicsTool').removeClass('active');
				}else{
					$('#italicsTool').addClass('active');
				}
			}
			if(!undoRedoTxtStyle){
				undoMng.register(this, this.italicActiveText,[activeObjs,newFont,activeObjType] , 'Text Formatting',this, this.italicActiveText,[activeObjs,textStyle,activeObjType] , 'Text Formatting');
				updateUndoRedoState(undoMng);
			}
		}
		catch(err){
			console.info("Error in labelTextStyling :: italicActiveText : "+err.message);
		}		
	};
	
	/**
	 * This method is used for applying global underlining
	 */
	this.underlineActiveText=function(activeGrpObj1,underlineValUndoRedo,activeObjType1){
		console.log("@labelTextStyling.underlineActiveText");
		try{
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var globalUnderline = 'global';
			var activeObjLength = window.CD.elements.active.element.length;
			var undoMng = window.CD.undoManager;
			if(activeGrpObj1){
				activeObjLength = activeGrpObj1.length;
			}
			var txtConfg = new TextTool.commonLabelText();
			var activeObjs = [];
			var activeObjType = window.CD.elements.active.type;
			if(activeObjType1){
				activeObjType = activeObjType1;
			}
			if(!underlineValUndoRedo){
				for(var j=0;j<activeObjLength;j++){
					activeObjs.push(window.CD.elements.active.element[j]);
				}
			}else{
				for(var j=0;j<activeObjLength;j++){
					activeObjs.push(activeGrpObj1[j]);
				}
			}
			
			
			for(var i=0;i<activeObjLength;i++){
				if(activeObjType == 'label'){
					var label = activeObjs[i];
					var txtId = 'txtGrp_' + label.attrs.id.split('_')[1];
					var activeObj = activeObjs[i].get('#'+txtId)[0];
				}else{
					var activeObj = activeObjs[i];
				}
				var childrenLen = 0;
				if(activeObj.getId().match(/^label_[0-9]+/) != null){
					childrenLen = 2;
				}
				if(activeObj.children.length > childrenLen){
					var activeGrpObj = activeObj;
					
					if(ds.getEt() != 'PRG'){
						var textStyleObj = window.CD.module.data.getTextStyleData(activeObj.getId().split('_')[1]);
					}else{
						var textStyleObj = window.CD.module.data.getLabelTextStyleData(activeObj.getId().split('_')[1]);
					}
					
					var underline_value = textStyleObj.underline_value;
					
					if(underlineValUndoRedo){
						underline_value = underlineValUndoRedo;
					}		
					var updatedUnderlineVal = 'T';
					
					var activeChildren = txtConfg.getTextObjFromGroupObject(activeGrpObj);
					if(underline_value == 'F'){
						$.each(activeChildren,function(cnt,val){
							if(!val.getId().match(/^addTxt_[0-9]+/)){
								val.setName('underlined_text');
							}					
						});
						updatedUnderlineVal = 'T';
					}else{
						$.each(activeChildren,function(cnt,val){
							if(!val.getId().match(/^addTxt_[0-9]+/)){
								var underlineStatus = window.CD.module.data.getUnderlineStatus(val.getId());
								if(underlineStatus == 'F')
									val.setName('normal_text');
							}					
						});	
						updatedUnderlineVal = 'F';
						globalUnderline = undefined;
					}
					
					
					if(typeof activeObj == "object" && activeObj.nodeType == "Group"){
						this.textStyle.applyEachTextUnderline(activeObj,globalUnderline);
					}
					
					/** For SLE dock text **/
					if(ds.getEt() == 'SLE'){
						var dockUnderlineVal = 'F';
						if(underline_value == 'F')
							dockUnderlineVal = 'T';
						this.dockTextStyling(activeGrpObj,undefined, undefined, undefined,dockUnderlineVal);
					}
					
					var textId = activeObj.getId().split('_')[1];
					var labelId = activeObj.parent.getId();
					
					var defaultParams = window.CD.module.data.getTextFormatParamsFromJson(textId);
					var params = {};
					params.underline_value = updatedUnderlineVal;
					defaultParams = $.extend(defaultParams,params);
					
					if(activeObj.getId().match(/^txtGrp_[0-9]+/) !== null){
						window.CD.module.data.updateLabelTextData(defaultParams,labelId);		
					}
					var cdLayer = window.CD.services.cs.getLayer();
					cdLayer.draw();
				}
				
			}
			window.CD.globalStyle.underlineVal = updatedUnderlineVal;
			
			if(underlineValUndoRedo){
				if($('#UnderlinetTool').hasClass('active')){
					$('#UnderlinetTool').removeClass('active');
				}else{
					$('#UnderlinetTool').addClass('active');
				}
			}
			
			if(!underlineValUndoRedo){
				undoMng.register(this, this.underlineActiveText,[activeObjs,updatedUnderlineVal,activeObjType] , 'undo text underline',this, this.underlineActiveText,[activeObjs,underline_value,activeObjType], 'redo text underline');
				updateUndoRedoState(undoMng);
			}
			
					
		}
		catch(err){
			console.info("Error in labelTextStyling :: underlineActiveText : "+err.message);
		}
	};
	
	this.getTextStyle=function(txtObj){
		try{
			console.log("@LabelText.getTextStyle");
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
				this.style.fontStyle="bold italic";
			}else if(boldToolId.hasClass('active')){//bold
				this.style.fontStyle="bold";
			}else if(italicToolId.hasClass('active')){//italic
				this.style.fontStyle="bold italic";
			}else{
				this.style.fontStyle="normal";
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
			console.info("Error in labelTextStyling :: getTextStyle : "+err.message);
		}
	};
	this.setActiveTextFontSize = function(activeGrpObj1,undoRedoFont,activeObjType1){
		try{
			var ds = window.CD.services.ds;
			var cs = window.CD.services.cs;
			var activeObjLength = window.CD.elements.active.element.length;
			var font = $("#fontTool .font_size #fontTextbox").val();
			
			window.CD.globalStyle.font = font;
			var txtConfg = new TextTool.commonLabelText();
			if(undoRedoFont){
				font = undoRedoFont;
			}
			var undoMng = window.CD.undoManager;
			if(activeGrpObj1){
				activeObjLength = activeGrpObj1.length;
			}
			var txtConfg = new TextTool.commonLabelText();
			var activeObjs = [];
			var activeObjType = window.CD.elements.active.type;
			if(activeObjType1){
				activeObjType = activeObjType1;
			}
			if(!undoRedoFont){
				for(var j=0;j<activeObjLength;j++){
					if(activeObjType == 'label'){
						var textId = window.CD.elements.active.element[j].attrs.id.split('_')[1];
						activeObjs.push(window.CD.elements.active.element[j].get('#txtGrp_'+textId)[0]);
					}else{
						activeObjs.push(window.CD.elements.active.element[j]);
					}
				}
			}else{
				for(var j=0;j<activeObjLength;j++){
					activeObjs.push(activeGrpObj1[j]);
				}
			}
			
			
			for(var i=0;i<activeObjLength;i++){
				var activeObj = activeObjs[i];
				var activeGrpObj = activeObj;
				var childrenLen = 0;
				if(activeObj.getId().match(/^label_[0-9]+/) != null){
					childrenLen = 2;
				}
				if(activeObj.children.length > childrenLen){
					var textStyleObj = window.CD.module.data.getTextFormatParamsFromJson(activeObj.getId().split('_')[1]);
					var align = textStyleObj.align;
					var underline_value = textStyleObj.underline_value;
					var prevFontSize = textStyleObj.fontSize;
					var actvTextId = activeObj.getId();
					var textValue = window.CD.module.data.getLabelTextValue(activeObj.parent.getId());;
					this.textFormat.deleteEachLabelText(activeGrpObj);
					
					 
					var globalTextStyle = {};
					globalTextStyle.fontSize = font;
					globalTextStyle.fontStyle = textStyleObj.fontStyle;
					
					txtGrpObj = this.textFormat.createLabelText(activeGrpObj,textValue, align, globalTextStyle);
					if(window.CD.module.data.Json.adminData.ET != 'PRG'){
						txtConfg.bindLabelTextEvent(txtGrpObj);
					}
					
					/** For SLE dock text **/
					if(ds.getEt() == 'SLE'){
						this.dockTextStyling(activeGrpObj,textValue, align, globalTextStyle,underline_value);
					}
					/** data update **/
					var labelId = activeObj.parent.getId();
					var textId = activeObj.getId().split('_')[1];
					
					var defaultParams = window.CD.module.data.getTextFormatParamsFromJson(textId);
					var params = {};
					params.fontSize = font;
					defaultParams = $.extend(defaultParams,params);
					if(activeObj.getId().match(/^txtGrp_[0-9]+/) !== null){
						window.CD.module.data.updateLabelTextData(defaultParams,labelId);
						
						
					}
					/** Top adjustment **/
					var count = txtGrpObj.children.length-1;
					var lastChild = txtConfg.findLastTextchild(txtGrpObj,count);
					var textGrpHeight = txtGrpObj.children[lastChild].getY() + txtGrpObj.children[lastChild].getHeight();
					var topPadding = (txtGrpObj.parent.children[0].getHeight()-textGrpHeight)/2;
					if(topPadding<0)
						topPadding = 0;
					txtGrpObj.setY(topPadding);
					
					$("#fontTool .font_size #fontTextbox").val(font);
					$('#fontTool .font_size span.selected').html(font);
					txtConfg.finalAdjustmentLabelContent(txtGrpObj.parent);
					var cdLayer = window.CD.services.cs.getLayer();
					cdLayer.draw();
				}
				
			}
			/** undo - redo register **/
			if(!undoRedoFont){
				undoMng.register(this, this.setActiveTextFontSize,[activeObjs,prevFontSize,activeObjType] , 'undo text font change',this, this.setActiveTextFontSize,[activeObjs,font,activeObjType], 'redo text font change');
				updateUndoRedoState(undoMng);
			}
			
		}catch(error){
			console.info("Error in labelTextStyling :: setActiveTextFontSize : "+error.message);
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
	this.undoRedoTextAlign=function(txtGrp,align){
		 try{
			 $('#leftAlignTool').removeClass('active');
			 $('#justifyAlignTool').removeClass('active');
			 $('#rightAlignTool').removeClass('active');
			 $('#middleAlignTool').removeClass('active');
			 
			if(align == "left"){
	           this.alignActiveTextLeft(txtGrp);
	           $('#leftAlignTool').addClass('active');
	       }else if(align == "justify"){
	           this.alignActiveTextJustify(txtGrp);
	           $('#justifyAlignTool').addClass('active');
	       }else if(align == "right"){
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
	
	
	this.dockTextStyling = function(activeGrpObj,textValue, align, globalTextStyle,underline_value){
		console.log("@dockTextStyling :: labelTextStyling");
		try{
			var cs = window.CD.services.cs;
			var txtConfg = new TextTool.commonLabelText();
			var activelabelId = activeGrpObj.parent.getId();
			var activeDock = cs.findGroup('dock_'+activelabelId);
			if(activeDock){
				var activeDockTextGrp = activeDock.get('#docktxtGrp_'+activelabelId.split('_')[1])[0];
			}
			
			if(globalTextStyle){
				this.textFormat.deleteEachLabelText(activeDockTextGrp);
				
				activeDockTextGrp = this.textFormat.createLabelText(activeDockTextGrp, textValue, align, globalTextStyle);
				
				/** This is done as for bold, label text value is getting stretched, hence need to adjust the top padding **/
				var dockCount = activeDockTextGrp.children.length-1;
				var dockLastChild = txtConfg.findLastTextchild(activeDockTextGrp,dockCount);
				var dockTextGrpHeight = activeDockTextGrp.children[dockLastChild].getY() + activeDockTextGrp.children[dockLastChild].getHeight();
				var dockTopPadding = (activeDockTextGrp.parent.children[0].getHeight()-dockTextGrpHeight)/2;
				if(dockTopPadding < 0)
					dockTopPadding = 0;
				activeDockTextGrp.setY(dockTopPadding);
			}
			
			var dockActiveChildren = txtConfg.getTextObjFromGroupObject(activeDockTextGrp);
			if(underline_value == 'T'){
				$.each(dockActiveChildren,function(cnt,val){
					if(!val.getId().match(/^addTxt_[0-9]+/)){
						val.setName('underlined_text');
					}					
				});
				globalUnderline = 'global';
			}else{
				$.each(dockActiveChildren,function(cnt,val){
					if(!val.getId().match(/^addTxt_[0-9]+/)){
						var underlineStatus = window.CD.module.data.getUnderlineStatus(val.getId());
						if(underlineStatus == 'F')
							val.setName('normal_text');
					}					
				});	
				globalUnderline = undefined;
			}
			this.textStyle.applyEachTextUnderline(activeDockTextGrp,globalUnderline);
		}
		catch(error){
			console.log("Error @dockTextStyling::labelTextStyle "+error.message);
		}
	};
};