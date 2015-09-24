function makeFrameTextResizable(textGroup, width, height, maintainRatio){
		width = parseInt(width);
		height = parseInt(height);
		addAnchor(textGroup, 0, 0, "topLeft");
		addAnchor(textGroup, width, 0, "topRight");
		addAnchor(textGroup, width, height, "bottomRight");
		addAnchor(textGroup, 0, height, "bottomLeft");
		var cs = window.CD.services.cs;
    	var ds = window.CD.services.ds;
    	var undoMng = window.CD.undoManager;
		function addAnchor(group, x, y, name, visible){
			var frameId = group.attrs.id.split('_')[2];
			var cnv = window.CD.services.cs;
			var stg = cnv.getCanvas();
			var cdLayer = group.getParent();
			if(frameId == '0'){
				cdLayer = window.CD.services.cs.getBgTextLayer();
			}
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
	        anchor.on("mouseover", function() {
	            document.body.style.cursor = "pointer";
	            this.setStrokeWidth(5);
	            cdLayer.draw();
	          });
	        anchor.on("mouseout", function() {
	            document.body.style.cursor = "default";
	            this.setStrokeWidth(1);
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
	        	$('#boxWidth').val(this.parent.children[0].attrs.width);
	        	$('#boxHeight').val(this.parent.children[0].attrs.height); 
	        	var txtTool = new TextTool.frameText();
	        	txtTool.applyTextToolChange('callFromResizable');
	    		this.show();
	    		cdLayer.draw();
	        });
	        group.add(anchor);
		};
		
		function setPosition(handlar) {
			var group = handlar.parent;
			var groupId = group.attrs.id;
			var text = group.children[0];		
			var grpX = group.getX();
	    	var grpY = group.getY();
	    	var txtX = text.getX();
	    	var txtY = text.getY();
	    	group.setX(grpX+txtX);
	    	group.setY(grpY+txtY);
	    	text.setX(0);
	    	text.setY(0);    	
	    	group.get('.topLeft_' + groupId)[0].setPosition(0, 0);
	    	group.get('.topRight_' + groupId)[0].setPosition(text.getWidth(), 0);
			group.get('.bottomRight_' + groupId)[0].setPosition(text.getWidth(), text.getHeight());
			group.get('.bottomLeft_' + groupId)[0].setPosition(0, text.getHeight());
			var childrens = group.children;
	        updateTextListData(text,'text',group);
		};
		
		function updateTextListData(text,data,group) {
			var ds = window.CD.services.ds;
			var cnv = window.CD.services.cs;
			var group = text.parent;
			var undoMng = window.CD.undoManager;
			var txtObjId = text.parent.attrs.id;
			var frameData = window.CD.module.data.Json.FrameData;
			var frameLength = window.CD.module.data.Json.FrameData.length;
			if(data){
				for(var i=0; i<frameLength; i++){
					var frameTextListLength = frameData[i].frameTextList.length;
					if(frameTextListLength){
						for(var j=0; j<frameTextListLength; j++){
							if(frameData[i].frameTextList[j].textGroupObjID == txtObjId){
								var oldHeight = frameData[i].frameTextList[j].minHeight;
								var oldWidth = frameData[i].frameTextList[j].maxWidth;
								var oldX = frameData[i].frameTextList[j].textX;
								var oldY = frameData[i].frameTextList[j].textY;
							}
						}
					}
				}
				var newHeight = Math.round(text.getHeight());
				var newWidth = Math.round(text.getWidth());
				undoMng.register(this,undoTextDimensionChange,[group,oldWidth,oldHeight],'Undo Text Dimension Change',this,undoTextDimensionChange,[group,newWidth,newHeight],'Redo Text Dimension Change')
				updateUndoRedoState(undoMng);
			}
			
			for(var l=0; l<frameLength; l++){
				var frameTextListLength = frameData[l].frameTextList.length;
				if(frameTextListLength){
					for(var k=0; k<frameTextListLength; k++){
						if(frameData[l].frameTextList[k].textGroupObjID == txtObjId){
							frameData[l].frameTextList[k].minHeight = Math.round(text.getHeight());
							frameData[l].frameTextList[k].maxWidth = Math.round(text.getWidth());
						}
					}
				}
			}
			ds.setOutputData();
		};
		
		function update(group, activeHandle) {
				var ds = window.CD.services.ds;
				var groupId = group.attrs.id;
		        var topLeft = group.get(".topLeft_" + groupId)[0]==undefined ? activeHandle:group.get(".topLeft_" + groupId)[0],
		            topRight = group.get(".topRight_" + groupId)[0]==undefined ? activeHandle:group.get(".topRight_" + groupId)[0],
		            bottomRight = group.get(".bottomRight_" + groupId)[0]==undefined ? activeHandle:group.get(".bottomRight_" + groupId)[0],
		            bottomLeft = group.get(".bottomLeft_" + groupId)[0]==undefined ? activeHandle:group.get(".bottomLeft_" + groupId)[0],
		            text = group.children[0],
		            activeHandleName = activeHandle.getName(),
		            newWidth,
		            newHeight,
		            textX,
		            textY;
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
		            		activeHandle.setX(topRight.getX() - group.children[0].getWidth());
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
		            		activeHandle.setX(bottomLeft.getX()+group.children[0].getWidth());
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
		            		activeHandle.setX(bottomRight.getX()- group.children[0].getWidth());
		            		activeHandle.setY(topLeft.getY() + group.children[0].getHeight());
		            	}
		                break;
		        }

		        if(XtempVal  > 10 && YtempVal > 10){
			        newHeight = bottomLeft.getY() - topLeft.getY();
			        if(maintainRatio) {
			        	newWidth = group.get('.txt')[0].getWidth() * newHeight / group.get('.txt')[0].getHeight();
			        } else {
			        	newWidth = topRight.getX() - topLeft.getX()
			        }	        

			        if(activeHandleName.match(/topRight_/) || activeHandleName.match(/bottomRight/)) {
			            text.setPosition(topLeft.getX(), topLeft.getY());
			        } else if(activeHandleName.match(/topLeft/) || activeHandleName.match(/bottomLeft/)) {
			            text.setPosition(topRight.getX() - newWidth, topRight.getY());
			        }
			        
			        textX = text.getX();
			        textY = text.getY();
			        topLeft.setPosition(textX, textY);
			        topRight.setPosition(textX + newWidth, textY);
			        bottomRight.setPosition(textX + newWidth, textY + newHeight);
			        bottomLeft.setPosition(textX, textY + newHeight);
			        if(newWidth && newHeight) {
			            text.setSize(newWidth, newHeight);
			            if(objectType(text.parent) == 'text') {
			            } 
			        }
		        }	        
		      };
		

		function undoTextDimensionChange(text,width,height){
			try{
				$('#boxWidth').val(width);
	        	$('#boxHeight').val(height); 
	        	var ds = window.CD.services.ds;
				var cnv = window.CD.services.cs;
				var group = text;
				var txtObjId = group.attrs.id;
				var frameData = window.CD.module.data.Json.FrameData;
				var frameLength = window.CD.module.data.Json.FrameData.length;
				for(var i=0; i<frameLength; i++){
					var frameTextListLength = frameData[i].frameTextList.length;
					if(frameTextListLength){
						for(var j=0; j<frameTextListLength; j++){
							if(frameData[i].frameTextList[j].textGroupObjID == txtObjId){
								frameData[i].frameTextList[j].minHeight = height;
								frameData[i].frameTextList[j].maxWidth = width;
							}
						}
					}
				}
				var txtTool = new TextTool.frameText();
	        	txtTool.applyTextToolChange('callFromResizable');
			}
			catch(err){
				 console.error("@resizable.js::Error on undoTextDimensionChange::"+err.message);
			}
		};
		
		function objectType(obj) {
			if(obj.attrs.id.match(/frame_[0-9]+/)) {
				return 'frame';
			} else if(obj.attrs.id.match(/txt_[0-9]+/)) {
				return 'text';
			} else if(obj.attrs.id.match(/label_[0-9]+/)) {
				return 'label';
			} else if(obj.attrs.id.match(/dock_[0-9]+/)) {
				return 'dock';
			}
		};
		ds.setOutputData();

	}