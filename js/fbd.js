function setState(theState ){
  ez_mode = EZ.mode;
  //alert(ez_mode);
  $('.questionDetails').hide();
  $('#'+ez_mode+'_mode').removeClass('noDisplay').show();
  //$('#cndIn').val(theState);
  $('#cndOut').val(theState);
  var getStateToolOut = $('#cndOut').val().split('++==++');
   //var getStateToolIn = $('#cndIn').val().split('++==++');
  //alert(getStateTool[1]);
  $('#optionTypeInput').val(getStateToolOut[1]);
  $('#optionTypeInputForces').val(getStateToolOut[2]);  
  $('#optionTypeTop').val(getStateToolOut[3]);
  $('#optionTypeLeft').val(getStateToolOut[4]);
  $('#optionTypeInputForcesOut').val(getStateToolOut[5]);
  changeMode(ez_mode);
  return;
}

function getState() {         
  return $('#cndOut').val();
}
       // changeMode('design');
function drawFBDElement(elehj){
	$('#eventObject').val('');
	eleType = elehj;
    tool.init();
}

var tool = {}, stage, layer, tmpLayer, cancelTextMouseUp, stageDrawDesign;

//add tool specific variables
tool.isStarted = false;
tool.startPoint = undefined;

 stage = new Kinetic.Stage({
    container: 'canvasArea',
    width: 800,
    height: 560,
    draggable: false
  });
  
  layer = new Kinetic.Layer({
    name: 'layer'
  });

  tmpLayer = new Kinetic.Layer({
    name: 'tmpLayer'
  });
  stage.add(layer);

//mousedown for line
tool.line_mousedown = function(evt) {
  console.log(eleType+'_mousedown');
  //store start point relative to canvas
  tool.startPoint = getRelativePointerPosition();
  //set started flag to true
  tool.started = true;
  //add temporary layer to stage
  stage.add(tmpLayer);  
};

//mousemove for line
tool.line_mousemove = function(evt) {
  console.log('line_mousemove');
  //if drawing of tool (line) is not started then exit
  if(!tool.started) {
    return;
  }

  //get x,y co-ordinate relative to canvas
  var tempPoint = getRelativePointerPosition();
  if(tempPoint !== undefined && tool.startPoint !== undefined) {
    //remove previous line off temporary layer
    tmpLayer.removeChildren();
    switch(eleType)
      {
        case 'line':
          //create kinetic line instance
          var tmpLine = new Kinetic.Line({
            points: [tool.startPoint.x, tool.startPoint.y, tempPoint.x, tempPoint.y],
            stroke: 'orange',
            strokeWidth: 3
          });   
          //add current line to temporary canvas
          tmpLayer.add(tmpLine);
        break;
        case 'circle': 
        var tmpCircle = new Kinetic.Circle({
            x: (tempPoint.x + tool.startPoint.x) / 2,
            y: (tempPoint.y + tool.startPoint.y) / 2,
            radius: Math.max(
                    Math.abs(tempPoint.x - tool.startPoint.x),
                    Math.abs(tempPoint.y - tool.startPoint.y)
                  ) / 2,
            stroke: 'blue',
            strokeWidth: 3
          });
          tmpLayer.add(tmpCircle); 
        break;
		case 'rectangle': 
        var tmpRectangle = new Kinetic.Rect({
			        x: Math.min(tempPoint.x, tool.startPoint.x),
			        y: Math.min(tempPoint.y, tool.startPoint.y),
			        width: Math.abs(tempPoint.x - tool.startPoint.x),
			        height: Math.abs(tempPoint.y - tool.startPoint.y),
			        stroke: 'green',
			        strokeWidth: 3
			      });
          tmpLayer.add(tmpRectangle); 
        break;
      } 
    
    
    //draw temporary layer to draw previously added line instance
    tmpLayer.draw();      
  }  
};

