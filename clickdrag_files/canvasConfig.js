
function CanvasConfig(instanceObj)
 {
  this.html_id = 'canvasContainer';
  this.id = 'canvas_' + instanceObj.stgConfig.id;
  //this.id = "paper_"+instanceObj.edConfig.canvas_set.length;
  this.paper_id = '';
  this.canvas_grid = {
		  				"show_grid":false,
		  				"scale":100,
		  				"subdiv":"4",
		  				"color":"#888"
  					};
  this.group_set = [];
  this.object_set = [];
  this.title = 'Click Drag';
  this.style = {
                 width: 800,
                 height: 600,
                 background_color: "#ffffff",
                 stroke: 1
                };
  this.showToolTip = false;
 }