//var commands = {};

createLabel = function(){
			console.log("@LabelTool.createLable::");
			this.labelId = '';
			this.groupId = '';
		};
activateLabel= function(){
			console.log("@LabelTool.activeLable::");
			//this.label = label;
		};
createLabel.prototype = {
	execute:function(){
		console.log("@LabelTool.createLable.execute::");console.log("@window.CD.services.labeltool.createLabel");
		try{
			var cnv = window.CD.services.cs;
			var stg = cnv.getCanvas();
			var cdLayer = cnv.getLayer();
			var lbConfig = new LabelConfig();
			var ds = window.CD.services.ds;
			var totalLabelToCreate = ds.totalElm;
			console.info("lbConfig.p_id::"+lbConfig.p_id);
			
			for(var i = 0; i<totalLabelToCreate; i++) {
				var lblGrpOptions = {draggable:true,x:100,y: 100 + (i*30)};
				var dockGrpOptions = {draggable:true,x:100+lbConfig.style.width+10,y: 100 + (i*30)};
				var labelGroup = cnv.getGroup('label_'+i,lblGrpOptions);
				var dockGroup = cnv.getGroup('dock_label_'+i,dockGrpOptions);
				lbConfig.id = 'lbl_' + i;				
				
				var label = new Kinetic.Rect({
				                width: lbConfig.style.width,
				                height: lbConfig.style.height,						                
				                stroke: '#999999',
				                strokeWidth: 1,
				                cornerRadius: 5,
				                strokeEnabled: true,
				                fill: lbConfig.style.fill,
				                opacity:1,
				                id:lbConfig.id
	               			});
				labelGroup.add(label);
				makeResizable(labelGroup, lbConfig.style.width, lbConfig.style.height);	
				cnv.dragLockUnlock(labelGroup,parseInt(lbConfig.style.width),parseInt(lbConfig.style.height),true);
				//cnv.setActiveElement(labelGroup,'label');
				
				var dock = new Kinetic.Rect({					
			                width: lbConfig.style.width,
			                height: lbConfig.style.height,						                
			                stroke: '#999999',
			                strokeWidth: 1,
			                cornerRadius: 5,
			                strokeEnabled: true,
			                fill: '#ffffff',
			                opacity:1,
			                id:'dock_'+lbConfig.id
		       			});
				dockGroup.add(dock);
				makeResizable(dockGroup, lbConfig.style.width, lbConfig.style.height);	
				cnv.dragLockUnlock(dockGroup,parseInt(lbConfig.style.width),parseInt(lbConfig.style.height),true);
				
				cdLayer.draw();
				
				labelGroup.on('mousedown',function(evt){
					cnv.setActiveElement(this,'label');
					evt.cancelBubble = true;
					cnv.updateDragBound(this);
				});
				/*
				labelGroup.on('mouseup',function(evt){
					evt.cancelBubble = true;
				});
				*/
				dockGroup.on('mousedown',function(evt){
					cnv.setActiveElement(this,'dock');
					evt.cancelBubble = true;
					cnv.updateDragBound(this);
				});
				/*
				dockGroup.on('mouseup',function(evt){
					evt.cancelBubble = true;
				});*/
				
			}
		}catch(err){
			console.error("@window.CD.services.labeltool.createLabel::Error while creating Label::"+err.message);
		}
	},
	undo:function(){
		console.log("@LabelTool.createLable.undo::"+ this.labelId);
		var cnv = window.CD.services.cs;
		var cdLayer = cnv.getLayer();
		var lbGroup = cnv.getGroup(this.groupId);
		console.info("this.labelId::"+this.labelId);
		var label1 = lbGroup.get("#"+this.labelId);
		lbGroup.destroy(label1);
		cdLayer.draw();
	}
};

activateLabel.prototype = {
	execute:function(){
		console.log("@LabelTool.activateLabel.execute::");
	},
	undo:function(){
		console.log("@LabelTool.activateLabel.undo::");
	}
};

UndoDecorator = function(command, undoStack) { // implements ReversibleCommand
	console.log("@LabelTool.UndoDecorator::"); 
	this.command = command;
	this.undoStack = undoStack;
};
UndoDecorator.prototype = {
  execute: function() {
	  console.log("@LabelTool.UndoDecorator.execute::");
    this.undoStack.push(this.command);
    this.command.execute();
  },
  undo: function() {
	  console.log("@LabelTool.UndoDecorator.undo::");
    this.command.undo();
  }
};


/*		activate:function(){
			console.log("@window.CD.services.labeltool.activate");
		},
		createLabel:function(){
			console.log("@window.CD.services.labeltool.createLabel");
			try{
				var cnv = window.CD.services.cs;
				var stg = cnv.getCanvas();
				var cdLayer = cnv.getLayer();
				var lbConfig = new LabelConfig();
				var lbGroup = cnv.getGroup(lbConfig.p_id);
				lbConfig.id = 'label_' + lbGroup.getChildren().length;
				
				var label = new Kinetic.Rect(lbConfig.style);
				
				lbGroup.add(label);
				cdLayer.add(lbGroup);		
				stg.draw();
			}catch(err){
				console.error("@window.CD.services.labeltool.createLabel::Error while creating Label::"+err.message);
			}
		}



handle: function(commandName, callback){
var commandHandler = {
ref: this,
callback: callback
};
commands[commandName] = commandHandler;
},
execute: function(commandName, data){
var cmd = commands[commandName];
if (cmd){
cmd.callback.call(cmd.ref, data);
}
},*/