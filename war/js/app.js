// app.js
// Main UI for the blocks editor
//
// Copyright (c) 2010 Evelyn Eastmond <evelyn@media.mit.edu>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var speed = 200;
var startDrag = false;
var draggingStack;
var draggingOffsetX;
var draggingOffsetY;
var feedbackBar = $('<div class="feedback"></div>');
var mousex;
var mousey;
var mousedown = false;

///////////////
// INIT
///////////////

function appInit() {
	initSelector();
	initPalette();
	initStage();
	initControls();
	initPane();
	initLoadingPane();
	preloadIcons();
}

function initPane(){
	$('#pane').hide();
	//$('#pane').jScrollPane();
}

function initLoadingPane(){
	$('#loadingpane').hide();
	$('#loadingpane').append('<img id="loadingicon" src="images/Loading.gif">');
}

function initSelector(){
	for(var i=0; i < specs.length; i++){
		//var selectoritem = $('<img class="selectoritem" src="images/'+specs[i][0]+'_small.png">');
		var selectoritem = $('<div class="selectoritem">');
		selectoritem.css('background-color', specs[i][1]);
		selectoritem.css('top', i*30 + 8 +'px');
		selectoritem.css('left', 6 + 'px');
		selectoritem.attr('id', i);
		selectoritem.attr('onSelectStart','return false');
		
		// MOUSE DOWN
		selectoritem.mousedown(function(event) {
			if($('#palette').is(":visible") && ($(this)[0].selected == true)){
				$('#palette').hide("slide", { direction: "left" }, speed);
			}else{
				$('#palette').show("slide", { direction: "left" }, speed);
			}
			$('.selectoritem').each(function(i) {
				$(this).css('background-color', '#6C6C6C');
				$(this)[0].selected = false;
			});
			$(this).css('background-color', '#BBBBBB');
			$(this)[0].selected = true;
			//$(this).css('border', '1px solid #EEE');
  			showBlocks(event.target.id);
		});
		
		// TOUCH DOWN
		selectoritem[0].addEventListener("touchstart", touchHandler, true);
		
		// MOUSE HOVER
		selectoritem.hover(
			function(event) {
				$(this).css('background-color', '#BBBBBB');
			},
			function(event) {
				if(!$(this)[0].selected){
					$(this).css('background-color', '#6C6C6C');
				}
			}
		);
		
		$('#selector').append(selectoritem);
		$('#selector').attr('onSelectStart','return false');
	}
}

function initPalette(){
	$('#palette').hide();
	$('#palette').attr('onSelectStart','return false');
	$('#palette').mouseleave(function(event) {
    	$('#palette').hide("slide", { direction: "left" }, speed);
	});
}

function initControls(){
	var playButton = $('<div class="control" id="playControl" onClick="play();" onSelectStart="return false;"><img id="playButton" src="images/playGray.png"></div>');
	playButton.css('left', '8px');
	playButton.hover(
	  function () {
	  	if(stacktoloop == undefined){
	    	$('#playButton').attr('src', 'images/playOver.png');
	    }
	  }, 
	  function () {
	  	if(stacktoloop == undefined){
	   		$('#playButton').attr('src', 'images/playGray.png');
	   	}
	  }
	);


	var stopButton = $('<div class="control" id="stopControl" onClick="stop();" onSelectstart="return false;"><img id="stopButton" src="images/stopGray.png"></div>');
	stopButton.css('left', '42px');
	stopButton.css('padding-top', '7px');
	stopButton.css('padding-bottom', '3px');
	stopButton.hover(
	  function () {
	    $('#stopButton').attr('src', 'images/stop.png');
	  }, 
	  function () {
	    $('#stopButton').attr('src', 'images/stopGray.png');
	  }
	);
	
	
	var uiButton = $('<div class="control" id="pencil" onClick="toggleUI();" onSelectStart="return false;"><img src="images/pencil.png"></div>');
	uiButton.css('left', '76px');
	uiButton.css('padding-top', '7px');
	uiButton.css('padding-bottom', '3px');
	$('#canvascontrols').append(playButton);
	$('#canvascontrols').append(stopButton);
	$('#canvascontrols').append(uiButton);
	$('#canvascontrols').attr('onSelectStart','return false');

}

