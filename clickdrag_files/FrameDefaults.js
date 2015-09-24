function frameDefaults() {
			this.frameX = 150;
			this.frameY = 150,
			this.frameWidth = 200,
			this.frameHeight = 200,
			this.lockStatus = false,
			this.frameImageList = {},
			this.frameTextList = {},
			this.frameStudentGUI = [{
				component : '', 
				x : '',
				y : ''
			}],
			this.frameBGVisible = 'F',
			this.frameFlag = 1,
			this.frameMediaList = 'N',
			this.frameMediaXY = {
				x : 0,
				y : 0
			},
			this.frameOptionX = 233,
			this.frameOptionY = 259,
			this.frameLabelObj = {},
			this.frameFIBOutput = '',
			this.frameFIBButtonX = '',
			this.frameFIBButtonY = '',
			this.frameGroupID='',
			this.zIndex = 0
};

var frameTextlistDefaults = {
		'border' : 'F', 
        'fill' : 'F', 
        'fontSize' : '14', 
        'maxWidth' : 250, 
        'minHeight' : 20, 
        'textValue' : '', 
        'textX' : 0,  /*The first component text x*/
        'textY' : 0,  /*The first component text y*/
        'textAlign' : 'left', 
        'textFillColor' : 'F', 
        'textBorderColor' : 'transparent', 
        'textGroupObjID' : '', 
        'underlineVal' : 'F',
        'fontType' : 'normal',
        'txtGroupComponentNo' : 0,
        'absolutePosition' : true,
        'zIndex' : ''
};
 
