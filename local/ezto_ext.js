	/**
		API function to collect state and score info from the external object
		
		YOU MAY NOT EDIT THIS SCRIPT!!!

		API Author:  Malcolm Duncan wmd@clearlearning.com
	*/
	
	
	function extGather() {
		$('.wk_ex_iframe').each(function(){
			var theFrame= $(this);
			var theID= $(this).attr('id');
			console.info(theID);
			try
			{
				console.info(this.name);
				var theState= window.frames[this.name].getState();
				$('#'+theID+'_state').val(theState);
				var theScore= window.frames[this.name].getScore();
				$('#'+theID+'_eval').val(theScore);
			}
			catch (err)
			{
				alert('failure to implement getState, getScore or the external API correctly'+err.message);
			}
		});
	}
	

	function extTestGather() {
		$('.wk_ex_iframe').each(function(){
			var theFrame= $(this);
			var theID= $(this).attr('id');
			//alert(theID);
			try
			{
				var theState= window.frames[this.name].getState();
				$('#'+theID+'_ostate').val(theState);
				var theScore= window.frames[this.name].getScore();
				$('#'+theID+'_eval').val(theScore);
			}
			catch (err)
			{
				alert('failure to implement getState, getScore or the external API correctly');
			}
		});
	}