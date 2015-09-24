window.CD.services.cs = {
	addCanvas: function(options) {
		console.log("@css.addCanvas");
		if($('#canvasContainer .kineticjs-content').length > 0){
			console.error("Kinetic Canvas already present.");
		}else{
			window.CD.elements.stage = new Kinetic.Stage({
		        container: options.html_id,
		        width: (options.style.width)*1 +16,
		        height: (options.style.height)*1+15,
		        id: options.canvasId,
		        name:options.canvasId
		      });
		}
	},
	getCanvas:function(){
		return window.CD.elements.stage;
	},
	
	clearCanvas: function(){
		console.log("@cs.clearCanvas");
		var cnv = this.getCanvas();
		cnv.clear();
		console.log("@cs.clearCanvas:: cleared the current Canvas");
		
	},
	addLayer:function(){
		//NOTE: Create only one Layer in one stage other wise it will create a new Canvas element
		console.log('@css.addLayer');
		var stg = this.getCanvas();
		window.CD.elements.layer = new Kinetic.Layer({x:16,y:15,id:'cd_layer'});
		stg.add(window.CD.elements.layer);
		window.CD.elements.layer.on('click',function(){
			var ds = window.CD.services.ds;
			var cs = window.CD.services.cs;
			cs.setActiveElement(window.CD.services.cs.getGroup('frame_0'),'frame');	
			window.CD.services.cs.resetToolbar();
			openInspector('canvas');
			
		});
	},
	addBgTextLayer:function(){
		console.log("@cs.addBgImageLayer");
    	var stg = this.getCanvas();
		var imgLayer = new Kinetic.Layer({x:16,y:15,id:'text_layer'});
		stg.add(imgLayer);
		imgLayer.moveToTop();
		//stg.draw();
	},
	getBgTextLayer:function(){
		var stg = this.getCanvas();
		var bgImgLayer = stg.get("#text_layer")[0];
		if(bgImgLayer != undefined){
			return stg.get("#text_layer")[0];
		}else{
			$.each(stg.children, function(index,value) {
				if(this.attrs.id == 'text_layer'){
					bgImgLayer = this;
				}
			});
			if(bgImgLayer){
				return bgImgLayer;
			}else{
				this.addBgTextLayer();
				return stg.get("#text_layer")[0];
			}
		}
		
	},
	getLayer:function (){
		//console.log('@cs.getLayer');
		return window.CD.elements.layer;
	},
	addGroup:function(groupId,grpOptions){
		console.log('@css.addGroup');
		grpOptions = grpOptions || {};
		//NOTE: Create only one Layer in one stage otherwise it will create a new Canvas element
		grpOptions.id = groupId;
		var cdLayer = this.getLayer();
		var stg = this.getCanvas();
		var newGroup = new Kinetic.Group(grpOptions);
		
		cdLayer.add(newGroup);
		cdLayer.draw();
		//return newGroup;
	},
	createGroup:function(groupId,grpOptions){
		grpOptions = grpOptions || {};
		grpOptions.id = groupId;
		var newGroup = new Kinetic.Group(grpOptions);
		return newGroup;
	},
	getGroup:function (groupId,grpOptions){
		grpOptions = grpOptions || {};
		//console.log('@cs.getGroup');
		console.log('@cs.getGroup::groupID::'+groupId);
		var cdLayer = this.getLayer();
		
		if(cdLayer.get('#'+groupId).length >0){
			return (cdLayer.get('#'+groupId)[0]);
		}else{
			var layerChildrenLength = cdLayer.children.length;
			for(var i=0;i<layerChildrenLength; i++){
				if(cdLayer.children[i].nodeType === "Group" && cdLayer.children[i].attrs.id == groupId) {
					return cdLayer.children[i];
				}
			}
			this.addGroup(groupId,grpOptions);
			return (cdLayer.get('#'+groupId)[0]);
			//return newGroup;
		}
		
	},
	groupExists:function(groupId) {
		var cdLayer = this.getLayer();
		var layerChildrenLength = cdLayer.children.length;
		for(var i=0;i<layerChildrenLength; i++){
			if(cdLayer.children[i].nodeType === "Group" && cdLayer.children[i].attrs.id == groupId) {
				return true;
			}
		}
		return false;
	},
	findGroup:function(groupId) {
		var cdLayer = this.getLayer();
		var layerChildrenLength = cdLayer.children.length;
		for(var i=0;i<layerChildrenLength; i++){
			if(cdLayer.children[i].nodeType === "Group" && cdLayer.children[i].attrs.id == groupId) {
				return cdLayer.children[i];
			}
		}
	},
	/*reindex frames*/
	reIndexframes : function() {
				var cs = window.CD.services.cs;
				var cdLayer = cs.getLayer();
				var ds = window.CD.services.ds;
				var outputJson = window.CD.module.data.Json;
				var tmpFrameData= [];
				var c = 0;		
				$.each(outputJson.FrameData,function(index,value){
					if(value != undefined){
						tmpFrameData[c]=value;
						c++;
					}
				});
				
				outputJson.FrameData = [];
				outputJson.FrameData = tmpFrameData;
				
	},
	reIndexFrameText : function(frameId) {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var ds = window.CD.services.ds;
		var outputFrameJson = window.CD.module.data.Json.FrameData[frameId];
		var tmpFrameData= [];
		var c = 0;		
		$.each(outputFrameJson.frameTextList,function(index,value){
			if(value != undefined){
				outputFrameJson.frameTextList[c].textGroupObjID = 'txt_'+ c + '_' + frameId;
				c++;
			}
		});	
	},
	setActiveElement:function(elm,type){
		console.log("@canvasserives.setActiveElement");
		try{
			var cs = window.CD.services.cs;
			var flag1 = false;
			var activeElementLength = window.CD.elements.active.element.length; //this variable is being used to optimize code execution time
			for(var m=0;m<activeElementLength;m++){
				if(window.CD.elements.active.element[m].attrs.id == elm.attrs.id && activeElementLength>1){
					flag1 = true;
				}
			}
			if(type != 'guide'){
				for(var i=0;i<activeElementLength;i++){
					cs.resizeHandlar(window.CD.elements.active.element[i],'');
				}
				if(flag1 == false){
					cs.resizeHandlar('',elm);
				}
			}
			for(var i=0; i<activeElementLength;i++){
				var oldActiveElement = window.CD.elements.active.element[i];
				if(oldActiveElement.children){
					if(oldActiveElement.children.length != 0){
						if((oldActiveElement && shiftDown == false) && (oldActiveElement.attrs.id.match(/^frame_[1-9]+/)) ){
							oldActiveElement.children[0].setStrokeWidth(1);
							oldActiveElement.children[0].setStroke('#999999');
						}
					}
				}
			}
			
			if( window.CD.elements.active.type != type){
				for(var i=0; i<activeElementLength;i++){
					var oldActiveElement = window.CD.elements.active.element[i];
					if(oldActiveElement.children){
						if(oldActiveElement.children.length != 0){
							if((oldActiveElement.attrs.id.split('_')[0] == 'frame') && oldActiveElement.attrs.id != 'frame_0'){
								oldActiveElement.children[0].setStrokeWidth(1);
								oldActiveElement.children[0].setStroke('#999999');
							}	
						}
					}
					
				}
			}
			
			if(elm && type == 'frame' && elm.attrs.id != 'frame_0') {				
				if(elm.attrs.id.match(/^frame_[1-9]+/)){
					elm.children[0].setStrokeWidth(2);
					elm.children[0].setStroke('#1086D9');
				}
			}
			
			if((type == 'image' && window.CD.elements.active.type == 'image' && shiftDown == true )) {
				for(var i=0; i<activeElementLength;i++){
					var oldActiveElement = window.CD.elements.active.element[i];
					if(oldActiveElement.children){
						if(oldActiveElement.children.length != 0){
							oldActiveElement.children[0].setStrokeWidth(3);
							oldActiveElement.children[0].setStroke('#1086D9');	
						}
					}
					
					
				}
				elm.children[0].setStrokeWidth(3);
				elm.children[0].setStroke('#1086D9');
			}
			if((type == 'image' && shiftDown == true )) {
				if(elm.attrs.id.match(/^img_[0-9]_[0-9]+/)){
					elm.children[0].setStrokeWidth(3);
					elm.children[0].setStroke('#1086D9');
				}
			}
			if(type != 'image'||(type == 'image' && shiftDown == false)) {
				for(var i=0; i<activeElementLength;i++){
					var oldActiveElement = window.CD.elements.active.element[i];
					if(oldActiveElement.children && oldActiveElement.children.length != 0 && oldActiveElement.attrs.id.match(/^img_[0-9]_[0-9]+/)){
						oldActiveElement.children[0].setStrokeWidth(0);
						oldActiveElement.children[0].setStroke('rgba(0,0,0,0)');
					}
				}
			}
			
			
			if(activeElementLength>1 || shiftDown == true){
				/*for(var i=0;i<activeElementLength;i++){
				//	window.CD.module.view.makeActive('',window.CD.elements.active.element[i]);
				}*/
				window.CD.module.view.makeActive('',elm);
			}/*else{
				window.CD.module.view.makeActive(window.CD.elements.active.element[0],elm);//not needed 
			}*/
			if((type != window.CD.elements.active.type) || shiftDown == false){
				for(var i=0;i<activeElementLength;i++){
					if(window.CD.elements.active.element[i].attrs.id != elm.attrs.id){
						window.CD.module.view.makeActive(window.CD.elements.active.element[i],elm);
					}
				}
				if(window.CD.elements.active.type == 'text' || window.CD.elements.active.type == 'canvastext'){
					var frameTxtTool=  new TextTool.frameText();
					if(window.CD.elements.active.type == 'canvastext'){
						frameTxtTool=  new TextTool.canvasText();
					}
					for(var i=0;i<activeElementLength;i++){
						frameTxtTool.removeSelectedTextOptions(window.CD.elements.active.element[i]);
					}	
				}
			}
			if((type == window.CD.elements.active.type) && type == 'frame'){
				var frameIndex = elm.attrs.id.split('_')[1];
				if(frameIndex == 0){
					for(var i=0;i<activeElementLength;i++){
						window.CD.module.view.makeActive(window.CD.elements.active.element[i],elm);
					}
				}
			}
			
			switch(type){
			case "canvastext":
				new TextTool.canvasText().setTextHighlight(elm);
				break;
			case "labeltext":
				new TextTool.labelText().setlabelTextHighlight(elm);
				break;
			case "docktext":
				new TextTool.dockText().setdockTextHighlight(elm);
				break;
			default:
				new TextTool.frameText().setTextHighlight(elm);
			}

			var oldActiveElement=window.CD.elements.active.element[0];
			
			if((shiftDown == false) || (window.CD.elements.active.type != type) || (window.CD.elements.active.element[0].attrs.id == 'frame_0')){
				window.CD.elements.active.element = [];
			}	
			var flag = false;
			
			if(window.CD.elements.active.element.length>1){
				for(var k=0;k<window.CD.elements.active.element.length;k++){
					if(window.CD.elements.active.element[k].attrs.id == elm.attrs.id){
						flag = true;
						var aa = [];
						aa.push(window.CD.elements.active.element[k]);
						var availableObj = jQuery.grep(window.CD.elements.active.element,function (item) {
							return jQuery.inArray(item, aa) < 0;
							}); 
						if(window.CD.elements.active.type == 'label'||window.CD.elements.active.type == 'dock'){
							window.CD.module.view.makeActive(window.CD.elements.active.element[k]);
						}else if(window.CD.elements.active.type == 'image'){
							window.CD.elements.active.element[k].children[0].setStrokeWidth(0);
							window.CD.elements.active.element[k].children[0].setStroke('rgba(0,0,0,0)');
						}else if(window.CD.elements.active.type == 'frame' && window.CD.elements.active.element[0].attrs.id != 'frame_0'){
							window.CD.elements.active.element[k].children[0].setStrokeWidth(1);
							window.CD.elements.active.element[k].children[0].setStroke('#999999');
						}else if(window.CD.elements.active.type == 'text' || window.CD.elements.active.type == 'canvastext'){
							var frameTxtTool=  new TextTool.frameText();
							frameTxtTool.removeSelectedTextOptions(window.CD.elements.active.element[k]);
						}
						
						window.CD.elements.active.element = availableObj;
					}
				}
				if(flag == false){
					window.CD.elements.active.element.push(elm);
				}
			}else{
				window.CD.elements.active.element.push(elm);
			}
			window.CD.elements.active.type = type;
			/*common label text*/
			var commonLBLText=new TextTool.commonLabelText();
			
			/*if(type != "docktext") *//*last word highlight issue for docktext */
				/*commonLBLText.setCommonLabelTextHighlight(oldActiveElement,elm,type);*/
			
			if($("#snapToGuide").prop("checked")){
					this.attachSnapEvent(elm,type);
			}
		//	this.updateMoveToTopBottomState(elm);
		}catch(err){
			console.log("Error in canvaseservices.setActiveElment::"+err.message);
		}
		if(elm.attrs.id == 'frame_0'){
			this.updateMoveToTopBottomState(elm);
		}
	},
	/**
	 * Snap to guide
	 * Modified for right and bottom
	 */
	attachSnapEvent: function(elm,type){
		if(elm != undefined && elm != ""){
			if(type != 'guide' && elm.getDraggable() && !$("#deleteGuide").hasClass("inactive")){
				var cs = window.CD.services.cs;
				var ds = window.CD.services.ds;
				var cdLayer = cs.getLayer();
				
				elm.off("dragmove.snap");
				elm.on('dragmove.snap',function(evt){
					var guidesData = ds.getGuidesData();
					var xPos = this.getAbsolutePosition().x;
					var yPos = this.getAbsolutePosition().y;
					
					var lblW = parseInt(this.children[0].getWidth());
					var lblH = parseInt(this.children[0].getHeight());
					
					var lGuides = $.grep(guidesData.vGuides, function(n, i){
						return (n < xPos);
					});
					var tGuides = $.grep(guidesData.hGuides, function(n, i){
						return (n < yPos);
					});
					
					var rGuides = $.grep(guidesData.vGuides, function(n, i){
						return (n > xPos);
					});
					var bGuides = $.grep(guidesData.hGuides, function(n, i){
						return (n > yPos);
					});
		
					var nearestXL = 0;
					if(lGuides[0])
						nearestXL = lGuides[0];
					
					var nearestYT = 0;
					if(tGuides[0])
						nearestYT = tGuides[0];
					
					var nearestXR = xPos;   //window.CD.module.data.Json.adminData.AW;
					if(rGuides[0])
						nearestXR = rGuides[0]-lblW;
					
					var nearestYB = yPos; 	//window.CD.module.data.Json.adminData.AH;
					if(bGuides[0])
						nearestYB = bGuides[0]-lblH;
					
					for(var i=1; i < lGuides.length; i++){
						if((xPos - nearestXL) > (xPos - lGuides[i])) 
							nearestXL = lGuides[i];
					}
					for(var i=1; i < tGuides.length; i++){
						if((xPos - nearestYT) > (yPos - tGuides[i])) 
							nearestYT = tGuides[i];
					}
					
					for(var i=1; i < rGuides.length; i++){
						if((xPos - nearestXR) > (xPos - lGuides[i])) 
							nearestXR = lGuides[i]-lblW;
					}
					for(var i=1; i < bGuides.length; i++){
						if((xPos - nearestYB) > (yPos - tGuides[i])) 
							nearestYB = tGuides[i]-lblH;
					}
					var disXL = Math.abs(xPos - nearestXL);
					var disXR = Math.abs(xPos - nearestXR);
					
					var disYT = Math.abs(yPos - nearestYT);
					var disYB = Math.abs(yPos - nearestYB);
					
					var nearestX,nearestY;
					
					if(disXL<disXR){
						nearestX = nearestXL;
					}
					else{
						if((nearestXL - xPos) <= 10 && disXR == 0){
							nearestX = nearestXL;
						}else if ((nearestXR - xPos) <= 10){
							nearestX = nearestXR;
						}
					} 
					
					if(disYT<disYB){
						nearestY = nearestYT;
					}
					else{
						if((nearestYT - yPos) <= 10 && disYB == 0){
							nearestY = nearestYT;
						}else if((nearestYB - yPos) <= 10){
							nearestY = nearestYB;
						}
					} 
					
					if(nearestX == undefined || nearestX <=0) nearestX = xPos;
					if(nearestY == undefined || nearestY <=0) nearestY = yPos;
					
					if((yPos-nearestY) > 10) nearestY = yPos;
					if((xPos-nearestX) > 10) nearestX = xPos;
					
					//console.info("nearestX---::"+nearestX+"---nearestY------::"+nearestY);
					this.setAbsolutePosition(nearestX,nearestY);
					cdLayer.draw();
				});
			}
		}
		
		
	},
	deleteActiveElement: function(){
		var active = window.CD.elements.active;
		var jsonObj = window.CD.module.data.getJsonData();
		var undoMng = window.CD.undoManager;
		if(active.element[0] != '' && active.element[0].attrs.id != 'frame_0'){
			$("#deleteElement").removeClass('inactive_del').addClass('active');
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var stg = cs.getCanvas();
			var cdLayer = cs.getLayer();
			var param;
			if(ds.getEt()== 'PRG'){
				param = 'stopEvent';
			}
			switch(active.type){
			case 'guide':
				undoMng.register('mouseup', cs.reCreateGuides, [ds.getGuidesData()], 'Recreate guides',
								 'mouseup', cs.deleteGuide,[active.element[0]] , 'Delete V guide');
				updateUndoRedoState(undoMng);
				this.deleteGuide(active.element[0]);
				break;
			case 'frame':
				var activeElements = active.element;
				var activeElementsLength = activeElements.length;
				var activeElmIdArr = [];
				var frameDataArr = [];
				var frameElmArr = [];
				for(var i=0;i<activeElementsLength;i++){
					var activeElm = active.element[i];
					if(activeElm != undefined && activeElm.attrs.id != 'frame_0') {
						activeElm = window.CD.services.cs.findGroup(activeElm.attrs.id);
						var frameIndexInOutputData =  cs.getFrameIndex(activeElm.attrs.id);
						var frameElemData = jQuery.extend(true, {}, window.CD.module.data.Json.FrameData[frameIndexInOutputData]);
						frameElmArr.push(jQuery.extend(true, {},activeElm));
						activeElmIdArr.push(activeElm.attrs.id);
						frameDataArr.push(frameElemData);
						/*set active element error handling while deleting frame*/
						window.CD.services.cs.removeImageinFrame(activeElm);
						window.CD.services.cs.removeAudioinFrame(activeElm);
						window.CD.services.cs.deleteSubGroups(activeElm);
						activeElm.destroyChildren();
						activeElm.destroy();
						cdLayer.draw();
						
						delete window.CD.module.data.Json.FrameData[frameIndexInOutputData];
						
						var frameCount = cs.objLength(window.CD.module.data.Json.FrameData);
						if(parseInt(frameCount) <= 1){
							$('#alignLabelsToFrame').addClass('inactive');
						}
						ds.setOutputData();		
					}
				}
				this.reIndexframes();
				cs.setActiveElement(this.getGroup('frame_0'),'frame');
				undoMng.register(this,window.CD.module.frame.createNewFrame,[activeElmIdArr,frameDataArr],'Undo delete frame',this,window.CD.module.frame.deleteFrame,[frameElmArr],'Redo delete frame');
				updateUndoRedoState(undoMng);
				ds.setOutputData();	
				break;
			case 'labeltext':
				new TextTool.labelText().deleteActiveLabelText();
				break;
			case 'commonLabelText':
				new TextTool.commonLabelText().deleteActiveLabelText(param,'undoRedo');
				break;
			case 'docktext':
				new TextTool.dockText().deleteActiveDockText('removeLabel');
				break;
			case 'image':
				var allFinalImageName = [];
				var activeElement = [];
				for(var i=0;i<active.element.length;i++){
					var activeElm = active.element[i];
					var containerFrame = this.getObjectContainerFrame(activeElm);
					var frameIndexInOutputData =  this.getFrameIndex(containerFrame.attrs.id);
					var imgName = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[activeElm.attrs.id];
					var finalImageName = {};
					finalImageName.imageName = imgName.src;
					finalImageName.height = imgName.height;
					finalImageName.width = imgName.width;
					
					finalImageName.imageX = imgName.imageX;
					finalImageName.imageY = imgName.imageY;
					var temp ={title:finalImageName.imageName,
								id:activeElm.attrs.id,
								imgObj:finalImageName};
					allFinalImageName.push(temp);
					activeElement.push(activeElm);
					var imageObject = activeElm.getChildren()[0];
					var imageName = 'unknown';
					if(imageObject.className == 'Image'){
						imageSrc = $(imageObject.attrs.image).attr('src');
						imageName = imageSrc.substring(imageSrc.lastIndexOf('/')+1,imageSrc.length); 
						imageName = imageName.substring(imageName.lastIndexOf('=')+1,imageName.length); //changed the lastIndexof "=" instead of "/" by SS
					}
					activeElm.destroyChildren();
					activeElm.destroy();
					delete window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[activeElm.attrs.id];
					window.CD.services.ds.updateImageList(imageName,'remove');  //uncommented by SS 02/27
					
				}
				//cs.setActiveElement(this.getGroup('frame_0'),'frame');//After delete active element set is not possible as number of children in oldActiveElement is zero(0)
				//cdLayer.draw();
				window.CD.module.frame.registerUndoRedoForMultiImg1(containerFrame,finalImageName,false,allFinalImageName);
				/*for(var j=0;j<activeElement.length;j++){
					var actvElm = activeElement[j];
					actvElm.destroyChildren();
					actvElm.destroy();
					delete window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[actvElm.attrs.id];
					window.CD.services.ds.updateImageList(imageName,'remove');  //uncommented by SS 02/27
					
				}*/
				ds.setOutputData();
				cs.setActiveElement(this.getGroup('frame_0'),'frame');//After delete active element set is not possible as number of children in oldActiveElement is zero(0)
				break;
			case 'labelimage':
				var allFinalImageName = [];
				var activeElm = active.element[0];
				var sle = window.CD.module.data.getLabelIndex(activeElm.parent.attrs.id);
				var labelGrp = activeElm.parent;
				var cmmnLablTxt = new TextTool.commonLabelText();
				//var containerFrame = this.getObjectContainerFrame(activeElm);
				//var frameIndexInOutputData =  this.getFrameIndex(containerFrame.attrs.id);
				var imageObject = activeElm.getChildren()[0];
				var imageName = 'unknown';
				if(imageObject.className == 'Image'){
					imageSrc = $(imageObject.attrs.image).attr('src');
					imageName = imageSrc.substring(imageSrc.lastIndexOf('/')+1,imageSrc.length);
				}
				cs.setActiveElement(this.findGroup('frame_0'),'frame');	
				
				//activeElm.removeChildren();
				activeElm.destroyChildren();
				activeElm.destroy();
				//activeElm.remove();	
				/*adde for align text when image is not there and text height is long*/
				var txtGrpObj=labelGrp.get('.nametxt')[0].parent;
				var txtGrpId=txtGrpObj.attrs.id.split('_')[1];
				if(txtGrpObj){
					var totWidth = txtGrpObj.parent.children[0].getWidth();
					var totHeight = txtGrpObj.parent.children[0].getHeight();
					labelGrp.get('.nametxt')[0].parent.setY((labelGrp.children[0].getHeight()/2)-10);
					
					
					if(window.CD.module.data.textGroupComponent.length > 0){
						var count = txtGrpObj.children.length-1;
						var lastChild = cmmnLablTxt.findLastTextchild(txtGrpObj,count);
						var originalTextHeight = txtGrpObj.children[lastChild].getY() + txtGrpObj.children[lastChild].getHeight();
						
						if(totHeight > originalTextHeight){
							  var calcY = (totHeight - originalTextHeight)/2;
							  txtGrpObj.setY(calcY);
						}
						  
						if(totHeight<=originalTextHeight){
							  var calcY = txtGrpObj.parent.children[0].getY();
							  txtGrpObj.setY(calcY);
						}
					}					
				}
				allFinalImageName.push(imageName);
				if(typeof window.CD.module.view.registerUndoRedo == "function"){
					var labelGrp=this.getGroup(activeElm.attrs.id.substr(4,activeElm.attrs.id.length));
					 window.CD.module.view.registerUndoRedo(labelGrp,allFinalImageName,true);
				 } 
				
				
				
				cdLayer.draw();
				jsonObj[sle].image_data = "N";
				window.CD.services.ds.updateImageList(imageName,'remove');
				cs.setActiveElement(labelGrp,'label');		
				//delete window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[activeElm.attrs.id];
				ds.setOutputData();		
				break;
			case 'labelaudio':
				var activeElm = active.element[0];	
				if(activeElm.parent.attrs.id.match(/^label_[0-9]+/)){
					var node = window.CD.module.data.getLabelIndex(activeElm.parent.attrs.id);	
					cs.setActiveElement(this.getGroup(activeElm.parent.attrs.id),'label');
					
					var audioVal = jsonObj[node].media_value;
					if(!audioVal){
						audioVal = jsonObj[node].media_PRGT_value;
					}
					if(typeof window.CD.module.view.registerAudioUndoRedo == "function"){
						
						 window.CD.module.view.registerAudioUndoRedo(this,audioVal,activeElm,activeElm.parent);
					 } 
					
					activeElm.destroyChildren();
					activeElm.destroy();	
					jsonObj[node].media_value = "N";
					window.CD.services.ds.updateAudioUsage(audioVal,false);
					ds.setOutputData();
					cdLayer.draw();
					
					//window.CD.services.ds.updateAudioUsage(audioVal,false);
					//window.CD.module.view.deleteAudio(node);
					}
				else{
					var jsonObj= window.CD.module.data.getDockJsonData();
					if(typeof window.CD.module.data.getDockIndex == "function")
						var node = window.CD.module.data.getDockIndex(activeElm.parent.attrs.id);
							
					cs.setActiveElement(this.getGroup(activeElm.parent.attrs.id),'label');
					
					if(typeof window.CD.module.view.registerAudioUndoRedoDock == "function"){
						 window.CD.module.view.registerAudioUndoRedoDock(this,node,activeElm,activeElm.parent);
					 } 
					updateUndoRedoState(undoMng);
					cs.setActiveElement(this.getGroup(activeElm.parent.attrs.id),'dock');	
					activeElm.destroyChildren();
					activeElm.destroy();			
					cdLayer.draw();	
					window.CD.services.ds.updateAudioUsage(jsonObj[node].media_PRG_value,false);
					jsonObj[node].media_PRG_value = "N";
					jsonObj[node].coor_PRG_value.x =0;
					jsonObj[node].coor_PRG_value.y =0;
					ds.setOutputData();
										
				}
				$('#player_container').remove();
				ds.setOutputData();		
				break;
			case 'audio':
				var activeElm = active.element[0];
				var containerFrame = this.getObjectContainerFrame(activeElm);
				var frameIndexInOutputData =  this.getFrameIndex(containerFrame.attrs.id);
				var undoMng = window.CD.undoManager;
				var cs = window.CD.services.cs;
				var oldObject = {};	
				var frameJson = window.CD.module.data.Json.FrameData;
				oldObject.x = frameJson[frameIndexInOutputData].frameMediaXY.x;
				oldObject.y = frameJson[frameIndexInOutputData].frameMediaXY.y;
				var mediaVal = frameJson[frameIndexInOutputData].frameMediaList;
				if(activeElm.parent.attrs.id == "frame_0"){
					undoMng.register(this, cs.addAudiotoCanvas,[mediaVal,oldObject,activeElm.parent],'Recreate audio',this, cs.deleteAudio,[activeElm,'audio'],'Delete audio');
				}else{
					undoMng.register(this, cs.addAudiotoFrame,[mediaVal,oldObject,activeElm.parent],'Recreate audio',this, cs.deleteAudio,[activeElm,'audio'],'Delete audio');
				}
				cs.setActiveElement(this.getGroup('frame_0'),'frame');	
				activeElm.destroyChildren();
				activeElm.destroy();	
				cdLayer.draw();
				//TODO: need to get the selected media name from multiple frame meida after supporting more than one audio in Stage
				window.CD.services.ds.updateAudioUsage(window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameMediaList,false);
				//TODO: Need to support and delete individual media file information from frame
				window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameMediaList = "N";
				window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameMediaXY.x = 0;
				window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameMediaXY.y = 0;
				window.CD.services.ds.updateAudioUsage(mediaVal,false);
				$('#player_container').remove();
				ds.setOutputData();		
				break;
				
			case 'text':
				var frameText= new TextTool.frameText();
				frameText.deleteActiveText();
				break;	
			case 'canvastext':
				var canvasTxtTool= new TextTool.canvasText();
				canvasTxtTool.deleteActiveText();
				break;	
			case 'label':
				window.CD.module.view.deleteLabel(active);				
				break;
			case 'dock':
				window.CD.module.view.deleteDock(active);				
				break;
			}
		}
		
			
		/*
		function removeNestedGroup(activeElm) {
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var childElm = activeElm.children;
			var childElmLength = childElm.length;
			
			for(var i=0; i<childElmLength; i++) {
				var elm = childElm[i];
				if(elm && elm.nodeType == "Group") {
					removeNestedGroup(elm);
				} else if(elm){
					elm.remove();
				}
			}
			cdLayer.draw();
		}*/
	},
	
	removeImageinFrame : function(activeElm) {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var images = activeElm.get('.img');
		for(var i=0; i<images.length; i++){
			var imgGrp = images[i].parent;
			var imageSrc = imgGrp.children[0].getImage().src.split('/');
			imageName = imageSrc[imageSrc.length-1];
			imgGrp.removeChildren();
			//imgGrp.remove();
			var frameIndexInOutputData =  this.getFrameIndex(activeElm.attrs.id);
			delete window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[imgGrp.attrs.id];
			window.CD.services.ds.updateImageList(imageName,'remove');
			cdLayer.draw();
		}
	},
	removeAudioinFrame : function(activeElm) {
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var images = activeElm.get('.audio_play');
		for(var i=0; i<images.length; i++){
			var imgGrp = images[0].parent
			imgGrp.removeChildren();
			//imgGrp.remove();
			cdLayer.draw();
		}
	},
	
	deleteAudio:function(activeNode,activetype){
		var cs = window.CD.services.cs;
		var audioNode = cs.getLayer().get('#'+activeNode.attrs.id)[0];
		if(audioNode){
			cs.setActiveElement(audioNode,activetype);
			cs.deleteActiveElement();
		}
	},
	deleteSubGroups:function(object){
		var childrenLengt = object.children.length;
		for(var i=0; i<childrenLengt; i++){
			if(!object.children[i]){
				this.deleteSubGroups(object);
			}
			if(object.children[i]) {
				if(object.children[i].nodeType == "Group"){
					this.deleteSubGroups(object.children[i]);	
					//object.children[i].attrs.id = "";
				} else {
					object.children[i].remove();
				}
			}
		}
	},
	loadRulerImage: function(imgInfo,rulerLayer,callback){
		console.log("@cs.createImage");
		try{
			var img = new Image();
			img.src = imgInfo.imgUrl;
			if (img.complete) {
				  var imgElm = new Kinetic.Image({
			          x: imgInfo.x,
			          y: imgInfo.y,
			          image: img,
			          width: imgInfo.width,
			          height: imgInfo.height,
			          id:imgInfo.id
			        });
				  if(callback != undefined){
					  callback(imgInfo,imgElm,rulerLayer);
				  }
			        //return imgElm;
			        //llLayer.draw();
			        img.onload=function(){};
			  }else {
				img.onload = function() {
				var imgElm = new Kinetic.Image({
			          x: imgInfo.x,
			          y: imgInfo.y,
			          image: img,
			          width: imgInfo.width,
			          height: imgInfo.height,
			          id:imgInfo.id
			        });
				callback(imgInfo,imgElm,rulerLayer);
			       // return imgElm;
				    // clear onLoad, IE behaves erratically with animated gifs otherwise
					img.onload=function(){};
				};
				img.onerror = function() {
					console.error("Could not load image."+img.src );
			    };
			 }
		}catch(err){
			console.error("unable to create image::"+err.message);
		}
		
			
	},
	addCanvasRuler: function(instanceObj){
		console.log("@cs.addCanvasRuler");
		var cnvConfig = instanceObj.cnvConfig;
		var stg = this.getCanvas();
		var rlLayer = new Kinetic.Layer({id:'ruler_layer'});
		window.CD.elements.rllayer = rlLayer;
		var newGroup = new Kinetic.Group({x:rlLayer.getX(),y:rlLayer.getY(),id:'guides_group'});
		
		var cdLayer = this.getLayer();
		var util = window.CD.util;
		var activateLeftRl = activateTopRl = false;
		var guideWidth = cnvConfig.style.width, guideHeight = cnvConfig.style.height;

		rlLayer.add(newGroup);
		stg.add(rlLayer);
		stg.draw();

		lRlrImgUrl = util.getImageUrl() + 'ruler_left.png';
		tRlrImgUrl =  util.getImageUrl() + 'ruler_top.png';
		
		this.loadRulerImage({'imgUrl': lRlrImgUrl,'x':0, 'y':15, 'width':16, 'height': null, 'id':'ruler_left','guideHeight':guideHeight},rlLayer,this.createlRlImage);
		this.loadRulerImage({'imgUrl': tRlrImgUrl,'x':0, 'y':0, 'width':null, 'height': 15, 'id':'ruler_right','guideWidth':guideWidth},rlLayer,this.createtRlImage);
		
		rlLayer.draw();
		stg.draw();
	},
	createlRlImage: function(imgInfo,lRlrImg,rlLayer){
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var undoMng = window.CD.undoManager;
		var stg = cs.getCanvas();
		
		//var rlLayer = new Kinetic.Layer({id:'ruler_layer'});
		var cdLayer = cs.getLayer();
		
		var activateLeftRl = false;
		var guideHeight = imgInfo.guideHeight;
		var guideGroup = rlLayer.get("#guides_group")[0];
		
		lRlrImg.on('mousedown',function(evt){
			var lRulerLine;
			if($('#cdInspector #hideGuide').prop('checked') == true){
				$('#cdInspector #snapToGuide').prop('checked',false);
			}
			if($('#cdInspector #lockGuide').prop('checked') == true){
				$('#cdInspector #lockGuide').trigger('click');
			}
			if($('#cdInspector #deleteGuide').hasClass("inactive")){
				$('#cdInspector #deleteGuide').removeClass('inactive');
				$('#cdInspector #snapToGuide').prop('checked',true);
			}
			activateLeftRl = activateLeftRl == true ? false : true;
	        if(activateLeftRl){
	        	var rlSeq = window.CD.module.data.Json.adminData["VGL"].length;
	        	lRulerLine = new Kinetic.Line({
	                points: [0, 15, 0, guideHeight+15],
	                stroke: '#33ffff',
	                strokeWidth: 2,
	                id: 'vGuide_'+rlSeq,
	                draggable:true,
	                dragBoundFunc: function(pos) {
	                    return {
	                      x: pos.x,
	                      y: this.getAbsolutePosition().y
	                    };
	                  }
	              });
	        	guideGroup.add(lRulerLine);
	        	cdLayer.on('mousemove.lRulerPlace',function(evt){
	        		var cdMousePos = stg.getPointerPosition();
	        		lRulerLine.setX(cdMousePos.x);
	        		rlLayer.draw();
	        		
	        	});
	        	lRulerLine.on('mouseover',function(evt){
	        		$('canvas').css('cursor','col-resize');
	        	});
	        	lRulerLine.on('mouseout',function(evt){
	        		$('canvas').css('cursor','default');
	        	});
	        	
	        	lRulerLine.on('mouseup mousedown',function(){
	        		if(activateLeftRl){
	        			ds.saveGuide();
		        		activateLeftRl = false;
		        		cdLayer.off('mousemove.lRulerPlace');
	        			undoMng.register(this, cs.deleteGuide,[this] , 'Delete V guide',
	        							 'mouseup', cs.reCreateGuides, [ds.getGuidesData()], 'Recreate guides');
	        			updateUndoRedoState(undoMng);
	        		}else{
	        			cs.setActiveElement(lRulerLine,'guide');
	        		}	        		
	        	});
	        	lRulerLine.on('dragend',function(evt){
	        		console.info("dragged lRulerLine");
	        		cs.setActiveElement(this,'guide');
	        		undoMng.register('dragend', cs.reCreateGuides,[ds.getGuidesData()],'Recreate guide','dragend',cs.drawGuides,[],'Redo guide');
	        		updateUndoRedoState(undoMng);
	        		ds.saveGuide();
	        	});
	        }
		});
		rlLayer.add(lRlrImg);
	},
	createtRlImage: function(imgInfo,tRlrImg,rlLayer){
		var cs = window.CD.services.cs;
		var ds = window.CD.services.ds;
		var undoMng = window.CD.undoManager;
		var el = window.CD.elements.active;
		var stg = cs.getCanvas();
		//var rlLayer = new Kinetic.Layer({id:'ruler_layer'});
		var cdLayer = cs.getLayer();
		
		var activateTopRl = false;
		var guideWidth = imgInfo.guideWidth;
		var guideGroup = rlLayer.get("#guides_group")[0];
		
		tRlrImg.on('mousedown',function(){
			activateTopRl = activateTopRl == false ? true : false;
			var tRulerLine;
			if($('#cdInspector #hideGuide').prop('checked') == true){
				$('#cdInspector #hideGuide').trigger('click');
			}
			if($('#cdInspector #lockGuide').prop('checked') == true){
				$('#cdInspector #lockGuide').trigger('click');
			}
			if($('#cdInspector #deleteGuide').hasClass("inactive")){
				$('#cdInspector #deleteGuide').removeClass('inactive');
				$('#cdInspector #snapToGuide').prop('checked',true);
			}
			if(activateTopRl){
				var rlSeq = window.CD.module.data.Json.adminData["HGL"].length;
	        	tRulerLine = new Kinetic.Line({
	                points: [16, 0, guideWidth+16, 0],
	                stroke: '#33ffff',
	                strokeWidth: 2,
	                id: 'hGuide_'+rlSeq,
	                draggable:true,
	                dragBoundFunc: function(pos) {
	                    return {
	                      x: this.getAbsolutePosition().x,
	                      y: pos.y
	                    };
	                  }
	              });
	        	guideGroup.add(tRulerLine);
	        	cdLayer.on('mousemove.tRulerPlace',function(evt){
	        		var cdMousePos = stg.getPointerPosition();
	        		tRulerLine.setY(cdMousePos.y);
	        		rlLayer.draw();
	        	});
	        	tRulerLine.on('mouseup mousedown',function(){
	        		if(activateTopRl){
	        			activateTopRl = false;
		        		cdLayer.off('mousemove.tRulerPlace');
		        		ds.saveGuide();
		        		undoMng.register('mouseup', cs.deleteGuide,[this] , 'Delete V guide',
   							 'mouseup', cs.reCreateGuides, [ds.getGuidesData()], 'Recreate guides');
		        		updateUndoRedoState(undoMng);
	        		}
	        		cs.setActiveElement(tRulerLine,'guide');
	        	});
	        	tRulerLine.on('dragend',function(evt){
	        		cs.setActiveElement(this,'guide');
	        		undoMng.register('dragend', cs.reCreateGuides,[ds.getGuidesData()],'Recreate guides','dragend',cs.drawGuides,[],'Redo guide');
	        		updateUndoRedoState(undoMng);
	        		ds.saveGuide();
	        	});
	        	
	        	tRulerLine.on('mouseover',function(evt){
	        		$('canvas').css('cursor','row-resize');
	        	});
	        	tRulerLine.on('mouseout',function(evt){
	        		$('canvas').css('cursor','default');
	        	});
	        }
		});
		rlLayer.add(tRlrImg);
		rlLayer.draw();
	},
	lockGuides: function(flag){
		try{
			rlLayer = window.CD.elements.rllayer;
			var guideGroup = rlLayer.getChildren()[0];
			var guides = guideGroup.getChildren();
			for(var i = 0; i< guides.length; i++){
					guides[i].setDraggable(!flag);
			}
			rlLayer.draw();
		}catch(err){
			console.error("Error on lockGuides::"+err.message);
		}
		
	},
	hideGuides: function(flag){
		rlLayer = window.CD.elements.rllayer;
		//var guideGroup = rlLayer.get("#guides_group")[0];
		var guideGroup = rlLayer.getChildren()[0];
		guideGroup.setVisible(!flag);
		rlLayer.draw();
	},
	deleteAllGuides: function(){
		var rlLayer = window.CD.elements.rllayer;
		var ds = window.CD.services.ds;
		//var i = 0;
		//var guides = rlLayer.getChildren();
		//var guideGroup = rlLayer.get('#guides_group')[0];
		var guideGroup = rlLayer.getChildren()[0];
		
		guideGroup.removeChildren();
		ds.saveGuide();
		$('#cdInspector #deleteGuide').addClass('inactive');
		$('#cdInspector #snapToGuide').prop('checked',false);
		rlLayer.draw();
	},
	deleteGuide: function(guideElm){
		console.log("@canvasservices.deleteGuide");
		var rlLayer = window.CD.elements.rllayer;
		var ds = window.CD.services.ds;
		var guideGroup = rlLayer.getChildren()[0];
		var guideObj = guideGroup.get("#"+guideElm.getId())[0];
		guideObj.remove();
		rlLayer.draw();
		ds.saveGuide();
		if(ds.getGuidesData().hGuides.length == 0 && ds.getGuidesData().vGuides.length == 0){
			$('#cdInspector #deleteGuide').addClass('inactive');
			$('#cdInspector #snapToGuide').prop('checked',false);
		}
		
	},
	drawHGuides:function(HGL,undoFlag){
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var rlLayer = window.CD.elements.rllayer;
		var undoMng = window.CD.undoManager;
		var guideGroup = rlLayer.getChildren()[0];
		var guideWidth = ds.getCanvasSize().width;
		var guideHeight = ds.getCanvasSize().height;
		
		if(HGL.length > 0){
			
			/** On render if h guides are present check snap to guide true **/
			$('#cdInspector #deleteGuide').removeClass('inactive');
			$('#cdInspector #snapToGuide').prop('checked',true);
			
			for(var i = 0; i < HGL.length; i++){
				var tRulerLine = new Kinetic.Line({
	                points: [16, 0, guideWidth+16, 0],
	                stroke: '#33ffff',
	                strokeWidth: 2,
	                draggable:true,
	                y: HGL[i],
	                id: 'hGuide_'+i,
	                dragBoundFunc: function(pos) {
	                    return {
	                      x: this.getAbsolutePosition().x,
	                      y: pos.y
	                    };
	                  }
	              });
				guideGroup.add(tRulerLine);
				//rlLayer.add(guideGroup);
	        	//rlLayer.draw();
	        	tRulerLine.on('click',function(evt){
	        		cs.setActiveElement(this,'guide');
	        	});
	        	
	        	tRulerLine.on('dragend.moveRuler',function(evt){
	        		cs.setActiveElement(this,'guide');
	        		if(undoFlag){
	        			undoMng.register('dragend', cs.reCreateGuides,[ds.getGuidesData()],'Recreate guide','dragend',cs.drawGuides,[],'Redo guide');
	        		}
	        		updateUndoRedoState(undoMng);
	        		ds.saveGuide();
	        	});
	        	tRulerLine.on('mouseover',function(evt){
	        		$('canvas').css('cursor','row-resize');
	        	});
	        	tRulerLine.on('mouseout',function(evt){
	        		$('canvas').css('cursor','default');
	        	});
	        	
			}
			$('#cdInspector #deleteGuide').removeClass('inactive');
			rlLayer.draw();
		}
	},
	drawVGuides:function(VGL,undoFlag){
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var undoMng = window.CD.undoManager;
		var rlLayer = window.CD.elements.rllayer;
		var guideGroup = rlLayer.getChildren()[0];
		var guideWidth = ds.getCanvasSize().width;
		var guideHeight = ds.getCanvasSize().height;
		
		if(VGL.length > 0){
			
			/** On render if v guides are present check snap to guide true **/
			$('#cdInspector #deleteGuide').removeClass('inactive');
			$('#cdInspector #snapToGuide').prop('checked',true);
			
			for(var i = 0; i < VGL.length; i++){
				for(var i = 0; i < VGL.length; i++){
					var lRulerLine = '';
					lRulerLine = new Kinetic.Line({
		                points: [0, 15, 0, guideHeight+15],
		                stroke: '#33ffff',
		                strokeWidth: 2,
		                draggable:true,
		                x: VGL[i],
		                id: 'vGuide_'+i,
		                dragBoundFunc: function(pos) {
		                    return {
		                    	 x: pos.x,
			                     y: this.getAbsolutePosition().y
		                    };
		                  }
		              });
					guideGroup.add(lRulerLine);
		        	lRulerLine.on('click',function(evt){
		        		cs.setActiveElement(this,'guide');
		        	});
		        	lRulerLine.on('dragend.moveRuler',function(evt){
		        		cs.setActiveElement(this,'guide');
		        		if(undoFlag){
		        			undoMng.register(this, cs.reCreateGuides,[ds.getGuidesData()],'Recreate guide',this, cs.drawGuides,[''] , 'Redo guide');
		        		}
		        		updateUndoRedoState(undoMng);
		        		ds.saveGuide();
		        	});
		        	lRulerLine.on('mouseover',function(evt){
		        		$('canvas').css('cursor','col-resize');
		        	});
		        	lRulerLine.on('mouseout',function(evt){
		        		$('canvas').css('cursor','default');
		        	});
				}
			}
			$('#cdInspector #deleteGuide').removeClass('inactive');
			rlLayer.draw();
		}
	},
	drawGuides: function(){
		console.log("@canvasservices.drawGuide");
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		
		var rlLayer = window.CD.elements.rllayer;
		var guideGroup = rlLayer.getChildren()[0];
		guideGroup.removeChildren();
		rlLayer.draw();
		var HGL = ds.getGuidesData().hGuides;
		var VGL = ds.getGuidesData().vGuides;
		
		cs.drawHGuides(HGL,true);
		cs.drawVGuides(VGL,true);
	},
	reCreateGuides:function(guides){
		console.log("@canvasservices.reCreateGuide");
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var rlLayer = window.CD.elements.rllayer;
		var guideGroup = rlLayer.getChildren()[0];
		guideGroup.removeChildren();
		rlLayer.draw();
		var HGL = guides.hGuides;
		var VGL = guides.vGuides;

		cs.drawHGuides(HGL,false);
		cs.drawVGuides(VGL,false);
	},
	/**
	 * 
	 * */
	createCanvasGrid: function (instanceObj){
		console.log("@cs.createCanvasGride");
		var cnvConfig = instanceObj.cnvConfig;
		var gridConfig = cnvConfig.canvas_grid;
		var cellSize = cnvConfig.canvas_grid.scale/cnvConfig.canvas_grid.subdiv,
			hCount = cnvConfig.style.width/cellSize,
			vCount = cnvConfig.style.height/cellSize,
			gridWidth = cnvConfig.style.width,
			gridHeight = cnvConfig.style.height;
		
		var stg = this.getCanvas();
		var cdLayer = this.getLayer();
		var cnvOutline = new Kinetic.Rect({
		    x: 0,
		    y: 0,
		    width: gridWidth,
		    height: gridHeight,
		    stroke: '#cdcdcd'
		});
		cdLayer.add(cnvOutline);
		
		var gridGrp = this.getGroup('canvas_grid');
		
		
			for (i = 0; i < hCount + 1; i++) {
			    var I = i * cellSize;
			    var l = new Kinetic.Line({
						    	strokeWidth: (i%cnvConfig.canvas_grid.subdiv) ? 0.1 :0.2,
						        stroke:  (i%cnvConfig.canvas_grid.subdiv) ? "#888888" :"#000000",
						        points: [I, 0, I, gridHeight]
			    });
			    gridGrp.add(l);
			    //cdLayer.add(l);
			}
			for (j = 0; j < vCount + 1; j++) {
			    var J = j * cellSize;
			    var l2 = new Kinetic.Line({
			    	strokeWidth:(j%cnvConfig.canvas_grid.subdiv) ? 0.1 :0.2,
			        stroke:  (j%cnvConfig.canvas_grid.subdiv) ? "#888888" :"#000000",
			        points: [0, J, gridWidth, J]
			    });
			    gridGrp.add(l2);
			    //cdLayer.add(l2);
			}
			
		cdLayer.add(gridGrp);
		if(!cnvConfig.canvas_grid.show_grid){
			gridGrp.hide();
		}
		cdLayer.draw();
	},
	showHideGrid: function(showGrid){
		console.log("@cs.showHideGrid");
		var grid = this.getGroup('canvas_grid');
		var cdLayer = this.getLayer();
		if(showGrid == true) {
			grid.show();
		} else {
			grid.hide();
		}
		cdLayer.draw();
	},
	createCanvasBaseFrame: function() {
		var stg = this.getCanvas();
		var cdLayer = this.getLayer();
		var base_framegrp = this.getGroup('frame_0');	
		cdLayer.draw();
	},
	
	addMedia : function(imgName,img) {
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		if(activeType == 'label'){
			this.addImagetoLabel(imgName);
			window.CD.services.ds.updateImageList(imgName,'add');
			$('#imageDiv .selectedBackground').addClass("usedMedia");
		}else if(activeType == 'frame'){
			if(activeElm.attrs.id == 'frame_0'){
				this.addImagetoCanvas(imgName,img);
			}
			else{
				this.addImagetoFrame(imgName,img);
			}
			window.CD.services.ds.updateImageList(imgName,'add');
			$('#imageDiv .selectedBackground').addClass("usedMedia");
		}
	},
	addAudio : function(audioName) {
		var activeElm = window.CD.elements.active.element[0];
		var activeType = window.CD.elements.active.type;
		
		if(activeType == 'label'){
			this.addAudiotoLabel(audioName);
			window.CD.services.ds.updateAudioUsage(audioName,true);
		}
		if(activeType == 'dock'){
			if(typeof window.CD.module.data.getPRGDockIndex == "function"){
				this.addAudiotoDock(audioName);
				window.CD.services.ds.updateAudioUsage(audioName,true);
			}else{
				var errorModal = window.CD.util.getTemplate({url: 'resources/themes/default/views/error_modal.html?{build.number}'});
				var alertMsg = "Audio can not be inserted in a dock.<br/>  Select a label, frame, or the canvas to insert audio.";
				
				if(alertMsg != ""){
					$('#toolPalette #errorModal').remove();
					$('#toolPalette').append(errorModal);
					
					$("#errorModal span#errorCancel").hide();
					$("#errorModal span#errorOk").html("Ok");
					$('#alertText .frame_warning_text').show();
					$('#errorModal #errAlertText').html(alertMsg);
					$('#errorModal').slideDown(200);		
					$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
				}
				$("#errorContainer span#errorOk").off('click').on('click',function(){						
					$('#errorModal').slideUp(200);
				});
				
				
			}
		}else if(activeType == 'frame'){
			if(activeElm.attrs.id == 'frame_0')
				this.addAudiotoCanvas(audioName);
			else
				this.addAudiotoFrame(audioName);
			window.CD.services.ds.updateAudioUsage(audioName,true);
		}
	},
	addImagetoCanvas: function(imgName,img) {
		console.log("@canvasserives.addImagetoCanvas");
		try{
			var cd = window.CD;
			var cdLayer = this.getLayer();
			var imageName = imgName;
			var frameGroup = this.getGroup('frame_0');
			var frameIndex = 0;
			var imageLastSeq = 0;
			if(!frameGroup) {
				frameGroup = this.getGroup('frame_0');
			}
			var imgLen = this.objLength(window.CD.module.data.Json.FrameData[frameIndex].frameImageList);
			if(imgLen > 0){
				imageLastSeq = parseInt(this.objLastSequence(window.CD.module.data.Json.FrameData[frameIndex].frameImageList)) + 1;
			}
			var imageGrpId = 'img_' + frameIndex + '_' + imageLastSeq;

			var imgProperties = {
					'imageX':140+(imageLastSeq*20),
					'imageY':100+(imageLastSeq*20),
					'imageName':imageName,
					'imageScaleFactor':1,
					'height':'',
					'width':'',
					'absolutePosition':true,
					'zIndex':''
			};
			if(img.length>1){
				window.CD.module.data.tempImgName.push(imgProperties);
				window.CD.module.data.tempImgId.push(imageGrpId);
			}
			loadImage(frameGroup,imageGrpId,imgProperties,'add',img);
		}catch(err){
			console.error("unable to add image to canvas::"+err.message);
		}
	},
	addAudiotoCanvas: function(audioName,cordinate,frGrp) {
		console.log("@canvasserives.addAudiotoCanvas");
		try{
			var cd = window.CD;
			var cs = cd.services.cs;
			var cdLayer = cs.getLayer();
			var audName = audioName;			
			var frameIndex = 0;
			if(frGrp){
				var frameGroup = cs.findGroup(frGrp.attrs.id);
			}else{
				var frameGroup = cs.getGroup('frame_0');
				if(!frameGroup) {
					frameGroup = cs.getGroup('frame_0');
				}
			}
			
			var audioGrpId = 'audio_' + frameIndex;
			var x =0, y=0;
			if(cordinate){
				x = cordinate.x;
				y = cordinate.y;
			}
			loadAudioImage(frameGroup,audioGrpId,audioName,x,y);
		}catch(err){			
			console.error("unable to add audio to canvas::"+err.message);
		}
	},
	addImagetoLabel: function(imgName) {
		console.log("@canvasserives.addImagetoLabel");
		try{
			if(window.CD.services.ds.getEt() != 'PRG'){ /*temporary fix*/
			var cd = window.CD;
			var cdLayer = this.getLayer();
			var imageName = imgName;
			var labelGroup = this.getActiveLabel();
			if(!(labelGroup.attrs.id.match(/^label_[0-9]+/))){
				labelGroup = labelGroup.parent;
			}		
			var imageGrpId = 'img_' + labelGroup.attrs.id;			
			loadImageforLabel(labelGroup,imageGrpId,imgName);
			cdLayer.draw();
			}
		}catch(err){
			console.error("unable to add image to label::"+err.message);
		}
	},
	addAudiotoDock: function(audioName,cordinate,dockGrp) {
		console.log("@canvasserives.addAudiotoDock");
		//try{
		
		var cd = window.CD;
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var audioName = audioName;
		if(dockGrp){
			var dockGroup = cs.findGroup(dockGrp.attrs.id);
		}else{
			var dockGroup = cs.getActiveDock();
			if(!((dockGroup.attrs.id.match(/^dock_label_[0-9]+/) || (dockGroup.attrs.id.match(/^dock_[0-9]+/))))){
				dockGroup = dockGroup.parent;
			}
		}
		
		var x =0, y=0;
		if(cordinate){
			x = cordinate.x;
			y = cordinate.y;
		}
		var audioGrpId = 'audio_' + dockGroup.attrs.id;	
		if(dockGroup.get('#'+audioGrpId)[0]){
			dockGroup.get('#'+audioGrpId)[0].removeChildren();
			dockGroup.get('#'+audioGrpId)[0].remove();
			cdLayer.draw();
		}
		
		loadAudioImage(dockGroup,audioGrpId,audioName,x,y);
		
		cdLayer.draw();
		 
	//	}catch(err){
		//	console.error("unable to add image to label::"+err.message);
		//}
	},
	addAudiotoLabel: function(audioName,cordinate,labelGrp) {
		console.log("@canvasserives.addImagetoLabel");
		try{
			var cd = window.CD;
			var cs = cd.services.cs;
			var cdLayer = cs.getLayer();
			var audioName = audioName;
			
			if(labelGrp){
				var labelGroup = cs.findGroup(labelGrp.attrs.id);
			}else{
				var labelGroup = cs.getActiveLabel();
				if(!(labelGroup.attrs.id.match(/^label_[0-9]+/))){
					labelGroup = labelGroup.parent;
				}
			}
			var x =0, y=0;
			if(cordinate){
				x = cordinate.x;
				y = cordinate.y;
			}
			
			var audioGrpId = 'audio_' + labelGroup.attrs.id;
			if(labelGroup.get('#'+audioGrpId)[0]){
				labelGroup.get('#'+audioGrpId)[0].removeChildren();
				labelGroup.get('#'+audioGrpId)[0].remove();
				cdLayer.draw();
			}
			
			loadAudioImage(labelGroup,audioGrpId,audioName,x,y);
			
			cdLayer.draw();
		}catch(err){
			console.error("unable to add audio to label::"+err.message);
		}
	},
	addImagetoFrame: function(imgName,img) {
		try{
			console.log("@canvasserives.addImagetoFrame");
			var cd = window.CD;
			var cdLayer = this.getLayer();
			var imageName = imgName;
			var imageLastSeq = 0;
			var frameGroup = this.getActiveFrame();
			var frameId = frameGroup.attrs.id;
			
			var frameLen = this.objLength(window.CD.module.data.Json.FrameData);
			if(!frameGroup) {
				frameGroup = this.getGroup('frame_0');
			}
			for(var key in window.CD.module.data.Json.FrameData){
				if(window.CD.module.data.Json.FrameData[key].frameGroupID == frameId){
					var frameIndex = key;
				}
			}
			var imgLen = this.objLength(window.CD.module.data.Json.FrameData[frameIndex].frameImageList);
			if(imgLen > 0){
				imageLastSeq = parseInt(this.objLastSequence(window.CD.module.data.Json.FrameData[frameIndex].frameImageList)) + 1;
			}
			var imageGrpId = 'img_' + frameIndex + '_' + imageLastSeq;
			
			var imgProperties = {
					'imageX':0,
					'imageY':(imageLastSeq*20),
					'imageName':imageName,
					'imageScaleFactor':1,
					'height':'',
					'width':'',
					'absolutePosition':true
			};
			if(img.length>1){
				window.CD.module.data.tempImgName.push(imgProperties);
				window.CD.module.data.tempImgId.push(imageGrpId);
			}
			loadImage(frameGroup,imageGrpId,imgProperties,'add',img);
		}catch(err){
			console.error("unable to add image to frame::"+err.message);
		}
	},
	
	addAudiotoFrame: function(audioName,cordinate,frGroup) {
		try{
			console.log("@canvasserives.addAudiotoFrame");
			var cd = window.CD;
			var cs = cd.services.cs;
			var cdLayer = cs.getLayer();
			var audioName = audioName;		
			
			if(frGroup){
				var frameGroup = cs.findGroup(frGroup.attrs.id);
			}else{
				var frameGroup = cs.getActiveFrame();
				if(!frameGroup) {
					frameGroup = cs.getGroup('frame_0');
				}
			}
			var frameIndex = frameGroup.attrs.id.split('_')[1];
			var x =0, y=0;
			if(cordinate){
				x = cordinate.x;
				y = cordinate.y;
			}
			var audioGrpId = 'audio_' + frameGroup.attrs.id;
			
			loadAudioImage(frameGroup,audioGrpId,audioName,x,y);
			
			cdLayer.draw()
		}catch(err){
			console.error("unable to add image to frame::"+err.message);
		}
	},
	
	getObjectContainerFrame: function(obj) {
		while(!obj.attrs.id.match(/^frame_[0-9]+/))
			obj = obj.parent;
		return obj;
	},
	getParentFrame: function(obj) {
		if(obj.attrs.id.match(/frame_[0-9]+/))
			return this.getCanvas();
		/*if(obj.nodeType == 'Layer')
			return this.getCanvas();*/
		while(!obj.attrs.id.match(/frame_[0-9]+/)) {	
			if(obj.nodeType == 'Layer')
				return this.getCanvas();
			obj = obj.parent;			
			if(obj.attrs.id == 'frame_0')
				return this.getCanvas();
		}
		return obj;
	},
	getActiveFrame: function() {
		var obj = window.CD.elements.active.element[0];
		if(obj) {
			while(!obj.attrs.id.match(/frame_[0-9]+/))
				obj = obj.parent;
			return obj;
		}
	},
	getActiveLabel: function() {
		var obj = window.CD.elements.active.element[0];
		if(obj) {
			while(!obj.attrs.id.match(/label_[0-9]+/))
				obj = obj.parent;
			return obj;
		}
	},
	getActiveDock: function() {
		var obj = window.CD.elements.active.element[0];
		if(obj) {
			while(!obj.attrs.id.match(/^dock_[0-9a-z_]+/))
				obj = obj.parent;
			return obj;
		}
	},
	 addMasktool: function(){	  
		  var maskTop = $('#toolPalette').position().top;
			var maskLeft = $('#toolPalette').position().left;
			var maskWidth = $('#toolPalette').width();
			var maskHeight = $('#toolPalette').height();
			var maskToolBar = $('<div id="maskTool" style="position:absolute;opacity:0.05;z-index:99;"></div>');
			maskToolBar.css({ top: maskTop+'px', left: maskLeft+'px', width:maskWidth+'px', height:maskHeight+'px'});
			 $('body').append(maskToolBar);
	  },
	getFrameIndex: function(frameId) {
		//var frmIdIndex=frameId.split('_')[1];
		var frmIndex;
		var  outputJson = window.CD.module.data.Json;
		$.each(outputJson.FrameData,function(index,value){
			if(outputJson.FrameData[index] && outputJson.FrameData[index].frameGroupID && outputJson.FrameData[index].frameGroupID == frameId){
				frmIndex= index;
			}
		});
		if(!frmIndex)
		{
			frmIndex=frameId.split('_')[1]
		}
		return frmIndex;
	},
	
	objLength: function(obj){
		var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	},
	objLastSequence: function(obj){
		var size = 0, key;
		var lastSeq = 0;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	        lastSeq = key.split('_')[2];
	    }
	    return lastSeq;
	},

	resizeHandlar: function(oldActiveElm, newActiveElm) {
		console.log("@canvasserives.resizeHandlar");
		try{
			var cdLayer = this.getLayer();
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			if(oldActiveElm && cdLayer.get('#'+oldActiveElm.attrs.id)[0] && oldActiveElm.attrs.id != 'frame_0'){
				var parentNode = oldActiveElm.parent;
				if(parentNode){//This is done as oldActiveElm could have been deleted then parentNode is undefined
					var foundObj = cs.findObject(parentNode,oldActiveElm.attrs.id);
					if(oldActiveElm && foundObj.children.length>0 && oldActiveElm.nodeType == 'Group' && oldActiveElm.children.length>0 && oldActiveElm.attrs.id.match(/(frame_|img_|label_|dock_)[0-9]+/)) {
						var oldActiveElmId = oldActiveElm.attrs.id;
						if(oldActiveElm.get('.topLeft_' + oldActiveElmId)[0])
							oldActiveElm.get('.topLeft_' + oldActiveElmId)[0].hide();
						if(oldActiveElm.get('.topRight_' + oldActiveElmId)[0])
							oldActiveElm.get('.topRight_' + oldActiveElmId)[0].hide();
						if(oldActiveElm.get('.bottomLeft_' + oldActiveElmId)[0])
							oldActiveElm.get('.bottomLeft_' + oldActiveElmId)[0].hide();
						if(oldActiveElm.get('.bottomRight_' + oldActiveElmId)[0])
							oldActiveElm.get('.bottomRight_' + oldActiveElmId)[0].hide();			
					}
				}				
			}			
			
			if(newActiveElm && newActiveElm.nodeType == 'Group' && newActiveElm.children.length>0 && newActiveElm.attrs.id.match(/(frame_|img_|label_|dock_)[0-9]+/) && newActiveElm.attrs.id != 'frame_0') {
				var newActiveElmId = newActiveElm.attrs.id;
				var status = true;
				if(newActiveElmId.match(/^dock_label_[0-9]+/) != null && ds.getEt() == 'SLE'){
					var jsonAdminData = window.CD.module.data.getJsonAdminData();
					var dockSameSize = jsonAdminData.DOCSAMEASLABEL;
					if(dockSameSize == true){
						status = false;
					}
				}
				if(status == true){
					if(newActiveElm.get('.topLeft_' + newActiveElmId)[0])
						newActiveElm.get('.topLeft_' + newActiveElmId)[0].show();
					if(newActiveElm.get('.topRight_' + newActiveElmId)[0])
						newActiveElm.get('.topRight_' + newActiveElmId)[0].show();
					if(newActiveElm.get('.bottomLeft_' + newActiveElmId)[0])
						newActiveElm.get('.bottomLeft_' + newActiveElmId)[0].show();
					if(newActiveElm.get('.bottomRight_' + newActiveElmId)[0])
						newActiveElm.get('.bottomRight_' + newActiveElmId)[0].show();
				}									
			}
			cdLayer.draw();
			
			if(oldActiveElm && this.groupExists(oldActiveElm.attrs.id) && oldActiveElm.nodeType == 'Group' && oldActiveElm.children.length>0 && oldActiveElm.attrs.id.match(/(frame_)[0-9]+/) && oldActiveElm.attrs.id != 'frame_0') {
				$('#applyFrameChanges').addClass('inactive');
				$('#alignLabelsToFrame').addClass('inactive');
			}
			
			if(newActiveElm && newActiveElm.nodeType == 'Group' && newActiveElm.children.length>0 && newActiveElm.attrs.id.match(/(frame_)[0-9]+/) && newActiveElm.attrs.id != 'frame_0') {
				
				$('#activeFrameWidth').val(newActiveElm.children[0].getWidth());
				$('#activeFrameHeight').val(newActiveElm.children[0].getHeight());
				$('#applyFrameChanges').removeClass('inactive');
				/* -------- Modified to make align labels to frame button active ----------- */
				var data = window.CD.module.data.getJsonData();
				var count = cs.objLength(data);
				if(count && count>0)
					$('#alignLabelsToFrame').removeClass('inactive');
				else
					$('#alignLabelsToFrame').addClass('inactive');
				if(!newActiveElm.children[0].getFill() || newActiveElm.children[0].getFill() == 'transparent') {
					$('#fillFrame').prop('checked',false);
				} else {
					$('#fillFrame').prop('checked',true);
				}
			}
			
		
		}catch(err){
			console.error("unable to add image to resize::"+err.message);
		}
	},
	
	cloneObject: function(obj) {
		var clone = {};
        for(var i in obj) {
            if(typeof(obj[i])=="object" && Object.prototype.toString.call( obj[i] ) != '[object Array]')
                clone[i] = this.cloneObject(obj[i]);
            else
                clone[i] = obj[i];
        }
        return clone;
	},
	updateDragBound: function(group) {
		console.log("@canvasserives.updateDragBound");
		try{
			var cdLayer = this.getLayer();
			var target = this.getParentFrame(group);
			if(group.attrs.id.match(/img_label_[0-9]+/) || group.attrs.id.match(/audio_label_[0-9]+/) || group.attrs.id.match(/audio_frame_[0-9]+/)  || group.attrs.id.match(/audio_dock_label_[0-9]+/)){
				target = group.parent;
			}
			
			var dragOnStage = true;
			if(target.nodeType != 'Layer' && target.nodeType != 'Stage') {
				dragOnStage = false;
			}
		
			group.setDragBoundFunc(function(pos){            
				
				var newX = 0;
				var newY = 0;
				
				if(dragOnStage) {			
					var stgH = parseInt(target.getHeight());
					var stgW = parseInt(target.getWidth());
					if((pos.x + parseInt(group.children[0].getWidth())) > stgW) {
						newX = stgW - parseInt(group.children[0].getWidth());
					} else if(pos.x < 15) {
						newX = 15;
					} else {
						newX = pos.x;
					}
					
					if((pos.y + parseInt(group.children[0].getHeight())) > stgH) {
						newY = stgH - parseInt(group.children[0].getHeight());
					} else if(pos.y < 15) {
						newY = 15;
					} else {
						newY = pos.y
					}
				} else {
					var stgH = parseInt(target.children[0].getHeight());
					var stgW = parseInt(target.children[0].getWidth());
					var targetId = target.attrs.id;
					if(pos.x - 15 < target.getX()) {
						newX = target.getX() + 15;
					} else if((pos.x - 15 - target.getX() + parseInt(group.children[0].getWidth())) > stgW) {
						newX = target.getX() + 15 + parseInt(target.children[0].getWidth()) - parseInt(group.children[0].getWidth());
					} else {
						newX = pos.x;
					}
					
					if(group.attrs.id.indexOf('audio_') != -1){
						if(pos.y - 15 < target.getY()) {
							newY = target.getY() + 15;
						} else if((pos.y - target.getY()) > stgH) {
							newY = target.getY() + 15 + target.children[0].getHeight() - group.children[0].getHeight();
						} else {
							newY = pos.y;
						}
					}else{
						if(pos.y - 15 < target.getY()) {
							newY = target.getY() + 15;
						} else if((pos.y - target.getY() + group.children[0].getHeight()) > stgH) {
							newY = target.getY() + 15 + target.children[0].getHeight() - group.children[0].getHeight();
						} else {
							newY = pos.y;
						}
					}
				}

			    return {
			            x: newX,
			            y: newY
			           };
			    });
			    cdLayer.draw();
		
		}catch(err){
			console.error("unable to Drag::"+err.message);
		}
	},
	dragLockUnlock: function(group,w,h,isDraggable) {
		console.log("@canvasserives.dragLockUnlock");
		try{
			var ds = window.CD.services.ds;
			var cs = window.CD.services.cs;
			var groupId = group.attrs.id;
			var undoMng = window.CD.undoManager;
			var cdLayer = this.getLayer();
			var unlockIcon = new Image();
			unlockIcon.src = window.CD.util.getImageUrl() + 'unlock.png';
			if (unlockIcon.complete) {
				var unlockImg = new Kinetic.Image({
					x: w - 20,
					y: h - 20,
					image: unlockIcon,
					width: 16 ,
					height: 16,
					name: 'unlockicon_' + groupId
				});
				group.add(unlockImg);
				if(!isDraggable)
					unlockImg.hide();
				unlockImg.on('click',function(){
					undoMng.register(this, cs.toggleLockUnlock,[this.parent] , 'Toggle lock unlock undo',this, cs.toggleLockUnlock,[this.parent],'Toggle lock unlock redo');
					updateUndoRedoState(undoMng);
					this.hide();
					this.parent.get('.lockicon_' + this.parent.attrs.id)[0].show();
					this.parent.setDraggable(false);
					this.moveUp();
					cdLayer.draw();
					if(this.parent.attrs.id.match(/frame_[0-9]+/)) {
						var containerFrame =  this.parent;
						var frameIndexInOutputData =  cs.getFrameIndex(containerFrame.attrs.id);
						window.CD.module.data.Json.FrameData[frameIndexInOutputData].lockStatus = true;
						ds.setOutputData();
					} else {
						 if(typeof window.CD.module.data.updateLockStatus == "function"){
							 window.CD.module.data.updateLockStatus(this.parent,true);
						 } 
					}
					/*else if(this.parent.attrs.id.match(/label_[0-9]+/)) {
						var containerFrame =  this.parent;
						var frameIndexInOutputData =  cs.getFrameIndex(containerFrame.attrs.id);
						window.CD.module.data.Json.FrameData[frameIndexInOutputData].lockStatus = true;
						ds.setOutputData();
					}*/
				});
			} else {
				unlockIcon.onload = function() {
					var unlockImg = new Kinetic.Image({
						x: w - 20,
						y: h - 20,
						image: unlockIcon,
						width: 16 ,
						height: 16,
						name: 'unlockicon_' + groupId
					});
					group.add(unlockImg);
					if(!isDraggable)
						unlockImg.hide();
					unlockIcon.onload=function(){};
					unlockImg.on('click',function(){
						undoMng.register(this, cs.toggleLockUnlock,[this.parent] , 'Toggle lock unlock undo',this, cs.toggleLockUnlock,[this.parent] , 'Toggle lock unlock redo');
						updateUndoRedoState(undoMng);
						this.hide();
						this.parent.get('.lockicon_' + this.parent.attrs.id)[0].show();
						this.parent.setDraggable(false);
						this.moveUp();
						cdLayer.draw();
						if(this.parent.attrs.id.match(/frame_[0-9]+/)) {
							var containerFrame =  this.parent;
							var frameIndexInOutputData =  cs.getFrameIndex(containerFrame.attrs.id);
							window.CD.module.data.Json.FrameData[frameIndexInOutputData].lockStatus = true;
							ds.setOutputData();
						}else {
							 if(typeof window.CD.module.data.updateLockStatus == "function"){
								 window.CD.module.data.updateLockStatus(this.parent,true);
							 } 
						}
					});
				};
			}
			var lockIcon = new Image();
			lockIcon.src = window.CD.util.getImageUrl() + 'lock.png';
			if (lockIcon.complete) {
				var lockImg = new Kinetic.Image({
					x: w - 20,
					y: h - 20,
					image: lockIcon,
					width: 16 ,
					height: 16,
					name: 'lockicon_' + groupId
				});
				group.add(lockImg);
				if(isDraggable)
					lockImg.hide();
				cdLayer.draw();
				lockImg.on('click',function(){
					undoMng.register(this, cs.toggleLockUnlock,[this.parent] , 'Toggle lock unlock undo' ,this, cs.toggleLockUnlock,[this.parent] , 'Toggle lock unlock redo');
					updateUndoRedoState(undoMng);
					this.hide();
					this.parent.get('.unlockicon_' + this.parent.attrs.id)[0].show();
					this.parent.setDraggable(true);
					this.moveUp();
					cdLayer.draw();
					if(this.parent.attrs.id.match(/frame_[0-9]+/)) {
						var containerFrame =  this.parent;
						var frameIndexInOutputData =  cs.getFrameIndex(containerFrame.attrs.id);
						window.CD.module.data.Json.FrameData[frameIndexInOutputData].lockStatus = false;
						ds.setOutputData();
					}else {
						 if(typeof window.CD.module.data.updateLockStatus == "function"){
							 window.CD.module.data.updateLockStatus(this.parent,false);
						 } 
					}
				});
			} else {
				lockIcon.onload = function() {
					var lockImg = new Kinetic.Image({
						x: w - 20,
						y: h - 20,
						image: lockIcon,
						width: 16 ,
						height: 16,
						name: 'lockicon_' + groupId
					});
					group.add(lockImg);
					if(isDraggable)
						lockImg.hide();
					cdLayer.draw();
					lockIcon.onload=function(){};
					lockImg.on('click',function(){
						undoMng.register(this, cs.toggleLockUnlock,[this.parent] , 'Toggle lock unlock undo',this, cs.toggleLockUnlock,[this.parent] , 'Toggle lock unlock redo');
						updateUndoRedoState(undoMng);
						this.hide();
						this.parent.get('.unlockicon_' + this.parent.attrs.id)[0].show();
						this.parent.setDraggable(true);
						this.moveUp();
						cdLayer.draw();
						if(this.parent.attrs.id.match(/frame_[0-9]+/)) {
							var containerFrame =  this.parent;
							var frameIndexInOutputData =  cs.getFrameIndex(containerFrame.attrs.id);
							window.CD.module.data.Json.FrameData[frameIndexInOutputData].lockStatus = false;
							ds.setOutputData();
						}else {
							 if(typeof window.CD.module.data.updateLockStatus == "function"){
								 window.CD.module.data.updateLockStatus(this.parent,false);
							 } 
						}
					});
				};
			}
			group.setDraggable(isDraggable);
		}catch(err){
			console.error("unable to add image to lock unlock::"+err.message);
		}
	},
	toggleLockUnlock : function(group) {
		console.log("@canvasserives.toggleLockUnlock");
		try{
			var ds = window.CD.services.ds;
			var cs = window.CD.services.cs;
			var groupId = group.attrs.id;
			var undoMng = window.CD.undoManager;
			var cdLayer = this.getLayer();
			if(this.parent.get('.unlockicon_' + this.parent.attrs.id)[0].isVisible()){
				var obj = group.get('.unlockicon_' + this.parent.attrs.id)[0];
				obj.hide();
				group.get('.lockicon_' + this.parent.attrs.id)[0].show();
				group.setDraggable(false);
				obj.moveUp();
				cdLayer.draw();
				if(group.attrs.id.match(/frame_[0-9]+/)) {
					var containerFrame =  this.parent;
					var frameIndexInOutputData =  cs.getFrameIndex(containerFrame.attrs.id);
					window.CD.module.data.Json.FrameData[frameIndexInOutputData].lockStatus = true;
					ds.setOutputData();
				}else {
					 if(typeof window.CD.module.data.updateLockStatus == "function"){
						 window.CD.module.data.updateLockStatus(this.parent,true);
					 } 
				}
			} else {
				var obj = group.get('.lockicon_' + this.parent.attrs.id)[0];
				obj.hide();
				group.get('.unlockicon_' + this.parent.attrs.id)[0].show();
				group.setDraggable(true);
				obj.moveUp();
				cdLayer.draw();
				if(group.attrs.id.match(/frame_[0-9]+/)) {
					var containerFrame =  this.parent;
					var frameIndexInOutputData =  cs.getFrameIndex(containerFrame.attrs.id);
					window.CD.module.data.Json.FrameData[frameIndexInOutputData].lockStatus = false;
					ds.setOutputData();
				}else {
					 if(typeof window.CD.module.data.updateLockStatus == "function"){
						 window.CD.module.data.updateLockStatus(this.parent,false);
					 } 
				}
			}
		}catch(err){
			console.error("unable to toggle lock unlock::"+ err);
		}
		
	},
	
	resetToolbar: function(){
		var createTools = window.CD.tools.create;
		var textToolClicked=$('#toolPalette li#'+createTools[1]).data('clicked');
		if(!textToolClicked){
			$('#toolPalette li#'+createTools[0]).addClass('active');
		}
	},
	
	findObject:function(node,id) {
		for(var i=0; i<node.children.length; i++) {
			if(node.children[i].nodeType == "Group" && node.children[i].attrs.id==id){
				return node.children[i];
			}
		}
	},
	
	getFrameTextIndex : function(frameIndex,txtObjId) {
		try{
			var cs = window.CD.services.cs;
			var frameData = window.CD.module.data.Json.FrameData[frameIndex];
			var frameTextLength = cs.objLength(frameData.frameTextList);
			
			for(i=0;i<frameTextLength;i++){
				if(frameData.frameTextList[i].textGroupObjID == txtObjId)
					return i;
			}			
		}catch(err){
			console.log("error in getFrameTextIndex:canvasservices.js::"+ err.message);
		}
	},
	/**
	 * This method is used for checking availability of the imageName
	 * in anywhere else
	 * called from removeArrayElm() :: Util.js
	 */
	checkImageAvailableStatus : function(imageName) {
		try{
			/** checks if imageName is present in any other frame or not **/
			var imgAvlStatusInFrame = window.CD.module.frame.imageAvailableStatusInFrame(imageName);
			
			if(!imgAvlStatusInFrame){
				/** if imageName is not present in any frame,it will check the imageName is present in any label or not **/
				if(typeof window.CD.module.view.imageAvailableStatusInLabel == "function"){
					var imgAvlStatusInLbl = window.CD.module.view.imageAvailableStatusInLabel(imageName);
					if(imgAvlStatusInLbl){
						return false;
					}else{
						return true;
					}
				}else{
					return true;
				}
			}else{
				return false;
			}
		}
		catch(err){
			console.log("error in checkImageAvailableStatus:canvasservices.js::"+ err.message);
		}
	},
	checkAudioAvailableStatus : function(audioName) {
		try{
			/** checks if imageName is present in any other frame or not **/
			var audioAvlStatusInFrame = window.CD.module.frame.audioAvailableStatusInFrame(audioName);
			
			if(!audioAvlStatusInFrame){
				/** if imageName is not present in any frame,it will check the imageName is present in any label or not **/
				if(typeof window.CD.module.view.audioAvailableStatusInLabel == "function"){
					var audAvlStatusInLbl = window.CD.module.view.audioAvailableStatusInLabel(audioName);
					if(audAvlStatusInLbl){
						return false;
					}else{
						return true;
					}
				}else{
					return true;
				}
			}else{
				return false;
			}
		}
		catch(err){
			console.log("error in checkImageAvailableStatus:canvasservices.js::"+ err.message);
		}
	},
	updateMoveToTopBottomState : function(activeElement){
		var parentObj = activeElement.parent;
		var elementType = activeElement.attrs.id.split('_')[0];
		var parentLength = parentObj.children.length;
		var count = 0;
		var activeElmId = activeElement.attrs.id;
		if(activeElmId != 'frame_0'){
			for(var i=0; i<parentLength;i++){
				var childId = parentObj.children[i].attrs.id;
				if(childId){
					var childType = childId.split('_')[0];
					if(childType){
						if(elementType == parentObj.children[i].attrs.id.split('_')[0]){
							count++;
						}
					}				
				}			
			}
		}
		
		if(elementType == 'frame'){
			count = count - 1;
		}	
		if(count>1){
			$('.tool_front').removeClass("inactive");
			$('.tool_back').removeClass("inactive");
			$('.tool_front').addClass("active");
			$('.tool_back').addClass("active");
		}
		else{
			$('.tool_front').removeClass("active");
			$('.tool_back').removeClass("active");
			$('.tool_front').addClass("inactive");
			$('.tool_back').addClass("inactive");
		}
	}
};