function preloadIcons(){
	var iconsArray = [];
	for(i in icons){
		iconsArray[i] = icons[i][1];
	}
	preload(iconsArray);
}

///////////////////////
// PROJECT SAVE/LOAD
///////////////////////

function loadProject(str){
	$('#loadingpane').show();
	$('#pane').children('.stack').each(function(i){
		$(this).remove();
	});
	//$('#pane').show("slide", { direction: "right" }, speed);
	$.getJSON('http://designblocks2.appspot.com/projectxml?id='+str+'&type=jsonp&callback=?', function(data){
		var stacks = data[0];
		$.each(stacks.childNodes, function(s,stack){
			$('#pane').append(readJSONStack(stack, 'stack'));
		});
		$('.stack').each(function(i){layoutStack($(this))});
		$('#loadingpane').hide();
		play();
	});
}

function readJSONStack(stack, type){
	// STACK
	var newStack;
	if(type=='stack'){
		newStack = $('<div class="stack"></div>');
		newStack.css('left', Math.max((stack.x - 150), 40) + 'px');
		newStack.css('top', stack.y + 'px');
		newStack.css('z-index', 0);
		
		// MOUSE DOWN WITH TOUCH
		newStack.mousedown(function(event) {
			stackMouseDown(event);
		});
		newStack[0].addEventListener("touchstart", touchHandler, true);
		
		// MOUSE UP WITH TOUCH
		newStack.mouseup(function(event) {
			stackMouseUp(event);
		});
		newStack[0].addEventListener("touchend", touchHandler, true);
		
		// MOUSE MOVE WITH TOUCH
		newStack.mousemove(function(event) {
			stackMouseMove(event);
		});
		newStack[0].addEventListener("touchmove", touchHandler, true);
	}else{
		newStack = $('<div class="substack"></div>');
	}
	
	// CHILDREN
	$.each(stack.childNodes, function(b,block){
		// BLOCK
		newStack.append(readJSONBlock(block));
	});
	
	return newStack;
}

function readJSONBlock(block){
	// BLOCK
	var specToUse;
	var varProcName;
	if(block.spec != undefined){
		specToUse = block.spec;
	}
	if(block.procDefSpec != undefined){
		specToUse = 'custom block def';
		varProcName = block.procDefSpec;
	}
	if(block.procCallSpec != undefined){
		specToUse = 'custom block';
		varProcName = block.procCallSpec;
	}
	if(block.varName != undefined){
		specToUse = '%v';
		varProcName = block.varName;
	}
	if((block.spec == 'change %v by %n') || (block.spec == 'set %v to %n')){
		varProcName = block.childNodes[0].val;
	}
	
	var newBlock = blockFromSpec(specToUse, varProcName);
	
	// REPLACE ALL THE ARGS
	if(block.childNodes != undefined){
		$.each(block.childNodes, function(a,arg){
		
			//BLOCKARG
			if(arg.tagName == 'blockarg'){
				var oldArg = $(newBlock.children('.arg, .block')[a]);
				var newArg = $('<input class="arg" value="'+arg.val+'" />');
				newArg[0].type = 'text';
				newArg[0].fcn = window['prim_number'];
				newArg.insertBefore(oldArg);
				oldArg.remove();
				newArg.keydown(function() {
					layoutArg($(this));
					layoutStack($(this).parents('.stack'));
				});
			}
			
			//BLOCK
			if(arg.tagName == 'block'){
				var oldArg = $(newBlock.children('.arg, .block')[a]);
				var subBlock = readJSONBlock(arg);
				subBlock.insertBefore(oldArg);
				oldArg.remove();
			}
	
			//SUBSTACK
			if(arg.tagName == 'stack'){
				newBlock.append(readJSONStack(arg, 'substack'));
			}
		});
	}
	
	return newBlock;
}

function saveBlocksToServer() {
	getFlashMovie("DesignBlocksFlex").saveBlocksFromJavaScript();
}

function downloadPNG() {
	getFlashMovie("DesignBlocksFlex").downloadPNG();
}

///////////////
// CATEGORIES
///////////////

