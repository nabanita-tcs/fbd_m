var Connector = {
		bracketArmLength : 15,
		dragHandleRadius : 5,
		init:function(dock,type){
			if(dock.get('#conn_' + dock.attrs.id) && dock.get('#conn_' + dock.attrs.id)[0]){
				dock.get('#conn_' + dock.attrs.id)[0].remove();
			}
			for(var i=0; i<dock.children.length; i++) {
				if(dock.children[i].nodeType == "Group" && dock.children[i].attrs.id=='conn_' + dock.attrs.id){
					dock.children[i].remove();
				}
			}
			this.drawConnector(dock);
			switch(type){
			  case 'none':
				  this.deleteConnector(dock);
				  Connector.updateConnectorData(dock,0);
				  break;
			  case 'single endpoint':				  
				  this.drawFork(dock,1);	
				  Connector.updateConnectorData(dock,1);
				  break;
			  case 'two endpoint':
				  this.drawFork(dock,2);
				  Connector.updateConnectorData(dock,2);
				  break;
			  case 'three endpoint':
				  this.drawFork(dock,3);
				  Connector.updateConnectorData(dock,3);
				  break;
			  case 'four endpoint':
				  this.drawFork(dock,4);
				  Connector.updateConnectorData(dock,4);
				  break;
			  case 'five endpoint':
				  this.drawFork(dock,5);
				  Connector.updateConnectorData(dock,5);
				  break;
			  case 'bracket':
				  this.drawBracket(dock,'B');
				  Connector.updateConnectorData(dock,'B');
				  break;
			  case 'H bracket':
				  this.drawHBracket(dock,'H');
				  Connector.updateConnectorData(dock,'H');
				  break;
			  }
		},
		
		renderConnector:function(dock,option) {
			console.log("@Connector.renderConnector");
			var cnv = window.CD.services.cs;
			var stg = cnv.getCanvas();
			var cdLayer = cnv.getLayer();	
			var dockId = dock.attrs.id;
			var dockWidth = dock.children[0].getWidth();
			var dockHeight = dock.children[0].getHeight();
			
			this.drawConnector(dock);
			
			var connGroup = dock.children[this.findObj(dock,'conn_' + dockId)];
			var connContentGrp = connGroup.children[this.findObj(connGroup,'conncont_' + dockId)];	
			var connBaseForkGroup = connContentGrp.children[this.findObj(connContentGrp,'connbase_' + dockId)];			
			var basePt = connBaseForkGroup.get('#connbasept_'+dockId)[0];
			var baseEndPt = connBaseForkGroup.get('#baseconnendpt_'+dockId)[0];
			connContentGrp.setOffset(-Math.round(dockWidth/2),0);
			baseEndPt.setX(parseInt(option.connector_mx));
			baseEndPt.setY(parseInt(option.connector_my));
			
			var connectorOption = option.connector_options.connectorType.split('%d%');
			var fork = $.isNumeric(connectorOption[0])?parseInt(connectorOption[0]):connectorOption[0];
			
			if(fork == 'D')
				fork = 1;
			
			connGroup.attrs.fork = fork;
			
			
			if(fork == 'B') {
				this.drawBracket(dock,'B');
				var fork_0_pt = connContentGrp.get('#frkEndPt_' + dockId)[0];
				
				var endPt = connContentGrp.get('#frkEndPt_' + dockId)[0];
				var frkTopPt = connContentGrp.get('#frkTopPt_' + dockId)[0];	
				var frkTopRightPt = connContentGrp.get('#frkTopRightPt_' + dockId)[0];
				var frkBottomPt = connContentGrp.get('#frkBottomPt_' + dockId)[0];	
				var frkBottomRightPt = connContentGrp.get('#frkBottomRightPt_' + dockId)[0];

				var bracketGroup = endPt.parent;
				bracketGroup.setPosition(parseInt(option.connector_lx),parseInt(option.connector_ly));
				
				//frkTopPt.setX(option.connector_lx);
				frkTopPt.setY(- parseInt(connectorOption[1]));
				//frkBottomPt.setX(option.connector_lx);
				frkBottomPt.setY(parseInt(connectorOption[2]));
				
				var conBastPt = connContentGrp.get('#connbasept_'+dockId)[0];

				if(endPt.parent.getX() < conBastPt.getX()) {
					frkTopRightPt.setPosition(frkTopPt.getX() - this.bracketArmLength,frkTopPt.getY());
					frkBottomRightPt.setPosition(frkBottomPt.getX() - this.bracketArmLength,frkBottomPt.getY());
				} else {
					frkTopRightPt.setPosition(frkTopPt.getX() + this.bracketArmLength,frkTopPt.getY());
					frkBottomRightPt.setPosition(frkBottomPt.getX() + this.bracketArmLength,frkBottomPt.getY());
				}
				
				
				//frkTopRightPt.setPosition(frkTopPt.getX()+this.bracketArmLength,frkTopPt.getY());
				//frkBottomRightPt.setPosition(frkBottomPt.getX()+this.bracketArmLength,frkBottomPt.getY());
				
			} else if(fork == 'H') {
				this.drawHBracket(dock,'H');
				var fork_0_pt = connContentGrp.get('#frkEndPt_' + dockId)[0];
				
				var endPt = connContentGrp.get('#frkEndPt_' + dockId)[0];
				var frkTopPt = connContentGrp.get('#frkTopPt_' + dockId)[0];	
				var frkTopRightPt = connContentGrp.get('#frkTopRightPt_' + dockId)[0];
				var frkBottomPt = connContentGrp.get('#frkBottomPt_' + dockId)[0];	
				var frkBottomRightPt = connContentGrp.get('#frkBottomRightPt_' + dockId)[0];
				var bracketGroup = endPt.parent;
				bracketGroup.setPosition(parseInt(option.connector_lx),parseInt(option.connector_ly));
				
				frkTopPt.setX(parseInt(connectorOption[1]));
				//frkTopPt.setY(option.connector_ly);
				frkBottomPt.setX(-parseInt(connectorOption[2]));
				//frkBottomPt.setY(option.connector_ly);
				
				var conBastPt = connContentGrp.get('#connbasept_'+dockId)[0];
				
				if(endPt.parent.getY() < conBastPt.getY()) {
					frkTopRightPt.setPosition(frkTopPt.getX(),frkTopPt.getY() - this.bracketArmLength);
					frkBottomRightPt.setPosition(frkBottomPt.getX(),frkBottomPt.getY() - this.bracketArmLength);
				} else {
					frkTopRightPt.setPosition(frkTopPt.getX(),frkTopPt.getY() + this.bracketArmLength);
					frkBottomRightPt.setPosition(frkBottomPt.getX(),frkBottomPt.getY() + this.bracketArmLength);
				}
				
				
				
				
				//frkTopRightPt.setPosition(frkTopPt.getX()+this.bracketArmLength,frkTopPt.getY());
				//frkBottomRightPt.setPosition(frkBottomPt.getX()+this.bracketArmLength,frkBottomPt.getY());
				
			}else {
				this.drawFork(dock,fork);
				var fork_0_pt = connContentGrp.get('#frkEndPt_0_' + dockId)[0];	
				var head = connContentGrp.get('#connhead_'+dockId)[0];
				head.setX(parseInt(option.connector_lx)-6);
				head.setY(parseInt(option.connector_ly)-11);
				
				fork_0_pt.setX(parseInt(option.connector_lx));
				fork_0_pt.setY(parseInt(option.connector_ly));
				
				for(var i=1; i<parseInt(fork); i++) {
					var pt = connContentGrp.get('#frkEndPt_' + i + '_'+dockId)[0];
					pt.setX(parseInt(connectorOption[(i*2-1)]));
					pt.setY(parseInt(connectorOption[(i*2)]));
				}
			}
			
			
			
			
			
			
			
			switch(option.connector_facing) {
			case 'R':
				connGroup.attrs.connectorPosition = 'R';
				break;
			case 'B':
				connGroup.attrs.connectorPosition = 'B';
				connGroup.rotateDeg(90);
				break;
			case 'L':	
				connGroup.attrs.connectorPosition = 'L';
				connGroup.rotateDeg(180);
				break;
			case 'T':
				connGroup.attrs.connectorPosition = 'T';
				connGroup.rotateDeg(270);
				break;
			}
			//SLEView.resetConnectorPos();
			cdLayer.draw();
			
		},
		
		findObj:function(node,id) {
			for(var i=0; i<node.children.length; i++) {
				if(node.children[i].nodeType == "Group" && node.children[i].attrs.id==id){
					return i;
				}
			}
		},
		
		drawConnector: function(dock) {
			var cnv = window.CD.services.cs;
			var stg = cnv.getCanvas();
			var cdLayer = cnv.getLayer();	
			var dockId = dock.attrs.id;
			var dockWidth = dock.children[0].getWidth();
			var dockHeight = dock.children[0].getHeight();
			this.baseConnWidth = 30;
			var connStartX = Math.round(dockWidth/2);
			var connStartY = 0;
			var connEndX = connStartX + this.baseConnWidth;
			var connEndY = connStartY;			
			var connGroup = cnv.createGroup('conn_' + dockId,{'x':Math.round(dockWidth/2),'y':Math.round(dockHeight/2)});
			var connContentGrp = cnv.createGroup('conncont_' + dockId,{'x':0,'y':0});	
			var connBaseForkGroup = cnv.createGroup('connbase_' + dockId,{'x':0,'y':0});
			var undoMng = window.CD.undoManager;
			/*DEBUG BORDER*/
			
			var connBorder = new Kinetic.Rect({
				x: 0,
				y: 0,
				width: Math.round(dockWidth/2) + 60,
		        height: Math.round(dockHeight/2)+60,						                
		        stroke: '#ff00ff',
		        strokeWidth: 1,
		        strokeEnabled: true   
				});
			//connGroup.add(connBorder);
		
			var connContBorder = new Kinetic.Rect({
				x: 0,
				y: 0,
				width: Math.round(dockWidth/2) + 60,
		        height: Math.round(dockHeight/2)+60,						                
		        stroke: '#ffff00',
		        strokeWidth: 1,
		        strokeEnabled: true   
				});
			//connContentGrp.add(connContBorder);
			
			var connBaseBorder = new Kinetic.Rect({
				x: 0,
				y: 0,
				width: 80,
		        height: 40,						                
		        stroke: '#00ffff',
		        strokeWidth: 1,
		        strokeEnabled: true   
				});
			//connBaseForkGroup.add(connBaseBorder);
			/*DEBUG BORDER END*/
			
			var baseConnectorLine = new Kinetic.Line({
				drawFunc: function (canvas) {
							var connContentGrp = dock.get('#connbase_' + dockId)[0];
							  var ctx = canvas._context;//canvas.getContext();
							  var x1 = 0;
							  var y1 = 0;
							  var x2 = baseEndPt.getX(); 
							  var y2 = baseEndPt.getY();
							  ctx.save();
							  ctx.strokeStyle = "#333333";
							  ctx.shadowColor = "#fff";
							  ctx.shadowBlur = 2;
							  ctx.shadowOffset = 4;
							  ctx.shadowOpacity = 1;
							  ctx.lineWidth = 1;
							  ctx.beginPath();
							  ctx.moveTo(x1, y1);
							  ctx.lineTo(x2, y2);
							  ctx.stroke();
							  ctx.restore();
						  },
		        points: [0,0,this.baseConnWidth,0],
		        stroke: '#333333',
		        strokeWidth: 2,
		        id: 'connbaseline_'+ dockId
		      });
				
			var basePt = Connector.drawPoints(0,0,'connbasept_'+dockId,false,false);
			var baseEndPt = Connector.drawPoints(this.baseConnWidth,0,'baseconnendpt_'+dockId,true,false);	

			connContentGrp.setOffset(-connStartX,connStartY);
			connGroup.attrs.connectorPosition = 'R';		
			
			connBaseForkGroup.add(basePt);
			connBaseForkGroup.add(baseEndPt);
			connBaseForkGroup.add(baseConnectorLine);
			connContentGrp.add(connBaseForkGroup);
			connGroup.add(connContentGrp);
			dock.add(connGroup);
			basePt.moveToTop();
			baseEndPt.moveToTop();
			baseEndPt.on('dragmove',function(dock){  
				cdLayer.draw();
			});
				
		
			basePt.on('click',function(evt){
				evt.cancelBubble = true;
				var dockId = this.attrs.id.substr(11,this.attrs.id.length);
				var dockGroup = cnv.findGroup(dockId);
				var connGroup = dockGroup.children[Connector.findObj(dockGroup,'conn_' + dockId)];
				var connPos = connGroup.attrs.connectorPosition;
				var dockWidth = dockGroup.children[0].getWidth();
				var dockHeight = dockGroup.children[0].getHeight();
				
				switch(connPos) {
				case 'R':
					connGroup.attrs.connectorPosition = 'B';
					break;
				case 'B':
					connGroup.attrs.connectorPosition = 'L';
					break;
				case 'L':	
					connGroup.attrs.connectorPosition = 'T';
					break;
				case 'T':
					connGroup.attrs.connectorPosition = 'R';
					break;
				}
				
				undoMng.register(this, Connector.setConnPos,[this,dockId,connPos,-90] , 'Undo Connector position1',this, Connector.setConnPos,[this,dockId,connGroup.attrs.connectorPosition,90] , 'Redo Connector position');
				updateUndoRedoState(undoMng);
				connGroup.rotateDeg(90);
				SLEView.resetConnectorPos();
				cdLayer.draw();
				Connector.updateConnectorData(this.parent.parent.parent.parent,this.parent.parent.parent.attrs.fork);
			});

			/*baseEndPt.on('dragmove',function(evt){
				evt.cancelBubble = true;
				var labelId = dockId.substr(5,dockId.length);
				console.log(labelId);
			});*/
			
			baseEndPt.setDragBoundFunc(function(pos){
				var boundX = 30;
				var boundY = 30;
				if(shiftDown) {//Shift pressed
					var tolerance = 20;		

					if( (basePt.getAbsolutePosition().y - this.getAbsolutePosition().y) >= 0 &&  (basePt.getAbsolutePosition().y - this.getAbsolutePosition().y) < tolerance ){
						boundX = pos.x;
						boundY = basePt.getAbsolutePosition().y;
					} else if((this.getAbsolutePosition().x - basePt.getAbsolutePosition().x) >= 0 && (this.getAbsolutePosition().x - basePt.getAbsolutePosition().x) < tolerance ) {
						boundX = basePt.getAbsolutePosition().x;
						boundY = pos.y;
					} else {
						try{
							if( Math.abs(basePt.getAbsolutePosition().y - this.getAbsolutePosition().y) < Math.abs(this.getAbsolutePosition().x - basePt.getAbsolutePosition().x)) {										
								this.setY(endPt.getY());
							} else {
								this.setX(endPt.getX());
							}
						}catch(e){
							console.log('Mouse event tracking error');
							return {
								x : this.getAbsolutePosition().x,
								y : this.getAbsolutePosition().y
							}
						}
					}
					
					
					if((basePt.getAbsolutePosition().y == this.getAbsolutePosition().y) && (pos.y - basePt.getAbsolutePosition().y) > tolerance){
						boundX = basePt.getAbsolutePosition().x;
						boundY = pos.y;
					} else if((this.getAbsolutePosition().x == basePt.getAbsolutePosition().x) &&(pos.x - basePt.getAbsolutePosition().x) > tolerance){
						boundX = pos.x;
						boundY = basePt.getAbsolutePosition().y;
					} else if((basePt.getAbsolutePosition().y == this.getAbsolutePosition().y) && (basePt.getAbsolutePosition().y - pos.y) > tolerance){
						boundX = basePt.getAbsolutePosition().x;
						boundY = pos.y;
					} else if((this.getAbsolutePosition().x == basePt.getAbsolutePosition().x) &&(basePt.getAbsolutePosition().x - pos.x) > tolerance){
						boundX = pos.x;
						boundY = basePt.getAbsolutePosition().y;
					}
				} else {
					boundX = pos.x;
					boundY = pos.y;
				}
				return {
					x : boundX,
					y : boundY
				}
				
			}); 
			
			baseEndPt.on('dragend',function(evt){
				evt.cancelBubble = true;
				var labelId = dockId.substr(5,dockId.length);
				var sle = SLEData.getSLEIndex(labelId);
				undoMng.register(
						this, Connector.setPtPos,[dock, this, parseInt(window.CD.module.data.Json.SLEData[sle].connector_mx),parseInt(window.CD.module.data.Json.SLEData[sle].connector_my)] , 'Undo2 Pt position',
						this, Connector.setPtPos,[dock, this, parseInt(this.getX()),parseInt(this.getY())] , 'Redo Pt position'
						);
				updateUndoRedoState(undoMng);
				Connector.updateConnectorData(this.parent.parent.parent.parent,this.parent.parent.parent.attrs.fork);
			});

	},
	
	updateConnector:function(pt){
		
	},
	setPtPos: function(dock, Pt,x,y) {
		try{
			var cnv = window.CD.services.cs;
			var stg = cnv.getCanvas();
			var cdLayer = cnv.getLayer();
			var dockId = dock.attrs.id;
			var conGroup = cnv.findObject(dock,'conn_'+dockId);
			var connContentGroup = cnv.findObject(conGroup,'conncont_'+dockId);
			Pt = connContentGroup.get('#'+Pt.attrs.id)[0];//setPosition was not working after redo connector add, hence Pt is again populated
			Pt.setPosition(x,y);
			if(Pt.attrs.head){
				var textHead = connContentGroup.get('#connhead_'+dockId)[0];
				var headx = parseInt(Pt.getX()) - 6;
				var heady = parseInt(Pt.getY()) - 11;
				textHead.setX(headx);
				textHead.setY(heady);
				textHead.show();
			}
			cdLayer.draw();
			Connector.updateConnectorData(dock,conGroup.attrs.fork);
		} catch(e) {
			console.log(e);
		}
	},
	setBracketTopPtPos: function(dock, Pt,x,y) {
		x = parseInt(x);
		y = parseInt(y);
		var cnv = window.CD.services.cs;
		var stg = cnv.getCanvas();
		var cdLayer = cnv.getLayer();
		var dockId = dock.attrs.id;
		var conGroup = cnv.findObject(dock,'conn_'+dockId);
		var connContentGroup = cnv.findObject(conGroup,'conncont_'+dockId);
		Pt.setPosition(x,y);
		var bracketGroup = Pt.getParent();
		var topRightPt = bracketGroup.get('#frkTopRightPt_' + dockId)[0];
		topRightPt.setPosition(Connector.bracketArmLength,y);		
		cdLayer.draw();
		Connector.updateConnectorData(dock,conGroup.attrs.fork);
	},
	setBracketBottomPtPos: function(dock, Pt,x,y) {
		x = parseInt(x);
		y = parseInt(y);
		var cnv = window.CD.services.cs;
		var stg = cnv.getCanvas();
		var cdLayer = cnv.getLayer();
		var dockId = dock.attrs.id;
		var conGroup = cnv.findObject(dock,'conn_'+dockId);
		var connContentGroup = cnv.findObject(conGroup,'conncont_'+dockId);
		Pt.setPosition(x,y);
		var bracketGroup = Pt.getParent();
		var bottomRightPt = bracketGroup.get('#frkBottomRightPt_' + dockId)[0];
		bottomRightPt.setPosition(Connector.bracketArmLength,y);		
		cdLayer.draw();
		Connector.updateConnectorData(dock,conGroup.attrs.fork);
	},
	setHBracketTopPtPos: function(dock, Pt,x,y) {
		x = parseInt(x);
		y = parseInt(y);
		var cnv = window.CD.services.cs;
		var stg = cnv.getCanvas();
		var cdLayer = cnv.getLayer();
		var dockId = dock.attrs.id;
		var conGroup = cnv.findObject(dock,'conn_'+dockId);
		var connContentGroup = cnv.findObject(conGroup,'conncont_'+dockId);
		Pt.setPosition(x,y);
		var bracketGroup = Pt.getParent();
		var topRightPt = bracketGroup.get('#frkTopRightPt_' + dockId)[0];
		topRightPt.setPosition(x,Connector.bracketArmLength);		
		cdLayer.draw();
		Connector.updateConnectorData(dock,conGroup.attrs.fork);
	},
	setHBracketBottomPtPos: function(dock, Pt,x,y) {
		x = parseInt(x);
		y = parseInt(y);
		var cnv = window.CD.services.cs;
		var stg = cnv.getCanvas();
		var cdLayer = cnv.getLayer();
		var dockId = dock.attrs.id;
		var conGroup = cnv.findObject(dock,'conn_'+dockId);
		var connContentGroup = cnv.findObject(conGroup,'conncont_'+dockId);
		Pt.setPosition(x,y);
		var bracketGroup = Pt.getParent();
		var bottomRightPt = bracketGroup.get('#frkBottomRightPt_' + dockId)[0];
		bottomRightPt.setPosition(x,Connector.bracketArmLength);		
		cdLayer.draw();
		Connector.updateConnectorData(dock,conGroup.attrs.fork);
	},
	setConnPos: function(obj,dockId,connPos,deg) {
//		x = parseInt(x);
//		y = parseInt(y);
		var cnv = window.CD.services.cs;
		var stg = cnv.getCanvas();
		var cdLayer = cnv.getLayer();	
		var dockGroup = cnv.findGroup(dockId);
		var connGroup = dockGroup.children[Connector.findObj(dockGroup,'conn_' + dockId)];
		
		connGroup.attrs.connectorPosition = connPos;
		connGroup.rotateDeg(deg);
		SLEView.resetConnectorPos();
		cdLayer.draw();
		Connector.updateConnectorData(obj.parent.parent.parent.parent,obj.parent.parent.parent.attrs.fork);
	},
	
	drawFork:function(dockGroup,type) {
		//var activeElm = window.CD.elements.active.element;
		//var activeType = window.CD.elements.active.type;
		var cnv = window.CD.services.cs;
		var stg = cnv.getCanvas();
		var cdLayer = cnv.getLayer();
		var undoMng = window.CD.undoManager;
		//if(activeType == 'dock'){
			//var dockGroup = activeElm;
			var dock = dockGroup.children[0];
			var dockId = dockGroup.attrs.id;
			var dockWidth = dock.getWidth();
			var dockHeight = dock.getHeight();
			//var connGroup = cnv.findGroup('conn_' + dockGroup.attrs.id);
			var connGroup = dockGroup.get('#conn_' + dockGroup.attrs.id)[0];
			connGroup.attrs.fork = type;
			if(connGroup){
				var connContentGrp = dockGroup.get('#conncont_' + dockGroup.attrs.id);			
				var connPos = connGroup.attrs.connectorPosition;
				var endPt = dockGroup.get('#baseconnendpt_' + dockGroup.attrs.id)[0];
				
				if($.isNumeric(type)) {
					for(var i=0; i<type; i++) {
						var connContentGrp = dockGroup.get('#conncont_' + dockId)[0];
						var head = false;
						if(i == 0)
							head = true;
						var frkEndPt = Connector.drawPoints(60,i*15,'frkEndPt_' + i + '_'+dockId,true,head);	
						connContentGrp.add(frkEndPt);
						var connId = 'connline_' + i + '_' + dockId;
						var connectorLine = this.addConnector(frkEndPt,endPt,dockId);
						connContentGrp.add(connectorLine);
						connectorLine.moveToBottom();
						
						//Connector.bindConnectorPtEvents(frkEndPt,endPt);
						
						/* Head sign */
						if(i == 0){
							var textHead = new Kinetic.Text({								
										x: 54,//frkEndPt.getX(),
										y: -11,//frkEndPt.getY(),
										text: '+',
										align:'center',
										fontSize: 24,
										fontFamily: 'sans-serif',
										fill: '#000',
										opacity: '1',
										verticalAlign:'top',
										fontStyle: 'bold',
										id: 'connhead_'+dockId										
									  });
							connContentGrp.add(textHead);
							textHead.moveDown();
							textHead.on('mousedown',function(){
								
							});
						}
						
						frkEndPt.on('dragstart',function(evt){
							evt.cancelBubble = true;
							if(this.attrs.head){
								textHead.hide();
								cdLayer.draw();
							}
						});
						
						
						frkEndPt.on('dragmove',function(evt){
								evt.cancelBubble = true;
								cdLayer.draw();
						});
						
						
						
						
						frkEndPt.setDragBoundFunc(function(pos){
							var boundX = 30;
							var boundY = 30;
							if(shiftDown) { // Shift pressed
								var tolerance = 20;								
								if( (endPt.getAbsolutePosition().y - this.getAbsolutePosition().y) >= 0 &&  (endPt.getAbsolutePosition().y - this.getAbsolutePosition().y) < tolerance ){
									boundX = pos.x;
									boundY = endPt.getAbsolutePosition().y;
								} else if((this.getAbsolutePosition().x - endPt.getAbsolutePosition().x) >= 0 && (this.getAbsolutePosition().x - endPt.getAbsolutePosition().x) < tolerance ) {
									boundX = endPt.getAbsolutePosition().x;
									boundY = pos.y;
								} else {
									if( Math.abs(endPt.getAbsolutePosition().y - this.getAbsolutePosition().y) < Math.abs(this.getAbsolutePosition().x - endPt.getAbsolutePosition().x)) {										
										this.setY(endPt.getY());
									} else {
										this.setX(endPt.getX());
									}
								}
								
								
								if((endPt.getAbsolutePosition().y == this.getAbsolutePosition().y) && (pos.y - endPt.getAbsolutePosition().y) > tolerance){
									boundX = endPt.getAbsolutePosition().x;
									boundY = pos.y;
								} else if((this.getAbsolutePosition().x == endPt.getAbsolutePosition().x) &&(pos.x - endPt.getAbsolutePosition().x) > tolerance){
									boundX = pos.x;
									boundY = endPt.getAbsolutePosition().y;
								} else if((endPt.getAbsolutePosition().y == this.getAbsolutePosition().y) && (endPt.getAbsolutePosition().y - pos.y) > tolerance){
									boundX = endPt.getAbsolutePosition().x;
									boundY = pos.y;
								} else if((this.getAbsolutePosition().x == endPt.getAbsolutePosition().x) &&(endPt.getAbsolutePosition().x - pos.x) > tolerance){
									boundX = pos.x;
									boundY = endPt.getAbsolutePosition().y;
								}
							} else {
								boundX = pos.x;
								boundY = pos.y;
							}
							return {
								x : boundX,
								y : boundY
							}
							
						});  
						
						frkEndPt.on('dragend',function(evt){
							evt.cancelBubble = true;
							var labelId = dockId.substr(5,dockId.length);
							var sle = SLEData.getSLEIndex(labelId);
							var connector_options = window.CD.module.data.Json.SLEData[sle].connector_options.connectorType.split('%d%');
							
							if(this.attrs.head){
								var x = window.CD.module.data.Json.SLEData[sle].connector_lx;
								var y = window.CD.module.data.Json.SLEData[sle].connector_ly;
								undoMng.register(this, Connector.setPtPos,[dockGroup,this,parseInt(x),parseInt(y)] , 'Undo Pt position3',
										 		 this, Connector.setPtPos,[dockGroup,this,parseInt(this.getX()),parseInt(this.getY())] , 'Redo Pt position');
								
								updateUndoRedoState(undoMng);
								textHead.setX(this.getX()-6);
								textHead.setY(this.getY()-11);
								textHead.show();
								//this.attrs.pointingImg = Connector.getPointingImageData(this);
								cdLayer.draw();
							} else {							
								var ptInd = parseInt(this.attrs.id.split('_')[1]) - 1;
								var xInd = (ptInd * 2) + 1;
								var yInd = xInd + 1;
								undoMng.register(this, Connector.setPtPos,[dockGroup,this,parseInt(connector_options[xInd]),parseInt(connector_options[yInd])] , 'Undo Pt position',
												 this, Connector.setPtPos,[dockGroup,this,parseInt(this.getX()),parseInt(this.getY())] , 'Redo Pt position');
								updateUndoRedoState(undoMng);
							}
							Connector.updateConnectorData(this.parent.parent.parent,this.parent.parent.attrs.fork);
						});
						/*
						frkEndPt.on('mouseover',function(){
							if(this.attrs.head){
								var pointingImage = Connector.getPointingImageData(this.parent.parent.parent);
								if(pointingImage)
									console.log('>>>>>Pointing on '+pointingImage.src+ '  on frame_'+pointingImage.frame);
							}
						});
						*/
						delete connectorLine;
					}
				}							
			}
		cdLayer.draw();
		
	},
	drawBracket:function(dockGroup,type) {
		var cs = window.CD.services.cs;
		var stg = cs.getCanvas();
		var cdLayer = cs.getLayer();			
		var dock = dockGroup.children[0];
		var dockId = dockGroup.attrs.id;
		var dockWidth = dock.getWidth();
		var dockHeight = dock.getHeight();
		var connGroup = dockGroup.get('#conn_' + dockGroup.attrs.id)[0];
		connGroup.attrs.fork = type;
		var undoMng = window.CD.undoManager;
		
		if(connGroup){ 
			var connContentGrp = dockGroup.get('#conncont_' + dockGroup.attrs.id)[0];	
			var bracketGroup = cs.createGroup('#conncontBrkt_' + dockGroup.attrs.id,{'x':60,'y':0,'draggable':true});
			var connPos = connGroup.attrs.connectorPosition;
			connContentGrp.add(bracketGroup);
			
			/***********Debug Border***********/
			var border = new Kinetic.Rect({
                width: 100,
                height: 100,
                stroke: '#ffff00',
                strokeWidth: 1,
                strokeEnabled: true,
                opacity:1			                
               });
			//bracketGroup.add(border);
			/*****************************************/
			
			var baseEndPt = connContentGrp.get('#baseconnendpt_' + dockGroup.attrs.id)[0];
			
			if(type == 'B') {
				var frkEndPt = Connector.drawPoints(0,0,'frkEndPt_' + dockId,false,true);
				frkEndPt.setRadius(this.dragHandleRadius);
				frkEndPt.setOpacity(1);
												  
				bracketGroup.add(frkEndPt);
				
				var connectorLine = this.addConnector(baseEndPt,bracketGroup,dockId);
				connContentGrp.add(connectorLine);
				connectorLine.moveToBottom();
				var frkTopPt = Connector.drawPoints(0,-15,'frkTopPt_' + dockId,true);	
				var frkTopRightPt = Connector.drawPoints(frkTopPt.getX()+15,frkTopPt.getY(),'frkTopRightPt_' + dockId,true);
				var frkBottomPt = Connector.drawPoints(0,15,'frkBottomPt_' + dockId,true);	
				var frkBottomRightPt = Connector.drawPoints(frkBottomPt.getX()+15,frkBottomPt.getY(),'frkBottomRightPt_' + dockId,true);

				//var rotationHandler = Connector.drawPoints(frkTopPt.getX(),frkTopPt.getY()- 15,'rotate_' + dockId,true);	
				
				bracketGroup.add(frkTopPt);
				bracketGroup.add(frkTopRightPt);
				bracketGroup.add(frkBottomPt);
				bracketGroup.add(frkBottomRightPt);
				
				//bracketGroup.add(rotationHandler);
				
				frkTopRightPt.hide();
				frkBottomRightPt.hide();
				
				var connectorTopLine = this.addConnector(frkTopPt,frkEndPt,dockId);
				var connectorTopRightLine = this.addConnector(frkTopPt,frkTopRightPt,dockId);
				var connectorBottomLine = this.addConnector(frkBottomPt,frkEndPt,dockId);
				var connectorBottomRightLine = this.addConnector(frkBottomPt,frkBottomRightPt,dockId);
				bracketGroup.add(connectorTopLine);
				bracketGroup.add(connectorTopRightLine);
				bracketGroup.add(connectorBottomLine);
				bracketGroup.add(connectorBottomRightLine);
				connectorTopLine.moveToBottom();
				connectorBottomLine.moveToBottom();
				connectorTopRightLine.moveToBottom();
				connectorBottomRightLine.moveToBottom();
				/*
				rotationHandler.on('mouseover',function(){
					//document.body.style.cursor = "move";
					//cdLayer.draw();
				});
				
				rotationHandler.on('mouseout',function(){
					//document.body.style.cursor = "pointer";
					//cdLayer.draw();
				});*/
				
				
				baseEndPt.moveToTop();
				bracketGroup.moveToTop();
				
				
				
				 var controlGroup = cs.createGroup('controlGroup_'+dockId,{'x':frkTopPt.getX(),'y':frkTopPt.getY()- 15,'draggable':true}); 
				 var sign = new Kinetic.Path({
				        x:0,
				        y:-15,
				        data: 'M12.582,9.551C3.251,16.237,0.921,29.021,7.08,38.564l-2.36,1.689l4.893,2.262l4.893,2.262l-0.568-5.36l-0.567-5.359l-2.365,1.694c-4.657-7.375-2.83-17.185,4.352-22.33c7.451-5.338,17.817-3.625,23.156,3.824c5.337,7.449,3.625,17.813-3.821,23.152l2.857,3.988c9.617-6.893,11.827-20.277,4.935-29.896C35.591,4.87,22.204,2.658,12.582,9.551z',
				        fill: '#000000',
				        scale: 0.4
				      });
				 var control = new Kinetic.Circle ({
					    x: 0, y: 0, fill: 'yellow', opacity: 1, radius: 17
					  }); 
				 controlGroup.add (sign);
					  
					  
					  
					  
					  
							  
					  
					  
					  
					  /***********Debug Border***********/
						var border1 = new Kinetic.Rect({
			                width: 50,
			                height: 50,
			                stroke: '#ff0000',
			                strokeWidth: 1,
			                strokeEnabled: true,
			                opacity:1			                
			               });
						//controlGroup.add(border1);
						/*****************************************/
						
						var line = new Kinetic.Line ({
						    points: Connector.linePoints (57,bracketGroup), stroke: 'black', opacity: 0
						  }); bracketGroup.add (line);
						  
						  var control = new Kinetic.Circle ({
							    x: 0, y: 0, fill: 'yellow', opacity: 0, radius: 17
							  }); //controlGroup.add (control)
							  
						controlGroup.add (control);
						//bracketGroup.add(controlGroup);
			
						
						
						controlGroup.setDragBoundFunc (function (pos) {
							/*var groupPos = bracketGroup.getPosition();
							var x = bracketGroup.getAbsolutePosition().x;
				            var y = bracketGroup.getAbsolutePosition().y;
				            var radius = 50;
				            var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
				            if(scale < 1){
				            	var rotation = Connector.degrees (Connector.angle (groupPos.x, groupPos.y, Math.round((pos.x - x) * scale + x), Math.round((pos.y - y) * scale + y)));
				            	bracketGroup.setRotationDeg (rotation);
				            	cdLayer.draw();
				              return {
				                y: Math.round((pos.y - y) * scale + y),
				                x: Math.round((pos.x - x) * scale + x)
				              };
				            }
				            else {
				            	var rotation = Connector.degrees (Connector.angle (groupPos.x, groupPos.y, pos.x, pos.y));
				            	bracketGroup.setRotationDeg (rotation);
				            	cdLayer.draw();
				              return pos;
				            }
							*/
							var boundx = 0;
							var boundy = 0;
							if(this.parent.parent.parent.getRotationDeg() == 90 || this.parent.parent.parent.getRotationDeg() == 270) {
								boundx = pos.x;
								boundy = this.getAbsolutePosition().y;
							} else {
								boundx = this.getAbsolutePosition().x;
								boundy = pos.y;
							}
							
							var rotation = Connector.degrees (Connector.angle (bracketGroup.getAbsolutePosition().x, bracketGroup.getAbsolutePosition().y, pos.x, pos.y));
							bracketGroup.setRotationDeg (rotation);
							cdLayer.draw();
							return {
								x: boundx,
								y: boundy
							}
							
							
							
						    //var groupPos = bracketGroup.getPosition();
						   // //var rotation = Connector.degrees (Connector.angle (groupPos.x, groupPos.y, pos.x, pos.y));						    
						    //var rotation = Connector.degrees (Connector.angle (bracketGroup.getAbsolutePosition().x, bracketGroup.getAbsolutePosition().y, pos.x, pos.y));
						    //bracketGroup.setRotationDeg (rotation);
						    ////line.setPoints (linePoints (dis - 33))
						    //cdLayer.draw()
						    //return pos
						    
						  })
						
						
						controlGroup.on('dragend',function(){
							this.parent.setAbsolutePosition(frkTopPt.getAbsolutePosition().x,frkTopPt.getAbsolutePosition().y - 15);
						});
						
						
						
						
						/*
					  
				rotationHandler.setDragBoundFunc (function (pos) {
					try {
				    var groupPos = this.parent.getPosition();
				    var rotation = Connector.degrees (Connector.angle (groupPos.x, groupPos.y, pos.x, pos.y));
				    ////status.setText ('x: ' + pos.x + '; y: ' + pos.y + '; rotation: ' + rotation + '; distance:' + dis);
				    this.parent.setRotationDeg (rotation);
				    //line.setPoints (linePoints (dis - 33));
				    cdLayer.draw();
				   
				    
				    //console.log(rotation);
				    
				    //function radians (degrees) {return degrees * (Math.PI/180)};
				   // function degrees (radians) {return radians * (180/Math.PI)};
				    // Calculate the angle between two points.
				    // cf. http://stackoverflow.com/a/12221474/257568
				    //function angle (cx, cy, px, py) {var x = cx - px; var y = cy - py; return Math.atan2 (-y, -x)};
				    console.log('fdddddddddd');
				    return pos;
					} catch(e){
					console.log(e);	
					}
				  });
				
				
				rotationHandler.on('dragmove1',function(e){
					 var canvasOffset = $("#canvas").offset();
					 var offsetX = canvasOffset.left;
					 var offsetY = canvasOffset.top;
					//Connector.handleRotation(this.parent.getX(),this.parent.getY(),parseInt(e.clientX - offsetX),parseInt(e.clientY - offsetY));
					 
					 mouseXFromCenter = e.clientX - this.parent.getAbsolutePosition().x;
			            mouseYFromCenter = e.clientY - this.parent.getAbsolutePosition().y;
			            mouseAngle = Math.atan2(mouseYFromCenter, mouseXFromCenter);

			            var rotateAngle = mouseAngle;
			           console.log('fffffffffffffffffffff'); 
			            
				});
				*/
						
				bracketGroup.setDragBoundFunc(function(pos){
					var boundX = 30;
					var boundY = 30;
					if(shiftDown) { // Shift pressed
						var tolerance = 20;								
						if( (baseEndPt.getAbsolutePosition().y - this.getAbsolutePosition().y) >= 0 &&  (baseEndPt.getAbsolutePosition().y - this.getAbsolutePosition().y) < tolerance ){
							boundX = pos.x;
							boundY = baseEndPt.getAbsolutePosition().y;
						} else if((this.getAbsolutePosition().x - baseEndPt.getAbsolutePosition().x) >= 0 && (this.getAbsolutePosition().x - baseEndPt.getAbsolutePosition().x) < tolerance ) {
							boundX = baseEndPt.getAbsolutePosition().x;
							boundY = pos.y;
						} else {
							if( Math.abs(baseEndPt.getAbsolutePosition().y - this.getAbsolutePosition().y) < Math.abs(this.getAbsolutePosition().x - baseEndPt.getAbsolutePosition().x)) {										
								this.setY(baseEndPt.getY());
							} else {
								this.setX(baseEndPt.getX());
							}
						}
						
						
						if((baseEndPt.getAbsolutePosition().y == this.getAbsolutePosition().y) && (pos.y - baseEndPt.getAbsolutePosition().y) > tolerance){
							boundX = baseEndPt.getAbsolutePosition().x;
							boundY = pos.y;
						} else if((this.getAbsolutePosition().x == baseEndPt.getAbsolutePosition().x) &&(pos.x - baseEndPt.getAbsolutePosition().x) > tolerance){
							boundX = pos.x;
							boundY = baseEndPt.getAbsolutePosition().y;
						} else if((baseEndPt.getAbsolutePosition().y == this.getAbsolutePosition().y) && (baseEndPt.getAbsolutePosition().y - pos.y) > tolerance){
							boundX = baseEndPt.getAbsolutePosition().x;
							boundY = pos.y;
						} else if((this.getAbsolutePosition().x == baseEndPt.getAbsolutePosition().x) &&(baseEndPt.getAbsolutePosition().x - pos.x) > tolerance){
							boundX = pos.x;
							boundY = baseEndPt.getAbsolutePosition().y;
						}
					} else {
						boundX = pos.x;
						boundY = pos.y;
					}
					return {
						x : boundX,
						y : boundY
					}
					
				}); 		
						
						
						
						
				bracketGroup.on('dragmove',function(){		
					var topArmLen = frkTopRightPt.getX() - frkTopPt.getX();
					var bottomArmLen = frkBottomRightPt.getX() - frkBottomPt.getX();	
					var topYdiff = this.getY() - frkTopRightPt.getY();
					var bottomYdiff = frkBottomRightPt.getY() - this.getY();
					
					var YDiff = this.getY();
					var conBastPt = connContentGrp.get('#connbasept_'+dockId)[0];
					
					if(this.getX() < conBastPt.getX()) {
						//frkTopRightPt.setPosition(frkTopPt.getX()+topArmLen,frkTopPt.getY() - 15);
						//frkBottomRightPt.setPosition(frkBottomPt.getX()+bottomArmLen,frkBottomPt.getY() - 15);
						frkTopRightPt.setX(frkTopPt.getX() - 15);
						frkBottomRightPt.setX(frkBottomPt.getX() - 15);
					} else {
						//frkTopRightPt.setPosition(frkTopPt.getX()+topArmLen,frkTopPt.getY() + 15);
						//frkBottomRightPt.setPosition(frkBottomPt.getX()+bottomArmLen,frkBottomPt.getY() + 15);
						frkTopRightPt.setX(frkTopPt.getX() + 15);
						frkBottomRightPt.setX(frkBottomPt.getX() + 15);
					}

					
					cdLayer.draw();
				});
				
				bracketGroup.on('dragend',function(evt){
					evt.cancelBubble = true;
					var dock = this.parent.parent.parent;
					var dockId = dock.attrs.id;
					var labelId = dockId.substr(5,dockId.length);
					var sle = SLEData.getSLEIndex(labelId);
					var connector_lx = window.CD.module.data.Json.SLEData[sle].connector_lx;
					var connector_ly = window.CD.module.data.Json.SLEData[sle].connector_ly;

					undoMng.register(this, Connector.setPtPos,[dock,this,parseInt(connector_lx),parseInt(connector_ly)] , 'Undo Pt position',
									 this, Connector.setPtPos,[dock,this,parseInt(this.getX()),parseInt(this.getY())] , 'Redo Pt position');
					
					updateUndoRedoState(undoMng);
					Connector.updateConnectorData(this.parent.parent.parent,this.parent.parent.attrs.fork);
					cdLayer.draw();
				});
				
				frkTopPt.setDragBoundFunc(function(pos){ 
					var boundx = 0;
					var boundy = 0;
					/*
					var x = boundx;
		            var y = boundy;
		            var radius = this.parent.get('#frkEndPt_' + this.parent.parent.parent.attrs.id)[0].getY() - this.getY();
		            var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
		            if(scale < 1)
		              return {
		                y: Math.round((pos.y - y) * scale + y),
		                x: Math.round((pos.x - x) * scale + x)
		              };
		            else
		              return pos;
		          */
				
					
					if(this.parent.parent.parent.getRotationDeg() == 90 || this.parent.parent.parent.getRotationDeg() == 270) {
						boundx = pos.x;
						boundy = this.getAbsolutePosition().y;
					} else {
						//var rotation = Connector.degrees (Connector.angle (bracketGroup.getAbsolutePosition().x, bracketGroup.getAbsolutePosition().y, pos.x, pos.y));
						//bracketGroup.setRotationDeg (rotation);
						boundx = this.getAbsolutePosition().x;
						boundy = pos.y;
					}
					
					/*
					var rotation = Connector.degrees (Connector.angle (bracketGroup.getAbsolutePosition().x, bracketGroup.getAbsolutePosition().y, pos.x, pos.y));
					bracketGroup.setRotationDeg (rotation);
					cdLayer.draw();
					*/
					
					return {
						x: boundx,
						y: boundy
					}
					
					
					
				});           
				
				frkBottomPt.setDragBoundFunc(function(pos){ 
					var boundx = 0;
					var boundy = 0;
					if(this.parent.parent.parent.getRotationDeg() == 90 || this.parent.parent.parent.getRotationDeg() == 270) {
						boundx = pos.x;
						boundy = this.getAbsolutePosition().y;
					} else {
						boundx = this.getAbsolutePosition().x;
						boundy = pos.y;
					}
					return {
						x: boundx,
						y: boundy
					}
				}); 
				
				frkTopRightPt.setDragBoundFunc(function(pos){ 
					var boundx = 0;
					var boundy = 0;
					if(this.parent.parent.getRotationDeg() == 90 || this.parent.parent.getRotationDeg() == 270) {
						boundx = this.getAbsolutePosition().x;
						boundy = pos.y;
					} else {
						boundx = pos.x;
						boundy = this.getAbsolutePosition().y;
					}
					return {
						x: boundx,
						y: boundy
					}
				});     
				
				frkBottomRightPt.setDragBoundFunc(function(pos){ 
					var boundx = 0;
					var boundy = 0;
					if(this.parent.parent.getRotationDeg() == 90 || this.parent.parent.getRotationDeg() == 270) {
						boundx = this.getAbsolutePosition().x;
						boundy = pos.y;
					} else {
						boundx = pos.x;
						boundy = this.getAbsolutePosition().y;
					}
					return {
						x: boundx,
						y: boundy
					}
				});   
				
				frkEndPt.on('dragmove',function(){
					var topArmLen = frkTopRightPt.getX() - frkTopPt.getX();
					var bottomArmLen = frkBottomRightPt.getX() - frkBottomPt.getX();	
					var topYdiff = this.getY() - frkTopRightPt.getY();
					var bottomYdiff = frkBottomRightPt.getY() - this.getY();
					
					var YDiff = this.getY();
					
					frkTopPt.setX(this.getX());
					frkBottomPt.setX(this.getX());
					//frkTopPt.setY(YDiff - Math.abs(topYdiff));
					//frkBottomPt.setY(YDiff + Math.abs(bottomYdiff));
					frkTopRightPt.setPosition(frkTopPt.getX()+topArmLen,frkTopPt.getY());
					frkBottomRightPt.setPosition(frkBottomPt.getX()+bottomArmLen,frkBottomPt.getY());
					
					
					
					cdLayer.draw();
				});			
				
				frkTopPt.on('dragmove',function(){
					frkTopRightPt.setY(this.getY());
					cdLayer.draw();
				});									
				frkBottomPt.on('dragmove',function(){
					frkBottomRightPt.setY(this.getY());
					cdLayer.draw();
				});
				
				
				
				frkTopPt.on('dragend',function(evt){
					evt.cancelBubble = true;
					var dock = this.parent.parent.parent.parent;
					var dockId = dock.attrs.id;
					var labelId = dockId.substr(5,dockId.length);
					var sle = SLEData.getSLEIndex(labelId);
					var connector_options = window.CD.module.data.Json.SLEData[sle].connector_options.connectorType.split('%d%');					
					var topLen = connector_options[1];

					undoMng.register(this, Connector.setBracketTopPtPos,[dock,this,this.getX(),-topLen] , 'Undo Pt position',
									 this, Connector.setBracketTopPtPos,[dock,this,this.getX(),this.getY()] , 'Redo Pt position');
					
					updateUndoRedoState(undoMng);
					//Connector.updateConnectorData(dock,dock.attrs.fork);
					Connector.updateConnectorData(this.parent.parent.parent.parent,this.parent.parent.parent.attrs.fork);
					//var roratePoint = dock.get('#rotate_' + dockId)[0];
					//roratePoint.setPosition(this.getX(),this.getY()- 15);
					cdLayer.draw();
				});		
						
				frkBottomPt.on('dragend',function(evt){
					evt.cancelBubble = true;
					var dock = this.parent.parent.parent.parent;
					var dockId = dock.attrs.id;
					var labelId = dockId.substr(5,dockId.length);
					var sle = SLEData.getSLEIndex(labelId);
					var connector_options = window.CD.module.data.Json.SLEData[sle].connector_options.connectorType.split('%d%');					
					var botLen = connector_options[2];

					undoMng.register(this, Connector.setBracketBottomPtPos,[dock,this,this.getX(),botLen] , 'Undo Pt position',
									 this, Connector.setBracketBottomPtPos,[dock,this,this.getX(),this.getY()] , 'Redo Pt position');
					updateUndoRedoState(undoMng);
					Connector.updateConnectorData(this.parent.parent.parent.parent,this.parent.parent.parent.attrs.fork);
					cdLayer.draw();
				});	
				
			}
			
		}
		cdLayer.draw();
	},
	
	drawHBracket:function(dockGroup,type) {
		var cs = window.CD.services.cs;
		var stg = cs.getCanvas();
		var cdLayer = cs.getLayer();			
		var dock = dockGroup.children[0];
		var dockId = dockGroup.attrs.id;
		var dockWidth = dock.getWidth();
		var dockHeight = dock.getHeight();
		var connGroup = dockGroup.get('#conn_' + dockGroup.attrs.id)[0];
		connGroup.attrs.fork = type;
		var undoMng = window.CD.undoManager;
		
		if(connGroup){ 
			var connContentGrp = dockGroup.get('#conncont_' + dockGroup.attrs.id)[0];	
			var bracketGroup = cs.createGroup('#conncontBrkt_' + dockGroup.attrs.id,{'x':60,'y':0,'draggable':true});
			var connPos = connGroup.attrs.connectorPosition;
			connContentGrp.add(bracketGroup);
			
			/***********Debug Border***********/
			var border = new Kinetic.Rect({
                width: 100,
                height: 100,
                stroke: '#ffff00',
                strokeWidth: 1,
                strokeEnabled: true,
                opacity:1			                
               });
			//bracketGroup.add(border);
			/*****************************************/
			
			var baseEndPt = connContentGrp.get('#baseconnendpt_' + dockGroup.attrs.id)[0];
			
			if(type == 'H') {
				var frkEndPt = Connector.drawPoints(0,0,'frkEndPt_' + dockId,false,true);
				frkEndPt.setRadius(this.dragHandleRadius);
				frkEndPt.setOpacity(1);
												  
				bracketGroup.add(frkEndPt);
				
				var connectorLine = this.addConnector(baseEndPt,bracketGroup,dockId);
				connContentGrp.add(connectorLine);
				connectorLine.moveToBottom();
				var frkTopPt = Connector.drawPoints(15,0,'frkTopPt_' + dockId,true);	
				var frkTopRightPt = Connector.drawPoints(frkTopPt.getX(),frkTopPt.getY()+15,'frkTopRightPt_' + dockId,true);
				var frkBottomPt = Connector.drawPoints(-15,0,'frkBottomPt_' + dockId,true);	
				var frkBottomRightPt = Connector.drawPoints(frkBottomPt.getX(),frkBottomPt.getY()+15,'frkBottomRightPt_' + dockId,true);
				
				//var rotationHandler = Connector.drawPoints(frkTopPt.getX(),frkTopPt.getY()- 15,'rotate_' + dockId,true);	
				
				bracketGroup.add(frkTopPt);
				bracketGroup.add(frkTopRightPt);
				bracketGroup.add(frkBottomPt);
				bracketGroup.add(frkBottomRightPt);
				
				//bracketGroup.add(rotationHandler);
				
				frkTopRightPt.hide();
				frkBottomRightPt.hide();
				
				var connectorTopLine = this.addConnector(frkTopPt,frkEndPt,dockId);
				var connectorTopRightLine = this.addConnector(frkTopPt,frkTopRightPt,dockId);
				var connectorBottomLine = this.addConnector(frkBottomPt,frkEndPt,dockId);
				var connectorBottomRightLine = this.addConnector(frkBottomPt,frkBottomRightPt,dockId);
				bracketGroup.add(connectorTopLine);
				bracketGroup.add(connectorTopRightLine);
				bracketGroup.add(connectorBottomLine);
				bracketGroup.add(connectorBottomRightLine);
				connectorTopLine.moveToBottom();
				connectorBottomLine.moveToBottom();
				connectorTopRightLine.moveToBottom();
				connectorBottomRightLine.moveToBottom();
				
				baseEndPt.moveToTop();
				bracketGroup.moveToTop();
				
				 var controlGroup = cs.createGroup('controlGroup_'+dockId,{'x':frkTopPt.getX(),'y':frkTopPt.getY()- 15,'draggable':true}); 
				 var sign = new Kinetic.Path({
				        x:0,
				        y:-15,
				        data: 'M12.582,9.551C3.251,16.237,0.921,29.021,7.08,38.564l-2.36,1.689l4.893,2.262l4.893,2.262l-0.568-5.36l-0.567-5.359l-2.365,1.694c-4.657-7.375-2.83-17.185,4.352-22.33c7.451-5.338,17.817-3.625,23.156,3.824c5.337,7.449,3.625,17.813-3.821,23.152l2.857,3.988c9.617-6.893,11.827-20.277,4.935-29.896C35.591,4.87,22.204,2.658,12.582,9.551z',
				        fill: '#000000',
				        scale: 0.4
				      });
				 var control = new Kinetic.Circle ({
					    x: 0, y: 0, fill: 'yellow', opacity: 1, radius: 17
					  }); 
				 controlGroup.add (sign);
					  
					  
					  /***********Debug Border***********/
						var border1 = new Kinetic.Rect({
			                width: 50,
			                height: 50,
			                stroke: '#ff0000',
			                strokeWidth: 1,
			                strokeEnabled: true,
			                opacity:1			                
			               });
						//controlGroup.add(border1);
						/*****************************************/
						
						var line = new Kinetic.Line ({
						    points: Connector.linePoints (57,bracketGroup), stroke: 'black', opacity: 0
						  }); bracketGroup.add (line);
						  
						  var control = new Kinetic.Circle ({
							    x: 0, y: 0, fill: 'yellow', opacity: 0, radius: 17
							  }); //controlGroup.add (control)
							  
						controlGroup.add (control);
						//bracketGroup.add(controlGroup);
			
						
						
						controlGroup.setDragBoundFunc (function (pos) {
							
							var boundx = 0;
							var boundy = 0;
							if(this.parent.parent.parent.getRotationDeg() == 90 || this.parent.parent.parent.getRotationDeg() == 270) {
								boundx = this.getAbsolutePosition().x;
								boundy = pos.y;
							} else {								
								boundx = pos.x;
								boundy = this.getAbsolutePosition().y;
							}
							
							var rotation = Connector.degrees (Connector.angle (bracketGroup.getAbsolutePosition().x, bracketGroup.getAbsolutePosition().y, pos.x, pos.y));
							bracketGroup.setRotationDeg (rotation);
							cdLayer.draw();
							return {
								x: boundx,
								y: boundy
							}
							
							
						    
						  })
						
						
						controlGroup.on('dragend',function(){
							this.parent.setAbsolutePosition(frkTopPt.getAbsolutePosition().x,frkTopPt.getAbsolutePosition().y - 15);
						});
						
						bracketGroup.setDragBoundFunc(function(pos){
							var boundX = 30;
							var boundY = 30;
							if(shiftDown) { // Shift pressed
								var tolerance = 20;								
								if( (baseEndPt.getAbsolutePosition().y - this.getAbsolutePosition().y) >= 0 &&  (baseEndPt.getAbsolutePosition().y - this.getAbsolutePosition().y) < tolerance ){
									boundX = pos.x;
									boundY = baseEndPt.getAbsolutePosition().y;
								} else if((this.getAbsolutePosition().x - baseEndPt.getAbsolutePosition().x) >= 0 && (this.getAbsolutePosition().x - baseEndPt.getAbsolutePosition().x) < tolerance ) {
									boundX = baseEndPt.getAbsolutePosition().x;
									boundY = pos.y;
								} else {
									if( Math.abs(baseEndPt.getAbsolutePosition().y - this.getAbsolutePosition().y) < Math.abs(this.getAbsolutePosition().x - baseEndPt.getAbsolutePosition().x)) {										
										this.setY(baseEndPt.getY());
									} else {
										this.setX(baseEndPt.getX());
									}
								}
								
								
								if((baseEndPt.getAbsolutePosition().y == this.getAbsolutePosition().y) && (pos.y - baseEndPt.getAbsolutePosition().y) > tolerance){
									boundX = baseEndPt.getAbsolutePosition().x;
									boundY = pos.y;
								} else if((this.getAbsolutePosition().x == baseEndPt.getAbsolutePosition().x) &&(pos.x - baseEndPt.getAbsolutePosition().x) > tolerance){
									boundX = pos.x;
									boundY = baseEndPt.getAbsolutePosition().y;
								} else if((baseEndPt.getAbsolutePosition().y == this.getAbsolutePosition().y) && (baseEndPt.getAbsolutePosition().y - pos.y) > tolerance){
									boundX = baseEndPt.getAbsolutePosition().x;
									boundY = pos.y;
								} else if((this.getAbsolutePosition().x == baseEndPt.getAbsolutePosition().x) &&(baseEndPt.getAbsolutePosition().x - pos.x) > tolerance){
									boundX = pos.x;
									boundY = baseEndPt.getAbsolutePosition().y;
								}
							} else {
								boundX = pos.x;
								boundY = pos.y;
							}
							return {
								x : boundX,
								y : boundY
							}
							
						});		
				bracketGroup.on('dragmove',function(){
					var topArmLen = frkTopRightPt.getX() - frkTopPt.getX();
					var bottomArmLen = frkBottomRightPt.getX() - frkBottomPt.getX();	
					var topYdiff = this.getY() - frkTopRightPt.getY();
					var bottomYdiff = frkBottomRightPt.getY() - this.getY();
					
					var YDiff = this.getY();
					var conBastPt = connContentGrp.get('#connbasept_'+dockId)[0];
					
					if(this.getY() < conBastPt.getY()) {
						frkTopRightPt.setPosition(frkTopPt.getX()+topArmLen,frkTopPt.getY() - 15);
						frkBottomRightPt.setPosition(frkBottomPt.getX()+bottomArmLen,frkBottomPt.getY() - 15);
					} else {
						frkTopRightPt.setPosition(frkTopPt.getX()+topArmLen,frkTopPt.getY() + 15);
						frkBottomRightPt.setPosition(frkBottomPt.getX()+bottomArmLen,frkBottomPt.getY() + 15);
					}

					//Connector.updateConnectorData(this.parent.parent.parent,this.parent.parent.attrs.fork);
					cdLayer.draw();
				});
				
				bracketGroup.on('dragend',function(evt){
					evt.cancelBubble = true;
					var dock = this.parent.parent.parent;
					var dockId = dock.attrs.id;
					var labelId = dockId.substr(5,dockId.length);
					var sle = SLEData.getSLEIndex(labelId);
					var connector_lx = window.CD.module.data.Json.SLEData[sle].connector_lx;
					var connector_ly = window.CD.module.data.Json.SLEData[sle].connector_ly;

					undoMng.register(this, Connector.setPtPos,[dock,this,parseInt(connector_lx),parseInt(connector_ly)] , 'Undo Pt position',
									 this, Connector.setPtPos,[dock,this,parseInt(this.getX()),parseInt(this.getY())] , 'Redo Pt position');
					
					updateUndoRedoState(undoMng);
					Connector.updateConnectorData(this.parent.parent.parent,this.parent.parent.attrs.fork);
					cdLayer.draw();					
				});
				
				frkTopPt.setDragBoundFunc(function(pos){ 
					var boundx = 0;
					var boundy = 0;
					
					if(this.parent.parent.parent.getRotationDeg() == 90 || this.parent.parent.parent.getRotationDeg() == 270) {
						boundx = this.getAbsolutePosition().x;
						boundy = pos.y;
					} else {
						//var rotation = Connector.degrees (Connector.angle (bracketGroup.getAbsolutePosition().x, bracketGroup.getAbsolutePosition().y, pos.x, pos.y));
						//bracketGroup.setRotationDeg (rotation);						
						boundx = pos.x;
						boundy = this.getAbsolutePosition().y;
					}
					
					return {
						x: boundx,
						y: boundy
					}
					
					
					
				});           
				
				frkBottomPt.setDragBoundFunc(function(pos){ 
					var boundx = 0;
					var boundy = 0;
					if(this.parent.parent.parent.getRotationDeg() == 90 || this.parent.parent.parent.getRotationDeg() == 270) {
						boundx = this.getAbsolutePosition().x;
						boundy = pos.y;
					} else {						
						boundx = pos.x;
						boundy = this.getAbsolutePosition().y;
					}
					return {
						x: boundx,
						y: boundy
					}
				}); 
				
				frkTopRightPt.setDragBoundFunc(function(pos){ 
					var boundx = 0;
					var boundy = 0;
					if(this.parent.parent.getRotationDeg() == 90 || this.parent.parent.getRotationDeg() == 270) {
						boundx = pos.x;
						boundy = this.getAbsolutePosition().y;
					} else {						
						boundx = this.getAbsolutePosition().x;
						boundy = pos.y;
					}
					return {
						x: boundx,
						y: boundy
					}
				});     
				
				frkBottomRightPt.setDragBoundFunc(function(pos){ 
					var boundx = 0;
					var boundy = 0;
					if(this.parent.parent.getRotationDeg() == 90 || this.parent.parent.getRotationDeg() == 270) {
						boundx = pos.x;
						boundy = this.getAbsolutePosition().y;
					} else {						
						boundx = this.getAbsolutePosition().x;
						boundy = pos.y;
					}
					return {
						x: boundx,
						y: boundy
					}
				});   
				
				frkEndPt.on('dragmove',function(){
					var topArmLen = frkTopRightPt.getX() - frkTopPt.getX();
					var bottomArmLen = frkBottomRightPt.getX() - frkBottomPt.getX();	
					var topYdiff = this.getY() - frkTopRightPt.getY();
					var bottomYdiff = frkBottomRightPt.getY() - this.getY();
					
					var YDiff = this.getY();
					
					
					//var conBastPt = connContentGrp.get('#connbasept_'+dockId)[0];
					
					
					frkTopPt.setX(this.getX());
					frkBottomPt.setX(this.getX());
					
					/*
					if(this.parent.parent.getRotationDeg() == 90 || this.parent.parent.getRotationDeg() == 270) {
						
					} else {
						if(this.getY() < conBastPt.getY()) {
							frkTopRightPt.setPosition(frkTopPt.getX()+topArmLen,frkTopPt.getY() - 15);
							frkBottomRightPt.setPosition(frkBottomPt.getX()+bottomArmLen,frkBottomPt.getY() - 15);
						} else {
							frkTopRightPt.setPosition(frkTopPt.getX()+topArmLen,frkTopPt.getY() + 15);
							frkBottomRightPt.setPosition(frkBottomPt.getX()+bottomArmLen,frkBottomPt.getY() + 15);
						}
					}
					*/
					
					
					
					
					//frkTopPt.setY(YDiff - Math.abs(topYdiff));
					//frkBottomPt.setY(YDiff + Math.abs(bottomYdiff));
					
					frkTopRightPt.setPosition(frkTopPt.getX()+topArmLen,frkTopPt.getY());
					frkBottomRightPt.setPosition(frkBottomPt.getX()+bottomArmLen,frkBottomPt.getY());
					
					
					
					cdLayer.draw();
				});			
				
				frkTopPt.on('dragmove',function(){
					frkTopRightPt.setX(this.getX());
					cdLayer.draw();
					
					
				});									
				frkBottomPt.on('dragmove',function(){
					frkBottomRightPt.setX(this.getX());
					cdLayer.draw();
				});
				
				
				
				
				frkTopPt.on('dragend',function(evt){
					evt.cancelBubble = true;
					var dock = this.parent.parent.parent.parent;
					var dockId = dock.attrs.id;
					var labelId = dockId.substr(5,dockId.length);
					var sle = SLEData.getSLEIndex(labelId);
					var connector_options = window.CD.module.data.Json.SLEData[sle].connector_options.connectorType.split('%d%');					
					var topLen = connector_options[1];

					undoMng.register(this, Connector.setHBracketTopPtPos,[dock,this,topLen,this.getY()] , 'Undo Pt position',
									 this, Connector.setHBracketTopPtPos,[dock,this,this.getX(),this.getY()] , 'Redo Pt position');
					updateUndoRedoState(undoMng);
					Connector.updateConnectorData(this.parent.parent.parent.parent,this.parent.parent.parent.attrs.fork);					
					cdLayer.draw();
				});		
						
				frkBottomPt.on('dragend',function(evt){
					evt.cancelBubble = true;
					var dock = this.parent.parent.parent.parent;
					var dockId = dock.attrs.id;
					var labelId = dockId.substr(5,dockId.length);
					var sle = SLEData.getSLEIndex(labelId);
					var connector_options = window.CD.module.data.Json.SLEData[sle].connector_options.connectorType.split('%d%');					
					var botLen = connector_options[2];

					undoMng.register(this, Connector.setHBracketBottomPtPos,[dock,this,-botLen,this.getY()] , 'Undo Pt position',
									 this, Connector.setHBracketBottomPtPos,[dock,this,this.getX(),this.getY()] , 'Redo Pt position');
					updateUndoRedoState(undoMng);
					Connector.updateConnectorData(this.parent.parent.parent.parent,this.parent.parent.parent.attrs.fork);
					cdLayer.draw();
				});	
				
			}
			
		}
		cdLayer.draw();
	},
	
	linePoints : function(dis,group) {
		return [
		        	[7, group.getOffset().y],
		        	[Math.max (dis, 7), group.getOffset().y]
               ]
    },
	
	
	radians : function (degrees) {
		return degrees * (Math.PI/180)
	},
    
	degrees : function (radians) {
		return radians * (180/Math.PI)
	},
    // Calculate the angle between two points.
    // cf. http://stackoverflow.com/a/12221474/257568
    angle : function (cx, cy, px, py) {
		var x = cx - px; var y = cy - py; return Math.atan2 (-y, -x)
	},
    
	
	handleRotation : function(cx,cy,mouseX, mouseY) {
		
		var theta = Math.atan2(mouseY - cy, mouseX - cx);
        // be sure theta is positive
        if (theta < 0) {
            theta += 2 * Math.PI
        };
        // convert to degrees and rotate so 0 degrees = 12 o'clock
        var degrees = (theta * 180 / Math.PI + 90) % 360;
        console.log(degrees);
	},
	
	drawBracket1:function(dockGroup,type) {},
	
	addConnector:function(start,end,id) {
		var cnv = window.CD.services.cs;
		var connectorLine = new Kinetic.Line({
							drawFunc: function (canvas) {
							var connContentGrp = cnv.findGroup('conncont_' + id);
			                  var ctx = canvas._context;//canvas.getContext();
			                  var x1 = start.getX();
			                  var y1 = start.getY();
			                  var x2 = end.getX(); 
			                  var y2 = end.getY();
							  ctx.fillStyle = 'white';
							  ctx.shadowColor = "#fff";
							  ctx.shadowBlur = 2;
							  ctx.shadowOffset = 4;
							  ctx.shadowOpacity = 1;
			                  ctx.save();
			                  ctx.strokeStyle = "#333333";
			                  ctx.lineWidth = 1.5;
			                  ctx.beginPath();
			                  ctx.moveTo(x1, y1);
			                  ctx.lineTo(x2, y2); 
			                  ctx.stroke();
			                  this.moveToBottom();
			                  ctx.restore();
			              },
					        points: [start.getX(),start.getY(),end.getX(),end.getY()],
					        stroke: '#333333',
					        strokeWidth: 2,
					        id: 'connline_' + i + '_' + id
					      });
			return connectorLine;
		
	},

	drawPoints:function(x,y,name,dragOption,head) {
		var point = new Kinetic.Circle({
	          x: x,
	          y: y,
	          stroke: "#666666",
	          fill: "#FFFFFF",
	          strokeWidth: 2,
	          radius: head?9:this.dragHandleRadius,
	          id: name,			  
			  opacity: head?0.5:1,
	          draggable: dragOption
	        });
		point.attrs.head = head;
		return point;
	},
	bindConnectorPtEvents:function(pt,baseEndPt) {
		var cs = window.CD.services.cs;
		pt.on('dragmove',function(){
			
		});
	},
	deleteConnector:function(dock){
		var cnv = window.CD.services.cs;		
		var cdLayer = cnv.getLayer();
		if(dock.get('#conn_' + dock.attrs.id) && dock.get('#conn_' + dock.attrs.id)[0]){
			dock.get('#conn_' + dock.attrs.id)[0].remove();
		}
		cdLayer.draw();
	},
	updateConnectorData:function(dockGroup,totalFork){
		var cnv = window.CD.services.cs;	
		var ds = window.CD.services.ds;
		var cdLayer = cnv.getLayer();
		var dockId = dockGroup.attrs.id;
		var labelId = dockId.substr(5,dockId.length);
		var sle = SLEData.getSLEIndex(labelId);
		var connectorPresent = 'F';
		var connectorType = 'D';
		var connectorTypeAuthoring = 'D';
		var zoomingPresent = $('#magnEnable').prop('checked')?'T':'F';
		var connGroup = dockGroup.children[Connector.findObj(dockGroup,'conn_' + dockId)];
		var sleConnObj = {};
		
		sleConnObj.connectorPresent = connectorPresent;
		sleConnObj.connectorType = connectorType;
		sleConnObj.connectorTypeAuthoring = connectorTypeAuthoring;
		sleConnObj.zoomingPresent = zoomingPresent;	
		
		if(connGroup){	
			var connPos = connGroup.attrs.connectorPosition;
			var connFacing = connGroup.attrs.connectorPosition;
			var connContGroup = connGroup.children[this.findObj(connGroup,'conncont_' + dockId)];
			var baseConnGroup = connContGroup.children[this.findObj(connContGroup,'connbase_' + dockId)];
			var bastEndPt = baseConnGroup.get('#baseconnendpt_'+dockId)[0];
			var bastEndPtX = bastEndPt.getX();
			var bastEndPtY = bastEndPt.getY();			
			
			if($.isNumeric(totalFork)){
				var fork_0_pt = connContGroup.get('#frkEndPt_0_' + dockId)[0];				
				var fork_0_ptX = fork_0_pt.getX();
				var fork_0_ptY = fork_0_pt.getY();
				connectorPresent = 'T';
				
				if(totalFork == 1){
					connectorType = 'D';
				}else if(totalFork > 1){			
					var connArr = new Array();
					var connArrAuthoring = new Array();
					for(var i=1;i<totalFork;i++){
						var pt = connContGroup.get('#frkEndPt_' + i + '_'+dockId)[0];
						switch(connFacing){
						case 'R':
							var tmp = pt.getX() + '%d%' + pt.getY();
							break;
						case 'B':
							var tmp = pt.getY() * (-1) + '%d%' + pt.getX();
							break;
						case 'L':
							var tmp = pt.getX() * (-1) + '%d%' + pt.getY() * (-1);
							break;
						case 'T':
							var tmp = pt.getY() + '%d%' + pt.getX() * (-1);
							break;
						}
						connArrAuthoring.push(pt.getX() + '%d%' + pt.getY());
						connArr.push(tmp);
					}
					connectorType = totalFork + '%d%' + connArr.join('%d%');
					connectorTypeAuthoring = totalFork + '%d%' + connArrAuthoring.join('%d%');
				}
			} else if(totalFork == 'B') {
				connectorPresent = 'T';
				var frkMiddlePt = connContGroup.get('#frkEndPt_'+dockId)[0];
				var fork_0_ptX = frkMiddlePt.parent.getX();
				var fork_0_ptY = frkMiddlePt.parent.getY();
				var frkTopPt = connContGroup.get('#frkTopPt_'+dockId)[0]; 					
				var frkBottomPt = connContGroup.get('#frkBottomPt_'+dockId)[0];		
				
				switch(connFacing){
				case 'R':
					connectorType = totalFork + '%d%' + Math.abs(frkTopPt.getY()) + '%d%' + Math.abs(frkBottomPt.getY());
					break;
				case 'B':
					connectorType = 'H' + '%d%' + Math.abs(frkBottomPt.getY()) + '%d%' + Math.abs(frkTopPt.getY());
					break;
				case 'L':
					connectorType = totalFork + '%d%' + Math.abs(frkBottomPt.getY()) + '%d%' + Math.abs(frkTopPt.getY());
					break;
				case 'T':
					connectorType = 'H' + '%d%' + Math.abs(frkTopPt.getY()) + '%d%' + Math.abs(frkBottomPt.getY());
					break;
				}
				connectorTypeAuthoring = totalFork + '%d%' + Math.abs(frkTopPt.getY()) + '%d%' + Math.abs(frkBottomPt.getY());
				
			} else if(totalFork == 'H') {
				connectorPresent = 'T';
				var frkMiddlePt = connContGroup.get('#frkEndPt_'+dockId)[0];
				var fork_0_ptX = frkMiddlePt.parent.getX();
				var fork_0_ptY = frkMiddlePt.parent.getY();
				var frkTopPt = connContGroup.get('#frkTopPt_'+dockId)[0]; 					
				var frkBottomPt = connContGroup.get('#frkBottomPt_'+dockId)[0];			
				
				switch(connFacing){
				case 'R':
					connectorType = totalFork + '%d%' + Math.abs(frkTopPt.getX()) * (-1) + '%d%' + Math.abs(frkBottomPt.getX()) * (-1);
					break;
				case 'B':
					connectorType = 'B' + '%d%' + Math.abs(frkTopPt.getX()) + '%d%' + Math.abs(frkBottomPt.getX());
					break;
				case 'L':
					connectorType = totalFork + '%d%' + Math.abs(frkTopPt.getX()) + '%d%' + Math.abs(frkBottomPt.getX());
					break;
				case 'T':
					connectorType = 'B' + '%d%' + Math.abs(frkTopPt.getX()) + '%d%' + Math.abs(frkBottomPt.getX());
					break;
				}
				connectorTypeAuthoring = totalFork + '%d%' + Math.abs(frkTopPt.getX()) + '%d%' + Math.abs(frkBottomPt.getX());
			}
			
			sleConnObj.connectorPresent = connectorPresent;
			sleConnObj.connectorType = connectorType;
			sleConnObj.connectorTypeAuthoring = connectorTypeAuthoring;
			sleConnObj.zoomingPresent = zoomingPresent;			
			
			window.CD.module.data.Json.SLEData[sle].connector_facing = connPos;
			switch(connFacing){
			case 'R':
				window.CD.module.data.Json.SLEData[sle].connector_mx = bastEndPtX;
				window.CD.module.data.Json.SLEData[sle].connector_my = bastEndPtY;
				window.CD.module.data.Json.SLEData[sle].connector_lx = fork_0_ptX;
				window.CD.module.data.Json.SLEData[sle].connector_ly = fork_0_ptY;
				break;
			case 'B':
				window.CD.module.data.Json.SLEData[sle].connector_mx = bastEndPtY * (-1);
				window.CD.module.data.Json.SLEData[sle].connector_my = bastEndPtX;
				window.CD.module.data.Json.SLEData[sle].connector_lx = fork_0_ptY * (-1);
				window.CD.module.data.Json.SLEData[sle].connector_ly = fork_0_ptX;
				break;
			case 'L':
				window.CD.module.data.Json.SLEData[sle].connector_mx = bastEndPtX * (-1);
				window.CD.module.data.Json.SLEData[sle].connector_my = bastEndPtY * (-1);
				window.CD.module.data.Json.SLEData[sle].connector_lx = fork_0_ptX * (-1);
				window.CD.module.data.Json.SLEData[sle].connector_ly = fork_0_ptY * (-1);
				break;
			case 'T':
				window.CD.module.data.Json.SLEData[sle].connector_mx = bastEndPtY;
				window.CD.module.data.Json.SLEData[sle].connector_my = bastEndPtX * (-1);
				window.CD.module.data.Json.SLEData[sle].connector_lx = fork_0_ptY;
				window.CD.module.data.Json.SLEData[sle].connector_ly = fork_0_ptX * (-1);
				break;
			}
			window.CD.module.data.Json.SLEData[sle].connector_mx_authoring = bastEndPtX;
			window.CD.module.data.Json.SLEData[sle].connector_my_authoring = bastEndPtY;
			window.CD.module.data.Json.SLEData[sle].connector_lx_authoring = fork_0_ptX;
			window.CD.module.data.Json.SLEData[sle].connector_ly_authoring = fork_0_ptY;
			

		}
		window.CD.module.data.Json.SLEData[sle].connector_options = sleConnObj;
		ds.setOutputData();	
	},
	getPointingImageData:function(dock) {
		var cs = window.CD.services.cs;	
		var cdLayer = cs.getLayer();
		var connGroup = dock.children[this.findObj(dock,'conn_' + dock.attrs.id)];
		if(connGroup){
			var connContGroup = connGroup.children[this.findObj(connGroup,'conncont_' + dock.attrs.id)];
			var pointer = connContGroup.get('#frkEndPt_0_' + dock.attrs.id)[0];
			if(!pointer){ // For bracket
				pointer = connContGroup.get('#frkEndPt_' + dock.attrs.id)[0];
			}
			if(pointer){			
				var frameData = window.CD.module.data.Json.FrameData;
				var frameCount = frameData.length;
				var pointerX = pointer.getAbsolutePosition().x - 15;
				var pointerY = pointer.getAbsolutePosition().y - 15;
				
				var pointingImg = {};
				for(var i=0;i<frameCount;i++){
					var imgList = frameData[i].frameImageList;
					if(i==0){ //Base frame
						$.each(imgList, function(key, val){	
							if((pointerX > val.imageX && pointerX < (val.imageX + val.width)) && (pointerY > val.imageY && pointerY < (val.imageY + val.height))){
								pointingImg = val;
								pointingImg.frame = i;
								pointingImg.img = key;
								pointingImg.zoomX = pointerX - val.imageX;   //substracted imageX by SS
								pointingImg.zoomY = pointerY - val.imageY;	 //substracted imageY by SS
							}
						});
					} else { //Other frame
						$.each(imgList, function(key, val){	
							var frameX = parseInt(frameData[i].frameX);
							var frameY = parseInt(frameData[i].frameY);
							if((pointerX > (val.imageX + frameX) && pointerX < (val.imageX + frameX + val.width)) && (pointerY > (val.imageY + frameY) && pointerY < (val.imageY + frameY + val.height))){
								pointingImg = val;
								pointingImg.frame = i;
								pointingImg.img = key;
								pointingImg.zoomX = pointerX;
								pointingImg.zoomY = pointerY;
							}
						});
					}
				}
				if(pointingImg.img)
					return pointingImg;	
			
			}			
		}
	}
	
};


var shiftDown = false;

$(document).bind('keydown', function (evt){
	//console.log(evt.keyCode);
	if(evt.keyCode == 16) shiftDown = true;
  });
$(window.parent.document).bind('keydown', function (evt){
    //console.log(evt.keyCode);
    if(evt.keyCode == 16) shiftDown = true;
  });

$(document).bind('keyup', function (evt){
	shiftDown = false;
  });
$(window.parent.document).bind('keyup', function (evt){
	shiftDown = false;
  });