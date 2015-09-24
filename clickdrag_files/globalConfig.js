var CD = {
			questionId:'',    				//Question ID of current ClickDrag activity
			html_elm:'',
			inputString:'',   				//ClickDrag Question encoded data string
			outputJSON:new Object(), 		//Copy of output data string in JSON
			currentModuleInfo:new Object(), //Module information which is currently visible
			mediaValue:new Array(),         //holding all the media references,
			mediaBaseURL:'',
			width:800,						//ClickDrag Canvas width set from EZTest Question Editor
			height:600,						//ClickDrag Canvas height set from EZTest Question Editor
			deviceMode:'',					//ClickDrag current device mode
			connectPolicy:{},				//holding all the connect related policies {gatingSuppression:'true/flase',feedbackView:'feedback/socre/scoreplus'}
			questionState:'',						//Quesiton state. Values: new/edit
			canvasId:'',
			services:{
					cs:{},
					ts:{},
					ds:new dataModelServices(),
					initialState:new dataModelServices()
					},
			elements:{
					active:{
						element:[],
						type:''
					},
					stage:'',
					layer:'',
					rllayer:'',
					frames:''
					},		
			tools:{
				create:['selectTool','textTool','labelTool','frameTool'],
				action:['undoTool','redoTool'],
				format:['fontTool','boldTool','italicsTool','UnderlinetTool'],
				align:['leftAlignTool','middleAlignTool','rightAlignTool','justifyAlignTool'],
				calign:[]
			},
			config:{},			
			module:{
					state:'',
					data:{},	//Module specific Data services and Active Module JSON e.g if SLE then data = sleData Object
					view:'',
					frame:{}
			},
			util: new Util(),
			undoManager: new UndoManager(),
			globalStyle :{
				fontStyle : '',
				underlineVal : '',
				alignment : '',
				font : ''
			},
			globalTextCreated:{}
	};