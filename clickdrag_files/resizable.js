function makeResizable(imageGroup, width, height, maintainRatio){
	width = parseInt(width);
	height = parseInt(height);
	addAnchor(imageGroup, 0, 0, "topLeft");
	addAnchor(imageGroup, width, 0, "topRight");
	addAnchor(imageGroup, width, height, "bottomRight");
	addAnchor(imageGroup, 0, height, "bottomLeft");
	
	function addAnchor(group, x, y, name, visible){
		var cnv = window.CD.services.cs;
		var stg = cnv.getCanvas();
		var cdLayer = cnv.getLayer();	
		var groupId = group.attrs.id;

		var undoMng = window.CD.undoManager;
        var anchor = new Kinetic.Circle({
          x: x,
          y: y,
          stroke: "#999999",
          fill: "#999999",
          strokeWidth: 1,
          radius: 3,
          name: name + '_' + groupId,
          draggable: true
        });
        anchor.hide();
        anchor.on("dragstart", function(evt) {
        	evt.cancelBubble = true;
	         this.hide();
	         if(group.attrs.id.match(/frame_|label_|dock_[0-9]+/)){
	        	  group.get('.lockicon_' + groupId)[0].setOpacity(0.01);
	        	  group.get('.unlockicon_' + groupId)[0].setOpacity(0.01);
	          }
	         cdLayer.draw();
	        });
        
        anchor.on("dragmove", function(evt) {  
        	evt.cancelBubble = true;
        		update(group, this);
        		cdLayer.draw();        	
        });
        anchor.on("mousedown touchstart", function(evt) {  
        	evt.cancelBubble = true;
	         group.setDraggable(false);
	          this.moveToTop();        	
        });
        anchor.on("dragend", function(evt) {
        	setPosition(this);
        	this.show();
        	if(group.attrs.id.match(/frame_|label_|dock_[0-9]+/) && group.get('.unlockicon_' + groupId)[0].isVisible() === true) {
        		group.setDraggable(true); 
        		if(group.attrs.id.match(/frame_[0-9]+/)){
        			var errorModal = window.CD.util.getTemplate({url: 'resources/themes/default/views/error_modal.html?{build.number}'});
        			
        			var frId =cnv.getFrameIndex(group.attrs.id);
        			var frameWidth = window.CD.module.data.Json.FrameData[frId].frameWidth;
        			var frameHeight = window.CD.module.data.Json.FrameData[frId].frameHeight;
        			var oldX = window.CD.module.data.Json.FrameData[frId].frameX;
        			var oldY = window.CD.module.data.Json.FrameData[frId].frameY;
        			var minFrameWidth = parseInt(window.CD.module.frame.frameMinWidth);
    				var minFrameHeight = parseInt(window.CD.module.frame.frameMinHeight);
    				var alertMsg = "";	
    				
    				var newH = group.children[0].getHeight();
        			var newW = group.children[0].getWidth();
        			
    				if(newW < minFrameWidth)
						alertMsg += "The width of the frame must be greater than or equal to "+minFrameWidth+". <br><br/>";
					if(newH < minFrameHeight)
						alertMsg += "The height of the frame must be greater than or equal to "+minFrameHeight+".";
        			
					if(alertMsg != ""){
						$('#toolPalette #errorModal').remove();
						$('#toolPalette').append(errorModal);
						
						$("#errorModal span#errorCancel").hide();
						$("#errorModal span#errorOk").html("Ok");
						$('#warningText .frame_warning_text').show();
						$('#errorModal #errAlertText').html(alertMsg);
						$('#errorModal').slideDown(200);		
						$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
					}
					$("#errorContainer span#errorOk").off('click').on('click',function(){	
						$('#errorModal').slideUp(200);
						
						var frameId = window.CD.elements.active.element[0].attrs.id.split('_')[1];
						var frameWidth = $('#activeFrameWidth').val();
	        			var frameHeight = $('#activeFrameHeight').val();
						$('#activeFrameWidth').val(frameWidth);
						$('#activeFrameHeight').val(frameHeight);
						group.children[0].setHeight(frameHeight);
	        			group.children[0].setWidth(frameWidth);
	        			setPosition(group.children[0]);
	        			window.CD.module.data.Json.FrameData[frameId].frameWidth = frameWidth;
	        			window.CD.module.data.Json.FrameData[frameId].frameHeight = frameHeight;
	        			cdLayer.draw();
	        			window.CD.services.ds.setOutputData();
					});
					
        			undoMng.register(this,window.CD.module.frame.undoResizeFrame,[group,frameWidth,frameHeight,oldX,oldY],'undo frame dimension change',this,window.CD.module.frame.undoResizeFrame,[group,newW,newH,this.parent.attrs.x,this.parent.attrs.y],'redo frame dimension change');
        			updateUndoRedoState(undoMng);
        		}else{
        			var frId = group.attrs.id.split('_')[1];
        		}
        		/*resizable for image on resize of frame commented*/
 //       		var imgList = window.CD.module.data.Json.FrameData[frId].frameImageList;
//        		for(var key in imgList){
//        			var imgGrp = cnv.getGroup(key);
//        			var imgObj = imgGrp.children[0];
//        			if(imgObj){
//        			var iw = parseInt(imgObj.getWidth());
//    				var ih = parseInt(imgObj.getHeight());     				
//    				var iratio = iw/ih;
//        			if((iw  + parseInt(imgGrp.getX()))> group.children[0].getWidth()){
//        				imgGrp.setX(0);
//        				imgGrp.setY(0);
//
//        				var exiratio = group.children[0].getWidth()/iw;
//    					iw = iw*exiratio;
//    					ih = iw / iratio;
//        				imgObj.setSize(iw, ih);  
//        			}
//        			if((ih + parseInt(imgGrp.getY()))> group.children[0].getHeight()) {
//        				imgGrp.setX(0);
//        				imgGrp.setY(0);
//    					var exiratio = group.children[0].getHeight()/ih;
//    					ih = ih*exiratio;
//    					iw = Math.round(iratio*ih);
//    					imgObj.setSize(iw, ih);    
//    				}
//        			imgGrp.get('.topLeft_' + key)[0].setPosition(0, 0);
//    				imgGrp.get('.topRight_' + key)[0].setPosition(iw, 0);
//    				imgGrp.get('.bottomRight_' + key)[0].setPosition(iw, ih);
//    				imgGrp.get('.bottomLeft_' + key)[0].setPosition(0, ih);
//    				cnv.updateDragBound(imgGrp);
//    				updateImageListData(imgObj);
//        			}
//        		}
        	
        	} else if(!group.attrs.id.match(/frame_|label_|dock_[0-9]+/)){
        		group.setDraggable(true); 
        	}
        	
        	if(group.attrs.id.match(/frame_[0-9]+/) && (alertMsg == "")){
        		window.CD.module.frame.updateInspector(group.attrs.id);
        	}
        	cdLayer.draw();
        	//evt.cancelBubble = true;
        });
        // add hover styling
        anchor.on("mouseover", function() {
          var layer = this.getLayer();
          document.body.style.cursor = "pointer";
          this.setStrokeWidth(3);
          cdLayer.draw();
        });
        anchor.on("mouseout", function() {
          var layer = this.getLayer();
          document.body.style.cursor = "default";
          this.setStrokeWidth(1);
          cdLayer.draw();
        });

        group.add(anchor);
	}
	
	function setPosition(handlar) {
		var group = handlar.parent;
		var groupId = group.attrs.id;
		var image = group.children[0];		
		var grpX = group.getX();
    	var grpY = group.getY();
    	var imgX = image.getX();
    	var imgY = image.getY();
    	group.setX(grpX+imgX);
    	group.setY(grpY+imgY);
    	image.setX(0);
    	image.setY(0);    	
    	
    	group.get('.topLeft_' + groupId)[0].setPosition(0, 0);
    	group.get('.topRight_' + groupId)[0].setPosition(image.getWidth(), 0);
		group.get('.bottomRight_' + groupId)[0].setPosition(image.getWidth(), image.getHeight());
		group.get('.bottomLeft_' + groupId)[0].setPosition(0, image.getHeight());

		var childrens = group.children;
		/*for(var i=0; i<childrens.length; i++){
			if(childrens[i].nodeType == "Group"){
				childrens[i].setX(0);
				childrens[i].setY(0);
			}
		}*/
		
		if(group.attrs.id.match(/frame_|label_|dock_[0-9]+/)){
			var lockIcon = group.get('.lockicon_' + groupId)[0];
			var unlockIcon = group.get('.unlockicon_' + groupId)[0];
			lockIcon.setX(image.getWidth() - 20);
			lockIcon.setY(image.getHeight() - 20);
			unlockIcon.setX(image.getWidth() - 20);
			unlockIcon.setY(image.getHeight() - 20);
			//group.get('.unlockicon_' + groupId)[0].show();
			group.get('.lockicon_' + groupId)[0].setOpacity(1);
	        group.get('.unlockicon_' + groupId)[0].setOpacity(1);
		}
		if(objectType(image.parent) == 'image') {
        	updateImageListData(image,'image');
        } else if(objectType(image.parent) == 'frame') {
        	updateFrameData(image);
        }		
		
	}
	 
	function update(group, activeHandle) {
			var ds = window.CD.services.ds;
			var groupId = group.attrs.id;
	        var topLeft = group.get(".topLeft_" + groupId)[0]==undefined ? activeHandle:group.get(".topLeft_" + groupId)[0],
	            topRight = group.get(".topRight_" + groupId)[0]==undefined ? activeHandle:group.get(".topRight_" + groupId)[0],
	            bottomRight = group.get(".bottomRight_" + groupId)[0]==undefined ? activeHandle:group.get(".bottomRight_" + groupId)[0],
	            bottomLeft = group.get(".bottomLeft_" + groupId)[0]==undefined ? activeHandle:group.get(".bottomLeft_" + groupId)[0],
	            image = group.children[0],
	            activeHandleName = activeHandle.getName(),
	            newWidth,
	            newHeight,
	            imageX,
	            imageY;
	  
	        // Update the positions of handles during drag.
	        // This needs to happen so the dimension calculation can use the
	        // handle positions to determine the new width/height.
	       var XtempVal = 0;
	       var YtempVal = 0;
	        switch (activeHandleName) {
	            case "topLeft_" + groupId:
	            	if((topRight.getX() -topLeft.getX() > 10) && (bottomLeft.getY()-topLeft.getY() > 10)) {
	            	XtempVal = topRight.getX() -topLeft.getX();
	            	YtempVal = bottomLeft.getY()-topLeft.getY();
	                topRight.setY(activeHandle.getY());
	                bottomLeft.setX(activeHandle.getX());
	            	} else {
	            		//activeHandle.setX(topRight.getX() - group.get('.img')[0].getWidth());
	            		activeHandle.setX(topRight.getX() - group.children[0].getWidth());
	            		//activeHandle.setY(bottomLeft.getY() - group.get('.img')[0].getHeight());
	            		activeHandle.setY(bottomLeft.getY() - group.children[0].getHeight());
	            	}
	                break;
	            case "topRight_" + groupId:
	            	if((topRight.getX() - topLeft.getX()> 10) && (bottomRight.getY() - topRight.getY() > 10)) {
	            		XtempVal = topRight.getX() - topLeft.getX();
	            		YtempVal = bottomRight.getY() - topRight.getY();
	            		topLeft.setY(activeHandle.getY());
	            		bottomRight.setX(activeHandle.getX());
	            	} else {
	            		//activeHandle.setX(topLeft.getX()+group.get('.img')[0].getWidth());
	            		activeHandle.setX(topLeft.getX()+group.children[0].getWidth());
	            		activeHandle.setY(topLeft.getY());
	            	}
	                break;
	            case "bottomRight_" + groupId:
	            	if((bottomRight.getX() - bottomLeft.getX() > 10) && (bottomRight.getY() - topRight.getY() > 10)) {
	            		XtempVal = bottomRight.getX() - bottomLeft.getX();
	            		YtempVal = bottomRight.getY() - topRight.getY();
	            		bottomLeft.setY(activeHandle.getY());
	            		topRight.setX(activeHandle.getX());	     
	            	} else {
	            		//activeHandle.setX(bottomLeft.getX()+group.get('.img')[0].getWidth());
	            		activeHandle.setX(bottomLeft.getX()+group.children[0].getWidth());
	            		//activeHandle.setY(topRight.getY() + group.get('.img')[0].getHeight());
	            		activeHandle.setY(topRight.getY() + group.children[0].getHeight());
	            	}
	                break;
	            case "bottomLeft_" + groupId:
	            	if((bottomLeft.getY()-topLeft.getY() > 10) && (bottomRight.getX() - bottomLeft.getX() > 10)) {	
	            		XtempVal = bottomRight.getX() - bottomLeft.getX();
	            		YtempVal = bottomLeft.getY()-topLeft.getY();	            		
	            		bottomRight.setY(activeHandle.getY());
	            		topLeft.setX(activeHandle.getX());
	            	} else {
	            		//activeHandle.setX(bottomRight.getX()- group.get('.img')[0].getWidth());
	            		activeHandle.setX(bottomRight.getX()- group.children[0].getWidth());
	            		//activeHandle.setY(topLeft.getY() + group.get('.img')[0].getHeight());
	            		activeHandle.setY(topLeft.getY() + group.children[0].getHeight());
	            	}
	                break;
	        }

	        if(XtempVal  > 10 && YtempVal > 10){
	        	//console.log(bottomLeft.getY() - activeHandle.getY());
		        // Calculate new dimensions. Height is simply the dy of the handles.
		        // Width is increased/decreased by a factor of how much the height changed.
		        newHeight = bottomLeft.getY() - topLeft.getY();
		        if(maintainRatio) {
		        	newWidth = group.get('.img')[0].getWidth() * newHeight / group.get('.img')[0].getHeight();
		        } else {
		        	newWidth = topRight.getX() - topLeft.getX()
		        }	        
	
		        // Move the image to adjust for the new dimensions.
		        // The position calculation changes depending on where it is anchored.
		        // ie. When dragging on the right, it is anchored to the top left,
		        //     when dragging on the left, it is anchored to the top right.
		        if(activeHandleName.match(/topRight_/) || activeHandleName.match(/bottomRight/)) {
		            image.setPosition(topLeft.getX(), topLeft.getY());
		        } else if(activeHandleName.match(/topLeft/) || activeHandleName.match(/bottomLeft/)) {
		            image.setPosition(topRight.getX() - newWidth, topRight.getY());
		        }
		        
		    	
				
	
		        imageX = image.getX();
		        imageY = image.getY();
	
		        // Update handle positions to reflect new image dimensions
		        topLeft.setPosition(imageX, imageY);
		        topRight.setPosition(imageX + newWidth, imageY);
		        bottomRight.setPosition(imageX + newWidth, imageY + newHeight);
		        bottomLeft.setPosition(imageX, imageY + newHeight);
	
		        // Set the image's size to the newly calculated dimensions
		        if(newWidth && newHeight) {
		            image.setSize(newWidth, newHeight);
		            
		            if(objectType(image.parent) == 'image') {
		            	//updateImageListData(image,'image');
		            } else if(objectType(image.parent) == 'frame') {
		            	updateFrameData(image);
		            }
		            
		        }
	        }	        
	      }
	
	function updateImageListData(image,data) {
		var ds = window.CD.services.ds;
		var cnv = window.CD.services.cs;
		var group = image.parent;
		var undoMng = window.CD.undoManager;
		var containerFrame =  cnv.getObjectContainerFrame(group);
		var frameIndexInOutputData =  cnv.getFrameIndex(containerFrame.attrs.id);
		if(data){
			var frameWidth = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameWidth;
			var frameHeight = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameHeight;
			var oldHeight = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].height;
			var oldWidth = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].width;
			var oldX = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].imageX;
			var oldY = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].imageY;
			var newHeight = Math.round(image.getHeight());
			var newWidth = Math.round(image.getWidth());
			var oldImageX = image.parent.getX(0);
			var oldImageY = image.parent.getY(0);
			if((newHeight>frameHeight) || (newWidth>frameWidth)){
				window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].height = oldHeight;
				window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].width = oldWidth;
				image.setHeight(oldHeight);
				image.setWidth(oldWidth);
				var groupId = image.parent.getId();
				image.parent.get('.topLeft_' + groupId)[0].setPosition(0, 0);
				image.parent.get('.topRight_' + groupId)[0].setPosition(image.getWidth(), 0);
				image.parent.get('.bottomRight_' + groupId)[0].setPosition(image.getWidth(), image.getHeight());
				image.parent.get('.bottomLeft_' + groupId)[0].setPosition(0, image.getHeight());
				
				image.parent.setX(oldX);
				image.parent.setY(oldY);
			}
			else{
				undoMng.register(this,undoImageDimensionChange,[oldWidth,oldHeight,image.parent,containerFrame,oldX,oldY],'Undo Image Dimension Change',this,undoImageDimensionChange,[newWidth,newHeight,image.parent,containerFrame,image.parent.attrs.x,image.parent.attrs.y],'Redo Image Dimension Change')
				updateUndoRedoState(undoMng);
			}
		}
		var oldOriginalWidth = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].originalWidth;
		window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].imageScaleFactor = Math.round(newWidth / oldOriginalWidth * 100) / 100;
		window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].imageX = image.parent.getX();
        window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].imageY = image.parent.getY();
    	window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].height = Math.round(image.getHeight());
        window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].width = Math.round(image.getWidth());        
        ds.setOutputData();
	}
	/**
	 * This method is used for undo/redo image dinemsion changes
	 * @param w(width)
	 * @param h(height)
	 * @param imageGrp
	 * @param containerFrame
	 * @author 552756(Nabonita Bhattacharyya)
	 */
	function undoImageDimensionChange(w,h,imageGrp,containerFrame,X,Y){
		try{
			var cs = window.CD.services.cs;
	    	var ds = window.CD.services.ds;
	    	var cdLayer = cs.getLayer();
	    	
	    	containerFrame = cs.findGroup(containerFrame.getId());
	    	var frameIndexInOutputData =  cs.getFrameIndex(containerFrame.attrs.id);
	    	
			/*handling error in frame image resizing while undo/redo*/
			
			imageGrp = containerFrame.get('#'+imageGrp.getId())[0];
			var imageObj = imageGrp.children[0];
			imageObj.setSize(parseInt(w),parseInt(h));
			imageGrp.get('.topLeft_' + imageGrp.attrs.id)[0].setPosition(0, 0);
			imageGrp.get('.topRight_' + imageGrp.attrs.id)[0].setPosition(imageObj.getWidth(), 0);
			imageGrp.get('.bottomRight_' + imageGrp.attrs.id)[0].setPosition(imageObj.getWidth(), imageObj.getHeight());
			imageGrp.get('.bottomLeft_' + imageGrp.attrs.id)[0].setPosition(0, imageObj.getHeight());
			if((X != undefined) || (Y != undefined)){
				imageGrp.setX(X);
				imageGrp.setY(Y);
			}
			cdLayer.draw();
			window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[imageGrp.attrs.id].height = Math.round(imageObj.getHeight());
	        window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[imageGrp.attrs.id].width = Math.round(imageObj.getWidth());        
	        ds.setOutputData();
		}
		catch(err){
			 console.error("@resizable.js::Error on undoImageDimensionChange::"+err.message);
		}
	}
	
	function updateFrameData(frame) {
		/*var group = frame.parent;
		var groupId = group.attrs.id;
		var lockIcon = group.get('.lockicon_' + groupId)[0];
		var unlockIcon = group.get('.lockicon_' + groupId)[0];
		lockIcon.setX(frame.getWidth());
		lockIcon.setY(frame.getHeight());*/
	}
	
	function objectType(obj) {
		if(obj.attrs.id.match(/frame_[0-9]+/)) {
			return 'frame';
		} else if(obj.attrs.id.match(/img_[0-9]+/)) {
			return 'image';
		} else if(obj.attrs.id.match(/label_[0-9]+/)) {
			return 'label';
		} else if(obj.attrs.id.match(/dock_[0-9]+/)) {
			return 'dock';
		}
	}
}