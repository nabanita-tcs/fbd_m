/*All validation methods*/
var validation={
		
		labelContainerId:"#labelContainer",
		
		/**
		 * function name: onKeyDownClearTextBox()
		 * author:Piyali Saha
		 */
		onKeyDownClearTextBox:function(e,obj){
			console.log("@COIView.onKeyDownClearTextBox");
			try{
					var inputVal = $(obj).val();
					var key = e.charCode || e.keyCode || 0;
					$(this.labelContainerId+" .warning_text").hide();
					$(".errorCommon").html("");
					//$('.label_options .input_text').removeClass("warning_input");
				    // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
				   if(!e.shiftKey){
					   return (
				            key == 8 || 
				            key == 9 ||
				            key == 46 ||
				            (key >= 37 && key <= 40) ||
				            (key >= 48 && key <= 57) ||
				            (key >= 96 && key <= 105));
				   }else{
					   return false;
				   }
			}catch(err){
				console.error("@COIView::Error on onKeyDownClearTextBox::"+err.message);
			}
		},	
		
		/**
		 * function name: creatLabelErrorPopUp()
		 * parameter: CoiLabelMessage---used only for COI module to change 
		 * default message
		 * author:Piyali Saha
		 */
		creatLabelErrorPopUp:function(CoiLabelMessage){
			console.log("@validation::creatLabelErrorPopUp");
			try{
				var labelModal = window.CD.util.getTemplate({url: 'resources/themes/default/views/label_modal.html?{build.number}'});
				 $(labelModal).remove();
			     $('#labelModal').remove();
			     $('body').append(labelModal);	
			     $('#labelModal').css('left', (($('#toolPalette').width()/2) - ($('#labelModal').width()/2))+'px');
			     $('#labelModal').css('top', (($('#canvasHeight').val()/2) - ($('#labelModal').height()/2))+'px');
				 $('#labelModal').slideDown(200);
				 
				 if(CoiLabelMessage){
					 
					 var CoilabelPopUplabel_options='<span>How many labels would you like to create?</span><br><br>'+
					 								'<span class="coiMsgBox">'+CoiLabelMessage+'</span><br>'+
					 								'<div class="cen_align"><input type="text" class="label_count input_text border_txt">'+
					 								'</div>';	
					 			 
					 
					 $("#labelModal .label_options").html(CoilabelPopUplabel_options);
					 
				 }
				 
				 
				 /*bind on keydown for error text box*/
				 $(this.labelContainerId+" input.input_text").bind('keydown',function(e){
					 validation.onKeyDownClearTextBox(e,this)
					});
				 /*on click on cancel*/
				 $(this.labelContainerId+" span#labelCancel").off('click').on('click',function(){
					  $('#labelOverlay').remove();
					  $('#labelModal').slideUp(200);
					  $('.tool_select').trigger('click');
				  });
				 
				 
				
			}catch(err){
				console.error("@validation::Error on creatLabelErrorPopUp::"+err.message);
			}
		
		},
		/**
		 * function name: showCommonErrorMessage()
		 * author:Piyali Saha
		 * param
		 * errCode:error code number
		 * options: if any error contain any 
		 * containerId:error html container id<errorContainer>,
		 * errorAlertId:wrning text class<>
		 */
		showCommonErrorMessage:function(errCode,options,containerId,errorAlertId){
			console.log("@validation::showCommonErrorMessage");
			try{
				if(containerId)this.labelContainerId="#"+containerId;
				$(this.labelContainerId +"#"+errorAlertId).html("");
				var warningHtml="";
				var Error=this.errorDetails(options);
				$.each(Error,function(kk,vv){
					if(kk==errCode){
						warningHtml+='<div class="start_over" style="display:block">'+vv+'</div>';
					}
					
				});
				$(this.labelContainerId +" #"+errorAlertId).html(warningHtml);
				$(this.labelContainerId +" #"+errorAlertId).show();
		   }catch(err){
				console.error("@validation::Error on showCommonErrorMessage::"+err.message);
			}
		
		},
		
		
		/**
		 * function name: creatCommonErrorPopUp()
		 * author:Piyali Saha
		 */
		creatCommonErrorPopUp:function(errorModal,modalId,containerId,cancelId,overlayId){
			console.log("@validation::creatCommonErrorPopUp");
			try{
				var modal = errorModal;
				
			     $('#'+modalId).remove();
			     $('body').append(modal);	
			     $('#'+modalId).css('left', (($('#toolPalette').width()/2) - ($('#'+modalId).width()/2))+'px');
			     //$('#'+modalId).css('top', ($('#'+modalId).offset().top+$('#toolPalette').height()+20)+'px');
			     $('#'+modalId).css('top', 65);
				 $('#'+modalId).slideDown(200);
				 if(containerId)this.labelContainerId="#"+containerId;
				 				 
				 /*bind on keydown for error text box*/
				 $(this.labelContainerId+" input.input_text").bind('keydown',function(e){
					 validation.onKeyDownClearTextBox(e,this)
					});
				 /*on click on cancel*/
				 $(this.labelContainerId+" span#"+cancelId).off('click').on('click',function(){
					  $('#'+overlayId).remove();
					  $('#'+modalId).slideUp(200);
					  $('.tool_select').trigger('click');
				  });
				 
				 
				
			}catch(err){
				console.error("@validation::Error on creatCommonErrorPopUp::"+err.message);
			}
		
		},
		/**
		 * function name: showErrorPOPUP()
		 * description:this method handle error
		 * author:Piyali Saha
		 * param
		 * errCode:error code number
		 * options: if any error contain any 
		 * dynamic value the pass in options object
		 * createlabelPOPUP:true/fasle
		 */
		showLabelErrorPOPUP:function(errCode,options,createlabelPOPUP){
			console.log("@validation::showLabelErrorPOPUP");
			try{
				if(createlabelPOPUP){
					this.creatLabelErrorPopUp();
				}
				$(".label_options .warning_text").remove();
				var warningHtml="";
				$('#errorLabelDistractorCount').html('');
				$('.errorCommon').html('');
				var Error=this.errorDetails(options);
				$.each(Error,function(kk,vv){
					if(kk==errCode){
						warningHtml+='<span id="lable_warning" class="warning_text" style="display:block;">'+vv+'</span>';
					}
					
				});
				$(".label_options").append(warningHtml);
				$('#errorLabelDistractorCount').html(warningHtml);
				
				/*common error div*/
				$('.errorCommon').html(warningHtml);
				//$('.label_options .label_count').addClass("warning_input");
		    }catch(err){
				console.error("@validation::Error on showLabelErrorPOPUP::"+err.message);
			}
		
		},
		showLabelErrorPOPUPForCancel:function(errCode,options,createlabelPOPUP){
			console.log("@validation::showLabelErrorPOPUPForCancel");
			try{
				if(createlabelPOPUP){
					this.creatLabelErrorPopUp();
				}
				$(".label_options .warning_text").remove();
				var warningHtml="";
				//$('#errorLabelDistractorCount').html('');
				$('#footWarning').html('');
				var Error=this.errorDetails(options);
				$.each(Error,function(kk,vv){
					if(kk==errCode){
						warningHtml+='<span id="lable_warning" class="warning_text" style="display:block;">'+vv+'</span>';
					}
					
				});
				$(".label_options").append(warningHtml);
				//$('#errorLabelDistractorCount').html(warningHtml);
				
				/*common error div*/
				$('#footWarning').html(warningHtml);
				//$('.label_options .label_count').addClass("warning_input");
		    }catch(err){
				console.error("@validation::Error on showLabelErrorPOPUPForCancel::"+err.message);
			}
		
		},
		/**
		 * function name: errorDetails()
		 * description:this method holds
		 * all error descriptions.
		 * param
		 * errCode:error code number
		 * options: if any error contain any 
		 * dynamic value the pass in options object
		 */
		errorDetails:function(options){
			console.log("@validation::errorDetails");
			try{
				if(!options){
					options={};
					}
			/*for options values update checking code here*/
				var maxLabelWidth=(options.maxLabelWidth)?options.maxLabelWidth:'';
				var maxLabelHeight=(options.maxLabelHeight)?options.maxLabelHeight:'';
				var textVal=(options.textVal!=undefined)?options.textVal:'';
				var distTextVal=(options.distTextVal!=undefined)?options.distTextVal:'';
				var reqdVal=(options.reqdVal)?options.reqdVal:'';
			/*ends here*/	
				var error={
							'1':"* You can create between 0 and 15 labels/distractors at a time.",
							'2':"*Please enter number of labels you would like to create.",
							'3':"*Please enter any number greater than 0.",
							'4':"*Please enter valid subscript/superscript characters from palette.",
							'5':"*Field can not be left blank.",
							'6':"*Please enter any number to create any label or distractor.",
							'7':"*Please enter number of distractors you would like to create.",
							'8':"The width of the label cannot be left blank. <br/><br/>",
							'9':"The height of the label cannot be left blank. <br/><br/>",
							'10':"The width of the label cannot be greater than or equal to "+maxLabelWidth+" px.<br/><br/>",
							'11':"The height of the label cannot be greater than or equal to "+maxLabelHeight+" px.<br/><br/>",
							'12': "The width of the label must be greater than or equal to 30px. <br><br/>",
							'13': "The height of the label must be greater than or equal to 30px.",
							'14': "* You can create between 0 and 5 groups(docks) at a time.",
							'15': "*Please enter any number between 0 and 10.",
							'16': "*Please enter a numeric value.",
							'17': "*Please enter number of labels/distractors less than or equal to original label/distractor count.",
							'18': "*Please correct the following error:<br/>Buffer must be between 0 and 30.",
							'19': "*Please note that the range for labels is 0 to " +textVal+" and <br> the range for distractors is 0 to " +distTextVal+" .",
							'20': "*Please note that the range for labels is 1 to " +textVal+" and <br> the range for distractors is 0 to " +distTextVal+" .",
							'21': "<span style='font-weight:bold;'>*Please correct the following error(s):</span><br/>The number of labels and distractors can't be greater than "+textVal+" and  "+distTextVal+ " respectively.",
							'22': "The width of the hint or feedback box cannot be left blank. <br/><br/>",
							'23': "The height of the hint or feedback box cannot be left blank. <br/><br/>",
							'24': "Please correct the following error:<br/>The height and width of a label cannot be less than 30px. Either adjust your buffer size and number of columns OR cancel and adjust the size of your frame.",
							'25': "Please enter only numeric value.",
							'26': "* You can create between 0 and 15 labels/distractors at a time.",
							'27': "* You can create between 0 and 15 labels at a time.",
							'28': "Please correct the following error:<br/>You must have at least 1 column.",
							'29': "Click cancel and correct the following errors before continuing:<br/>",
							'30': "<span style='font-weight:bold;'>*Please correct the following error(s):</span><br/>The number of labels can't be less than 1, if there is no required label.",

						}
				return error;
				
		    }catch(err){
				console.error("@COIView::Error on showError::"+err.message);
			}
		
		},
		
};