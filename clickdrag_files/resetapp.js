function resetApp(exercise_name,sleTypeText){
	var cd = window.CD;
	var ds = window.CD.services.ds;
	var cnv = cd.services.cs;
	var _exercise_name = exercise_name;
	
	if(exercise_name != ds.getEt()){
		var frameData = window.CD.module.data.Json.FrameData;
		switch(ds.getEt()) {
		case "SLE":
			cd.module.data = SLEData;
			cd.module.view = SLEView;
			cd.module.data.Json = jQuery.extend(true, {}, sleDefaultData);  
			//console.dir(window.CD.module.data.Json);
			break;
		case "COI":
			cd.module.data = COIData;
			cd.module.view = COIView;
			cd.module.data.Json = jQuery.extend(true, {}, coiDefaultData);  
			//cd.module.data.processString(unescapedString);
			//console.dir(window.CD.module.data.Json);
			break;
		case "PRG":
			cd.module.data = PRGData;
			cd.module.view = PRGView;
			cd.module.data.Json = jQuery.extend(true, {}, prgDefaultData); 
			
			//cd.module.data.processString(unescapedString);
			break;
		case "CLS":
			cd.module.data = CLSData;
			cd.module.view = CLSView;
			cd.module.data.Json = jQuery.extend(true, {}, clsDefaultData);
			//cd.module.data.processString(unescapedString);
			//console.dir(window.CD.module.data.Json);
			break;
		}
		window.CD.module.data.Json.FrameData = frameData;
	}
	cd.module.data.Json.adminData["ET"] = ds.getEt();
	window.CD.globalTextCreated = {};	//Reset for canvas text issue for canvas text
	if(ds.getEt() == "PRG"){
		PRGData.prgResetData();
	}	
	if(ds.getEt() == "COI"){
		COIData.coiResetData();			
	}			
	if(ds.getEt() == "CLS"){
		CLSData.clsResetData();
		CLSView.attachClassEvent();
	}
	if(ds.getEt() == "SLE"){
		SLEData.sleResetData(sleTypeText);
	}
	ds.setOutputData();
}