tool.line_mouseup = function(evt) {
  console.log('line_mouseup');
  if (tool.started) {
    //get x,y co-ordinate relative to canvas
    var tempPoint = getRelativePointerPosition();
    if(tempPoint !== undefined && tool.startPoint !== undefined) {
      //destroy temporary layer      
      tmpLayer.destroy();
	  switch(eleType)
      {
        case 'line':
          //create kinetic line instance
          var tmpLine = new Kinetic.Line({
            points: [tool.startPoint.x, tool.startPoint.y, tempPoint.x, tempPoint.y],
            stroke: 'orange',
            strokeWidth: 3,
			draggable: true,
			class:'objectInCanvas'
          });   
           //add previously created line instance to main layer
           layer.add(tmpLine);
        break;
        case 'circle':
          var tmpCircle = new Kinetic.Circle({
              x: (tempPoint.x + tool.startPoint.x) / 2,
              y: (tempPoint.y + tool.startPoint.y) / 2,
              radius: Math.max(
                      Math.abs(tempPoint.x - tool.startPoint.x),
                      Math.abs(tempPoint.y - tool.startPoint.y)
                    ) / 2,
              stroke: 'blue',
              strokeWidth: 4,
			  draggable: true
            }); 
           layer.add(tmpCircle);
        break;
		case 'rectangle': 
        var tmpRectangle = new Kinetic.Rect({
			        x: Math.min(tempPoint.x, tool.startPoint.x),
			        y: Math.min(tempPoint.y, tool.startPoint.y),
			        width: Math.abs(tempPoint.x - tool.startPoint.x),
			        height: Math.abs(tempPoint.y - tool.startPoint.y),
			        stroke: 'green',
			        strokeWidth: 3,
					draggable: true,
					offset: [Math.abs(tempPoint.x - tool.startPoint.x)/2,Math.abs(tempPoint.y - tool.startPoint.y)/2],
			      });
          layer.add(tmpRectangle); 
        break;
      } 
      
     
      //draw layer to draw previously added line instance
      layer.draw();   
      cancelTextMouseUp = true
     // stage.add(layer);
    
    }
    //set started flag to false
    tool.started = false;
	drawFBDElement('none');
  }  
};

tool.init = function() {//alert(eleType);
  if(eleType != 'none'){
  $('#canvasArea .kineticjs-content').on('mousedown', tool.line_mousedown);
  $('#canvasArea .kineticjs-content').on('mousemove', tool.line_mousemove);
  $('#canvasArea .kineticjs-content').on('mouseup', tool.line_mouseup);
  }else{//alert('fff');
    $('#canvasArea .kineticjs-content').off('mousedown', tool.line_mousedown);
  $('#canvasArea .kineticjs-content').off('mousemove', tool.line_mousemove);
  $('#canvasArea .kineticjs-content').off('mouseup', tool.line_mouseup);
  }

}

//get mouse position relative to canvas element used inside mouse events
var getRelativePointerPosition = function() {
    var pointer = stage.getPointerPosition();
    if (pointer === undefined) return undefined;
    var pos = stage.getPosition();
    var offset = stage.getOffset();
    var scale = stage.getScale();
    return {
        x: ((pointer.x / scale.x) - (pos.x / scale.x) + offset.x),
        y: ((pointer.y / scale.y) - (pos.y / scale.y) + offset.y)
    };
};

