window.CD.module.frame = {
		frameMinHeight : 20,
		frameMinWidth : 20,
		fontSizeUpdateId : '',
		canvasTextBoxW : '',
		canvasTextBoxH : '',
	init: function(frameData) {
		console.log("@frame.init");
		//this.processString(rawDataString,frameCount);
		try{
			this.showFrame(frameData);
		}catch(err){
			console.error("Error in Frame::"+err.message);
		}
		
	},
	
	showFrame : function(frameJson){
		console.log("@frame.showFrame");
		var cd = window.CD;
		var ds = window.CD.services.ds;
		var util = window.CD.util;	
		var cnv = window.CD.services.cs;
		var stg = cnv.getCanvas();
		var cdLayer = cnv.getLayer();		
		var c = 0;
		var frConfig = new frameConfig();
		var frameJson = frameJson;
		var frameTxtTool=  new TextTool.frameText();
		var canvasTextTool=new TextTool.canvasText();
		var textFormat = new TextFormat();
		var undoMng = window.CD.undoManager;
		
		$.each(frameJson, function(key, val){
			
			if(c>0){
				frConfig.id = 'fr' + c;
				
				var isDraggable = true;
				if(val.lockStatus) {
					isDraggable = false;
				}
				
				var grpOptions = {draggable:isDraggable,x:parseInt(val.frameX),y: parseInt(val.frameY)};
				//var frameGroup = cnv.getGroup('frame_grp_'+c,grpOptions);
				var frameGroup = cnv.createGroup('frame_'+c,grpOptions);
				var fillColor = 'transparent';
				if(val.frameBGVisible == 'f')
					fillColor = '#ffffff';
				
				var frame = new Kinetic.Rect({
	                width: parseInt(val.frameWidth),
	                height: parseInt(val.frameHeight),
	                stroke: '#999999',
	                strokeWidth: 1,
	                cornerRadius: 5,
	                strokeEnabled: true,
	                fill: fillColor,
	                //dashArray: [3, 1],
	                opacity:1,
	                id:frConfig.id					                
	               });
				this.frameId = frConfig.id;
				this.groupId = frConfig.p_id;
				frameGroup.add(frame);
				cdLayer.add(frameGroup);//frameGroup added to cdLayer
				window.CD.module.data.Json.FrameData[c].frameGroupID = frameGroup.attrs.id;
				if(!window.CD.module.data.Json.FrameData[c].zIndex){
					window.CD.module.data.Json.FrameData[c].zIndex = frameGroup.getZIndex();
				}
				frameGroup.setZIndex(window.CD.module.data.Json.FrameData[c].zIndex);
				ds.setOutputData();	
				
				
				/*event binding for text tool*/
				frame.on('click',function(e){
					 frameTxtTool.setTextToolEvent(e);
				});
				makeResizable(frameGroup, val.frameWidth, val.frameHeight);	
				cnv.dragLockUnlock(frameGroup,parseInt(val.frameWidth),parseInt(val.frameHeight),isDraggable);

				/* 'mousedown' changed to 'click' and 'mouseup' is closed to make 'dragend' work */
				frameGroup.on('click',function(evt){
					evt.cancelBubble = true;
					cnv.setActiveElement(this,'frame');
					window.CD.module.frame.moveLabelsToTop();
					cdLayer.draw();
					window.CD.services.cs.updateMoveToTopBottomState(this);
					cnv.updateDragBound(this);
					openInspector('frame');
				});
				/*frameGroup.on('mouseup',function(evt){
					evt.cancelBubble = true;
					window.CD.module.frame.moveLabelsToTop();
					cdLayer.draw();
				});*/
				frameGroup.on('dragend',function(evt){
					var frameIndexInOutputData =  cnv.getFrameIndex(this.attrs.id);
					var oldX = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameX;
					var oldY = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameY;
					undoMng.register(this,window.CD.module.frame.undoFramePositionChange,[this,oldX,oldY],'undo frame position change',this,window.CD.module.frame.undoFramePositionChange,[this,this.getX(),this.getY()],'redo frame position change');
					updateUndoRedoState(undoMng);
					window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameX = this.getX();
					window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameY = this.getY();
					window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameWidth = this.children[0].getWidth();
					window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameHeight = this.children[0].getHeight();
					ds.setOutputData();	
				});
			} else {
				var frameGroup = cnv.findGroup('frame_'+c); //Canvas base frame
				window.CD.module.data.Json.FrameData[c].frameGroupID = frameGroup.attrs.id;
				window.CD.module.data.Json.FrameData[0].frameHeight = window.CD.module.data.Json.adminData.AH;
				window.CD.module.data.Json.FrameData[0].frameWidth = window.CD.module.data.Json.adminData.AW;
				ds.setOutputData();	
			}
			
			
	        /*for frame image*/	
			var imgCounter = 0;
			if(val.frameImageList && cnv.objLength(val.frameImageList) > 0) {
				var frmimgList = val.frameImageList;				
				for(var imgKey in frmimgList) {
					var imgId = imgKey.split('_')[2];
					var imgData = frmimgList[imgKey];
					//var imagePosX = '';
					//var imagePosY = '';
					var imageX = parseInt(imgData.imageX);
					var imageY = parseInt(imgData.imageY);
					if(val.frameX != val.frameOriginalX) {
						//imagePosX = parseInt(val.frameOriginalX);
						//imagePosY = parseInt(val.frameOriginalY);
						imgData.frameOriginalX = parseInt(val.frameOriginalX);
						imgData.frameOriginalY = parseInt(val.frameOriginalY);
						
					}	
					var imageName = '';
					if(imgData.src) {
						imageName = imgData.src;
					} else if(imgData.imageName) {
						imageName = imgData.imageName;
					}
					
					imgData.imageName = imageName;
					imgData.imageX = imageX;
					imgData.imageY = imageY;					
					
					var imgGroupId = 'img_' + key + '_' + imgId;
					//loadImage(frameGroup,imagePosX,imagePosY,imgKey,'resources/images/imagebank/' + imageName,imgData.imageScaleFactor);
					
					/** **** Modified for render of a frame, so that registerUndoRedo is not called **** **/
					loadImage(frameGroup,imgGroupId,imgData,'render');
					imgCounter++;
				}
				ds.setOutputData();
			}
	       
	        if(val.frameTextList.length > 0) {
	        	var frmtxtList = val.frameTextList;
	        	var textBgLayer = cnv.getBgTextLayer();
	        	
	        	for(var ft=0; ft<frmtxtList.length; ft++){
	        		if(frmtxtList[ft]){
	        			/** Frame data populate in Json **/
	        			/* Json value */
	        			var frameJsonData = window.CD.module.data.Json.FrameData[c].frameTextList[ft];
	        			/* Default values */
	        			var defaultParams = {};
	        			defaultParams = cnv.cloneObject(frameJsonData);
	        			//defaultParams.fontSize = fontsize;
	        			
	        			
	        			/*var W = window.CD.module.frame.canvasTextBoxW;
	        			var H = window.CD.module.frame.canvasTextBoxH;
	        			
	        			defaultParams.maxWidth = parseInt(W);
	        			defaultParams.minHeight = parseInt(H);*/
	        			
	        			/*var X = eventObj.x;
	        			var Y = eventObj.y;
	        			defaultParams.textX = parseInt(X);
	        			defaultParams.textY = parseInt(Y);
	        			defaultParams.textValue = textValue;*/
	        			//defaultParams.textAlign = 'center';
	        			//defaultParams.underlineVal = 'F';
	        			//defaultParams.absolutePosition = true;
	        			
	        			//defaultParams.textGroupObjID='txt_'+frameTextId+"_"+frmID;
	        			
	        			/* Done to merge with jSon value */
	        			if(frameJsonData){
	        				defaultParams = $.extend(defaultParams,frameJsonData);
	        			}
	        			var frameTextId = ft;
	        			var frmID = c;
	        			
	        			var adjustmentX = 0;
	        			var adjustmentY = 0;
	        			
	        			if(c == 0){
	        				adjustmentX = 15;
	        				adjustmentY = 15;
	        			}else{
	        				adjustmentX = 0;
	        				adjustmentY = 0;
	        			}
	        			
	        			var event = {};
	        			event.x = defaultParams.textX - adjustmentX;
	        			event.y = defaultParams.textY - adjustmentY;
	        			
	        			
	        			var textValue = defaultParams.textValue;
	        			var frmObj = frameGroup;
	        			
	        			CanvasData.updateCanvasTextData(defaultParams,frameTextId,frmID);
	        			/***** For Frame text new *****/
	        			align = defaultParams.textAlign;
	        			txtGrpObj = textFormat.createFrameText(frameTextId,frmObj,event,textValue,align);	
	        			makeFrameTextResizable(txtGrpObj,txtGrpObj.children[0].getWidth(),txtGrpObj.children[0].getHeight());
	        			
	        			if(defaultParams.zIndex == undefined){
	        				defaultParams.zIndex = txtGrpObj.getZIndex();
	        			}
	        			CanvasData.updateCanvasTextData(defaultParams,frameTextId,frmID);
	        			if(c==0){
		        			canvasTextTool.textEventBind(txtGrpObj);
		        		}else{
		        			frameTxtTool.textEventBind(txtGrpObj);
		        		}
	        			
	        			var parentLayer=txtGrpObj.getLayer();
	        			if(parentLayer && parentLayer.attrs.id==="text_layer"){
	        				parentLayer.draw();
	        			}
	        			cnv.getLayer().draw();
			        	window.CD.module.frame.canvasTextBoxH = parseInt(txtGrpObj.children[0].getHeight());
						window.CD.module.frame.canvasTextBoxW = parseInt(frmtxtList[ft].maxWidth);
	        		}		        		
	        	}
	        	
	        }
	        
	        
	        if(val.frameTextList.length > 0) {
	        	var frmtxtList = val.frameTextList;
	        	var textBgLayer = cnv.getBgTextLayer();
	        	
	        	for(var ft=0; ft<frmtxtList.length; ft++){
	        		if(frmtxtList[ft]){
	        			var frameJsonData = window.CD.module.data.Json.FrameData[c].frameTextList[ft];
	        			var txtGrpObj = textBgLayer.get('#'+frameJsonData.textGroupObjID)[0];
	        			if(txtGrpObj==undefined){
	        				txtGrpObj = frameGroup.get('#'+frameJsonData.textGroupObjID)[0];
	        			}
	        			if(frameJsonData.zIndex != undefined){
	        				txtGrpObj.setZIndex(frameJsonData.zIndex);
	        			}
	        			var parentLayer=txtGrpObj.getLayer();
	        			if(parentLayer && parentLayer.attrs.id==="text_layer"){
	        				parentLayer.draw();
	        			}
	        			cnv.getLayer().draw();
	        		}		        		
	        	}
	        }
  
	        if(val.frameMediaList != "N"){
	        	if(frameGroup.attrs.id.match(/frame_0/)){
	        		var audioGrpId = 'audio_0';
	        	}else{
	        		var audioGrpId = 'audio_' + frameGroup.attrs.id;
	        	}
	        	
				var x = val.frameMediaXY.x;
				var y = val.frameMediaXY.y;
				loadAudioImage(frameGroup,audioGrpId,val.frameMediaList,x,y,true);	
	        }
	        /**
	         * TODO: Need to handle legacy clickdrag Datastrings where StudentGUI will be in any Frame
	         * */
	        if(val.frameStudentGUI.length > 1 && c == 0) {
	        	var stuGUIList = val.frameStudentGUI;
	        	if(stuGUIList[1] == undefined){
	        		stuGUIList = [{Component:"R",x:window.CD.width - 60,y:window.CD.height -30,visible:true},{Component:"Z",x:window.CD.width - 120,y:window.CD.height-30,visible:true}];
	        	}	
        		for(var ft=0; ft<stuGUIList.length; ft++){
        			/** --- Updated for zoom/reset --- **/
        			if(ft === 0){
        				var textPosX = stuGUIList[ft].x;
    					var textPosY = stuGUIList[ft].y;
    					
    					if((textPosX == '' && textPosX !== 0) || (textPosY == '' && textPosY != 0)){
    						var textPosX = parseInt(window.CD.width) -60 ;
        					var textPosY = parseInt(window.CD.height) - 30;
    					}
    					
        			}else{
        				var textPosX = stuGUIList[ft].x;
    					var textPosY = stuGUIList[ft].y;
    					
    					if((textPosX == '' && textPosX !== 0) || (textPosY == '' && textPosY != 0)){
    						var textPosX = parseInt(window.CD.width) -120 ;
        					var textPosY = parseInt(window.CD.height) - 30;
    					}
        			}

					var textValue = stuGUIList[ft].Component == "R" ? "Reset" : stuGUIList[ft].Component == "Z"? "Zoom": "";
					var complexText = new Kinetic.Text({
	        	        x: textPosX,
	        	        y: textPosY,
	        	        text: textValue,
	        	        fontSize: 14,
	        	        fontFamily: 'sans-serif',
	        	        fontStyle: 'bold',
	        	        fill: '#000',
	        	        width: 50,
	        	        padding: 0,
	        	        align: 'center',
	        	        id: 'stdGUI_' + stuGUIList[ft].Component,
	        	        draggable: true,
	        	        dragBoundFunc: function(pos){
	        	        	var stgH = window.CD.height;
	    					var stgW = window.CD.width;
	    					if(pos.x + 30 > stgW) {
	    						newX = stgW - 30;
	    					} else if(pos.x < 10) {
	    						newX = 10;
	    					} else {
	    						newX = pos.x;
	    					}
	    					
	    					if((pos.y + 2) > stgH) {
	    						newY = stgH - 2;
	    					} else if(pos.y < 15) {
	    						newY = 15;
	    					} else {
	    						newY = pos.y
	    					}
	    					return {
	    			            x: newX,
	    			            y: newY
	    			           }
	        	        },
	        	        visible:stuGUIList[ft].visible
	        	      });
					
					ds.updateStudentGUI(complexText);
					
					complexText.on("dragend",function(){
						ds.updateStudentGUI(this);
						ds.setOutputData();	
					});
					
					/** --- Updated for zoom/reset (added to textBgLayer to move reset / zoom on top of image) --- **/
					var textBgLyr = cnv.getBgTextLayer();
					
					textBgLyr.add(complexText);
					textBgLyr.draw();
					
	        		if(stuGUIList[ft].Component == "R" && !stuGUIList[ft].visible){
	        			$("#cdInspector #stdGUIReset").attr("checked", false);
	        		}
	        		if(stuGUIList[ft].Component == "Z" && !stuGUIList[ft].visible){
	        			$("#cdInspector #stdGUIZoom").attr("checked", false);
	        		}
        		}
	        }
	        
			c++;
			var frameGroup = cnv.findGroup('frame_0');
			cnv.setActiveElement(frameGroup,'frame');
		});
		window.CD.module.data.Json.FrameData[0].zIndex = 3 ;
		cdLayer.draw();
		
		function fixTextEntities( input )
		{
		    var result = (new String(input)).replace(/&(amp;)/g, "&");
		    return result.replace(/&#(\d+);/g, function(match, number){ return String.fromCharCode(number); });
		}
		
		function createImage(imgInfo){
			console.log("@csservice.createImage");
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
			        return imgElm;
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
			        return imgElm;
				    // clear onLoad, IE behaves erratically with animated gifs otherwise
					img.onload=function(){};
				};
				img.onerror = function() {
					console.info("Could not load image."+img.src );
			    };
			 }
				
		}
		
		
		
		function editText(txtObj,frameObj) {
			var cnv = $("canvas");
			//var x = parseInt(txtObj.getAbsolutePosition().x) + parseInt(frameObj.frameX) + $('canvas').first().offset().left + 15;
			//var y = parseInt(txtObj.getAbsolutePosition().y) + parseInt(frameObj.frameY) + $('canvas').first().offset().top + 15;
			
			var x = parseInt(txtObj.getAbsolutePosition().x) + $('canvas').first().offset().left;
			var y = parseInt(txtObj.getAbsolutePosition().y) + $('canvas').first().offset().top - 2;
			
			
			if($('#editTextContainer').length > 0){
				var oldInput = $('#editTextContainer input');
				var oldTxtObjId = oldInput.attr('id').split("addtext_")[1];
				var oldTxtObj = stg.get('#'+oldTxtObjId)[0];
				oldTxtObj.setText(oldInput.val());
				cdLayer.draw();
				$("#editTextContainer").remove();
			}
			var txt = txtObj.attrs.text;
			var txtId = txtObj.attrs.id;
			var inputBoxContainer = $('<div id="editTextContainer"><div>');
			var inputBox = $('<input type="text" class="addtext" id="addtext_'+txtId+'" style="position:absolute;left:'+x+'px;top:'+y+'px;border:1px solid #000">');
			var inputBoxHidden = $('<input type="hidden" class="hiddentext" id="hiddentext_'+txtId+'" style="position:absolute;left:'+x+'px;top:'+y+'px;border:1px solid #000">');
			var paletteDiv = $('<div class="palette_div" style="left:'+(x+19)+'px;top:'+(parseInt(y)+35)+'px;width:300px;"></div>');			
			var paletteDropdown = window.CD.util.getTemplate({
                							url: 'resources/themes/default/views/palette.html?{build.number}'
											});
			
			
			paletteDiv.append(paletteDropdown);
			txtObj.setText("");
			cdLayer.draw();		
			inputBoxContainer.append(inputBox);
			inputBoxContainer.append(inputBoxHidden);
			inputBoxContainer.append(paletteDiv);
			$('body').append(inputBoxContainer);
			$('.addtext').focus();
			inputBox.val(txt);
			inputBoxHidden.val(txt);
			inputBox.authpalette({
				align : 'horizontal', // vertical | horizontal(default) - orientation
				auto : false,	  // false | true (default) - open on focus or click icon to open
				language : 'spanish', // french | spanish(default) - language
				resize : false,	// true | false(default) - resize the input/textarea to accomodate the palette icon. Works only if "auto = false".
				containment : 'document' // containment will initialize the draggable containment limit of the palette.
			});

			$('div.select_box').each(function(){
				$(this).children('span.selected').html($(this).children('div.select_options').children('span.select_option:first').html());
				$(this).attr('value',$(this).children('div.select_options').children('span.select_option:first').attr('value'));
				
				$(this).children('span,span.select_box').click(function(){
					if($(this).parent().children('div.select_options').css('display') == 'none'){
						$(this).parent().children('div.select_options').css('display','block');
					}
					else
					{
						$(this).parent().children('div.select_options').css('display','none');
					}
				});
				
				$(this).find('span.select_option').on('click',function(){
					$(this).parent().css('display','none');
					$(this).closest('div.select_box').attr('value',$(this).attr('value'));
					$(this).parent().siblings('span.selected').html($(this).html());
					$('.addtext').trigger('showPalette');
					$('.addtext').focus();
				});
			});
			$('body').on('keydown',function(e) {
			    // ESCAPE key pressed
			    if (e.keyCode == 27) {
			    	$('div.select_options').each(function(){
			    		$(this).hide();
			    	});
			    }
			});
		
			//$('.palette_icon').css({'position':'absolute', 'top':y, 'left': parseInt(x) + inputBox.width() });

			/*inputBox.bind('blur',function(){
				txtObj.setText(inputBox.val());
				cdLayer.draw();
				$('.addtext').remove();				
			});*/
			
			$('#editTextContainer .palette_icon').css('display','none');
		
			//$('.palette_div #paletteDropdown').on('change',function(){
				
			//});
			$('.palette_div .cancel_palette').click(function(){
				if($('#palette_container').css('display') == 'block' ){
					$('#palette_close').trigger('click');
				}
				txtObj.setText($('.hiddentext').val());
				cdLayer.draw();
				//$('.palette_div').remove();
				$("#editTextContainer").remove();
			});
			$('.palette_div .save_palette').click(function(){
				if($('#palette_container').css('display') == 'block' ){
					$('#palette_close').trigger('click');
				}
				txtObj.setText($('.addtext').val());
				cdLayer.draw();
				//$('.palette_div').remove();
				$("#editTextContainer").remove();
			});
		}
		
	},
	
	/** --- Updated for zoom/reset on 12th Nov, 2013 --- **/
	hideShowStdGUI: function(GUI,flag){
		console.log("@frame.hideStudentGUI");
		var cnv = window.CD.services.cs;
		var ds = window.CD.services.ds;
		//var cdLayer = cnv.getLayer();
		var textBgLayer = cnv.getBgTextLayer();
		var rGUI = textBgLayer.get("#stdGUI_"+GUI)[0];
		rGUI.setVisible(flag);
		textBgLayer.draw();
		if(GUI == "R"){
			window.CD.module.data.Json.FrameData[0].frameStudentGUI[0].visible = flag;
		}else if(GUI = "Z"){
			window.CD.module.data.Json.FrameData[0].frameStudentGUI[1].visible = flag;
		}
		ds.setOutputData();
		
	},
	isFrame: function(obj) {
		if(obj.attrs.id.match(/frame_[0-9]+/)) {
			return true;
		}
		return false;
	},
	
	getActiveFrameX: function() {	
		var activeElm = '';
		if(window.CD.elements.active.element[0])
			activeElm = window.CD.elements.active.element[0];
		if(this.isFrame(activeElm)) 
			return activeElm.getX();		
	},
	
	getActiveFrameY: function() {	
		var activeElm = '';
		if(window.CD.elements.active.element[0])
			activeElm = window.CD.elements.active.element[0];
		if(this.isFrame(activeElm)) 
			return activeElm.getY();		
	},
	
	getActiveFrameHeight: function() {
		var activeElm = '';
		if(window.CD.elements.active.element[0])
			activeElm = window.CD.elements.active.element[0];
		if(this.isFrame(activeElm)) 
			return activeElm.getHeight();		
	},
	
	getActiveFrameWidth: function() {
		var activeElm = '';
		if(window.CD.elements.active.element[0])
			activeElm = window.CD.elements.active.element[0];
		if(this.isFrame(activeElm)) 
			return activeElm.getWidth();		
	},
	
	updateFrame : function(data,frameOldGroup) {		
		if(window.CD.elements.active.type == 'frame') {
			var cnv = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cnv.getLayer();
			var oldFrams = [];
			var undoMng = window.CD.undoManager;
			var activeFrmLength = window.CD.elements.active.element.length;
			if(frameOldGroup){
				var	activeFrmLength = frameOldGroup.length;
			}
			for(var i=0;i<activeFrmLength;i++){
				var actvElmId = window.CD.elements.active.element[i].attrs.id;
				if(frameOldGroup){
					var frameOldId = frameOldGroup[i].attrs.id;
					var frameGroup = cnv.findGroup(frameOldId);
				}else{
					var frameGroup = cnv.findGroup(actvElmId);
				}
				oldFrams.push(frameGroup);
				var oldData = {};
				var frameIndexInOutputData =  cnv.getFrameIndex(frameGroup.attrs.id);
				oldData.width = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameWidth;
				oldData.height = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameHeight;
				
				if(window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameBGVisible == 'f'){
					oldData.fill = true;
				}else{
					if(window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameBGVisible == 't'){
						oldData.fill = false;
					}
				}
				//data.width = frameGroup.children[0].attrs.width;
				//data.height = frameGroup.children[0].attrs.height;
				var groupId = frameGroup.attrs.id;
				frame = frameGroup.children[0];
				frame.setSize(parseInt(data.width), parseInt(data.height));
				
				window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameWidth = data.width;
				window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameHeight = data.height;
				
				frameGroup.get(".topRight_" + groupId)[0].setX(parseInt(data.width));
				frameGroup.get(".bottomRight_" + groupId)[0].setX(parseInt(data.width));
				frameGroup.get(".bottomRight_" + groupId)[0].setY(parseInt(data.height));
				frameGroup.get(".bottomLeft_" + groupId)[0].setY(parseInt(data.height));
				frameGroup.get(".unlockicon_" + groupId)[0].setX(parseInt(data.width) - 20);
				frameGroup.get(".unlockicon_" + groupId)[0].setY(parseInt(data.height) - 20);
				frameGroup.get(".lockicon_" + groupId)[0].setX(parseInt(data.width) - 20);
				frameGroup.get(".lockicon_" + groupId)[0].setY(parseInt(data.height) - 20);
				 	
				var frameIndexInOutputData =  cnv.getFrameIndex(frameGroup.attrs.id);
				
				if(data.fill) {
					frame.setFill('#ffffff');
					window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameBGVisible = "f";
				} else {
					frame.setFill('transparent');
					window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameBGVisible = "t";
				}
				window.CD.module.frame.updateInspector(frameGroup.attrs.id);
			}
			undoMng.register(this,window.CD.module.frame.updateFrame,[oldData,oldFrams],'Undo frame update',this,window.CD.module.frame.updateFrame,[data,oldFrams],'Undo frame update');
			updateUndoRedoState(undoMng);
			cdLayer.draw();
			ds.setOutputData();
			
		}
	},
	
	/**
	 * This method is used to align labels to frame
	 * Called from stage.js
	 * By Nabonita Bhattacharyya
	 */
	adjustLabelAsFrame : function(data){
		if(window.CD.elements.active.type == 'frame'){
			var activeElement = window.CD.elements.active.element[0];
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var frameGrp = cs.findGroup(data.frameGroupId);
			var frameX = frameGrp.getX();
			var frameY = frameGrp.getY();
			var outputJSon = window.CD.module.data.getJsonData();
			var count = cs.objLength(outputJSon);
			var calcCount = window.CD.module.frame.getTotalLabelCount();
			var noOfCols = data.noOfColumns;
			var frameBuffer = data.frameBuffer;
			var frameOrigHeight = data.frameOrigHeight;
			var frameOrigWidth = data.frameOrigWidth;
			
			var newLabelWidth = Math.round((frameOrigWidth-(parseInt(frameBuffer)*(parseInt(noOfCols)+1)))/parseInt(noOfCols));
			var adminData = window.CD.module.data.getJsonAdminData();
			
			var labelCount = parseInt(noOfCols);
			
			if(window.CD.module.data.Json.adminData.OTM == true){
				var lblCnt = Math.ceil(calcCount/parseInt(labelCount));
			}else{
				var lblCnt = Math.ceil(count/parseInt(labelCount));
			}
			var newLabelHeight = Math.round((frameOrigHeight-(parseInt(frameBuffer)*(parseInt(lblCnt)+1)))/parseInt(lblCnt));
			var counter = labelCount;
			var lblY = frameY;
			var labelC = 0;
			/** ************** Modified for OTM labels ****************** **/
			window.CD.module.frame.makeLabelGroup(newLabelWidth,newLabelHeight,lblY,frameBuffer,frameX,frameGrp);
			cdLayer.draw();
		}
	},
	getTotalLabelCount : function(){
		var outputJson = window.CD.module.data.getJsonData();
		var et = window.CD.services.ds.getEt();
		var cs = window.CD.services.cs;
		var counter = 0;
		if(et == "PRG"){
			counter = cs.objLength(window.CD.module.data.Json.PRGData.PRGLabelData);
		}else{
			for(var each in outputJson){
				var visibility = outputJson[each].visibility;
				if(visibility == true){
					counter++;
				}
			}
		}
		return counter;
	},
	/**
	 * This method is used to set X and Y of each label
	 * Called from adjustLabelAsFrame of frame.js
	 * By Nabonita Bhattacharyya
	 */
	
	makeLabelGroup : function(labelWidth,labelHeight,lblY,frameBuffer,frameX,frameGrp){
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		var lblGroup = cdLayer.get('#newLabel')[0];
		var ds = window.CD.services.ds;
		var labelCount = cs.objLength(window.CD.module.data.getJsonData());
		var frameGrp = frameGrp;
		var frameOrgX = frameGrp.getX();
		var frameOrgWidth = frameGrp.children[0].getWidth();
		var labelX = frameX;
		var node = window.CD.module.data.getKeyIndex();
		var labelY = lblY;
		for(var i=0;i<parseInt(labelCount);i++){
			var outputJSON = window.CD.module.data.getJsonData();
			var sleCount = node+i;
			var visibility = outputJSON[sleCount].visibility;
			if(sleCount){
				var labelGroupID = outputJSON[sleCount].labelGroupId;
				var labelGroupLbl = cs.findGroup(labelGroupID);
				var labelGroupDock = cs.findGroup('dock_'+labelGroupID);
				labelGroupLbl.children[0].setHeight(labelHeight);
				labelGroupLbl.children[0].setWidth(labelWidth);

				labelGroupLbl.setX(parseInt(frameBuffer)+labelX);
				labelGroupLbl.setY(parseInt(frameBuffer)+labelY);
				
				
				var calcX = labelWidth-20;
				var calcY = labelHeight-20;
				/* for add text height-width adjust */
				var label = labelGroupLbl.children[0];
				var calcLblY = label.getHeight()-20;
				
				var oldData = {'height':label.getHeight(),'width':label.getWidth()};
				
				
				labelGroupLbl.moveToTop();
				
				if(typeof window.CD.module.view.adjustLabelResizeDock == "function"){
					window.CD.module.view.adjustLabelResizeDock(labelGroupDock,labelGroupID,labelWidth,labelHeight,calcX,calcY);
				}
				/* ------------- This method is to fix position of lock/unlock icon and anchors ------------- */
				window.CD.module.frame.setAnchorLockUnlockIconPosition(labelGroupID,calcX,calcY,labelWidth,labelHeight);
				
				var adminData = window.CD.module.data.getJsonAdminData();
				
				var exerciseType = ds.getEt();
				
				if(exerciseType == 'SLE'){
					window.CD.module.view.updateLabelContent(labelGroupLbl,oldData,calcLblY);
					/** ---- For dock text alignment ---- **/
					window.CD.module.view.updateLabelContent(labelGroupDock,oldData,calcLblY);
				}
				if(exerciseType == 'PRG'){
					window.CD.module.view.updateLabelContent(labelGroupLbl,oldData,calcLblY);
					outputJSON[sleCount].term_pos_x = parseInt(frameBuffer)+labelX;
					outputJSON[sleCount].term_pos_y = parseInt(frameBuffer)+labelY;
				}else{
					outputJSON[sleCount].holder_x = parseInt(frameBuffer)+labelX;
					outputJSON[sleCount].holder_y = parseInt(frameBuffer)+labelY;
				}
				
				if(exerciseType=='COI'){
					this.alignSelectBoxForCOI(labelGroupLbl,adminData,labelWidth,calcY);
					window.CD.module.view.updateLabelContent(labelGroupLbl,oldData,calcLblY);
				}
				if(exerciseType=='CLS'){
					this.alignSelectBoxForCLS(labelGroupLbl,labelHeight);
					window.CD.module.view.updateLabelContent(labelGroupLbl,oldData,calcLblY,undefined,'forCLSAlign');
				}

				adminData.SLELD = labelWidth+','+labelHeight;
				
				window.CD.module.frame.inspectorUpdate(labelWidth,labelHeight);
				
				/** ************** Modified for OTM labels ****************** **/
				if(visibility !== false){
					labelX = labelX+parseInt(frameBuffer)+labelWidth;
					var frameLimit = parseInt(frameOrgWidth)+parseInt(frameOrgX);
					if((parseInt(labelX)+(parseInt(frameBuffer)*2))>=(parseInt(frameLimit))){
						labelX = frameOrgX;
						labelY = parseInt(frameBuffer)+labelY+parseInt(labelHeight);
					}
				}
				/** ************** Modified for OTM labels ****************** **/
				ds.setOutputData();
			}
		}
		cdLayer.draw();
	},
	/**
	 * Used to populate values in inspector
	 * called from makeLabelGroup()
	 */
	inspectorUpdate : function(labelWidth,labelHeight){
		try{
			$('#labelWidth').val(labelWidth);
			$('#labelHeight').val(labelHeight);
			
			$('#localLabelWidth').html(labelWidth+'px');
			$('#localLabelHeight').html(labelHeight+'px');
		}
		catch(error){
			console.info('Error in frame.js :: inspectorUpdate():'+error.message);
		}
	},
	/**
	 * This is used to align radio button/checkbox of COI
	 * By Nabonita Bhattacharyya
	 */
	alignSelectBoxForCOI : function(labelGroupLbl,adminData,frameWidth,calcY){
		var adminData = adminData;
		var singleSelection = window.CD.module.data.Json.COIST;
		if(singleSelection=='F'){
			var uncheckRadioButton = labelGroupLbl.get('.uncheckRadio_'+labelGroupLbl.attrs.id)[0];
			var checkRadioButton  = labelGroupLbl.get('.checkRadio_'+labelGroupLbl.attrs.id)[0];
			uncheckRadioButton.setX(frameWidth-40);
			checkRadioButton.setX(frameWidth-40);
			
			uncheckRadioButton.setY(calcY);
			checkRadioButton.setY(calcY);
		}else{
			if(singleSelection == 'T'){
				var uncheckCheckBox = labelGroupLbl.get('.uncheckCheckBox_'+labelGroupLbl.attrs.id)[0];
				var checkedCheckBox  = labelGroupLbl.get('.checkCheckBox_'+labelGroupLbl.attrs.id)[0];
				uncheckCheckBox.setX(frameWidth-40);
				checkedCheckBox.setX(frameWidth-40);
				
				uncheckCheckBox.setY(calcY);
				checkedCheckBox.setY(calcY);
			}
		}
	},
	
	/**
	 * This is used to align radio select object of CLS
	 * By Nabonita Bhattacharyya
	 */
	alignSelectBoxForCLS : function(labelGroupLbl,frameHeight){
		var selectGrpObj = labelGroupLbl.get('#selObjGrp_'+labelGroupLbl.attrs.id)[0];
		if(selectGrpObj){
			selectGrpObj.setX(5);
			selectGrpObj.setY(frameHeight-12);
		}
	},
	
	/**
	 * Warning message call for labels align to frame
	 * By Nabonita Bhattacharyya
	 */
	callWarningMessage : function(data){
		var Util = window.CD.util;
		var errorModal = Util.getTemplate({url: 'resources/themes/default/views/error_modal.html?{build.number}'});
		$('#toolPalette #errorModal').remove();
		$('#toolPalette').append(errorModal);
		$('#toolPalette #errorModal').css('height','185px');
		$('#toolPalette #errorModal').css('width','400px');		
		$("#errorModal span#errorCancel").off('click').on('click',function(){
			$('.button #updateFromInspector').addClass('inactive');
			$('#errorModal').slideUp(200);
		});
		$('#alertMessage').slideDown(200);		
		$('#errorModal').css('left', (($('#toolPalette').width()/2) - ($('#errorModal').width()/2))+'px');
		$('#warningText .frame_warning_text').show();
		$('#errorText .error_warning_text').show();
		$('#errorOk').html('continue');
		$('#alertMessage').slideDown(200);	
		
		$("#errorModal span#errorOk").off('click').on('click',function(){
			$('#errorModal').slideUp(200);
			window.CD.module.frame.adjustLabelAsFrame(data);
		});
	},
	
	getActiveFrameSize: function(){
		var frameGroup = window.CD.elements.active.element[0];
		frame = frameGroup.children[0];
		return frame.getSize();
		
	},
	
	updateInspector: function(elmId) {
		var cs = window.CD.services.cs;
		if(elmId.match(/frame_[0-9]+/)){
			elm = cs.findGroup(elmId);
			$('#activeFrameWidth').val(elm.children[0].getWidth());
			$('#activeFrameHeight').val(elm.children[0].getHeight());
			$('#applyFrameChanges').removeClass('inactive');
			/* -------- Modified to make align labels to frame button active ----------- */
			//$('#alignLabelsToFrame').removeClass('inactive');
			if(!elm.children[0].getFill() || elm.children[0].getFill() == 'transparent') {
				$('#fillFrame').prop('checked',false);
			} else {
				$('#fillFrame').prop('checked',true);
			}
		}
	},
	/**
	 * Added for cancel event of frame
	 * by nabonita bhattacharyya
	 */
	frameCancel : function(){
		var cs = window.CD.services.cs;
		var activeElm = window.CD.elements.active.element[0];
		var frameId = activeElm.attrs.id;
		if(frameId != 'frame_0'){
			var frameIndex =  cs.getFrameIndex(frameId);
			$('#activeFrameWidth').val(window.CD.module.data.Json.FrameData[frameIndex].frameWidth);
			$('#activeFrameHeight').val(window.CD.module.data.Json.FrameData[frameIndex].frameHeight);
			if(window.CD.module.data.Json.FrameData[frameIndex].frameBGVisible == 't'){
				$('#fillFrame').prop('checked',false);
			}else{
				if(window.CD.module.data.Json.FrameData[frameIndex].frameBGVisible == 'f'){
					$('#fillFrame').prop('checked',true);
				}
			}
		}
	},
	
	/**
	 * align label to frame:: Move labels to top
	 * by nabonita bhattacharyya
	 */
	moveLabelsToTop : function(){
		var cs = window.CD.services.cs;
		var outputJSon = window.CD.module.data.getJsonData();
		for(var count in outputJSon){
			var labelGroupID = outputJSon[count].labelGroupId;
			var labelGroupLbl = cs.findGroup(labelGroupID);
			if(labelGroupLbl){
				labelGroupLbl.moveToTop();
			}
		}
	},
	
	/**
	 * This method is called for undo the changes for all labels
	 * for align label to frames
	 * By Nabonita Bhattacharyya
	 */
	
	undoAlignLabelToFrames : function(width,heigth,oldObj){
		try{
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			var outputJson = window.CD.module.data.getJsonData();
			var oldObj = oldObj;
			var width = parseInt(width);
			var height = parseInt(heigth);
			var adminData = window.CD.module.data.getJsonAdminData();
			for(var eachLabel in outputJson){
				
				var labelGrpId = outputJson[eachLabel].labelGroupId;
				var labelGroup = cs.findGroup(labelGrpId);
				var labelGroupDock = cs.findGroup('dock_'+labelGrpId);
				
				var oldX = oldObj[eachLabel].x;
				var oldY = oldObj[eachLabel].y;
				var label = labelGroup.children[0];
				
				
				var calcX = width-20;
				var calcY = height-20;

				var oldData = {'height':label.getHeight(),'width':label.getWidth()};
				
				label.setSize(parseInt(width), parseInt(height));
				labelGroup.setX(oldX);
				labelGroup.setY(oldY);
				
				/* ------------- This method is to fix position of lock/unlock icon and anchors ------------- */
				window.CD.module.frame.setAnchorLockUnlockIconPosition(labelGrpId,calcX,calcY,width,height);
				
				if(typeof window.CD.module.view.adjustLabelResizeDock == "function"){
					window.CD.module.view.adjustLabelResizeDock(labelGroupDock,labelGrpId,width,height,calcX,calcY);
					/** ---- For dock text alignment ---- **/
					window.CD.module.view.updateLabelContent(labelGroupDock,oldData,calcY);
				}
				
				var exerciseType = ds.getEt();
				
				if(exerciseType == 'PRG'){
					outputJson[eachLabel].term_pos_x = oldX;
					outputJson[eachLabel].term_pos_y = oldY;
				}else{
					outputJson[eachLabel].holder_x = oldX;
					outputJson[eachLabel].holder_y = oldY;
				}
				
				if(exerciseType=='COI'){
					window.CD.module.frame.alignSelectBoxForCOI(labelGroup,adminData,width,calcY);
				}
				if(exerciseType=='CLS'){
					window.CD.module.frame.alignSelectBoxForCLS(labelGroup,height);
				}
				$.each(labelGroup.children, function(index,value){
					if(value.nodeType==="Group" && value.attrs.id.match(/infoText_label_[0-9]+/)){
						/*fetching T F H infotext object*/
						$.each(value.children, function(i,v){
							if(v.attrs.id.match(/T_infoText_label_[0-9]+/)){
								infoTextTObj=v.getHeight();
								
							}
						});
					}
			    });
			var hiddenTextBox = outputJson[eachLabel].infoHideText;
			if(hiddenTextBox == 'T' && infoTextTObj){
				window.CD.module.view.updateLabelContent(labelGroup,oldData,calcY,infoTextTObj);
			}else{
				window.CD.module.view.updateLabelContent(labelGroup,oldData,calcY);
			}
			
				
			
			}
			window.CD.module.data.Json.adminData.SLELD = width+','+height;
			ds.setOutputData();
			cdLayer.draw();
		}
		catch(err){
			console.error("@Frame::Error on undoAlignLabelToFrames::"+err.message);
		}
	},
	/**
	 * This method is for changing position of lock/unlock icon and anchors
	 * as per label height/width
	 * By Nabonita Bhattacharyya
	 */
	setAnchorLockUnlockIconPosition : function(labelGrpId,calcX,calcY,width,height){
		try{
			var cs = window.CD.services.cs;
			var labelGroup = cs.findGroup(labelGrpId);
			var unlockIconLbl = labelGroup.get('.unlockicon_'+labelGrpId)[0];
			var lockIconLbl = labelGroup.get('.lockicon_'+labelGrpId)[0];				
							
			var topLeft = labelGroup.get('.topLeft_'+labelGrpId)[0];
			var topRight = labelGroup.get('.topRight_'+labelGrpId)[0];
			var bottomLeft = labelGroup.get('.bottomLeft_'+labelGrpId)[0];
			var bottomRight = labelGroup.get('.bottomRight_'+labelGrpId)[0];
			
			unlockIconLbl.setX(calcX);
			lockIconLbl.setX(calcX);
			unlockIconLbl.setY(calcY);
			lockIconLbl.setY(calcY);
			
			topLeft.setX(0);
			topLeft.setY(0);
			topRight.setX(width);
			topRight.setY(0);
			bottomLeft.setX(0);
			bottomLeft.setY(height);
			bottomRight.setX(width);
			bottomRight.setY(height);
		}
		catch(err){
			console.error("@Frame::Error on setAnchorLockUnlockIconPosition::"+err.message);
		}
	},
	/**
	 * This method is used for undo frame creation 
	 * called from createFrame()
	 * Modified on 25th July,2013
	 * By Nabonita Bhattacharyya
	 */
	deleteFrame : function(activeElm1){
		try{
			
			var activeElement = [];
			for(var j=0;j<activeElm1.length;j++){
				activeElement.push(activeElm1[j]);
			}
			var activeElmLength = activeElement.length;
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var ds = window.CD.services.ds;
			for(var i=0;i<activeElmLength;i++){
				var frameId = activeElement[i].attrs.id;
				/* undo/redo error handling while deleting frame */
				var activeElm = cs.getLayer().get('#'+frameId)[0];
				if(activeElm != undefined && activeElm.attrs.id != 'frame_0') {
					
					window.CD.services.cs.deleteSubGroups(activeElm);
					activeElm.destroyChildren();
					activeElm.destroy();
					cdLayer.draw();
					var frameIndexInOutputData =  cs.getFrameIndex(activeElm.attrs.id);
					delete window.CD.module.data.Json.FrameData[frameIndexInOutputData];
					var frameCount = cs.objLength(window.CD.module.data.Json.FrameData);
					if(parseInt(frameCount) <= 1){
						$('#alignLabelsToFrame').addClass('inactive');
					}					
					ds.setOutputData();		
				}
			}
			cs.reIndexframes();
			var frameGroup = cs.findGroup('frame_0');
			cs.setActiveElement(frameGroup,'frame');
			ds.setOutputData();	
		}
		catch(err){
			console.error("@Frame::Error on deleteFrame for frame creation undo::"+err.message);
		}
	},
	/**
	 * This method is used for frame position change undo and redo
	 * called from createFrame() frameGroup.on()
	 * By Nabonita Bhattacharyya
	 */
	undoFramePositionChange : function(frameGrp,x,y){
		try{
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var ds = window.CD.services.ds;
			var frameId = frameGrp.attrs.id;
			frameGrp = cs.findGroup(frameId);
			var frameIndexInOutputData =  cs.getFrameIndex(this.attrs.id);
			window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameX = parseInt(x);
			window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameY = parseInt(y);
			frameGrp.setX(parseInt(x));
			frameGrp.setY(parseInt(y));
			cdLayer.draw();
			ds.setOutputData();		
		}
		catch(err){
			console.error("@Frame::Error on undoFramePositionChange for frame position change undo/redo::"+err.message);
		}
	},
	/**
	 * This method is used for frame dimension change undo and redo
	 * called from resizable.js anchor.on()
	 * By Nabonita Bhattacharyya
	 */
	undoResizeFrame : function(group,frameWidth,frameHeight,X,Y){
		try{
			var cs = window.CD.services.cs;
			var cdLayer = cs.getLayer();
			var ds = window.CD.services.ds;
			var groupId = group.attrs.id;
			group = cs.findGroup(groupId);
			var frameChild = group.children[0];
			var unlockIcon = group.get('.unlockicon_'+groupId)[0];
			var lockIcon = group.get('.lockicon_'+groupId)[0];
			
			var topLeft = group.get('.topLeft_'+groupId)[0];
			var topRight = group.get('.topRight_'+groupId)[0];
			var bottomLeft = group.get('.bottomLeft_'+groupId)[0];
			var bottomRight = group.get('.bottomRight_'+groupId)[0];
			
			
			topLeft.setX(0);
			topLeft.setY(0);
			
			topRight.setX(parseInt(frameWidth));
			topRight.setY(0);
			
			bottomLeft.setX(0);
			bottomLeft.setY(parseInt(frameHeight));
			
			bottomRight.setX(parseInt(frameWidth));
			bottomRight.setY(parseInt(frameHeight));
			
			lockIcon.setX(parseInt(frameWidth) - 20);
			lockIcon.setY(parseInt(frameHeight) - 20);
			unlockIcon.setX(parseInt(frameWidth) - 20);
			unlockIcon.setY(parseInt(frameHeight) - 20);
			
			frameChild.setSize(parseInt(frameWidth),parseInt(frameHeight));
			if( X!= undefined || Y != undefined){
				group.setX(X);
				group.setY(Y);
			}
			cdLayer.draw();
			var frId =cs.getFrameIndex(group.attrs.id);
			window.CD.module.data.Json.FrameData[frId].frameWidth = parseInt(frameWidth);
			window.CD.module.data.Json.FrameData[frId].frameHeight = parseInt(frameHeight);
			ds.setOutputData();
			window.CD.module.frame.updateInspector(group.attrs.id);
		}
		catch(err){
			console.error("@Frame::Error on undoResizeFrame for frame dimension change undo/redo::"+err.message);
		}
	},
	/**
	 * This method is used for creating new frame on undo of
	 * frame delete
	 * called from canvasservices.js :: deleteActiveElement()
	 * By Nabonita Bhattacharyya
	 */
	createNewFrame : function(frameId,frameElemData){
		console.log("@Frame.createNewFrame.execute::");
		try{
			var cnv = window.CD.services.cs;
			var stg = cnv.getCanvas();
			var cdLayer = cnv.getLayer();
			var ds = window.CD.services.ds;
			var frConfig = new frameConfig();
			var frameTxtTool=  new TextTool.frameText();
			var canvasTextTool=new TextTool.canvasText();
			var totalFrame = window.CD.module.data.Json.FrameData.length;
			var frameIdLength = frameId.length;
			var undoMng = window.CD.undoManager;
			for(var i=0;i<frameIdLength;i++){
				var newFrame = new frameDefaults();
				var grpOptions = {draggable:true,x:parseInt(frameElemData[i].frameX),y: parseInt(frameElemData[i].frameY)};
				var newFrameGrpId=frameId[i].split('_')[1];
				var frameGroup = cnv.createGroup('frame_'+newFrameGrpId,grpOptions);
				var createframe=this;
				
				var totalFrame = window.CD.module.data.Json.FrameData.length;
				

				frConfig.id = 'fr' + newFrameGrpId;

				var frame = new Kinetic.Rect({
							                width: parseInt(frameElemData[i].frameWidth),
							                height: parseInt(frameElemData[i].frameHeight),						                
							                stroke: '#999999',
							                strokeWidth: 1,
							                cornerRadius: 5,
							                fill: 'transparent',
							                strokeEnabled: true,
							                opacity:1,
							                id:frConfig.id
							               });
				frameGroup.add(frame);
				cdLayer.add(frameGroup);		
				/*event binding for text tool*/
				
				updateUndoRedoState(undoMng);
				frame.on('click',function(e){
					var frameTxtTool= new TextTool.frameText();
						frameTxtTool.setTextToolEvent(e);
				});
				makeResizable(frameGroup, parseInt(frameElemData[i].frameWidth), parseInt(frameElemData[i].frameHeight));	
				cnv.dragLockUnlock(frameGroup,parseInt(frameElemData[i].frameWidth),parseInt(frameElemData[i].frameHeight),true);
				//cnv.setActiveElement(frameGroup,'frame');
				cdLayer.draw();
				
				
				newFrame.frameGroupID=frameGroup.attrs.id;
				newFrame.frameX = frameElemData[i].frameX;
				newFrame.frameY = frameElemData[i].frameY;
				newFrame.frameWidth = frameElemData[i].frameWidth;
				newFrame.frameHeight = frameElemData[i].frameHeight;
				
				window.CD.module.data.Json.FrameData[totalFrame] = newFrame;
				ds.setOutputData();	
				frameGroup.on('mousedown',function(evt){
					evt.cancelBubble = true;
					cnv.setActiveElement(this,'frame');
					
					cnv.updateDragBound(this);
					openInspector('frame');
					window.CD.module.frame.moveLabelsToTop();
					window.CD.services.cs.updateMoveToTopBottomState(this);
					cdLayer.draw();
				});
				frameGroup.on('mouseup',function(evt){
					evt.cancelBubble = true;
					window.CD.module.frame.moveLabelsToTop();
					cdLayer.draw();
				});
				frameGroup.on('dragend',function(evt){
					evt.cancelBubble = true;
					var frameIndexInOutputData =  cnv.getFrameIndex(this.attrs.id);
					var oldX = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameX;
					var oldY = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameY;
					undoMng.register(this,window.CD.module.frame.undoFramePositionChange,[this,oldX,oldY],'undo frame position change',this,window.CD.module.frame.undoFramePositionChange,[this,this.getX(),this.getY()],'redo frame position change');
					updateUndoRedoState(undoMng);
					window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameX = this.getX();
					window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameY = this.getY();
					window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameWidth = this.children[0].getWidth();
					window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameHeight = this.children[0].getHeight();
					cnv.reIndexframes();
					ds.setOutputData();	
				});
				
				var val = frameElemData[i];
				var c = parseInt(totalFrame);
				/* For frame text */
				if(val.frameTextList.length > 0) {
		        	var frmtxtList = val.frameTextList;
		        	var textBgLayer = cnv.getBgTextLayer();
		        	
		        	for(var ft=0; ft<frmtxtList.length; ft++){
		        		if(frmtxtList[ft]){
		        				var textPosX = parseInt(frmtxtList[ft].textX);
								var textPosY = parseInt(frmtxtList[ft].textY);
								/*
								if(parseInt(val.frameX) != parseInt(val.frameOriginalX)) {
									textPosX = textPosX + parseInt(val.frameOriginalX);
									textPosY = textPosY + parseInt(val.frameOriginalY);
								   }*/
								textAlign=frmtxtList[ft].textAlign;
								textfontStyle=frmtxtList[ft].fontStyle;
								if(!textAlign){
									textAlign="center";
								}
								if(textPosX < 0)textPosX=parseInt(textPosX)+33;
								var complexText = new Kinetic.Text({
				        	        x: 0,//Math.abs(parseInt(frmtxtList[ft].textX)),
				        	        y: 0,//Math.abs(parseInt(frmtxtList[ft].textY)),
				        	        text: window.CD.module.frame.fixTextEntities(frmtxtList[ft].textValue),
				        	        fontSize: frmtxtList[ft].fontSize,
				        	        fontFamily: 'sans-serif',
				        	        fontStyle: textfontStyle,
				        	        fill: '#555',
				        	        width: parseInt(frmtxtList[ft].maxWidth),
				        	        padding: 3,
				        	        align:textAlign, //'center',
				        	        id: 'txt_' + c + '_' + ft,
				        	       
				        	      });
								var textX = parseInt(frmtxtList[ft].textX);
								var textY = parseInt(frmtxtList[ft].textY);
								
								
								if(parseInt(val.frameX) != parseInt(val.frameOriginalX) && !frmtxtList[ft].absolutePosition) {
									textX = textX + parseInt(val.frameOriginalX);
									textY = textY + parseInt(val.frameOriginalY);
									frmtxtList[ft].absolutePosition = true;
								 }
								
								var parameter={
											extraObj:'',
											showFrame:true,
											inputFrameId:c,
											frmtxtList:frmtxtList[ft],
											ft:ft,
											addedText:false,
											x:textX,
											y:textY,
											textHeight:parseInt(complexText.getHeight())
										};
				        		var txtGrpObj=frameTxtTool.createKineticGroupTextObj(complexText,parameter);
				        		if(c==0){
				        			textBgLayer.add(txtGrpObj);
				        			textBgLayer.draw();
				        			
				        		}else{
				        			frameGroup.add(txtGrpObj);
				        		}
				        		if(frmtxtList[ft].underlineVal == "T"){
					        		 var baseTxtTool= new TextTool.frameText(); 
					   				// var textObj = txtGrpObj.get('#txt_'+lbGroup.attrs.id.split('_')[1])[0];
					   				 if(complexText)
					   					baseTxtTool.applyTextUnderline(complexText,txtGrpObj);
					   				 $("#UnderlinetTool").data('clicked', true);
				        		}
				        		var frmTextPara={textId:ft,inputframId:c,undoFrameDelete:true}
				        		frameTxtTool.setFramTextListData(txtGrpObj,frmTextPara);
				        		/*bound all text related event for complexText*/
				        		cnv.updateDragBound(txtGrpObj);
				        		if(c==0){
				        			canvasTextTool.textEventBind(txtGrpObj);
				        		}else{
				        			frameTxtTool.textEventBind(txtGrpObj);
				        		}
		        		}	
		        	}
		        }
				
				/* for frame image */	
				var imgCounter = 0;
				if(val.frameImageList && cnv.objLength(val.frameImageList) > 0) {
					var frmimgList = val.frameImageList;				
					for(var imgKey in frmimgList) {
						var imgData = frmimgList[imgKey];
						//var imagePosX = '';
						//var imagePosY = '';
						var imageX = parseInt(imgData.imageX);
						var imageY = parseInt(imgData.imageY);
						if(val.frameX != val.frameOriginalX) {
							//imagePosX = parseInt(val.frameOriginalX);
							//imagePosY = parseInt(val.frameOriginalY);
							imgData.frameOriginalX = parseInt(val.frameOriginalX);
							imgData.frameOriginalY = parseInt(val.frameOriginalY);
							
						}	
						var imageName = '';
						if(imgData.src) {
							imageName = imgData.src;
						} else if(imgData.imageName) {
							imageName = imgData.imageName;
						}
						
						imgData.imageName = imageName;
						imgData.imageX = imageX;
						imgData.imageY = imageY;					
						
						window.CD.services.ds.updateImageList(imageName,'add');
						var imgGroupId = 'img_' + c + '_' + imgCounter;
						//loadImage(frameGroup,imagePosX,imagePosY,imgKey,'resources/images/imagebank/' + imageName,imgData.imageScaleFactor);
						loadImage(frameGroup,imgGroupId,imgData);
						imgCounter++;
					}
					ds.setOutputData();
				}
			}
			cnv.setActiveElement(this.getGroup('frame_0'),'frame');
	       
		//	undoMng.register(this,window.CD.module.frame.deleteFrame,[frameGroup],'undo frame creation',this,this.createFrame,[],'redo frame creation');
		}catch(err){
			console.error("@window.CD.module.frame.createNewFrame::Error while creating Frame for undo of frame delete::"+err.message);
		}
	
	},
	fixTextEntities : function( input )
	{
	    var result = (new String(input)).replace(/&(amp;)/g, "&");
	    return result.replace(/&#(\d+);/g, function(match, number){ return String.fromCharCode(number); });
	},
	/***************************START--IMAGE undo redo related method of frame*************************/
	registerUndoRedo : function(frameGrp,imageName,isCallfrmDeleteActive,img) {
		try {
			var ds = window.CD.services.ds;
			if(frameGrp != undefined){
				var undoMng = window.CD.undoManager;
				var frameIndexInOutputData =  window.CD.services.cs.getFrameIndex(frameGrp.attrs.id);	
				var frameId=frameGrp.getId();
				var imgGrp = window.CD.module.frame.getImgGroup(frameIndexInOutputData,imageName,frameGrp);
				if(imgGrp != undefined){
					var imageGrpId = imgGrp.attrs.id;
					//var imgParentGrp = window.CD.module.frame.getImgGroup(frameIndexInOutputData,imageName,frameGrp).parent;
					if(isCallfrmDeleteActive){
						undoMng.register(this,  window.CD.module.frame.undoredoloadImageforFrame,
								[2,frameGrp,frameId,imageGrpId,imageName,img] ,
								'Undo Label image delete',this,  
								 window.CD.module.frame.undoredoloadImageforFrame,[1,frameGrp,frameId,imageGrpId,imageName,img] , 'Redo Label image delete');
						        updateUndoRedoState(undoMng);	
					     /*fix for js error in image add*/
						       
						  if(window.CD.module.data.Json.adminData.imageList == undefined || window.CD.module.data.Json.adminData.imageList==0){
							  window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList = [];
						   }
						ds.setOutputData();	
						 
					}else if(frameGrp.get('.img')[0] && !isCallfrmDeleteActive){
								undoMng.register(this,  window.CD.module.frame.undoredoloadImageforFrame,
								[1,frameGrp,frameId,imageGrpId,imageName,img] , 'Undo Label image add',
								this,   window.CD.module.frame.undoredoloadImageforFrame,
								[2,frameGrp,frameId,imageGrpId,imageName,img] , 'Redo Label image add');
								 updateUndoRedoState(undoMng);	
					}	
				}
			}
		 } catch (err) {
				console.error("@Error on registerUndoRedo from frame.js::"
					+ err.message);
			}
		},
		registerUndoRedoForMultiImg : function(frameGrp,imageName,isCallfrmDeleteActive,img) {
			try {
				var ds = window.CD.services.ds;
				if(frameGrp != undefined){
					var undoMng = window.CD.undoManager;
					var frameIndexInOutputData =  window.CD.services.cs.getFrameIndex(frameGrp.attrs.id);	
					var frameId=frameGrp.getId();
					var imgGrp = window.CD.module.frame.getImgGroup(frameIndexInOutputData,imageName,frameGrp);
					if(imgGrp != undefined){
						var imageGrpId = imgGrp.attrs.id;
						var imageGrpIds = window.CD.module.data.tempImgId;
						var imgNames = window.CD.module.data.tempImgName;
						window.CD.module.data.tempImgId = [];
						window.CD.module.data.tempImgName = [];
						if(isCallfrmDeleteActive){
							undoMng.register(this,  window.CD.module.frame.undoredoloadMultiImageforFrame,
									[2,frameGrp,frameId,imageGrpId,imageName,img,imageGrpIds,imgNames] ,
									'Undo Label image delete',this,  
									 window.CD.module.frame.undoredoloadMultiImageforFrame,[1,frameGrp,frameId,imageGrpId,imageName,img,imageGrpIds,imgNames] , 'Redo Label image delete');
							        updateUndoRedoState(undoMng);	
						     /*fix for js error in image add*/
							       
							  if(window.CD.module.data.Json.adminData.imageList == undefined || window.CD.module.data.Json.adminData.imageList==0){
								  window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList = [];
							   }
							ds.setOutputData();	
							 
						}else if(frameGrp.get('.img')[0] && !isCallfrmDeleteActive){
									undoMng.register(this,  window.CD.module.frame.undoredoloadMultiImageforFrame,
									[1,frameGrp,frameId,imageGrpId,imageName,img,imageGrpIds,imgNames] , 'Undo Label image add',
									this,   window.CD.module.frame.undoredoloadMultiImageforFrame,
									[2,frameGrp,frameId,imageGrpId,imageName,img,imageGrpIds,imgNames] , 'Redo Label image add');
									 updateUndoRedoState(undoMng);	
						}
					}
				}
			 } catch (err) {
					console.error("@Error on registerUndoRedo from frame.js::"
						+ err.message);
				}
			},
			registerUndoRedoForMultiImg1 : function(frameGrp,imageName,isCallfrmDeleteActive,img) {
				try {
					var ds = window.CD.services.ds;
					if(frameGrp != undefined){
						var undoMng = window.CD.undoManager;
						var frameIndexInOutputData =  window.CD.services.cs.getFrameIndex(frameGrp.attrs.id);	
						var frameId=frameGrp.getId();
						var imgGrp = window.CD.module.frame.getImgGroup(frameIndexInOutputData,imageName,frameGrp);
						if(imgGrp != undefined){
							var imageGrpId = img[0].id;
							var imageGrpIds = [];
							for(var i=0;i<img.length;i++){
								imageGrpIds.push(img[i].id);
							}
							var imgNames = [];
							for(var i=0;i<img.length;i++){
								imgNames.push(img[i].imgObj);
							}
							window.CD.module.data.tempImgId = [];
							window.CD.module.data.tempImgName = [];
							if(isCallfrmDeleteActive){
								undoMng.register(this,  window.CD.module.frame.undoredoloadMultiImageforFrame1,
										[1,frameGrp,frameId,imageGrpId,imageName,img,imageGrpIds,imgNames] ,
										'Undo Label image delete',this,  
										 window.CD.module.frame.undoredoloadMultiImageforFrame1,[2,frameGrp,frameId,imageGrpId,imageName,img,imageGrpIds,imgNames] , 'Redo Label image delete');
								        updateUndoRedoState(undoMng);	
							     /*fix for js error in image add*/
								       
								  if(window.CD.module.data.Json.adminData.imageList == undefined || window.CD.module.data.Json.adminData.imageList==0){
									  window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList = [];
								   }
								ds.setOutputData();	
								 
							}else if(frameGrp.get('.img')[0] && !isCallfrmDeleteActive){
										undoMng.register(this,  window.CD.module.frame.undoredoloadMultiImageforFrame1,
										[2,frameGrp,frameId,imageGrpId,imageName,img,imageGrpIds,imgNames] , 'Undo Label image add',
										this,   window.CD.module.frame.undoredoloadMultiImageforFrame1,
										[1,frameGrp,frameId,imageGrpId,imageName,img,imageGrpIds,imgNames] , 'Redo Label image add');
										 updateUndoRedoState(undoMng);	
							}
						}
					}
				 } catch (err) {
						console.error("@Error on registerUndoRedo from frame.js::"
							+ err.message);
					}
				},
	
	deleteImageFromFrame : function(frameGrp,imageName) {
		try {
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var stg = cs.getCanvas();
			var cdLayer = cs.getLayer();
			var frameGrpId = frameGrp.attrs.id;
			frameGrp = cs.findGroup(frameGrpId);
			var jsonObj = window.CD.module.data.getJsonData();
			$("#deleteElement").removeClass('inactive_del').addClass('active');
			if(frameGrp.get('.img')[0]){
				var frameIndexInOutputData =  window.CD.services.cs.getFrameIndex(frameGrp.attrs.id);
				var imgGrp=window.CD.module.frame.getImgGroup(frameIndexInOutputData,imageName,frameGrp);//frameGrp.get('.img')[0].parent;
				var lablId=frameGrp.getId();
				//var dataindex = window.CD.module.data.getLabelIndex(lablId);
				var imageObject = imgGrp.getChildren()[0];
				var imageName = 'unknown';
				if(imageObject.className == 'Image'){
							imageSrc = $(imageObject.attrs.image).attr('src');
							imageName = imageSrc.substring(imageSrc.lastIndexOf('/')+1,imageSrc.length);
				}
				
				cs.setActiveElement(frameGrp,'frame');	
				
				/*handling error in deleting frame image while undo/redo*/
				
				imgGrp.destroyChildren();
				imgGrp.destroy();	
				delete window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[imgGrp.attrs.id];
				cdLayer.draw();
				window.CD.services.ds.updateImageList(imageName,'remove');
				ds.setOutputData();		
			}
		}catch(err){
			console.error("@Error on deleteImageFromFrame of frame.js::"
					+ err.message);
		}
	
	},
	deleteMultipleImageFromFrame : function(frameGrp,imageName) {
		try {
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var stg = cs.getCanvas();
			var cdLayer = cs.getLayer();
			var frameGrpId = frameGrp.attrs.id;
			frameGrp = cs.findGroup(frameGrpId);
			var jsonObj = window.CD.module.data.getJsonData();
			$("#deleteElement").removeClass('inactive_del').addClass('active');
			if(frameGrp.get('.img')[0]){
				var frameIndexInOutputData =  window.CD.services.cs.getFrameIndex(frameGrp.attrs.id);
				var imgGrp=window.CD.module.frame.getImgGroup(frameIndexInOutputData,imageName,frameGrp);//frameGrp.get('.img')[0].parent;
				var lablId=frameGrp.getId();
				//var dataindex = window.CD.module.data.getLabelIndex(lablId);
				var imageObject = imgGrp.getChildren()[0];
				var imageName = 'unknown';
				if(imageObject.className == 'Image'){
							imageSrc = $(imageObject.attrs.image).attr('src');
							imageName = imageSrc.substring(imageSrc.lastIndexOf('/')+1,imageSrc.length);
				}
				
				cs.setActiveElement(frameGrp,'frame');	
				
				/*handling error in deleting frame image while undo/redo*/
				
				imgGrp.destroyChildren();
				imgGrp.destroy();	
				delete window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList[imgGrp.attrs.id];
				cdLayer.draw();
				window.CD.services.ds.updateImageList(imageName,'remove');
				ds.setOutputData();		
			}
		}catch(err){
			console.error("@Error on deleteImageFromFrame of frame.js::"
					+ err.message);
		}
	
	},
	/**
	 * This is used to get the image group from imageName
	 * called from deleteImageFromFrame()
	 * By Nabonita Bhattacharyya
	 */
	getImgGroup : function(frameIndexInOutputData,imageObj,frameGroup){
		try{
			var cs = window.CD.services.cs;
			var frameImgList = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameImageList;
			var id = '';
			//TODO: find alternative to get frameImageList as Chrome is not able to pupulate the object while loading image
			for(var eachImg in frameImgList){
				var src = frameImgList[eachImg].src;
				var imgName = imageObj.imageName;
				if(!imgName){
					imgName = imageObj;
				}
				if(src == imgName){
					id = eachImg;
				}
			}
			var imgGrp = cs.findObject(frameGroup,id);
			return imgGrp;
		}
		catch(err){
			console.error("@Error on getImgGroup of frame.js::"
					+ err.message);
		}
	},
	/**
	 * function name: undoredoloadImageforFrame()
	 * called from registerUndoRedo() of frame.js
	 */
	undoredoloadImageforFrame : function(action,frameGrp,frameId,imageGrpId,imageName,img) {
		try {
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			if((!frameGrp || frameGrp.children.length==0) && frameId!="") {
				var frameGrp=cdLayer.get('#'+frameId)[0];
			}
			if(frameGrp){
				if(action==1){
					 window.CD.module.frame.deleteImageFromFrame(frameGrp,imageName);
				}else if(action==2){
					var frameIndexInOutputData =  window.CD.services.cs.getFrameIndex(frameGrp.attrs.id);
					var imageGrpId = imageGrpId;
					loadImage(frameGrp,imageGrpId,imageName,'',img);
					cs.setActiveElement(frameGrp,'frame');
					window.CD.services.ds.updateImageList(imageName.imageName,'add');
				}
		    }
			
		} catch (err) {
			console.error("@Error on undoredoloadImageforFrame of frame.js::"
					+ err.message);
		}
	},
	undoredoloadMultiImageforFrame : function(action,frameGrp,frameId,imageGrpId,imageName,img,imageGrpIds,imgNames) {
		try {
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			if((!frameGrp || frameGrp.children.length==0) && frameId!="") {
				var frameGrp=cdLayer.get('#'+frameId)[0];
			}
			if(frameGrp){
				if(action==1){
					for(var i = 0; i<imgNames.length; i++){
						for(var j=0; j<imageGrpIds.length; j++){
							if(imgNames[i].imageName == imgNames[j].imageName)
								 window.CD.module.frame.deleteMultipleImageFromFrame(frameGrp,imgNames[i]);
						}						
					}
				}else if(action==2){
					for(var i = 0; i<imageGrpIds.length; i++){
						var frameIndexInOutputData =  window.CD.services.cs.getFrameIndex(frameGrp.attrs.id);
						for(var i = 0; i<imgNames.length; i++){
							for(var j=0; j<imageGrpIds.length; j++){
								if(imgNames[i].imageName == imgNames[j].imageName){
									loadImage(frameGrp,imageGrpIds[i],imgNames[i],'',img);
									cs.setActiveElement(frameGrp,'frame');
									window.CD.services.ds.updateImageList(imgNames[i].imageName,'add');
								}
							}						
						}

					}
				}
		    }
			
		} catch (err) {
			console.error("@Error on undoredoloadImageforFrame of frame.js::"
					+ err.message);
		}
	},
	undoredoloadMultiImageforFrame1 : function(action,frameGrp,frameId,imageGrpId,imageName,img,imageGrpIds,imgNames) {
		try {
			var cs = window.CD.services.cs;
			var ds = window.CD.services.ds;
			var cdLayer = cs.getLayer();
			if((!frameGrp || frameGrp.children.length==0) && frameId!="") {
				var frameGrp=cdLayer.get('#'+frameId)[0];
			}
			if(frameGrp){
				if(action==1){
					for(var i = 0; i<imgNames.length; i++){
						for(var j=0; j<imageGrpIds.length; j++){
							if(imgNames[i].imageName == imgNames[j].imageName)
								 window.CD.module.frame.deleteMultipleImageFromFrame(frameGrp,imgNames[i]);
						}						
					}
				}else if(action==2){
					for(var i = 0; i<imageGrpIds.length; i++){
						var frameIndexInOutputData =  window.CD.services.cs.getFrameIndex(frameGrp.attrs.id);
						for(var i = 0; i<imgNames.length; i++){
							for(var j=0; j<imageGrpIds.length; j++){
								if(imgNames[i].imageName == imgNames[j].imageName){
									loadImage(frameGrp,imageGrpIds[i],imgNames[i],'',img);
									cs.setActiveElement(frameGrp,'frame');
									window.CD.services.ds.updateImageList(imgNames[i].imageName,'add');
								}
							}						
						}

					}
				}
		    }
			
		} catch (err) {
			console.error("@Error on undoredoloadImageforFrame of frame.js::"
					+ err.message);
		}
	},
	
	/******************************END--IMAGE undo redo related method of frame*************************/
	/**
	 * This method is used for checking if imageName exists in any other
	 * frame or not
	 * By Nabonita Bhattacharyya
	 * called from checkImageAvailableStatus() :: canvasservices.js
	 */
	imageAvailableStatusInFrame : function(imageName){
		try{
			var imgCounter = 0;
			var frameJsonData = window.CD.module.data.Json.FrameData;
			for(var each in frameJsonData){
				var imageList = frameJsonData[each].frameImageList;
				for(var eachList in imageList){
					var imgName = imageList[eachList].src;
					if(imgName == imageName){
						imgCounter++;
					}
				}
			}
			if(imgCounter>0){
				return true;
			}else{
				return false;
			}
		}catch(err){
			console.log("error in imageAvailableStatusInFrame:frame.js::"+ err.message);
		}
		
	},
	audioAvailableStatusInFrame : function(audioName){
		try{
			var audioCounter = 0;
			var frameJsonData = window.CD.module.data.Json.FrameData;
			for(var each in frameJsonData){
				var audioList = frameJsonData[each].frameMediaList;
				if(audioList == audioName){
					audioCounter++;
				}
				
			}
			if(audioCounter>0){
				return true;
			}else{
				return false;
			}
		}catch(err){
			console.log("error in imageAvailableStatusInFrame:frame.js::"+ err.message);
		}
		
	},
	setImgZindex : function(img){
		var frameObj = img.parent;
		var frameIndex = frameObj.attrs.id.split('_')[1];
		var frameImgList = window.CD.module.data.Json.FrameData[frameIndex].frameImageList;
		for(key in frameImgList){
			for(var i=0; i<img.parent.children.length;i++){
				if(key == img.parent.children[i].getId()){
					frameImgList[key].zIndex = img.parent.children[i].getZIndex();
				}
			}
		}	
		window.CD.module.view.attachPublishEvents();
	},
	setTxtZindex : function(txt){
		var parentObj = txt.parent;
		if(parentObj.getId() == "text_layer"){
			var frameIndex = 0;
		}else{
			var frameIndex = parentObj.attrs.id.split('_')[1];
		}
		var frameTxtList = window.CD.module.data.Json.FrameData[frameIndex].frameTextList;
		for(var j=0;j<frameTxtList.length;j++){
			for(var i=0; i<txt.parent.children.length;i++){
				if(txt.parent.children[i].getId()){
					if(frameTxtList[j].textGroupObjID == txt.parent.children[i].getId()){
						frameTxtList[j].zIndex = txt.parent.children[i].getZIndex();
					}
				}
			}
		}	
		window.CD.module.view.attachPublishEvents();
	},
	setFrameZindex : function(frame){
		var parentObj = frame.parent;
		var frameJson = window.CD.module.data.Json;
		for(var i=0; i<parentObj.children.length; i++){		
			if(parentObj.children[i].getId()){
				for(var j=0; j<window.CD.module.data.Json.FrameData.length;j++){
					if(window.CD.module.data.Json.FrameData[j].frameGroupID != 'frame_0'){
						if(window.CD.module.data.Json.FrameData[j].frameGroupID == parentObj.children[i].getId()){
							window.CD.module.data.Json.FrameData[j].zIndex = parentObj.children[i].getZIndex();
						}
					}
				}
			}						
		}	
		window.CD.module.view.attachPublishEvents();
	}
};