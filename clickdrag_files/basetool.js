function BaseTool(instanceObj){
	console.log('@BaseTool');
	var ts = window.CD.services.ts;
	var cs = window.CD.services.cs;
	var ds = window.CD.services.ds;
	var undoMng = window.CD.undoManager;
	
	this.toolConfig = new ToolConfig();
	toolEvent(instanceObj,this);
	
	undoMng.setCallback(updateUndoRedoState(undoMng));
  function toolEvent(instanceObj,that) {
	  console.log('@BaseTool.toolEvent');
	 // var undoStack = [];
	  var frameTool = new FrameTool();
	  var baseTxtTool= new TextTool.frameText();	
	  var canvasTxtTool= new TextTool.frameText();
	  var textFormat = new TextFormat();
	  var allTextStyling = new AllTextStyling();
	  var labelTextStyling = new labelTextStyle();
	  
	  var prgDockTxtTool= new TextTool.dockText();
	  $('#labelTool').on('click',function(e){
		  window.CD.module.view.labelToolClickHandler(e);
	  });
	  
	  $('#frameTool').on('click',function(e){
		  frameTool.createFrame();
		  $('#toolPalette .content #frameTool').removeClass('active');
		  $('#selectTool').addClass('active');
	  });
	  
	  $('#undoTool').on('click',function(){
		  if(undoMng.hasUndo()){
			  undoMng.undo();
		  }
		  updateUndoRedoState(undoMng);
	  });
	  $('#redoTool').on('click',function(){
		  if(undoMng.hasRedo()){
			  undoMng.redo();
		  }
		  updateUndoRedoState(undoMng);
	  });
	  
	  /*text tool*/
	  
	  $("#textTool").on('click',function(e){
		  $(this).data('clicked',true);
		  var layer = cs.getLayer(), eventObj = {};
		  $("canvas").css("cursor","text");
		  layer.on('click',function(e){
			 // baseTxtTool.setTextToolEvent(e);
			  /*only for frame 0*/
				 var canTxt=new TextTool.canvasText(); 
				  canTxt.setTextToolEvent(e);
			  $("canvas").css("cursor","default");
		  });
	  });
	  /*bold tool*/
	  $("#boldTool").on('click',function(e){
		  var et = window.CD.module.data.Json.adminData.ET;
		  if(window.CD.elements.active.type == 'text'|| window.CD.elements.active.type == 'canvastext'){
			  baseTxtTool.clearAlignClicked();
			  allTextStyling.boldActiveText();
		  }else if(window.CD.elements.active.type == 'docktext' || (window.CD.elements.active.type == 'dock' && et == 'PRG')){
			 prgDockTxtTool.clearAlignClicked();
			 prgDockTxtTool.boldActiveText();
			 $(this).data('clicked', true);
		  }else if(window.CD.elements.active.type == 'commonLabelText' || window.CD.elements.active.type == 'label'){
			  var commonText=new TextTool.commonLabelText();
			  commonText.clearAlignClicked();
			  labelTextStyling.boldActiveText();
			  $(this).data('clicked', true);
		  }
		});
	  
	  /*italic tool*/
	  
	  $("#italicsTool").on('click',function(e){
		  var et = window.CD.module.data.Json.adminData.ET;
		  if(window.CD.elements.active.type == 'text'|| window.CD.elements.active.type == 'canvastext'){
			  baseTxtTool.clearAlignClicked();		  
			  allTextStyling.italicActiveText();
		  }else if(window.CD.elements.active.type == 'docktext' || (window.CD.elements.active.type == 'dock' && et == 'PRG')){
				 prgDockTxtTool.clearAlignClicked();
				 prgDockTxtTool.italicActiveText();
				 $(this).data('clicked', true);
		  }else if(window.CD.elements.active.type == 'commonLabelText' || window.CD.elements.active.type == 'label'){
			  var commonText=new TextTool.commonLabelText();
			  commonText.clearAlignClicked();
			  labelTextStyling.italicActiveText();
			  $(this).data('clicked', true);
		  }
		  
		});
	  
	  /*underline tool*/	  
	  $("#UnderlinetTool").on('click',function(e){
		  var et = window.CD.module.data.Json.adminData.ET;
		  if(window.CD.elements.active.type == 'text'|| window.CD.elements.active.type == 'canvastext'){
			  baseTxtTool.clearAlignClicked();		  
			  allTextStyling.underlineActiveText();
		  }else if(window.CD.elements.active.type == 'docktext' || (window.CD.elements.active.type == 'dock' && et == 'PRG' )){
				 prgDockTxtTool.clearAlignClicked();
				 prgDockTxtTool.underlineActiveText();
				 //$(this).data('clicked', true);
		  }else if(window.CD.elements.active.type == 'commonLabelText' || window.CD.elements.active.type == 'label'){
			  var commonText=new TextTool.commonLabelText();
			  commonText.clearAlignClicked();
			  labelTextStyling.underlineActiveText();
			  $(this).data('clicked', true);
		  }
		});

	  /*align tool*/
	  $("#leftAlignTool").on('click',function(e){
		  var activeElm = window.CD.elements.active.element;
		  var et = window.CD.module.data.Json.adminData.ET;
		  if(window.CD.elements.active.type == 'text'|| window.CD.elements.active.type == 'canvastext'){
			  baseTxtTool.clearAlignClicked();
			  $(this).data('clicked', true);
			  //baseTxtTool.alignActiveText();
			  allTextStyling.alignActiveCanvasText(activeElm, 'left');
		  }
		  else if(window.CD.elements.active.type == 'docktext' || (window.CD.elements.active.type == 'dock' && et == 'PRG')){
				 prgDockTxtTool.clearAlignClicked();
				 $(this).data('clicked', true);
				 prgDockTxtTool.alignActiveTextLeft(activeElm,'undoAlign');  
		  }
		  else if(window.CD.elements.active.type == 'commonLabelText' || window.CD.elements.active.type == 'label'){
			  var commonText=new TextTool.commonLabelText();
			   commonText.clearAlignClicked();
			   $(this).data('clicked', true);
			   labelTextStyling.alignActiveCanvasText(activeElm, 'left');
		  }
	  });
	  $("#middleAlignTool").on('click',function(e){
		  var et = window.CD.module.data.Json.adminData.ET;
		  var activeElm = window.CD.elements.active.element;
		  if(window.CD.elements.active.type == 'text'){
			  baseTxtTool.clearAlignClicked();
			  $(this).data('clicked', true);
			  //baseTxtTool.alignActiveText();
			  allTextStyling.alignActiveCanvasText(activeElm, 'center');
		  }if(window.CD.elements.active.type == 'canvastext'){
			  canvasTxtTool.clearAlignClicked();
			  $(this).data('clicked', true);
			  //baseTxtTool.alignActiveText();
			  allTextStyling.alignActiveCanvasText(activeElm, 'center');
		  }else if(window.CD.elements.active.type == 'docktext' || (window.CD.elements.active.type == 'dock' && et == 'PRG')){
				 prgDockTxtTool.clearAlignClicked();
				 $(this).data('clicked', true);
				 prgDockTxtTool.alignActiveTextMiddle(activeElm,'undoAlign');  
		  }
		  else if(window.CD.elements.active.type == 'commonLabelText' || window.CD.elements.active.type == 'label'){
			  var commonText=new TextTool.commonLabelText();
			  commonText.clearAlignClicked();
			  $(this).data('clicked', true);
			  labelTextStyling.alignActiveCanvasText(activeElm, 'center');
		  }
	  });
	  $("#rightAlignTool").on('click',function(e){
		  var et = window.CD.module.data.Json.adminData.ET;
		  var activeElm = window.CD.elements.active.element;
		  if(window.CD.elements.active.type == 'text'|| window.CD.elements.active.type == 'canvastext'){			 
			  baseTxtTool.clearAlignClicked();
			  $(this).data('clicked', true);
			  //baseTxtTool.alignActiveText();
			  allTextStyling.alignActiveCanvasText(activeElm, 'right');
		  }else if(window.CD.elements.active.type == 'docktext' || (window.CD.elements.active.type == 'dock' && et == 'PRG')){
				 prgDockTxtTool.clearAlignClicked();
				 $(this).data('clicked', true);
				 prgDockTxtTool.alignActiveTextRight(activeElm,'undoAlign');  
		  }else if(window.CD.elements.active.type == 'commonLabelText' || window.CD.elements.active.type == 'label'){
			  var commonText=new TextTool.commonLabelText();
			  commonText.clearAlignClicked();
			  $(this).data('clicked', true);
			  labelTextStyling.alignActiveCanvasText(activeElm, 'right');
		  }
	  });
	  $("#justifyAlignTool").on('click',function(e){
		  var et = window.CD.module.data.Json.adminData.ET;
		  var activeElm = window.CD.elements.active.element;
		  if(window.CD.elements.active.type == 'text' || window.CD.elements.active.type == 'canvastext'){
			  baseTxtTool.clearAlignClicked();
			  $(this).data('clicked', true);
			  //baseTxtTool.alignActiveText();
			  allTextStyling.alignActiveCanvasText(activeElm, 'justify');
		  }else if(window.CD.elements.active.type == 'docktext' || (window.CD.elements.active.type == 'dock' && et == 'PRG')){
					 prgDockTxtTool.clearAlignClicked();
					 $(this).data('clicked', true);
					 prgDockTxtTool.alignActiveTextJustify(activeElm,'undoAlign');  
		  }else if(window.CD.elements.active.type == 'commonLabelText' || window.CD.elements.active.type == 'label'){
				  var commonText=new TextTool.commonLabelText();
				  commonText.clearAlignClicked();
				  $(this).data('clicked', true);
				  labelTextStyling.alignActiveCanvasText(activeElm, 'justify');
		  }
	  });	
	  
	  $("#compAlignleftTool").on('click',function(e){
		  var activeElm = window.CD.elements.active.element;
		  var activeElmLength = window.CD.elements.active.element.length;
		  var arrayX = [];
		  var temp;
		  var ds = window.CD.services.ds;
		  var cs = window.CD.services.cs;
		  var cdLayer = cs.getLayer();
		  var undoMng = window.CD.undoManager;
		  if(activeElmLength>1){
			  for(var i=0;i<activeElmLength;i++){
				  arrayX.push(activeElm[i].attrs.x);
			  }
			  for(var i=0;i<activeElmLength;i++){
				for(var j=i+1;j<activeElmLength;j++){
					if(arrayX[i]>arrayX[j]){
						temp=arrayX[i];
						arrayX[i]=arrayX[j];
						arrayX[j]=temp;
					}
				 }
			  }
			  var positionArrayUndo = [];
			  var positionArrayRedo = [];
			  var dockTextXArray = [];
			  /*For Undo*/
			  for(var i=0;i<activeElmLength;i++){
				  positionArrayUndo.push(activeElm[i].attrs.x);
			  }
			  /*For Redo*/
			  for(var i=0;i<activeElmLength;i++){
				  positionArrayRedo.push(arrayX[0]);
			  }
			  
			  
			  for(var i=0;i<activeElmLength;i++){
				  activeElm[i].setX(arrayX[0]);
			  }
			  /*For label*/
			  if(window.CD.elements.active.type == 'label'){
				  for(var i=0;i<activeElmLength;i++){
					  var et = window.CD.module.data.Json.adminData.ET;
					  
					  var etData = et+'Data';
					  if(et == 'PRG'){
						//Use label index as after delete label group id and index are not same
						  var label = window.CD.module.data.getLabelIndex(activeElm[i].getId());//et +'T' +activeElm[i].attrs.id.split('_')[1];
						  window.CD.module.data.Json[etData].PRGLabelData[label].term_pos_x = activeElm[i].getX();
						  window.CD.module.data.Json[etData].PRGLabelData[label].term_pos_y = activeElm[i].getY();
					  }else{
						  //Use label index as after delete label group id and index are not same
						  var label = window.CD.module.data.getLabelIndex(activeElm[i].getId());//et + activeElm[i].attrs.id.split('_')[1];
						  window.CD.module.data.Json[etData][label].holder_x = activeElm[i].getX();
						  window.CD.module.data.Json[etData][label].holder_y = activeElm[i].getY();
					  }					  
					  ds.setOutputData();
				  } 
			  }
			  if(window.CD.elements.active.type == 'dock'){
				  for(var i=0;i<activeElmLength;i++){
					  var et = window.CD.module.data.Json.adminData.ET;
					  if(et == 'CLS'){
						  var etData = et+'CData';
					  }else{
						  var etData = et+'Data';
					  }
					//Use label index as after delete dock group id and index are not same
					  if(et == 'CLS'){
						  var label = window.CD.module.data.getCLSCIndex(activeElm[i].getId());//et + 'C'+ activeElm[i].attrs.id.split('_')[1];
						  window.CD.module.data.Json[etData][label].xpos = activeElm[i].getX();
						  window.CD.module.data.Json[etData][label].ypos = activeElm[i].getY();

							var dockHeadingId = window.CD.module.data.Json.CLSCData[label].dockHeadingId;
							var dockTxtGrp = activeElm[i].parent.parent.get('#'+dockHeadingId)[0];
							var dockWith = activeElm[i].children[0].getWidth();
							if(dockTxtGrp){
								var docktextWidth = dockTxtGrp.children[0].getWidth();
								dockTextXArray.push(dockTxtGrp.getX());
								dockTxtGrp.setX(activeElm[i].getX() - ((docktextWidth - dockWith)/2));
								dockTxtGrp.setY(activeElm[i].getY()-parseInt(dockTxtGrp.children[0].getHeight()));
								var canvasTextTool=new TextTool.canvasText();
								canvasTextTool.setFramTextListData(dockTxtGrp);
								var parentLayer=dockTxtGrp.getLayer();
								if(parentLayer && parentLayer.attrs.id==="text_layer"){
								  	   parentLayer.draw();
								}
								var dockTextXArrayRedo = positionArrayRedo;
							}
							
					  }else if(et == 'PRG'){
						  var label = window.CD.module.data.getDockIndex(activeElm[i].getId());//et + 'S'+ activeElm[i].attrs.id.split('_')[2];
						  window.CD.module.data.Json[etData].PRGDockData[label].PRG_sentence_list_x = activeElm[i].getX();
						  window.CD.module.data.Json[etData].PRGDockData[label].PRG_sentence_list_y = activeElm[i].getY();
					  }else{
						  var label = window.CD.module.data.getLabelIndex("label_" + activeElm[i].attrs.id.split('_')[2]);//et + activeElm[i].attrs.id.split('_')[2];
						  window.CD.module.data.Json[etData][label].doc_x = activeElm[i].getX();
						  window.CD.module.data.Json[etData][label].doc_y = activeElm[i].getY();
					  }
					  ds.setOutputData();
				  } 
			  }
			  if(window.CD.elements.active.type == 'text' || window.CD.elements.active.type == 'canvastext'){ 
				  for(var i=0;i<activeElmLength;i++){
					  var frameIndex = window.CD.elements.active.element[i].attrs.id.split('_')[2];
					  var txtIndex = window.CD.elements.active.element[i].attrs.id.split('_')[1];
					  window.CD.module.data.Json.FrameData[frameIndex].frameTextList[txtIndex].textX = arrayX[0];
				  }
				  ds.setOutputData();
			  }
			  if(window.CD.elements.active.type == 'image'){ 
				  for(var i=0;i<activeElmLength;i++){
					  var frameIndex = window.CD.elements.active.element[i].attrs.id.split('_')[1];
					  var imgIndex = window.CD.elements.active.element[i].attrs.id;
					  window.CD.module.data.Json.FrameData[frameIndex].frameImageList[imgIndex].imageX = arrayX[0];
				  }
				  ds.setOutputData();
			  }
			  if(window.CD.elements.active.type == 'frame'){ 
				  for(var i=0;i<activeElmLength;i++){
					  var frameIndex = window.CD.elements.active.element[i].attrs.id.split('_')[1];
					  window.CD.module.data.Json.FrameData[frameIndex].frameX = arrayX[0];
				  }
				  ds.setOutputData();
			  }
			  
			  activeElm[0].getLayer().draw();
			  undoMng.register(this,toggleAlignment,[activeElm,positionArrayUndo,dockTextXArray,window.CD.elements.active.type],'Undo Align Left',this,toggleAlignment,[activeElm,positionArrayRedo,dockTextXArrayRedo,window.CD.elements.active.type],'Redo Align Left')
			  updateUndoRedoState(undoMng); 
		  }

	  });
	  $("#compAligncenterTool").on('click',function(e){
		  var activeElm = window.CD.elements.active.element;
		  var activeElmLength = window.CD.elements.active.element.length;
		  var arrayX = [];
		  var temp;
		  var ds = window.CD.services.ds;
		  var cs = window.CD.services.cs;
		  var cdLayer = cs.getLayer();
		  var activeElmWidth = [];
		  var activeElmRightX = [];
		  var middleX;
		  var extraX = [];
		  var tempArr = [];
		  if(activeElmLength>1){
			  for(var i=0;i<activeElmLength;i++){
				  arrayX.push(activeElm[i].attrs.x);
				  activeElmWidth.push(activeElm[i].children[0].attrs.width);
			  }
			  
			 
			  for(var i=0;i<activeElmLength;i++){
				  activeElmRightX.push((activeElmWidth[i] + arrayX[i]));
			  }
			  for(var i=0;i<activeElmLength;i++){
				for(var j=i+1;j<activeElmLength;j++){
					if(activeElmRightX[i]>activeElmRightX[j]){
						temp=activeElmRightX[i];
						activeElmRightX[i]=activeElmRightX[j];
						activeElmRightX[j]=temp;
					}
					if(arrayX[i]<arrayX[j]){
						temp=arrayX[i];
						arrayX[i]=arrayX[j];
						arrayX[j]=temp;
					}
				 }
			  }
			  
			  middleX = (activeElmRightX[activeElmLength-1] + arrayX[activeElmLength-1])/2;
			  arrayX =[];
			  for(var i=0;i<activeElmLength;i++){
				  arrayX.push(middleX - (activeElmWidth[i]/2));
			  }
			  var positionArrayUndo = [];
			  var positionArrayRedo = [];
			  var dockTextXArray = [];
			  var dockTextXArrayRedo = [];
			  /*For Undo*/
			  for(var i=0;i<activeElmLength;i++){
				  positionArrayUndo.push(activeElm[i].attrs.x); //for undo
				  positionArrayRedo.push(arrayX[i]); //for redo
				  activeElm[i].setX(arrayX[i]); // for set possition
			  }
			 
			  /*For label*/
			  if(window.CD.elements.active.type == 'label'){
				  for(var i=0;i<activeElmLength;i++){
					  var et = window.CD.module.data.Json.adminData.ET;
					  
					  var etData = et+'Data';
					  if(et == 'PRG'){
						//Use label index as after delete label group id and index are not same
						  var label = window.CD.module.data.getLabelIndex(activeElm[i].getId());//et +'T' +activeElm[i].attrs.id.split('_')[1];
						  window.CD.module.data.Json[etData].PRGLabelData[label].term_pos_x = activeElm[i].getX();
						  window.CD.module.data.Json[etData].PRGLabelData[label].term_pos_y = activeElm[i].getY();
					  }else{
						//Use label index as after delete label group id and index are not same
						  var label = window.CD.module.data.getLabelIndex(activeElm[i].getId());//et + activeElm[i].attrs.id.split('_')[1];
						  window.CD.module.data.Json[etData][label].holder_x = activeElm[i].getX();
						  window.CD.module.data.Json[etData][label].holder_y = activeElm[i].getY();
					  }					  
					  ds.setOutputData();
				  } 
			  }
			  if(window.CD.elements.active.type == 'dock'){
				  for(var i=0;i<activeElmLength;i++){
					  var et = window.CD.module.data.Json.adminData.ET;
					  if(et == 'CLS'){
						  var etData = et+'CData';
					  }else{
						  var etData = et+'Data';
					  }
					//Use label index as after delete dock group id and index are not same
					  if(et == 'CLS'){
						  var label = window.CD.module.data.getCLSCIndex(activeElm[i].getId());//et + 'C'+ activeElm[i].attrs.id.split('_')[1];
						  window.CD.module.data.Json[etData][label].xpos = activeElm[i].getX();
						  window.CD.module.data.Json[etData][label].ypos = activeElm[i].getY();

							var dockHeadingId = window.CD.module.data.Json.CLSCData[label].dockHeadingId;
							var dockTxtGrp = activeElm[i].parent.parent.get('#'+dockHeadingId)[0];
							var dockWith = activeElm[i].children[0].getWidth();
							if(dockTxtGrp){
								var docktextWidth = dockTxtGrp.children[0].getWidth();
								dockTextXArray.push(dockTxtGrp.getX());
								dockTxtGrp.setX(activeElm[i].getX() - ((docktextWidth - dockWith)/2));
								dockTxtGrp.setY(activeElm[i].getY()-parseInt(dockTxtGrp.children[0].getHeight()));
								var canvasTextTool=new TextTool.canvasText();
								canvasTextTool.setFramTextListData(dockTxtGrp);
								var parentLayer=dockTxtGrp.getLayer();
								if(parentLayer && parentLayer.attrs.id==="text_layer"){
								  	   parentLayer.draw();
								}
								dockTextXArrayRedo = positionArrayRedo;
							}
							
					  }else if(et == 'PRG'){
						  var label = window.CD.module.data.getDockIndex(activeElm[i].getId());//et + 'S'+ activeElm[i].attrs.id.split('_')[2];
						  window.CD.module.data.Json[etData].PRGDockData[label].PRG_sentence_list_x = activeElm[i].getX();
						  window.CD.module.data.Json[etData].PRGDockData[label].PRG_sentence_list_y = activeElm[i].getY();
					  }else{
						  var label = window.CD.module.data.getLabelIndex("label_" + activeElm[i].attrs.id.split('_')[2]);//et + activeElm[i].attrs.id.split('_')[2];
						  window.CD.module.data.Json[etData][label].doc_x = activeElm[i].getX();
						  window.CD.module.data.Json[etData][label].doc_y = activeElm[i].getY();
					  }
					  ds.setOutputData();
				  } 
			  }
			  if(window.CD.elements.active.type == 'text' || window.CD.elements.active.type == 'canvastext'){ 
				  for(var i=0;i<activeElmLength;i++){
					  var frameIndex = window.CD.elements.active.element[i].attrs.id.split('_')[2];
					  var txtIndex = window.CD.elements.active.element[i].attrs.id.split('_')[1];
					  window.CD.module.data.Json.FrameData[frameIndex].frameTextList[txtIndex].textX = arrayX[i];
				  }
				  ds.setOutputData();
			  }
			  if(window.CD.elements.active.type == 'image'){ 
				  for(var i=0;i<activeElmLength;i++){
					  var frameIndex = window.CD.elements.active.element[i].attrs.id.split('_')[1];
					  var imgIndex = window.CD.elements.active.element[i].attrs.id;
					  window.CD.module.data.Json.FrameData[frameIndex].frameImageList[imgIndex].imageX = arrayX[i];
				  }
				  ds.setOutputData();
			  }
			  if(window.CD.elements.active.type == 'frame'){ 
				  for(var i=0;i<activeElmLength;i++){
					  var frameIndex = window.CD.elements.active.element[i].attrs.id.split('_')[1];
					  window.CD.module.data.Json.FrameData[frameIndex].frameX = arrayX[i];
				  }
				  ds.setOutputData();
			  }
			  
			  activeElm[0].getLayer().draw();
			  undoMng.register(this,toggleAlignment,[activeElm,positionArrayUndo,dockTextXArray,window.CD.elements.active.type],'Undo Align Left',this,toggleAlignment,[activeElm,positionArrayRedo,dockTextXArrayRedo,window.CD.elements.active.type],'Redo Align Left')
			  updateUndoRedoState(undoMng); 
		  }
	  });
	  $("#compAlignrightTool").on('click',function(e){

		  var activeElm = window.CD.elements.active.element;
		  var activeElmLength = window.CD.elements.active.element.length;
		  var arrayX = [];
		  var temp;
		  var ds = window.CD.services.ds;
		  var cs = window.CD.services.cs;
		  var cdLayer = cs.getLayer();
		  var activeElmWidth = [];
		  var activeElmRightX = [];
		  var lastY;
		  var extraX = [];
		  var tempArr = [];
		  if(activeElmLength>1){
			  for(var i=0;i<activeElmLength;i++){
				  arrayX.push(activeElm[i].attrs.x);
			  }
			  
			  for(var i=0;i<activeElmLength;i++){
				  activeElmWidth.push(activeElm[i].children[0].attrs.width);
			  }
			  for(var i=0;i<activeElmLength;i++){
				  activeElmRightX.push((activeElmWidth[i] + arrayX[i]));
			  }
			  for(var i=0;i<activeElmLength;i++){
				  tempArr.push(activeElmRightX[i]);
			  }
			  for(var i=0;i<activeElmLength;i++){
				for(var j=i+1;j<activeElmLength;j++){
					if(activeElmRightX[i]>activeElmRightX[j]){
						temp=activeElmRightX[i];
						activeElmRightX[i]=activeElmRightX[j];
						activeElmRightX[j]=temp;
					}
				 }
			  }
			  lastY = activeElmRightX[activeElmLength-1];
			  for(var i=0;i<activeElmLength;i++){
				  extraX.push((lastY - tempArr[i]));
			  }
			  
			  for(var i=0;i<activeElmLength;i++){
				  arrayX[i] = ((arrayX[i] + extraX[i]));
			  }
			  var positionArrayUndo = [];
			  var positionArrayRedo = [];
			  var dockTextXArray = [];
			  var dockTextXArrayRedo = [];
			  /*For Undo*/
			  for(var i=0;i<activeElmLength;i++){
				  positionArrayUndo.push(activeElm[i].attrs.x);
			  }
			  /*For Redo*/
			  for(var i=0;i<activeElmLength;i++){
				  positionArrayRedo.push(arrayX[i]);
			  }
 
			  
			  for(var i=0;i<activeElmLength;i++){
				  activeElm[i].setX(arrayX[i]);
			  }
			  /*For label*/
			  if(window.CD.elements.active.type == 'label'){
				  for(var i=0;i<activeElmLength;i++){
					  var et = window.CD.module.data.Json.adminData.ET;
					  
					  var etData = et+'Data';
					  if(et == 'PRG'){
						  //Use label index as after delete label group id and index are not same
						  var label = window.CD.module.data.getLabelIndex(activeElm[i].getId());//et +'T' +activeElm[i].attrs.id.split('_')[1];
						  window.CD.module.data.Json[etData].PRGLabelData[label].term_pos_x = activeElm[i].getX();
						  window.CD.module.data.Json[etData].PRGLabelData[label].term_pos_y = activeElm[i].getY();
					  }else{
						  //Use label index as after delete label group id and index are not same
						  var label = window.CD.module.data.getLabelIndex(activeElm[i].getId());//et + activeElm[i].attrs.id.split('_')[1];
						  window.CD.module.data.Json[etData][label].holder_x = activeElm[i].getX();
						  window.CD.module.data.Json[etData][label].holder_y = activeElm[i].getY();
					  }					  
					  ds.setOutputData();
				  } 
			  }
			  if(window.CD.elements.active.type == 'dock'){
				  for(var i=0;i<activeElmLength;i++){
					  var et = window.CD.module.data.Json.adminData.ET;
					  if(et == 'CLS'){
						  var etData = et+'CData';
					  }else{
						  var etData = et+'Data';
					  }
					  if(et == 'CLS'){
						  var label = window.CD.module.data.getCLSCIndex(activeElm[i].getId());//et + 'C'+ activeElm[i].attrs.id.split('_')[1];
						  window.CD.module.data.Json[etData][label].xpos = activeElm[i].getX();
						  window.CD.module.data.Json[etData][label].ypos = activeElm[i].getY();

							var dockHeadingId = window.CD.module.data.Json.CLSCData[label].dockHeadingId;
							var dockTxtGrp = activeElm[i].parent.parent.get('#'+dockHeadingId)[0];
							var dockWith = activeElm[i].children[0].getWidth();
							if(dockTxtGrp){
								var docktextWidth = dockTxtGrp.children[0].getWidth();
								dockTextXArray.push(dockTxtGrp.getX());
								dockTxtGrp.setX(activeElm[i].getX() - ((docktextWidth - dockWith)/2));
								dockTxtGrp.setY(activeElm[i].getY()-parseInt(dockTxtGrp.children[0].getHeight()));
								var canvasTextTool=new TextTool.canvasText();
								canvasTextTool.setFramTextListData(dockTxtGrp);
								var parentLayer=dockTxtGrp.getLayer();
								if(parentLayer && parentLayer.attrs.id==="text_layer"){
								  	   parentLayer.draw();
								}
								dockTextXArrayRedo = positionArrayRedo;
							}
							
					  }else if(et == 'PRG'){
						  var label = window.CD.module.data.getDockIndex(activeElm[i].getId());//et + 'S'+ activeElm[i].attrs.id.split('_')[2];
						  window.CD.module.data.Json[etData].PRGDockData[label].PRG_sentence_list_x = activeElm[i].getX();
						  window.CD.module.data.Json[etData].PRGDockData[label].PRG_sentence_list_y = activeElm[i].getY();
					  }else{
						  var label = window.CD.module.data.getLabelIndex("label_" + activeElm[i].attrs.id.split('_')[2]);//et + activeElm[i].attrs.id.split('_')[2];
						  window.CD.module.data.Json[etData][label].doc_x = activeElm[i].getX();
						  window.CD.module.data.Json[etData][label].doc_y = activeElm[i].getY();
					  }
					  ds.setOutputData();
				  } 
			  }
			  if(window.CD.elements.active.type == 'text' || window.CD.elements.active.type == 'canvastext'){ 
				  for(var i=0;i<activeElmLength;i++){
					  var frameIndex = window.CD.elements.active.element[i].attrs.id.split('_')[2];
					  var txtIndex = window.CD.elements.active.element[i].attrs.id.split('_')[1];
					  window.CD.module.data.Json.FrameData[frameIndex].frameTextList[txtIndex].textX = arrayX[i];
				  }
				  ds.setOutputData();
			  }
			  if(window.CD.elements.active.type == 'image'){ 
				  for(var i=0;i<activeElmLength;i++){
					  var frameIndex = window.CD.elements.active.element[i].attrs.id.split('_')[1];
					  var imgIndex = window.CD.elements.active.element[i].attrs.id;
					  window.CD.module.data.Json.FrameData[frameIndex].frameImageList[imgIndex].imageX = arrayX[i];
				  }
				  ds.setOutputData();
			  }
			  if(window.CD.elements.active.type == 'frame'){ 
				  for(var i=0;i<activeElmLength;i++){
					  var frameIndex = window.CD.elements.active.element[i].attrs.id.split('_')[1];
					  window.CD.module.data.Json.FrameData[frameIndex].frameX = arrayX[i];
				  }
				  ds.setOutputData();
			  }
			  
			  activeElm[0].getLayer().draw();
			  undoMng.register(this,toggleAlignment,[activeElm,positionArrayUndo,dockTextXArray,window.CD.elements.active.type],'Undo Align Left',this,toggleAlignment,[activeElm,positionArrayRedo,dockTextXArrayRedo,window.CD.elements.active.type],'Redo Align Left')
			  updateUndoRedoState(undoMng); 
		  }
	  });
	  $("#backTool").on('click',function(e){
		  if(window.CD.elements.active.type == 'text'|| window.CD.elements.active.type == 'canvastext'){
			  var activeElement = window.CD.elements.active.element[0];
			  moveToBottomAll(activeElement,window.CD.elements.active.type);
			  window.CD.module.frame.setTxtZindex(activeElement);
			  activeElement.getLayer().draw();
		  }else if(window.CD.elements.active.type == 'label' || window.CD.elements.active.type == 'dock'){
			  if(window.CD.module.data.Json.adminData.ET == 'SLE'){
				  if(window.CD.elements.active.type == 'dock'){
					  var id = window.CD.elements.active.element[0].attrs.id.split('_')[2];
					  var labelId = 'label_'+id;
					  var activeElement = window.CD.elements.active.element[0].parent.get('#'+labelId)[0];
				  }else{
					  var activeElement = window.CD.elements.active.element[0];
				  }
			  }else{
				  var activeElement = window.CD.elements.active.element[0];
			  }
			  var et = window.CD.module.data.Json.adminData.ET;
			  if(et == 'SLE' || et == 'COI'){
				  moveToBottomLabel(activeElement);
			  }else if(et == 'PRG'){
				  if(window.CD.elements.active.type == 'label'){
					  moveToBottomLabel(activeElement);
				  }
			  }else{
				  if(window.CD.elements.active.type == 'label'){
					  moveToBottomLabel(activeElement);
				  }else{
					  moveToBottomAll(activeElement,window.CD.elements.active.type);
				  }
			  }
			  
			  
			  window.CD.module.data.setZindex(activeElement);
			  activeElement.getLayer().draw();
		  }else if(window.CD.elements.active.type == 'image'){
			  var activeElement = window.CD.elements.active.element[0];
			  moveToBottomAll(activeElement,window.CD.elements.active.type);
			  window.CD.module.frame.setImgZindex(activeElement);
			  activeElement.getLayer().draw();
		  }else if(window.CD.elements.active.type == 'frame'){
			  var activeElement = window.CD.elements.active.element[0];
			  if(activeElement.attrs.id != 'frame_0'){
				  moveToBottomAll(activeElement,window.CD.elements.active.type);
				  window.CD.module.frame.setFrameZindex(activeElement);
				  activeElement.getLayer().draw();
			  }
		  } 
		  window.CD.module.view.attachPublishEvents();
		  window.CD.services.ds.setOutputData();
		});
	  
	  $("#frontTool").on('click',function(e){
		  if(window.CD.elements.active.type == 'text'|| window.CD.elements.active.type == 'canvastext'){
			  var activeElement = window.CD.elements.active.element[0];
			  moveToTopAll(activeElement,window.CD.elements.active.type);
			  window.CD.module.frame.setTxtZindex(activeElement);
			  activeElement.getLayer().draw();
		  }else if(window.CD.elements.active.type == 'label' || window.CD.elements.active.type == 'dock'){
			  if(window.CD.module.data.Json.adminData.ET == 'SLE'){
				  if(window.CD.elements.active.type == 'dock'){
					  var id = window.CD.elements.active.element[0].attrs.id.split('_')[2];
					  var labelId = 'label_'+id;
					  var activeElement = window.CD.elements.active.element[0].parent.get('#'+labelId)[0];
				  }else{
					  var activeElement = window.CD.elements.active.element[0];
				  }
			  }else{
				  var activeElement = window.CD.elements.active.element[0];
			  }
			  var et = window.CD.module.data.Json.adminData.ET;
			  if(et == 'SLE' || et == 'COI'){
				  moveToTopLabel(activeElement);
			  }else if(et == 'PRG'){
				  if(window.CD.elements.active.type == 'label'){
					  moveToTopLabel(activeElement);
				  }
			  }else{
				  if(window.CD.elements.active.type == 'label'){
					  moveToTopLabel(activeElement);
				  }else{
					  moveToTopAll(activeElement,window.CD.elements.active.type);
				  }
			  }
			  moveToTopLabel(activeElement);
			  window.CD.module.data.setZindex(activeElement);
			  activeElement.getLayer().draw();
		  }else if(window.CD.elements.active.type == 'image'){
			  var activeElement = window.CD.elements.active.element[0];
			  moveToTopAll(activeElement,window.CD.elements.active.type);
			  window.CD.module.frame.setImgZindex(activeElement);
			  activeElement.getLayer().draw();
		  }else if(window.CD.elements.active.type == 'frame'){
			  var activeElement = window.CD.elements.active.element[0];
			  if(activeElement.attrs.id != 'frame_0'){
				  moveToTopAll(activeElement,window.CD.elements.active.type);
				  window.CD.module.frame.setFrameZindex(activeElement);
				  activeElement.getLayer().draw();
			  }
		  }
		  window.CD.module.view.attachPublishEvents();
		  window.CD.services.ds.setOutputData();
		});
	  

	  toggleAlignment = function(activeElm,positionArray,dockTextXArray,type){
		  var activeElmLength = activeElm.length;
		  if(dockTextXArray == undefined){
			  dockTextXArray = [];
		  }
		  for(var i=0;i<activeElmLength;i++){
			  activeElm[i].setX(positionArray[i]);
			  if(dockTextXArray.length>0){
				  var label = 'CLSC'+ activeElm[i].attrs.id.split('_')[1];
				  var dockHeadingId = window.CD.module.data.Json.CLSCData[label].dockHeadingId;
					var dockTxtGrp = activeElm[i].parent.parent.get('#'+dockHeadingId)[0];
					var dockWith = activeElm[i].children[0].getWidth();
					var docktextWidth = dockTxtGrp.children[0].getWidth();
					dockTxtGrp.setX(activeElm[i].getX() - ((docktextWidth - dockWith)/2));
					dockTxtGrp.setY(activeElm[i].getY()-parseInt(dockTxtGrp.children[0].getHeight()));
					var canvasTextTool=new TextTool.canvasText();
					canvasTextTool.setFramTextListData(dockTxtGrp);
					var parentLayer=dockTxtGrp.getLayer();
					if(parentLayer && parentLayer.attrs.id==="text_layer"){
					  	   parentLayer.draw();
					}  
			  }
		  }
		
		  activeElm[0].getLayer().draw();
		  
		  
		  if(type == 'label'){
			  for(var i=0;i<activeElmLength;i++){
				  var et = window.CD.module.data.Json.adminData.ET;
				  var etData = et+'Data';
				  if(et == 'PRG'){
					  var label = et +'T' +activeElm[i].attrs.id.split('_')[1];
					  window.CD.module.data.Json[etData].PRGLabelData[label].term_pos_x = activeElm[i].getX();
					  window.CD.module.data.Json[etData].PRGLabelData[label].term_pos_y = activeElm[i].getY();
				  }else{
					  var label = et + activeElm[i].attrs.id.split('_')[1];
					  window.CD.module.data.Json[etData][label].holder_x = activeElm[i].getX();
					  window.CD.module.data.Json[etData][label].holder_y = activeElm[i].getY();
				  }					  
				  ds.setOutputData();
			  } 
		  }
		  if(type == 'dock'){
			  for(var i=0;i<activeElmLength;i++){
				  var et = window.CD.module.data.Json.adminData.ET;
				  if(et == 'CLS'){
					  var etData = et+'CData';
				  }else{
					  var etData = et+'Data';
				  }
				  if(et == 'CLS'){
					  var label = et + 'C'+ activeElm[i].attrs.id.split('_')[1];
					  window.CD.module.data.Json[etData][label].xpos = activeElm[i].getX();
					  window.CD.module.data.Json[etData][label].ypos = activeElm[i].getY();
				  }else if(et == 'PRG'){
					  var label = et + 'S'+ activeElm[i].attrs.id.split('_')[2];
					  window.CD.module.data.Json[etData].PRGDockData[label].PRG_sentence_list_x = activeElm[i].getX();
					  window.CD.module.data.Json[etData].PRGDockData[label].PRG_sentence_list_y = activeElm[i].getY();
				  }else{
					  var label = window.CD.module.data.getLabelIndex("label_" + activeElm[i].attrs.id.split('_')[2]);;
					  window.CD.module.data.Json[etData][label].doc_x = activeElm[i].getX();
					  window.CD.module.data.Json[etData][label].doc_y = activeElm[i].getY();
				  }
				  ds.setOutputData();
			  } 
		  }
		  if(type == 'text' || type == 'canvastext'){ 
			  for(var i=0;i<activeElmLength;i++){
				  var frameIndex = activeElm[i].attrs.id.split('_')[2];
				  var txtIndex = activeElm[i].attrs.id.split('_')[1];
				  window.CD.module.data.Json.FrameData[frameIndex].frameTextList[txtIndex].textX = positionArray[i];
			  }
			  ds.setOutputData();
		  }
		  if(type == 'image'){ 
			  for(var i=0;i<activeElmLength;i++){
				  var frameIndex = activeElm[i].attrs.id.split('_')[1];
				  var imgIndex = activeElm[i].attrs.id;
				  window.CD.module.data.Json.FrameData[frameIndex].frameImageList[imgIndex].imageX = positionArray[i];
			  }
			  ds.setOutputData();
		  }
		  if(type == 'frame'){ 
			  for(var i=0;i<activeElmLength;i++){
				  var frameIndex = activeElm[i].attrs.id.split('_')[1];
				  window.CD.module.data.Json.FrameData[frameIndex].frameX = positionArray[i];
			  }
			  ds.setOutputData();
		  }
	  }
	  
	  moveToTopAll = function(activeElement,type){
		  var parentObj = activeElement.parent;
		  var zIndexObj = {};
		  var zindexArr = [];
		  if(type == 'image'){
			  var elmType = 'img';
		  }else if(type == 'frame'){
			  var elmType = 'frame';
		  }else if((type == 'text')||(type == 'canvastext')){
			  var elmType = 'txt';
		  }else if(type == 'dock'){
			  var elmType = 'dock';
		  }
		  for(var i=0;i<parentObj.children.length;i++){
			  if(parentObj.children[i].attrs.id){
					  if((parentObj.children[i].attrs.id.split('_')[0] == elmType)){
						  var id = parentObj.children[i].attrs.id;
						  var zIndex = parentObj.children[i].getZIndex();
						  if(id != 'frame_0'){
							  zIndexObj[id] = zIndex;
							  zindexArr.push(zIndex);
						  }
					  }				  
			  }
		  }	
		  var tempObj = {};
		  var activeElmZIndex = activeElement.getZIndex();
		  var temp;
		  var temp1;
		  var temp2;
		  for(var i=0;i<zindexArr.length;i++){
				for(var j=i+1;j<zindexArr.length;j++){
					if(zindexArr[i]>zindexArr[j]){
						temp1=zindexArr[i];
						zindexArr[i]=zindexArr[j];
						zindexArr[j]=temp1;
					}
				}
		  }
		  
		  for(var k=0;k<zindexArr.length;k++){
			  for(key in zIndexObj){
				  if(zindexArr[k]==zIndexObj[key]){
					  tempObj[key]=zindexArr[k];
				  }
			  }			 
		  }
		  var flag=true;
		  var tempArr1 = [];
		  for(var l=0;l<(zindexArr.length);l++){
			  tempArr1.push(zindexArr[l]);
		  }
		  for(var i=0;i<zindexArr.length;i++){
			  if(flag==true){
				  if(zindexArr[i] == activeElmZIndex){
					  temp = zindexArr[i];
					  temp2 = zindexArr[(zindexArr.length-1)];
					  for(var j=i;j<(zindexArr.length-1);j++){
						 
						  zindexArr[j+1] = tempArr1[j];					  
					  }
					  zindexArr[i]=temp2;
					  //zindexArr[(zindexArr.length-1)]=temp;
					  flag = false;
				  }
			  }
			  	  
		  }
		 var count = 0;
		 for(key in tempObj){
			 tempObj[key]=zindexArr[count];
			 count++;
		 }
		 var a = tempObj;
		 for(var key in tempObj){
			 for(var m=0;m<(parentObj.children.length-1);m++){
				 if(parentObj.children[m]){
					 if(key == parentObj.children[m].attrs.id){
						 parentObj.children[m].setZIndex(tempObj[key]);
					 }
				  }
			  } 
		 } 
	  };
	  
	  
	  moveToBottomAll = function(activeElement,type){
		  var parentObj = activeElement.parent;
		  var zIndexObj = {};
		  var zindexArr = [];
		  if(type == 'image'){
			  var elmType = 'img';
		  }else if(type == 'frame'){
			  var elmType = 'frame';
		  }else if((type == 'text')||(type == 'canvastext')){
			  var elmType = 'txt';
		  }else if(type == 'dock'){
			  var elmType = 'dock';
		  }
		  for(var i=0;i<parentObj.children.length;i++){
			  if(parentObj.children[i].attrs.id){
					  if((parentObj.children[i].attrs.id.split('_')[0] == elmType)){
						  var id = parentObj.children[i].attrs.id;
						  var zIndex = parentObj.children[i].getZIndex();
						  if(id != 'frame_0'){
							  zIndexObj[id] = zIndex;
							  zindexArr.push(zIndex);
						  }
					  }			  
			  }
		  }	
		  var tempObj = {};
		  var activeElmZIndex = activeElement.getZIndex();
		  var temp;
		  var temp1;
		  var temp2;
		  for(var i=0;i<zindexArr.length;i++){
				for(var j=i+1;j<zindexArr.length;j++){
					if(zindexArr[i]>zindexArr[j]){
						temp1=zindexArr[i];
						zindexArr[i]=zindexArr[j];
						zindexArr[j]=temp1;
					}
				}
		  }
		  
		  for(var k=0;k<zindexArr.length;k++){
			  for(key in zIndexObj){
				  if(zindexArr[k]==zIndexObj[key]){
					  tempObj[key]=zindexArr[k];
				  }
			  }			 
		  }
		  var flag=true;
		  var tempArr2 = [];
		  for(var l=0;l<(zindexArr.length);l++){
			  tempArr2.push(zindexArr[l]);
		  }
		  for(var i=0;i<zindexArr.length;i++){
			  if(flag==true){
				  if(zindexArr[i] == activeElmZIndex){
					  temp = zindexArr[i];
					  temp2 = zindexArr[0];
					  for(var j=i;j>=0;j--){
						 
						  zindexArr[j-1] = tempArr2[j];					  
					  }
					  zindexArr[i]=temp2;
					  //zindexArr[(zindexArr.length-1)]=temp;
					  flag = false;
				  }
			  }
			  	  
		  }
		 var count = 0;
		 for(key in tempObj){
			 tempObj[key]=zindexArr[count];
			 count++;
		 }
		 var a = tempObj;
		 for(var key in tempObj){
			 for(var m=0;m<(parentObj.children.length-1);m++){
				 if(parentObj.children[m]){
					 if(key == parentObj.children[m].attrs.id){
						 parentObj.children[m].setZIndex(tempObj[key]);
					 }
				  }
			  } 
		 } 
	  };
	  
	  
	  
	  
	  
	  moveToBottomLabel = function(activeElement){
		  var parentObj = activeElement.parent;
		  var zIndexObj = {};
		  var zindexArr = [];
		  for(var i=0;i<parentObj.children.length;i++){
			  if(parentObj.children[i].attrs.id){
				  if((parentObj.children[i].attrs.id.split('_')[0] == 'label')){
					  var id = parentObj.children[i].attrs.id;
					  var zIndex = parentObj.children[i].getZIndex();
					  zIndexObj[id] = zIndex;
					  zindexArr.push(zIndex);
				  }
			  }
		  }	
		  var tempObj = {};
		  var activeElmZIndex = activeElement.getZIndex();
		  var temp;
		  var temp1;
		  var temp2;
		  for(var i=0;i<zindexArr.length;i++){
				for(var j=i+1;j<zindexArr.length;j++){
					if(zindexArr[i]>zindexArr[j]){
						temp1=zindexArr[i];
						zindexArr[i]=zindexArr[j];
						zindexArr[j]=temp1;
					}
				}
		  }
		  
		  for(var k=0;k<zindexArr.length;k++){
			  for(key in zIndexObj){
				  if(zindexArr[k]==zIndexObj[key]){
					  tempObj[key]=zindexArr[k];
				  }
			  }			 
		  }
		  var flag=true;
		  var tempArr2 = [];
		  for(var l=0;l<(zindexArr.length);l++){
			  tempArr2.push(zindexArr[l]);
		  }
		  for(var i=0;i<zindexArr.length;i++){
			  if(flag==true){
				  if(zindexArr[i] == activeElmZIndex){
					  temp = zindexArr[i];
					  temp2 = zindexArr[0];
					  for(var j=i;j>=0;j--){
						 
						  zindexArr[j-1] = tempArr2[j];					  
					  }
					  zindexArr[i]=temp2;
					  //zindexArr[(zindexArr.length-1)]=temp;
					  flag = false;
				  }
			  }
			  	  
		  }
		 var count = 0;
		 for(key in tempObj){
			 tempObj[key]=zindexArr[count];
			 count++;
		 }
		 var a = tempObj;
		 for(var key in tempObj){
			 for(var m=0;m<(parentObj.children.length-1);m++){
				 if(parentObj.children[m]){
					 if(key == parentObj.children[m].attrs.id){
						 parentObj.children[m].setZIndex(tempObj[key]);
					 }
				  }
			  } 
		 } 
		 if(window.CD.module.data.Json.adminData.ET == 'SLE'){
			 moveToBottomDock(activeElement);
		 }
	  };
	  moveToBottomDock = function(activeElement){

		  var id = activeElement.attrs.id;
		  var dockObjId = 'dock_'+id;
		  var dockActiveElement = activeElement.parent.get('#'+dockObjId)[0];
		  var parentObj = dockActiveElement.parent;
		  var zIndexObj = {};
		  var zindexArr = [];
		  for(var i=0;i<parentObj.children.length;i++){
			  if(parentObj.children[i].attrs.id){
				  if((parentObj.children[i].attrs.id.split('_')[0] == 'dock')){
					  var id = parentObj.children[i].attrs.id;
					  var zIndex = parentObj.children[i].getZIndex();
					  zIndexObj[id] = zIndex;
					  zindexArr.push(zIndex);
				  }
			  }
		  }	
		  var tempObj = {};
		  var activeElmZIndex = dockActiveElement.getZIndex();
		  var temp;
		  var temp1;
		  var temp2;
		  for(var i=0;i<zindexArr.length;i++){
				for(var j=i+1;j<zindexArr.length;j++){
					if(zindexArr[i]>zindexArr[j]){
						temp1=zindexArr[i];
						zindexArr[i]=zindexArr[j];
						zindexArr[j]=temp1;
					}
				}
		  }
		  
		  for(var k=0;k<zindexArr.length;k++){
			  for(key in zIndexObj){
				  if(zindexArr[k]==zIndexObj[key]){
					  tempObj[key]=zindexArr[k];
				  }
			  }			 
		  }
		  var flag=true;
		  var tempArr2 = [];
		  for(var l=0;l<(zindexArr.length);l++){
			  tempArr2.push(zindexArr[l]);
		  }
		  for(var i=0;i<zindexArr.length;i++){
			  if(flag==true){
				  if(zindexArr[i] == activeElmZIndex){
					  temp = zindexArr[i];
					  temp2 = zindexArr[0];
					  for(var j=i;j>=0;j--){
						 
						  zindexArr[j-1] = tempArr2[j];					  
					  }
					  zindexArr[i]=temp2;
					  //zindexArr[(zindexArr.length-1)]=temp;
					  flag = false;
				  }
			  }
			  	  
		  }
		 var count = 0;
		 for(key in tempObj){
			 tempObj[key]=zindexArr[count];
			 count++;
		 }
		 var a = tempObj;
		 for(var key in tempObj){
			 for(var m=0;m<(parentObj.children.length-1);m++){
				 if(parentObj.children[m]){
					 if(key == parentObj.children[m].attrs.id){
						 parentObj.children[m].setZIndex(tempObj[key]);
					 }
				  }
			  } 
		 } 	  
	  }
	  
	  
	  
	  moveToTopLabel = function(activeElement){
		  var parentObj = activeElement.parent;
		  var zIndexObj = {};
		  var zindexArr = [];
		  for(var i=0;i<parentObj.children.length;i++){
			  if(parentObj.children[i].attrs.id){
				  if((parentObj.children[i].attrs.id.split('_')[0] == 'label')){
					  var id = parentObj.children[i].attrs.id;
					  var zIndex = parentObj.children[i].getZIndex();
					  zIndexObj[id] = zIndex;
					  zindexArr.push(zIndex);
				  }
			  }
		  }	
		  var tempObj = {};
		  var activeElmZIndex = activeElement.getZIndex();
		  var temp;
		  var temp1;
		  var temp2;
		  for(var i=0;i<zindexArr.length;i++){
				for(var j=i+1;j<zindexArr.length;j++){
					if(zindexArr[i]>zindexArr[j]){
						temp1=zindexArr[i];
						zindexArr[i]=zindexArr[j];
						zindexArr[j]=temp1;
					}
				}
		  }
		  
		  for(var k=0;k<zindexArr.length;k++){
			  for(key in zIndexObj){
				  if(zindexArr[k]==zIndexObj[key]){
					  tempObj[key]=zindexArr[k];
				  }
			  }			 
		  }
		  var flag=true;
		  var tempArr1 = [];
		  for(var l=0;l<(zindexArr.length);l++){
			  tempArr1.push(zindexArr[l]);
		  }
		  for(var i=0;i<zindexArr.length;i++){
			  if(flag==true){
				  if(zindexArr[i] == activeElmZIndex){
					  temp = zindexArr[i];
					  temp2 = zindexArr[(zindexArr.length-1)];
					  for(var j=i;j<(zindexArr.length-1);j++){
						 
						  zindexArr[j+1] = tempArr1[j];					  
					  }
					  zindexArr[i]=temp2;
					  //zindexArr[(zindexArr.length-1)]=temp;
					  flag = false;
				  }
			  }
			  	  
		  }
		 var count = 0;
		 for(key in tempObj){
			 tempObj[key]=zindexArr[count];
			 count++;
		 }
		 var a = tempObj;
		 for(var key in tempObj){
			 for(var m=0;m<(parentObj.children.length-1);m++){
				 if(parentObj.children[m]){
					 if(key == parentObj.children[m].attrs.id){
						 parentObj.children[m].setZIndex(tempObj[key]);
					 }
				  }
			  } 
		 } 
		 
		 if(window.CD.module.data.Json.adminData.ET == 'SLE'){
			 moveToTopDock(activeElement);
		 }
	  };
	  moveToTopDock = function(activeElement){
		  var id = activeElement.attrs.id;
		  var dockObjId = 'dock_'+id;
		  var dockActiveElement = activeElement.parent.get('#'+dockObjId)[0];
		  var parentObj = dockActiveElement.parent;
		  var zIndexObj = {};
		  var zindexArr = [];
		  for(var i=0;i<parentObj.children.length;i++){
			  if(parentObj.children[i].attrs.id){
				  if((parentObj.children[i].attrs.id.split('_')[0] == 'dock')){
					  var id = parentObj.children[i].attrs.id;
					  var zIndex = parentObj.children[i].getZIndex();
					  zIndexObj[id] = zIndex;
					  zindexArr.push(zIndex);
				  }
			  }
		  }	
		  var tempObj = {};
		  var activeElmZIndex = dockActiveElement.getZIndex();
		  var temp;
		  var temp1;
		  var temp2;
		  for(var i=0;i<zindexArr.length;i++){
				for(var j=i+1;j<zindexArr.length;j++){
					if(zindexArr[i]>zindexArr[j]){
						temp1=zindexArr[i];
						zindexArr[i]=zindexArr[j];
						zindexArr[j]=temp1;
					}
				}
		  }
		  
		  for(var k=0;k<zindexArr.length;k++){
			  for(key in zIndexObj){
				  if(zindexArr[k]==zIndexObj[key]){
					  tempObj[key]=zindexArr[k];
				  }
			  }			 
		  }
		  var flag=true;
		  var tempArr1 = [];
		  for(var l=0;l<(zindexArr.length);l++){
			  tempArr1.push(zindexArr[l]);
		  }
		  for(var i=0;i<zindexArr.length;i++){
			  if(flag==true){
				  if(zindexArr[i] == activeElmZIndex){
					  temp = zindexArr[i];
					  temp2 = zindexArr[(zindexArr.length-1)];
					  for(var j=i;j<(zindexArr.length-1);j++){
						 
						  zindexArr[j+1] = tempArr1[j];					  
					  }
					  zindexArr[i]=temp2;
					  //zindexArr[(zindexArr.length-1)]=temp;
					  flag = false;
				  }
			  }
			  	  
		  }
		 var count = 0;
		 for(key in tempObj){
			 tempObj[key]=zindexArr[count];
			 count++;
		 }
		 var a = tempObj;
		 for(var key in tempObj){
			 for(var m=0;m<(parentObj.children.length-1);m++){
				 if(parentObj.children[m]){
					 if(key == parentObj.children[m].attrs.id){
						 parentObj.children[m].setZIndex(tempObj[key]);
					 }
				  }
			  } 
		 } 
	  }
	  
  }
 
  this.initCreateToolSet = function(){
	  console.log("@BaseTools.resetCreateToolSet");
	  var createTools = window.CD.tools.create;
	  $.each(createTools,function(index,toolId){
			$('#toolPalette li#'+toolId).on('click',function(){
				$('#toolPalette li').removeClass('active');
				/* Below line is commented because it was making frame_0 active always. 
				 * The requirement is to make newly created frame active
				 */
				 //cs.setActiveElement(cs.getGroup('frame_0'),'frame');
				$(this).addClass('active');
				if(createTools[1]!==toolId){
					$("canvas").css("cursor","default");	
				}
				
			});
		});
	  $('#toolPalette li#'+createTools[0]).addClass('active');
  };
  this.initFormatToolSet = function(){
	  console.log("@BaseTools.resetFormatToolSet");
	  var formatTools = window.CD.tools.format;
	  $.each(formatTools,function(index,toolId){
			$('#toolPalette li#'+toolId).on('click',function(){
				$(this).toggleClass('active');
				
			});
		});
  };
  
  this.initAlignToolSet = function(){
	  console.log("@BaseTools.resetAlignToolSet");
	  var alignTools = window.CD.tools.align;
	  $.each(alignTools,function(index,toolId){
			$('#toolPalette li#'+toolId).on('click',function(){
				  $.each(alignTools,function(index,toolId){
					  $('#toolPalette li#'+toolId).removeClass('active');
				  });
				  $(this).toggleClass('active');
				 
			});
		});
  };
  this.initCAlignToolSet = function(){
	  console.log("@BaseTools.resetAlignToolSet");
	  var calignTools = window.CD.tools.calign;
	  $.each(calignTools,function(index,toolId){
			$('#toolPalette li#'+toolId).on('click',function(){
				$.each(calignTools,function(index,toolId){
					  $('#toolPalette li#'+toolId).removeClass('active');
				  });
				$(this).toggleClass('active');
			});
		});
  };
 
  this.getBase = function(){
	  return base;
  };
  this.setBase = function(value){
	  base = value;
  };
                  
};

 