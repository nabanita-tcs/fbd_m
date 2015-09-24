function makeSLEResizable(imageGroup, width, height, maintainRatio){
	maintainRatio = maintainRatio || false;
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
		var ds = window.CD.services.ds;

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
        anchor.on("dragstart", function() {
	         this.hide();
	         if(group.attrs.id.match(/label_|dock_[0-9]+/)){
	        	  group.get('.lockicon_' + groupId)[0].setOpacity(0.01);
	        	  group.get('.unlockicon_' + groupId)[0].setOpacity(0.01);
	          }
	         cdLayer.draw();
	        });
        
        anchor.on("dragmove", function() {        	
        		update(group, this);
        		cdLayer.draw();        	
        });
        anchor.on("click touchstart", function() {        	
	          group.setDraggable(false);
	          
	          this.moveToTop();  
	          cdLayer.draw();
        });
       
        anchor.on("dragend", function(evt) {
        	evt.cancelBubble = true;
        	setPosition(this);
        	this.show();
        	//registerUndo(group,this.parent.children[0]);
        	if(group.attrs.id.match(/^label_[0-9]+/)) {
        		if(group.get('.unlockicon_' + groupId)[0].isVisible() === true){
        			group.setDraggable(true);
        		}
        		else
        			group.setDraggable(false);
        		 
        		/** ---- This is done for updating x and y of label on resize ---- **/
        		var sleCount = SLEData.getLabelIndex(this.parent.attrs.id);
        		var sleData = SLEData.getJsonData();
        		sleData[sleCount].holder_x = this.parent.getX();
        		sleData[sleCount].holder_y = this.parent.getY();
        		
        		var oldWidth = parseInt($('#labelWidth').val());
        		var oldHeight = parseInt($('#labelHeight').val());
        		var maxW = window.CD.width;
        		var maxH = window.CD.height;
        		var newW = parseInt(this.parent.children[0].getWidth());
        		var newH = parseInt(this.parent.children[0].getHeight());
        		
        		if(newW > maxW){
        			newW = oldWidth;
        		}
        		if(newH > maxH){
        			newH = oldHeight;
        		}
        		var sleModifiedData = {
        				'width':newW, 
        				'height':newH,
        				'fill':$('#labelFillGlob').prop('checked'),
        				'stroke':$('#labelBorderGlob').prop('checked'),
        				'strokeDock':$('#dockBorderGlob').prop('checked'),
        				'transpType':$('input[name=transparenType]:checked').val(),
        				'dockSameSize':SLEView.idDockSameAsLabel()
        		};
        		
        		$('#labelWidth').val(sleModifiedData.width);
        		$('#labelHeight').val(sleModifiedData.height);
        		
        		
        		SLEView.updateDimension(sleModifiedData);
        		
        	}else if(group.attrs.id.match(/^dock_label_[0-9]+/)) {
        		if(group.get('.unlockicon_' + groupId)[0].isVisible() === true){
                	group.setDraggable(true);
                }
        		else
        			group.setDraggable(false);
        		/** ---- This is done for updating x and y of dock on resize ---- **/
        		var sleCount = SLEData.getLabelIndex(this.parent.attrs.id.split('dock_')[1]);
        		var sleData = SLEData.getJsonData();
        		sleData[sleCount].doc_x = this.parent.getX();
        		sleData[sleCount].doc_y = this.parent.getY();
        		
        		
        		var oldWidth = parseInt($('#dockWidth').val());
        		var oldHeight = parseInt($('#dockHeight').val());
        		
        		var maxW = 500;
        		var maxH = 500;
        		
        		var newW = parseInt(this.parent.children[0].getWidth());
        		var newH = parseInt(this.parent.children[0].getHeight());
        		
        		if(newW > maxW){
        			newW = oldWidth;
        		}
        		if(newH > maxH){
        			newH = oldHeight;
        		}
        		
        		var lblWidth = parseInt($('#labelWidth').val());
        		var lblHeight = parseInt($('#labelHeight').val());
        		
        		var sleModifiedData = {
        				'width':lblWidth, 
        				'height':lblHeight, 
        				'dockWidth':newW, 
        				'dockHeight':newH, 
        				'fill':$('#labelFillGlob').prop('checked'),
        				'stroke':$('#labelBorderGlob').prop('checked'),
        				'strokeDock':$('#dockBorderGlob').prop('checked'),
        				'transpType':$('input[name=transparenType]:checked').val(),
        				'dockSameSize':SLEView.idDockSameAsLabel()
        		};
        		
        		$('#dockWidth').val(sleModifiedData.width);
        		$('#dockHeight').val(sleModifiedData.height);
        		
        		//var connGroup = cnv.findGroup('conn_'+group.attrs.id);
        		
        		//connGroup.setPosition( this.parent.children[0].getWidth()/2,this.parent.children[0].getHeight()/2 );
        		SLEView.resizeDock(sleModifiedData);
        		SLEView.applyPopulate();
        		SLEView.resetConnectorPos();
        	}
        	
        	cdLayer.draw();
        	ds.setOutputData();	
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

		if(group.attrs.id.match(/label_|dock_[0-9]+/)){
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
        	updateImageListData(image);
        } else if(objectType(image.parent) == 'frame') {
        	updateFrameData(image);
        }		
		
	}
	 
	function update(group, activeHandle) {
			var minSize = 29;
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
	            	if((topRight.getX() -topLeft.getX() > minSize) && (bottomLeft.getY()-topLeft.getY() > minSize)) {
		            	XtempVal = topRight.getX() -topLeft.getX();
		            	YtempVal = bottomLeft.getY()-topLeft.getY();
		            	if(typeof(activeHandle.getY()) != 'string' || typeof(activeHandle.getX()) != 'string'){
			                topRight.setY(activeHandle.getY());
			                bottomLeft.setX(activeHandle.getX());
		            	}
	            	} else {
	            		//activeHandle.setX(topRight.getX() - group.get('.img')[0].getWidth());
	            		activeHandle.setX(topRight.getX() - group.children[0].getWidth());
	            		//activeHandle.setY(bottomLeft.getY() - group.get('.img')[0].getHeight());
	            		activeHandle.setY(bottomLeft.getY() - group.children[0].getHeight());
	            	}
	                break;
	            case "topRight_" + groupId:
	            	if((topRight.getX() - topLeft.getX()> minSize) && (bottomRight.getY() - topRight.getY() > minSize)) {
	            		XtempVal = topRight.getX() - topLeft.getX();
	            		YtempVal = bottomRight.getY() - topRight.getY();
	            		if(typeof(activeHandle.getY()) != 'string' || typeof(activeHandle.getX()) != 'string'){
		            		topLeft.setY(activeHandle.getY());
		            		bottomRight.setX(activeHandle.getX());
	            		}
	            	} else {
	            		//activeHandle.setX(topLeft.getX()+group.get('.img')[0].getWidth());
	            		activeHandle.setX(topLeft.getX()+group.children[0].getWidth());
	            		activeHandle.setY(topLeft.getY());
	            	}
	                break;
	            case "bottomRight_" + groupId:
	            	if((bottomRight.getX() - bottomLeft.getX() > minSize) && (bottomRight.getY() - topRight.getY() > minSize)) {
	            		XtempVal = bottomRight.getX() - bottomLeft.getX();
	            		YtempVal = bottomRight.getY() - topRight.getY();
	            		if(typeof(activeHandle.getY()) != 'string' || typeof(activeHandle.getX()) != 'string'){
		            		bottomLeft.setY(activeHandle.getY());
		            		topRight.setX(activeHandle.getX());	 
	            		}
	            	} else {
	            		//activeHandle.setX(bottomLeft.getX()+group.get('.img')[0].getWidth());
	            		activeHandle.setX(bottomLeft.getX()+group.children[0].getWidth());
	            		//activeHandle.setY(topRight.getY() + group.get('.img')[0].getHeight());
	            		activeHandle.setY(topRight.getY() + group.children[0].getHeight());
	            	}
	                break;
	            case "bottomLeft_" + groupId:
	            	if((bottomLeft.getY()-topLeft.getY() > minSize) && (bottomRight.getX() - bottomLeft.getX() > minSize)) {	
	            		XtempVal = bottomRight.getX() - bottomLeft.getX();
	            		YtempVal = bottomLeft.getY()-topLeft.getY();	            		
	            		if(typeof(activeHandle.getY()) != 'string' || typeof(activeHandle.getX()) != 'string'){
	            			bottomRight.setY(activeHandle.getY());
	            			topLeft.setX(activeHandle.getX());
	            		}
	            	} else {
	            		//activeHandle.setX(bottomRight.getX()- group.get('.img')[0].getWidth());
	            		activeHandle.setX(bottomRight.getX()- group.children[0].getWidth());
	            		//activeHandle.setY(topLeft.getY() + group.get('.img')[0].getHeight());
	            		activeHandle.setY(topLeft.getY() + group.children[0].getHeight());
	            	}
	                break;
	        }

	        if(XtempVal  > minSize && YtempVal > minSize){
	        	//console.log(bottomLeft.getY() - activeHandle.getY());
		        // Calculate new dimensions. Height is simply the dy of the handles.
		        // Width is increased/decreased by a factor of how much the height changed.
		        newHeight = bottomLeft.getY() - topLeft.getY();
		        /*if(maintainRatio) {
		        	newWidth = group.get('.img')[0].getWidth() * newHeight / group.get('.img')[0].getHeight();
		        } else {*/
		        	newWidth = topRight.getX() - topLeft.getX()
		        //}	        
	
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
		            	updateImageListData(image);
		            } else if(objectType(image.parent) == 'frame') {
		            	updateFrameData(image);
		            }
		            
		        }
	        }	        
	      }
	
	function updateImageListData(image) {
		var ds = window.CD.services.ds;
		var cnv = window.CD.services.cs;
		var group = image.parent;
		var containerFrame =  cnv.getObjectContainerFrame(group);
		var frameIndexInOutputData =  cnv.getFrameIndex(containerFrame.attrs.id);
		window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].imageX = image.parent.getX();
        window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].imageY = image.parent.getY();
    	window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].height = Math.round(image.getHeight());
        window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[image.parent.attrs.id].width = Math.round(image.getWidth());        
        ds.setOutputData();
	}
	
	function updateFrameData(frame) {}
	
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