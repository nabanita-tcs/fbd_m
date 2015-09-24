function selectExerciseType(html_elm){
	var Util = window.CD.util;
	var cd = window.CD;
	
	startApp();
	
	function startApp() {
	    var ver = Util.getIEVersion();
	    
	        if ( ver != -1 ) {
	            if (ver <= 9.0) {
	                createErrorModal();
	            }
	        }else{
	        	var ds = window.CD.services.ds;
	    		if(cd.inputString == ''){
	    			console.log("@startapp:: start from scratch");
	    			cd.questionState = 'new';
	    			renderApp();
	    		}else{
	    			cd.questionState = 'edit';
	    			ds.initializeModuleData();
	    			new Stage();
	    		}
	    		
	        }
	        $(".loader-overlay").hide();
	    }
	
	function createErrorModal(){
		var errorIE = Util.getTemplate({
	         url: 'resources/themes/default/views/IEerrorModal.html?{build.number}'
	     });
		$("#IEerrorModal").remove();
		$(html_elm).append(errorIE);			
		$("#IEerrorModal").modal({
			closeHTML: "",
			position: ["15%","30%"]		
		});
		$('.modal_heading').attr('style', 'color:#000;margin-left:0px;');
		$('.modal_heading').append('message');
		var messageID = '#message';
		$(messageID).html('');
		$(messageID).append('<div style="overflow-y:auto;width:100%;"><p>This question is not supported in Internet Explorer 8 and HTML5 audio/video unsupported browsers.<br/><br/> Please use one of the other supported browsers to continue your assignment: <br/><a href="javascript:void 1;" onclick="window.open(\'http://connect.customer.mcgraw-hill.com/technical-support/\',\'_blank\')"> http://connect.customer.mcgraw-hill.com/technical-support/</a></p></div>');  
	}
	
	function renderApp(){
		var exerciseTypePopup = Util.getTemplate({
	         url: 'resources/themes/default/views/exercise_type_popup.html?{build.number}'
	     });
		$(html_elm).append(exerciseTypePopup);
		
		for(var key in exerciseNames){
			$('#selectModal .select_options').append('<span class="select_option" name="'+key+'">'+ exerciseNames[key].exerciseText + '</span>');
		}
		enableSelectBoxes();
		
		$("#exerciseSelectPopup").modal({
			closeHTML: "",
			//position: ["12%","32%"],				
			position: ["10%"],
			overlayId: 'exerciseSelectOverlay',
			escClose: false
		});
		$(".object-wrapper").html('');
		$('#exerciseSelectPopup #exerciseHelp').off().on('click',function(){
			
			$("#exerciseSelectPopup #selectModal").css('display','none');
			$("#exerciseSelectPopup #exerciseModal").css('display','block');	
			$('#exerciseSelectPopup #exerciseModal .close_class').click(function () {
				$("#exerciseSelectPopup #selectModal").css('display','block');
				$("#exerciseSelectPopup #exerciseModal").css('display','none');	
			});
			$('#exerciseModal #exerciseTypes').empty();
			for(var key in exerciseNames){			
				$('#exerciseModal #exerciseTypes').append('<tr><td class="text_class"><b>'+exerciseNames[key].exerciseText+"</b><br/>"+exerciseNames[key].exerciseExplanation+'</td>');
				if(key == 'PRG'){//Adding a special note for PRG
					$('#exerciseModal #exerciseTypes').append('<tr><td class="text_class"><b>Note : </b>'+exerciseNames[key].Note+'</td>');
				}
				$('#exerciseModal #exerciseTypes').append('<tr height="10px"><td></td></tr>');
			}				
		});	
		$('#exerciseSelectPopup .exerciseTypeIcon').off().on('click',function(){
			
			$("#exerciseSelectPopup #selectModal").css('display','none');
			$("#exerciseSelectPopup #exerciseModal").css('display','block');	
			$('#exerciseSelectPopup #exerciseModal .close_class').click(function () {
				$("#exerciseSelectPopup #selectModal").css('display','block');
				$("#exerciseSelectPopup #exerciseModal").css('display','none');	
			});
			$('#exerciseModal #exerciseTypes').empty();
			var et = window.CD.services.ds.getEt();
			if(et !== "COI"){
				for(var key in exerciseTypeExplanation){			
					$('#exerciseModal #exerciseTypes').append('<tr><td class="text_class"><b>'+key+"</b><br/>"+exerciseTypeExplanation[key]+'</td>');
					$('#exerciseModal #exerciseTypes').append('<tr height="10px"><td></td></tr>');
				}
			}else{
				for(var key in exerciseTypeExpCOI){			
					$('#exerciseModal #exerciseTypes').append('<tr><td class="text_class"><b>'+key+"</b><br/>"+exerciseTypeExpCOI[key]+'</td>');
					$('#exerciseModal #exerciseTypes').append('<tr height="10px"><td></td></tr>');
				}
			}
							
		});	
		$('#exerciseSelectPopup #helpOrder').off().on('click',function(){	
			$("#exerciseSelectPopup #selectModal").css('display','none');
			$("#exerciseSelectPopup #exerciseModal").css('display','block');	
			$('#exerciseSelectPopup #exerciseModal .close_class').click(function () {
				$("#exerciseSelectPopup #selectModal").css('display','block');
				$("#exerciseSelectPopup #exerciseModal").css('display','none');	
			});
			$('#exerciseModal #exerciseTypes').empty();
			for(var key in sentenceOrderExplanation){	
				var html_key = $('<tr><td class="text_class"><b>'+key+"</b><br/>"+sentenceOrderExplanation[key]+'</td>');
				$('#exerciseModal #exerciseTypes').append(html_key);
				if(key == ''){//For adding a line break
					$(html_key).find('td').removeClass('text_class');
					$(html_key).find('br').remove();
				}					
				$('#exerciseModal #exerciseTypes').append('<tr height="10px"><td></td></tr>');
			}				
		});	
	}
	
	
	
	function exerciseTypeSelect(value){
		var ds = window.CD.services.ds;
		
		$('#selectModal #typeSLE').hide();
		$('#selectModal #typePRG').hide();
		$('#selectModal #typeCOI').hide();
		$('#selectModal #labelOccSLE').hide();
		$('#selectModal #prgSpecific').hide();
		$('#selectModal #labelOccPRG').hide();
		switch(value) {
		case "PRG" :
			$('#selectModal #prgSpecific').show();
			$('#typePRG').show();
			$('#labelOccPRG').show();
			$('input:radio[name=displayLabelPRG]')[0].checked = true;
			/* --- On radio button checking start ---- */
			$('input[name=optionType]').on('change', function() { 
				if($('input[name=optionType]').filter(':checked').val()=='PRGOTM'){
					$('input:radio[name=displayLabelSLE]')[0].checked = true;
				}else{
					
				}
			});
			/* --- On radio button checking end ---- */
			
			break;
		case "COI":
			$('#selectModal #typeCOI').show();		
			$('input:radio[name=optionTypeCOI]')[0].checked = true;
			/* --- On radio button checking start ---- */
			$('input[name=optionType]').on('change', function() { 
				if($('input[name=optionType]').filter(':checked').val()=='OTM'){
					$('#labelOccSLE').show();
				}else{
					$('#labelOccSLE').hide();
				}
			});
			/* --- On radio button checking end ---- */
			break;
		case "SE":
			$('#selectModal #typeSLE').hide();
			$('#selectModal #typePRG').hide();
			$('#selectModal #typeCOI').hide();		
		
			break;
		case "CLS":
			$('#selectModal #typeSLE').show();
			/* --- On radio button checking start ---- */
			$('input[name=optionType]').on('change', function() { 
				if($('input[name=optionType]').filter(':checked').val()=='OTM'){
					$('input:radio[name=displayLabelSLE]')[0].checked = true;
					$('#labelOccSLE').show();
				}else{
					$('#labelOccSLE').hide();
				}
			});
			/* --- On radio button checking end ---- */
			break;
		case "SLE":
			$('#selectModal #typeSLE').show();
			
			/* --- On radio button checking start ---- */
			$('input[name=optionType]').on('change', function() { 
				if($('input[name=optionType]').filter(':checked').val()=='OTM'){
					$('input:radio[name=displayLabelSLE]')[0].checked = true;
					$('#labelOccSLE').show();
				}else{
					$('#labelOccSLE').hide();
				}
			});
			/* --- On radio button checking end ---- */
			break;			
		}
		$('input:radio[name=optionType]')[0].checked = true;
		/*------------ Handled for "choose one..." ..... case*/
		if(undefined!= value){
			ds.setEt(value);		
			ds.setEtText(exerciseNames[value].exerciseText);	
		}
			
	}

	
	function enableSelectBoxes(){
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
				if($(this).html() == "Choose One..."){
					$('#selectModal #apply').addClass('inactive').off('click');
				}else{
					$('#selectModal #apply').removeClass('inactive').off().on('click',function(){
						applyClick();
					});
				}
				
				exerciseTypeSelect($(this).attr('name'));
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
		$(document).not("div.select_options").click(function(e) {
			if((!($(e.target).hasClass('select_box'))) && ($(e.target).parents('.select_box').length == 0))
	        $('div.select_options').hide();
	    });
	}
	function applyClick(){		
		var ds = window.CD.services.ds;		
		var initState = window.CD.services.initialState;		
			switch(ds.getEt()) {
			case "SLE":		
				ds.setOptionLabel($('input[name=optionType]').filter(':checked').val());
				ds.setOptionLabelText($('input[name=optionType]').filter(':checked').next().html());
				initState.setOptionLabel($('input[name=optionType]').filter(':checked').val());
				initState.setOptionLabelText($('input[name=optionType]').filter(':checked').next().html());
				if($('input[name=optionType]').filter(':checked').val()=='OTM'){
					ds.setsubOptionLevel($('input[name=displayLabelSLE]').filter(':checked').val());
					ds.setsubOptionLevelText($('input[name=displayLabelSLE]').filter(':checked').next().html());
					initState.setsubOptionLevel($('input[name=displayLabelSLE]').filter(':checked').val());
					initState.setsubOptionLevelText($('input[name=displayLabelSLE]').filter(':checked').next().html());
				}
				break;
			case "PRG" :
				ds.setOptionLabel($('input[name=optionTypePRG]').filter(':checked').val(),$('input[name=displayLabelPRG]').filter(':checked').val());
				ds.setOptionLabelText($('input[name=optionTypePRG]').filter(':checked').next().html(),$('input[name=displayLabelPRG]').filter(':checked').next().html());
				initState.setOptionLabel($('input[name=optionTypePRG]').filter(':checked').val(),$('input[name=displayLabelPRG]').filter(':checked').val());
				initState.setOptionLabelText($('input[name=optionTypePRG]').filter(':checked').next().html(),$('input[name=displayLabelPRG]').filter(':checked').next().html());
				if($('input[name=optionType]').filter(':checked').val()=='OTM'){
					ds.setsubOptionLevel($('input[name=displayLabelSLE]').filter(':checked').val());
					ds.setsubOptionLevelText($('input[name=displayLabelSLE]').filter(':checked').next().html());
					initState.setsubOptionLevel($('input[name=displayLabelSLE]').filter(':checked').val());
					initState.setsubOptionLevelText($('input[name=displayLabelSLE]').filter(':checked').next().html());
				}
				break;
			case "COI":
				ds.setOptionLabel($('input[name=optionTypeCOI]').filter(':checked').val());
				ds.setOptionLabelText($('input[name=optionTypeCOI]').filter(':checked').next().html());
				initState.setOptionLabel($('input[name=optionTypeCOI]').filter(':checked').val());
				initState.setOptionLabelText($('input[name=optionTypeCOI]').filter(':checked').next().html());
				break;
			case "SE":
				break;
			case "CLS":
				ds.setOptionLabel($('input[name=optionType]').filter(':checked').val());
				ds.setOptionLabelText($('input[name=optionType]').filter(':checked').next().html());ds.setOptionLabel($('input[name=optionType]').filter(':checked').val());
				initState.setOptionLabel($('input[name=optionType]').filter(':checked').val());
				initState.setOptionLabelText($('input[name=optionType]').filter(':checked').next().html());ds.setOptionLabel($('input[name=optionType]').filter(':checked').val());
				if($('input[name=optionType]').filter(':checked').val()=='OTM'){
					ds.setsubOptionLevel($('input[name=displayLabelSLE]').filter(':checked').val());
					ds.setsubOptionLevelText($('input[name=displayLabelSLE]').filter(':checked').next().html());
					initState.setsubOptionLevel($('input[name=displayLabelSLE]').filter(':checked').val());
					initState.setsubOptionLevelText($('input[name=displayLabelSLE]').filter(':checked').next().html());
				}
				break;
			}	
			ds.setEtText(exerciseNames[ds.getEt().toUpperCase()].exerciseText);
			initState.setEtText(exerciseNames[ds.getEt().toUpperCase()].exerciseText);
			$.modal.close();
			ds.initializeModuleData();
			new Stage();
	}

}