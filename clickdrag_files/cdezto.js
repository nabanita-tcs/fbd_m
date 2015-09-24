/**
Author:  Malcolm Duncan wmd@clearlearning.com

VARIABLES from API

 var EZ.MODE_PREVIEW   = "preview"; // mode showing correct answers in place
 var EZ.MODE_TEST   = "test";  // standard student mode
 var EZ.MODE_PREGRADE  = "sample";  // mode to pregrade only items answered
 var EZ.MODE_POST_TEST  = "review";  // mode to fully grade/score the object

 var EZ.id    = "";    // external identifier from EZTO
 var EZ.qid    = "";    // parent question identifier from EZTO
 var EZ.mode    = "";    // rendering mode from EZTO
 var EZ.state   = "";    // initial state from EZTO

REQUIRED FUNCTIONS to be provided by author:

 setState( theState )
  called upon instatiation by API to set the initial state
   initial state is authored in the EZTO item
   theState is a UTF-8 string - could be XML

   ALL modes listed above are required to be supported!!!

 getState()
  called by EZTO on page exit to collect the current state
   should return a UTF-8 string
    no binary data
    XML is OK

 getScore()
  called by EZTO on page exit to collect the current score
   should return an integer from 0 to 100 reprenting percentage correct
*/
var mode = "", ifraemId = "", questionId = "", mediaValue = "", instanceId = 0, shellInput = '', EZPolicy = {};
function setState(theState) {
    mode = EZ.mode;
    startApp(theState);
    
    return;
}
            
function getState() {
	return $('#cndOut').val();
}

function getScore() {
	var theVal = 0;
	if (mode != MODE_DESIGN) {
		theVal = $('#cndOut').val();
		if (theVal.indexOf(';studentScore=') > -1) {
			theVal = theVal.split(';studentScore=')[1]; // to be chnaged
		}
	}
	return theVal;
}

function resizeMe(height,width)	 {
    EZ.resize(width,height);
}
function getPolicy() {
    var thePolicy= EZ.policy( $('#policy_name').val() );					
    return thePolicy;
}

function startApp(theState){
	questionId = EZ.qid;
	instanceId = EZ.instanceid;
    EZ.loadMediaReferences(); 
    var mediaBase = EZ.mediaBase;
    var medias = EZ.mediaUrls;	
    var qHeight = $('#wa_ex_frameheight', parent.document).val()  || $(document).height();			//Added only for authoring call as eztest is not providing the height and width of question.
    var qWidth = $('#wa_ex_framewidth', parent.document).val() || $(document).width();
    if(mode == MODE_TEST || mode == MODE_PREGRADE || mode == MODE_PREVIEW || mode == MODE_POST_TEST){
    	var mediaValue = mediaBase;
    	var mediasString = ',';
        for(var i = 0;i < medias.length;i++){
            if(medias[i] != ""){
                mediasString = mediasString + medias[i] + ',';
            }
        }
        mediaValue += mediasString;
    	shellInput = theState;
        EZPolicy.feedbackView = EZ.policy('p_posttest') == ''? 'feedback' : EZ.policy('p_posttest'); //values: feedback,score,scoreplus,none
        EZPolicy.palette = EZ.policy('p_palette');
        EZPolicy.fbIgnorecase = EZ.policy('p_fb_ignorecase');				
        EZPolicy.fbIgnoreaccents = EZ.policy('p_fb_ignoreaccents');
        EZPolicy.fbIgnorespacing = EZ.policy('p_fb_ignorespacing');
        EZPolicy.acceptAnyAnswerAsCorrect = EZ.policy('p_participation');
       // EZPolicy.fillBlankStrict = EZ.policy('p_fillblankstrict');
        EZPolicy.attemptNo = EZ.policy('attemptNo') == ''? 1 : EZ.policy('attemptNo'); //values: numeric, connect Policy name: "attempt No"
        
        window.clickdragApp.loadCSS('css/cdstd-min.css');
        
        
        var questionData = {iframe:instanceId,questionId:questionId,shellInput:'',contentHeight:qHeight,contentWidth:qWidth,mediaValue:mediaValue,deviceMode:EZ.mode,ezPolicy:EZPolicy};

        function initCDShell(questionData){
        	console.info("executing initCDShell--");
        	$('.object-wrapper').ClickDragShell(questionData);
        };

        
        if(shellInput.match(/ET%3D/)) {
        	/*
        	 * CLS-OTM is not working, the preview is not showing correct answers
        	 * (this is done for adding status flag in olddata_validator)
        	 */
        	//shellInput = unescape(shellInput);
        	shellInput.validate_olddata(initCDShell,questionData);//old encoded
		} else if(shellInput.match(/ET=/)) {
			shellInput = shellInput;
			shellInput.validate_olddata(initCDShell,questionData);//old not encoded
		} else if(shellInput.match(/%22adminData%22%3A%/)) {
			shellInput = unescape(shellInput);
			shellInput.validate_newAuth(initCDShell,questionData); //new encoded
		} else if(shellInput.match(/"adminData":/)) {
			shellInput = shellInput;
			shellInput.validate_newAuth(initCDShell,questionData); //new not encoded
		} 
        
        
        
    }else if(mode == MODE_DESIGN){
    	var src = $("script[src*='cdezto.js']:first");
    	var rootUrl = (src.attr("src")).substring(0,(src.attr("src")).indexOf("cdezto.js"));
    	var cssUrl = rootUrl.substring(0,rootUrl.indexOf('/js')+1) + 'resources/themes/default/';
		window.clickdragApp.loadCSS('css/cdauth-min.css',cssUrl);

    	window.setTimeout(function(){
    		$('.object-wrapper').ClickDragAuthoring({questionId:questionId,inputString:theState,width:qWidth,height:qHeight,mediaBaseURL:mediaBase,mediaValue:medias,deviceMode:EZ.mode,ezPolicy:EZPolicy});
    	},20);
    	
    }
}			
