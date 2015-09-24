var imagePreLoader = {
		/**
		 * This method lists all images
		 * icons::for all static icons(like:lock/unlock icons)
		 * samplePictures :: for all media images
		 * Called from startApp() of selectExerciseType
		 * By Nabonita Bhattacharyya
		 */
		init : function(imgList){
			console.log('@imagePreLoader: init');
			try{
				var cs = window.CD.services.cs;
				var util = window.CD.util;
				var icons = ['unlock.png','lock.png','check_radio.png','checkbox_checked.png','checkbox_unchecked.png','pause_btn.gif','play_btn.gif','ruler_left.png','ruler_top.png','top_image.png','uncheck_radio.png'];
				//var group = cs.createGroup('imageGroup',{'x':0,'y':0,'visible':false});
				for(var count = 0;count<icons.length;count++){
					imagePreLoader.preImageLoader(util.getImageUrl()+icons[count]);
				}
				if(imgList != undefined && imgList.length != 0){
					for(var imgCount = 0;imgCount<imgList.length;imgCount++){
						imagePreLoader.preImageLoader(util.proccessMediaID(imgList[imgCount]));
					}
				}
				$(".preload_img").remove();
			}
			catch(err){
				console.error("Error in imagePreLoader:init::"+err.message);
			}
		},
		
		/**
		 * This is used for loading all images 
		 * imageName :: image names of either static or dynamic images
		 * group :: the group in which we want to load all the images
		 * called from imagePreLoader.init()
		 * By Nabonita Bhattacharyya
		 */
		preImageLoader : function(imageName){
			try{
				if(imageName){
			        $('<img />').attr('src',imageName).appendTo('body').css('display','none').addClass("preload_img");
				}
			}
			catch(err){
				console.error("Error in imagePreLoader:preImageLoader::"+err.message);
			}
		}
};