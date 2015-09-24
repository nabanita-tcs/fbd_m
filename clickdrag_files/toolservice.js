window.CD.services.ts = {
	activateTool:function(instanceObj, tool) {
		var $ = window.gte.services.jq;
		var activeTool = instanceObj.config.active_tool;
		instanceObj.config.active_tool = tool;
		$("li[name='"+activeTool+"']").removeClass('active');
		$("li[name='"+tool+"']").addClass('active');
	},
	
	getTool:function(instanceObj, tool){
		return instanceObj.config.tool_set[tool];
	},
	
	getToolSet:function(instanceObj){
		return instanceObj.config.tool_set;
	},
	
	removeTool:function(instanceObj, tool){
		
	}
};