function addTextToCanvas(){
  drawFBDElement('none');
  // EditableText parameters
      // **IMPORTANT** focusedText variable must be accessible to kinetic.editable.js
      // for Ctrl+Enter to work (unfocus). Ensure its a global variable.
      // TODO remove this requirement.
      var focusedText,
                focusRectW = 100,
                focusRectH = 30,
                canvas = stage.getContent().firstChild;
                cancelTextMouseUp = false;
                

      // cursor style
      $(document).on('mouseover', 'canvas', function() {//alert('ss1');
        document.body.style.cursor = 'text';
      });

      $(document).on('mouseout', 'canvas', function() {//alert('ss2');
        document.body.style.cursor = 'default';
      });

      // when clicked outside canvas
      $(document).on('mousedown', function(e) {//alert('ss3');
        if (focusedText != undefined) {
          focusedText.unfocus(e);
          focusedText = undefined;
        }
      });

            // when clicked inside canvas
            $(document).on('mousedown', 'canvas', function(e) {//alert('ss4');
                // if focusedText exists, two possibilities:
                // Either just clicked on an existing text, or
                // Clicked outside a focused text.
                if (focusedText != undefined) {
                    // check if you just clicked a text and dont re-create a new text (cancelTextMouseUp)
                    // also do not unfocus.
                    if (focusedText.checkClick()) {
                        focusedText.findCursorPosFromClick(true);
                        cancelTextMouseUp = true;
                    }
                    else {
                        cancelTextMouseUp = false;
                        focusedText.unfocus(e);
                    }
                }

                return false;
            });

      // Mouse up handler. Only inside canvas.
      $(document).on('mouseup' , 'canvas', function(e) {//alert('ss5');
        // return if you just clicked on existing text.
        if (cancelTextMouseUp) return;

        // nullify focusedText and do nothing, when just unfocused.
        // If this doesn't exist, every click will create a new TextBox.
        if (focusedText != undefined)
                    focusedText = undefined;
                else {
                    // Create new EditableText (defaults are in kinetic.editable.js)
                    var newText = new Kinetic.EditableText({
                        // find click position.
                        x: e.pageX + getFullOffset().left + 5,
                        y: e.pageY + getFullOffset().top - 5,

                        fontFamily: 'Courier',
                        fill: '#000000',

                        // pasteModal id to support ctrl+v paste.
                        pasteModal: "pasteModalArea"
                    });

                    layer.add(newText);

                    newText.focus();

                    focusedText = newText;

                    layer.draw();

                    newText.on('change', function() {
                        //alert('test')
                    });

                    // click listener for created text.
                    newText.on("click", function(evt) {//alert('ss6');
                        evt.cancelBubble = true;
                        this.focus();
                        self.focusedText = this;
                        return false
                    })
                }
      });
}
// helper function for mouse click position.
      function getFullOffset() {
                var container = $("#canvasArea");

                return {
                    left: container.scrollLeft() - container.offset().left,
                    top: container.scrollTop() - container.offset().top
                }
            }

            function saveCanvas(){
				var forceJsonStr ='';
				var h =0;
			$('#design_mode .forces').each(function(){//alert($(this).html());
			var dirname = $(this).prop('id').replace('Force','');
			//alert('#'+dirname+'TextSub');
			//alert($('#'+dirname+'TextSub').html());
			
				forceJsonStr +=$(this).prop('id')+':';
				if(!$(this).hasClass('noDisplay')){
					forceJsonStr +=$('#design_mode #'+dirname+'TextSub').text()+'==++=='+$('#design_mode #'+dirname+'Force').css('transform');
				}
				if(h<$('#design_mode .forces').length-1){
					forceJsonStr +='===';
				}
				
				h++;
			});
			if($('#optionTypeTop').val()!=''){
        var json = stageDrawDesign.toJSON();
      }else{
        var json = stage.toJSON();
      }
			
			
              $('#optionTypeInput').val(json); 
			  $('#optionTypeInputForces').val(forceJsonStr);  
			  $('#optionTypeTop').val($('#design_mode #dropDot').css('top'));
			  $('#optionTypeLeft').val($('#design_mode #dropDot').css('left'));
        var getStateTool1 = $('#cndOut').val().split('++==++');
        $('#cndOut').val(getStateTool1[0]+'++==++'+json+'++==++'+forceJsonStr+'++==++'+$('#design_mode #dropDot').css('top')+'++==++'+$('#design_mode #dropDot').css('left'));
        /*var getStateTool2 = $('#cndIn').val().split('++==++');
          $('#cndIn').val(getStateTool2[0]+'++==++'+json+'++==++'+forceJsonStr+'++==++'+$('#design_mode #dropDot').css('top')+'++==++'+$('#design_mode #dropDot').css('left'));*/
            }
			function saveCanvasStudent(){
				var forceJsonStr ='';
				var h =0;
			$('#test_mode .forces').each(function(){//alert($(this).html());
			var dirname = $(this).prop('id').replace('Force','');
			//alert('#'+dirname+'TextSub');
			//alert($('#'+dirname+'TextSub').html());
			
				forceJsonStr +=$(this).prop('id')+':';
				if(!$(this).hasClass('noDisplay')){
					forceJsonStr +=$('#test_mode #'+dirname+'TextSub').text()+'==++=='+$('#test_mode #'+dirname+'Force').css('transform');
				}
				if(h<$('#test_mode .forces').length-1){
					forceJsonStr +='===';
				}
				
				h++;
			});
			
			 $('#optionTypeInputForcesOut').val(forceJsonStr);
       var getStateTool2 = $('#cndOut').val().split('++==++'); 
       $('#cndOut').val(getStateTool2[0]+'++==++'+getStateTool2[1]+'++==++'+getStateTool2[2]+'++==++'+getStateTool2[3]+'++==++'+getStateTool2[4]+'++==++'+forceJsonStr);
			}

            function changeMode(txt){//alert('sss');
              //$('.questionDetails').hide();
              //$('#'+$('#selectMode').val()+'_mode').show();
              //$('#mode').html($("#selectMode option:selected").text());
              $('.container').attr('id',EZ.mode);
              var jsonVal = $('#optionTypeInput').val();
              //alert('dddddddddddd'+jsonVal);
              switch(EZ.mode){
                case 'design':
				addForce('design_mode');
       stageDrawDesign = Kinetic.Node.create(jsonVal, 'canvasArea');
                  stageDrawDesign.draw();
                  stage = stageDrawDesign;
                   displayArrow('design_mode', $('#optionTypeInputForces').val());
				$('#'+txt+'_mode #dropDot').css('top',$('#optionTypeTop').val());
				$('#'+txt+'_mode #dropDot').css('left',$('#optionTypeLeft').val());
                break;
                case 'test':
				addForce('test_mode');
                var stageDraw = Kinetic.Node.create(jsonVal, 'canvasAreaLoad');
                  stageDraw.draw();
				  $('#'+txt+'_mode #dropDot').css('top',parseInt($('#optionTypeTop').val())+152+'px');
				  $('#'+txt+'_mode #dropDot').css('left',parseInt($('#optionTypeLeft').val())-234+'px');
          //$('#design_mode').hide();
          //$('#test_mode').show();
                break;
				case 'preview':
                displayArrow('preview_mode', $('#optionTypeInputForces').val());
				var stageDrawPreview = Kinetic.Node.create(jsonVal, 'canvasAreaLoadPreview');
                  stageDrawPreview.draw();
				  $('#'+txt+'_mode #dropDot').css('top',parseInt($('#optionTypeTop').val())+152+'px');
				  $('#'+txt+'_mode #dropDot').css('left',parseInt($('#optionTypeLeft').val())-234+'px');
                break;
				case 'sample':
                displayArrow('sample_mode', $('#optionTypeInputForcesOut').val());
				checkAnswer('sample_mode');
				var stageDrawSample = Kinetic.Node.create(jsonVal, 'canvasAreaLoadSample');
                  stageDrawSample.draw();
				  $('#'+txt+'_mode #dropDot').css('top',parseInt($('#optionTypeTop').val())+152+'px');
				  $('#'+txt+'_mode #dropDot').css('left',parseInt($('#optionTypeLeft').val())-234+'px');
                break;
				case 'review':
        //alert(jsonVal);
                displayArrow('review_mode', $('#optionTypeInputForcesOut').val());
				checkAnswer('review_mode');
				var stageDrawReview = Kinetic.Node.create(jsonVal, 'canvasAreaLoadReview');
                  stageDrawReview.draw();
				  $('#'+txt+'_mode #dropDot').css('top',parseInt($('#optionTypeTop').val())+152+'px');
				  $('#'+txt+'_mode #dropDot').css('left',parseInt($('#optionTypeLeft').val())-234+'px');
                break;
              }
            }
			 $.fn.getOption = function(arg,txt){
				
 $(this).text(arg);
 $('#optionTypeInputDir').val(arg);
 $('#'+txt+' .questionToolsRights').fadeIn();
 return this;
};
$.fn.getForce = function(arg,arg1,txt){
 if(arg == 'none'){
  $('#'+txt+' #'+arg1+'Force').fadeOut() 
 }else{
  $('#'+txt+' #'+arg1+'TextSub').text(arg);
  $(this).removeClass('noDisplay ').css("transform","rotate("+$('#'+txt+' #rotateId').val()+"deg)");
 }
 return this;
};
function addForce(txt){
$('#'+txt+' .questionToolsOption').click(function(){
 $('#'+txt+' #optionType').getOption($(this).data('option'),txt);
});
$('#'+txt+' .questionToolsForce').click(function(){
	$('#'+txt+' .fdb_box_centerpoint').show();
 var opttype = $('#optionTypeInputDir').val().toLowerCase();
 $('#'+txt+' #'+opttype+'Force').getForce($(this).data('sub'),opttype,txt);
});
}
function displayArrow(txt, txt1){
	var txtC = txt1.split('===');
	for(var k=0;k<txtC.length;k++){
		var txtCSplit1 = txtC[k].split('==++==');
		var txtCSplit = txtCSplit1[0].split(':');
		if(txtCSplit[1]!=''){
			$('#'+txt+' #'+txtCSplit[0]).removeClass('noDisplay').css('transform',txtCSplit1[1]);
			var dirnameP = txtCSplit[0].replace('Force','');
			$('#'+txt+' #'+dirnameP+'TextSub').text(txtCSplit[1]);
		}
	}
}

