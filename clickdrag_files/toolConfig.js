function ToolConfig()
 {
  this.html_id = '',
  this.cd_canvas_id = '-1';
  this.cd_tool_id = '-1';
  this.cd_tool = '';		/*Possible values: DEFAULT {=COMPACT} COMPACT LOOSE */
  this.mode = window.CD.deviceMode; 				/*Possible values:PREVIEW (Non-Scoring) TEST (Scoring) PREGRADE (Scoring based on current state) DESIGN (Authoring) */
  this.provider_id = 'standalone';		/*Possible values:STANDALONE EZTO*/
  this.theme_id = 'default'; 			/*Possible values:DEFAULT CONNECT */
  this.type = ''; 			/*Possible values:DEFAULT CONNECT */
  this.tool_set = {
				   'pointer': window.CD.tools.Pointer,
		           'label': window.CD.tools.Label,
		           'text': window.CD.tools.Text,
		           'frame': window.CD.tools.Frame
		           };
 
 }