function showBlocks(category){
	$('#palette').empty();
	var curY = 5;
	for(var i=2; i < specs[category].length; i++){
		var spec = specs[category][i];
		// MAKE BLOCK
		var block = makeCompositeBlock(spec[2], spec[0], spec[1], specs[category][1]);
		
		// MOUSE DOWN WITH TOUCH
		block.mousedown(function(event) {
			draggingOffsetX = event.pageX - $(event.target).parent().offset().left;
			draggingOffsetY = event.pageY - $(event.target).parent().offset().top;
			makeBlockAndDrag(event.pageX, event.pageY, category, $(event.target).parent('.block'));
		});
		block[0].addEventListener("touchstart", touchHandler, true);
		
		//MOUSE MOVE WITH TOUCH
		block.mousemove(function(event) {
			appMouseMove(event);
		});
		block[0].addEventListener("touchmove", touchHandler, true);
		
		$('#palette').append(block);
		layoutBlock(block);
		// POSITION
		block.css('top', curY + 'px');
		block.css('left', 5 + 'px');
		curY += (block[0].clientHeight + 2);
		//curY += (block.height() + 2);
		$('#palette').css('z-index', 1);
		block.css('z-index', 2);
		
	}
}

function makeBlockAndDrag(mousex, mousey, category, block){
	// MAKE STACK
	var stack = $('<div class="stack"></div>');
	stack.css('left', mousex - $('#pane').offset().left - draggingOffsetX + 'px');
	stack.css('top', mousey - $('#pane').offset().top - draggingOffsetY + 'px');
	stack.css('z-index', 2);
	draggingStack = stack;
	$('#pane').append(stack);
	
	// MAKE BLOCK
	var block = makeCompositeBlock(block[0].prim, block[0].spec, block[0].type, block[0].color);
	block.css('left', 0);
	block.css('top', 0);
	stack.append(block);
	layoutBlock(block);
	stack.css('width', block.css('width'));
	stack.css('height', block.css('height'));
	
	// MOUSE DOWN WITH TOUCH
	stack.mousedown(function(event) {
		stackMouseDown(event);
	});
	stack[0].addEventListener("touchstart", touchHandler, true);
	
	// MOUSE UP WITH TOUCH
	stack.mouseup(function(event) {
		stackMouseUp(event);
	});
	stack[0].addEventListener("touchend", touchHandler, true);
	
	// MOUSE MOVE WITH TOUCH
	stack.mousemove(function(event) {
		stackMouseMove(event);
	});
	stack[0].addEventListener("touchmove", touchHandler, true);
}

//////////////////
// STACKS
//////////////////

function findSetupStacks(){
	var setupStacks = [];
	var j = 0;
	$('.block').each(function(i) {
		if((this.spec == '@playIcon') && ($(this).parent().hasClass('stack'))){
			setupStacks[j] = $(this).parent('.stack');
			j++;
		}
	});
	return setupStacks;
}

function findPlayStacks(){
	var playStacks = [];
	var j = 0;
	$('.block').each(function(i) {
		if((this.spec == '@playIconLoop') && ($(this).parent().hasClass('stack'))){
			playStacks[j] = $(this).parent('.stack');
			j++;
		}
	});
	return playStacks;
}

function findProcStacks(){
	var procStacks = [];
	var j = 0;
	$('.block').each(function(i) {
		if((this.prim == 'prim_proceduredef') && ($(this).parent().hasClass('stack'))){
			procStacks[j] = $(this).parent('.stack');
			j++;
		}
	});
	return procStacks;
}

function layoutStack(stack){
	var curY = 0;
	var totalHeight = 0;
	var totalWidth = 0;
	stack.children('.block').each(function(i) {
		layoutBlock($(this));
		$(this).css('left', 0);
		$(this).css('top', curY);
		curY += $(this)[0].clientHeight - 3;
		//curY += $(this).height() - 3;
		totalHeight += $(this)[0].clientHeight - 3;
		//totalHeight += $(this).height() - 3;
		if($(this)[0].clientWidth > totalWidth){
			totalWidth = $(this)[0].clientWidth;
		}
	});
	stack.css('height', totalHeight);
	stack.css('width', totalWidth);
}

/////////////////
// UI TESTS
/////////////////

