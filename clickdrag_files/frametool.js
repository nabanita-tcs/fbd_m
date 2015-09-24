//var commands = {};

var FrameTool = function(){
			console.log("@FrameTool.createLable::");
		};

FrameTool.prototype = {
	createFrame:function(){
		console.log("@FrameTool.createLable.execute::");console.log("@window.CD.services.labeltool.createFrame");
		try{
			this.frameId = '';
			this.frameGroupId = '';

			var cnv = window.CD.services.cs;
			var stg = cnv.getCanvas();
			var cdLayer = cnv.getLayer();
			var ds = window.CD.services.ds;
			var frConfig = new frameConfig();
			var totalFrame = window.CD.module.data.Json.FrameData.length;
			var newFrame = new frameDefaults();
			var grpOptions = {draggable:true,x:10,y: 10};
			var newFrameGrpId=parseInt(window.CD.module.data.Json.FrameData[(totalFrame-1)].frameGroupID.split('_')[1]) + 1;
			var frameGroup = cnv.createGroup('frame_'+newFrameGrpId,grpOptions);
			var createframe=this;
			

			var undoMng = window.CD.undoManager;

			frConfig.id = 'fr' + totalFrame;

			var frame = new Kinetic.Rect({
						                width: 140,
						                height: parseInt($('#canvasHeight').val()) - 20,						                
						                stroke: '#999999',
						                strokeWidth: 1,
						                cornerRadius: 5,
						                fill: 'transparent',
						                strokeEnabled: true,
						                opacity:1,
						                id:frConfig.id
						               });
			//this.frameId = frConfig.id;
			//this.frameGroupId = frConfig.p_id;
			frameGroup.add(frame);
			//console.info(frameGroup);
			cdLayer.add(frameGroup);		
			/*event binding for text tool*/
			undoMng.register(this,window.CD.module.frame.deleteFrame,[frameGroup],'undo frame creation',this,this.createFrame,[],'redo frame creation');
			updateUndoRedoState(undoMng);
			frame.on('click',function(e){
				var frameTxtTool= new TextTool.frameText();
					frameTxtTool.setTextToolEvent(e);
					  });
			makeResizable(frameGroup, 140, parseInt($('#canvasHeight').val()) - 20);	
			cnv.dragLockUnlock(frameGroup,parseInt(140),parseInt(parseInt($('#canvasHeight').val()) - 20),true);
			cnv.setActiveElement(frameGroup,'frame');
			cdLayer.draw();
			
			
			newFrame.frameGroupID=frameGroup.attrs.id;
			newFrame.frameX = 10;
			newFrame.frameY = 10;
			newFrame.frameWidth = 140;
			newFrame.frameHeight = parseInt($('#canvasHeight').val()) - 20;
			
			window.CD.module.data.Json.FrameData[totalFrame] = newFrame;
			ds.setOutputData();	
			frameGroup.on('click',function(evt){//'mousedown' is changed to 'click' for on click frame selection
				evt.cancelBubble = true;
				cnv.setActiveElement(this,'frame');
				cnv.updateDragBound(this);
				openInspector('frame');
				window.CD.module.frame.moveLabelsToTop();
				window.CD.services.cs.updateMoveToTopBottomState(this);
				cdLayer.draw();
			});
			/*frameGroup.on('mouseup',function(evt){
				evt.cancelBubble = true;
				window.CD.module.frame.moveLabelsToTop();
				cdLayer.draw();
			});*/
			frameGroup.on('dragend',function(evt){
				evt.cancelBubble = true;
				cnv.setActiveElement(this,'frame');
				cnv.updateDragBound(this);
				openInspector('frame');
				window.CD.module.frame.moveLabelsToTop();
				var frameIndexInOutputData =  cnv.getFrameIndex(this.attrs.id);
				var oldX = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameX;
				var oldY = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameY;
				var oldWidth = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameWidth;
				var oldHeight = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameHeight;
				if((this.children[0].attrs.width == oldWidth) || (this.children[0].attrs.height == oldHeight)){
					undoMng.register(this,window.CD.module.frame.undoFramePositionChange,[this,oldX,oldY],'undo frame position change',this,window.CD.module.frame.undoFramePositionChange,[this,this.getX(),this.getY()],'redo frame position change');
					updateUndoRedoState(undoMng);
				}
				else{
        			undoMng.register(this,window.CD.module.frame.undoResizeFrame,[this,oldWidth,oldHeight,oldX,oldY],'undo frame dimension change',this,window.CD.module.frame.undoResizeFrame,[this,this.children[0].attrs.width,this.children[0].attrs.height,this.getX(),this.getY()],'redo frame dimension change');
        			updateUndoRedoState(undoMng);
				}
				window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameX = this.getX();
				window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameY = this.getY();
				window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameWidth = this.children[0].getWidth();
				window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameHeight = this.children[0].getHeight();
				cnv.reIndexframes();
				ds.setOutputData();	
			});
			openInspector('frame');
			//$('.tool_select').trigger('click');
		}catch(err){
			console.error("@window.CD.services.labeltool.createFrame::Error while creating Frame::"+err.message);
		}
	}
};