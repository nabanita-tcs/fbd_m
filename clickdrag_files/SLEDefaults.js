
var sleDefaultData = {	
		'adminData': {
			'GFS': '14',   
			'CSO': 'pi_connectstylev2.swf',
			'OTM': false,	//Label One to one: true or false, Default is false
			'OTO': false,	//Label One to many: true or false, Default is true
			'AW': window.CD.width,
			'AH': window.CD.height,
			'TYPE': false,	//Same label twice: true or false, Default is true
			'HRO': 'D',
			'FRO':'D',
			'RLO': 'T',
			'ICS': false,
			'HGL': [],		//horizontal Guide Line, converted to array from a comma separated value
			'VGL': [],		//vertical Guide Line, converted to array from a comma separated value
			'ET': '',		//Value: SLE or SEQ, Default is null
			'SLELD': '120,70',
			'ZHP': '200,200,425,75,2,120,70,0,0',
			'feedbackHeight':'70',
			'feedbackWidth':'120',
			'AVP': '233,259',	
			'DOCSAMEASLABEL': true,
			'showZoomInAuth' : 'F',
			'audioList':[],
			'imageList':[],
			'magnificationData' : 'global',
			'showHintOrFeedbackInAuthoring':'none'
		},
		'DCKLD': '120,70',
		'FrameData':[{
			'frameBGVisible':"f",
			'frameFIBButtonX':"",
			'frameFIBButtonY':"",
			'frameFIBOutput':"",
			'frameFlag':"1",
			'frameHeight':window.CD.height,
			'frameId':"fr0",
			'frameImageList':{},
			'frameLabelObj':"null%d%null",
			'frameMediaList':"N",
			'frameMediaXY':{
				'x':"0",
				'y':"0"
			},
			'frameOptionX':"233",
			'frameOptionY':"259",
			'frameOriginalX':"42",
			'frameOriginalY':"47",
			'frameStudentGUI':[{
				'Component':"R",
				'x': '',
				'y': '',
				'visible':true
			},
			{
				'Component':"Z",
				'x': '',
				'y': '',
				'visible':false
			}],
			'frameTextList':{},
			'frameWidth':window.CD.width,
			'frameX':"42",
			'frameY':"47",
			'groupId':"frame_group"
		}],
		'SLEData': {},
		'SLEGV': '',
		'SLERQ': '',
		'SLERN': '',
		'SLEPS': {
			'totalRandomLabels': '', 
			'totalRandomDistractors': '', 
			'showFeedbackAfter': 'N',
			'showInstantFeedbackAfter': 'N',
			'showHintsAfter': 0,
			'studentGradeFormat': 'P',	
			'discrete':'F'
		},
		'SLEGP': {
			'borderGlobal': 'T',
			'backGroundGlobal': 'T',
			'labelBorderGlobal': 'N',
			'labelBGGlobal': 'N',
			'dockBGGlobal': 'N'
		},
		'SLEDXY': '',
		'VST': 0,
		'SLEDS': '',
		'SLESD': '',
		'SLEDC': ''
};

var sleDataDefaults = {
		'label_value':'',
		'hint_value':'%n%',
		'holder_x':0,
		'holder_y':0,
		'image_data':"N",
		'doc_x':100,
		'doc_y':100,
		'image_data_1':'N',
		'feedback_value': '',
		'connector_facing':'R',
		'connector_mx':20,
		'connector_my':0,
		'connector_lx':40,
		'connector_ly':0,
		'connector_options':{
			'connectorPresent':'F',
			'connectorType':'D',
			'zoomingPresent':'T',
			'showInAuthoring':'T'
		},
		'local_magnification':{
			'localMagnificationWidth':'200',
			'localMagnificationHeight':'200',
			'localMagnificationFactor':'2',
		},
		'transparent_border':'F',
		'transparent':'F',
		'transparent_hint':'F',
		'transparent_border_1':'F',
		'transparent_1':'semitransparent',
		'media_value':'N',
		'media_dock_value':'N',
		'media_label_XY':'N',
		'media_dock_XY':'N',
		'play_option_L0_X':233,
		'play_option_L0_Y':259,
		'play_option_D0_X':233,
		'play_option_D0_Y':259,
		'label_Audio_Value':'N',
		'label_play_option_value':'N',
		'distractor_label':'F',
		'FIB_value':'N',
		'class_array_SLE':0,
		'edit_button_X':5,
		'edit_button_Y':0,
		'dock_hint_value':'%n%',
		'FIB_Dock':'N',
		'doc_transparent_value':'semitransparent',
		'visibility':true,
		'name':'N',
		'textFormat':{
			'underline_value':'F',
			'fontSize':14,
			'fontStyle':'normal',
			'align':'center'
		},
		'lockStatus' : false,
		'dockLockStatus' : false,
		'publishingOption': 'S',
		'zIndex' : ''
		
	};