function toggleUI() {
	stop();
	if($('#pane').is(':visible')){
		$('#pane').hide("slide", { direction: "right" }, speed);
		$('#pencil').css('background-color', '#444');
	}else{
		$('#pane').css('z-index', '50');
		$('#pane').show("slide", { direction: "right" }, speed);
		$('.stack').each(function(i){layoutStack($(this))});
		$('#pencil').css('background-color', '#EEE');
	}
}

/////////////////
// MOUSE EVENTS
/////////////////

function appMouseMove(event) {
	event.preventDefault();
	mousex = event.clientX;
	mousey = event.clientY;
	if (draggingStack != undefined) {
		draggingStack.css('left', mousex - $('#pane').offset().left - draggingOffsetX + 'px');
		draggingStack.css('top', mousey - $('#pane').offset().top - draggingOffsetY + 'px');
		if((draggingStack.children()[0].type != 'r') && 
		   (draggingStack.children()[0].type != 'h')&& 
		   (draggingStack.children()[0].type != 'b')){
			var cbArray = closeBlock(draggingStack.offset().left, draggingStack.offset().top);
			if(cbArray !== null){
				var cb = cbArray[0];
				var cbBottom = cbArray[1];
				// SHOW INSERT FEEDBACK
				feedbackBar.css('left', cbArray[2]);
				feedbackBar.css('top', cbArray[1] - parseInt($('#pane').offset().top));
				feedbackBar.css('width', cb.css('width'));
				$('#pane').append(feedbackBar);
			}else{
				// REMOVE INSERT FEEDBACK
				feedbackBar.remove();
			}
		}
		// SHOW ARG FEEDBACK
		if((draggingStack.children()[0].type == 'r') || (draggingStack.children()[0].type == 'b')){
			var ca = closeArg(draggingStack.children()[0], draggingStack.offset().left, draggingStack.offset().top);
		}
	}
}

function appMouseDown(event){
	mousedown = true;
}

function appMouseUp(event){
	mousedown = false;
}

function stackMouseMove(event){
	// IGNORE TYPE IN FIELD
	if($(event.target).hasClass('arg') && ($(event.target)[0].tagName == 'INPUT')){
		return;
	}
	
	// SET STACK OR PASS TO APP MOUSE MOVE
	if((draggingStack == undefined) && startDrag){
		startDrag = false;
		var clickedBlock = $(event.target).parents('.block:first"');
		draggingOffsetX = event.pageX - clickedBlock.offset().left;
		draggingOffsetY = event.pageY - clickedBlock.offset().top;
		if((clickedBlock.prev().length == 0) && (!clickedBlock.parent().hasClass('substack'))){
			// TOP BLOCK CLICKED
			draggingStack = clickedBlock.parent();
			draggingStack.css('z-index', 2);
		}else{
			var oldStack = clickedBlock.parents('.stack');
			var newStack = $('<div class="stack"></div>');
			var oldSubStack = clickedBlock.parent('.substack');
			newStack.css('left', mousex - $('#pane').offset().left - draggingOffsetX + 'px');
			newStack.css('top', mousey - $('#pane').offset().top - draggingOffsetY + 'px');
			newStack.css('height', 24);
			newStack.css('z-index', 2);
			draggingStack = newStack;
			$('#pane').append(newStack);
			if(clickedBlock[0].type == 'r'){
				// ARGUMENT
				var arg = $('<input class="arg" value="10" />');
				arg[0].type = 'text';
				arg[0].fcn = window['prim_number'];
				arg.insertAfter(clickedBlock);
				newStack.append(clickedBlock);
			}else if(clickedBlock[0].type == 'b'){
				// ARGUMENT
				arg = $('<div class="arg"><canvas class="boolean" /></div>');
				arg.css('z-index', 1);
				arg[0].type = 'text';
				arg[0].fcn = window['prim_boolean'];
				arg.insertAfter(clickedBlock);
				newStack.append(clickedBlock);
			} else {
				// BLOCK
				clickedBlock.nextAll().each(function(i) {
					newStack.append($(this));
				});
				if(newStack.children().length > 0){
					//clickedBlock.insertBefore(newStack.children()[0]);
					newStack.prepend(clickedBlock);
				}else{
					newStack.append(clickedBlock);
				}
			}
			if(oldSubStack.length > 0){
				if(oldSubStack.children().length == 0){
					oldSubStack.remove();
				}
			}
			newStack.css('width', clickedBlock.css('width'));
			layoutStack(oldStack);
			layoutStack(newStack);
			
			// MOUSE DOWN WITH TOUCH
			newStack.mousedown(function(event) {
				stackMouseDown(event);
			});
			newStack[0].addEventListener("touchstart", touchHandler, true);
			
			// MOUSE UP WITH TOUCH
			newStack.mouseup(function(event) {
				stackMouseUp(event);
			});
			newStack[0].addEventListener("touchend", touchHandler, true);
			
			// MOUSE MOVE WITH TOUCH
			newStack.mousemove(function(event) {
				stackMouseMove(event);
			});
			newStack[0].addEventListener("touchmove", touchHandler, true);
		
		}
	}else{
		appMouseMove(event);
	}
}