function checkAnswer(txt){
	var inVal = $('#optionTypeInputForces').val();
	var outVal = $('#optionTypeInputForcesOut').val();
	var getCutIn = inVal.split('===');
	var getCutOut = outVal.split('===');
	for(var m=0;m<getCutIn.length;m++){
		var inValsp = getCutIn[m].split(':');
		var outValsp = getCutOut[m].split(':');
		if(inValsp[1] == outValsp[1]){
			$('#'+txt+' #'+inValsp[0]+' .rightAnswer').removeClass('noDisplay');
			$('#'+txt+' #'+inValsp[0]+' .wrongAnswer').addClass('noDisplay');
		}else{
			$('#'+txt+' #'+inValsp[0]+' .wrongAnswer').removeClass('noDisplay');
			$('#'+txt+' #'+inValsp[0]+' .rightAnswer').addClass('noDisplay');
		}
		//alert('out'+outValsp[1]);alert(txt);alert('in'+inValsp[1]);
		if(outValsp[1]=='' && txt=='review_mode' && inValsp[1]!=''){
			//alert(inValsp[0]);
			$('#'+txt+' #'+inValsp[0]).removeClass('noDisplay');
			$('#'+txt+' #'+inValsp[0]+' .wrongAnswer').removeClass('noDisplay');
			$('#'+txt+' #'+inValsp[0]+' .rightAnswer').addClass('noDisplay');
		}
	}
	
}
$(function() {
    $("#design_mode #dropDot").draggable({ revert: "invalid" });
	$( "#design_mode #canvasArea" ).droppable();
	$('#test_mode .fdb_box_centerpoint').hide();
	  layer.on('click', function(evt) {//alert('kkk');
    // get the shape that was clicked on
    var shape = evt.target;
	if($('#eventObject').val() == 'erase'){
		shape.remove();
	}else if($('#eventObject').val() == 'rotateclock'){
		shape.rotate(5);
	}else if($('#eventObject').val() == 'rotateanticlock'){
		shape.rotate(-5);
	}else{
		
	}
	layer.draw();
    //alert('you clicked on \"' + shape.getName() + '\"');
  	});
   /* $('#retrive_btn',parent.document).click(function(){
            $('#Q_1111_out', parent.document).val($('#cndOut').val());  
          });*/
  });
  //style="transform: rotate(10deg);"