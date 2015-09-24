//function loadImage(group,x,y,imgGrpid,src,scaleFactor){
function loadAudioImage(group,audioGrpid,audioName,x,y,undoRedoCall){
	console.log("@imageLoader.loadImage");
	var cd = window.CD;
	var cs = window.CD.services.cs;	
	var cdLayer = cs.getLayer();	
	var audioGroup;
	var audioX = parseInt(x);
	var audioY = parseInt(y);
	if(group.get("#"+audioGrpid).length > 0){
		if(group.get('#'+audioGrpid)){
			audioX = group.get('#'+audioGrpid)[0].getX();
			audioY = group.get('#'+audioGrpid)[0].getY();
			//group.get('#'+audioGrpid)[0].removeChildren();
			//group.get('#'+audioGrpid)[0].destroy();
			//cdLayer.draw();
			cs.setActiveElement(group.get('#'+audioGrpid)[0],'audio');
			cs.deleteActiveElement();
			cdLayer.draw();
		}
	}
	audioGroup = cs.createGroup(audioGrpid,{'draggable':true,'x':audioX,'y':audioY});	
	
	var pauseImageObj = new Image();
	pauseImageObj.src = window.CD.util.getImageUrl() + "pause_btn.gif";
	
    if (pauseImageObj.complete) {		
		var pauseAudioImg = new Kinetic.Image({
			x: 0,
			y: 0,
			image: pauseImageObj,			
			name: 'audio_pause',
			id : 'pause_'+ audioGrpid
		});	
		audioGroup.add(pauseAudioImg);	
	} else {
		var ifChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()); 
		if(ifChrome){
			var pauseAudioImg = new Kinetic.Image({
				x: 0,
				y: 0,
				image: pauseImageObj,			
				name: 'audio_pause',
				id : 'play_'+ audioGrpid
			});				
			audioGroup.add(pauseAudioImg);
			pauseImageObj.onload=function(){};
		}else{
			pauseImageObj.onload = function() {
				var pauseAudioImg = new Kinetic.Image({
					x: 0,
					y: 0,
					image: pauseImageObj,			
					name: 'audio_pause',
					id : 'play_'+ audioGrpid
				});				
				audioGroup.add(pauseAudioImg);
				pauseImageObj.onload=function(){};
			};
			
		}
		
	}
    pauseImageObj.onerror = function(err) {
		console.info("Could not load image."+ err.message );
    };	
  
    pauseAudioImg.on('dblclick',function(evt){
		this.hide();
		this.parent.get('.audio_play')[0].show();
		cdLayer.draw();
		$('#player_container').remove();
		evt.cancelBubble = true;
	});		
			
	
	var playImageObj = new Image();
	playImageObj.src = window.CD.util.getImageUrl() +"play_btn.gif";	 
	if (playImageObj.complete) {		
		var playAudioImg = new Kinetic.Image({
			x: 0,
			y: 0,
			image: playImageObj,			
			name: 'audio_play',
			id : 'play_'+ audioGrpid
		});
		audioGroup.add(playAudioImg);
		
	//	updateAudio(group,audioGroup,audioName,x,y);
		
	} else {
		var ifChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()); 
		if(ifChrome){
			var playAudioImg = new Kinetic.Image({
				x: 0,
				y: 0,
				image: playImageObj,			
				name: 'audio_play',
				id : 'play_'+ audioGrpid
			});
			
			audioGroup.add(playAudioImg);
			
			playImageObj.onload=function(){};
		}else{
			playImageObj.onload = function() {
				var playAudioImg = new Kinetic.Image({
					x: 0,
					y: 0,
					image: playImageObj,			
					name: 'audio_play',
					id : 'play_'+ audioGrpid
				});
				
				audioGroup.add(playAudioImg);
				
				playImageObj.onload=function(){};
			}
			
		}
		
	}
	playImageObj.onerror = function(err) {
		console.info("Could not load image."+ err.message );
    };	 

	
	playAudioImg.on('dblclick',function(evt){
		this.hide();
		this.parent.get('.audio_pause')[0].show();
		cdLayer.draw();
		openPlayer(audioName,audioGroup);
	});
	
    group.add(audioGroup);	
	cdLayer.draw();
    
    updateAudio(group,audioGroup,audioName,x,y,undoRedoCall);
   
}
function updateAudio(group,audioGroup,audioName,x,y,undoRedoCall){
	var undoMng = window.CD.undoManager;
	var ds = window.CD.services.ds;
	var cs = window.CD.services.cs;
	var labelInd = 0,frameIndexInOutputData = 0;
	var jsonData = window.CD.module.data.getJsonData();
	var audioType='';
	var audioXY ={};
	audioXY.x =x;
	audioXY.y =y;

	if(group.attrs.id.match(/frame_[0-9]/)){
		frameIndexInOutputData =  cs.getFrameIndex(group.attrs.id);
		window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameMediaList = audioName;
		audioType = 'audio';
		if(!undoRedoCall){
			if(group.attrs.id.match(/frame_0/))
				undoMng.register(this,cs.deleteAudio,[audioGroup,audioType],'Delete Audio',this, cs.addAudiotoCanvas, [audioName, audioXY , group], 'Recreate Audio');
			else
				undoMng.register(this,cs.deleteAudio,[audioGroup,audioType],'Delete Audio',this, cs.addAudiotoFrame, [audioName, audioXY , group], 'Recreate Audio');
		}
	}else if(group.attrs.id.match(/^label_[0-9]/)){	
		labelInd = window.CD.module.data.getLabelIndex(group.attrs.id);	
		audioType = 'labelaudio';
		if(typeof window.CD.module.data.getDockIndex == "function"){
			jsonData[labelInd].media_PRGT_value = audioName;			
		}else{
			jsonData[labelInd].media_value = audioName;
		}
		 if(!undoRedoCall)
		 undoMng.register(this,cs.deleteAudio,[audioGroup,audioType],'Delete Audio',this, cs.addAudiotoLabel, [audioName, audioXY , group], 'Recreate Audio');
	}else if(group.attrs.id.match(/^dock_label_[0-9]/)){
		if(typeof window.CD.module.data.getDockIndex == "function"){
			labelInd = window.CD.module.data.getDockIndex(group.attrs.id);
		}else{	
			var labelGroup = cs.findGroup(group.attrs.id.split('dock_')[1]);
			labelInd = window.CD.module.data.getLabelIndex(labelGroup.attrs.id);
		}
		audioType = 'labelaudio';
		
		if(typeof window.CD.module.data.getDockIndex == "function"){
			window.CD.module.data.getDockJsonData()[labelInd].media_PRG_value = audioName;			
		}else{
			jsonData[labelInd].media_dock_value = audioName;
		}
		 if(!undoRedoCall)
		 undoMng.register(this,cs.deleteAudio,[audioGroup,audioType],'Delete Audio',this, cs.addAudiotoDock, [audioName, audioXY , group], 'Recreate Audio');
	}
	else if(group.attrs.id.match(/^dock_[0-9]/)){			
		labelInd = window.CD.module.data.getCLSCIndex(group.attrs.id);
		audioType = 'labelaudio';	
		window.CD.module.data.Json.CLSCData[labelInd].media_value = audioName;
		if(!undoRedoCall)
		undoMng.register(this,cs.deleteAudio,[audioGroup,audioType],'Delete Audio',this, cs.addAudiotoDock, [audioName, audioXY , group], 'Recreate Audio');
	}
	updateUndoRedoState(undoMng);
	ds.setOutputData();
	
	
	audioGroup.on('click',function(evt){
		if(audioGroup.parent.attrs.id.match(/frame_[0-9]/)) {
			cs.setActiveElement(this,'audio');
		}
		else {
			cs.setActiveElement(this,'labelaudio');
		}
		evt.cancelBubble = true;
		
		this.moveToTop();    
		cs.updateDragBound(this);			
	});
	audioGroup.on('mousedown',function(evt){
		if(audioGroup.parent.attrs.id.match(/frame_[0-9]/)) {
			cs.setActiveElement(this,'audio');
		}
		else {
			cs.setActiveElement(this,'labelaudio');
		}
		evt.cancelBubble = true;
		
		this.moveToTop();    
		cs.updateDragBound(this);			
	});
	
//	audioGroup.on('dragstart',function(evt){
//		evt.cancelBubble = true;		
//	});
	audioGroup.on('dragend',function(evt){		
		var prevX = 0;
		var prevY = 0;		
		var undoMng = window.CD.undoManager;
		var jsonData = window.CD.module.data.getJsonData();
		var ds = window.CD.services.ds;
		if(this.parent.attrs.id.match(/frame_[0-9]/)){
			prevX = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameMediaXY.x;
			prevY = window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameMediaXY.y;
			window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameMediaXY.x = this.getX();
			window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameMediaXY.y = this.getY();			
		}else if(this.parent.attrs.id.match(/^label_[0-9]/)){			
			if(typeof window.CD.module.data.getDockIndex == "function"){
				prevX = jsonData[labelInd].coor_PRGT_value.x;
				prevY = jsonData[labelInd].coor_PRGT_value.y;
				jsonData[labelInd].coor_PRGT_value.x = this.getX();
				jsonData[labelInd].coor_PRGT_value.y = this.getY();
			}else if(typeof window.CD.module.data.setValuesToCLSPS == "function"){
				
				prevX = jsonData[labelInd].play_option_value.split('|')[0];
				prevY = jsonData[labelInd].play_option_value.split('|')[1];
				jsonData[labelInd].play_option_value = this.getX() + '|' +this.getY();
			}else{
				prevX = jsonData[labelInd].media_label_XY.split('|')[0];
				prevY = jsonData[labelInd].media_label_XY.split('|')[1];
				jsonData[labelInd].media_label_XY = this.getX() + '|' +this.getY();
				}		
			
		}else if(this.parent.attrs.id.match(/^dock_label_[0-9]/)){			
			if(typeof window.CD.module.data.getDockIndex == "function"){
				prevX = window.CD.module.data.getDockJsonData()[labelInd].coor_PRG_value.x;
				prevY = window.CD.module.data.getDockJsonData()[labelInd].coor_PRG_value.y;
				window.CD.module.data.getDockJsonData()[labelInd].coor_PRG_value.x = this.getX();
				window.CD.module.data.getDockJsonData()[labelInd].coor_PRG_value.y = this.getY();
			}else{
				prevX = jsonData[labelInd].media_dock_XY.split('|')[0];
				prevY = jsonData[labelInd].media_dock_XY.split('|')[1];
				jsonData[labelInd].media_dock_XY = this.getX() + '|' +this.getY();
			}			
		}else if(this.parent.attrs.id.match(/^dock_[0-9]/)){			
				var jsonData = window.CD.module.data.Json.CLSCData[labelInd];
				prevX = jsonData.play_option_value.split('|')[0];
				prevY = jsonData.play_option_value.split('|')[1];
				jsonData.play_option_value = this.getX() + '|' +this.getY();
				
		}
		undoMng.register(this, setAudioPosition,[this,prevX,prevY] , 'Undo Audio',this,setAudioPosition,[this,this.getX(),this.getY()] , 'Redo Audio');
		updateUndoRedoState(undoMng);
		ds.setOutputData();	
		evt.cancelBubble = true;
	});
	 
	
}

	function setAudioPosition(groupNode,calx,caly){
		var ds = window.CD.services.ds;
		var cs = window.CD.services.cs;
		var cdLayer = cs.getLayer();
		if(groupNode){
		groupNode = cdLayer.get('#'+groupNode.attrs.id)[0];
		var labelInd = 0,frameIndexInOutputData = 0;
		var jsonData = window.CD.module.data.getJsonData();
		groupNode.setPosition(calx,caly);
		if(groupNode.parent.attrs.id.match(/frame_[0-9]/)){
		frameIndexInOutputData =  cs.getFrameIndex(groupNode.parent.attrs.id);
		}else if(groupNode.parent.attrs.id.match(/^label_[0-9]/)){	
		labelInd = window.CD.module.data.getLabelIndex(groupNode.parent.attrs.id);	
		}else if(groupNode.parent.attrs.id.match(/^dock_label_[0-9]/)){
			if(typeof window.CD.module.data.getDockIndex == "function"){
				labelInd = window.CD.module.data.getDockIndex(groupNode.parent.attrs.id);
			}else{	
				var labelGroup = cs.findGroup(groupNode.parent.attrs.id.split('dock_')[1]);
				labelInd = window.CD.module.data.getLabelIndex(labelGroup.attrs.id);
			}
		}else if(groupNode.parent.attrs.id.match(/^dock_[0-9]/)){
			labelInd = window.CD.module.data.getCLSCIndex(groupNode.parent.attrs.id);
		}
		
		if(groupNode.parent.attrs.id.match(/frame_[0-9]/)){
			
			window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameMediaXY.x = calx;
			window.CD.module.data.Json.FrameData[frameIndexInOutputData].frameMediaXY.y = caly;
		}else if(groupNode.parent.attrs.id.match(/^label_[0-9]/)){
			if(typeof window.CD.module.data.getDockIndex == "function"){				
				jsonData[labelInd].coor_PRGT_value.x = calx;
				jsonData[labelInd].coor_PRGT_value.y = caly;
			}else if(typeof window.CD.module.data.setValuesToCLSPS == "function"){
				jsonData[labelInd].play_option_value =  calx + '|' +caly;
			}else{				
				jsonData[labelInd].media_label_XY = calx + '|' +caly;
			}
			
		}else if(groupNode.parent.attrs.id.match(/^dock_label_[0-9]/)){			
			if(typeof window.CD.module.data.getDockIndex == "function"){
				
				window.CD.module.data.getDockJsonData()[labelInd].coor_PRG_value.x = calx;
				window.CD.module.data.getDockJsonData()[labelInd].coor_PRG_value.y = caly;
			}else{
				
				jsonData[labelInd].media_dock_XY = calx + '|' +caly;
			}
		}else{
			var jsonData = window.CD.module.data.Json.CLSCData[labelInd];
			jsonData.play_option_value = calx + '|' +caly;
		}
		ds.setOutputData();	
		cdLayer.draw();
		}
	}
	function openPlayer(audioName,audioGroup){
		var audio_name = window.CD.util.proccessMediaID(audioName);	
		var sound = new Audio();
		if(sound.canPlayType('audio/mpeg')){
			audio_name = audio_name;
		}
		else if(sound.canPlayType('audio/ogg')){
			audio_name = audio_name.replace('.mp3','.ogg');
		}
		var playerX = audioGroup.parent.getX() + audioGroup.getX() + 10;
		var playerY = audioGroup.parent.getY() + audioGroup.getY() + (($('canvas').first().offset().top)-($(window).scrollTop())) + 40;
		
		
		var audioPlayerContainer =  $('<div id="player_container" class="player_container"></div>')
		var audioControls = $('<audio preload="auto" id="audioControls" style="width:100%;height:22px;" controls="controls" src="'+audio_name+'"></audio>');
		var audioNameDiv = $('<div class="audio_name">'+audioName+'</div>')
		$('#player_container').remove();
		$('body').append(audioPlayerContainer);
		audioPlayerContainer.append(audioControls);
		audioPlayerContainer.append(audioNameDiv);
		
		$("#player_container").css({'left':playerX,'top':playerY});
		
		//$('body').append(audioControls);
		//$('#audioControls').css({'position':'absolute','left':playerX,'top':playerY});
	}