function stackMouseDown(event){
	if($(event.target).attr('class') != 'arg'){
		startDrag = true;
	}
}

function stackMouseUp(event){
	startDrag = false;
	// RUN STACK
	if((draggingStack == undefined) && ($(event.target).attr('class') != 'arg')){
		runStack( $(event.target).parents('.stack'));
	}
	
	// DROP STACK
	draggingStack = undefined;
	if(feedbackBar.parent().length > 0){
		feedbackBar.remove();
	}
	var paneRight = $('#pane').offset().left + $('#pane').width();
	var paneLeft = $('#pane').offset().left;
	var paneTop = $('#pane').offset().top;
	var paneBottom = $('#pane').offset().top + parseInt($('#pane').css('height'));
	var droppedStack = $(event.target).parents('.stack');
	if(
	(event.pageX > paneRight) || 
	(event.pageX < paneLeft) || 
	(event.pageY > paneBottom) ||
	(event.pageY < paneTop)){
		// DELETE BLOCK
		droppedStack.remove();
	}else{
		droppedStack.css('z-index', 0);
		if((droppedStack.children()[0].type != 'r') && 
		   (droppedStack.children()[0].type != 'h') && 
		   (droppedStack.children()[0].type != 'b')){
			var cbArray = closeBlock(droppedStack.offset().left, droppedStack.offset().top);
			if(cbArray !== null){
				var cb = cbArray[0];
				if(cbArray[1] < (cb.offset().top + parseInt(cb.css('height')) - 2)){
					// INSERT INTO C SHAPED BLOCK
					var substack;
					if(cb.children('.substack').length > 0){
						substack = $(cb.children('.substack')[0]);
						substack.prepend(droppedStack.children());
					}else{
						substack = $('<div class="substack"></div>');
						substack.append(droppedStack.children());
						cb.append(substack);
					}
				}else{
					// INSERT STACK TO NEARBY BLOCK
					cb.after(droppedStack.children());
				}
				droppedStack.remove();
				layoutStack(cb.parents('.stack'));
			}
		}
		if((droppedStack.children().length > 0) && ((droppedStack.children()[0].type == 'r') || (droppedStack.children()[0].type == 'b'))){
			var ca = closeArg(droppedStack.children()[0],droppedStack.offset().left, droppedStack.offset().top);
			if(ca !== null){
				ca.after(droppedStack.children());
				droppedStack.remove();
				var b = ca.parents('.stack');
				ca.remove();
				layoutStack(b);
			}
		}
	}
}

