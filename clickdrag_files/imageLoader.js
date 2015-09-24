//function loadImage(group,x,y,imgGrpid,src,scaleFactor){
function loadImage(group,imgGrpid,imgData,renderParam,img){
	console.log("@imageLoader.loadImage");
	var cd = window.CD;
	var undoMng = window.CD.undoManager;
	var x = imgData.imageX;
	var y = imgData.imageY;
	var src = imgData.imageName;
	if(!src){
		src = imgData;
	}
	var scaleFactor = imgData.imageScaleFactor?imgData.imageScaleFactor:1;
	var imageHeight  = imgData.height;
	var imageWidth  = imgData.width;	
	var imageObj = new Image();
	imageObj.src = window.CD.util.proccessMediaID(src);
	var tempUrl = imageObj.src;
	if(tempUrl.indexOf('undefined') != -1){
		//TODO: Show error modal for missing media file
		return;
	}
	
	var cs = window.CD.services.cs;
	var ds = window.CD.services.ds;
	var cdLayer = cs.getLayer();
	var grpId = group.attrs.id;
	group = cs.findGroup(grpId);
	var frameIndexInOutputData =  cs.getFrameIndex(group.attrs.id);
	
	if (imageObj.complete) {
		addImage(imageObj,imgData,imgGrpid,renderParam);		
	} else {
		imageObj.onload = function() {	
			addImage(imageObj,imgData,imgGrpid,renderParam);	
			imageObj.onload=function(){};
		};		
	}
	imageObj.onerror = function(err) {
		console.info("Could not load image."+ err.message );
    };	
    
    if(renderParam == 'add'){
    	var imgLength = img.length;
    	if(imgLength == 1){
        	window.CD.module.frame.registerUndoRedo(group,imgData,false,img);
    	}else if(imgLength > 1){
    		if(img[(imgLength-1)].title == imgData.imageName)
    				window.CD.module.frame.registerUndoRedoForMultiImg(group,imgData,false,img);
    			
    	}
    }
   
    function showAnchor(group) {
		group.get('.topLeft')[0].show();
		group.get('.bottomLeft')[0].show();
		group.get('.topRight')[0].show();
		group.get('.bottomRight')[0].show();
	}
    
    /**
     * This method is used for undo/redo position change of images
     * @param value(height and width)
     * @param group
     * @param frameIndexInOutputData
     * @author 552756(Nabonita Bhattacharyya)
     */
    function undoImagePositionChange(value,group1,frameIndexInOutputData){
    	try{
    		var cs = window.CD.services.cs;
        	var ds = window.CD.services.ds;
        	var cdLayer = cs.getLayer();
        	
        	/*handling error in frame image resizing while undo/redo*/
        	for(var i=0;i<group1.length;i++){
        		var frGrp = cs.findGroup('frame_'+frameIndexInOutputData);        	
            	var group = frGrp.get('#'+group1[i].getId())[0];
            	group.setX(parseInt(value.x[i]));
            	group.setY(parseInt(value.y[i]));
            	cdLayer.draw();
            	window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[group.attrs.id].imageX = value.x[i];
        		window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[group.attrs.id].imageY = value.y[i];
        		ds.setOutputData();
        	}
        	
    	}
    	catch(err){
			 console.error("@imageLoader::Error on undoImagePositionChange::"+err.message);
		}
    }
    
    
    function addImage(imageObj,imgData,imgGrpid,renderParam) {
    	try{
    		var scaleFactor = imgData.imageScaleFactor?imgData.imageScaleFactor:1;
	    	var imageHeight  = imgData.height;
	    	var imageWidth  = imgData.width;
	    	var cs = window.CD.services.cs;
	    	var ds = window.CD.services.ds;
	    	var cdLayer = cs.getLayer();
	    	var grpId = group.attrs.id;
	    	group = cs.findGroup(grpId);
	    	var frameIndexInOutputData =  cs.getFrameIndex(group.attrs.id);
	    	var imgH = imageObj.height;
			var imgW = imageObj.width;			
			
			// --- In authoring side image height is directly used for image rendering --- 
			
			
			if(!imgData.absolutePosition && (imgData.frameOriginalX || imgData.frameOriginalY)) {
				x = x + imgData.frameOriginalX;
				y = y + imgData.frameOriginalY;
			}
	
			//Fix for image size in rerender
			if(imageWidth && imageHeight){
				var rw = imageWidth;
				var rh = imageHeight;
			} else {
				var rw = (imgW) * scaleFactor;
				var rh = (imgH)* scaleFactor;
				
				var ratio = rw/rh;
				
				if(group.attrs.id != "frame_0"){
					if(window.CD.module.data.Json.adminData.version != 2000){
						if(group.children[0] != undefined){
							if(rh > group.children[0].getHeight()) {
								var exratio = group.children[0].getHeight()/rh;
								rh = rh*exratio;
								rw = Math.round(ratio*rh);
							}
							
							if(rw > group.children[0].getWidth()){
								var exratio =group.children[0].getWidth()/rw;
								rw = rw*exratio;
								rh = rw/ratio;
							}
						}
					}					
				} else {
					if(group.children[0] != undefined){
						if(rh > (ds.getCanvasSize().height - 25)) {
							var exratio = ds.getCanvasSize().height/rh;
							rh = rh*exratio;
							rw = Math.round(ratio*rh);
						}
						
						if(rw > (ds.getCanvasSize().width - 25)){
							var exratio = ds.getCanvasSize().width/rw;
							rw = rw*exratio;
							rh = rw/ratio;
						}
					}
				}
			}
			
			
			
			var frameImg = new Kinetic.Image({
				x: 0,
				y: 0,
				image: imageObj,
				width: rw ,
				height: rh,
				name: 'img'
			});
			//return frameImg;
			if($.isNumeric(imgGrpid)) {
				imgGrpid = 'img_'+imgGrpid;
			}
			
			/** Checking added as this was the issue with chrome only **/
			/** The image was not being resized in chrome, hence the whole loop is put inside settimeout **/
			var ifChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()); 
			var ifWebkit = /safari/.test(navigator.userAgent.toLowerCase()); 

			if(ifChrome || ifWebkit){
				//Generated imgGrpid again to avoid error in Chrome due to image loading delay by SS on 20140402
				if(renderParam != 'render'){
					var frameIndex = 0;
					var imageLastSeq = 0;
					var imgLen = cs.objLength(window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList);
					if(imgLen > 0){
						imageLastSeq = parseInt(cs.objLastSequence(window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList)) + 1;
					}
					var imgGrpid = 'img_' + frameIndexInOutputData + '_' + imageLastSeq;	
				}
			}

			 /*error handling in deleting  frame with image*/
			 var imageGroup = cs.createGroup(imgGrpid,{'draggable':true,'x':x,'y':y,'dragOnTop':false});
			
			imageGroup.add(frameImg);
	
			makeResizable(imageGroup, rw, rh, true);		
			group.add(imageGroup);
			//window.CD.module.data.Json.FrameData[0].frameImageList['img_'+imgGrpid] = imageGroup;
			//var imgName = src.split('/');
			//imgName = imgName[imgName.length-1];
			var imgName = imgData.imageName;
			if(!imgName){
				imgName = imgData;
			}
			if(imgData.zIndex && imgData.zIndex != ''){
				var zIndex =  imgData.zIndex;
			}else{
				var zIndex = imageGroup.getZIndex();
			}
			
			var imgList = {
					'src':imgName,
					'imageX':x,
					'imageY':y,
					'imageScaleFactor':imgData.imageScaleFactor?imgData.imageScaleFactor:1,
					'height':Math.round(rh),
					'width':Math.round(rw),
					'originalHeight':imgData.originalHeight?imgData.originalHeight:Math.round(imgH),
					'originalWidth':imgData.originalWidth?imgData.originalWidth:Math.round(imgW),
					'zIndex':imgData.zIndex,
			};
			if(imgList.zIndex == undefined){
				imgList.zIndex = imageGroup.getZIndex();
			}
			if(!imgList.absolutePosition) {
				imgList.absolutePosition = true;
			}
			if($.isArray(window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList)) {
				window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList = toObject(window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList);
			}
			imageGroup.setZIndex(imgList.zIndex);
			window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[imgGrpid] = imgList;	
			cdLayer.draw();
			//cs.setActiveElement(imageGroup,'image');  //Commented for multiple addImage functionality by SS
			imageGroup.on('mousedown',function(evt){
				cs.setActiveElement(this,'image');
				evt.cancelBubble = true;
				cs.updateDragBound(this);	
				cs.updateMoveToTopBottomState(this);
			});
			imageGroup.on('click',function(evt){
				evt.cancelBubble = true;
				
			});
			imageGroup.on('dragend',function(evt){
				/*var oldVal = {};
				oldVal.x = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[this.attrs.id].imageX;
				oldVal.y = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[this.attrs.id].imageY;
				
				var newVal = {};
				newVal.x = this.getX();
				newVal.y = this.getY();
				
				if((parseInt(oldVal.x)!=parseInt(newVal.x)) || (parseInt(oldVal.y)!=parseInt(newVal.y))){
					undoMng.register(this,undoImagePositionChange,[oldVal,this,frameIndexInOutputData],'Undo position change',this,undoImagePositionChange,[newVal,this,frameIndexInOutputData],'Redo position change');
					updateUndoRedoState(undoMng);
				}
				
				window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[this.attrs.id].imageX = this.getX();
				window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[this.attrs.id].imageY = this.getY();*/
				evt.cancelBubble = true;
				var activeElm = window.CD.elements.active.element;
				var activeElmArray = [];
				var activeElmNewX = [];
				var activeElmNewY = [];
				var activeElmOldX = [];
				var activeElmOldY = [];
				var activeElmLength = window.CD.elements.active.element.length;
				var activeDockArray = [];
				var newVal = {x:[],y:[]};
				var oldVal = {x:[],y:[]};
				for(var j=0;j<activeElmLength;j++){
					activeElmArray.push(window.CD.elements.active.element[j]);
				}
				var undoMng = window.CD.undoManager;
				var ds = window.CD.services.ds;
				var cs = window.CD.services.cs;
				var cdLayer = cs.getLayer();
				var imageId = this.attrs.id;
				var changedX = this.getX() - window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[this.attrs.id].imageX;
				var changedY = this.getY() - window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[this.attrs.id].imageY;
				for(var i=0;i<activeElmLength;i++){
					var img = window.CD.elements.active.element[i].attrs.id;
					if(img == imageId){
						var oldX = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[img].imageX;
						var oldY = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[img].imageY;
						window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[img].imageX = this.getX();
						window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[img].imageY = this.getY();
						var newX = this.getX();
						var newY = this.getY();
					}else{
						var newX = window.CD.elements.active.element[i].getX() + changedX;
						var newY = window.CD.elements.active.element[i].getY() + changedY;
						if(newY>(parseInt(window.CD.module.data.Json.FrameData[0].frameHeight))-window.CD.elements.active.element[i].children[0].attrs.height){
							newY = (parseInt(window.CD.module.data.Json.FrameData[0].frameHeight)-window.CD.elements.active.element[i].children[0].attrs.height);
						}
						if(newX>(parseInt(window.CD.module.data.Json.FrameData[0].frameWidth))-window.CD.elements.active.element[i].children[0].attrs.width){
							newX = (parseInt(window.CD.module.data.Json.FrameData[0].frameWidth)-window.CD.elements.active.element[i].children[0].attrs.width);
						}
						if(newY<0){
							newY = 0;
						}
						if(newX<0){
							newX = 0;
						}
						window.CD.elements.active.element[i].setX(newX);
						window.CD.elements.active.element[i].setY(newY);
						
						var oldX = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[img].imageX;
						var oldY = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[img].imageY;
						window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[img].imageX = newX;
						window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[img].imageY = newY;	
					}
					
					newVal.x.push(newX);
					newVal.y.push(newY);
					oldVal.x.push(oldX);
					oldVal.y.push(oldY);
					ds.setOutputData();
				}
				this.parent.getLayer().draw();
				cdLayer.draw();
				undoMng.register(this,undoImagePositionChange,[oldVal,activeElmArray,frameIndexInOutputData] , 'Undo image position',this,undoImagePositionChange,[newVal,activeElmArray,frameIndexInOutputData] , 'Redo image position');
				updateUndoRedoState(undoMng);
				
				ds.setOutputData();		
				
			});
			//imageGroup.setZIndex(1);
			ds.setOutputData();
		}catch(err){
			console.info("Error inside imageLoader.addImage::"+err.message);
		}
    }
    
    function toObject(arr) {
	  var rv = {};
	  for (var i = 0; i < arr.length; ++i)
	    if (arr[i] !== undefined) rv[i] = arr[i];
	  return rv;
	}
}