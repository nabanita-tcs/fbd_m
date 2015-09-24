//function loadImage(group,x,y,imgGrpid,src,scaleFactor){
function loadImageforLabel(group,imgGrpid,imageName,iscallfromUdnoRedoDeleteLabel){
	console.log("@imageLoader.loadImage");
	try{
		/*global variable*/	
		var cd = window.CD;
		var cnv = window.CD.services.cs;
		var cdLayer = cnv.getLayer();
		//if(group.children.length <= 3)
		group = cdLayer.get('#'+group.attrs.id)[0];
		/*image object*/
		var prevImg = group.get('#img_'+group.getId())[0];
		/** If an image is inserted for the first time in a label 'prevSrc' remains blank **/
		var prevSrc = '';
		if(prevImg){//If there is already an image there in a label 'prevSrc' will be populated with its name
			if(prevImg.children[0]){
				var prevSrcPath = prevImg.children[0].getAttrs().image.src;
				var srcPathLen = prevSrcPath.split('/').length;
				prevSrc = prevSrcPath.split('/')[srcPathLen-1];
			}			
		}
		 var src = imageName;
		 var imageObj = new Image();
		 //If src has ('|')
		 if(src && src.indexOf('|')>-1){
			 src = src.split('|')[0];			 
		 }
		 if(src){
			 src = src.toString();
		 }
		
		 imageObj.src = window.CD.util.proccessMediaID(src);
		

		 /*text object*/
		 var textTxtObj=group.get('.nametxt')[0];
		 if(textTxtObj)
			 var txtGrpObj=group.get('.nametxt')[0].parent;
		 
		
		 /*buffer variable*/
	     var topMinBuffer=10;
	     var bothSideMinBuffer=30;
	     var bottomSideMinBuffer=30;
	     
	    /*calculation for label size*/
	     var labelObj=group.children[0];
		 var avlblHeight = labelObj.getHeight() - bothSideMinBuffer;
	     var avlblWidth = labelObj.getWidth() - bottomSideMinBuffer;
	     /*remove old image from label*/
	     this.removeImageFromLabel(group);
	     
	     /*info objects*/
	     var infoTObj,infoHObj,infoFObj,infoTextTObj;
	        
	    var sle = window.CD.module.data.getLabelIndex(group.attrs.id);
	    var labelData = window.CD.module.data.getJsonData();
	    $.each(group.children, function(index,value){
			if(value.nodeType==="Group" && value.attrs.id.match(/infoText_label_[0-9]+/)){
				/*fetching T F H infotext object*/
				$.each(value.children, function(i,v){
					if(v.attrs.id.match(/T_infoText_label_[0-9]+/)){
						infoTextTObj=v.getHeight();
						infoTObj=v;						
					}
					if(v.attrs.id.match(/H_infoText_label_[0-9]+/)){
						infoHObj=v;
					}
					if(v.attrs.id.match(/F_infoText_label_[0-9]+/)){
						infoFObj=v;
					}
					
				});
			}
	    });
	    var hiddenTextBox = labelData[sle].infoHideText;
        var selectLBLWidth=parseInt(labelObj.getWidth());
	    var selectLBLHeight=parseInt(labelObj.getHeight());
	    
		if (imageObj.complete) {
			var imgH = imageObj.height;
			var imgW = imageObj.width;				
			var ratio = imgW/imgH;
	                 
	         if(group.children[0] != undefined){
				if(imgH > avlblHeight) {
	                var exratio = avlblHeight/imgH;
	                imgH = imgH*exratio;
	                imgW = Math.round(ratio*imgH);
				}
	            if(imgW > avlblWidth){
	                var exratio =avlblWidth/imgW;
	                imgW = imgW*exratio;
	                imgH = imgW/ratio;
				}
	            
	            /** For smaller image **/
	            if(imgH < avlblHeight && imgW < avlblWidth) {
	                var exratio = avlblHeight/imgH;
	                imgH = imgH*exratio;
	                imgW = Math.round(ratio*imgH);
				}
	           
	         }
	         if(hiddenTextBox == 'T' && infoTextTObj){
	        	 topMinBuffer=0;
	        	 ///imgW = imgW+infoTextTObj;
	            // imgH = imgW/ratio;
	        	 if(cd.services.ds.getEt()!=='PRG'){
	        		 topMinBuffer = topMinBuffer;
				}else{
					topMinBuffer = infoTextTObj;
				}
	         }
			var labelImg = new Kinetic.Image({
				x: 0,
				y: topMinBuffer,
				image: imageObj,
				width: imgW ,
				height: imgH,
				name: 'img'
			});
	          
			//getGroup is replaced with createGroup
			var imageGroup = cnv.createGroup(imgGrpid,{'x':(group.children[0].getWidth()/2) - (imgW/2),'y':0,'dragOnTop':true});
			imageGroup.add(labelImg);		
			group.add(imageGroup);
	        setImgLabelOutput(imageGroup,group,imageName);
	        //Removed to avoid multiple undo-redo register
	        //setLabelTextImagePosition(group,selectLBLWidth,selectLBLHeight,imageName,iscallfromUdnoRedoDeleteLabel);
	        var moduleTextTool= new TextTool.commonLabelText();
			moduleTextTool.finalAdjustmentLabelContent(group,imageObj.src);
		} else {
			imageObj.onload = function() {
			var imgH = imageObj.height;
			var imgW = imageObj.width;				
			var ratio = imgW/imgH;
	                 
	        if(group.children[0] != undefined){
				if(imgH > avlblHeight) {
	                var exratio = avlblHeight/imgH;
	                imgH = imgH*exratio;
	                imgW = Math.round(ratio*imgH);
				}
	            if(imgW > avlblWidth){
	                var exratio =avlblWidth/imgW;
	                imgW = imgW*exratio;
	                imgH = imgW/ratio;
				}
	            /** For smaller image **/
	            if(imgH < avlblHeight) {
	                var exratio = avlblHeight/imgH;
	                imgH = imgH*exratio;
	                imgW = Math.round(ratio*imgH);
				}
	            
	         }
	         if(hiddenTextBox == 'T' && infoTextTObj){
	        	 topMinBuffer=0;
	        	 ///imgW = imgW+infoTextTObj;
	            // imgH = imgW/ratio;
	        	 if(cd.services.ds.getEt()!=='PRG'){
	        		 topMinBuffer = topMinBuffer;
				}else{
					topMinBuffer = infoTextTObj;
				}
	         }
		
			var labelImg = new Kinetic.Image({
				x: 0,
				y: topMinBuffer,
				image: imageObj,
				width: imgW ,
				height: imgH,
				name: 'img'
			});
			//getGroup is replaced with createGroup         
			var imageGroup = cnv.createGroup(imgGrpid,{'x':(group.children[0].getWidth()/2) - (imgW/2),'y':0,'dragOnTop':true});
			imageGroup.add(labelImg);		
			group.add(imageGroup);	 
	        setImgLabelOutput(imageGroup,group,imageName);
	        //Removed to avoid multiple undo-redo register
	        //setLabelTextImagePosition(group,selectLBLWidth,selectLBLHeight,imageName,iscallfromUdnoRedoDeleteLabel);
	        imageObj.onload=function(){};
	        var moduleTextTool= new TextTool.commonLabelText();
			moduleTextTool.finalAdjustmentLabelContent(group,imageObj.src);
	                 
	      };		
		}
		imageObj.onerror = function(err) {
			console.info("Could not load image."+ err.message );
	    };
	    if(imageName)
	    	window.CD.services.ds.updateImageList(imageName,'add');
	    var selectLBLWidth=parseInt(labelObj.getWidth());
	    var selectLBLHeight=parseInt(labelObj.getHeight())
	    /** 'prevSrc' is passed to this method for passing the value to registerUndoRedo **/
	    setLabelTextImagePosition(group,selectLBLWidth,selectLBLHeight,imageName,iscallfromUdnoRedoDeleteLabel,prevSrc);
	    /*if(infoTObj){
	    	var objGrp=infoTObj.parent;
	    	infoTObj.moveToTop();
	    }
	    if(infoHObj){
	    	var objGrp=infoHObj.parent;
	    	infoHObj.moveToTop();
	    }
	    if(infoFObj){
	    	var objGrp=infoFObj.parent;
	    	infoFObj.moveToTop();
	    }*/
	    //if(objGrp)objGrp.moveToTop();
	    
	   /* group.get('.nametxt')[0].parent.setY(group.children[0].getHeight()-20);
	    group.get('.nametxt')[0].setHeight(17);
	    group.get('.nametxt')[0].setAlign("center");
	    group.get('.nametxt')[0].parent.children[0].setWidth(group.children[0].getWidth() - 20);
	    group.get('.nametxt')[0].parent.setX((group.children[0].getWidth() - group.get('.nametxt')[0].parent.children[0].getWidth())/2);*/   
	    cdLayer.draw();
	}catch(err){
		console.error("Error in labelImageLoader::"+err.message);
	}
	
    
 }

