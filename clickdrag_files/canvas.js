function Canvas(instanceObj){
	console.log("@Canvas");
	var that = this, cnv = window.CD.services.cs, cd = window.CD, ds = window.CD.services.ds;
	this.cnvConfig = new CanvasConfig(instanceObj);
	this.cnvConfig.style.width = cd.width;
	this.cnvConfig.style.height = cd.height;
	
	init(instanceObj.stgConfig.html_id,that);

	function init(stageId,instanceObj){
		console.log('@Canvas.init');
		try{
			//1. render canvas
			render(stageId,instanceObj);
			cnv.addLayer(instanceObj);
			cnv.addCanvasRuler(instanceObj);
			cnv.createCanvasGrid(instanceObj);
			cnv.createCanvasBaseFrame();
			
			cd.module.view.init(cd.module.data.Json,instanceObj.cnvConfig);
			
			//ds.initializeModuleData();
			
		}catch(err){
			console.error("Error @Canvas.init::"+err.message);
		}
 
	};
  
	function render(stageId,instanceObj){
		console.log('@Canvas.render');
		cnv.addCanvas({
			'html_id':instanceObj.cnvConfig.html_id,
			'canvasId': instanceObj.cnvConfig.id,
			'style': instanceObj.cnvConfig.style
		});
	};
}
  