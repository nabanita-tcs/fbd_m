function LabelConfig(){
	  this.elements = [];
	  this.p_id = 'label_group';
	  this.id = '';
	  this.maxWidth=window.CD.width,
	  this.maxHeight=window.CD.height,
	  this.minWidth=29,
	  this.minHeight=29,
	  this.style = {
	                 width: 120,
	                 height: 70,
	                 fill: '#8ECCF8',
	                 stroke: '1',
	                 cornerRadius: 5,
	                 strokeEnabled: true,
	                 x: 100,
	                 y: 100,
	                 opacity:1
	                };
	  /** --- For old string fill color support --- **/
	  var version = window.CD.module.data.Json.adminData.version;
	  if(version && version == '2000'){
		  this.style.fill = '#fff';
	  }
 }