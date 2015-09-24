var TextEditor = TextEditor || {};
/**
 * @class name : textEditor
 * description : text editing done here
 */
TextEditor= function (){
	this.selectedTabView = '';
	this.createTextEditor = function(textAreaContainer,type,docktextData){
		console.log("@createTextEditor :: textEditor");
		try{
			var ds = window.CD.services.ds;
			var selectedET = ds.getEt();
			var textToolDiv = $('<div id="toolBar" style="background: none repeat scroll 0 0 #E6E6E6;border: 1px solid #CCCCCC;height:80px;width:25px;"><div>');

		    var ulBar = $('<ul class = "left"></ul>');
		    var boldBar = $('<li id="boldTextTool"><div class = "selection bold_text_tool" title = "bold"></div></li>');
		    var italicsBar = $('<li id="italicsTextTool"><div class = "selection italics_text_tool" title = "italic"></div></li>');
		    var underlinedBar = $('<li id="underlinedTextTool"><div class = "selection underlined_text_tool" title = "underline"></div></li>');
		    
		    ulBar.append(boldBar);
		    ulBar.append(italicsBar);
		    ulBar.append(underlinedBar);
		    
		    textToolDiv.append(ulBar);
		    
		    textAreaContainer.append(textToolDiv);
		    
		    var isCalledFromLabelDockText = false;
		    if(type && (selectedET != 'PRG')){
		    	this.selectedTabView = type+'ToolTextBox';
		    	isCalledFromLabelDockText = true;
		    }else{
		    	if(docktextData == 'docktext'){
		    		this.selectedTabView = type+'ToolTextBox';
		    		isCalledFromLabelDockText = true;
		    	}else{
		    		this.selectedTabView = 'textToolTextBox';
		    	}		    	
		    }
		    var tabUlBar = $('<ul class = "tabUlBar"></ul>');
		    var textBar = $('<li id="textBar"><div class = "div_class">Text</div></li>');
		    tabUlBar.append(textBar);
		    textAreaContainer.append(tabUlBar);
		    
		    var toolTabtop = (parseInt(textAreaContainer.css('top')))-(parseInt(tabUlBar.css('height')));
		    //tabUlBar.css('top',(toolTabtop-1)+'px');
		    //tabUlBar.css('left',(textAreaContainer.position().left-7)+'px');
		    
		    if(type && isCalledFromLabelDockText == true){
		    	var feedbackBar = $('<li id="feedbackBar" class = "active"><div class = "div_class">Feedback</div></li>');
			    var hintBar = $('<li id="hintBar"><div class = "div_class">Hint</div></li>');

			    tabUlBar.append(hintBar);
			    tabUlBar.append(feedbackBar);
			    
			    tabUlBar.children().each(function(){
			    	var matchId = type+'Bar';
			    	if(this.id == matchId){
			    		$(this).addClass('active');
			    		
			    		var hb = $('#'+type+'ToolTextBox').htmlbox({
			    	        buttons:[
			    	    	     ["bold","italic","underline"]
			    	    	]
			    	    });
			    	    
			    		var commonLabelTextToolChar = new TextTool.commonLabelText();
			    		/*$('#'+type+'ToolTextBox').charCounter({
			    	    	maxChars: commonLabelTextToolChar.textMaxChar,
			    	    	maxCharsWarning : commonLabelTextToolChar.maxCharWarning
			    	    });*/
			    		
			    		$("#"+type+'ToolTextBox_html').focus();
			    	}else{
			    		$(this).removeClass('active');
			    	}			    	
				});
			    this.bindTabViewEvents(tabUlBar,type,textAreaContainer);
		    }else{
		    	tabUlBar.children().each(function(){
			    	$(this).addClass('active');
		    		
		    		var hb = $('#textToolTextBox').htmlbox({
		    	        buttons:[
		    	    	     ["bold","italic","underline"]
		    	    	]
		    	    });
		    	    
		    		var commonLabelTextToolChar = new TextTool.commonLabelText();
		    		/*$('#textToolTextBox').charCounter({
		    	    	maxChars: commonLabelTextToolChar.textMaxChar,
		    	    	maxCharsWarning : commonLabelTextToolChar.maxCharWarning
		    	    });*/
		    		
		    		$('#textToolTextBox_html').focus();
				});
		    }
		    var modifiedTop = parseInt($('#textToolFooter').css('top')) - 3;
    	    $('#textToolFooter').css('top',modifiedTop);
    	    
		    $(textToolDiv).css('position','absolute');
		    var toolLeft = (parseInt(textAreaContainer.position().left))-(parseInt(textToolDiv.css('width')));
		    //textToolDiv.css('left',(toolLeft-1)+'px');
		    textToolDiv.css('left',-26);
		    //textToolDiv.css('top',(parseInt(textAreaContainer.css('top')))+'px');
		    textToolDiv.css('top',0);
		    
		}catch(error){
			console.log("Error in createTextEditor : textEditor "+error.message);
		}
	};
	
	this.bindTabViewEvents = function(uiBar,type,textAreaContainer){
		console.log("@bindTabViewEvents :: textEditor");
		try{
			var thisObj = this;
			var commonLabelTextToolChar = new TextTool.commonLabelText();
			uiBar.children().each(function(){
		    	$(this).off('click').on('click',function(){
		    		$(this).addClass('active');
		    		var selectedTab = this.id;
		    		$(this).parent().children().each(function(){
				    	if(this.id !== selectedTab){
				    		$(this).removeClass('active');
				    	}
					});
		    		var matchKey = selectedTab.split('Bar')[0]+'ToolTextBox';
		    		textAreaContainer.find('textarea').each(function(){
		    			if(this.id != ''){
		    				if(this.id == matchKey){
		    					if(textAreaContainer.find('iframe').length > 0){
		    						textAreaContainer.find('iframe').remove();
		    					}
		    					var hb = $('#'+matchKey).htmlbox({
					    	        buttons:[
					    	    	     ["bold","italic","underline"]
					    	    	]
					    	    });
					    	    
					    		$(this).removeClass('display_none');
					    		thisObj.selectedTabView = matchKey;
					    		commonLabelTextToolChar.prepareDropdownListAndAction();  //Commented to stop changing the position of language palette and dropdown by SS
					    	}else{
					    		if(this.id.indexOf('ToolTextBox') != -1){
					    			$(this).addClass('display_none');
					    			//$('.counterMsg').remove();
					    		}					    		
					    	}
		    			}
		    			
		    		});
		    		
		    		/** character counter added **/
		    		/*$('#'+matchKey).charCounter({
		    	    	maxChars: commonLabelTextToolChar.textMaxChar,
		    	    	maxCharsWarning : commonLabelTextToolChar.maxCharWarning
		    	    });*/
		    		/*$("#"+matchKey+'_html').parent().parent().parent()[0].bind("click");
		    		$("#"+matchKey+'_html').parent().parent().parent()[0].focus();*/
		    		$("#"+matchKey+'_html').focus();		//Enabled to focus to text box by SS
		    		
		    	});
		    	
			});
		}catch(error){
			console.log("Error in bindTabViewEvents :: textEditor : "+error.message);
		}
	};
};