function closeBlock(x,y){
	var rb = null;
	$('.block').each(function(i) {
		if($(this).parents('.stack').length > 0){
	     	var bx = $(this).offset().left;
	     	var by = $(this).offset().top + parseInt($(this).css('height'));
	 		if(!((Math.abs(x - bx) == 0) && (Math.abs(y - $(this).offset().top) == 0))){
		     	if((Math.abs(x - bx) < 20) && (Math.abs(y - by) < 20)){
		     		var left = parseInt($(this).parents('.stack').css('left'));
		     		$(this).parents('.substack').each(function(i) {
		     			left += 12;
		     		});
		     		rb = [$(this),
		     			$(this).offset().top + parseInt($(this).css('height')) - 2,
		     			left];
		     	}
		    }
		    // check 'if' block attachment
		    if(this.type == 'c'){
		    	by = $(this).offset().top + parseInt(this.topHeight) + 5;
	 			if(!((Math.abs(x - bx) == 0) && (Math.abs(y - $(this).offset().top) == 0))){
		     		if((Math.abs(x - bx) < 20) && (Math.abs(y - by) < 20)){
		     			var left = parseInt($(this).parents('.stack').css('left')) + 12;
		     			$(this).parents('.substack').each(function(i) {
		     				left += 12;
		     			});
		     			rb = [$(this),
		     				$(this).offset().top + parseInt(this.topHeight) + 5,
		     				left];
		     		}
		    	}
		    }
	    }
     });
     if(rb == null){
     	$('.hatblock').each(function(i) {
		if($(this).parent().hasClass('stack')){
	     	var bx = parseInt($(this).offset().left);
	     	var by = $(this).offset().top + parseInt($(this).css('height'));
	 		if(!((Math.abs(x - bx) == 0) && (Math.abs(y - $(this).offset().top) == 0))){
		     	if((Math.abs(x - bx) < 20) && (Math.abs(y - by) < 20)){
		     		rb = [$(this),
						$(this).offset().top + parseInt($(this).css('height')) - 2,
		     			parseInt($(this).parent().css('left'))];
		     	}
		    }
	    }
     });
     }
     if(rb != null){
     	if((rb[0][0].type == 'r') || (rb[0][0].type == 'b')){
     		rb = null;
     	}
     }
     return rb;
}

function closeArg(b,x,y){
	var ra = null;
	$('.arg').each(function(i) {
		if($(this)[0].tagName == 'INPUT'){
			// NUM/TEXT ARG
	     	var bx = parseInt($(this).offset().left);
	     	var by = parseInt($(this).offset().top) + parseInt($(this).css('height'));
		    $(this).css('border-left', '2px solid #888');
		    $(this).css('border-top', '2px solid #888');
		    $(this).css('border-right', '2px solid #CECECE');
		    $(this).css('border-bottom', '2px solid #CECECE');
	 		if(!((Math.abs(x - bx) == 0) && (Math.abs(y - (by - 25)) == 0))){
		     	if((Math.abs(x - bx) < 15) && (Math.abs(y - by) < 15)){
		     		if($(this).parents('.stack').length != 0){
		     			if(($(this).parent()[0] != b) && (ra == null) && (b.type == 'r')){
		     				ra = $(this);
		     				ra.css('border', '2px solid #0F0');
		     				//break;
		     			}
		     		}
		     	}
		    }
		}else{
		   	// BOOLEAN ARG
		   	var bx = parseInt($(this).offset().left);
	     	var by = parseInt($(this).offset().top) + parseInt($(this).css('height'));
		    $(this).css('border', '0px');
		    $(this).css('padding', '2px');
	 		if(!((Math.abs(x - bx) == 0) && (Math.abs(y - (by - 25)) == 0))){
		     	if((Math.abs(x - bx) < 15) && (Math.abs(y - by) < 15)){
		     		if($(this).parents('.stack').length != 0){
		     			if(($(this).parent()[0] != b) && (ra == null) && (b.type == 'b')){
		     				ra = $(this);
		     				ra.css('border', '2px solid #0F0');
		    				ra.css('padding', '0px');
		     				//break;
		     			}
		     		}
		     	}
		    }
		}
     });
     return ra;
}

/////////////////
// TOUCH HANDLER
/////////////////

/* This script was written by Ross Boucher and found at:
http://rossboucher.com/2008/08/19/iphone-touch-events-in-javascript/
*/
function touchHandler(event){
	var touches = event.changedTouches,
        first = touches[0],
        type = "";
    
    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;        
        case "touchend":   type = "mouseup"; break;
        default: return;
    }
    
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                              first.screenX, first.screenY, 
                              first.clientX, first.clientY, false, 
                              false, false, false, 0/*left*/, null);
                                           
    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault(); // to prevent the pinching and zooming
}

////////////////
// DEBUGGING
////////////////

function debug(log_txt) {
	if (window.console != undefined) {
		console.log(log_txt);
	}
}

