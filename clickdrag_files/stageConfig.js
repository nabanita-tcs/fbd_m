function StageConfig()
 {
  this.html_id = '',
  this.cd_canvas_id = '-1';
  this.cd_tool_id = '-1';
  this.cd_tool = '';
  this.cd_view = 'answer';
  this.canvas_set = new Array();
  this.data = '';
  this.score = 0;
  this.debug = 'off'; 					/* Possible values: ON OFF*/
  this.wrapper_id = '';
  this.id = window.CD.questionId;
  this.module_type = 'default';  		/*Possible values: SLE, SEQ, CLS, COI, PRG, SEXP */
  this.layout_template = '';
  this.layout_mode = 'default'; 		/*Possible values: DEFAULT {=COMPACT} COMPACT LOOSE */
  this.mode = window.CD.deviceMode; 				/*Possible values:PREVIEW (Non-Scoring) TEST (Scoring) PREGRADE (Scoring based on current state) DESIGN (Authoring) */
  this.provider_id = 'standalone';		/*Possible values:STANDALONE EZTO*/
  this.theme_id = 'default'; 			/*Possible values:DEFAULT CONNECT */
  this.tool_set = {
				   'pointer': window.CD.tools.Pointer,
		           'label': window.CD.tools.Label,
		           'text': window.CD.tools.Text,
		           'frame': window.CD.tools.Frame
		           };
  this.objectCount = {'label':0,
   'frame':0,
   'text':0,
   'connector':0,
   'image':0,
   'audio':0,
   'dropzone':0
  };
 }