function setImgLabelOutput(imageGroup,group,imageName){
    var ds = window.CD.services.ds;
    var cs = window.CD.services.cs;
    var labelInd = window.CD.module.data.getLabelIndex(group.attrs.id);
    cs.setActiveElement(imageGroup,'labelimage');	
    var data = window.CD.module.data.getJsonData();
    var imgH = parseInt(imageGroup.children[0].getHeight());
    var imgW = parseInt(imageGroup.children[0].getWidth());
    data[labelInd].image_data = imageName+'|'+imgW+'|'+imgH;         
    ds.setOutputData(); 
    
    imageGroup.on('mousedown',function(evt){
	cs.setActiveElement(this,'labelimage');
	evt.cancelBubble = true;
	cs.updateDragBound(this);			
    });
    imageGroup.on('mouseup',function(evt){
	ds.setOutputData();		
	evt.cancelBubble = true;
    });
}
/**
 * function name: setLabelTextImagePosition()
 * author:Piyali Saha
 */
/* prevSrc is the image previously added in a label */
function setLabelTextImagePosition (labelGrp,selectLBLWidth,selectLBLHeight,imageName,iscallfromUdnoRedoDeleteLabel,prevSrc){
		//console.log("@setLabelTextImagePosition");
		  try{
				var otherLabelGrpId=labelGrp.attrs.id;
				var textBuffer=20;
				 var textBoxGrpObj=labelGrp.get('#txtGrp_'+otherLabelGrpId.split('_')[1])[0];
					 textBoxGrpObj.setY((selectLBLHeight-textBuffer)/2);
					 var textBoxObj=labelGrp.get('#txtBox_'+otherLabelGrpId.split('_')[1])[0];
					 if(textBoxObj)textBoxObj.setWidth(selectLBLWidth-textBuffer);	
					  var addTextObj=labelGrp.get('#addTxt_'+otherLabelGrpId.split('_')[1])[0];
					   if(addTextObj){
						   addTextObj.setWidth(selectLBLWidth-textBuffer);	
						   
					   }
					 var editedTextObj=labelGrp.get('#lbltxt_'+otherLabelGrpId.split('_')[1])[0];
					 if(editedTextObj){
						 editedTextObj.setWidth(selectLBLWidth-textBuffer);	
						 
					 }			
						/*register undo redo*/
						if(typeof window.CD.module.view.registerUndoRedo == "function" && !iscallfromUdnoRedoDeleteLabel){
							window.CD.module.view.registerUndoRedo(labelGrp,imageName,false,prevSrc);
						}
						
						/*//for final adjustment
						if(typeof window.CD.module.view.finalAdjustmentLabelContent == "function"){
							window.CD.module.view.finalAdjustmentLabelContent(labelGrp,imageName);	
						}*/
						
						var moduleTextTool= new TextTool.commonLabelText();
						moduleTextTool.finalAdjustmentLabelContent(labelGrp,imageName);
						
						/* for image text adjustment */
						if(typeof window.CD.module.view.labelImageAndTextAdjust == "function"){
							window.CD.module.view.labelImageAndTextAdjust(labelGrp);
						}
								
			
					 
		 }catch(err){
			 console.error("@COIView::Error on setLabelTextImagePosition::"+err.message);
			}
			
}	
function removeImageFromLabel(labelGrp) {
		var images = labelGrp.get('.img');		
		if(images[0]){
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var imgGrp = images[0].parent;
			imgGrp.removeChildren();
			imgGrp.destroy();
			cdLayer.draw();
		}
	}

